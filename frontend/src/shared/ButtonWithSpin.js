import React from 'react'


function ButtonWithSpin({className='', type=null, disabled=false, spinning=false, label='', onClick=null, spinningLabel=null})
{
    if(spinningLabel === null)
    {
        spinningLabel = label
    }

    let action = {}

    if(onClick)
        action = {onClick: onClick}
 
    if(type)
        action = {type: type}

    if(spinning)
        return (
            <button className={`btn ${ className }`}>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                {spinningLabel}
            </button> )
    
    if(!disabled)
        return (
            <button className={`btn ${ className }`} {...action} >
                {label}
            </button> ) 

    if(disabled)
        return (
            <button className={`btn disabled ${ className }`}  >
                {label}
            </button> )     

      
}

export default ButtonWithSpin