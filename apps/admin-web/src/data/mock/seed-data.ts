import { Tuition } from "@/domain/models/tuition.model";
import { Teacher } from "@/domain/models/teacher.model";
import { Student } from "@/domain/models/student.model";
import { Course } from "@/domain/models/course.model";
import { LibraryFile } from "@/domain/models/library-file.model";
import { VideoLecture } from "@/domain/models/video-lecture.model";
import { Announcement } from "@/domain/models/announcement.model";
import { ActivityLog } from "@/domain/models/dashboard-stats.model";
import { Quiz } from "@/domain/models/quiz.model";
import { QuizAttempt } from "@/domain/models/quiz-attempt.model";

// In-memory seed data shared by every mock repository. This stands in for
// PostgreSQL rows until the NestJS backend + Prisma are connected.
// Arrays are mutated directly by mock repositories to simulate persistence
// for the lifetime of the browser session (resets on reload).

export const tuitions: Tuition[] = [
  {
    id: "tui-1",
    tuitionName: "Apex Learning Lab",
    tuitionCode: "ALL",
    ownerName: "Rajesh Sharma",
    address: "MG Road, Sector 14, Gurugram, Haryana",
    contactNumber: "+91 98100 11223",
    email: "contact@apexlearninglab.in",
    status: "active",
    createdDate: "2024-04-01T00:00:00.000Z",
    teacherCount: 4,
    studentCount: 12,
    activeCourseCount: 2,
    totalRevenue: 0,
  },
  {
    id: "tui-2",
    tuitionName: "Physics Hub Academy",
    tuitionCode: "PHY",
    ownerName: "Sunita Verma",
    address: "Station Road, Kota, Rajasthan",
    contactNumber: "+91 98290 44556",
    email: "info@physicshubacademy.in",
    status: "active",
    createdDate: "2024-06-15T00:00:00.000Z",
    teacherCount: 2,
    studentCount: 6,
    activeCourseCount: 2,
    totalRevenue: 0,
  },
  {
    id: "tui-3",
    tuitionName: "Bright Minds Institute",
    tuitionCode: "BMI",
    ownerName: "Anil Kapoor",
    address: "Civil Lines, Prayagraj, Uttar Pradesh",
    contactNumber: "+91 97600 77889",
    email: "admin@brightmindsinstitute.in",
    status: "suspended",
    createdDate: "2024-08-20T00:00:00.000Z",
    teacherCount: 2,
    studentCount: 4,
    activeCourseCount: 2,
    totalRevenue: 0,
  },
];

export const teachers: Teacher[] = [
  { id: "tch-1", teacherId: "ALL2601001", name: "Vikram Mehta", tuitionId: "tui-1", tuitionName: "Apex Learning Lab", subject: "Maths", phone: "+91 90123 45671", email: "vikram.mehta@apexlearninglab.in", joiningDate: "2026-01-10T00:00:00.000Z", status: "active", studentLimit: 40, assignedStudentCount: 5 },
  { id: "tch-2", teacherId: "ALL2602001", name: "Neha Kapoor", tuitionId: "tui-1", tuitionName: "Apex Learning Lab", subject: "Chemistry", phone: "+91 90123 45672", email: "neha.kapoor@apexlearninglab.in", joiningDate: "2026-01-12T00:00:00.000Z", status: "active", studentLimit: 40, assignedStudentCount: 4 },
  { id: "tch-3", teacherId: "ALL2603001", name: "Rohit Saxena", tuitionId: "tui-1", tuitionName: "Apex Learning Lab", subject: "Physics", phone: "+91 90123 45673", email: "rohit.saxena@apexlearninglab.in", joiningDate: "2026-02-01T00:00:00.000Z", status: "active", studentLimit: 35, assignedStudentCount: 3 },
  { id: "tch-4", teacherId: "ALL2604001", name: "Priya Nair", tuitionId: "tui-1", tuitionName: "Apex Learning Lab", subject: "Biology", phone: "+91 90123 45674", email: "priya.nair@apexlearninglab.in", joiningDate: "2026-02-10T00:00:00.000Z", status: "suspended", studentLimit: 30, assignedStudentCount: 0 },
  { id: "tch-5", teacherId: "PHY2603001", name: "Arjun Rathore", tuitionId: "tui-2", tuitionName: "Physics Hub Academy", subject: "Physics", phone: "+91 90123 45675", email: "arjun.rathore@physicshubacademy.in", joiningDate: "2026-03-05T00:00:00.000Z", status: "active", studentLimit: 25, assignedStudentCount: 3 },
  { id: "tch-6", teacherId: "PHY2601001", name: "Kavita Joshi", tuitionId: "tui-2", tuitionName: "Physics Hub Academy", subject: "Maths", phone: "+91 90123 45676", email: "kavita.joshi@physicshubacademy.in", joiningDate: "2026-03-08T00:00:00.000Z", status: "active", studentLimit: 25, assignedStudentCount: 3 },
  { id: "tch-7", teacherId: "BMI2601001", name: "Manoj Tiwari", tuitionId: "tui-3", tuitionName: "Bright Minds Institute", subject: "Maths", phone: "+91 90123 45677", email: "manoj.tiwari@brightmindsinstitute.in", joiningDate: "2026-04-01T00:00:00.000Z", status: "active", studentLimit: 20, assignedStudentCount: 2 },
  { id: "tch-8", teacherId: "BMI2602001", name: "Sneha Gupta", tuitionId: "tui-3", tuitionName: "Bright Minds Institute", subject: "Chemistry", phone: "+91 90123 45678", email: "sneha.gupta@brightmindsinstitute.in", joiningDate: "2026-04-05T00:00:00.000Z", status: "active", studentLimit: 20, assignedStudentCount: 2 },
];

export const students: Student[] = [
  { id: "stu-1", studentId: "ALL26010001", name: "Aarav Singh", parentName: "Suresh Singh", parentPhone: "+91 98765 10001", studentPhone: "+91 98765 20001", email: "aarav.singh@example.com", tuitionId: "tui-1", tuitionName: "Apex Learning Lab", course: "JEE", assignedTeacherId: "tch-1", assignedTeacherName: "Vikram Mehta", status: "active", joiningDate: "2026-01-15T00:00:00.000Z", progressPercent: 72 },
  { id: "stu-2", studentId: "ALL26010002", name: "Diya Patel", parentName: "Mahesh Patel", parentPhone: "+91 98765 10002", studentPhone: "+91 98765 20002", email: "diya.patel@example.com", tuitionId: "tui-1", tuitionName: "Apex Learning Lab", course: "JEE", assignedTeacherId: "tch-1", assignedTeacherName: "Vikram Mehta", status: "active", joiningDate: "2026-01-16T00:00:00.000Z", progressPercent: 65 },
  { id: "stu-3", studentId: "ALL26010003", name: "Kabir Malhotra", parentName: "Ravi Malhotra", parentPhone: "+91 98765 10003", studentPhone: "+91 98765 20003", email: "kabir.malhotra@example.com", tuitionId: "tui-1", tuitionName: "Apex Learning Lab", course: "JEE", assignedTeacherId: "tch-2", assignedTeacherName: "Neha Kapoor", status: "active", joiningDate: "2026-01-18T00:00:00.000Z", progressPercent: 88 },
  { id: "stu-4", studentId: "ALL26020001", name: "Ishita Rao", parentName: "Ganesh Rao", parentPhone: "+91 98765 10004", studentPhone: "+91 98765 20004", email: "ishita.rao@example.com", tuitionId: "tui-1", tuitionName: "Apex Learning Lab", course: "NEET", assignedTeacherId: "tch-3", assignedTeacherName: "Rohit Saxena", status: "active", joiningDate: "2026-01-20T00:00:00.000Z", progressPercent: 54 },
  { id: "stu-5", studentId: "ALL26020002", name: "Reyansh Iyer", parentName: "Karthik Iyer", parentPhone: "+91 98765 10005", studentPhone: "+91 98765 20005", email: "reyansh.iyer@example.com", tuitionId: "tui-1", tuitionName: "Apex Learning Lab", course: "NEET", assignedTeacherId: "tch-2", assignedTeacherName: "Neha Kapoor", status: "active", joiningDate: "2026-01-22T00:00:00.000Z", progressPercent: 41 },
  { id: "stu-6", studentId: "ALL26020003", name: "Ananya Desai", parentName: "Vipul Desai", parentPhone: "+91 98765 10006", studentPhone: "+91 98765 20006", email: "ananya.desai@example.com", tuitionId: "tui-1", tuitionName: "Apex Learning Lab", course: "NEET", assignedTeacherId: "tch-1", assignedTeacherName: "Vikram Mehta", status: "suspended", joiningDate: "2026-01-25T00:00:00.000Z", progressPercent: 30 },
  { id: "stu-7", studentId: "PHY26030001", name: "Vivaan Kulkarni", parentName: "Nitin Kulkarni", parentPhone: "+91 98765 10007", studentPhone: "+91 98765 20007", email: "vivaan.kulkarni@example.com", tuitionId: "tui-2", tuitionName: "Physics Hub Academy", course: "JEE", assignedTeacherId: "tch-5", assignedTeacherName: "Arjun Rathore", status: "active", joiningDate: "2026-03-10T00:00:00.000Z", progressPercent: 76 },
  { id: "stu-8", studentId: "PHY26030002", name: "Myra Bhatt", parentName: "Sanjay Bhatt", parentPhone: "+91 98765 10008", studentPhone: "+91 98765 20008", email: "myra.bhatt@example.com", tuitionId: "tui-2", tuitionName: "Physics Hub Academy", course: "JEE", assignedTeacherId: "tch-6", assignedTeacherName: "Kavita Joshi", status: "active", joiningDate: "2026-03-12T00:00:00.000Z", progressPercent: 59 },
  { id: "stu-9", studentId: "PHY26020001", name: "Aditya Chauhan", parentName: "Deepak Chauhan", parentPhone: "+91 98765 10009", studentPhone: "+91 98765 20009", email: "aditya.chauhan@example.com", tuitionId: "tui-2", tuitionName: "Physics Hub Academy", course: "NEET", assignedTeacherId: "tch-5", assignedTeacherName: "Arjun Rathore", status: "active", joiningDate: "2026-03-14T00:00:00.000Z", progressPercent: 47 },
  { id: "stu-10", studentId: "BMI26010001", name: "Sara Khan", parentName: "Imran Khan", parentPhone: "+91 98765 10010", studentPhone: "+91 98765 20010", email: "sara.khan@example.com", tuitionId: "tui-3", tuitionName: "Bright Minds Institute", course: "JEE", assignedTeacherId: "tch-7", assignedTeacherName: "Manoj Tiwari", status: "active", joiningDate: "2026-04-08T00:00:00.000Z", progressPercent: 62 },
  { id: "stu-11", studentId: "BMI26020001", name: "Yash Agarwal", parentName: "Ramesh Agarwal", parentPhone: "+91 98765 10011", studentPhone: "+91 98765 20011", email: "yash.agarwal@example.com", tuitionId: "tui-3", tuitionName: "Bright Minds Institute", course: "NEET", assignedTeacherId: "tch-8", assignedTeacherName: "Sneha Gupta", status: "active", joiningDate: "2026-04-10T00:00:00.000Z", progressPercent: 38 },
];

export const courses: Course[] = [
  { id: "crs-1", tuitionId: "tui-1", name: "JEE Main + Advanced", code: "JEE", teachersAssignedCount: 3, studentCount: 3, activeQuizCount: 4, lectureCount: 6 },
  { id: "crs-2", tuitionId: "tui-1", name: "NEET UG", code: "NEET", teachersAssignedCount: 3, studentCount: 3, activeQuizCount: 3, lectureCount: 5 },
  { id: "crs-3", tuitionId: "tui-2", name: "JEE Main + Advanced", code: "JEE", teachersAssignedCount: 2, studentCount: 2, activeQuizCount: 2, lectureCount: 3 },
  { id: "crs-4", tuitionId: "tui-2", name: "NEET UG", code: "NEET", teachersAssignedCount: 1, studentCount: 1, activeQuizCount: 1, lectureCount: 2 },
  { id: "crs-5", tuitionId: "tui-3", name: "JEE Main + Advanced", code: "JEE", teachersAssignedCount: 1, studentCount: 1, activeQuizCount: 1, lectureCount: 2 },
  { id: "crs-6", tuitionId: "tui-3", name: "NEET UG", code: "NEET", teachersAssignedCount: 1, studentCount: 1, activeQuizCount: 1, lectureCount: 1 },
];

export const libraryFiles: LibraryFile[] = [
  { id: "lib-1", title: "Organic Chemistry Reactions Cheat Sheet", description: "Quick-reference formula sheet for Grignard, aldol, and named reactions.", subject: "Chemistry", course: "JEE", tuitionId: "tui-1", fileType: "formula_sheet", fileSizeKb: 820, tags: ["organic", "reactions"], version: 2, uploadedByName: "Neha Kapoor", uploadedByRole: "teacher", uploadedById: "tch-2", uploadDate: "2026-05-02T10:00:00.000Z", fileUrl: "#" },
  { id: "lib-2", title: "Mechanics Practice Sheet - Set 3", description: "50 numericals on rotational dynamics with answer key.", subject: "Physics", course: "JEE", tuitionId: "tui-1", fileType: "practice_sheet", fileSizeKb: 1340, tags: ["mechanics", "rotation"], version: 1, uploadedByName: "Rohit Saxena", uploadedByRole: "teacher", uploadedById: "tch-3", uploadDate: "2026-05-10T10:00:00.000Z", fileUrl: "#" },
  { id: "lib-3", title: "JEE Advanced 2023 Paper", description: "Previous year paper with detailed solutions.", subject: "Maths", course: "JEE", tuitionId: "tui-1", fileType: "previous_year_paper", fileSizeKb: 2100, tags: ["pyq", "jee-advanced"], version: 1, uploadedByName: "Vikram Mehta", uploadedByRole: "teacher", uploadedById: "tch-1", uploadDate: "2026-05-14T10:00:00.000Z", fileUrl: "#" },
  { id: "lib-4", title: "Human Physiology Notes - Unit 4", description: "Comprehensive notes covering the circulatory and respiratory systems.", subject: "Biology", course: "NEET", tuitionId: "tui-1", fileType: "notes", fileSizeKb: 990, tags: ["physiology"], version: 3, uploadedByName: "Admin", uploadedByRole: "admin", uploadedById: "admin-1", uploadDate: "2026-05-18T10:00:00.000Z", fileUrl: "#" },
  { id: "lib-5", title: "NCERT Chemistry Part 1 (Reference)", description: "Digitized reference copy for quick lookup.", subject: "Chemistry", course: "NEET", tuitionId: "tui-1", fileType: "book", fileSizeKb: 5400, tags: ["ncert", "reference"], version: 1, uploadedByName: "Admin", uploadedByRole: "admin", uploadedById: "admin-1", uploadDate: "2026-05-20T10:00:00.000Z", fileUrl: "#" },
  { id: "lib-6", title: "Weekly Assignment - Thermodynamics", description: "Assignment due before the next class, covers laws of thermodynamics.", subject: "Physics", course: "JEE", tuitionId: "tui-2", fileType: "assignment", fileSizeKb: 410, tags: ["thermodynamics"], version: 1, uploadedByName: "Arjun Rathore", uploadedByRole: "teacher", uploadedById: "tch-5", uploadDate: "2026-06-01T10:00:00.000Z", fileUrl: "#" },
  { id: "lib-7", title: "Algebra Formula Sheet", description: "All key algebra identities and formulas in one page.", subject: "Maths", course: "JEE", tuitionId: "tui-2", fileType: "formula_sheet", fileSizeKb: 260, tags: ["algebra"], version: 1, uploadedByName: "Kavita Joshi", uploadedByRole: "teacher", uploadedById: "tch-6", uploadDate: "2026-06-05T10:00:00.000Z", fileUrl: "#" },
  { id: "lib-8", title: "NEET Biology PYQ Bank 2020-2025", description: "Compiled previous year questions, chapter-wise.", subject: "Biology", course: "NEET", tuitionId: "tui-2", fileType: "previous_year_paper", fileSizeKb: 3200, tags: ["pyq", "biology"], version: 1, uploadedByName: "Admin", uploadedByRole: "admin", uploadedById: "admin-1", uploadDate: "2026-06-08T10:00:00.000Z", fileUrl: "#" },
  { id: "lib-9", title: "Coordinate Geometry Notes", description: "Straight lines, circles, and conic sections summary.", subject: "Maths", course: "JEE", tuitionId: "tui-3", fileType: "notes", fileSizeKb: 780, tags: ["geometry"], version: 1, uploadedByName: "Manoj Tiwari", uploadedByRole: "teacher", uploadedById: "tch-7", uploadDate: "2026-06-12T10:00:00.000Z", fileUrl: "#" },
  { id: "lib-10", title: "Inorganic Chemistry Handbook", description: "Periodic trends, salt analysis, and metallurgy reference.", subject: "Chemistry", course: "NEET", tuitionId: "tui-3", fileType: "book", fileSizeKb: 4100, tags: ["inorganic"], version: 2, uploadedByName: "Sneha Gupta", uploadedByRole: "teacher", uploadedById: "tch-8", uploadDate: "2026-06-15T10:00:00.000Z", fileUrl: "#" },
];

export const videoLectures: VideoLecture[] = [
  { id: "lec-1", title: "Rotational Motion - Introduction", description: "Building intuition for torque and angular momentum.", subject: "Physics", course: "JEE", tuitionId: "tui-1", youtubeUnlistedUrl: "https://www.youtube.com/watch?v=5qap5aO4i9A", durationMinutes: 48, uploadedByName: "Rohit Saxena", uploadedByRole: "teacher", uploadDate: "2026-05-03T09:00:00.000Z" },
  { id: "lec-2", title: "Aldol Condensation Deep Dive", description: "Mechanism walkthrough with solved examples.", subject: "Chemistry", course: "JEE", tuitionId: "tui-1", youtubeUnlistedUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw", durationMinutes: 55, uploadedByName: "Neha Kapoor", uploadedByRole: "teacher", uploadDate: "2026-05-06T09:00:00.000Z" },
  { id: "lec-3", title: "Permutations & Combinations Crash Course", description: "Covers all standard question patterns for JEE Main.", subject: "Maths", course: "JEE", tuitionId: "tui-1", youtubeUnlistedUrl: "https://www.youtube.com/watch?v=2Vv-BfVoq4g", durationMinutes: 62, uploadedByName: "Vikram Mehta", uploadedByRole: "teacher", uploadDate: "2026-05-09T09:00:00.000Z" },
  { id: "lec-4", title: "Human Circulatory System", description: "Diagram-heavy walkthrough for NEET biology.", subject: "Biology", course: "NEET", tuitionId: "tui-1", youtubeUnlistedUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U", durationMinutes: 40, uploadedByName: "Admin", uploadedByRole: "admin", uploadDate: "2026-05-12T09:00:00.000Z" },
  { id: "lec-5", title: "Thermodynamics - Laws & Applications", description: "First and second law with numericals.", subject: "Physics", course: "JEE", tuitionId: "tui-2", youtubeUnlistedUrl: "https://www.youtube.com/watch?v=M7lc1UVf-VE", durationMinutes: 51, uploadedByName: "Arjun Rathore", uploadedByRole: "teacher", uploadDate: "2026-06-02T09:00:00.000Z" },
  { id: "lec-6", title: "Quadratic Equations Masterclass", description: "Nature of roots, sum/product tricks, and JEE-level problems.", subject: "Maths", course: "JEE", tuitionId: "tui-2", youtubeUnlistedUrl: "https://www.youtube.com/watch?v=eY52Zsg-KVI", durationMinutes: 58, uploadedByName: "Kavita Joshi", uploadedByRole: "teacher", uploadDate: "2026-06-06T09:00:00.000Z" },
  { id: "lec-7", title: "Straight Lines & Circles", description: "Coordinate geometry fundamentals for JEE Main.", subject: "Maths", course: "JEE", tuitionId: "tui-3", youtubeUnlistedUrl: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ", durationMinutes: 45, uploadedByName: "Manoj Tiwari", uploadedByRole: "teacher", uploadDate: "2026-06-13T09:00:00.000Z" },
  { id: "lec-8", title: "Periodic Table Trends", description: "Ionization energy, electronegativity, and atomic radius trends.", subject: "Chemistry", course: "NEET", tuitionId: "tui-3", youtubeUnlistedUrl: "https://www.youtube.com/watch?v=nfWlot6h_JM", durationMinutes: 37, uploadedByName: "Sneha Gupta", uploadedByRole: "teacher", uploadDate: "2026-06-16T09:00:00.000Z" },
];

export const announcements: Announcement[] = [
  { id: "ann-1", title: "Platform Maintenance - July 28", message: "The platform will be briefly unavailable on July 28 between 1-2 AM IST for scheduled maintenance.", tuitionId: null, audience: "all", createdByName: "Admin", createdByRole: "admin", isBroadcast: true, createdAt: "2026-07-20T08:00:00.000Z" },
  { id: "ann-2", title: "New Batch Registrations Open", message: "Registrations for the September JEE batch are now open. Share with prospective students.", tuitionId: null, audience: "all", createdByName: "Admin", createdByRole: "admin", isBroadcast: true, createdAt: "2026-07-15T08:00:00.000Z" },
  { id: "ann-3", title: "Mock Test This Saturday", message: "A full-syllabus mock test will be held this Saturday at 10 AM. Attendance is mandatory.", tuitionId: "tui-1", audience: "students", createdByName: "Vikram Mehta", createdByRole: "teacher", isBroadcast: false, createdAt: "2026-07-18T08:00:00.000Z" },
  { id: "ann-4", title: "Parent-Teacher Meeting", message: "PTM scheduled for July 30 at the Apex Learning Lab campus.", tuitionId: "tui-1", audience: "all", createdByName: "Admin", createdByRole: "admin", isBroadcast: false, createdAt: "2026-07-22T08:00:00.000Z" },
  { id: "ann-5", title: "Revised Timetable", message: "Physics classes now start 30 minutes earlier from next week.", tuitionId: "tui-2", audience: "students", createdByName: "Arjun Rathore", createdByRole: "teacher", isBroadcast: false, createdAt: "2026-07-19T08:00:00.000Z" },
  { id: "ann-6", title: "Fee Reminder", message: "Please clear pending fees before August 1 to avoid late charges.", tuitionId: "tui-3", audience: "all", createdByName: "Admin", createdByRole: "admin", isBroadcast: false, createdAt: "2026-07-21T08:00:00.000Z" },
];

export const activityLogs: ActivityLog[] = [
  { id: "act-1", message: "New student Aarav Singh registered", actorName: "Vikram Mehta", actorRole: "teacher", tuitionId: "tui-1", timestamp: "2026-07-25T14:30:00.000Z" },
  { id: "act-2", message: "Uploaded library file: Organic Chemistry Reactions Cheat Sheet", actorName: "Neha Kapoor", actorRole: "teacher", tuitionId: "tui-1", timestamp: "2026-07-25T11:10:00.000Z" },
  { id: "act-3", message: "Published quiz: Rotational Motion Test", actorName: "Rohit Saxena", actorRole: "teacher", tuitionId: "tui-1", timestamp: "2026-07-24T16:45:00.000Z" },
  { id: "act-4", message: "Suspended tuition: Bright Minds Institute", actorName: "Admin", actorRole: "admin", tuitionId: "tui-3", timestamp: "2026-07-24T09:00:00.000Z" },
  { id: "act-5", message: "Reset password for teacher Kavita Joshi", actorName: "Admin", actorRole: "admin", tuitionId: "tui-2", timestamp: "2026-07-23T13:20:00.000Z" },
  { id: "act-6", message: "Broadcast announcement: New Batch Registrations Open", actorName: "Admin", actorRole: "admin", tuitionId: null, timestamp: "2026-07-15T08:05:00.000Z" },
  { id: "act-7", message: "Uploaded video lecture: Thermodynamics - Laws & Applications", actorName: "Arjun Rathore", actorRole: "teacher", tuitionId: "tui-2", timestamp: "2026-07-22T10:15:00.000Z" },
  { id: "act-8", message: "Added new teacher: Sneha Gupta", actorName: "Admin", actorRole: "admin", tuitionId: "tui-3", timestamp: "2026-07-21T12:00:00.000Z" },
  { id: "act-9", message: "Reset quiz attempt for student Diya Patel", actorName: "Neha Kapoor", actorRole: "teacher", tuitionId: "tui-1", timestamp: "2026-07-20T15:40:00.000Z" },
  { id: "act-10", message: "Reassigned student Ishita Rao to Rohit Saxena", actorName: "Admin", actorRole: "admin", tuitionId: "tui-1", timestamp: "2026-07-19T17:25:00.000Z" },
];

export const quizzes: Quiz[] = [
  {
    id: "qz-1",
    title: "Rotational Motion Test",
    tuitionId: "tui-1",
    course: "JEE",
    subject: "Physics",
    teacherId: "tch-3",
    teacherName: "Rohit Saxena",
    durationMinutes: 30,
    negativeMarksPerWrong: 1,
    status: "published",
    scheduledAt: null,
    createdAt: "2026-07-10T09:00:00.000Z",
    questions: [
      { id: "qz-1-q1", text: "The SI unit of torque is:", type: "mcq", options: ["Newton", "Newton-metre", "Joule", "Watt"], correctOptionIndexes: [1], marks: 4 },
      { id: "qz-1-q2", text: "Which of the following affect the moment of inertia of a body? (select all that apply)", type: "multiple_correct", options: ["Mass distribution", "Axis of rotation", "Angular velocity", "Shape of the body"], correctOptionIndexes: [0, 1, 3], marks: 4 },
      { id: "qz-1-q3", text: "Angular momentum is conserved only when net external torque is zero.", type: "true_false", options: ["True", "False"], correctOptionIndexes: [0], marks: 2 },
    ],
  },
  {
    id: "qz-2",
    title: "Organic Reactions Quiz",
    tuitionId: "tui-1",
    course: "JEE",
    subject: "Chemistry",
    teacherId: "tch-2",
    teacherName: "Neha Kapoor",
    durationMinutes: 25,
    negativeMarksPerWrong: 1,
    status: "published",
    scheduledAt: null,
    createdAt: "2026-07-08T09:00:00.000Z",
    questions: [
      { id: "qz-2-q1", text: "Aldol condensation requires:", type: "mcq", options: ["An acid catalyst only", "A base catalyst", "No catalyst", "UV light"], correctOptionIndexes: [1], marks: 4 },
      { id: "qz-2-q2", text: "Which reagents can convert an alcohol to an alkyl halide? (select all that apply)", type: "multiple_correct", options: ["SOCl2", "PCl5", "NaOH", "HCl + ZnCl2"], correctOptionIndexes: [0, 1, 3], marks: 4 },
      { id: "qz-2-q3", text: "Grignard reagents react vigorously with water.", type: "true_false", options: ["True", "False"], correctOptionIndexes: [0], marks: 2 },
    ],
  },
  {
    id: "qz-3",
    title: "Algebra Basics",
    tuitionId: "tui-1",
    course: "JEE",
    subject: "Maths",
    teacherId: "tch-1",
    teacherName: "Vikram Mehta",
    durationMinutes: 20,
    negativeMarksPerWrong: 0,
    status: "draft",
    scheduledAt: null,
    createdAt: "2026-07-22T09:00:00.000Z",
    questions: [
      { id: "qz-3-q1", text: "If a quadratic has equal roots, its discriminant is:", type: "mcq", options: ["Positive", "Negative", "Zero", "Undefined"], correctOptionIndexes: [2], marks: 4 },
      { id: "qz-3-q2", text: "The sum of roots of ax^2+bx+c=0 is -b/a.", type: "true_false", options: ["True", "False"], correctOptionIndexes: [0], marks: 2 },
    ],
  },
  {
    id: "qz-4",
    title: "Thermodynamics Test",
    tuitionId: "tui-2",
    course: "JEE",
    subject: "Physics",
    teacherId: "tch-5",
    teacherName: "Arjun Rathore",
    durationMinutes: 30,
    negativeMarksPerWrong: 0,
    status: "published",
    scheduledAt: null,
    createdAt: "2026-07-05T09:00:00.000Z",
    questions: [
      { id: "qz-4-q1", text: "The first law of thermodynamics is a statement of:", type: "mcq", options: ["Conservation of momentum", "Conservation of energy", "Entropy increase", "Conservation of charge"], correctOptionIndexes: [1], marks: 4 },
      { id: "qz-4-q2", text: "In an isothermal process, which quantities remain constant? (select all that apply)", type: "multiple_correct", options: ["Temperature", "Internal energy of ideal gas", "Pressure", "Volume"], correctOptionIndexes: [0, 1], marks: 4 },
      { id: "qz-4-q3", text: "A reversible process is always quasi-static.", type: "true_false", options: ["True", "False"], correctOptionIndexes: [0], marks: 2 },
    ],
  },
  {
    id: "qz-5",
    title: "Straight Lines Practice",
    tuitionId: "tui-3",
    course: "JEE",
    subject: "Maths",
    teacherId: "tch-7",
    teacherName: "Manoj Tiwari",
    durationMinutes: 25,
    negativeMarksPerWrong: 0,
    status: "scheduled",
    scheduledAt: "2026-08-02T10:00:00.000Z",
    createdAt: "2026-07-20T09:00:00.000Z",
    questions: [
      { id: "qz-5-q1", text: "Two lines with slopes m1 and m2 are perpendicular when:", type: "mcq", options: ["m1 = m2", "m1 * m2 = -1", "m1 + m2 = 0", "m1 * m2 = 1"], correctOptionIndexes: [1], marks: 4 },
      { id: "qz-5-q2", text: "The distance formula between two points uses the Pythagorean theorem.", type: "true_false", options: ["True", "False"], correctOptionIndexes: [0], marks: 2 },
    ],
  },
  {
    id: "qz-6",
    title: "Quadratic Equations - Weekly Test",
    tuitionId: "tui-2",
    course: "JEE",
    subject: "Maths",
    teacherId: "tch-6",
    teacherName: "Kavita Joshi",
    durationMinutes: 20,
    negativeMarksPerWrong: 0,
    status: "closed",
    scheduledAt: null,
    createdAt: "2026-06-20T09:00:00.000Z",
    questions: [
      { id: "qz-6-q1", text: "The roots of x^2 - 5x + 6 = 0 are:", type: "mcq", options: ["1, 6", "2, 3", "-2, -3", "5, 6"], correctOptionIndexes: [1], marks: 4 },
      { id: "qz-6-q2", text: "A quadratic equation can have at most 2 real roots.", type: "true_false", options: ["True", "False"], correctOptionIndexes: [0], marks: 2 },
    ],
  },
];

export const quizAttempts: QuizAttempt[] = [
  {
    id: "att-1",
    quizId: "qz-1",
    quizTitle: "Rotational Motion Test",
    studentId: "stu-1",
    studentName: "Aarav Singh",
    status: "submitted",
    answers: { "qz-1-q1": [1], "qz-1-q2": [0, 1, 3], "qz-1-q3": [0] },
    score: 10,
    totalMarks: 10,
    startedAt: "2026-07-15T10:00:00.000Z",
    submittedAt: "2026-07-15T10:22:00.000Z",
    terminationReason: null,
  },
  {
    id: "att-2",
    quizId: "qz-2",
    quizTitle: "Organic Reactions Quiz",
    studentId: "stu-3",
    studentName: "Kabir Malhotra",
    status: "terminated",
    answers: { "qz-2-q1": [1] },
    score: null,
    totalMarks: 10,
    startedAt: "2026-07-16T11:00:00.000Z",
    submittedAt: null,
    terminationReason: "Student navigated away from the quiz (back action).",
  },
  {
    id: "att-3",
    quizId: "qz-4",
    quizTitle: "Thermodynamics Test",
    studentId: "stu-7",
    studentName: "Vivaan Kulkarni",
    status: "submitted",
    answers: { "qz-4-q1": [1], "qz-4-q2": [0], "qz-4-q3": [0] },
    score: 6,
    totalMarks: 10,
    startedAt: "2026-07-12T09:30:00.000Z",
    submittedAt: "2026-07-12T09:58:00.000Z",
    terminationReason: null,
  },
];

// Total students ever issued an ID per tuition+course, used so the
// student ID sequence never reuses a number even after deletions.
export const studentIdSequenceIssued: Record<string, number> = {
  "tui-1:JEE": 3,
  "tui-1:NEET": 3,
  "tui-2:JEE": 2,
  "tui-2:NEET": 1,
  "tui-3:JEE": 1,
  "tui-3:NEET": 1,
};

// Total teachers ever issued an ID per tuition+subject, same reasoning.
export const teacherIdSequenceIssued: Record<string, number> = {
  "tui-1:Maths": 1,
  "tui-1:Chemistry": 1,
  "tui-1:Physics": 1,
  "tui-1:Biology": 1,
  "tui-2:Physics": 1,
  "tui-2:Maths": 1,
  "tui-3:Maths": 1,
  "tui-3:Chemistry": 1,
};
