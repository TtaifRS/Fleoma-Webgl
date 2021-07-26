import Component from "classes/Component";
import gsap from "gsap/gsap-core";
import { COLOR_WHITE, COLOR_BRIGHT_GRAY } from "utils/colors";

export default class Navigation extends Component {
  constructor({ template }) {
    super({
      element: ".navigation",
      elements: {
        item: ".navigation__list__item",
        link: ".navigation__list__link",
      },
    });

    this.onChange(template);
  }

  onChange(template) {
    if (template === "about") {
      gsap.to(this.element, {
        color: COLOR_BRIGHT_GRAY,
        duration: 1.5,
      });

      gsap.to(this.elements.item[0], {
        autoAlpha: 1,
        delay: 0.75,
        duration: 0.75,
      });
      gsap.to(this.elements.item[1], {
        autoAlpha: 0,
        duration: 0.75,
      });
    } else {
      gsap.to(this.element, {
        color: COLOR_WHITE,
        duration: 1.5,
      });
      gsap.to(this.elements.item[1], {
        autoAlpha: 1,
        delay: 0.75,
        duration: 0.75,
      });
      gsap.to(this.elements.item[0], {
        autoAlpha: 0,
        duration: 0.75,
      });
    }
  }
}
