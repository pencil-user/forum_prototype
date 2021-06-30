import React, { useState, useContext } from 'react'
import {Button, Modal } from 'react-bootstrap'
import ReactMarkdown from 'react-markdown'


import { useQueryClient, useMutation } from "react-query";

import { useForm } from "react-hook-form";

import {AddMessage} from '../MessageService/MessageService.js'

import ButtonWithSpin from '../shared/ButtonWithSpin.js'


import axios from 'axios'


async function createThread({...data})
{
    console.log('data for createThread', data)
    let result = await axios.post('/api/threads/', data)

    return result.data

}

function ModalCreateThread({show, handleClose, defaultValues = {}, thread_id=null})
{

    return <>       
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    New Thread
                </Modal.Title>
            </Modal.Header>  
            {show && <FormCreateThread handleClose={handleClose} defaultValues={defaultValues} thread_id={thread_id}/>}
        </Modal>

    </>
}

function FormCreateThread({handleClose, defaultValues={} })
{
    const { register, handleSubmit, watch } = useForm({ defaultValues });

    const { mutateAsync, isLoading } = useMutation(createThread)

    const queryClient = useQueryClient()

    const watchedFields = watch();


    async function onSubmit(data)
    {
        await mutateAsync({title: data.title, thread_body: data.thread_body})
        queryClient.invalidateQueries('threads')
        AddMessage("Thread created.", 'info')
        handleClose()
    }

    return <>
    <form onSubmit={handleSubmit(onSubmit)}>         
        <Modal.Body>
            Thread Title: <br/>
                <input type="text" {...register("title")} required/>
                <br/>
            Thread Body: <br/>    
            <div style={{display:"flex"}}>
                <textarea {...register("thread_body")} rows={8} style={{flex: 1}} required/>
            </div>
            <br/><label><input type="checkbox" {...register("show_preview")}/> Show formatting preview</label>
            {watchedFields.show_preview && 
                <div className="alert alert-warning">
                    <ReactMarkdown children={watchedFields.thread_body} />
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

export default ModalCreateThread