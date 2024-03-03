import './style.css'
import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
/* import * as dat from 'dat.gui'; */

const objects = [];
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

/* const gui = new dat.GUI(); */

//Textures
const textureLoader = new THREE.TextureLoader()
const color = textureLoader.load('/mud/textures/mud_forest_diff_4k.jpg')
const normalColor = textureLoader.load('/mud/textures/mud_forest_nor_gl_4k.jpg')
const aoColor = textureLoader.load('/mud/textures/mud_forest_ao_4k.jpg')
const dispColor = textureLoader.load('/mud/textures/mud_forest_disp_4k.png')
const roughColor = textureLoader.load('/mud/textures/mud_forest_rough_4k.jpg')
const metalColor = textureLoader.load('/mud/textures/mud_forest_arm_4k.jpg')

color.repeat.set(25, 25)
normalColor.repeat.set(25, 25)
aoColor.repeat.set(25, 25)
dispColor.repeat.set(25, 25)
roughColor.repeat.set(25, 25)

color.wrapS = THREE.RepeatWrapping
normalColor.wrapS = THREE.RepeatWrapping
aoColor.wrapS = THREE.RepeatWrapping
dispColor.wrapS = THREE.RepeatWrapping
roughColor.wrapS = THREE.RepeatWrapping

color.wrapT = THREE.RepeatWrapping
normalColor.wrapT = THREE.RepeatWrapping
aoColor.wrapT = THREE.RepeatWrapping
dispColor.wrapT = THREE.RepeatWrapping
roughColor.wrapT = THREE.RepeatWrapping

color.generateMipmaps = false
color.minFilter = THREE.NearestFilter


//GLTF
// Instantiate a loader
const loader = new GLTFLoader();


//Oak Trees
loader.load('/oak_trees.glb', function ( glb ) {
  const model = glb.scene.getObjectByName('Treesmall_bark1_0')
  const oakGeo = model.geometry.clone()
  const oakMat = model.material
  const oakMesh = new THREE.InstancedMesh(oakGeo, oakMat, 400)
  scene.add( oakMesh );
  
  const oak = new THREE.Object3D()
  for(let i = 0; i < 400; i++) {
    const angle = Math.random() * Math.PI * 10 // Random angle
    const radius = 3 + Math.random() * 8      // Random radius
    const x = Math.cos(angle) * radius        // Get the x position using cosinus
    const z = Math.sin(angle) * radius        // Get the z position using sinus
    
    oak.scale.set(0.01, 0.01, 0.01)
    oak.position.set(x, 0, z)
    oak.updateMatrix();
    oakMesh.setMatrixAt(i, oak.matrix);
    }
  });


  //Flying stone
  loader.load('/magic_stone.glb', function ( glb ) {
  const model = glb.scene.getObjectByName('pPlatonic1_lambert2_0')
  const stoneGeo = model.geometry.clone()
  const stoneMat = model.material
  const magicStone = new THREE.InstancedMesh(stoneGeo, stoneMat, 40)
  scene.add( magicStone );
  
  const stone = new THREE.Object3D()
  for(let i = 0; i < 40; i++) {
    const angle = Math.random() * Math.PI * 7 // Random angle
    const radius = 3 + Math.random() * 9      // Random radius
    const x = Math.cos(angle) * radius        // Get the x position using cosinus
    const z = Math.sin(angle) * radius        // Get the z position using sinus
    
    stone.scale.set(0.1, 0.1, 0.1)
    stone.position.set(x, 0.3, z)
    stone.updateMatrix();
    magicStone.setMatrixAt(i, stone.matrix);
    }
  });


  //House
  loader.load(
    // resource URL
    '/House/scene.gltf',
    // called when the resource is loaded
    function ( gltf ) {
      const model = gltf.scene
      model.position.set(1.3, 0.01, 1.2)
      /* gui.add(model.position, 'x').min(0).max(10).name('houseX')
      gui.add(model.position, 'y').min(0).max(10).name('houseY')
      gui.add(model.position, 'z').min(0).max(10).name('houseZ') */
      scene.add( model );   
    },
    );
    
//Renderer

const renderer = new THREE.WebGLRenderer({
  antialias: true,
})
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.setClearColor('#262837')
document.body.appendChild( renderer.domElement );

//Scene
const scene = new THREE.Scene()
scene.fog = new THREE.FogExp2('#262837', 1); // Parameters: color, near, far
scene.fog.density = 0.5;


const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//Camera
const camera = new THREE.PerspectiveCamera(65, sizes.width / sizes.height, 0.1, 100 )
camera.position.z = 10
camera.position.y = 0.5
scene.add(camera)

// Controls
/* const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true */
const controls = new PointerLockControls( camera, document.body );
const blocker = document.getElementById( 'blocker' );
				const instructions = document.getElementById( 'instructions' );

				instructions.addEventListener( 'click', function () {

					controls.lock();

				} );

				controls.addEventListener( 'lock', function () {

					instructions.style.display = 'none';
					blocker.style.display = 'none';

				} );

				controls.addEventListener( 'unlock', function () {

					blocker.style.display = 'block';
					instructions.style.display = '';

				} );

				scene.add( controls.getObject() );

const onKeyDown = function ( event ) {

  switch ( event.code ) {

    case 'ArrowUp':
    case 'KeyW':
      moveForward = true;
      break;

    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = true;
      break;

    case 'ArrowDown':
    case 'KeyS':
      moveBackward = true;
      break;

    case 'ArrowRight':
    case 'KeyD':
      moveRight = true;
      break;
  }

};

const onKeyUp = function ( event ) {

  switch ( event.code ) {

    case 'ArrowUp':
    case 'KeyW':
      moveForward = false;
      break;

    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = false;
      break;

    case 'ArrowDown':
    case 'KeyS':
      moveBackward = false;
      break;

    case 'ArrowRight':
    case 'KeyD':
      moveRight = false;
      break;

  }

};

document.addEventListener( 'keydown', onKeyDown );
document.addEventListener( 'keyup', onKeyUp );

const raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

//Lights
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight( '#b9d5ff', 0.12 );
scene.add( directionalLight );


//FrontLight
const housePointLight = new THREE.PointLight(0xff0000, 0.5, 4, 4 )
housePointLight.castShadow = true
scene.add(housePointLight)

//TowerLight
const towerPointLight = new THREE.PointLight(0x40e0d0, 1, 1, 50 )
towerPointLight.castShadow = true
scene.add(towerPointLight)

const forestLight = new THREE.SpotLight('#b9d5ff', 1, 10, 2, 0.5, 2)
scene.add(forestLight)

/* const towerPointLightHelper = new THREE.PointLightHelper(towerPointLight)
scene.add(towerPointLightHelper) */

housePointLight.position.set(-0.3, 0.8, 1)
/* gui.add(housePointLight.position, 'x').min(-3).max(3).name('spotX')
gui.add(housePointLight.position, 'y').min(-3).max(3).name('spotY')
gui.add(housePointLight.position, 'z').min(-3).max(3).name('spotZ')
gui.add(housePointLight, 'intensity').min(-3).max(20).name('Intensity') */

towerPointLight.position.set(-1.65, 2.13, 0.7)
/* gui.add(towerPointLight.position, 'x').min(-3).max(3).name('spotX')
gui.add(towerPointLight.position, 'y').min(-3).max(3).name('spotY')
gui.add(towerPointLight.position, 'z').min(-3).max(3).name('spotZ')
gui.add(towerPointLight, 'intensity').min(-3).max(20).name('Intensity') */

forestLight.position.set(0, 1, 5)
/* gui.add(forestLight.position, 'x').min(-3).max(3).name('forX')
gui.add(forestLight.position, 'y').min(-3).max(3).name('forY')
gui.add(forestLight.position, 'z').min(-3).max(3).name('forZ')
gui.add(forestLight, 'intensity').min(-3).max(20).name('forInt') */

//object
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(25, 25, 1000, 1000),
  new THREE.MeshStandardMaterial({
      map: color,
      transparent: true,
      aoMap: aoColor,
      normalMap: normalColor,
      displacementMap: dispColor,
      displacementScale: 0.03,
      roughnessMap: roughColor,
      metalnessMap: metalColor,
      }
  ),
  )
  
  floor.castShadow = true
  floor.receiveShadow = true
  floor.position.y = 0
  floor.rotation.x = - Math.PI * 0.5
  floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 3))
  console.log(floor.geometry.attributes)
  scene.add(floor)

  
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  
  function animate() {

    requestAnimationFrame( animate );

    const time = performance.now();

    if ( controls.isLocked === true ) {

      raycaster.ray.origin.copy( controls.getObject().position );
      raycaster.ray.origin.y -= 10;

      const intersections = raycaster.intersectObjects( objects, false );

      const onObject = intersections.length > 0;

      const delta = ( time - prevTime ) / 10000;

      velocity.x -= velocity.x * 10.0 * delta;
      velocity.z -= velocity.z * 10.0 * delta;

      velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

      direction.z = Number( moveForward ) - Number( moveBackward );
      direction.x = Number( moveRight ) - Number( moveLeft );
      direction.normalize(); // this ensures consistent movements in all directions

      if ( moveForward || moveBackward ) velocity.z -= direction.z * 30.0 * delta;
      if ( moveLeft || moveRight ) velocity.x -= direction.x * 30.0 * delta;

      if ( onObject === true ) {

        velocity.y = Math.max( 0, velocity.y );

      }

      controls.moveRight( - velocity.x * delta );
      controls.moveForward( - velocity.z * delta );

/*       controls.getObject().position.y += ( velocity.y * delta ); // new behavior

      if ( controls.getObject().position.y < 10 ) {

        velocity.y = 0;
        controls.getObject().position.y = 10;

      }
 */
    }

    prevTime = time;

    renderer.render( scene, camera );

  }
  
  animate()

