import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import CANNON from 'cannon'

/**
 * Debug
 */
const gui = new GUI()
const debugObject: any = {}

debugObject.createSphere = () => {
    const radius = Math.random() * 0.5 + 0.1
    const position = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        3,
        (Math.random() - 0.5) * 10
    )
    createSphere(radius, position)
}

debugObject.createBox = () => {
    const width = Math.random() * 0.5 + 0.1
    const height = Math.random() * 0.5 + 0.1
    const depth = Math.random() * 0.5 + 0.1
    const position = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        3,
        (Math.random() - 0.5) * 10
    )
    createBox(width, height, depth, position)
}

debugObject.reset = () => {
    spheres.forEach((sphere) => {
        world.removeBody(sphere.body)
        scene.remove(sphere.mesh)
    })
    boxs.forEach((box) => {
        world.removeBody(box.body)
        scene.remove(box.mesh)
        box.body.removeEventListener('collide', () => {
            // console.log('collide', event)
          
        })
    })
}

gui.add(debugObject, 'createSphere')
gui.add(debugObject, 'createBox')
gui.add(debugObject, 'reset')
/**
 * Base
 */
// Canvas
const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl')!

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(- 3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Utils
 */
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
world.gravity.set(0, -9.82, 0)
const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
    friction: 0.1,
    restitution: 0.7
})
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body({
    mass: 0,
    shape: floorShape,
    material: defaultMaterial,
})
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
world.addBody(floorBody)

const spheres: any[] = []

const sphereGeometry = (radius: number) => new THREE.SphereGeometry(radius, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5
})

const createSphere = (radius: number, position: THREE.Vector3) => {
    const mesh = new THREE.Mesh( sphereGeometry(radius), sphereMaterial )
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    const sphereShape = new CANNON.Sphere(radius)
    const sphereBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(position.x, position.y, position.z),
        shape: sphereShape,
        material: defaultMaterial
    })
    world.addBody(sphereBody)

    spheres.push({
        mesh,
        body: sphereBody
    })
}

const boxs: any[] = []
const boxGeometry =  new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5
})
const createBox = (width: number, height: number, depth: number, position: THREE.Vector3) => {
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial)
    mesh.scale.set(width, height, depth)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    const boxShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2))
    const boxBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(position.x, position.y, position.z),
        shape: boxShape,
        material: defaultMaterial
    })
    boxBody.addEventListener('collide', (event: any) => {
        // console.log('collide', event)
        const alongNormal = event.contact.getImpactVelocityAlongNormal()

        if (alongNormal > 1.5) {
            console.log('collide')
        }
    })
    world.addBody(boxBody)

    boxs.push({
        mesh,
        body: boxBody
    })
}


/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    // Update physics
    world.step(1 / 60, deltaTime, 3)
    spheres.forEach((sphere) => {
        sphere.mesh.position.copy(sphere.body.position)
        sphere.mesh.quaternion.copy(sphere.body.quaternion)
    })

    boxs.forEach((box) => {
        box.mesh.position.copy(box.body.position)
        box.mesh.quaternion.copy(box.body.quaternion)
    })

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()