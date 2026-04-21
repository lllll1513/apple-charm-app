import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { allResources, allActions, allRoles, roleDefs, resourceLabel, actionLabel, accounts as initialAccounts, AppRole, Action } from "@/data/rbac";
import { useAuth } from "@/hooks/useAuth";
import { getMember } from "@/data/mock";
import { Search, ShieldCheck, Mail, MoreHorizontal, UserPlus, KeyRound, Lock, Activity } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function Access() {
  const { matrix, setMatrix, can } = useAuth();
  const [accounts, setAccounts] = useState(initialAccounts);
  const [q, setQ] = useState("");
  const [filterRole, setFilterRole] = useState<AppRole | "all">("all");

  const canEditAccess = can("access", "edit");
  const canCreate = can("access", "create");

  const filtered = accounts.filter((a) => {
    const m = getMember(a.memberId);
    const hit = m.name.includes(q) || m.email.includes(q);
    return hit && (filterRole === "all" || a.role === filterRole);
  });

  const togglePerm = (role: AppRole, resource: typeof allResources[number], action: Action) => {
    if (!canEditAccess) return toast.error("无权限修改", { description: "当前角色不可编辑权限矩阵" });
    const cur = matrix[role][resource] ?? [];
    const next = cur.includes(action) ? cur.filter((a) => a !== action) : [...cur, action];
    setMatrix({ ...matrix, [role]: { ...matrix[role], [resource]: next } });
  };

  const updateAccount = (id: string, patch: Partial<typeof accounts[number]>) => {
    if (!canEditAccess) return toast.error("无权限修改账户");
    setAccounts(accounts.map((a) => (a.id === id ? { ...a, ...patch } : a)));
    toast.success("账户已更新");
  };

  return (
    <>
      <PageHeader
        title="权限与账户"
        description="管理团队账户、角色分配与细粒度权限矩阵"
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-xl gap-1.5 shadow-soft" disabled={!canCreate}>
                <UserPlus className="h-4 w-4" /> 邀请成员
              </Button>
            </DialogTrigger>
            <InviteDialog onInvite={(email, role) => {
              const newId = `a${accounts.length + 1}`;
              setAccounts([...accounts, { id: newId, memberId: "u3", role, status: "invited", lastActive: "—", twoFA: false, scope: "all" }]);
              toast.success(`已发送邀请到 ${email}`, { description: `角色: ${roleDefs[role].label}` });
            }} />
          </Dialog>
        }
      />

      <Tabs defaultValue="accounts">
        <TabsList className="rounded-xl bg-secondary/60 mb-5">
          <TabsTrigger value="accounts" className="rounded-lg">账户列表 ({accounts.length})</TabsTrigger>
          <TabsTrigger value="roles" className="rounded-lg">角色定义</TabsTrigger>
          <TabsTrigger value="matrix" className="rounded-lg">权限矩阵</TabsTrigger>
          <TabsTrigger value="audit" className="rounded-lg">审计日志</TabsTrigger>
        </TabsList>

        {/* 账户列表 */}
        <TabsContent value="accounts">
          <Card className="glass rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="搜索姓名 / 邮箱" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9 rounded-xl bg-background/60" />
              </div>
              <Select value={filterRole} onValueChange={(v: any) => setFilterRole(v)}>
                <SelectTrigger className="w-40 rounded-xl bg-background/60"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部角色</SelectItem>
                  {allRoles.map((r) => <SelectItem key={r} value={r}>{roleDefs[r].label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-hidden rounded-xl border border-border/50">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 text-xs text-muted-foreground">
                  <tr>
                    <th className="text-left px-4 py-3">成员</th>
                    <th className="text-left px-4 py-3">角色</th>
                    <th className="text-left px-4 py-3">数据范围</th>
                    <th className="text-left px-4 py-3">2FA</th>
                    <th className="text-left px-4 py-3">状态</th>
                    <th className="text-left px-4 py-3">最近活动</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => {
                    const m = getMember(a.memberId);
                    const def = roleDefs[a.role];
                    return (
                      <tr key={a.id} className="border-t border-border/40 hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/20 to-purple/20 flex items-center justify-center text-sm font-medium text-white">{m.name.charAt(0)}</div>
                            <div>
                              <div className="font-medium">{m.name}</div>
                              <div className="text-xs text-muted-foreground">{m.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Select value={a.role} onValueChange={(v: AppRole) => updateAccount(a.id, { role: v })}>
                            <SelectTrigger className="h-8 w-32 rounded-lg bg-background/60 text-xs">
                              <span className={`px-2 py-0.5 rounded-md text-[11px] ${def.badge}`}>{def.label}</span>
                            </SelectTrigger>
                            <SelectContent>
                              {allRoles.map((r) => <SelectItem key={r} value={r}>{roleDefs[r].label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {a.scope === "all" ? <Badge variant="outline" className="rounded-md">全部项目</Badge> : `${a.scope.length} 个项目`}
                        </td>
                        <td className="px-4 py-3">
                          <Switch checked={a.twoFA} onCheckedChange={(v) => updateAccount(a.id, { twoFA: v })} />
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 text-xs ${a.status === "active" ? "text-success" : a.status === "invited" ? "text-warning" : "text-muted-foreground"}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${a.status === "active" ? "bg-success" : a.status === "invited" ? "bg-warning" : "bg-muted-foreground"}`} />
                            {a.status === "active" ? "已激活" : a.status === "invited" ? "待接受" : "已停用"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{a.lastActive}</td>
                        <td className="px-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="h-8 w-8 rounded-lg hover:bg-secondary flex items-center justify-center"><MoreHorizontal className="h-4 w-4" /></DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl">
                              <DropdownMenuItem onClick={() => toast.success("已发送重置邮件")}><Mail className="h-4 w-4 mr-2" />发送重置邮件</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.success("已重置 2FA")}><KeyRound className="h-4 w-4 mr-2" />重置 2FA</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive" onClick={() => updateAccount(a.id, { status: "disabled" })}>
                                <Lock className="h-4 w-4 mr-2" />停用账户
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* 角色定义 */}
        <TabsContent value="roles">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allRoles.map((r) => {
              const d = roleDefs[r];
              const count = accounts.filter((a) => a.role === r).length;
              const perms = Object.entries(matrix[r]);
              return (
                <Card key={r} className="glass rounded-2xl p-5 hover:shadow-elevated transition-all hover:-translate-y-0.5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: `hsl(${d.color} / 0.15)` }}>
                      <ShieldCheck className="h-5 w-5" style={{ color: `hsl(${d.color})` }} />
                    </div>
                    <Badge variant="outline" className="rounded-md text-xs">{count} 人</Badge>
                  </div>
                  <div className="text-base font-semibold tracking-tight">{d.label}</div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{d.description}</p>
                  <div className="mt-4 pt-4 border-t border-border/40">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground/70 mb-2">可访问资源 ({perms.length})</div>
                    <div className="flex flex-wrap gap-1.5">
                      {perms.slice(0, 6).map(([res]) => (
                        <span key={res} className="text-[11px] px-1.5 py-0.5 rounded bg-secondary/70">{resourceLabel[res as keyof typeof resourceLabel]}</span>
                      ))}
                      {perms.length > 6 && <span className="text-[11px] px-1.5 py-0.5 rounded text-muted-foreground">+{perms.length - 6}</span>}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* 权限矩阵 */}
        <TabsContent value="matrix">
          <Card className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-semibold">RBAC 权限矩阵</div>
                <div className="text-xs text-muted-foreground mt-0.5">点击格子切换权限 · {canEditAccess ? "可编辑" : "只读模式"}</div>
              </div>
            </div>
            <div className="overflow-auto scrollbar-thin">
              <table className="w-full text-xs border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th className="text-left px-3 py-2 sticky left-0 bg-card z-10 text-muted-foreground font-medium">资源 \ 角色</th>
                    {allRoles.map((r) => (
                      <th key={r} className="px-2 py-2 text-center">
                        <div className={`inline-flex flex-col items-center gap-1 px-2 py-1 rounded-lg ${roleDefs[r].badge}`}>
                          <span className="font-medium">{roleDefs[r].label}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allResources.map((res) => (
                    <tr key={res} className="group">
                      <td className="px-3 py-2 sticky left-0 bg-card z-10 font-medium border-t border-border/40">{resourceLabel[res]}</td>
                      {allRoles.map((r) => {
                        const allowed = matrix[r]?.[res] ?? [];
                        return (
                          <td key={r} className="px-1 py-2 border-t border-border/40">
                            <div className="flex flex-wrap gap-1 justify-center">
                              {allActions.map((a) => {
                                const on = allowed.includes(a);
                                return (
                                  <button
                                    key={a}
                                    onClick={() => togglePerm(r, res, a)}
                                    disabled={!canEditAccess}
                                    title={actionLabel[a]}
                                    className={`text-[10px] px-1.5 py-0.5 rounded transition-all ${
                                      on ? "bg-primary text-primary-foreground shadow-soft" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                                    } ${!canEditAccess ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                                  >
                                    {actionLabel[a]}
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* 审计日志 */}
        <TabsContent value="audit">
          <Card className="glass rounded-2xl p-5">
            <div className="space-y-2">
              {[
                { who: "陈一鸣", action: "将 林子安 的角色从 成员 升级为 项目经理", time: "10 分钟前", icon: ShieldCheck, color: "text-primary" },
                { who: "夏知许", action: "邀请 new-user@team.io 加入工作区(管理员)", time: "1 小时前", icon: UserPlus, color: "text-success" },
                { who: "系统",   action: "周清禾 启用了 2FA 双重认证", time: "今天 09:12", icon: KeyRound, color: "text-info" },
                { who: "陈一鸣", action: "修改了 项目经理 对 报表 的 导出 权限", time: "昨天 18:30", icon: Activity, color: "text-warning" },
                { who: "夏知许", action: "停用账户 ex-member@team.io", time: "2 天前", icon: Lock, color: "text-destructive" },
              ].map((log, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/40 transition-colors">
                  <div className={`h-8 w-8 rounded-lg bg-secondary/70 flex items-center justify-center ${log.color}`}>
                    <log.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm"><b>{log.who}</b> <span className="text-muted-foreground">{log.action}</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">{log.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

function InviteDialog({ onInvite }: { onInvite: (email: string, role: AppRole) => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AppRole>("member");
  return (
    <DialogContent className="rounded-2xl">
      <DialogHeader>
        <DialogTitle>邀请新成员</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-2">
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">邮箱</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@team.io" className="rounded-xl" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">分配角色</label>
          <Select value={role} onValueChange={(v: AppRole) => setRole(v)}>
            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              {allRoles.map((r) => (
                <SelectItem key={r} value={r}>
                  <div className="flex flex-col">
                    <span>{roleDefs[r].label}</span>
                    <span className="text-[11px] text-muted-foreground">{roleDefs[r].description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button className="rounded-xl" onClick={() => email && onInvite(email, role)}>发送邀请</Button>
      </DialogFooter>
    </DialogContent>
  );
}
