import { useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { getAuth } from "firebase/auth";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analytics = ({ campaigns }) => {
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");

  const auth = getAuth();
  const user = auth.currentUser;

  const chartData = useMemo(() => ({
    labels: campaigns.map((c) => c.name),
    datasets: [
      {
        label: "Spend",
        data: campaigns.map((c) => c.spend),
        backgroundColor: "#2ECC71"
      }
    ]
  }), [campaigns]);

  const handleChat = async () => {
    try {
      const response = await fetch(
        "https://us-central1-atai-14440.cloudfunctions.net/dialogflowQuery",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            query: chatInput,
            campaigns,
            userId: user ? user.uid : null
          })
        }
      );
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setChatResponse(data.response);
      setChatInput("");
    } catch (error) {
      console.error("Chat error:", error);
      setChatResponse("Sorry, something went wrong. Try again!");
    }
  };

  return (
    <div className="analytics-container">
      <h1 className="analytics-title">Analytics</h1>
      <div className="analytics-chart-container">
        <Bar data={chartData} options={{ responsive: true }} />
      </div>
      <div className="analytics-chat-container">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask about your campaigns.."
          className="analytics-input"
        />
        <button onClick={handleChat} className="analytics-button">
          Send
        </button>
        {chatResponse && <p className="analytics-chat-response">{chatResponse}</p>}
      </div>
    </div>
  );
};

export default Analytics;