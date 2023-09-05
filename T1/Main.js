//Imports from THREE and Utils

import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, initCamera,initDefaultBasicLight,setDefaultMaterial,InfoBox,onWindowResize,createGroundPlaneXZ} from "../libs/util/util.js";



//Imports of our classes, dont know why it needs the whole dir


import * as Player from "../T1/Player.js";
import * as Block from './Block.js'
import * as Ball from '../T1/Ball.js';
import { Scene, Vector3 } from '../build/three.module.js';


//Input defs

const pointer = new THREE.Vector2();


//Global defs
let scene = null 
let renderer = null;
let camera = null;
let material = null;
let light = null;

//Game defs

const WORLD_H = 800;
const WORLD_W = 400;
let player = null;
let BG = null;
let GAME_BOARD = Array(8).fill().map(() => Array(14).fill(0)); //EU não sei o que é isso


function onWindowResizeOrt() {
  console.log("Resizing Camera");
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  let targetWidth = newWidth;
  let targetHeight = targetWidth / 0.5;

  if (targetHeight > newHeight) {
    targetHeight = newHeight;
    targetWidth = targetHeight * 0.5;
  }

  const offsetX = (newWidth - targetWidth) / 2;
  const offsetY = (newHeight - targetHeight) / 2;

  camera.left = -WORLD_W / 2;
  camera.right = WORLD_W / 2;
  camera.top = WORLD_H / 2;
  camera.bottom = -WORLD_H / 2;
  camera.updateProjectionMatrix();

  renderer.setSize(newWidth, newHeight);
  renderer.setViewport(offsetX, offsetY, targetWidth, targetHeight);
}

//Calcula pos do mouse na tela em cords normalizada
function onPointerMove( event ) {


	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;


}

function setupRenderAndCamera(){
    //  Camera Init
    let viewWidth =  WORLD_H;
    let viewHeight = WORLD_H;
    camera = new THREE.OrthographicCamera(
      -viewWidth,
      viewWidth,
      viewHeight,
      -viewHeight,
      1,
      1000
    );


  window.addEventListener( 'resize', onWindowResizeOrt, false );
  window.addEventListener('pointermove',onPointerMove);
  
  camera.position.set(0, 0, 50);
  camera.lookAt(new THREE.Vector3(0,0,0));



  //Renderer Init
  renderer = initRenderer();    // Init a basic renderer
  renderer.setSize(viewWidth,viewHeight);

    onWindowResizeOrt(); //SO por precaução

}

function setupMaterialAndLights(){


  material = setDefaultMaterial(); // create a basic material
  light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
}

//Retuns the first point of intersection of a raycast from the camera, directed at the mouse position(normalized), colliding with the BG
// Returns the first point of intersection of a raycast from the camera, directed at the mouse position (normalized),
// colliding with the BG
function rayCastPositionOnBG() {
  let rayOrigin = new THREE.Vector3(pointer.x * window.innerWidth, pointer.y * window.innerHeight, 0);
  let rayDir = new THREE.Vector3(0, 0, -1);
  let raycast = new THREE.Raycaster(rayOrigin, rayDir);
  let intersections = raycast.intersectObjects([BG], false);

  if (intersections.length > 0) {
    console.log(intersections[0].point)
    return intersections[0].point;
  } else {
    return new THREE.Vector3(0, 0, 0); // Return a default point when there are no intersections.
  }
}


function setupScene(){
  scene = new THREE.Scene();
}


function createBoard(){

  //Mexer aqui para criar tabuleiros foda, ajustar valores max de 8 e 16 baseado no tamanho do bloco
  for(let i = 0;i<8;i++){
    for(let j = 0;j<16;j++){

      GAME_BOARD[i][j] = new Block.Block();
      GAME_BOARD[i][j].setPosition(new THREE.Vector3((j*GAME_BOARD[i][j].getWidth()) -(WORLD_W/2)  + (GAME_BOARD[i][j].getWidth())/2 ,
      (i*15) + (WORLD_H/2) - (15*(GAME_BOARD[i][j].getHeight()/2)), //cuidado com esse offset estranho aqui
      0));
      scene.add(GAME_BOARD[i][j].getGameObject());
    }
  }

}

function createBackGround(){

  const planeWidth = 10000;
  const planeHeight = 10000;
  const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
  BG = new THREE.Mesh(planeGeometry, setDefaultMaterial('rgb(255,255,255)'));
  
  // Position the plane at the XY plane
  

  scene.add(BG);


}

//Init function
function initGame(){


  setupScene();
  setupRenderAndCamera();
  setupMaterialAndLights();


  //Init of player
  player = new Player.Player()
  scene.add(player.getGameObject());
  player.setPosition(new THREE.Vector3(0,-250,0));




  //Init board

  createBoard();
  createBackGround();

  //Init ball
  let ballTest = new Ball.Ball();
  ballTest.setPosition(new THREE.Vector3(0,-0,0));
  scene.add(ballTest.getGameObject());








}





//Game loop
function gameLoop(){

  //Handle input (Raycast to world cords)

  let pTarget = new THREE.Vector3(rayCastPositionOnBG().x,-250,0);




  //Process Game logic (Check colision/Reflection,Check death and collision culling,move player to target position)
  player.move(pTarget);
  player.update();
  //ballTest.update();


  //= = = = RAY CAST TEST RAY CAST TEST = = = =



  //Render (Self explanatory)
  requestAnimationFrame(gameLoop);
  renderer.render(scene,camera);
}




initGame();
gameLoop();


