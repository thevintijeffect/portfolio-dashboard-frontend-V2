import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://portfolio-dashboard-backend-4ull.onrender.com";

export default function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(`${API}/api/portfolio`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!data) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Portfolio Dashboard V2</h1>

      <div>
        <h2>Net Worth</h2>
        <h1>{data.summary.networth_sgd}</h1>
      </div>

      <div>
        <h2>Profit</h2>
        <h1>{data.summary.profit_sgd}</h1>
      </div>
    </div>
  );
}
