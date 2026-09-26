import { FileImage, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type UploadModalProps = {
  open: boolean;
  onClose: () => void;
  onUploaded: (draftId: string) => void;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadModal({ open, onClose }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(undefined);
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(nextPreviewUrl);
    return () => URL.revokeObjectURL(nextPreviewUrl);
  }, [file]);

  useEffect(() => {
    if (!open) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
      onMouseDown={event => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-modal-title"
        aria-describedby="upload-modal-description"
        className="w-full max-w-lg overflow-hidden rounded-t-2xl border bg-background shadow-2xl sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b px-5 py-4 sm:px-6">
          <div className="flex gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <FileImage className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="upload-modal-title" className="text-lg font-semibold tracking-tight">
                Add a recipe screenshot
              </h2>
              <p id="upload-modal-description" className="mt-1 text-sm leading-5 text-muted-foreground">
                Choose a clear photo with the title, ingredients, and directions visible.
              </p>
            </div>
          </div>
          <Button type="button" variant="ghost" size="icon" className="-mr-2 -mt-1 shrink-0" onClick={onClose}>
            <X aria-hidden="true" />
            <span className="sr-only">Close upload dialog</span>
          </Button>
        </div>

        <div className="grid gap-4 p-5 sm:p-6">
          {previewUrl && file ? (
            <div className="overflow-hidden rounded-xl border bg-muted/40">
              <img src={previewUrl} alt="Selected recipe screenshot" className="max-h-72 w-full object-contain" />
              <div className="flex items-center gap-3 border-t bg-background px-4 py-3">
                <FileImage className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
                  Replace
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="group flex min-h-56 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/30 px-6 py-10 text-center transition-colors hover:border-foreground/30 hover:bg-muted/60 focus-visible:outline-1 focus-visible:ring-4 focus-visible:ring-ring/20"
              onClick={() => inputRef.current?.click()}
            >
              <span className="flex size-12 items-center justify-center rounded-full border bg-background shadow-sm transition-transform group-hover:-translate-y-0.5">
                <Upload className="size-5" aria-hidden="true" />
              </span>
              <span className="mt-4 text-sm font-semibold">Choose a screenshot</span>
              <span className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
                PNG, JPEG, or WebP. You will review everything before it becomes a recipe.
              </span>
            </button>
          )}

          <input
            ref={inputRef}
            className="sr-only"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={event => setFile(event.target.files?.[0] ?? null)}
          />
        </div>

        <div className="flex flex-col-reverse gap-2 border-t bg-muted/30 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" disabled={!file}>
            <Upload aria-hidden="true" />
            Upload screenshot
          </Button>
        </div>
      </div>
    </div>
  );
}
