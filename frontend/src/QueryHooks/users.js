import { useQuery, useQueryClient, useMutation } from "react-query";
//import axios from 'axios'
import { fetchWithJWT } from '../FetchService/FetchService.js'


export function useGetPendingUsers() {
    const { data, error, isLoading, isError } = useQuery(
        ["pending_users"],
        async () => {
            let result = await fetchWithJWT.get('/api/users/?pending=1')

            return result.data
        }
    )


    return { data, error, isLoading, isError }
}

export function useApproveUser(id) {
    const { mutateAsync, isLoading } = useMutation(
        async ({ ...data }) => {
            let result = await fetchWithJWT.patch('/api/users/' + data.id, { approved: 1 })

            return result.data
        }
    )

    const queryClient = useQueryClient()

    async function approveUser() {
        await mutateAsync({ id: id })
        queryClient.invalidateQueries('pending_users')
    }

    return { isLoading, approveUser }
}

export function useDeleteUser(id) {
    const { mutateAsync, isLoading } = useMutation(
        async ({ ...data }) => {
            let result = await fetchWithJWT.delete('/api/users/' + data.id)
            return result.data
        }
    )
    const queryClient = useQueryClient()

    async function deleteUser() {
        await mutateAsync({ id: id })
        queryClient.invalidateQueries('pending_users')
    }

    return { isLoading, deleteUser }

}

export function useGetUser(id) {
    const { data, isLoading, isError } = useQuery(
        ["users", { id }],
        async ({ queryKey }) => {
            const [_key, { id }] = queryKey;
            let result = await fetchWithJWT.get('/api/users/' + id)

            return result.data
        }
    )

    return { data, isLoading, isError }

}

