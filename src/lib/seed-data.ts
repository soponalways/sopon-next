export const defaultHero = {
  name: "Sopon Islam",
  title: "Full Stack Developer",
  subtitle: "MERN Stack | Next.js | PostgreSQL",
  description: "Passionate about creating beautiful, functional web applications that solve real-world problems. Let's build something amazing together.",
  imageUrl: "/images/hero.png",
  resumeUrl: "https://drive.google.com/file/d/1SLb3Nnu5ED48lIZB3m3eMNPo5WZxe82k/view",
  facebookUrl: "https://www.facebook.com/soponalways",
  twitterUrl: "https://x.com/soponalways",
  linkedinUrl: "https://www.linkedin.com/in/sopon-islam1",
  githubUrl: "https://github.com/soponalways",
};

export const defaultAbout = {
  title: "About Me",
  description: `Hello! I'm Sopon Islam, a passionate web developer with a love for turning ideas into interactive, user-friendly experiences. My programming journey started purely out of curiosity and a desire to learn. What began as a learning exercise quickly became a meaningful path, shaping the way I think and create.

Along the way, I've built projects that not only challenge my skills but also fuel my excitement for technology. I genuinely enjoy my work — from writing clean, efficient code to solving tricky problems that bring digital ideas to life.

Whether it's a personal project or a collaborative effort, I find joy in every step of the process. Outside of coding, I'm always exploring new technologies, reading books that broaden my perspective, and enjoying the thrill of a good cricket match.

In short, I'm not just a developer — I'm a lifelong learner, a creative problem-solver, and someone who believes that every project is an opportunity to grow and inspire.`,
};

export const defaultSkills = [
  { title: "TypeScript", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", level: "Advanced", category: "Development", order: 1 },
  { title: "JavaScript", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", level: "Advanced", category: "Development", order: 2 },
  { title: "Next.js", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", level: "Advanced", category: "Development", order: 3 },
  { title: "React.js", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", level: "Advanced", category: "Development", order: 4 },
  { title: "Node.js", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", level: "Intermediate", category: "Backend", order: 5 },
  { title: "Express.js", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg", level: "Intermediate", category: "Backend", order: 6 },
  { title: "PostgreSQL", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", level: "Advanced", category: "Database", order: 7 },
  { title: "Prisma ORM", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg", level: "Advanced", category: "Database", order: 8 },
  { title: "MongoDB", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", level: "Intermediate", category: "Database", order: 9 },
  { title: "Redux Toolkit", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg", level: "Advanced", category: "State Management", order: 10 },
  { title: "Docker", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", level: "Intermediate", category: "DevOps", order: 11 },
  { title: "Go Lang", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg", level: "Intermediate", category: "Backend", order: 12 },
  { title: "Tailwind CSS", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg", level: "Advanced", category: "Styling", order: 13 },
  { title: "Firebase", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg", level: "Advanced", category: "Backend as a Service", order: 14 },
  { title: "HTML5", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", level: "Advanced", category: "Markup", order: 15 },
  { title: "CSS3", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", level: "Advanced", category: "Styling", order: 16 },
];

export const defaultProjects = [
  {
    name: "Forum Hive",
    imageUrl: "https://i.ibb.co.com/7JYPqFCD/Forum-Hiveimage1.png",
    techStack: ["React", "Node.js", "Express", "MongoDB", "JWT", "Firebase", "TailwindCSS", "Stripe API"],
    description: "ForumHive is a feature-rich full-stack discussion platform built with the MERN stack, designed to encourage community engagement and learning. Users can register, share posts, interact via comments and votes, report activities, and explore posts using powerful filtering and searching features.",
    liveLink: "https://forumhive.web.app",
    githubLink: "https://github.com/soponalways/forum-hive-client",
    featured: true,
    order: 1,
    challenges: "Implementing Dynamic Search system with Pagination without hurting performance. And implementing role-based access control on dashboard.",
    improvements: "Add more advanced features like real-time notifications, user profiles, and a more robust admin panel.",
  },
  {
    name: "Shikho Now",
    imageUrl: "https://i.ibb.co.com/1Y4n4qry/image.png",
    techStack: ["React", "Node.js", "Express", "MongoDB", "Firebase", "TailwindCSS", "Stripe"],
    description: "A modern course management web application that allows students to explore, enroll in, and track their learning journey in a smooth and interactive way. Built with React and Tailwind CSS for a responsive user experience.",
    liveLink: "https://shikho-now.web.app/",
    githubLink: "https://github.com/soponalways/shikho-now-client",
    featured: true,
    order: 2,
    challenges: "Integrating Stripe checkout and managing cart state. Ensuring responsive design and dynamic content loading.",
    improvements: "Implement course recommendations, user progress tracking, and admin dashboard.",
  },
  {
    name: "Hobby Hub",
    imageUrl: "https://i.ibb.co.com/ynmB6C86/image.png",
    techStack: ["React", "Node.js", "Express", "MongoDB", "Firebase", "TailwindCSS"],
    description: "A platform for users to share and discover hobbies, with real-time chat and collaboration features. Join groups to share discussions and connect with like-minded enthusiasts.",
    liveLink: "https://hobby-hub-sopon.web.app/",
    githubLink: "https://github.com/soponalways/Hobby-Hub-Client",
    featured: false,
    order: 3,
    challenges: "Implementing Carousel on Banner and Theme Toggling System.",
    improvements: "Add user profiles, hobby categories, recommendation system, and admin dashboard.",
  },
];
