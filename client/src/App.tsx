import React, { useEffect, useState } from 'react';
import './App.css';
import { InternalAPI } from './api/api';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; // Import Switch
import { AuthProvider } from './components/authContext';

import Homepage from './components/homepage';
import Courses from './components/courses';
import User from './components/user';

import { Container } from './components/_atoms';
import NavBar from './components/NavBar';
import CourseForum from './components/courseForum';
import Post from './components/thread';
import Breadcrumbs from './components/breadcrumbs';
import Register from './components/register';
// import SideMenu from './components/sideMenu/sideMenu';

function App() {
  //
  const server = new InternalAPI();
  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
  };

  useEffect(() => {
    fetchData();
  }, []);
  // Lite osäker på vad detta över gör

  const [sideMenuIsOpen, setSideMenuIsOpen] = React.useState<boolean>(false);

	const toggleSideMenu = () => {
		setSideMenuIsOpen(!sideMenuIsOpen);
	};

  return (
    <Router>
    <AuthProvider>
    <Container>
      <NavBar toggleSideMenu={toggleSideMenu} />
      <Breadcrumbs />
        <Switch>
          <Route path="/course/:courseId" component={CourseForum} />
          <Route path="/thread/:threadId" component={Post} />
          <Route path="/register" component={Register} />
          <Route path="/courses" component={Courses} />
          <Route path="/user" component={User} />
          <Route path="/" component={Homepage} />
        </Switch>
      {/* <SideMenu isOpen={sideMenuIsOpen} toggleOpen={toggleSideMenu} /> */}
    </Container>
    </AuthProvider>
    </Router>
  );
}

export default App;
