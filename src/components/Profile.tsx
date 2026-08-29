import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

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
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    document.title = likes > 0 ? `${name} (좋아요 ${likes})` : name;
  }, [likes, name]);

  useEffect(() => {
    if (comments.length === 0) return;
    setShowSaved(true);
    const timer = setTimeout(() => setShowSaved(false), 1000);
    return () => clearTimeout(timer);
  }, [comments]);

  // TODO(human): author/text 두 input이 이 함수 하나를 공유합니다.
  // e.target.name(input의 name 속성)과 e.target.value를 이용해서
  // form 객체에서 해당 필드만 갱신하고 나머지 필드는 그대로 유지하도록 구현하세요.
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
    </>
  )
}

export default Profile;
