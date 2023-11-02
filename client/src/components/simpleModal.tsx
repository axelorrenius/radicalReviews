import { Modal } from "react-bootstrap"

type SimpleModalProps = {
    open: boolean
    message: string
    title: string
    onClose: () => void
}

function SimpleModal(props: SimpleModalProps) {
    const { open, message, title, onClose } = props
    return (
        <div>
            <Modal
                show={open}
                onHide={() => onClose()}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{message}</Modal.Body>
                <Modal.Footer>
                    <button
                        className="btn btn-secondary"
                        onClick={() => onClose()}
                    >
                        Close
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default SimpleModal
