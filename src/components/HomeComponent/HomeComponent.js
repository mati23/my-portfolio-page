import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { Fog, Points, Vector3 } from "three";
import { randFloat } from "three/src/math/MathUtils";
import { ThreeDUtils } from "../../utils/ThreeDUtils";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass";
import { GrannyKnot } from "three/examples/jsm/curves/CurveExtras";
import "./home-component.css";
const HomeComponent = () => {
  const scene = new THREE.Scene();
  const geometry = new THREE.BoxGeometry(1, 1, 10);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cubeList = ThreeDUtils.generateCubeList(5);
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  const curve = new THREE.CurvePath();
  
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
  const capsule = ThreeDUtils.generateSphere();
  const smokesArray = [];
  let delta = clock.getDelta();
  
  const grannyKnotCurve = new GrannyKnot();
  const geometryCurve = new THREE.TubeGeometry(grannyKnotCurve, 100, 1, 3 , true);
  const curveMaterial = new THREE.MeshStandardMaterial({color:0xffffff, wireframe:true, side:THREE.FrontSide});
  
  
  const tube = new THREE.Mesh(geometryCurve, curveMaterial);
  tube.position.set(0,0,0);
  tube.scale.set(0.1,0.1,0.01)
  scene.add(tube);


  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.6,
    0.8,
    0.6
  );
  composer.addPass(bloomPass);
  composer.setSize(window.innerWidth, window.innerHeight);

  const afterImagePass = new AfterimagePass();
  afterImagePass.uniforms["damp"] = { value: 0.9811 };
  composer.addPass(afterImagePass);


  for (let p = 0; p < 10; p++) {
    let particle = new ThreeDUtils.generateSmokeCube();
    particle.position.set(
      Math.random() * 300 - 250,
      Math.random() * 300 - 250,
      Math.random() * 2 - 8
    );
    particle.rotation.z = Math.random() * 360;
    //scene.add(particle);
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
      smokesArray[sp].rotation.z += delta * 0.05;
    }
  }

  function animateCapsule() {
    const time = clock.getElapsedTime();
    const looptime = 30;
    const t = (time % looptime) / looptime;
    
    const pos1 = tube.geometry.parameters.path.getPointAt(t);
    
    
    capsule.position.copy(pos1).multiplyScalar(0.05);
    requestAnimationFrame(animateCapsule);    
    composer.render(scene, camera);
  }
  useEffect(() => {
    const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
    light.intensity = 1;

    const pointLight = new THREE.PointLight(0xffff0ff, 2);
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
