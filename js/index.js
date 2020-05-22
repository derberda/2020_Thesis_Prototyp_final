let container;
let camera;
let renderer;
//Create Scene
let scene = new THREE.Scene();
let shoe;

let productContainer = document.querySelector('#divProduct');
let product = document.querySelector('canvas');

init = () => {
    container = document.querySelector('.scene');

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

    // renderer.setClearColor("#e5e5e5");
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    let loader = new THREE.GLTFLoader();
    loader.load("../blender/adidas_stan-smith2.gltf", (gltf) => {
        scene.add(gltf.scene);
        shoe = gltf.scene.children[0];
        scene.position.set(0, -.05, 0);

    })

    container.appendChild(renderer.domElement);

    animate();
}

animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

init();

//Responsive
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);
})

//Canvas element je nach dem ob es fokussiert wird klasse hinzufügen oder removen
focusCanvasElement = () =>{
    productContainer.addEventListener('focus', () =>{
        productContainer.classList.add('blurOuterContainer');
        product.classList.add('focusCanvas');
    })
    productContainer.addEventListener('blur', () =>{
        productContainer.classList.remove('blurOuterContainer');
        product.classList.remove('focusCanvas');
    })
}
focusCanvasElement();