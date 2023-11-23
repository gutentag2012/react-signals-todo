import {memo, useEffect} from "react";
import {
    addTodo,
    isLoading,
    loadTodos,
    numberOfFinishedTodos,
    numberOfOpenTodos,
    numberOfPendingTodos, SignalizedTodo,
    sortedTodos, todos,
} from "@/utils/signalsTodos.ts";
import {EditTodoDialogSignal, TodoFormSignal} from "@/components/common/TodoForm.tsx";
import {TodoItemSignals as TodoItem, TodoItemSkeleton} from "@/components/common/TodoItem.tsx";
import {TodoCard} from "@/components/common/TodoCard.tsx";
import {ExpensiveVolatileCounterComponentSignals} from "@/components/common/ExpensiveVolatileCounterComponent.tsx";
import {ExpensivePersistentCounterComponentSignals} from "@/components/common/ExpensivePersitentCounterComponent.tsx";
import {Button} from "@/components/ui/button.tsx";
import {RefreshCcw} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {computed, Signal, useComputed, useSignal} from "@preact/signals-react";
import {Switch} from "@/components/ui/switch.tsx";
import {Label} from "@/components/ui/label.tsx";

const MemoizedTodoItem = memo(TodoItem)

function TodoList({data}: {data: Signal<Array<SignalizedTodo>>}) {
    if (!isLoading.value && !data.value.length) {
        return (<p className="text-lg p-4 font-medium text-center">
            Nothing todo for you
        </p>)
    }

    if (isLoading.value) {
        return <div className="flex flex-col gap-2 mr-3">
            <TodoItemSkeleton/>
            <TodoItemSkeleton/>
            <TodoItemSkeleton/>
            <TodoItemSkeleton/>
        </div>
    }

    return <div className="flex flex-col gap-2 mr-3">
        {
            data.value.map((todo) => {
                const key = computed(() => todo.value.id)
                return <MemoizedTodoItem key={key.value} todo={todo}/>
            })
        }
    </div>
}

function SortTodoSwitch({sortTodos}: { sortTodos: Signal<boolean> }) {
    return <div className="flex items-center h-full gap-2">
        <Switch id="sorted-todos" checked={sortTodos.value} onCheckedChange={() => sortTodos.value = !sortTodos.value}/>
        <Label htmlFor="sorted-todos">Sort todos</Label>
    </div>
}

export default function SignalsPage() {
    const sortTodos = useSignal(false)

    // We have to do this workaround, because we do not want to subscribe to the sorted signal in the non-sorted case,
    // since this would update it without having anything changed
    const sortedTodosOrElse = useComputed(() => sortTodos.value ? sortedTodos.value : undefined)
    const unsortedTodosOrElse = useComputed(() => sortTodos.value ? undefined : todos.value)
    const displayTodos = useComputed(() => (sortedTodosOrElse?.value ?? unsortedTodosOrElse?.value)!)

    useEffect(() => {
        loadTodos()
    }, []);


    return (
        <>
            <EditTodoDialogSignal/>

            <div className="gap-x-2 my-2 grid" style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))"
            }}>
                <TodoCard
                    title="Finished"
                    description="The number of finished todos"
                    count={numberOfFinishedTodos}
                />
                <TodoCard
                    title="Open"
                    description="The number of todos that still have to be done"
                    count={numberOfOpenTodos}
                />
                <TodoCard
                    title="Pending"
                    description="The number of todos that are not yet persisted"
                    count={numberOfPendingTodos}
                />
                <ExpensivePersistentCounterComponentSignals/>
                <ExpensiveVolatileCounterComponentSignals/>
            </div>


            <Card className="mt-2 mb-4">
                <CardHeader>
                    <CardTitle>Add Todo</CardTitle>
                    <CardDescription>
                        Add a new todo to your list
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <TodoFormSignal addTodo={addTodo}/>
                </CardContent>
            </Card>

            <div className="my-4">
                <div className="flex gap-4 items-center mb-2">
                    <Button variant="outline" className="w-8 h-8 p-0" onClick={() => loadTodos()}>
                        <RefreshCcw size={16}/>
                    </Button>

                    <h3 className="text-xl">Todos</h3>

                    <SortTodoSwitch sortTodos={sortTodos} />
                </div>

                <TodoList data={displayTodos}/>
            </div>
        </>
    )
}
