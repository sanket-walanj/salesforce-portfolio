import { LightningElement } from "lwc";

export default class PortfolioTimeline extends LightningElement {
  workHistory = [
    {
      id: 1,
      role: "Senior Software Engineer",
      company: "LTIMindtree",
      duration: "Jul 2025 - Present",
      description:
        "Leading technical deliverables for enterprise Salesforce projects. Designing scalable LWC architectures and managing CI/CD pipelines using Copado/SFDX.",
      tech: ["LWC", "Apex", "Integration", "System Design"]
    },
    {
      id: 2,
      role: "Software Engineer",
      company: "Wattabyte IT Consultancy LLP",
      duration: "May 2022 - Jun 2025",
      description:
        "Developed end-to-end business logic using Apex Triggers and Flows. Migrated legacy Visualforce pages to Lightning Web Components to improve performance.",
      tech: ["Apex", "Flows", "JavaScript", "SOQL"]
    },
    {
      id: 3,
      role: "Frontend Developer",
      company: "Project Controls Expo UK",
      duration: "Dec 2017 - May 2022",
      description:
        "Built responsive, user-friendly web interfaces. Optimized website performance and collaborated with UI/UX teams to implement pixel-perfect designs.",
      tech: ["HTML5", "CSS3", "JavaScript", "Bootstrap"]
    }
  ];

  renderedCallback() {
    const elements = this.template.querySelectorAll(
      ".animate-me:not(.observed)"
    );
    if (elements.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("animate-visible");
              observer.unobserve(e.target);
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
