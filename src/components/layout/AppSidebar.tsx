import {
  LayoutGrid, FolderKanban, ListTodo, CheckSquare, Users, Activity,
  Inbox, FileText, BarChart3, Settings, Sparkles,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar, SidebarHeader, SidebarFooter,
} from "@/components/ui/sidebar";
import { inbox } from "@/data/mock";

const main = [
  { title: "概览", url: "/", icon: LayoutGrid },
  { title: "项目", url: "/projects", icon: FolderKanban },
  { title: "任务", url: "/tasks", icon: ListTodo },
  { title: "我的任务", url: "/my-tasks", icon: CheckSquare },
];
const collab = [
  { title: "团队", url: "/team", icon: Users },
  { title: "工作负载", url: "/workload", icon: Activity },
  { title: "收件箱", url: "/inbox", icon: Inbox },
];
const insights = [
  { title: "日报", url: "/daily", icon: FileText },
  { title: "报表", url: "/reports", icon: BarChart3 },
  { title: "设置", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const unread = inbox.filter((i) => !i.read).length;

  const linkCls = (active: boolean) =>
    `flex items-center gap-3 rounded-xl px-3 py-2 transition-all duration-300 ease-apple ${
      active
        ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary font-medium shadow-soft"
        : "text-foreground/70 hover:bg-secondary/70 hover:text-foreground"
    }`;

  const renderGroup = (label: string, items: typeof main) => (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground/60 px-3">{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu className="gap-0.5">
          {items.map((it) => {
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
      </SidebarContent>
      {!collapsed && (
        <SidebarFooter className="p-3">
          <div className="glass rounded-2xl p-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-purple flex items-center justify-center text-base">
              🧑‍💼
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">陈一鸣</div>
              <div className="text-[11px] text-muted-foreground truncate">产品经理 · 在线</div>
            </div>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
