<h1 align="center">multi-material</h1>

![](/docs/preview.gif)

Language: English | [中文简体](README_zh_cn.md)

## What is multi-material ?

Material with multiple textures.

> Make sure that the version of `threejs` is greater than `r118`, otherwise the shader code will error because the version of `glsl` is too low.

## Features

- lightweight and easy to use

- based on `threejs` native material

- support interpolation animation

- support `typescript`

## Install

```agsl
npm i @dreamoment/multi-material
```

## Examples

```
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import TWEEN from '@tweenjs/tween.js'
import MultiMaterial from '@dreamoment/multi-material'


const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 )
const ambientLight = new THREE.AmbientLight(0xffffff)
const directionalLight = new THREE.DirectionalLight(0xffffff)
directionalLight.position.set(1, 1, 1)
scene.add(ambientLight, directionalLight)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

camera.position.y += 10


const textureLoader = new THREE.TextureLoader()
const textures = [
  '/images/red.png',
  '/images/green.png',
  '/images/blue.png'
].map((url) => {
  return textureLoader.load(url)
})

const geometry = new THREE.BoxGeometry(5, 5, 5)
const multiMaterial = new MultiMaterial(new THREE.MeshStandardMaterial())
multiMaterial.addTextures(textures)

// or
// const multiMaterial = new MultiMaterial(new THREE.MeshStandardMaterial({
//   map: textures[0]
// }))
// multiMaterial.addTexture(textures[1])
// multiMaterial.addTexture(textures[2])

const material = multiMaterial.getMaterial()
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const animate = () => {
  controls.update()
  TWEEN.update()
  renderer.render(scene, camera)
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})


let index = 0
const idInterval = setInterval(() => {
  (index < textures.length - 1) ? index++ : index = 0
  const changeTexture = (index) => {
    // no tween animation
    // multiMaterial.switchTexture(index)
    multiMaterial.switchTexture(index, (lerp) => {
      lerp.value = 0
      new TWEEN.Tween(lerp)
          .to({ value: 1 }, 1000)
          .start()
    })
  }
  changeTexture(index)
}, 2000)

renderer.setAnimationLoop(animate)
```

## API

```
type MaterialEnabled = THREE.LineBasicMaterial |
    THREE.MeshBasicMaterial |
    THREE.MeshDepthMaterial |
    THREE.MeshDistanceMaterial |
    THREE.MeshLambertMaterial |
    THREE.MeshMatcapMaterial |
    THREE.MeshPhongMaterial |
    THREE.MeshPhysicalMaterial |
    THREE.MeshStandardMaterial |
    THREE.MeshToonMaterial |
    THREE.PointsMaterial |
    THREE.SpriteMaterial

new MultiMaterial(material: MaterialEnabled)
```

### getMaterial

Gets the `threejs` material instance.

```
getMaterial(): MaterialEnabled
```

### switchTexture

Switch textures.

Interpolation animation can be implemented by changing the value of the callback parameter `lerp.value`.

```
interface UniformNumber {
    value: number | null
}
type CallbackUniformNumber = (uniformNumber: UniformNumber) => void

switchTexture(index: number, callback?: CallbackUniformNumber): void
```

### addTexture

Add a single texture.

```
addTexture(texture: THREE.Texture): void
```

### addTextures

Add multiple textures.

```
addTextures(textures: THREE.Texture[]): void
```