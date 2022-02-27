import react from "react";
import "./icon-component.css";
import { useState } from "react/cjs/react.development";
function IconComponent(props) {
  const [entityName, setEntityName] = useState(props.entityName)
  return (
    <div className="icon-component-container">
      <div className="icon-image-container">
        <div className="icon-image" style={{
          width: "2.5em",
          backgroundImage:              
              "url(/resources/icons/"+entityName+".png)"}}></div>
      </div>
      <div className="icon-description-container">
        <div className="icon-description">{entityName}</div>
      </div>
    </div>
  );
}

export default IconComponent;
