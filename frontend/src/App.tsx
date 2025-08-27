import {useRef} from "react";
import {Toaster} from "sonner";
import TranslateGraph from "./parts/TranslateGraph";

function App() {
  const conversationIdRef = useRef<string | null>(null);

  return (
    <div className="">
      <TranslateGraph conversationIdRef={conversationIdRef} />
      <Toaster richColors position="bottom-center" />
    </div>
  );
}

export default App;
