import Animation from "classes/Animation";
import gsap from "gsap/gsap-core";

export default class Title extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });
  }

  animateIn() {
    gsap.fromTo(
      this.element,
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,
        delay: 0.5,
        duration: 1.5,
      }
    );
  }

  animateOut() {
    gsap.set(this.element, {
      autoAlpha: 0,
    });
  }
}
