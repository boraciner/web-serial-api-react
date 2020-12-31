import React, {Component} from "react";
import DeviceState from './components/DeviceState/DeviceState'
import Grid from '@material-ui/core/Grid';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from "./components/Header/Header"
import './App.css';

const Contact = props => {
  return(
      <div>
        Contact Page
      </div>
    )
}

/*
const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
const isOpera = (!!window.opr) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
const isFirefox = typeof InstallTrigger !== 'undefined';
const isIE = false || !!document.documentMode;
const isEdge = !isIE && !!window.StyleMedia;
*/


class App extends Component{

  constructor(props){
    super(props)
    this.state = {
      p1 :
        {id: 1, selected : false, port : {},onClickHandler:this.selectCom1},
      p2 :
        {id: 2, selected : false, port : {},onClickHandler:this.selectCom2},
      supported : false
    };

    this.selectCom1 = this.selectCom1.bind(this)
    this.selectCom2 = this.selectCom2.bind(this)
  }
  

  
  
  async componentDidMount(){
    try{
    console.log("list of serial ports the website has been granted access to previously",navigator.serial.getPorts())

      const portList = await navigator.serial.getPorts()
    
      if(portList.length === 2){
        this.setState(
          {
            p1 : {id: portList[0].id, selected : true, port : portList[0]},
            p2 : {id: portList[1].id, selected : false, port : portList[1]},
            supported : true
          }
        )
      }else if(portList.length === 1){
        this.setState(
          {
            p1 : {id: portList[0].id, selected : true, port : portList[0]},
            p2 : this.state.p2,
            supported : true
          }
        )
      }
    }catch(err){
      this.setState(
        {
          p1 : this.state.p1,
          p2 : this.state.p2,
          supported : false
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
          console.log("AskUserForComport p1",p1)
          this.setState(
            {
              p1 : {id: this.state.p1.id, selected : true, port : p1},
              p2 : this.state.p2,
              supported : this.supported
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
              p2 : {id: this.state.p2.id, selected : true, port : p2},
              supported : this.supported
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
    console.log("Create Message box")
    if(this.state.supported){
      if(this.state.p1.selected === false)
      return(
        <div className='parentMessageBox'>
            <div className='messageBoxSelectButton' onClick={this.selectCom1} key="c1"/>
        </div>  
        )
      else
        return null;
    }else{
      return(
        <div>
          <div className='warningMessageBox'>
          </div>  
        </div>
        )
    }
    
  }


  render(){
    console.log("render....")
  return (
    <div >
      <Header/>
      <Router>
      <Switch>
        <Route path="/contact">
          <Contact />
        </Route>
        <Route>
          {this.prepareComPortSelectButtons()}
          <Grid container justify='center'>
            <Grid item xs={12}>
              <div>
                {this.state.p1.selected === true ? <DeviceState port={this.state.p1}/ > : null}
              </div>
            </Grid>
          </Grid>
        </Route>
      </Switch>
      </Router>
    </div>
  );
}
}

export default App