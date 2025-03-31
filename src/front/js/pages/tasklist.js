import React, { useContext, useState, useEffect } from "react";
import { Navigate,useNavigate } from "react-router-dom";
import { Navbar } from "../component/navbar";
import { AddTaskModal } from "./addTaskModal";
import { Context } from "../store/appContext";
import { Link, useParams } from "react-router-dom";

const backend=process.env.BACKEND_URL

export const Tasklist = () => {
    const { store, actions } = useContext(Context);
    const token = localStorage.getItem('token')
    const [userName, setUserName] = useState('')
    const [tasks, setTasks ] = useState([])
    const [ page, setPage ] = useState('')
    const navigate = useNavigate()

    const userTasks = async(token) =>{
        fetch(`${backend}api/users/tasks/${store.currentPage}`,{
                                        headers : {"Content-Type": "application/json",
                                        Authorization: `Bearer ${token}`}            
                                        })
        .then(response => {
                            if (!response.ok) {
                                throw new Error(response.statusText+":"+response.status);
                                }
                            return response.json()
                            })
        .then( userResponse =>{
                            console.log(userResponse)
                            setUserName(userResponse.userName);
                            setTasks(userResponse.userTasks)
                            store.numberOfPages=userResponse.totalPages
                            if (store.currentPage=='first'){setPage('first')}
                            if (userResponse.totalPages==store.currentPage){
                                                                store.currentPage='last';
                                                                setPage('last')
                                                                            }
                            return

                            })
        .catch ( error => {console.log('An error occurred:catched:',error.message)})

        return
                        }

    useEffect(()=> {
        store.whereiam='Tasklist'
        
        if (!token) { 
            store.whereiam='Home';
            navigate('/')
            
        } 
        //store.whereiam='Tasklist';
        userTasks(token);
        },[])


    const nextPage= () => {
        if (store.currentPage=='first'){store.currentPage='2'}
        else { store.currentPage++ }
        setPage(store.currentPage)
        userTasks(token)
    }

    const prevPage= () => {
        if (store.currentPage=='fisrt'){return}
        else if (store.currentPage=='last'){store.currentPage=store.numberOfPages-1}
        else { store.currentPage-- }
        if (store.currentPage=='1') { store.currentPage='first'}
        userTasks(token)
    }

    const pageIndex = (page) => {
        if (page!='first' || page!='last') return <span>{store.currentPage}</span>
    }
    
    return (
        <div>
            <Navbar />
            <div className="row justify-content-center">
                <div className="col-7">
                    <h1>Hola {userName}, esta es tu Lista de Tareas.</h1>
                </div>
                <div className="mx-5 ps-5 row justify-content-center">
                    <table>
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
                                            <tr key={task.taskId}>
                                            <td>{task.taskTitle}</td>
                                            <td>{task.taskDescription}</td>
                                            <td className="text-center">{task.taskCompleted? <i className="fa-solid fa-square-check"></i>:<i className="fa-regular fa-hourglass-half"></i>}</td>
                                            <td>
                                                <Link to={"/modifytask/"+task.taskId}>
                                                    <span className="btn btn-primary btn-sm" href="#" role="button"><i className="fa-solid fa-pencil"></i></span>
                                                </Link>
                                                <button className="button btn-danger ms-1"><i className="fa-solid fa-trash"></i></button></td>
                                            </tr>)
                            })}
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-between mt-3">
                        {page=='first'? <p></p> : 
                            <button className="button btn-subtle" onClick={prevPage}>{'<< '} Página Anterior</button>}
                        {pageIndex(page)}
                        {page=='last' ? <p></p>:
                        <button className="button btn-subtle" onClick={nextPage}> Página Siguiente {' >>'}</button>}
                    </div>
                    <div type="button" className="btn btn-subtle mt-3" data-bs-toggle="modal" data-bs-target="#addTask">
                        <button>+ Agregar una Tarea</button>
                    </div>

                    < AddTaskModal/>

                </div>
            </div>
        </div>
    )

}