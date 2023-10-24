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
  
  let circle= new THREE.Vector2(ballPos.x, ballPos.y)
  let aabbMin= new THREE.Vector2((aabb.x -(33/2)), (aabb.y -7.5));
  let aabbMax= new THREE.Vector2(aabb.x +(33/2), aabb.y + 7.5)

  let closestPoint= new THREE.Vector2(
  Math.max(aabbMin.x, Math.min(circle.x, aabbMax.x)), //x
  Math.max(aabbMin.y, Math.min(circle.y, aabbMax.y))  //y
  )
  
  let distance = new THREE.Vector2((circle.x - closestPoint.x), (circle.y - closestPoint.y))
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
}



function checkFaceCollision(colisionPoint, retPosition, vetDir) {
  console.log("firstFlag");
  let halfWidth = 33/2;
  let halfHeight = 7.5;
  
  if (colisionPoint.y >= (retPosition.y + halfHeight) && colisionPoint.x>(retPosition.x-halfWidth) && colisionPoint.x<(retPosition.x+halfWidth)) {
    console.log("NORMAL FOUND UP (0, 1, 0)")
    console.log(colisionPoint)
    console.log(" y >=")
    console.log(retPosition.y + halfHeight)
    console.log("retPos: ")
    console.log(retPosition)
    return new THREE.Vector3(0, 1, 0); 
  }
  if (colisionPoint.y <= (retPosition.y - halfHeight)&& colisionPoint.x>(retPosition.x-halfWidth) && colisionPoint.x<(retPosition.x+halfWidth)) {
    console.log("NORMAL FOUND DOWN (0, -1, 0)")
    console.log(colisionPoint)
    console.log(" y <=")
    console.log(retPosition.y - halfHeight)
    console.log("retPos: ")
    console.log(retPosition)
    return new THREE.Vector3(0, -1, 0);
  }
  if (colisionPoint.x <= (retPosition.x - halfWidth)&& colisionPoint.y>(retPosition.y-halfHeight) && colisionPoint.y<(retPosition.y+halfHeight)) {
    console.log("NORMAL FIND LEFT (-1, 0, 0)")
    console.log(colisionPoint)
    console.log(" x <=")
    console.log(retPosition.x - halfWidth)
    console.log("retPos: ")
    console.log(retPosition)
    return new THREE.Vector3(-1, 0, 0); 
  }
  if (colisionPoint.x >= (retPosition.x + halfWidth)&& colisionPoint.y>(retPosition.y-halfHeight) && colisionPoint.y<(retPosition.y+halfHeight)) {
    console.log("NORMAL FIND RIGHT (1, 0, 0)")
    console.log(colisionPoint)
    console.log(" x >=")
    console.log(retPosition.x + halfWidth)
    console.log("retPos: ")
    console.log(retPosition)
    return new THREE.Vector3(1, 0, 0); 
  }
   else {
    return new THREE.Vector3(0, -1, 0);
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


export{calculateReflection, checkFaceCollision, switchFullScreen, calculateCollisionPoint , isCircleAABBCollision}
