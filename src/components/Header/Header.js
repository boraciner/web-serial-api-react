import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import IconButton from '@material-ui/core/IconButton';
import EvStationIcon from '@material-ui/icons/EvStation';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';

import {
  BrowserRouter as Router,
  Link,
} from 'react-router-dom';



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Header() {

  const classes = useStyles();

  return (
      <AppBar position="sticky" >
        <Router style={{underline:"none"}}>
        <Toolbar>
          <section className={classes.leftToolbar}>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" component={Link} to={'/'}>
          <EvStationIcon/><DirectionsCarIcon/>
          Home
          </IconButton>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" component={Link} to={'/contact'}>
            <ContactMailIcon/>
            Contact
          </IconButton>
          </section>
        </Toolbar>
        </Router>
      </AppBar>
  );
}

