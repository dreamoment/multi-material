<h1 align="center">multi-material</h1>

![](/docs/preview.gif)

语言: [English](README.md) | 中文简体

## multi-material 是什么 ?

多纹理材质。

> 请确保`threejs`版本大于`r118`，否则会出现因`glsl`版本过低，导致着色器代码报错。

## 特性

- 轻量易用

- 基于`threejs`原生材质

- 支持插值动画

- 支持`typescript`

## 安装

```agsl
npm i @dreamoment/multi-material
```

## 示例

```
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import TWEEN from '@tweenjs/tween.js'
import MultiMaterial from '../package/index'


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

获取 `threejs` 材质实例。

```
getMaterial(): MaterialEnabled
```

### switchTexture

切换纹理。 

通过更改回调参数 `lerp.value` 的值，可以实现插值动画。

```
interface UniformNumber {
    value: number | null
}
type CallbackUniformNumber = (uniformNumber: UniformNumber) => void

switchTexture(index: number, callback?: CallbackUniformNumber): void
```

### addTexture

添加单个纹理。

```
addTexture(texture: THREE.Texture): void
```

### addTextures

添加多个纹理。

```
addTextures(textures: THREE.Texture[]): void
```