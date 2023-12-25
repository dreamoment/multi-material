import * as THREE from 'three'

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

interface UniformTexture {
    value: THREE.Texture | null
}

interface UniformNumber {
    value: number | null
}

type CallbackUniformNumber = (uniformNumber: UniformNumber) => void

class MultiMaterial {

    prevIndex: number
    material: MaterialEnabled
    textures: THREE.Texture[]
    map0: UniformTexture = {
        value: null
    }
    lerp: UniformNumber = {
        value: 1
    }

    constructor(material: MaterialEnabled) {
        this.prevIndex = 0
        this.material = material
        this.textures = []

        const map = this.material.map
        if (map) {
            this.addTexture(map)
        }

        this.material.onBeforeCompile = shader => {
            shader.uniforms.map0 = this.map0
            shader.uniforms.lerp = this.lerp

            shader.fragmentShader = `
                uniform sampler2D map0;
                uniform float lerp;
                ${shader.fragmentShader}
            `.replace(
                `#include <map_fragment>`,
                `
                      #ifdef USE_MAP
                        vec4 texelColor0 = texture2D(map0, vMapUv);
                        vec4 texelColor1 = texture2D(map, vMapUv);
                        vec4 texelColor = mix(texelColor0, texelColor1, lerp);
                        diffuseColor *= texelColor;
                      #endif
                  `
            )
        }
    }

    getMaterial() {
        return this.material
    }

    switchTexture(index: number, callback?: CallbackUniformNumber) {
        this.material.map = this.textures[index]
        this.map0.value = this.textures[this.prevIndex]
        this.prevIndex = index
        callback && callback(this.lerp)
    }

    addTexture(texture: THREE.Texture) {
        if (this.textures.length === 0) {
            this.map0.value = texture
            if (!this.material.map) {
                this.material.map = texture
            }
        }
        texture.needsUpdate = true
        this.textures.push(texture)
    }

    addTextures(textures: THREE.Texture[]) {
        textures.forEach(texture => {
            this.addTexture(texture)
        })
    }
}


export default MultiMaterial