import gsap from "gsap";

class Colors {
  change({ backgroundColor, color }) {
    gsap.to(document.documentElement, {
      backgroundColor,
      color,
      duration: 1.5,
    });

    console.log("background", backgroundColor);
    console.log("color", color);
  }
}

export const ColorManager = new Colors();
