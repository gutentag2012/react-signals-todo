import {useEffect, useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {effect, signal} from "@preact/signals-react";

const title = "Expensive Persistent Counter";
const description = "Imagine this is a very expensive component to render each time. Also this has an internal state that is updated in the background and persisted between renders.";

//region Hooks
let globalCounter = 0;
export function ExpensivePersistentCounterComponentHooks() {
    const [counter, setCounter] = useState(globalCounter);

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter(counter => {
                globalCounter = counter + 1
                return globalCounter
            })
        }, 1000)

        return () => clearInterval(interval)
    }, []);

    return <Card className="w-[350px]">
        <CardHeader className="min-h-[175px]">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-5xl text-center">{counter}</p>
        </CardContent>
    </Card>
}
//endregion

//region Signals
const counter = signal(0);
effect(() => {
    const interval = setInterval(() => {
        counter.value += 1
    }, 1000)

    return () => clearInterval(interval)
})

export function ExpensivePersistentCounterComponentSignals() {
    return <Card className="w-[350px]">
        <CardHeader className="min-h-[175px]">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-5xl text-center">{counter}</p>
        </CardContent>
    </Card>
}
//endregion

