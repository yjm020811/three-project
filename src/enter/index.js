import * as THREE from "three";
import "../base/index.css";
import { City } from "./city";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export const initCity = () => {
  //获取canvas元素
  const canvas = document.getElementById("webgl");
  // 创建场景
  const scene = new THREE.Scene();
  // 创建相机
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    100000
  );
  //   给相机设置位置
  camera.position.set(1000, 500, 100);
  scene.add(camera);

  // 添加相机控件
  const controls = new OrbitControls(camera, canvas);
  // 设置控制器阻尼，让控制器更有真实效果(惯性),必须在动画循环里调用.update()
  controls.enableDamping = true;
  //   是否可以缩放
  controls.enableZoom = true;
  //最近与最远距离
  controls.minDistance = 100;
  controls.maxDistance = 2000;

  //添加灯光
  scene.add(new THREE.AmbientLight(0xadadad));
  //  添加平行光
  const directionLight = new THREE.DirectionalLight(0xffffff, 1);
  directionLight.position.set(0, 0, 0);
  scene.add(directionLight);

  // 创建渲染器
  const renderer = new THREE.WebGLRenderer({ canvas });
  //   设置渲染器的大小
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 设置像素比
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // 设置场景颜色
  renderer.setClearColor(new THREE.Color(0x000000), 1);
  // 创建一个城市
  const city = new City(scene, camera);

  const clock = new THREE.Clock();

  const start = () => {
    city.start(clock.getDelta());
    controls.update();
    // 渲染操作
    renderer.render(scene, camera);
    requestAnimationFrame(start);
  };
  start();

  //动态监听
  window.addEventListener("resize", () => {
    // 更新宽高比
    camera.aspect = window.innerWidth / window.innerHeight;
    //   更新摄像机的投影矩阵
    camera.updateProjectionMatrix();
    //   更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight);
    //   设置渲染器的像素比
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
};
