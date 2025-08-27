import { use, useEffect } from "react";
import { createContext, useState } from "react";

export let TokenContext=createContext()
export function TokenContextProvider(props){

    const [token, setToken] = useState(null)
    
    useEffect(()=>{
        if(localStorage.getItem("token")){
            setToken(localStorage.getItem("token"))
        }
    },[])

    return <TokenContext.Provider value={{token,setToken}}>
        {props.children}
    </TokenContext.Provider>
}