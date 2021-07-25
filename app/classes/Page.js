import each from "lodash/each";
import gsap from "gsap";
import Prefix from "prefix";
import normalizeWheel from "normalize-wheel";
import { map } from "lodash";

import Title from "animation/Title";
import Paragraph from "animation/Paragraph";
import Label from "animation/Label";
import Highlight from "animation/Highlight";

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
    };
    this.transformPrefix = Prefix("transform");
    this.onMouseWheelEvent = this.onMouseWheel.bind(this);
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

  show() {
    return new Promise((resolve) => {
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
      this.removeEventListener();
      this.animationOut = gsap.timeline();
      this.animationOut.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve,
      });
    });
  }

  onMouseWheel(event) {
    const { pixelY } = normalizeWheel(event);
    this.scroll.target += pixelY;
  }

  onResize() {
    if (this.elements.wrapper) {
      this.scroll.limit =
        this.elements.wrapper.clientHeight - window.innerHeight;
    }
    each(this.animation, (animation) => animation.onResize());
  }

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

  addEventListener() {
    window.addEventListener("mousewheel", this.onMouseWheelEvent);
  }

  removeEventListener() {
    window.removeEventListener("mousewheel", this.onMouseWheelEvent);
  }
}
