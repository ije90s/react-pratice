import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Section from "./Section";
import useAutoHide from "../hooks/useAutoHide";

interface ProfileProps {
  name: string;
  intro: string;
  stack: string[];
}

interface CommentFormState {
  author: string;
  text: string;
}

function Profile({ name, intro, stack }: ProfileProps) {
  const [likes, setLikes] = useState(0);
  const [form, setForm] = useState<CommentFormState>({ author: "", text: "" });
  const [comments, setComments] = useState<string[]>([]);
  const showSaved = useAutoHide(comments, 1000);

  useEffect(() => {
    document.title = likes > 0 ? `${name} (좋아요 ${likes})` : name;
  }, [likes, name]);

  function handleFormChange(e: ChangeEvent<HTMLInputElement>) {
    const obj = { [e.target.name]: e.target.value };
    setForm({...form, ...obj });
  }

  function handleCommentSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.author.trim() || !form.text.trim()) return;
    setComments([...comments, `${form.author}: ${form.text}`]);
    setForm({ author: "", text: "" });
  }

  return (
    <>
      <div>{name}</div>
      <div>{intro}</div>
      <div>기술 스택: <ul>{stack.map((skill) => (<li key={skill}>{skill}</li>))}</ul></div>
      <div>좋아요: {likes} <button onClick={() => setLikes(likes + 1)}>클릭하세요!!</button></div>
      <Section title="댓글">
        <form onSubmit={handleCommentSubmit}>
          <input
            type="text"
            name="author"
            value={form.author}
            onChange={handleFormChange}
            placeholder="이름"
          />
          <input
            type="text"
            name="text"
            value={form.text}
            onChange={handleFormChange}
            placeholder="한마디 남겨보세요"
          />
          <button type="submit" disabled={!form.author.trim() || !form.text.trim()}>
            등록
          </button>
        </form>
        {showSaved && <div>저장되었습니다 ✅</div>}
        {comments.length === 0 ? (
          <div>아직 댓글이 없어요</div>
        ) : (
          <ul>{comments.map((item, index) => (<li key={index}>{item}</li>))}</ul>
        )}
      </Section>
    </>
  )
}

export default Profile;
