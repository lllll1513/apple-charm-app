import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { tasks, getMember, getProject, statusMeta, priorityMeta, projects } from "@/data/mock";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Search, Filter } from "lucide-react";
import { useState, useMemo } from "react";
import { Progress } from "@/components/ui/progress";

export default function Tasks() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initStatus = params.get("status") ?? "all";
  const [status, setStatus] = useState(initStatus);
  const [project, setProject] = useState("all");
  const [q, setQ] = useState("");

  const list = useMemo(() => tasks.filter((t) =>
    (status === "all" || t.status === status) &&
    (project === "all" || t.projectId === project) &&
    t.title.toLowerCase().includes(q.toLowerCase())
  ), [status, project, q]);

  const tabs = [
    { key: "all", label: "全部", count: tasks.length },
    { key: "todo", label: "待开始", count: tasks.filter((t) => t.status === "todo").length },
    { key: "in_progress", label: "进行中", count: tasks.filter((t) => t.status === "in_progress").length },
    { key: "review", label: "评审中", count: tasks.filter((t) => t.status === "review").length },
    { key: "done", label: "已完成", count: tasks.filter((t) => t.status === "done").length },
  ];

  return (
    <>
      <PageHeader
        title="任务"
        description={`管理团队所有任务,共 ${tasks.length} 项`}
        actions={<Button className="rounded-xl gap-1.5"><Plus className="h-4 w-4" />新建任务</Button>}
      />

      <div className="glass rounded-2xl p-1 inline-flex gap-1 mb-4 flex-wrap">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setStatus(t.key)}
            className={`px-3 py-1.5 rounded-xl text-sm transition-all ${status === t.key ? "bg-card shadow-soft font-medium" : "text-muted-foreground hover:text-foreground"}`}>
            {t.label} <span className="ml-1 text-xs opacity-60">{t.count}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索任务" className="pl-9 h-9 rounded-xl bg-secondary/50 border-transparent" />
        </div>
        <select value={project} onChange={(e) => setProject(e.target.value)}
          className="h-9 rounded-xl bg-secondary/50 px-3 text-sm border-0 outline-none">
          <option value="all">全部项目</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <Button variant="outline" size="sm" className="rounded-xl gap-1.5"><Filter className="h-4 w-4" />更多</Button>
      </div>

      <Card className="glass rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-border/60 text-xs text-muted-foreground uppercase tracking-wider">
          <span className="col-span-5">任务</span>
          <span className="col-span-2">项目</span>
          <span className="col-span-1">优先级</span>
          <span className="col-span-2">进度</span>
          <span className="col-span-1">负责人</span>
          <span className="col-span-1 text-right">截止</span>
        </div>
        <div className="divide-y divide-border/40">
          {list.map((t) => {
            const m = getMember(t.assigneeId); const p = getProject(t.projectId);
            return (
              <button key={t.id} onClick={() => navigate(`/tasks/${t.id}`)}
                className="w-full grid grid-cols-12 gap-3 items-center px-5 py-3.5 hover:bg-secondary/40 transition-colors text-left">
                <div className="col-span-5 flex items-center gap-3 min-w-0">
                  <span className={`h-2 w-2 rounded-full shrink-0 ${statusMeta[t.status].dot}`} />
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{t.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{t.tags.map((g) => `#${g}`).join(" ")}</div>
                  </div>
                </div>
                <div className="col-span-2 flex items-center gap-2 min-w-0">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ background: `hsl(${p.color})` }} />
                  <span className="text-sm truncate">{p.name}</span>
                </div>
                <span className={`col-span-1 text-[10px] px-1.5 py-0.5 rounded justify-self-start ${priorityMeta[t.priority].color}`}>{priorityMeta[t.priority].label}</span>
                <div className="col-span-2 flex items-center gap-2"><Progress value={t.progress} className="h-1.5 flex-1" /><span className="text-xs text-muted-foreground w-9 text-right">{t.progress}%</span></div>
                <span className="col-span-1 text-xl">{m.avatar}</span>
                <span className="col-span-1 text-xs text-muted-foreground text-right">{t.dueDate.slice(5)}</span>
              </button>
            );
          })}
          {list.length === 0 && <div className="py-16 text-center text-muted-foreground text-sm">暂无符合条件的任务</div>}
        </div>
      </Card>
    </>
  );
}
