import * as THREE from 'three'
import Sizes from './utils/sizes.ts'
import Time from './utils/time.ts'
import Camera from './camera.ts'
import Renderer from './renderer.ts'
import World from './world.ts'
import Resources from './utils/resource.ts'
import source from './utils/source.ts'
import Debug from './utils/debug.ts'

let instance: Experience

export default class Experience {
    canvas?: HTMLCanvasElement
    sizes?: Sizes
    time?: Time
    scene?: THREE.Scene
    camera?: Camera
    renderer?: Renderer
    world?: World
    resources?: Resources
    debug?: Debug

    constructor(canvas?: HTMLCanvasElement) {
        if (instance) {
            return instance
        }

        instance = this 

        // Global access
        window.experience = this

        // Setup
        this.canvas = canvas
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.debug = new Debug()
        this.resources = new Resources(source)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()

        // size resize event
        this.sizes.on('resize', () => {
          this.resize()
        })

        // time tick event
        this.time.on('tick', () => {
          this.update()
        })
    }

    resize() {
      this.camera?.resize()
      this.renderer?.resize()
    }

    update() {
      this.camera?.update()
      this.world?.update()
      this.renderer?.update()
    }

    destroy() {
      // callback off
      // this.sizes?.off('resize')
      // this.time?.off('tick')

      // resources
      this.scene?.traverse((child) => {
        if(child instanceof THREE.Mesh) {
          child.geometry.dispose()

          for(const key in child.material) {
            const value = child.material[key]
            if(value && typeof value.dispose === 'function') {
              value.dispose()
            }
          }
        }
      })

      this.camera?.controls?.dispose()
      this.renderer?.instance?.dispose()

      if(this.debug?.active) {
        this.debug?.ui?.destroy()
      }
    }
}
