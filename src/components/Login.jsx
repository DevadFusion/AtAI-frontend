import { useState } from "react";

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <img src="/logo.png" alt="AtAI Logo" className="h-12" />
          <h1 className="text-2xl font-bold text-primary ml-2">AtAI</h1>
        </div>
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded"
          />
          <button
            onClick={onSubmit}
            className="w-full bg-primary text-white p-2 rounded hover:bg-secondary"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;