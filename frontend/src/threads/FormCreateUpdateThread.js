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

async function updateThread({...data})
{

    let result = await axios.patch('/api/threads/'+data.id, {thread_body: data.thread_body, title:data.title})

    return result.data

}

function FormCreateUpdateThread({handleClose, defaultValues={}, id=null, action='create' })
{
    const { register, handleSubmit, watch } = useForm({ defaultValues });

    const createMutation = useMutation(createThread) // { mutateAsync, isLoading }
    const updateMutation = useMutation(updateThread)

    const queryClient = useQueryClient()

    const watchedFields = watch();

    async function onSubmit(data)
    {
        console.log("we are here", data)
        if(action=='create')
        {
            await createMutation.mutateAsync({title: data.title, thread_body: data.thread_body})
            queryClient.invalidateQueries('threads')
            AddMessage("Thread created.", 'info')
            handleClose()
        }
        else
        {
            await updateMutation.mutateAsync({title: data.title, thread_body: data.thread_body, id:id})
            queryClient.invalidateQueries('threads')
            handleClose()
        }
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
                spinning={updateMutation.isLoading || createMutation.isLoading} 
                label={action === 'create' ? "Post" : "Edit"}
            />
        </Modal.Footer>
    </form>    
    </>
}

export default FormCreateUpdateThread