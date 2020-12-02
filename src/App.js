import React, {Component} from "react";
import Header from "./components/Header/Header"
import DeviceState from './components/DeviceState/DeviceState'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

class App extends Component{

  constructor(props){
    super(props)
    this.state = {
      p1 :
        {id: 1, selected : false, port : {},onClickHandler:this.selectCom1},
      p2 :
        {id: 2, selected : false, port : {},onClickHandler:this.selectCom2},
      
    };

    this.selectCom1 = this.selectCom1.bind(this)
    this.selectCom2 = this.selectCom2.bind(this)
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
  


  async AskUserForComport(slotId){
    try {
      
      switch(slotId){
      case 1:
        if(!this.state.p1.selected){
          const p1 = await navigator.serial.requestPort()
          
          this.setState(
            {
              p1 : {id: this.state.p1.id, selected : true, port : p1},
              p2 : this.state.p2
            }
          )

        }
        break;

      case 2:
        if(!this.state.p2.selected){
          const p2 = await navigator.serial.requestPort()
          
          this.setState(
            {
              p1 : this.state.p1,
              p2 : {id: this.state.p2.id, selected : true, port : p2}
            }
          )

        }
        break;
        default:
          console.error("Default switch-case")
          break;
    }
  } catch (err) {
    console.log("An error was caught: ", err);
  }
  }
 

  async selectCom1(){
      this.AskUserForComport(1)   
  }


  async selectCom2(){
      this.AskUserForComport(2)   
  }

  prepareComPortSelectButtons(){
    return(
      <ButtonGroup disableElevation variant="contained" color="secondary">
        {this.state.p1.selected === false ? <Button onClick={this.selectCom1} key="c1">COM 1</Button> : null}
        {this.state.p2.selected === false ? <Button onClick={this.selectCom2} key="c2">COM 2</Button> : null}
      </ButtonGroup>
      )
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
            {this.state.p1.selected === true ? <DeviceState comportName="COM1" port={this.state.p1}/> : null}
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper>
            {this.state.p2.selected === true ? <DeviceState comportName="COM2" port={this.state.p2}/> : null}
          </Paper>
        </Grid>
        
      </Grid>
    </div>
  );
}
}

export default App