import { PageHeader } from "@/components/PageHeader";
import { tasks, getProject, statusMeta, priorityMeta } from "@/data/mock";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const ME = "u2"; // 林子安

export default function MyTasks() {
  const navigate = useNavigate();
  const mine = tasks.filter((t) => t.assigneeId === ME);

  const groups: Record<string, typeof mine> = {
    "今天到期": [], "本周到期": [], "之后": [], "已完成": [],
  };
  const today = new Date().toISOString().slice(0, 10);
  mine.forEach((t) => {
    if (t.status === "done") groups["已完成"].push(t);
    else if (t.dueDate <= today) groups["今天到期"].push(t);
    else if (t.dueDate <= "2026-04-27") groups["本周到期"].push(t);
    else groups["之后"].push(t);
  });

  return (
    <>
      <PageHeader title="我的任务" description={`你被指派了 ${mine.length} 项任务`} />

      <Tabs defaultValue="all">
        <TabsList className="rounded-xl bg-secondary/60 mb-5">
          <TabsTrigger value="all" className="rounded-lg">全部</TabsTrigger>
          <TabsTrigger value="today" className="rounded-lg">今天</TabsTrigger>
          <TabsTrigger value="week" className="rounded-lg">本周</TabsTrigger>
          <TabsTrigger value="done" className="rounded-lg">已完成</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {Object.entries(groups).map(([label, list]) => list.length > 0 && (
            <section key={label}>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold tracking-tight">{label}</h3>
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{list.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {list.map((t) => {
                  const p = getProject(t.projectId);
                  return (
                    <Card key={t.id} onClick={() => navigate(`/tasks/${t.id}`)}
                      className="glass rounded-2xl p-4 cursor-pointer hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300 ease-apple">
                      <div className="flex items-start justify-between mb-2">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${statusMeta[t.status].color}`}>{statusMeta[t.status].label}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${priorityMeta[t.priority].color}`}>{priorityMeta[t.priority].label}</span>
                      </div>
                      <h4 className="font-medium mb-1.5">{t.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <span className="h-2 w-2 rounded-full" style={{ background: `hsl(${p.color})` }} />
                        <span>{p.name}</span><span>·</span><span>{t.dueDate}</span>
                      </div>
                      <Progress value={t.progress} className="h-1.5" />
                    </Card>
                  );
                })}
              </div>
            </section>
          ))}
        </TabsContent>
        {["today", "week", "done"].map((k) => (
          <TabsContent key={k} value={k}>
            <Card className="glass rounded-2xl p-12 text-center text-muted-foreground">切换到「全部」查看分组视图</Card>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
