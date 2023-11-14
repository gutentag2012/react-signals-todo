import {AddTodo} from "@/utils/useTodos.ts";
import {useState} from "react";
import {Importance, ImportanceValues} from "@/utils/todos.ts";
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
            <Input
                placeholder="Enter your todo..."
                className="flex-1"
                value={todoLabel}
                onChange={e => setTodoLabel(e.target.value)}
            />
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4"/>
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            <Select value={importance} onValueChange={e => setImportance(e as Importance)}>
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
        </div>

        <Button>Create</Button>
    </form>
}