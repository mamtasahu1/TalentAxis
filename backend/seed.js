const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const dns = require('dns');
const path = require('path');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');
const Contact = require('./models/Contact');

dotenv.config({ path: path.join(__dirname, '.env') });
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for TalentAxis database seeding...');

    // Clear existing collections
    await Contact.deleteMany({});
    await Application.deleteMany({});
    await Job.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing database records.');

    // Password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // 1. Create Admin User
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@talentaxis.com',
      password: hashedPassword,
      role: 'admin',
      skills: ['Talent Acquisition', 'Engineering Leadership', 'Recruitment Operations'],
      education: 'Master of Science in Information Systems',
    });

    // 2. Create Student User
    const studentUser = await User.create({
      name: 'Alex Rivera',
      email: 'student@talentaxis.com',
      password: hashedPassword,
      role: 'student',
      skills: ['React.js', 'JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'CSS3', 'Git'],
      education: 'Bachelor of Science in Computer Science, Year 3 - GPA 3.8/4.0',
    });

    console.log('Created TalentAxis Admin and Student accounts.');

    // 3. Create Realistic Sample Job Postings
    const sampleJobs = [
      {
        title: 'Frontend Developer Intern',
        company: 'Nova Digital Labs',
        description: 'Collaborate with the web engineering team to build accessible, modular user interfaces in React. You will turn UI specifications into clean components, integrate REST APIs, and optimize client-side performance.',
        responsibilities: 'Build reusable React components; collaborate with backend engineers on REST integrations; write unit tests and maintain clean CSS styling.',
        qualifications: 'Foundational knowledge of React, JavaScript (ES6+), and CSS; understanding of RESTful API principles; strong problem-solving skills.',
        location: 'Remote',
        jobType: 'Internship',
        skills: ['React', 'JavaScript', 'CSS3', 'HTML5', 'Git'],
        duration: '6 Months',
        salary: 'NPR 30,000 - 40,000 / mo',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdBy: adminUser._id,
      },
      {
        title: 'Backend Developer Intern',
        company: 'CloudScale Systems',
        description: 'Design and implement robust server-side services and APIs using Node.js, Express, and MongoDB. You will work on data modeling, authentication workflows, and system optimization under senior mentor guidance.',
        responsibilities: 'Develop REST endpoints using Express; construct efficient Mongoose queries; implement authentication and authorization middleware.',
        qualifications: 'Coursework or practical experience in Node.js, asynchronous JavaScript, and relational or NoSQL database concepts.',
        location: 'Remote',
        jobType: 'Internship',
        skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'JWT'],
        duration: '3 Months',
        salary: 'NPR 35,000 - 45,000 / mo',
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        createdBy: adminUser._id,
      },
      {
        title: 'AI/ML Intern',
        company: 'Apex Cognitive Labs',
        description: 'Assist our data science squad in building feature extraction pipelines, evaluating machine learning models, and preparing training datasets for production deployment.',
        responsibilities: 'Preprocess structured and unstructured datasets; run statistical analyses; assist with model evaluation and benchmark reporting.',
        qualifications: 'Proficiency in Python; familiar with NumPy, pandas, and core statistical modeling concepts; strong analytical mindset.',
        location: 'Boston, MA / Hybrid',
        jobType: 'Internship',
        skills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL'],
        duration: '4 Months',
        salary: 'NPR 40,000 - 55,000 / mo',
        deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        createdBy: adminUser._id,
      },
      {
        title: 'UI/UX Design Intern',
        company: 'PixelCraft Studio',
        description: 'Partner with product managers and engineers to conduct user research, build design systems, and craft intuitive wireframes and prototypes for modern web applications.',
        responsibilities: 'Produce responsive mockups; maintain design system components; conduct user testing sessions and synthesize feedback.',
        qualifications: 'Demonstrated portfolio of UI/UX coursework or personal projects; strong eye for typography, whitespace, and color hierarchy.',
        location: 'New York, NY',
        jobType: 'Internship',
        skills: ['UI/UX Design', 'Wireframing', 'Prototyping', 'User Research', 'CSS3'],
        duration: '3 Months',
        salary: 'NPR 28,000 - 38,000 / mo',
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        createdBy: adminUser._id,
      },
      {
        title: 'Software Developer',
        company: 'Vanguard Solutions',
        description: 'Full-time junior role for graduating students. Build and maintain enterprise web services, participate in code reviews, and contribute to production releases across the full stack.',
        responsibilities: 'Design and deliver production features; participate in agile sprints; maintain automated tests and technical documentation.',
        qualifications: 'Degree in Computer Science or related discipline; practical familiarity with modern web frameworks and database design.',
        location: 'San Francisco, CA',
        jobType: 'Full-time',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'System Design'],
        duration: 'Permanent Full-time',
        salary: 'NPR 90,000 - 130,000 / mo',
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        createdBy: adminUser._id,
      },
      {
        title: 'Data Analyst Intern',
        company: 'InsightStream Analytics',
        description: 'Support business analytics through report generation, dashboard metrics maintenance, and database query optimization. Ideal for students with strong quantitative foundations.',
        responsibilities: 'Write database queries for reporting; build structured summaries; validate data consistency across collections.',
        qualifications: 'Knowledge of database query languages and spreadsheet modeling; detail-oriented approach to data integrity.',
        location: 'Chicago, IL / Remote',
        jobType: 'Internship',
        skills: ['SQL', 'Data Modeling', 'Data Visualization', 'Python'],
        duration: '4 Months',
        salary: 'NPR 25,000 - 35,000 / mo',
        deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        createdBy: adminUser._id,
      },
    ];

    const createdJobs = await Job.insertMany(sampleJobs);
    console.log(`Seeded ${createdJobs.length} realistic job opportunities.`);

    // 4. Create Sample Application
    await Application.create({
      studentId: studentUser._id,
      jobId: createdJobs[0]._id,
      cvPath: 'sample-cv.pdf',
      coverLetter: 'I am passionate about frontend engineering and modern web development. My academic background and hands-on React coursework make me an enthusiastic candidate for Nova Digital Labs.',
      status: 'Under Review',
    });
    console.log('Created sample student application.');

    // 5. Create Sample Contact Inquiry
    await Contact.create({
      name: 'Morgan Blake',
      email: 'morgan.blake@university.edu',
      subject: 'Inquiry regarding university recruitment collaboration',
      message: 'Hello TalentAxis team, our campus career network would like to coordinate an employer showcase for graduating seniors.',
    });
    console.log('Created sample contact message.');

    console.log('\n======================================================');
    console.log('TALENTAXIS DATABASE SEEDED SUCCESSFULLY');
    console.log('Admin Account   -> Email: admin@talentaxis.com   | Password: password123');
    console.log('Student Account -> Email: student@talentaxis.com | Password: password123');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding TalentAxis database:', error);
    process.exit(1);
  }
};

seedData();
