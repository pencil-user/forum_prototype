import React from 'react'

import { Route } from 'react-router-dom';

import ModalSwitch from '../Shared/ModalSwitch.js'
import ModalCreateThread from './ModalCreateThread.js'
import ModalUpdateThread from './ModalUpdateThread.js'

import ListThreads from "./ListThreads.js"

function ForumPage() {

    return (
        <ModalSwitch modals={[
            { modal: ModalCreateThread, pathname: '/create-thread/' },
            { modal: ModalUpdateThread, pathname: '/update-thread/:id' }
        ]}
        >
            <Route path="/:page">
                <ListThreads />
            </Route>
            <Route path="/">
                <ListThreads />
            </Route>
        </ModalSwitch>
    )
}

export default ForumPage