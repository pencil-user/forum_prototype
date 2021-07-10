import React, { useState, useContext } from 'react'
import {MessageStore, AddMessage} from '../../MessagesService/MessageService.js'
import {CSSTransition, TransitionGroup} from 'react-transition-group';

import '../../css/TransitionItem.css'

function MessagesDisplay()
{
    const Messages = MessageStore.useState(s=> s.Messages)

    const msgTypes = {
        info:    'alert-info',
        success: 'alert-success',
        danger:  'alert-danger',
        warning: 'alert-warning'
    }

    return( 
    <div 
        style={{
            'position':'fixed',
            'z-index': 1,
            'left':'50%',
            'top': '5%',
            'opacity': 0.90,
            'transform': 'translate(-50%, -5%)',

        }}    
    >
        <div >
            <TransitionGroup >
                {Messages.map(Message =>
                    <CSSTransition
                        key={Message.key}
                        timeout={500}
                        classNames="TransitionItem1"
                    >
                        <div 
                            className={"alert mt-1 "+msgTypes[Message.type]} 
                            style={{'boxShadow': "0px 5px 5px"}}
                            role="alert" 
                            key={Message.key} 
                        >
                            {Message.content}
                        </div>
                    </CSSTransition>
                    
                )}
            </TransitionGroup >
        </div>    
    </div>)
}

export default MessagesDisplay