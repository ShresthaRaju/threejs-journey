import './style.css'
import { AmbientLight, BoxGeometry, Clock, ConeGeometry, DirectionalLight, Float32BufferAttribute, Fog, Group, Mesh, MeshStandardMaterial, PCFSoftShadowMap, PerspectiveCamera, PlaneGeometry, PointLight, RepeatWrapping, Scene, SphereGeometry, TextureLoader, WebGLRenderer } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui'

const size = {
    width: window.innerWidth,
    height: window.innerHeight
}
const canvas: HTMLElement = document.querySelector('#haunted_house')!
const gui = new GUI()
const clock = new Clock()

// scene
const scene = new Scene()

/**
 * Textures
 */
const textureLoader = new TextureLoader()

// door textures
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

// wall textures
const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

// grass textures
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

// since there is a lot of grass, we need to reduce its quantity
grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassColorTexture.wrapS = RepeatWrapping
grassAmbientOcclusionTexture.wrapS = RepeatWrapping
grassNormalTexture.wrapS = RepeatWrapping
grassRoughnessTexture.wrapS = RepeatWrapping

grassColorTexture.wrapT = RepeatWrapping
grassAmbientOcclusionTexture.wrapT = RepeatWrapping
grassNormalTexture.wrapT = RepeatWrapping
grassRoughnessTexture.wrapT = RepeatWrapping

// floor
const floor = new Mesh(
    new PlaneGeometry(20, 20),
    new MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture,
    })
)
floor.geometry.setAttribute(
    'uv2',
    new Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)
floor.rotation.x = -Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * House
 */
const house = new Group()
scene.add(house)

// walls
const walls = new Mesh(
    new BoxGeometry(4, 2.5, 4),
    new MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture,
    })
)
walls.geometry.setAttribute(
    'uv2',
    new Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
)
walls.position.y = 2.5 * 0.5
house.add(walls)

// roof
const roof = new Mesh(
    new ConeGeometry(3.5, 1, 4),
    new MeshStandardMaterial({ color: '#b35f45' })
)
roof.rotation.y = Math.PI * 0.25
roof.position.y = 2.5 + 0.5
house.add(roof)

// door
const door = new Mesh(
    new PlaneGeometry(2.2, 2.2, 100, 100),
    new MeshStandardMaterial({
        map: doorColorTexture,
        alphaMap: doorAlphaTexture,
        transparent: true,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
)
door.geometry.setAttribute(
    'uv2',
    new Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)
door.position.y = 1
door.position.z = 2 + 0.01
house.add(door)

// bushes
const bushes = [
    {
        scale: 0.5,
        position: [0.8, 0.2, 2.2],
    },
    {
        scale: 0.25,
        position: [1.4, 0.1, 2.1],
    },
    {
        scale: 0.4,
        position: [- 0.8, 0.1, 2.2],
    },
    {
        scale: 0.15,
        position: [- 1, 0.05, 2.6],
    },
]

const bushGeometry = new SphereGeometry(1, 16, 16)
const bushMaterial = new MeshStandardMaterial({ color: '#89c584' })

for (let index = 0; index < bushes.length; index++) {
    const bush = new Mesh(bushGeometry, bushMaterial)
    bush.scale.set(bushes[index].scale, bushes[index].scale, bushes[index].scale)
    bush.position.set(bushes[index].position[0], bushes[index].position[1], bushes[index].position[2])
    bush.castShadow = true
    house.add(bush)
}

/**
 * Tombs
 */
const tombs = new Group()
scene.add(tombs)

const tombGeometry = new BoxGeometry(0.6, 0.8, 0.2)
const tombMaterial = new MeshStandardMaterial({ color: '#b2b6b1' })

for (let index = 0; index < 50; index++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 6
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const tomb = new Mesh(tombGeometry, tombMaterial)
    tomb.position.set(x, 0.3, z)
    tomb.rotation.y = (Math.random() - 0.5) * 0.5
    tomb.rotation.z = (Math.random() - 0.5) * 0.5
    tomb.castShadow = true
    tombs.add(tomb)
}

/**
 * Fog
 */

const fog = new Fog('#262837', 1, 15)
scene.fog = fog

/**
 * Lights 
 */
// ambient light
const ambientLight = new AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// door light
const doorLight = new PointLight('#ff7d46', 1, 7)
doorLight.position.set(0, 2.2, 2.5)
house.add(doorLight)

/**
 * Ghosts
 */
const ghost1 = new PointLight('#ff00ff', 1, 3)
const ghost2 = new PointLight('#00ffff', 2, 3)
const ghost3 = new PointLight('#ffff00', 1, 3)
scene.add(ghost1, ghost2, ghost3)

// camera
const camera = new PerspectiveCamera(75, size.width / size.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// renderer
const renderer = new WebGLRenderer({
    canvas,
    antialias: true
})

renderer.setSize(size.width, size.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')

// enable shadow
renderer.shadowMap.enabled = true
renderer.shadowMap.type = PCFSoftShadowMap

moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
floor.receiveShadow = true

// optimise shadows
moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7

// animate
const animate = () => {
    // update controls for damping
    controls.update()

    const elapsedTime = clock.getElapsedTime()

    // animate ghosts
    const ghost1Angle = elapsedTime * 0.35
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.y = Math.sin(elapsedTime * 5)
    ghost1.position.z = Math.sin(ghost1Angle) * 4

    const ghost2Angle = -elapsedTime * 0.5
    ghost2.position.x = Math.cos(ghost2Angle) * 6
    ghost2.position.y = Math.sin(elapsedTime * 3) + Math.sin(elapsedTime * 2)
    ghost2.position.z = Math.sin(ghost2Angle) * 6

    const ghost3Angle = -elapsedTime * 0.7
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.4))
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 1.6)
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.24))

    renderer.render(scene, camera)

    window.requestAnimationFrame(animate)
}

animate()

// react to window resize
window.addEventListener('resize', () => {
    const width = window.innerWidth
    const height = window.innerHeight

    // update size
    size.width = width
    size.height = height

    // update camera
    camera.aspect = width / height
    camera.updateProjectionMatrix()

    // update renderer
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})