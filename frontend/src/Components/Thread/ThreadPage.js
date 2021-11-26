import React from 'react'

import { Route, useLocation } from 'react-router-dom';

import ModalSwitch from '../Shared/ModalSwitch.js'
import ModalCreatePost from './ModalCreatePost.js'
import ModalUpdatePost from './ModalUpdatePost.js'


import ShowThread from "./ShowThread.js"


function ThreadPage() {
    let location = useLocation();
    console.log('--ThreadPage--', location)
    return (
        <ModalSwitch modals={[
            { modal: ModalCreatePost, pathname: '/thread/:id/create-post/' },
            { modal: ModalUpdatePost, pathname: '/thread/:id/update-post/:post_id' }
        ]}
        >
            <Route path="/thread/:id/page/:page">
                <ShowThread />
            </Route>
            <Route path="/thread/:id/">
                <ShowThread />
            </Route>
        </ModalSwitch>
    )
}

export default ThreadPage