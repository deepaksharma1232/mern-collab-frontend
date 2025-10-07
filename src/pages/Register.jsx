import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { api, setAuthToken } from "../api";
import { toastErrorNotify, toastSuccessNotify } from "../helpers/ToastNotify";
import { auth } from "../auth/firebase";
const Register = () => {
  const { createUser } = useContext(AuthContext);

  const [name, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("MEMBER"); // default role
  const [loading, setLoading] = useState(false);

   const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Create Firebase user
      await createUser(email, password, `${name}`);

      // 2️⃣ Get Firebase token
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("No authenticated user found");
      const idToken = await currentUser.getIdToken();

      // 3️⃣ Call backend register API
      const res = await api.post(
        "/auth/register",
        { name, email, role },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      // 4️⃣ Save data locally
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", idToken);
      localStorage.setItem("role", res.data.user.role);

      toastSuccessNotify("User registered successfully!");
    } catch (err) {
      console.error(err);
      toastErrorNotify(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="overflow-hidden flex-1 h-screen justify-center items-center dark:bg-gray-dark-500">
      <div className="mt-[10vh] mx-auto overflow-hidden relative w-[380px] h-[550px] rounded-[8px] dark:bg-[#1c1c1c] before:content-[''] before:absolute before:w-[380px] before:h-[420px] before:top-[-50%] before:left-[-50%] after:content-[''] after:absolute after:w-[380px] after:h-[420px] after:top-[-50%] after:left-[-50%] custom-linear-gradient">
        <form
          onSubmit={handleSubmit}
          className="absolute inset-[2px] rounded-[8px] bg-gray-100 dark:bg-[#28292d] z-[10] flex flex-col py-[40px] px-[30px]"
        >
          <h2 className="text-red-500 text-2xl font-[500] text-center tracking-[0.1em] mb-4">
            Sign Up
          </h2>

          <div className="relative z-0 w-full mb-4 group">
            <input
              className="peer"
              type="text"
              placeholder=""
              required
              onChange={(e) => setFirstName(e.target.value)}
            />
            <label>Name</label>
          </div>

          

          <div className="relative z-0 w-full mb-4 group">
            <input
              className="peer"
              type="email"
              placeholder=" "
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email</label>
          </div>

          <div className="relative z-0 w-full mb-4 group">
            <input
              className="peer"
              type="password"
              placeholder=" "
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
          </div>

          <div className="relative z-0 w-full mb-4 group">
  <select
    className="peer w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
    value={role}
    onChange={(e) => setRole(e.target.value)}
  >
    <option value="" disabled hidden></option> {/* placeholder */}
    <option value="ADMIN">Admin</option>
    <option value="MANAGER">Manager</option>
    <option value="MEMBER">Member</option>
  </select>
  <label className="absolute left-2 top-1 text-sm text-gray-500 dark:text-gray-400 transition-all
    peer-placeholder-shown:top-2.5
    peer-placeholder-shown:text-gray-400
    peer-placeholder-shown:text-sm
    peer-focus:top-0
    peer-focus:text-xs
    peer-focus:text-red-500">
    Role
  </label>
</div>


          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
