import React, { useContext, useState, useEffect } from "react";
import { Navigate,useNavigate } from "react-router-dom";
import { Navbar } from "../component/navbar";
import { Context } from "../store/appContext";
import { Link, useParams } from "react-router-dom";

const token = localStorage.getItem('token')
const backend=process.env.BACKEND_URL

export const AddTask = () => {
const [ show, setShow ] = useState(true)
const { store, actions } = useContext(Context);
const navigate = useNavigate()
let tittleToAdd='';
let descriptionToAdd='';

const titleChange = (e) =>{
    tittleToAdd=e.target.value
    return
}

const descriptionChange = (e) =>{
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
                            store.currentPage='1'
                            navigate('/tasklist')
                            return

                        })
    .catch ( error => {console.log('An error occurred:catched:',error.message)})
    return
}

    return(
                    <div className="jumbotron" id="addTask">
                        <Navbar />
                        <div className="row add-task-container">
                            <div>
                                <div>
                                    <h3 className="m-3" id="staticBackdropLabel">Agregar Tarea</h3>
                                </div>
                                <div className="row form-body py-3">
                                    <div className="row">
                                        <label htmlFor="taskTitle" className="form-label ms-3">Titulo</label>
                                        <input type="text" id="taskTitle" className="form-control ms-3" onChange={titleChange}/>
                                    </div>
                                    <div id="titleHelp" className="form-text ms-3">
                                        Titulo de la Tarea no mayor a 50 caracteres
                                    </div>
                                    <div className="row">
                                        <label htmlFor="taskDescription" className="form-label mt-3 ms-3">Descripcion</label>
                                        <textarea id="taskDescription" className="form-control ms-3" onChange={descriptionChange} />
                                    </div>
                                    <div id="titleHelp" className="form-text ms-3 mb-3">
                                        Descripcion: 300 caracteres
                                    </div>
                                </div>
                            <div className="d-flex justify-content-center">
                                <Link to="/tasklist">
                                    <span type="button" className="btn btn-secondary m-3" data-bs-dismiss="modal">Descartar</span>
                                </Link>
                                <button type="button" className="btn btn-primary m-3" onClick={addTask} data-bs-dismiss="modal">Agregar tarea</button>
                            </div>
                            </div>
                        </div>
                    </div>
    )

}