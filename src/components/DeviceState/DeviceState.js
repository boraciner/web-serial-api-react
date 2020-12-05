import React,{Component} from 'react'
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import EvStationIcon from '@material-ui/icons/EvStation';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import lightGreen from "@material-ui/core/colors/lightGreen";





class DeviceState extends Component{
    
    
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
                <Button color="primary" aria-label="outlined primary button group">Start</Button>
                <Button color="secondary" aria-label="outlined secondary button group">Stop</Button>
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
            {details : "PLC - PIB image reading completed OK.",found : false},
            {details : "CM_SLAC_PARAM.REQ sent",found : false},
            {details : "CM_SLAC_PARAM.CNF received",found : false},
            {details : "CM_START_ATTEN_CHAR.IND sent",found : false},
            {details : "CM_START_ATTEN_CHAR.IND sent",found : false},
            {details : "CM_START_ATTEN_CHAR.IND sent",found : false},
            {details : "CM_MNBC_SOUND.IND sent",found : false},
            {details : "CM_MNBC_SOUND.IND sent",found : false},
            {details : "CM_MNBC_SOUND.IND sent",found : false},
            {details : "CM_MNBC_SOUND.IND sent",found : false},
            {details : "CM_MNBC_SOUND.IND sent",found : false},
            {details : "CM_MNBC_SOUND.IND sent",found : false},
            {details : "CM_MNBC_SOUND.IND sent",found : false},
            {details : "CM_MNBC_SOUND.IND sent",found : false},
            {details : "CM_MNBC_SOUND.IND sent",found : false},
            {details : "CM_MNBC_SOUND.IND sent",found : false},
            {details : "CM_ATTEN_CHAR.IND received",found : false},
            {details : "CM_ATTEN_CHAR.RSP sent",found : false},
            {details : "CM_VALIDATE.REQ sent",found : false},
            {details : "CM_SLAC_MATCH.CNF received. -Charger Success-",found : false},	
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
                   this.prepareTimeLineItem(value.details,value.found,key)                      
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

        switch(sCommand)
        {
            case "ROLE:PEV":
                this.role = "PEV";
                clearInterval(this.queryInterval);
                this.setState({  printOutCom : this.printOutCom,
                                    toggleToRefresh : this.toggleToRefresh,
                                    role : this.role  
                                })

                

                break;
            case "ROLE:EVSE":
                this.role = "EVSE";
                clearInterval(this.queryInterval);
                this.setState({  printOutCom : this.printOutCom,
                                    toggleToRefresh : this.toggleToRefresh,
                                    role : this.role  })
                break;
            default:
                let nowFound = false;
                for(let i=0;i<this.pevStrings.length;i++){
                    console.log("Compare ",sCommand, " with ",this.pevStrings[i].details)
                    if(sCommand.includes(this.pevStrings[i].details) && this.pevStrings[i].found === false){
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

        await p_Port.port.open({ baudRate: 9600});
        this.portReader = p_Port.port.readable.getReader();

        this.portWriter = p_Port.port.writable.getWriter();
        

        setTimeout(()=>{
            this.ReadValues()
        },0)

        this.queryInterval = setInterval(()=>{
            const data = new Uint8Array([114]); // r
            this.portWriter.write(data).then(res=>{
            });
            
        },100)
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