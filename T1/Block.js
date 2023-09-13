import * as THREE from  'three';
export class Block{

    Body = null;
    isCollisionActive = false;

    collider = null;

    BLOCK_H = 15;
    BLOCK_W = 50;

    

    //Talvez seja legal passar a cor como parametro do construtor
    constructor(color = null){
        console.log("Block created ")
        let colorRand = color;
        if(color == null){
        let r = Math.floor(Math.random()*256);
        let g = Math.floor(Math.random()*256);
        let b = Math.floor(Math.random()*256);
            

        let colorRand = 'rgb(' + r.toString() + ',' + g.toString() + ',' + b.toString() + ')';
        
        }
        console.log("Block Color = " + colorRand);
        this.Body = new THREE.Mesh(new THREE.BoxGeometry(this.BLOCK_W,this.BLOCK_H,10),
        new THREE.MeshLambertMaterial({ color:colorRand}));

        this.collider = new THREE.Box3();

        this.Body.geometry.computeBoundingBox();
        this.collider.copy(this.Body.geometry.boundingBox);
    

    }

    getHeight(){
        return this.BLOCK_H;
    }
    getWidth(){
        return this.BLOCK_W;
    }

    setColor(color){
            this.Body.material.color = new THREE.Color(color);
    }

    //returns the collidr;
    getCollider(){

        


        return this.collider;
    }

    updateCollider(){
        this.collider.setFromObject(this.Body,true);

    }



    getGameObject(){

        return this.Body
    }

    setPosition(newPosition){

        this.Body.position.set(newPosition.x,newPosition.y,newPosition.z);
    }

    getPosition(){
        return this.Body.position;
    }

}