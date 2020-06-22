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