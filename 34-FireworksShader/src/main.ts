import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import gsap from 'gsap'
import { Sky } from 'three/addons/objects/Sky.js'

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })

// Canvas
const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl')!

// Scene
const scene = new THREE.Scene()

// Loaders
const textureLoader = new THREE.TextureLoader()

/**
 * Sizes
 */
const sizes: any = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}
sizes.resolution = new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)
    sizes.resolution.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1.5, 0, 6)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Fireworks
 */
const textures = [
    textureLoader.load(new URL('@/particles/1.png', import.meta.url).href),
    textureLoader.load(new URL('@/particles/2.png', import.meta.url).href),
    textureLoader.load(new URL('@/particles/3.png', import.meta.url).href),
    textureLoader.load(new URL('@/particles/4.png', import.meta.url).href),
    textureLoader.load(new URL('@/particles/5.png', import.meta.url).href),
    textureLoader.load(new URL('@/particles/6.png', import.meta.url).href),
    textureLoader.load(new URL('@/particles/7.png', import.meta.url).href),
    textureLoader.load(new URL('@/particles/8.png', import.meta.url).href),
    textureLoader.load(new URL('@/particles/9.png', import.meta.url).href),
    textureLoader.load(new URL('@/particles/10.png', import.meta.url).href),
    textureLoader.load(new URL('@/particles/11.png', import.meta.url).href),
    textureLoader.load(new URL('@/particles/12.png', import.meta.url).href),
    textureLoader.load(new URL('@/particles/13.png', import.meta.url).href),
]
const createFirework = (
    count: number = 1000, 
    position: THREE.Vector3,
    size: number = 50,
    texture: THREE.Texture = textures[0],
    radius: number = 1,
    color: THREE.Color = new THREE.Color('#8affff')
) => {
    const positionsArray = new Float32Array(count * 3)
    const sizesArray = new Float32Array(count)
    const timeMultipleArray = new Float32Array(count)

    for(let i = 0; i < count; i++) {
        const i3 = i * 3

        const spherical = new THREE.Spherical(
            radius * (0.75 + Math.random() * 0.25), 
            Math.random() * Math.PI, 
            Math.random() * Math.PI * 2
        )
        const position = new THREE.Vector3()
        position.setFromSpherical(spherical)

        positionsArray[i3 + 0] = position.x
        positionsArray[i3 + 1] = position.y
        positionsArray[i3 + 2] = position.z
 
        sizesArray[i] = Math.random();
        timeMultipleArray[i] = 1 + Math.random();
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positionsArray, 3))
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizesArray, 1))
    geometry.setAttribute('aTimeMultiple', new THREE.BufferAttribute(timeMultipleArray, 1))

    texture.flipY = false
    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
            uSize: new THREE.Uniform(size),
            uResolution: new THREE.Uniform(sizes.resolution),
            uTexture: new THREE.Uniform(texture),
            uColor: new THREE.Uniform(color),
            uProgress: new THREE.Uniform(0)
        }
    })

    // points
    const fireworks = new THREE.Points(geometry, material)
    fireworks.position.copy(position)
    scene.add(fireworks)

    // Destroy 
    const destroy = () => {
        scene.remove(fireworks)
        geometry.dispose()
        material.dispose()
    }
    // animation
    gsap.to(material.uniforms.uProgress, {
        value: 1,
        duration: 3,
        ease: 'linear', 
        onComplete: destroy
    })
} 

const createRandomFirework = () => {
    const count = Math.round(400 + Math.random() * 1000)
    const size = 0.1 + Math.random() * 0.1
    const texture = textures[Math.round(Math.random() * (textures.length - 1))]
    const position = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        Math.random(),
        (Math.random() - 0.5) * 2
    )
    const color = new THREE.Color()
    color.setHSL(Math.random(), 1, 0.7)

    const radius = 1 + Math.random() * 2
    createFirework(count, position, size, texture, radius, color)
}

window.addEventListener('click', createRandomFirework)

// Sky
const sky = new Sky()
sky.scale.setScalar(450000)
scene.add(sky)

const sun = new THREE.Vector3()

const skyParameters = {
    turbidity: 10,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.95,
    elevation: -2.2,
    azimuth: 180,
    exposure: renderer.toneMappingExposure
}

const updateSky = () =>
{
    const uniforms = sky.material.uniforms
    uniforms['turbidity'].value = skyParameters.turbidity
    uniforms['rayleigh'].value = skyParameters.rayleigh
    uniforms['mieCoefficient'].value = skyParameters.mieCoefficient
    uniforms['mieDirectionalG'].value = skyParameters.mieDirectionalG

    const phi = THREE.MathUtils.degToRad(90 - skyParameters.elevation)
    const theta = THREE.MathUtils.degToRad(skyParameters.azimuth)

    sun.setFromSphericalCoords(1, phi, theta)

    uniforms['sunPosition'].value.copy(sun)

    renderer.toneMappingExposure = skyParameters.exposure
    renderer.render(scene, camera)
}

gui.add(skyParameters, 'turbidity', 0.0, 20.0, 0.1).onChange(updateSky)
gui.add(skyParameters, 'rayleigh', 0.0, 4, 0.001).onChange(updateSky)
gui.add(skyParameters, 'mieCoefficient', 0.0, 0.1, 0.001).onChange(updateSky)
gui.add(skyParameters, 'mieDirectionalG', 0.0, 1, 0.001).onChange(updateSky)
gui.add(skyParameters, 'elevation', -3, 10, 0.01).onChange(updateSky)
gui.add(skyParameters, 'azimuth', - 180, 180, 0.1).onChange(updateSky)
gui.add(skyParameters, 'exposure', 0, 1, 0.0001).onChange(updateSky)

updateSky()

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()