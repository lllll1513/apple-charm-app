import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { tgChannels, tgSchedules as initialSchedules, tgLogs as initialLogs, TgSchedule } from "@/data/rbac";
import { Send, Plus, Bot, Hash, Users, CheckCircle2, XCircle, Clock, Sparkles, Calendar, Eye, Trash2, Pencil } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const defaultTemplates: Record<string, { title: string; sample: string }> = {
  daily:   { title: "每日总结",   sample: "📊 *今日总结*\n\n✅ 完成任务: {done}\n🚧 进行中: {wip}\n⚠️ 延期: {late}\n\n详情查看 Lumin 工作台" },
  morning: { title: "早间播报",   sample: "🌅 *早安!今日待办*\n\n📋 待开始: {todo} 项\n🔥 高优先级: {high}\n\n点击查看个人任务清单" },
  evening: { title: "晚间总结",   sample: "🌆 *今日收官*\n\n✅ 已完成 {done}/{total}\n📈 完成率 {rate}%\n\n明日重点提醒已发送" },
  weekly:  { title: "周报摘要",   sample: "📅 *周报 · 第 {week} 周*\n\n本周完成: {done} 项 ({delta})\n核心项目进度:\n{projects}" },
  alert:   { title: "高危预警",   sample: "🚨 *风险提醒*\n\n任务「{task}」 已逾期 {days} 天\n负责人: {owner}\n关联项目: {project}" },
};

// 友好时间转 Cron(分钟 小时 * * 周)
const timeToCron = (hh: string, mm: string, weekday: string) => `${mm} ${hh} * * ${weekday}`;
const cronToTime = (cron: string) => {
  const p = cron.split(" ");
  return { mm: p[0] ?? "0", hh: p[1] ?? "9", weekday: p[4] ?? "*" };
};
const weekdayLabel = (w: string) => ({ "*": "每天", "1": "每周一", "2": "每周二", "3": "每周三", "4": "每周四", "5": "每周五", "6": "每周六", "0": "每周日" }[w] ?? w);

export default function Telegram() {
  const { can } = useAuth();
  const canManage = can("telegram", "edit");
  const canSend = can("telegram", "create");

  const [schedules, setSchedules] = useState(initialSchedules);
  const [logs, setLogs] = useState(initialLogs);
  const [templates, setTemplates] = useState(defaultTemplates);
  const [selectedTpl, setSelectedTpl] = useState<keyof typeof defaultTemplates>("daily");
  const [tplContent, setTplContent] = useState(defaultTemplates.daily.sample);
  const [editing, setEditing] = useState<TgSchedule | null>(null);

  const triggerNow = (s: TgSchedule) => {
    const ch = tgChannels.find((c) => c.id === s.channelId)!;
    const newLog = {
      id: `l${Date.now()}`,
      scheduleName: s.name,
      channelName: ch.name,
      status: "success" as const,
      sentAt: "刚刚",
      preview: templates[s.template].sample.split("\n")[0].replace(/\*/g, "").slice(0, 50) + "...",
      recipients: ch.members,
    };
    setLogs([newLog, ...logs]);
    toast.success(`已推送至 ${ch.name}`, { description: `${ch.members} 位订阅者将收到` });
  };

  const toggleSchedule = (id: string) => {
    if (!canManage) return toast.error("无权限");
    setSchedules(schedules.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  };

  const saveSchedule = (s: TgSchedule) => {
    setSchedules((prev) => prev.map((x) => (x.id === s.id ? s : x)));
    setEditing(null);
    toast.success("推送计划已更新", { description: `时间: ${s.cron} · 模板: ${templates[s.template].title}` });
  };

  const saveTemplate = () => {
    setTemplates({ ...templates, [selectedTpl]: { ...templates[selectedTpl], sample: tplContent } });
    toast.success("模板已保存");
  };
  const resetTemplate = () => {
    setTplContent(defaultTemplates[selectedTpl].sample);
    setTemplates({ ...templates, [selectedTpl]: { ...defaultTemplates[selectedTpl] } });
    toast.success("已恢复默认");
  };

  return (
    <>
      <PageHeader
        title="Telegram 推送"
        description="绑定 TG 频道与 Bot · 定时推送总结数据给集团与领导"
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-xl gap-1.5 shadow-soft" disabled={!canManage}>
                <Plus className="h-4 w-4" /> 新建推送计划
              </Button>
            </DialogTrigger>
            <NewScheduleDialog onCreate={(s) => { setSchedules([...schedules, s]); toast.success("推送计划已创建"); }} />
          </Dialog>
        }
      />

      {/* 顶部状态卡 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Bot}       label="Bot 状态"     value="@LuminReportBot" sub="✅ 在线" color="from-primary to-info" />
        <StatCard icon={Hash}      label="绑定频道"     value={tgChannels.length} sub={`共 ${tgChannels.reduce((s,c)=>s+c.members,0)} 订阅者`} color="from-purple to-pink" />
        <StatCard icon={Calendar}  label="活跃计划"     value={schedules.filter(s=>s.enabled).length} sub={`/ ${schedules.length} 个总计`} color="from-success to-teal" />
        <StatCard icon={Send}      label="今日已推送"   value={logs.filter(l => l.sentAt.includes("今天") || l.sentAt === "刚刚").length} sub="100% 成功率" color="from-warning to-pink" />
      </div>

      <Tabs defaultValue="schedules">
        <TabsList className="rounded-xl bg-secondary/60 mb-5">
          <TabsTrigger value="schedules" className="rounded-lg">推送计划</TabsTrigger>
          <TabsTrigger value="channels" className="rounded-lg">频道与 Bot</TabsTrigger>
          <TabsTrigger value="templates" className="rounded-lg">消息模板</TabsTrigger>
          <TabsTrigger value="logs" className="rounded-lg">推送历史</TabsTrigger>
        </TabsList>

        {/* 推送计划 */}
        <TabsContent value="schedules">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schedules.map((s) => {
              const ch = tgChannels.find((c) => c.id === s.channelId)!;
              const tpl = templates[s.template];
              return (
                <Card key={s.id} className={`glass rounded-2xl p-5 transition-all ${!s.enabled ? "opacity-60" : "hover:shadow-elevated hover:-translate-y-0.5"}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/15 to-purple/15 flex items-center justify-center">
                        <Send className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{s.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                          <Clock className="h-3 w-3" /> {s.cron} · 下次 {s.nextRun}
                        </div>
                      </div>
                    </div>
                    <Switch checked={s.enabled} onCheckedChange={() => toggleSchedule(s.id)} />
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/40 border border-border/40 mb-3">
                    <div className="flex items-center gap-2 text-xs mb-1.5">
                      <Hash className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{ch.name}</span>
                      <Badge variant="outline" className="rounded-md text-[10px] ml-auto">{ch.members} 订阅</Badge>
                    </div>
                    <div className="text-[11px] text-muted-foreground">模板: {tpl.title}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="rounded-lg flex-1" onClick={() => triggerNow(s)} disabled={!canSend}>
                      <Sparkles className="h-3.5 w-3.5 mr-1" /> 立即推送
                    </Button>
                    <Button size="sm" variant="ghost" className="rounded-lg" onClick={() => toast.info("预览已打开")}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" className="rounded-lg text-destructive hover:text-destructive" disabled={!canManage}
                      onClick={() => { setSchedules(schedules.filter(x => x.id !== s.id)); toast.success("已删除"); }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-3">上次执行: {s.lastRun}</div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* 频道与 Bot */}
        <TabsContent value="channels">
          <Card className="glass rounded-2xl p-6 mb-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-info flex items-center justify-center text-2xl">🤖</div>
              <div className="flex-1">
                <div className="font-semibold text-base">@LuminReportBot</div>
                <div className="text-xs text-muted-foreground">Lumin 集团数据推送机器人 · 已连接 {new Date().toLocaleDateString("zh-CN")}</div>
              </div>
              <Badge className="rounded-md bg-success/10 text-success hover:bg-success/15">在线</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Bot Token</label>
                <Input type="password" defaultValue="••••••••••••AAGcZi9w" className="rounded-xl bg-background/60 font-mono text-xs" disabled={!canManage} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Webhook URL</label>
                <Input defaultValue="https://lumin.app/api/tg/webhook" className="rounded-xl bg-background/60 font-mono text-xs" disabled />
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tgChannels.map((c) => (
              <Card key={c.id} className="glass rounded-2xl p-5 hover:shadow-elevated transition-all hover:-translate-y-0.5">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-info/20 to-primary/20 flex items-center justify-center">
                    {c.type === "channel" ? <Hash className="h-5 w-5 text-primary" /> : <Users className="h-5 w-5 text-primary" />}
                  </div>
                  <Badge variant={c.bound ? "default" : "outline"} className="rounded-md text-[10px]">
                    {c.bound ? "已绑定" : "未绑定"}
                  </Badge>
                </div>
                <div className="font-semibold truncate">{c.name}</div>
                <div className="text-xs text-muted-foreground font-mono mt-1 truncate">{c.chatId}</div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-3 pt-3 border-t border-border/40">
                  <Users className="h-3 w-3" /> {c.members} 位订阅者
                </div>
              </Card>
            ))}
            <Card className="rounded-2xl p-5 border-dashed border-2 border-border/60 bg-transparent flex items-center justify-center min-h-[160px] hover:border-primary/40 transition-colors cursor-pointer"
              onClick={() => toast.info("请将 Bot 添加为频道管理员", { description: "然后填入 chat_id 完成绑定" })}>
              <div className="text-center text-muted-foreground">
                <Plus className="h-6 w-6 mx-auto mb-1.5" />
                <div className="text-sm">绑定新频道</div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* 模板 */}
        <TabsContent value="templates">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="glass rounded-2xl p-4 lg:col-span-1">
              <div className="text-xs text-muted-foreground mb-2 px-2">模板列表</div>
              <div className="space-y-1">
                {Object.entries(templates).map(([k, t]) => (
                  <button key={k} onClick={() => { setSelectedTpl(k as any); setTplContent(t.sample); }}
                    className={`w-full text-left p-3 rounded-xl transition-colors ${selectedTpl === k ? "bg-primary/10 text-primary" : "hover:bg-secondary/60"}`}>
                    <div className="text-sm font-medium">{t.title}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 truncate">{t.sample.split("\n")[0]}</div>
                  </button>
                ))}
              </div>
            </Card>
            <Card className="glass rounded-2xl p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold">{templates[selectedTpl].title} · 编辑</div>
                <Badge variant="outline" className="rounded-md text-[10px]">支持 Markdown · 变量 {`{xxx}`}</Badge>
              </div>
              <Textarea value={tplContent} onChange={(e) => setTplContent(e.target.value)} className="rounded-xl font-mono text-sm min-h-[200px] bg-background/60" disabled={!canManage} />
              <div className="mt-4">
                <div className="text-xs text-muted-foreground mb-2">📱 TG 消息预览</div>
                <div className="rounded-2xl bg-gradient-to-br from-info/5 to-primary/5 border border-border/40 p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-info flex items-center justify-center text-base shrink-0">🤖</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-primary">Lumin Report Bot</div>
                      <div className="mt-1 p-3 rounded-2xl rounded-tl-sm bg-card border border-border/40 text-sm whitespace-pre-line">
                        {tplContent.replace(/\*([^*]+)\*/g, "$1")}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">刚刚 · 已读</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" className="rounded-xl" disabled={!canManage}>恢复默认</Button>
                <Button className="rounded-xl" onClick={() => toast.success("模板已保存")} disabled={!canManage}>保存模板</Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* 推送历史 */}
        <TabsContent value="logs">
          <Card className="glass rounded-2xl p-5">
            <div className="space-y-2">
              {logs.map((l) => (
                <div key={l.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/40 transition-colors">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${l.status === "success" ? "bg-success/10" : "bg-destructive/10"}`}>
                    {l.status === "success" ? <CheckCircle2 className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-destructive" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{l.scheduleName}</span>
                      <span className="text-xs text-muted-foreground">→ {l.channelName}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{l.preview}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-muted-foreground">{l.sentAt}</div>
                    <div className="text-[10px] text-muted-foreground/70 mt-0.5">{l.recipients} 订阅者</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }: any) {
  return (
    <Card className="glass rounded-2xl p-5 hover:shadow-elevated transition-all duration-500 ease-apple">
      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-soft mb-4`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      <div className="text-sm text-muted-foreground mt-0.5">{label}</div>
      <div className="text-[11px] text-muted-foreground/70 mt-1">{sub}</div>
    </Card>
  );
}

function NewScheduleDialog({ onCreate }: { onCreate: (s: TgSchedule) => void }) {
  const [name, setName] = useState("");
  const [cron, setCron] = useState("0 18 * * *");
  const [channelId, setChannelId] = useState("tg1");
  const [template, setTemplate] = useState<TgSchedule["template"]>("daily");

  return (
    <DialogContent className="rounded-2xl">
      <DialogHeader><DialogTitle>新建推送计划</DialogTitle></DialogHeader>
      <div className="space-y-4 py-2">
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">计划名称</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="例如:每日晚间总结" className="rounded-xl" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Cron 表达式</label>
            <Input value={cron} onChange={(e) => setCron(e.target.value)} className="rounded-xl font-mono" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">目标频道</label>
            <Select value={channelId} onValueChange={setChannelId}>
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {tgChannels.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">消息模板</label>
          <Select value={template} onValueChange={(v: any) => setTemplate(v)}>
            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(templates).map(([k, t]) => <SelectItem key={k} value={k}>{t.title}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button className="rounded-xl" onClick={() => name && onCreate({
          id: `ts${Date.now()}`, name, cron, channelId, template, enabled: true,
          lastRun: "—", nextRun: "待计算",
        })}>创建</Button>
      </DialogFooter>
    </DialogContent>
  );
}
