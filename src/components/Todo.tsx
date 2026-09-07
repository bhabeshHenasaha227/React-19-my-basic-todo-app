import { useState } from "react"
import "./Todo.css"

type TodoItem = {
    text: string
    completed: boolean
}

export default function Todo() {
    const [newTodo, setNewTodo] = useState("")
    const [todos, setTodos] = useState<TodoItem[]>([])

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const text = newTodo.trim()

        if (text) {
            setTodos((currentTodos) => [
                ...currentTodos,
                { text, completed: false },
            ])
            setNewTodo("")
        }
    }

    function handleToggle(index: number) {
        const newTodos = [...todos]
        newTodos[index].completed = !newTodos[index].completed
        setTodos(newTodos)
    }

    const completedCount = todos.filter((todo) => todo.completed).length
    const remainingCount = todos.length - completedCount
    const progress = todos.length === 0 ? 0 : (completedCount / todos.length) * 100

    return (
        <main className="todo-app">
            <header className="todo-header">
                <div>
                    <p className="eyebrow">Daily rhythm</p>
                    <h1>Make space for what matters.</h1>
                    <p className="intro">A small list for the things worth finishing today.</p>
                </div>
                <div className="date-badge" aria-label="Today's focus">
                    <span className="date-dot" />
                    <span>Today</span>
                </div>
            </header>

            <section className="todo-panel" aria-label="Todo list">
                <form className="todo-form" onSubmit={handleSubmit}>
                    <label htmlFor="new-todo">Add a task</label>
                    <div className="input-row">
                        <input
                            id="new-todo"
                            type="text"
                            value={newTodo}
                            placeholder="What needs your attention?"
                            onChange={(event) => setNewTodo(event.target.value)}
                        />
                        <button className="add-button" type="submit">
                            Add task <span aria-hidden="true">+</span>
                        </button>
                    </div>
                </form>

                <div className="summary" aria-live="polite">
                    <div>
                        <p className="section-kicker">Your focus</p>
                        <p className="task-count">
                            {remainingCount} {remainingCount === 1 ? "task" : "tasks"} left
                        </p>
                    </div>
                    <div className="progress-wrap">
                        <span>{completedCount}/{todos.length || 0} complete</span>
                        <div className="progress-track" aria-hidden="true">
                            <div className="progress-bar" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                </div>

                {todos.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon" aria-hidden="true">+</div>
                        <h2>Your list is clear.</h2>
                        <p>Add your first task above and start with one small win.</p>
                    </div>
                ) : (
                    <ul className="todo-list">
                        {todos.map((todo, index) => (
                            <li className={`todo-item ${todo.completed ? "is-complete" : ""}`} key={`${todo.text}-${index}`}>
                                <button
                                    className="check-button"
                                    type="button"
                                    aria-label={todo.completed ? `Mark ${todo.text} as incomplete` : `Mark ${todo.text} as complete`}
                                    aria-pressed={todo.completed}
                                    onClick={() => handleToggle(index)}
                                >
                                    {todo.completed && <span aria-hidden="true">&#10003;</span>}
                                </button>
                                <span className="todo-text">{todo.text}</span>
                                <button className="delete-button" type="button" onClick={() => setTodos(todos.filter((_, todoIndex) => todoIndex !== index))}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
            <footer className="todo-footer">{completedCount === todos.length && todos.length > 0 ? "Everything is done. Nice work." : "One task at a time."}</footer>
        </main>
    )
}