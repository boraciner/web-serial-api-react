import React,{Component} from 'react'
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import './DeviceState.css'
import Tooltip from '@material-ui/core/Tooltip';


class DeviceState extends Component{
    pevSendStartCommand(){
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
    preparePEVRelatedButtons(){
        return(
          <Grid container 
            direction="row"
            justify="center"
            alignItems="center"
            
           
            >
            
            <Grid item xs={3}>
                <ButtonGroup  variant="contained" color="primary" aria-label="contained primary button group">
                <Button color="primary"  onClick={this.pevSendStartCommand}  >Start</Button>
                <Button color="secondary"  onClick={this.pevSendStopCommand} >Stop</Button>
                </ButtonGroup>
            </Grid>
            <Grid item xs={6}>
                <FormControlLabel style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                control={<Switch name="checkedA" onClick={() => {  this.setState({checked: !this.state.checked,
                                                                                        printOutCom : this.printOutCom,
                                                                                        toggleToRefresh : this.toggleToRefresh,
                                                                                        role : this.role  
                                                                                        }) }}
                checked={this.state.checked ? true : false}/>
            }
                label="Continuous Test"
                />
            </Grid>
          </Grid>
        ) 
      }
      


    

    initializePEVStrings(){
        this.pevStrings = [
            {details : "PIB image reading completed OK",display : "PIB image reading completed OK",found : false,},
            {details : "CM_SLAC_PARAM.REQ sent",display : "CM_SLAC_PARAM.REQ sent",found : false},
            {details : "CM_SLAC_PARAM.CNF received",display : "CM_SLAC_PARAM.CNF received",found : false},
            {details : "CM_START_ATTEN_CHAR.IND sent",display : "CM_START_ATTEN_CHAR.IND sent",found : false},
            {details : "CM_MNBC_SOUND.IND sent",display : "CM_MNBC_SOUND.IND sent",found : false},
            {details : "CM_ATTEN_CHAR.IND received",display : "CM_ATTEN_CHAR.IND received",found : false},
            {details : "CM_ATTEN_CHAR.RSP sent",display : "CM_ATTEN_CHAR.RSP sent",found : false},
            {details : "CM_VALIDATE.REQ sent",display : "CM_VALIDATE.REQ sent",found : false},
            {details : "CM_VALIDATE.CNF received. -Charger Ready-",display : "CM_VALIDATE.CNF received. -Charger Ready-",found : false},	
            {details : "CM_VALIDATE.CNF received. -Charger Success-",display : "CM_VALIDATE.CNF received. -Charger Success-",found : false},	
            {details : "CM_SET_KEY.CNF received",display : "CM_SET_KEY.CNF received",found : false},	
            {details : "New keys set",display : "New keys set",found : false},	
            {details : "Link Measurement:",display : "Link Measurement:",found : false},	
            {details : "Sending IPv6.",display : "Sending IPv6.",found : false},	
            {details : "IPv6 Message is received",display : "IPv6 Message is received",found : false},	

            

        ]
    }

    preparePEVTimeLine(){
        console.log("this.pevStrings.length ",this.pevStrings.length)
        return(
            
            <div ref={this.wrapper}>
                <ol className="timeline">
                {
                    this.pevStrings.map((value,key)=>(
                        <Tooltip title={value.display} key={key} ref={this.wrapper}>
                            <li style={{
                                color:'blue',
                                
                                }}></li>               
                        </Tooltip>   
                     ))
                   
                }
                </ol>
            </div>

            
            
            
            )
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
                            if(sCommand.includes(this.pevStrings[23].details))//Link Measurement
                            {
                                let measurementValue = sCommand.split(':')
                                if(measurementValue.length>1){
                                    this.pevStrings[12].display = "Link Measurement: "+Number(measurementValue[1].trim())+"ms."
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
                            toggleToRefresh : true,
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
        this.linkMeasurements = []
    }

    /*
    render(){
        return (
            <div>

                <div>
                    {this.state.role === "PEV" ? this.preparePEVRelatedButtons() : null }
                </div>
                {
                    this.state.role === "PEV" ?
                    this.preparePEVTimeLine() : null  
                }
                
                <h3>{this.state.printOutCom}</h3>
            </div>
            );
    }*/
    render(){
        return (
            <div>
                <h1 class="cs">FoE-Charger Test Interface</h1>
                    <div class="circle cir"><p class="c">F</p>
                    <div class="circle one"></div>
                    <div class="circle two">
                        <div class="circle three">
                    </div>
                    </div>
                    </div>

                    <div class="wrapper">
                    <div class="bar left"></div>
                    <div class="bar top"></div>
                    <div class="bar right"></div>
                    <div class="bar bottom"></div>
                    <br/><br/><br/>
                    <div class="button">
                        <span class="button__text">Start</span>
                    </div>
                    <div class="button">
                        <span class="button__text">Stop</span>
                    </div>
                    <p>
                        Bora Ciner.....................................................................................OK
                    </p>
                    
                    <ol className="timeline">
                        <li>list item</li>
                        <li>list item</li>
                    </ol>
                    <div style={{width:'400px',
                                 height:'80px'}}>
                    <div class="ui panel">
                        <div class="ui panel content">
                        <strong>Test</strong><br /> Testing testing testing...
                        </div>
                    </div>
                    </div>
                    </div>
               
            </div>
            );
    }



}
export default DeviceState