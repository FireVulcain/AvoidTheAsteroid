class Asteroid {
    constructor (mesh, scene){
        this.mesh = mesh;
        this.spawn();
    }
    spawn(){
        scene.add(this.mesh);
        this.mesh.position.set(
            getRandomInt(2000) - 1000,
            getRandomInt(2000) - 350,
            -(getRandomInt(8000) + 100)
        );

        this.speedZ     = Math.random() * 40;
        this.rotationX  = (getRandomInt(100) - 50) * 0.001 ;
        this.rotationY  = Math.random() * .1;

    }
    update(){
        this.mesh.position.z += this.speedZ * (speed.z + 1);
        this.mesh.rotateX(this.rotationX);
        this.mesh.rotateY(this.rotationY);
        if (this.mesh.position.z > camera.position.z){
            this.mesh.position.z = -5000;
        }
    }
}
function getRandomInt(max){
    return Math.floor(Math.random() * Math.floor(max));
}

