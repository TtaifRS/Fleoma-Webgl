import Animation from "classes/Animation";
import gsap from "gsap/gsap-core";
import { each } from "lodash";
import { split, calculate } from "../utils/text";

export default class Label extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });
    split({
      element: this.element,
      append: true,
    });

    split({
      element: this.element,
      append: true,
    });

    this.elementSpansLines = this.element.querySelectorAll("span span");
  }

  animateIn() {
    this.timeline = gsap.timeline({
      delay: 0.5,
    });
    this.timeline.set(this.element, {
      autoAlpha: 1,
    });

    each(this.elementSpansLines, (line, index) => {
      this.timeline.fromTo(
        line,
        {
          y: "100%",
        },
        {
          delay: index * 0.09,
          duration: 1.5,
          ease: "expo.out",
          y: "0%",
        },
        0
      );
    });
  }

  animateOut() {
    gsap.set(this.element, {
      autoAlpha: 0,
    });
  }

  onResize() {
    this.elementsLines = calculate(this.elementSpansLines);
  }
}
