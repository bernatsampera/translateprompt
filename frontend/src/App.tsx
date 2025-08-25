import TranslateGraph from "./parts/TranslateGraph";
import GlossaryImprovements from "./components/GlossaryImprovements";
import {useRef, useState} from "react";

function App() {
  const conversationIdRef = useRef<string | null>(null);
  return (
    <div className="flex h-screen">
      <div className="flex-1">
        <TranslateGraph conversationIdRef={conversationIdRef} />
      </div>
      <div className="w-80 border-l">
        <GlossaryImprovements conversationIdRef={conversationIdRef} />
      </div>
    </div>
  );
}

export default App;
