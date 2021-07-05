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
    <div className="row justify-content-md-center">
        <TransitionGroup >
            {Messages.map(Message =>
                <CSSTransition
                    key={Message.key}
                    timeout={500}
                    classNames="TransitionItem1"
                >
                    <div 
                        className={"alert mt-1 "+msgTypes[Message.type]} 
                        role="alert" 
                        key={Message.key} 
                    >
                        {Message.content}
                    </div>
                </CSSTransition>
                
            )}
        </TransitionGroup >
    </div>)
}

export default MessagesDisplay