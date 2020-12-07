import React,{Component} from 'react'
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import EvStationIcon from '@material-ui/icons/EvStation';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';





class DeviceState extends Component{
    pevSendStartCommand(){
        const data = new Uint8Array([32]); // space
            this.portWriter.write(data).then(res=>{
            });
    }
    
    pevSendStopCommand(){
        const data = new Uint8Array([100]); // d
        this.portWriter.write(data).then(res=>{
        });

        this.initializePEVStrings();
        this.setState({  
            printOutCom : this.printOutCom,
            toggleToRefresh : true,
            role : this.role  
        })
    }
    preparePEVRelatedButtons(){
        return(
          <Grid container 
            direction="row"
            justify="center"
            alignItems="center">
            <Grid item xs={6}>
                <ButtonGroup  style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Button color="primary"  onClick={this.pevSendStartCommand} aria-label="outlined primary button group">Start</Button>
                <Button color="secondary"  onClick={this.pevSendStopCommand} aria-label="outlined secondary button group">Stop</Button>
                </ButtonGroup>
            </Grid>
            <Grid item xs={6}>
                <FormControlLabel style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                control={<Switch name="checkedA" />}
                label="Auto Run"
                />
            </Grid>
          </Grid>
        ) 
      }

    prepareTimeLineItem(content,isSecondary = false,myKey){
        return(
            <TimelineItem key={myKey}> 
                <TimelineSeparator>
                <TimelineDot color={isSecondary ? "secondary" : "primary"} />
                <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>{content}</TimelineContent>
            </TimelineItem>
        )
    }

    

    initializePEVStrings(){
        this.pevStrings = [
            {details : "PIB image reading completed OK",display : "PIB image reading completed OK",found : false,},
            {details : "CM_SLAC_PARAM.REQ sent",display : "CM_SLAC_PARAM.REQ sent",found : false},
            {details : "CM_SLAC_PARAM.CNF received",display : "CM_SLAC_PARAM.CNF received",found : false},
            {details : "CM_START_ATTEN_CHAR.IND sent",display : "CM_START_ATTEN_CHAR.IND sent",found : false},
            {details : "CM_START_ATTEN_CHAR.IND sent",display : "CM_START_ATTEN_CHAR.IND sent",found : false},
            {details : "CM_START_ATTEN_CHAR.IND sent",display : "CM_START_ATTEN_CHAR.IND sent",found : false},
            {details : "CM_MNBC_SOUND.IND sent",display : "CM_MNBC_SOUND.IND sent",found : false},
            {details : "CM_MNBC_SOUND.IND sent",display : "CM_MNBC_SOUND.IND sent",found : false},
            {details : "CM_MNBC_SOUND.IND sent",display : "CM_MNBC_SOUND.IND sent",found : false},
            {details : "CM_MNBC_SOUND.IND sent",display : "CM_MNBC_SOUND.IND sent",found : false},
            {details : "CM_MNBC_SOUND.IND sent",display : "CM_MNBC_SOUND.IND sent",found : false},
            {details : "CM_MNBC_SOUND.IND sent",display : "CM_MNBC_SOUND.IND sent",found : false},
            {details : "CM_MNBC_SOUND.IND sent",display : "CM_MNBC_SOUND.IND sent",found : false},
            {details : "CM_MNBC_SOUND.IND sent",display : "CM_MNBC_SOUND.IND sent",found : false},
            {details : "CM_MNBC_SOUND.IND sent",display : "CM_MNBC_SOUND.IND sent",found : false},
            {details : "CM_MNBC_SOUND.IND sent",display : "CM_MNBC_SOUND.IND sent",found : false},
            {details : "CM_ATTEN_CHAR.IND received",display : "CM_ATTEN_CHAR.IND received",found : false},
            {details : "CM_ATTEN_CHAR.RSP sent",display : "CM_ATTEN_CHAR.RSP sent",found : false},
            {details : "CM_VALIDATE.REQ sent",display : "CM_VALIDATE.REQ sent",found : false},
            {details : "CM_SLAC_MATCH.CNF received. -Charger Not Ready-",display : "CM_SLAC_MATCH.CNF received. -Charger Not Ready-",found : false},	
            {details : "CM_SLAC_MATCH.CNF received. -Charger Ready-",display : "CM_SLAC_MATCH.CNF received. -Charger Ready-",found : false},	
            {details : "CM_SLAC_MATCH.CNF received. -Charger Success-",display : "CM_SLAC_MATCH.CNF received. -Charger Success-",found : false},	
            {details : "CM_SET_KEY.CNF received",display : "CM_SET_KEY.CNF received",found : false},	
            {details : "New keys set",display : "New keys set",found : false},	
            {details : "Link Measurement:",display : "Link Measurement:",found : false},	
            {details : "Sending IPv6.",display : "Sending IPv6.",found : false},	
            {details : "IPv6 Message is received",display : "IPv6 Message is received",found : false},	

            

        ]
    }

    preparePEVTimeLine(){
        return(
            <div>
            <ThemeProvider theme={this.theme}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <DirectionsCarIcon style={{ color: 'green' , fontSize: '60px'} }/>
            </div>
            </ThemeProvider>
            <Timeline align="alternate">

            {
                this.pevStrings.map((value,key)=>(
                   this.prepareTimeLineItem(value.display,value.found,key)                      
                ))
            }

              
            </Timeline>
            </div>
            )
    }
    prepareEVSETimeLine(){
        return(
            <div>
            <ThemeProvider theme={this.theme}>
            <EvStationIcon/>
            </ThemeProvider>
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
                                        role : this.role  
                                    })
            }
            else if(sCommand.includes("ROLE:EVSE"))
            {
                    this.role = "EVSE";
                    clearInterval(this.queryInterval);
                    this.setState({  printOutCom : this.printOutCom,
                                        toggleToRefresh : this.toggleToRefresh,
                                        role : this.role  })
            }else{
                    let nowFound = false;
                    for(let i=0;i<this.pevStrings.length;i++){
                        //console.log("Compare ",sCommand, " with ",this.pevStrings[i].details)
                        if(sCommand.includes(this.pevStrings[i].details) && this.pevStrings[i].found === false){
                            if(sCommand.includes(this.pevStrings[24].details))//Link Measurement
                            {
                                let measurementValue = sCommand.split(':')
                                if(measurementValue.length>1){
                                    this.pevStrings[24].display = "Link Measurement: "+Number(measurementValue[1].trim())+"ms."
                                }
                            }
                           
                            this.pevStrings[i].found = true
                            nowFound = true
                            break;
                        }
                    }

                    if(nowFound === true){
                        console.warn("OKKKKKKKK")

                        this.setState({  
                            printOutCom : this.printOutCom,
                            toggleToRefresh : true,
                            role : this.role  
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
        
        
        this.theme = responsiveFontSizes(createMuiTheme());
        this.portReader = {}
        this.portWriter = {}
        this.rawData = ""
        this.role = ""
        this.state = {
            printOutCom : "",
            toggleToRefresh : false,
            role : ""
          };

        this.queryInterval = {}
        this.initializePEVStrings()
        this.pevSendStartCommand = this.pevSendStartCommand.bind(this)
        this.pevSendStopCommand = this.pevSendStopCommand.bind(this)
        this.linkMeasurements = []
    }
    render(){
        return (
            <div>

                <div>
                    {this.state.role === "PEV" ? this.preparePEVRelatedButtons() : null }
                </div>
                {
                    this.state.role === "PEV" ?
                    this.preparePEVTimeLine() : 
                        this.state.role === "EVSE" ? 
                        this.prepareEVSETimeLine() : null  
                }
                
                <h3>{this.state.printOutCom}</h3>
            </div>
            );
    }
}


export default DeviceState