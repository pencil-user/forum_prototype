import React, { useState } from 'react'
import {Modal, Button } from 'react-bootstrap'
import { useForm } from "react-hook-form";
import {LoginUser} from '../../UserService/UserService.js';
import MainSpinner from '../Shared/MainSpinner.js'
import { useQuery } from "react-query";


import axios from 'axios'

function ModalUserCard({show, handleClose, params=null})
{
    const id = params?.id

    return <>       
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    User #{id}
                </Modal.Title>
            </Modal.Header>
            
            {show && <Loader handleClose={handleClose} id={id}/>}
        </Modal>

    </> 
}

async function getUsers({queryKey})
{
    const [_key, { id }] = queryKey;
    let result = await axios.get('/api/users/' + id)

    return result.data
}

function Loader({handleClose, id})
{
    const { data, isLoading, isError } = useQuery(["users", {id}], getUsers);

    return <>
        <Modal.Body>
            {isLoading && <MainSpinner/>}
            {data && 
                    <div>
                    <div className="d-flex justify-content-between">
                        <h5>Username:</h5> <h5>{data.username}</h5>
                    </div>
                    <div className="d-flex justify-content-between">
                        <h5>Level:</h5> <h5>{['Anonymous', 'User', 'Administrator'][data.level]}</h5>
                    </div>
                    <div className="d-flex justify-content-between">
                        <h5>Number of threads:</h5> <h5>{data.threads}</h5>
                    </div>
                    <div className="d-flex justify-content-between">
                        <h5>Number of posts:</h5> <h5>{data.posts}</h5>
                    </div>                    
                </div>
            }
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Cancel
            </Button>
        </Modal.Footer>    
    </>
}

export default ModalUserCard