import * as THREE from 'three';

export function getFresnelMat() {
  return new THREE.ShaderMaterial({
    uniforms: {
      fresnelBias: { value: 0.05 },
      fresnelScale: { value: 2.0 },
      fresnelPower: { value: 3.0 },
    },
    vertexShader: `
      uniform float fresnelBias;
      uniform float fresnelScale;
      uniform float fresnelPower;
      
      varying float vReflectionFactor;
      
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
        
        vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
        
        vec3 I = worldPosition.xyz - cameraPosition;
        
        vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower );
        
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying float vReflectionFactor;
      
      void main() {
        gl_FragColor = vec4(0.1, 0.4, 1.0, vReflectionFactor * 0.8);
      }
    `,
    transparent: true,
    blending: THREE.NormalBlending,
  });
}
