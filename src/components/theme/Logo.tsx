import { useTheme } from "./ThemeProvider";

export function YuzLogo({ className = "h-8 w-auto" }: { className?: string }) {
  const { theme } = useTheme();
  // White logo for dark theme, color logo for light theme.
  // Falls back to text wordmark if asset missing.
  const src = theme === "dark" ? "/brand/logo_white.png" : "/brand/logo_color.png";
  return (
    <span className="inline-flex items-center gap-2">
      <img
        src={src}
        alt="YUZ"
        className={className}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      <span className="font-display text-lg font-semibold tracking-tight">YUZ</span>
    </span>
  );
}
