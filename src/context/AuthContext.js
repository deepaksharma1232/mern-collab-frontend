import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { auth } from "../auth/firebase";
import { useNavigate } from "react-router-dom";
import {
    toastErrorNotify,
    toastSuccessNotify,
    toastWarnNotify,
} from "../helpers/ToastNotify";

export const AuthContext = createContext();

 
const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(false);
    let navigate = useNavigate();

    useEffect(() => {
        userObserver();
    }, []);

    const createUser = async (email, password, displayName) => {
        try {
            let userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            await updateProfile(auth.currentUser, {
                displayName,
            });
            console.log(userCredential);
            navigate("/");
           
            // toastSuccessNotify('{displayName} Registered successfully!');
        } catch (error) {
            toastErrorNotify(error.message);
        }
    };

    
    const signIn = async (email, password) => {
        try {
            let userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            navigate("/");
            navigate("/"); 
            toastSuccessNotify('{displayName} Logged in successfully!');
            console.log(userCredential);
        } catch (error) {
            toastErrorNotify(error.message);
        }
    };

    const logOut = () => {
        signOut(auth);
        toastSuccessNotify("Logged out successfully!");
    };

    const userObserver = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const { email, displayName, photoURL } = user;
                setCurrentUser({ email, displayName, photoURL });
                console.log(user);
            } else {
                // User is signed out
                setCurrentUser(false);
                console.log("logged out");
            }
        });
    };

  const signUpProvider = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log(result);
                navigate("/");
            })
            .catch((error) => {
                // Handle Errors here.
                console.log(error);
            });
    };

    const forgotPassword = (email) => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                // Password reset email sent!
                toastWarnNotify("Please check your mail box!");
                // alert("Please check your mail box!");
            })
            .catch((err) => {
                toastErrorNotify(err.message);
                // alert(err.message);
                // ..
            });
    };

    const values = {
        createUser,
        signIn,
        logOut,
        currentUser,
        signUpProvider,
        forgotPassword,
    };
    return (
        <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
    );
};

export default AuthContextProvider;
