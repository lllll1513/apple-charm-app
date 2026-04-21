import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";

export default function Settings() {
  const [dark, setDark] = useState(false);

  return (
    <>
      <PageHeader title="设置" description="个人信息、外观与通知偏好" />

      <Tabs defaultValue="profile">
        <TabsList className="rounded-xl bg-secondary/60 mb-5">
          <TabsTrigger value="profile" className="rounded-lg">个人资料</TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-lg">外观</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg">通知</TabsTrigger>
          <TabsTrigger value="workspace" className="rounded-lg">工作区</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="glass rounded-2xl p-7 max-w-2xl">
            <div className="flex items-center gap-5 mb-6">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-purple flex items-center justify-center text-4xl">🧑‍💼</div>
              <div>
                <Button variant="outline" className="rounded-xl">更换头像</Button>
                <p className="text-xs text-muted-foreground mt-2">推荐 1:1 比例,小于 2MB</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="姓名"><Input defaultValue="陈一鸣" className="rounded-xl" /></Field>
              <Field label="花名"><Input defaultValue="Ethan" className="rounded-xl" /></Field>
              <Field label="邮箱" className="col-span-2"><Input defaultValue="chen@team.io" className="rounded-xl" /></Field>
              <Field label="部门"><Input defaultValue="产品部" className="rounded-xl" /></Field>
              <Field label="职位"><Input defaultValue="产品经理" className="rounded-xl" /></Field>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" className="rounded-xl">取消</Button>
              <Button className="rounded-xl">保存修改</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card className="glass rounded-2xl p-7 max-w-2xl">
            <Row label="深色模式" desc="跟随系统或手动切换"><Switch checked={dark} onCheckedChange={(v) => { setDark(v); document.documentElement.classList.toggle("dark", v); }} /></Row>
            <Row label="紧凑布局" desc="减小行间距,显示更多内容"><Switch /></Row>
            <Row label="侧边栏自动收起" desc="窗口较小时自动收起"><Switch defaultChecked /></Row>
            <div className="mt-6">
              <div className="text-sm font-medium mb-3">主题色</div>
              <div className="flex gap-2">
                {["211 100% 45%", "280 65% 60%", "340 82% 62%", "180 65% 45%", "36 100% 50%", "142 71% 45%"].map((c) => (
                  <button key={c} className="h-9 w-9 rounded-xl ring-2 ring-transparent hover:ring-foreground/20 transition" style={{ background: `hsl(${c})` }} />
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="glass rounded-2xl p-7 max-w-2xl">
            <Row label="@ 提及" desc="有人在评论中提到我"><Switch defaultChecked /></Row>
            <Row label="任务指派" desc="新任务被指派给我"><Switch defaultChecked /></Row>
            <Row label="任务到期" desc="任务即将到期 / 已逾期"><Switch defaultChecked /></Row>
            <Row label="项目动态" desc="我参与的项目有更新"><Switch /></Row>
            <Row label="周报推送" desc="每周一上午 9 点推送"><Switch defaultChecked /></Row>
          </Card>
        </TabsContent>

        <TabsContent value="workspace">
          <Card className="glass rounded-2xl p-7 max-w-2xl">
            <Field label="工作区名称"><Input defaultValue="Lumin 协作工作台" className="rounded-xl" /></Field>
            <Field label="工作区地址"><Input defaultValue="lumin.app/workspace/lumin" className="rounded-xl mt-3" disabled /></Field>
            <div className="mt-6 p-4 rounded-xl bg-destructive/5 border border-destructive/20">
              <div className="font-medium text-destructive mb-1">危险操作</div>
              <p className="text-sm text-muted-foreground mb-3">删除工作区将无法恢复,所有项目和任务都将丢失。</p>
              <Button variant="destructive" className="rounded-xl">删除工作区</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

const Field = ({ label, children, className }: any) => (
  <div className={className}>
    <label className="text-xs text-muted-foreground mb-1.5 block">{label}</label>
    {children}
  </div>
);
const Row = ({ label, desc, children }: any) => (
  <div className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
    <div>
      <div className="text-sm font-medium">{label}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
    </div>
    {children}
  </div>
);
