import React, { useState, useContext } from 'react'
import {Button, Modal } from 'react-bootstrap'
import ReactMarkdown from 'react-markdown'


import { useQuery, useQueryClient, useMutation } from "react-query";

import { useForm } from "react-hook-form";

import ButtonWithSpin from '../shared/ButtonWithSpin.js'


import axios from 'axios'


async function updateThread({...data})
{

    let result = await axios.patch('/api/threads/'+data.id, {thread_body: data.thread_body, title:data.title})

    return result.data

}

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
            <FormUpdateThread handleClose={handleClose} defaultValues={data} id={id}/>}
        </Modal>

    </>
}

function FormUpdateThread({handleClose, defaultValues={}, id})
{
    const { register, handleSubmit, watch } = useForm({ defaultValues });

    const { mutateAsync, isLoading } = useMutation(updateThread)

    const queryClient = useQueryClient()

    const watchedFields = watch();

    async function onSubmit(data)
    {
        await mutateAsync({title: data.title, thread_body: data.thread_body, id:id})
        queryClient.invalidateQueries('threads')
        handleClose()
    }

    return <>
    <form onSubmit={handleSubmit(onSubmit)}>           
        <Modal.Body>
            Thread Title: <br/>
                <input type="text" {...register("title")} required />
                <br/>
            Thread Body: <br/>    
            <div style={{display:"flex"}}>
                <textarea {...register("thread_body")} rows={8} style={{flex: 1}} required />
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

export default ModalUpdateThread