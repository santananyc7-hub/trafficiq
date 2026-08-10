import { cn } from "@/lib/cn";

/** Minimal, dependency-free SVG sparkline. */
export function Sparkline({
  data,
  width = 120,
  height = 32,
  className,
  strokeClass = "text-brand-500",
  fill = true,
  strokeWidth = 1.75,
}: {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
  strokeClass?: string;
  fill?: boolean;
  strokeWidth?: number;
}) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pad = 2;
  const stepX = (width - pad * 2) / (data.length - 1);
  const points = data.map((v, i) => {
    const x = pad + i * stepX;
    const y = pad + (height - pad * 2) * (1 - (v - min) / span);
    return [x, y] as const;
  });
  const line = points.map(([x, y]) => `${x},${y}`).join(" ");
  const area = `${pad},${height - pad} ${line} ${width - pad},${height - pad}`;
  const last = points[points.length - 1]!;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn(strokeClass, className)}
      aria-hidden="true"
    >
      {fill && <polygon points={area} fill="currentColor" fillOpacity={0.1} />}
      <polyline
        points={line}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last[0]} cy={last[1]} r={2.25} fill="currentColor" />
    </svg>
  );
}
