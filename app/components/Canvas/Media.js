import { Mesh, Program, Texture } from "ogl";

import vertex from "../../shaders/plainVertex.glsl";
import fragment from "../../shaders/plainFragment.glsl";

export default class Media {
  constructor({ element, geometry, gl, scene, index, sizes }) {
    this.element = element;
    this.geometry = geometry;
    this.gl = gl;
    this.scene = scene;
    this.index = index;
    this.sizes = sizes;

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

    this.x = this.bounds.left / window.innerWidth;
    this.y = this.bounds.top / window.innerHeight;
  }

  updateX(x = 0) {
    this.mesh.position.x =
      -this.sizes.width / 2 + this.mesh.scale.x / 2 + this.x * this.sizes.width;
  }

  updateY(y = 0) {
    this.mesh.position.y =
      this.sizes.height / 2 -
      this.mesh.scale.y / 2 -
      this.y * this.sizes.height;
  }

  onResize(sizes) {
    this.createBound(sizes);
  }
}
