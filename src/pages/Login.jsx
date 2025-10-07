import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../auth/firebase";
import { api, setAuthToken } from "../api";
import {
  toastErrorNotify,
  toastSuccessNotify,
} from "../helpers/ToastNotify";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // 2️⃣ Get Firebase ID token
      const idToken = await user.getIdToken();

      // 3️⃣ Send token to backend for verification
      const res = await api.post(
        "/auth/login",
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      // 4️⃣ Save user info and token
      const userData = res.data.user;
      setAuthToken(idToken);
      localStorage.setItem("token", idToken);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("role", userData.role || "Member");

      toastSuccessNotify("Login successful!");
      navigate("/projects");
    } catch (err) {
      console.error("Login Error:", err);
      toastErrorNotify(
        err.response?.data?.error || err.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden flex-1 h-screen justify-center items-center dark:bg-gray-dark-500">
      <div
        className="mt-[10vh] mx-auto overflow-hidden relative w-[380px] h-[500px] rounded-[8px] dark:bg-[#1c1c1c]
          before:content-[''] before:absolute before:w-[380px] before:h-[420px] before:top-[-50%] before:left-[-50%]
          after:content-[''] after:absolute after:w-[380px] after:h-[420px] after:top-[-50%] after:left-[-50%] custom-linear-gradient"
      >
        <form
          onSubmit={handleSubmit}
          className="absolute inset-[2px] rounded-[8px] bg-gray-100 dark:bg-[#28292d] z-[10] flex flex-col py-[40px] px-[30px]"
        >
          <h2 className="text-red-500 text-2xl font-[500] text-center tracking-[0.1em] mb-4">
            Sign In
          </h2>

          <div className="relative z-0 w-full mb-4 group">
            <input
              className="peer"
              type="email"
              placeholder=" "
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="absolute left-2 top-1 text-sm text-gray-500 dark:text-gray-400 transition-all
              peer-placeholder-shown:top-2.5
              peer-placeholder-shown:text-gray-400
              peer-placeholder-shown:text-sm
              peer-focus:top-0
              peer-focus:text-xs
              peer-focus:text-red-500">
              Email
            </label>
          </div>

          <div className="relative z-0 w-full mb-4 group">
            <input
              className="peer"
              type="password"
              placeholder=" "
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="absolute left-2 top-1 text-sm text-gray-500 dark:text-gray-400 transition-all
              peer-placeholder-shown:top-2.5
              peer-placeholder-shown:text-gray-400
              peer-placeholder-shown:text-sm
              peer-focus:top-0
              peer-focus:text-xs
              peer-focus:text-red-500">
              Password
            </label>
          </div>

          <div className="flex justify-between mb-4 text-sm text-gray-500">
            <span
              onClick={() => toastErrorNotify("Forgot password API not implemented yet")}
              className="cursor-pointer hover:text-red-500"
            >
              Forgot Password
            </span>
            <Link to="/register" className="cursor-pointer hover:text-red-500">
              Sign Up
            </Link>
          </div>

          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
