import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

function User() {
  const mockOverviewData = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    bio: 'Web Developer',
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

  return (
    <div>
      <h2>User Profile</h2>

      <Tab.Container id="user-tabs" defaultActiveKey="overview">
        <Card>
          <Card.Header>
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="overview">Overview</Nav.Link>
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
                <h3>Overview</h3>
                <p>Name: {mockOverviewData.name}</p>
                <p>Email: {mockOverviewData.email}</p>
                <p>Bio: {mockOverviewData.bio}</p>
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
