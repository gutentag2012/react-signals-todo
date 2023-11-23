import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {useEffect} from "react";
import {signal} from "@preact/signals-react";

interface Props {

}

const slideProgress = signal(1);

export const SlidesPage = ({}: Props) => {
    const makeIndex = () => {
        let index = 0;
        return () => ++index;
    }
    const slideProgressValue = makeIndex();

    useEffect(() => {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                slideProgress.value += 1;
            } else if (e.key === 'ArrowLeft') {
                slideProgress.value -= 1;
            }
        })
    }, []);

    return (
        <div className="mt-4 flex flex-col gap-2 pb-8">
            <Card>
                <CardHeader>
                    <CardTitle>React Hooks</CardTitle>
                    <CardDescription>Way of handling state in functional components since 2018</CardDescription>
                </CardHeader>

                <CardContent>
                    <ul className="list-disc ml-4">
                        {slideProgress.value > slideProgressValue() && <li>Easy to write</li>}
                        {slideProgress.value > slideProgressValue() && <li>
                            Easy to get wrong
                            <ul className="list-disc ml-4">
                                <li>Overuse of useCallback/useMemo</li>
                                <li>Missing/wrong dependencies</li>
                                <li>Infinite loops</li>
                                <li>Forgetting cleanup</li>
                                <li>...</li>
                            </ul>
                        </li>}
                        {slideProgress.value > slideProgressValue() &&
                            <li>Prop drilling or Context API for shared state</li>}
                        {slideProgress.value > slideProgressValue() &&
                            <li>Value changes only available after render</li>}
                        {slideProgress.value > slideProgressValue() &&
                            <li>State is coupled to component + component lifecycle</li>}
                    </ul>
                </CardContent>
            </Card>

            {slideProgress.value > slideProgressValue() && <Card>
                <CardHeader>
                    <CardTitle>Signals</CardTitle>
                    <CardDescription>Reactive primitives for managing application state.</CardDescription>
                </CardHeader>

                <CardContent>
                    <ul className="list-disc ml-4">
                        {slideProgress.value > slideProgressValue() && <li>
                            Newer technologie Signals, used by
                            <ul className="list-disc ml-4">
                                <li>Solid</li>
                                <li>Preact</li>
                                <li>...</li>
                            </ul>
                        </li>}
                        {slideProgress.value > slideProgressValue() && <li>Fine-grained reactivity</li>}
                        {slideProgress.value > slideProgressValue() && <li>Easy to use global state</li>}
                        {slideProgress.value > slideProgressValue() && <li>Value changes instantly available</li>}
                        {slideProgress.value > slideProgressValue() && <li>State is decoupled from component</li>}
                        {slideProgress.value > slideProgressValue() && <li>
                            Fast by default, optimized
                            <ul className="list-disc ml-4">
                                <li>Lazy evaluation</li>
                                <li>Batched updates</li>
                                <li>Immutable data structures</li>
                                <li>Textnodes skip component render</li>
                            </ul>
                        </li>}
                    </ul>
                </CardContent>
            </Card>}

            {slideProgress.value > slideProgressValue() &&
                <div className="flex gap-2">
                    <Card className="flex-1">
                        <CardHeader>
                            <CardTitle>Hooks</CardTitle>
                            <CardDescription>An example of how to use hooks in a counter.</CardDescription>
                        </CardHeader>
                        <CardContent>
                        <pre className="text-lg">
                            function Counter() {'{'}<br/>
                            &nbsp;&nbsp;const [count, setCount] = useState(0);<br/>
                            <br/>
                            &nbsp;&nbsp;useEffect(() ={'>'} {'{'}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;const timer = setInterval(() ={'>'} {'{'}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;setCount(count ={'>'} count + 1);<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;{"}"}, 1000);<br/>
                            <br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;return () ={'>'} {'{'}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;clearInterval(timer);<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;{"}"};<br/>
                            &nbsp;&nbsp;{"}"}, []);<br/>
                            <br/>
                            &nbsp;&nbsp;return (<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;{"<p>{count}</p>"}<br/>
                            &nbsp;&nbsp;);<br/>
                            {"}"}<br/>
                        </pre>
                        </CardContent>
                    </Card>

                    {slideProgress.value > slideProgressValue() &&
                        <Card className="flex-1">
                            <CardHeader>
                                <CardTitle>Signals</CardTitle>
                                <CardDescription>An example of how to use signals in a counter.</CardDescription>
                            </CardHeader>
                            <CardContent>
                        <pre className="text-lg">
                            function Counter() {'{'}<br/>
                            &nbsp;&nbsp;const count = useSignal(0);<br/>
                            <br/>
                            &nbsp;&nbsp;useSignalEffect(() ={'>'} {'{'}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;const timer = setInterval(() ={'>'} {'{'}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;count.value++;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;{"}"}, 1000);<br/>
                            <br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;return () ={'>'} {'{'}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;clearInterval(timer);<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;{"}"};<br/>
                            &nbsp;&nbsp;{"}"});<br/>
                            <br/>
                            &nbsp;&nbsp;return (<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;{"<p>{count}</p>"}<br/>
                            &nbsp;&nbsp;);<br/>
                            {"}"}<br/>
                        </pre>
                            </CardContent>
                        </Card>
                    }
                </div>
            }
        </div>
    );
};