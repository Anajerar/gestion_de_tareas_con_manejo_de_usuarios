import React, { useContext, useState, useEffect } from "react";
import { Navigate,useNavigate } from "react-router-dom";
import { Navbar } from "../component/navbar";
import { Context } from "../store/appContext";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";

const token = localStorage.getItem('token')
const backend=process.env.BACKEND_URL


export const ModifyTask = () => {
    const [task,setTask]=useState({})
    //const [completeCheck, setCompletedCheck]=useState(false)
    const params = useParams();
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    let tittle='';
    let description='';
    let completed=false;

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
                console.log(userResponse)
                setTask(userResponse)
                
                return

                            })
        .catch ( error => {console.log('Modify task: An error occurred:',error.message)})
        
            return
    }

    useEffect(()=>{
        if (!token) { 
            navigate('/login')    
        }
        fetchSingleTask(token,params.taskid)
    },[])

    const titleChange = (e) =>{
        console.log(e.target.value)
        tittle=e.target.value
        return
    }

    const descriptionChange = (e) =>{
        console.log(e.target.value)
        description=e.target.value
        return
    }

    const checkCompletion = (e) =>{
            if (task.completed)
                setTask(prevTask => ({...prevTask,completed:false}))
            else setTask(prevTask => ({...prevTask,completed:true}))
    }

    const updateTask = () => {
        const taskId=task.id
        fetch(`${backend}api/users/task/${taskId}`,{method:'PUT',
            headers : {"Content-Type": "application/json",
            Authorization: `Bearer ${token}`}    })
        .then(response => {
                            if (!response.ok) {
                            throw new Error(response.statusText+":"+response.status);
                            }
                            return response.json()
                            })
        .then( userResponse =>{
                                console.log(userResponse)
                                return

        })
        .catch ( error => {console.log('Modify task: An error occurred:',error.message)})

        return
    }

    return(
            <div className="jumbotron">
                <Navbar />
                <div className="d-flex justify-content-center">
                    <h1>Actualizacion de tarea: {params.taskid}</h1>
                </div>
                <div className="mx-5">
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
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="defaultCheck1" checked={task.completed}
                                    onClick={checkCompletion}/>
                                    <label class="form-check-label" for="defaultCheck1">
                                        Completed
                                    </label>
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
    )

}

ModifyTask.propTypes = {
    match: PropTypes.object
};