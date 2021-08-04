import { Mesh, Program, Texture } from "ogl";

import gsap from "gsap";

import vertex from "../../../shaders/plainVertex.glsl";
import fragment from "../../../shaders/plainFragment.glsl";

export default class Media {
  constructor({ element, geometry, gl, scene, index, sizes }) {
    this.element = element;
    this.geometry = geometry;
    this.gl = gl;
    this.scene = scene;
    this.index = index;
    this.sizes = sizes;

    this.extra = {
      x: 0,
      y: 0,
    };

    this.createTexture();
    this.createProgram();
    this.createMesh();
  }

  createTexture() {
    this.texture = new Texture(this.gl);

    const image = this.element.querySelector("img");

    this.image = new window.Image();
    this.image.crossOrigin = "anonymous";
    this.image.src = image.getAttribute("data-src");

    this.image.onload = () => (this.texture.image = this.image);
  }

  createProgram() {
    this.program = new Program(this.gl, {
      vertex,
      fragment,
      uniforms: {
        uAlpha: { value: 0 },
        tMap: { value: this.texture },
      },
    });
  }

  createMesh() {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });

    this.mesh.setParent(this.scene);
  }

  /**
   * Animation
   */

  show() {
    gsap.fromTo(
      this.program.uniforms.uAlpha,
      {
        value: 0,
      },
      {
        value: 1,
      }
    );
  }

  hide() {
    gsap.to(this.program.uniforms.uAlpha, {
      value: 0,
    });
  }

  createBound({ sizes }) {
    this.sizes = sizes;
    this.bounds = this.element.getBoundingClientRect();

    this.updateScale();
    this.updateX();
    this.updateY();
  }

  updateRotation() {
    this.mesh.rotation.z = gsap.utils.mapRange(
      -this.sizes.width / 2,
      this.sizes.width / 2,
      Math.PI * 0.1,
      -Math.PI * 0.1,
      this.mesh.position.x
    );
  }

  updateScale() {
    this.height = this.bounds.height / window.innerHeight;
    this.width = this.bounds.width / window.innerWidth;

    this.mesh.scale.x = this.width * this.sizes.width;
    this.mesh.scale.y = this.height * this.sizes.height;

    const scale = gsap.utils.mapRange(
      0,
      this.sizes.width / 2,
      0.1,
      0,
      Math.abs(this.mesh.position.x)
    );

    this.mesh.scale.x += scale;
    this.mesh.scale.y += scale;
  }

  updateX(x = 0) {
    this.x = (this.bounds.left + x) / window.innerWidth;
    this.mesh.position.x =
      -this.sizes.width / 2 +
      this.mesh.scale.x / 2 +
      this.x * this.sizes.width +
      this.extra;
  }

  updateY(y = 0) {
    this.y = (this.bounds.top + y) / window.innerHeight;
    this.mesh.position.y =
      this.sizes.height / 2 -
      this.mesh.scale.y / 2 -
      this.y * this.sizes.height;

    this.mesh.position.y +=
      Math.cos((this.mesh.position.x / this.sizes.width) * Math.PI * 0.1) * 40 -
      40;
  }

  update(scroll) {
    if (!this.bounds) return;
    this.updateRotation();
    this.updateScale();
    this.updateX(scroll);
    this.updateY(0);
  }

  onResize(sizes, scroll) {
    this.extra = 0;
    this.createBound(sizes);
    this.updateX(scroll);
    this.updateY(0);
  }
}
