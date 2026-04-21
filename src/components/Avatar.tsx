import { getAvatarColor } from "@/lib/avatarColors";

interface AvatarProps {
  name: string;
  id: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  xs: "h-5 w-5 text-[10px]",
  sm: "h-6 w-6 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-12 w-12 text-lg",
  xl: "h-20 w-20 text-3xl",
};

export function Avatar({ name, id, size = "md", className = "" }: AvatarProps) {
  const colorClass = getAvatarColor(id);
  const sizeClass = sizeClasses[size];
  
  return (
    <div 
      className={`rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center font-medium text-white ${sizeClass} ${className}`}
    >
      {name.charAt(0)}
    </div>
  );
}
