import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { projects, getMember, tasks } from "@/data/mock";
import { useNavigate } from "react-router-dom";
import { Plus, Search, LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

const statusLabel: Record<string, { text: string; cls: string }> = {
  active: { text: "进行中", cls: "bg-info/10 text-info" },
  planning: { text: "规划中", cls: "bg-purple/10 text-purple" },
  paused: { text: "暂停", cls: "bg-warning/10 text-warning" },
  completed: { text: "已完成", cls: "bg-success/10 text-success" },
};

export default function Projects() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const list = projects.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHeader
        title="项目"
        description={`共 ${projects.length} 个项目 · ${projects.filter((p) => p.status === "active").length} 进行中`}
        actions={<Button className="rounded-xl gap-1.5"><Plus className="h-4 w-4" />新建项目</Button>}
      />

      <div className="flex items-center gap-2 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索项目" className="pl-9 h-9 rounded-xl bg-secondary/50 border-transparent" />
        </div>
        <div className="flex items-center bg-secondary/60 rounded-xl p-1">
          <button onClick={() => setView("grid")} className={`p-1.5 rounded-lg transition ${view === "grid" ? "bg-card shadow-soft" : ""}`}><LayoutGrid className="h-4 w-4" /></button>
          <button onClick={() => setView("list")} className={`p-1.5 rounded-lg transition ${view === "list" ? "bg-card shadow-soft" : ""}`}><List className="h-4 w-4" /></button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map((p) => {
            const tCount = tasks.filter((t) => t.projectId === p.id).length;
            return (
              <Card
                key={p.id}
                onClick={() => navigate(`/projects/${p.id}`)}
                className="glass border-white/40 p-5 rounded-2xl cursor-pointer hover:shadow-elevated hover:-translate-y-1 transition-all duration-500 ease-apple group overflow-hidden relative"
              >
                <div
                  className="absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-30 blur-2xl group-hover:opacity-60 transition-opacity"
                  style={{ background: `hsl(${p.color})` }}
                />
                <div className="flex items-start justify-between mb-3 relative">
                  <div className="h-11 w-11 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-soft"
                    style={{ background: `linear-gradient(135deg, hsl(${p.color}), hsl(${p.color} / 0.6))` }}>
                    {p.name.slice(0, 1)}
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${statusLabel[p.status].cls}`}>{statusLabel[p.status].text}</span>
                </div>
                <h3 className="font-semibold tracking-tight mb-1">{p.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-[40px]">{p.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>{tCount} 个任务</span><span>{p.progress}%</span>
                </div>
                <Progress value={p.progress} className="h-1.5 mb-4" />
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {p.memberIds.slice(0, 4).map((id) => (
                      <div key={id} className="h-7 w-7 rounded-full bg-secondary ring-2 ring-card flex items-center justify-center text-sm">{getMember(id).avatar}</div>
                    ))}
                    {p.memberIds.length > 4 && (
                      <div className="h-7 w-7 rounded-full bg-secondary ring-2 ring-card flex items-center justify-center text-[10px] text-muted-foreground">+{p.memberIds.length - 4}</div>
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground">{p.endDate}</span>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="glass rounded-2xl overflow-hidden">
          <div className="divide-y divide-border/60">
            {list.map((p) => (
              <button key={p.id} onClick={() => navigate(`/projects/${p.id}`)}
                className="w-full grid grid-cols-12 gap-4 items-center px-5 py-4 hover:bg-secondary/40 transition-colors text-left">
                <div className="col-span-4 flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ background: `hsl(${p.color})` }} />
                  <span className="font-medium">{p.name}</span>
                </div>
                <span className={`col-span-2 text-[11px] px-2 py-0.5 rounded-full justify-self-start ${statusLabel[p.status].cls}`}>{statusLabel[p.status].text}</span>
                <div className="col-span-3"><Progress value={p.progress} className="h-1.5" /></div>
                <span className="col-span-1 text-sm text-muted-foreground">{p.progress}%</span>
                <span className="col-span-2 text-xs text-muted-foreground text-right">{p.endDate}</span>
              </button>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}
