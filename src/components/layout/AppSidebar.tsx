import {
  LayoutGrid, FolderKanban, ListTodo, CheckSquare, Users, Activity,
  Inbox, FileText, BarChart3, Settings, Sparkles, Crown, ShieldCheck, Send,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar, SidebarHeader, SidebarFooter,
} from "@/components/ui/sidebar";
import { inbox } from "@/data/mock";
import { useAuth } from "@/hooks/useAuth";
import { Resource, roleDefs } from "@/data/rbac";

type NavItem = { title: string; url: string; icon: any; resource?: Resource };

const main: NavItem[] = [
  { title: "概览", url: "/", icon: LayoutGrid },
  { title: "领导驾驶舱", url: "/executive", icon: Crown, resource: "executive" },
  { title: "项目", url: "/projects", icon: FolderKanban, resource: "projects" },
  { title: "任务", url: "/tasks", icon: ListTodo, resource: "tasks" },
  { title: "我的任务", url: "/my-tasks", icon: CheckSquare, resource: "tasks" },
];
const collab: NavItem[] = [
  { title: "团队", url: "/team", icon: Users, resource: "members" },
  { title: "工作负载", url: "/workload", icon: Activity, resource: "workload" },
  { title: "收件箱", url: "/inbox", icon: Inbox, resource: "inbox" },
];
const insights: NavItem[] = [
  { title: "日报", url: "/daily", icon: FileText, resource: "daily" },
  { title: "报表", url: "/reports", icon: BarChart3, resource: "reports" },
];
const admin: NavItem[] = [
  { title: "权限与账户", url: "/access", icon: ShieldCheck, resource: "access" },
  { title: "TG 推送", url: "/telegram", icon: Send, resource: "telegram" },
  { title: "设置", url: "/settings", icon: Settings, resource: "settings" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const { can, role, user } = useAuth();
  const unread = inbox.filter((i) => !i.read).length;
  const roleDef = roleDefs[role];

  const linkCls = (active: boolean) =>
    `flex items-center gap-3 rounded-xl px-3 py-2 transition-all duration-300 ease-apple ${
      active
        ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary font-medium shadow-soft"
        : "text-foreground/70 hover:bg-secondary/70 hover:text-foreground"
    }`;

  const renderGroup = (label: string, items: NavItem[]) => {
    const visible = items.filter((it) => !it.resource || can(it.resource, "view"));
    if (visible.length === 0) return null;
    return (
      <SidebarGroup>
        {!collapsed && <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground/60 px-3">{label}</SidebarGroupLabel>}
        <SidebarGroupContent>
          <SidebarMenu className="gap-0.5">
            {visible.map((it) => {
              const active = pathname === it.url || (it.url !== "/" && pathname.startsWith(it.url));
              return (
                <SidebarMenuItem key={it.url}>
                  <SidebarMenuButton asChild className="h-auto p-0">
                    <NavLink to={it.url} end={it.url === "/"} className={linkCls(active)}>
                      <it.icon className="h-[18px] w-[18px] shrink-0" />
                      {!collapsed && (
                        <span className="flex-1 text-sm flex items-center justify-between">
                          {it.title}
                          {it.url === "/inbox" && unread > 0 && (
                            <span className="ml-auto bg-destructive text-destructive-foreground text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                              {unread}
                            </span>
                          )}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60">
      <SidebarHeader className="px-3 pt-4 pb-2">
        <div className="flex items-center gap-2.5 px-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-soft">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-semibold tracking-tight">Lumin</span>
              <span className="text-[11px] text-muted-foreground">协作工作台</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 scrollbar-thin">
        {renderGroup("工作台", main)}
        {renderGroup("协作", collab)}
        {renderGroup("洞察", insights)}
        {renderGroup("管理", admin)}
      </SidebarContent>
      {!collapsed && (
        <SidebarFooter className="p-3">
          <div className="glass rounded-2xl p-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-purple flex items-center justify-center text-base">
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user.name}</div>
              <div className="text-[11px] truncate flex items-center gap-1">
                <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: `hsl(${roleDef.color} / 0.15)`, color: `hsl(${roleDef.color})` }}>
                  {roleDef.label}
                </span>
              </div>
            </div>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
