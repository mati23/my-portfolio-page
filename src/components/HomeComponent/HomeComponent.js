import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { Fog } from "three";
import { randFloat } from "three/src/math/MathUtils";
import { ThreeDUtils } from "../../utils/ThreeDUtils";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass";
import "./home-component.css";

const HomeComponent = () => {
  const scene = new THREE.Scene();
  const geometry = new THREE.BoxGeometry(1, 1, 10);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cubeList = ThreeDUtils.generateCubeList(5);
  const renderer = new THREE.WebGLRenderer({alpha:true});
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const clock = new THREE.Clock();
  const renderScene = new RenderPass(scene, camera);
  const composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  const capsule = ThreeDUtils.generateSphere();
  const smokesArray = [];
  let delta = clock.getDelta();

  const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.6, 0.8,0.8 );
  composer.addPass(bloomPass);
  composer.setSize(window.innerWidth, window.innerHeight)

  const afterImagePass = new AfterimagePass();
  afterImagePass.uniforms['damp'] = {value:0.9811};
  composer.addPass(afterImagePass);

  function animateCubes() {
    requestAnimationFrame(animateCubes);

    capsule.rotation.x += 0.001;
    capsule.rotation.y += 0.0;

    composer.render(scene, camera);
  }

  for (let p = 0; p < 150; p++) {
    let particle = new ThreeDUtils.generateSmokeCube();
    particle.position.set(
      Math.random() * 400 - 250,
      Math.random() * 400 - 250,
      Math.random() * 1000 - 100
    );
    particle.rotation.z = Math.random() * 360;
    scene.add(particle);
    smokesArray.push(particle);
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
      smokesArray[sp].rotation.z += delta * 0.2;      
    }
  }


  useEffect(() => {
    

    const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
    light.intensity = 1;

    const pointLight = new THREE.PointLight(0xffff00, 2);
    pointLight.position.x = 2;
    scene.add(pointLight);

    geometry.translate(-2, 0, -10);

    renderer.setSize(window.innerWidth, window.innerHeight);
    document
      .getElementById("home-component-container")
      .appendChild(renderer.domElement);

    cubeList.forEach((cube) => {
      scene.add(cube);
    });
    scene.add(light);
    scene.add(capsule);
    scene.fog = new THREE.Fog(0x555555, 0, 12);

    camera.position.z = 5;

    animateCubes();
    animateSmoke();
  });
  return (
    <div className="home-component-container" id="home-component-container">
      <div>Home Component</div>
    </div>
  );
};

export default HomeComponent;
