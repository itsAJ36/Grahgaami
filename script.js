import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, mars;
const events = [
    { name: "Event 1", position: { x: 1, y: 1, z: 1 } },
    { name: "Event 2", position: { x: -1, y: 1, z: -1 } },
    // Add more events with positions
];

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    const container = document.getElementById('mars-container');
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Add light to the scene
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    const loader = new GLTFLoader();
    loader.load('assets/mars-model/mars.gltf', function (gltf) {
        mars = gltf.scene;
        scene.add(mars);
        mars.rotation.y = Math.PI / 8;
        animate();
    }, undefined, function (error) {
        console.error(error);
    });

    camera.position.z = 5;

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    if (mars) {
        mars.rotation.y += 0.01;
    }
    renderer.render(scene, camera);
}

function displayEvents() {
    const eventsList = document.getElementById('events');
    events.forEach(event => {
        const li = document.createElement('li');
        li.textContent = event.name;
        li.addEventListener('click', () => {
            highlightEvent(event.position);
            alert(`Highlighting ${event.name} on Mars`);
        });
        eventsList.appendChild(li);
    });
}

function highlightEvent(position) {
    const highlight = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xff5722 })
    );
    highlight.position.set(position.x, position.y, position.z);
    scene.add(highlight);
    setTimeout(() => {
        scene.remove(highlight);
    }, 2000);
}

window.onload = function () {
    init();
    displayEvents();
};
