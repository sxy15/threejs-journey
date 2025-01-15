import * as THREE from 'three'
import Experience from './experience.ts'
import Sizes from './utils/sizes.ts'
import Camera from './camera.ts'

export default class Renderer {
    private experience: Experience
    private canvas: HTMLCanvasElement
    private sizes: Sizes
    private scene: THREE.Scene
    private camera: Camera
    public instance?: THREE.WebGLRenderer

    constructor() {
        this.experience = new Experience()
        this.canvas = this.experience.canvas!
        this.sizes = this.experience.sizes!
        this.scene = this.experience.scene!
        this.camera = this.experience.camera!

        this.setInstance()
    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })
        const renderer = this.instance!
        renderer.toneMapping = THREE.CineonToneMapping
        renderer.toneMappingExposure = 1.75
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        renderer.setClearColor('#211d20')
        renderer.setSize(this.sizes.width, this.sizes.height)
        renderer.setPixelRatio(this.sizes.pixelRatio)
    }

    resize() {
        this.instance!.setSize(this.sizes.width, this.sizes.height)
        this.instance!.setPixelRatio(this.sizes.pixelRatio)
    }

    update() {
        this.instance!.render(this.scene, this.camera.instance!)
    }
}
