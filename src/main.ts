import { Vector3, Color} from "three"
import * as THREE from "three"
import { Grav } from "./grav"
import { OrbitControls } from "./controls/OrbitalControls"

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0,0,10);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let controls = new OrbitControls( camera , renderer.domElement );
controls.target.set( 0, 0, 0 );

var particleMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  vertexColors: THREE.VertexColors
});
var massMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  vertexColors: THREE.VertexColors
});

let grav: Grav = new Grav();
grav.addMass(-2,-2,0, 0.006, 1);
grav.addMass(2,2,0,0.007,1);
for(let i = 0; i < 10000; i ++) {
  let r = Math.random;
  let p = grav.addParticle(-1 * r() - 2, 1 * r() + 2, 1 * r() - 0.5);
  p.vel = new Vector3(-0.03,-0.02,0);
}


let massPoints = new THREE.Geometry();
let partPoints = new THREE.Geometry();

scene.add(new THREE.Points(massPoints, massMaterial));
scene.add(new THREE.Points(partPoints, particleMaterial));

function render() {
  grav.update();
  massPoints.vertices = [];
  massPoints.colors = [];
  let col : Color = new Color("lightblue");
  for (let m of grav.masses) {
    massPoints.vertices.push(m.pos);
    massPoints.colors.push(col);
  }
  massPoints.verticesNeedUpdate = true;

  partPoints.vertices = [];
  partPoints.colors = [];
  for (let p of grav.particles) {
    partPoints.vertices.push(p.pos);
    let vel = p.vel.distanceTo(new Vector3());
    let col : Color =
      new Color(15 * vel, 0.2, 0.5);
    partPoints.colors.push(col);
  }
  partPoints.verticesNeedUpdate = true;
  partPoints.colorsNeedUpdate = true;

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
