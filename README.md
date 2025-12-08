# 🚀 Interactive Salesforce Portfolio

A high-performance personal portfolio built entirely on the **Salesforce Platform** using **Experience Cloud (LWR)**.

🔗 **Live Site:** [https://sanky-dev-ed.my.site.com/portfolio](https://sanky-dev-ed.my.site.com/portfolio)

## 🏗️ Technical Architecture

This project demonstrates **Enterprise-Grade** Salesforce development patterns:

- **Frontend:**
  - **Lightning Web Components (LWC):** Modular architecture using **Lightning Message Service (LMS)** for component communication.
  - **Responsive Design:** Mobile-first grid system using SLDS and custom CSS.
  - **Modern UI:** "Deep Space" Dark Mode implementation using CSS Variables and Hooks.
- **Backend (Apex):**
  - **Security First:** All queries enforce `WITH USER_MODE` or explicit FLS checks.
  - **Event-Driven:** Uses **Platform Events** (`Visitor_Notification__e`) to decouple visitor tracking from the UI thread.
  - **Async Processing:** Triggers handle logging asynchronously to ensure performance.
- **Automation:**
  - **Lead Generation:** Custom Apex handler to process "Contact Me" submissions.
  - **Email Automation:** Org-Wide Email Address integration for auto-responses.
- **DevOps:**
  - **CI/CD:** GitHub Actions pipeline for automated deployment.
  - **Static Analysis:** PMD and ESLint integration for code quality gates.

## 🛠️ Key Features implemented

1.  **3D Interactive Timeline:** CSS3 animations for experience cards.
2.  **Real-Time Visitor Tracking:** Captures analytics via Platform Events.
3.  **Tech Stack Filtering:** JavaScript array manipulation to filter projects instantly.
4.  **Honeypot Security:** Custom-built spam protection for the contact form.
