import HooksPage from "@/pages/HooksPage.tsx";
import SignalsPage from "@/pages/SignalsPage.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {SlidesPage} from "@/pages/SlidesPage.tsx";

const pages = {
    hooks: "Hooks",
    signals: "Signals",
    slides: "Slides"
}

console.group(pages.hooks)

function App() {
    return (
        <div className="dark container">
            <Tabs defaultValue={pages.slides} onValueChange={(value) => {
                console.groupEnd()
                console.group(value)
            }}>
                <nav>
                    <h1 className="text-5xl text-left my-4">Signals<span className="text-primary">Test</span></h1>
                    <TabsList>
                        <TabsTrigger value={pages.slides}>Slides</TabsTrigger>
                        <TabsTrigger value={pages.hooks}>Hooks</TabsTrigger>
                        <TabsTrigger value={pages.signals}>Signals</TabsTrigger>
                    </TabsList>
                </nav>
                <main>
                    <TabsContent value={pages.slides}>
                        <SlidesPage/>
                    </TabsContent>
                    <TabsContent value={pages.hooks}>
                        <HooksPage/>
                    </TabsContent>
                    <TabsContent value={pages.signals}>
                        <SignalsPage/>
                    </TabsContent>
                </main>
            </Tabs>
        </div>
    )
}

export default App
