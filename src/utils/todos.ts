import {startOfDay} from "date-fns";
import parse from "date-fns/parse";

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

export type AddTodoModel = Omit<Todo, "id" | "isPending">

export const loadTodosFromLocalStorage = async (delay = 1_500): Promise<Todo[]> => {
    await new Promise(resolve => setTimeout(resolve, delay))

    const todos = localStorage.getItem("todos")
    if (todos) {
        return JSON.parse(todos)
    }
    return []
}

export const storeTodosInLocalStorage = async (todos: Todo[], delay = 1_000) => {
    await new Promise(resolve => setTimeout(resolve, delay))

    // We don't want to store the pending status
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const todosWithoutPending = todos.map(({isPending, ...todo}) => todo).sort((a, b) => b.id - a.id)
    localStorage.setItem("todos", JSON.stringify(todosWithoutPending))
}
export const generateId = () => {
    const currentIdRaw = localStorage.getItem("todos-id") ?? "0"
    const currentId = parseInt(currentIdRaw, 10)

    const newId = currentId + 1
    localStorage.setItem("todos-id", newId.toString())

    return newId
}

export const sortTodos = (a: Omit<Todo, "isPending">, b: Omit<Todo, "isPending">) => {
    if(a.status !== b.status) {
        return a.status === "todo" ? -1 : 1
    }

    const startOfDayValue = startOfDay(new Date())
    const aDate = a.date ? parse(a.date, "PPP", startOfDayValue) : undefined
    const bDate = b.date ? parse(b.date, "PPP", startOfDayValue) : undefined
    if (aDate && !bDate) {
        return -1
    } else if (!aDate && bDate) {
        return 1
    } else if (aDate && bDate && aDate.getTime() !== bDate.getTime()) {
        return bDate.getTime() - aDate.getTime()
    }

    if (a.importance === b.importance) {
        return a.label.localeCompare(b.label)
    }

    const aImportanceValue = ImportanceValues.indexOf(a.importance)
    const bImportanceValue = ImportanceValues.indexOf(b.importance)
    return bImportanceValue > aImportanceValue ? 1 : -1
}
