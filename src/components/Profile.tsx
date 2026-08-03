// TODO(human): Profile 컴포넌트를 작성하세요.
function Profile(){
    const ulStyle = {
        margin: 0,
        padding: 0
    }
    return (
        <div className="profileDetail">
            <div>이름: 임씨</div>
            <div>한줄 소개: Hello World!</div>
            <ul style={ulStyle}>
                <li>backend: node, typescript</li>
                <li>frontend: react</li>
                <li>devOps: github</li>
            </ul>
        </div>
    )
}

export default Profile;