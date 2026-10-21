export function FoundationsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-[400px] rounded-2xl bg-muted animate-pulse" />
      ))}
    </div>
  );
}
