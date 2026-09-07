<div align="center">

# ⚡ React Readiness Lab: Todo App ⚡

### *A focused React 19 and TypeScript practice project for learning state, events, list rendering, conditional UI, and component styling through a working todo application.*

[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-41B883?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

</div>

## 🎯 Overview

This project is a small but complete todo application built to practise the React concepts that frequently appear in interviews and real frontend work.

The application lets a user:

- ➕ Add a new task.
- ✅ Mark a task as complete or incomplete.
- 🗑️ Remove a task from the list.
- 📊 See how many tasks remain.
- 📈 See completed-task progress.
- 🪧 See a helpful empty state when no tasks exist.
- 📱 Use the same interface on desktop and mobile screens.

The code is intentionally kept in a small number of files. That makes it possible to read the complete flow from the input event to the state update and finally to the rendered JSX.

---

## 🗂️ Complete File & Module Breakdown

Here is the purpose of each important file in the current repository:

### 🌐 Application Entry

* 📄 **`index.html`** — Provides the browser HTML document and the `root` element where React mounts.
* 📄 **`src/main.tsx`** — Starts React with `createRoot`, enables `StrictMode`, imports the global stylesheet, and renders `App`.
* 📄 **`src/App.tsx`** — The top-level application component. It imports and renders the `Todo` component.

### 🧩 Todo Feature

* 📄 **`src/components/Todo.tsx`** — Contains the todo data type, state, event handlers, derived progress values, conditional rendering, and accessible controls.
* 🎨 **`src/components/Todo.css`** — Styles the todo page, form, progress area, task rows, empty state, buttons, and mobile layout.

### 🎨 Global Styling

* 🎨 **`src/index.css`** — Defines global browser styles, the root container, base typography, and shared CSS variables from the Vite starter setup.
* 🎨 **`src/App.css`** — Existing starter stylesheet retained in the repository. The current `App.tsx` does not import it because the todo feature owns its styles in `Todo.css`.

### ⚙️ Build & Tooling

* 📄 **`package.json`** — Defines dependencies and the `dev`, `build`, `lint`, and `preview` scripts.
* 📄 **`tsconfig.json`** — Base TypeScript project configuration.
* 📄 **`tsconfig.app.json`** — TypeScript settings for the React application, including JSX and strict unused-code checks.
* 📄 **`tsconfig.node.json`** — TypeScript settings for Vite configuration files.
* 📄 **`eslint.config.js`** — Flat ESLint configuration for JavaScript, TypeScript, and React code.
* 📄 **`vite.config.ts`** — Vite configuration and React plugin setup.

---

## 🗺️ Feature Quick Reference

| Feature | React or TypeScript concept | File |
| :--- | :--- | :--- |
| Add a task | Controlled input and form submission | [`Todo.tsx`](src/components/Todo.tsx) |
| Store tasks | `useState<TodoItem[]>` | [`Todo.tsx`](src/components/Todo.tsx) |
| Render tasks | `.map()` and JSX list rendering | [`Todo.tsx`](src/components/Todo.tsx) |
| Complete a task | Button event and boolean state update | [`Todo.tsx`](src/components/Todo.tsx) |
| Remove a task | `filter()` and state replacement | [`Todo.tsx`](src/components/Todo.tsx) |
| Show progress | Derived values and inline width style | [`Todo.tsx`](src/components/Todo.tsx) |
| Empty list UI | Conditional rendering | [`Todo.tsx`](src/components/Todo.tsx) |
| Responsive design | CSS media query | [`Todo.css`](src/components/Todo.css) |
| Application startup | `StrictMode` and `createRoot` | [`main.tsx`](src/main.tsx) |

---

## 🧱 The Todo Data Model

The component defines the shape of one task before it creates any state:

```tsx
type TodoItem = {
    text: string
    completed: boolean
}
```

Every todo object must contain exactly the information needed by the interface:

| Property | Type | Purpose |
| :--- | :--- | :--- |
| `text` | `string` | The visible task description. |
| `completed` | `boolean` | Whether the task is finished. |

The type is then used when creating the list state:

```tsx
const [todos, setTodos] = useState<TodoItem[]>([])
```

The `TodoItem[]` annotation means that `todos` is an array of `TodoItem` objects. TypeScript can therefore catch mistakes such as adding a number to `text` or assigning a string to `completed` before the application runs.

The second state value stores the text currently being typed:

```tsx
const [newTodo, setNewTodo] = useState("")
```

This creates two separate responsibilities:

- `newTodo` represents temporary form input.
- `todos` represents the saved task collection.

Keeping these values separate makes the form predictable. Typing changes `newTodo`, while submitting the form copies a cleaned value into `todos`.

---

## 📝 Adding a Task

The input is controlled because its value comes from React state:

```tsx
<input
    id="new-todo"
    type="text"
    value={newTodo}
    placeholder="What needs your attention?"
    onChange={(event) => setNewTodo(event.target.value)}
/>
```

The complete flow is:

1. The user types into the input.
2. The browser fires the `change` event.
3. `event.target.value` is passed to `setNewTodo`.
4. React updates `newTodo` and re-renders the input with the new value.
5. The user submits the form by clicking **Add task** or pressing Enter.

The submit handler receives a typed form event:

```tsx
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
```

### Why each line matters

- `event.preventDefault()` stops the browser from refreshing the page during form submission.
- `trim()` removes unnecessary spaces from the beginning and end of the task.
- `if (text)` prevents blank tasks from being added.
- The functional `setTodos` form receives the latest state as `currentTodos`.
- The spread operator copies existing tasks into a new array.
- The new object starts with `completed: false`.
- `setNewTodo("")` clears the controlled input after a successful submission.

The functional state update is useful when the next value depends on the previous value. React can safely apply the update even when several updates are scheduled close together.

---

## 🔁 Rendering the Task List

When there are tasks, the component maps over the array:

```tsx
{todos.map((todo, index) => (
    <li
        className={`todo-item ${todo.completed ? "is-complete" : ""}`}
        key={`${todo.text}-${index}`}
    >
        ...
    </li>
))}
```

`.map()` creates one `<li>` for every item in `todos`. React uses the `key` to identify each rendered list item when the array changes.

The class name is conditional:

- An unfinished task receives `todo-item`.
- A finished task receives `todo-item is-complete`.
- The CSS for `.is-complete` adds the green check state and line-through text.

The task text is rendered from the typed object:

```tsx
<span className="todo-text">{todo.text}</span>
```

The component never renders the complete object directly. It selects the `text` property that the user should see.

---

## ✅ Completing and Removing Tasks

### Toggle completion

The circular button calls `handleToggle` with the task index:

```tsx
function handleToggle(index: number) {
    const newTodos = [...todos]
    newTodos[index].completed = !newTodos[index].completed
    setTodos(newTodos)
}
```

The `!` operator flips the boolean:

- `false` becomes `true`.
- `true` becomes `false`.

The button also exposes its state to assistive technology:

```tsx
aria-pressed={todo.completed}
```

Its label changes according to the current state, so a screen-reader user can understand the action:

```tsx
aria-label={todo.completed
    ? `Mark ${todo.text} as incomplete`
    : `Mark ${todo.text} as complete`}
```

### Remove a task

The **Remove** button creates a new array without the selected index:

```tsx
onClick={() =>
    setTodos(todos.filter((_, todoIndex) => todoIndex !== index))
}
```

`filter()` keeps every item whose index does not match the clicked item. React receives the new array and re-renders the list without that task.

### Practical improvement

For a larger production application, each task would usually have a permanent `id`. That would allow the list key and update operations to use an identifier rather than a text-and-index combination. This small practice app keeps the data model intentionally compact.

---

## 📊 Derived Progress Values

The component calculates display values from the task state instead of storing duplicate state:

```tsx
const completedCount = todos.filter((todo) => todo.completed).length
const remainingCount = todos.length - completedCount
const progress = todos.length === 0
    ? 0
    : (completedCount / todos.length) * 100
```

### What each value means

| Value | Meaning |
| :--- | :--- |
| `completedCount` | Number of tasks with `completed: true`. |
| `remainingCount` | Total tasks minus completed tasks. |
| `progress` | Completed tasks expressed as a percentage. |

The empty-list condition is important. Without it, dividing by zero would produce an invalid progress result. When no tasks exist, the progress is explicitly `0`.

The result is displayed in two places:

```tsx
<p className="task-count">
    {remainingCount} {remainingCount === 1 ? "task" : "tasks"} left
</p>
```

The ternary keeps the wording natural for both `1 task` and `2 tasks`.

The progress bar uses the percentage as an inline style:

```tsx
<div
    className="progress-bar"
    style={{ width: `${progress}%` }}
/>
```

This is an appropriate use of an inline style because the width is calculated dynamically from React state, while the permanent visual styling remains in CSS.

---

## 🪧 Conditional Rendering and Empty State

The list area chooses between two complete UI branches:

```tsx
{todos.length === 0 ? (
    <div className="empty-state">
        <h2>Your list is clear.</h2>
        <p>Add your first task above and start with one small win.</p>
    </div>
) : (
    <ul className="todo-list">
        ...
    </ul>
)}
```

This is conditional rendering with the ternary operator:

- When `todos.length === 0`, the empty state is shown.
- When at least one task exists, the `<ul>` and task rows are shown.

The footer also changes when every task is complete:

```tsx
{completedCount === todos.length && todos.length > 0
    ? "Everything is done. Nice work."
    : "One task at a time."}
```

The `todos.length > 0` check prevents the empty list from being described as completed. An empty list has no unfinished tasks, but it should not be presented as though the user completed work.

---

## 🎨 Styling Approach

`Todo.css` is imported directly by the feature component:

```tsx
import "./Todo.css"
```

This keeps the feature's styles next to its JSX. The stylesheet uses ordinary class selectors and a small set of variables:

```css
.todo-app {
    --green: #2f6b55;
    --dark: #202521;
    --gray: #77776e;
    --border: #e6e1d7;
}
```

The main visual groups are:

- `.todo-app` — page width, colors, padding, and typography.
- `.todo-header` — title and Today badge layout.
- `.todo-panel` — form and list container.
- `.input-row` — task input and Add button arrangement.
- `.summary` — remaining count and progress bar.
- `.todo-item` — one task row.
- `.is-complete` — completed task appearance.
- `.empty-state` — first-use message.
- `@media (max-width: 600px)` — mobile layout adjustments.

The desktop form places the input and button side by side. On smaller screens, the input and button stack vertically so the controls remain easy to use.

---

## 🚀 Application Startup Flow

The application starts in `src/main.tsx`:

```tsx
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
```

The startup sequence is:

1. Vite loads `index.html`.
2. `index.html` provides `<div id="root"></div>`.
3. `main.tsx` finds that element.
4. `createRoot` creates a React root.
5. `StrictMode` wraps the application during development.
6. React renders `<App />`.
7. `App.tsx` returns `<Todo />`.
8. `Todo.tsx` imports its own stylesheet and renders the todo interface.

`StrictMode` provides additional development checks. It does not change the production UI, but it helps reveal code that is not safe under React's development behavior.

The current `App.tsx` is intentionally small:

```tsx
import Todo from './components/Todo'

function App() {
    return <Todo />
}

export default App
```

This makes the feature boundary easy to see: `App` is the application shell and `Todo` owns the todo feature.

---

## 🧪 How to Study This Project

Use this project as an interactive interview-preparation notebook. Read the state first, then follow the event that changes it, and finally inspect the JSX that displays the result.

### 1️⃣ Start with the data model

Open [`Todo.tsx`](src/components/Todo.tsx) and identify `TodoItem`. Explain what each property means before reading the event handlers.

### 2️⃣ Follow one complete user action

For adding a task, trace this sequence:

```text
input text
    ↓
onChange
    ↓
newTodo state
    ↓
onSubmit
    ↓
TodoItem added to todos
    ↓
map() renders a new <li>
```

For completing a task, trace:

```text
check button click
    ↓
handleToggle(index)
    ↓
completed boolean flips
    ↓
derived counts recalculate
    ↓
CSS class and progress bar update
```

### 3️⃣ Change one thing at a time

Try changing one small behavior, predict the result, and then run the app:

- Change the placeholder text.
- Change the initial empty-state message.
- Add a `createdAt` property to `TodoItem`.
- Display the total number of tasks beside the remaining count.
- Replace the `Remove` text with an icon and an accessible label.
- Add a filter for all, active, and completed tasks.

After each experiment, explain which state value changed and why React re-rendered the affected UI.

---

## 🛠️ Available Commands

Run these commands from the project directory:

| Command | Purpose |
| :--- | :--- |
| `npm install` | Install all project dependencies. |
| `npm run dev` | Start Vite's development server with hot module replacement. |
| `npm run lint` | Check the project with ESLint. |
| `npm run build` | Run TypeScript validation and create the production bundle. |
| `npm run preview` | Serve the production bundle locally for a final preview. |

A useful verification sequence after editing the feature is:

```bash
npm run lint
npm run build
```

The build command runs `tsc -b` before `vite build`, so it checks both the TypeScript project and the production bundling process.

---

## 🎤 Interview Discussion Checklist

Use the project to practise answering these questions in your own words:

### State and forms

- What is the difference between `newTodo` and `todos`?
- Why is the input called a controlled input?
- Why should a form handler call `event.preventDefault()`?
- Why is `setTodos` called with a callback when adding a task?
- Why should blank input be rejected after trimming?

### Arrays and rendering

- How does `.map()` create one JSX element per task?
- Why does every list item need a `key`?
- What does the object spread operator do when adding a task?
- Why does `filter()` work well for removing a task?
- How would a permanent task ID improve the current key strategy?

### Events and accessibility

- What does `React.FormEvent<HTMLFormElement>` describe?
- Why does the completion control use a `<button>` instead of a plain `<div>`?
- What does `aria-pressed` communicate?
- Why does the button have a dynamic `aria-label`?
- Why should buttons have an explicit `type` inside a form?

### Derived data and conditional UI

- Why is progress calculated instead of stored as another state value?
- What happens when the list is empty and progress is calculated?
- How does the ternary choose between the empty state and task list?
- Why does the footer check both `completedCount === todos.length` and `todos.length > 0`?

### Styling and architecture

- Why is `Todo.css` imported by `Todo.tsx`?
- Which styles are reusable variables and which are component-specific rules?
- How does the media query change the form on small screens?
- Why is `App.tsx` kept as a thin composition component?
- What is the role of `StrictMode` in `main.tsx`?

---

## 🌳 Repository Tree

```text
my-basic-todo-app/
├── 📁 public/                         # Static public assets
├── 📁 src/
│   ├── 📄 App.tsx                     # Application shell rendering Todo
│   ├── 📄 main.tsx                    # React root and StrictMode setup
│   ├── 🎨 App.css                     # Retained Vite starter stylesheet
│   ├── 🎨 index.css                   # Global styles and root layout
│   ├── 📁 assets/                     # Starter image and SVG assets
│   └── 📁 components/
│       ├── 📄 Todo.tsx                 # Todo state, events, and JSX
│       └── 🎨 Todo.css                 # Todo feature styles
├── 📄 eslint.config.js                # ESLint flat configuration
├── 📄 index.html                      # Browser HTML template
├── 📄 package.json                    # Dependencies and npm scripts
├── 📄 README.md                       # Project documentation
├── 📄 tsconfig.json                   # Base TypeScript config
├── 📄 tsconfig.app.json               # Application TypeScript config
├── 📄 tsconfig.node.json              # Vite TypeScript config
└── 📄 vite.config.ts                  # Vite configuration
```

---

## 🚀 Next Practice Steps

The current implementation is deliberately local and simple. Natural next steps include:

- 💾 Persist todos in `localStorage` so they survive a page refresh.
- 🆔 Add an `id` property and use it for keys and updates.
- 🧹 Extract a reusable `TodoItem` child component.
- 🔎 Add all, active, and completed filters.
- ✏️ Add an edit mode for existing task text.
- 🗓️ Add a due date or priority field to `TodoItem`.
- 📦 Move state into a custom `useTodos` hook.
- 🧪 Add component tests for adding, completing, and removing tasks.
- ⚠️ Add validation feedback for duplicate or overly long tasks.

Each addition should preserve the same learning loop: define the type, update the state model, connect the event, render the new state, style the new UI, and run the validation commands.

---

## ✅ Definition of Done

The current todo feature is ready for discussion when you can:

- Explain the `TodoItem` type without looking at the code.
- Describe how controlled input state moves into the todo array.
- Explain why `preventDefault()` is used.
- Explain how completion changes both the row and the progress summary.
- Explain how `map()` and `filter()` are used for list operations.
- Describe the empty state and the completed-all footer condition.
- Explain the purpose of `aria-label` and `aria-pressed`.
- Explain how `App`, `main`, and `Todo` are connected.
- Make a small change without introducing a TypeScript error.
- Run `npm run lint` and `npm run build` successfully.

---

## 📚 Learning Philosophy

React readiness comes from repetition with feedback. Read the type, follow the event, observe the state transition, inspect the JSX, and explain the result aloud.

This todo app keeps the complete loop visible in one feature:

```text
user action
    ↓
typed event handler
    ↓
state update
    ↓
React re-render
    ↓
derived values and conditional JSX
    ↓
updated interface
```

The interface is small enough to understand completely, but rich enough to practise the foundations used in much larger React applications.