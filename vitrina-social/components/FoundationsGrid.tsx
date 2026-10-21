import { Foundation } from "@/types/foundation";
import { FoundationCard } from "./FoundationCard";

interface Props {
  foundations: Foundation[];
}

export function FoundationsGrid({ foundations }: Props) {
  if (!foundations.length) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-xl">
        <p className="text-muted-foreground">No foundations available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {foundations.map((foundation) => (
        <FoundationCard key={foundation.id} foundation={foundation} />
      ))}
    </div>
  );
}
