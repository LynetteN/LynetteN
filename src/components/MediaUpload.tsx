import React, { useState, useRef } from "react";
import { Upload, Image as ImageIcon, Mic, X, FileAudio, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MediaUploadProps {
  onUpload: (file: File, type: "image" | "audio") => void;
  isAnalyzing: boolean;
}

export function MediaUpload({ onUpload, isAnalyzing }: MediaUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "audio" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      setFileType("image");
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
      onUpload(file, "image");
    } else if (file.type.startsWith("audio/")) {
      setFileType("audio");
      setPreview(file.name);
      onUpload(file, "audio");
    }
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const clear = () => {
    setPreview(null);
    setFileType(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          onDragEnter={onDrag}
          onDragLeave={onDrag}
          onDragOver={onDrag}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer hover:bg-muted/50",
            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*,audio/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <div className="text-center">
            <p className="font-semibold">Upload Evidence</p>
            <p className="text-sm text-muted-foreground">Screenshot or Voice Note</p>
          </div>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ImageIcon className="w-3 h-3" /> Images
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Mic className="w-3 h-3" /> Audio
            </div>
          </div>
        </div>
      ) : (
        <Card className="relative p-4 border-2 border-primary/20 bg-primary/5">
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background shadow-md hover:bg-destructive hover:text-destructive-foreground"
            onClick={clear}
            disabled={isAnalyzing}
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-4">
            {fileType === "image" ? (
              <div className="w-16 h-16 rounded-lg overflow-hidden border bg-background">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileAudio className="w-8 h-8 text-primary" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {fileType === "image" ? "Screenshot detected" : preview}
              </p>
              <p className="text-xs text-muted-foreground">
                {isAnalyzing ? "Analyzing with Gemini Flash..." : "Ready for analysis"}
              </p>
            </div>
            
            {isAnalyzing && (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
