import each from "lodash/each";
import gsap from "gsap";
import Prefix from "prefix";

import { map } from "lodash";

import Title from "animation/Title";
import Paragraph from "animation/Paragraph";
import Label from "animation/Label";
import Highlight from "animation/Highlight";
import { ColorManager } from "./Colors";
import AsyncLoad from "./AsyncLoad";

export default class Page {
  constructor({ id, element, elements }) {
    this.id = id;
    this.selector = element;
    this.selectorChildren = {
      ...elements,
      animationLabel: '[data-animation="label"]',
      animationParagraph: '[data-animation="paragraph"]',
      animationTitle: '[data-animation="title"]',
      animationHighlight: '[data-animation="highlight"]',

      preloaders: "[data-src]",
    };
    this.transformPrefix = Prefix("transform");
  }

  create() {
    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 0,
    };
    this.element = document.querySelector(this.selector);
    this.elements = {};

    each(this.selectorChildren, (entry, key) => {
      if (
        entry instanceof window.HTMLElement ||
        entry instanceof window.NodeList ||
        Array.isArray(entry)
      ) {
        this.elements[key] = entry;
      } else {
        this.elements[key] = document.querySelectorAll(entry);

        if (this.elements[key].length === 0) {
          this.elements[key] = null;
        } else if (this.elements[key].length === 1) {
          this.elements[key] = document.querySelector(entry);
        }
      }
    });

    this.createAnimation();
    this.createPreloader();
  }

  createAnimation() {
    this.animation = [];

    //title
    this.animationTitle = map(this.elements.animationTitle, (element) => {
      return new Title({
        element,
      });
    });
    this.animation.push = [...this.animationTitle];

    //paragraph
    this.animationParagraph = map(
      this.elements.animationParagraph,
      (element) => {
        return new Paragraph({
          element,
        });
      }
    );

    //label
    this.animationLabel = map(this.elements.animationLabel, (element) => {
      return new Label({
        element,
      });
    });

    //highlight
    this.animationHighlight = map(
      this.elements.animationHighlight,
      (element) => {
        return new Highlight({
          element,
        });
      }
    );
  }

  createPreloader() {
    this.preloaders = map(this.elements.preloaders, (element) => {
      return new AsyncLoad({ element });
    });
  }

  /**
   * animation
   */

  show() {
    return new Promise((resolve) => {
      ColorManager.change({
        backgroundColor: this.element.getAttribute("data-background"),
        color: this.element.getAttribute("data-color"),
      });
      this.animationIn = gsap.timeline();
      this.animationIn.fromTo(
        this.element,
        {
          autoAlpha: 0,
        },
        {
          autoAlpha: 1,
        }
      );
      this.animationIn.call(() => {
        this.addEventListener();
        resolve();
      });
    });
  }

  hide() {
    return new Promise((resolve) => {
      this.destroy();
      this.animationOut = gsap.timeline();
      this.animationOut.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve,
      });
    });
  }

  /**
   * events
   */

  onResize() {
    if (this.elements.wrapper) {
      this.scroll.limit =
        this.elements.wrapper.clientHeight - window.innerHeight;
    }
    each(this.animation, (animation) => animation.onResize());
  }

  onWheel({ pixelY }) {
    this.scroll.target += pixelY;
  }

  /**
   * loop
   */

  update() {
    this.scroll.target = gsap.utils.clamp(
      0,
      this.scroll.limit,
      this.scroll.target
    );

    this.scroll.current = gsap.utils.interpolate(
      this.scroll.current,
      this.scroll.target,
      0.1
    );

    if (this.scroll.current < 0.01) {
      this.scroll.current = 0;
    }

    if (this.elements.wrapper) {
      this.elements.wrapper.style[
        this.transformPrefix
      ] = `translateY(-${this.scroll.current}px)`;
    }
  }

  /**
   * listeners
   */
  addEventListener() {}

  removeEventListener() {}

  /**
   * destroy
   */

  destroy() {
    this.removeEventListener();
  }
}
