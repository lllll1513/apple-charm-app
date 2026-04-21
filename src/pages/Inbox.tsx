import { PageHeader } from "@/components/PageHeader";
import { inbox as raw, getMember } from "@/data/mock";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { AtSign, UserPlus, MessageSquare, Clock, Bell, Check } from "lucide-react";

const iconMap = { mention: AtSign, assigned: UserPlus, comment: MessageSquare, due: Clock, system: Bell } as const;
const colorMap = {
  mention: "bg-primary/10 text-primary",
  assigned: "bg-purple/10 text-purple",
  comment: "bg-info/10 text-info",
  due: "bg-warning/10 text-warning",
  system: "bg-muted text-muted-foreground",
};

export default function InboxPage() {
  const [items, setItems] = useState(raw);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [selected, setSelected] = useState(items[0]);

  const list = filter === "unread" ? items.filter((i) => !i.read) : items;

  return (
    <>
      <PageHeader
        title="收件箱"
        description={`${items.filter((i) => !i.read).length} 条未读`}
        actions={<button onClick={() => setItems(items.map((i) => ({ ...i, read: true })))} className="text-sm text-primary hover:underline flex items-center gap-1"><Check className="h-4 w-4" />全部标为已读</button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card className="glass rounded-2xl p-2 lg:col-span-5 max-h-[70vh] overflow-auto scrollbar-thin">
          <div className="flex gap-1 p-1 mb-1">
            {[{ k: "all", l: "全部" }, { k: "unread", l: "未读" }].map((t) => (
              <button key={t.k} onClick={() => setFilter(t.k as any)}
                className={`px-3 py-1 rounded-lg text-sm transition ${filter === t.k ? "bg-card shadow-soft font-medium" : "text-muted-foreground hover:text-foreground"}`}>
                {t.l}
              </button>
            ))}
          </div>
          {list.map((i) => {
            const Icon = iconMap[i.type];
            const active = selected?.id === i.id;
            return (
              <button key={i.id} onClick={() => { setSelected(i); setItems(items.map((x) => x.id === i.id ? { ...x, read: true } : x)); }}
                className={`w-full text-left flex gap-3 p-3 rounded-xl mb-1 transition ${active ? "bg-primary/5 ring-1 ring-primary/20" : "hover:bg-secondary/50"}`}>
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${colorMap[i.type]}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm truncate ${!i.read ? "font-semibold" : ""}`}>{i.title}</span>
                    {!i.read && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                  </div>
                  <div className="text-xs text-muted-foreground truncate mt-0.5">{i.preview}</div>
                  <div className="text-[11px] text-muted-foreground/70 mt-1">{i.createdAt}</div>
                </div>
              </button>
            );
          })}
        </Card>

        <Card className="glass rounded-2xl p-7 lg:col-span-7 min-h-[70vh]">
          {selected ? (
            <>
              <div className="flex items-center gap-3 mb-5">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${colorMap[selected.type]}`}>
                  {(() => { const Icon = iconMap[selected.type]; return <Icon className="h-5 w-5" />; })()}
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold">{selected.title}</h2>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {selected.from !== "system" ? `来自 ${getMember(selected.from)?.name}` : "系统通知"} · {selected.createdAt}
                  </div>
                </div>
              </div>
              <div className="prose prose-sm max-w-none text-foreground/85">
                <p>{selected.preview}</p>
                <p className="text-muted-foreground">点击下方按钮跳转到相关内容查看详情。</p>
              </div>
              <div className="mt-6 flex gap-2">
                <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">查看详情</button>
                <button className="px-4 py-2 rounded-xl bg-secondary text-sm hover:bg-secondary/70 transition">归档</button>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">选择一条消息查看详情</div>
          )}
        </Card>
      </div>
    </>
  );
}
