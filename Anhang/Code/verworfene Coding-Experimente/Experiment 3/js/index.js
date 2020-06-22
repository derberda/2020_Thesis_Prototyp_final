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

        console.log(shoe.rotation.x + "|" + shoe.rotation.y + "|" + shoe.rotation.z)
        console.log(shoe);

        //Hotspot am Anfang verstecken
        for (let i = 5; i <= 10; i++) {
            shoe.parent.children[i].material.visible = false;
        }
    })

    container.appendChild(renderer.domElement);

    animate();
}

animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

init();

//3D-Modell laden und Hotspots verstecken
// loadObject = () => {

// }

getActiveStatus = () => {
    $('#carouselExampleIndicators').on('slide.bs.carousel', function onSlide(ev) {
        let id = ev.relatedTarget.id;

        switch (id) {
            //normale Ansicht vorne
            case "info_1":
                console.log("test: 1")
                TweenMax.to(shoe.rotation, 1, { x: -1.570796461153735, y: 0, z: 0 });
                TweenMax.to(camera.position, 1, { x: -1, y: 0, z: 0 });

                showHotspot();
                break;
            //Ansicht der Schuhzunge
            case "info_2":
                console.log("test: 2")
                TweenMax.to(shoe.rotation, 1, { x: -1.570796461153735, y: 0, z: 0 });
                TweenMax.to(shoe.parent.children[5].rotation, 1, { x: -1.570796461153735, y: 0, z: 0 });
                TweenMax.to(camera.position, 1, { x: -.4, y: .05, z: 0 });

                showHotspot(5);
                break;
            //Anischt Öse
            case "info_3":
                console.log("test: 3")
                TweenMax.to(shoe.rotation, 1, { z: 1 });
                TweenMax.to(shoe.parent.children[6].rotation, 1, { y: .09 });
                TweenMax.to(camera.position, 1, { x: -.8, y: .05, z: 0 });

                showHotspot(6)
                break;
            //Ansicht der seitlichen Löcher
            case "info_4":
                console.log("test: 4")
                TweenMax.to(shoe.rotation, 1, { z: 1.3 });
                // TweenMax.to(shoe.parent.children[7].rotation, 1, { z: 1.3 });
                TweenMax.to(shoe.parent.children[7].rotation, 1, { y: .09 });
                TweenMax.to(camera.position, 1, { x: -.8, y: .02, z: 0 });

                showHotspot(7);
                break;
            //Ansicht der Nähte
            case "info_5":
                console.log("test: 5")
                TweenMax.to(shoe.rotation, 1, { x: -1.570796461153735, y: 0, z: 0 });
                TweenMax.to(shoe.parent.children[8].rotation, 1, { x: -1.570796461153735, y: 0, z: 0 });
                TweenMax.to(camera.position, 1, { x: -.7, y: .01, z: 0 });

                showHotspot(8);
                break;
            //Ansicht der Schuhsohle
            case "info_6":
                console.log("test: 6")
                TweenMax.to(shoe.rotation, 1, { x: -1.570796461153735, y: 0.5, z: 0 });
                TweenMax.to(shoe.parent.children[10].rotation, 1, { x: -1.570796461153735, y: 0.5, z: 0 });
                TweenMax.to(camera.position, 1, { x: -.45, y: 0, z: 0 });

                showHotspot(10)
                break;
            //Ansicht von Hinten
            case "info_7":
                console.log("test: 7")
                TweenMax.to(shoe.rotation, 1, { x: -1.570796461153735, y: 0, z: 3.2 });
                TweenMax.to(shoe.parent.children[9].rotation, 1, { x: -1.570796461153735, y: 0, z: 3.2 });
                TweenMax.to(camera.position, 1, { x: -1, y: 0, z: 0 });

                showHotspot(9);
                break;
            default:
                break;
        }
    })
}


// window.addEventListener('load', loadObject, false);

//Responsive
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);
})

// window.addEventListener('focus', () =>{
//     // console.log("fokus")
//     // console.log(product)
//     if ($("#divProduct").is(":focus")) {
//         product.classList.add('focusCanvas');
//     }else{
//         product.classList.remove('focusCanvas');
//     }
// } )

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

//jeweilige Hotspots je nach Ansicht anzeigen lassen
showHotspot = (hotspotNumber) => {
    for (let i = 5; i <= 10; i++) {
        if (i == hotspotNumber) {
            shoe.parent.children[i].material.visible = true;
        } else {
            shoe.parent.children[i].material.visible = false;
        }
    }
}
