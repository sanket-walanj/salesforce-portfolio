import { LightningElement, wire } from "lwc";
import getTrailheadStats from "@salesforce/apex/PortfolioController.getTrailheadStats";

export default class PortfolioStats extends LightningElement {
  trailheadStats;
  @wire(getTrailheadStats) wiredStats({ data }) {
    if (data) this.trailheadStats = data;
  }

  renderedCallback() {
    const elements = this.template.querySelectorAll(
      ".animate-me:not(.observed)"
    );
    if (elements.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      elements.forEach((el) => {
        observer.observe(el);
        el.classList.add("observed");
      });
    }
  }
}
