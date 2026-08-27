function Profile() {
  // TODO(human): 이름, 한줄소개, 기술스택을 렌더링하는 JSX를 반환하세요.
  const myProfile = {
    name: "ㅇㅈㅇ",
    intro: "Hello World",
    stack: ["node", "react", "typescript"]
  };

  return (
  <>
    <div>이름: {myProfile.name}</div>
    <div>{myProfile.intro}</div>
    <div>기술 스택: <ul>{myProfile.stack.map((skill) => (<li key={skill}>{skill}</li>))}</ul></div>
  </>
  )
}

export default Profile;
