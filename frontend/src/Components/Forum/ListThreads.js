import React, { useState, useEffect } from 'react'
import { Table, Button } from 'react-bootstrap'
import { useParams, useHistory, useLocation } from 'react-router-dom';

import ShowThreadRow from './ShowThreadRow.js'

import MainSpinner from '../Shared/MainSpinner.js'

import { useGetThreadPage } from '../../QueryHooks/threads.js'

const THREADS_PER_PAGE = 10


function ListThreads() {

    const history = useHistory();

    const params = useParams();

    const location = useLocation()

    const page = +params?.page || 1

    const [total, setTotal] = useState(THREADS_PER_PAGE * 2)

    const [isLoading, setIsLoading] = useState(true)

    function createThread() {
        history.push('/create-thread/', { background: location })

    }

    const pages = []
    for (let a = 1; a <= page; a++) {
        pages.push(a)
    }

    return (
        <>
            <Button variant="primary" style={{ marginBottom: 8 }} onClick={createThread}>New Thread</Button>
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
                    {pages.map(x =>
                        <ThreadLoader key={x} page={x} lastPage={page} setTotal={setTotal} setIsLoading={setIsLoading} />
                    )}
                </tbody>
            </Table>
            {(isLoading == false) &&
                <div className="d-flex justify-content-between">
                    <div className="">
                        <Button variant="primary" onClick={createThread}>
                            New Thread
                        </Button>
                    </div>

                    <div className="align-self-center">
                        {(total > THREADS_PER_PAGE * page) &&

                            <Button
                                variant="outline-success"
                                onClick={() => { history.push('/' + (page + 1)); setIsLoading(true) }}>
                                Load More
                            </Button>
                        }
                    </div>

                    <div style={{ 'width': 110 }}>

                    </div>

                </div>
            }

            {isLoading && page == 1 && <MainSpinner />}
            {isLoading && page != 1 && <MainSpinner margin={false} />}

        </>
    )

}

function ThreadLoader({ page, lastPage, setTotal, setIsLoading }) {
    const offset = (page - 1) * THREADS_PER_PAGE
    const limit = THREADS_PER_PAGE

    const { data, isLoading, isError } = useGetThreadPage(offset, limit);

    useEffect(
        () => {
            if (page == lastPage && !isLoading) {
                setTotal(data.total)
                setIsLoading(false)
            }
        },
        [isLoading, data])

    if (isLoading)
        return (<></>)



    return data.threads.map(thread =>
        <ShowThreadRow key={thread.id} thread={thread} limit={limit} offset={offset} />
    )
}

export default ListThreads