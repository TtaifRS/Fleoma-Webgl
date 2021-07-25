import Animation from "classes/Animation";
import gsap from "gsap/gsap-core";
import { each } from "lodash";
import { split, calculate } from "../utils/text";

export default class Paragraph extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });

    this.elementSpansLines = split({
      element: this.element,
      append: true,
    });
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
          autoAlpha: 0,
          y: "100%",
        },
        {
          autoAlpha: 1,
          delay: index * 0.015,
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
