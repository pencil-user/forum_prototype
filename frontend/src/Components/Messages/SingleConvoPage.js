import React, { useState, useContext } from 'react'
import { Table, Button, Container, Row, Col } from 'react-bootstrap'
import { Link, useParams, useHistory, useLocation } from 'react-router-dom';
import {UserStore} from '../../UserService/UserService.js';
import axios from 'axios'


import { useQuery } from "react-query";

async function getConvos({queryKey})
{
    const [_key, { userid, convoid }] = queryKey;
    let result = await axios.get('/api/messages/' + userid)

    return result.data
}

function SingleConvoPage()
{

}

export default SingleConvoPage()