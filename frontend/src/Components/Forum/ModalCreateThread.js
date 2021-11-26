import React from 'react'
import { Modal } from 'react-bootstrap'

import FormCreateUpdateThread from './FormCreateUpdateThread.js'


function ModalCreateThread({ show, handleClose, defaultValues = {}, thread_id = null }) {

    return <>
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    New Thread
                </Modal.Title>
            </Modal.Header>
            {show && <FormCreateUpdateThread handleClose={handleClose} defaultValues={defaultValues} />}
            {(!show) &&
                <Modal.Body>
                    <div style={{ 'marginTop': 150, 'marginBottom': 150 }}>
                    </div>
                </Modal.Body>
            }
        </Modal>

    </>
}


export default ModalCreateThread