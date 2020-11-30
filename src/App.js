import React, {Component} from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Header from "./components/Header/Header"
import DeviceState from './components/DeviceState/DeviceState'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import CalculatedChart from './components/CalculatedChart/CalculatedChart'

class App extends Component{

  prepareSlider(){
    return(
      <Grid container spacing={3} 
        direction="row"
        justify="flex-end"
        alignItems="center">
        <Grid item xs={3}>
        <FormControlLabel
          control={<Switch name="checkedA" />}
          label="Auto Run"
        />
        </Grid>
      </Grid>
    ) 
  }

  prepareStartStopButtons(){
    return(
      <Grid container spacing={3} 
        direction="row"
        justify="center"
        alignItems="center">
        <Grid item xs={3}>
        <ButtonGroup  >
          <Button color="primary" aria-label="outlined primary button group">Start</Button>
          <Button color="secondary" aria-label="outlined secondary button group">Stop</Button>
        </ButtonGroup>
        </Grid>
      </Grid>
    ) 
  }
  
  render(){

  return (
    <div>
      <Header/>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          {this.prepareSlider()}
        </Grid>
        <Grid item xs={12}>
        {this.prepareStartStopButtons()}
        </Grid>
        <Grid item xs={6}>
          <Paper>
            <DeviceState comportName="COM1"/>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper>
            <DeviceState comportName="COM2"/>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <CalculatedChart/>
        </Grid>
      </Grid>
    </div>
  );
}
}

export default App