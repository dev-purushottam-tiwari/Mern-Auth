import { createContext, use } from "react"
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";


axios.defaults.withCredentials = true
export const AppContent =  createContext();

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin, setIsLoggedIn] = useState(false);
    const [userData,setUserData] = useState(false);

    const getUserData = async()=>{
        try {
            const {data} = await axios.get(backendUrl+'/api/user/data');
             data.success ?
             setUserData(data.userData) :
             toast.error(data.message);
            
        } catch (error) {
           toast.error(error.message);
            
            
        }
    }

    const getAuthState =async()=>{
        try {
            const {data} = await axios.post(backendUrl+'/api/auth/is-auth');
            if(data.success){
                setIsLoggedIn(true);
                getUserData();
            }
            
        } catch (error) {
            toast.error(error.message);
            
        }
    }
    useEffect(()=>{
        getAuthState();
    },[])


    const value={
        backendUrl,
        isLoggedin,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData
    }

    return (
        <AppContent.Provider value={value}>
            {props.children}
            
        </AppContent.Provider>
    )
}