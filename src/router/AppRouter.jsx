import React from "react";
import Navbar from "../components/Navbar";
import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Messages from "../pages/Messages";
import PrivateRouter from "./PrivateRouter";
import { Routes, Route } from "react-router-dom";

const AppRouter = () => {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<PrivateRouter />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/messages" element={<Messages />} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Login />} />
      </Routes>
    </>
  );
};

export default AppRouter;
