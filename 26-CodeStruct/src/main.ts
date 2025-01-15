import './style.css'
import Experience from './experience/experience.ts'

const canvas = document.querySelector('canvas') as HTMLCanvasElement
const experience = new Experience(canvas)

console.log(experience)
