import React from "react";
import { Link } from 'react-router-dom';

function NavigationBar() {
    return (
      <nav>
        <Link to="/">Lecture chatrooms</Link>
        <Link to="/resources">Course resources</Link>
        <Link to="/login" >Login</Link>
      </nav>
    );
}

export default NavigationBar;