import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Navigate,useNavigate } from "react-router-dom";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { Navbar } from "../component/navbar";

const backend=process.env.BACKEND_URL

export const Home = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate()
	const token=localStorage.getItem('token',token);

	const identify = () => {
		fetch(`${backend}api/users/me`,{headers : {"Content-Type": "application/json",
										Authorization: `Bearer ${token}`,}})
		.then(response => {
				if (!response.ok) {
					throw new Error(response.statusText+":"+response.status);
					}
				return response.json()
				})
		.then( userResponse =>{
								console.log(userResponse)
								store.whereiam='Tasklist';
								navigate('/tasklist')
								return

			})
		.catch(error => {console.log('An error occurred:catched:',error.message);
						localStorage.removeItem('token');
						navigate('/login')
		})
	}
	
	useEffect(()=>{
		store.whereiam='Home';
		if (!token) {
					console.log('No token')
					store.whereiam='Login';
					navigate('/login')
					}
		identify();
		return
	},[])

	return (
		<div className="text-center mt-5">
			<Navbar />
			<h1>Gestor de Tareas</h1>
			<div className="alert alert-info">
				{store.message || "Loading message from the backend (make sure your python backend is running)..."}
			</div>
		</div>
	);
};
