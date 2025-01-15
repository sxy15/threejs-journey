import * as THREE from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Experience from './experience.ts'
import Resources from './utils/resource.ts'
import Time from './utils/time.ts'
import Debug from './utils/debug.ts'
import GUI from 'lil-gui'

export default class Fox {
  private experience: Experience
  private scene: THREE.Scene
  private resources: Resources
  private resource: GLTF
  private animation: any
  private time: Time
  private debug: Debug
  debugFolder?: GUI

  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene!
    this.resources = this.experience.resources!
    this.resource = this.resources.items.foxModel
    this.time = this.experience.time!
    this.debug = this.experience.debug!

    if(this.debug.active) {
      this.debugFolder = this.debug.ui?.addFolder('fox')
    }

    this.setModel()
    this.setAnimation()
  }

  setModel() {
    this.resource.scene.scale.set(0.025, 0.025, 0.025)
    this.scene.add(this.resource.scene)

    this.resource.scene.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
      }
    })
  }

  setAnimation() {
    this.animation = {}
    this.animation.mixer = new THREE.AnimationMixer(this.resource.scene)
    this.animation.actions = {}
    this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
    this.animation.actions.walk = this.animation.mixer.clipAction(this.resource.animations[1])
    this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2])
    this.animation.actions.current = this.animation.actions.idle
    this.animation.actions.current.play()

    this.animation.play = (name: string) => {
      const newAction = this.animation.actions[name]
      const oldAction = this.animation.actions.current

      newAction.reset()
      newAction.play()
      newAction.crossFadeFrom(oldAction, 0.5)

      this.animation.actions.current = newAction
    }

    if(this.debug.active) {
      const debugObject = {
        playIdle: () => this.animation.play('idle'),
        playWalk: () => this.animation.play('walk'),
        playRunning: () => this.animation.play('running'),
      }

      this.debugFolder?.add(debugObject, 'playIdle')
      this.debugFolder?.add(debugObject, 'playWalk')
      this.debugFolder?.add(debugObject, 'playRunning')
    }
  }

  update() {
    this.animation.mixer.update(this.time.delta * 0.001)
  }
}
