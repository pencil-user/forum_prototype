import React from 'react'
import { Modal } from 'react-bootstrap'

import { useQuery } from "react-query";

import FormCreateUpdatePost from './FormCreateUpdatePost.js'

import axios from 'axios'


async function getSinglePost({queryKey})
{
    const [_key, { id }] = queryKey;
    let result = await axios.get('/api/posts/' + id)

    return result.data
}

function ModalUpdatePost({show, handleClose, params=null})
{
    let id = params?.post_id
    return <>       
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    Edit Post #{id}
                </Modal.Title>
            </Modal.Header>             
            {show && <Loader handleClose={handleClose} id={id}/>}   
        </Modal>

    </>
}

function Loader({handleClose, id=null})
{
    const { data, error, isLoading, isError } = useQuery(["thread" , { id }], getSinglePost);

    return <>
            {isLoading ?   
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div> :
            <FormCreateUpdatePost handleClose={handleClose} defaultValues={data} id={id} action={'update'}/>}        
    </>
}



export default ModalUpdatePost