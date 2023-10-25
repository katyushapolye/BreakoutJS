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

function isCircleAABBCollision(ballPos, aabb) {
  
  // let circle= new THREE.Vector2(ballPos.x, ballPos.y)
  // let aabbMin= new THREE.Vector2((aabb.x -(33/2)), (aabb.y -7.5));
  // let aabbMax= new THREE.Vector2(aabb.x +(33/2), aabb.y + 7.5)

  // let closestPoint= new THREE.Vector2(
  // Math.max(aabbMin.x, Math.min(circle.x, aabbMax.x)), //x
  // Math.max(aabbMin.y, Math.min(circle.y, aabbMax.y))  //y
  // )

  let newVet= new THREE.Vector3();
  newVet.subVectors(aabb, ballPos)
  newVet.normalize();
  newVet.x=(newVet.x *8)+ballPos.x;
  newVet.y=(newVet.y *8)+ballPos.y;
  //subtrair Centro do Ret pelo centro do circulo
  //normalizar ele
  //produto escalar*r + circulo
  let distance = new THREE.Vector2((ballPos.x - newVet.x), (ballPos.y - newVet.y))
  let dValue = Math.sqrt(distance.x * distance.x + distance.y * distance.y);

  return dValue <= 8;
  
}



function calculateCollisionPoint(ballPos, aabb) {
  let halfWidth = 33/2;
  let halfHeight = 7.5;
  let circle= new THREE.Vector2(ballPos.x, ballPos.y)
  let aabbMin= new THREE.Vector2((aabb.x -(halfWidth)), (aabb.y -halfHeight));
  let aabbMax= new THREE.Vector2(aabb.x +(halfWidth), aabb.y + halfHeight)

  let closestPoint= new THREE.Vector2(
  Math.max(aabbMin.x, Math.min(circle.x, aabbMax.x)), //x
  Math.max(aabbMin.y, Math.min(circle.y, aabbMax.y))  //y
  )
  return closestPoint;
  // console.log("BALLPOS: ", ballPos)
  // console.log("AABB: ", aabb)
  // let newVet= new THREE.Vector3();
  // newVet.subVectors(aabb, ballPos)
  // newVet.normalize();
  // newVet.x=(newVet.x *8)+ballPos.x;
  // newVet.y=(newVet.y *8)+ballPos.y;

  // console.log("VETOR DO PONTO DE COLISÃO:", newVet)
  // return newVet
  
}



function checkFaceCollision(colisionPoint, retPosition, dirVet) {
  console.log("firstFlag");
  let halfWidth = 33/2;
  let halfHeight = 7.5;

  if(retPosition.y-halfHeight == colisionPoint.y && dirVet.y>0){
    return new THREE.Vector3(0,-1,0)
  }
  if(retPosition.y+halfHeight== colisionPoint.y && dirVet.y<0){
    return new THREE.Vector3(0,1,0)
  }
  if(retPosition.x+halfWidth == colisionPoint.x){
    return new THREE.Vector3(1,0,0)
  }
  if(retPosition.x-halfWidth == colisionPoint.x){
    return new THREE.Vector3(-1,0,0)
  }
  // if(retPosition.y-halfHeight == colisionPoint.y &&retPosition.x-halfWidth==colisionPoint.x){
  //   console.log("PONTA")
  //   return new THREE.Vector3(0,0,0)
  // }
  // if(retPosition.y-halfHeight == colisionPoint.y &&retPosition.x+halfWidth==colisionPoint.x){
  //   console.log("PONTA")
  //   return new THREE.Vector3(0,0,0)
  // }
  
  // if(retPosition.y+halfHeight == colisionPoint.y &&retPosition.x-halfWidth==colisionPoint.x){
  //   console.log("PONTA")
  //   return new THREE.Vector3(0,0,0)
  // }
  
  // if(retPosition.y+halfHeight == colisionPoint.y &&retPosition.x+halfWidth==colisionPoint.x){
  //   console.log("PONTA")
  //   return new THREE.Vector3(0,0,0)
  // }
  
  
  
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


export{calculateReflection, checkFaceCollision, switchFullScreen, calculateCollisionPoint , isCircleAABBCollision}
