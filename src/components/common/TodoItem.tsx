import {RemoveTodo, UpdateTodo} from "@/utils/useTodos.ts";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {ChevronsDown, ChevronsUp, Minus} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Todo} from "@/utils/todos.ts";
import {Signal} from "@preact/signals-react";
import {removeTodo, updateTodo} from "@/utils/signalsTodos.ts";

export default function TodoItem({todo, updateTodo, removeTodo}: { todo: Todo, updateTodo: UpdateTodo, removeTodo: RemoveTodo }) {
    return <Card className={cn("flex items-center px-4", todo.isPending && "opacity-60")}>
        <Checkbox
            checked={todo.status === "done"}
            disabled={todo.isPending}
            onClick={() => updateTodo(todo.id, {status: todo.status === "todo" ? "done" : "todo"})}
        />

        <CardHeader>
            <CardTitle>{todo.label}</CardTitle>
            {todo.date && <CardDescription>Due until {todo.date}</CardDescription>}
        </CardHeader>
        <p className="text-lg ml-auto">
            {
                todo.importance === "high"
                    ? <ChevronsUp className="text-red-600"/>
                    : todo.importance === "medium"
                        ? <Minus className="text-yellow-600"/>
                        : <ChevronsDown className="text-green-600"/>
            }
        </p>
        {todo.status === "done" &&
            <Button disabled={todo.isPending} variant="destructive" className="ml-4" onClick={() => {
                if (todo.isPending) return;
                return removeTodo(todo.id)
            }}>
                Remove
            </Button>}
    </Card>
}

export function TodoItemSignals({todo: rawTodo}: { todo: Signal<Todo> }) {
    const todo = rawTodo.value

    return <TodoItem todo={todo} updateTodo={updateTodo} removeTodo={removeTodo}/>
}