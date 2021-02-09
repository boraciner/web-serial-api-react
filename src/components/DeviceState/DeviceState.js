import React,{Component} from 'react'
import { createMuiTheme, responsiveFontSizes} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import './DeviceState.css'


class DeviceState extends Component{

    
    pevSendStartCommand(){
        console.log("Send Start Command")
        const data = new Uint8Array([32]); // space
            this.portWriter.write(data).then(res=>{
                console.error("Write ' ' for start... ")
            });
        this.setState({  printOutCom : this.printOutCom,
            toggleToRefresh : this.toggleToRefresh,
            role : this.state.role  ,
            percentage : 0,
            started : true,
            continuousTest : this.state.continuousTest
        })
    }
    handleContToggleSwitch(event){

    }

    pevSendStopCommand(){
        const data = new Uint8Array([100]); // d
        
        this.portWriter.write(data).then(res=>{
            console.error("Write 'd' for disconnect... ")
        });
        this.rawData = ""
        clearInterval( this.timeoutStartInterval );
        clearInterval( this.timeoutStopInterval );

        this.initializePEVStrings();
        this.setState({  
            printOutCom : this.printOutCom,
            toggleToRefresh : true,
            role : this.role,
            percentage : 0,
            started : false,
            continuousTest : this.state.continuousTest
        })
    }
    initializePEVStrings(){
        this.pevStrings = [
            {details : "CM_SLAC_PARAM.REQ sent",display : "CM_SLAC_PARAM.REQ sent",found : false,warning : "false"},
            {details : "CM_SLAC_PARAM.CNF received",display : "CM_SLAC_PARAM.CNF received",found : false,warning : "false"},
            {details : "CM_START_ATTEN_CHAR.IND sent",display : "CM_START_ATTEN_CHAR.IND sent",found : false,warning : "false"},
            {details : "CM_MNBC_SOUND.IND sent",display : "CM_MNBC_SOUND.IND sent",found : false,warning : "false"},
            {details : "CM_ATTEN_CHAR.IND received",display : "CM_ATTEN_CHAR.IND received",found : false,warning : "false"},
            {details : "CM_ATTEN_CHAR.RSP sent",display : "CM_ATTEN_CHAR.RSP sent",found : false,warning : "false"},
            {details : "CM_SLAC_MATCH.REQ sent",display : "CM_SLAC_MATCH.REQ sent",found : false,warning : "false"},
            {details : "CM_SLAC_MATCH.CNF received",display : "CM_SLAC_MATCH.CNF received",found : false,warning : "false"},	
            {details : "Link Measurement:",display : "Link Measurement:",found : false,warning : "false"},	
            {details : "Sending IPv6.",display : "Sending IPv6.",found : false,warning : "false"},	
            {details : "IPv6 Message is received",display : "IPv6 Message is received",found : false,warning : "false"},	
            {details : "TIMEOUT",display : "Timeout Occured",found : false,warning : "red"},	
            {details : "TIMEOUT FOR CONNECT",display : "Timeout To Reconnect",found : false,warning : "red"},	
            {details : "Waiting for EVSE to be ready!",display : "Waiting for EVSE to be ready!",found : false,warning : "false"},
        ]
        
        
    }


    setTimedoutStartCommand(timerValue){
        var timeoutStartCounter = timerValue
        console.log("setTimedoutStartCommand | begin")
        this.timeoutStartInterval = setInterval(() => {
            if(timeoutStartCounter-- > 1){
                this.pevStrings[12].display = "Reconnecting in "+timeoutStartCounter+" sec(s)."  
                this.pevStrings[12].found = true 
                this.pevStrings[12].warning = "green" 
                console.log("setTimedoutStartCommand | set text to ",this.pevStrings[12].display)
                this.setState({  
                    printOutCom : this.printOutCom,
                    toggleToRefresh : !this.state.toggleToRefresh,
                    role : this.state.role  ,
                    percentage : this.state.percentage,
                    started : true,
                    continuousTest : this.state.continuousTest
                })
            }
            else{
                this.pevStrings[12].found = false
                console.log("setTimedoutStartCommand | SEND start")
                this.pevSendStartCommand();
                this.setState({  
                    printOutCom : this.printOutCom,
                    toggleToRefresh : !this.state.toggleToRefresh,
                    role : this.state.role  ,
                    percentage : this.state.percentage,
                    started : true,
                    continuousTest : this.state.continuousTest
                })
                clearInterval( this.timeoutStartInterval );
            }
        }, 1000);
    }


    setTimedoutStopCommand(timerValue){
        var timeoutStopCounter = timerValue
        this.timeoutStopInterval = setInterval(() => {
            if(timeoutStopCounter-- > 0){
                this.pevStrings[11].display = "Disconnecting in "+timeoutStopCounter+" sec(s)."
                this.pevStrings[11].found = true
                this.pevStrings[11].warning = "green"
                console.log("setInterval | set text to ",this.pevStrings[11].display)
                this.setState({  
                    printOutCom : this.printOutCom,
                    toggleToRefresh : !this.state.toggleToRefresh,
                    role : this.state.role  ,
                    percentage : this.state.percentage,
                    started : true,
                    continuousTest : this.state.continuousTest
                })
            }
            else{
                console.log("setInterval | SEND Stop")
                this.pevSendStopCommand();
                this.pevStrings[11].found = false
                //this.setTimedoutStartCommand(25);
                this.pevStrings[13].found = true
                this.setState({  
                    printOutCom : this.printOutCom,
                    toggleToRefresh : !this.state.toggleToRefresh,
                    role : this.state.role  ,
                    percentage : this.state.percentage,
                    started : this.state.started,
                    continuousTest : this.state.continuousTest
                })
                clearInterval( this.timeoutStopInterval );
            }
        }, 1000);
    }
  
  
    componentDidMount(){
        this.OpenReadComPort();
    }

    ProcessSplittedCommand(sCommand){
        console.log("ProcessSplittedCommand " ,sCommand)
        let nowFound = false;

        if(sCommand.length > 5){
            if(sCommand.includes("PEER") && sCommand.includes("LOG - SLAC - CM_SET_KEY.CNF set."))
            {
                if(this.state.continuousTest === true)
                {
                    this.setTimedoutStartCommand(15)
                    this.pevStrings[13].found = false
                    nowFound = true
                }
            }else{
                    
                    for(let i=0;i<this.pevStrings.length;i++){
                        if(sCommand.includes(this.pevStrings[i].details) && this.pevStrings[i].found === false){
                            this.pevStrings[i].found = true
                            nowFound = true
                            //console.log("ProcessSplittedCommand sCommand i=", i)
                            if(i === 8)//Link Measurement
                            {
                                let measurementValue = sCommand.split(':')
                                if(measurementValue.length>1){
                                    this.pevStrings[8].display = "Link Measurement: "+Number(measurementValue[1].trim())+"ms."
                                    this.linkMeasurements.push(measurementValue[1].trim())
                                }
                            }
                            else if(i === 10 && this.state.continuousTest === true)// IPv6 Message is received
                            {
                                //setTimeout(()=>{this.pevSendStopCommand()},15000);
                                this.setTimedoutStopCommand(10);
                            }else if(i === 11)// TIMEOUT
                            {
                                console.warn("ProcessSplittedCommand  | this.linkMeasurements.push(Timeout) ")
                                this.linkMeasurements.push("Timeout")
                                if(this.state.continuousTest === true)
                                {
                                    this.setTimedoutStopCommand(20);
                                }
                            }
                            break;
                        }
                    }

                    if(nowFound === true){
                        console.warn("OKKKKKKKK")
                        let percCalc = this.state.percentage + ((1 / (this.pevStrings.length-3)) * 100)
                        if(percCalc >= 90)
                            percCalc = 100;
                        
                        percCalc = Math.round(percCalc)

                        this.setState({  
                            printOutCom : this.printOutCom,
                            toggleToRefresh : !this.state.toggleToRefresh,
                            role : this.role  ,
                            percentage : percCalc,
                            started : true,
                            continuousTest : this.state.continuousTest
                        })
                    }
            }
        }
        

                       
    }



    ProcessRawData(){
        let commandArray = this.rawData.split('*')
        if(commandArray.length>1){
            commandArray.forEach(item=>{
                this.ProcessSplittedCommand(item)
            })
            this.rawData = commandArray[commandArray.length-1]
        }
        
    }

    ReadValues(){
        this.portReader.read().then(res=>{
            this.rawData += new TextDecoder("utf-8").decode(res.value);
            return this.rawData;
            // setTimeout(this.ProcessRawData(),0);
            // this.ReadValues();
        }).then(val=>{
            this.ProcessRawData()
            this.ReadValues()
        });
    }

    
    async OpenReadComPort(){
        console.log("OpenReadComPort | begin")

        console.log("Port..",this.props.port)
        const p_Port = this.props.port
        try{
            await p_Port.port.open({ baudRate: 115200});
        }catch(e){
            p_Port.port.close();
            await p_Port.port.open({ baudRate: 115200});
        }
         
        this.portReader = p_Port.port.readable.getReader();

        this.portWriter = p_Port.port.writable.getWriter();
        

        setTimeout(()=>{
            this.ReadValues()
        },0)

        
        
       
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
            checked : false,  
            percentage : 0,
            started : false,
            continuousTest : false
          };

        this.queryInterval = {}
        this.initializePEVStrings()
        this.pevSendStartCommand = this.pevSendStartCommand.bind(this)
        this.pevSendStopCommand = this.pevSendStopCommand.bind(this)
        this.handleContToggleSwitch = this.handleContToggleSwitch.bind(this)
        this.showDetailedProgress = this.showDetailedProgress.bind(this)
        this.showLinkPanel = this.showLinkPanel.bind(this)
        this.setContinuosState = this.setContinuosState.bind(this)
        this.resetLinkMeasurementsList = this.resetLinkMeasurementsList.bind(this)
        this.linkMeasurements = []
        
        this.timeoutStartInterval = {}
        this.timeoutStopInterval = {}
        

    }

    resetLinkMeasurementsList(){
        this.linkMeasurements = []
        this.setState({  
            printOutCom : this.printOutCom,
            toggleToRefresh : !this.state.toggleToRefresh,
            role : this.state.role  ,
            percentage : this.state.percentage,
            started : this.state.started,
            continuousTest : this.state.continuousTest
        })
    }
  
    showDetailedProgress(){
        if(this.pevStrings != null && this.pevStrings.length > 0)
        {
            
            return this.pevStrings.map((value,index)=>{
                if(value.found)
                {
                    if(value.warning === "false"){
                        if(index === 13){
                            return(
                                <p key={"detailed_"+index}>
                                    {value.display}
                                </p>
                            );
                        }else{
                            return(
                                <p key={"detailed_"+index}>
                                    {value.display}{index<15 ? ".......................................OK" : ""}
                                </p>
                            );
                        }
                            
                    }
                    else if(value.warning === "green"){
                        return(
                            <p key={"detailed_"+index} style={{color:'#00cc00',
                                                               textShadow: '0 0 0.4em #00cc00'
                                                               }} id='greenTextFeature'>
                                {value.display}
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
                }else{
                    return null;
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
                <div  id='linkpanelid1'>
                <div className="ui panel">
                    <div className="ui panel content">
                    {
                        this.linkMeasurements.map((value,index)=>{
                            if(value === "Timeout")
                            {
                                return(
                                    <div key={'mydivkey'+index}>
                                    <strong key={'mykey'+index} style={{color:'#c20b0b',
                                                               textShadow: '0 0 0.4em #c20b0b'
                                                               }} >{value}</strong><br /> 
                                    </div>
                                );
                            }
                            else{
                                return(
                                    <div key={'mydivkey'+index}>
                                    <strong key={'mykey'+index}>Link Time</strong> {value} ms.<br /> 
                                    </div>
                                );
                            }
                            
                        })
                    }    
                    <div style = {{ textAlign:'right' , justifyContent: 'right' , float: 'right' , height: '50px', width: '50px' }}> <div  className='linkMeasurementsReset ' onClick={this.resetLinkMeasurementsList} /> </div>
                    </div>
                </div>
                </div>
            );
        }
        else{
            return null;
        }
    }

    setContinuosState(){
        this.setState({  printOutCom : this.printOutCom,
            toggleToRefresh : this.state.toggleToRefresh,
            role : this.state.role  ,
            percentage : this.state.percentage,
            started : this.state.started,
            continuousTest : !this.state.continuousTest
        })
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
                    <br/>
                    <Grid container>
                    <Grid item xs={2}>
                    </Grid>
                    <Grid item xs={2}>
                    <div className='Action_button_1' onClick={this.pevSendStartCommand}/>
                    </Grid>
                    <Grid item xs={2}>
                    <div className='Action_button_2' onClick={this.pevSendStopCommand}/>
                    </Grid>
                    <Grid item xs={2} >
                        <div style={{marginTop: '20px'}}>
                            <span className='continuousText'>Continuous Test</span>
                            {
                                this.state.continuousTest ? 
                                    <div style={{marginLeft: '30px'}} className='continuousSelectionSelected' onClick={this.setContinuosState} />: 
                                    <div style={{marginLeft: '30px'}} className='continuousSelectionUnselected' onClick={this.setContinuosState} /> 
                            }
                            
                        </div>
                    </Grid>
                    <Grid item xs={2}>
                    </Grid>
                    <Grid item xs={2} >
                        <div className='parentWheel'>
                            <div className='Outer_wheel'/>
                            <div className='Wheel_Base'/>
                            {this.state.started ? <div className='Ineer_wheel Ineer_wheel_Animation'/> : <div className='Ineer_wheel'/>}
                            <div className='Percentage_wheel'><span id='percentage'>{this.state.percentage}</span>%</div>
                        </div>
                    
                    </Grid>
                    </Grid>
                    
                    
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