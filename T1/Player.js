
import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, initCamera,initDefaultBasicLight,setDefaultMaterial,InfoBox,onWindowResize,createGroundPlaneXZ} from "../libs/util/util.js";

//Attributes


export class Player{

    parent = null; //Gameobject to tie all other blocks
    normals = [];
    blocks = []

    targetPos = new THREE.Vector3(0,-250,0); //Position to move to


    constructor(){
        console.log("Player Constructor triggered");
        this.parent = new THREE.Object3D();
        this.parent.position.set(0,-300,0);

        for(let i = 0;i<5;i++){
            this.blocks.push(new THREE.Mesh(new THREE.BoxGeometry(20,20,3),
            new THREE.MeshLambertMaterial({ color:'rgb(230,30,30)'})));
            this.parent.add(this.blocks[i]);
            this.blocks[i].position.set(-40+(i*20),0,0);

            //Normals init

            
        }

    }


    PlayerInit(){

    console.log("Player has been initialized");
}
    getGameObject(){
        return this.parent;
    }


    //Snaps the player to position
    setPosition(newPosition){
        this.parent.position.set(newPosition.x,newPosition.y,newPosition.z);
    }

    //sets the targetPosition as newPosition to player go
    move(newPosition){

        this.targetPos =newPosition;
    }


    //Returns all of the box colliders
    getColliders(){

        return;
    }

    recieveInput(xInput){

        

    }

    update(){

        this.parent.position.lerp(this.targetPos,0.2);
        //Update colliders for each box

        
        

        return;
    }



}