// Functions to help 

import * as THREE from  'three';

// 1, -1 incidencia
// 0, 1 normal
// retorno 1, 1

function calculateReflection(direction, normal) {
    
    var ray = new THREE.Vector3();
    

    var dotResult = direction.dot(normal);

    ray.x = direction.x - (2 * dotResult * normal.x)
    ray.y = direction.y - (2 * dotResult * normal.y)
    ray.z = direction.z - (2 * dotResult * normal.z)

    return ray
}

function checkFaceColision(retPosition, ballPos){
    let blockNormal = null;
    if(ballPos.y<(retPosition.y-7.5)){
      return blockNormal = new THREE.Vector3(0,-1,0);
      
    
    }
    if(ballPos.x<(retPosition.x-25) && ballPos.y<=(retPosition.y+7.5) && ballPos.y>=(retPosition.y-7.5)){
      return blockNormal = new THREE.Vector3(-1,0,0);
      
    }
    if(ballPos.x>(retPosition.x+25) && ballPos.y<=(retPosition.y+7.5) && ballPos.y>=(retPosition.y-7.5)){
      return blockNormal = new THREE.Vector3(1,0,0);
      
    }
    if(ballPos.y>(retPosition.y+7.5)){
      return blockNormal = new THREE.Vector3(0,1,0);
      
    }

    

}



function switchFullScreen(isFullScreen) {
  if(isFullScreen) {
    var elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  } else {
    document.exitFullscreen()
  }
}


export{calculateReflection, checkFaceColision, switchFullScreen }
