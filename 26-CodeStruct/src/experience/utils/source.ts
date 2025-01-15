export default [
  {
    name: 'environmentMapTexture',
    type: 'cubeTexture',
    path: [
      new URL('@/assets/textures/environmentMap/px.jpg', import.meta.url).href,
      new URL('@/assets/textures/environmentMap/nx.jpg', import.meta.url).href,
      new URL('@/assets/textures/environmentMap/py.jpg', import.meta.url).href,
      new URL('@/assets/textures/environmentMap/ny.jpg', import.meta.url).href,
      new URL('@/assets/textures/environmentMap/pz.jpg', import.meta.url).href,
      new URL('@/assets/textures/environmentMap/nz.jpg', import.meta.url).href,
    ]
  },
  {
    name: 'grassColorTexture',
    type: 'texture',
    path: new URL('@/assets/textures/dirt/color.jpg', import.meta.url).href
  },
  {
    name: 'grassNormalTexture',
    type: 'texture',
    path: new URL('@/assets/textures/dirt/normal.jpg', import.meta.url).href
  },
  {
    name: 'foxModel',
    type: 'gltfModel',
    path: new URL('@/assets/models/Fox/glTF/Fox.gltf', import.meta.url).href
  }
]
