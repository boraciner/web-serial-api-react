import React, {Component} from "react";
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

  constructor(props){
    super(props)
    this.state = {
      p1 :
        {id: 1, selected : false, port : {}, role : "NA",onClickHandler:this.selectCom1,rawData:""},
      p2 :
        {id: 2, selected : false, port : {}, role : "NA",onClickHandler:this.selectCom2,rawData:""},
      
    };

    this.selectCom1 = this.selectCom1.bind(this)
    this.selectCom2 = this.selectCom2.bind(this)
    this.portReader = {}
  }
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
  async selectCom1(){
    try {
      const p1 = await navigator.serial.requestPort()
      this.setState(
        {
          p1 : {id: this.state.p1.id, selected : true, port : p1}
        }
      )
    } catch (err) {
      console.log("An error was caught: ", err);
    }
  }


 
  async selectCom2(){
    try {
      const p2 = await navigator.serial.requestPort()
      this.setState(
        {
          p2 : {id: this.state.p2.id, selected : true, port : p2}
        }
      )

      await p2.open({ baudRate: 9600});
      this.portReader = p2.readable.getReader();
      while (true) {
        const { value, done } = await this.portReader.read();
        if (done) {
          break;
        }
        console.log("VALUE ",value)
        this.setState(
          {
            p2 : {id: this.state.p2.id, selected : true,port:this.state.p2.port ,rawData: this.state.p2.rawData+value}
          }
        )
      }

    } catch (err) {
      console.log("An error was caught: ", err);
    }
  }

  prepareComPortSelectButtons(){
    if(!this.state.p2.selected)
    return(
      <ButtonGroup disableElevation variant="contained" color="secondary">
        <Button onClick={this.selectCom1} key="c1">COM 1</Button>
        <Button onClick={this.selectCom2} key="c2">COM 2</Button>
      </ButtonGroup>
      )
    else{
      return(
        <ButtonGroup disableElevation variant="contained" color="secondary">
          <Button onClick={this.selectCom1} key="c1">COM 1</Button>
        </ButtonGroup>
        )
    }
  }
  render(){

  return (
    <div>
      <Header/>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          {this.prepareComPortSelectButtons()}
        </Grid>
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
          {this.state.p2.rawData}
        </Grid>
      </Grid>
    </div>
  );
}
}

export default App