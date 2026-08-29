import { useEffect, useState, type FormEvent } from "react";

interface ProfileProps {
  name: string;
  intro: string;
  stack: string[];
}

function Profile({ name, intro, stack }: ProfileProps) {
  const [likes, setLikes] = useState(0);
  const [comment, setComment] = useState("");
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

  function handleCommentSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setComments([...comments, comment]);
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
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="한마디 남겨보세요"
        />
        <button type="submit">등록</button>
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
