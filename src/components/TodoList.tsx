import { useState, type ChangeEvent, type FormEvent } from "react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");

  function handleTextChange(e: ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
  }

  function handleAddSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!text.trim()) return;
    const newTodo: Todo = { id: crypto.randomUUID(), text, completed: false };
    setTodos([...todos, newTodo]);
    setText("");
  }

  // TODO(human): 아래 두 함수를 구현하세요.
  // toggleTodo: id가 일치하는 항목만 completed를 반전시킨 "새 객체"로 교체한 새 배열을 만들어 setTodos에 넘긴다.
  // deleteTodo: id가 일치하지 않는 항목만 남긴 새 배열을 만들어 setTodos에 넘긴다.
  function toggleTodo(id: string) {
    const newTodo = todos.map((item) => {
      if(item.id === id){
        return  {...item, completed: !item.completed }
      }else{
        return item;
      }
    });
    setTodos(newTodo);
  }

  function deleteTodo(id: string) {
    const newTodo = todos.filter(item => item.id !== id);
    setTodos(newTodo);
  }

  // TODO(human): remainingCount를 계산하세요.
  // todos 중 completed가 false인 항목의 개수를 구해서 아래 <p>에서 사용합니다.
  // 별도 useState 없이, 렌더링될 때마다 todos로부터 계산되는 "파생 값"으로 만드세요.
  const remainingCount = todos.filter(todo => !todo.completed).length;

  return (
    <div>
      <h2>할 일 목록</h2>
      <p>{remainingCount}개 남음</p>
      <form onSubmit={handleAddSubmit}>
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="할 일을 입력하세요"
        />
        <button type="submit" disabled={!text.trim()}>추가</button>
      </form>
      {todos.length === 0 ? (
        <div>할 일이 없어요</div>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <span
                style={{ textDecoration: todo.completed ? "line-through" : "none", cursor: "pointer" }}
                onClick={() => toggleTodo(todo.id)}
              >
                {todo.text}
              </span>
              <button onClick={() => deleteTodo(todo.id)}>삭제</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoList;
