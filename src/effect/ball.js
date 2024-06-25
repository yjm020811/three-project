import * as THREE from "three";
import { color } from "../config/index.js";

export class Ball {
  constructor(scene, time) {
    this.scene = scene;
    this.time = time;
    this.createSphere({
      color: color.ball,
      height: 60,
      opacity: 0.6,
      speed: 4,
      position: {
        x: 300,
        y: 0,
        z: -200
      }
    });
  }

  createSphere(options) {
    const geometry = new THREE.SphereGeometry(
      50,
      32,
      32,
      Math.PI / 2,
      Math.PI * 2,
      0,
      Math.PI / 2
    );

    const material = new THREE.ShaderMaterial({
      // 定义了值，可以在顶点着色器和片元着色器中使用(变量传值)
      uniforms: {
        u_color: { value: new THREE.Color(options.color) },
        u_height: { value: options.height },
        u_opacity: { value: options.opacity },
        u_speed: {
          value: options.speed
        },
        u_time: this.time
      },
      //   顶点着色器
      vertexShader: `
          // uniform 用于声明非顶点变量
            uniform float u_time;
            uniform float u_height;
            uniform float u_speed;
            varying float v_opacity;
            void main() {
              vec3 v_position = position * mod(u_time / u_speed, 1.0);
              v_opacity = mix(1.0, 0.0, position.y / u_height);
        //    gl_Position是内置变量，表示当前顶点的位置（数据类型是四维向量vec4）
        //   .modelMatrix记录了mesh的位置，尺寸和姿态角度
        //   .projectionMatrix记录了投影矩阵
        //   .viewMatrix记录了视图矩阵(这几个都是默认提供的变量，不用自己写)
        //   .modelViewMatrix记录了模型视图矩阵
        //    gl_Position = 投影矩阵(projectionMatrix) * 模型视图矩阵(modelViewMatrix) * 顶点坐标(vec4(v_position, 1.0))
              gl_Position = projectionMatrix * modelViewMatrix * vec4(v_position, 1.0);
            }
          `,
      //   片元着色器
      fragmentShader: `
            uniform vec3 u_color;
            uniform float u_opacity;
            varying float v_opacity;
            void main() {
        //    gl_FragColor是内置变量，表示当前片元的颜色（数据类型是四维向量vec4）
              gl_FragColor = vec4(u_color, u_opacity * v_opacity);
            }
          `,
      transparent: true,
      side: THREE.DoubleSide, // 默认单面显示，解决只显示一半的问题
      depthTest: false // 解决被建筑物遮挡的问题
      // opacity:0.5   // 设置透明度
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(options.position);
    this.scene.add(mesh);
  }
}
