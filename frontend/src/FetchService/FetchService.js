import axios from 'axios'

export const fetchPlain = axios

export const fetchWithJWT = axios.create()

export function addJWT(token)
{
    fetchWithJWT.defaults.headers.common = {
        'x-auth-token': token
    }

}

export function removeJWT()
{
    axios.defaults.headers.common = {
        
    }
}