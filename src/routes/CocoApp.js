import React from 'react';
import { Outlet } from "react-router-dom";
import { Container, Grid } from 'semantic-ui-react';
import Navbar from '../navbar/navbar';
import { App } from 'antd';
import { Toaster } from 'react-hot-toast';

function CocoApp() {
  return (
    <App>
      <Toaster />
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
    </App>
  );
}

export default CocoApp;
