import React, { useState, useContext } from 'react'
import { BrowserRouter as Router, Route, Switch,  } from 'react-router-dom';

import {Container, Navbar, Nav, Row, Modal, Button } from 'react-bootstrap'

import { QueryClientProvider, QueryClient } from "react-query"

import Home  from './home/home.js'
import ShowThread from './posts/ShowThread.js'
import ApprovePage from './Approve/ApprovePage.js'
import SearchResults from './SearchResults/SearchResultsPage.js'

import MessagesDisplay from './header/MessagesDisplay.js'
import ForumNavbar from './header/ForumNavbar.js'
import ModalLogin from './home/ModalLogin.js'
import ModalRegister from './home/ModalRegister.js'
import SearchField from './header/SearchField.js'
import useModal from './hooks/useModal.js'


import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Markdown.css'


const queryClient = new QueryClient();


function Forum(props)
{
    const [showModalLogin, propsModalLogin] = useModal()
    const [showModalRegister, propsModalRegister] = useModal()


    return (
        <QueryClientProvider client={queryClient}>
            <Container>
                <Router>
                    <ForumNavbar showModalLogin={showModalLogin} showModalRegister={showModalRegister}/>                    
                    <div className="d-flex justify-content-between">
                        <div className="mt-2 mb-2"><h1>Forum</h1></div>
                        <MessagesDisplay/>
                        <div className="mt-2">
                            <SearchField />
                        </div>
                    </div>
                    <Routes/>
                    <ModalLogin {...propsModalLogin()} />
                    <ModalRegister {...propsModalRegister()} />
                    <div className="text-center">Dušan Benašić 2021</div>
                </Router>                    
            </Container>
        </QueryClientProvider >
    )
}



function Routes()
{
    return  (                  
        <Switch>
            <Route path="/thread/:id/:page">
                <ShowThread />
            </Route>
            <Route path="/thread/:id/">
                <ShowThread />
            </Route>            
            <Route path="/search/:query">
                <SearchResults />
            </Route>
            <Route path="/approve/">
                <ApprovePage />
            </Route>
            <Route path="/">
                <Home />
            </Route>             
        </Switch>
    )
}

export default Forum