import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { ApiError } from "../api/client";
import type { FeedInput } from "../types/feed";

const MAX_IMAGES = 3; // 백엔드: FilesInterceptor('images', 3)
const MAX_SIZE = 5 * 1024 * 1024; // 백엔드: 파일당 5MB
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Props {
  initialValues?: { title: string; content: string; images: string[] }; // 없으면 작성 모드, 있으면 수정 모드
  submitLabel: string;
  onSubmit: (input: FeedInput) => Promise<void>; // 실패하면 throw — 에러 메시지는 이 폼이 표시
}

function FeedForm({ initialValues, submitLabel, onSubmit }: Props) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 선택한 파일의 미리보기 주소(blob URL)를 만들고, 파일이 바뀌거나 폼이 사라지면 해제한다.
  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  function handleFilesChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length > MAX_IMAGES) {
      setError(`이미지는 최대 ${MAX_IMAGES}장까지 선택할 수 있습니다.`);
      e.target.value = "";
      return;
    }
    if (selected.some((file) => file.size > MAX_SIZE)) {
      setError("이미지는 파일당 5MB 이하여야 합니다.");
      e.target.value = "";
      return;
    }
    setError("");
    setFiles(selected);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), content: content.trim(), images: files });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit = title.trim() !== "" && content.trim() !== "";
  const existingImages = initialValues?.images ?? [];

  return (
    <form onSubmit={handleSubmit}>
      <p>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목" />
      </p>
      <p>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="내용" />
      </p>
      <p>
        <input type="file" accept=".jpg,.jpeg,.png" multiple onChange={handleFilesChange} />
        <br />
        <small>최대 {MAX_IMAGES}장, 파일당 5MB, jpg/png</small>
      </p>
      {previews.length > 0 ? (
        <p>
          {previews.map((src) => (
            <img key={src} src={src} alt="미리보기" width={80} />
          ))}
        </p>
      ) : (
        existingImages.length > 0 && (
          <div>
            <p>
              {existingImages.map((path) => (
                <img key={path} src={`${BASE_URL}/${encodeURI(path)}`} alt="기존 이미지" width={80} />
              ))}
            </p>
            <small>새 이미지를 선택하면 기존 이미지가 모두 교체됩니다.</small>
          </div>
        )
      )}
      <p>
        <button type="submit" disabled={!canSubmit || submitting}>
          {submitting ? "저장 중..." : submitLabel}
        </button>
      </p>
      {error && <p>{error}</p>}
    </form>
  );
}

export default FeedForm;
