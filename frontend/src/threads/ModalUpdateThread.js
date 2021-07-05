import React from 'react'
import { Modal } from 'react-bootstrap'

import { useQuery } from "react-query";

import FormCreateUpdateThread from './FormCreateUpdateThread.js'


import axios from 'axios'


async function getSingleThread({queryKey})
{
    const [_key, { id }] = queryKey;
    let result = await axios.get('/api/threads/' + id)

    return result.data
}

function ModalUpdateThread({show, handleClose, id})
{
    const { data, error, isLoading, isError } = useQuery(["thread" , { id }], getSingleThread);


    return <>       
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    Edit Thread #{id}
                </Modal.Title>
            </Modal.Header>  
            {isLoading ?   
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div> :
            <FormCreateUpdateThread handleClose={handleClose} defaultValues={data} id={id} action={'update'} />}
        </Modal>

    </>
}


export default ModalUpdateThread