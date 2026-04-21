import { useParams, useNavigate } from "react-router-dom";
import { getMember, tasks, projects, statusMeta } from "@/data/mock";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Building2, MessageSquare } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function MemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const m = getMember(id!);
  if (!m) return <div>成员不存在</div>;
  const myTasks = tasks.filter((t) => t.assigneeId === id);
  const myProjects = projects.filter((p) => p.memberIds.includes(id!));

  return (
    <>
      <button onClick={() => navigate("/team")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4">
        <ArrowLeft className="h-4 w-4" />返回团队
      </button>

      <Card className="glass rounded-3xl p-8 mb-5 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
        <div className="relative flex items-start gap-5">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-4xl shadow-elevated">{m.avatar}</div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold tracking-tight">{m.name}</h1>
            <p className="text-muted-foreground mt-0.5">{m.role}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" />{m.email}</span>
              <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4" />{m.department}</span>
            </div>
          </div>
          <Button className="rounded-xl gap-1.5"><MessageSquare className="h-4 w-4" />发消息</Button>
        </div>

        <div className="relative grid grid-cols-3 gap-6 mt-7 pt-6 border-t border-border/60">
          <div>
            <div className="text-xs text-muted-foreground mb-1">当前负载</div>
            <div className="text-2xl font-semibold mb-2">{m.workload}%</div>
            <Progress value={m.workload} className="h-1.5" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">进行中任务</div>
            <div className="text-2xl font-semibold">{myTasks.filter((t) => t.status !== "done").length}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">参与项目</div>
            <div className="text-2xl font-semibold">{myProjects.length}</div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="glass rounded-2xl p-6">
          <h3 className="font-semibold tracking-tight mb-4">负责的任务</h3>
          <div className="space-y-2">
            {myTasks.map((t) => (
              <button key={t.id} onClick={() => navigate(`/tasks/${t.id}`)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/60 text-left transition-colors">
                <span className={`h-2 w-2 rounded-full ${statusMeta[t.status].dot}`} />
                <span className="flex-1 text-sm font-medium truncate">{t.title}</span>
                <span className="text-xs text-muted-foreground">{t.dueDate.slice(5)}</span>
              </button>
            ))}
          </div>
        </Card>
        <Card className="glass rounded-2xl p-6">
          <h3 className="font-semibold tracking-tight mb-4">参与的项目</h3>
          <div className="space-y-2">
            {myProjects.map((p) => (
              <button key={p.id} onClick={() => navigate(`/projects/${p.id}`)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/60 text-left transition-colors">
                <span className="h-3 w-3 rounded-full" style={{ background: `hsl(${p.color})` }} />
                <span className="flex-1 text-sm font-medium truncate">{p.name}</span>
                <span className="text-xs text-muted-foreground">{p.progress}%</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
