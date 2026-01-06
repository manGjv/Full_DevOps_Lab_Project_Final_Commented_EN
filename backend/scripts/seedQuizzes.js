// backend/scripts/seedQuizzes.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Quiz from "../src/models/quizzes.model.js";
import Course from "../src/models/courses.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..", "..");

dotenv.config({ path: path.join(rootDir, ".env") });

async function main() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not set in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Fetch all courses
    const courses = await Course.find({});
    console.log(`📚 Found ${courses.length} courses`);

    // Clear existing quizzes
    await Quiz.deleteMany({});
    console.log("🧹 Existing quizzes cleared");

    // Define quizzes for each course
    const quizData = [
      {
        courseTitle: "Cybersecurity 101: Understanding the Basics",
        quiz: {
          title: "Mini Quiz: Cybersecurity Basics",
          questions: [
            {
              text: "What does the CIA triad stand for in cybersecurity?",
              options: [
                "Central Intelligence Agency",
                "Confidentiality, Integrity, Availability",
                "Cryptography, Identification, Authentication",
                "Control, Isolation, Access"
              ],
              correctIndex: 1
            },
            {
              text: "What type of attack involves a hacker sending you a fake email to steal your information?",
              options: [
                "Malware",
                "Ransomware",
                "Phishing",
                "DDoS"
              ],
              correctIndex: 2
            },
            {
              text: "What is the best practice for creating a secure password?",
              options: [
                "Use the same password everywhere so you don't forget it",
                "Create a short but complex password",
                "Use a unique long passphrase for each service",
                "Use your name and date of birth"
              ],
              correctIndex: 2
            },
            {
              text: "What does MFA (Multi-Factor Authentication) mean?",
              options: [
                "A single very strong authentication method",
                "Multiple security layers combining different factors",
                "An automatic backup system",
                "An advanced type of firewall"
              ],
              correctIndex: 1
            },
            {
              text: "Why should you regularly update your software?",
              options: [
                "Only to get new features",
                "It's not necessary if you have antivirus",
                "To patch discovered security vulnerabilities",
                "To consume more system resources"
              ],
              correctIndex: 2
            }
          ]
        }
      },
      {
  courseTitle: "Protecting Your Online Accounts",
  quiz: {
    title: "Mini Quiz: Account Security Basics",
    questions: [
      {
        text: "Why is your email account especially important to secure?",
        options: [
          "It is rarely used, so attackers ignore it",
          "Most other accounts can be reset through email",
          "It does not contain any sensitive information",
          "It automatically blocks all phishing attempts"
        ],
        correctIndex: 1
      },
      {
        text: "Which combination best protects your main email account?",
        options: [
          "Simple password and no recovery options",
          "Strong unique password plus MFA",
          "Same password as social media for consistency",
          "Password written on a note near your desk"
        ],
        correctIndex: 1
      },
      {
        text: "Why should you regularly review connected apps and devices?",
        options: [
          "To improve your internet speed",
          "Old or unknown connections may still have access",
          "It is required every day by all providers",
          "To reset all your passwords automatically"
        ],
        correctIndex: 1
      },
      {
        text: "Which of these is a sign that a login alert might be legitimate?",
        options: [
          "It comes from a random email address with spelling errors",
          "It asks you to reply with your password",
          "It matches activity on your account and comes from the official domain",
          "It threatens legal action if you do not pay immediately"
        ],
        correctIndex: 2
      },
      {
        text: "What should you do if you see a login from a country you’ve never visited?",
        options: [
          "Ignore it if the email looks nice",
          "Forward the email to friends to warn them",
          "Change your password, enable MFA, and sign out of other sessions",
          "Uninstall your browser"
        ],
        correctIndex: 2
      }
    ]
  }
},
{
  courseTitle: "Staying Safe on Public Wi‑Fi and Social Engineering",
  quiz: {
    title: "Mini Quiz: Public Wi‑Fi & Social Engineering",
    questions: [
      {
        text: "Why can public Wi‑Fi networks be risky?",
        options: [
          "They are always slow",
          "Attackers can sometimes intercept or observe your traffic",
          "They only work on mobile phones",
          "They automatically encrypt all data by default"
        ],
        correctIndex: 1
      },
      {
        text: "Which activity is the riskiest on an unknown public Wi‑Fi?",
        options: [
          "Reading public news websites",
          "Watching random videos",
          "Logging into banking or other highly sensitive accounts",
          "Checking the weather forecast"
        ],
        correctIndex: 2
      },
      {
        text: "What is a common sign of social engineering?",
        options: [
          "A message that follows official procedures and gives you time",
          "A calm request that you verify information through the official website",
          "Pressure to act quickly and share confidential information",
          "A regular system update notification on your device"
        ],
        correctIndex: 2
      },
      {
        text: "How should you react to a ‘free USB stick’ you found in the office or public space?",
        options: [
          "Plug it in to see what is inside",
          "Give it to a colleague to test",
          "Only use it on your personal laptop",
          "Do not plug it in; report or dispose of it through proper channels"
        ],
        correctIndex: 3
      },
      {
        text: "Which habit helps protect you in public places?",
        options: [
          "Leaving your laptop unlocked when you go to get a coffee",
          "Typing passwords while someone stands right behind you",
          "Locking your screen when you step away from your device",
          "Sharing your charger and USB cable with strangers"
        ],
        correctIndex: 2
      }
    ]
  }
},
{
  courseTitle: "Recognizing and Handling Phishing Attacks",
  quiz: {
    title: "Mini Quiz: Phishing in Practice",
    questions: [
      {
        text: "Which element is the most suspicious in a potential phishing email?",
        options: [
          "A message from a colleague you know",
          "A request to confirm your password through a link you did not expect",
          "A regular newsletter you subscribed to",
          "A calendar reminder you created yourself"
        ],
        correctIndex: 1
      },
      {
        text: "You receive an email from your ‘bank’ asking you to click a link and log in. What is the safest first step?",
        options: [
          "Click the link and log in quickly before your account is blocked",
          "Reply with your username and password to save time",
          "Ignore the message completely in all cases",
          "Open your bank’s official app or bookmarked site and check for messages there"
        ],
        correctIndex: 3
      },
      {
        text: "Which URL is the most suspicious?",
        options: [
          "https://bank.example.com/login",
          "https://example.com/bank/login",
          "https://secure.bank-example.com",
          "https://bank-example.com.security-check.com"
        ],
        correctIndex: 3
      },
      {
        text: "What is the best way to handle an email with an unexpected attachment from an unknown sender?",
        options: [
          "Download and open it to see what it is",
          "Forward it to friends to ask if it is safe",
          "Delete it or report it as spam/phishing without opening",
          "Reply asking the sender for more details"
        ],
        correctIndex: 2
      },
      {
        text: "Why do many phishing messages try to create a sense of urgency?",
        options: [
          "To give you more time to think",
          "To comply with legal requirements",
          "To push you to act without checking details carefully",
          "To improve email delivery speed"
        ],
        correctIndex: 2
      }
    ]
  }
},
{
  courseTitle: "Securing Your Devices and Home Network",
  quiz: {
    title: "Mini Quiz: Devices & Home Network",
    questions: [
      {
        text: "Which Wi‑Fi configuration is safest for a home network?",
        options: [
          "Open network with no password",
          "WPA2/WPA3 with a strong unique passphrase",
          "WEP with a short password",
          "Same password as your email for convenience"
        ],
        correctIndex: 1
      },
      {
        text: "Why is it dangerous to keep the default admin password on your router?",
        options: [
          "It makes the Wi‑Fi slower",
          "Defaults are often public and easy for attackers to guess",
          "It disables encryption automatically",
          "It prevents devices from connecting"
        ],
        correctIndex: 1
      },
      {
        text: "Which habit best reduces the impact of ransomware on your personal files?",
        options: [
          "Installing more apps from random sites",
          "Disabling all security updates",
          "Keeping recent offline or cloud backups",
          "Using the same password everywhere"
        ],
        correctIndex: 2
      },
      {
        text: "Why should you use a standard user account instead of an admin account for daily work?",
        options: [
          "It makes your computer faster",
          "It automatically blocks all malware",
          "It limits what malware can do if it runs under your account",
          "It prevents you from installing any software ever"
        ],
        correctIndex: 2
      },
      {
        text: "Which action is MOST important to keep your operating system secure?",
        options: [
          "Never restarting your device",
          "Turning off the firewall permanently",
          "Regularly applying security updates",
          "Using outdated software because it feels familiar"
        ],
        correctIndex: 2
      }
    ]
  }
},
{
  courseTitle: "Threat Modeling and Attack Paths",
  quiz: {
    title: "Mini Quiz: Threat Modeling",
    questions: [
      {
        text: "What is the primary goal of threat modeling?",
        options: [
          "To perfectly eliminate all vulnerabilities",
          "To document every possible bug in the codebase",
          "To systematically identify and prioritize the most important risks",
          "To replace penetration testing entirely"
        ],
        correctIndex: 2
      },
      {
        text: "In a data flow diagram, what is a trust boundary?",
        options: [
          "A line that separates different UI components",
          "A point where data crosses between entities with different levels of control or trust",
          "A firewall rule in the network",
          "A physical security perimeter around the building"
        ],
        correctIndex: 1
      },
      {
        text: "Which asset is MOST critical in a typical web application?",
        options: [
          "The color scheme of the UI",
          "The database containing user credentials and personal data",
          "The marketing landing page images",
          "The public documentation website"
        ],
        correctIndex: 1
      },
      {
        text: "When evaluating threats, why is it useful to estimate both likelihood and impact?",
        options: [
          "So you can always fix the easiest issues first",
          "So you can focus only on low-impact issues",
          "So you can prioritize mitigations that meaningfully reduce overall risk",
          "So you can ignore business context completely"
        ],
        correctIndex: 2
      },
      {
        text: "Which example best illustrates an attack path?",
        options: [
          "User clicks a button that refreshes the page",
          "Attacker sends a phishing email that steals VPN credentials, then uses them to access internal systems",
          "Developer updates the logo on the homepage",
          "Marketing team publishes a new blog post"
        ],
        correctIndex: 1
      }
    ]
  }
},
{
  courseTitle: "Secure Design for Web Applications",
  quiz: {
    title: "Mini Quiz: Secure Web Design",
    questions: [
      {
        text: "Which practice helps prevent reflected XSS in a web application?",
        options: [
          "Disabling HTTPS in development",
          "Echoing user input directly into HTML without changes",
          "Context-aware output encoding of user-controlled data",
          "Storing all data in local storage"
        ],
        correctIndex: 2
      },
      {
        text: "Which cookie setting makes session cookies harder to steal via JavaScript?",
        options: [
          "SameSite=None",
          "HttpOnly",
          "Secure flag disabled",
          "Max-Age set to a very long value"
        ],
        correctIndex: 1
      },
      {
        text: "Which statement about access control is MOST correct?",
        options: [
          "It is enough to hide admin links in the frontend UI",
          "Authorization checks must be enforced on the server/API side for each sensitive action",
          "Role names alone (like 'admin') are sufficient to secure endpoints",
          "Once a user is authenticated, they should access all resources"
        ],
        correctIndex: 1
      },
      {
        text: "What is a good example of least privilege?",
        options: [
          "Giving every service account full database admin rights",
          "Granting users only the minimal permissions required for their tasks",
          "Allowing all microservices to read and write all tables",
          "Letting the web server run as root for convenience"
        ],
        correctIndex: 1
      },
      {
        text: "Why is it risky to store sensitive data directly in long-lived JWTs without revocation?",
        options: [
          "JWTs cannot be used across services",
          "Attackers can never steal tokens",
          "If a token is leaked, it can be used until it expires and is hard to revoke centrally",
          "It always breaks compatibility with browsers"
        ],
        correctIndex: 2
      }
    ]
  }
},



      
      {
        courseTitle: "Network Security: From LAN to Internet",
        quiz: {
          title: "Mini Quiz: Network Security Basics",
          questions: [
            {
              text: "How many layers does the OSI model have?",
              options: ["4", "5", "7", "10"],
              correctIndex: 2
            },
            {
              text: "Which tool is commonly used to capture and analyze network traffic?",
              options: [
                "Photoshop",
                "Wireshark",
                "Microsoft Word",
                "Chrome DevTools"
              ],
              correctIndex: 1
            },
            {
              text: "What does a firewall do?",
              options: [
                "It speeds up your Internet connection",
                "It filters network traffic according to defined rules",
                "It automatically encrypts all your files",
                "It replaces your router"
              ],
              correctIndex: 1
            },
            {
              text: "What is the main role of a VPN?",
              options: [
                "Increase connection speed",
                "Create an encrypted tunnel to protect data in transit",
                "Block all advertisements",
                "Manage passwords"
              ],
              correctIndex: 1
            },
            {
              text: "Why is network segmentation important?",
              options: [
                "To make the network slower",
                "To limit the spread of an intrusion",
                "To use more IP addresses",
                "It is not important"
              ],
              correctIndex: 1
            }
          ]
        }
      },
      {
        courseTitle: "Web Application Hacking for Beginners",
        quiz: {
          title: "Mini Lab: Finding Vulnerabilities",
          questions: [
            {
              text: "What does HTTP stand for?",
              options: [
                "HyperText Transfer Protocol",
                "High Technology Transfer Process",
                "Hybrid Text Transmission Path",
                "Home Terminal Transfer Protocol"
              ],
              correctIndex: 0
            },
            {
              text: "What is the OWASP Top 10?",
              options: [
                "The top 10 best hackers in the world",
                "A list of the 10 most critical risks for web applications",
                "The 10 best development practices",
                "A ranking of programming languages"
              ],
              correctIndex: 1
            },
            {
              text: "What type of vulnerability allows malicious JavaScript to be executed in a victim's browser?",
              options: [
                "SQL Injection",
                "CSRF",
                "Cross-Site Scripting (XSS)",
                "Buffer Overflow"
              ],
              correctIndex: 2
            },
            {
              text: "How can SQL injections be prevented?",
              options: [
                "By using prepared and parameterized queries",
                "By disabling JavaScript",
                "By only using NoSQL databases",
                "By hiding the source code"
              ],
              correctIndex: 0
            },
            {
              text: "What is a CSP (Content Security Policy)?",
              options: [
                "A mechanism to limit authorized content sources",
                "A free SSL certificate",
                "An encryption protocol",
                "A type of secure cookie"
              ],
              correctIndex: 0
            }
          ]
        }
      },
      {
        courseTitle: "Advanced Offensive Security & Red Teaming",
        quiz: {
          title: "Red Team Assessment Quiz",
          questions: [
            {
              text: "What is the first phase of the Cyber Kill Chain?",
              options: [
                "Exploitation",
                "Reconnaissance",
                "Lateral Movement",
                "Exfiltration"
              ],
              correctIndex: 1
            },
            {
              text: "What is privilege escalation?",
              options: [
                "Increasing the speed of a system",
                "Transforming limited access into full control",
                "Creating multiple user accounts",
                "Encrypting files"
              ],
              correctIndex: 1
            },
            {
              text: "What is Kerberoasting?",
              options: [
                "A technique for toasting bread",
                "An attack aimed at extracting and cracking Kerberos tickets",
                "A log analysis tool",
                "An encryption protocol"
              ],
              correctIndex: 1
            },
            {
              text: "Why is OpSec (Operational Security) important in Red Teaming?",
              options: [
                "To maximize noise and alert defenders",
                "To remain undetected and simulate a realistic attacker",
                "To accelerate penetration tests",
                "It is not important"
              ],
              correctIndex: 1
            }
          ]
        }
      },
      {
        courseTitle: "Secure Coding in JavaScript & Node.js",
        quiz: {
          title: "Secure Coding Quiz",
          questions: [
            {
              text: "What is threat modeling?",
              options: [
                "A process to identify potential threats before deployment",
                "A 3D modeling language",
                "A JavaScript framework",
                "A type of database"
              ],
              correctIndex: 0
            },
            {
              text: "What is the difference between validation and sanitization?",
              options: [
                "There is no difference",
                "Validation checks format, sanitization cleans data",
                "Sanitization is obsolete",
                "Validation is only client-side"
              ],
              correctIndex: 1
            },
            {
              text: "Where should JWTs be stored securely on the client side?",
              options: [
                "localStorage",
                "Cookie with httpOnly and secure flags",
                "In a global variable",
                "In the URL"
              ],
              correctIndex: 1
            },
            {
              text: "Why are outdated dependencies dangerous?",
              options: [
                "They slow down the application",
                "They may contain known vulnerabilities",
                "They no longer work at all",
                "They consume too much memory"
              ],
              correctIndex: 1
            }
          ]
        }
      },
      {
        courseTitle: "Incident Response & Digital Forensics",
        quiz: {
          title: "Writing Clear Incident Reports",
          questions: [
            {
              text: "What is the first phase of incident response?",
              options: [
                "Eradication",
                "Preparation",
                "Recovery",
                "Containment"
              ],
              correctIndex: 1
            },
            {
              text: "What is the chain of custody?",
              options: [
                "A network protocol",
                "Documentation of the path of digital evidence",
                "An encryption algorithm",
                "A type of system log"
              ],
              correctIndex: 1
            },
            {
              text: "What is the difference between volatile and non-volatile data?",
              options: [
                "Volatile data is encrypted",
                "Volatile data disappears when the system is turned off",
                "Non-volatile data is faster",
                "There is no difference"
              ],
              correctIndex: 1
            },
            {
              text: "What is the main objective of forensic analysis?",
              options: [
                "Clean the system quickly",
                "Reconstruct what happened and identify the impact",
                "Install a new antivirus",
                "Reset all passwords"
              ],
              correctIndex: 1
            }
          ]
        }
      }
    ];

    // Create quizzes
    const quizzes = [];
    for (const item of quizData) {
      const course = courses.find(c => c.title === item.courseTitle);
      
      if (!course) {
        console.warn(`⚠️  Course not found: ${item.courseTitle}`);
        continue;
      }

      const quiz = await Quiz.create({
        course: course._id,
        title: item.quiz.title,
        questions: item.quiz.questions
      });

      quizzes.push(quiz);
      console.log(`✅ Created quiz for: ${item.courseTitle}`);
    }

    console.log(`\n🎉 Successfully created ${quizzes.length} quizzes`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

main();
