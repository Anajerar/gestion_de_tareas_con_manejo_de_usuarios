import React, { useContext, useState, useEffect } from "react";
import { Navigate,useNavigate } from "react-router-dom";
import { Navbar } from "../component/navbar";
import { Context } from "../store/appContext";
import { Link, useParams } from "react-router-dom";
import '../../styles/index.css';

const backend=process.env.BACKEND_URL

export const Tasklist = () => {
    const { store, actions } = useContext(Context);
    const token = localStorage.getItem('token')
    const [userName, setUserName] = useState('')
    const [tasks, setTasks ] = useState([])
    const [ page, setPage ] = useState('')
    const [ deleteTask, setDeleteTask ] = useState({id:null,description:''})
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
                            setUserName(userResponse.userName);
                            setTasks(userResponse.userTasks)
                            store.numberOfPages=userResponse.totalPages
                            setPage(store.currentPage)
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
        userTasks(token);
        },[])


    const nextPage= () => {
        if (store.currentPage=='first'){store.currentPage='2'}
        else { store.currentPage++ }
        setPage(store.currentPage)
        userTasks(token)
    }

    const prevPage= () => {
        if (store.currentPage=='1'){return}
        else if (store.currentPage=='last'){store.currentPage=store.numberOfPages-1}
        else { store.currentPage-- }
        userTasks(token)
    }


    const taskToDelete = () => {
        //console.log('To delete task:',deleteTask.description," id:",deleteTask.id)
        fetch(`${backend}api/users/task/${deleteTask.id}`,{method:'DELETE',
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
                            setDeleteTask({id:null,description:''});
                            userTasks(token);
                            return

        })
        .catch ( error => {console.log('Modify task: An error occurred:',error.message)})

        return
    }
    
    return (
        <div>
            <Navbar />
            <div className="row justify-content-center">
                <div className="d-flex justify-content-center">
                    <h2>Estas son tus Tareas:</h2>
                </div>
                <div className="mx-5 ps-5 row justify-content-center">
                    <table className="task-list">
                        <thead className="table-head">
                            <tr>
                            <th className="ps-4" scope="col">Tarea</th>
                            <th className="ps-3" scope="col">Descripción</th>
                            <th className="text-center" scope="col">Completado</th>
                            <th scope="col">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="table-group-divider">
                            {tasks.map((task,idx)=>{
                                    return (
                                            <tr className="task-list table-row" key={task.taskId}>
                                            <td className="ps-4">{task.taskTitle}</td>
                                            <td className="ps-3">{task.taskDescription}</td>
                                            <td className="text-center">{task.taskCompleted? <i className="fa-solid fa-square-check"></i>:<i className="fa-regular fa-hourglass-half"></i>}</td>
                                            <td>
                                                <Link to={"/modifytask/"+task.taskId}>
                                                    <span className="btn btn-primary btn-sm" href="#" role="button"><i className="fa-solid fa-pencil"></i></span>
                                                </Link>
                                                <button className="button btn-danger ms-1" data-bs-toggle="modal" data-bs-target="#deleteTask"
                                                onClick={()=>{setDeleteTask({id:task.taskId,description:task.taskTitle})}}><i className="fa-solid fa-trash"></i></button></td>
                                            </tr>)
                            })}
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-between mt-3 py-3 task-list">
                        {page=='1'? <p style={{width:'160px'}}></p> : 
                            <button className="button page-button" onClick={prevPage}>{'<< '} Página Anterior</button>}
                        <span>{'Página '+page}</span>
                        {page==store.numberOfPages ? <p style={{width:'160px'}}></p>:
                        <button className="button page-button" onClick={nextPage}> Página Siguiente {' >>'}</button>}
                    </div>
                    <div type="button" className="btn btn-subtle mt-3">
                        <Link to={"/addtask"}>
                            <span className="btn page-button mt-3">+ Agregar una Tarea</span>
                        </Link>
                    </div>

                    <div className="modal fade" id="deleteTask" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="staticBackdropLabel">Eliminar Tarea</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                            <div className="modal-body">
                                <h2>¿Deseas eliminar la tarea?: </h2>
                                <h3>{deleteTask.description}</h3>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Descartar</button>
                                <button type="button" className="btn btn-primary" onClick={taskToDelete} data-bs-dismiss="modal">Confirmar</button>
                            </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )

}