import EventEmitter from './emitter'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default class Resource extends EventEmitter {
  sources: any
  items: any
  toLoad: number
  loaded: number
  loaders: any

  constructor(sources: any) {
    super()
    this.sources = sources

    // Setup
    this.items = {}
    this.toLoad = this.sources.length
    this.loaded = 0

    this.setLoaders()
    this.startLoading()
  }

  setLoaders() {
    this.loaders = {}
    this.loaders.gltfLoader = new GLTFLoader()
    this.loaders.textureLoader = new THREE.TextureLoader()
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
  }

  startLoading() {
    const loadMap: Record<string, THREE.Loader> = {
      'gltfModel': this.loaders.gltfLoader,
      'texture': this.loaders.textureLoader,
      'cubeTexture': this.loaders.cubeTextureLoader
    }
    
    for (const source of this.sources) {
      loadMap[source.type].load(source.path, (file: any) => {
        this.sourceLoaded(source, file)
      })
    }
  }

  sourceLoaded(source: any, file: any) {
    this.items[source.name] = file
    this.loaded++
    if (this.loaded === this.toLoad) {
      this.emit('ready')
    }
  }
}
