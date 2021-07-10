import React, { useState, useContext } from 'react'
import {Container, Row, Button, Modal, Pagination } from 'react-bootstrap'
import { Link, useParams, useHistory, useLocation } from 'react-router-dom';

import { useQuery } from "react-query";
import axios from 'axios'


import ModalCreatePost from './ModalCreatePost.js'
import ModalUpdatePost from './ModalUpdatePost.js'

import ShowPost from './ShowPost.js'
import useModal from '../../hooks/useModal.js'

import MainSpinner from '../Shared/MainSpinner.js'

import ReactMarkdown from 'react-markdown'
import {CSSTransition, TransitionGroup} from 'react-transition-group';


import '../../css/TransitionItem.css'

async function getSingleThread({queryKey})
{
    const [_key, { id }] = queryKey;
    let result = await axios.get('/api/threads/' + id)

    return result.data
}

async function getPostByThread({queryKey})
{
    const [_key, { thread_id, offset, limit }] = queryKey;
    let result = await axios.get('/api/posts?thread_id=' + thread_id +'&offset='+ offset + '&limit='+limit)

    console.log('posts result', result)

    return {total: +result.headers['-total'] , posts: result.data}
}

const POSTS_PER_PAGE = 5

function ShowThread()
{
    const { id } = useParams();
    const { data, error, isLoading, isError } = useQuery(["thread" , { id }], getSingleThread);

    if(isLoading)
        return <MainSpinner/>
      
    
    if(isError)
        return <div>There's an error</div>

    return (
    <>
        <h2>
            {data.title} #{data.id}
            <span style={{'fontSize': '18px', 'verticalAlign':'text-top'}}>
                {!!data.pinned && <span className="badge bg-primary text-light">pinned</span>}
                {!!data.locked && <span className="badge bg-info text-light">locked</span>}
            </span>            
        </h2>
        <div><ReactMarkdown children={data.thread_body} /></div>
        <ListPosts thread={data} />
    </>)
}

function ListPosts({thread})
{
    const thread_id = thread.id

    const [showModalUpdate, propsModalUpdate] = useModal()

    const history = useHistory()

    const location = useLocation() 
    
    const  routerParams = useParams();

    let currentPage = routerParams.page ? +routerParams.page : 1

    const { data, error, isLoading, isError } = useQuery(["posts" , { thread_id, offset:(POSTS_PER_PAGE * (currentPage-1)), limit:POSTS_PER_PAGE }], getPostByThread);


    function toPage(page)
    {
        history.push('/thread/'+routerParams.id+'/page/'+page)
    }

    function modalPost()
    {
        history.push('/thread/'+routerParams.id+'/create-post/', {background: location})
    }

    if(isLoading)
        return <MainSpinner/>
    
    if(isError)
        return <div>There's an error</div>

    let pageComponents = []

    for (let number = 1; number <= Math.ceil(data.total/POSTS_PER_PAGE); number++) {
        pageComponents.push(
            <Pagination.Item key={number} active={number === currentPage} onClick={()=>toPage(number)}>
                {number}
            </Pagination.Item>
        );
    }

    return (
        <>
            <div className="d-flex justify-content-between">
                <div>
                    {thread.locked ? 
                        <Button variant="primary" className="md-2" disabled>NewPost</Button> :
                        <Button variant="primary" className="md-2" onClick={modalPost}>NewPost</Button>}
                </div>
                <Pagination>
                    {pageComponents}
                </Pagination>
            </div>
            <TransitionGroup >
                {data.posts.map((x)=>
                    <CSSTransition
                        key={x.id}
                        timeout={500}
                        classNames="TransitionItem1"
                    >
                        <ShowPost 
                            post={x}
                            thread={thread} 
                            key={x.id} 
                            handleShowModalUpdate={showModalUpdate} 
                        />
                    </CSSTransition>
                )}
            </TransitionGroup >
            <div>total:{data.total}</div>
            {data.posts.length> 0 && 
                        <div className="d-flex justify-content-between">
                        <div>
                            {thread.locked ? 
                                <Button variant="primary" className="md-2" disabled>NewPost</Button> :
                                <Button variant="primary" className="md-2" onClick={modalPost}>NewPost</Button>}
                        </div>
                        <Pagination>
                            {pageComponents}
                        </Pagination>
                    </div>}
            <ModalUpdatePost {...propsModalUpdate()} />

        </>
    )
}


export default ShowThread