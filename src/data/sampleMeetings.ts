import { Task } from '../types.js';

export const SAMPLE_TASKS: Task[] = [
  {
    id: 'task-101',
    title: '完成ERP与供应链系统的 API 接口双向联调与数据校验',
    owner: '张伟 (IT架构师)',
    deadline: '2026-08-01', // Overdue
    deliverable: '接口联调测试报告及 API 签名认证文档',
    status: 'Blocked',
    blockedReason: '第三方 WMS 系统版本升级延迟，导致库存同步接口报 502 错误，等待厂商提供补丁包。',
    priority: 'High',
    meetingSource: '2026-07-28 集团数字化转型跟进例会',
    createdAt: '2026-07-28T10:00:00.000Z',
    updatedAt: '2026-08-02T14:30:00.000Z',
  },
  {
    id: 'task-102',
    title: '输出智能客服系统二期招标采购需求规范书',
    owner: '李娜 (产品总监)',
    deadline: '2026-08-04', // Due tomorrow / soon
    deliverable: '《智能客服二期功能与性能指标要求 .docx》',
    status: 'In Progress',
    blockedReason: '',
    priority: 'High',
    meetingSource: '2026-07-30 客户服务提升专题会',
    createdAt: '2026-07-30T14:00:00.000Z',
    updatedAt: '2026-08-02T16:00:00.000Z',
  },
  {
    id: 'task-103',
    title: '完成华东数据中心主干网络双路冗余改造与压测',
    owner: '王强 (运维专家)',
    deadline: '2026-08-10',
    deliverable: '网络网络割接实施方案及网络故障演练视频记录',
    status: 'In Progress',
    blockedReason: '',
    priority: 'Medium',
    meetingSource: '2026-07-25 基础设施安全调度例会',
    createdAt: '2026-07-25T09:30:00.000Z',
    updatedAt: '2026-08-01T11:20:00.000Z',
  },
  {
    id: 'task-104',
    title: '跟进财务共享中心跨国合规税务审计法务复核',
    owner: '陈敏 (法务经理)',
    deadline: '2026-07-30', // Overdue
    deliverable: '海外子公司合规合意意见书及风险规避清册',
    status: 'Blocked',
    blockedReason: '香港律所关于最新印花税法条解释尚未正式出具公函，正在紧急催促回应。',
    priority: 'High',
    meetingSource: '2026-07-20 财务与合规风险控制例会',
    createdAt: '2026-07-20T15:00:00.000Z',
    updatedAt: '2026-08-02T10:00:00.000Z',
  },
  {
    id: 'task-105',
    title: '完成 AI 大模型督办助手私有化部署测试环境搭建',
    owner: '刘洋 (AI工程组长)',
    deadline: '2026-08-02', // Finished
    deliverable: 'GPU 集群部署镜像包及部署测试报告',
    status: 'Done',
    blockedReason: '',
    priority: 'High',
    meetingSource: '2026-07-28 集团数字化转型跟进例会',
    createdAt: '2026-07-28T10:00:00.000Z',
    updatedAt: '2026-08-02T17:45:00.000Z',
  },
  {
    id: 'task-106',
    title: '提交全员网络安全意识培训与防钓鱼演练总结',
    owner: '赵敏 (安全管理员)',
    deadline: '2026-08-15',
    deliverable: '防钓鱼演练中招率统计表及培训考核结果',
    status: 'In Progress',
    blockedReason: '',
    priority: 'Low',
    meetingSource: '2026-07-25 基础设施安全调度例会',
    createdAt: '2026-07-25T09:30:00.000Z',
    updatedAt: '2026-08-01T08:00:00.000Z',
  },
  {
    id: 'task-107',
    title: '更新 Q3 业务部门 KPIs 智能评估算法模型与权重',
    owner: '孙博 (HRVP)',
    deadline: '2026-08-08',
    deliverable: '考核权重方案邮件抄送管理层及 HR 系统配置截图',
    status: 'In Progress',
    blockedReason: '',
    priority: 'Medium',
    meetingSource: '2026-07-31 战略规划与绩效管理月会',
    createdAt: '2026-07-31T11:00:00.000Z',
    updatedAt: '2026-08-02T12:00:00.000Z',
  }
];

export const SAMPLE_MEETING_NOTES = `
【集团2026年数字化转型与系统跟进第三次调度会议纪要】
时间：2026年8月2日 14:00-16:30
主持人：周总（副总裁）
参会人员：张伟、李娜、王强、陈敏、刘洋、赵敏

会议重点对当前各板块遗留与堵点事项进行了督办，形成以下具体任务与跟进要求：

1. 【供应链系统联调督办】
由张伟负责完成 ERP 与第三方 WMS 系统的 API 接口联调。由于 WMS 升级导致 502 报错，目前处于卡点状态（Blocked），要求张伟在 8月6日前 督促厂商提交补丁，并出具完整的联调测试报告及 API 签名认证文档。

2. 【智能客服采购】
由李娜负责输出智能客服二期项目的招标文件及需求规范书，要求在 8月8日前 交付《智能客服二期功能与性能指标要求 .docx》，确保招投标工作顺畅启动。

3. 【数据中心割接】
由王强牵头，在 8月12日前 完成华东数据中心主干网络双路冗余改造压测，并提交割接实施方案与演练视频。

4. 【海外合规审核】
陈敏汇报法务复核进展。目前香港律所合规函滞后，导致财税审计受阻，要求陈敏在 8月5日前 完成催办，提交《海外子公司合规合意意见书》。

5. 【供应商资金结算】
由周杰（财务主管）在 8月10日前 审核完成 Q2 核心供应商返利与尾款结算支付，提供已盖章支付明细表。
`;
