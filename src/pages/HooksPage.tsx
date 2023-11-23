import {memo, useMemo, useState} from "react";
import {RemoveTodo, UpdateTodo, useTodos} from "@/utils/useTodos.tsx";
import {Todo} from "@/utils/todos.ts";
import TodoItem, {TodoItemSkeleton} from "@/components/common/TodoItem.tsx";
import {TodoCard} from "@/components/common/TodoCard.tsx";
import {ExpensiveVolatileCounterComponentHooks} from "@/components/common/ExpensiveVolatileCounterComponent.tsx";
import {ExpensivePersistentCounterComponentHooks} from "@/components/common/ExpensivePersitentCounterComponent.tsx";
import {Button} from "@/components/ui/button.tsx";
import {RefreshCcw} from "lucide-react";
import {EditTodoDialog, TodoForm} from "@/components/common/TodoForm.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Switch} from "@/components/ui/switch.tsx";
import {Label} from "@/components/ui/label.tsx";

const MemoizedTodoItem = memo(TodoItem, (prevProps, nextProps) => {
    const functionsAreEqual = prevProps.removeTodo === nextProps.removeTodo && prevProps.updateTodo === nextProps.updateTodo
    const todosAreEqual = prevProps.todo.id === nextProps.todo.id && prevProps.todo.label === nextProps.todo.label && prevProps.todo.date === nextProps.todo.date && prevProps.todo.importance === nextProps.todo.importance && prevProps.todo.status === nextProps.todo.status && prevProps.todo.isPending === nextProps.todo.isPending
    return functionsAreEqual && todosAreEqual
})

const MemoizedTodoCard = memo(TodoCard)

function TodoList({todos, isLoading, removeTodo, updateTodo, onEditTodo}: {
    todos: Array<Todo>,
    isLoading: boolean,
    updateTodo: UpdateTodo,
    removeTodo: RemoveTodo,
    onEditTodo: (editTodo: Todo) => void
}) {
    if (!isLoading && !todos.length) {
        return (<p className="text-lg p-4 font-medium text-center">
            Nothing todo for you
        </p>)
    }

    if (isLoading) return <div className="flex flex-col gap-2">
        <TodoItemSkeleton/>
        <TodoItemSkeleton/>
        <TodoItemSkeleton/>
        <TodoItemSkeleton/>
    </div>

    return <div className="flex flex-col gap-2">
        {
            todos.map(todo => <MemoizedTodoItem
                key={todo.id}
                todo={todo}
                updateTodo={updateTodo}
                removeTodo={removeTodo}
                onEdit={onEditTodo}
            />)

        }
    </div>
}

function SortTodoSwitch({sortTodos, setSortTodos}: {
    sortTodos: boolean,
    setSortTodos: (value: ((prev: boolean) => boolean)) => void
}) {
    return <div className="flex items-center h-full gap-2">
        <Switch id="sorted-todos" checked={sortTodos} onCheckedChange={() => setSortTodos(prev => !prev)}/>
        <Label htmlFor="sorted-todos">Sort todos</Label>
    </div>
}

export default function HooksPage() {
    const [editTodo, setEditTodo] = useState<Todo | undefined>(undefined);
    const [sortTodos, setSortTodos] = useState(false);

    const [isLoading, todos, addTodo, updateTodo, removeTodo, reload] = useTodos(sortTodos);

    const numberOfFinishedTodos = useMemo(() => isLoading ? "-" : todos.filter(todo => todo.status === "done").length, [todos, isLoading]);
    const numberOfOpenTodos = useMemo(() => isLoading ? "-" : todos.filter(todo => todo.status === "todo").length, [todos, isLoading]);
    const numberOfPendingTodos = useMemo(() => isLoading ? "-" : todos.filter(todo => todo.isPending).length, [todos, isLoading]);

    return (
        <>
            <EditTodoDialog todo={editTodo} updateTodo={updateTodo} onClose={() => setEditTodo(undefined)}/>

            <div className="gap-2 my-2 grid" style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(10em, 1fr))"
            }}>
                <MemoizedTodoCard
                    title="Finished"
                    description="The number of finished todos"
                    count={numberOfFinishedTodos}
                />
                <MemoizedTodoCard
                    title="Open"
                    description="The number of todos that still have to be done"
                    count={numberOfOpenTodos}
                />
                <MemoizedTodoCard
                    title="Pending"
                    description="The number of todos that are not yet persisted"
                    count={numberOfPendingTodos}
                />
                <ExpensivePersistentCounterComponentHooks/>
                <ExpensiveVolatileCounterComponentHooks/>
            </div>

            <Card className="mt-2 mb-4">
                <CardHeader>
                    <CardTitle>Add Todo</CardTitle>
                    <CardDescription>
                        Add a new todo to your list
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <TodoForm addTodo={addTodo}/>
                </CardContent>
            </Card>

            <div className="my-4">
                <div className="flex gap-4 items-center mb-2">
                    <Button variant="outline" className="w-8 h-8 p-0" onClick={() => reload()}>
                        <RefreshCcw size={16}/>
                    </Button>

                    <h3 className="text-xl">Todos</h3>

                    <SortTodoSwitch setSortTodos={setSortTodos} sortTodos={sortTodos}/>
                </div>

                <TodoList todos={todos} isLoading={isLoading} removeTodo={removeTodo} updateTodo={updateTodo}
                          onEditTodo={setEditTodo}/>
            </div>
        </>
    )
}
