//Imports from THREE and Utils

import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, initCamera,initDefaultBasicLight,setDefaultMaterial,InfoBox,onWindowResize,createGroundPlaneXZ} from "../libs/util/util.js";
import KeyboardState from '../libs/util/KeyboardState.js'



//Imports of our classes, dont know why it needs the whole dir


import * as Player from "../T1/Player.js";
import * as Block from './Block.js'
import * as Ball from '../T1/Ball.js';
import { Scene, Vector3 } from '../build/three.module.js';

import { calculateReflection } from './Utils.js';


//Input defs

const pointer = new THREE.Vector2();


//Global defs
let scene = null 
let renderer = null;
let camera = null;
let material = null;
let light = null;
var keyboard = new KeyboardState();

//Game defs

const WORLD_H = 800;
const WORLD_W = 400;
let ball = null;
let player = null;
let BG = null;
let GAME_BOARD = Array(8).fill().map(() => Array(14).fill(0)); //EU não sei o que é isso

//Game control defs

let isPlayerWithBall = true



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
    //console.log(intersections[0].point)
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
  for(let i = 0;i<4;i++){
    for(let j = 0;j<8;j++){

      GAME_BOARD[i][j] = new Block.Block();
      GAME_BOARD[i][j].setPosition(new THREE.Vector3((j*GAME_BOARD[i][j].getWidth()) -(WORLD_W/2)  + (GAME_BOARD[i][j].getWidth())/2 ,
      (i*15) + (WORLD_H/2) - (15*(GAME_BOARD[i][j].getHeight()/2)), //cuidado com esse offset estranho aqui
      0));
      scene.add(GAME_BOARD[i][j].getGameObject());
      GAME_BOARD[i][j].updateCollider();
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

function checkCollisionBoard(){

  for(let i = 0;i<4;i++){
    for(let j = 0;j<8;j++){
      if(GAME_BOARD[i][j] == null){
        continue;
      }

      let blockCol = GAME_BOARD[i][j].getCollider();
      let ballCol = ball.getCollider();

      let blockNormal = null; //new THREE.Vector3(0,-1,0); // need to change if it is a side collision or down ou, you know

      if(ballCol.intersectsBox(blockCol)){


        //Change here if you want the normal to be of the face instead of the collision
         blockNormal = ball.getPosition().clone().sub(GAME_BOARD[i][j].getPosition()).normalize()

         ball.setDirection(calculateReflection(ball.getDirection(),blockNormal));



         scene.remove(GAME_BOARD[i][j].getGameObject());
         GAME_BOARD[i][j] = null;
         return;

      }
     
    }
  }


}

function checkCollisionPlayer(){

  let pColliders = player.getColliders();
  for(let i =0;i<5;i++){
      if(pColliders[i].intersectsBox(ball.getCollider())){

        //Minimum angle of reflection here
        ball.setDirection(calculateReflection(ball.getDirection(),player.getNormals()[i]));
        return;
      }
  }

}

function checkCollisionWall(){

  if(ball.getPosition().x > (WORLD_W/2)){
    ball.setDirection(calculateReflection(ball.getDirection(),new THREE.Vector3(-1,0,0)));
    
  }
  if(ball.getPosition().x < -(WORLD_W/2)){
    ball.setDirection(calculateReflection(ball.getDirection(),new THREE.Vector3(1,0,0)));
  }

  if(ball.getPosition().y > (WORLD_H/2)){
    ball.setDirection(calculateReflection(ball.getDirection(),new THREE.Vector3(0,-1,0)));

  }
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
  ball = new Ball.Ball();
  ball.setPosition(new THREE.Vector3(0,-0,0));
  scene.add(ball.getGameObject());








}





//Game loop
function gameLoop(){

  //Handle input (Raycast to world cords)
  keyboard.update();
  let pTarget = new THREE.Vector3(rayCastPositionOnBG().x,-250,0);
  if ( keyboard.down("space") ){

    isPlayerWithBall = false;
    ball.setDirection(new THREE.Vector3(0,1,0));
    console.log("Ball is Released");
  }
  





  //Process Game logic (Check colision/Reflection,Check death and collision culling,move player to target position)
  player.move(pTarget);
  player.update();


  if(isPlayerWithBall){

    //Little offset so it should right above the player
    let ballPos = new THREE.Vector3(player.getPosition().x,player.getPosition().y+15,0);
    ball.setPosition(ballPos);
  }
  ball.update();

  checkCollisionBoard();
  checkCollisionWall();
  checkCollisionPlayer();



  //= = = = RAY CAST TEST RAY CAST TEST = = = =



  //Render (Self explanatory)
  requestAnimationFrame(gameLoop);
  renderer.render(scene,camera);
}




initGame();
gameLoop();


