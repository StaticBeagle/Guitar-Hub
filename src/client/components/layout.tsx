import React, { FC, ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LoginButton from "./login-button";
import LogoutButton from "./logout-button";
import { useAuth0, User } from "@auth0/auth0-react";
import HomeIcon from '@material-ui/icons/Home';
import { NavLink } from "react-router-dom";
import PeopleIcon from '@material-ui/icons/People';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { j } from "../jinaga-config";
import { GuitarHubUser } from '../models/guitar-hub-user';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';


interface ChildrenProps {
  children: ReactNode;
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
  },
}));



const Layout: FC<ChildrenProps> = ({ children }) => {
  const classes = useStyles();
  const { user, isAuthenticated, isLoading } = useAuth0();

  const getUser = async (user: User) => {
    const guitarHubUser = await j.exists({
      type: "GuitarHub.User",
      userName: user.nickname          // Where person is the result of a previous j.fact.
    });
    console.log(guitarHubUser);
  }

  const saveUser = async (user: User) => {
    const guitarHubUser = await j.fact({
      type: "GuitarHub.User",
      userName: user.nickname || ''         // Where person is the result of a previous j.fact.
    });
    console.log(guitarHubUser);
    console.log("Here")
  }

  //const [some, setSome] = useState(false)
  // if (isLoading) {
  //   console.log("here")
  //   getUser();
  //   return <h1>Loading</h1>
  // }

  if (!isLoading && user) {
    console.log(getUser(user));
    // const gg = saveUser(user).then(() => {
    //   console.log(gg);
    //   console.log(user);
    // });
  }





  // useEffect(() => {
  //   // check if the user exists
  //   // if the use exists get the nickname
  //   // if the user doesn't ex ists save it and get the nickname
  //   //const users = User.userExists(user);

  //   // const saveUser = async (user: User, j: Jinaga) => {
  //   //   const guitarHubUser = j.fact({
  //   //     type: "GuitarHub.User",
  //   //     user: user          // Where person is the result of a previous j.fact.
  //   //   });
  //   // }
  //   console.log("here")
  // }, []);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Guitar Hub
          </Typography>
          {!isAuthenticated ? <LoginButton /> : <LogoutButton />}
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            <ListItem button component={NavLink} to="/">
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={"Home"} />
            </ListItem>
            {isAuthenticated && (
              <ListItem button component={NavLink} to={`/users/${user?.nickname?.replace(".", "")}`}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary={"My Gear"} />
              </ListItem>
            )}
            <ListItem button component={NavLink} to="/users">
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary={"Users"} />
            </ListItem>
            {isAuthenticated && ( // is admin
              <ListItem button component={NavLink} to={"/admins"}>
                <ListItemIcon>
                  <SupervisorAccountIcon />
                </ListItemIcon>
                <ListItemText primary={"Admins"} />
              </ListItem>
            )}
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        {children}
      </main>
    </div>
  );
}

export default Layout;