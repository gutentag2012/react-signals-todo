import {useEffect, useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {effect, signal} from "@preact/signals-react";

const title = "Expensive Persistent Counter";
const description = "Imagine this is a very expensive component to render each time. Also this has an internal state that is updated in the background and persisted between renders.";

//region Hooks
let globalCounter = 0;
// This updates the global state independent of the component
setInterval(() => {
    globalCounter++
}, 1000)

export function ExpensivePersistentCounterComponentHooks() {
    const [counter, setCounter] = useState(globalCounter);

    useEffect(() => {
        const interval = setInterval(() => {
            // We only want to sync the global state with the component state when the component is mounted
            setCounter(globalCounter)
        }, 1000)

        return () => clearInterval(interval)
    }, []);

    return <Card className="w-full grid row-span-2 gap-y-2" style={{
        gridTemplateRows: "subgrid",
    }}>
        <CardHeader>
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
    return <Card className="w-full grid row-span-2 gap-y-2" style={{
        gridTemplateRows: "subgrid",
    }}>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-5xl text-center">{counter}</p>
        </CardContent>
    </Card>
}

//endregion

