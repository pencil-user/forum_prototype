import React from 'react'
import { BrowserRouter as Router, Route, Switch,  } from 'react-router-dom';

import {Container } from 'react-bootstrap'

import { QueryClientProvider, QueryClient } from "react-query"

import ForumPage  from './Components/Forum/ForumPage.js'
import ThreadPage from './Components/Thread/ThreadPage.js'
import ApprovePage from './Components/Approve/ApprovePage.js'
import SearchResultsPage from './Components/SearchResults/SearchResultsPage.js'

import MessagesDisplay from './Components/Header/MessagesDisplay.js'
import ForumNavbar from './Components/Header/ForumNavbar.js'
import ModalLogin from './Components/Global/ModalLogin.js'
import ModalRegister from './Components/Global/ModalRegister.js'
import SearchField from './Components/Header/SearchField.js'
import useModal from './hooks/useModal.js'


import 'bootstrap/dist/css/bootstrap.min.css';


const queryClient = new QueryClient();


function App(props)
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
            <Route path="/">
                <ForumPage />
            </Route>             
        </Switch>
    )
}

export default App