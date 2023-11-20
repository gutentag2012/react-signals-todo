import {
    generateId,
    loadTodosFromLocalStorage, sortTodos,
    storeTodosInLocalStorage,
    Todo
} from "@/utils/todos.ts";
import {batch, computed, Signal, signal} from "@preact/signals-react";

export type SignalizedTodo = Signal<Omit<Todo, "isPending"> & { isPending: Signal<boolean> }>

//region Global state
export const isLoading = signal(false)
export const todos = signal<Array<SignalizedTodo>>([])
export const editTodo = signal<Omit<Todo, "isPending"> | undefined>(undefined)
//endregion

//region Computed State
export const numberOfFinishedTodos = computed(() => isLoading.value ? "-" : todos.value.filter((todo) => todo.value.status === "done").length);
export const numberOfOpenTodos = computed(() => isLoading.value ? "-" : todos.value.filter((todo) => todo.value.status === "todo").length);
export const numberOfPendingTodos = computed(() => isLoading.value ? "-" : todos.value.filter((todo) => todo.value.isPending.value).length);

export const sortedTodos = computed(() => {
    console.log("%c ⏳ Recompute sortedTodos", "color: #42dd89; font-weight: bold;")
    return todos.value.slice().sort((a, b) => sortTodos(a.value, b.value))
})
//endregion

//region Helper Functions
const makeTodoItem = (todo: Todo): SignalizedTodo => {
    return signal({
        ...todo,
        isPending: signal(todo.isPending ?? false)
    })
}

export const loadTodos = async () => {
    console.log("%c 💾 Load Todos", "color: #7dc50d; font-weight: bold;")
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
        const {isPending, ...todoValue} = t.peek()
        return todoValue
    })

    return storeTodosInLocalStorage(mappedTodos)
}
//endregion

//region Data Functions
export const addTodo = async (incomingTodo: Omit<Todo, "id" | "isPending">) => {
    const newItem = makeTodoItem({
        id: generateId(),
        ...incomingTodo,
        isPending: true
    })

    // Add the new item and store it
    todos.value = [newItem, ...todos.peek()]
    await storeTodosItemsInLocalStorage()

    // Reset pending status
    newItem.value.isPending.value = false
}

export const updateTodo = async (id: number, todo: Partial<Omit<Todo, "isPending">>) => {
    const todoItem = todos.peek().find(t => t.peek().id === id)
    if (!todoItem) {
        return
    }

    batch(() => {
        // Update the todo
        todoItem.value = {
            ...todoItem.peek(),
            ...todo,
        }
        todoItem.value.isPending.value = true
    })

    // Store the item
    await storeTodosItemsInLocalStorage()

    // Set pending status
    todoItem.value.isPending.value = false
}

export const removeTodo = async (id: number) => {
    const todoItem = todos.peek().find(t => t.peek().id === id)
    if (!todoItem) {
        return
    }

    todos.value = todos.peek().filter(t => t.peek().id !== id)
    await storeTodosItemsInLocalStorage()
}
//endregion