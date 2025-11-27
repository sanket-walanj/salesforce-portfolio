import { LightningElement, wire, api, track } from "lwc";
import getSkills from "@salesforce/apex/PortfolioController.getSkills";
import getProjects from "@salesforce/apex/PortfolioController.getProjects";
import getTrailheadStats from "@salesforce/apex/PortfolioController.getTrailheadStats";
import createLead from "@salesforce/apex/PortfolioController.createLead";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import logVisit from "@salesforce/apex/PortfolioController.logVisit";

export default class PortfolioMain extends LightningElement {
  @api userName = "Your Name";
  @api titles = "Salesforce Developer,LWC Specialist,Apex Expert";
  @api bio = "I build scalable solutions on the Salesforce Platform.";
  @api profileImageUrl;
  @api resumeUrl;
  @api githubUsername = "yourusername";

  currentText = "";
  isDeleting = false;
  loopNum = 0;
  location;

  skills;
  projects = [];
  filteredProjects = [];
  trailheadStats;
  superbadges = [];
  activeFilter = "All";

  // --- TIMELINE DATA ---
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

  formData = {
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    message: ""
  };

  connectedCallback() {
    this.handleTypewriter();
    this.fetchLocation();
    this.trackVisitor();
  }

  handleTypewriter() {
    const roles = this.titles ? this.titles.split(",") : [];
    const i = this.loopNum % roles.length;
    const fullText = roles[i];

    if (this.isDeleting) {
      this.currentText = fullText.substring(0, this.currentText.length - 1);
    } else {
      this.currentText = fullText.substring(0, this.currentText.length + 1);
    }

    let delta = 200 - Math.random() * 100;
    if (this.isDeleting) {
      delta /= 2;
    }

    if (!this.isDeleting && this.currentText === fullText) {
      delta = 2000;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentText === "") {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
    }

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
      .catch((e) => console.log("Loc error", e));
  }

  @wire(getSkills)
  wiredSkills({ error, data }) {
    if (data) this.skills = data;
  }

  @wire(getProjects)
  wiredProjects({ error, data }) {
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

  @wire(getTrailheadStats)
  wiredStats({ error, data }) {
    if (data) {
      this.trailheadStats = data;
      if (data.Superbadges__c) {
        try {
          this.superbadges = JSON.parse(data.Superbadges__c);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  handleFilter(event) {
    this.activeFilter = event.target.dataset.filter;
    const buttons = this.template.querySelectorAll(".filter-btn");
    buttons.forEach((btn) => {
      if (btn.dataset.filter === this.activeFilter) btn.classList.add("active");
      else btn.classList.remove("active");
    });

    if (this.activeFilter === "All") {
      this.filteredProjects = this.projects;
    } else {
      this.filteredProjects = this.projects.filter((proj) =>
        proj.techStack.includes(this.activeFilter)
      );
    }
  }

  handleRepoClick(event) {
    event.preventDefault();
    window.open(event.target.dataset.url, "_blank");
  }

  handleFormChange(event) {
    this.formData[event.target.name] = event.target.value;
  }

  handleContactSubmit() {
    const { firstName, lastName, email, company, message } = this.formData;
    if (!lastName || !email) {
      this.showToast("Error", "Name and Email required", "error");
      return;
    }

    createLead({ firstName, lastName, email, company, message })
      .then(() => {
        this.showToast("Success", "Message Sent!", "success");
        this.template
          .querySelectorAll("lightning-input, lightning-textarea")
          .forEach((el) => (el.value = null));
        this.formData = {};
      })
      .catch((error) => {
        this.showToast("Error", "Failed to send.", "error");
      });
  }

  showToast(title, message, variant) {
    this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
  }

  trackVisitor() {
    console.log("🔍 TRACKER: Function started..."); // 1. Verify function runs

    // Check 1: Are we in the Builder?
    if (
      window.location.hostname.includes("sitepreview") ||
      window.location.hostname.includes("livepreview")
    ) {
      console.log(
        "⚠️ TRACKER: Skipped because we are in Builder/Preview mode."
      );
      return;
    }

    // Check 2: Have we visited before?
    // (I commented out the return so it runs ANYWAY for testing)
    if (sessionStorage.getItem("visited")) {
      console.log(
        "ℹ️ TRACKER: Session already exists, but forcing log for debug..."
      );
      // return; <--- Commented out to FORCE the log
    }

    console.log("🚀 TRACKER: Calling Apex now...");

    logVisit({ browser: navigator.userAgent, device: "Desktop" })
      .then(() => {
        console.log("✅ TRACKER: Success! Event published to Salesforce.");
        sessionStorage.setItem("visited", "true");
      })
      .catch((error) => {
        console.error(
          "❌ TRACKER: Apex Callout Failed:",
          JSON.stringify(error)
        );
      });
  }
}
