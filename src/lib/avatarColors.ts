// 为用户生成一致的头像颜色
// 使用较深的颜色确保白色文字清晰可见

const avatarColors = [
  { from: '#3b82f6', to: '#2563eb' }, // blue
  { from: '#a855f7', to: '#9333ea' }, // purple
  { from: '#ec4899', to: '#db2777' }, // pink
  { from: '#ef4444', to: '#dc2626' }, // red
  { from: '#f97316', to: '#ea580c' }, // orange
  { from: '#f59e0b', to: '#d97706' }, // amber
  { from: '#22c55e', to: '#16a34a' }, // green
  { from: '#14b8a6', to: '#0d9488' }, // teal
  { from: '#06b6d4', to: '#0891b2' }, // cyan
  { from: '#6366f1', to: '#4f46e5' }, // indigo
  { from: '#8b5cf6', to: '#7c3aed' }, // violet
  { from: '#d946ef', to: '#c026d3' }, // fuchsia
  { from: '#f43f5e', to: '#e11d48' }, // rose
  { from: '#10b981', to: '#059669' }, // emerald
  { from: '#0ea5e9', to: '#0284c7' }, // sky
];

// 根据用户ID或名字生成一致的颜色
export function getAvatarColor(identifier: string): string {
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % avatarColors.length;
  const color = avatarColors[index];
  return `linear-gradient(to bottom right, ${color.from}, ${color.to})`;
}
