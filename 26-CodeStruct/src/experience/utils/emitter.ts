import Emitter from 'emittery'

const emitter = new Emitter()

export default class EventEmitter {
  emitter: Emitter

  constructor() {
    this.emitter = emitter
  }

  emit(event: string, data?: any) {
    this.emitter.emit(event, data)
  }

  on(event: string, callback: (data: any) => void) {
    this.emitter.on(event, callback)
  }

  off(event: string, callback: (data: any) => void) {
    this.emitter.off(event, callback)
  }
}
