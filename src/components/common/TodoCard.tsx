import {Signal} from "@preact/signals-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";

export function TodoCard({title, description, count}: {
    title: string,
    description: string,
    count: number | string | Signal<number | string>
}) {
    return (
        <Card className="w-full grid row-span-2 gap-y-2" style={{
            gridTemplateRows: "subgrid",
        }}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-5xl text-center">{count}</p>
            </CardContent>
        </Card>
    )
}