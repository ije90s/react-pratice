import { useState, type ChangeEvent, type FormEvent } from "react";
import { ApiError } from "../api/client";
import type { ChallengeInput } from "../types/challenge";

// input의 값은 항상 문자열이라 폼 state는 전부 string으로 두고, 제출할 때 숫자로 바꾼다.
export interface ChallengeFormValues {
  type: string;
  mininum_count: string;
  title: string;
  content: string;
  start_date: string; // "YYYY-MM-DD" (<input type="date">의 값 형식)
  end_date: string;
}

const EMPTY_VALUES: ChallengeFormValues = {
  type: "0",
  mininum_count: "1",
  title: "",
  content: "",
  start_date: "",
  end_date: "",
};

interface Props {
  initialValues?: ChallengeFormValues; // 없으면 생성 모드, 있으면 수정 모드
  submitLabel: string;
  onSubmit: (input: ChallengeInput) => Promise<void>; // 실패하면 throw — 에러 메시지는 이 폼이 표시
}

function ChallengeForm({ initialValues = EMPTY_VALUES, submitLabel, onSubmit }: Props) {
  const [form, setForm] = useState<ChallengeFormValues>(initialValues);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSubmit({
        type: Number(form.type),
        mininum_count: Number(form.mininum_count),
        title: form.title.trim(),
        content: form.content.trim(),
        start_date: form.start_date,
        end_date: form.end_date,
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit =
    form.title.trim() !== "" &&
    form.content.trim() !== "" &&
    form.start_date !== "" &&
    form.end_date !== "" &&
    Number(form.mininum_count) >= 1;

  return (
    <form onSubmit={handleSubmit}>
      <p>
        <input name="title" value={form.title} onChange={handleChange} placeholder="제목" maxLength={30} />
      </p>
      <p>
        <textarea name="content" value={form.content} onChange={handleChange} placeholder="내용" />
      </p>
      <p>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="0">점수형</option>
          <option value="1">횟수형</option>
        </select>
      </p>
      <p>
        <label>
          최소 횟수{" "}
          <input name="mininum_count" type="number" min={1} value={form.mininum_count} onChange={handleChange} />
        </label>
      </p>
      <p>
        <label>
          시작일 <input name="start_date" type="date" value={form.start_date} onChange={handleChange} />
        </label>{" "}
        <label>
          종료일 <input name="end_date" type="date" value={form.end_date} onChange={handleChange} />
        </label>
      </p>
      <button type="submit" disabled={!canSubmit || submitting}>
        {submitting ? "저장 중..." : submitLabel}
      </button>
      {error && <p>{error}</p>}
    </form>
  );
}

export default ChallengeForm;
