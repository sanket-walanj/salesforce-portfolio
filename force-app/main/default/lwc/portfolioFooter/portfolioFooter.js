import { LightningElement } from "lwc";

export default class PortfolioFooter extends LightningElement {
  currentYear;

  connectedCallback() {
    this.currentYear = new Date().getFullYear();
  }
}
