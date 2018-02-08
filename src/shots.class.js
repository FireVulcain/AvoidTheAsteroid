class Shots {
    constructor (geo, mat, scene){
        this.mesh = new THREE.Mesh(geo,mat);
        this.move = false;
    }

    spawn(){
        this.mesh.position.set(
            spaceShip.position.x+245,
            spaceShip.position.y,
            spaceShip.position.z
        );
        this.move = true;
        scene.add(this.mesh);
    }
    fire(){
        this.mesh.position.z -= 200;
        if (this.mesh.position.z < -5000){
            this.move = false;
        }
    }
}