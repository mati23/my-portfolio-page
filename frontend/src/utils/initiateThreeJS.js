import * as THREE from "three"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass.js"
import { GrannyKnot, TorusKnot, TrefoilKnot, VivianiCurve } from "three/examples/jsm/curves/CurveExtras.js"
import ThreeDUtils from "./ThreeDUtils"

export default function initiateThreeJS(container, onContextLost) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(80, 1, 0.1, 1000)
  const composer = new EffectComposer(renderer)
  const clock = new THREE.Clock()
  let frame = 0
  let elapsed = 0
  let disposed = false
  let observer
  const dispose = () => {
    if (disposed) return
    disposed = true
    cancelAnimationFrame(frame)
    observer?.disconnect()
    document.removeEventListener("visibilitychange", visibility)
    renderer.domElement.removeEventListener("webglcontextlost", contextLost)
    const resources = new Set()
    scene.traverse(object => {
      if (object.geometry) resources.add(object.geometry)
      for (const material of (Array.isArray(object.material) ? object.material : [object.material])) {
        if (!material) continue
        resources.add(material)
        for (const value of Object.values(material)) if (value?.isTexture) resources.add(value)
      }
    })
    resources.forEach(resource => resource.dispose())
    composer.passes.forEach(pass => pass.dispose?.())
    composer.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
    renderer.domElement.remove()
    scene.clear()
  }
  const contextLost = event => { event.preventDefault(); dispose(); onContextLost?.() }
  const visibility = () => {
    cancelAnimationFrame(frame)
    if (!document.hidden && !disposed) { clock.start(); frame = requestAnimationFrame(animate) }
  }
  let animate
  try {
    scene.background = new THREE.Color(0x000000)
    scene.fog = new THREE.Fog(0x000000, 1, 12.8)
    camera.position.z = 6
    const light = new THREE.SpotLight(0x11155c)
    light.position.set(0, 0, 2.5)
    light.penumbra = 0.5
    light.intensity = 5
    scene.add(light)
    ThreeDUtils.generateCubeList(20).forEach(cube => scene.add(cube))
    const transparent = ThreeDUtils.generateTransparentCubes(2)
    transparent.forEach(cube => scene.add(cube))
    const curves = [new GrannyKnot(), new TrefoilKnot(), new TorusKnot(), new VivianiCurve()]
    const bulbs = [0xff1900, 0x22ff22, 0x0000ff, 0xf0ff11].map(color => ThreeDUtils.generateSphere(color))
    bulbs.forEach(bulb => scene.add(bulb))
    const texture = ThreeDUtils.generateSmokeTexture()
    const smoke = Array.from({ length: 40 }, () => {
      const particle = ThreeDUtils.generateSmokeCube(texture)
      particle.position.set(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 3 - 4)
      particle.rotation.z = Math.random() * Math.PI * 2
      scene.add(particle)
      return particle
    })
    scene.add(ThreeDUtils.generatePlane())
    composer.addPass(new RenderPass(scene, camera))
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), 2.6, 0.8, 0.6))
    const afterimage = new AfterimagePass()
    afterimage.uniforms.damp.value = 0.9811
    composer.addPass(afterimage)
    const resize = () => {
      if (disposed) return
      const width = Math.max(1, container.clientWidth)
      const height = Math.max(1, container.clientHeight)
      // Bound postprocessing buffers even on large or high-DPI displays.
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5, 1920 / width, 1080 / height)
      renderer.setPixelRatio(ratio)
      renderer.setSize(width, height)
      composer.setPixelRatio(ratio)
      composer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
    animate = () => {
      if (disposed || document.hidden) return
      const delta = Math.min(clock.getDelta(), 0.05)
      elapsed += delta
      const progress = (elapsed % 20) / 20
      smoke.forEach(particle => { particle.rotation.z += delta * 0.2 })
      transparent.forEach((cube, index) => {
        const step = delta * (index % 2 ? -0.1 : 0.1)
        cube.rotation.x += step
        cube.rotation.z += step
      })
      bulbs.forEach((bulb, index) => {
        bulb.position.copy(curves[index].getPoint(progress)).multiply(new THREE.Vector3(0.05, 0.05, 0))
          .sub(new THREE.Vector3(1.5, 0.1, -0.2))
      })
      composer.render(delta)
      frame = requestAnimationFrame(animate)
    }
    renderer.domElement.setAttribute("aria-hidden", "true")
    container.append(renderer.domElement)
    renderer.domElement.addEventListener("webglcontextlost", contextLost)
    document.addEventListener("visibilitychange", visibility)
    observer = new ResizeObserver(resize)
    observer.observe(container)
    resize()
    if (!document.hidden) frame = requestAnimationFrame(animate)
    return { dispose }
  } catch (error) {
    dispose()
    throw error
  }
}
