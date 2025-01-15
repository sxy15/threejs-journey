import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Sizes from './utils/sizes.ts'
import Experience from './experience.ts'

export default class Camera {
    experience: Experience
    sizes: Sizes
    canvas: HTMLCanvasElement
    scene: THREE.Scene
    instance?: THREE.PerspectiveCamera
    controls?: OrbitControls

    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes!
        this.canvas = this.experience.canvas!
        this.scene = this.experience.scene!

        this.setInstance()
        this.setOrbitControls()
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            35, 
            this.sizes.width / this.sizes.height, 
            0.1, 
            100
        )

        this.instance.position.set(6, 4, 8)
        this.scene.add(this.instance)
    }

    setOrbitControls() {
        this.controls = new OrbitControls(this.instance!, this.canvas)
        this.controls.enableDamping = true
    }

    resize() {
        this.instance!.aspect = this.sizes.width / this.sizes.height
        this.instance!.updateProjectionMatrix()
    }

    update() {
        this.controls?.update()
    }
}