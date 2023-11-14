import {useState} from "react";
import HooksPage from "@/pages/HooksPage.tsx";
import SignalsPage from "@/pages/SignalsPage.tsx";
import {Select, SelectContent, SelectLabel, SelectGroup, SelectTrigger, SelectValue, SelectItem} from "@/components/ui/select.tsx";

const pages = {
    hooks: "Hooks",
    signals: "Signals"
}
type Pages = typeof pages[keyof typeof pages];

function Pages({selectedPage}: {selectedPage: Pages}) {
    if (selectedPage === pages.hooks) {
        return <HooksPage />
    } else if (selectedPage === pages.signals) {
        return <SignalsPage />
    }
}

function App() {
  const [pageSelected, setPageSelected] = useState<Pages>(pages.hooks);

  return (
    <div className="dark container my-2">
        <nav>
            <h1 className="text-5xl text-left my-8">Signals<span className="text-primary">Test</span></h1>
            <div className="flex gap-4 items-center">
                <label>Select a page</label>
                <Select value={pageSelected} onValueChange={setPageSelected}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a page" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Pages</SelectLabel>
                            {
                                Object.values(pages).map(page => <SelectItem key={page} value={page}>{page}</SelectItem>)
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </nav>

        <main>
            <Pages selectedPage={pageSelected} />
        </main>
    </div>
  )
}

export default App
