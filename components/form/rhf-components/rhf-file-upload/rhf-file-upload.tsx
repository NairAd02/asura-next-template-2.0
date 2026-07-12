"use client";
import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import {
  X,
  Upload,
  Loader2,
  FileText,
  FileSpreadsheet,
  FileImage,
  FileArchive,
  FileCode,
  FileAudio,
  FileVideo,
  File as FileIconGeneric,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  name: string;
  label?: string;
  maxSize?: number; // in bytes
  className?: string;
  error?: string;
  loading?: boolean;
  accept?: Record<string, string[]>;
  description?: string;
}

// Formatear tamaño de archivo
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
}

// Obtener icono según MIME type
function getFileIcon(mimeType: string, size: number = 40) {
  const className = `w-${size / 4} h-${size / 4}`;

  if (mimeType.startsWith("image/"))
    return <FileImage className={cn(className, "text-blue-500")} />;
  if (mimeType === "application/pdf")
    return <FileText className={cn(className, "text-red-500")} />;
  if (
    mimeType.includes("spreadsheet") ||
    mimeType.includes("excel") ||
    mimeType === "text/csv"
  )
    return <FileSpreadsheet className={cn(className, "text-green-600")} />;
  if (
    mimeType.includes("wordprocessing") ||
    mimeType.includes("msword") ||
    mimeType === "text/plain"
  )
    return <FileText className={cn(className, "text-blue-600")} />;
  if (
    mimeType.includes("zip") ||
    mimeType.includes("rar") ||
    mimeType.includes("compressed")
  )
    return <FileArchive className={cn(className, "text-yellow-600")} />;
  if (mimeType.startsWith("audio/"))
    return <FileAudio className={cn(className, "text-purple-500")} />;
  if (mimeType.startsWith("video/"))
    return <FileVideo className={cn(className, "text-pink-500")} />;
  if (
    mimeType.includes("json") ||
    mimeType.includes("xml") ||
    mimeType.includes("javascript") ||
    mimeType.includes("html")
  )
    return <FileCode className={cn(className, "text-orange-500")} />;

  return <FileIconGeneric className={cn(className, "text-gray-500")} />;
}

// Obtener extensión legible
function getFileExtension(fileName: string): string {
  const ext = fileName.split(".").pop()?.toUpperCase();
  return ext || "ARCHIVO";
}

// Obtener color de badge según extensión
function getExtensionColor(mimeType: string): string {
  if (mimeType.startsWith("image/"))
    return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
  if (mimeType === "application/pdf")
    return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
  if (
    mimeType.includes("spreadsheet") ||
    mimeType.includes("excel") ||
    mimeType === "text/csv"
  )
    return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
  if (mimeType.includes("wordprocessing") || mimeType.includes("msword"))
    return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
  if (mimeType.includes("zip") || mimeType.includes("compressed"))
    return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";
  if (mimeType.startsWith("audio/"))
    return "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300";
  if (mimeType.startsWith("video/"))
    return "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300";
  return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
}

// Generar descripción legible de los tipos aceptados
function getAcceptDescription(accept: Record<string, string[]>): string {
  const extensions: string[] = [];
  for (const exts of Object.values(accept)) {
    for (const ext of exts) {
      extensions.push(ext.replace(".", "").toUpperCase());
    }
  }
  return extensions.join(", ");
}

export function RHFFileUpload({
  name,
  label,
  maxSize = 10 * 1024 * 1024, // 10MB default
  className,
  error,
  loading = false,
  accept,
  description,
}: FileUploadProps) {
  const { setValue, watch, formState } = useFormContext();
  const value: File | undefined = watch(name);
  const fieldError = error || formState.errors[name]?.message;

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.length) {
        const file = acceptedFiles[0];
        setValue(name, file, { shouldValidate: true });
      }
    },
    [name, setValue],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      accept,
      maxSize,
      multiple: false,
      disabled: loading,
      onDrop,
    });

  // Crear preview si el archivo es una imagen
  useEffect(() => {
    if (!value || !(value instanceof File)) {
      const timeoutId = setTimeout(() => setImagePreview(null), 0);
      return () => clearTimeout(timeoutId);
    }
    if (value.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(value);
      const timeoutId = setTimeout(() => setImagePreview(objectUrl), 0);
      return () => {
        clearTimeout(timeoutId);
        URL.revokeObjectURL(objectUrl);
      };
    }

    const timeoutId = setTimeout(() => setImagePreview(null), 0);
    return () => clearTimeout(timeoutId);
  }, [value]);

  // Eliminar archivo
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;
    setValue(name, undefined, { shouldValidate: true });
    setImagePreview(null);
  };

  // Error de rechazo
  const fileRejectionError = fileRejections[0]?.errors[0]?.message;

  // Descripción de tipos aceptados
  const acceptedTypesText = accept
    ? getAcceptDescription(accept)
    : "Cualquier archivo";

  return (
    <div className={cn("space-y-2", className)}>
      {label && <p className="text-xs font-medium sm:text-sm">{label}</p>}

      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg transition-colors",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900/30",
          value ? "p-4" : "p-6 h-40",
          fieldError && "border-red-500",
          loading ? "cursor-wait opacity-70" : "cursor-pointer",
        )}
      >
        <input {...getInputProps()} disabled={loading} />

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-xs text-foreground sm:text-sm">Procesando archivo...</p>
            </div>
          </div>
        )}

        {value ? (
          /* --- Estado con archivo seleccionado --- */
          <div className="flex items-center gap-4 w-full">
            {/* Icono / Preview */}
            <div className="shrink-0">
              {imagePreview ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border bg-gray-50 dark:bg-gray-900/30">
                  <Image
                    src={imagePreview}
                    alt="Vista previa"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-16 h-16 rounded-lg border bg-gray-50 dark:bg-gray-900/30">
                  {getFileIcon(value.type)}
                </div>
              )}
            </div>

            {/* Info del archivo */}
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-xs font-medium truncate text-foreground sm:text-sm">
                {value.name}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium sm:text-xs",
                    getExtensionColor(value.type),
                  )}
                >
                  {getFileExtension(value.name)}
                </span>
                <span className="text-[10px] text-muted-foreground sm:text-xs">
                  {formatFileSize(value.size)}
                </span>
              </div>
            </div>

            {/* Botón eliminar */}
            <Button
              type="button"
              onClick={handleRemove}
              variant="destructive"
              size="sm"
              className="shrink-0 h-8 w-8 p-0 rounded-full"
              disabled={loading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          /* --- Estado vacío (drop zone) --- */
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            {isDragActive ? (
              <>
                <Upload className="w-10 h-10 text-primary" />
                <p className="text-xs text-foreground dark:text-foreground sm:text-sm">
                  Suelta el archivo aquí
                </p>
              </>
            ) : (
              <>
                <Upload
                  className={cn(
                    "w-10 h-10 text-primary",
                    loading && "opacity-50",
                  )}
                />
                <p className="text-xs text-foreground dark:text-secondary sm:text-sm">
                  {loading
                    ? "Espera mientras se procesa el archivo..."
                    : "Arrastra y suelta un archivo, o haz clic para seleccionar"}
                </p>
                <p className="text-[10px] text-foreground dark:text-foreground sm:text-xs">
                  {acceptedTypesText} hasta{" "}
                  {Math.round(maxSize / (1024 * 1024))}MB
                </p>
                {description && (
                  <p className="text-[10px] text-muted-foreground sm:text-xs">{description}</p>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Errores */}
      {(fieldError || fileRejectionError) && (
        <p className="text-xs text-red-500 sm:text-sm">
          {typeof fieldError === "string" ? fieldError : fileRejectionError}
        </p>
      )}
    </div>
  );
}
