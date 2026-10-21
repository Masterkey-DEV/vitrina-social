"use client";

import { useEffect, useState } from "react";
import { getFoundations } from "@/actions/foundation.actions";
import { Foundation } from "@/types/foundation";

import { FoundationsHeader } from "./FoundationsHeader";
import { FoundationsGrid } from "./FoundationsGrid";
import { FoundationsSkeleton } from "./FoundationsSkeleton";

export function FoundationsSection() {
  const [foundations, setFoundations] = useState<Foundation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getFoundations();

      if (result.success) {
        setFoundations(result.data);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <section className="px-4 py-20 md:py-28 max-w-7xl mx-auto">
      <FoundationsHeader />

      {loading ? (
        <FoundationsSkeleton />
      ) : (
        <FoundationsGrid foundations={foundations} />
      )}
    </section>
  );
}
