import React, { useState, useContext } from 'react'
import {Table } from 'react-bootstrap'
import { useHistory  } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from "react-query";

import {UserStore} from '../../UserService/UserService.js';
import ButtonWithSpin from '../Shared/ButtonWithSpin.js'


import axios from 'axios'


async function getPendingUsers()
{
    let result = await axios.get('/api/users/?pending=1')

    return result.data
}

async function approveUser({...data})
{
    let result = await axios.patch('/api/users/'+data.id, {approved:1})

    return result.data
}

async function deleteUser({...data})
{
    let result = await axios.delete('/api/users/'+data.id)

    return result.data
}

function ApprovePage()
{
    const history = useHistory();
    const user = UserStore.useState(s => s);

    if(user.level < 2)
    {
        history.push('/')
        return <>haya</>
    }

    return <ApproveList/>
     
}

function ApproveList()
{
    const { data, error, isLoading, isError } = useQuery(["users"], getPendingUsers);

    if(isLoading)
        return <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
        </div>
      
    
    if(isError)
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
                    {data.map(user => <UserRow key={user.id} user={user}/>)}
                </tbody>
            </Table>
        </>
}

function UserRow({user})
{
    const forApprove = useMutation(approveUser)
    const forDelete = useMutation(deleteUser)

    const queryClient = useQueryClient()

    const isLoading = forApprove.isLoading || forDelete.isLoading

    async function clickApprove()
    {
        await forApprove.mutateAsync({id:user.id})
        queryClient.invalidateQueries('users')
        //AddMessage('Thread deleted', 'danger')
    }

    async function clickDelete()
    {
        await forDelete.mutateAsync({id:user.id})
        queryClient.invalidateQueries('users')
        //AddMessage('Thread deleted', 'danger')
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