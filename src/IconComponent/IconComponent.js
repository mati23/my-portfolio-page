import React, {useState} from "react";
import "./icon-component.css";
function IconComponent(props) {
  const [entityName, setEntityName] = useState(props.entityName)
  const [iconOnly, setIconOnly] = useState(false);

  useState(()=>{
    if(props.iconOnly == true){
      setIconOnly(true);
    }
  },[]);

  return (
    <div className={iconOnly ? "icon-component-container" : "icon-component-container icon-component-margin"}>
      <div className="icon-image-container">
        <div className="icon-image" style={{
          width: "2.5em",
          backgroundImage:              
              "url(/resources/icons/"+entityName+".png)"}}></div>
      </div>
      {!iconOnly && <div className="icon-description-container">
        <div className="icon-description">{entityName}</div>
      </div>}
    </div>
  );
}

export default IconComponent;
