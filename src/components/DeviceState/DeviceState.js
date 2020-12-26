import React,{Component, useState} from 'react'
import { createMuiTheme, responsiveFontSizes} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import './DeviceState.css'
import Tooltip from '@material-ui/core/Tooltip';


class DeviceState extends Component{

    pevSendStartCommand(){
        console.log("Send Start Command")
        const data = new Uint8Array([32]); // space
            this.portWriter.write(data).then(res=>{
            });
    }
    handleContToggleSwitch(event){

    }

    pevSendStopCommand(){
        const data = new Uint8Array([100]); // d
        this.portWriter.write(data).then(res=>{
        });

        this.initializePEVStrings();
        this.setState({  
            printOutCom : this.printOutCom,
            toggleToRefresh : true,
            role : this.role,
            checked : this.state.checked  
        })
    }
    initializePEVStrings(){
        this.pevStrings = [
            {details : "PIB image reading completed OK",display : "PIB image reading completed OK",found : false,warning : false},
            {details : "CM_SLAC_PARAM.REQ sent",display : "CM_SLAC_PARAM.REQ sent",found : false,warning : false},
            {details : "CM_SLAC_PARAM.CNF received",display : "CM_SLAC_PARAM.CNF received",found : false,warning : false},
            {details : "CM_START_ATTEN_CHAR.IND sent",display : "CM_START_ATTEN_CHAR.IND sent",found : false,warning : false},
            {details : "CM_MNBC_SOUND.IND sent",display : "CM_MNBC_SOUND.IND sent",found : false,warning : false},
            {details : "CM_ATTEN_CHAR.IND received",display : "CM_ATTEN_CHAR.IND received",found : false,warning : false},
            {details : "CM_ATTEN_CHAR.RSP sent",display : "CM_ATTEN_CHAR.RSP sent",found : false,warning : false},
            {details : "CM_VALIDATE.REQ sent",display : "CM_VALIDATE.REQ sent",found : false,warning : false},
            {details : "CM_VALIDATE.CNF received. -Charger Ready-",display : "CM_VALIDATE.CNF received. -Charger Ready-",found : false,warning : false},	
            {details : "CM_VALIDATE.CNF received. -Charger Success-",display : "CM_VALIDATE.CNF received. -Charger Success-",found : false,warning : false},	
            {details : "CM_SET_KEY.CNF received",display : "CM_SET_KEY.CNF received",found : false,warning : false},	
            {details : "New keys set",display : "New keys set",found : false,warning : false},	
            {details : "Link Measurement:",display : "Link Measurement:",found : false,warning : false},	
            {details : "Sending IPv6.",display : "Sending IPv6.",found : false,warning : false},	
            {details : "IPv6 Message is received",display : "IPv6 Message is received",found : false,warning : false},	
            {details : "TIMEOUT",display : "Timeout Occured",found : false,warning : true},	
        ]
        
        
    }

    
  
  
    componentDidMount(){
        this.OpenReadComPort();
    }

    ProcessSplittedCommand(sCommand){
        console.warn("sCommand ",sCommand)
        if(sCommand.length > 5){
            if(sCommand.includes("ROLE:PEV"))
            {
                    this.role = "PEV";
                    clearInterval(this.queryInterval);
                    this.setState({  printOutCom : this.printOutCom,
                                        toggleToRefresh : this.toggleToRefresh,
                                        role : this.role  ,
                                        checked : this.state.checked  
                                    })
            }
            else if(sCommand.includes("ROLE:EVSE"))
            {
                    this.role = "EVSE";
                    clearInterval(this.queryInterval);
                    this.setState({  printOutCom : this.printOutCom,
                                        toggleToRefresh : this.toggleToRefresh,
                                        role : this.role ,
                                        checked : this.state.checked   })
            }else{
                    let nowFound = false;
                    for(let i=0;i<this.pevStrings.length;i++){
                        //console.log("Compare ",sCommand, " with ",this.pevStrings[i].details)
                        if(sCommand.includes(this.pevStrings[i].details) && this.pevStrings[i].found === false){
                            if(sCommand.includes(this.pevStrings[12].details))//Link Measurement
                            {
                                let measurementValue = sCommand.split(':')
                                if(measurementValue.length>1){
                                    this.pevStrings[12].display = "Link Measurement: "+Number(measurementValue[1].trim())+"ms."
                                    this.linkMeasurements.push(measurementValue[1].trim())

                                    
                                }
                            }
                           
                            this.pevStrings[i].found = true
                            nowFound = true
                            if(i === 13 && this.state.checked === true)// IPv6 Message
                            {
                                setTimeout(()=>{this.pevSendStopCommand()},15000);
                            }else if(i === 0 && this.state.checked === true)// IPv6 Message
                            {
                                setTimeout(()=>{this.pevSendStartCommand()},5000);
                            }
                            break;
                        }
                    }

                    if(nowFound === true){
                        console.warn("OKKKKKKKK")

                        this.setState({  
                            printOutCom : this.printOutCom,
                            toggleToRefresh : !this.state.toggleToRefresh,
                            role : this.role  ,
                            checked : this.state.checked  
                        })
                    }
            }
        }
        

                       
    }



    ProcessRawData(){
        let commandArray = this.rawData.split('*')
        if(commandArray.length>1){
            commandArray.forEach(item=>{
                console.log("item : "+item)
                this.ProcessSplittedCommand(item)
            })
            this.rawData = commandArray[commandArray.length-1]
            console.log("this.rawData : "+this.rawData)
        }
        
    }

    ReadValues(){
        this.portReader.read().then(res=>{
            console.log("VALUE ",res.value)
            this.rawData += new TextDecoder("utf-8").decode(res.value)
            console.log("rawData ",this.rawData)
            
            setTimeout(this.ProcessRawData(),0);
            this.ReadValues();
        });
    }

    
    async OpenReadComPort(){
        console.log("OpenReadComPort | begin")

        console.log("Port..",this.props.port)
        const p_Port = this.props.port

        await p_Port.port.open({ baudRate: 115200});
        this.portReader = p_Port.port.readable.getReader();

        this.portWriter = p_Port.port.writable.getWriter();
        

        setTimeout(()=>{
            this.ReadValues()
        },0)

        const data = new Uint8Array([114]); // r
        this.portWriter.write(data).then(res=>{
        });
        console.log("ask role")
        
       
        console.log("OpenReadComPort | end")
    }


    constructor(props){
        super(props)
        
        
        this.theme = responsiveFontSizes(createMuiTheme(
            {typography: {
                h1: {
                    fontSize: 200,
                },
                h2: {
                    fontSize: 15,
                },
            },}
        ));
        this.portReader = {}
        this.portWriter = {}
        this.rawData = ""
        this.role = ""
        this.state = {
            printOutCom : "",
            toggleToRefresh : false,
            role : "PEV",
            checked : false
          };

        this.queryInterval = {}
        this.initializePEVStrings()
        this.pevSendStartCommand = this.pevSendStartCommand.bind(this)
        this.pevSendStopCommand = this.pevSendStopCommand.bind(this)
        this.handleContToggleSwitch = this.handleContToggleSwitch.bind(this)
        this.showDetailedProgress = this.showDetailedProgress.bind(this)
        this.showLinkPanel = this.showLinkPanel.bind(this)
        this.linkMeasurements = []


    }

  
    showDetailedProgress(){
        if(this.pevStrings != null && this.pevStrings.length > 0)
        {
            
            return this.pevStrings.map((value,index)=>{
                if(value.found)
                {
                    if(value.warning === false){
                        return(
                            <p key={"detailed_"+index}>
                                {value.display}.......................................OK
                            </p>
                        );
                    }
                    else{
                        return(
                            <p key={"detailed_"+index} style={{color:'#c20b0b',
                                                               textShadow: '0 0 0.4em #c20b0b'
                                                               }} id='warningTextFeature'>
                                {value.display}
                            </p>
                        );
                    }
                }
            })
              
        }
        else{
            return null;
        }
    }
    showLinkPanel(){
        console.log("Show Link Panel",this.linkMeasurements.length)
        if(this.linkMeasurements != null && this.linkMeasurements.length > 0)
        { 
            return(
                <div >
                <div className="ui panel">
                    <div className="ui panel content">
                    {
                        this.linkMeasurements.map((value,index)=>{
                            return(
                                <>
                                <strong key={index}>Link Time</strong> {value} ms.<br /> 
                                </>
                            );
                        })
                    }       
                    </div>
                </div>
                </div>
            );
        }
        else{
            return null;
        }
    }


    render(){
        return (
            <div>
                <h1 className="cs">FoE-Charger</h1>
                    <div className="circle cir"><p className="c">F</p>
                    <div className="circle one"></div>
                    <div className="circle two">
                        <div className="circle three">
                    </div>
                    </div>
                    </div>

                    <div className="wrapper">
                    <div className="bar left"></div>
                    <div className="bar top"></div>
                    <div className="bar right"></div>
                    <div className="bar bottom"></div>
                    <br/><br/><br/>
                    
                    <div className="button">
                        <span className="button__text" onClick={this.pevSendStartCommand}>Start</span>
                    </div>
                    <div className="button">
                        <span className="button__text" onClick={this.pevSendStopCommand}>Stop</span>
                    </div>
                    <Grid container>
                    <Grid item xs={6}>
                        {this.showDetailedProgress()}
                    </Grid>
                    <Grid item xs={6}>
                    {this.showLinkPanel()}
                    </Grid>
                    </Grid>                
                    
                    </div>
            </div>
            );
    }

/*
<ol className="timeline">
                        <li>list item</li>
                        <li>list item</li>
                    </ol>
*/

}
export default DeviceState