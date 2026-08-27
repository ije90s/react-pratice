// TODO(human): ProfileProps 인터페이스를 정의하고, Profile이 props를 받아 사용하도록 고치세요.
interface ProfileProps {
    name: string;
    intro: string;
    stack: string[];
}
function Profile({name, intro, stack}: ProfileProps) {
  return (
    <>
      <div>{name}</div>
      <div>{intro}</div>
      <div>기술 스택: <ul>{stack.map((skill) => (<li key={skill}>{skill}</li>))}</ul></div>
    </>
  )
}

export default Profile;
