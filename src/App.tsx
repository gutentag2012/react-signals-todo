import HooksPage from "@/pages/HooksPage.tsx";
import SignalsPage from "@/pages/SignalsPage.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {Toaster} from "@/components/ui/toaster.tsx";

const pages = {
    hooks: "Hooks",
    signals: "Signals"
}

function App() {
    return (
        <div className="dark container my-2">
            <Tabs defaultValue={pages.hooks}>
                <nav>
                    <h1 className="text-5xl text-left my-8">Signals<span className="text-primary">Test</span></h1>
                    <TabsList className="mb-4">
                        <TabsTrigger value={pages.hooks}>Hooks</TabsTrigger>
                        <TabsTrigger value={pages.signals}>Signals</TabsTrigger>
                    </TabsList>
                </nav>
                <main>
                    <TabsContent value={pages.hooks}>
                        <HooksPage/>
                    </TabsContent>
                    <TabsContent value={pages.signals}>
                        <SignalsPage/>
                    </TabsContent>
                </main>
            </Tabs>

            <Toaster />
        </div>
    )
}

export default App
