import {RemoveTodo, UpdateTodo} from "@/utils/useTodos.tsx";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {CheckSquare2, ChevronsDown, ChevronsUp, Delete, Loader2, Minus, Pen, Square} from "lucide-react";
import {Button, ButtonProps} from "@/components/ui/button.tsx";
import {Importance, Todo} from "@/utils/todos.ts";
import {Signal} from "@preact/signals-react";
import {editTodo, removeTodo, SignalizedTodo, updateTodo} from "@/utils/signalsTodos.ts";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger
} from "@/components/ui/context-menu.tsx";
import {Skeleton} from "@/components/ui/skeleton";
import {memo, useCallback} from "react";

export function TodoItemSkeleton() {
    return <Card className="flex items-center px-4 h-[92px]">
        <Skeleton className="w-4 h-4 rounded-md"/>

        <CardHeader>
            <Skeleton className="w-24 h-4"/>
            <Skeleton className="w-48 h-3 mt-1.5"/>
        </CardHeader>

        <Skeleton className="w-6 h-6 ml-auto"/>
    </Card>
}

//region Hooks
const ImportanceIndicator = memo(({importance}: { importance: Importance }) => {
    return importance === "high"
        ? <ChevronsUp className="text-red-600"/>
        : importance === "medium"
            ? <Minus className="text-yellow-600"/>
            : <ChevronsDown className="text-green-600"/>
})

function Spinner({isLoading, className}: { isLoading?: boolean, className?: string }) {
    if (!isLoading) return null;
    return <Loader2 className={cn("animate-spin", className)} size={18}/>
}

function HookContextMenuContent({isPending, toggleTodo, status, onEdit, onRemove}: {
    isPending: boolean,
    toggleTodo: () => void,
    onEdit: () => void,
    onRemove: () => void,
    status: string
}) {
    return <ContextMenuContent>
        <ContextMenuItem disabled={isPending} onSelect={toggleTodo} className="flex gap-2 items-center">
            {status === "done" ? <Square size={18}/> : <CheckSquare2 size={18}/>}
            Mark as {status === "done" ? "todo" : "done"}
        </ContextMenuItem>
        <ContextMenuItem disabled={isPending} onSelect={onEdit}
                         className="flex gap-2 items-center">
            <Pen size={18}/>
            Edit
        </ContextMenuItem>
        <ContextMenuSeparator/>
        <ContextMenuItem disabled={isPending || status !== "done"} onSelect={onRemove}
                         className="flex gap-2 items-center">
            <Delete size={18}/>
            Remove
        </ContextMenuItem>
    </ContextMenuContent>
}

export default function TodoItem({todo, updateTodo, removeTodo, onEdit}: {
    todo: Todo,
    updateTodo: UpdateTodo,
    removeTodo: RemoveTodo,
    onEdit: (editTodo: Todo) => void
}) {
    const toggleTodo = useCallback(() => updateTodo(todo.id, {status: todo.status === "todo" ? "done" : "todo"}), [todo.id, todo.status, updateTodo]);
    const onEditTodo = useCallback(() => onEdit(todo), [todo, onEdit]);
    const onRemove = useCallback(() => removeTodo(todo.id), [todo.id, removeTodo]);

    return <ContextMenu>
        <ContextMenuTrigger asChild>
            <Card className="flex items-center px-4">
                <Spinner isLoading={todo.isPending} className="mr-4"/>

                <Checkbox
                    checked={todo.status === "done"}
                    disabled={todo.isPending}
                    onClick={toggleTodo}
                />

                <CardHeader>
                    <CardTitle>{todo.label}</CardTitle>
                    <CardDescription>{todo.date ? `Due until ${todo.date}` : "No due date"}</CardDescription>
                </CardHeader>
                <p className="text-lg ml-auto">
                    <ImportanceIndicator importance={todo.importance}/>
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
        <HookContextMenuContent
            isPending={!!todo.isPending}
            status={todo.status}
            toggleTodo={toggleTodo}
            onEdit={onEditTodo}
            onRemove={onRemove}
        />
    </ContextMenu>
}
//endregion

//region Signals
function SignalSpinner({isLoading, className}: { isLoading: Signal<boolean>, className?: string }) {
    return <Spinner isLoading={isLoading.value} className={className}/>
}

function SignalCheckbox({checked, onClick, disabled}: {
    checked: boolean,
    onClick: () => void,
    disabled?: Signal<boolean>
}) {
    return <Checkbox
        checked={checked}
        disabled={disabled?.value}
        onClick={onClick}
    />
}

function SignalContextMenuContent({isPending, toggleTodo, status, onEdit, onRemove}: {
    isPending: Signal<boolean>,
    toggleTodo: () => void,
    onEdit: () => void,
    onRemove: () => void,
    status: string
}) {
    return <ContextMenuContent>
        <ContextMenuItem disabled={isPending.value} onSelect={toggleTodo} className="flex gap-2 items-center">
            {status === "done" ? <Square size={18}/> : <CheckSquare2 size={18}/>}
            Mark as {status === "done" ? "todo" : "done"}
        </ContextMenuItem>
        <ContextMenuItem disabled={isPending.value} onSelect={onEdit}
                         className="flex gap-2 items-center">
            <Pen size={18}/>
            Edit
        </ContextMenuItem>
        <ContextMenuSeparator/>
        <ContextMenuItem disabled={isPending.value || status !== "done"} onSelect={onRemove}
                         className="flex gap-2 items-center">
            <Delete size={18}/>
            Remove
        </ContextMenuItem>
    </ContextMenuContent>
}

function SignalButton({disabled, children, ...props}: Omit<ButtonProps, "disabled"> & { disabled: Signal<boolean> }) {
    return <Button disabled={disabled.value} {...props}>{children}</Button>
}

export function TodoItemSignals({todo}: { todo: SignalizedTodo }) {
    const toggleTodo = useCallback(
        () => updateTodo(todo.peek().id, {status: todo.peek().status === "todo" ? "done" : "todo"}),
        [todo],
    );
    const onEditTodo = useCallback(
        () => editTodo.value = todo.peek(),
        [todo],
    );
    const onRemove = useCallback(
        () => removeTodo(todo.peek().id),
        [todo],
    );

    return <ContextMenu>
        <ContextMenuTrigger asChild>
            <Card className="flex items-center px-4">
                <SignalSpinner isLoading={todo.value.isPending} className="mr-4"/>

                <SignalCheckbox
                    checked={todo.value.status === "done"}
                    disabled={todo.value.isPending}
                    onClick={toggleTodo}
                />

                <CardHeader>
                    <CardTitle>{todo.value.label}</CardTitle>
                    <CardDescription>{todo.value.date ? `Due until ${todo.value.date}` : "No due date"}</CardDescription>
                </CardHeader>
                <p className="text-lg ml-auto">
                    <ImportanceIndicator importance={todo.value.importance}/>
                </p>
                {todo.value.status === "done" && (
                    <SignalButton
                        disabled={todo.value.isPending}
                        variant="destructive"
                        className="ml-4"
                        onClick={() => {
                            if (todo.value.isPending.peek()) return;
                            return removeTodo(todo.value.id)
                        }}
                    >
                        Remove
                    </SignalButton>
                )
                }
            </Card>
        </ContextMenuTrigger>
        <SignalContextMenuContent
            isPending={todo.value.isPending}
            toggleTodo={toggleTodo}
            status={todo.value.status}
            onEdit={onEditTodo}
            onRemove={onRemove}
        />
    </ContextMenu>
}
//endregion