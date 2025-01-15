import * as THREE from 'three'
import Experience from './experience.ts'
import Environment from './environment.ts'
import Resources from './utils/resource.ts'
import Floor from './floor.ts'
import Fox from './fox.ts'

export default class World {
  private experience: Experience
  public scene: THREE.Scene
  public environment?: Environment
  public floor?: Floor
  private resources: Resources
  public fox?: Fox

  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene!
    this.resources = this.experience.resources!

    this.resources.on('ready', () => {
      this.floor = new Floor()
      this.fox = new Fox()
      this.environment = new Environment()
    })
  }

  update() {
    if (this.fox) {
      this.fox.update()
    }
  }
}
