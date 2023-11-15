import {useCallback, useEffect, useState} from "react";
import {AddTodoModel, generateId, loadTodosFromLocalStorage, storeTodosInLocalStorage, Todo} from "@/utils/todos.ts";
import {toast} from "@/components/ui/use-toast.ts";
import {ToastAction} from "@/components/ui/toast.tsx";

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

    const reload = useCallback(() => {
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
        toast({
            title: "Todo added",
            description: "The todo has been added to the list",
            duration: 3000
        })

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
        toast({
            title: "Todo updated",
            description: "The todo has been updated",
            duration: 3000
        })
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

        toast({
            title: "Todo removed",
            description: "The todo has been removed",
            variant: "destructive",
            action: <ToastAction altText="Undo" onClick={async () => {
                // We cant do this check here, since react only updates the value on the next render
                // if (todos.some(t => t.id === id)) {
                //     return
                // }

                setTodos([...newTodos, {...todoItem, isPending: true}])
                await storeTodosInLocalStorage([...newTodos, todoItem])

                setTodos(todos => [...todos].map(newTodo => {
                    if (newTodo.id !== todoItem.id) {
                        return newTodo;
                    }

                    return {
                        ...newTodo,
                        isPending: false
                    }
                }))

            }}>
                Undo
            </ToastAction>
        })
    }, [todos, addTodo])

    return [isLoading, todos, addTodo, updateTodo, removeTodo, reload] as const
}

type UseTodos = ReturnType<typeof useTodos>
export type AddTodo = UseTodos[2]
export type UpdateTodo = UseTodos[3]
export type RemoveTodo = UseTodos[4]