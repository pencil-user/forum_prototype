import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import MainSpinner from '../Shared/MainSpinner.js'
import { useGetUser } from '../../QueryHooks/users.js'

function ModalUserCard({ show, handleClose, params = null }) {
    const id = params?.id

    return <>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    User #{id}
                </Modal.Title>
            </Modal.Header>

            {show && <Loader handleClose={handleClose} id={id} />}
        </Modal>

    </>
}

function Loader({ handleClose, id }) {
    const { data, isLoading } = useGetUser(id);

    return <>
        <Modal.Body>
            {isLoading && <MainSpinner />}
            {data &&
                <div>
                    <div className="d-flex justify-content-between">
                        <h5>Username:</h5> <h5>{data.username}</h5>
                    </div>
                    <div className="d-flex justify-content-between">
                        <h5>Level:</h5> <h5>{['Anonymous', 'User', 'Administrator'][data.level]}</h5>
                    </div>
                    <div className="d-flex justify-content-between">
                        <h5>Number of threads:</h5> <h5>{data.threads}</h5>
                    </div>
                    <div className="d-flex justify-content-between">
                        <h5>Number of posts:</h5> <h5>{data.posts}</h5>
                    </div>
                </div>
            }
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Cancel
            </Button>
        </Modal.Footer>
    </>
}

export default ModalUserCard