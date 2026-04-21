export type Status = "todo" | "in_progress" | "review" | "done";
export type Priority = "low" | "medium" | "high" | "urgent";

export interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
  department: string;
  workload: number; // 0-100
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  projectId: string;
  assigneeId: string;
  dueDate: string;
  createdAt: string;
  tags: string[];
  comments: { id: string; authorId: string; content: string; createdAt: string }[];
  subtasks: { id: string; title: string; done: boolean }[];
  progress: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  status: "planning" | "active" | "paused" | "completed";
  startDate: string;
  endDate: string;
  memberIds: string[];
  ownerId: string;
  progress: number;
  tag: string;
}

export interface InboxItem {
  id: string;
  type: "mention" | "assigned" | "comment" | "due" | "system";
  title: string;
  preview: string;
  createdAt: string;
  read: boolean;
  from: string;
}

export interface DailyReport {
  id: string;
  authorId: string;
  date: string;
  done: string;
  todo: string;
  blockers: string;
  mood: "great" | "good" | "ok" | "stuck";
}

export const members: Member[] = [
  { id: "u1", name: "陈一鸣", role: "产品经理", avatar: "🧑‍💼", email: "chen@team.io", department: "产品部", workload: 78 },
  { id: "u2", name: "林子安", role: "前端工程师", avatar: "👩‍💻", email: "lin@team.io", department: "技术部", workload: 92 },
  { id: "u3", name: "苏沐辰", role: "UI 设计师", avatar: "🎨", email: "su@team.io", department: "设计部", workload: 64 },
  { id: "u4", name: "顾景行", role: "后端工程师", avatar: "🧑‍🔧", email: "gu@team.io", department: "技术部", workload: 85 },
  { id: "u5", name: "周清禾", role: "测试工程师", avatar: "🧪", email: "zhou@team.io", department: "技术部", workload: 55 },
  { id: "u6", name: "白若溪", role: "运营经理", avatar: "📣", email: "bai@team.io", department: "运营部", workload: 70 },
  { id: "u7", name: "宋亦舟", role: "数据分析师", avatar: "📊", email: "song@team.io", department: "数据部", workload: 48 },
  { id: "u8", name: "夏知许", role: "项目经理", avatar: "🗂️", email: "xia@team.io", department: "管理部", workload: 88 },
];

export const projects: Project[] = [
  {
    id: "p1",
    name: "新版客户端 3.0",
    description: "基于 SwiftUI 重构 iOS 与 macOS 客户端，全新设计语言与协作能力。",
    color: "211 100% 60%",
    status: "active",
    startDate: "2026-01-08",
    endDate: "2026-06-30",
    memberIds: ["u1", "u2", "u3", "u4", "u5"],
    ownerId: "u8",
    progress: 62,
    tag: "核心",
  },
  {
    id: "p2",
    name: "数据中台升级",
    description: "统一指标口径,重构 OLAP 集群,支撑实时大盘与归因分析。",
    color: "280 65% 65%",
    status: "active",
    startDate: "2026-02-01",
    endDate: "2026-08-15",
    memberIds: ["u4", "u7", "u8"],
    ownerId: "u8",
    progress: 38,
    tag: "基建",
  },
  {
    id: "p3",
    name: "品牌年度焕新",
    description: "Logo、配色、官网与社媒视觉的整体焕新,配合发布会落地。",
    color: "340 82% 65%",
    status: "planning",
    startDate: "2026-03-15",
    endDate: "2026-05-20",
    memberIds: ["u3", "u6"],
    ownerId: "u6",
    progress: 12,
    tag: "市场",
  },
  {
    id: "p4",
    name: "海外增长实验",
    description: "东南亚四国本地化与增长漏斗实验,目标 Q3 月活破百万。",
    color: "180 65% 50%",
    status: "active",
    startDate: "2026-01-20",
    endDate: "2026-09-30",
    memberIds: ["u1", "u6", "u7"],
    ownerId: "u1",
    progress: 47,
    tag: "增长",
  },
  {
    id: "p5",
    name: "支付安全合规",
    description: "通过 PCI-DSS 三级认证,完善风控规则与审计日志。",
    color: "36 100% 55%",
    status: "paused",
    startDate: "2025-11-10",
    endDate: "2026-04-30",
    memberIds: ["u4", "u5", "u8"],
    ownerId: "u4",
    progress: 73,
    tag: "合规",
  },
  {
    id: "p6",
    name: "AI 智能助理",
    description: "面向 B 端的会议纪要、文档问答与工作流自动化助理。",
    color: "260 80% 65%",
    status: "active",
    startDate: "2026-02-20",
    endDate: "2026-07-10",
    memberIds: ["u2", "u4", "u7"],
    ownerId: "u2",
    progress: 28,
    tag: "AI",
  },
];

export const tasks: Task[] = [
  {
    id: "t1", title: "首页改版视觉评审", description: "对接设计稿三轮迭代,产出最终交付包与切图规范。",
    status: "in_progress", priority: "high", projectId: "p1", assigneeId: "u3",
    dueDate: "2026-04-25", createdAt: "2026-04-10", tags: ["设计", "评审"],
    progress: 65,
    subtasks: [
      { id: "s1", title: "首屏 Hero 三稿对比", done: true },
      { id: "s2", title: "暗色模式适配", done: true },
      { id: "s3", title: "动效原型 (Principle)", done: false },
      { id: "s4", title: "切图规范文档", done: false },
    ],
    comments: [
      { id: "c1", authorId: "u1", content: "Hero 区还可以再大胆一点,参考 Apple Vision Pro 落地页。", createdAt: "2026-04-18 10:21" },
      { id: "c2", authorId: "u3", content: "收到,今天出第三稿。", createdAt: "2026-04-18 11:05" },
    ],
  },
  {
    id: "t2", title: "登录态 Token 刷新机制", description: "解决长时间停留导致 401 的问题,统一拦截器逻辑。",
    status: "review", priority: "urgent", projectId: "p1", assigneeId: "u2",
    dueDate: "2026-04-22", createdAt: "2026-04-12", tags: ["前端", "安全"], progress: 90,
    subtasks: [{ id: "s5", title: "拦截器重写", done: true }, { id: "s6", title: "单元测试", done: true }, { id: "s7", title: "Code Review", done: false }],
    comments: [{ id: "c3", authorId: "u4", content: "后端 refresh 接口已部署 staging。", createdAt: "2026-04-19 09:00" }],
  },
  {
    id: "t3", title: "实时大盘指标对齐", description: "与业务方逐个核对 GMV / DAU / 留存口径。",
    status: "todo", priority: "high", projectId: "p2", assigneeId: "u7",
    dueDate: "2026-04-30", createdAt: "2026-04-15", tags: ["数据"], progress: 10,
    subtasks: [{ id: "s8", title: "口径对齐文档", done: false }], comments: [],
  },
  {
    id: "t4", title: "Logo 候选三套", description: "围绕「连接 / 流动 / 智能」三个关键词出三套方向。",
    status: "in_progress", priority: "medium", projectId: "p3", assigneeId: "u3",
    dueDate: "2026-04-28", createdAt: "2026-04-14", tags: ["品牌"], progress: 40,
    subtasks: [], comments: [],
  },
  {
    id: "t5", title: "印尼语本地化包", description: "1200 条文案翻译与 UI 复检。",
    status: "in_progress", priority: "medium", projectId: "p4", assigneeId: "u6",
    dueDate: "2026-05-08", createdAt: "2026-04-08", tags: ["本地化"], progress: 55, subtasks: [], comments: [],
  },
  {
    id: "t6", title: "PCI-DSS 渗透测试", description: "外部安全公司协助,补齐高危漏洞清单。",
    status: "review", priority: "urgent", projectId: "p5", assigneeId: "u5",
    dueDate: "2026-04-26", createdAt: "2026-04-01", tags: ["合规", "安全"], progress: 80, subtasks: [], comments: [],
  },
  {
    id: "t7", title: "Prompt 评测集 v2", description: "扩充到 500 条,覆盖 8 个业务场景。",
    status: "todo", priority: "medium", projectId: "p6", assigneeId: "u7",
    dueDate: "2026-05-12", createdAt: "2026-04-17", tags: ["AI", "评测"], progress: 5, subtasks: [], comments: [],
  },
  {
    id: "t8", title: "客户端崩溃率治理", description: "iOS 17 上 0.42% 崩溃率,定位三大崩溃栈。",
    status: "in_progress", priority: "high", projectId: "p1", assigneeId: "u2",
    dueDate: "2026-05-02", createdAt: "2026-04-11", tags: ["稳定性"], progress: 35, subtasks: [], comments: [],
  },
  {
    id: "t9", title: "团队周会议程", description: "整理本周 Demo 顺序与决策事项。",
    status: "done", priority: "low", projectId: "p1", assigneeId: "u8",
    dueDate: "2026-04-19", createdAt: "2026-04-17", tags: ["管理"], progress: 100, subtasks: [], comments: [],
  },
  {
    id: "t10", title: "归因模型 v3 上线", description: "替换现有 Last-Click,使用马尔可夫链归因。",
    status: "todo", priority: "high", projectId: "p2", assigneeId: "u4",
    dueDate: "2026-05-20", createdAt: "2026-04-19", tags: ["数据", "模型"], progress: 0, subtasks: [], comments: [],
  },
  {
    id: "t11", title: "官网 Hero 视频拍摄", description: "外景两天,搭配产品 UI 三维渲染。",
    status: "todo", priority: "medium", projectId: "p3", assigneeId: "u6",
    dueDate: "2026-05-05", createdAt: "2026-04-18", tags: ["市场", "拍摄"], progress: 0, subtasks: [], comments: [],
  },
  {
    id: "t12", title: "AI 助理插件市场", description: "插件协议设计与开发者文档。",
    status: "in_progress", priority: "medium", projectId: "p6", assigneeId: "u4",
    dueDate: "2026-06-01", createdAt: "2026-04-05", tags: ["AI", "平台"], progress: 22, subtasks: [], comments: [],
  },
];

export const inbox: InboxItem[] = [
  { id: "i1", type: "mention", title: "陈一鸣 在「首页改版视觉评审」中 @ 了你", preview: "Hero 区还可以再大胆一点...", createdAt: "10 分钟前", read: false, from: "u1" },
  { id: "i2", type: "assigned", title: "新任务指派:Prompt 评测集 v2", preview: "截止 2026-05-12", createdAt: "1 小时前", read: false, from: "u8" },
  { id: "i3", type: "due", title: "「登录态 Token 刷新机制」即将到期", preview: "还剩 2 天", createdAt: "今天 09:00", read: false, from: "system" },
  { id: "i4", type: "comment", title: "顾景行 在「实时大盘指标对齐」评论", preview: "后端 refresh 接口已部署 staging。", createdAt: "昨天 18:30", read: true, from: "u4" },
  { id: "i5", type: "system", title: "周报已生成", preview: "本周共完成 14 项任务,延期 2 项。", createdAt: "周一 09:00", read: true, from: "system" },
];

export const dailies: DailyReport[] = [
  { id: "d1", authorId: "u2", date: "2026-04-21", done: "完成 Token 刷新机制 PR;修复登录页两处样式问题。", todo: "继续治理 iOS 17 崩溃栈;Code Review。", blockers: "暂无", mood: "great" },
  { id: "d2", authorId: "u3", date: "2026-04-21", done: "Hero 第二稿评审,Logo 候选 A/B 出图。", todo: "Hero 第三稿;切图规范文档。", blockers: "需要市场部确认主视觉关键词。", mood: "good" },
  { id: "d3", authorId: "u4", date: "2026-04-21", done: "归因模型 v3 调研报告。", todo: "插件协议草案;PCI-DSS 漏洞修复。", blockers: "等待安全公司报告", mood: "ok" },
  { id: "d4", authorId: "u7", date: "2026-04-21", done: "口径对齐会议;评测集场景梳理。", todo: "Prompt 评测集结构搭建。", blockers: "暂无", mood: "good" },
];

export const statusMeta: Record<Status, { label: string; color: string; dot: string }> = {
  todo: { label: "待开始", color: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
  in_progress: { label: "进行中", color: "bg-info/10 text-info", dot: "bg-info" },
  review: { label: "评审中", color: "bg-warning/10 text-warning", dot: "bg-warning" },
  done: { label: "已完成", color: "bg-success/10 text-success", dot: "bg-success" },
};

export const priorityMeta: Record<Priority, { label: string; color: string }> = {
  low: { label: "低", color: "bg-muted text-muted-foreground" },
  medium: { label: "中", color: "bg-info/10 text-info" },
  high: { label: "高", color: "bg-warning/10 text-warning" },
  urgent: { label: "紧急", color: "bg-destructive/10 text-destructive" },
};

export const getMember = (id: string) => members.find((m) => m.id === id)!;
export const getProject = (id: string) => projects.find((p) => p.id === id)!;
export const getTask = (id: string) => tasks.find((t) => t.id === id)!;

// Trend mock data
export const weekTrend = [
  { day: "周一", done: 12, created: 18 },
  { day: "周二", done: 15, created: 14 },
  { day: "周三", done: 9, created: 11 },
  { day: "周四", done: 18, created: 16 },
  { day: "周五", done: 14, created: 12 },
  { day: "周六", done: 6, created: 4 },
  { day: "周日", done: 3, created: 2 },
];
