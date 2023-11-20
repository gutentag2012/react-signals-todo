import {generateId, loadTodosFromLocalStorage, storeTodosInLocalStorage, Todo} from "@/utils/todos.ts";
import {batch, computed, Signal, signal} from "@preact/signals-react";

export type SignalizedTodo = Signal<Omit<Todo, "isPending"> & { isPending: Signal<boolean> }>
export type TodoItem = {
    id: Todo["id"],
    todo: SignalizedTodo
}

//region Global state
export const isLoading = signal(false)
export const todos = signal<Array<TodoItem>>([])
export const editTodo = signal<Omit<Todo, "isPending"> | undefined>(undefined)
//endregion

//region Computed State
export const numberOfFinishedTodos = computed(() => isLoading.value ? "-" : todos.value.filter(({todo}) => todo.value.status === "done").length);
export const numberOfOpenTodos = computed(() => isLoading.value ? "-" : todos.value.filter(({todo}) => todo.value.status === "todo").length);
export const numberOfPendingTodos = computed(() => isLoading.value ? "-" : todos.value.filter(({todo}) => todo.value.isPending).length);
//endregion

//region Helper Functions
const makeTodoItem = (todo: Todo): TodoItem => ({
    id: todo.id,
    todo: signal({
        ...todo,
        isPending: signal(todo.isPending ?? false)
    })
})

export const loadTodos = async () => {
    isLoading.value = true

    const responseTodos = await loadTodosFromLocalStorage()

    batch(() => {
        todos.value = responseTodos.map(makeTodoItem)
        isLoading.value = false
    })
}

const storeTodosItemsInLocalStorage = () => {
    const mappedTodos = todos.value.map(t => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {isPending, ...todoValue} = t.todo.peek()
        return todoValue
    })

    return storeTodosInLocalStorage(mappedTodos)
}
//endregion

//region Data Functions
export const addTodo = async (incomingTodo: Omit<Todo, "id" | "isPending">) => {
    const newItem: TodoItem = makeTodoItem({
        id: generateId(),
        ...incomingTodo,
        isPending: true
    })

    // Add the new item and store it
    todos.value = [...todos.peek(), newItem]
    await storeTodosItemsInLocalStorage()

    // Reset pending status
    newItem.todo.value.isPending.value = false
}

export const updateTodo = async (id: number, todo: Partial<Omit<Todo, "isPending">>) => {
    const todoItem = todos.peek().find(t => t.id === id)
    if (!todoItem) {
        return
    }

    batch(() => {
        // Update the todo
        todoItem.todo.value = {
            ...todoItem.todo.peek(),
            ...todo,
        }
        todoItem.todo.value.isPending.value = true
    })

    // Store the item
    await storeTodosItemsInLocalStorage()

    // Set pending status
    todoItem.todo.value.isPending.value = false
}

export const removeTodo = async (id: number) => {
    const todoItem = todos.peek().find(t => t.id === id)
    if (!todoItem) {
        return
    }

    todos.value = todos.peek().filter(t => t.id !== id)
    await storeTodosItemsInLocalStorage()
}
//endregion