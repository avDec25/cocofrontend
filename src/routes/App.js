import React from 'react';
import { Outlet } from "react-router-dom";
import { Container, Grid } from 'semantic-ui-react';
import Navbar from '../navbar/navbar';


function App() {
  return (
    <Container className='menubar'>
      <Grid>
        <Grid.Row>
          <Navbar/>
        </Grid.Row>

        <Grid.Row>
          <Outlet/>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default App;
