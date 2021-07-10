import React from 'react'
import { Modal } from 'react-bootstrap'

import { useQuery } from "react-query";

import FormCreateUpdateThread from './FormCreateUpdateThread.js'

import MainSpinner from '../Shared/MainSpinner.js'

import axios from 'axios'


async function getSingleThread({queryKey})
{
    const [_key, { id }] = queryKey;
    let result = await axios.get('/api/threads/' + id)

    return result.data
}

function ModalUpdateThread({show, handleClose, params=null})
{
    let id=params?.id
    return (       
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    Edit Thread #{id}
                </Modal.Title>
            </Modal.Header>
            <>
                {show && <Loader id={id} handleClose={handleClose}/>}
            </>
            <>
            {(!show) && 
                <Modal.Body>
                    <div style={{'marginTop':150, 'marginBottom':150 }}>
                    </div>
                </Modal.Body>
            }
            </>
        </Modal>

    )
}

function Loader({handleClose, id=null})
{
    const { data, error, isLoading, isError } = useQuery(["thread" , {id}], getSingleThread);

    if(isLoading)
        return <MainSpinner /> 


    return <FormCreateUpdateThread handleClose={handleClose} defaultValues={data} id={id} action={'update'} />
    
}


export default ModalUpdateThread