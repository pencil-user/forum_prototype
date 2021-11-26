import React from 'react'
import { Table } from 'react-bootstrap'
import { useHistory } from 'react-router-dom';

import { useUser } from '../../UserService/UserService.js';
import ButtonWithSpin from '../Shared/ButtonWithSpin.js'

import { useGetPendingUsers, useApproveUser, useDeleteUser } from '../../QueryHooks/users.js'


function ApprovePage() {
    const history = useHistory();
    const { user } = useUser()

    if (user.level < 2) {
        history.replace('/')
        return <>access denied</>
    }

    return <ApproveList />

}

function ApproveList() {
    const { data, isLoading, isError } = useGetPendingUsers()

    if (isLoading)
        return <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
        </div>


    if (isError)
        return <div>There's an error</div>

    return <>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>e-mail</th>
                    <th>Approve</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                {data.map(user => <UserRow key={user.id} user={user} />)}
            </tbody>
        </Table>
        {data.length === 0 && <span>There are no pending users at this time</span>}
    </>
}

function UserRow({ user }) {
    const forApprove = useApproveUser(user.id)
    const forDelete = useDeleteUser(user.id)

    const isLoading = forApprove.isLoading || forDelete.isLoading

    async function clickApprove() {
        await forApprove.approveUser()
    }

    async function clickDelete() {
        await forDelete.deleteUser()
    }

    return <>
        <tr>
            <td>{user.id}</td>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>
                <ButtonWithSpin
                    className="btn-info"
                    onClick={clickApprove}
                    disabled={isLoading}
                    spinning={forApprove.isLoading}
                    label="Approve"
                />

            </td>
            <td>
                <ButtonWithSpin
                    className="btn-danger"
                    onClick={clickDelete}
                    disabled={isLoading}
                    spinning={forDelete.isLoading}
                    label="Delete"
                />
            </td>
        </tr>
    </>
}

export default ApprovePage