//Imports from THREE and Utils

import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, initCamera,initDefaultBasicLight,setDefaultMaterial,InfoBox,onWindowResize,createGroundPlaneXZ} from "../libs/util/util.js";



//Imports of our classes, dont know why it needs the whole dir


import * as Player from "../T1/Player.js";


//Global defs
let scene, renderer, camera, material, light; 


//Init function
function initGame(){


  scene = new THREE.Scene();    // Create main scene
  renderer = initRenderer();    // Init a basic renderer

  //Criar camera
  camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position


  material = setDefaultMaterial(); // create a basic material
  light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene

  window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );


  //Init of player
  let player = new Player.Player();
  player.PlayerInit();


  
  let plane = createGroundPlaneXZ(20, 20)
  scene.add(plane);



}





//Game loop
function gameLoop(){

  //Handle input (Raycast to world cords)


  //Process Game logic (Check colision/Reflection,Check death and collision culling,move player to target position)


  //Render (Self explanatory)
  requestAnimationFrame(gameLoop);
  renderer.render(scene,camera);
}




initGame();
gameLoop();


