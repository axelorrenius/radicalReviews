import React, { useEffect, useState } from 'react';
import './App.css';
import { InternalAPI } from './api/api';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; // Import Switch

import Homepage from './components/homepage';
import Courses from './components/courses';
import User from './components/user';

import { Container } from './components/_atoms';
import NavBar from './components/NavBar';
// import SideMenu from './components/sideMenu/sideMenu';

function App() {
  // 
  const server = new InternalAPI();
  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    server.getTest().then((res) => {
      setData(res);
    });
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
    <Container>
      <Router>
      <NavBar toggleSideMenu={toggleSideMenu} />
        <Switch> 
          <Route path="/courses" component={Courses} />
          <Route path="/user" component={User} />
          <Route path="/" component={Homepage} />
        </Switch>
      </Router>
      {/* <SideMenu isOpen={sideMenuIsOpen} toggleOpen={toggleSideMenu} /> */}
    </Container>
  );
}

export default App;





