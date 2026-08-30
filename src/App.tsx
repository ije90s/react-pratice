import Profile from './components/Profile'
import TodoList from './components/TodoList'

function App() {
  return (
    <div>
      <h1>React 학습</h1>
      <Profile
        name="ㅇㅈㅇ"
        intro="Hello World"
        stack={["node", "react", "typescript"]}
      />
      <TodoList />
    </div>
  )
}

export default App
