import type { Initiative } from "@/types/member";

interface MemberStatsGridProps {
  initiatives: Initiative[];
}

export function MemberStatsGrid({ initiatives }: MemberStatsGridProps) {
  const uniqueFoundations = new Set(
    initiatives.map((i) => i.foundation?.siglas).filter(Boolean),
  ).size;

  const uniqueCategories = new Set(
    initiatives.flatMap(
      (i) => i.initiatives_categories?.map((c) => c.name) ?? [],
    ),
  ).size;

  const stats = [
    { value: initiatives.length, label: "Iniciativas unidas", highlight: true },
    {
      value: uniqueFoundations,
      label: "Fundaciones distintas",
      highlight: false,
    },
    {
      value: uniqueCategories,
      label: "Categorías",
      highlight: false,
      wide: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {stats.map(({ value, label, highlight, wide }) => (
        <div
          key={label}
          className={`bg-card border border-border rounded-2xl p-5 ${wide ? "col-span-2 sm:col-span-1" : ""}`}
        >
          <p
            className={`text-3xl font-black ${highlight ? "text-primary" : ""}`}
          >
            {value}
          </p>
          <p className="text-xs text-muted-foreground font-medium mt-1">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
