import * as THREE from "three"

const MAX = 4
const MIN = -4

function getValidLocation() {
	let validPositions = []
	for (let i = MIN; i < MAX; i++) {
		for (let j = MIN; j < MAX; j++) {
			let location = [i, j]
			validPositions.push(location)
		}
	}
	return validPositions
}

function generateSmokeCube() {
	const textureLoader = new THREE.TextureLoader()
	const smokeTexture = textureLoader.load(
		"https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/Smoke-Element.png"
	)

	const smokeMaterial = new THREE.MeshLambertMaterial({
		color: new THREE.Color("rgba(83, 84, 255,0.5)"),
		map: smokeTexture,
		transparent: true
	})
	const smokeGeo = new THREE.PlaneGeometry(200, 200)
	const newMesh = new THREE.Mesh(smokeGeo, smokeMaterial)
	return newMesh
}

function generateSphere(color) {
	const geometry = new THREE.CapsuleGeometry(0.2, 0.05, 4, 8)
	const material = new THREE.MeshStandardMaterial({ color: color })
	const capsule = new THREE.Mesh(geometry, material)

	geometry.scale(0.029, 0.029, 0.029)
	geometry.translate(1, 1, 1)
	material.emissive = new THREE.Color(color)
	material.emissiveIntensity = 1.6

	return capsule
}

function generateCubeList(numberOfCubes) {
	let cubeList = []
	let validPositions = getValidLocation()
	for (let i = 0; i <= numberOfCubes; i++) {

		const randomIndex = Math.floor(Math.random() * validPositions.length)
		const currentPosition = validPositions[randomIndex]

		let locationX = currentPosition[0]
		let locationY = currentPosition[1]

		validPositions.slice(randomIndex, 1)

		const geometry = new THREE.BoxGeometry(0.8, 0.8, 8)
		const material = new THREE.MeshStandardMaterial({ color: 0xffffff })

		geometry.translate(locationX, locationY, -5)
		let cube = new THREE.Mesh(geometry, material)
		cubeList.push(cube)
	}

	return cubeList
}

function generatePlane() {
	let geometry = new THREE.BoxGeometry(100, 100, 1)
	let material = new THREE.MeshPhysicalMaterial()
	let plane = new THREE.Mesh(geometry, material)
	plane.position.set(0, 0, -6)
	return plane
}

function generateTransparentCubes(numberOfCubes) {
	let cubeList = []
	let mod = -1
	for (let i = 1; i <= numberOfCubes; i++) {
		let geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
		let material = new THREE.MeshPhysicalMaterial({
			roughness: 0.15,
			transmission: 1,
			thickness: 1.2
		})
		let cube = new THREE.Mesh(geometry, material)
		if (i % 2 == 0) {
			cube.position.set(-0.5, -0.5, 2)
		} else {
			cube.position.set(1, 1, 2)
		}

		cubeList.push(cube)
	}

	return cubeList
}

export default {
	generateSmokeCube,
	generateSphere,
	generateCubeList,
	generatePlane,
	generateTransparentCubes
}