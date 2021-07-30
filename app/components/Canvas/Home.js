import { Plane, Transform } from "ogl";
import { map } from "lodash";

import Media from "./Media";

export default class Home {
  constructor({ gl, scene }) {
    this.medias = document.querySelectorAll(".home__gallery__media__img");
    this.gl = gl;
    this.group = new Transform();

    this.createGeometry();
    this.createGallery();

    this.group.setParent(scene);
  }

  createGeometry() {
    this.geometry = new Plane(this.gl);
  }

  createGallery() {
    map(this.medias, (element, index) => {
      return new Media({
        element,
        index,
        geometry: this.geometry,
        scene: this.group,
        gl: this.gl,
      });
    });
  }
}
