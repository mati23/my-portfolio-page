import React, { useEffect, useState } from "react";
import IconComponent from "../../IconComponent/IconComponent";
import "./image-left-component.css";
import * as Vibrant from "node-vibrant";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

const ImageLeftComponent = ({
  activeYear: newActiveYear = "2019",
  entityName: newEntityName,
}) => {
  const ColorThief = require("colorthief");

  const [vibrantObject, setVibrantObject] = useState({});
  const [dominantColor, setDominantColor] = useState("rgba(0,0,0,1)");
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
    getJsonFileForEntityAndYear();

    setImgSource("/resources/backgrounds/".concat(newActiveYear).concat("/").concat(newEntityName).concat(".jpg"));
  }, [newActiveYear]);

  useEffect(() => {    
    setActiveYear(newActiveYear);    
  }, [newActiveYear]);

  useEffect(()=>{
    const componentLeft = document.getElementById(entityName);
    componentLeft.classList.remove("fade-in-animation");    
    setTimeout((()=>{
      componentLeft.classList.add("fade-in-animation");
      console.log("Adding class");
    }), 10)
    console.log("Changing active year to ", newActiveYear);
    
  },[activeYear]);

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

  


  return (
    
      <div id={entityName} className={"image-left-component fade-in-animation"}>
        <div
          className="image-container"
          style={{
            background: darkColor,
            background:
              "background: linear-gradient(-90deg, rgba(141, 15, 20,1) 0%, rgba(0,212,255,0) 100%)",
          }}
        >
          <img
            src={imgSource}
            className="background-image"          
          />
        </div>

        <div
          className="description-component"
          style={{
            backgroundImage: "rgb(14, 58, 33)",
            background:
              "linear-gradient(90deg," +
              dominantColor +
              "0%," +
              dominantColor +
              "60%," +
              "rgba(0,212,255,0) 100%)",
          }}
        >
          <div className="description-title-container-left">
            <div className="title-container">
              <div className="description-title">{entityTitle}</div>
              <div className="description-icon">
                <IconComponent entityName={entityName} />
              </div>
            </div>
            <div className="subtitle-container">
              <div className="subtitle">{entitySubtitle}</div>
            </div>
            <div className="description">{description}</div>
          </div>
        </div>
      </div>
    
    
  );
};

export default ImageLeftComponent;
