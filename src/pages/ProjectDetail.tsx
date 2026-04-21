import { useParams, useNavigate } from "react-router-dom";
import { getProject, tasks, getMember, statusMeta, priorityMeta } from "@/data/mock";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Plus, MoreHorizontal } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const columns = [
  { key: "todo", label: "待开始" },
  { key: "in_progress", label: "进行中" },
  { key: "review", label: "评审中" },
  { key: "done", label: "已完成" },
] as const;

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const p = getProject(id!);
  if (!p) return <div>项目不存在</div>;
  const projectTasks = tasks.filter((t) => t.projectId === id);

  return (
    <>
      <button onClick={() => navigate("/projects")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4">
        <ArrowLeft className="h-4 w-4" />返回项目
      </button>

      <div className="relative rounded-3xl overflow-hidden mb-6 p-8 glass border-white/40">
        <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at 30% 20%, hsl(${p.color}), transparent 60%)` }} />
        <div className="relative flex items-start justify-between gap-6">
          <div className="flex items-start gap-4 min-w-0">
            <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-white text-2xl font-semibold shadow-elevated shrink-0"
              style={{ background: `linear-gradient(135deg, hsl(${p.color}), hsl(${p.color} / 0.7))` }}>
              {p.name.slice(0, 1)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-card/80 text-muted-foreground">{p.tag}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />{p.startDate} → {p.endDate}</span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">{p.name}</h1>
              <p className="text-muted-foreground mt-2 max-w-2xl">{p.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="icon" className="rounded-xl"><MoreHorizontal className="h-4 w-4" /></Button>
            <Button className="rounded-xl gap-1.5"><Plus className="h-4 w-4" />新建任务</Button>
          </div>
        </div>

        <div className="relative mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">进度</div>
            <div className="text-xl font-semibold mb-1">{p.progress}%</div>
            <Progress value={p.progress} className="h-1.5" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">任务</div>
            <div className="text-xl font-semibold">{projectTasks.length}</div>
            <div className="text-xs text-muted-foreground mt-1">{projectTasks.filter((t) => t.status === "done").length} 已完成</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">成员</div>
            <div className="flex -space-x-2 mt-1">
              {p.memberIds.map((id) => (
                <div key={id} className="h-8 w-8 rounded-full bg-card ring-2 ring-card/80 flex items-center justify-center text-base">{getMember(id).avatar}</div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">负责人</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl">{getMember(p.ownerId).avatar}</span>
              <div>
                <div className="text-sm font-medium">{getMember(p.ownerId).name}</div>
                <div className="text-xs text-muted-foreground">{getMember(p.ownerId).role}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="board">
        <TabsList className="rounded-xl bg-secondary/60">
          <TabsTrigger value="board" className="rounded-lg">看板</TabsTrigger>
          <TabsTrigger value="list" className="rounded-lg">列表</TabsTrigger>
          <TabsTrigger value="members" className="rounded-lg">成员</TabsTrigger>
          <TabsTrigger value="files" className="rounded-lg">文件</TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="mt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {columns.map((col) => {
              const items = projectTasks.filter((t) => t.status === col.key);
              return (
                <div key={col.key} className="glass rounded-2xl p-3 min-h-[200px]">
                  <div className="flex items-center justify-between px-2 py-1.5 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${statusMeta[col.key].dot}`} />
                      <span className="text-sm font-medium">{col.label}</span>
                      <span className="text-xs text-muted-foreground">{items.length}</span>
                    </div>
                    <Plus className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer" />
                  </div>
                  <div className="space-y-2">
                    {items.map((t) => {
                      const m = getMember(t.assigneeId);
                      return (
                        <button key={t.id} onClick={() => navigate(`/tasks/${t.id}`)}
                          className="w-full text-left bg-card rounded-xl p-3 shadow-soft hover:shadow-elevated transition-all duration-300 ease-apple hover:-translate-y-0.5 border border-border/50">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${priorityMeta[t.priority].color}`}>{priorityMeta[t.priority].label}</span>
                            <span className="text-[11px] text-muted-foreground">{t.dueDate.slice(5)}</span>
                          </div>
                          <div className="text-sm font-medium leading-snug mb-2">{t.title}</div>
                          <div className="flex items-center justify-between">
                            <Progress value={t.progress} className="h-1 flex-1 mr-2" />
                            <span className="text-base">{m.avatar}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-5">
          <Card className="glass rounded-2xl divide-y divide-border/60 overflow-hidden">
            {projectTasks.map((t) => {
              const m = getMember(t.assigneeId);
              return (
                <button key={t.id} onClick={() => navigate(`/tasks/${t.id}`)} className="w-full grid grid-cols-12 items-center gap-3 px-5 py-3 hover:bg-secondary/40 transition-colors text-left">
                  <span className={`col-span-1 text-[10px] px-1.5 py-0.5 rounded justify-self-start ${statusMeta[t.status].color}`}>{statusMeta[t.status].label}</span>
                  <span className="col-span-5 font-medium truncate">{t.title}</span>
                  <span className={`col-span-1 text-[10px] px-1.5 py-0.5 rounded justify-self-start ${priorityMeta[t.priority].color}`}>{priorityMeta[t.priority].label}</span>
                  <div className="col-span-3"><Progress value={t.progress} className="h-1.5" /></div>
                  <span className="col-span-1 text-lg justify-self-center">{m.avatar}</span>
                  <span className="col-span-1 text-xs text-muted-foreground text-right">{t.dueDate.slice(5)}</span>
                </button>
              );
            })}
          </Card>
        </TabsContent>

        <TabsContent value="members" className="mt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {p.memberIds.map((id) => {
              const m = getMember(id);
              return (
                <Card key={id} className="glass rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:shadow-elevated transition" onClick={() => navigate(`/team/${id}`)}>
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-2xl">{m.avatar}</div>
                  <div className="flex-1">
                    <div className="font-medium">{m.name}{id === p.ownerId && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">负责人</span>}</div>
                    <div className="text-xs text-muted-foreground">{m.role} · {m.department}</div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="files" className="mt-5">
          <Card className="glass rounded-2xl p-12 text-center text-muted-foreground">暂无文件 · 拖拽文件到此处上传</Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
