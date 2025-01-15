import * as THREE from 'three'
import Experience from './experience.ts'
import Resources from './utils/resource.ts'
import Debug from './utils/debug.ts'
import GUI from 'lil-gui'

export default class Environment {
  private experience: Experience
  private scene: THREE.Scene
  private resources: Resources
  private sunLight?: THREE.DirectionalLight
  private environmentMap?: Record<string, any>
  private debug: Debug
  private debugFolder?: GUI

  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene!
    this.resources = this.experience.resources!
    this.debug = this.experience.debug!

    if(this.debug.active) {
      this.debugFolder = this.debug.ui?.addFolder('environment')
    }

    this.setSunLight()
    this.setEnvironmentMap()
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight('#ffffff', 4)
    this.sunLight.castShadow = true
    this.sunLight.shadow.camera.far = 15
    this.sunLight.shadow.mapSize.set(1024, 1024)
    this.sunLight.shadow.normalBias = 0.05
    this.sunLight.position.set(3.5, 2, -1.25)
    this.scene.add(this.sunLight)

    if(this.debug.active) {
      this.debugFolder!.add(this.sunLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
      this.debugFolder!.add(this.sunLight.position, 'x').min(-3).max(3).step(0.001).name('lightX')
      this.debugFolder!.add(this.sunLight.position, 'y').min(-3).max(3).step(0.001).name('lightY')
      this.debugFolder!.add(this.sunLight.position, 'z').min(-3).max(3).step(0.001).name('lightZ')
    }
  }

  setEnvironmentMap() {
    this.environmentMap = {}
    this.environmentMap.intensity = 0.4
    this.environmentMap.texture = this.resources.items.environmentMapTexture
    this.environmentMap.texture.encoding = THREE.SRGBColorSpace
    this.scene.environment = this.environmentMap.texture

    this.updateMaterials()

    if(this.debug.active) {
      this.debugFolder!
        .add(this.environmentMap, 'intensity')
        .min(0)
        .max(1)
        .step(0.001)
        .name('envMapIntensity')
        .onChange(() => {
          this.updateMaterials()
        })
    }
  }

  updateMaterials() {
    this.scene.traverse((child: any) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.envMap = this.environmentMap!.texture
        child.material.envMapIntensity = this.environmentMap!.intensity
        child.material.needsUpdate = true
      }
    })
  }
}
