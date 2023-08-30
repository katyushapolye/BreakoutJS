import * as THREE from  'three';
export class Ball{

    DirectionVet =  new THREE.Vector3(0,0,0);

    Body = null

    constructor(){

        this.Body = new THREE.Mesh(new THREE.CircleGeometry(0.5),
        new THREE.MeshLambertMaterial({ color:'rgb(128,128,128)'}));

    }

    getGameObject(){

        return this.Body
    }

    setPosition(newPosition){
        this.Body.position.set(newPosition.x,newPosition.y,newPosition.z);
    }
}