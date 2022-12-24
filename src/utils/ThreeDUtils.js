import * as THREE from "three";

const MAX = 5;
const MIN = -5;

function generateLocationsArray(numberOfCubes){
    let locations = [];
    for (let i=0; i<=numberOfCubes; i++ ){        
        locations.push(i);
    }
    return locations;
}

function getValidLocation(listOfValidLocations){
    let locationValue = Math.floor(Math.random()*(MAX-MIN)+(MIN));
    let notRepeated = false;
    while (notRepeated == false){
        if (!listOfValidLocations.includes(locationValue)){
            listOfValidLocations.push(locationValue)
            notRepeated = true;
        }else{
            locationValue = Math.floor(Math.random()*(MAX-MIN)+(MIN));
        }
    }
    return locationValue;
}

export class ThreeDUtils{   

    static generateSphere(){
        const geometry = new THREE.CapsuleGeometry( 1, 1, 4, 8 );
        const material = new THREE.MeshPhongMaterial( {color: 0x00ff00} );
        const capsule = new THREE.Mesh( geometry, material );

        geometry.scale(0.1,0.1,0.1);
        geometry.translate(1,1,1);
        material.emissive=new THREE.Color(0xffffff);
        material.emissiveIntensity=100000
        
        return capsule;
    }
    
    static generateCubeList(numberOfCubes){
        let locationsX = [];
        let locationsY = [];
        let locationsZ = [];

        let cubeList = [];
        for (let i=0; i<=numberOfCubes; i++ ){        
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
