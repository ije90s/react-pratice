import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import TodoItem from "./TodoItem";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

type FilterType = "all" | "active" | "completed";

const STORAGE_KEY = "todos";

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try{
      const getTodo = localStorage.getItem(STORAGE_KEY);
      if(getTodo === null){
        return [];
      }else{
        return JSON.parse(getTodo);
      }
    }catch {
      return [];
    }
  });
  const [text, setText] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

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
            <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoList;
