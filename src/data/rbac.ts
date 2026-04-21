// RBAC 数据层(纯 mock)
export type AppRole = "owner" | "admin" | "leader" | "manager" | "member" | "guest";

export type Resource =
  | "projects" | "tasks" | "members" | "workload"
  | "reports" | "daily" | "inbox" | "settings"
  | "access" | "executive" | "telegram" | "billing";

export type Action = "view" | "create" | "edit" | "delete" | "assign" | "export" | "approve";

export interface RoleDef {
  id: AppRole;
  label: string;
  description: string;
  color: string; // hsl
  badge: string; // tailwind class
  level: number; // 越大越高
}

export const roleDefs: Record<AppRole, RoleDef> = {
  owner:   { id: "owner",   label: "超级管理员", description: "拥有全部权限,包含计费与工作区销毁", color: "340 82% 62%", badge: "bg-pink/10 text-pink", level: 100 },
  admin:   { id: "admin",   label: "管理员",     description: "管理账户、权限、推送与所有项目",     color: "211 100% 45%", badge: "bg-primary/10 text-primary", level: 80 },
  leader:  { id: "leader",  label: "集团领导",   description: "只读全部数据,可在驾驶舱审阅、订阅推送", color: "280 65% 60%", badge: "bg-purple/10 text-purple", level: 70 },
  manager: { id: "manager", label: "项目经理",   description: "管理所属项目的任务、成员与日报",     color: "180 65% 45%", badge: "bg-teal/10 text-teal", level: 50 },
  member:  { id: "member",  label: "团队成员",   description: "处理被分配的任务,提交日报",         color: "199 89% 48%", badge: "bg-info/10 text-info", level: 30 },
  guest:   { id: "guest",   label: "访客",       description: "仅查看公开看板与项目摘要",          color: "220 9% 46%", badge: "bg-muted text-muted-foreground", level: 10 },
};

export const allRoles: AppRole[] = ["owner", "admin", "leader", "manager", "member", "guest"];
export const allResources: Resource[] = [
  "projects", "tasks", "members", "workload", "reports",
  "daily", "inbox", "settings", "access", "executive", "telegram", "billing",
];
export const allActions: Action[] = ["view", "create", "edit", "delete", "assign", "export", "approve"];

export const resourceLabel: Record<Resource, string> = {
  projects: "项目", tasks: "任务", members: "团队", workload: "工作负载",
  reports: "报表", daily: "日报", inbox: "收件箱", settings: "设置",
  access: "权限管理", executive: "领导驾驶舱", telegram: "TG 推送", billing: "计费",
};
export const actionLabel: Record<Action, string> = {
  view: "查看", create: "创建", edit: "编辑", delete: "删除",
  assign: "分配", export: "导出", approve: "审批",
};

// 默认权限矩阵 role -> resource -> Set<Action>
export type Matrix = Record<AppRole, Partial<Record<Resource, Action[]>>>;

const all: Action[] = [...allActions];
export const defaultMatrix: Matrix = {
  owner: Object.fromEntries(allResources.map((r) => [r, all])) as any,
  admin: {
    projects: ["view","create","edit","delete","assign","export"],
    tasks:    ["view","create","edit","delete","assign","export"],
    members:  ["view","create","edit","delete","assign"],
    workload: ["view","export"],
    reports:  ["view","export"],
    daily:    ["view","create","edit","export"],
    inbox:    ["view","edit"],
    settings: ["view","edit"],
    access:   ["view","create","edit","delete","assign"],
    executive:["view","export"],
    telegram: ["view","create","edit","delete"],
  },
  leader: {
    projects: ["view","export"],
    tasks:    ["view","export"],
    members:  ["view"],
    workload: ["view","export"],
    reports:  ["view","export","approve"],
    daily:    ["view","export"],
    inbox:    ["view"],
    executive:["view","export","approve"],
    telegram: ["view"],
  },
  manager: {
    projects: ["view","create","edit","assign"],
    tasks:    ["view","create","edit","delete","assign"],
    members:  ["view","assign"],
    workload: ["view"],
    reports:  ["view"],
    daily:    ["view","create","edit"],
    inbox:    ["view","edit"],
    settings: ["view"],
  },
  member: {
    projects: ["view"],
    tasks:    ["view","create","edit"],
    members:  ["view"],
    workload: ["view"],
    daily:    ["view","create","edit"],
    inbox:    ["view","edit"],
    settings: ["view","edit"],
  },
  guest: {
    projects: ["view"],
    tasks:    ["view"],
    members:  ["view"],
  },
};

// 账户(扩展自 members,但增加角色与状态)
export interface Account {
  id: string;
  memberId: string; // 关联 mock members
  role: AppRole;
  status: "active" | "invited" | "disabled";
  lastActive: string;
  twoFA: boolean;
  scope: "all" | string[]; // 项目 id 列表,all 表示全部
}

export const accounts: Account[] = [
  { id: "a1", memberId: "u1", role: "manager", status: "active",   lastActive: "2 分钟前",  twoFA: true,  scope: ["p1","p4"] },
  { id: "a2", memberId: "u2", role: "member",  status: "active",   lastActive: "10 分钟前", twoFA: true,  scope: ["p1","p6"] },
  { id: "a3", memberId: "u3", role: "member",  status: "active",   lastActive: "1 小时前",  twoFA: false, scope: ["p1","p3"] },
  { id: "a4", memberId: "u4", role: "manager", status: "active",   lastActive: "刚刚",      twoFA: true,  scope: ["p2","p5","p6"] },
  { id: "a5", memberId: "u5", role: "member",  status: "active",   lastActive: "30 分钟前", twoFA: false, scope: ["p1","p5"] },
  { id: "a6", memberId: "u6", role: "manager", status: "active",   lastActive: "今天 09:00", twoFA: true,  scope: ["p3","p4"] },
  { id: "a7", memberId: "u7", role: "leader",  status: "active",   lastActive: "昨天",      twoFA: true,  scope: "all" },
  { id: "a8", memberId: "u8", role: "admin",   status: "active",   lastActive: "5 分钟前",  twoFA: true,  scope: "all" },
  { id: "a9", memberId: "u1", role: "owner",   status: "active",   lastActive: "刚刚",      twoFA: true,  scope: "all" },
];

// TG 推送配置(mock)
export interface TgChannel {
  id: string;
  name: string;
  chatId: string;
  type: "channel" | "group" | "private";
  members: number;
  bound: boolean;
}
export interface TgSchedule {
  id: string;
  name: string;
  cron: string;
  channelId: string;
  template: "daily" | "morning" | "evening" | "weekly" | "alert";
  enabled: boolean;
  lastRun: string;
  nextRun: string;
}
export interface TgPushLog {
  id: string;
  scheduleName: string;
  channelName: string;
  status: "success" | "failed" | "pending";
  sentAt: string;
  preview: string;
  recipients: number;
}

export const tgChannels: TgChannel[] = [
  { id: "tg1", name: "Lumin · 集团日报", chatId: "-1001234567890", type: "channel", members: 28, bound: true },
  { id: "tg2", name: "Lumin · 项目预警", chatId: "-1009876543210", type: "group",   members: 16, bound: true },
  { id: "tg3", name: "Lumin · 高管周报", chatId: "-1005555556666", type: "channel", members: 9,  bound: true },
];

export const tgSchedules: TgSchedule[] = [
  { id: "ts1", name: "每日晚报",   cron: "0 18 * * *",  channelId: "tg1", template: "evening", enabled: true,  lastRun: "昨天 18:00", nextRun: "今天 18:00" },
  { id: "ts2", name: "每日早播",   cron: "0 9 * * *",   channelId: "tg1", template: "morning", enabled: true,  lastRun: "今天 09:00", nextRun: "明天 09:00" },
  { id: "ts3", name: "周一周报",   cron: "0 9 * * 1",   channelId: "tg3", template: "weekly",  enabled: true,  lastRun: "周一 09:00", nextRun: "下周一 09:00" },
  { id: "ts4", name: "高危预警",   cron: "*/15 * * * *",channelId: "tg2", template: "alert",   enabled: false, lastRun: "—",        nextRun: "—" },
];

export const tgLogs: TgPushLog[] = [
  { id: "l1", scheduleName: "每日早播", channelName: "Lumin · 集团日报", status: "success", sentAt: "今天 09:00:12", preview: "📊 今日待办 24 项,3 项高危,涉及项目 4 个...", recipients: 28 },
  { id: "l2", scheduleName: "每日晚报", channelName: "Lumin · 集团日报", status: "success", sentAt: "昨天 18:00:08", preview: "✅ 今日完成 18 / 24,延期 2,新建 12...", recipients: 28 },
  { id: "l3", scheduleName: "周一周报", channelName: "Lumin · 高管周报", status: "success", sentAt: "周一 09:00:21", preview: "📈 上周完成 76 项,环比 +12%,核心指标...", recipients: 9 },
  { id: "l4", scheduleName: "高危预警", channelName: "Lumin · 项目预警", status: "failed",  sentAt: "周日 14:32:11", preview: "⚠️ 任务 t6 进入逾期风险...", recipients: 0 },
  { id: "l5", scheduleName: "每日早播", channelName: "Lumin · 集团日报", status: "success", sentAt: "昨天 09:00:05", preview: "📊 今日待办 22 项,2 项高危...", recipients: 28 },
];

// 集团/领导驾驶舱:项目健康度评估
export type Health = "green" | "yellow" | "red";
export const healthMeta: Record<Health, { label: string; color: string; bg: string }> = {
  green:  { label: "健康", color: "text-success", bg: "bg-success/10" },
  yellow: { label: "关注", color: "text-warning", bg: "bg-warning/10" },
  red:    { label: "风险", color: "text-destructive", bg: "bg-destructive/10" },
};

export const computeHealth = (progress: number, status: string): Health => {
  if (status === "paused") return "red";
  if (progress < 30) return "yellow";
  if (progress < 15) return "red";
  return "green";
};
