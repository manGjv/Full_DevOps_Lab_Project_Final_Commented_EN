import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginRequest } from "../api/auth.api";
import { AuthContext } from "../auth/AuthContext";
import Navbar from "../components/Navbar"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginRequest({ email, password });
      login(res.data.token, res.data.user);
      navigate("/courses");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <Navbar /> 
      <div className="auth-container">
        <h2>Login</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        <p className="auth-switch">
           No account yet ?{" "}
          <Link to="/register">Create an account</Link>
        </p>
      </div>
    </>
  );
}
