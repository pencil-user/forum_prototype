import React from 'react'
import ModalLink from './ModalLink.js'

function UserHighlight({ user = null, id = null, level = 0 }) {
    if (user && id) {
        let color = (['bg-secondary', 'bg-info', 'bg-success'])[level]

        return <ModalLink to={{ pathname: '/user-info/' + id }}>
            <span style={{ 'padding': 2 }} className={"rounded " + color + " text-white"}>{user}</span>
        </ModalLink>
    }
    else {
        return <span className={"rounded .bg-light"}>Anonymous</span>

    }

}

export default UserHighlight