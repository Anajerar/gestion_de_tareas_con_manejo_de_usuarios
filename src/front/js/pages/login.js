import React, { useContext, useEffect, useState } from "react";
import { Navigate,useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Navbar } from "../component/navbar";

const backend=process.env.BACKEND_URL

export const Login = () => {
    const { store, actions } = useContext(Context);
    const [ validEmail, setValidEmail ] = useState(true)
    const [ validUser, setValidUser ] = useState(true)
    const [ successLogin, setSuccessLogin ] = useState(false)
    const navigate = useNavigate()

    useEffect(()=>{
        store.whereiam='Login';
    },[])

    const verifyForm = (email) => {
        const regex = /[a-zA-Z]/
        const atChar = email.includes('@');
        const dotChar = email.includes('.');
        const alphaEmail = regex.test(email)
        if (!alphaEmail || !atChar || !dotChar ) {
            setValidEmail(false)
            const emailElement = document.getElementById('email');
            emailElement.focus();
            return false} 
        else {
                setValidEmail(true);
            return true }
    }


    const handleLogin = async (e) => {
        e.preventDefault();
        const email=e.target.email.value
        const password=e.target.inputPassword.value
        const formOk = verifyForm(email)
        
        if (!formOk) {return}
        
        const signUpBody = JSON.stringify({'email':email,'password':password})
            const response = await fetch(`${backend}api/login`, {
                method: 'POST',
                headers: { 'Content-Type':'application/json'},
                body: signUpBody
                })
            const logInResponse = await response.json();
            const token=logInResponse['access token']
            localStorage.setItem('token', token);
            if (response.status != 200) {
                setValidUser(false)
                document.getElementById('inputPassword').value="";
                document.getElementById('email').focus()
                } else {
                    setValidUser(true)
                    setSuccessLogin(true)
                    store.whereiam='Private';
                    setTimeout(() => navigate('/private'), 2000);
                }
            //store.whereiam='Private';
            return
            }    
        
    return (
    <div className="container text-center">
        <Navbar />
        <div className="row justify-content-center"> 
            <h1>Iniciar sesión</h1> 
            <h6>Ingresa tu email y password</h6>
            <form noValidate className="col-6" onSubmit={handleLogin}>
                <div className="row mb-3">
                    <label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
                    <div className="col-sm-10">
                    <input type="email" className="form-control" id="email" />
                    {validEmail ? <p>   </p> : <p>Email invalido, favor de verificar</p>}
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Password</label>
                    <div className="col-sm-10">
                        <input type="password" className="form-control" id="inputPassword" />
                    </div>
                </div>
            
                <button type="submit" className="btn btn-primary">Enviar</button>
            </form>
            {validUser ? null : <p>Email o password invalido, favor de verificar</p>}
            {successLogin ? <p>Redirigiendo a pagina privada</p>: null}
            
        </div>
    </div>
    )
}