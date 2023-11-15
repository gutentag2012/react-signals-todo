import {memo, useEffect} from "react";
import {
    addTodo,
    isLoading,
    loadTodos,
    numberOfFinishedTodos,
    numberOfOpenTodos,
    numberOfPendingTodos,
    todos
} from "@/utils/signalsTodos.tsx";
import {EditTodoDialogSignal, TodoFormSignal} from "@/components/common/TodoForm.tsx";
import {TodoItemSignals as TodoItem} from "@/components/common/TodoItem.tsx";
import {TodoCard} from "@/components/common/TodoCard.tsx";
import {ExpensiveVolatileCounterComponentSignals} from "@/components/common/ExpensiveVolatileCounterComponent.tsx";
import {ExpensivePersistentCounterComponentSignals} from "@/components/common/ExpensivePersitentCounterComponent.tsx";
import {Button} from "@/components/ui/button.tsx";
import {RefreshCcw} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";

const MemoizedTodoItem = memo(TodoItem)

function TodoList() {
    if (isLoading.value) return <p className="text-lg p-4 font-medium text-center">Loading...</p>
    if (!todos.value.length) return <p className="text-lg p-4 font-medium text-center">Nothing todo for you</p>

    return <ScrollArea className="h-[424px]">
        <div className="flex flex-col gap-2 mr-3">
            {
                todos.value.map(({id, todo}) => <MemoizedTodoItem key={id} todo={todo}/>)
            }
        </div>
    </ScrollArea>
}

export default function SignalsPage() {
    useEffect(() => {
        loadTodos()
    }, []);


    return (
        <>
            <EditTodoDialogSignal/>

            <div className="flex gap-2 my-2">
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

            <div className="my-4">
                <h3 className="text-xl mb-2">Add Todo</h3>
                <TodoFormSignal addTodo={addTodo}/>
            </div>

            <div className="my-4">
                <div className="flex gap-2 items-center mb-2">
                    <Button variant="outline" className="w-8 h-8 p-0" onClick={() => loadTodos()}>
                        <RefreshCcw size={16}/>
                    </Button>
                    <h3 className="text-xl">Todos</h3>
                </div>

                <TodoList/>
            </div>
        </>
    )
}
