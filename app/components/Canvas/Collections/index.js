import { Plane, Transform } from "ogl";
import { map } from "lodash";

import gsap from "gsap";
import Media from "./Media";

export default class Collections {
  constructor({ gl, scene, sizes }) {
    this.galleryElement = document.querySelector(
      ".collection__gallery__wrapper"
    );

    this.mediasElement = document.querySelectorAll(
      ".collection__gallery__media"
    );
    this.gl = gl;
    this.scene = scene;
    this.sizes = sizes;
    this.group = new Transform();

    this.scroll = {
      current: 0,
      target: 0,
      start: 0,
      lerp: 0.1,
      velocity: 1,
    };

    this.createGeometry();
    this.createGallery();

    this.group.setParent(this.scene);
    this.show();
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

  /**
   * animation
   */

  show() {
    map(this.medias, (media) => media.show());
  }

  hide() {
    map(this.medias, (media) => media.hide());
  }

  /**
   * event
   */

  onTouchDown({ x, y }) {
    this.scroll.start = this.scroll.current;
  }
  onTouchMove({ x, y }) {
    const distance = x.start - x.end;

    this.scroll.target = this.scroll.start - distance;
  }
  onTouchUp({ x, y }) {}

  onWheel({ pixelY }) {
    this.scroll.target += pixelY;
  }

  onResize(event) {
    this.sizes = event.sizes;
    this.bounds = this.galleryElement.getBoundingClientRect();

    this.scroll.limit = this.bounds.width - this.medias[0].element.clientWidth;

    this.scroll.start = this.scroll.target = 0;

    map(this.medias, (media) => media.onResize(event, this.scroll));
  }

  /**
   * update
   */

  update() {
    if (!this.bounds) {
      return;
    }

    this.scroll.target = gsap.utils.clamp(
      -this.scroll.limit,
      0,
      this.scroll.target
    );

    this.scroll.current = gsap.utils.interpolate(
      this.scroll.current,
      this.scroll.target,
      this.scroll.lerp
    );

    if (this.scroll.start < this.scroll.current) {
      this.scroll.direction = "right";
    } else if (this.scroll.start > this.scroll.current) {
      this.scroll.direction = "left";
    }

    this.scroll.start = this.scroll.current;

    map(this.medias, (media, index) => {
      media.update(this.scroll.current);
    });
  }

  destroy() {
    this.scene.removeChild(this.group);
  }
}
