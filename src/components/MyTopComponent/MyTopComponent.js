import React, { useState } from "react";
import { useEffect } from "react"
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import ImageLeftComponent from "../ImageLeftComponent/ImageLeftComponent.js";
import ImageRightComponent from "../ImageRightComponent/ImageRightComponent.js";
import "./my-top-component.css";
const MyTopComponent = () => {
  const [activeYear, setActiveYear] = useState("2019");

  const changeActiveYear = (year) =>{
    setActiveYear(year);
    // const leftComponent = document.getElementsByClassName("image-left-component")[0];
    // leftComponent.removeClass("fade-in-animation").addClass("fade-in-animation");
  }

  useEffect(()=>{
    
  },[activeYear, setActiveYear])
  
  return (
    
    <div>
      <div className="timeline-container">
        <div className="timeline-button-container">
          <div className="timeline-button-container">
            <button onClick={()=>changeActiveYear("2019")} className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
              2019
            </button>
            <div className="timeline-year-button"></div>
          </div>
          <div className="timeline-button-container">
          <div className="timeline-year-button"></div>
            <button onClick={()=>changeActiveYear("2020")} className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
              2020
            </button>
            <div className="timeline-year-button"></div>
          </div>
          <div className="timeline-button-container">
          <div className="timeline-year-button"></div>
            <button onClick={()=>changeActiveYear("2021")} className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
              2021
            </button>            
          </div>          
        </div>
      </div>
      
        <div className="my-top-component">
          <ImageLeftComponent  entityName={"game"} activeYear={activeYear} />        
          <ImageRightComponent entityName={"movie"} activeYear={activeYear} />        
          <ImageLeftComponent entityName={"song"} activeYear={activeYear} />
          <ImageRightComponent entityName={"album"} activeYear={activeYear} />
          <ImageLeftComponent entityName={"book"} activeYear={activeYear} />
        </div>
      
    </div>
  );
}

export default MyTopComponent;
