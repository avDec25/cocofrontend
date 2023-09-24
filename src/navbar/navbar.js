import React from 'react'
import { Grid, Menu } from 'semantic-ui-react';
import { useLocation, Link } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();
    console.log(location.pathname);
    return (
        <Grid.Column>
            <Menu className='overflowing-menu'>
                <Link to="drops"><Menu.Item active={location.pathname==="/drops"} >Drops</Menu.Item></Link>
                <Link to="customers"><Menu.Item active={location.pathname==="/customers"}>Customers</Menu.Item></Link>
                <Link to="items"><Menu.Item active={location.pathname==="/items"}>Items</Menu.Item></Link>
                <Link to="orders"><Menu.Item active={location.pathname==="/orders"}>Orders</Menu.Item></Link>
            </Menu>
        </Grid.Column>
    );
}