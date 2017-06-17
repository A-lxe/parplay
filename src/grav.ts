import { Vector3 } from "three"

interface Mass {
  pos: Vector3;
  mass: number;
  size: number;
}

interface Particle {
  pos: Vector3;
  size: number;
  vel: Vector3;
}

export class Grav {
  masses: Mass[] = [];
  particles: Particle[] = [];
  grav: Vector3 = new Vector3(1,1,1);

  update(): void {
    for (let p of this.particles) {
      let accel = this.getAccel(p);
      p.vel.add(accel);
      p.pos.add(p.vel);
    }
  }

  addParticle(x: number, y: number, z: number): Particle {
    let p: Particle = {
      pos: new Vector3(x, y, z),
      size: 1,
      vel: new Vector3()
    }
    this.particles.push(p);
    return p;
  }

  addMass(x: number, y: number, z: number, mass: number, size: number) {
    let m: Mass = {
      pos: new Vector3(x, y, z),
      size: size,
      mass: mass
    }
    this.masses.push(m);
  }

  getAccel(particle: Particle): Vector3 {
    return calcAccel(particle, this.masses).multiply(this.grav);
  }
}

function calcAccel(p: Particle, masses: Mass[]): Vector3 {
  let totAccel: Vector3 = new Vector3();

  for (let m of masses) {
    let rSqr = p.pos.distanceToSquared(m.pos);
    let mass = m.mass;
    if(rSqr < m.size ** 2) {
      mass = (Math.sqrt(rSqr) / m.size) ** 3 * m.mass;
    }
    let mOverRSqr = mass / rSqr;

    let grav = new Vector3().copy(m.pos).sub(p.pos).normalize();
    grav.multiplyScalar(mOverRSqr);
    totAccel.add(grav);
  }

  return totAccel;
}
