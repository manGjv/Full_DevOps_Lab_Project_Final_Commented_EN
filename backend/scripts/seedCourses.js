// backend/scripts/seedCourses.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Course from "../src/models/courses.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..", "..");

// load .env from project root
dotenv.config({ path: path.join(rootDir, ".env") });

async function main() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not set in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Optional: clean existing courses
    await Course.deleteMany({});
    console.log("🧹 Existing courses cleared");

    const courses = [
      {
        title: "Cybersecurity 101: Understanding the Basics",
        domain: "fundamentals",
        level: "beginner",
        description:
          "Learn the foundations of cybersecurity: what it is, why it matters, the main types of attacks, and how to protect your accounts and devices. This course is designed for complete beginners and focuses on real-life examples, clear explanations, and practical habits you can apply immediately.",
        lessons: [
          {
            title: "What is Cybersecurity?",
            type: "video",
            duration: "10 min",
            url: "https://www.youtube.com/embed/inWWhr5tnEA",
            content:
              "Cybersecurity is the practice of protecting systems, networks, and data from digital attacks. In this lesson, you discover why cybersecurity matters in everyday life, from protecting social media and email accounts to keeping online payments safe. The video introduces the CIA triad: Confidentiality, Integrity, and Availability, which forms the core of most security decisions."
          },
          {
            title: "Why Cybersecurity Matters in Everyday Life",
            type: "text",
            duration: "10 min",
            content:
              "Cyber attacks are not just a problem for big companies. Everyday users face phishing emails, fake login pages, malicious downloads, and password leaks. In this lesson, you explore concrete scenarios such as compromised email accounts, reused passwords across multiple services, and fraudulent online shops. The goal is to understand that small security mistakes can have big consequences, and that building simple habits greatly reduces risk."
          },
          {
            title: "Common Threats: Malware, Phishing, and Ransomware",
            type: "video",
            duration: "20 min",
            url: "https://www.youtube.com/embed/Dk-ZqQ-bfy4",
            content:
              "This lesson introduces three common families of threats. Malware is any malicious software that can spy on you, steal data, or damage your system. Phishing tries to trick you into revealing passwords, banking information, or other sensitive data by pretending to be a trusted entity. Ransomware locks your files and demands payment to unlock them. You will see how attackers exploit fear, urgency, and curiosity to push victims into making quick, unsafe decisions."
          },
          {
            title: "Passwords: What Makes a Password Strong?",
            type: "text",
            duration: "15 min",
            content:
              "Weak or reused passwords make an attacker’s job easy. This lesson explains brute-force and dictionary attacks, credential stuffing, and what happens when a site you use is breached. You will learn why long passphrases are more secure and easier to remember than short complex passwords, why each service should have a unique password, and how password managers help you stay secure without relying on memory."
          },
          {
            title: "Multi-Factor Authentication (MFA) Explained",
            type: "video",
            duration: "12 min",
            url: "https://www.youtube.com/embed/hGRii5f_uSc",
            content:
              "Multi-Factor Authentication (MFA) adds extra layers of security on top of your password by combining something you know, something you have, or something you are. This lesson shows how codes, hardware tokens, and biometrics help prevent account takeovers even if your password is leaked, and highlights common pitfalls such as SMS-based codes and unsafe device approvals."
          },
          {
            title: "Safe Browsing and Device Hygiene",
            type: "text",
            duration: "15 min",
            content:
              "Good digital hygiene drastically reduces your attack surface. In this lesson, you cover software updates, antivirus tools, browser security settings, safe download habits, and the dangers of public Wi-Fi. You also learn why regular backups and keeping your operating system and applications updated are some of the simplest and most effective defenses you can apply today."
          },
          {
            title: "Mini Quiz: Cybersecurity Basics",
            type: "interactive",
            duration: "10 min",
            content:
              "Check your understanding of the core concepts from this course: common threats, password best practices, how to spot phishing attempts, and why MFA is so powerful. The quiz helps you identify which topics you have fully understood and which lessons you may want to review."
          }
        ],
        enrolled: 42,
        completionRate: 65
      },

      {
        title: "Protecting Your Online Accounts",
        domain: "fundamentals",
        level: "beginner",
        description:
          "Learn how to secure your email, social media, and cloud accounts using strong passwords, MFA, and basic security settings. This course is focused on practical, step‑by‑step actions you can apply today on your favorite services.",
        lessons: [
          {
            title: "Your Email: The Key to Everything",
            type: "text",
            duration: "12 min",
            content:
              "Most of your other accounts (social media, shopping, banking) can be reset through your email inbox. That makes your email account one of the most important assets to protect. In this lesson, you learn how attackers abuse password reset links, how account recovery works, and why using a unique, strong password with MFA on your main email dramatically reduces the risk of full account takeover. You also see how to review connected devices and active sessions in a typical email provider."
          },
          {
            title: "Securing Social Media and Cloud Storage",
            type: "video",
            duration: "14 min",
            url: "https://www.youtube.com/embed/NlE4FETpB7s",
            content:
              "This video walks through common security settings on social media and cloud storage platforms: privacy options, login alerts, connected apps, and suspicious login notifications. You discover how oversharing information can help attackers answer security questions or craft convincing phishing messages, and how to review and revoke access for old apps or devices that you no longer use."
          },
          {
            title: "Recognizing Suspicious Login Activity",
            type: "text",
            duration: "10 min",
            content:
              "Many services warn you when something unusual happens: a login from a new device, a connection from another country, or multiple failed attempts. In this lesson, you learn how to interpret these alerts, what to do if you receive one (change your password, enable MFA, log out of other sessions), and how to distinguish real security notifications from fake phishing emails pretending to come from your provider."
          },
          {
            title: "Mini Quiz: Account Security Basics",
            type: "interactive",
            duration: "8 min",
            content:
              "Test your ability to choose the safest options for securing your accounts. You answer questions about email protection, social media settings, and what to do when you receive a suspicious login notification. The quiz helps you practice making the right decision under realistic scenarios."
          }
        ],
        enrolled: 0,
        completionRate: 0
      },

      {
        title: "Staying Safe on Public Wi‑Fi and Social Engineering",
        domain: "fundamentals",
        level: "beginner",
        description:
          "Understand the risks of public Wi‑Fi, social engineering, and oversharing information online. This course shows how attackers trick people rather than systems, and gives simple rules to stay safe when you connect on the go.",
        lessons: [
          {
            title: "Risks of Public Wi‑Fi",
            type: "video",
            duration: "11 min",
            url: "https://www.youtube.com/embed/6x_9Q2M4u0o",
            content:
              "Public Wi‑Fi networks in cafes, hotels, or airports are convenient but not always safe. This video explains how attackers can create fake hotspots, intercept unencrypted traffic, or watch which sites you visit. You learn which activities are higher risk (such as logging into sensitive accounts) and how using HTTPS, VPNs, and mobile hotspots greatly reduces your exposure."
          },
          {
            title: "Introduction to Social Engineering",
            type: "text",
            duration: "15 min",
            content:
              "Social engineering is the art of manipulating people to give up information or perform actions that help an attacker. In this lesson, you explore common tactics such as pretexting, baiting, and urgent phone calls pretending to be support. Through simple scenarios, you learn to spot red flags: pressure to act quickly, requests for confidential data, or messages that skip official procedures and ask you to ‘just help out this one time’."
          },
          {
            title: "Safe Habits in Public Places",
            type: "text",
            duration: "10 min",
            content:
              "When using a laptop or phone in public, people around you can see your screen, your keyboard, or hear your conversations. This lesson covers shoulder surfing, unattended devices, and the risks of plugging into unknown chargers or USB sticks. You learn basic rules: lock your screen when you step away, avoid typing passwords with someone behind you, and never plug in devices or cables from untrusted sources."
          },
          {
            title: "Mini Quiz: Public Wi‑Fi & Social Engineering",
            type: "interactive",
            duration: "8 min",
            content:
              "You are placed in short, realistic situations: a free Wi‑Fi network at an airport, a phone call from ‘IT support’, or a USB drive found in the office. For each scenario, you choose how to react. The quiz highlights safe choices and explains why some intuitive reactions can actually be dangerous."
          }
        ],
        enrolled: 0,
        completionRate: 0
      },


      {
        title: "Network Security: From LAN to Internet",
        domain: "network-security",
        level: "intermediate",
        description:
          "Understand how data moves across networks and how attackers intercept, observe, or manipulate traffic. This course walks through the main network models, basic monitoring techniques, and core defenses such as firewalls, VPNs, and segmentation, with a focus on the security perspective.",
        lessons: [
          {
            title: "OSI and TCP/IP Models Explained",
            type: "video",
            duration: "18 min",
            url: "https://www.youtube.com/embed/3b_TAYtzuho",
            content:
              "This lesson breaks down the OSI and TCP/IP models layer by layer. You will see how data is encapsulated, transmitted, and decapsulated, and how different protocols fit into the stack. The lesson also shows where common attacks such as sniffing, spoofing, and session hijacking target specific layers."
          },
          {
            title: "Packet Sniffing and Network Visibility",
            type: "video",
            duration: "22 min",
            url: "https://www.youtube.com/embed/T7qKJgohpKk",
            content:
              "Here you learn how tools like Wireshark capture and display network traffic. You see the difference between encrypted and unencrypted protocols and why sending sensitive information over plain HTTP or insecure Wi-Fi is dangerous. The lesson highlights how attackers and defenders both rely on traffic visibility to understand what is happening on the network."
          },
          {
            title: "Firewalls, NAT, and Network Segmentation",
            type: "text",
            duration: "20 min",
            content:
              "Firewalls filter traffic according to predefined rules, while NAT hides internal addresses behind a public IP. This lesson explains how packet-filtering and stateful firewalls work, what DMZs are used for, and how network segmentation limits the spread of an intrusion. You will understand why flat networks are easier to attack and harder to defend."
          },
          {
            title: "VPNs and Secure Remote Access",
            type: "video",
            duration: "15 min",
            url: "https://www.youtube.com/embed/1QUZ8U9Zx_s",
            content:
              "VPNs create encrypted tunnels over untrusted networks such as public Wi-Fi. This lesson shows how VPNs protect confidentiality and integrity of traffic, typical use cases for remote workers and site-to-site links, and why VPNs are not a magic shield against all threats, especially in modern cloud-native environments."
          },
          {
            title: "Mini Quiz: Network Security Basics",
            type: "interactive",
            duration: "10 min",
            content:
              "Test your knowledge of network layers, packet sniffing concepts, firewall rules, NAT behavior, and VPN fundamentals. The goal is to make sure you can reason about how traffic moves and where to place defenses."
          }
        ],
        enrolled: 25,
        completionRate: 48
      },

      {
        title: "Web Application Hacking for Beginners",
        domain: "web-security",
        level: "intermediate",
        description:
          "Explore how web applications really work under the hood and where typical vulnerabilities appear. This course introduces common flaws from the attacker’s perspective and explains how to think defensively as a developer or security tester.",
        lessons: [
          {
            title: "How the Web Works: HTTP, Cookies, Sessions",
            type: "video",
            duration: "20 min",
            url: "https://www.youtube.com/embed/eesqK59rhGA",
            content:
              "This lesson covers HTTP requests and responses, headers, cookies, and sessions. You will learn how logins, session identifiers, and state management work in real applications and where weaknesses such as insecure cookies and session fixation often appear."
          },
          {
            title: "OWASP Top 10 Overview",
            type: "video",
            duration: "17 min",
            url: "https://www.youtube.com/embed/LpZ1u5P2sY0",
            content:
              "The OWASP Top 10 is a widely recognized list of the most critical web application risks. This lesson introduces categories such as injection, broken access control, insecure design, and security misconfiguration, giving you a big-picture view of what attackers target most often."
          },
          {
            title: "Cross-Site Scripting (XSS) Explained",
            type: "text",
            duration: "20 min",
            content:
              "XSS allows attackers to run malicious JavaScript in a victim’s browser. In this lesson, you learn the differences between reflected, stored, and DOM-based XSS, see how untrusted input ends up in the page, and discover defensive techniques including input validation, output encoding, and Content Security Policy."
          },
          {
            title: "SQL Injection: How Databases Get Hacked",
            type: "video",
            duration: "18 min",
            url: "https://www.youtube.com/embed/ciNHn38EyRc",
            content:
              "SQL Injection occurs when user-controlled input is inserted directly into SQL queries. This lesson explains how attackers bypass authentication, read or modify data, and sometimes gain full system control. You also learn how prepared statements, parameterized queries, and ORM best practices prevent these attacks."
          },
          {
            title: "Mini Lab: Finding Vulnerabilities",
            type: "lab",
            duration: "30 min",
            content:
              "In this guided lab, you explore a deliberately vulnerable demo application. The objective is to identify insecure patterns and weak configurations rather than attack real systems. You practice thinking like an attacker while respecting legal and ethical boundaries."
          }
        ],
        enrolled: 18,
        completionRate: 35
      },

      {
        title: "Advanced Offensive Security & Red Teaming",
        domain: "offensive-security",
        level: "expert",
        description:
          "Go beyond basic hacking and learn how professional red teams plan and execute end-to-end attack simulations. This course focuses on attack chains, stealth, and realistic engagement workflows rather than isolated tricks.",
        lessons: [
          {
            title: "Attack Lifecycle and Kill Chain",
            type: "video",
            duration: "25 min",
            url: "https://www.youtube.com/embed/7g8G2N8xXZw",
            content:
              "This lesson introduces the cyber kill chain and similar models that describe how attackers move from reconnaissance and initial access to persistence, lateral movement, and impact. You learn how each phase builds on the previous one and where defenders can detect and disrupt the operation."
          },
          {
            title: "Privilege Escalation Fundamentals",
            type: "text",
            duration: "25 min",
            content:
              "Privilege escalation is about turning a small foothold into full control. You explore common vectors, including misconfigurations, overly permissive services, weak file permissions, and credential reuse. The lesson also touches on the difference between vertical and horizontal escalation."
          },
          {
            title: "Active Directory Attacks Overview",
            type: "video",
            duration: "30 min",
            url: "https://www.youtube.com/embed/5c7Rlf0A7mU",
            content:
              "Active Directory is at the center of many enterprise environments and thus a prime target. This lesson introduces techniques such as Kerberoasting, Pass-the-Hash, and lateral movement through misconfigured delegation and group memberships, with a focus on attack paths rather than tooling details."
          },
          {
            title: "Red Team OpSec and Reporting",
            type: "text",
            duration: "20 min",
            content:
              "Operational Security (OpSec) is about staying undetected during engagements: minimizing logs, blending with normal traffic, and avoiding noisy techniques. The lesson also explains why a red team’s final value is in clear, actionable reporting that helps organizations improve their defenses, not just in gaining domain admin."
          }
        ],
        enrolled: 9,
        completionRate: 22
      },

      {
        title: "Secure Coding in JavaScript & Node.js",
        domain: "secure-coding",
        level: "intermediate",
        description:
          "Write JavaScript and Node.js applications that are secure by default. This course focuses on the most common mistakes seen in real projects and how to prevent them early in the development lifecycle.",
        lessons: [
          {
            title: "Threat Modeling for Developers",
            type: "video",
            duration: "20 min",
            url: "https://www.youtube.com/embed/2n8jJ0KzM4Y",
            content:
              "Threat modeling helps you think like an attacker before writing or deploying code. This lesson explains how to identify assets, entry points, trust boundaries, and potential abuse cases, so you can prioritize security controls where they matter most."
          },
          {
            title: "Input Validation and Injection Risks",
            type: "text",
            duration: "20 min",
            content:
              "Improper input handling is at the root of many vulnerabilities. You learn the difference between validation, sanitization, and encoding, and how poor handling leads to issues like XSS, command injection, and template injection. Practical patterns for server-side and client-side checks are discussed."
          },
          {
            title: "Authentication, JWT, and Common Pitfalls",
            type: "video",
            duration: "22 min",
            url: "https://www.youtube.com/embed/7Q17ubqLfaM",
            content:
              "This lesson explores secure authentication flows, session vs token-based auth, and typical JWT problems such as overly long lifetimes, storing tokens in unsafe locations, and weak signing strategies. You learn concrete guidelines for building safer login and session management features."
          },
          {
            title: "Secure Dependencies and Updates",
            type: "text",
            duration: "15 min",
            content:
              "Third-party packages extend your application but also extend your attack surface. This lesson shows how dependency vulnerabilities are discovered, why outdated libraries are risky, and how to use tools like advisory databases, dependency scanning, and lockfiles to reduce supply-chain risk."
          }
        ],
        enrolled: 15,
        completionRate: 40
      },

      {
  title: "Securing Your Devices and Home Network",
  domain: "protection",
  level: "intermediate",
  description:
    "Learn how to harden your laptops, smartphones, and home router: updates, configuration, backups, and basic network hygiene that significantly raises the bar for attackers.",
  lessons: [
    {
      title: "Hardening Your Operating System",
      type: "text",
      duration: "18 min",
      content:
        "This lesson covers automatic updates, removing unnecessary software, configuring screen locks, and restricting admin rights. You see how misconfigurations and unpatched systems are often exploited in real attacks."
    },
    {
      title: "Securing Your Home Wi‑Fi",
      type: "video",
      duration: "16 min",
      url: "https://www.youtube.com/embed/wX3smZ3VArU",
      content:
        "You learn how to change default router passwords, choose WPA2/WPA3 encryption, set a strong Wi‑Fi key, and disable unsafe options such as open guest networks without passwords."
    },
    {
      title: "Backups and Recovery Basics",
      type: "text",
      duration: "14 min",
      content:
        "Here you study simple backup strategies: external drives, cloud backups, and versioning. You see how backups help you recover from ransomware, hardware failure, or accidental deletion."
    },
    {
      title: "Mini Quiz: Devices & Home Network",
      type: "interactive",
      duration: "10 min",
      content:
        "Short questions and scenarios check whether you can choose secure settings for your devices and router, and design a basic backup plan."
    }
  ],
  enrolled: 0,
  completionRate: 0
},
{
  title: "Threat Modeling and Attack Paths",
  domain: "advanced-concepts",
  level: "expert",
  description:
    "Learn how to think like an attacker by mapping assets, entry points, and attack paths. This course introduces structured threat modeling so you can prioritize real risks instead of guessing.",
  lessons: [
    {
      title: "Introduction to Threat Modeling",
      type: "text",
      duration: "18 min",
      content:
        "This lesson presents common threat modeling approaches (asset-centric, attacker-centric, and data flow–centric) and shows how to identify what truly needs protection in a system."
    },
    {
      title: "Data Flows and Trust Boundaries",
      type: "video",
      duration: "17 min",
      url: "https://www.youtube.com/embed/ibVQxQ0kK4E",
      content:
        "You learn to draw simple data flow diagrams, identify trust boundaries, and spot where input validation, authentication, and encryption are most critical."
    },
    {
      title: "Prioritizing Threats and Mitigations",
      type: "text",
      duration: "16 min",
      content:
        "This lesson explains how to reason about likelihood and impact, group threats, and select realistic mitigations that match your environment and constraints."
    },
    {
      title: "Mini Quiz: Threat Modeling",
      type: "interactive",
      duration: "10 min",
      content:
        "Scenario-based questions test your ability to recognize assets, attack paths, and appropriate mitigations in small system descriptions."
    }
  ],
  enrolled: 0,
  completionRate: 0
},
{
  title: "Secure Design for Web Applications",
  domain: "web-security",
  level: "expert",
  description:
    "Go beyond basic best practices and learn how to design web applications that resist common attacks by construction: input validation, session management, access control, and secure defaults.",
  lessons: [
    {
      title: "Input Validation and Output Encoding",
      type: "video",
      duration: "16 min",
      url: "https://www.youtube.com/embed/8VqJvQ0Qz0E",
      content:
        "You review typical injection vectors and see how central validation and output encoding are to preventing XSS and injection flaws in modern web stacks."
    },
    {
      title: "Session and Authentication Design",
      type: "text",
      duration: "18 min",
      content:
        "This lesson covers secure cookie flags, session timeouts, token-based auth, and common anti-patterns such as storing sensitive data in client-side tokens without proper protection."
    },
    {
      title: "Access Control and Least Privilege",
      type: "text",
      duration: "16 min",
      content:
        "You study broken access control scenarios and learn how to enforce authorization checks at the right layer, using roles and permissions without leaking sensitive actions."
    },
    {
      title: "Mini Quiz: Secure Web Design",
      type: "interactive",
      duration: "10 min",
      content:
        "You answer questions about safe defaults, secure session handling, and typical web security design mistakes."
    }
  ],
  enrolled: 0,
  completionRate: 0
},
      {
  title: "Recognizing and Handling Phishing Attacks",
  domain: "threats",
  level: "intermediate",
  description:
    "Dive deeper into phishing techniques, learn to deconstruct real examples, and practice deciding how to react safely to suspicious messages, links, and login pages.",
  lessons: [
    {
      title: "Anatomy of a Phishing Email",
      type: "video",
      duration: "15 min",
      url: "https://www.youtube.com/embed/0m4vL5q8-8Y",
      content:
        "This lesson breaks down real phishing emails: sender spoofing, misleading links, urgent language, and fake login pages. You learn how attackers bypass basic filters and how to inspect headers and URLs before clicking."
    },
    {
      title: "Spotting Red Flags in Messages",
      type: "text",
      duration: "15 min",
      content:
        "You review concrete examples of phishing by email, SMS, and social media. The lesson highlights typical red flags: unexpected attachments, requests for credentials, grammar mistakes, and links that almost—but not quite—match official domains."
    },
    {
      title: "Safe Response Strategy",
      type: "text",
      duration: "12 min",
      content:
        "Here you learn a simple decision process: do not click, verify through another channel, report, and delete. You see how to use official apps or bookmarked sites instead of links, and how organizations expect you to report suspicious messages."
    },
    {
      title: "Mini Quiz: Phishing in Practice",
      type: "interactive",
      duration: "10 min",
      content:
        "You are shown short scenarios based on realistic phishing attempts and must choose the safest action, reinforcing the response strategy from the course."
    }
  ],
  enrolled: 0,
  completionRate: 0
},


      {
        title: "Incident Response & Digital Forensics",
        domain: "incident-response",
        level: "expert",
        description:
          "Learn how organizations detect, analyze, contain, and recover from security incidents, and how forensic techniques reconstruct what actually happened on compromised systems.",
        lessons: [
          {
            title: "Incident Response Lifecycle",
            type: "video",
            duration: "18 min",
            url: "https://www.youtube.com/embed/8cY6wZLwX1M",
            content:
              "This lesson walks through the key phases of incident response: preparation, detection and analysis, containment, eradication, and recovery. You see how playbooks, communication plans, and clear roles reduce panic and mistakes during real crises."
          },
          {
            title: "Collecting Digital Evidence Safely",
            type: "text",
            duration: "20 min",
            content:
              "Handling digital evidence incorrectly can destroy crucial information or make it unusable in investigations. This lesson introduces chain of custody, volatile vs non-volatile data, and best practices for imaging systems, capturing logs, and preserving artifacts."
          },
          {
            title: "Introduction to Digital Forensics",
            type: "video",
            duration: "22 min",
            url: "https://www.youtube.com/embed/YKp9QjJpS3A",
            content:
              "Here you discover how forensic analysts piece together timelines from logs, memory captures, disk images, and network traces. You learn common goals such as understanding initial access, attacker methods, and impact, rather than just cleaning up and moving on."
          },
          {
            title: "Writing Clear Incident Reports",
            type: "interactive",
            duration: "25 min",
            content:
              "In this interactive exercise, you practice structuring an incident report that highlights what happened, how it was detected, what was impacted, and which actions are recommended. The focus is on clarity for both technical responders and non-technical stakeholders."
          }
        ],
        enrolled: 7,
        completionRate: 18
      }
    ];

    const inserted = await Course.insertMany(courses);
    console.log(`✅ Inserted ${inserted.length} courses`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

main();
 