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

  let doStuffWithPalette = (imgSrc) => {
    Vibrant.from(imgSrc).getPalette((err, palette) => {
      console.log("new vibrant pallete: ", palette.Vibrant._rgb)
      setVibrantObject(palette.Vibrant._rgb);
    });
  };
  useEffect(() => {
    console.log("my props: ");
    doStuffWithPalette("./../../resources/backgrounds/"+ newActiveYear + "/" + newEntityName +".jpg");
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
            dominantColor + "0%," +
            dominantColor + "50%," + 
            "rgba(0,212,255,0) 100%)",
        }}
      >
        <div className="description-title-container">
          <div className="title-container">
            <div className="description-title">Component Title</div>
            <div className="description-icon">
              <IconComponent entityName={entityName} />
            </div>
          </div>
          <div className="subtitle-container">
            <div className="subtitle">Subtitle</div>
          </div>
          <div className="description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            condimentum dictum enim ut posuere. Donec eget diam volutpat,
            elementum massa a, vehicula magna. Proin ornare mattis elit quis
            fringilla. In commodo lectus sit amet felis consequat, non bibendum
            turpis pulvinar. Cras imperdiet venenatis ex non vestibulum. Mauris
            vehicula condimentum ipsum vel sodales. Praesent tempus rutrum
            dapibus. Mauris varius, lectus a venenatis ultricies, orci nisi
            consectetur tellus, sit amet elementum felis justo sed nibh. Morbi
            sollicitudin lectus eget ligula luctus molestie. Duis vel mattis
            risus. Sed venenatis posuere arcu in cursus. Nulla magna lectus,
            semper quis rutrum pulvinar, condimentum nec libero.
          </div>
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
        >
        </div>
      </div>
    </div>
  );
}

export default ImageRightComponent;
