import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { tasks, projects, members, weekTrend } from "@/data/mock";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

const statusData = ["todo", "in_progress", "review", "done"].map((s) => ({
  name: s === "todo" ? "待开始" : s === "in_progress" ? "进行中" : s === "review" ? "评审中" : "已完成",
  value: tasks.filter((t) => t.status === s).length,
}));
const colors = ["hsl(var(--muted-foreground))", "hsl(var(--info))", "hsl(var(--warning))", "hsl(var(--success))"];

const projectData = projects.map((p) => ({ name: p.name.slice(0, 6), 完成: p.progress, 剩余: 100 - p.progress }));
const radar = members.slice(0, 6).map((m) => ({ name: m.name, 负载: m.workload, 任务: tasks.filter((t) => t.assigneeId === m.id).length * 10 }));

export default function Reports() {
  return (
    <>
      <PageHeader title="报表" description="项目与团队效能数据洞察" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {[
          { l: "总任务", v: tasks.length, s: "+12 本周" },
          { l: "完成率", v: `${Math.round(tasks.filter((t) => t.status === "done").length / tasks.length * 100)}%`, s: "+5%" },
          { l: "平均周期", v: "4.2d", s: "-0.6d" },
          { l: "延期率", v: "8%", s: "-2%" },
        ].map((s) => (
          <Card key={s.l} className="glass rounded-2xl p-5">
            <div className="text-xs text-muted-foreground">{s.l}</div>
            <div className="text-2xl font-semibold mt-1">{s.v}</div>
            <div className="text-xs text-success mt-1">{s.s}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card className="glass rounded-2xl p-6">
          <h3 className="font-semibold tracking-tight mb-4">任务状态分布</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={4}>
                  {statusData.map((_, i) => <Cell key={i} fill={colors[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass rounded-2xl p-6 lg:col-span-2">
          <h3 className="font-semibold tracking-tight mb-4">本周新建 vs 完成</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={weekTrend}>
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                <Bar dataKey="created" fill="hsl(var(--purple))" radius={[8, 8, 0, 0]} />
                <Bar dataKey="done" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="glass rounded-2xl p-6">
          <h3 className="font-semibold tracking-tight mb-4">项目进度</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={projectData} layout="vertical">
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={70} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                <Bar dataKey="完成" stackId="a" fill="hsl(var(--primary))" radius={[0, 0, 0, 0]} />
                <Bar dataKey="剩余" stackId="a" fill="hsl(var(--secondary))" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass rounded-2xl p-6">
          <h3 className="font-semibold tracking-tight mb-4">团队效能雷达</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <RadarChart data={radar}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <PolarRadiusAxis tick={{ fontSize: 10 }} />
                <Radar name="负载" dataKey="负载" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                <Radar name="任务量" dataKey="任务" stroke="hsl(var(--purple))" fill="hsl(var(--purple))" fillOpacity={0.2} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </>
  );
}
