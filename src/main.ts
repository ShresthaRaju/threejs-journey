import './style.css'
import { Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, TextureLoader, TorusGeometry, WebGLRenderer } from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { GUI } from 'dat.gui'

const size = { width: window.innerWidth, height: window.innerHeight }
const canvas: HTMLElement = document.querySelector('#canvas')!
const text = `
    GETTING STARTED
      WITH THREE.JS
`;
// const clock = new Clock()

// data GUI
const gui = new GUI()

// scene
const scene = new Scene()

// texture
const textureLoader = new TextureLoader()
const matcapText = textureLoader.load('/matcaps/text.png')
const matcapDonut = textureLoader.load('/matcaps/donut.png')
// font
const fontLoader = new FontLoader();
fontLoader.load(
  // resource URL
  '/fonts/Hikou.json',

  // onLoad callback
  (font) => {
    // do something with the font
    const textGeometry = new TextGeometry(
      text,
      {
        font,
        size: 0.5,
        height: 0.2,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4
      }
    ).center()

    // create text
    const textMaterial = new MeshBasicMaterial({ map: matcapText })
    const textMesh = new Mesh(textGeometry, textMaterial)
    scene.add(textMesh)

    // create donuts
    const donutGeometry = new TorusGeometry(0.35, 0.17, 20, 45)
    const donutMaterial = new MeshBasicMaterial({ map: matcapDonut })
    // add donuts
    for (let index = 0; index < 250; index++) {
      const donut = new Mesh(donutGeometry, donutMaterial)

      donut.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10)
      donut.rotation.x = Math.PI * Math.random()
      donut.rotation.y = Math.PI * Math.random()

      const scaleFactor = Math.random()
      donut.scale.set(scaleFactor, scaleFactor, scaleFactor)

      scene.add(donut)
    }
  },

  // onProgress callback
  (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },

  // onError callback
  (err) => {
    console.error('Could not load font', err);
  }
);

// camera
const camera = new PerspectiveCamera(30, size.width / size.height, 1, 100)
camera.position.set(0, 0, 10);
scene.add(camera)
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'x', 0, 10)
cameraFolder.add(camera.position, 'y', 0, 10)
cameraFolder.add(camera.position, 'z', 0, 10)

// controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true // if you enable damping, do not forget to update the controls in each frame

// renderer
const renderer = new WebGLRenderer({ canvas: canvas, antialias: true })
renderer.setSize(size.width, size.height)

const animate = () => {
  // const elapsedTime = clock.getElapsedTime()
  // mesh.rotation.y = elapsedTime

  // update controls because of damping
  controls.update()

  renderer.render(scene, camera)

  window.requestAnimationFrame(animate)
}

animate()

window.addEventListener('resize', () => {
  const width = window.innerWidth
  const height = window.innerHeight

  size.width = width
  size.height = height

  // update camera
  camera.aspect = width / height
  camera.updateProjectionMatrix()

  // update renderer
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})

