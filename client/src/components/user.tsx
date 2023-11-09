import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Badge, Col, Row, Table } from 'react-bootstrap';
import { useAuth } from './authContext';

function User() {
  const context = useAuth();
  context.setCourse(null);
  const mockOverviewData = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    bio: 'Web Developer',
    lvl: 'Level 5',
    posts: '312',
    likes_recived: '4567',
    followers: '72',
    response_time: '3h, 46m',
    most_active_course: 'DH2465',
  };

  const mockPosts = [
    {
      title: 'Post 1',
      content: 'This is the content of Post 1.',
    },
    {
      title: 'Post 2',
      content: 'This is the content of Post 2.',
    },
  ];

  const mockComments = [
    {
      text: 'I agree with the post!',
    },
    {
      text: 'Great discussion here!',
    },
  ];

  const mockSavedItems = [
    {
      title: 'Saved Item 1',
      link: 'https://example.com/saved-item-1',
    },
    {
      title: 'Saved Item 2',
      link: 'https://example.com/saved-item-2',
    },
  ];

  const mockQuests = [
    {
      title: 'Answer 5 questions',
      description: 'Help others by answering 5 questions.',
      progress: 3,
      total: 5,
    },
    {
      title: 'Ask 2 questions',
      description: 'Ask 2 questions to get started.',
      progress: 0,
      total: 2,
    },
  ];

  const mockLevelData = {
    currentLevel: 5,
    progress: 28,
    nextLevelProgress: 50
  };

  const percentage = (mockLevelData.progress / mockLevelData.nextLevelProgress) * 100;

  const renderQuests = () => {
    return (
      <div>
        <h3>Quests</h3>
        {mockQuests.map((quest, index) => (
          <div key={index}>
            <h5>{quest.title}</h5>
            <p>{quest.description}</p>
            <ProgressBar now={(quest.progress / quest.total) * 100} label={`${quest.progress}/${quest.total}`} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{marginLeft: "10vw", marginRight: "10vw", marginTop: "20px"}}>
    <Row>
        <Col>
          <h2>John Doe</h2>
          <h4> {mockOverviewData.lvl} <Badge bg="success">Top contributor</Badge></h4>
        </Col>
      </Row>

      <Tab.Container id="user-tabs" defaultActiveKey="overview">
        <Card>
          <Card.Header>
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="overview">Overview</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="quests">Quests</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="posts">Posts</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="comments">Comments</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="saved">Saved</Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body>
            <Tab.Content>
              <Tab.Pane eventKey="overview">
                <Row>
                  <Col>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Stat</th>
                          <th>Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Posts made</td>
                          <td>{mockOverviewData.posts}</td>
                        </tr>
                        <tr>
                          <td>Up votes received</td>
                          <td>{mockOverviewData.likes_recived}</td>
                        </tr>
                        <tr>
                          <td>Total followers</td>
                          <td>{mockOverviewData.followers}</td>
                        </tr>
                        <tr>
                          <td>Average response time</td>
                          <td>{mockOverviewData.response_time}</td>
                        </tr>
                        <tr>
                          <td>Most active forum section</td>
                          <td>{mockOverviewData.most_active_course}</td>
                        </tr>
                      </tbody>
                    
                    </Table>
                  
                  </Col>
                  <Col xs={3}>
                    <div>
                      <CircularProgressbar value={percentage} text={`${mockLevelData.progress}/${mockLevelData.nextLevelProgress}`} />
                    </div>
                    <div>
                      <p>Only {mockLevelData.nextLevelProgress - mockLevelData.progress} more contributions to reach Level {mockLevelData.currentLevel + 1}.</p>
                    </div>
                  </Col>
                </Row>
              </Tab.Pane>
              <Tab.Pane eventKey="quests">
                {renderQuests()}
              </Tab.Pane>
              <Tab.Pane eventKey="posts">
                <h3>Posts</h3>
                <ListGroup>
                  {mockPosts.map((post, index) => (
                    <ListGroup.Item key={index}>
                      <h5>{post.title}</h5>
                      <p>{post.content}</p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Tab.Pane>
              <Tab.Pane eventKey="comments">
                <h3>Comments</h3>
                <ListGroup>
                  {mockComments.map((comment, index) => (
                    <ListGroup.Item key={index}>{comment.text}</ListGroup.Item>
                  ))}
                </ListGroup>
              </Tab.Pane>
              <Tab.Pane eventKey="saved">
                <h3>Saved</h3>
                <ListGroup>
                  {mockSavedItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <a href={item.link} target="_blank" rel="noopener noreferrer">
                        {item.title}
                      </a>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Tab.Container>
    </div>
  );
}

export default User;
