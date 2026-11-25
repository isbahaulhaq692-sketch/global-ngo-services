// Client se verify karke update karna: document lists, eligibility, and timelines are indicative.
window.SERVICES = [
  {
    id: "csr-1-registration",
    name: "CSR-1 Registration",
    category: "Registration",
    shortDescription: "Prepare your CSR-1 filing.",
    documents: ["NGO registration certificate", "PAN and authorized signatory details", "Governing body and activity information"],
    time: "Preparation is often 3–7 business days; authority processing can vary.",
    icon: "checklist"
  },
  {
    id: "section-8-company-registration",
    name: "Section 8 Company Registration",
    category: "Registration",
    shortDescription: "Not-for-profit incorporation support.",
    documents: ["Proposed name, objects, and member details", "Director identity and address proofs", "Registered office address proof and consent"],
    time: "Usually several weeks, subject to complete documents and MCA review.",
    icon: "building"
  },
  {
    id: "fcra-registration",
    name: "FCRA Registration",
    category: "Registration",
    shortDescription: "Prepare FCRA eligibility and records.",
    documents: ["NGO registration and activity records", "Governing body and financial records", "Bank and foreign contribution details, if applicable"],
    time: "Preparation may take several weeks; government processing varies.",
    icon: "shield"
  },
  {
    id: "startup-india-registration",
    name: "Startup India Registration",
    category: "Registration",
    shortDescription: "Prepare a Startup India application.",
    documents: ["Entity incorporation or registration details", "PAN and authorized representative details", "Business or innovation summary"],
    time: "Preparation is often 3–7 business days; review timing varies.",
    icon: "rocket"
  },
  {
    id: "trademark-registration",
    name: "Trademark Registration",
    category: "Registration",
    shortDescription: "Protect your organization's name or logo.",
    documents: ["Mark name or clear logo file", "Applicant identity and address details", "Business activity and evidence of use, if applicable"],
    time: "Application preparation is often 2–5 business days; examination varies.",
    icon: "trademark"
  },
  {
    id: "fssai-registration",
    name: "FSSAI Registration",
    category: "Registration",
    shortDescription: "Guidance for food business registration.",
    documents: ["Applicant and business identity details", "Premises address proof", "Food activity and product information"],
    time: "Application preparation takes a few business days; authority review varies.",
    icon: "food"
  },
  {
    id: "iso-certification",
    name: "ISO Certification",
    category: "Registration",
    shortDescription: "Prepare for relevant ISO certification.",
    documents: ["Organization profile and service scope", "Existing policies and process records", "Site and contact details"],
    time: "Preparation can take 1–3 weeks; audit and certification schedules vary.",
    icon: "certificate"
  },
  {
    id: "lei-certificate",
    name: "LEI Certificate",
    category: "Registration",
    shortDescription: "Prepare entity details for an LEI application.",
    documents: ["Legal name and registration details", "Registered address and PAN", "Authorized contact and supporting documents"],
    time: "Often 3–7 business days after verification; issuer processing varies.",
    icon: "document"
  },
  {
    id: "niti-aayog-certificate",
    name: "NITI Aayog Certificate",
    category: "Registration",
    shortDescription: "Prepare NITI Aayog portal details.",
    documents: ["NGO registration certificate and PAN", "Governing body and organization details", "Authorized contact and portal information"],
    time: "Preparation is often 3–7 business days; portal review varies.",
    icon: "government"
  },
  {
    id: "digital-signature",
    name: "Digital Signature",
    category: "Registration",
    shortDescription: "Apply for a verified digital signature.",
    documents: ["Applicant PAN and identity proof", "Address and contact details", "Email and mobile access for verification"],
    time: "Often 1–3 business days after successful verification.",
    icon: "digitalSignature"
  },
  {
    id: "gst-registration",
    name: "GST Registration",
    category: "Registration",
    shortDescription: "Guidance on GST registration requirements and application.",
    documents: ["Organization PAN and legal details", "Address proof and contact details", "Business activity and turnover records, where applicable"],
    time: "Eligibility and processing depend on the organization and current requirements; confirm with our team.",
    icon: "taxChart"
  },
  {
    id: "12a-80g-registration",
    name: "12A & 80G Registration",
    category: "Registration",
    shortDescription: "Guidance for applicable 12A and 80G approvals.",
    documents: ["NGO registration certificate and PAN", "Governing document and office details", "Governing body, activity, and financial records"],
    time: "Preparation depends on document readiness; authority processing can vary.",
    icon: "certificate"
  },
  {
    id: "e-anudaan",
    name: "E-Anudaan",
    category: "Compliance & Reports",
    shortDescription: "Support for scheme portal applications.",
    documents: ["Organization registration and PAN", "Bank and authorized contact details", "Scheme-specific project and financial documents"],
    time: "Preparation is often 3–7 business days; portal review varies.",
    icon: "grant"
  },
  {
    id: "audit-report",
    name: "Audit Report",
    category: "Compliance & Reports",
    shortDescription: "Organize financial records for audit.",
    documents: ["Books of accounts and bank statements", "Invoices, receipts, and vouchers", "Prior audit and statutory records"],
    time: "Depends on record completeness and the auditor's schedule.",
    icon: "checklist"
  },
  {
    id: "itr-filing",
    name: "ITR Filing",
    category: "Compliance & Reports",
    shortDescription: "Prepare information for applicable tax filings.",
    documents: ["PAN and organization details", "Financial statements and bank information", "Audit report and prior return, if applicable"],
    time: "Depends on record readiness and applicable filing requirements.",
    icon: "taxChart"
  },
  {
    id: "annual-report",
    name: "Annual Report",
    category: "Compliance & Reports",
    shortDescription: "Summarize your NGO's annual work.",
    documents: ["Activities, beneficiaries, and outcome details", "Financial and governance information", "Photos or supporting records with permission"],
    time: "Usually 5–10 business days after complete information is received.",
    icon: "chart"
  },
  {
    id: "project-report",
    name: "Project Report",
    category: "Compliance & Reports",
    shortDescription: "Plan project goals, budget, and outcomes.",
    documents: ["Project goals and target beneficiaries", "Activity plan and estimated budget", "Expected outcomes and supporting data"],
    time: "Usually 5–10 business days after complete inputs are received.",
    icon: "clipboard"
  },
  {
    id: "challan-jama",
    name: "Challan Jama",
    category: "Compliance & Reports",
    shortDescription: "Organize challan payment details and records.",
    documents: ["Applicable challan or payment reference", "Organization PAN and filing details", "Payment confirmation, if already paid"],
    time: "Depends on the relevant portal and payment confirmation.",
    icon: "receipt"
  },
  {
    id: "logo-design",
    name: "Logo Design",
    category: "Digital & Design",
    shortDescription: "Design a visual identity for your mission.",
    documents: ["Organization name and mission", "Preferred colors and design references", "Any required tagline or symbols"],
    time: "Initial concepts are often shared within 5–10 business days.",
    icon: "pen"
  },
  {
    id: "website-design",
    name: "Website Design",
    category: "Digital & Design",
    shortDescription: "Plan a responsive organization website.",
    documents: ["Organization logo and approved content", "Contact details and domain information", "Photos and testimonials approved for publication"],
    time: "Often 2–4 weeks depending on scope and content readiness.",
    icon: "browser"
  },
  {
    id: "ngo-website",
    name: "NGO Website",
    category: "Digital & Design",
    shortDescription: "Create a digital home for your NGO.",
    documents: ["Logo and approved page content", "Contact and social media details", "Domain and hosting preferences"],
    time: "Often 2–4 weeks depending on scope and content readiness.",
    icon: "globe"
  },
  {
    id: "ngo-profile",
    name: "NGO Profile",
    category: "Digital & Design",
    shortDescription: "Present your NGO mission and impact.",
    documents: ["Registration and organization details", "Mission, programs, and achievements", "Approved images and contact information"],
    time: "Usually 5–10 business days after content is received.",
    icon: "profile"
  }
];

// Client-provided totals include grouped offerings beyond the detailed catalog entries.
window.SERVICE_STATS = {
  totalOfferings: 50,
  statesServed: 8,
  clientsServed: 2000
};
