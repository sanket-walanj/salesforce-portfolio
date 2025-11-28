import { LightningElement, wire } from "lwc";
import getSkills from "@salesforce/apex/PortfolioController.getSkills";
import { publish, MessageContext } from "lightning/messageService";
import PORTFOLIO_FILTER from "@salesforce/messageChannel/PortfolioFilter__c";

export default class PortfolioSkills extends LightningElement {
  skills;
  @wire(MessageContext) messageContext;
  @wire(getSkills) wiredSkills({ data }) {
    if (data) this.skills = data;
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

  handleSkillClick(event) {
    const techName = event.currentTarget.dataset.tech;
    const payload = { filterType: techName };
    publish(this.messageContext, PORTFOLIO_FILTER, payload);
  }
}
