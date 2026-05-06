import "dotenv/config";
import db from "../src/config/firebase.js";

const syllabusRef = db.ref("syllabuses");

const CYBERSECURITY_SYLLABUS = {
  title: "Cybersecurity & Ethical Hacking",
  modules: [
    { 
      name: "Introduction to Security", 
      topics: [
        "Fundamentals of Cybersecurity", 
        "Types of Cyber Attacks", 
        "Information Security Principles", 
        "Risk Management & Compliance"
      ] 
    },
    { 
      name: "Network Security", 
      topics: [
        "TCP/IP Fundamentals", 
        "Firewalls & IDS/IPS", 
        "VPNs & Secure Remote Access", 
        "Wireless Security"
      ] 
    },
    { 
      name: "Ethical Hacking", 
      topics: [
        "Vulnerability Assessment", 
        "Penetration Testing (VAPT)", 
        "Web Application Security", 
        "Social Engineering Attacks"
      ] 
    },
    { 
      name: "Advanced Defense", 
      topics: [
        "Cryptography Fundamentals", 
        "Incident Response & Forensic", 
        "Cloud Security Principles", 
        "Cybersecurity Governance"
      ] 
    }
  ],
  createdAt: new Date().toISOString()
};

const seedSyllabus = async () => {
  try {
    console.log("Seeding Cybersecurity syllabus...");
    const newRef = syllabusRef.push();
    await newRef.set(CYBERSECURITY_SYLLABUS);
    console.log("Syllabus seeded successfully with ID:", newRef.key);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding syllabus:", error);
    process.exit(1);
  }
};

seedSyllabus();
