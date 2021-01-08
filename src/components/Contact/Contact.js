import React, { useEffect } from 'react';
import './Contact.css'

var counter = 0
var text = "Ex aliquip nisi velit eu quis Lorem ullamco labore irure veniam. Excepteur non velit nisi qui sint ad excepteur. Do sit proident occaecat ea ullamco nostrud exercitation incididunt qui cupidatat consectetur. Id veniam cillum dolore sunt duis minim cupidatat eu.Sunt consequat excepteur tempor do elit non cillum ex incididunt. Dolor qui incididunt qui cupidatat laborum officia duis pariatur occaecat cupidatat aliqua Lorem laborum. Commodo dolor ad eu anim nostrud veniam sunt velit. Do amet sit ea tempor sint adipisicing magna exercitation commodo laboris veniam commodo. Laboris nulla ipsum in incididunt non incididunt exercitation proident qui occaecat cupidatat ipsum aliqua aliqua. Pariatur eu Lorem nostrud exercitation nulla ea minim laborum amet cupidatat officia adipisicing. Fugiat dolore est qui voluptate incididunt aute fugiat non laborum."

export default function Header() {
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
  