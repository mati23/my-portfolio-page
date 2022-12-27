import * as THREE from "three";
import { Vector3 } from "three";

const MAX = 5;
const MIN = -5;

function generateLocationsArray(numberOfCubes) {
  let locations = [];
  for (let i = 0; i <= numberOfCubes; i++) {
    locations.push(i);
  }
  return locations;
}

function getValidLocation(listOfValidLocations) {
  let locationValue = Math.floor(Math.random() * (MAX - MIN) + MIN);
  let notRepeated = false;
  while (notRepeated == false) {
    if (!listOfValidLocations.includes(locationValue)) {
      listOfValidLocations.push(locationValue);
      notRepeated = true;
    } else {
      locationValue = Math.floor(Math.random() * (MAX - MIN) + MIN);
    }
  }
  return locationValue;
}

export class ThreeDUtils {
  static generateSmokeCube() {
    const geometry = new THREE.BoxGeometry(200, 200, 200);
    const material = new THREE.MeshLambertMaterial({
      color: new THREE.Color("rgb(83, 84, 255)"),
      wireframe: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    const textGeo = new THREE.PlaneGeometry(300, 300);
    
    const textureLoader = new THREE.TextureLoader();

    const smokeTexture = textureLoader.load(
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/Smoke-Element.png"
    );

    const smokeMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color("rgb(83, 84, 255)"),
        map: smokeTexture,
        transparent: true
      });
    const smokeGeo = new THREE.PlaneGeometry(300, 300);
    const newMesh = new THREE.Mesh(smokeGeo, smokeMaterial);
    return newMesh;
  }

  static generateSphere() {
    const geometry = new THREE.CapsuleGeometry(0.2, 0.05, 4, 8);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const capsule = new THREE.Mesh(geometry, material);

    geometry.scale(0.1, 0.1, 0.1);
    geometry.translate(1, 1, 1);
    material.emissive = new THREE.Color(0xff55aa);
    material.emissiveIntensity = 1.6;
    
    return capsule;
  }

  static generateCubeList(numberOfCubes) {
    let locationsX = [];
    let locationsY = [];
    let locationsZ = [];

    let cubeList = [];
    for (let i = 0; i <= numberOfCubes; i++) {
      let locationX = getValidLocation(locationsX);
      let locationY = getValidLocation(locationsY);
      let locationZ = getValidLocation(locationsZ);

      const geometry = new THREE.BoxGeometry(1, 1, 8);
      const material = new THREE.MeshStandardMaterial({ color: 0x000000 });

      geometry.translate(locationX, locationY, -5);
      let cube = new THREE.Mesh(geometry, material);
      cubeList.push(cube);
    }
    return cubeList;
  }
}
