//Imports from THREE and Utils

import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, initCamera,initDefaultBasicLight,setDefaultMaterial,InfoBox,onWindowResize,createGroundPlaneXZ} from "../libs/util/util.js";



//Imports of our classes, dont know why it needs the whole dir


import * as Player from "../T1/Player.js";
import * as Block from './Block.js'
import * as Ball from '../T1/Ball.js';
import { Scene } from '../build/three.module.js';

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

  const planeWidth = 1000;
  const planeHeight = 1000;
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
  player = new Player.Player();
  player.PlayerInit();

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


  //Process Game logic (Check colision/Reflection,Check death and collision culling,move player to target position)


  //Render (Self explanatory)
  requestAnimationFrame(gameLoop);
  renderer.render(scene,camera);
}




initGame();
gameLoop();


