import { useState } from "react";

interface ProfileProps {
  name: string;
  intro: string;
  stack: string[];
}

function Profile({ name, intro, stack }: ProfileProps) {
  // TODO(human): useState로 좋아요(likes) 개수를 관리하고, 버튼을 눌러 1씩 늘려보세요.
  const [likes, setLikes] = useState(0)

  return (
    <>
      <div>{name}</div>
      <div>{intro}</div>
      <div>기술 스택: <ul>{stack.map((skill) => (<li key={skill}>{skill}</li>))}</ul></div>
      <div>좋아요: {likes} <button onClick={() => setLikes(likes + 1)}>클릭하세요!!</button></div>
    </>
  )
}

export default Profile;
