import TranslateGraph from "./parts/TranslateGraph";
import GlossaryImprovements from "./components/GlossaryImprovements";

function App() {
  return (
    <div className="flex h-screen">
      <div className="flex-1">
        <TranslateGraph />
      </div>
      <div className="w-80 border-l">
        <GlossaryImprovements conversationId="test-conversation" />
      </div>
    </div>
  );
}

export default App;
