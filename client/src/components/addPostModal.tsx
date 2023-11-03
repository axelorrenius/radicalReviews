import { Form, Modal } from "react-bootstrap"
import { CourseInstanceDTO, InternalAPI, PostDTO, ThreadDTO } from "../api/api"
import { useState } from "react"
import TagsComponent from "./tagsComponent"
import { threadId } from "worker_threads"

type CreateThreadModalProps = {
    show: boolean
    onDone: (instance: PostDTO | null) => void
    thread: ThreadDTO | null
}
const server = new InternalAPI()

function CreatePostModal(props: CreateThreadModalProps) {
    const { show, onDone, thread } = props
    const [errorState, setErrorState] = useState({ success: true, message: "" })

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault()
        if (!thread || !thread.id) {
            setErrorState({
                success: false,
                message: "Please select a course round first."
            })
            return
        }
        const target = event.target as typeof event.target & {
            content: { value: string }
        }

        server
            .savePost({
                content: target.content.value,
                threadId: thread.id
            })
            .then((res) => {
                if (res) {
                    onDone(res)
                } else {
                    setErrorState({
                        success: false,
                        message: "Could not save thread"
                    })
                }
            })
    }

    const onClose = () => {
        onDone(null)
    }

    return (
        <Modal show={show} onHide={() => onClose()}>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Ask a question</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {thread && thread.id ? (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label>Answer</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    id="content"
                                    rows={3}
                                    placeholder="Provide as much details as possible"
                                />
                            </Form.Group>
                            <div></div>
                        </>
                    ) : (
                        <div>
                            <button
                                type="button"
                                onClick={() => onClose()}
                                className="btn btn-outline-dark px-4"
                            >
                                {`Before posting, select a thread.`}
                            </button>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {thread && thread.id && (
                        <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={() => null}
                        >
                            Submit
                        </button>
                    )}
                    <button
                        className="btn btn-secondary"
                        onClick={() => onClose()}
                    >
                        Close
                    </button>
                    {/* You can add a "Submit" button if needed */}
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default CreatePostModal
