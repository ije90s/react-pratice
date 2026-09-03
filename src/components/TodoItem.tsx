import type { Todo } from "./TodoList";

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string) => void; 
    onDelete: (id: string) => void; 

}
function TodoItem({ todo, onToggle, onDelete } : TodoItemProps){
    return (
        <li key={todo.id}>
         <span style={{ textDecoration: todo.completed ? "line-through" : "none", cursor: "pointer" }}
       onClick={() => onToggle(todo.id)}>{todo.text}</span>
        <button onClick={() => onDelete(todo.id)}>삭제</button>
        </li>
    );
}

export default TodoItem;
