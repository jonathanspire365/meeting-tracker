import React from 'react';
import {
  FolderOpen,
  Sparkles,
  FileSearch,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  Layers,
  Award
} from 'lucide-react';

export const BiddingAnalyzerModal: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40 mb-3">
              <Sparkles className="w-3.5 h-3.5 mr-1 animate-spin-slow text-amber-200" />
              架构扩展预留模块 (Future Module Ready)
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              招标文件智能解析、资质响应与得分点比对
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              基于 Gemini 3.6 多模态架构，自动解析百页招投标文件，精准提炼商务资质废标项、技术得分项、履约风险条目，并一键对比公司资质匹配度。
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => alert('此功能为未来升级预留模块，正在进行私有化数据集调优中！')}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 shadow-lg cursor-pointer transition-all"
            >
              预约体验测试
            </button>
          </div>
        </div>
      </div>

      {/* Feature Architecture Mockup */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
            <FileSearch className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-2">
            1. 废标条款与硬性资质强提醒
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            智能萃取招标文件中关于注册资本、安全生产许可证、三体系认证、核心人员资质等一票否决条款（星号 * 项），避免误投废标。
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-2">
            2. 技术得分点拆解与偏离度比对
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            将复杂评分表拆解为细粒度打分项，对比企业产品参数，给出正偏离/负偏离评分预估与应答策略建议。
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <FileCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-2">
            3. 投标督办与进度节点无缝流转
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            一键将招标文件中提炼出的封标、开标、保证金缴纳、现场答辩任务流转至当前的【会议遗留事项督办看板】中进行联动督办。
          </p>
        </div>
      </div>

      {/* Interactive Mock Workflow */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center">
          <Layers className="w-5 h-5 text-indigo-600 mr-2" />
          招投标智能解析示范效果预览
        </h3>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 pb-2 border-b border-slate-200">
            <span>示例文件: 《某大型国有集团2026数字化建设招标文件.pdf》</span>
            <span className="text-emerald-600 font-mono">解析状态: 已完成比对</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Qualification Item */}
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-800">【硬性资质要求】CMMI 5 级认证</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                  相符 (符合)
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                招标原文第 24 页：“投标人须具备 CMMI 5 级或同等软件能力成熟度认证。”
              </p>
            </div>

            {/* Score Item */}
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-800">【技术评分项】私有化 AI 引擎部署</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-bold">
                  应答得分: 10/10 满分
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                招标原文第 42 页：“支持国产化芯片及离线模型部署得 10 分，仅公有云得 5 分。”
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
