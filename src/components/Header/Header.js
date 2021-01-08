import React from "react";
import SlideToggle from "react-slide-toggle";
import './Header.css'




export default function Header() {
  return (
    <div className="bodyWrapper">
    <header>
      <div className="signBlock">
        <div className="topCover"></div>
          <div className="headerContent">
            <div className="headerLinks">
            <h1>WEB SERIAL API</h1>
                <div className="signLinks">
                <h3>Test Web Interface</h3>
                </div>       
            </div>
          </div>
            <div className="boxEdges1">
              <div className="boxEdges2">
                <div className="slider"></div>
                <div className="headerLine"></div>
              </div>
            </div>
        </div>
    </header>
    <SlideToggle>
    {({ toggle, setCollapsibleElement }) => (
      <div className="my-collapsible">
          <div id="navButton" className="open" onClick={toggle}>- Menu -   
          <div className="bar left"></div>
          <div className="bar top"></div>
          <div className="bar right"></div>
          <div className="bar bottom"></div>
        </div>
        <div className="my-collapsible__content" ref={setCollapsibleElement}>
          <div className="my-collapsible__content-inner">
          <div className='navContent'>
            |<a href="index">Testing</a> | 
            <a href="about">About</a> | 
            <a href="contact">Contact</a>
          </div>
          </div>
        </div>
      </div>
    )}
  </SlideToggle>
    <body-container>
    </body-container>
    <footer>
    </footer>
  </div>
  );
}

