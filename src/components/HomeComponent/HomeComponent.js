import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { Fog } from "three";
import { randFloat } from "three/src/math/MathUtils";
import { ThreeDUtils } from "../../utils/ThreeDUtils";
import "./home-component.css";

const HomeComponent = () => {
    const scene = new THREE.Scene();
    const geometry = new THREE.BoxGeometry(1, 1, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cubeList = ThreeDUtils.generateCubeList(5);
    const renderer = new THREE.WebGLRenderer();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
  

  function animateCubes() {
    requestAnimationFrame(animateCubes);

    cubeList[0].rotation.x += 0.0;
    cubeList[0].rotation.y += 0.0;

    renderer.render(scene, camera);
  }



  useEffect(()=>{
    let capsule  = ThreeDUtils.generateSphere();
    const light = new THREE.AmbientLight( 0xffffff, 2.0); // soft white light
    light.intensity=1;

    const pointLight = new THREE.PointLight(0xffff00, 2);
    pointLight.position.x = 2
    scene.add(pointLight);
    
    geometry.translate(-2,0,-10)   
  
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("home-component-container").appendChild(renderer.domElement);
  
    
    cubeList.forEach((cube)=>{
        scene.add(cube);
    })
    scene.add( light );
    scene.add(capsule);
    scene.fog = new THREE.Fog(0x555555, 0, 12);

    


  
    camera.position.z = 5;

    animateCubes();
  })
  return (
    <div className="home-component-container" id="home-component-container">
      <div>Home Component</div>
    </div>
  );
};

export default HomeComponent;
