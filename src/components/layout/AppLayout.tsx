import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { inbox } from "@/data/mock";
import { RoleSwitcher } from "@/components/RoleSwitcher";

export function AppLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const unread = inbox.filter((i) => !i.read).length;

  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full mesh-bg">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 px-4 sticky top-0 z-30 backdrop-blur-xl bg-background/60 border-b border-border/60">
            <SidebarTrigger className="rounded-lg" />
            <div className="flex-1" />
            <RoleSwitcher />
            <Button size="sm" className="rounded-xl gap-1.5 shadow-soft" onClick={() => navigate("/tasks?new=1")}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">新建</span>
            </Button>
            <button
              onClick={() => navigate("/inbox")}
              className="relative h-9 w-9 rounded-xl hover:bg-secondary flex items-center justify-center transition-colors"
              aria-label="收件箱"
            >
              <Bell className="h-[18px] w-[18px]" />
              {unread > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
              )}
            </button>
          </header>
          <main className="flex-1 overflow-auto scrollbar-thin">
            <div className="p-6 md:p-8 max-w-[1600px] mx-auto animate-fade-in">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
