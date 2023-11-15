import {generateId, loadTodosFromLocalStorage, storeTodosInLocalStorage, Todo} from "@/utils/todos.ts";
import {batch, computed, Signal, signal} from "@preact/signals-react";
import {toast} from "@/components/ui/use-toast.ts";
import {ToastAction} from "@/components/ui/toast.tsx";

export type TodoItem = {
    id: Todo["id"],
    todo: Signal<Todo>
}

//region Global state
export const isLoading = signal(false)
export const todos = signal<Array<TodoItem>>([])
export const editTodo = signal<Todo | undefined>(undefined)
//endregion

export const loadTodos = async () => {
    isLoading.value = true

    const responseTodos = await loadTodosFromLocalStorage()

    batch(() => {
        todos.value = responseTodos.map(todo => ({
            id: todo.id,
            todo: signal(todo)
        }))

        isLoading.value = false
    })
}

//region Computed State
export const numberOfFinishedTodos = computed(() => isLoading.value ? "-" : todos.value.filter(({todo}) => todo.value.status === "done").length);
export const numberOfOpenTodos = computed(() => isLoading.value ? "-" : todos.value.filter(({todo}) => todo.value.status === "todo").length);
export const numberOfPendingTodos = computed(() => isLoading.value ? "-" : todos.value.filter(({todo}) => todo.value.isPending).length);
//endregion

const storeTodosItemsInLocalStorage = (todos: Array<TodoItem>) => {
    return storeTodosInLocalStorage(todos.map(t => t.todo.peek()))
}

export const addTodo = async (incomingTodo: Omit<Todo, "id" | "isPending">) => {
    const id = generateId()
    const newItem: TodoItem = {
        id,
        todo: signal({
            id,
            ...incomingTodo,
            isPending: true
        })
    }

    // Add the new item
    todos.value = [...todos.peek(), newItem]
    toast({
        title: "Todo added",
        description: "The todo has been added to the list",
        duration: 3000
    })

    // Store the item
    await storeTodosItemsInLocalStorage(todos.peek())

    // Reset pending status
    newItem.todo.value = {
        ...newItem.todo.peek(),
        isPending: false
    }
}

export const updateTodo = async (id: number, todo: Partial<Todo>) => {
    const todoItem = todos.peek().find(t => t.id === id)
    if (!todoItem) {
        return
    }

    // Update the todo
    todoItem.todo.value = {
        ...todoItem.todo.peek(),
        ...todo,
        isPending: true
    }
    toast({
        title: "Todo updated",
        description: "The todo has been updated",
        duration: 3000
    })

    // Store the item
    await storeTodosItemsInLocalStorage(todos.peek())

    // Set pending status
    todoItem.todo.value = {
        ...todoItem.todo.peek(),
        isPending: false
    }
}

export const removeTodo = async (id: number) => {
    const todoItem = todos.peek().find(t => t.id === id)
    if (!todoItem) {
        return
    }

    todos.value = todos.peek().filter(t => t.id !== id)
    await storeTodosItemsInLocalStorage(todos.peek())

    toast({
        title: "Todo removed",
        description: "The todo has been removed",
        variant: "destructive",
        action: <ToastAction altText="Undo" onClick={async () => {
            if(todos.peek().some(t => t.id === id)) {
               return
            }

            todoItem.todo.value = {
                ...todoItem.todo.peek(),
                isPending: true
            }
            todos.value = [...todos.peek(), todoItem]
            await storeTodosItemsInLocalStorage(todos.peek())

            todoItem.todo.value = {
                ...todoItem.todo.peek(),
                isPending: false
            }
        }}>
            Undo
        </ToastAction>
    })
}