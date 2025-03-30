import React, { useContext, useState, useEffect } from "react";
import { Navigate,useNavigate } from "react-router-dom";
import { Navbar } from "../component/navbar";
import { Context } from "../store/appContext";

const backend=process.env.BACKEND_URL

export const Tasklist = () => {
    const { store, actions } = useContext(Context);
    const token = localStorage.getItem('token')
    const [userName, setUserName] = useState('')
    const [tasks, setTasks ] = useState([])
    const navigate = useNavigate()

    useEffect(()=> {
        store.whereiam='Tasklist'
        console.log('where i am',store.whereiam)
        const fetchTasks = async(token) => {
            const response = await fetch(`${backend}api/users/tasks`,{
                headers : {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  }            })
            const userResponse = await response.json();
            console.log(userResponse)
            setUserName(userResponse.userName);
            setTasks(userResponse.userTasks)
            return
            }
        
        if (!token) { 
            store.whereiam='Home';
            navigate('/')
            
        } 
        //store.whereiam='Tasklist';
        fetchTasks(token);
        },[])

    
    return (
        <div>
            <Navbar />
            <div className="row justify-content-center">
                <div className="col-7">
                    <h1>Hola {userName}, esta es tu Lista de Tareas.</h1>
                </div>
                <div className="mx-5 bg-yellow">
                    <table className="table">
                        <thead>
                            <tr>
                            <th scope="col">Tarea</th>
                            <th scope="col">Descripción</th>
                            <th className="text-center" scope="col">Completado</th>
                            <th scope="col">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="table-group-divider">
                            {tasks.map((task,idx)=>{
                                    return (
                                            <tr>
                                            <td>{task.taskTitle}</td>
                                            <td>{task.taskDescription}</td>
                                            <td className="text-center">{task.taskCompleted? <i className="fa-solid fa-square-check"></i>:<i className="fa-regular fa-hourglass-half"></i>}</td>
                                            <td><button className="button btn-primary me-1"><i className="fa-solid fa-pencil"></i></button>
                                                <button className="button btn-danger ms-1"><i className="fa-solid fa-trash"></i></button></td>
                                            </tr>)
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )

}