import React from 'react'
import { BrowserRouter as Router, Route, Switch,  } from 'react-router-dom';

import {Container } from 'react-bootstrap'

import { QueryClientProvider, QueryClient } from "react-query"

import ForumPage  from './Components/Forum/ForumPage.js'
import ThreadPage from './Components/Thread/ThreadPage.js'
import ApprovePage from './Components/Approve/ApprovePage.js'
import SearchResultsPage from './Components/SearchResults/SearchResultsPage.js'
import MessagesPage from './Components/Messages/MessagesPage.js' 

import AlertDisplay from './Components/Header/AlertDisplay.js'
import MainNavbar from './Components/Header/MainNavbar.js'
import ModalLogin from './Components/Global/ModalLogin.js'
import ModalRegister from './Components/Global/ModalRegister.js'
import ModalUserCard from './Components/Global/ModalUserCard.js'
import SearchField from './Components/Header/SearchField.js'
import ModalSwitch from './Components/Shared/ModalSwitch.js'

import 'bootstrap/dist/css/bootstrap.min.css';

const queryClient = new QueryClient();

function App(props)
{
    return (
        <QueryClientProvider client={queryClient}>
            <Container>
                <Router>
                    <MainNavbar />                    
                    <div className="d-flex justify-content-between">
                        <div className="mt-2 mb-2"><h1>Forum</h1></div>
                        
                        <div className="mt-2">
                            <SearchField />
                        </div>
                    </div>
                    <Routes/>
                    <div className="text-center" style={{marginTop:10}}>Dušan Benašić 2021</div>
                </Router>
                <AlertDisplay/>                
            </Container>
        </QueryClientProvider >
    )
}

function Routes()
{
    return  (                  
        <ModalSwitch modals={[
            {modal:ModalLogin,    pathname:'/login/'},
            {modal:ModalRegister, pathname:'/register/'},
            {modal:ModalUserCard, pathname:'/user-info/:id'}
        ]}
        >

            <Route path="/messages/:convoid/create-message/">
                <MessagesPage />
            </Route>   
            <Route path="/messages/create-message/">
                <MessagesPage />
            </Route>            
            <Route path="/messages/:convoid">
                <MessagesPage />
            </Route>
            <Route path="/messages/">
                <MessagesPage />
            </Route>
            <Route path="/thread/:id/page/:page">
                <ThreadPage />
            </Route>
            <Route path="/thread/:id/">
                <ThreadPage />
            </Route>            
            <Route path="/search/:query">
                <SearchResultsPage />
            </Route>
            <Route path="/approve/">
                <ApprovePage />
            </Route>
            <Route path="/:page">
                <ForumPage />
            </Route> 
            <Route path="/">
                <ForumPage />
            </Route>             
        </ModalSwitch>
    )
}

export default App