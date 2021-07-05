import React from 'react'
import {Modal } from 'react-bootstrap'

import FormCreateUpdatePost from './FormCreateUpdatePost.js'


function ModalPost({show, handleClose, defaultValues = {}, thread_id=null})
{

    return <>       
        <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
            <Modal.Title>
                New Post
            </Modal.Title>
        </Modal.Header>   
            {show &&  <FormCreateUpdatePost handleClose={handleClose} thread_id={thread_id} action={'create'}/>}
        </Modal>

    </>
}


export default ModalPost