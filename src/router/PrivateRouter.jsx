import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRouter = () => {
    const { currentUser } = useContext(AuthContext);
    return currentUser ? <Outlet /> : <Navigate to="/login" replace />; //details e basinca logine atiyor ordan geri cikmaya calisirken cikamiyor replace yazarak login i tekrar eklemiyor bir sonrakine gimemizi sagliyor
};

export default PrivateRouter;
