import React, { useContext, useState, useEffect } from "react";
import { Navigate,useNavigate } from "react-router-dom";
import { Navbar } from "../component/navbar";
import { Context } from "../store/appContext";

const backend=process.env.BACKEND_URL

export const Signup = () => {
    const { store, actions } = useContext(Context);
    const [ validEmail, setValidEmail ] = useState(true)
    const [ validName, setValidName ] = useState(true)
    const [ validPassword, setValidPassword ] = useState(true)
    const [ validPswConf, setValidPswConf ] = useState(true)
    const [ validUser, setValidUser ] = useState(true)
    const [ userLoginMsg, setUserLoginMsg ] = useState('')
    const navigate = useNavigate()

    useEffect(()=>{
        store.whereiam="Signup";
    },[])

    const clearStates = () => {
        setValidEmail(true);
        setValidName(true);
        setValidPassword(true);
        setValidPswConf(true);
        return
    }

    const verifyForm = (email,userName,password) => {
        const regex = /[a-zA-Z]/
        const atChar = email.includes('@');
        const dotChar = email.includes('.');
        const alphaEmail = regex.test(email)
        
        if (userName.length ==0){
            setValidName(false);
            document.getElementById('userName').focus();
            return false}
        else { setValidName(true)}

        if (!alphaEmail || !atChar || !dotChar ) {
            setValidEmail(false)
            document.getElementById('email').focus();
            return false} 
        else { setValidEmail(true); }

        if (password.length < 6 || !password.match(/\d/) || !regex.test(password)) {
            setValidPassword(false);
            document.getElementById('inputPassword').focus();
            return
        }
                 
        return true
    }

    const handleSignUp = async (e) => {
        e.preventDefault();
        const userName = e.target.userName.value;
        const email=e.target.email.value;
        const password=e.target.inputPassword.value;
        const confirmPassword = e.target.confirmPassword.value;
        clearStates();

        if (password != confirmPassword ) {
            setValidPswConf(false)
            document.getElementById('confirmPassword').focus();
            return
        }

        const formOk = verifyForm(email,userName,password);
        if (!formOk) {
            return
        }

        const signUpBody = JSON.stringify({'user_name':userName,'email':email,'password':password});
            const response = await fetch(`${backend}api/signin`, {
                method: 'POST',
                headers: { 'Content-Type':'application/json'},
                body: signUpBody
                })
            const signUpResponse = await response.json();
            if (response.status != 200) {
                setUserLoginMsg(signUpResponse.msg);
                document.getElementById('userName').focus();
                return
                } else {
                    setUserLoginMsg('Usuario creado exitosamente')
                    store.whereiam="Login";
                    setTimeout(() => navigate('/login'), 2000);
                }
            
            return
            }    

    return (
    <div className="container text-center">
        <Navbar />
        <div className="row justify-content-center"> 
            <h1>Crea tu Cuenta</h1> 
            <form noValidate className="col-6" onSubmit={handleSignUp}>
                <div className="row mb-3">
                    <label htmlFor="userName" className="col-sm-2 col-form-label">Nombre de usuario</label>
                    <div className="col-sm-10">
                    <input type="text" className="form-control" id="userName" />
                    {validName ? <p>   </p> : <p className='fail'>Ingresa un nombre de usuario</p>}
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
                    <div className="col-sm-10">
                    <input type="email" className="form-control" id="email"/>
                    {validEmail ? <p>   </p> : <p className='fail'>Formato de Email invalido, favor de verificar</p>}
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Password</label>
                    <div className="col-sm-10">
                        <input type="password" className="form-control" id="inputPassword" />
                        {validPassword ? <p className="instruc"> Mayor de 6 caracteres incluyendo letras y numeros  </p> : <p className='fail'>Password debe ser mayor de 6 caracteres y contener letras y numeros</p>}
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="confirmPassword" className="col-sm-2 col-form-label">Confirma tu Password</label>
                    <div className="col-sm-10">
                        <input type="password" className="form-control" id="confirmPassword" />
                        {validPswConf ? <p>   </p> : <p className='fail'>Passwords no coinciden, intenta de nuevo</p>}
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Enviar</button>
                <p>{userLoginMsg}</p>
            </form>      
        </div>
    </div>
    )
}