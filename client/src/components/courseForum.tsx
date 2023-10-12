import React from 'react';
import { useParams } from 'react-router-dom';

interface RouteParams {
  courseId: string; // Define the type of courseId here
}

function CourseDetail() {
  const { courseId } = useParams<RouteParams>();

  // Now courseId should be recognized as a string.

  return (
    <div>
      <h2>Course Details</h2>
      <p>Course ID: {courseId}</p>
      {/* Display course details based on courseId */}
    </div>
  );
}

export default CourseDetail;