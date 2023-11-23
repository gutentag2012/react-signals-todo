interface Props {

}

export const SlidesPage = ({}: Props) => {
    return (
        <div className="mt-4">
            <h3 className="text-3xl font-medium">React Signals</h3>

            <ul className="list-disc ml-4 mt-2 text-lg">
                <li>Way of managing state</li>
                <li>Similar to <code>useState</code></li>
            </ul>

            <h4 className="text-xl mt-4">What are Signals?</h4>

            <pre>
                    {`import {Signal} from "react-signals";`}
            </pre>
        </div>
    );
};