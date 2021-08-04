import { Plane, Transform } from "ogl";
import { map } from "lodash";

import gsap from "gsap";
import Gallery from "./Gallery";

export default class Home {
  constructor({ gl, scene, sizes }) {
    this.gl = gl;
    this.sizes = sizes;
    this.group = new Transform();

    this.createGeometry();
    this.createGalleries();

    this.group.setParent(scene);
    this.show();
  }

  createGeometry() {
    this.geometry = new Plane(this.gl);
  }

  createGalleries() {
    this.galleriesElement = document.querySelectorAll(".about__gallery");

    this.galleries = map(this.galleriesElement, (element, index) => {
      return new Gallery({
        element,
        index,
        geometry: this.geometry,
        scene: this.group,
        gl: this.gl,
        sizes: this.sizes,
      });
    });
  }

  /**
   * animation
   */

  show() {
    map(this.galleries, (gallery) => gallery.show());
  }

  hide() {
    map(this.galleries, (gallery) => gallery.hide());
  }

  /**
   * event
   */

  onTouchDown(event) {
    map(this.galleries, (gallery) => gallery.onTouchDown(event));
  }
  onTouchMove(event) {
    map(this.galleries, (gallery) => gallery.onTouchMove(event));
  }
  onTouchUp(event) {
    map(this.galleries, (gallery) => gallery.onTouchUp(event));
  }

  onWheel({ pixelX, pixelY }) {}

  onResize(event) {
    map(this.galleries, (gallery) => gallery.onResize(event));
  }

  /**
   * update
   */

  update(scroll) {
    map(this.galleries, (gallery) => gallery.update(scroll));
  }
  destroy() {
    map(this.galleries, (gallery) => gallery.destroy());
  }
}
