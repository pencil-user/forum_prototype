import { Store } from "pullstate";
import { AddAlert } from '../AlertService/AlertService.js'
import { addJWT, removeJWT } from '../FetchService/FetchService.js'

export const UserStore = new Store({
    logged: false,
    username: null,
    id: null,
    level: 0,
});

export function LoginUser(data) {
    addJWT(data.token)

    UserStore.update(s => {
        s.logged = true
        s.level = data.level
        s.id = data.id
        s.username = data.username

    })
    AddAlert('Logged in as ' + data.username)

}

export function LogOut() {
    removeJWT()

    UserStore.update(s => {
        s.logged = false
        s.level = 0
        s.id = null
        s.username = null
    })
    AddAlert('Logged out')

}

export function useUser() {
    const user = UserStore.useState()
    return {
        user,
        isLogged: user.logged,
        isAdmin: user.logged && user.level >= 2,
        LoginUser,
        LogOut
    }
}