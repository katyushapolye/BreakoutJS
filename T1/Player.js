
import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, initCamera,initDefaultBasicLight,setDefaultMaterial,InfoBox,onWindowResize,createGroundPlaneXZ} from "../libs/util/util.js";

//Attributes


export class Player{

    parent = null; //Gameobject to tie all other blocks
    normals = [];
    blocks = [];

    colliders = [];

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

            this.normals.push(new THREE.Vector3(0,1,0));
            this.colliders.push(new THREE.Box3());
            this.blocks[i].geometry.computeBoundingBox();
            this.colliders[i].copy(this.blocks[i].geometry.boundingBox);
        
        }

        this.normals[0] = new THREE.Vector3(-0.866025,0.5,0); //30 grau
        this.normals[1] = new THREE.Vector3(-1,1,0); //45 grau

        this.normals[3] = new THREE.Vector3(1,1,0);
        this.normals[4] = new THREE.Vector3(0.866025,0.5,0);

        this.normals[0].normalize();
        this.normals[1].normalize();
        this.normals[3].normalize();
        this.normals[4].normalize();
        
        

        

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

    getPosition(){
        return this.parent.position;
    }

    //sets the targetPosition as newPosition to player go
    move(newPosition){

        this.targetPos =newPosition;
    }


    //Returns all of the box colliders
    getColliders(){

        return this.colliders;
    }
    getNormals(){
        return this.normals;
    }

    update(){

        this.parent.position.lerp(this.targetPos,0.2);
        //Update colliders for each box

        for(let i = 0;i<5;i++){
            this.colliders[i].setFromObject(this.blocks[i],true);
        }


        return;
    }



}