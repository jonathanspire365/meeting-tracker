import * as XLSX from 'xlsx';
import { Task } from '../src/types.js';

/**
 * Export tasks array to Excel .xlsx file and trigger client download
 */
export function exportTasksToExcel(tasks: Task[], fileNamePrefix: string = '会议遗留事项督办清单'): void {
  if (!tasks || tasks.length === 0) {
    alert("暂无可导出的任务数据");
    return;
  }

  const todayStr = new Date().toISOString().split('T')[0];

  const excelData = tasks.map((task, index) => {
    const isOverdue = task.status !== 'Done' && task.deadline < todayStr;
    const statusText =
      task.status === 'In Progress'
        ? '进行中'
        : task.status === 'Blocked'
        ? '卡点阻塞'
        : '已完成';

    const overdueText =
      task.status === 'Done'
        ? '已归档'
        : isOverdue
        ? '⚠️ 已超期'
        : '正常推进';

    const priorityText =
      task.priority === 'High' ? '高' : task.priority === 'Low' ? '低' : '中';

    return {
      '序号': index + 1,
      '督办事项': task.title,
      '责任人': task.owner,
      '截止日期': task.deadline,
      '交付物说明': task.deliverable,
      '当前状态': statusText,
      '卡点与风险原因': task.blockedReason || '无',
      '优先级': priorityText,
      '预警状态': overdueText,
      '来源会议/上下文': task.meetingSource || '智能提取/手动录入',
      '更新时间': task.updatedAt ? task.updatedAt.slice(0, 10) : todayStr,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths for better Excel formatting
  const columnWidths = [
    { wch: 6 },  // 序号
    { wch: 32 }, // 督办事项
    { wch: 12 }, // 责任人
    { wch: 14 }, // 截止日期
    { wch: 30 }, // 交付物说明
    { wch: 12 }, // 当前状态
    { wch: 35 }, // 卡点与风险原因
    { wch: 8 },  // 优先级
    { wch: 12 }, // 预警状态
    { wch: 25 }, // 来源会议
    { wch: 14 }, // 更新时间
  ];

  worksheet['!cols'] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '督办事项清单');

  const currentDate = new Date().toISOString().slice(0, 10);
  const fullFileName = `${fileNamePrefix}_${currentDate}.xlsx`;

  XLSX.writeFile(workbook, fullFileName);
}
