import React,{Component} from 'react'
import { createMuiTheme, responsiveFontSizes} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import './ChademoPage.css'


class ChademoPage extends Component{

    
    pevSendStartCommand(){
        this.initializePEVStrings()
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
            continuousTest : this.state.continuousTest,
            pevProtocol : this.state.pevProtocol,
            pevDeviceState : this.state.pevDeviceState,
            pevHpgState : this.state.pevHpgState,
            evseProtocol : this.state.evseProtocol,
            evseDeviceState : this.state.evseDeviceState,
            evseHpgState : this.state.evseHpgState,
            timeoutFound : this.state.timeoutFound
        })
    }
    handleContToggleSwitch(event){

    }

    
    initializePEVStrings(){
        this.pevStrings = [
            {details : "Event | Detected | t0",display : "EVSE | Detected | t0",found : false,warning : "false"},
            {details : "Event | Set | t1",display : "EVSE | Set | t1",found : false,warning : "false"},
            {details : "Event | Detected | t1",display : "PEV | Detected | t1",found : false,warning : "false"},
            {details : "Event | Set | t2",display : "PEV | Set | t2",found : false,warning : "false"},
            {details : "Event | Detected | t2",display : " EVSE | Detected | t2",found : false,warning : "false"},
            {details : "Event | Set | t3",display : "EVSE | Set | t3",found : false,warning : "false"},
            {details : "Event | Detected | t3",display : "PEV | Detected | t3",found : false,warning : "false"},
            {details : "Event | Message Exchange | Sending",display : "CAN Message | Sending",found : false,warning : "false"},
            {details : "Event | Message Exchange | Received",display : "CAN Message | Received",found : false,warning : "false"},
            {details : "Event | Set | t4",display : "PEV | Set | t4",found : false,warning : "false"},	
            {details : "Event | Detected | t4",display : "EVSE | Detected | t4",found : false,warning : "false"},	
            {details : "Event | Set | t5",display : "EVSE | Set | t5",found : false,warning : "false"},	
            {details : "Event | Set | t6",display : "EVSE | Set | t6",found : false,warning : "false"},	
            {details : "Event | Set | t7",display : "EVSE | Set | t7",found : false,warning : "false"},
            {details : "Event | Set | t7",display : "EVSE | Set | t7",found : false,warning : "false"},
            {details : "wrong protocol for pev",display : "Wrong protocol is detected on PEV side",found : false,warning : "red"},	
            {details : "wrong protocol for evse",display : "Wrong protocol is detected on EVSE side",found : false,warning : "red"},	
        ]
        
        
    }


    setTimedoutStartCommand(timerValue){
        var timeoutStartCounter = timerValue
        console.log("setTimedoutStartCommand | begin")
        this.timeoutStartInterval = setInterval(() => {
            if(timeoutStartCounter-- > 1){
                this.pevStrings[14].display = "Reconnecting in "+timeoutStartCounter+" sec(s)."  
                this.pevStrings[14].found = true 
                this.pevStrings[14].warning = "green" 
                console.log("setTimedoutStartCommand | set text to ",this.pevStrings[12].display)
                this.setState({  
                    printOutCom : this.printOutCom,
                    toggleToRefresh : !this.state.toggleToRefresh,
                    role : this.state.role  ,
                    percentage : this.state.percentage,
                    started : true,
                    continuousTest : this.state.continuousTest,
                    pevProtocol : this.state.pevProtocol,
                    pevDeviceState : this.state.pevDeviceState,
                    pevHpgState : this.state.pevHpgState,
                    evseProtocol : this.state.evseProtocol,
                    evseDeviceState : this.state.evseDeviceState,
                    evseHpgState : this.state.evseHpgState,
                    timeoutFound : this.state.timeoutFound
                })
            }
            else{
                this.pevStrings[14].found = false
                console.log("setTimedoutStartCommand | SEND start")
                this.pevSendStartCommand();
                this.setState({  
                    printOutCom : this.printOutCom,
                    toggleToRefresh : !this.state.toggleToRefresh,
                    role : this.state.role  ,
                    percentage : this.state.percentage,
                    started : true,
                    continuousTest : this.state.continuousTest,
                    pevProtocol : this.state.pevProtocol,
                    pevDeviceState : this.state.pevDeviceState,
                    pevHpgState : this.state.pevHpgState,
                    evseProtocol : this.state.evseProtocol,
                    evseDeviceState : this.state.evseDeviceState,
                    evseHpgState : this.state.evseHpgState,
                    timeoutFound : this.state.timeoutFound
                })
                clearInterval( this.timeoutStartInterval );
            }
        }, 1000);
    }


    ExtractDeviceStatus(text){
        let ds = text.substring(text.indexOf("Device State :")+15)
        ds = parseInt(ds, 10);

        return {deviceState : ds}
    }    
  
  
    componentDidMount(){
        this.OpenReadComPort();
    }

    ProcessSplittedCommand(sCommand){
        
        let nowFound = false;

        if(sCommand.length > 5){
            console.log("ProcessSplittedCommand " ,sCommand)
            if(sCommand.includes("PEER-Protocol:") && sCommand.includes("Device State"))
            {
                    console.log("2ProcessSplittedCommand")
                    let foundProtocol =""
                    if(!sCommand.includes("Chademo")){
                        this.pevStrings[16].found = true
                        console.log("3ProcessSplittedCommand")
                    }else{
                        foundProtocol = "Chademo"
                        this.pevStrings[16].found = false
                        console.log("4ProcessSplittedCommand")
                    }

                    let retObj = this.ExtractDeviceStatus(sCommand)
                    if (isNaN(retObj.deviceState))
                    {
                        retObj.deviceState = this.state.evseDeviceState
                    }

                  

                    this.setState({  
                        printOutCom : this.printOutCom,
                        toggleToRefresh : !this.state.toggleToRefresh,
                        role : this.state.role  ,
                        percentage : this.state.percentage,
                        started : this.state.started,
                        continuousTest : this.state.continuousTest,
                        pevProtocol : this.state.pevProtocol,
                        pevDeviceState : this.state.pevDeviceState,
                        pevHpgState : this.state.pevHpgState,
                        evseProtocol : foundProtocol,
                        evseDeviceState : retObj.deviceState,
                        evseHpgState : this.state.hpgState,
                        timeoutFound : this.state.timeoutFound
                    })
            }else{
                if(sCommand.includes("Protocol") && sCommand.includes("Device State")){
                    let foundProtocol =""
                    if(!sCommand.includes("Chademo")){
                        this.pevStrings[15].found = true
                    }else{
                        foundProtocol = "Chademo"
                        this.pevStrings[15].found = false
                    }

                    let retObj = this.ExtractDeviceStatus(sCommand)
                    console.log("EXTRACTED PEV DEVICE STATE ",retObj.deviceState)
                    if (isNaN(retObj.deviceState))
                    {
                        retObj.deviceState = this.state.pevDeviceState
                    }


                    this.setState({  
                        printOutCom : this.printOutCom,
                        toggleToRefresh : !this.state.toggleToRefresh,
                        role : this.state.role  ,
                        percentage : this.state.percentage,
                        started : this.state.started,
                        continuousTest : this.state.continuousTest,
                        pevProtocol : foundProtocol,
                        pevDeviceState : retObj.deviceState,
                        pevHpgState : this.state.hpgState,
                        evseProtocol : this.state.evseProtocol,
                        evseDeviceState : this.state.evseDeviceState,
                        evseHpgState : this.state.evseHpgState,
                        timeoutFound : this.state.timeoutFound
                    })
                }
            for(let i=0;i<this.pevStrings.length;i++){
                if(sCommand.includes(this.pevStrings[i].details) && this.pevStrings[i].found === false){
                    this.pevStrings[i].found = true
                    nowFound = true
                    if(i === 13)//Event | Set | t7
                    {
                        if(this.state.continuousTest === true)
                        {
                            this.setTimedoutStartCommand(5)
                        }
                    }
                    break;
                }
            }

            if(nowFound === true){
                console.warn("OKKKKKKKK")
                let percCalc = this.state.percentage + ((1 / 14) * 100)
                if(percCalc >= 90)
                    percCalc = 100;
                
                percCalc = Math.round(percCalc)

                this.setState({  
                    printOutCom : this.printOutCom,
                    toggleToRefresh : !this.state.toggleToRefresh,
                    role : this.role  ,
                    percentage : percCalc,
                    started : true,
                    continuousTest : this.state.continuousTest,
                    pevProtocol : this.state.pevProtocol,
                    pevDeviceState : this.state.pevDeviceState,
                    pevHpgState : this.state.pevHpgState,
                    evseProtocol : this.state.evseProtocol,
                    evseDeviceState : this.state.evseDeviceState,
                    evseHpgState : this.state.evseHpgState,
                    timeoutFound : this.state.timeoutFound
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
        this.gatheringInformationInterval = setInterval(() => { 
            const data = new Uint8Array([114]); // r
            this.portWriter.write(data).then(res=>{
                //console.log("Send Information Command ",res)
            });
         },2000);
        
        
       
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
            continuousTest : false,
            pevProtocol : "",
            pevDeviceState : -1,
            pevHpgState : -1,
            evseProtocol : "",
            evseDeviceState : -1,
            evseHpgState : -1,
            timeoutFound : false
          };

        this.queryInterval = {}
        this.initializePEVStrings()
        this.pevSendStartCommand = this.pevSendStartCommand.bind(this)
        this.handleContToggleSwitch = this.handleContToggleSwitch.bind(this)
        this.showDetailedProgress = this.showDetailedProgress.bind(this)
        this.showLinkPanel = this.showLinkPanel.bind(this)
        this.setContinuosState = this.setContinuosState.bind(this)
        this.resetLinkMeasurementsList = this.resetLinkMeasurementsList.bind(this)
        this.linkMeasurements = []
        
        this.timeoutStartInterval = {}
        
        this.gatheringInformationInterval = {}
    }

    resetLinkMeasurementsList(){
        this.linkMeasurements = []
        this.setState({  
            printOutCom : this.printOutCom,
            toggleToRefresh : !this.state.toggleToRefresh,
            role : this.state.role  ,
            percentage : this.state.percentage,
            started : this.state.started,
            continuousTest : this.state.continuousTest,
            pevProtocol : this.state.pevProtocol,
            pevDeviceState : this.state.pevDeviceState,
            pevHpgState : this.state.pevHpgState,
            evseProtocol : this.state.evseProtocol,
            evseDeviceState : this.state.evseDeviceState,
            evseHpgState : this.state.evseHpgState,
            timeoutFound : this.state.timeoutFound
        })
    }
  
    showDetailedProgress(){
        if(this.pevStrings != null && this.pevStrings.length > 0)
        {
            
            return this.pevStrings.map((value,index)=>{
                if(value.found)
                {
                    if(value.warning === "false"){
                        return(
                            <p key={"detailed_"+index}>
                                {value.display}{index<15 ? "................OK" : ""}
                            </p>
                        );
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
            continuousTest : !this.state.continuousTest,
            pevProtocol : this.state.pevProtocol,
            pevDeviceState : this.state.pevDeviceState,
            pevHpgState : this.state.pevHpgState,
            evseProtocol : this.state.evseProtocol,
            evseDeviceState : this.state.evseDeviceState,
            evseHpgState : this.state.evseHpgState,
            timeoutFound : this.state.timeoutFound
        })
    }

    render(){
        if(this.state.pevProtocol === "Chademo" && this.state.evseProtocol === "Chademo"){
            console.log("DeviceState | PEV ",this.state.pevDeviceState," EVSE ",this.state.evseDeviceState)
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
                        <Grid item xs={4}>
                        {(this.state.pevDeviceState === 0 && this.state.evseDeviceState === 0) ?<div className='Action_button_1' onClick={this.pevSendStartCommand}/> : null }
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
        }else{
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
                        <br/><br/><br/>
                        <Grid container>
                        <Grid item xs={6}>
                            {this.showDetailedProgress()}
                        </Grid>
                        </Grid>                
                        </div>
                </div>
                );
        }
    }

/*
<ol className="timeline">
                        <li>list item</li>
                        <li>list item</li>
                    </ol>
*/

}
export default ChademoPage