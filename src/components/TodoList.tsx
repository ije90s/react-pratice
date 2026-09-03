import { useState, type ChangeEvent, type FormEvent } from "react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

type FilterType = "all" | "active" | "completed";

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

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

  const remainingCount = todos.filter(todo => !todo.completed).length;

  const visibleTodos = todos.filter(todo => filter === "active" ? !todo.completed : filter === 'completed' ? todo.completed : todo);

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
      <div>
        <button onClick={() => setFilter("all")} disabled={filter === "all"}>전체</button>
        <button onClick={() => setFilter("active")} disabled={filter === "active"}>진행중</button>
        <button onClick={() => setFilter("completed")} disabled={filter === "completed"}>완료</button>
      </div>
      {visibleTodos.length === 0 ? (
        <div>할 일이 없어요</div>
      ) : (
        <ul>
          {visibleTodos.map((todo) => (
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
