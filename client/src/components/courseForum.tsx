import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import Modal from "react-bootstrap/Modal"
import {
    CourseDTO,
    CourseInstanceDTO,
    InternalAPI,
    ThreadDTO
} from "../api/api"
import styled from "styled-components"
import Tab from "react-bootstrap/Tab"
import Nav from "react-bootstrap/Nav"
import ListGroup from "react-bootstrap/ListGroup"
import "./timeline.css"
import "react-bootstrap-typeahead/css/Typeahead.css"
import { Form, InputGroup } from "react-bootstrap"
import { Typeahead } from "react-bootstrap-typeahead"
import { setTokenSourceMapRange } from "typescript"
import { Option } from "react-bootstrap-typeahead/types/types"
import CreateCourseInstanceModal from "./createCourseRoundModal"

interface RouteParams {
    courseId: string // Define the type of courseId here
}

const ThreadCard = styled(Card)`
    margin: 10px;
    display: flex;
    justify-content: space-between;
`

const ThreadCardContent = styled.div`
    flex: 1; /* Allow the content to grow */
`

const Tags = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    margin-left: 10px;
    justify-content: flex-end; /* Align tags to the right */
`

const Tag = styled.span`
    background-color: #007bff;
    color: #fff;
    padding: 4px 8px;
    margin-right: 5px;
    margin-bottom: 5px;
    border-radius: 4px;
    font-size: 14px;
`

const mockAssignments = [
    {
        name: "Assignment 1",
        difficulty: "Easy",
        dueDate: new Date("2021-01-15"),
        expertUser: "John Doe",
        courseRound: "HT20"
    },
    {
        name: "Assignment 2",
        difficulty: "Dang you gotta be smart to do this one",
        dueDate: new Date("2021-04-15"),
        expertUser: "John Foes",
        courseRound: "HT20"
    }
]

const mockthreads = [
    {
        id: 1,
        courseId: 1,
        title: "Introduction to Programming",
        upVotes: 10,
        downVotes: 2,
        content: "This thread is about the basics of programming.",
        createdAt: new Date("2023-01-15"),
        updatedAt: new Date("2023-01-16"),
        posts: [],
        tags: ["Programming", "Beginner"],
        courseRound: "HT20"
    },
    {
        id: 2,
        courseId: 1,
        title: "Data Structures Discussion",
        upVotes: 8,
        downVotes: 1,
        content: "Let's talk about data structures and their applications.",
        createdAt: new Date("2022-01-17"),
        updatedAt: new Date("2023-01-18"),
        posts: [],
        tags: ["Data Structures", "Intermediate"],
        courseRound: "HT19"
    },
    {
        id: 3,
        courseId: 2,
        title: "Algorithm Optimization",
        upVotes: 15,
        downVotes: 3,
        content: "Share your insights on optimizing algorithms.",
        createdAt: new Date("2021-01-20"),
        updatedAt: new Date("2023-01-21"),
        posts: [],
        tags: ["Algorithms", "Advanced"],
        courseRound: "VT20"
    },
    {
        id: 4,
        courseId: 2,
        title: "Web Development Frameworks",
        upVotes: 12,
        downVotes: 4,
        content:
            "Discuss popular web development frameworks and their features.",
        createdAt: new Date("2023-06-23"),
        updatedAt: new Date("2023-01-24"),
        posts: [],
        tags: ["Web Development", "Frameworks"],
        courseRound: "VT19"
    }
]
const server = new InternalAPI()

function CourseDetail() {
    const { courseId } = useParams<RouteParams>()
    const courseIdNum = parseInt(courseId)

    const [showModal, setShowModal] = useState(false)
    const [showCourseRoundModal, setShowCourseRoundModal] = useState(false)
    const [newThread, setNewThread] = useState("")
    const [course, setCourse] = useState<CourseDTO | null>(null)
    const [threads, setThreads] = useState<ThreadDTO[]>([])
    const [selectedCourseRound, setSelectedCourseRound] = useState<
        CourseInstanceDTO[]
    >([])

    const [assignments, setAssignments] = useState<any[]>([]) // denna också generell som fan

    const updateSelectedCourseRound = (courseInstance: CourseInstanceDTO[]) => {
        console.log(courseInstance)
        setSelectedCourseRound(courseInstance)
    }

    const handleNewCourseRound = (courseInstance: CourseInstanceDTO | null) => {
        setShowCourseRoundModal(false)
        if (courseInstance && course) {
            setCourse({
                ...course,
                courseInstances: [
                    ...(course.courseInstances || []),
                    courseInstance
                ]
            })
        }
    }

    useEffect(() => {
        server.getCourse(courseIdNum).then((result) => {
            setCourse(result)
        })
    }, [])

    const handleClose = () => setShowModal(false)
    const handleShow = () => setShowModal(true)

    const fetchThreads = async () => {
        // const threads = await server.getThreads(courseIdNum)
        // make example threads from dto
        setThreads(mockthreads)
    }

    const fetchAssignments = async () => {
        setAssignments(mockAssignments)
    }

    useEffect(() => {
        fetchThreads()
        fetchAssignments()
    }, [])

    const addNewThread = () => {
        if (newThread) {
            const newThreadObj = {
                courseId: courseIdNum,
                title: newThread,
                content: "",
                upVotes: 0,
                downVotes: 0,
                createdAt: new Date(),
                posts: [],
                tags: []
            }

            server
                .saveThread(newThreadObj)
                .then((result) => {
                    setThreads([result, ...threads])
                })
                .catch((err) => console.error(err))

            setNewThread("") // Clear the input
            handleClose()
        }
    }

    const addThread = () => {
        handleShow() // Show the modal when the button is clicked
    }

    const startDate = new Date("2018-01-01").getTime()
    const endDate = new Date("2024-01-01").getTime()
    const referencePoints = []
    const interval = 1000 * 60 * 60 * 24 * 365 // 30 days in milliseconds

    for (
        let currentDate = new Date(startDate).getTime();
        currentDate <= new Date(endDate).getTime();
        currentDate += interval
    ) {
        referencePoints.push(new Date(currentDate))
    }

    const calculateDotPosition = (threadDate: Date) => {
        const startDate = new Date("2018-01-01").getTime()
        const endDate = new Date("2024-01-01").getTime()
        const totalMilliseconds = endDate - startDate
        const threadMilliseconds = threadDate.getTime() - startDate
        const percentage = (threadMilliseconds / totalMilliseconds) * 100
        return `${percentage}%`
    }

    if (!course) return <div>Loading...</div>

    return (
        <div>
            <h2>{course.courseName}</h2>
            <Form.Group>
                <Form.Label>Select course round</Form.Label>
                <InputGroup>
                    <Typeahead
                        id="basic-typeahead-single"
                        labelKey="roundName"
                        onChange={(selected: any) => {
                            updateSelectedCourseRound(selected)
                        }}
                        options={course.courseInstances || []}
                        placeholder="Choose a course round..."
                        selected={selectedCourseRound}
                    />
                    <button
                        type="button"
                        className="btn btn-outline-dark px-4"
                        onClick={() => setShowCourseRoundModal(true)}
                    >
                        Create new course round
                    </button>
                </InputGroup>
            </Form.Group>

            <div className="timeline">
                {threads.map((thread) => (
                    <div
                        key={thread.id}
                        className="timeline-dot"
                        style={{ left: calculateDotPosition(thread.createdAt) }}
                    ></div>
                ))}

                {assignments.map((assignment, index) => (
                    <div
                        key={index}
                        className="assignment-dot"
                        style={{
                            left: calculateDotPosition(assignment.dueDate)
                        }}
                    ></div>
                ))}

                <div className="reference-points">
                    {referencePoints.map((point, index) => (
                        <div
                            key={index}
                            className="timeline-reference-point"
                            style={{ left: calculateDotPosition(point) }}
                        >
                            {point.getFullYear()}
                        </div>
                    ))}
                </div>
            </div>

            <Tab.Container id="course-tabs" defaultActiveKey="threads">
                <Card>
                    <Card.Header>
                        <Nav variant="tabs">
                            <Nav.Item>
                                <Nav.Link eventKey="threads">Threads</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="assignments">
                                    Assignments
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="resources">
                                    Resources
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Card.Header>

                    <Card.Body>
                        <Tab.Content>
                            <Tab.Pane eventKey="threads">
                                <h3>Threads</h3>
                                <Button
                                    onClick={addThread}
                                    variant="primary"
                                    style={{
                                        marginLeft: "10px"
                                    }}
                                >
                                    Ask a Question
                                </Button>
                                <div className="threads">
                                    {threads.map((thread) => (
                                        <Link
                                            key={thread.id}
                                            to={`/thread/${thread.id}`}
                                        >
                                            <ThreadCard>
                                                <ThreadCardContent>
                                                    <Card.Body>
                                                        <Card.Title>
                                                            {thread.title}
                                                        </Card.Title>
                                                        <Card.Subtitle className="mb-2 text-muted">
                                                            {/* {thread.likesComments} */}
                                                        </Card.Subtitle>
                                                        <Card.Text>
                                                            {thread.content}
                                                        </Card.Text>
                                                    </Card.Body>
                                                </ThreadCardContent>
                                                <Tags>
                                                    {thread.tags.map(
                                                        (tag, index) => (
                                                            <Tag key={index}>
                                                                {tag}
                                                            </Tag>
                                                        )
                                                    )}
                                                </Tags>
                                            </ThreadCard>
                                        </Link>
                                    ))}
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="assignments">
                                <h3>Assignments</h3>
                                <ListGroup>
                                    {assignments.map((assignment, index) => (
                                        <ListGroup.Item key={index}>
                                            <h5>{assignment.name}</h5>
                                            <p>
                                                Difficulty:{" "}
                                                {assignment.difficulty}
                                            </p>
                                            <p>
                                                Due Date:{" "}
                                                {assignment.dueDate.toString()}
                                            </p>
                                            <p>
                                                Expert User:{" "}
                                                {assignment.expertUser}
                                            </p>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Tab.Pane>
                            <Tab.Pane eventKey="resources">
                                <h3>Here you can upload resources to share</h3>
                            </Tab.Pane>
                        </Tab.Content>
                    </Card.Body>
                </Card>
            </Tab.Container>
            <CreateCourseInstanceModal
                show={showCourseRoundModal}
                onDone={(instance) => handleNewCourseRound(instance)}
                course={course}
            />

            {/* New Thread Modal */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Thread</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <textarea
                        rows={1}
                        value={newThread}
                        onChange={(e) => setNewThread(e.target.value)}
                        placeholder="Add a new question..."
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addNewThread}>
                        Save Question
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default CourseDetail
