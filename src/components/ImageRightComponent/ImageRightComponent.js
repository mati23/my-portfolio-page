import React, { useEffect, useState } from "react";
import IconComponent from "../../IconComponent/IconComponent";
import "./image-right-component.css";
import * as Vibrant from "node-vibrant";

const ImageRightComponent = ({
  activeYear: newActiveYear = "2019",
  entityName: newEntityName,
}) => {
  const ColorThief = require("colorthief");

  const [vibrantObject, setVibrantObject] = useState({});
  const [dominantColor, setDominantColor] = useState("rgb(0,0,0,1)");
  const [darkColor, setDarkColor] = useState("rgb(9, 14, 17)");
  const [entityName, setEntityName] = useState(newEntityName);
  const [activeYear, setActiveYear] = useState(newActiveYear);
  const [description, setDescription] = useState("");
  const [entityTitle, setEntityTitle] = useState("");
  const [entitySubtitle, setEntitySubtitle] = useState("");
  const [imgSource, setImgSource] = useState("");

  function getJsonFileForEntityAndYear() {
    fetch(
      "/resources/backgrounds/"
        .concat(newActiveYear)
        .concat("/descriptions.json")
    )
      .then((r) => {
        
        return r.json();
      })
      .then((data) => {
        
        setDescription(data[entityName].description);
        setEntityTitle(data[entityName].title);
        setEntitySubtitle(data[entityName].subtitle);
      });
  }

  let doStuffWithPalette = (imgSrc) => {
    Vibrant.from(imgSrc).getPalette((err, palette) => {
      
      setVibrantObject(palette.Vibrant._rgb);
      getJsonFileForEntityAndYear();
    });
  };
  useEffect(() => {    
    doStuffWithPalette(
      "./../../resources/backgrounds/" +
        newActiveYear +
        "/" +
        newEntityName +
        ".jpg"
    );
    setImgSource("/resources/backgrounds/".concat(newActiveYear).concat("/").concat(newEntityName).concat(".jpg"));
  }, [newActiveYear]);

  function darkerFilter(value) {
    return Math.floor(value / 1.5);
  }
  function rgb(r, g, b) {
    return (
      "rgb(" +
      darkerFilter(r) +
      "," +
      darkerFilter(g) +
      "," +
      darkerFilter(b) +
      ",1)"
    );
  }
  useEffect(() => {
    setDominantColor(rgb(vibrantObject[0], vibrantObject[1], vibrantObject[2]));
  }, [vibrantObject, setVibrantObject]);

  
  useEffect(() => {    
    setActiveYear(newActiveYear);    
  }, [newActiveYear]);
  
  useEffect(()=>{
    const componentLeft = document.getElementById(entityName);
    componentLeft.classList.remove("fade-in-animation");    
    setTimeout((()=>{
      componentLeft.classList.add("fade-in-animation");
      console.log("Adding class");
    }), 1)
    console.log("Changing active year to ", newActiveYear);
    
  },[activeYear]);

  return (
    <div className="image-right-component fade-in-animation" id={entityName}>
      <div
        className="description-component"
        style={{
          backgroundImage: "rgb(14, 58, 33)",
          background:
            "linear-gradient(-90deg," +
            dominantColor +
            "0%," +
            dominantColor +
            "50%," +
            "rgba(0,212,255,0) 100%)",
        }}
      >
        <div className="description-title-container-right">
          <div className="right-title-container">
            <div className="title-subtitle-description-container">              
                <div className="description-title">{entityTitle}</div>
                <div className="subtitle-container-right">
                  <div className="subtitle-right">{entitySubtitle}</div>
                </div>
                
            </div>
            
            <div>
              <div className="description-icon">
                <IconComponent entityName={entityName} />
              </div>
            </div>
          </div>
          <div className="description-right">{description}</div>
        </div>
      </div>
      <div
        className="image-container"
        style={{
          background: darkColor,
          background:
            "background: linear-gradient(-90deg, rgba(0,212,255,0) 0%, rgba(141, 15, 20,1) 100%)",
        }}
      >
        <img
          className="background-image"
          src={imgSource}
        />
      </div>
    </div>
  );
};

export default ImageRightComponent;
