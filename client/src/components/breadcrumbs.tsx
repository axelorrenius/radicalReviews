import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CourseDTO, SchoolDTO, ThreadDTO } from '../api/api';

const breadcrumbContainerStyle = {
  display: 'flex',
  marginRight: '15px',
};

const linkStyle = {
  color: 'var(--bs-body-color)',
  textDecoration: 'none',
  paddingRight: '2px',
};

interface BreadcrumbProps {
  school?: SchoolDTO | null;
  course?: CourseDTO | null;
  thread?: ThreadDTO | null;
}


const Breadcrumbs = (props: BreadcrumbProps) => {
  const { school, course, thread } = props;

  return (
    <nav aria-label="breadcrumb" style={{margin: "5px"}}>
      <ol className="breadcrumb" style={breadcrumbContainerStyle}>
        <li className="breadcrumb-item">
          <Link to="/" style={linkStyle}>
            home
          </Link>
        </li>
        {school && (
          <li className="breadcrumb-item">
            <Link to={`/courses`} style={linkStyle}>
              {school.schoolName.substring(0, 100)}
            </Link>
          </li>
        )}
        {course && (
          <li className="breadcrumb-item">
            <Link to={`/course/${course.id}`} style={linkStyle}>
              {course.courseCode.substring(0, 100)}
            </Link>
          </li>
        )}
        {thread && (
          <li className="breadcrumb-item">
            <Link to={`/thread/${thread.id}`} style={linkStyle}>
              {thread.title.substring(0, 100)}
            </Link>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
