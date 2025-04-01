import React, { useState, useEffect, useContext } from "react";
import { Navigate,useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const backend=process.env.BACKEND_URL

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const [ buttonRoute, setButtonRoute ] = useState('');
	const [ buttonFunction, setButtonFunction ] = useState('Sin Funcion');
	const [ userName, setUserName ] = useState('')
	const token = localStorage.getItem('token',token);
	const navigate=useNavigate();

	const identify = () => {
		fetch(`${backend}api/users/me`,{headers : {"Content-Type": "application/json",
										Authorization: `Bearer ${token}`,}})
		.then(response => {
				if (!response.ok) {
					throw new Error(response.statusText+":"+response.status);
					}
				return response.json()
				})
		.then( userResponse =>{ setUserName(userResponse.name);
								return

			})
		.catch(error => {console.log('An error occurred:catched:',error.message);
						localStorage.removeItem('token');
						navigate('/login')
		})
	}

	useEffect(()=>{
		if (token) {identify()
			setButtonRoute('/')
			setButtonFunction('Cerrar session')
			return
		}
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
	},[])


	const handleClick = () => {
			if (buttonFunction=="Cerrar session"){
				localStorage.removeItem('token');
				navigate('/login')
			}
			if (store.whereiam=="Login") {
				store.whereiam="Signup"
				
			}
			else if (store.whereiam=="Signup") {
				store.whereiam="Login"
			} 
			else if (store.whereiam=="Tasklist"){
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
				
					<span className="navbar-brand mb-0 h1">{userName ?'Hola '+userName: 'Gestion de Tareas'} </span>
				
				 <div className="ml-auto">
				 	<button className="btn btn-primary" onClick={handleClick}>{buttonFunction}</button>
				</div> 
			</div>
		</nav>
	);
};
