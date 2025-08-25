import TranslateGraph from "./parts/TranslateGraph";
import GlossaryImprovements from "./components/GlossaryImprovements";
import {useRef, useState} from "react";

function App() {
  const conversationIdRef = useRef<string | null>(null);
  return (
    <div className="">
      <TranslateGraph conversationIdRef={conversationIdRef} />
    </div>
  );
}

export default App;
