import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import ReactMarkdown from 'react-markdown'

import { useForm } from "react-hook-form";

import ButtonWithSpin from '../Shared/ButtonWithSpin.js'

import '../../css/Markdown.css'

import { useUpdatePost, useCreatePost } from '../../QueryHooks/posts.js'


function FormCreateUpdatePost({ handleClose, defaultValues = {}, id = null, thread_id = null, action = 'create' }) {
    const { register, handleSubmit, watch } = useForm({ defaultValues });

    const updatePostHook = useUpdatePost()
    const createPostHook = useCreatePost()

    const watchedFields = watch();

    async function onSubmit(data) {
        if (action == 'create') {
            await createPostHook.createPost(data.post_body, thread_id)
            handleClose()
        }
        else {
            await updatePostHook.updatePost(data.post_body, id)
            handleClose()
        }
    }

    return <>
        <form onSubmit={handleSubmit(onSubmit)}>

            <Modal.Body>
                <div style={{ display: "flex" }}>
                    <textarea {...register("post_body")} rows={8} style={{ flex: 1 }} required />
                </div>
                <br /><label><input type="checkbox" {...register("show_preview")} /> Show formatting preview</label>
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
                    spinning={updatePostHook.isLoading || createPostHook.isLoading}
                    label="Post"
                    spinningLabel="Posting..."
                />
            </Modal.Footer>
        </form>
    </>

}

export default FormCreateUpdatePost