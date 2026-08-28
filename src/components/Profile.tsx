import { useState, type FormEvent } from "react";

interface ProfileProps {
  name: string;
  intro: string;
  stack: string[];
}

function Profile({ name, intro, stack }: ProfileProps) {
  const [likes, setLikes] = useState(0);
  const [comment, setComment] = useState("");
  const [submittedComment, setSubmittedComment] = useState("");

  function handleCommentSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmittedComment(comment);
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
      {submittedComment && <div>남긴 말: {submittedComment}</div>}
    </>
  )
}

export default Profile;
