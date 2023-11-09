import React from "react"
import { InternalAPI, SchoolDTO } from "../api/api"
import { Card, Col, Row } from "react-bootstrap"
import { useAuth } from "./authContext"
import { Link } from "react-router-dom"

const server = new InternalAPI()

function Homepage() {
    const [schools, setSchools] = React.useState<SchoolDTO[]>([])
    const { setSchool, setCourse } = useAuth()
    setCourse(null)

    React.useEffect(() => {
        server.getSchools().then((schools) => {
            setSchools(schools)
        })
    }, [])

    return (
        <>
            <div style={{marginLeft: "10vw", marginRight: "10vw", marginTop: "10px"}}>
                <Row style={{marginBottom: "20px"}} md={1}>
                    <h2>Explore the student communities in Scourse</h2>
                    <h4>Begin by selecting your university</h4>
                </Row>
                <Row xs={2} md={3}>
                    {schools.map((school) => (
                        <Col key={school.id}>
                            <Card key={school.id}>
                                <Card.Img
                                    variant="top"
                                    src={school.imageUrl}
                                    alt={school.schoolName}
                                    style={{objectFit: "cover", height: "200px"}}
                                />
                                <Card.Body>
                                    <Card.Title>{school.schoolName}</Card.Title>
                                    <Card.Subtitle>{school.location}</Card.Subtitle>
                                    <br></br>
                                    <Link
                                        onClick={() => setSchool(school)}
                                        to={`/courses`}
                                        className="btn btn-outline-dark px-4"
                                    >
                                        Select
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </>
    )
}

export default Homepage
