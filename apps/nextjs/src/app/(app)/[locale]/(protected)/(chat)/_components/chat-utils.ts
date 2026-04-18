export const IMAGE_EXTENSIONS = new Set(["PNG", "JPG", "JPEG", "GIF", "WEBP"]);

export function getFileExtension(name: string): string {
  const parts = name.split(".");
  return parts.length > 1 ? (parts.pop() ?? "FILE").toUpperCase() : "FILE";
}

const SUBJECT_MAX_LENGTH = 80;

export function truncateSubject(text: string): string {
  const trimmed = text.trim();
  if (trimmed.length <= SUBJECT_MAX_LENGTH) return trimmed || "New chat";
  return trimmed.slice(0, SUBJECT_MAX_LENGTH - 1).trimEnd() + "…";
}

/** Survives SPA navigation within the same JS runtime. Cleared after use. */
export let pendingPayload: { text: string; files: File[] } | null = null;
export function setPendingPayload(payload: { text: string; files: File[] } | null) {
  pendingPayload = payload;
}
export function consumePendingPayload() {
  const p = pendingPayload;
  pendingPayload = null;
  return p;
}

/** Build message content with embedded file markers for chat display.
 *  Markers include file ID when available so cards can link to downloads. */
export function buildMessageWithFileMarkers(text: string, results: FileUploadResult[]): string {
  if (results.length === 0) return text;
  const markers = results
    .map(r =>
      r.id ? `\n\n--- File: ${r.filename} | ${r.id} ---\n` : `\n\n--- File: ${r.filename} ---\n`
    )
    .join("");
  return text + markers;
}

export interface FileUploadResult {
  success: boolean;
  filename: string;
  id?: string;
  file_size?: number;
  mime_type?: string;
}

/**
 * Upload files to the server, persisting them with the given thread.
 * Files are stored on disk and their metadata + extracted text saved to the DB.
 * The agent automatically picks up file context from the DB when processing messages.
 */
export async function uploadFiles(files: File[], threadId: string): Promise<FileUploadResult[]> {
  if (files.length === 0) return [];
  const { uploadFileApiV1FilesUploadPost } = await import("@packages/api-client");
  return Promise.all(
    files.map(async (file): Promise<FileUploadResult> => {
      try {
        const data = await uploadFileApiV1FilesUploadPost({
          thread_id: threadId,
          file: file as unknown as Blob,
        });
        return {
          success: true,
          id: data.id,
          filename: data.filename,
          file_size: data.file_size,
          mime_type: data.mime_type,
        };
      } catch {
        return { success: false, filename: file.name };
      }
    })
  );
}
