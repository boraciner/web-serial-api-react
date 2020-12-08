import React, {Component} from "react";
import Header from "./components/Header/Header"
import DeviceState from './components/DeviceState/DeviceState'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

var sectionStyle = {
  width: "100%",
  height: "100%",
  background: "rgb(2,0,36)",
  background: "linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(105,255,90,1) 12%, rgba(19,66,0,1) 100%)",
};


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
  

  
  
  async componentDidMount(){
    console.log("list of serial ports the website has been granted access to previously",navigator.serial.getPorts())
    const portList = await navigator.serial.getPorts()
    
    if(portList.length === 2){
      this.setState(
        {
          p1 : {id: portList[0].id, selected : true, port : portList[0]},
          p2 : {id: portList[1].id, selected : false, port : portList[1]},
        }
      )
    }else if(portList.length === 1){
      this.setState(
        {
          p1 : {id: portList[0].id, selected : true, port : portList[0]},
          p2 : this.state.p1,
        }
      )
    }
  }


  async AskUserForComport(slotId){
    try {
      
      switch(slotId){
      case 1:
        if(!this.state.p1.selected){
          console.log("list of serial ports the website has been granted access to previously",navigator.serial.getPorts())
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
        {this.state.p1.selected === false ? <Button onClick={this.selectCom1} key="c1">COM</Button> : null}
        {/*this.state.p2.selected === false ? <Button onClick={this.selectCom2} key="c2">COM</Button> : null*/}
      </ButtonGroup>
      )
  }
  render(){

  return (
    <div style={ sectionStyle } >
      <Header/>

      <Grid container spacing={0}  >
        <Grid item xs={12}>
          {this.prepareComPortSelectButtons()}
        </Grid>
        <Grid item xs={12}>
          <Paper style={{backgroundColor: 'rgba(255,255,255,.1)'}}>
            {this.state.p1.selected === true ? <DeviceState port={this.state.p1}/ > : null}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
}

export default App