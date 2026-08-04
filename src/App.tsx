import React, { useState } from 'react';
import { Task } from '../types.js';
import { extractMeetingTasks } from '../../lib/gemini.js';

interface FileUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportTasks: (tasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
}

export const FileUploaderModal: React.FC<FileUploaderModalProps> = ({
  isOpen,
  onClose,
  onImportTasks,
}) => {
  const [textInput, setTextInput] = useState('');
  const [contextInput, setContextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // 将文件转为 Base64 字符串
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // 去掉 base64 前缀 (e.g. "data:application/pdf;base64,")
        const base64Data = result.split(',')[1] || '';
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // 核心 AI 分析提取函数
  const handleStartExtraction = async () => {
    if (!textInput.trim() && !selectedFile) {
      setErrorMessage('请至少输入会议纪要文本或上传相关文件/文档。');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      let filePayload: { name: string; mimeType: string; base64Data: string } | undefined = undefined;

      if (selectedFile) {
        const base64Data = await fileToBase64(selectedFile);
        filePayload = {
          name: selectedFile.name,
          mimeType: selectedFile.type || 'application/pdf',
          base64Data,
        };
      }

      // 直接调用客户端 Gemini 解析函数
      const result = await extractMeetingTasks({
        text: textInput,
        meetingContext: contextInput,
        file: filePayload,
      });

      if (result.success && result.tasks) {
        // 将提取到的任务列表导入父组件状态
        onImportTasks(result.tasks);
        // 清空重置并关闭弹窗
        setTextInput('');
        setContextInput('');
        setSelectedFile(null);
        onClose();
      } else {
        setErrorMessage(result.error || '解析失败，请检查 API Key 配置或稍后重试。');
      }
    } catch (err: any) {
      console.error('AI Extraction Error:', err);
      setErrorMessage(err.message || '发生未知错误，请重试。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 text-slate-800 transition-all border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg font-bold text-lg">✨</span>
            <h3 className="text-xl font-bold text-slate-800">AI 智能提取会议督办事项</h3>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md text-xl"
          >
            ✕
          </button>
        </div>

        {/* 错误信息展示 */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-lg flex items-center space-x-2">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* 上下文/背景补充 */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              会议背景 / 上下文补充 (选填)
            </label>
            <input
              type="text"
              placeholder="如：2026年Q3部门例会 / 供应商对接会"
              value={contextInput}
              onChange={(e) => setContextInput(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* 会议纪要文本录入 */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              粘贴会议纪要文本
            </label>
            <textarea
              rows={5}
              placeholder="直接在此粘贴会议记录、纪要全文或发言要点..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
            />
          </div>

          {/* 附件/文档上传 */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              或上传纪要文档 (PDF / Word / TXT / 图片)
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="file"
                accept=".pdf,.txt,.doc,.docx,image/*"
                onChange={handleFileChange}
                disabled={loading}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              />
              {selectedFile && (
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-xs text-rose-500 hover:underline shrink-0"
                >
                  移除文件
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer 按钮区 */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleStartExtraction}
            disabled={loading}
            className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 rounded-lg shadow-sm transition-all flex items-center space-x-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>智能分析提取中...</span>
              </>
            ) : (
              <span>开始 AI 智能提取</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
