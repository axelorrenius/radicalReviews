import { Form, Modal } from "react-bootstrap"
import { Link } from "react-router-dom"
import { CourseDTO, CourseInstanceDTO, InternalAPI } from "../api/api"
import { useState } from "react"

type CreateCourseModalProps = {
    show: boolean
    onDone: (instance: CourseInstanceDTO | null) => void
    course: CourseDTO | null
}
const server = new InternalAPI()

function CreateCourseInstanceModal(props: CreateCourseModalProps) {
    const { show, onDone, course } = props
    const [errorState, setErrorState] = useState({ success: true, message: "" })

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault()
        if (!course || !course.id) {
            setErrorState({
                success: false,
                message: "Please select a course first."
            })
            return
        }
        const target = event.target as typeof event.target & {
            roundName: { value: string }
            roundStart: { value: string }
            roundEnd: { value: string }
            examDate: { value: string }
        }

        server
            .saveCourseInstance({
                courseId: course.id,
                roundName: target.roundName.value,
                roundStart: new Date(target.roundStart.value),
                roundEnd: new Date(target.roundEnd.value),
                examDate: target.examDate.value
                    ? new Date(target.examDate.value)
                    : undefined
            })
            .then((res) => {
                if (res) {
                    onDone(res)
                } else {
                    setErrorState({
                        success: false,
                        message: "Could not save course round"
                    })
                }
            })
            .catch((err) => {
                setErrorState({
                    success: false,
                    message: "Could not save course round"
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
                    <Modal.Title>Create round</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {course && course.id ? (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="roundName"
                                    placeholder="Name the round (e.g. Spring 2024)"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Start date</Form.Label>
                                <Form.Control
                                    type="date"
                                    id="roundStart"
                                    placeholder="Enter the start date of the course (e.g. first day of classes)"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>End date</Form.Label>
                                <Form.Control
                                    id="roundEnd"
                                    type="date"
                                    placeholder="Enter the last date of the course (e.g. last day of classes)"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Exam date</Form.Label>
                                <Form.Control
                                    id="examDate"
                                    type="date"
                                    placeholder="Enter the exam date of the course"
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
                            <Link
                                onClick={() => onClose()}
                                to="/courses"
                                className="btn btn-outline-dark px-4"
                            >
                                {`Before creating a course round, please select a course.`}
                            </Link>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {course && course.id && (
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

export default CreateCourseInstanceModal
