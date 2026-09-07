import * as THREE from "three"

const MAX = 4
const MIN = -4
const SCALE_SIZE = 0.050

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

// Original procedural texture: no network request or third-party asset license.
function generateSmokeTexture() {
  const size = 128
  const pixels = new Uint8Array(size * size * 4)
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const dx = (x - size / 2) / (size / 2)
    const dy = (y - size / 2) / (size / 2)
    const falloff = Math.max(0, 1 - Math.hypot(dx, dy)) ** 2
    const noise = 0.65 + 0.2 * Math.sin(x * 0.19 + Math.sin(y * 0.15)) + 0.15 * Math.cos(y * 0.23)
    const index = (y * size + x) * 4
    pixels[index] = pixels[index + 1] = pixels[index + 2] = 255
    pixels[index + 3] = Math.round(255 * falloff * noise)
  }
  const texture = new THREE.DataTexture(pixels, size, size)
  texture.needsUpdate = true
  return texture
}
function generateSmokeCube(texture) {
  return new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshLambertMaterial({
    color: 0x5354ff, map: texture, transparent: true,
  }))
}

function generateSphere(color) {
	const geometry = new THREE.CapsuleGeometry(0.2, 0.05, 4, 8)
	const material = new THREE.MeshStandardMaterial({ color: color })
	const capsule = new THREE.Mesh(geometry, material)

	geometry.scale(SCALE_SIZE, SCALE_SIZE, SCALE_SIZE)
	geometry.radius = 20
	geometry.translate(1, 1, 1)
	material.emissive = new THREE.Color(color)
	material.emissiveIntensity = 1.6

	return capsule
}

function generateCubeList(numberOfCubes) {
	let cubeList = []
	let validPositions = getValidLocation()
	for (let i = 0; i < numberOfCubes; i++) {

		const randomIndex = Math.floor(Math.random() * validPositions.length)
		const currentPosition = validPositions[randomIndex]

		let locationX = currentPosition[0]
		let locationY = currentPosition[1]

		validPositions.splice(randomIndex, 1)

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
	for (let i = 1; i < numberOfCubes; i++) {
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
	generateSmokeTexture,
	generateSmokeCube,
	generateSphere,
	generateCubeList,
	generatePlane,
	generateTransparentCubes
}