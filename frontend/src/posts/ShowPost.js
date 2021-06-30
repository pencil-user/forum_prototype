import React, { useState, useContext } from 'react'
import { useQueryClient, useMutation } from "react-query";
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import {UserStore} from '../UserService/UserService.js'
import UserHighlight from '../shared/UserHighlight.js'

import ButtonWithSpin from '../shared/ButtonWithSpin.js'


async function deletePost({...data})
{
    //console.log('data for createPost', data)
    let result = await axios.delete('/api/posts/'+data.id)

    return result.data

}

function ShowPost({post, handleShowModalUpdate, thread})
{    
    const { mutateAsync, isLoading } = useMutation(deletePost)
    const queryClient = useQueryClient()

    const User = UserStore.useState()

    async function clickDelete()
    {
        await mutateAsync({id:post.id})
        queryClient.invalidateQueries('posts')
    }

    async function clickEdit()
    {
        handleShowModalUpdate({id:post.id})
    }

    return (
        <div className="card mt-1">
            <div className="card-header">
                <>#{post.id} | </>
                <> {post.created_on} | </>
                <> <UserHighlight user={post?.username} level={post?.user_level}/> | </>   
                </div>
            <div className="card-body">
                <ReactMarkdown children={post.post_body} /> 
            </div>
            {(User.logged && (User.level >= 2 || (User.id===post.user_id && !thread.locked))) && 
                <div className="card-footer">
                    <ButtonWithSpin 
                        className="btn-primary ml-1 mr-1" 
                        onClick={clickEdit}
                        disabled={isLoading}
                        label="edit"
                    />
                    <ButtonWithSpin 
                        className="btn-danger ml-1 mr-1" 
                        onClick={clickDelete}
                        spinning={isLoading} 
                        label="delete"
                    />

                </div>
            }
        </div>
    )
}


export default ShowPost