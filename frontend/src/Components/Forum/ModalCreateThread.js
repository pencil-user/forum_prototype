import React  from 'react'
import { Modal } from 'react-bootstrap'

import FormCreateUpdateThread from './FormCreateUpdateThread.js'


function ModalCreateThread({show, handleClose, defaultValues = {}, thread_id=null})
{

    return <>       
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    New Thread
                </Modal.Title>
            </Modal.Header>  
            {show && <FormCreateUpdateThread handleClose={handleClose} defaultValues={defaultValues} />}
        </Modal>

    </>
}


export default ModalCreateThread