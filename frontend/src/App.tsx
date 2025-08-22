import {useEffect, useState} from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [input, setInput] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8008/api/v1/hello")
      .then((res) => setInput(res.data.message))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div className="flex flex-col w-full items-center justify-center mx-auto w-full h-screen">
        <h1 className="text-3xl font-bold underline">Hello World</h1>
        Response from the backend: {input}
      </div>
    </>
  );
}

export default App;
