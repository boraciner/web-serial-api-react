import React, { useEffect } from 'react';
import './About.css'

var counter = 0
var text = "Ipsum esse anim dolor in aliqua. Consectetur ad nostrud nisi ea dolor pariatur. Irure fugiat ipsum adipisicing incididunt eu sint nulla. Nisi fugiat magna eiusmod nostrud consequat fugiat velit labore duis occaecat Lorem aliquip. Duis aliqua id do cillum occaecat occaecat aliquip deserunt. Cillum incididunt magna excepteur est quis proident in aute amet est in mollit."

export default function About() {
    const [textVal,setTextVal] = React.useState("");

   
    useEffect(() => {
      const interval = setInterval(() => {
        counter++;
        if(counter<text.length){
          setTextVal(text.substr(0,counter))
        }
      }, 50);
      return () => clearInterval(interval);
    }, []);


    return (
      <div>
          {textVal}<span className='blinker'>&#32;</span>
      </div>
    );
  }
  