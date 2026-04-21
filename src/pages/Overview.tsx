import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { tasks, projects, members, weekTrend, statusMeta, getMember, getProject } from "@/data/mock";
import { Activity, CheckCircle2, Clock, Sparkles, TrendingUp, Users } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart, CartesianGrid } from "recharts";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { getAvatarColor } from "@/lib/avatarColors";

const Stat = ({ icon: Icon, label, value, trend, color }: any) => (
  <Card className="glass border-white/40 p-5 rounded-2xl hover:shadow-elevated transition-all duration-500 ease-apple hover:-translate-y-0.5">
    <div className="flex items-start justify-between">
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <span className="text-xs text-success flex items-center gap-1"><TrendingUp className="h-3 w-3" />{trend}</span>
    </div>
    <div className="mt-4">
      <div className="text-3xl font-semibold tracking-tight">{value}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  </Card>
);

export default function Overview() {
  const navigate = useNavigate();
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const done = tasks.filter((t) => t.status === "done").length;
  const upcoming = [...tasks].filter((t) => t.status !== "done").sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 5);

  return (
    <>
      <PageHeader
        title="早上好,陈一鸣 👋"
        description={`今天是 ${new Date().toLocaleDateString("zh-CN", { weekday: "long", month: "long", day: "numeric" })} · 你有 ${inProgress} 项任务进行中`}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat icon={Activity} label="进行中任务" value={inProgress} trend="+12%" color="bg-gradient-to-br from-info to-primary" />
        <Stat icon={CheckCircle2} label="本周完成" value={done + 23} trend="+8%" color="bg-gradient-to-br from-success to-teal" />
        <Stat icon={Users} label="活跃成员" value={members.length} trend="+2" color="bg-gradient-to-br from-purple to-pink" />
        <Stat icon={Clock} label="平均周期" value="4.2d" trend="-0.6d" color="bg-gradient-to-br from-warning to-pink" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="glass border-white/40 p-6 rounded-2xl lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold tracking-tight">本周任务节奏</h3>
              <p className="text-xs text-muted-foreground mt-0.5">完成 vs 新建</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" />完成</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-purple" />新建</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={weekTrend}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--purple))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--purple))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                <Area type="monotone" dataKey="完成" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#g1)" />
                <Area type="monotone" dataKey="新建" stroke="hsl(var(--purple))" strokeWidth={2.5} fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass border-white/40 p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-7 w-7 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <h3 className="font-semibold tracking-tight">AI 今日聚焦</h3>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">
            你有 <b>2</b> 项紧急任务即将到期,建议优先处理「<button onClick={() => navigate("/tasks/t2")} className="text-primary hover:underline">登录态 Token 刷新机制</button>」。
            团队整体负载偏高(平均 73%),可考虑延后非关键设计任务。
          </p>
          <div className="mt-4 space-y-2">
            {[
              { label: "聚焦评审中任务", action: () => navigate("/tasks?status=review") },
              { label: "查看高负载成员", action: () => navigate("/workload") },
              { label: "生成本周日报", action: () => navigate("/daily") },
            ].map((a) => (
              <button key={a.label} onClick={a.action} className="w-full text-left text-sm px-3 py-2 rounded-xl hover:bg-secondary/70 transition-colors">
                → {a.label}
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="glass border-white/40 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold tracking-tight">即将到期</h3>
            <button onClick={() => navigate("/tasks")} className="text-xs text-primary hover:underline">查看全部</button>
          </div>
          <div className="space-y-2">
            {upcoming.map((t) => {
              const m = getMember(t.assigneeId); const p = getProject(t.projectId);
              return (
                <button key={t.id} onClick={() => navigate(`/tasks/${t.id}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/60 transition-colors text-left">
                  <span className={`h-2 w-2 rounded-full ${statusMeta[t.status].dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{t.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{p.name} · {t.dueDate}</div>
                  </div>
                  <div className={`h-7 w-7 rounded-full bg-gradient-to-br ${getAvatarColor(t.assigneeId)} flex items-center justify-center text-xs font-medium text-white`}>{m.name.charAt(0)}</div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="glass border-white/40 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold tracking-tight">活跃项目</h3>
            <button onClick={() => navigate("/projects")} className="text-xs text-primary hover:underline">查看全部</button>
          </div>
          <div className="space-y-3">
            {projects.filter((p) => p.status === "active").slice(0, 4).map((p) => (
              <button key={p.id} onClick={() => navigate(`/projects/${p.id}`)}
                className="w-full p-3 rounded-xl hover:bg-secondary/60 transition-colors text-left">
                <div className="flex items-center gap-3 mb-2">
                  <span className="h-3 w-3 rounded-full" style={{ background: `hsl(${p.color})` }} />
                  <span className="text-sm font-medium flex-1 truncate">{p.name}</span>
                  <span className="text-xs text-muted-foreground">{p.progress}%</span>
                </div>
                <Progress value={p.progress} className="h-1.5" />
              </button>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
