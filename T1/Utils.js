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

export{calculateReflection}