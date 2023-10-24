import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { CourseDTO, InternalAPI } from '../api/api';

const CourseBox = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
  display: block; /* Make the entire box clickable */
  text-decoration: none; /* Remove default link underline */
  color: black; /* Set the link color to black */
`;

const CourseTitle = styled.h3`
  margin: 0;
`;

const CourseDescription = styled.p`
  margin: 5px 0;
`;

function Courses() {
  const server = new InternalAPI();
  const [courses, setCourses] = useState<CourseDTO[]>([]);

  const fetchData = async () => {
    const courses = await server.getCourses(1)
    setCourses(courses);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h2>Courses</h2>
      <div className="course-list">
        {courses.map(course => (
          <Link to={`/course/${course.id}`} key={course.id}>
            <CourseBox>
              <CourseTitle>{course.courseName}</CourseTitle>
              <CourseDescription>Description: {course.description}</CourseDescription>
            </CourseBox>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Courses;
