import { useAuth } from "@/hooks/useAuth";
import { allRoles, roleDefs } from "@/data/rbac";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Check, ShieldCheck, ChevronDown } from "lucide-react";

export function RoleSwitcher() {
  const { role, setRole } = useAuth();
  const def = roleDefs[role];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 h-9 px-3 rounded-xl hover:bg-secondary/70 transition-colors">
        <span className="h-6 w-6 rounded-lg flex items-center justify-center" style={{ background: `hsl(${def.color} / 0.15)` }}>
          <ShieldCheck className="h-3.5 w-3.5" style={{ color: `hsl(${def.color})` }} />
        </span>
        <span className="text-sm font-medium hidden md:inline">{def.label}</span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 rounded-xl">
        <DropdownMenuLabel className="text-xs text-muted-foreground">切换体验角色 (演示用)</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {allRoles.map((r) => {
          const d = roleDefs[r];
          return (
            <DropdownMenuItem key={r} onClick={() => setRole(r)} className="rounded-lg cursor-pointer flex items-start gap-3 py-2.5">
              <span className="h-7 w-7 rounded-lg flex items-center justify-center mt-0.5" style={{ background: `hsl(${d.color} / 0.15)` }}>
                <ShieldCheck className="h-4 w-4" style={{ color: `hsl(${d.color})` }} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium flex items-center gap-2">
                  {d.label}
                  {role === r && <Check className="h-3.5 w-3.5 text-primary" />}
                </div>
                <div className="text-[11px] text-muted-foreground leading-snug">{d.description}</div>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
