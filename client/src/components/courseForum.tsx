import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';

interface RouteParams {
  courseId: string; // Define the type of courseId here
}

// Mock thread data
const mockThreads = [
  {
    id: 1,
    title: 'Thread 1',
    content: 'This is the content of Thread 1.',
    likesComments: '5 comments, 10 likes',
  },
  {
    id: 2,
    title: 'Thread 2',
    content: 'This is the content of Thread 2.',
    likesComments: '5 comments, 10 likes',
  },
  {
    id: 3,
    title: 'Thread 3',
    content: 'This is the content of Thread 3.',
    likesComments: '5 comments, 10 likes',
  },
];

function CourseDetail() {
  const { courseId } = useParams<RouteParams>();

  const [showModal, setShowModal] = useState(false);
  const [newThread, setNewThread] = useState('');
  const [threads, setThreads] = useState(mockThreads);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const addNewThread = () => {
    if (newThread) {
      const newThreadObj = {
        id: threads.length + 1,
        title: newThread,
        content: '',
        likesComments: '0 comments, 0 likes',
      };
      const updatedThreads = [...threads, newThreadObj];
      setThreads(updatedThreads);
      setNewThread(''); // Clear the input
      handleClose();
    }
  };

  const addThread = () => {
    handleShow(); // Show the modal when the button is clicked
  };

  // Define your form fields and logic for adding a new thread within the modal

  return (
    <div>
      <h2>Course Details</h2>
      <p>Course ID: {courseId}</p>

      <h3>Threads</h3>
      <Button
        onClick={addThread}
        variant="primary"
        style={{
          marginLeft: '10px',
        }}
      >
        Ask a Question
      </Button>
      <div className="threads">
        {threads.map((thread) => (
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
  );
}

export default CourseDetail;
