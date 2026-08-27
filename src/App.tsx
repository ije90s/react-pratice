import Profile from './components/Profile'

function App() {
  return (
    <div>
      <h1>React 학습</h1>
      <Profile
        name="ㅇㅈㅇ"
        intro="Hello World"
        stack={["node", "react", "typescript"]}
      />
    </div>
  )
}

export default App
