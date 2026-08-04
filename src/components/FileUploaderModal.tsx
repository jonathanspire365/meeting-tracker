import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  FileText,
  FileCode,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ListPlus,
  RefreshCw,
  FileUp,
  FileSpreadsheet
} from 'lucide-react';
import { Task, ExtractionResponse } from '../types.js';
import { SAMPLE_MEETING_NOTES } from '../data/sampleMeetings.js';

interface FileUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportTasks: (newTasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
}

export const FileUploaderModal: React.FC<FileUploaderModalProps> = ({
  isOpen,
  onClose,
  onImportTasks,
}) => {
  const [inputTab, setInputTab] = useState<'text' | 'file'>('text');
  const [meetingText, setMeetingText] = useState('');
  const [meetingContext, setMeetingContext] = useState('');
  const [selectedFile, setSelectedFile] = useState<{
    fileObj: File;
    name: string;
    mimeType: string;
    base64Data: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [extractionResult, setExtractionResult] = useState<ExtractionResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Selected indices for import
  const [selectedTaskIndices, setSelectedTaskIndices] = useState<number[]>([]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert('文件大小不能超过 20MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1] || result;

      setSelectedFile({
        fileObj: file,
        name: file.name,
        mimeType: file.type || 'application/octet-stream',
        base64Data,
      });
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  const handleLoadSampleText = () => {
    setMeetingText(SAMPLE_MEETING_NOTES.trim());
    setMeetingContext('集团2026年数字化转型第三次调度例会');
    setErrorMsg('');
  };

  const handleStartExtraction = async () => {
    if (inputTab === 'text' && !meetingText.trim()) {
      setErrorMsg('请先粘贴或输入会议纪要文本');
      return;
    }
    if (inputTab === 'file' && !selectedFile) {
      setErrorMsg('请先上传会议文档或图片');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setExtractionResult(null);

    try {
      const response = await fetch('/api/extract-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputTab === 'text' ? meetingText : undefined,
          file: inputTab === 'file' && selectedFile ? {
            name: selectedFile.name,
            mimeType: selectedFile.mimeType,
            base64Data: selectedFile.base64Data,
          } : undefined,
          meetingContext: meetingContext.trim() || undefined,
        }),
      });

      const data: ExtractionResponse = await response.json();

      if (data.success && data.tasks) {
        setExtractionResult(data);
        // Select all extracted tasks by default
        setSelectedTaskIndices(data.tasks.map((_, index) => index));
      } else {
        setErrorMsg(data.error || '解析失败，未提取到有效事项');
      }
    } catch (err: any) {
      console.error('Extract tasks error:', err);
      setErrorMsg(err.message || '网络连接或请求超时，请检查后端服务');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmImport = () => {
    if (!extractionResult || !extractionResult.tasks) return;

    const tasksToImport = selectedTaskIndices.map((idx) => {
      const t = extractionResult.tasks[idx];
      return {
        title: t.title,
        owner: t.owner,
        deadline: t.deadline,
        deliverable: t.deliverable,
        status: t.status,
        blockedReason: t.blockedReason || '',
        priority: t.priority || 'Medium',
        meetingSource: extractionResult.meetingTitle || meetingContext || 'AI智能提取',
      };
    });

    if (tasksToImport.length === 0) {
      alert('请至少勾选一项要导入的督办任务');
      return;
    }

    onImportTasks(tasksToImport);
    onClose();
  };

  const toggleSelectTask = (index: number) => {
    setSelectedTaskIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative my-8">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 pb-4 mb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-amber-200 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              Gemini AI 会议纪要智能解析与督办提取
            </h3>
            <p className="text-xs text-slate-500">
              粘贴会议记录或上传文件，AI 将自动识别【责任人】、【截止日期】、【交付物】及【卡点原因】
            </p>
          </div>
        </div>

        {!extractionResult ? (
          /* Extraction Input Form */
          <div className="space-y-4">
            {/* Input Method Tabs */}
            <div className="flex space-x-2 border-b border-slate-200 pb-2">
              <button
                type="button"
                onClick={() => setInputTab('text')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  inputTab === 'text'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                📝 粘贴会议文本/记录
              </button>
              <button
                type="button"
                onClick={() => setInputTab('file')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  inputTab === 'file'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                📁 上传会议文档 (PDF/Word/图片/TXT)
              </button>
            </div>

            {/* Optional Context */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                会议主题 / 归属背景 (选填)
              </label>
              <input
                type="text"
                value={meetingContext}
                onChange={(e) => setMeetingContext(e.target.value)}
                placeholder="例如：2026 Q3 数字化系统建设进度调度例会"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800"
              />
            </div>

            {inputTab === 'text' ? (
              /* Textarea */
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    会议纪要 / 对话转写文本
                  </label>
                  <button
                    type="button"
                    onClick={handleLoadSampleText}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline flex items-center cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 mr-1" />
                    填入示例会议纪要
                  </button>
                </div>
                <textarea
                  rows={8}
                  value={meetingText}
                  onChange={(e) => setMeetingText(e.target.value)}
                  placeholder="在此粘贴会议纪要、微信群消息、录音转文字文本..."
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 leading-relaxed"
                />
              </div>
            ) : (
              /* File Upload Zone */
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  选择会议相关文件 (支持 PDF, Word, TXT, PNG, JPG)
                </label>
                <div className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-8 text-center bg-slate-50/50 transition-all">
                  <Upload className="w-10 h-10 mx-auto text-indigo-500 mb-2 animate-bounce-slow" />
                  <p className="text-sm font-semibold text-slate-700 mb-1">
                    点击选择或将文件拖拽至此处
                  </p>
                  <p className="text-xs text-slate-400 mb-4">
                    支持 .pdf, .docx, .doc, .txt, .png, .jpg (单文件不大于 20MB)
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg,.md"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload-input"
                  />
                  <label
                    htmlFor="file-upload-input"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer shadow-sm transition-all"
                  >
                    <FileUp className="w-4 h-4 mr-1.5" />
                    选择文件
                  </label>

                  {selectedFile && (
                    <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between text-xs text-indigo-900 max-w-md mx-auto">
                      <div className="flex items-center space-x-2 truncate">
                        <FileCode className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="font-semibold truncate">{selectedFile.name}</span>
                      </div>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="text-indigo-500 hover:text-red-600 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error banner */}
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Start Button */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 rounded-lg cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={handleStartExtraction}
                className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg shadow-md transition-all flex items-center disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gemini AI 智能解析中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-1.5 text-amber-200" />
                    开始 AI 提取遗留事项
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Extraction Result Preview Panel */
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-emerald-800 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                  {extractionResult.meetingTitle || 'AI 成功解析出督办清单'}
                </h4>
                <p className="text-xs text-emerald-700 mt-0.5">
                  {extractionResult.summary || `共智能提取到 ${extractionResult.tasks.length} 项具体跟进任务`}
                </p>
              </div>
              <button
                onClick={() => setExtractionResult(null)}
                className="text-xs text-emerald-700 hover:text-emerald-900 underline flex items-center cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                重新解析
              </button>
            </div>

            {/* Task Preview Items Checklist */}
            <div className="max-h-[350px] overflow-y-auto space-y-2 pr-1">
              {extractionResult.tasks.map((task, idx) => {
                const isChecked = selectedTaskIndices.includes(idx);

                return (
                  <div
                    key={idx}
                    onClick={() => toggleSelectTask(idx)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
                      isChecked
                        ? 'bg-indigo-50/50 border-indigo-300 ring-1 ring-indigo-200'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSelectTask(idx)}
                      className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-800 text-xs truncate">
                          {task.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          {task.deadline} 截止
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                        <span>责任人: <strong>{task.owner}</strong></span>
                        <span>·</span>
                        <span>交付物: {task.deliverable}</span>
                        <span>·</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          task.status === 'Blocked'
                            ? 'bg-red-100 text-red-800'
                            : task.status === 'Done'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {task.status}
                        </span>
                      </div>

                      {task.blockedReason && (
                        <div className="mt-1 text-xs text-red-700 bg-red-100/60 p-1.5 rounded">
                          卡点: {task.blockedReason}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Confirm Import Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                已选中 <strong className="text-indigo-600 font-mono">{selectedTaskIndices.length}</strong> / {extractionResult.tasks.length} 项
              </span>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setExtractionResult(null)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 rounded-lg cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmImport}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-md transition-all flex items-center cursor-pointer"
                >
                  <ListPlus className="w-4 h-4 mr-1.5" />
                  一键导入至督办看板 ({selectedTaskIndices.length})
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
