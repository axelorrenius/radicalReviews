import { Form, Modal } from "react-bootstrap"
import { Link } from "react-router-dom"
import { InternalAPI, SchoolDTO } from "../api/api"
import { useState } from "react"
import { useHistory } from "react-router-dom"

type CreateCourseModalProps = {
    show: boolean
    onClose: () => void
    school: SchoolDTO | null
    courseId: number
}
const server = new InternalAPI()

function CreateCourseModal(props: CreateCourseModalProps) {
    const { show, onClose, school } = props
    const [tags, setTags] = useState<{ idx: number; value: string }[]>([])
    const [errorState, setErrorState] = useState({ success: true, message: "" })
    const history = useHistory()

    const updateTag = (idx: number, value: string) => {
        const newTags = [...tags]
        newTags[idx] = { idx, value }
        setTags(newTags)
    }

    const handleSubmit = (event: React.SyntheticEvent) => {
        if (!school || !school.id) {
            setErrorState({
                success: false,
                message: "Please select a university first."
            })
            return
        }
        event.preventDefault()
        const target = event.target as typeof event.target & {
            courseCode: { value: string }
            courseName: { value: string }
            description: { value: string }
            schoolId: { value: string }
        }
        const tagValues = tags.reduce((acc, tag) => {
            if (tag.value.trim()) acc.push(tag.value.trim())
            return acc
        }, [] as string[])
        setErrorState({ success: true, message: "" })
        server
            .saveCourse({
                id: props.courseId || undefined,
                courseCode: target.courseCode.value,
                courseName: target.courseName.value,
                description: target.description.value,
                schoolId: school.id,
                tags: tagValues
            })
            .then((res) => {
                if (res.success) {
                    onClose()
                    history.push(`/course/${res.course?.id}`)
                } else {
                    setErrorState({
                        success: false,
                        message: res.reason || "Unknown error"
                    })
                }
            })
    }

    return (
        <Modal show={show} onHide={() => onClose()}>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Create course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {school && school.id ? (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label>Course code</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="courseCode"
                                    placeholder="Enter the course code (e.g. ME2004)"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Course name</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="courseName"
                                    placeholder="Enter the name of the course (e.g. Introduction to Thermodynamics)"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    id="description"
                                    rows={3}
                                    placeholder="Enter a description of the course. Feel free to copy from an official source."
                                />
                            </Form.Group>
                            <Form.Group className="mb-10">
                                <Form.Label>Tags</Form.Label>
                                {tags.map((tag) => (
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter a tag"
                                        style={{ marginTop: "10px" }}
                                        onBlur={(event) =>
                                            updateTag(
                                                tag.idx,
                                                event.target.value
                                            )
                                        }
                                    />
                                ))}
                                <Form.Control
                                    type="button"
                                    value="Add tag"
                                    style={{ marginTop: "10px" }}
                                    onClick={() =>
                                        setTags([
                                            ...tags,
                                            { idx: tags.length, value: "" }
                                        ])
                                    }
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
                                to="/"
                                className="btn btn-outline-dark px-4"
                            >
                                {`Before creating a course, please select a university.`}
                            </Link>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {school && school.id && (
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

export default CreateCourseModal
