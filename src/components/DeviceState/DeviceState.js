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
    constructor(props){
        super(props)
        console.log("Com name : ",props.comportName)
        this.theme = responsiveFontSizes(createMuiTheme());
    }
    render(){
        return (
            <div>
                {this.prepareTimeline()}
            </div>
            );
    }
}

export default DeviceState