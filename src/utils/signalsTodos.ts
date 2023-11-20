import {
    generateId,
    ImportanceValues,
    loadTodosFromLocalStorage,
    storeTodosInLocalStorage,
    Todo
} from "@/utils/todos.ts";
import {batch, computed, Signal, signal} from "@preact/signals-react";
import parse from "date-fns/parse";
import {startOfDay} from "date-fns";

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
export const numberOfPendingTodos = computed(() => isLoading.value ? "-" : todos.value.filter(({todo}) => todo.value.isPending.value).length);

export const sortedTodos = computed(() => {
    console.log("%c ↻ Recompute sortedTodos (signals)", "color: #42dd89; font-weight: bold;")
    return todos.value.sort((a, b) => {
        const aTodoValue = a.todo.peek();
        const bTodoValue = b.todo.peek();

        const startOfDayValue = startOfDay(new Date())
        const aDate = aTodoValue.date ? parse(aTodoValue.date, "PPP", startOfDayValue) : undefined
        const bDate = bTodoValue.date ? parse(bTodoValue.date, "PPP", startOfDayValue) : undefined
        if(aDate && !bDate) {
            return -1
        } else if(!aDate && bDate) {
            return 1
        } else if(aDate && bDate && aDate.getTime() !== bDate.getTime()) {
            return bDate.getTime() - aDate.getTime()
        }

        if(aTodoValue.importance === bTodoValue.importance) {
            return aTodoValue.label.localeCompare(bTodoValue.label)
        }

        const aImportanceValue = ImportanceValues.indexOf(aTodoValue.importance)
        const bImportanceValue = ImportanceValues.indexOf(bTodoValue.importance)
        return bImportanceValue - aImportanceValue
    })
})
//endregion

//region Helper Functions
const makeTodoItem = (todo: Todo): TodoItem => {
    console.log("MakeTodoItem (signals)")
    const todoSignal = signal({
        ...todo,
        isPending: signal(todo.isPending ?? false)
    })

    return ({
        id: todo.id,
        todo: todoSignal
    });
}

export const loadTodos = async () => {
    console.log("%c ↻ Load Todos (signals)", "color: #7dc50d; font-weight: bold;")
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