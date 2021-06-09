import React, { useState, useContext } from 'react'
import {Button, Modal } from 'react-bootstrap'
import ReactMarkdown from 'react-markdown'


import { useQuery, useQueryClient, useMutation } from "react-query";

import { useForm } from "react-hook-form";

import ButtonWithSpin from '../shared/ButtonWithSpin.js'


import axios from 'axios'

async function updatePost({...data})
{
    console.log('data for editpost', data)
    let result = await axios.patch('/api/posts/'+data.id, {post_body: data.post_body})

    return result.data

}

async function getSinglePost({queryKey})
{
    const [_key, { id }] = queryKey;
    let result = await axios.get('/api/posts/' + id)

    return result.data
}

function ModalUpdatePost({show, handleClose, id=null})
{
    const { data, error, isLoading, isError } = useQuery(["thread" , { id }], getSinglePost);

    return <>       
        <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
            <Modal.Title>
                Edit Post #{id}
            </Modal.Title>
        </Modal.Header>             
            {isLoading ?   
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div> :
            <FormUpdatePost handleClose={handleClose} defaultValues={data} id={id}/>}
        </Modal>

    </>
}

function FormUpdatePost({handleClose, defaultValues={}, id })
{
    const { register, handleSubmit, watch } = useForm({ defaultValues });

    const { mutateAsync, isLoading } = useMutation(updatePost)

    const queryClient = useQueryClient()

    const watchedFields = watch();


    async function onSubmit(data)
    {
        await mutateAsync({post_body: data.post_body, id: id})
        queryClient.invalidateQueries('thread')
        queryClient.invalidateQueries('posts')
        handleClose()
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
            }        </Modal.Body>
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

export default ModalUpdatePost