export type Internship = {
  id: string;
  title: string;
  company: string;
  location: string;
  category: string;
  allowance: string;
  duration: string;
  description: string;
  requirements: string[];
  benefits: string[];
  requiresResume: boolean;
  isActive: boolean;
  employerId?: string;
};

export const sampleInternships: Internship[] = [
  {
    id: "sample-software",
    title: "Software Engineering Intern",
    company: "SunLife",
    location: "Makati City • On-site",
    category: "Tech",
    allowance: "₱8,000 / month",
    duration: "3 months",
    description: "Work with the engineering team on real projects, learn from experienced developers, and contribute to internal tools.",
    requirements: ["Currently enrolled in a Computer Science or related course", "Basic knowledge of programming", "Willing to learn and collaborate"],
    benefits: ["Real-world development experience", "Mentorship from industry professionals", "Portfolio-ready projects"],
    requiresResume: true,
    isActive: true,
  },
  {
    id: "sample-marketing",
    title: "Marketing Intern",
    company: "Pspsps Media",
    location: "Pasig City • Hybrid",
    category: "Marketing",
    allowance: "₱6,000 / month",
    duration: "4 months",
    description: "Support social media campaigns, content planning, and marketing research for a growing creative team.",
    requirements: ["Currently enrolled in Marketing, Communications, or related course", "Good written communication", "Creative and organized"],
    benefits: ["Campaign experience", "Creative mentorship", "Flexible hybrid setup"],
    requiresResume: false,
    isActive: true,
  },
  {
    id: "sample-design",
    title: "Graphic Design Intern",
    company: "Pixel Studio",
    location: "Taguig • Hybrid",
    category: "Design",
    allowance: "₱7,000 / month",
    duration: "3 months",
    description: "Assist the design team in preparing digital assets and visual materials for client projects.",
    requirements: ["Basic knowledge of design tools", "Portfolio or sample work", "Attention to detail"],
    benefits: ["Portfolio development", "Design mentorship", "Collaborative projects"],
    requiresResume: true,
    isActive: true,
  },
  {
    id: "sample-business",
    title: "Business Analyst Intern",
    company: "Mama Labs",
    location: "BGC, Taguig • On-site",
    category: "Business",
    allowance: "₱5,000 / month",
    duration: "3 months",
    description: "Help gather requirements, organize data, and prepare reports for business improvement projects.",
    requirements: ["Currently enrolled in a business or technology course", "Comfortable with spreadsheets", "Analytical mindset"],
    benefits: ["Business process exposure", "Team mentorship", "Practical reporting experience"],
    requiresResume: false,
    isActive: true,
  },
];
