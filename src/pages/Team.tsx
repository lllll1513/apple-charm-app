import { PageHeader } from "@/components/PageHeader";
import { members, tasks } from "@/data/mock";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getAvatarColor } from "@/lib/avatarColors";

export default function Team() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const list = members.filter((m) => m.name.includes(q) || m.role.includes(q) || m.department.includes(q));

  const depts = Array.from(new Set(members.map((m) => m.department)));

  return (
    <>
      <PageHeader title="团队" description={`${members.length} 位成员 · ${depts.length} 个部门`} />

      <div className="relative max-w-xs mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索成员/部门" className="pl-9 h-9 rounded-xl bg-secondary/50 border-transparent" />
      </div>

      {depts.map((d) => {
        const ms = list.filter((m) => m.department === d);
        if (!ms.length) return null;
        return (
          <section key={d} className="mb-7">
            <h3 className="font-semibold tracking-tight mb-3 flex items-center gap-2">
              {d}<span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{ms.length}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {ms.map((m) => {
                const taskCount = tasks.filter((t) => t.assigneeId === m.id && t.status !== "done").length;
                return (
                  <Card key={m.id} onClick={() => navigate(`/team/${m.id}`)}
                    className="glass rounded-2xl p-5 cursor-pointer hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300 ease-apple">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 rounded-full flex items-center justify-center text-lg font-medium text-white" style={{ background: getAvatarColor(m.id) }}>{m.name.charAt(0)}</div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">{m.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{m.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{taskCount} 项任务</span>
                      <span className={`px-2 py-0.5 rounded-full ${m.workload >= 85 ? "bg-destructive/10 text-destructive" : m.workload >= 70 ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}`}>
                        负载 {m.workload}%
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        );
      })}
    </>
  );
}
