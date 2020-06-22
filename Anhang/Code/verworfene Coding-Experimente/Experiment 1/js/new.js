//Variables for setup
var camera;
var renderer;
var scene;
var shoe;

var startTime = Date.now();
var scrollY = 0;
var touchStartY = 0;
var _event = {
    y: 0,
    deltaY: 0
};
var timeline = null;
var percentage = 0;
// this is the container where we will attach the scroll event. For this example we will set its height to 1200vh.
var divContainer = document.querySelector('.container');
// container height - window height to limit the scroll at the top of the screen when we are at the bottom of the container
var container = document.querySelector('.scene');
var maxHeight = (divContainer.clientHeight || divContainer.offsetHeight) - window.innerHeight
var span = document.querySelector('span');


createScene = () => {
    //Create Scene
    scene = new THREE.Scene();

    const fov = 20;
    const aspect = container.clientWidth / container.clientHeight;
    const near = .1;
    const far = 500;

    //Camera Setup
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(-1, 0, 0);
    camera.lookAt(0, 0, 0);

    //Light Setup
    const ambient = new THREE.AmbientLight(0x404040, 3.5);
    scene.add(ambient);

    const light = new THREE.DirectionalLight(0xffffff, .3);
    scene.add(light);

    //Renderer Setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor("#e5e5e5");
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(renderer.domElement);

    scene.add(shoe);
}

loadModel = () => {
    let loader = new THREE.GLTFLoader();
    loader.load("../blender/adidas_stan-smith.gltf", (gltf) => {
        scene.add(gltf.scene);
        shoe = gltf.scene.children[0];
        shoe.position.set(0, -.05, 0);

        timeline = anime.timeline({
            autoplay: false,
            duration: 4500,
            easing: 'easeOutSine'
        });
        timeline.add({
            targets: shoe.position,
            x: 100,
            y: 25,
            z: -50,
            duration: 2250,
            update: camera.updateProjectionMatrix()
        })
        timeline.add({
            targets: shoe.position,
            x: 0,
            y: 0,
            z: 50,
            duration: 2250,
            update: camera.updateProjectionMatrix()
        })
        var value = new THREE.Color(0xFFFCFC)
        var initial = new THREE.Color(0x161216)
        timeline.add({
            targets: initial,
            r: [initial.r, value.r],
            g: [initial.g, value.g],
            b: [initial.b, value.b],
            duration: 4500,
            update: () => {
                renderer.setClearColor(initial);
            }
        }, 0);
    })
}

initTimeline = (shoe, gltf) => {
    
}

animate = () => {
    render();
    requestAnimationFrame(animate);
}

render = () => {
    var dtime = Date.now() - startTime;
    // easing with treshold on 0.08 (should be between .14 & .2 for smooth animations)
    percentage = lerp(percentage, scrollY, .08);
    timeline.seek(percentage * (4500 / maxHeight));
    span.innerHTML = 'Anim progressd : ' + Math.round(timeline.progress * 100) / 100 + '%';

    // animate the cube
    shoe.rotation.x += 0.01;
    shoe.rotation.y += 0.0125;
    shoe.rotation.z += 0.012;
    renderer.render(scene, camera);
}
lerp = (a, b, t) => {
    return ((1 - t) * a + t * b);
}

init = () => {
    createScene()
    initTimeline()
    window.addEventListener('resize', resize, { passive: true })
    divContainer.addEventListener('wheel', onWheel, { passive: false });
    animate()
}

//Responsive
resize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);
}

onWheel = (e) => {
    var evt = _event;
    evt.deltaY = e.wheelDeltaY || e.deltaY * -1;
    // reduce by half the delta amount otherwise it scroll too fast (in a other way we could increase the height of the container too)
    evt.deltaY *= 0.5;

    scroll(e);
};

scroll = (e) => {
    var evt = _event;
    // limit scroll top
    if ((evt.y + evt.deltaY) > 0) {
        evt.y = 0;
        // limit scroll bottom
    } else if ((-(evt.y + evt.deltaY)) >= maxHeight) {
        evt.y = -maxHeight;
    } else {
        evt.y += evt.deltaY;
    }
}

/*window.addEventListener("wheel", event => {
  if(event.deltaY > 1 ){
    shoe.rotation.x = Math.PI/2;
  }
  else{
    shoe.rotation.x = -(Math.PI/2);
  }
  console.info("X: " + event.deltaX + ", Y: " + event.deltaY + ", Z: " + event.deltaZ);
  getScrollPercent();
});*/

init();






