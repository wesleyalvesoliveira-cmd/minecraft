import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

// --- 1. CONFIGURAÇÃO INICIAL DA CENA ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x74b9ff); // Céu azul
scene.fog = new THREE.FogExp2(0x74b9ff, 0.02); // Neblina para parecer infinito

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- 2. ILUMINAÇÃO ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 15);
scene.add(directionalLight);

// --- 3. CONTROLES DE MOVIMENTO (Estilo FPS/Minecraft) ---
const controls = new PointerLockControls(camera, document.body);

// Clique na tela para ativar o controle do mouse
document.body.addEventListener('click', () => {
    controls.lock();
});

const keys = { w: false, a: false, s: false, d: false };
document.addEventListener('keydown', (e) => { if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = true; });
document.addEventListener('keyup', (e) => { if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = false; });

// Configuração do jogador
camera.position.set(10, 3, 10); // Posição inicial
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const speed = 0.15;

// --- 4. GERAÇÃO DO MUNDO (Mundo de blocos) ---
// Texturas simples usando cores do bloco (Grama)
const blockGeometry = new THREE.BoxGeometry(1, 1, 1);

// Criando cores para as faces (Verde em cima, marrom nos lados/baixo)
const materials = [
    new THREE.MeshLambertMaterial({ color: 0x55efc4 }), // Lados
    new THREE.MeshLambertMaterial({ color: 0x55efc4 }), 
    new THREE.MeshLambertMaterial({ color: 0x2ecc71 }), // Cima (Verde)
    new THREE.MeshLambertMaterial({ color: 0x8b5a2b }), // Baixo (Marrom)
    new THREE.MeshLambertMaterial({ color: 0x55efc4 }), 
    new THREE.MeshLambertMaterial({ color: 0x55efc4 })
];

// Gerar um terreno de 20x20 blocos
const worldSize = 20;
for (let x = 0; x < worldSize; x++) {
    for (let z = 0; z < worldSize; z++) {
        // Altura levemente ondulada usando matemática simples
        const height = Math.floor(Math.sin(x * 0.2) * 2 + Math.cos(z * 0.2) * 2);
        
        for (let y = -3; y <= height; y++) {
            const block = new THREE.Mesh(blockGeometry, materials);
            block.position.set(x, y, z);
            scene.add(block);
        }
    }
}

// --- 5. LOOP DE RENDERIZAÇÃO (Atualiza o jogo) ---
function animate() {
    requestAnimationFrame(animate);

    if (controls.isLocked) {
        // Calcula a direção do movimento baseado para onde a câmera aponta
        direction.z = Number(keys.w) - Number(keys.s);
        direction.x = Number(keys.d) - Number(keys.a);
        direction.normalize();

        if (keys.w || keys.s) velocity.z = direction.z * speed;
        else velocity.z = 0;

        if (keys.a || keys.d) velocity.x = direction.x * speed;
        else velocity.x = 0;

        controls.moveRight(velocity.x);
        controls.moveForward(velocity.z);
    }

    renderer.render(scene, camera);
}

animate();

// Ajusta a tela caso o usuário mude o tamanho da janela do navegador
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});