import * as THREE from 'three'
import Experience from './experience.ts'
import Resources from './utils/resource.ts'

export default class Floor {
  private experience: Experience
  private scene: THREE.Scene
  private resources: Resources
  private geometry?: THREE.CircleGeometry
  private textures?: Record<string, any>
  private material?: THREE.MeshStandardMaterial
  private mesh?: THREE.Mesh

  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene!
    this.resources = this.experience.resources!

    this.setGeometry()
    this.setTextures()
    this.setMaterial()
    this.setMesh()
  }

  setGeometry() {
    this.geometry = new THREE.CircleGeometry(5, 64)
  }

  setTextures() {
    this.textures = {}
    this.textures.color = this.resources.items.grassColorTexture
    this.textures.normal = this.resources.items.grassNormalTexture

    this.textures.color.encoding = THREE.SRGBColorSpace
    // this.textures.color.colorSpace = THREE.SRGBColorSpace
    this.textures.color.repeat.set(1.5, 1.5)
    this.textures.color.wrapS = THREE.RepeatWrapping
    this.textures.color.wrapT = THREE.RepeatWrapping

    this.textures.normal.repeat.set(1.5, 1.5)
    this.textures.normal.wrapS = THREE.RepeatWrapping
    this.textures.normal.wrapT = THREE.RepeatWrapping
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      map: this.textures!.color,
      normalMap: this.textures!.normal,
    })
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry!, this.material!)
    this.mesh.rotation.x = -Math.PI / 2
    this.mesh.receiveShadow = true
    this.scene.add(this.mesh)
  }
}
