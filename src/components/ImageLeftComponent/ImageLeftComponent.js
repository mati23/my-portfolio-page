import react, { useEffect, useState } from "react";
import IconComponent from "../../IconComponent/IconComponent";
import "./image-left-component.css";
import * as Vibrant from "node-vibrant";


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
  const [description, setDescription] = useState("")
  const [entityTitle, setEntityTitle] = useState("")
  const [entitySubtitle, setEntitySubtitle] = useState("")
  

  
  function getJsonFileForEntityAndYear(){
    fetch("/resources/backgrounds/".concat(newActiveYear).concat("/descriptions.json")).then((r)=> {
    console.log("fetching...");
    return r.json();
  }).then(data=>{
    console.log(data)
    console.log("setting description: ",data[entityName].description )
    console.log("setting title: ",data[entityName].title )
    console.log("setting subtitle: ",data[entityName].subtitle )
    setDescription(data[entityName].description)
    setEntityTitle(data[entityName].title)
    setEntityTitle(data[entityName].subtitle)
  })
  }

  let doStuffWithPalette = (imgSrc) => {
    Vibrant.from(imgSrc).getPalette((err, palette) => {
      setVibrantObject(palette.Vibrant._rgb);
    });
  };
  useEffect(() => {
    console.log("my props: ");
    doStuffWithPalette("./../../resources/backgrounds/"+ newActiveYear + "/" + newEntityName +".jpg");
    getJsonFileForEntityAndYear();
  }, [newActiveYear]);

  useEffect(() => {
    console.log("active year changing in image component", activeYear);
  }, [activeYear]);

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
    <div className="image-left-component">
      <div
        className="image-container"
        style={{
          background: darkColor,
          background:
            "background: linear-gradient(-90deg, rgba(141, 15, 20,1) 0%, rgba(0,212,255,0) 100%)",
        }}
      >
        <div
          className="background-image"
          style={{
            backgroundImage:
              "linear-gradient(to right," +
              darkColor +
              ", rgba(141, 15, 20,0.2) ," +
              dominantColor +
              "), url(/resources/backgrounds/" +
              newActiveYear +
              "/" +
              entityName +
              ".jpg)",
          }}
        >
         
        </div>
      </div>

      <div
        className="description-component"
        style={{
          backgroundImage: "rgb(14, 58, 33)",
          background:
            "linear-gradient(90deg," +
            dominantColor + "0%," + 
            dominantColor + "60%," + 
            "rgba(0,212,255,0) 100%)",
        }}
      >
        <div className="description-title-container">
          <div className="title-container">
            <div className="description-title">{entityTitle}</div>
            <div className="description-icon">
              <IconComponent entityName={entityName} />
            </div>
          </div>
          <div className="subtitle-container">
            <div className="subtitle">{entitySubtitle}</div>
          </div>
          <div className="description">
           {description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageLeftComponent;
