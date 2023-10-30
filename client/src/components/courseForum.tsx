import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import { InternalAPI, ThreadDTO } from '../api/api';
import styled from 'styled-components';

interface RouteParams {
  courseId: string; // Define the type of courseId here
}

const ThreadCard = styled(Card)`
  margin: 10px;
  display: flex;
  justify-content: space-between; 
`;

const ThreadCardContent = styled.div`
  flex: 1; /* Allow the content to grow */
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  margin-left: 10px;
  justify-content: flex-end; /* Align tags to the right */
`;

const Tag = styled.span`
  background-color: #007bff;
  color: #fff;
  padding: 4px 8px;
  margin-right: 5px;
  margin-bottom: 5px;
  border-radius: 4px;
  font-size: 14px;
`;


function CourseDetail() {
  const server = new InternalAPI();

  const { courseId } = useParams<RouteParams>();
  const courseIdNum = parseInt(courseId);

  const [showModal, setShowModal] = useState(false);
  const [newThread, setNewThread] = useState('');
  const [threads, setThreads] = useState<ThreadDTO[]>([]);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const fetchThreads = async () => {
    // const threads = await server.getThreads(courseIdNum)
    // make example threads from dto
    const threads = [
      {
        id: 1,
        courseId: 1,
        title: 'Introduction to Programming',
        upVotes: 10,
        downVotes: 2,
        content: 'This thread is about the basics of programming.',
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2023-01-16'),
        posts: [],
        tags: ['Programming', 'Beginner'],
      },
      {
        id: 2,
        courseId: 1,
        title: 'Data Structures Discussion',
        upVotes: 8,
        downVotes: 1,
        content: 'Let\'s talk about data structures and their applications.',
        createdAt: new Date('2023-01-17'),
        updatedAt: new Date('2023-01-18'),
        posts: [],
        tags: ['Data Structures', 'Intermediate'],
      },
      {
        id: 3,
        courseId: 2,
        title: 'Algorithm Optimization',
        upVotes: 15,
        downVotes: 3,
        content: 'Share your insights on optimizing algorithms.',
        createdAt: new Date('2023-01-20'),
        updatedAt: new Date('2023-01-21'),
        posts: [],
        tags: ['Algorithms', 'Advanced'],
      },
      {
        id: 4,
        courseId: 2,
        title: 'Web Development Frameworks',
        upVotes: 12,
        downVotes: 4,
        content: 'Discuss popular web development frameworks and their features.',
        createdAt: new Date('2023-01-23'),
        updatedAt: new Date('2023-01-24'),
        posts: [],
        tags: ['Web Development', 'Frameworks'],
      },
    ]
    setThreads(threads);
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  const addNewThread = () => {
    if (newThread) {
      const newThreadObj = {
        courseId: courseIdNum,
        title: newThread,
        content: '',
        upVotes: 0,
        downVotes: 0,
        posts: [],
        tags: [],
      };

      server.saveThread(newThreadObj).then(result => {
        setThreads([result, ...threads]);
      }).catch(err => console.error(err));

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
            <ThreadCard>
              <ThreadCardContent>
                <Card.Body>
                  <Card.Title>{thread.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {/* {thread.likesComments} */}
                  </Card.Subtitle>
                  <Card.Text>{thread.content}</Card.Text>
                </Card.Body>
              </ThreadCardContent>
              <Tags>
                {thread.tags.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </Tags>
            </ThreadCard>
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
