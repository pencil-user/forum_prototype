import React from 'react'
import {Button, Modal } from 'react-bootstrap'
import ReactMarkdown from 'react-markdown'

import { useQueryClient, useMutation } from "react-query";

import { useForm } from "react-hook-form";

import ButtonWithSpin from '../Shared/ButtonWithSpin.js'

import '../../css/Markdown.css'


import axios from 'axios'


async function createPost({...data})
{
    console.log('data for createPost', data)
    let result = await axios.post('/api/posts/', data)

    return result.data

}

async function updatePost({...data})
{
    console.log('data for editpost', data)
    let result = await axios.patch('/api/posts/'+data.id, {post_body: data.post_body})

    return result.data

}


function FormCreateUpdatePost({handleClose, defaultValues={}, id=null, thread_id=null, action='create' })
{
    const { register, handleSubmit, watch } = useForm({ defaultValues });

    const updateMutation = useMutation(updatePost) // { mutateAsync, isLoading }
    const createMutation = useMutation(createPost)


    const queryClient = useQueryClient()

    const watchedFields = watch();


    async function onSubmit(data)
    {
        if(action=='create')
        {
            await createMutation.mutateAsync({post_body: data.post_body, thread_id: thread_id})
            queryClient.invalidateQueries('thread')
            queryClient.invalidateQueries('posts')
            handleClose()
        }
        else
        {
            await updateMutation.mutateAsync({post_body: data.post_body, id: id})
            queryClient.invalidateQueries('posts')
            handleClose()
        }
    }

    return <>
    <form onSubmit={handleSubmit(onSubmit)}>  
       
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
                spinning={updateMutation.isLoading || createMutation.isLoading} 
                label="Post"
                spinningLabel="Posting..."
            />
        </Modal.Footer>
    </form>    
    </>
 
}

export default FormCreateUpdatePost