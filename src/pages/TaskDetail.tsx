import { useParams, useNavigate } from "react-router-dom";
import { getTask, getMember, getProject, statusMeta, priorityMeta } from "@/data/mock";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Calendar, Tag, MessageSquare, Paperclip, Send, CheckSquare, Square } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { getAvatarColor } from "@/lib/avatarColors";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const t = getTask(id!);
  const [comment, setComment] = useState("");
  const [subs, setSubs] = useState(t?.subtasks ?? []);
  if (!t) return <div>任务不存在</div>;
  const m = getMember(t.assigneeId); const p = getProject(t.projectId);

  return (
    <>
      <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4">
        <ArrowLeft className="h-4 w-4" />返回
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card className="glass rounded-2xl p-7">
            <div className="flex items-center gap-2 text-xs mb-3">
              <button onClick={() => navigate(`/projects/${p.id}`)} className="text-muted-foreground hover:text-primary flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: `hsl(${p.color})` }} />{p.name}
              </button>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">#{t.id}</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight mb-3">{t.title}</h1>
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <span className={`text-xs px-2 py-1 rounded-lg ${statusMeta[t.status].color}`}>{statusMeta[t.status].label}</span>
              <span className={`text-xs px-2 py-1 rounded-lg ${priorityMeta[t.priority].color}`}>优先级 · {priorityMeta[t.priority].label}</span>
              {t.tags.map((g) => <span key={g} className="text-xs px-2 py-1 rounded-lg bg-secondary text-secondary-foreground">#{g}</span>)}
            </div>
            <p className="text-foreground/85 leading-relaxed">{t.description}</p>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">完成进度</span>
                <span className="text-sm text-muted-foreground">{t.progress}%</span>
              </div>
              <Progress value={t.progress} className="h-2" />
            </div>
          </Card>

          {subs.length > 0 && (
            <Card className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold tracking-tight">子任务</h3>
                <span className="text-xs text-muted-foreground">{subs.filter((s) => s.done).length} / {subs.length}</span>
              </div>
              <div className="space-y-1">
                {subs.map((s) => (
                  <button key={s.id} onClick={() => setSubs(subs.map((x) => x.id === s.id ? { ...x, done: !x.done } : x))}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/50 transition-colors text-left">
                    {s.done ? <CheckSquare className="h-4 w-4 text-primary" /> : <Square className="h-4 w-4 text-muted-foreground" />}
                    <span className={`text-sm ${s.done ? "line-through text-muted-foreground" : ""}`}>{s.title}</span>
                  </button>
                ))}
              </div>
            </Card>
          )}

          <Card className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold tracking-tight">评论 · {t.comments.length}</h3>
            </div>
            <div className="space-y-4 mb-4">
              {t.comments.map((c) => {
                const author = getMember(c.authorId);
                return (
                  <div key={c.id} className="flex gap-3">
                    <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${getAvatarColor(c.authorId)} flex items-center justify-center text-sm font-medium text-white shrink-0`}>{author.name.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-sm font-medium">{author.name}</span>
                        <span className="text-[11px] text-muted-foreground">{c.createdAt}</span>
                      </div>
                      <div className="text-sm bg-secondary/60 rounded-2xl rounded-tl-sm p-3">{c.content}</div>
                    </div>
                  </div>
                );
              })}
              {t.comments.length === 0 && <div className="text-sm text-muted-foreground py-6 text-center">还没有评论,留下第一条吧</div>}
            </div>
            <div className="flex items-center gap-2 bg-secondary/50 rounded-xl px-3 py-2">
              <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="输入评论,@ 提及成员" className="border-0 bg-transparent focus-visible:ring-0 px-0" />
              <Paperclip className="h-4 w-4 text-muted-foreground cursor-pointer" />
              <Button size="sm" className="rounded-lg h-8" disabled={!comment}><Send className="h-3.5 w-3.5" /></Button>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold mb-4">详情</h3>
            <div className="space-y-3.5 text-sm">
              <Field label="负责人">
                <button onClick={() => navigate(`/team/${m.id}`)} className="flex items-center gap-2 hover:text-primary">
                  <div className={`h-6 w-6 rounded-full bg-gradient-to-br ${getAvatarColor(m.id)} flex items-center justify-center text-xs font-medium text-white`}>{m.name.charAt(0)}</div>
                  <span>{m.name}</span>
                </button>
              </Field>
              <Field label="项目">
                <button onClick={() => navigate(`/projects/${p.id}`)} className="hover:text-primary">{p.name}</button>
              </Field>
              <Field label="状态"><span className={`px-2 py-0.5 rounded ${statusMeta[t.status].color}`}>{statusMeta[t.status].label}</span></Field>
              <Field label="优先级"><span className={`px-2 py-0.5 rounded ${priorityMeta[t.priority].color}`}>{priorityMeta[t.priority].label}</span></Field>
              <Field label="截止日期"><span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-muted-foreground" />{t.dueDate}</span></Field>
              <Field label="创建时间"><span className="text-muted-foreground">{t.createdAt}</span></Field>
              <Field label="标签"><div className="flex flex-wrap gap-1">{t.tags.map((g) => <span key={g} className="text-[11px] px-1.5 py-0.5 rounded bg-secondary"><Tag className="inline h-2.5 w-2.5 mr-0.5" />{g}</span>)}</div></Field>
            </div>
          </Card>

          <Card className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold mb-3">活动</h3>
            <div className="space-y-3 text-sm">
              {[
                { who: m.name, what: "更新了进度", when: "2 小时前" },
                { who: "陈一鸣", what: "调整了优先级为「紧急」", when: "昨天" },
                { who: m.name, what: "创建了任务", when: t.createdAt },
              ].map((a, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-2 w-2 mt-1.5 rounded-full bg-primary/40 shrink-0" />
                  <div className="flex-1">
                    <div><b>{a.who}</b> <span className="text-muted-foreground">{a.what}</span></div>
                    <div className="text-[11px] text-muted-foreground">{a.when}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

const Field = ({ label, children }: any) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-muted-foreground text-xs">{label}</span>
    <div>{children}</div>
  </div>
);
