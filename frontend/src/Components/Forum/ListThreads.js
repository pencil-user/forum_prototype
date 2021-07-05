import React from 'react'
import { Table, Button } from 'react-bootstrap'


import ModalCreateThread from './ModalCreateThread.js'
import ModalUpdateThread from './ModalUpdateThread.js'
import ShowThreadRow from './ShowThreadRow.js'

import useModal from '../../hooks/useModal.js'


function ListThreads({data})
{
    const [showModalCreate, propsModalCreate] = useModal()
    const [showModalUpdate, propsModalUpdate] = useModal()

    return ( 
        <>
        <Button variant="primary"  onClick={showModalCreate}>New Thread</Button>
        <Table striped bordered hover className="mt-1">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Thread</th>
                    <th>Created on</th>
                    <th>Username</th>
                </tr>
            </thead>
            <tbody>
                {data.map(thread =>
                    <ShowThreadRow key={thread.id} thread={thread} showModalUpdate={showModalUpdate}/>               
                )}

            </tbody>
        </Table>
        <Button variant="primary" onClick={showModalCreate}>New Thread</Button>
        <ModalCreateThread {...propsModalCreate()} />
        <ModalUpdateThread {...propsModalUpdate()} />
        </>
)

}

export default ListThreads