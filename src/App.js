import React from "react";
import AppRouter from "./router/AppRouter";
import AuthContextProvider from "./context/AuthContext";
import { ToastContainer } from "react-toastify";

const App = () => {
    return (
        <div className=" dark:bg-gray-dark-500 min-h-screen">
            <AuthContextProvider>
                    <AppRouter />
                    <ToastContainer />
            </AuthContextProvider>
        </div>
    );
};

export default App;
