import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { Fog, Object3D, Points, TorusKnotGeometry, Vector3 } from "three";
import { randFloat } from "three/src/math/MathUtils";
import { ThreeDUtils } from "../../utils/ThreeDUtils";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass";
import { DecoratedTorusKnot5c, GrannyKnot, TorusKnot, TrefoilKnot, VivianiCurve } from "three/examples/jsm/curves/CurveExtras";
import "./home-component.css";
const HomeComponent = () => {
  const scene = new THREE.Scene();
  
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cubeList = ThreeDUtils.generateCubeList(9);
  const transparentCubeList = ThreeDUtils.generateTransparentCubes(1);
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  const curve = new THREE.CurvePath();
  const lightBulbs = [];
  const lightPathCurves = [];
  const colors = [0xff1900, 0x22ff22, 0x0000ff, 0xf0ff11]
  const curves = [new GrannyKnot(), new TrefoilKnot(), new TorusKnot(), new VivianiCurve()]
  
  const camera = new THREE.PerspectiveCamera(
    85,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const clock = new THREE.Clock();
  const renderScene = new RenderPass(scene, camera);
  const composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  
  const smokesArray = [];
  let delta = clock.getDelta();
  
  for (let i = 0; i<=4;i++){
    const capsule = ThreeDUtils.generateSphere(colors[i]);
    lightBulbs.push(capsule);
  }

  for (let i = 0; i<=4;i++ ){
    const grannyKnotCurve = curves[i]
    let geometryCurve = new THREE.TubeGeometry(grannyKnotCurve, 100, 1, 3 , true);
    let curveMaterial = new THREE.MeshStandardMaterial({color:0xffffff, wireframe:true, side:THREE.FrontSide});    
    let tube = new THREE.Mesh(geometryCurve, curveMaterial);
    tube.position.set(i,i,0);
    tube.rotation.set(0,0,i*2.45);
    tube.scale.set(0.1*i,0.1,0.0);
    lightPathCurves.push(tube); 

  }

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.6,
    0.8,
    0.6
  );
  composer.addPass(bloomPass);
  composer.setSize(window.innerWidth, window.innerHeight);

  const afterImagePass = new AfterimagePass();
  afterImagePass.uniforms["damp"] = { value: 0.9811 };
  composer.addPass(afterImagePass);


  for (let p = 0; p < 20; p++) {
    let particle = new ThreeDUtils.generateSmokeCube();
    particle.position.set(
      Math.random() * 10 - 80,
      Math.random() * 10 - 90,
      Math.random() * 4 - 8
    );
    particle.rotation.z = Math.random() * 360;
    scene.add(particle);
    smokesArray.push(particle);
  }


  function animateTransparentCubes(){
    delta = clock.getDelta();
    
    requestAnimationFrame(animateTransparentCubes);
    
    for (let i = 0; i<transparentCubeList.length; i++){      
      if (i % 2 == 0){
        transparentCubeList[i].rotation.z += delta * 0.1;
        transparentCubeList[i].rotation.x += delta * 0.1;      
      }else{
        transparentCubeList[i].rotation.z += delta * -0.1;
        transparentCubeList[i].rotation.x += delta * -0.1;      
      }
    
    }
  }

  function animateSmoke() {
    // note: three.js includes requestAnimationFrame shim
    delta = clock.getDelta();
    requestAnimationFrame(animateSmoke);
    evolveSmoke();
  }

  function evolveSmoke() {
    var sp = smokesArray.length;
    while (sp--) {
      smokesArray[sp].rotation.z += delta * 0.05;
    }
  }

  function animateCapsule() {
    const time = clock.getElapsedTime();
    const looptime = 20;
    const t = (time % looptime) / looptime;
    for (let i = 0; i<=4; i++){
      const pos1 = lightPathCurves[i].geometry.parameters.path.getPoint(t);        
      lightBulbs[i].position.add(pos1).multiply(new THREE.Vector3(0.05,0.05,0)).sub(new THREE.Vector3(1.5,0.1,-0.2));      
    }
    
    requestAnimationFrame(animateCapsule);    
    composer.render(scene, camera);
  }
  useEffect(() => {
    const light = new THREE.SpotLight(0xffffff, 5); // soft white light

    light.position.set(new THREE.Vector3(0,0,1))

    

    renderer.setSize(window.innerWidth, window.innerHeight);
    document
      .getElementById("home-component-container")
      .appendChild(renderer.domElement);

    cubeList.forEach((cube) => {
      scene.add(cube);
    });
    transparentCubeList.forEach((cube) => {
      scene.add(cube);
    });
    scene.add(light);
    scene.add(lightBulbs[0]);
    scene.add(lightBulbs[1]);
    scene.add(lightBulbs[2]);
    scene.add(lightBulbs[3]);
    
    scene.fog = new THREE.Fog(0x00155C, 1, 7);

    camera.position.z = 5;

    animateTransparentCubes();
    animateSmoke();
    animateCapsule();
  });
  return (
    <div className="home-component-container" id="home-component-container">
      <div>Home Component</div>
    </div>
  );
};

export default HomeComponent;
