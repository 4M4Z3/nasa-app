/* 

ThreeJs documentation:
https://threejs.org/docs/

-------

In Three.js, you start off by creating a scene. This is the main world, 
which will have the camera, maybe a background color or image, and the objects.

This is the initialization boilerplate:

const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);

Don't worry about this too much.

-------

You can do scene.add(~example_object~) to add more objects to the scene. You can
change the object's position, rotation, scale, etc, once it is added to the scene.

Objects must have geometries and materials in order to be created and added to the scene.

let newGeometry = new Three.BoxGeometry();
let newMaterial = new Three.MeshBasicMaterial();
let newCube = new Three.Mesh(newGeometry, newMaterial);
scene.add(newCube);

Above, we created a Box Geometry that comes default from Three.js.

Here are some more geometries:
https://www.tutorialspoint.com/threejs/threejs_geometries.htm

These include spheres, cones, icosahedrons, and more.

--------

You can also make THREE.Group() objects to make groups in the scene.

Let's add the group to the scene:

let myGroup = new THREE.Group();
myGroup.add(newCube);
scene.add(myGroup);

--------

Why would we make a group?

This is useful if we have a lot of objects that will act together. Imagine we make a spaceship
out of a cylinder geometry and cube geometry. We can make a group, add all of the sub-objects
to the group, then we can simply move the spaceship as a single unit from there.

// Create the spaceship group
const spaceship = new THREE.Group();

// Create the cylinder geometry and add it to the spaceship
const bodyGeometry = new THREE.CylinderGeometry(1, 1, 10, 32);
const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.rotation.x = Math.PI / 2;
spaceship.add(body);

// Create the box geometry and add it to the group
const wingGeometry = new THREE.BoxGeometry(0.2, 0.2, 8);
const wingMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const wing = new THREE.Mesh(wingGeometry, wingMaterial);
wing.position.set(1.5, 0, 0); // Position wing slightly off to the side
spaceship.add(wing);

// Add the group to the scene
scene.add(spaceship);

// Move the spaceship as we please
spaceship.position.set(5, 5, 0);

--------

Generally speaking, you should not have to do much more than move objects
around and rotate them.

Rotations are measured in radians:

obj.rotation.x = Math.PI;
obj.rotation.y = 5;
obj.rotation.z = 5;

OR

obj.rotation.set(Math.PI,5,5);

Positions are measured in units:

obj.position.x = 5;
obj.position.y = 5;
obj.position.z = 5;

OR

obj.position.set(5,5,5);

--------

There are many other ways that you can manipulate the scene to create cool effects.

--HARD: You can use raycasting to make it so that you can click on 3d objects (draws an invisible ray from camera to object)
-----HINT: I would just look this up on Google. You have to check if the mouse is clicked, and if the ray
-----is currently intersecting the desired object, then perform an action
--HARD: Interpolate between points. So instead of teleporting objects around, figure out how to move them 
--slowly to a desired point. 
-----HINT: Maybe we give each object a velocity or acceleration.
-----HINT 2: Maybe make an array or store variables with the current starting point and end point, and move a portion of that
-----distance every frame. After a certain amount of frames, we should be at the desired point so we should stop
-----moving, so we should set our velocity to 0.
--EASY: Load in 3d objects... I already made that easy for you

*/





// Initialization Boilerplate
// This will always go on the top of your scene, so don't worry about it too much
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
// You can optionally change your Camera's FOV angle, which is 75 in this case
// 75 is a good angle




/* 
    Optional... move camera away from (0,0,0)
    you can also move objects by using obj.position.set(x,y,z)
*/
camera.position.z = 10; 


/* 
    3d objects located in /assets
    If you want to add more 3d objects, simply put ~example_3d_object.glb~ inside the /assets folder,
    and add the name as a string inside the below array

    It is usually a lot harder to add 3d objects, so this will streamline it.

*/
const obj_filenames = ["basketball", "hoop", "spaceshuttle"]; 

let three_objs = new Map(); 
/*
    You can access the 3d objects you have loaded via three_objs.get("example_object")

    I created a map so you can quickly access all 3d models effectively

    three_objs.get("basketball") accesses the basketball 3d model for example:
    three_objs.get("basketball")scale.set(3,3,3);

    BTW: a map is essentially the same thing as a Python dictionary. They
    are very fast, and operate via key-value pairs. In this case, we are mapping
    a string called "basketball" onto the desired 3d object stored inside
    the "three_objs" map
*/






/* 
    Functions that load objects into the map
    You don't really have to worry about the implementation of this that much
    We're simply loading the 3d object files into the three_objs map

    This uses asynchronous loading, which means other code you write will
    essentially execute in parellel while the 3d models are being loaded.

    Because of this, you should not manipulate any 3d model until you are
    certain that it has already been loaded.

    I created a "all_objs_loaded" boolean that will be set to true whenever
    all of the 3d models have been successfully loaded in.
*/

function loadObj(objName) {
    const loader = new THREE.GLTFLoader();
    const path = `assets/${objName}.glb`;

    return new Promise((resolve, reject) => {
        loader.load(
            path,
            (gltf) => {
                three_objs.set(objName, gltf.scene);
                console.log(`${objName} loaded`);
                resolve(gltf.scene);
            },
            undefined,
            (error) => {
                console.error(`Error loading ${objName}:`, error);
                reject(error); 
            }
        );
    });
}
let all_objs_loaded = false;
async function loadObjs(obj_filenames) {
    try {
        const loadedObjects = await Promise.all(obj_filenames.map(loadObj)); 
        loadedObjects.forEach(obj => {
            scene.add(obj); 
        });
        all_objs_loaded = true; // all 3d models have been successfully loaded in
        console.log('All objects loaded!');
    } catch (error) {
        console.error('Error loading some objects:', error);
    }
}
loadObjs(obj_filenames);




// It gets easier from here...




let cube; // Declare cube object outside of createBox() function so that other functions have access to it (so it will be in scope)

// Function to create a simple box geometry and add it to the scene
function createBox() {
    let geometry = new THREE.BoxGeometry();
    let material = new THREE.MeshBasicMaterial({ color: 0x0077ff, wireframe: true }); // try changing color, disabling wireframe
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
}
createBox();


// Create a starArray that will hold the star objects so we can manipulate them later
let starArray = []
// Function to iteratively add star objects to the scene at random points
function addStars() {
    for (let i = 0; i < 100; i++) {
        let geometry = new THREE.IcosahedronGeometry();
        let material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
        let icosahedron = new THREE.Mesh(geometry, material);
        scene.add(icosahedron);

        // Resize icosahedrons and give them a random position
        icosahedron.scale.set(0.2, 0.2, 0.2);
        icosahedron.position.set((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
        
        // Optionally add each star to the starArray
        // If we want to manipulate a lot of objects, we can loop through this array and manipulate
        // the individual objects. See what we do in the animate() function
        starArray.push(icosahedron);
    }
}
addStars();
/*
    Notice how we are reusing common variable names like geometry, material, etc.
    We can do this because these variables are scoped inside of functions.
    If you do this, just remember to declare the 3d model itself outside of
    the function if you want to access it later.
*/




// Rotate the stars. We're currently calling this every frame via the animate() function
function rotateStars(){
    for (let i=0; i<starArray.length; i++){
        starArray[i].rotation.x += 0.1;
        starArray[i].rotation.y += 0.1;
    }

    /*
    You can also do:

    starArray.forEach(star => {
        star.rotation.x += 0.1;
        star.rotation.y == 0.1;
    });

    Instead of starArray[i], we can create a parameter
    for an arrow function and call it star.
    
    This is higher level stuff, but I thought I would
    show it off.

    It's how for-each loops work in Javascript.
    */
}


// We call this function when the "Toggle Cube Rotation" button is clicked
// See index.html, styles.css for its formatting
function toggleCubeRotation(){
    rotation_enabled = !rotation_enabled;
}

// Similar to the star rotation, we will call this function every frame
// If rotation is not enabled, we do nothing
let rotation_enabled = true;
function rotateCube(){
    if (rotation_enabled){
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    }
}




// Add lights to the scene. We can't see the 3d models without these
function addLights(){
    // Add directional light to the scene
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
    
    // Add ambient light to the scene
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
}
addLights();



// We call this function when the "Toggle Imported Object Opacity" button is clicked
let opacity = 1;
function toggleImportedOpacity(){
    if (opacity == 1){
        opacity = 0;
    }
    else {
        opacity = 1;
    }

    three_objs.forEach(obj => {
        obj.traverse(child => {
            if (child.isMesh && child.material) {
                child.material.opacity = opacity;
                child.material.transparent = true; // Enable transparency if necessary
            }
        });
    });
}




/*
    Function that transforms the 3d objects we loaded in.

    Only runs once all 3d objs have loaded in
    If we try to manipulate the 3d objs before they have
    loaded in, we will get some weird errors

    This is just an example. You can take this out.
    Notice how we are making sure that all objects are loaded.
    
    We also have a "transformed" boolean that we set to false
    just to make sure we only run this function once.

    Although this ~may~ be bad practice, we are calling this
    function every frame in animate()
*/

let transformed = false;
function transformThreeObjs(){
    if (all_objs_loaded && !transformed){
        // An example of how to loop over all of the 3d objects
        three_objs.forEach(obj => {
            obj.scale.set(0.3,0.3,0.3);
            offset = (Math.random() - 0.5) * 6;
            obj.position.set(offset,offset,offset);
            obj.rotation.set(offset,offset,offset);

        });
        
        // An example of individually manipulating a specific 3d model
        three_objs.get("hoop").scale.set(3,3,3);
        three_objs.get("spaceshuttle").scale.set(0.002,0.002,0.002)
        three_objs.get("spaceshuttle").position.set(0,5,0);
        three_objs.get("spaceshuttle").rotation.set(0,5,0);
        
        transformed = true;
    }
}





/* 
    Example of a cool animation using an imported 3d object, trig functions
    We use trig functions so the spaceshuttle will orbit the cube
    https://en.m.wikipedia.org/wiki/File:Circle_cos_sin.gif
*/
let spaceShuttleTime = 0;
let orbitRadius = 5;
function animateSpaceShuttle() {
    if (all_objs_loaded) {
        let shuttle = three_objs.get("spaceshuttle");
        if (shuttle) {
            shuttle.position.x = Math.sin(spaceShuttleTime) * 5;
            shuttle.position.z = Math.cos(spaceShuttleTime) * 5;
            shuttle.position.y = 0; 

            // shuttle.rotation.x = Math.PI / 6;
            shuttle.rotation.y = spaceShuttleTime + Math.PI / 2;

            spaceShuttleTime += 0.01;
        }
    }
}





// Main render loop. This is what changes every frame.
function animate() {
    // You must keep the following two lines in
    // They are most important for rendering
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    // Optionally call these functions every frame for animation
    rotateStars();
    rotateCube();
    animateSpaceShuttle();
    transformThreeObjs();
}
animate();





/*
    Window Resize Boilerplate
    This ensures that we do not get any weird distortions if we
    adjust the window size.
*/
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
}

/* 

This is the way I would go about this:

Think about the behavior you want for this project and write functions
that will move the camera and objects to desired positions to
create visualizations

You can create buttons in index.html that will call your functions
from main.js using onclick="example_function()" when the buttons are clicked on.

You can optionally interpolate the movement in the scene, meaning you will
move the objects from point A to point B by giving them a velocity, and
add their current velocity (and rotational velocity) to their current 
position every frame until their desired point is reached.

    Remember: velocity is change in position, and acceleration is change in velocity.

Otherwise, you can simply make your functions teleport the objects to their
desired positions using 

example_obj.position.set(x,y,z);

*/
