// Mock data for the Parent Portal

export const mockStudents = [
  { id: 1, name: "Emma Johnson", class: "Grade 5A", year: "2024", avatar: "👧", campus: "CM" },
  { id: 2, name: "Liam Johnson", class: "Grade 8B", year: "2024", avatar: "👦", campus: "CM" },
  { id: 3, name: "Sophia Johnson", class: "Grade 11C", year: "2024", avatar: "👩‍🎓", campus: "CM" },
];

export const mockInvoices = [
  // ── Emma Johnson (Grade 5A) ──────────────────────────────
  {
    id: "INV-2024-001",
    student_id: 1,
    type: "Yearly" as const,
    amount_due: 558000,
    due_date: "2025-12-15",
    status: "pending" as const,
    description: "Tuition Fee 2024-2025",
    term: "Academic Year 2024-2025",
    line_items: [
      { id: "item-1", description: "Tuition Fee - Grade 5A", amount: 450000, category: "Tuition" },
      { id: "item-2", description: "School Shirt (Size M)", amount: 1800, category: "Uniform" },
      { id: "item-3", description: "School Shorts (Size M)", amount: 1500, category: "Uniform" },
      { id: "item-4", description: "Snack & Lunch K1 Program", amount: 36000, category: "Meal Plan" },
      { id: "item-5", description: "Activity Fee", amount: 25200, category: "Activities" },
      { id: "item-6", description: "Technology Fee", amount: 18000, category: "Technology" },
      { id: "item-7", description: "Library & Resources", amount: 14400, category: "Resources" },
      { id: "item-8", description: "Insurance Coverage", amount: 7200, category: "Insurance" },
      { id: "item-9", description: "Student ID Card", amount: 1800, category: "Administrative" },
      { id: "item-10", description: "Yearbook", amount: 2100, category: "Publications" }
    ]
  },
  {
    id: "INV-2024-002",
    student_id: 1,
    type: "Termly" as const,
    amount_due: 189333,
    due_date: "2025-09-01",
    status: "overdue" as const,
    description: "Term 1 Fee 2024-2025",
    term: "Term 1 — Sep 2024",
    line_items: [
      { id: "item-1b", description: "Term 1 Tuition - Grade 5A", amount: 160000, category: "Tuition" },
      { id: "item-2b", description: "Term 1 Lunch Program", amount: 12000, category: "Meal Plan" },
      { id: "item-3b", description: "Art Supplies Fee", amount: 4800, category: "Activities" },
      { id: "item-4b", description: "Swimming Lesson (Term 1)", amount: 9600, category: "Activities" },
      { id: "item-5b", description: "Library Fee", amount: 2933, category: "Resources" },
    ]
  },
  {
    id: "INV-2024-003",
    student_id: 1,
    type: "Termly" as const,
    amount_due: 189333,
    due_date: "2025-06-01",
    status: "paid" as const,
    description: "Term 3 Fee 2023-2024",
    term: "Term 3 — Jun 2024",
    line_items: [
      { id: "item-1c", description: "Term 3 Tuition - Grade 4A", amount: 160000, category: "Tuition" },
      { id: "item-2c", description: "Term 3 Lunch Program", amount: 12000, category: "Meal Plan" },
      { id: "item-3c", description: "Graduation Ceremony Fee", amount: 5000, category: "Events" },
      { id: "item-4c", description: "End-of-Year Camp", amount: 8400, category: "Activities" },
      { id: "item-5c", description: "Library Fee", amount: 3933, category: "Resources" },
    ]
  },

  // ── Liam Johnson (Grade 8B) ──────────────────────────────
  {
    id: "INV-2024-005",
    student_id: 2,
    type: "Yearly" as const,
    amount_due: 586800,
    due_date: "2025-12-15",
    status: "paid" as const,
    description: "Tuition Fee 2024-2025",
    term: "Academic Year 2024-2025",
    line_items: [
      { id: "item-11", description: "Tuition Fee - Grade 8B", amount: 470000, category: "Tuition" },
      { id: "item-12", description: "School Shirt (Size L)", amount: 1800, category: "Uniform" },
      { id: "item-13", description: "School Pants (Size L)", amount: 2100, category: "Uniform" },
      { id: "item-14", description: "Lunch Program - Middle School", amount: 43200, category: "Meal Plan" },
      { id: "item-15", description: "Sports Activity Fee", amount: 32400, category: "Activities" },
      { id: "item-16", description: "Technology Fee", amount: 18000, category: "Technology" },
      { id: "item-17", description: "Lab Equipment Fee", amount: 7200, category: "Laboratory" },
      { id: "item-18", description: "Student Insurance", amount: 8400, category: "Insurance" },
      { id: "item-19", description: "Student Handbook", amount: 600, category: "Publications" },
      { id: "item-19b", description: "Science Competition Entry", amount: 3100, category: "Activities" },
    ]
  },
  {
    id: "INV-2024-007",
    student_id: 2,
    type: "Termly" as const,
    amount_due: 205600,
    due_date: "2026-01-10",
    status: "pending" as const,
    description: "Term 2 Fee 2024-2025",
    term: "Term 2 — Jan 2025",
    line_items: [
      { id: "item-20b", description: "Term 2 Tuition - Grade 8B", amount: 170000, category: "Tuition" },
      { id: "item-21b", description: "Term 2 Lunch Program", amount: 14400, category: "Meal Plan" },
      { id: "item-22b", description: "Robotics Club Fee", amount: 9600, category: "Activities" },
      { id: "item-23b", description: "Lab Consumables", amount: 4800, category: "Laboratory" },
      { id: "item-24b", description: "Sports Equipment Levy", amount: 6800, category: "Activities" },
    ]
  },
  {
    id: "INV-2024-008",
    student_id: 2,
    type: "Termly" as const,
    amount_due: 189000,
    due_date: "2025-05-15",
    status: "overdue" as const,
    description: "Term 2 Fee 2023-2024",
    term: "Term 2 — May 2024",
    line_items: [
      { id: "item-25b", description: "Term 2 Tuition - Grade 7B", amount: 160000, category: "Tuition" },
      { id: "item-26b", description: "Term 2 Lunch Program", amount: 14400, category: "Meal Plan" },
      { id: "item-27b", description: "Football Team Fee", amount: 7200, category: "Activities" },
      { id: "item-28b", description: "Music Class (Term 2)", amount: 7400, category: "Activities" },
    ]
  },

  // ── Sophia Johnson (Grade 11C) ───────────────────────────
  {
    id: "INV-2024-006",
    student_id: 3,
    type: "Yearly" as const,
    amount_due: 612400,
    due_date: "2025-12-15",
    status: "partial" as const,
    description: "Tuition Fee 2024-2025",
    term: "Academic Year 2024-2025",
    line_items: [
      { id: "item-30", description: "Tuition Fee - Grade 11C", amount: 490000, category: "Tuition" },
      { id: "item-31", description: "School Shirt (Size L)", amount: 1800, category: "Uniform" },
      { id: "item-32", description: "School Blazer (Size L)", amount: 3600, category: "Uniform" },
      { id: "item-33", description: "Lunch Program - High School", amount: 46800, category: "Meal Plan" },
      { id: "item-34", description: "AP Course Materials", amount: 28800, category: "Academic Materials" },
      { id: "item-35", description: "Technology Fee", amount: 18000, category: "Technology" },
      { id: "item-36", description: "College Counseling", amount: 14400, category: "Counseling" },
      { id: "item-37", description: "Student Insurance", amount: 7200, category: "Insurance" },
      { id: "item-38", description: "Extended Essay Support", amount: 1800, category: "Academic Materials" },
    ]
  },
  {
    id: "INV-2024-009",
    student_id: 3,
    type: "Termly" as const,
    amount_due: 224133,
    due_date: "2026-03-01",
    status: "pending" as const,
    description: "Term 3 Fee 2024-2025",
    term: "Term 3 — Mar 2025",
    line_items: [
      { id: "item-40", description: "Term 3 Tuition - Grade 11C", amount: 180000, category: "Tuition" },
      { id: "item-41", description: "IB Exam Registration Fee", amount: 18000, category: "Examinations" },
      { id: "item-42", description: "Term 3 Lunch Program", amount: 15600, category: "Meal Plan" },
      { id: "item-43", description: "Graduation Deposit", amount: 5000, category: "Events" },
      { id: "item-44", description: "Mock Exam Materials", amount: 5533, category: "Examinations" },
    ]
  },
  {
    id: "INV-2023-010",
    student_id: 3,
    type: "Yearly" as const,
    amount_due: 578000,
    due_date: "2024-12-15",
    status: "paid" as const,
    description: "Tuition Fee 2023-2024",
    term: "Academic Year 2023-2024",
    line_items: [
      { id: "item-50", description: "Tuition Fee - Grade 10C", amount: 470000, category: "Tuition" },
      { id: "item-51", description: "Lunch Program - High School", amount: 46800, category: "Meal Plan" },
      { id: "item-52", description: "AP Course Materials", amount: 24000, category: "Academic Materials" },
      { id: "item-53", description: "Technology Fee", amount: 18000, category: "Technology" },
      { id: "item-54", description: "College Counseling", amount: 12000, category: "Counseling" },
      { id: "item-55", description: "Student Insurance", amount: 7200, category: "Insurance" },
    ]
  },
];

export const mockCreditNotes = [
  { id: 1, student_id: 1, balance: 18000 },
  { id: 2, student_id: 2, balance: 43200 },
  { id: 3, student_id: 3, balance: 0 },
];

// Student-specific course data
export const mockCoursesData = {
  1: [ // Emma Johnson - Grade 5A
    {
      id: "course-001",
      name: "Creative Art & Design",
      description: "Learn drawing, painting and basic design principles",
      capacity: 15,
      enrolled: 12,
      schedule: "Mon & Wed 3:30-4:30 PM",
      location: "Art Room 201",
      price: 3420,
      duration: "8 weeks",
      instructor: "Ms. Jennifer Taylor",
      hasConflict: false
    },
    {
      id: "course-002", 
      name: "Elementary Science Club",
      description: "Fun experiments and discovery activities for young learners",
      capacity: 18,
      enrolled: 14,
      schedule: "Tue & Thu 4:00-5:00 PM",
      location: "Science Lab A",
      price: 3960,
      duration: "6 weeks",
      instructor: "Mr. Peter Chen",
      hasConflict: false
    },
    {
      id: "course-003",
      name: "Reading Adventures",
      description: "Develop reading skills through storytelling and book clubs",
      capacity: 12,
      enrolled: 10,
      schedule: "Wed & Fri 3:30-4:30 PM",
      location: "Library Reading Corner",
      price: 3060,
      duration: "8 weeks",
      instructor: "Ms. Sarah Johnson",
      hasConflict: false
    }
  ],
  2: [ // Liam Johnson - Grade 8B
    {
      id: "course-004",
      name: "Advanced Mathematics Club",
      description: "Explore advanced mathematical concepts and problem-solving techniques",
      capacity: 20,
      enrolled: 18,
      schedule: "Mon & Wed 3:30-4:30 PM",
      location: "Math Lab Room 205",
      price: 4320,
      duration: "8 weeks",
      instructor: "Dr. Sarah Wilson",
      hasConflict: false
    },
    {
      id: "course-005",
      name: "Robotics Engineering",
      description: "Learn programming and build robots using LEGO Mindstorms",
      capacity: 12,
      enrolled: 12,
      schedule: "Wed & Fri 3:30-5:00 PM",
      location: "STEM Lab Room 101",
      price: 6480,
      duration: "10 weeks",
      instructor: "Mr. David Kim",
      hasConflict: false
    },
    {
      id: "course-006",
      name: "Digital Photography",
      description: "Learn photography techniques and digital editing",
      capacity: 15,
      enrolled: 11,
      schedule: "Tue & Thu 4:00-5:30 PM",
      location: "Media Lab Room 305",
      price: 5040,
      duration: "8 weeks",
      instructor: "Ms. Rachel Martinez",
      hasConflict: false
    }
  ],
  3: [ // Sophia Johnson - Grade 11C
    {
      id: "course-007",
      name: "Academic Writing Workshop",
      description: "Develop advanced writing skills for college preparation",
      capacity: 15,
      enrolled: 13,
      schedule: "Mon & Wed 4:00-5:30 PM",
      location: "English Department Room 402",
      price: 5760,
      duration: "10 weeks",
      instructor: "Dr. Emily Roberts",
      hasConflict: false
    },
    {
      id: "course-008",
      name: "Advanced Biology Lab",
      description: "Hands-on laboratory experiments and research projects",
      capacity: 18,
      enrolled: 16,
      schedule: "Tue & Thu 3:30-5:00 PM",
      location: "Biology Lab Room 501",
      price: 7200,
      duration: "12 weeks",
      instructor: "Dr. Michael Thompson",
      hasConflict: false
    },
    {
      id: "course-009",
      name: "Leadership & Communication",
      description: "Develop leadership skills and public speaking abilities",
      capacity: 20,
      enrolled: 17,
      schedule: "Wed & Fri 4:00-5:30 PM",
      location: "Conference Room B",
      price: 6300,
      duration: "8 weeks",
      instructor: "Ms. Amanda Lee",
      hasConflict: true
    }
  ]
};

// Student-specific summer activities data
export const mockSummerActivitiesData = {
  1: [ // Emma Johnson - Grade 5A
    {
      id: "summer-001",
      name: "Junior Art Camp",
      description: "Creative arts and crafts for younger students",
      capacity: 20,
      enrolled: 15,
      schedule: "July 8-19, 9:00 AM - 1:00 PM",
      location: "Art Studio Room 201",
      price: 12600,
      duration: "2 weeks",
      instructor: "Ms. Jennifer Taylor",
      discount: "Early Bird: ฿1,080 off"
    },
    {
      id: "summer-002",
      name: "Nature Explorer Camp",
      description: "Outdoor adventures and environmental learning",
      capacity: 25,
      enrolled: 18,
      schedule: "July 22 - Aug 2, 9:00 AM - 2:00 PM",
      location: "Outdoor Campus & Nature Trail",
      price: 15120,
      duration: "2 weeks", 
      instructor: "Mr. Tom Wilson",
      discount: "Sibling Discount: 10% off"
    }
  ],
  2: [ // Liam Johnson - Grade 8B
    {
      id: "summer-003",
      name: "Robotics & Coding Camp",
      description: "Advanced programming and robot building",
      capacity: 15,
      enrolled: 12,
      schedule: "July 8-19, 9:00 AM - 3:00 PM",
      location: "STEM Lab & Computer Center",
      price: 19800,
      duration: "2 weeks",
      instructor: "Tech Team",
      discount: "Early Bird: ฿2,700 off"
    },
    {
      id: "summer-004",
      name: "Soccer Skills Academy",
      description: "Improve soccer techniques and teamwork",
      capacity: 30,
      enrolled: 28,
      schedule: "Aug 5-16, 8:00 AM - 12:00 PM",
      location: "Sports Field Complex",
      price: 11520,
      duration: "2 weeks",
      instructor: "Coach Michael Rodriguez"
    },
    {
      id: "summer-005",
      name: "Science Discovery Camp",
      description: "Hands-on experiments and laboratory work",
      capacity: 20,
      enrolled: 16,
      schedule: "July 22 - Aug 2, 10:00 AM - 3:00 PM",
      location: "Science Building Lab",
      price: 17280,
      duration: "2 weeks",
      instructor: "Science Department"
    }
  ],
  3: [ // Sophia Johnson - Grade 11C
    {
      id: "summer-006",
      name: "College Prep Intensive",
      description: "SAT/ACT preparation and college application workshop",
      capacity: 25,
      enrolled: 22,
      schedule: "July 8-26, 9:00 AM - 2:00 PM",
      location: "Academic Center Room 501",
      price: 23400,
      duration: "3 weeks",
      instructor: "College Counseling Team",
      discount: "Merit Scholarship: ฿3,600 off"
    },
    {
      id: "summer-007",
      name: "Advanced Biology Research",
      description: "Independent research projects and lab work",
      capacity: 12,
      enrolled: 8,
      schedule: "July 15 - Aug 9, 1:00 PM - 5:00 PM",
      location: "Advanced Biology Lab",
      price: 20880,
      duration: "4 weeks", 
      instructor: "Dr. Lisa Chang",
      discount: "Research Grant: ฿1,800 off"
    },
    {
      id: "summer-008",
      name: "Leadership Summit",
      description: "Leadership skills development and community service",
      capacity: 20,
      enrolled: 15,
      schedule: "Aug 12-23, 10:00 AM - 4:00 PM",
      location: "Conference Center",
      price: 18720,
      duration: "2 weeks",
      instructor: "Leadership Institute"
    }
  ]
};

// Exam data
export type LocalizedString = { en: string; th: string; zh: string };

export interface Exam {
  id: string;
  name: string;
  descriptions: LocalizedString;
  price: number;
  resultsDeliveryPrice: number;
  capacity: number;
  enrolled: number;
  date: string;
  time: string;
  vendors: LocalizedString;
  locations: LocalizedString;
  eligibleGrades: string[];
}

export const mockExams: Exam[] = [
  {
    id: "exam-001",
    name: "Cambridge Primary English Test",
    price: 2500,
    resultsDeliveryPrice: 500,
    capacity: 50,
    enrolled: 35,
    date: "2024-12-15",
    time: "9:00 AM - 12:00 PM",
    vendors: {
      en: "Cambridge Assessment",
      th: "Cambridge Assessment",
      zh: "剑桥评估",
    },
    locations: {
      en: "Examination Hall A",
      th: "ห้องสอบ A",
      zh: "考场 A",
    },
    descriptions: {
      en: "International standardized English assessment for primary students",
      th: "การสอบภาษาอังกฤษมาตรฐานสากลสำหรับนักเรียนระดับประถม",
      zh: "面向小学生的国际标准化英语测评",
    },
    eligibleGrades: ["Grade 5A", "Grade 5B", "Grade 6A"],
  },
  {
    id: "exam-002",
    name: "Math Olympiad Qualifier",
    price: 1500,
    resultsDeliveryPrice: 300,
    capacity: 30,
    enrolled: 28,
    date: "2025-01-10",
    time: "1:00 PM - 4:00 PM",
    vendors: {
      en: "Thailand Math Association",
      th: "สมาคมคณิตศาสตร์ไทย",
      zh: "泰国数学协会",
    },
    locations: {
      en: "Math Lab Room 205",
      th: "ห้องคณิตศาสตร์ 205",
      zh: "数学实验室 205",
    },
    descriptions: {
      en: "Regional mathematics competition preliminary round",
      th: "รอบคัดเลือกการแข่งขันคณิตศาสตร์ระดับภูมิภาค",
      zh: "地区数学竞赛初赛",
    },
    eligibleGrades: ["Grade 5A", "Grade 5B", "Grade 6A"],
  },
  {
    id: "exam-003",
    name: "iPSLE 2026 Examination",
    price: 5000,
    resultsDeliveryPrice: 500,
    capacity: 40,
    enrolled: 10,
    date: "2025-03-20",
    time: "9:00 AM - 3:00 PM",
    vendors: {
      en: "MOE Singapore",
      th: "MOE Singapore",
      zh: "新加坡教育部",
    },
    locations: {
      en: "Examination Hall B",
      th: "ห้องสอบ B",
      zh: "考场 B",
    },
    descriptions: {
      en: "2026 Singapore International Primary School Leaving Examination",
      th: "การสอบ PSLE นานาชาติสิงคโปร์ 2026",
      zh: "2026年新加坡国际小学离校考试",
    },
    eligibleGrades: ["Grade 5A", "Grade 5B", "Grade 6A"],
  },
  {
    id: "exam-004",
    name: "HSK Level 4 Examination",
    price: 3000,
    resultsDeliveryPrice: 500,
    capacity: 25,
    enrolled: 5,
    date: "2025-02-15",
    time: "10:00 AM - 12:30 PM",
    vendors: {
      en: "Hanban / Confucius Institute",
      th: "Hanban / สถาบันขงจื่อ",
      zh: "汉办 / 孔子学院",
    },
    locations: {
      en: "Language Center",
      th: "ศูนย์ภาษา",
      zh: "语言中心",
    },
    descriptions: {
      en: "Hanyu Shuiping Kaoshi Chinese proficiency test level 4",
      th: "การสอบวัดความสามารถภาษาจีน HSK ระดับ 4",
      zh: "汉语水平考试四级",
    },
    eligibleGrades: ["Grade 5A", "Grade 5B", "Grade 6A"],
  },
  // ── Grade 8B exams ──────────────────────────────────────
  {
    id: "exam-005",
    name: "IELTS Academic (Junior)",
    price: 6500,
    resultsDeliveryPrice: 0,
    capacity: 20,
    enrolled: 7,
    date: "2025-02-22",
    time: "9:00 AM - 1:00 PM",
    vendors: { en: "British Council Thailand", th: "British Council ประเทศไทย", zh: "英国文化协会泰国" },
    locations: { en: "Examination Hall B", th: "ห้องสอบ B", zh: "考场 B" },
    descriptions: {
      en: "Official IELTS Academic test administered by British Council",
      th: "การสอบ IELTS Academic อย่างเป็นทางการโดย British Council",
      zh: "英国文化协会主办的官方雅思学术类考试",
    },
    eligibleGrades: ["Grade 8B", "Grade 8A", "Grade 9A"],
  },
  {
    id: "exam-006",
    name: "Thailand Science Olympiad — Regional",
    price: 800,
    resultsDeliveryPrice: 0,
    capacity: 15,
    enrolled: 15,
    date: "2025-03-08",
    time: "8:30 AM - 3:00 PM",
    vendors: { en: "IPST Thailand", th: "สสวท.", zh: "泰国科学促进会" },
    locations: { en: "Science Building — Hall C", th: "อาคารวิทยาศาสตร์ ห้อง C", zh: "科学楼 C 厅" },
    descriptions: {
      en: "Regional qualifier for the Thailand Science Olympiad — Physics & Chemistry tracks",
      th: "รอบภูมิภาคสำหรับโอลิมปิกวิทยาศาสตร์ไทย สาขาฟิสิกส์และเคมี",
      zh: "泰国科学奥林匹克地区资格赛——物理与化学赛道",
    },
    eligibleGrades: ["Grade 8B", "Grade 8A", "Grade 9A"],
  },
  {
    id: "exam-007",
    name: "Cambridge Checkpoint Science",
    price: 3200,
    resultsDeliveryPrice: 600,
    capacity: 30,
    enrolled: 12,
    date: "2025-04-10",
    time: "10:00 AM - 12:30 PM",
    vendors: { en: "Cambridge Assessment", th: "Cambridge Assessment", zh: "剑桥评估" },
    locations: { en: "Examination Hall A", th: "ห้องสอบ A", zh: "考场 A" },
    descriptions: {
      en: "Cambridge Lower Secondary Checkpoint Science for Grade 8 students",
      th: "การสอบ Cambridge Lower Secondary Checkpoint วิทยาศาสตร์ สำหรับนักเรียนชั้น 8",
      zh: "面向8年级学生的剑桥初中阶段科学测验",
    },
    eligibleGrades: ["Grade 8B", "Grade 8A", "Grade 9A"],
  },
  // ── Grade 11C exams ─────────────────────────────────────
  {
    id: "exam-008",
    name: "SAT — Spring Session",
    price: 5800,
    resultsDeliveryPrice: 0,
    capacity: 40,
    enrolled: 31,
    date: "2025-03-08",
    time: "8:00 AM - 1:30 PM",
    vendors: { en: "College Board", th: "College Board", zh: "大学理事会" },
    locations: { en: "Examination Hall B", th: "ห้องสอบ B", zh: "考场 B" },
    descriptions: {
      en: "SAT Spring 2025 — Reading, Writing & Math sections for college admissions",
      th: "SAT ภาคเรียนฤดูใบไม้ผลิ 2025 สำหรับการสมัครเข้ามหาวิทยาลัย",
      zh: "2025年春季SAT考试——阅读、写作与数学，用于大学入学申请",
    },
    eligibleGrades: ["Grade 11C", "Grade 11A", "Grade 12A"],
  },
  {
    id: "exam-009",
    name: "IB Diploma — Theory of Knowledge Essay",
    price: 2000,
    resultsDeliveryPrice: 500,
    capacity: 25,
    enrolled: 3,
    date: "2025-05-05",
    time: "9:00 AM - 11:00 AM",
    vendors: { en: "IBO Geneva", th: "IBO เจนีวา", zh: "国际文凭组织日内瓦" },
    locations: { en: "Library Seminar Room", th: "ห้องสัมมนาห้องสมุด", zh: "图书馆研讨室" },
    descriptions: {
      en: "IB Diploma Programme Theory of Knowledge internal essay submission and assessment",
      th: "การส่งและประเมินเรียงความ Theory of Knowledge สำหรับ IB Diploma Programme",
      zh: "IB文凭课程知识理论内部论文提交与评估",
    },
    eligibleGrades: ["Grade 11C", "Grade 11A", "Grade 12A"],
  },
  {
    id: "exam-010",
    name: "TOEFL iBT — April Test",
    price: 7200,
    resultsDeliveryPrice: 0,
    capacity: 18,
    enrolled: 18,
    date: "2025-04-19",
    time: "9:00 AM - 1:30 PM",
    vendors: { en: "ETS Global", th: "ETS Global", zh: "ETS全球" },
    locations: { en: "Computer Lab Room 401", th: "ห้องคอมพิวเตอร์ 401", zh: "计算机实验室401" },
    descriptions: {
      en: "TOEFL iBT April session — internet-based English proficiency test for university applications",
      th: "สอบ TOEFL iBT เดือนเมษายน สำหรับการสมัครมหาวิทยาลัยต่างประเทศ",
      zh: "TOEFL iBT四月场——网络英语水平考试，用于海外大学申请",
    },
    eligibleGrades: ["Grade 11C", "Grade 11A", "Grade 12A"],
  },
];

// Trip data
export interface Trip {
  id: string;
  name: LocalizedString;
  descriptions: LocalizedString;
  destination: LocalizedString;
  startDate: string;
  endDate: string;
  price: number;
  capacity: number;
  enrolled: number;
  eligibleGrades: string[];
  consentFormUrl: string;
  status: 'open' | 'closed' | 'full';
}

export interface TripRegistration {
  id: string;
  tripId: string;
  tripName: LocalizedString;
  destination: LocalizedString;
  studentId: number;
  studentName: string;
  price: number;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  registeredAt: string;
  startDate: string;
  endDate: string;
  receiptUrl?: string;
}

export const mockTrips: Trip[] = [
  {
    id: "trip-001",
    name: {
      en: "Science Museum Discovery Tour",
      th: "ทัวร์พิพิธภัณฑ์วิทยาศาสตร์",
      zh: "科学博物馆探索之旅",
    },
    descriptions: {
      en: "Explore interactive science exhibits and hands-on experiments at the National Science Museum",
      th: "สำรวจนิทรรศการวิทยาศาสตร์แบบโต้ตอบและการทดลองที่พิพิธภัณฑ์วิทยาศาสตร์แห่งชาติ",
      zh: "在国家科学博物馆探索互动科学展览和动手实验",
    },
    destination: {
      en: "National Science Museum, Pathum Thani",
      th: "พิพิธภัณฑ์วิทยาศาสตร์แห่งชาติ ปทุมธานี",
      zh: "国家科学博物馆，巴吞他尼",
    },
    startDate: "2026-06-10",
    endDate: "2026-06-10",
    price: 850,
    capacity: 40,
    enrolled: 28,
    eligibleGrades: ["Grade 5A", "Grade 5B", "Grade 6A"],
    consentFormUrl: "#",
    status: "open",
  },
  {
    id: "trip-002",
    name: {
      en: "Art Gallery & Creative Workshop",
      th: "หอศิลป์และเวิร์กช็อปสร้างสรรค์",
      zh: "艺术画廊与创意工作坊",
    },
    descriptions: {
      en: "Visit the Bangkok Art and Culture Centre and participate in a guided creative workshop",
      th: "เยี่ยมชมหอศิลปวัฒนธรรมแห่งกรุงเทพมหานครและเข้าร่วมเวิร์กช็อปสร้างสรรค์",
      zh: "参观曼谷艺术与文化中心，参与引导式创意工作坊",
    },
    destination: {
      en: "Bangkok Art and Culture Centre",
      th: "หอศิลปวัฒนธรรมแห่งกรุงเทพมหานคร",
      zh: "曼谷艺术与文化中心",
    },
    startDate: "2026-06-18",
    endDate: "2026-06-18",
    price: 600,
    capacity: 30,
    enrolled: 27,
    eligibleGrades: ["Grade 8B", "Grade 8A", "Grade 9A"],
    consentFormUrl: "#",
    status: "open",
  },
  {
    id: "trip-003",
    name: {
      en: "Chiang Mai Nature Camp",
      th: "ค่ายธรรมชาติเชียงใหม่",
      zh: "清迈自然营",
    },
    descriptions: {
      en: "A 3-day immersive nature camp in Chiang Mai featuring trekking, wildlife observation, and eco-learning",
      th: "ค่ายธรรมชาติ 3 วันที่เชียงใหม่ ประกอบด้วยการเดินป่า การสังเกตสัตว์ป่า และการเรียนรู้เชิงนิเวศ",
      zh: "清迈3天沉浸式自然营，包括徒步、野生动物观察和生态学习",
    },
    destination: {
      en: "Doi Inthanon National Park, Chiang Mai",
      th: "อุทยานแห่งชาติดอยอินทนนท์ เชียงใหม่",
      zh: "英他侬国家公园，清迈",
    },
    startDate: "2026-07-05",
    endDate: "2026-07-07",
    price: 4500,
    capacity: 25,
    enrolled: 25,
    eligibleGrades: ["Grade 8B", "Grade 8A", "Grade 9A"],
    consentFormUrl: "#",
    status: "full",
  },
  {
    id: "trip-004",
    name: {
      en: "National Park Hike & Conservation",
      th: "เดินป่าอุทยานแห่งชาติและอนุรักษ์สิ่งแวดล้อม",
      zh: "国家公园徒步与自然保护",
    },
    descriptions: {
      en: "Day hike and conservation activity at Khao Yai National Park, a UNESCO World Heritage Site",
      th: "เดินป่าและกิจกรรมอนุรักษ์ที่อุทยานแห่งชาติเขาใหญ่ มรดกโลกยูเนสโก",
      zh: "在联合国教科文组织世界遗产考艾国家公园进行一日徒步和保护活动",
    },
    destination: {
      en: "Khao Yai National Park, Nakhon Ratchasima",
      th: "อุทยานแห่งชาติเขาใหญ่ นครราชสีมา",
      zh: "考艾国家公园，那空叻察是玛",
    },
    startDate: "2026-07-15",
    endDate: "2026-07-15",
    price: 1200,
    capacity: 35,
    enrolled: 14,
    eligibleGrades: ["Grade 11C", "Grade 11A", "Grade 12A"],
    consentFormUrl: "#",
    status: "open",
  },
  {
    id: "trip-005",
    name: {
      en: "ASEAN Cultural Exchange Program",
      th: "โครงการแลกเปลี่ยนวัฒนธรรมอาเซียน",
      zh: "东盟文化交流项目",
    },
    descriptions: {
      en: "A cultural immersion trip to Singapore exploring ASEAN heritage, technology hubs, and student exchanges",
      th: "ทริปเรียนรู้วัฒนธรรมที่สิงคโปร์ สำรวจมรดกอาเซียน ศูนย์กลางเทคโนโลยี และการแลกเปลี่ยนนักเรียน",
      zh: "新加坡文化沉浸之旅，探索东盟遗产、科技中心和学生交流",
    },
    destination: {
      en: "Singapore",
      th: "สิงคโปร์",
      zh: "新加坡",
    },
    startDate: "2026-08-10",
    endDate: "2026-08-14",
    price: 18500,
    capacity: 20,
    enrolled: 5,
    eligibleGrades: ["Grade 11C", "Grade 11A", "Grade 12A"],
    consentFormUrl: "#",
    status: "closed",
  },
  {
    id: "trip-006",
    name: { en: "Floating Market & River Culture Day", th: "วันตลาดน้ำและวัฒนธรรมแม่น้ำ", zh: "水上市场与运河文化日" },
    descriptions: {
      en: "Explore Damnoen Saduak floating market and learn about traditional Thai river culture and cuisine",
      th: "สำรวจตลาดน้ำดำเนินสะดวกและเรียนรู้วัฒนธรรมและอาหารริมแม่น้ำแบบไทยดั้งเดิม",
      zh: "探索丹嫩沙多水上市场，了解泰国传统水乡文化与美食",
    },
    destination: { en: "Damnoen Saduak, Ratchaburi", th: "ดำเนินสะดวก ราชบุรี", zh: "丹嫩沙多，叻丕府" },
    startDate: "2026-05-22",
    endDate: "2026-05-22",
    price: 750,
    capacity: 45,
    enrolled: 43,
    eligibleGrades: ["Grade 5A", "Grade 5B", "Grade 6A"],
    consentFormUrl: "#",
    status: "open",
  },
  {
    id: "trip-007",
    name: { en: "Bangkok Heritage Walk", th: "เดินชมมรดกกรุงเทพมหานคร", zh: "曼谷文化遗产徒步游" },
    descriptions: {
      en: "Guided walking tour of Bangkok's historic districts — Rattanakosin Island, Chinatown, and Bangrak",
      th: "ทัวร์เดินชมย่านประวัติศาสตร์กรุงเทพฯ — เกาะรัตนโกสินทร์ เยาวราช และบางรัก",
      zh: "导览曼谷历史街区——拉达纳哥欣岛、唐人街与邦叻",
    },
    destination: { en: "Rattanakosin Island, Bangkok", th: "เกาะรัตนโกสินทร์ กรุงเทพฯ", zh: "拉达纳哥欣岛，曼谷" },
    startDate: "2026-06-05",
    endDate: "2026-06-05",
    price: 500,
    capacity: 30,
    enrolled: 30,
    eligibleGrades: ["Grade 8B", "Grade 8A", "Grade 9A"],
    consentFormUrl: "#",
    status: "full",
  },
  {
    id: "trip-008",
    name: { en: "Model United Nations — Phuket Conference", th: "การประชุม MUN ภูเก็ต", zh: "普吉岛模拟联合国大会" },
    descriptions: {
      en: "3-day Model United Nations conference in Phuket — debate, diplomacy, and international relations",
      th: "การประชุม Model United Nations 3 วันที่ภูเก็ต เน้นการอภิปราย การทูต และความสัมพันธ์ระหว่างประเทศ",
      zh: "普吉岛3天模拟联合国大会——辩论、外交与国际关系",
    },
    destination: { en: "Phuket International Convention Hall", th: "ศูนย์ประชุมนานาชาติภูเก็ต", zh: "普吉岛国际会议中心" },
    startDate: "2026-08-20",
    endDate: "2026-08-22",
    price: 8500,
    capacity: 20,
    enrolled: 9,
    eligibleGrades: ["Grade 11C", "Grade 11A", "Grade 12A"],
    consentFormUrl: "#",
    status: "open",
  },
];

export const mockTripRegistrations: TripRegistration[] = [
  {
    id: "treg-001",
    tripId: "trip-001",
    tripName: {
      en: "Science Museum Discovery Tour",
      th: "ทัวร์พิพิธภัณฑ์วิทยาศาสตร์",
      zh: "科学博物馆探索之旅",
    },
    destination: {
      en: "National Science Museum, Pathum Thani",
      th: "พิพิธภัณฑ์วิทยาศาสตร์แห่งชาติ ปทุมธานี",
      zh: "国家科学博物馆，巴吞他尼",
    },
    studentId: 1,
    studentName: "Emma Johnson",
    price: 850,
    paymentStatus: "paid",
    registeredAt: "2026-05-01T10:00:00Z",
    startDate: "2026-06-10",
    endDate: "2026-06-10",
    receiptUrl: "#",
  },
  {
    id: "treg-002",
    tripId: "trip-002",
    tripName: {
      en: "Art Gallery & Creative Workshop",
      th: "หอศิลป์และเวิร์กช็อปสร้างสรรค์",
      zh: "艺术画廊与创意工作坊",
    },
    destination: {
      en: "Bangkok Art and Culture Centre",
      th: "หอศิลปวัฒนธรรมแห่งกรุงเทพมหานคร",
      zh: "曼谷艺术与文化中心",
    },
    studentId: 2,
    studentName: "Liam Johnson",
    price: 600,
    paymentStatus: "pending",
    registeredAt: "2026-05-05T14:00:00Z",
    startDate: "2026-06-18",
    endDate: "2026-06-18",
  },
  {
    id: "treg-003",
    tripId: "trip-003",
    tripName: {
      en: "Chiang Mai Nature Camp",
      th: "ค่ายธรรมชาติเชียงใหม่",
      zh: "清迈自然营",
    },
    destination: {
      en: "Doi Inthanon National Park, Chiang Mai",
      th: "อุทยานแห่งชาติดอยอินทนนท์ เชียงใหม่",
      zh: "英他侬国家公园，清迈",
    },
    studentId: 2,
    studentName: "Liam Johnson",
    price: 4500,
    paymentStatus: "overdue",
    registeredAt: "2026-04-20T09:00:00Z",
    startDate: "2026-07-05",
    endDate: "2026-07-07",
  },
  {
    id: "treg-004",
    tripId: "trip-004",
    tripName: { en: "National Park Hike & Conservation", th: "เดินป่าอุทยานแห่งชาติและอนุรักษ์สิ่งแวดล้อม", zh: "国家公园徒步与自然保护" },
    destination: { en: "Khao Yai National Park, Nakhon Ratchasima", th: "อุทยานแห่งชาติเขาใหญ่ นครราชสีมา", zh: "考艾国家公园，那空叻察是玛" },
    studentId: 3,
    studentName: "Sophia Johnson",
    price: 1200,
    paymentStatus: "paid",
    registeredAt: "2026-05-10T11:00:00Z",
    startDate: "2026-07-15",
    endDate: "2026-07-15",
    receiptUrl: "#",
  },
  {
    id: "treg-005",
    tripId: "trip-006",
    tripName: { en: "Floating Market & River Culture Day", th: "วันตลาดน้ำและวัฒนธรรมแม่น้ำ", zh: "水上市场与运河文化日" },
    destination: { en: "Damnoen Saduak, Ratchaburi", th: "ดำเนินสะดวก ราชบุรี", zh: "丹嫩沙多，叻丕府" },
    studentId: 1,
    studentName: "Emma Johnson",
    price: 750,
    paymentStatus: "pending",
    registeredAt: "2026-04-15T08:00:00Z",
    startDate: "2026-05-22",
    endDate: "2026-05-22",
  },
  {
    id: "treg-006",
    tripId: "trip-005",
    tripName: { en: "ASEAN Cultural Exchange Program", th: "โครงการแลกเปลี่ยนวัฒนธรรมอาเซียน", zh: "东盟文化交流项目" },
    destination: { en: "Singapore", th: "สิงคโปร์", zh: "新加坡" },
    studentId: 3,
    studentName: "Sophia Johnson",
    price: 18500,
    paymentStatus: "overdue",
    registeredAt: "2026-03-01T09:00:00Z",
    startDate: "2026-08-10",
    endDate: "2026-08-14",
  },
  {
    id: "treg-007",
    tripId: "trip-007",
    tripName: { en: "Bangkok Heritage Walk", th: "เดินชมมรดกกรุงเทพมหานคร", zh: "曼谷文化遗产徒步游" },
    destination: { en: "Rattanakosin Island, Bangkok", th: "เกาะรัตนโกสินทร์ กรุงเทพฯ", zh: "拉达纳哥欣岛，曼谷" },
    studentId: 2,
    studentName: "Liam Johnson",
    price: 500,
    paymentStatus: "paid",
    registeredAt: "2026-04-01T10:00:00Z",
    startDate: "2026-06-05",
    endDate: "2026-06-05",
    receiptUrl: "#",
  },
  {
    id: "treg-008",
    tripId: "trip-008",
    tripName: { en: "Model United Nations — Phuket Conference", th: "การประชุม MUN ภูเก็ต", zh: "普吉岛模拟联合国大会" },
    destination: { en: "Phuket International Convention Hall", th: "ศูนย์ประชุมนานาชาติภูเก็ต", zh: "普吉岛国际会议中心" },
    studentId: 3,
    studentName: "Sophia Johnson",
    price: 8500,
    paymentStatus: "pending",
    registeredAt: "2026-05-20T14:00:00Z",
    startDate: "2026-08-20",
    endDate: "2026-08-22",
  },
];

// Legacy exports for backward compatibility
export const mockCourses = mockCoursesData[1];
export const mockSummerActivities = mockSummerActivitiesData[1];

export const mockReceipts = [
  // ── Completed ────────────────────────────────────────────
  {
    id: "REC-2024-001",
    invoice_id: "INV-2024-003",
    amount: 189333,
    payment_method: "credit_card" as const,
    paid_at: "2024-05-20T10:30:00Z",
    receipt_url: "#",
    status: "completed" as const,
    description: "Term 3 Fee 2023-2024 — Emma Johnson",
    reference_number: "TXN-20240520-001"
  },
  {
    id: "REC-2024-002",
    invoice_id: "INV-2024-005",
    amount: 586800,
    payment_method: "bank_transfer" as const,
    paid_at: "2024-11-10T14:15:00Z",
    receipt_url: "#",
    status: "completed" as const,
    description: "Yearly Tuition 2024-2025 — Liam Johnson",
    reference_number: "TXN-20241110-002"
  },
  {
    id: "REC-2024-003",
    invoice_id: "INV-2023-010",
    amount: 578000,
    payment_method: "promptpay" as const,
    paid_at: "2023-11-05T09:45:00Z",
    receipt_url: "#",
    status: "completed" as const,
    description: "Yearly Tuition 2023-2024 — Sophia Johnson",
    reference_number: "TXN-20231105-003"
  },
  {
    id: "REC-2025-004",
    invoice_id: "INV-2024-001",
    amount: 25200,
    payment_method: "credit_note" as const,
    paid_at: "2025-02-14T11:00:00Z",
    receipt_url: "#",
    status: "completed" as const,
    description: "Activity Fee Partial Payment — Emma Johnson",
    reference_number: "TXN-20250214-004"
  },
  {
    id: "REC-2025-005",
    invoice_id: "INV-2024-006",
    amount: 306200,
    payment_method: "credit_card" as const,
    paid_at: "2025-01-08T15:30:00Z",
    receipt_url: "#",
    status: "completed" as const,
    description: "Partial Tuition Payment (Term 1&2) — Sophia Johnson",
    reference_number: "TXN-20250108-005"
  },
  {
    id: "REC-2025-006",
    invoice_id: "INV-2024-007",
    amount: 43200,
    payment_method: "bank_transfer" as const,
    paid_at: "2025-03-22T09:00:00Z",
    receipt_url: "#",
    status: "completed" as const,
    description: "Lunch Program Fee — Liam Johnson",
    reference_number: "TXN-20250322-006"
  },
  // ── Processing ───────────────────────────────────────────
  {
    id: "REC-2025-007",
    invoice_id: "INV-2024-009",
    amount: 224133,
    payment_method: "credit_card" as const,
    paid_at: "2025-04-18T16:20:00Z",
    receipt_url: "#",
    status: "processing" as const,
    description: "Term 3 Fee 2024-2025 — Sophia Johnson",
    reference_number: "TXN-20250418-007"
  },
  {
    id: "REC-2025-008",
    invoice_id: "INV-2024-002",
    amount: 189333,
    payment_method: "promptpay" as const,
    paid_at: "2025-04-19T10:05:00Z",
    receipt_url: "#",
    status: "processing" as const,
    description: "Term 1 Fee Payment — Emma Johnson",
    reference_number: "TXN-20250419-008"
  },
  // ── Failed ───────────────────────────────────────────────
  {
    id: "REC-2025-009",
    invoice_id: "INV-2024-008",
    amount: 189000,
    payment_method: "credit_card" as const,
    paid_at: "2025-04-10T13:45:00Z",
    receipt_url: "#",
    status: "failed" as const,
    description: "Term 2 Fee 2023-2024 — Liam Johnson",
    reference_number: "TXN-20250410-009"
  },
];

export const getMockDataForStudent = (studentId: number) => {
  const invoices = mockInvoices.filter(inv => inv.student_id === studentId);
  const creditNote = mockCreditNotes.find(cn => cn.student_id === studentId);
  
  return {
    invoices,
    creditBalance: creditNote?.balance || 0,
    courses: mockCoursesData[studentId] || mockCoursesData[1],
    summerActivities: mockSummerActivitiesData[studentId] || mockSummerActivitiesData[1],
    receipts: mockReceipts
  };
};