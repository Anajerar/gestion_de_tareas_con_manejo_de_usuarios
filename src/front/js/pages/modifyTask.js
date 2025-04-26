import React, { useContext, useState, useEffect } from "react";
import { Navigate,useNavigate } from "react-router-dom";
import { Navbar } from "../component/navbar";
import { Context } from "../store/appContext";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";

const token = localStorage.getItem('token')
const backend=process.env.BACKEND_URL


export const ModifyTask = () => {
    const { store, actions } = useContext(Context);
    const [task,setTask]=useState({})
    const params = useParams();
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const [priorityList, setPriorityList] = useState([]);

    const fetchSingleTask = (token, taskId) =>{
        fetch(`${backend}api/users/task/${taskId}`,{method:'GET',
                                                    headers : {"Content-Type": "application/json",
                                                    Authorization: `Bearer ${token}`}    })
        .then(response => {
                            if (!response.ok) {
                                throw new Error(response.statusText+":"+response.status);
                                }
                            return response.json()
                            })
        .then( userResponse =>{
                                setTask(userResponse);
                                return
                            })
        .catch ( error => {console.log('Modify task: An error occurred:',error.message)})
        
            return
    }

    const fetchPriorityList = () => {
        console.log("fetching priority list");
        fetch(`${backend}api/priorities`,{method:'GET',
                                                    headers : {"Content-Type": "application/json"
                                                    }})
        .then(response => {
                            if (!response.ok) {
                                throw new Error(response.statusText+":"+response.status);
                                }
                            return response.json()
                            })
        .then( userResponse =>{
                                console.log("the priority list",userResponse);
                                setPriorityList(userResponse);
                                return
                            })
        .catch ( error => {console.log('Modify task: An error occurred:',error.message)})
        return}

    useEffect(()=>{
        if (!token) { 
            navigate('/login')    
        }
        fetchSingleTask(token,params.taskid)
        fetchPriorityList();
    },[])

    const titleChange = (e) =>{
        console.log(e.target.value)
        const title=e.target.value
        setTask(prevTask => ({...prevTask,title:title}))
        return
    }

    const descriptionChange = (e) =>{
        console.log(e.target.value)
        const description=e.target.value
        setTask(prevTask => ({...prevTask,description:description}))
        return
    }

    const notesChange = (e) =>{
        console.log(e.target.value)
        const notes=e.target.value
        setTask(prevTask => ({...prevTask,notes:notes}))
        return
    }

    const checkCompletion = (e) =>{
            if (task.completed)
                setTask(prevTask => ({...prevTask,completed:false}))
            else setTask(prevTask => ({...prevTask,completed:true}))
    }

    const updateTask = () => {
        const taskId=task.id
        const bodyData = JSON.stringify({"id":task.id,"title":task.title,"description":task.description,
                                        "notes":task.notes, "completed":task.completed})

        fetch(`${backend}api/users/task/${taskId}`,{method:'PUT',
                                                    headers : {"Content-Type": "application/json",
                                                    Authorization: `Bearer ${token}`}, 
                                                    body:bodyData   })
        .then(response => {
                            if (!response.ok) {
                            throw new Error(response.statusText+":"+response.status);
                            }
                            return response.json()
                            })
        .then( userResponse =>{navigate("/tasklist")
                                return})

        .catch ( error => {console.log('Modify task: An error occurred:',error.message)})

        return
    }

    return(
            <div className="jumbotron">
                <Navbar />
                <div className="row add-task-container">
                    <div>
                        <div className="d-flex justify-content-center">
                            <h1>Actualizacion de tarea</h1>
                        </div>
                        <div className="px-5 py-3 row form-body">
                            <label htmlFor="taskTitle" className="form-label">Titulo de la Tarea</label>
                            <input type="text" id="taskTitle" className="form-control" onChange={titleChange} defaultValue={task.title}/>
                            <div id="titleHelp" className="form-text">
                                    Titulo de la Tarea no mayor a 100 caracteres
                            </div>
                            <label htmlFor="taskDescription" className="form-label">Descripcion</label>
                            <textarea id="taskDescription" className="form-control" onChange={descriptionChange} defaultValue={task.description}/>
                            <div id="titleHelp" className="form-text">
                                    Descripcion: 300 caracteres
                            </div>
                            <label htmlFor="taskNotes" className="form-label">Notas</label>
                            <textarea id="taskNotas" className="form-control" onChange={notesChange} defaultValue={task.notes}/>
                            <div id="notesHelp" className="form-text">
                                    Notas: 1000 caracteres
                            </div>

                            <div class="input-group mb-3">
                                <label class="input-group-text" for="inputGroupSelect01">Priority</label>
                                    <select class="form-select" id="inputGroupSelect01">
                                        <option selected>Choose...</option>
                                        {priorityList.map((priority) => {
                                            return (
                                                <option key={priority.id} value={priority.id}>{priority.description}</option>
                                            )
                                        })}    
                                    </select>
                            </div>

                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" checked={task.completed}
                                        onClick={checkCompletion}/>
                                <label className="form-check-label" htmlFor="defaultCheck1">Completed</label>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center">
                            <Link to="/">
                                <span className="btn btn-primary btn-lg m-3" href="#" role="button">
                                        Descartar cambios
                                </span>
                            </Link>
                            <button type="button" className="btn btn-primary btn-lg m-3" onClick={updateTask} >Actualizar Cambios</button>
                        </div>
                    </div>
                </div>
            </div>
    )

}

ModifyTask.propTypes = {
    match: PropTypes.object
};