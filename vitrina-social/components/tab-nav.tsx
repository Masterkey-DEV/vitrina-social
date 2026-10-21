"use client";

import { cn } from "@/lib/utils";
import { TABS_CONFIG, TabKey } from "@/const/tabs";

interface TabNavProps {
  activeTab: TabKey;
  setActiveTab: (id: TabKey) => void;
}

export function TabNav({ activeTab, setActiveTab }: TabNavProps) {
  return (
    <nav className="w-full border-b border-border bg-background/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-8 overflow-x-auto scrollbar-hide items-center justify-start md:justify-center">
          {TABS_CONFIG.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative pb-4 pt-4 text-sm font-semibold whitespace-nowrap transition-all duration-300 outline-none",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
                <div
                  className={cn(
                    "absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full transition-all duration-300",
                    isActive
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0",
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
