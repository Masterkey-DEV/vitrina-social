import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModalShellProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function ModalShell({ title, onClose, children }: ModalShellProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
          <h2 className="font-black text-xl">{title}</h2>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
