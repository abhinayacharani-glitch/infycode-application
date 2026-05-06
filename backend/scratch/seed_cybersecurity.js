import "dotenv/config";
import db from "../src/config/firebase.js";

const coursesRef = db.ref("courses");

const CYBERSECURITY_COURSE = {
  title: "Cybersecurity & Ethical Hacking",
  description: "Master the art of protecting systems, networks, and programs from digital attacks. Learn ethical hacking, network security, and cryptography.",
  instructor: "Charani",
  category: "Security",
  duration: "4 Months",
  level: "Intermediate",
  imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800",
  curriculum: "[Introduction to Security]\nFundamentals of Cybersecurity\nTypes of Cyber Attacks\nInformation Security Principles\nRisk Management & Compliance\n\n[Network Security]\nTCP/IP Fundamentals\nFirewalls & IDS/IPS\nVPNs & Secure Remote Access\nWireless Security\n\n[Ethical Hacking]\nVulnerability Assessment\nPenetration Testing (VAPT)\nWeb Application Security\nSocial Engineering Attacks\n\n[Advanced Defense]\nCryptography Fundamentals\nIncident Response & Forensic\nCloud Security Principles\nCybersecurity Governance",
  likes: 0,
  isLiked: false,
  createdAt: new Date().toISOString()
};

const seedCourse = async () => {
  try {
    console.log("Seeding Cybersecurity course...");
    const newCourseRef = coursesRef.push();
    await newCourseRef.set(CYBERSECURITY_COURSE);
    console.log("Course seeded successfully with ID:", newCourseRef.key);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding course:", error);
    process.exit(1);
  }
};

seedCourse();
