import { Plane, Transform } from "ogl";
import { map } from "lodash";

import Media from "./Media";

export default class Home {
  constructor({ gl, scene, sizes }) {
    this.mediasElement = document.querySelectorAll(
      ".home__gallery__media__img"
    );
    this.gl = gl;
    this.sizes = sizes;
    this.group = new Transform();

    this.createGeometry();
    this.createGallery();

    this.group.setParent(scene);
  }

  createGeometry() {
    this.geometry = new Plane(this.gl);
  }

  createGallery() {
    this.medias = map(this.mediasElement, (element, index) => {
      return new Media({
        element,
        index,
        geometry: this.geometry,
        scene: this.group,
        gl: this.gl,
        sizes: this.sizes,
      });
    });
  }

  onResize(event) {
    map(this.medias, (media) => media.onResize(event));
  }
}
