import * as THREE from "three";
import { color } from "../config/index.js";

export class Cone {
  constructor(scene, top, height) {
    this.scene = scene;
    this.top = top;
    this.height = height;
    this.createCone({
      color: color.cone,
      height: 60,
      opacity: 0.6,
      speed: 4,
      position: {
        x: 0,
        y: 50,
        z: 0
      }
    });
  }

  createCone(options) {
    const geometry = new THREE.ConeGeometry(15, 30, 4);

    const material = new THREE.ShaderMaterial({
      // 定义了值，可以在顶点着色器和片元着色器中使用(变量传值)
      uniforms: {
        u_color: { value: new THREE.Color(options.color) },
        u_height: this.height,
        u_top: this.top
      },
      //   顶点着色器
      vertexShader: `
      uniform float u_top;
      uniform float u_height;
            void main() {
            float f_angle = u_height / 10.0 ;
            float new_x = position.x * cos(f_angle) - position.z * sin(f_angle);
            float new_y = position.y;
            float new_z = position.z * cos(f_angle) + position.x * sin(f_angle);
            vec4 v_position = vec4(new_x, new_y+u_top, new_z, 1.0);
            gl_Position = projectionMatrix * modelViewMatrix * v_position;
            }
          `,
      //   片元着色器
      fragmentShader: `
            uniform vec3 u_color;
            void main() {
              gl_FragColor = vec4(u_color, 0.6);
            }
          `,
      transparent: true,
      side: THREE.DoubleSide, // 默认单面显示，解决只显示一半的问题
      depthTest: false // 解决被建筑物遮挡的问题
      // opacity:0.5   // 设置透明度
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(options.position);
    mesh.rotateZ(Math.PI);
    this.scene.add(mesh);
  }
}
