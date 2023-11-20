import {useCallback, useEffect, useMemo, useState} from "react";
import {
    AddTodoModel,
    generateId,
    ImportanceValues,
    loadTodosFromLocalStorage,
    storeTodosInLocalStorage,
    Todo
} from "@/utils/todos.ts";
import {startOfDay} from "date-fns";
import parse from "date-fns/parse";

//! Does reduce the number of renders for the todolist, but is not adviced to be used in a real world scenario!
export const useTodosBad = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [todos, setTodos] = useState<Todo[]>([])

    useEffect(() => {
        setIsLoading(true)
        loadTodosFromLocalStorage().then((todos) => {
            setTodos(todos)
            setIsLoading(false)
        })
    }, [])

    const addTodo = useCallback((incomingTodo: Omit<Todo, "id" | "isPending">) => {
        const todo = {
            id: generateId(),
            ...incomingTodo
        }
        // Add with pending status
        setTodos(todos => {
            const res = [...todos, {...todo, isPending: true}]

            //! It is not advised to use an async effect in a setState, this is only used to replicate the signals!
            storeTodosInLocalStorage(res).then(() => {
                // Add with done status
                setTodos(todos => [...todos].map(newTodo => {
                    if (newTodo.id !== todo.id) {
                        return newTodo;
                    }

                    return {
                        ...newTodo,
                        isPending: false
                    }
                }))
            })
            return res
        })
    }, [])

    const updateTodo = useCallback((id: number, todo: Partial<Todo>) => {
        setTodos(todos => {
            const newTodosPending = [...todos].map(newTodo => {
                if (newTodo.id !== id) {
                    return newTodo
                }

                return {...newTodo, ...todo, isPending: true}
            })

            //! It is not advised to use an async effect in a setState, this is only used to replicate the signals!
            storeTodosInLocalStorage(newTodosPending).then(() => {
                // Add with done status
                setTodos(todos => [...todos].map(newTodo => {
                    if (newTodo.id !== id) {
                        return newTodo;
                    }

                    return {
                        ...newTodo,
                        isPending: false
                    }
                }))
            })
            return newTodosPending
        })
    }, [])

    const removeTodo = useCallback((id: number) => {
        setTodos(todos => {
            const newTodos = [...todos].filter(t => t.id !== id)

            //! It is not advised to use an async effect in a setState, this is only used to replicate the signals!
            storeTodosInLocalStorage(newTodos)
            return newTodos
        })
    }, [])

    return [isLoading, todos, addTodo, updateTodo, removeTodo] as const
}

export const useTodos = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [todos, setTodos] = useState<Todo[]>([])

    const sortedTodos = useMemo(() => {
        console.log("%c ↻ Recompute sortedTodos (hooks)", "color: #42dd89; font-weight: bold;")
        return todos.sort((aTodoValue, bTodoValue) => {
            const startOfDayValue = startOfDay(new Date())
            const aDate = aTodoValue.date ? parse(aTodoValue.date, "PPP", startOfDayValue) : undefined
            const bDate = bTodoValue.date ? parse(bTodoValue.date, "PPP", startOfDayValue) : undefined
            if (aDate && !bDate) {
                return -1
            } else if (!aDate && bDate) {
                return 1
            } else if (aDate && bDate && aDate.getTime() !== bDate.getTime()) {
                return bDate.getTime() - aDate.getTime()
            }

            if (aTodoValue.importance === bTodoValue.importance) {
                return aTodoValue.label.localeCompare(bTodoValue.label)
            }

            const aImportanceValue = ImportanceValues.indexOf(aTodoValue.importance)
            const bImportanceValue = ImportanceValues.indexOf(bTodoValue.importance)
            return bImportanceValue - aImportanceValue
        })
    }, [todos])

    const reload = useCallback(() => {
        console.log("%c ↻ Load Todos (hooks)", "color: #7dc50d; font-weight: bold;")
        setIsLoading(true)
        loadTodosFromLocalStorage().then((todos) => {
            setTodos(todos)
            setIsLoading(false)
        })
    }, [])

    useEffect(() => {
        reload()
    }, [reload])

    const addTodo = useCallback(async (incomingTodo: AddTodoModel) => {
        const todo = {
            id: generateId(),
            ...incomingTodo
        }
        // Add with pending status
        setTodos(todos => [...todos, {...todo, isPending: true}])

        await storeTodosInLocalStorage([...todos, todo])

        // Add with done status
        setTodos(todos => [...todos].map(newTodo => {
            if (newTodo.id !== todo.id) {
                return newTodo;
            }

            return {
                ...newTodo,
                isPending: false
            }
        }))
    }, [todos])

    const updateTodo = useCallback(async (id: number, todo: Partial<Todo>) => {
        const newTodosPending = [...todos].map(newTodo => {
            if (newTodo.id !== id) {
                return newTodo
            }

            return {...newTodo, ...todo, isPending: true}
        })
        setTodos(newTodosPending)
        await storeTodosInLocalStorage(newTodosPending)

        // Add with done status
        setTodos(todos => [...todos].map(newTodo => {
            if (newTodo.id !== id) {
                return newTodo;
            }

            return {
                ...newTodo,
                isPending: false
            }
        }))
    }, [todos])

    const removeTodo = useCallback(async (id: number) => {
        const todoItem = todos.find(t => t.id === id)
        if (!todoItem) return

        const newTodos = [...todos].filter(t => t.id !== id)

        setTodos(newTodos)
        await storeTodosInLocalStorage(newTodos)
    }, [todos])

    return [isLoading, sortedTodos, addTodo, updateTodo, removeTodo, reload] as const
}

type UseTodos = ReturnType<typeof useTodos>
export type AddTodo = UseTodos[2]
export type UpdateTodo = UseTodos[3]
export type RemoveTodo = UseTodos[4]