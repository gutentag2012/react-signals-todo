export const ImportanceValues = ["low", "medium", "high"] as const
export type Importance = typeof ImportanceValues[number]

export interface Todo {
    id: Readonly<number>
    label: string
    importance: Importance
    status: "todo" | "done"
    date?: string

    isPending?: boolean
}

export const loadTodosFromLocalStorage = async (delay = 1_500): Promise<Todo[]> => {
    await new Promise(resolve => setTimeout(resolve, delay))

    const todos = localStorage.getItem("todos")
    if (todos) {
        return JSON.parse(todos)
    }
    return []
}

export const storeTodosInLocalStorage = async (todos: Todo[], delay=1_000) => {
    await new Promise(resolve => setTimeout(resolve, delay))

    // We don't want to store the pending status
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const todosWithoutPending = todos.map(({isPending, ...todo}) => todo)
    localStorage.setItem("todos", JSON.stringify(todosWithoutPending))
}
export const generateId = () => {
    const currentIdRaw = localStorage.getItem("todos-id") ?? "0"
    const currentId = parseInt(currentIdRaw, 10)

    const newId = currentId + 1
    localStorage.setItem("todos-id", newId.toString())

    return newId
}
