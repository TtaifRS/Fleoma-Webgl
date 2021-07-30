import { Mesh, Program, Texture } from "ogl";

import vertex from "../../shaders/plainVertex.glsl";
import fragment from "../../shaders/plainFragment.glsl";

export default class Media {
  constructor({ element, geometry, gl, scene, index }) {
    this.element = element;
    this.geometry = geometry;
    this.gl = gl;
    this.scene = scene;
    this.index = index;

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

    this.mesh.position.x += this.index * this.mesh.scale.x;
  }
}
