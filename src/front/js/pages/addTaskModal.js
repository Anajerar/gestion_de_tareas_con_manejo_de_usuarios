import React, { useContext, useState, useEffect } from "react";
import { Navigate,useNavigate } from "react-router-dom";
import { Navbar } from "../component/navbar";
import { Context } from "../store/appContext";

const token = localStorage.getItem('token')
const backend=process.env.BACKEND_URL

export const AddTaskModal = () => {
const [ show, setShow ] = useState(true)
const { store, actions } = useContext(Context);
const navigate = useNavigate()
let tittleToAdd='';
let descriptionToAdd='';

const titleChange = (e) =>{
    console.log(e.target.value)
    tittleToAdd=e.target.value
    return
}

const descriptionChange = (e) =>{
    console.log(e.target.value)
    descriptionToAdd=e.target.value
    return
}

const addTask = () => {
    const completed = false;
    console.log('task:',tittleToAdd,' description:',descriptionToAdd, ' completed:', completed)
    const bodyData = JSON.stringify({'task':tittleToAdd,'description':descriptionToAdd, 'completed': completed})
    fetch(`${backend}api/users/addtask`,{method:'POST',
                                        headers : {"Content-Type": "application/json",
                                        Authorization: `Bearer ${token}`},
                                        body:bodyData            
                                        })
    .then(response => {
                        if (!response.ok) {
                            throw new Error(response.statusText+":"+response.status);
                            }
                        return response.json()
                        })
    .then( userResponse =>{
                            console.log(userResponse)
                            setShow(false)
                            store.currentPage=store.numberOfPages
                            navigate('/tasklist')
                            return

                        })
    .catch ( error => {console.log('An error occurred:catched:',error.message)})
    return
}

    return(
                    <div className="modal fade" id="addTask" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="staticBackdropLabel">Agregar Tarea</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <label htmlFor="taxkTitle" className="form-label">Titulo</label>
                                <input type="text" id="taskTitle" className="form-control" onChange={titleChange}/>
                                <div id="titleHelp" className="form-text">
                                    Titulo de la Tarea no mayor a 100 caracteres
                                </div>
                                <label htmlFor="taskDescription" className="form-label">Descripcion</label>
                                <textarea id="taskDescription" className="form-control" onChange={descriptionChange} />
                                <div id="titleHelp" className="form-text">
                                    Descripcion: 300 caracteres
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Descartar</button>
                                <button type="button" className="btn btn-primary" onClick={addTask} data-bs-dismiss="modal">Agregar tarea</button>
                            </div>
                            </div>
                        </div>
                    </div>
    )

}