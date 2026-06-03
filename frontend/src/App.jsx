import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [apiStatus, setApiStatus] = useState("Loading...");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/health`)
      .then((response) => response.json())
      .then((data) => {
        setApiStatus(data.message);
      })
      .catch((error) => {
        console.error(error);
        setApiStatus("Backend not reachable");
      });
  }, []);

  return (
    <main>
      <h1>KERNO</h1>
      <p>B2B marketplace for local suppliers and stores.</p>

      <h2>API status</h2>
      <p>{apiStatus}</p>
    </main>
  );
}

export default App;