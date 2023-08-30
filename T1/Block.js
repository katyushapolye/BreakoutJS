import * as THREE from  'three';
export class Block{

    Body = null;
    isCollisionActive = false;

    


    constructor(){
        console.log("Block created ")
        this.Body = new THREE.Mesh(new THREE.BoxGeometry(4,2,3),
        new THREE.MeshLambertMaterial({ color:'rgb(255,0,0)'}));
    

    }

    getGameObject(){

        return this.Body
    }

    setPosition(newPosition){

        this.Body.position.set(newPosition.x,newPosition.y,newPosition.z);
    }

}