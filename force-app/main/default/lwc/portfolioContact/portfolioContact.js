import { LightningElement, track } from "lwc";
import createLead from "@salesforce/apex/PortfolioController.createLead";
import logVisit from "@salesforce/apex/PortfolioController.logVisit";

export default class PortfolioContact extends LightningElement {
  @track isSending = false;
  @track isSuccess = false;
  btnLabel = "Send Message";
  btnClass = "btn-primary";
  formData = {
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    message: ""
  };

  connectedCallback() {
    this.fetchAndTrack();
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

  fetchAndTrack() {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        this.trackVisitor(data.ip);
      })
      .catch(() => {
        this.trackVisitor("Unknown");
      });
  }

  trackVisitor(ipAddress) {
    if (
      window.location.hostname.includes("sitepreview") ||
      sessionStorage.getItem("visited")
    )
      return;
    const browser = navigator.userAgent;
    const device = /Mobile|Android|iPhone/i.test(navigator.userAgent)
      ? "Mobile"
      : "Desktop";
    logVisit({ browser: browser, device: device, ipAddress: ipAddress })
      .then(() => sessionStorage.setItem("visited", "true"))
      .catch(() => {});
  }

  handleFormChange(event) {
    this.formData[event.target.name] = event.target.value;
  }

  handleContactSubmit() {
    // 1. Check Validity of all inputs
    const allValid = [...this.template.querySelectorAll(".input-field")].reduce(
      (validSoFar, inputCmp) => {
        inputCmp.reportValidity();
        return validSoFar && inputCmp.checkValidity();
      },
      true
    );

    if (!allValid) {
      // If invalid, stop here. The input fields will show red borders automatically.
      return;
    }

    // 2. Proceed with Logic
    this.isSending = true;
    this.btnLabel = "Sending...";

    const { firstName, lastName, email, company, message } = this.formData;

    createLead({ firstName, lastName, email, company, message })
      .then(() => {
        this.isSending = false;
        this.isSuccess = true;
        this.btnLabel = "Sent Successfully!";
        this.btnClass = "btn-success";

        this.template
          .querySelectorAll("lightning-input, lightning-textarea")
          .forEach((el) => (el.value = null));
        this.formData = {};

        setTimeout(() => {
          this.isSuccess = false;
          this.btnLabel = "Send Message";
          this.btnClass = "btn-primary";
        }, 4000);
      })
      .catch(() => {
        this.isSending = false;
        this.btnLabel = "Error. Try Again.";
        this.btnClass = "btn-error";
      });
  }
}
