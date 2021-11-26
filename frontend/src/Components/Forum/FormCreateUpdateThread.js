import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import ReactMarkdown from 'react-markdown'

import { useForm } from "react-hook-form";

import { AddAlert } from '../../AlertService/AlertService.js'

import ButtonWithSpin from '../Shared/ButtonWithSpin.js'

import { useUpdateThread, useCreateThread } from '../../QueryHooks/threads.js'


function FormCreateUpdateThread({ handleClose, defaultValues = {}, id = null, action = 'create' }) {
    const { register, handleSubmit, watch } = useForm({ defaultValues });

    const createThreadHook = useCreateThread(id)
    const updateThreadHook = useUpdateThread(id)

    const watchedFields = watch();

    async function onSubmit(data) {
        console.log("we are here", data)
        if (action == 'create') {
            await createThreadHook.createThread({ title: data.title, thread_body: data.thread_body })
            AddAlert("Thread created.", 'info')
            handleClose()
        }
        else {
            await updateThreadHook.updateThread({ title: data.title, thread_body: data.thread_body, id: id })
            handleClose()
        }
    }

    return <>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body>
                Thread Title: <br />
                <input type="text" {...register("title")} required />
                <br />
                Thread Body: <br />
                <div style={{ display: "flex" }}>
                    <textarea {...register("thread_body")} rows={8} style={{ flex: 1 }} required />
                </div>
                <br /><label><input type="checkbox" {...register("show_preview")} /> Show formatting preview</label>
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
                    spinning={updateThreadHook.isLoading || createThreadHook.isLoading}
                    label={action === 'create' ? "Post" : "Edit"}
                />
            </Modal.Footer>
        </form>
    </>
}

export default FormCreateUpdateThread