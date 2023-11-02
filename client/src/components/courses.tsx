import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { CourseDTO, InternalAPI } from "../api/api"
import { useAuth } from "./authContext"
import CreateCourseModal from "./createCourseModal"
import { Col, Row } from "react-bootstrap"

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
    background-color: #007bff;
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
    const { selectedSchool } = useAuth()
    const [courses, setCourses] = useState<CourseDTO[]>([])
    const [showCreateCourseModal, setShowCreateCourseModal] = useState(false)

    const loadCourses = async () => {
        // const courses = await server.getCourses(1)
        if (!selectedSchool?.id) return

        server.getCourses(selectedSchool?.id).then((courses) => {
            setCourses(courses)
        })
    }

    useEffect(() => {
        loadCourses()
    }, [])

    return (
        <div>
            <Row>
                <Col>
                    <h2>Courses</h2>
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
            <Row>
                <div className="course-list">
                    {courses.map((course) => (
                        <Link to={`/course/${course.id}`} key={course.id}>
                            <CourseBox>
                                <CourseInfo>
                                    <CourseTitle>
                                        {`${course.courseName} (${course.courseCode})`}
                                    </CourseTitle>
                                    <CourseDescription>
                                        Description: {course.description}
                                    </CourseDescription>
                                </CourseInfo>
                                <Tags>
                                    {course.tags &&
                                        course.tags.map((tag, index) => (
                                            <Tag key={index}>{tag}</Tag>
                                        ))}
                                </Tags>
                            </CourseBox>
                        </Link>
                    ))}
                </div>
            </Row>
            <CreateCourseModal
                show={showCreateCourseModal}
                onClose={() => setShowCreateCourseModal(false)}
                school={selectedSchool}
                courseId={0}
            />
        </div>
    )
}

export default Courses
