import {AddTodo, UpdateTodo} from "@/utils/useTodos.tsx";
import {memo, useEffect, useState} from "react";
import {AddTodoModel, Importance, ImportanceValues, Todo} from "@/utils/todos.ts";
import {format} from "date-fns";
import {Input} from "@/components/ui/input.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {cn} from "@/lib/utils.ts";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar.tsx";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.tsx";
import {capitalize} from "@/utils/capitalize.ts";
import {batch, Signal, useSignal, useSignalEffect} from "@preact/signals-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import parse from "date-fns/parse";
import {editTodo, updateTodo} from "@/utils/signalsTodos.ts";

//region Hooks
function LabelInput({value, onChange}: { value: string, onChange: (value: string) => void }) {
    return <label className="text-sm flex gap-1 flex-col flex-1">
        Todo
        <Input
            placeholder="Enter your todo..."
            value={value}
            onChange={e => onChange(e.target.value)}
        />
    </label>
}

// To be clear in a real application you would not memoize this component, since it is not expensive to render
const MemoizedLabelInput = memo(LabelInput)

function DateInput({date, onChange}: { date: Date | undefined, onChange: (date: Date | undefined) => void }) {
    return <label className="text-sm flex gap-1 flex-col">
        Due Date
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4"/>
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={onChange}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    </label>
}

// To be clear in a real application you would not memoize this component, since it is not expensive to render
const MemoizedDateInput = memo(DateInput)

function ImportanceSelect({importance, onChange}: {
    importance: Importance,
    onChange: (importance: Importance) => void
}) {
    return <label className="text-sm flex gap-1 flex-col">
        Importance
        <Select value={importance} onValueChange={e => onChange(e as Importance)}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a page"/>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Importance</SelectLabel>
                    {
                        ImportanceValues.map(importance => <SelectItem
                            key={importance}
                            value={importance}
                        >
                            {capitalize(importance)}
                        </SelectItem>)
                    }
                </SelectGroup>
            </SelectContent>
        </Select>
    </label>
}

// To be clear in a real application you would not memoize this component, since it is not expensive to render
const MemoizedImportanceSelect = memo(ImportanceSelect)


export function TodoForm({addTodo}: { addTodo: AddTodo }) {
    const [todoLabel, setTodoLabel] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [importance, setImportance] = useState<Importance>("medium");

    return <form onSubmit={e => {
        e.preventDefault()

        // ResetForm
        setTodoLabel("")
        setSelectedDate(new Date())
        setImportance("medium")

        return addTodo({
            importance,
            status: "todo",
            label: todoLabel,
            date: selectedDate ? format(selectedDate, "PPP") : undefined
        })
    }}>
        <div className="flex gap-2 mb-2">
            <MemoizedLabelInput value={todoLabel} onChange={setTodoLabel}/>
            <MemoizedDateInput date={selectedDate} onChange={setSelectedDate}/>
            <MemoizedImportanceSelect importance={importance} onChange={setImportance}/>
        </div>

        <Button>Create</Button>
    </form>
}

export function EditTodoDialog({todo, updateTodo, onClose}: {
    todo?: Todo,
    updateTodo: UpdateTodo,
    onClose: () => void
}) {
    const [todoLabel, setTodoLabel] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [importance, setImportance] = useState<Importance>("medium");

    useEffect(() => {
        if (!todo) return;

        setTodoLabel(todo.label)
        setSelectedDate(todo.date ? parse(todo.date, "PPP", new Date()) : undefined)
        setImportance(todo.importance)
    }, [todo]);

    return <Dialog open={!!todo} onOpenChange={open => !open && onClose()}>
        <DialogContent>
            <form onSubmit={e => {
                e.preventDefault()

                if (!todo) return;

                // ResetForm
                setTodoLabel("")
                setSelectedDate(undefined)
                setImportance("medium")

                onClose()

                return updateTodo(todo.id, {
                    importance,
                    status: "todo",
                    label: todoLabel,
                    date: selectedDate ? format(selectedDate, "PPP") : undefined
                })
            }}>
                <DialogHeader>
                    <DialogTitle>Edit todo</DialogTitle>
                    <DialogDescription>
                        Edit the todo here
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-2 my-4">
                    <MemoizedLabelInput value={todoLabel} onChange={setTodoLabel}/>
                    <MemoizedDateInput date={selectedDate} onChange={setSelectedDate}/>
                    <MemoizedImportanceSelect importance={importance} onChange={setImportance}/>
                </div>

                <DialogFooter>
                    <Button>Update</Button>
                    <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
}

//endregion


//region Signals
function InputSignal({value}: { value: Signal<string> }) {
    return <LabelInput
        value={value.value}
        onChange={newValue => value.value = newValue}
    />
}

function DateInputSignal({date}: { date: Signal<Date | undefined> }) {
    return <DateInput date={date.value} onChange={newDate => date.value = newDate}/>
}

function ImportanceSelectSignal({importance}: { importance: Signal<Importance> }) {
    return <ImportanceSelect
        importance={importance.value}
        onChange={newImportance => importance.value = newImportance}
    />
}

export function TodoFormSignal({addTodo}: { addTodo: AddTodo }) {
    const todoLabel = useSignal("")
    const selectedDate = useSignal<Date | undefined>(new Date())
    const importance = useSignal<Importance>("medium")

    return <form onSubmit={e => {
        e.preventDefault()

        const selectedDateValue = selectedDate.peek()
        const newTodo: AddTodoModel = {
            importance: importance.peek(),
            status: "todo",
            label: todoLabel.peek(),
            date: selectedDateValue ? format(selectedDateValue, "PPP") : undefined
        };

        // ResetForm
        batch(() => {
            todoLabel.value = ""
            selectedDate.value = new Date()
            importance.value = "medium"
        })

        return addTodo(newTodo)
    }}>
        <div className="flex gap-2 mb-2">
            <InputSignal value={todoLabel}/>
            <DateInputSignal date={selectedDate}/>
            <ImportanceSelectSignal importance={importance}/>
        </div>

        <Button>Create</Button>
    </form>
}

export function EditTodoDialogSignal() {
    const todoLabel = useSignal("")
    const selectedDate = useSignal<Date | undefined>(new Date())
    const importance = useSignal<Importance>("medium")

    useSignalEffect(() => {
        if (!editTodo.value) return;

        todoLabel.value = editTodo.value.label
        selectedDate.value = editTodo.value.date ? parse(editTodo.value.date, "PPP", new Date()) : undefined
        importance.value = editTodo.value.importance

    })

    const onClose = () => editTodo.value = undefined

    return <Dialog open={!!editTodo.value} onOpenChange={open => !open && onClose()}>
        <DialogContent>
            <form onSubmit={e => {
                e.preventDefault()

                if (!editTodo.value) return;

                const editId = editTodo.value.id
                const selectedDateValue = selectedDate.peek()
                const updatedTodo: Partial<Todo> = {
                    importance: importance.peek(),
                    label: todoLabel.peek(),
                    date: selectedDateValue ? format(selectedDateValue, "PPP") : undefined
                };

                // ResetForm
                batch(() => {
                    todoLabel.value = ""
                    selectedDate.value = new Date()
                    importance.value = "medium"
                })

                onClose()

                return updateTodo(editId, updatedTodo)
            }}>
                <DialogHeader>
                    <DialogTitle>Edit todo</DialogTitle>
                    <DialogDescription>
                        Edit the todo here
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-2 my-4">
                    <InputSignal value={todoLabel}/>
                    <DateInputSignal date={selectedDate}/>
                    <ImportanceSelectSignal importance={importance}/>
                </div>

                <DialogFooter>
                    <Button>Update</Button>
                    <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
}
//endregion