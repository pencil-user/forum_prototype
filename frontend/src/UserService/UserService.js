import { Store } from "pullstate";
import axios from 'axios'
import {AddMessage} from '../MessageService/MessageService.js'


export const UserStore = new Store({
    logged: false,
    username: null,
    id: null,
    level: 0,
});

export function LoginUser(data)
{

    axios.defaults.headers.common = {
        'x-auth-token': data.token
    }

    UserStore.update(s=>{
        s.logged = true
        s.level = data.level
        s.id = data.id
        s.username = data.username
        
    })
    AddMessage('Logged in as '+data.username)
   
}

export function LogOut()
{

    axios.defaults.headers.common = {
        
    }    

    UserStore.update(s=>{
        s.logged = false
        s.level = 0
        s.id = null
        s.username = null       
    })
    AddMessage('Logged out')

}