import React, {useState} from "react";
import "./experience-icon-component.css";
function ExperienceIconComponent(props) {
  const [entityName, setEntityName] = useState(props.entityName)
  const [iconOnly, setIconOnly] = useState(false);

  useState(()=>{
    if(props.iconOnly == true){
      setIconOnly(true);
    }
  },[]);

  return (
    <div className={iconOnly ? "experience-icon-component-container" : "experience-icon-component-container experience-icon-component-margin"}>
      <div className="experience-icon-image-container">
        <img className="experience-icon-image" src={process.env.PUBLIC_URL.concat("/resources/icons/"+entityName+".png")}></img>
      </div>
      {!iconOnly && <div className="experience-icon-description-container">
        <div className="experience-icon-description">{entityName}</div>
      </div>}
    </div>
  );
}

export default ExperienceIconComponent;
