import React from "react"
import { InternalAPI, SchoolDTO } from "../api/api"
import { Card, CardGroup, Col, Row } from "react-bootstrap"
import { useAuth } from "./authContext"

const server = new InternalAPI()

function Homepage() {
    const [schools, setSchools] = React.useState<SchoolDTO[]>([])
    const { setSchool } = useAuth()

    React.useEffect(() => {
        server.getSchools().then((schools) => {
            setSchools(schools)
        })
    }, [])

    return (
        <div>
            <h2>Welcome to Scopus</h2>
            <p>Select your university</p>
            <Row xs={2} md={4}>
                {schools.map((school) => (
                    <Col key={school.id}>
                        <Card key={school.id}>
                            <Card.Img
                                variant="top"
                                src={school.imageUrl}
                                alt={school.schoolName}
                            />
                            <Card.Body>
                                <Card.Title>{school.schoolName}</Card.Title>
                                <Card.Subtitle>{school.location}</Card.Subtitle>
                                <Card.Text>{school.description}</Card.Text>
                                <Card.Link
                                    onClick={() => setSchool(school)}
                                    href={`/courses`}
                                    className="btn btn-outline-dark px-4"
                                >
                                    Pick
                                </Card.Link>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    )
}

export default Homepage
