import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Link, useHistory } from "react-router-dom"
import { CourseDTO, InternalAPI } from "../api/api"
import { useAuth } from "./authContext"
import CreateCourseModal from "./createCourseModal"
import { Card, Col, Container, Row, Table } from "react-bootstrap"
import { AwardFill } from 'react-bootstrap-icons';
import Breadcrumbs from "./breadcrumbs"
import { useToasts } from "react-bootstrap-toasts"

const CourseBox = styled.div`
    display: flex;
    border: 1px solid #ccc;
    padding: 10px;
    margin: 10px;
    background-color: #f9f9f9;
    border-radius: 5px;
    text-decoration: none;
    color: black;
    justify-content: space-between; // Add this to align Tags to the right
`

const CourseInfo = styled.div`
    flex: 1; // Allow the info section to grow
`

const Tags = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    margin-left: 10px;
`

const Tag = styled.span`
    background-color: rgb(var(--bs-primary-rgb));
    color: #fff;
    padding: 4px 8px;
    margin-right: 5px;
    margin-bottom: 5px; // Space between tags
    border-radius: 4px;
    font-size: 14px;
`

const CourseTitle = styled.h3`
    margin: 0;
`

const CourseDescription = styled.p`
    margin: 5px 0;
`
const server = new InternalAPI()

function Courses() {
    const toasts = useToasts();
    const history = useHistory()
    const { selectedSchool, setCourse } = useAuth()
    const [courses, setCourses] = useState<CourseDTO[]>([])
    const [showCreateCourseModal, setShowCreateCourseModal] = useState(false)
    const [tableSearch, setTableSearch] = useState("")

    const loadCourses = async () => {
        // const courses = await server.getCourses(1)
        if (!selectedSchool?.id) return

        server.getCourses(selectedSchool?.id).then((courses) => {
            setCourse(null)
            setCourses(courses)
        })
    }

    useEffect(() => {
        loadCourses()
    }, [])

    const getTrendingGrid = (courses: CourseDTO[]) => {
        const col = (course: CourseDTO) => {
            return (
                <Col className="hstack">
                    <div style={{margin: "1rem"}}>
                        <AwardFill size={64} style={{color: "rgb(var(--bs-primary-rgb))"}} />
                    </div>
                    <div>
                        <Card.Title>{course.courseCode}</Card.Title>
                        <Card.Subtitle style={{margin:"5px"}}>{course.courseName}</Card.Subtitle>
                        <Link
                            onClick={() => setCourse(course)}
                            to={`/course/${course.id}`}
                            className="btn ">Go to course</Link>
                    </div>
                </Col>
            )
        }

        if (!courses) return (<></>)

        return (
            <Container>
                    <Row>
                        {courses.length > 0 && col(courses[0])}
                        {courses.length > 1 && col(courses[1])}
                    </Row>
                    <Row>
                        {courses.length > 2 && col(courses[2])}
                        {courses.length > 3 && col(courses[3])}
                    </Row>
            </Container>
        )
    }

    const filterCriteria = (course: CourseDTO) => {
        if (course.courseCode.toLowerCase().includes(tableSearch.toLowerCase())) return true
        if (course.courseName.toLowerCase().includes(tableSearch.toLowerCase())) return true
        if (course.tags?.some((tag) => tag.toLowerCase().includes(tableSearch.toLowerCase()))) return true
        return false
    }

    const openCourse = (course: CourseDTO) => {
        setCourse(course)
        history.push(`/course/${course.id}`)
    }

    return (
        <>
            <Breadcrumbs school={selectedSchool} />
            <div style={{marginLeft: "10vw", marginRight: "10vw"}}>
                <Row style={{marginBottom: "20px"}}>
                    <Col>
                        <h2>Trending courses</h2>
                    </Col>
                </Row>
                {getTrendingGrid(courses)}

                <Row style={{marginBottom: "20px", marginTop: "20px"}}>
                    <Col>
                        <h2>All courses</h2>
                    </Col>
                    <Col>
                        <button
                            type="button"
                            className="btn btn-outline-dark px-4 pull-right"
                            onClick={() => setShowCreateCourseModal(true)}
                        >
                            Create new course
                        </button>
                    </Col>            
                </Row>

                <Row style={{marginBottom: "20px"}}>
                    <Col>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            value={tableSearch}
                            onChange={(e) => setTableSearch(e.target.value)}
                        />
                    </Col>
                </Row>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th style={{whiteSpace: "nowrap"}}>Course code</th>
                            <th style={{whiteSpace: "nowrap"}}>Course name</th>
                            <th style={{whiteSpace: "nowrap"}}>Tags</th>
                        </tr>
                    </thead>
                    <tbody>
                    {courses.filter(c => filterCriteria(c)).map((course) => (
                        <tr key={course.id} onClick={() => openCourse(course)}>
                            <td>{course.courseCode}</td>
                            <td>{course.courseName} <i className="bi bi-0-square"></i></td>
                            <td>                                
                                <Tags>
                                    {course.tags &&
                                        course.tags.map((tag, index) => (
                                            <Tag style={{fontSize: "0.8rem"}} key={index}>{tag}</Tag>
                                            ))}
                                </Tags>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <CreateCourseModal
                    show={showCreateCourseModal}
                    onClose={() => {
                        setShowCreateCourseModal(false)
                        loadCourses()
                    }}
                    school={selectedSchool}
                    courseId={0}
                />
            </div>
        </>
    )
}

export default Courses
