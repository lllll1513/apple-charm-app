import { PageHeader } from "@/components/PageHeader";
import { members, tasks, projects } from "@/data/mock";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronDown, ChevronRight, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { getAvatarColor } from "@/lib/avatarColors";

export default function Workload() {
  const navigate = useNavigate();
  const sorted = [...members].sort((a, b) => b.workload - a.workload);
  const avg = Math.round(members.reduce((a, m) => a + m.workload, 0) / members.length);
  const [expandedMembers, setExpandedMembers] = useState<Set<string>>(new Set());

  const toggleMember = (memberId: string) => {
    const newExpanded = new Set(expandedMembers);
    if (newExpanded.has(memberId)) {
      newExpanded.delete(memberId);
    } else {
      newExpanded.add(memberId);
    }
    setExpandedMembers(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done": return <CheckCircle2 className="h-3.5 w-3.5 text-success" />;
      case "review": return <Clock className="h-3.5 w-3.5 text-info" />;
      case "wip": return <Clock className="h-3.5 w-3.5 text-warning" />;
      default: return <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

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
          const allMyTasks = tasks.filter((t) => t.assigneeId === m.id);
          const color = m.workload >= 85 ? "bg-destructive" : m.workload >= 70 ? "bg-warning" : "bg-success";
          const isExpanded = expandedMembers.has(m.id);
          
          // 获取成员参与的项目及进度
          const memberProjects = projects.filter(p => 
            tasks.some(t => t.assigneeId === m.id && t.projectId === p.id)
          ).map(p => {
            const projectTasks = tasks.filter(t => t.projectId === p.id && t.assigneeId === m.id);
            const completedTasks = projectTasks.filter(t => t.status === "done").length;
            const progress = projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0;
            return { ...p, memberProgress: progress, memberTaskCount: projectTasks.length };
          });

          return (
            <Card key={m.id} className="glass rounded-2xl overflow-hidden transition-all">
              <div 
                className="p-4 hover:bg-secondary/20 transition cursor-pointer" 
                onClick={() => toggleMember(m.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${getAvatarColor(m.id)} flex items-center justify-center text-base font-medium text-white`}>{m.name.charAt(0)}</div>
                    <div>
                      <div className="font-medium text-sm">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.role}</div>
                    </div>
                  </div>
                  <div className="flex-1 max-w-md">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">{myTasks.length} 项进行中任务</span>
                      <span className="font-semibold">{m.workload}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full ${color} transition-all duration-700 ease-apple rounded-full`} style={{ width: `${m.workload}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-border/40 bg-secondary/10 p-4">
                  {/* 项目进度 */}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-muted-foreground mb-3">参与项目 ({memberProjects.length})</h4>
                    <div className="space-y-2">
                      {memberProjects.map(p => (
                        <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg bg-card/50 hover:bg-card transition">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{p.name}</span>
                              <Badge variant="outline" className="text-[10px] rounded-md">{p.memberTaskCount} 任务</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress value={p.memberProgress} className="h-1.5 flex-1" />
                              <span className="text-xs text-muted-foreground font-medium w-10 text-right">{p.memberProgress}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 任务列表 */}
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground mb-3">任务列表 ({allMyTasks.length})</h4>
                    <div className="space-y-1.5">
                      {allMyTasks.map(t => {
                        const project = projects.find(p => p.id === t.projectId);
                        return (
                          <div 
                            key={t.id} 
                            className="flex items-center gap-2 p-2 rounded-lg bg-card/50 hover:bg-card transition cursor-pointer text-sm"
                            onClick={(e) => { e.stopPropagation(); navigate(`/tasks/${t.id}`); }}
                          >
                            {getStatusIcon(t.status)}
                            <span className="flex-1 truncate">{t.title}</span>
                            <Badge variant="outline" className="text-[10px] rounded-md">{project?.name}</Badge>
                            {t.progress !== undefined && (
                              <span className="text-xs text-muted-foreground">{t.progress}%</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </>
  );
}
