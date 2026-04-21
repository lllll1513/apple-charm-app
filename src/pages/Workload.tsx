import { PageHeader } from "@/components/PageHeader";
import { members, tasks } from "@/data/mock";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

export default function Workload() {
  const navigate = useNavigate();
  const sorted = [...members].sort((a, b) => b.workload - a.workload);
  const avg = Math.round(members.reduce((a, m) => a + m.workload, 0) / members.length);

  return (
    <>
      <PageHeader title="工作负载" description={`团队平均负载 ${avg}% · 红色为高负载成员`} />

      <Card className="glass rounded-2xl p-6 mb-5">
        <div className="flex items-end justify-between mb-2">
          <div>
            <div className="text-xs text-muted-foreground">团队平均负载</div>
            <div className="text-4xl font-semibold tracking-tight mt-1">{avg}%</div>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <div>高负载 (≥85%): {members.filter((m) => m.workload >= 85).length} 人</div>
            <div>低负载 (&lt;60%): {members.filter((m) => m.workload < 60).length} 人</div>
          </div>
        </div>
        <Progress value={avg} className="h-2 mt-3" />
      </Card>

      <div className="grid grid-cols-1 gap-2">
        {sorted.map((m) => {
          const myTasks = tasks.filter((t) => t.assigneeId === m.id && t.status !== "done");
          const color = m.workload >= 85 ? "bg-destructive" : m.workload >= 70 ? "bg-warning" : "bg-success";
          return (
            <Card key={m.id} className="glass rounded-2xl p-4 hover:shadow-elevated transition cursor-pointer" onClick={() => navigate(`/team/${m.id}`)}>
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-3 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-xl">{m.avatar}</div>
                  <div>
                    <div className="font-medium text-sm">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.role}</div>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">{myTasks.length} 项进行中任务</span>
                    <span className="font-semibold">{m.workload}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full ${color} transition-all duration-700 ease-apple rounded-full`} style={{ width: `${m.workload}%` }} />
                  </div>
                </div>
                <div className="col-span-3 flex items-center justify-end gap-1">
                  {myTasks.slice(0, 5).map((t, i) => (
                    <div key={t.id} className="h-6 w-6 rounded-md bg-secondary text-[10px] flex items-center justify-center" title={t.title}>{i + 1}</div>
                  ))}
                  {myTasks.length > 5 && <span className="text-xs text-muted-foreground ml-1">+{myTasks.length - 5}</span>}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
