import React, { useState, useCallback} from 'react'

function useModal(props={})
{
    const [modalShow, setModalShow] = useState(false)

    const [modalOptions, setModalOptions] = useState(props)

    const handleClose = () => setModalShow(false);
    const handleShow = () => setModalShow(true)

    const modalProps = () =>
    {
        return {
            show : modalShow,
            handleClose : handleClose,
            ...modalOptions
        }
    }

    const showModal = (props={}) =>
    {
        setModalOptions((old) => ({...old, ...props}) )
        handleShow()
    }

    return [showModal, modalProps]
}

export default useModal