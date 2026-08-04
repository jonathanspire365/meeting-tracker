import { GoogleGenAI, Type } from "@google/genai";
import { ExtractionResponse } from "../src/types.js";

// Initialize Gemini Client on Server
export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined in environment variables.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Extract structured action items from meeting notes or attached file
 */
export async function extractMeetingTasks(options: {
  text?: string;
  file?: {
    name: string;
    mimeType: string;
    base64Data: string;
  };
  meetingContext?: string;
}): Promise<ExtractionResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      tasks: [],
      error: "未配置 GEMINI_API_KEY。请在 Settings > Secrets 中注入 GEMINI_API_KEY 环境变量。"
    };
  }

  try {
    const ai = getGeminiClient();

    const parts: any[] = [];

    // Append context if provided
    if (options.meetingContext && options.meetingContext.trim()) {
      parts.push({
        text: `会议背景上下文信息: ${options.meetingContext.trim()}`
      });
    }

    // Append attached file if present
    if (options.file && options.file.base64Data) {
      parts.push({
        inlineData: {
          mimeType: options.file.mimeType || 'application/pdf',
          data: options.file.base64Data
        }
      });
      parts.push({
        text: `文件名: ${options.file.name}。请仔细解析上述文件内容，从中分析提取所有遗留督办任务。`
      });
    }

    // Append main text if provided
    if (options.text && options.text.trim()) {
      parts.push({
        text: `会议纪要文本:\n${options.text.trim()}`
      });
    }

    if (parts.length === 0) {
      return {
        success: false,
        tasks: [],
        error: "请输入会议纪要内容或上传相关文件。"
      };
    }

    const currentDateStr = new Date().toISOString().split('T')[0];

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts },
      config: {
        systemInstruction: `你是一个资深企业督办管理专家。请深入解析提供的会议纪要或文档，提取出所有明确的遗留事项、跟进任务、决策跟进项。
对于每个任务，必须严格输出以下字段：
1. title: 任务名称，清晰动宾结构，例如“完成供应商资质复审及合同盖章”
2. owner: 责任人，明确人员姓名，未知填“待指定”
3. deadline: 截止日期，规范格式 YYYY-MM-DD。请结合当前参考日期 (${currentDateStr}) 推算相对时间（如“本周五”、“下周一”），如无法归算则推算合理的未来近期日期
4. deliverable: 明确的交付物或终态成果（如“签署版合同文本”、“架构设计评审报告”）
5. status: 当前任务状态，只能是 'In Progress', 'Blocked', 或 'Done' 之一
6. blockedReason: 如果状态是 'Blocked' 或提到有困难、卡点、依赖项阻碍，请详细说明卡点原因；否则留空字符串 ''
7. priority: 任务优先级，选填 'High', 'Medium', 或 'Low'`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            meetingTitle: { type: Type.STRING, description: "会议主题或归纳标题" },
            summary: { type: Type.STRING, description: "会议纪要核心摘要与督办概览" },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "任务名称" },
                  owner: { type: Type.STRING, description: "责任人姓名" },
                  deadline: { type: Type.STRING, description: "截止日期 YYYY-MM-DD" },
                  deliverable: { type: Type.STRING, description: "交付物成果描述" },
                  status: { type: Type.STRING, description: "'In Progress' | 'Blocked' | 'Done'" },
                  blockedReason: { type: Type.STRING, description: "卡点原因" },
                  priority: { type: Type.STRING, description: "'High' | 'Medium' | 'Low'" },
                },
                required: ["title", "owner", "deadline", "deliverable", "status"],
              },
            },
          },
          required: ["meetingTitle", "tasks"],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Gemini API 未返回有效的文本内容");
    }

    const parsedJson = JSON.parse(responseText);

    const tasks = (parsedJson.tasks || []).map((t: any) => {
      let status = 'In Progress';
      if (t.status === 'Blocked' || t.status === 'Done') {
        status = t.status;
      }

      let priority = 'Medium';
      if (t.priority === 'High' || t.priority === 'Low') {
        priority = t.priority;
      }

      return {
        title: t.title || "未命名任务",
        owner: t.owner || "待指定",
        deadline: t.deadline || currentDateStr,
        deliverable: t.deliverable || "按期完成相关工作",
        status,
        blockedReason: t.blockedReason || "",
        priority,
      };
    });

    return {
      success: true,
      meetingTitle: parsedJson.meetingTitle || "会议事项督办列表",
      summary: parsedJson.summary || "智能提取完成",
      tasks,
    };
  } catch (err: any) {
    console.error("Error calling Gemini API for task extraction:", err);
    return {
      success: false,
      tasks: [],
      error: err.message || "智能解析过程中发生错误，请稍后重试。"
    };
  }
}
