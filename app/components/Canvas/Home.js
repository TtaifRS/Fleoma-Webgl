import { Plane, Transform } from "ogl";
import { map } from "lodash";

import gsap from "gsap";
import Media from "./Media";

export default class Home {
  constructor({ gl, scene, sizes }) {
    this.galleryElement = document.querySelector(".home__gallery");

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
  }
  onTouchUp({ x, y }) {}

  onResize(event) {
    console.log("resize");
    map(this.medias, (media) => media.onResize(event));

    this.sizes = event.sizes;
    this.galleryBounds = this.galleryElement.getBoundingClientRect();

    this.gallerySizes = {
      height:
        (this.galleryBounds.height / window.innerHeight) * this.sizes.height,
      width: (this.galleryBounds.width / window.innerWidth) * this.sizes.width,
    };
  }

  /**
   * update
   */

  update() {
    if (!this.galleryBounds) return;
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

    if (this.scroll.x < this.x.current) {
      this.x.direction = "right";
    } else if (this.scroll.x > this.x.current) {
      this.x.direction = "left";
    }

    if (this.scroll.y < this.y.current) {
      this.y.direction = "top";
    } else if (this.scroll.y > this.y.current) {
      this.y.direction = "bottom";
    }

    this.scroll.x = this.x.current;
    this.scroll.y = this.y.current;

    map(this.medias, (media, index) => {
      const scaleX = media.mesh.scale.x / 2;
      const scaleY = media.mesh.scale.y / 2;

      if (this.x.direction === "left") {
        const x = media.mesh.position.x + scaleX;
        if (x < -this.sizes.width / 2) {
          media.extra.x += this.gallerySizes.width;
        }
      } else if (this.x.direction === "right") {
        const x = media.mesh.position.x - scaleX;
        if (x > this.sizes.width / 2) {
          media.extra.x -= this.gallerySizes.width;
        }
      }

      if (this.y.direction === "top") {
        const y = media.mesh.position.y + scaleY;
        if (y < -this.sizes.height / 2) {
          media.extra.y += this.gallerySizes.height;
        }
      } else if (this.y.direction === "bottom") {
        const y = media.mesh.position.y - scaleY;
        if (y > this.sizes.height / 2) {
          media.extra.y -= this.gallerySizes.height;
        }
      }
      media.update(this.scroll);
    });
  }
}
