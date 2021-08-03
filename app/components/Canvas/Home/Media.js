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

    this.image = new window.Image();
    this.image.crossOrigin = "anonymous";
    this.image.src = this.element.getAttribute("data-src");

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
    this.mesh.rotation.z = gsap.utils.random(-Math.PI * 0.03, Math.PI * 0.03);
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

  updateScale() {
    this.height = this.bounds.height / window.innerHeight;
    this.width = this.bounds.width / window.innerWidth;

    this.mesh.scale.x = this.width * this.sizes.width;
    this.mesh.scale.y = this.height * this.sizes.height;
  }

  updateX(x = 0) {
    this.x = (this.bounds.left + x) / window.innerWidth;
    this.mesh.position.x =
      -this.sizes.width / 2 +
      this.mesh.scale.x / 2 +
      this.x * this.sizes.width +
      this.extra.x;
  }

  updateY(y = 0) {
    this.y = (this.bounds.top + y) / window.innerHeight;
    this.mesh.position.y =
      this.sizes.height / 2 -
      this.mesh.scale.y / 2 -
      this.y * this.sizes.height +
      this.extra.y;
  }

  update(scroll) {
    if (!this.bounds) return;
    this.updateX(scroll.x);
    this.updateY(scroll.y);
  }

  onResize(sizes, scroll) {
    this.extra = {
      x: 0,
      y: 0,
    };
    this.createBound(sizes);
    this.updateX(scroll && scroll.x);
    this.updateY(scroll && scroll.y);
  }
}
