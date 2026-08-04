import { NextResponse } from 'next/server';
import { extractMeetingTasks } from '../../../lib/gemini.js';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, file, meetingContext } = body || {};

    if (!text && !file) {
      return NextResponse.json({
        success: false,
        tasks: [],
        error: "请求参数不完整，请提供会议文本或上传文件。",
      }, { status: 400 });
    }

    const result = await extractMeetingTasks({ text, file, meetingContext });
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Next.js API /api/extract-tasks Error:", err);
    return NextResponse.json({
      success: false,
      tasks: [],
      error: err.message || "服务器内部错误，未能成功提取任务。",
    }, { status: 500 });
  }
}
