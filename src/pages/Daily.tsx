import { PageHeader } from "@/components/PageHeader";
import { dailies, getMember } from "@/data/mock";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Smile, Meh, Frown, PartyPopper } from "lucide-react";

const moodMap = {
  great: { icon: PartyPopper, label: "状态绝佳", cls: "text-success bg-success/10" },
  good: { icon: Smile, label: "状态不错", cls: "text-info bg-info/10" },
  ok: { icon: Meh, label: "一般", cls: "text-warning bg-warning/10" },
  stuck: { icon: Frown, label: "卡住了", cls: "text-destructive bg-destructive/10" },
} as const;

export default function Daily() {
  return (
    <>
      <PageHeader
        title="日报"
        description="今天 4 位同事提交了日报"
        actions={<Button className="rounded-xl gap-1.5"><Plus className="h-4 w-4" />写日报</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dailies.map((d) => {
          const m = getMember(d.authorId);
          const mood = moodMap[d.mood];
          const MoodIcon = mood.icon;
          return (
            <Card key={d.id} className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary/20 to-purple/20 flex items-center justify-center text-base font-medium text-white">{m.name.charAt(0)}</div>
                <div className="flex-1">
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.role} · {d.date}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-lg flex items-center gap-1.5 ${mood.cls}`}>
                  <MoodIcon className="h-3.5 w-3.5" />{mood.label}
                </span>
              </div>
              <div className="space-y-3">
                <Section label="✅ 今日完成" text={d.done} />
                <Section label="📋 明日计划" text={d.todo} />
                <Section label="🚧 阻塞" text={d.blockers} />
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}

const Section = ({ label, text }: any) => (
  <div>
    <div className="text-xs text-muted-foreground mb-1">{label}</div>
    <div className="text-sm text-foreground/85 leading-relaxed">{text}</div>
  </div>
);
