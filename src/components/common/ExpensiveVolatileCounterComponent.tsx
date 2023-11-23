import {useSignal, useSignalEffect} from "@preact/signals-react";
import {useEffect, useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";

const title = "Expensive Volatile Counter";
const description = "This component has an internal state we want to keep as long as possible."

//region Hooks
export function ExpensiveVolatileCounterComponentHooks() {
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter(counter => counter + 1)
        }, 1000)

        return () => clearInterval(interval)
    }, []);

    return <Card className="w-full grid row-span-2 gap-y-2 col-span-2" style={{
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
export function ExpensiveVolatileCounterComponentSignals() {
    const counter = useSignal(0);
    useSignalEffect(() => {
        const interval = setInterval(() => {
            counter.value += 1
        }, 1000)

        return () => clearInterval(interval)
    });

    return <Card className="w-full grid row-span-2 gap-y-2 col-span-2" style={{
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