import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { CourseDTO, InternalAPI } from '../api/api';

const CourseBox = styled.div`
  display: flex;
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
  text-decoration: none;
  color: black;
  justify-content: space-between; // Add this to align Tags to the right
`;

const CourseInfo = styled.div`
  flex: 1; // Allow the info section to grow
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  margin-left: 10px; 
`;

const Tag = styled.span`
  background-color: #007bff;
  color: #fff;
  padding: 4px 8px;
  margin-right: 5px;
  margin-bottom: 5px; // Space between tags
  border-radius: 4px;
  font-size: 14px;
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
    // const courses = await server.getCourses(1)
    const courses = [
      {
        id: 1,
        courseName: 'CS 101',
        description: 'Introduction to Computer Science',
        tags: ['Beginner', 'Programming'],
        schoolId: 1,
      },
      {
        id: 2,
        courseName: 'CS 201',
        description: 'Data Structures',
        tags: ['Intermediate', 'Algorithms'],
        schoolId: 1,
      },
      {
        id: 3,
        courseName: 'CS 301',
        description: 'Algorithms',
        tags: ['Advanced', 'Algorithms'],
        schoolId: 1,
      },
    ];
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
              <CourseInfo>
                <CourseTitle>{course.courseName}</CourseTitle>
                <CourseDescription>Description: {course.description}</CourseDescription>
              </CourseInfo>
              <Tags>
                {course.tags.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </Tags>
            </CourseBox>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Courses;
