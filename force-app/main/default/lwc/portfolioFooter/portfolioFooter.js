import { LightningElement } from "lwc";

export default class PortfolioFooter extends LightningElement {
  currentYear;
  static renderMode = "light";

  connectedCallback() {
    this.currentYear = new Date().getFullYear();
  }
}
