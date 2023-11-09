import { useEffect, useState } from "react"
import { Link, useHistory, useParams } from "react-router-dom"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
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
import { Form, InputGroup, Row } from "react-bootstrap"
import { Typeahead } from "react-bootstrap-typeahead"
import CreateCourseInstanceModal from "./createCourseRoundModal"
import CreateThreadModal from "./createThreadModal"
import { useAuth } from "./authContext"
import PostComponent from "./post"
import Breadcrumbs from "./breadcrumbs"

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
const server = new InternalAPI()

function CourseDetail() {
    const history = useHistory()
    const context = useAuth()
    const { courseId } = useParams<RouteParams>()
    const courseIdNum = parseInt(courseId)

    const [showCourseRoundModal, setShowCourseRoundModal] = useState(false)
    const [showCreateThreadModal, setShowCreateThreadModal] = useState(false)
    const [course, setCourse] = useState<CourseDTO | null>(null)
    const [threads, setThreads] = useState<ThreadDTO[]>([])
    const [selectedCourseRound, setSelectedCourseRound] = useState<
        CourseInstanceDTO[]
    >([])

    const [assignments, setAssignments] = useState<any[]>([]) // denna också generell som fan

    const updateSelectedCourseRound = (courseInstance: CourseInstanceDTO[]) => {
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
            context.setCourse(result)
            setCourse(result)
        })
    }, [])

    useEffect(() => {
        const courseRound = selectedCourseRound[0]
        server.getThreads(courseIdNum, courseRound?.id).then((result) => {
            setThreads(result || [])
        })
    }, [selectedCourseRound])

    const fetchAssignments = async () => {
        setAssignments(mockAssignments)
    }

    useEffect(() => {
        fetchAssignments()
    }, [])

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
        threadDate = new Date(threadDate)
        const startDate = new Date("2018-01-01").getTime()
        const endDate = new Date("2024-01-01").getTime()
        const totalMilliseconds = endDate - startDate
        const threadMilliseconds = threadDate.getTime() - startDate
        const percentage = (threadMilliseconds / totalMilliseconds) * 100
        return `${percentage}%`
    }

    const openThread = (threadId?: number) => {
        if (!threadId) return
        history.push(`/thread/${threadId}`)
    }


    if (!course) return <div>Loading...</div>

    return (
        <>
            <Breadcrumbs school={context.selectedSchool} course={course} />
            <div style={{marginLeft: "10vw", marginRight: "10vw"}}>
                <h2>{course.courseName}</h2>
                <Row style={{marginTop: "10px", marginBottom: "10px"}}>
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
                                placeholder="Select a course round..."
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
                </Row>
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
                                        onClick={() =>
                                            setShowCreateThreadModal(true)
                                        }
                                        variant="primary"
                                        style={{
                                            marginLeft: "10px"
                                        }}
                                        className="custom-btn"
                                    >
                                        Ask a Question
                                    </Button>
                                    <div className="threads">
                                        {threads?.map((thread) => (
                                            <PostComponent 
                                                onClick={() => openThread(thread.id)}
                                                key={thread.id}
                                                votes={thread.upVotes - thread.downVotes}
                                                showContent={false}
                                                title={thread.title}
                                                content={thread.content}
                                                tags={thread.tags}
                                                postedBy={"Unknown"}
                                                postedAt={thread.createdAt}
                                                level={0}
                                                onDownVote={() => null}
                                                onUpVote={() => null}
                                                isMain={false}
                                            />
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
                <CreateThreadModal
                    show={showCreateThreadModal}
                    onDone={(thread) => {
                        setShowCreateThreadModal(false)
                        if (thread && thread.id) {
                            history.push(`/thread/${thread.id}`)
                        }
                    }}
                    courseInstance={selectedCourseRound[0]}
                />
                <CreateCourseInstanceModal
                    show={showCourseRoundModal}
                    onDone={(instance) => handleNewCourseRound(instance)}
                    course={course}
                />
            </div>
        </>
    )
}

export default CourseDetail
