import { LightningElement, api } from "lwc";

export default class PortfolioHero extends LightningElement {
  @api userName = "Your Name";
  @api titles = "Salesforce Developer,LWC Specialist,Apex Expert";
  @api bio = "I build scalable solutions.";
  @api profileImageUrl;
  @api resumeUrl;

  currentText = "";
  isDeleting = false;
  loopNum = 0;
  location;

  connectedCallback() {
    this.handleTypewriter();
    this.fetchLocation();
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

  handleTypewriter() {
    const roles = this.titles ? this.titles.split(",") : [];
    const i = this.loopNum % roles.length;
    const fullText = roles[i];
    if (this.isDeleting)
      this.currentText = fullText.substring(0, this.currentText.length - 1);
    else this.currentText = fullText.substring(0, this.currentText.length + 1);

    let delta = 200 - Math.random() * 100;
    if (this.isDeleting) delta /= 2;
    if (!this.isDeleting && this.currentText === fullText) {
      delta = 2000;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentText === "") {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
    }
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this.handleTypewriter();
    }, delta);
  }

  fetchLocation() {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data.city) this.location = `${data.city}, ${data.country_name}`;
      })
      .catch(() => {});
  }
}
