/*=============================================
 =                   INIT                    =
 =============================================*/
let stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

const scene = new THREE.Scene();

let keyboard = [];

let spaceShip;
let speed = {x:0,y:0,z:0};
let step = 1;

let asteroids = [];
let nbAsteroids = 40;

let shots = [];
let nbMissiles = 100;
let cooldown = false;

/*=============================================
 =                   CAMERA                   =
 =============================================*/
camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
camera.position.set( 0, 600, 2500 );
scene.add(camera);
/*=============================================
 =                   RENDERER                 =
 =============================================*/
const renderer = new THREE.WebGLRenderer({antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
/*=============================================
 =                     X-WINGS                =
 =============================================*/
let mtlLoader = new THREE.MTLLoader();
let loader = new THREE.OBJLoader();
mtlLoader.setPath( './model/obj/x-wings/' );
mtlLoader.load( 'x-wings.mtl', function( materials ) {
    materials.preload();
    loader.setMaterials( materials );
    loader.setPath( './model/obj/x-wings/' );
    loader.load( 'x-wings.obj', function ( object ) {
        spaceShip = object;
        spaceShip.scale.set(.3,.3,.3);
        scene.add(object);
    });
});
/*=============================================
 =                  LIGHT                     =
 =============================================*/
let ambientLight = new THREE.AmbientLight( 0xcccccc, 0.1 );
scene.add( ambientLight );
let pointLight = new THREE.PointLight( 0xffffff, 0.8 );
camera.add( pointLight );
/*=============================================
 =                  BACKGROUND                =
 =============================================*/
let texture = new THREE.TextureLoader().load( 'img/space_size.jpg' );
let backgroundMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 2),
    new THREE.MeshBasicMaterial({
        map: texture
    }));

backgroundMesh .material.depthTest = false;
backgroundMesh .material.depthWrite = false;

// Create your background scene
let backgroundScene = new THREE.Scene();
let backgroundCamera = new THREE.Camera();
backgroundScene.add(backgroundCamera );
backgroundScene.add(backgroundMesh );
/*=============================================
 =                  ASTEROID                   =
 =============================================*/
let asteroidOBJ;
let mtlLoaderAsteroid = new THREE.MTLLoader();
mtlLoader.setPath('model/obj/asteroid/');
mtlLoader.load('asteroid.mtl', function(materials) {
    materials.preload();
    let objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('model/obj/asteroid/');
    objLoader.load('asteroid.obj', function(object) {
        asteroidOBJ = object;
        asteroidOBJ.scale.set(.2,.2,.2);
        for(let j = 0; j < nbAsteroids; j++){
            let asteroid = new Asteroid(asteroidOBJ.clone(),scene);
            asteroids.push(asteroid);
        }
        animate();
    });
});
/*=============================================
 =                    SHOTS                   =
 =============================================*/
let materialBullet = new THREE.MeshPhongMaterial({color:0xff0000});
let geometryBullet = new THREE.BoxGeometry(10,10,100);

for(let k = 0; k<nbMissiles;k++){
    let shot = new Shots(geometryBullet,materialBullet,scene);
    shots.push(shot);
}
/*=============================================
 =                  ANIMATE                   =
 =============================================*/
let animate = function(){
    stats.begin();
    keyAction();
    render();
    stats.end();
    requestAnimationFrame( animate );
};
function render() {
    console.log(spaceShip.position);
    movement();

    //asteroid update
    for(let j = 0; j<nbAsteroids;j++){
        asteroids[j].update();
    }
    //shot fire
    for (let k = 0; k<nbMissiles;k++){
        shots[k].fire();
    }
    //render
    renderer.autoClear = false;
    renderer.clear();
    renderer.render(backgroundScene , backgroundCamera );
    renderer.render( scene, camera );
}
/*=============================================
 =                 KeyAction                  =
 =============================================*/
function keyAction(){
    if(keyboard[38]){ // UP
        speed.y += step;
    }
    if(keyboard[40]){ // DOWN
         speed.y -= step;
     }
    if(keyboard[37]){ // LEFT
        speed.x -= step;
    }
    if(keyboard[39]){ // RIGHT
        speed.x += step;
    }

    if (keyboard[16]){ // ACCELERATION
        speed.z += step;
    }

    if (keyboard[32] && cooldown == false){
        fireLaser();
        cooldown = true;
    }
}

function keyDown(event){keyboard[event.keyCode] = true;}
function keyUp(event){
    keyboard[event.keyCode] = false;
    cooldown = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
/*=============================================
 =                  Movement                  =
 =============================================*/
function movement(){
    //spaceShip movement
    spaceShip.position.x += speed.x;
    spaceShip.position.y += speed.y;

    //inertia
    speed.x -= speed.x * 0.01;
    speed.y -= speed.y * 0.01;
    speed.z -= speed.z * 0.1;

    //rotation spaceShip
    spaceShip.rotation.z = - speed.x * 0.03;
    spaceShip.rotation.x = speed.y * 0.01;
}
/*=============================================
 =                 fireLaser                 =
 =============================================*/
function fireLaser(){
    for (let j=0;j<shots.length;j++){
        if(shots[j].move == false){
            shots[j].spawn();
            break;
        }
    }
}