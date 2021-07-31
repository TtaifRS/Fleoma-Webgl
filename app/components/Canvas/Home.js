import { Plane, Transform } from "ogl";
import { map } from "lodash";

import gsap from "gsap";
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

    this.x = {
      current: 0,
      target: 0,
      lerp: 0.1,
    };

    this.y = {
      current: 0,
      target: 0,
      lerp: 0.1,
    };

    this.scrollCurrent = {
      x: 0,
      y: 0,
    };

    this.scroll = {
      x: 0,
      y: 0,
    };
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
   * event
   */

  onTouchDown({ x, y }) {
    this.scrollCurrent.x = this.scroll.x;
    this.scrollCurrent.y = this.scroll.y;
  }
  onTouchMove({ x, y }) {
    const xDistance = x.start - x.end;
    const yDistance = y.start - y.end;

    this.x.target = this.scrollCurrent.x - xDistance;
    this.y.target = this.scrollCurrent.y - yDistance;
    console.log(this.x.target, "targer");
    console.log(this.x.current, "current");
  }
  onTouchUp({ x, y }) {}

  onResize(event) {
    map(this.medias, (media) => media.onResize(event));
  }

  /**
   * update
   */

  update() {
    this.x.current = gsap.utils.interpolate(
      this.x.current,
      this.x.target,
      this.x.lerp
    );
    this.y.current = gsap.utils.interpolate(
      this.y.current,
      this.y.target,
      this.y.lerp
    );

    this.scroll.x = this.x.current;
    this.scroll.y = this.y.current;

    map(this.medias, (media) => {
      media.update(this.scroll);
    });
  }
}
