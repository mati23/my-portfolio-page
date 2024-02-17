import * as THREE from "three"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass"
import { GrannyKnot, TorusKnot, TrefoilKnot, VivianiCurve } from "three/examples/jsm/curves/CurveExtras"

import ThreeDUtils from "./ThreeDUtils"

const initiateThreeJS = () => {
	const animateSmoke = (smokesArray) => {
		requestAnimationFrame(animateSmoke)
		evolveSmoke(smokesArray)
	}

	const evolveSmoke = (smokesArray) => {
		const delta = clock.getDelta()
		let sp = smokesArray.length
		while (sp--) {
			smokesArray[sp].rotation.z += delta * 20.5
		}
	}

	const animateTransparentCubes = () => {
		const delta = clock.getDelta()
		requestAnimationFrame(animateTransparentCubes)

		for (let listItem = 0; listItem < transparentCubeList.length; listItem++) {
			if (listItem % 2 == 0) {
				transparentCubeList[listItem].rotation.z += delta * 0.1
				transparentCubeList[listItem].rotation.x += delta * 0.1
			} else {
				transparentCubeList[listItem].rotation.z += delta * -0.1
				transparentCubeList[listItem].rotation.x += delta * -0.1
			}

		}
	}

	const animateCapsule = () => {
		const time = clock.getElapsedTime()
		const looptime = 20
		const t = (time % looptime) / looptime

		for (let item = 0; item <= 4; item++) {
			const position = lightPathCurves[item].geometry.parameters.path.getPoint(t)
			lightBulbs[item].position.add(position).multiply(new THREE.Vector3(0.05, 0.05, 0))
				.sub(new THREE.Vector3(1.5, 0.1, -0.2))
		}

		requestAnimationFrame(animateCapsule)
		composer.render(scene, camera)
	}

	const widthScreen = window.innerWidth
	const heightScreen = window.innerHeight
	const aspectRatio = widthScreen / heightScreen

	const light = new THREE.SpotLight(0x11155C)
	const clock = new THREE.Clock()
	const scene = new THREE.Scene()
	const renderer = new THREE.WebGLRenderer({ alpha: true })
	const camera = new THREE.PerspectiveCamera(80, aspectRatio, 0.1, 1000)

	const cubeList = ThreeDUtils.generateCubeList(20)
	const transparentCubeList = ThreeDUtils.generateTransparentCubes(2)
	const lightBulbs = []
	const lightPathCurves = []
	const colors = [0xff1900, 0x22ff22, 0x0000ff, 0xf0ff11]
	const curves = [new GrannyKnot(), new TrefoilKnot(), new TorusKnot(), new VivianiCurve()]
	const renderScene = new RenderPass(scene, camera)

	scene.background = new THREE.Color(0x000000)
	const composer = new EffectComposer(renderer)
	composer.addPass(renderScene)

	const smokesArray = []

	for (let item = 0; item <= 4; item++) {
		const capsule = ThreeDUtils.generateSphere(colors[item])
		lightBulbs.push(capsule)
	}

	for (let i = 0; i <= 4; i++) {
		const grannyKnotCurve = curves[i]
		const geometryCurve = new THREE.TubeGeometry(grannyKnotCurve, 100, 1, 3, true)
		const curveMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: true, side: THREE.FrontSide })
		const tube = new THREE.Mesh(geometryCurve, curveMaterial)
		tube.position.set(i, i, 0)
		tube.rotation.set(0, 0, i * 2.45)
		tube.scale.set(0.1 * i, 0.1, 0.0)
		lightPathCurves.push(tube)

	}

	const bloomPass = new UnrealBloomPass(
		new THREE.Vector2(widthScreen, heightScreen),
		2.6,
		0.8,
		0.6
	)

	composer.addPass(bloomPass)
	composer.setSize(widthScreen, heightScreen)

	const afterImagePass = new AfterimagePass()
	afterImagePass.uniforms["damp"] = { value: 0.9811 }
	composer.addPass(afterImagePass)


	for (let p = 0; p < 40; p++) {
		const particle = ThreeDUtils.generateSmokeCube()
		particle.position.set(
			Math.random() * 500 - 250,
			Math.random() * 500 - 250,
			Math.random() * 3 - 4
		)
		particle.rotation.z = Math.random() * 360
		scene.add(particle)
		smokesArray.push(particle)
	}

	const plane = ThreeDUtils.generatePlane()
	scene.add(plane)
	light.position.set(0, 0, 2.5)
	light.penumbra = 0.5
	light.intensity = 5

	renderer.setSize(widthScreen, heightScreen)

	cubeList.forEach((cube) => scene.add(cube))
	transparentCubeList.forEach((cube) => scene.add(cube))

	scene.add(light)
	lightBulbs.forEach(lightBulb => scene.add(lightBulb))
	scene.fog = new THREE.Fog(0x000000, 1, 12.8)
	camera.position.z = 6

	animateTransparentCubes()
	animateSmoke(smokesArray)
	animateCapsule()

	return { renderer }
}

export default initiateThreeJS