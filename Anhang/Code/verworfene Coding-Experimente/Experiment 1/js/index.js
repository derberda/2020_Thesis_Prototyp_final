var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
var camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, .1, 500);
var shoe = null;
var container = document.querySelector('.webgl');
var startTime = Date.now();
var scrollY = 0;
var touchstartY = 0;
var _event = { y: 0, deltaY: 0 };
var timeline = null;
var percentage = 0;
var divContainer = document.querySelector('.container');
var maxHeight = (divContainer.clientHeight || divContainer.offsetHeight) - window.innerHeight;
var span = document.querySelector('span');
var textInfo = document.querySelector('text');

function Paragraph(x, y) {
  this.xValue = x;
  this.yValue = y;
}

var p1 = document.querySelector('#p1');
p1 = new Paragraph(-1020, -1500)

var p2 = document.querySelector('#p2');
p2 = new Paragraph(-2000, -2500)


function createScene() {
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  // renderer.setClearColor("#e5e5e5");
  camera.position.set(-1, 0, 0);
  camera.lookAt(0, 0, 0);

  const ambient = new THREE.AmbientLight(0x404040, 3.5);
  scene.add(ambient);

  const light = new THREE.DirectionalLight(0xffffff, .3);
  scene.add(light);

  container.appendChild(renderer.domElement);
  addModel();
};

function addModel() {
  var loader = new THREE.GLTFLoader();
  loader.load("../blender/adidas_stan-smith.gltf", (gltf) => {
    scene.add(gltf.scene);
    shoe = gltf.scene.children[0];
    shoe.position.set(0, .01, 0);
    shoe.rotation.set(-1.5, -1.5, 0.7);

    initTimeline(shoe.rotation);
    //keyControll(shoe.rotation);
  })
};

function initTimeline(shoe) {
  timeline = anime.timeline({
    autoplay: false,
    duration: 500000,
    easing: 'easeOutSine'
  });
  timeline.add({
    targets: shoe,
    x: -1,
    y: 1,
    z: 0,
    duration: 500000,
    update: camera.updateProjectionMatrix()
  })

};

function animate() {
  // render the 3D scene
  render();
  // relaunch the 'timer' 
  requestAnimationFrame(animate);
};

function render() {
  var dtime = Date.now() - startTime;
  // easing with treshold on 0.08 (should be between .14 & .2 for smooth animations)
  percentage = lerp(percentage, scrollY, .8);
  timeline.seek(percentage * (900000 / maxHeight));
  // span.innerHTML = 'Anim progress : ' + Math.round(timeline.progress * 100) / 100 + '%';

  renderer.render(scene, camera);
};

// linear interpolation function
function lerp(a, b, t) {
  return ((1 - t) * a + t * b);
};

function init() {
  createScene();
  initTimeline();
  window.addEventListener('resize', resize, { passive: true });
  divContainer.addEventListener('wheel', onWheel, { passive: false });
  //window.addEventListener('keydown', keyControll);

  divContainer.addEventListener('touchstart', onTouchStart, { passive: false });
  divContainer.addEventListener('touchmove', onTouchMove, { passive: false });
  animate();
};

//Responsive
function resize() {
  // cointainer height - window height to limit the scroll at the top of the screen when we are at the bottom of the container
  /*maxHeight = (divContainer.clientHeight || divContainer.offsetHeight) - window.innerHeight
  renderer.width = container.clientWidth;
  renderer.height = container.clientHeight;*/
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}

function onWheel(e) {
  var evt = _event;
  evt.deltaY = e.wheelDeltaY || e.deltaY * -1;
  // reduce by half the delta amount otherwise it scroll too fast
  evt.deltaY *= 0.5;

  scroll(e);
};

function scroll(e) {
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
  scrollY = -evt.y
  console.log(evt.y);
  
  easingText(evt.y);
  
  anime(evt.y);
};

function easingText(e) {
  console.log(e + " <= " + p1.xValue + " | " + e + " >= " + p1.yValue);
  var p11 = document.getElementById("p1");
  var p22 =document.getElementById("p2");
  if (e <= p1.xValue && e >= p1.yValue) {
    p11.style.visibility = "visible";
  } else {
    p11.style.visibility = "hidden";
  }

  if (e <= p2.xValue && e >= p2.yValue) {
    p22.style.visibility = "visible";
  } else {
    p22.style.visibility = "hidden";
  }

}

function onTouchStart(e) {
  var t = (e.targetTouches) ? e.targetTouches[0] : e;
  touchStartY = t.pageY;
};

function onTouchMove(e) {
  var evt = _event;
  var t = (e.targetTouches) ? e.targetTouches[0] : e;
  evt.deltaY = (t.pageY - touchStartY) * 5;
  touchStartY = t.pageY;

  scroll(e)
};



init();


