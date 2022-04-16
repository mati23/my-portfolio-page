import react, { useEffect, useState } from "react";
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

  function getJsonFileForEntityAndYear() {
    fetch(
      "/resources/backgrounds/"
        .concat(newActiveYear)
        .concat("/descriptions.json")
    )
      .then((r) => {
        console.log("fetching...");
        return r.json();
      })
      .then((data) => {
        console.log(data);
        console.log("setting description: ", data[entityName].description);
        console.log("setting title: ", data[entityName].title);
        console.log("setting subtitle: ", data[entityName].subtitle);
        setDescription(data[entityName].description);
        setEntityTitle(data[entityName].title);
        setEntitySubtitle(data[entityName].subtitle);
      });
  }

  let doStuffWithPalette = (imgSrc) => {
    Vibrant.from(imgSrc).getPalette((err, palette) => {
      console.log("new vibrant pallete: ", palette.Vibrant._rgb);
      setVibrantObject(palette.Vibrant._rgb);
      getJsonFileForEntityAndYear();
    });
  };
  useEffect(() => {
    console.log("my props: ");
    doStuffWithPalette(
      "./../../resources/backgrounds/" +
        newActiveYear +
        "/" +
        newEntityName +
        ".jpg"
    );
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
  return (
    <div className="image-right-component">
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
                  <div className="subtitle-right">Subtitle</div>
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
        <div
          className="background-image"
          style={{
            backgroundImage:
              "linear-gradient(to left," +
              darkColor +
              ", rgba(141, 15, 20,0.2) ," +
              dominantColor +
              "), url(/resources/backgrounds/" +
              newActiveYear +
              "/" +
              entityName +
              ".jpg)",
          }}
        ></div>
      </div>
    </div>
  );
};

export default ImageRightComponent;
