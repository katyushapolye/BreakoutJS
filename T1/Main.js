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

import { calculateReflection, checkFaceColision, switchFullScreen } from './Utils.js';


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
let bg4Ray= null;
let retPosition;
let ballPos;
let GAME_BOARD = Array(8).fill().map(() => Array(8).fill(0)); //EU não sei o que é isso

//Game control defs

let isPlayerWithBall = true
let isFullScreen = false
let simulationOn = true
let win = 0;

//Raycast defs

const rayOrigin = new THREE.Vector3();
const rayDir = new THREE.Vector3(0, 0, -1);
const raycast = new THREE.Raycaster();
let intersections;



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
    let viewWidth =  WORLD_W;
    let viewHeight = WORLD_H;
    
    camera = new THREE.PerspectiveCamera(50,0.5,1,2000)


    window.addEventListener( 'resize', onWindowResizeOrt, false );
    window.addEventListener('pointermove',onPointerMove);
  
    camera.position.set(0, 0, 1000);
    camera.lookAt(new THREE.Vector3(0,0,0));


  //Renderer Init
    renderer = initRenderer();    // Init a basic renderer, alreaday has a shadowmap
    renderer.setSize(viewWidth,viewHeight);

  onWindowResizeOrt(); //SO por precaução

}

function setupMaterialAndLights(){


  material = setDefaultMaterial(); // create a basic material


  //Ambient light

  let ambientLight = new THREE.AmbientLight("rgb(255,255,255)",0.2);


  let dirLight =  new THREE.DirectionalLight("rgb(235,235,235)",0.6);


  dirLight.shadow.camera.near = -1000;
  dirLight.shadow.camera.far = 1000;
  dirLight.shadow.camera.left = -1000;
  dirLight.shadow.camera.right = 1000;
  dirLight.shadow.camera.bottom = -1000;
  dirLight.shadow.camera.top = 1000;
  dirLight.castShadow = true;
  dirLight.position.set(100,200,300);


  dirLight.target.position.set(-100,-10,-150);
  dirLight.target.updateMatrixWorld()

  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.mapSize.width = 2048;



  scene.add(ambientLight);
  scene.add(dirLight);
''
  //light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
}

//Retuns the first point of intersection of a raycast from the camera, directed at the mouse position(normalized), colliding with the BG
// Returns the first point of intersection of a raycast from the camera, directed at the mouse position (normalized),
// colliding with the BG
function rayCastPositionOnBG() {
  rayOrigin.set(pointer.x * window.innerWidth, pointer.y * window.innerHeight, 0);
  raycast.set(rayOrigin, rayDir);
  intersections = raycast.intersectObjects([BG], false);

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

  //Cores legais

  let cores = [];

  cores.push("rgb(255,100,100)"); //red
  cores.push("rgb(100,255,100)"); //green
  cores.push("rgb(100,100,255)") //blue
  cores.push("rgb(255,255,100)"); //yellow
  cores.push("rgb(255,100,255)"); //purple

  for(let i = 0;i<8;i++){
    for(let j = 0;j<8;j++){

      let colorIndex =  i%(cores.length);
      GAME_BOARD[i][j] = new Block.Block(cores[colorIndex]);
      GAME_BOARD[i][j].setPosition(new THREE.Vector3((j*GAME_BOARD[i][j].getWidth()) -(WORLD_W/2)  + (GAME_BOARD[i][j].getWidth())/2 ,
      (i*15) + (WORLD_H/2) - (15*(GAME_BOARD[i][j].getHeight()/2)), //cuidado com esse offset estranho aqui
      0));
      scene.add(GAME_BOARD[i][j].getGameObject());
      //scene.add(GAME_BOARD[i][j].getObjectMargin());
      GAME_BOARD[i][j].updateCollider();
      
      //GAME_BOARD[i][j].getObjectMargin().update();

    }
  }





}

function createBackGround(){

  const planeWidth = 1000;
  const planeHeight = 1000;
  const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
  BG = new THREE.Mesh(planeGeometry, setDefaultMaterial('rgb(255,255,255)'));
  
  BG.position.set(0,0,-10)
  BG.receiveShadow = true;
  // Position the plane at the XY plane
  
  scene.add(BG);
  const specialMat= setDefaultMaterial('rgb(60,60,180)');
  specialMat.transparent=true;
  specialMat.opacity=0
  bg4Ray= new THREE.Mesh(planeGeometry, specialMat);
  bg4Ray.position.set(0,0,0);
  scene.add(bg4Ray);


}

function checkCollisionBoard(){
  win = 0; 

  for(let i = 0;i<8;i++){
    for(let j = 0;j<8;j++){
      if(GAME_BOARD[i][j].collided){
        win = win + 1
        continue;
      }

      let blockCol = GAME_BOARD[i][j].getCollider();
      let ballCol = ball.getCollider();

      let blockNormal = null; //new THREE.Vector3(0,-1,0); // need to change if it is a side collision or down ou, you know

      if(ballCol.intersectsBox(blockCol)){

        retPosition = GAME_BOARD[i][j].getPosition();
        ballPos= ball.getPosition();
        
        blockNormal= checkFaceColision(retPosition, ballPos);
        ball.setDirection(calculateReflection(ball.getDirection(),blockNormal))
        

        scene.remove(GAME_BOARD[i][j].getGameObject());
        //scene.remove(GAME_BOARD[i][j].getObjectMargin());
        GAME_BOARD[i][j].collided = true;
        // GAME_BOARD[i][j] = null;
        return;

      }
    }
  }

  // se todos estiverem colididos
  if(win >= 64) {
    simulationOn = false;
  }
}

function checkCollisionPlayer(){

  console.log("Ppos = " + player.getPosition().x + "," + player.getPosition().y)
  console.log("Bpos = " + ball.getPosition().x + "," + ball.getPosition().y)

  //No need to check if going down or on top of player and if is on the side
  //Little trig trick here to avoid detection when passed on the offset
  if(ball.getDirection().y >= 0 || ball.getPosition().y < player.getPosition().y + player.getRadius()+ player.getOffset() ){
    return;
  }

  //Distance

  const playerX = player.getPosition().x;
  const playerY = player.getPosition().y;
  const ballX = ball.getPosition().x;
  const ballY = ball.getPosition().y;

  const dx = ballX - playerX;
  const dy = ballY - playerY;
  
  const distance = Math.sqrt(dx * dx + dy * dy);



  let radiusSum = player.getRadius() + ball.getRadius();
 
  if(radiusSum >= distance){
    console.log("Collision Detected");

    let normal = new Vector3(dx,dy);
    normal.normalize();


        //Minimum angle of reflection here
    ball.setDirection(calculateReflection(ball.getDirection(),normal));

    let minimumVet = ball.getDirection();


        if(ball.getDirection().y < 0.5){
          minimumVet.y = 0.5;
          if(ball.getDirection().x < (-Math.sqrt(3)/2)){
            minimumVet.x =  -(Math.sqrt(3)/2);
          }

          if(ball.getDirection().x > Math.sqrt(3)/2){
            minimumVet.x =  Math.sqrt(3)/2;


        };
      }
      minimumVet.normalize();
      ball.setDirection(minimumVet);


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

// Check defeat
function checkDefeat(){
  if(ball.getPosition().y < -500) {
    let ballPos = new THREE.Vector3(player.getPosition().x,player.getPosition().y+player.getRadius() + 5,0);
    ball.setDirection(new Vector3(0,0,0))
    ball.setPosition(ballPos);
    isPlayerWithBall = true;
  }
}

let checkMouse = (event) => {
  if(simulationOn) {
    if(event.button == 0) {
      if(isPlayerWithBall) {
        // esse if é necessário porque se não sempre que apertar space a bola sobe
        isPlayerWithBall = false;
        ball.setDirection(new THREE.Vector3(0,1,0));
        console.log("Ball is Released");
      }
    }
  }
}


window.addEventListener('click', checkMouse)


function checkKeyboard(){
  if ( keyboard.down("space") ){
    simulationOn = !simulationOn;
  }

  if(simulationOn) {
    if ( keyboard.down("R") ){
      win = 0;

      for(let i = 0;i<8;i++){
        for(let j = 0;j<8;j++){
          if(GAME_BOARD[i][j].collided) {
            scene.add(GAME_BOARD[i][j].getGameObject());
            //scene.add(GAME_BOARD[i][j].getObjectMargin());
            GAME_BOARD[i][j].collided = false;
          }
        }
      }

      let ballPos = new THREE.Vector3(player.getPosition().x,player.getPosition().y+player.getRadius() + 5+8,0);

      
      ball.setPosition(ballPos);
      isPlayerWithBall = true;
    }
  
    if ( keyboard.down("enter") ){
      isFullScreen = !isFullScreen
      switchFullScreen(isFullScreen);
    }
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

  scene.add(player.getDebug())




  //Init board

  createBoard();
  createBackGround();

  //Init ball
  ball = new Ball.Ball();
  ball.setPosition(new THREE.Vector3(0,-0,0));
  scene.add(ball.getGameObject());

  win = 0;

}





//Game loop
function gameLoop(){

  //Handle input (Raycast to world cords)
  keyboard.update();
  let pTarget = new THREE.Vector3(rayCastPositionOnBG().x,0,0);

  if(win < 64) checkKeyboard();


  //Process Game logic (Check colision/Reflection,Check death and collision culling,move player to target position)
  
  if(simulationOn) {
    player.move(pTarget);
    player.update();
  }
  


  if(isPlayerWithBall){

    //Little offset so it should right above the player
    let ballPos = new THREE.Vector3(player.getPosition().x,player.getPosition().y+player.getRadius() + 5+8,0);

    ball.setPosition(ballPos);
  }

  if(simulationOn) {
    ball.update();
  }
  
  checkCollisionBoard();
  checkCollisionWall();
  checkCollisionPlayer();
  checkDefeat();



  //= = = = RAY CAST TEST RAY CAST TEST = = = =



  //Render (Self explanatory)
  requestAnimationFrame(gameLoop);
  renderer.render(scene,camera);
}




initGame();
gameLoop();


