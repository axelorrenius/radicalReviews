import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

interface RouteParams {
  courseId: string; // Define the type of courseId here
}

// Mock thread data
const mockThreads = [
  {
    id: 1,
    title: 'Thread 1',
    content: 'This is the content of Thread 1.',
    likesComments: '5 comments, 10 likes'
  },
  {
    id: 2,
    title: 'Thread 2',
    content: 'This is the content of Thread 2.',
    likesComments: '5 comments, 10 likes'
  },
  {
    id: 3,
    title: 'Thread 3',
    content: 'This is the content of Thread 3.',
    likesComments: '5 comments, 10 likes'
  },
];

function CourseDetail() {
  const { courseId } = useParams<RouteParams>();

  // Now courseId should be recognized as a string.
  const addThread = () => {
    // Implement the logic to enter a new thread here
    console.log('Entering a new thread');
  };

  return (
    <div>
      <h2>Course Details</h2>
      <p>Course ID: {courseId}</p>

      <button
        onClick={addThread}
        style={{
          position: 'absolute',
          bottom: '15px',
          right: '15px',
          backgroundColor: 'blue',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          fontSize: '30px',
          color: 'white',
          cursor: 'pointer',
        }}
      >
        +
      </button>

      <h3>Threads</h3>
      <div className="threads">
        {mockThreads.map((thread) => (
          <Link key={thread.id} to={`/thread/${thread.id}`}>
            <Card key={thread.id} style={{ margin: '10px' }}>
              <Card.Body>
                <Card.Title>{thread.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {thread.likesComments}
                </Card.Subtitle>
                <Card.Text>{thread.content}</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CourseDetail;
