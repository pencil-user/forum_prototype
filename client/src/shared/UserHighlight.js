import React from 'react'


function UserHighlight({user=null, level=0})
{
    if(user)
    {
        let color = (['bg-secondary', 'bg-info', 'bg-success'])[level]

        return <span className={"rounded "+color+" text-white"}>{user}</span>
    }
    else
    {
        return <span className={"rounded .bg-light"}>Anonymous</span>

    }

}

export default UserHighlight