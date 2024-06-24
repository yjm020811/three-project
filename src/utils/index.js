import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

const fbxLoader = new FBXLoader();
export const loadFBX = (url) => {
  return new Promise((resolve, reject) => {
    fbxLoader.load(
      url,
      (object) => {
        resolve(object);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        reject(error);
      }
    );
  });
};
