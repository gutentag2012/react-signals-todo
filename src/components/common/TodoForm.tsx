import {AddTodo} from "@/utils/useTodos.ts";
import {memo, useState} from "react";
import {AddTodoModel, Importance, ImportanceValues} from "@/utils/todos.ts";
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
import {batch, Signal, useSignal} from "@preact/signals-react";

//region Hooks
function LabelInput({value, onChange}: { value: string, onChange: (value: string) => void }) {
    return <Input
        placeholder="Enter your todo..."
        className="flex-1"
        value={value}
        onChange={e => onChange(e.target.value)}
    />
}

// To be clear in a real application you would not memoize this component, since it is not expensive to render
const MemoizedLabelInput = memo(LabelInput)

function DateInput({date, onChange}: { date: Date | undefined, onChange: (date: Date | undefined) => void }) {
    return <Popover>
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
}

// To be clear in a real application you would not memoize this component, since it is not expensive to render
const MemoizedDateInput = memo(DateInput)

function ImportanceSelect({importance, onChange}: {
    importance: Importance,
    onChange: (importance: Importance) => void
}) {
    return <Select value={importance} onValueChange={e => onChange(e as Importance)}>
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
}

// To be clear in a real application you would not memoize this component, since it is not expensive to render
const MemoizedImportanceSelect = memo(ImportanceSelect)


export default function TodoForm({addTodo}: { addTodo: AddTodo }) {
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
    const selectedDate = useSignal(new Date())
    const importance = useSignal<Importance>("medium")

    return <form onSubmit={e => {
        e.preventDefault()

        const newTodo: AddTodoModel = {
            importance: importance.peek(),
            status: "todo",
            label: todoLabel.peek(),
            date: selectedDate ? format(selectedDate.peek(), "PPP") : undefined
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

//endregion