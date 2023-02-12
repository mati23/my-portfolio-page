import React, { useEffect, useState } from "react";
import "./menu-button-component.css";

const MenuButtonComponent = ({
    text: newText = '',
    index: newIndex=1,
    ref: newRef
  }) => {

    const [index, setIndex] = useState(1);
    const [text, setText] = useState("");
    const [ref, setRef] = useState("");

    useEffect(()=>{
        setIndex(newIndex);
        setText(newText);
        setRef(newRef);
    })
    return (
        <div className="button-gradient button-polygon" style={{marginLeft: index*20 + 'px'}} >
            <a href="/bookreviews">{text}</a>
        </div>
    );
}

export default MenuButtonComponent;