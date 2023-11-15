import {RemoveTodo, UpdateTodo} from "@/utils/useTodos.tsx";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {CheckSquare2, ChevronsDown, ChevronsUp, Delete, Minus, Pen, Square} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Todo} from "@/utils/todos.ts";
import {Signal} from "@preact/signals-react";
import {editTodo, removeTodo, updateTodo} from "@/utils/signalsTodos.tsx";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger
} from "@/components/ui/context-menu.tsx";

export default function TodoItem({todo, updateTodo, removeTodo, onEdit}: { todo: Todo, updateTodo: UpdateTodo, removeTodo: RemoveTodo, onEdit: (editTodo: Todo) => void }) {
    const toggleTodo = () => updateTodo(todo.id, {status: todo.status === "todo" ? "done" : "todo"});

    return <ContextMenu>
        <ContextMenuTrigger asChild>
            <Card className={cn("flex items-center px-4", todo.isPending && "opacity-60")}>
                <Checkbox
                    checked={todo.status === "done"}
                    disabled={todo.isPending}
                    onClick={toggleTodo}
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
        </ContextMenuTrigger>
        <ContextMenuContent>
            <ContextMenuItem disabled={todo.isPending} onSelect={toggleTodo} className="flex gap-2 items-center">
                {todo.status === "done" ? <Square size={18} /> : <CheckSquare2 size={18} />}
                Mark as {todo.status === "done" ? "todo" : "done"}
            </ContextMenuItem>
            <ContextMenuItem disabled={todo.isPending || todo.status === "done"} onSelect={() => onEdit(todo)} className="flex gap-2 items-center">
                <Pen size={18} />
                Edit
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem disabled={todo.isPending || todo.status !== "done"} onSelect={() => removeTodo(todo.id)} className="flex gap-2 items-center">
                <Delete size={18} />
                Remove
            </ContextMenuItem>
        </ContextMenuContent>
    </ContextMenu>
}

export function TodoItemSignals({todo: rawTodo}: { todo: Signal<Todo> }) {
    const todo = rawTodo.value

    return <TodoItem todo={todo} updateTodo={updateTodo} removeTodo={removeTodo} onEdit={todo => editTodo.value = todo} />
}