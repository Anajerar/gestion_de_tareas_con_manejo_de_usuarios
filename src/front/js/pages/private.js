import React, { useContext, useState, useEffect } from "react";
import { Navigate,useNavigate } from "react-router-dom";
import { Navbar } from "../component/navbar";
import { Context } from "../store/appContext";

const backend=process.env.BACKEND_URL

export const Private = () => {
    const { store, actions } = useContext(Context);
    const token = localStorage.getItem('token')
    const [userName, setUserName] = useState('')
    const navigate = useNavigate()

    useEffect(()=> {
        const fetchData = async(token) => {
            const response = await fetch(`${backend}api/users/me`,{
                headers : {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  }            })
            const userResponse = await response.json();
            setUserName(userResponse.name);
            return
            }
        
        if (!token) { 
            store.whereiam='Home';
            navigate('/')
            
        } 
        store.whereiam='Private';
        fetchData(token);
        },[])

    
    
    /* const getUserEmail = async() => {
        if (!token){
            navigate('/')
        }
    } */
    
    return (
        <div>
            <Navbar />
            <div className="row justify-content-center">
                <div className="col-7">
                    <h1>Hola {userName}, esta es tu pagina privada.</h1>
                </div>
            </div>
        </div>
    )

}