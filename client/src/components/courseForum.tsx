import React from 'react';
import { useParams } from 'react-router-dom';

interface RouteParams {
  courseId: string; // Define the type of courseId here
}

// Mock thread data
const mockThreads = [
  {
    id: 1,
    title: 'Thread 1',
    content: 'This is the content of Thread 1.',
  },
  {
    id: 2,
    title: 'Thread 2',
    content: 'This is the content of Thread 2.',
  },
  {
    id: 3,
    title: 'Thread 3',
    content: 'This is the content of Thread 3.',
  },
];

function CourseDetail() {
  const { courseId } = useParams<RouteParams>();

  // Now courseId should be recognized as a string.
  const threadBoxStyle = {
    border: '1px solid #ccc',
    padding: '10px',
    margin: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
  };

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
          <div key={thread.id} style={threadBoxStyle}>
            <h4>{thread.title}</h4>
            <p>{thread.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseDetail;