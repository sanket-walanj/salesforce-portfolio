import { LightningElement, wire } from "lwc";
import getProjects from "@salesforce/apex/PortfolioController.getProjects";
import {
  subscribe,
  MessageContext,
  APPLICATION_SCOPE
} from "lightning/messageService";
import PORTFOLIO_FILTER from "@salesforce/messageChannel/PortfolioFilter__c";

export default class PortfolioProjects extends LightningElement {
  projects = [];
  filteredProjects = [];
  activeFilter = "All";
  subscription = null;

  @wire(MessageContext) messageContext;

  @wire(getProjects)
  wiredProjects({ data }) {
    if (data) {
      this.projects = data.map((proj) => ({
        ...proj,
        techStack: proj.Tech_Stack__c
          ? proj.Tech_Stack__c.split(",").map((t) => t.trim())
          : []
      }));
      this.filteredProjects = this.projects;
    }
  }

  connectedCallback() {
    this.subscribeToMessageChannel();
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

  subscribeToMessageChannel() {
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        PORTFOLIO_FILTER,
        (message) => this.handleFilterMessage(message),
        { scope: APPLICATION_SCOPE }
      );
    }
  }

  handleFilterMessage(message) {
    this.activeFilter = message.filterType;
    this.filterProjects();
    this.updateButtonState();
  }

  handleManualFilter(event) {
    this.activeFilter = event.target.dataset.filter;
    this.filterProjects();
    this.updateButtonState();
  }

  updateButtonState() {
    const buttons = this.template.querySelectorAll(".filter-btn");
    buttons.forEach((btn) => {
      if (
        btn.dataset.filter === this.activeFilter ||
        (this.activeFilter !== "All" &&
          btn.dataset.filter === this.activeFilter)
      ) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  filterProjects() {
    if (this.activeFilter === "All") {
      this.filteredProjects = this.projects;
    } else {
      this.filteredProjects = this.projects.filter((proj) =>
        proj.techStack.some((t) =>
          t.toLowerCase().includes(this.activeFilter.toLowerCase())
        )
      );
    }
  }

  handleRepoClick(event) {
    event.preventDefault();
    window.open(event.target.dataset.url, "_blank");
  }
}
