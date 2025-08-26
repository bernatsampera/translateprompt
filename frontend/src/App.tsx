import {useRef} from "react";
import TranslateGraph from "./parts/TranslateGraph";

function App() {
  const conversationIdRef = useRef<string | null>(null);
  return (
    <div className="">
      <TranslateGraph conversationIdRef={conversationIdRef} />
    </div>
  );
}

export default App;
