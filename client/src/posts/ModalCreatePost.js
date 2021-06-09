import React, { useState, useContext } from 'react'
import {Button, Modal } from 'react-bootstrap'
import ReactMarkdown from 'react-markdown'

import { useQueryClient, useMutation } from "react-query";

import { useForm } from "react-hook-form";

import ButtonWithSpin from '../shared/ButtonWithSpin.js'


import axios from 'axios'

async function createPost({...data})
{
    console.log('data for createPost', data)
    let result = await axios.post('/api/posts/', data)

    return result.data

}

function ModalPost({show, handleClose, defaultValues = {}, thread_id=null})
{

    return <>       
        <Modal show={show} onHide={handleClose} size="lg">
            {show && <FormPost handleClose={handleClose} defaultValues={defaultValues} thread_id={thread_id}/>}
        </Modal>

    </>
}

function FormPost({handleClose, defaultValues={}, thread_id })
{
    const { register, handleSubmit, watch } = useForm({ defaultValues });

    const { mutateAsync, isLoading } = useMutation(createPost)

    const queryClient = useQueryClient()

    const watchedFields = watch();

    async function onSubmit(data)
    {
        await mutateAsync({post_body: data.post_body, thread_id: thread_id})
        queryClient.invalidateQueries('thread')
        queryClient.invalidateQueries('posts')
        
        handleClose()
    }

    return <>
    <form onSubmit={handleSubmit(onSubmit)}>  
        <Modal.Header closeButton>
            <Modal.Title>
                New Post
            </Modal.Title>
        </Modal.Header>         
        <Modal.Body>
            <div style={{display:"flex"}}>
                <textarea {...register("post_body")} rows={8} style={{flex: 1}} required/>
            </div>
            <br/><label><input type="checkbox" {...register("show_preview")}/> Show formatting preview</label>
            {watchedFields.show_preview && 
                <div className="alert alert-warning">
                    <ReactMarkdown children={watchedFields.post_body} />
                </div>
            }
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Cancel
            </Button>
            <ButtonWithSpin 
                className="btn-primary" 
                type="submit" 
                spinning={isLoading} 
                label="Post"
                spinningLabel="Posting..."
            />
        </Modal.Footer>
    </form>    
    </>
 
}

export default ModalPost