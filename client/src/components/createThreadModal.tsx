import { Form, Modal } from "react-bootstrap"
import { CourseInstanceDTO, InternalAPI, ThreadDTO } from "../api/api"
import { useState } from "react"
import TagsComponent from "./tagsComponent"

type CreateThreadModalProps = {
    show: boolean
    onDone: (instance: ThreadDTO | null) => void
    courseInstance: CourseInstanceDTO | null
}
const server = new InternalAPI()

function CreateThreadModal(props: CreateThreadModalProps) {
    const { show, onDone, courseInstance } = props
    const [errorState, setErrorState] = useState({ success: true, message: "" })
    const [tags, setTags] = useState<string[]>([])

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault()
        if (!courseInstance || !courseInstance.id) {
            setErrorState({
                success: false,
                message: "Please select a course round first."
            })
            return
        }
        const target = event.target as typeof event.target & {
            title: { value: string }
            content: { value: string }
        }

        server
            .saveThread({
                courseInstanceId: courseInstance.id,
                title: target.title.value,
                content: target.content.value,
                tags: tags
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
            .catch((err) => {
                setErrorState({
                    success: false,
                    message: "Could not save thread"
                })
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
                    {courseInstance && courseInstance.id ? (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="title"
                                    placeholder="What is the title of your question? Try to be specific."
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Question</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    id="content"
                                    rows={3}
                                    placeholder="Include all necessary information to help others answer your question."
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Tags</Form.Label>
                                <TagsComponent
                                    setTags={(tags) => setTags([...tags])}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    {" "}
                                    <p className="text-danger">
                                        {errorState.message}
                                    </p>
                                </Form.Label>
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
                                {`Before creating a new thread, please select a course round.`}
                            </button>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {courseInstance && courseInstance.id && (
                        <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={() => null}
                        >
                            Submit
                        </button>
                    )}
                    <button
                        type="button"
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

export default CreateThreadModal
