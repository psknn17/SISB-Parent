// Mock data for the Parent Portal

export const mockStudents = [
  { id: 1, name: "Emma Johnson", class: "Grade 5A", year: "2024", avatar: "👧" },
  { id: 2, name: "Liam Johnson", class: "Grade 8B", year: "2024", avatar: "👦" },
  { id: 3, name: "Sophia Johnson", class: "Grade 11C", year: "2024", avatar: "👩‍🎓" },
];

export const mockInvoices = [
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
    id: "INV-2024-005",
    student_id: 2,
    type: "Yearly" as const,
    amount_due: 558000,
    due_date: "2025-12-15",
    status: "paid" as const,
    description: "Tuition Fee 2024-2025",
    term: "Academic Year 2024-2025",
    line_items: [
      { id: "item-11", description: "Tuition Fee - Grade 8B", amount: 450000, category: "Tuition" },
      { id: "item-12", description: "School Shirt (Size L)", amount: 1800, category: "Uniform" },
      { id: "item-13", description: "School Pants (Size L)", amount: 2100, category: "Uniform" },
      { id: "item-14", description: "Lunch Program - Middle School", amount: 43200, category: "Meal Plan" },
      { id: "item-15", description: "Sports Activity Fee", amount: 32400, category: "Activities" },
      { id: "item-16", description: "Technology Fee", amount: 18000, category: "Technology" },
      { id: "item-17", description: "Lab Equipment Fee", amount: 7200, category: "Laboratory" },
      { id: "item-18", description: "Student Insurance", amount: 2700, category: "Insurance" },
      { id: "item-19", description: "Student Handbook", amount: 600, category: "Publications" }
    ]
  },
  {
    id: "INV-2024-006",
    student_id: 3,
    type: "Yearly" as const,
    amount_due: 558000,
    due_date: "2025-12-15",
    status: "pending" as const,
    description: "Tuition Fee 2024-2025",
    term: "Academic Year 2024-2025",
    line_items: [
      { id: "item-20", description: "Tuition Fee - Grade 11C", amount: 470000, category: "Tuition" },
      { id: "item-21", description: "School Shirt (Size L)", amount: 1800, category: "Uniform" },
      { id: "item-22", description: "School Blazer (Size L)", amount: 3600, category: "Uniform" },
      { id: "item-23", description: "Lunch Program - High School", amount: 46800, category: "Meal Plan" },
      { id: "item-24", description: "AP Course Materials", amount: 21600, category: "Academic Materials" },
      { id: "item-25", description: "Technology Fee", amount: 9000, category: "Technology" },
      { id: "item-26", description: "College Counseling", amount: 3600, category: "Counseling" },
      { id: "item-27", description: "Student Insurance", amount: 1600, category: "Insurance" }
    ]
  }
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

// Legacy exports for backward compatibility
export const mockCourses = mockCoursesData[1];
export const mockSummerActivities = mockSummerActivitiesData[1];

export const mockReceipts = [
  {
    id: "REC-2024-001",
    invoice_id: "INV-2024-004",
    amount: 115200,
    payment_method: "credit_card" as const,
    paid_at: "2025-08-28T10:30:00Z",
    receipt_url: "#",
    status: "completed" as const,
    description: "September Tuition Payment",
    reference_number: "TXN-20240828-001"
  },
  {
    id: "REC-2024-002",
    invoice_id: "INV-2024-005",
    amount: 30600,
    payment_method: "bank_transfer" as const,
    paid_at: "2025-08-25T14:15:00Z",
    receipt_url: "#",
    status: "completed" as const,
    description: "Activity Registration Fee",
    reference_number: "TXN-20240825-002"
  },
  {
    id: "REC-2024-003",
    invoice_id: "INV-2024-006",
    amount: 16200,
    payment_method: "credit_note" as const,
    paid_at: "2025-08-20T09:45:00Z",
    receipt_url: "#",
    status: "completed" as const,
    description: "Summer Camp Registration",
    reference_number: "TXN-20240820-003"
  },
  {
    id: "REC-2024-004",
    invoice_id: "INV-2024-007",
    amount: 460800,
    payment_method: "credit_card" as const,
    paid_at: "2025-08-30T16:20:00Z",
    receipt_url: "#",
    status: "processing" as const,
    description: "Tuition Fee",
    reference_number: "TXN-20240830-004"
  }
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