import * as THREE from "three";

export default class HeatmapShaderGenerator{
    constructor( data ){
      
      this.maxDist = data.maxDist || 1000.00;
      this.hotSpot = data.hotSpot || new THREE.Vector3( 0, 0, 0 );
  
      this.fragShader = `#ifdef GL_ES
                        precision mediump float;
                        #endif
  
                        #define PI 3.14159265359
  
                        uniform float maxDist;
                        uniform vec3 hotspot;
                        uniform vec2 u_resolution;
  
                        varying vec4 vwPos;
  
                        void main() {
                            vec3 P1 = vwPos.xyz;
                            vec3 P2 = hotspot;
  
                            float dist = distance( P1, P2 );
                            
                            vec3 colorA = vec3( 1.000, 0.000, 0.000 );
                            vec3 colorB = vec3( 0.000, 1.000, 0.000 );
                            vec3 colorC = vec3( 0.000, 0.000, 1.000 );
  
                            float d = clamp( ( dist / maxDist ), 0.0, maxDist );
  
                            vec3 color = mix( mix( colorA, colorB, d ), mix( colorB, colorC, d ), d );
  
                            gl_FragColor = vec4( color, 1.00 );
                        }`;
                      
      this.vertShader = `varying vec4 vwPos;
                          void main() {
                            
                            vwPos = modelMatrix * vec4(position, 1.); // world position
                            gl_Position = projectionMatrix *
                                          modelViewMatrix *
                                          vec4(position,1.0);
                          }`;
    }
  
    generateMaterial( maxDist, hotSpot ) {
      
      if ( typeof maxDist !== 'number' ) maxDist = this.maxDist;
      
      if ( typeof hotSpot === "undefined" ) hotSpot = this.hotSpot;
  
      let uniforms = {
          maxDist: { type: 'float', value: maxDist },
          hotspot: { type: 'vec3', value: hotSpot }
      }
  
      return new THREE.ShaderMaterial( {
        uniforms: uniforms,
        fragmentShader: this.fragShader,
        vertexShader: this.vertShader
      } );
  
    }
  
  }
  