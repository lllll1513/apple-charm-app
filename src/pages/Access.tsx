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
import { allResources, allActions, allRoles, roleDefs, resourceLabel, actionLabel, accounts as initialAccounts, AppRole, Action, Account } from "@/data/rbac";
import { useAuth } from "@/hooks/useAuth";
import { getMember } from "@/data/mock";
import { ShieldCheck, Mail, UserPlus, KeyRound, Lock, Activity, Pencil, Trash2, Power } from "lucide-react";
import { toast } from "sonner";

export default function Access() {
  const { matrix, setMatrix, can } = useAuth();
  const [accounts, setAccounts] = useState(initialAccounts);
  const [filterRole, setFilterRole] = useState<AppRole | "all">("all");
  const [editing, setEditing] = useState<Account | null>(null);

  const canEditAccess = can("access", "edit");
  const canCreate = can("access", "create");
  const canDelete = can("access", "delete");

  const filtered = accounts.filter((a) => filterRole === "all" || a.role === filterRole);

  const togglePerm = (role: AppRole, resource: typeof allResources[number], action: Action) => {
    if (!canEditAccess) return toast.error("无权限修改", { description: "当前角色不可编辑权限矩阵" });
    const cur = matrix[role][resource] ?? [];
    const next = cur.includes(action) ? cur.filter((a) => a !== action) : [...cur, action];
    setMatrix({ ...matrix, [role]: { ...matrix[role], [resource]: next } });
  };

  const updateAccount = (id: string, patch: Partial<Account>) => {
    if (!canEditAccess) return toast.error("无权限修改账户");
    setAccounts(accounts.map((a) => (a.id === id ? { ...a, ...patch } : a)));
    toast.success("账户已更新");
  };

  const deleteAccount = (id: string) => {
    if (!canDelete) return toast.error("无权限删除");
    setAccounts(accounts.filter((a) => a.id !== id));
    toast.success("账户已删除");
  };

  const toggleStatus = (a: Account) => {
    updateAccount(a.id, { status: a.status === "active" ? "disabled" : "active" });
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
            <InviteDialog onInvite={(email, username, role) => {
              const newId = `a${accounts.length + 1}`;
              setAccounts([...accounts, {
                id: newId, memberId: "u3", username, role, status: "invited",
                lastActive: "从未登录", createdAt: new Date().toLocaleString("zh-CN"),
                twoFA: false, scope: "all",
              }]);
              toast.success(`已发送邀请到 ${email}`, { description: `账号: ${username} · 角色: ${roleDefs[role].label}` });
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

        {/* 账户列表 - 管理员管理表 */}
        <TabsContent value="accounts">
          <Card className="glass rounded-2xl p-0 overflow-hidden">
            <div className="flex items-center justify-between gap-3 p-5 border-b border-border/40">
              <div>
                <div className="font-semibold tracking-tight">管理员管理</div>
                <div className="text-xs text-muted-foreground mt-0.5">管理员账号、权限与启停状态</div>
              </div>
              <Select value={filterRole} onValueChange={(v: any) => setFilterRole(v)}>
                <SelectTrigger className="w-40 rounded-xl bg-background/60"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部角色</SelectItem>
                  {allRoles.map((r) => <SelectItem key={r} value={r}>{roleDefs[r].label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/40 text-xs text-muted-foreground">
                  <tr>
                    <th className="text-left px-5 py-3 w-12">#</th>
                    <th className="text-left px-3 py-3">用户名</th>
                    <th className="text-left px-3 py-3">昵称</th>
                    <th className="text-left px-3 py-3">角色</th>
                    <th className="text-left px-3 py-3">状态</th>
                    <th className="text-left px-3 py-3">最后登录</th>
                    <th className="text-left px-3 py-3">创建时间</th>
                    <th className="text-right px-5 py-3 w-[160px]">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a, i) => {
                    const m = getMember(a.memberId);
                    const def = roleDefs[a.role];
                    return (
                      <tr key={a.id} className="border-t border-border/40 hover:bg-secondary/30 transition-colors">
                        <td className="px-5 py-3 text-muted-foreground">{i + 1}</td>
                        <td className="px-3 py-3 font-medium font-mono text-[13px]">{a.username}</td>
                        <td className="px-3 py-3 text-muted-foreground">
                          <span className="inline-flex items-center gap-2">
                            <span className="text-base">{m.avatar}</span>
                            <span>{m.name}</span>
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${def.badge}`}>{def.label}</span>
                        </td>
                        <td className="px-3 py-3">
                          {a.status === "active" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-success/10 text-success text-[11px] font-medium">启用</span>
                          ) : a.status === "invited" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-warning/10 text-warning text-[11px] font-medium">待接受</span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[11px] font-medium">已停用</span>
                          )}
                        </td>
                        <td className="px-3 py-3 text-xs text-muted-foreground font-mono">{a.lastActive}</td>
                        <td className="px-3 py-3 text-xs text-muted-foreground font-mono">{a.createdAt}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={() => setEditing(a)} disabled={!canEditAccess} title="编辑">
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={() => toggleStatus(a)} disabled={!canEditAccess} title={a.status === "active" ? "停用" : "启用"}>
                              <Power className={`h-3.5 w-3.5 ${a.status === "active" ? "text-success" : "text-muted-foreground"}`} />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive" onClick={() => deleteAccount(a.id)} disabled={!canDelete} title="删除">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
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
