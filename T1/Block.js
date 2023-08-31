import * as THREE from  'three';
export class Block{

    Body = null;
    isCollisionActive = false;

    BLOCK_H = 15;
    BLOCK_W = 25;

    

    //Talvez seja legal passar a cor como parametro do construtor
    constructor(){
        console.log("Block created ")
        let r = Math.floor(Math.random()*256);
        let g = Math.floor(Math.random()*256);
        let b = Math.floor(Math.random()*256);


        let colorRand = 'rgb(' + r.toString() + ',' + g.toString() + ',' + b.toString() + ')';

        console.log("Block Color = " + colorRand);
        this.Body = new THREE.Mesh(new THREE.BoxGeometry(this.BLOCK_W,this.BLOCK_H,10),
        new THREE.MeshLambertMaterial({ color:colorRand}));
    

    }

    getHeight(){
        return this.BLOCK_H;
    }
    getWidth(){
        return this.BLOCK_W;
    }



    getGameObject(){

        return this.Body
    }

    setPosition(newPosition){

        this.Body.position.set(newPosition.x,newPosition.y,newPosition.z);
    }

}