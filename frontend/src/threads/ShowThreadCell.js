import React from 'react'
import { Link } from 'react-router-dom';


function ShowThreadCell({thread, disabled})
{
    const title = <>
        {!!thread.pinned && <span className="badge bg-primary text-light">pinned</span>}
        {!!thread.locked && <span className="badge bg-info text-light">locked</span>}  
        {thread.title} 
    </>


    if(disabled) return (
        <div>
            {title} 
        </div>
    )

    return (
        <div>
             <Link to={"thread/"+thread.id+'/1'}>{title}</Link>
        </div>
    )
    
}

export default ShowThreadCell