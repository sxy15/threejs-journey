import EventEmitter from './emitter'

export default class Sizes extends EventEmitter {
    width: number
    height: number
    pixelRatio: number
    
    constructor() {
        super()
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

        this.init()
    }

    resize() {
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

        this.emit('resize')
    }

    init() {
      window.addEventListener('resize', () => {
        this.resize()
      })
    }
}
