import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { projects, tasks, members, weekTrend, getMember } from "@/data/mock";
import { healthMeta, computeHealth, tgLogs } from "@/data/rbac";
import { useAuth } from "@/hooks/useAuth";
import { Crown, TrendingUp, TrendingDown, AlertTriangle, Send, Download, FileCheck2, Building2, Briefcase, Target, Sparkles } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, RadialBarChart, RadialBar, Legend, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";

export default function Executive() {
  const { can } = useAuth();
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const overdue = 2;
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const onTimeRate = Math.round((doneTasks / totalTasks) * 100 + 30);

  const deptData = [
    { name: "技术部", load: 88, headcount: 3, color: "hsl(var(--primary))" },
    { name: "产品部", load: 78, headcount: 1, color: "hsl(var(--purple))" },
    { name: "设计部", load: 64, headcount: 1, color: "hsl(var(--pink))" },
    { name: "运营部", load: 70, headcount: 1, color: "hsl(var(--teal))" },
    { name: "数据部", load: 48, headcount: 1, color: "hsl(var(--info))" },
    { name: "管理部", load: 88, headcount: 1, color: "hsl(var(--warning))" },
  ];

  const healthDist = [
    { name: "健康", value: projects.filter((p) => computeHealth(p.progress, p.status) === "green").length, color: "hsl(var(--success))" },
    { name: "关注", value: projects.filter((p) => computeHealth(p.progress, p.status) === "yellow").length, color: "hsl(var(--warning))" },
    { name: "风险", value: projects.filter((p) => computeHealth(p.progress, p.status) === "red").length, color: "hsl(var(--destructive))" },
  ];

  return (
    <>
      <PageHeader
        title="领导驾驶舱"
        description="集团全景视图 · 高管审阅与决策支持"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl gap-1.5" onClick={() => toast.success("已导出 PDF 简报")}>
              <Download className="h-4 w-4" /> 导出简报
            </Button>
            <Button className="rounded-xl gap-1.5 shadow-soft" disabled={!can("telegram", "create")}
              onClick={() => toast.success("已推送至 TG 高管周报频道", { description: "9 位订阅者将在 5 秒内收到" })}>
              <Send className="h-4 w-4" /> 推送至 TG
            </Button>
          </div>
        }
      />

      {/* 顶部 KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard icon={Building2} label="活跃项目" value={activeProjects} delta="+2" trend="up" color="from-primary to-primary-glow" sub={`总计 ${projects.length} 个`} />
        <KpiCard icon={Target} label="按时交付率" value={`${onTimeRate}%`} delta="+4.2%" trend="up" color="from-success to-teal" sub="本月 vs 上月" />
        <KpiCard icon={Briefcase} label="活跃成员" value={members.length} delta="+1" trend="up" color="from-purple to-pink" sub="平均负载 71%" />
        <KpiCard icon={AlertTriangle} label="风险项" value={overdue + healthDist[2].value} delta="-1" trend="down" color="from-warning to-destructive" sub="需高管关注" />
      </div>

      {/* 业务节奏 + 项目健康度 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="glass rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold tracking-tight flex items-center gap-2">
                <Crown className="h-4 w-4 text-warning" /> 集团交付节奏
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">按周累计完成 vs 新建任务</p>
            </div>
            <Badge variant="outline" className="rounded-md text-xs">本周</Badge>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={weekTrend}>
                <defs>
                  <linearGradient id="ex1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ex2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--warning))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--warning))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                <Area type="monotone" dataKey="完成" name="完成" stroke="hsl(var(--success))" strokeWidth={2.5} fill="url(#ex1)" />
                <Area type="monotone" dataKey="新建" name="新建" stroke="hsl(var(--warning))" strokeWidth={2.5} fill="url(#ex2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass rounded-2xl p-6">
          <h3 className="font-semibold tracking-tight">项目健康度</h3>
          <p className="text-xs text-muted-foreground mt-0.5 mb-4">{projects.length} 个项目实时评估</p>
          <div className="h-44">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={healthDist} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={3}>
                  {healthDist.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {healthDist.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: d.color }} />{d.name}</span>
                <span className="font-medium">{d.value} 个</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 部门负载 + AI 洞察 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="glass rounded-2xl p-6 lg:col-span-2">
          <h3 className="font-semibold tracking-tight">部门负载分布</h3>
          <p className="text-xs text-muted-foreground mt-0.5 mb-4">综合任务密度与人均工作时长</p>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={deptData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={70} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                <Bar dataKey="load" radius={[0, 8, 8, 0]}>
                  {deptData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-7 w-7 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <h3 className="font-semibold tracking-tight">AI 高管摘要</h3>
          </div>
          <div className="space-y-3 text-sm">
            <p className="text-foreground/85 leading-relaxed">
              本周整体交付 <b className="text-success">+12%</b>,但 <b className="text-warning">技术部</b> 与 <b className="text-warning">管理部</b> 负载已达 <b>88%</b>,建议:
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex gap-2"><span className="text-primary">●</span> 将「支付安全合规」延后 2 周,释放 2 名工程师</li>
              <li className="flex gap-2"><span className="text-primary">●</span> 「品牌年度焕新」需高管确认主视觉关键词</li>
              <li className="flex gap-2"><span className="text-primary">●</span> 「PCI-DSS 渗透测试」存在合规风险,建议升级</li>
            </ul>
            <Button variant="outline" className="w-full rounded-xl mt-2" size="sm">
              <FileCheck2 className="h-4 w-4 mr-1.5" /> 标记已审阅
            </Button>
          </div>
        </Card>
      </div>

      {/* 项目矩阵 + 推送历史 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="glass rounded-2xl p-6 lg:col-span-2">
          <h3 className="font-semibold tracking-tight mb-4">项目健康度矩阵</h3>
          <div className="space-y-2">
            {projects.map((p) => {
              const h = computeHealth(p.progress, p.status);
              const meta = healthMeta[h];
              const owner = getMember(p.ownerId);
              return (
                <div key={p.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/40 transition-colors">
                  <span className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: `hsl(${p.color} / 0.15)` }}>
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: `hsl(${p.color})` }} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{p.name}</span>
                      <Badge variant="outline" className="rounded-md text-[10px]">{p.tag}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">负责人 {owner.name} · 截止 {p.endDate}</div>
                  </div>
                  <div className="w-32">
                    <Progress value={p.progress} className="h-1.5" />
                    <div className="text-[10px] text-muted-foreground text-right mt-1">{p.progress}%</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-md font-medium ${meta.bg} ${meta.color} min-w-[44px] text-center`}>{meta.label}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold tracking-tight">最近 TG 推送</h3>
            <Send className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {tgLogs.slice(0, 4).map((l) => (
              <div key={l.id} className="p-3 rounded-xl bg-secondary/40 border border-border/40">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">{l.scheduleName}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${l.status === "success" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                    {l.status === "success" ? "已发送" : "失败"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{l.preview}</p>
                <div className="text-[10px] text-muted-foreground/70 mt-1.5">{l.sentAt} · {l.recipients} 位订阅者</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function KpiCard({ icon: Icon, label, value, delta, trend, color, sub }: any) {
  return (
    <Card className="glass rounded-2xl p-5 hover:shadow-elevated transition-all duration-500 ease-apple hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-soft`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <span className={`text-xs flex items-center gap-1 ${trend === "up" ? "text-success" : "text-destructive"}`}>
          {trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {delta}
        </span>
      </div>
      <div className="mt-4">
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
        <div className="text-sm text-muted-foreground mt-0.5">{label}</div>
        <div className="text-[11px] text-muted-foreground/70 mt-1">{sub}</div>
      </div>
    </Card>
  );
}
