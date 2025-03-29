import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Navigate,useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const [ buttonRoute, setButtonRoute ] = useState('');
	const [ buttonFunction, setButtonFunction ] = useState('Sin Funcion');
	const token = localStorage.getItem('token',token);
	const navigate=useNavigate();

	useEffect(()=>{
		if (store.whereiam=='Home') {
			setButtonRoute('/signup');
			setButtonFunction('Crear Cuenta')
		}
		if (store.whereiam=='Login') {
			setButtonRoute('/signup');
			setButtonFunction('Crear cuenta')
		}
		if (store.whereiam=='Signup') {
			setButtonRoute('/login');
			setButtonFunction('Ingresar')
		}
		if (store.whereiam=='Private') {
			setButtonRoute('/');
			setButtonFunction('Logout')
		}
		
	},[])

	const handleLogout = () => {
		localStorage.removeItem('token')
		navigate('/login')
	}
	const handleSignin = () => {
		navigate('/signup')
	} 

		const handleClick = () => {
			if (store.whereiam=="Login") {
				store.whereiam="Signup"
				
			}
			else if (store.whereiam=="Signup") {
				store.whereiam="Login"
			} 
			else if (store.whereiam=="Private"){
				store.whereiam="Login"
				localStorage.removeItem('token')
				navigate('/login')
				return
			}

			navigate(buttonRoute);
			return
			
		}

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">Home</span>
				</Link>
				 <div className="ml-auto">
				 	<button className="btn btn-primary" onClick={handleClick}>{buttonFunction}</button>
				</div> 
			</div>
		</nav>
	);
};
