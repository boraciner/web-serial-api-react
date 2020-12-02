import React,{Component} from 'react'
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';


class DeviceState extends Component{
    
    prepareTimeline(){
        return(
        <div>
        <ThemeProvider theme={this.theme}>
            <Typography variant="h5">Com Port: {this.props.comportName}</Typography>
        </ThemeProvider>
        <Timeline align="alternate">
        <TimelineItem>
            <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>Eat</TimelineContent>
        </TimelineItem>
        <TimelineItem>
            <TimelineSeparator>
            <TimelineDot color="primary" />
            <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>Code</TimelineContent>
        </TimelineItem>
        <TimelineItem>
            <TimelineSeparator>
            <TimelineDot color="secondary" />
            <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>Sleep</TimelineContent>
        </TimelineItem>
        <TimelineItem>
            <TimelineSeparator>
            <TimelineDot />
            </TimelineSeparator>
            <TimelineContent>Repeat</TimelineContent>
        </TimelineItem>
        </Timeline>
        </div>
        )
    }

    componentDidMount(){
        this.OpenReadComPort();
    }

    async OpenReadComPort(){
        console.log("OpenReadComPort",this.props.comportName)
        console.log("Port..",this.props.port)
        
        const p_Port = this.props.port

        await p_Port.port.open({ baudRate: 9600});
        this.portReader = p_Port.port.readable.getReader();
        while (true) {
        const { value, done } = await this.portReader.read();
        if (done) {
            break;
        }
        console.log("VALUE ",value)

        this.rawData += new TextDecoder("utf-8").decode(value)
        console.log("rawData ",this.rawData)
        this.setState(
           { 
               printOutCom : this.rawData
           }
        )
        }
    }


    constructor(props){
        super(props)
        console.log("Com name : ",props.comportName)
        console.log("Is it selected ? ",props.port.selected)
        
        this.theme = responsiveFontSizes(createMuiTheme());

        this.portReader = {}
        this.rawData = ""

        this.state = {
            printOutCom : ""
          };

        
    }
    render(){
        return (
            <div>
                {this.prepareTimeline()}
                <hr/>
                <h3>{this.state.printOutCom}</h3>
            </div>
            );
    }
}


export default DeviceState