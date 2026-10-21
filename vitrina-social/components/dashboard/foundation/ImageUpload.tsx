import { Upload, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
  placeholder?: string;
}

export function ImageUpload({
  file,
  onChange,
  placeholder = "Subir imagen",
}: ImageUploadProps) {
  return (
    <label
      className={cn(
        "flex items-center gap-3 cursor-pointer border border-dashed rounded-xl px-4 py-3 hover:border-primary/50 hover:bg-primary/5 transition-all group",
        file ? "border-primary/40 bg-primary/5" : "border-input",
      )}
    >
      {file ? (
        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
      ) : (
        <Upload className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
      )}
      <span className="text-sm text-muted-foreground truncate">
        {file ? file.name : placeholder}
      </span>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </label>
  );
}
