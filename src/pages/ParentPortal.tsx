import { useState, useMemo, useEffect, useRef } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { ChildrenOverview } from "@/components/portal/ChildrenOverview";
import { SummaryBox } from "@/components/portal/SummaryBox";
import { InvoiceCard } from "@/components/portal/InvoiceCard";
import { CourseCard } from "@/components/portal/CourseCard";
import { ExamCard } from "@/components/portal/ExamCard";
import { TripCard, Trip } from "@/components/portal/TripCard";
import { TuitionCartSidebar } from "@/components/portal/TuitionCartSidebar";
import { CourseCartSidebar } from "@/components/portal/CourseCartSidebar";
import { TripCartSidebar, TripCartItem } from "@/components/portal/TripCartSidebar";
import { CampCheckout } from "@/components/portal/CampCheckout";
import { ReceiptList } from "@/components/portal/ReceiptList";
import { StudentFilter } from "@/components/portal/StudentFilter";
import { CountdownTimer } from "@/components/portal/CountdownTimer";
import { WeeklyCalendarView } from "@/components/portal/WeeklyCalendarView";
import { MobileBottomNav } from "@/components/portal/MobileBottomNav";
import { MobileCartDrawer } from "@/components/portal/MobileCartDrawer";
import { MobileFilterSection } from "@/components/portal/MobileFilterSection";
import { MobileCardSkeleton, FilterSkeleton } from "@/components/portal/MobileCardSkeleton";
import { MobileSummaryCarousel, MobileSummaryCarouselSkeleton } from "@/components/portal/MobileSummaryCarousel";
import { QuickActions } from "@/components/portal/QuickActions";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users,
  DollarSign,
  CreditCard,
  GraduationCap,
  Sun,
  Receipt,
  AlertCircle,
  ChevronDown,
  Search,
  FileText,
  Ticket,
  Bus,
  PartyPopper,
  ShoppingCart
} from "lucide-react";
import { mockStudents, getMockDataForStudent, mockInvoices, mockCreditNotes, mockReceipts, campusList, mandatoryCourses, mockEventActivitiesData, mockCreditNoteHistory, mockUpcomingDeadlines } from "@/data/mockData";
import { CreditNoteHistory } from "@/components/portal/CreditNoteHistory";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface ParentPortalProps {
  onLogout: () => void;
  onGoToCart: () => void;
  onGoToCheckout: (data: any) => void;
  onGoToTripCart: (items: TripCartItem[]) => void;
  cartItems: any[];
  onAddToCart: (item: any) => boolean;
  onRemoveFromCart: (itemId: string, studentId?: string) => void;
  isInCart: (itemId: string, studentId?: string) => boolean;
  showCountdown?: boolean;
  onCountdownExpired?: () => void;
  onCancelCountdown?: () => void;
}

export const ParentPortal = ({ 
  onLogout, 
  onGoToCart, 
  onGoToCheckout, 
  onGoToTripCart,
  cartItems, 
  onAddToCart, 
  onRemoveFromCart, 
  isInCart,
  showCountdown = false,
  onCountdownExpired,
  onCancelCountdown
}: ParentPortalProps) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tuition' | 'afterschool' | 'summer' | 'event' | 'transaction'>('dashboard');
  const [transactionSubTab, setTransactionSubTab] = useState<'receipts' | 'creditNote'>('receipts');
  const [eventSubTab, setEventSubTab] = useState<'exam' | 'trip' | 'carnival'>('exam');
  const [selectedStudent, setSelectedStudent] = useState<string>(mockStudents[0]?.id.toString() || '1');
  const [currentCampus, setCurrentCampus] = useState<string>(mockStudents[0]?.campus || 'Pracha Uthit');
  const [paymentPeriod, setPaymentPeriod] = useState<'Yearly' | 'Termly'>('Yearly');
  const [selectedCamp, setSelectedCamp] = useState<any>(null);
  
  // Search states for each tab
  const [searchAfterSchool, setSearchAfterSchool] = useState('');
  const [searchSummer, setSearchSummer] = useState('');
  const [searchEvent, setSearchEvent] = useState('');
  const [searchExam, setSearchExam] = useState('');
  const [searchTrip, setSearchTrip] = useState('');
  const [filterDay, setFilterDay] = useState<string>("all");
  
  // Trip status management
  const [tripStatuses, setTripStatuses] = useState<Record<string, 'pending' | 'accepted' | 'declined' | 'paid'>>({});
  
  // Trip cart items
  const [tripCartItems, setTripCartItems] = useState<TripCartItem[]>([]);
  
  // Mobile cart drawer state
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cartBounce, setCartBounce] = useState(false);
  const [isWeeklyScheduleOpen, setIsWeeklyScheduleOpen] = useState(false);
  const prevCartCountRef = useRef(cartItems.length);
  const isMobile = useIsMobile();

  // Bounce animation when items are added to cart
  useEffect(() => {
    if (cartItems.length > prevCartCountRef.current) {
      setCartBounce(true);
      const timer = setTimeout(() => setCartBounce(false), 600);
      return () => clearTimeout(timer);
    }
    prevCartCountRef.current = cartItems.length;
  }, [cartItems.length]);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  
  const { t, language, formatCurrency } = useLanguage();

  // Get current student info to determine if they're SISB or non-SISB
  const currentStudentInfo = mockStudents.find(s => s.id.toString() === selectedStudent) || mockStudents[0];
  const isSISBStudent = currentStudentInfo?.isSISB ?? true;

  // Count course items in cart (excluding tuition)
  const courseItemsCount = cartItems.filter(item => item.type === 'course' || item.type === 'activity' || item.type === 'event' || item.type === 'exam').length;
  
  // Get combined data for all students
  const allInvoices = mockInvoices;
  const allCreditNotes = mockCreditNotes;
  const allReceipts = mockReceipts;
  
  // Calculate combined statistics
  const stats = {
    outstandingInvoices: allInvoices.filter(inv => inv.status === 'pending').length,
    paidThisTerm: allInvoices.filter(inv => inv.status === 'paid').length,
    creditBalance: allCreditNotes.reduce((sum, cn) => sum + cn.balance, 0),
    availableCourses: 15,
  };
  
  const outstandingAmount = allInvoices
    .filter(inv => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.amount_due, 0);
    
  const paidThisTerm = allReceipts
    .filter(rec => rec.status === 'completed')
    .reduce((sum, rec) => sum + rec.amount, 0);
    
  const overdueCount = 0;

  const handleAddToCart = (itemId: string, type: 'course' | 'activity' | 'event' | 'exam' | 'tuition', studentId?: string, configData?: any) => {
    let item: any;
    let studentInfo: { studentId?: string; studentName?: string } = {};
    
    if (type === 'tuition') {
      const invoice = mockInvoices.find(inv => inv.id === itemId);
      if (!invoice) return;
      
      // Find student info for tuition
      const student = mockStudents.find(s => s.id === invoice.student_id);
      if (student) {
        // Check campus validation
        if (cartItems.length > 0 && student.campus !== currentCampus) {
          toast({
            title: t('portal.campusMismatch') || 'Campus Mismatch',
            description: t('portal.campusMismatchDesc') || `Please switch to ${student.campus} campus or clear your cart`,
            variant: "destructive",
            duration: 4000,
          });
          return;
        }
        studentInfo = { studentId: student.id.toString(), studentName: student.name };
      }
      
      item = {
        id: itemId,
        name: invoice.description,
        price: invoice.amount_due,
        type,
        ...studentInfo
      };
    } else if (type === 'exam') {
      const studentData = getMockDataForStudent(parseInt(studentId || selectedStudent));
      const exam = studentData.examActivities.find((e: any) => e.id === itemId);
      
      if (!exam) return;
      
      // Find student info
      const currentStudent = mockStudents.find(s => s.id.toString() === studentId);
      if (currentStudent) {
        if (cartItems.length > 0 && currentStudent.campus !== currentCampus) {
          toast({
            title: t('portal.campusMismatch') || 'Campus Mismatch',
            description: t('portal.campusMismatchDesc') || `Please switch to ${currentStudent.campus} campus or clear your cart`,
            variant: "destructive",
            duration: 4000,
          });
          return;
        }
        studentInfo = { studentId: currentStudent.id.toString(), studentName: currentStudent.name };
      }
      
      item = {
        id: itemId,
        name: exam.name,
        price: configData?.totalPrice || exam.examPrice,
        type,
        category: 'exam',
        examRegistration: configData, // Store exam registration details
        ...studentInfo
      };
    } else {
      const studentData = getMockDataForStudent(parseInt(studentId || selectedStudent));
      
      // Check if it's from courses (after-school), summer activities, or events
      let course = studentData.courses.find((c: any) => c.id === itemId);
      let category = 'after-school';
      
      if (!course) {
        course = studentData.summerActivities.find((c: any) => c.id === itemId);
        category = 'summer';
      }
      
      if (!course) {
        course = studentData.eventActivities.find((c: any) => c.id === itemId);
        category = 'event';
      }
      
      if (!course) return;
      
      // Find student info for courses
      const currentStudent = mockStudents.find(s => s.id.toString() === studentId);
      if (currentStudent) {
        // Check campus validation
        if (cartItems.length > 0 && currentStudent.campus !== currentCampus) {
          toast({
            title: t('portal.campusMismatch') || 'Campus Mismatch',
            description: t('portal.campusMismatchDesc') || `Please switch to ${currentStudent.campus} campus or clear your cart`,
            variant: "destructive",
            duration: 4000,
          });
          return;
        }
        studentInfo = { studentId: currentStudent.id.toString(), studentName: currentStudent.name };
      }
      
      item = {
        id: itemId,
        name: course.name,
        price: configData?.totalPrice || course.price,
        type,
        category,
        campConfig: configData, // Store camp configuration if provided
        ...studentInfo
      };
    }
    
    const success = onAddToCart(item);
    if (success) {
      toast({
        title: `${item.name} ${t('portal.addedToCart')}`,
        description: `${item.studentName || ''} - ${type === 'exam' ? t('exam.registered') : t('portal.courseSelected')}`,
        duration: 2000,
      });
    }
  };

  const handleStudentChange = (student: typeof mockStudents[0]) => {
    setSelectedStudent(student.id.toString());
    setCurrentCampus(student.campus);
  };

  // Auto-switch tab when switching to non-SISB student
  useEffect(() => {
    if (!isSISBStudent && !['summer', 'event'].includes(activeTab)) {
      setActiveTab('summer');
    }
  }, [isSISBStudent, activeTab]);

  const handleRemoveFromCart = (itemId: string, studentId?: string) => {
    onRemoveFromCart(itemId, studentId);
  };

  const handleClearAllCart = (type: 'course' | 'activity' | 'event' | 'exam') => {
    const itemsToClear = cartItems.filter(item => item.type === type);
    itemsToClear.forEach(item => {
      onRemoveFromCart(item.id, item.studentId);
    });
    toast({
      title: language === 'th' ? 'ล้างรายการสำเร็จ' : 'Cart Cleared',
      description: language === 'th' ? 'ลบรายการทั้งหมดออกจากตะกร้าแล้ว' : 'All items removed from cart',
    });
  };

  const handleGoToCart = () => {
    onGoToCart();
  };

  const handleDownloadReceipt = (receiptId: string) => {
    // TODO: Implement PDF download
    toast({
      title: t('payment.downloadReceipt'),
      description: t('payment.downloadStarted'),
    });
  };
  
  // Filter functions for search
  const filterCourses = (courses: any[], searchQuery: string) => {
    if (!searchQuery.trim()) return courses;
    const query = searchQuery.toLowerCase();
    return courses.filter(course => 
      course.name.toLowerCase().includes(query) || 
      course.description?.toLowerCase().includes(query) ||
      course.vendor?.toLowerCase().includes(query)
    );
  };

  // Convert courses to calendar format
  const calendarCourses = useMemo(() => {
    const allCourses: any[] = [];
    
    mockStudents.forEach(student => {
      const studentData = getMockDataForStudent(student.id);
      
      [...studentData.courses, ...studentData.summerActivities, ...studentData.eventActivities].forEach(course => {
        // Parse schedule to extract days and times
        const scheduleMatch = course.schedule.match(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun).*?(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
        
        if (scheduleMatch) {
          const days = course.schedule.match(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/g) || [];
          const startHour = scheduleMatch[2];
          const startMin = scheduleMatch[3];
          const endHour = scheduleMatch[4];
          const endMin = scheduleMatch[5];
          
          days.forEach(day => {
            allCourses.push({
              id: `${course.id}-${day}`,
              originalCourseId: course.id,
              name: course.name,
              day: day,
              startTime: `${startHour.padStart(2, '0')}:${startMin}`,
              endTime: `${endHour.padStart(2, '0')}:${endMin}`,
              location: course.location,
              isInCart: isInCart(course.id, student.id.toString()),
              studentName: student.name,
              studentId: student.id.toString(),
              // Extended fields
              description: course.description,
              price: course.price,
              duration: course.duration,
              vendor: course.vendor,
              capacity: course.capacity,
              enrolled: course.enrolled,
            });
          });
        }
      });
    });
    
    return allCourses;
  }, [cartItems, isInCart]);

  // Convert mandatory courses to calendar format
  const calendarMandatoryCourses = useMemo(() => {
    const allMandatory: any[] = [];
    
    mandatoryCourses.forEach(course => {
      if (!course.schedule) return;
      
      const scheduleMatch = course.schedule.match(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun).*?(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
      
      if (scheduleMatch) {
        const days = course.schedule.match(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/g) || [];
        const startHour = scheduleMatch[2];
        const startMin = scheduleMatch[3];
        const endHour = scheduleMatch[4];
        const endMin = scheduleMatch[5];
        
        days.forEach(day => {
          allMandatory.push({
            id: `${course.id}-${day}`,
            originalCourseId: course.id,
            name: course.name,
            day: day,
            startTime: `${startHour.padStart(2, '0')}:${startMin}`,
            endTime: `${endHour.padStart(2, '0')}:${endMin}`,
            location: course.location,
            isMandatory: true,
            studentName: course.studentName,
            studentId: course.studentId,
            description: course.description,
            price: course.price,
          });
        });
      }
    });
    
    return allMandatory;
  }, []);

  // Students list for calendar filter
  const calendarStudents = useMemo(() => {
    return mockStudents.map(s => ({
      id: s.id.toString(),
      name: s.name,
      avatar: s.avatar
    }));
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
        <PortalHeader 
          onLogout={onLogout} 
          activeTab={activeTab}
          onTabChange={(tab: string) => setActiveTab(tab as 'dashboard' | 'tuition' | 'afterschool' | 'summer' | 'event' | 'transaction')}
          cartItemCount={cartItems.length}
          onGoToCart={handleGoToCart}
          showCountdown={showCountdown}
          onCountdownExpired={onCountdownExpired}
          onCancelCountdown={onCancelCountdown}
          additionalCourses={courseItemsCount}
        />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Campus Overview Banner with Student Switcher */}
        <div className="mb-6 p-3 sm:p-4 bg-gradient-to-r from-primary/10 to-education-blue/5 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className={`text-lg sm:text-xl font-bold truncate ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    {language === 'th' ? campusList.find(c => c.nameEn === currentCampus)?.name : currentCampus} Campus
                  </h2>
                </div>
                
                {/* Student Switcher Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent">
                      <div className="flex items-center gap-2">
                        <p className={`text-muted-foreground text-sm ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                          {mockStudents
                            .filter(s => s.campus === currentCampus)
                            .map((s, idx) => `${idx + 1}. ${s.name}`)
                            .join(', ')}
                        </p>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[280px]">
                    <DropdownMenuLabel className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
                      {language === 'th' ? 'เลือกนักเรียน / Campus' : 'Select Student / Campus'}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {mockStudents.map((student, index) => (
                      <DropdownMenuItem
                        key={student.id}
                        onClick={() => handleStudentChange(student)}
                        className={`cursor-pointer ${student.campus === currentCampus ? 'bg-primary/5' : ''}`}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <span className="text-lg">{student.avatar}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {index + 1}. {student.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {student.class}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {language === 'th' ? campusList.find(c => c.nameEn === student.campus)?.name : student.campus}
                              </span>
                            </div>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
          </div>
            <div className="hidden md:block">
              <ChildrenOverview />
            </div>
          </div>
          {cartItems.length > 0 && (
            <div className="mt-2 p-2 bg-primary/5 rounded-md">
              <p className={`text-xs text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {language === 'th' 
                  ? `📌 ตอนนี้คุณกำลังเพิ่มรายการสำหรับ ${currentCampus} Campus เท่านั้น หากต้องการเปลี่ยน Campus กรุณาเปลี่ยนนักเรียน`
                  : `📌 Currently adding items for ${currentCampus} Campus only. Switch student to change campus.`}
              </p>
            </div>
          )}
        </div>


        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'dashboard' | 'tuition' | 'afterschool' | 'summer' | 'event' | 'transaction')} className="space-y-6">
          {/* Desktop Navigation - Tabs */}
          <TabsList className={`hidden md:grid w-full gap-1 ${isSISBStudent ? 'grid-cols-6' : 'grid-cols-3'}`}>
            {isSISBStudent && (
              <TabsTrigger value="dashboard" className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
                <GraduationCap className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">{t('portal.dashboard')}</span>
              </TabsTrigger>
            )}
            {isSISBStudent && (
              <TabsTrigger value="tuition" className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
                <DollarSign className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">{t('portal.tuition')}</span>
              </TabsTrigger>
            )}
            {isSISBStudent && (
              <TabsTrigger value="afterschool" className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
                <Clock className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">ECA & EAS</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="summer" className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
              <Sun className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">{t('portal.summer')}</span>
            </TabsTrigger>
            <TabsTrigger value="event" className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
              <Calendar className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">{language === 'th' ? 'กิจกรรม' : language === 'zh' ? '活动' : 'Event'}</span>
            </TabsTrigger>
            {isSISBStudent && (
              <TabsTrigger value="transaction" className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
                <Receipt className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">{t('portal.transactionHistory')}</span>
              </TabsTrigger>
            )}
          </TabsList>

          {/* Mobile Horizontal Scrollable Tabs */}
          <div className="md:hidden overflow-x-auto pb-2 -mx-4 px-4">
            <div className="flex gap-2 min-w-max">
              {isSISBStudent && (
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === 'dashboard' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  } ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                >
                  <GraduationCap className="h-4 w-4" />
                  Dashboard
                </button>
              )}
              {isSISBStudent && (
                <button
                  onClick={() => setActiveTab('tuition')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === 'tuition' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  } ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                >
                  <DollarSign className="h-4 w-4" />
                  {t('portal.tuition')}
                </button>
              )}
              {isSISBStudent && (
                <button
                  onClick={() => setActiveTab('afterschool')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === 'afterschool' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  } ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                >
                  <Clock className="h-4 w-4" />
                  ECA & EAS
                </button>
              )}
              <button
                onClick={() => setActiveTab('summer')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === 'summer' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                } ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              >
                <Sun className="h-4 w-4" />
                Camp
              </button>
              <button
                onClick={() => setActiveTab('event')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === 'event' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                } ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              >
                <Calendar className="h-4 w-4" />
                Event
              </button>
              {isSISBStudent && (
                <button
                  onClick={() => setActiveTab('transaction')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === 'transaction' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  } ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                >
                  <Receipt className="h-4 w-4" />
                  {language === 'th' ? 'ประวัติ' : 'History'}
                </button>
              )}
            </div>
          </div>

          {/* Dashboard Tab - Combined data for all students with student tags */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Summary Stats - Mobile Swipeable Carousel or Desktop Grid */}
            {isMobile ? (
              isLoading ? (
                <MobileSummaryCarouselSkeleton />
              ) : (
                <MobileSummaryCarousel
                  cards={[
                    {
                      id: 'total-due',
                      title: language === 'th' ? 'รวมยอดค้างชำระ' : 'Total Due',
                      value: formatCurrency(outstandingAmount),
                      subtitle: `${allInvoices.filter(i => i.status === 'pending').length} ${t('portal.pending')}`,
                      icon: DollarSign,
                      color: overdueCount > 0 ? 'destructive' : 'warning',
                      badge: allInvoices.filter(i => i.status === 'pending').length || undefined,
                      onClick: () => setActiveTab('tuition')
                    },
                    {
                      id: 'credit-note',
                      title: language === 'th' ? 'ใบลดหนี้' : 'Credit Note',
                      value: formatCurrency(stats.creditBalance),
                      subtitle: t('portal.availableCredit'),
                      icon: Ticket,
                      color: 'info',
                      onClick: () => setActiveTab('tuition')
                    },
                    {
                      id: 'receipts',
                      title: language === 'th' ? 'ใบเสร็จรับเงิน' : 'View Receipts',
                      value: allReceipts.length.toString(),
                      subtitle: language === 'th' ? 'ใบเสร็จทั้งหมด' : 'Total Receipts',
                      icon: Receipt,
                      color: 'success',
                      onClick: () => setActiveTab('transaction')
                    }
                  ]}
                />
              )
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <SummaryBox
                  title={language === 'th' ? 'รวมยอดค้างชำระ' : language === 'zh' ? '总应付' : 'Total Due'}
                  value={formatCurrency(outstandingAmount)}
                  subtitle={`${allInvoices.filter(i => i.status === 'pending').length} ${t('portal.pending')}`}
                  icon={FileText}
                  color={overdueCount > 0 ? 'destructive' : 'warning'}
                  onClick={() => setActiveTab('tuition')}
                />
                
                <SummaryBox
                  title={language === 'th' ? 'ใบลดหนี้' : 'Credit Note'}
                  value={formatCurrency(stats.creditBalance)}
                  subtitle={t('portal.availableCredit')}
                  icon={Ticket}
                  color="info"
                  onClick={() => setActiveTab('tuition')}
                />
                
                <SummaryBox
                  title={language === 'th' ? 'ใบเสร็จรับเงิน' : 'View Receipts'}
                  value={allReceipts.length}
                  subtitle={language === 'th' ? 'ใบเสร็จทั้งหมด' : 'Total Receipts'}
                  icon={Receipt}
                  color="success"
                  onClick={() => setActiveTab('transaction')}
                />
              </div>
            )}

            {/* Quick Actions */}
            <QuickActions
              onPayNow={() => setActiveTab('tuition')}
              onRegisterActivities={() => setActiveTab('afterschool')}
              onRegisterCamp={() => setActiveTab('summer')}
              onViewEvents={() => setActiveTab('event')}
              onViewReceipts={() => setActiveTab('transaction')}
              hasPendingPayments={allInvoices.filter(i => i.status === 'pending').length > 0}
              isMobile={isMobile}
            />

            {/* Upcoming Deadlines - Grouped by Type */}
            <Card>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  <AlertCircle className="h-5 w-5" />
                  {t('portal.upcomingDeadlines')}
                </CardTitle>
                <CardDescription className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
                  {t('portal.importantDates')} {t('portal.allStudents')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const getTypeIcon = (type: string) => {
                    switch (type) {
                      case 'tuition': return DollarSign;
                      case 'eca': return Clock;
                      case 'trip': return Bus;
                      case 'camp': return Sun;
                      case 'exam': return FileText;
                      case 'event': return PartyPopper;
                      default: return Calendar;
                    }
                  };
                  const getTypeBadgeColor = (type: string) => {
                    switch (type) {
                      case 'tuition': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300';
                      case 'eca': return 'bg-blue-500/20 text-blue-700 dark:text-blue-300';
                      case 'trip': return 'bg-green-500/20 text-green-700 dark:text-green-300';
                      case 'camp': return 'bg-orange-500/20 text-orange-700 dark:text-orange-300';
                      case 'exam': return 'bg-purple-500/20 text-purple-700 dark:text-purple-300';
                      case 'event': return 'bg-pink-500/20 text-pink-700 dark:text-pink-300';
                      default: return 'bg-muted text-muted-foreground';
                    }
                  };
                  const getTypeLabel = (type: string) => {
                    switch (type) {
                      case 'tuition': return language === 'th' ? 'ค่าเทอม' : language === 'zh' ? '学费' : 'Tuition';
                      case 'eca': return 'ECA';
                      case 'trip': return language === 'th' ? 'ทริป' : language === 'zh' ? '旅行' : 'Trip';
                      case 'camp': return language === 'th' ? 'แคมป์' : language === 'zh' ? '夏令营' : 'Camp';
                      case 'exam': return language === 'th' ? 'สอบ' : language === 'zh' ? '考试' : 'Exam';
                      case 'event': return language === 'th' ? 'กิจกรรม' : language === 'zh' ? '活动' : 'Event';
                      default: return type;
                    }
                  };
                  const handleDeadlineClick = (type: string) => {
                    switch (type) {
                      case 'tuition': setActiveTab('tuition'); break;
                      case 'eca': setActiveTab('afterschool'); break;
                      case 'trip': setActiveTab('event'); setEventSubTab('trip'); break;
                      case 'camp': setActiveTab('summer'); break;
                      case 'exam': setActiveTab('event'); setEventSubTab('exam'); break;
                      case 'event': setActiveTab('event'); break;
                      default: break;
                    }
                  };

                  // Group deadlines by type
                  const groupedDeadlines = mockUpcomingDeadlines.reduce((acc, deadline) => {
                    if (!acc[deadline.type]) {
                      acc[deadline.type] = [];
                    }
                    acc[deadline.type].push(deadline);
                    return acc;
                  }, {} as Record<string, typeof mockUpcomingDeadlines>);

                  // Sort each group by due date
                  Object.keys(groupedDeadlines).forEach(type => {
                    groupedDeadlines[type].sort((a, b) => 
                      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
                    );
                  });

                  // Define type order for consistent display
                  const typeOrder = ['tuition', 'eca', 'trip', 'camp', 'exam', 'event'];
                  const sortedTypes = typeOrder.filter(type => groupedDeadlines[type]?.length > 0);

                  if (mockUpcomingDeadlines.length === 0) {
                    return (
                      <div className="text-center py-8 text-muted-foreground">
                        <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
                          {language === 'th' ? 'ไม่มีรายการค้างชำระ' : 'No pending invoices'}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <Accordion type="multiple" className="w-full space-y-2">
                      {sortedTypes.map((type) => {
                        const deadlines = groupedDeadlines[type];
                        const TypeIcon = getTypeIcon(type);
                        const totalAmount = deadlines.reduce((sum, d) => sum + d.amount, 0);

                        return (
                          <AccordionItem 
                            key={type} 
                            value={type} 
                            className="border rounded-lg px-1"
                          >
                            <AccordionTrigger className="px-3 py-3 hover:no-underline">
                              <div className="flex items-center justify-between w-full pr-2">
                                <div className="flex items-center gap-3">
                                  <TypeIcon className="h-5 w-5 text-muted-foreground" />
                                  <span className={`font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                    {getTypeLabel(type)}
                                  </span>
                                  <Badge variant="secondary" className="text-xs">
                                    {deadlines.length}
                                  </Badge>
                                </div>
                                <Badge className={`${getTypeBadgeColor(type)}`}>
                                  {formatCurrency(totalAmount)}
                                </Badge>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-3 pb-3">
                              <div className="space-y-2">
                                {deadlines.map((deadline, index) => (
                                  <div 
                                    key={deadline.id} 
                                    className={cn(
                                      "flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted/50 rounded-lg gap-2 cursor-pointer hover:bg-muted/70 transition-colors",
                                      isMobile && "animate-stagger-in opacity-0"
                                    )}
                                    style={isMobile ? { animationDelay: `${index * 60}ms` } : undefined}
                                    onClick={() => handleDeadlineClick(deadline.type)}
                                  >
                                    <div className="min-w-0 flex-1">
                                      <p className={`font-medium text-sm ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                        {deadline.title}
                                      </p>
                                      <p className={`text-xs text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                        {deadline.studentName} • {t('portal.due')}: {new Date(deadline.dueDate).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <Badge variant="outline" className="self-start sm:self-center">
                                      {formatCurrency(deadline.amount)}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tuition Tab - Split into 70% invoice list and 30% cart */}
          <TabsContent value="tuition" className="space-y-0">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
              {/* Left 70% - Invoice List */}
              <div className="lg:col-span-7 space-y-4">
                {/* Payment Period Selector */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <Label className={`text-base font-semibold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {language === 'th' ? 'เลือกรูปแบบการชำระเงิน' : language === 'zh' ? '选择付款方式' : 'Select Payment Period'}
                      </Label>
                      <RadioGroup 
                        value={paymentPeriod} 
                        onValueChange={(value) => setPaymentPeriod(value as 'Yearly' | 'Termly')}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Yearly" id="yearly" />
                          <Label htmlFor="yearly" className={`cursor-pointer ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                            {language === 'th' ? 'รายปี' : language === 'zh' ? '年度' : 'Yearly'}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Termly" id="termly" />
                          <Label htmlFor="termly" className={`cursor-pointer ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                            {language === 'th' ? 'รายเทอม' : language === 'zh' ? '学期' : 'Termly'}
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>

                {allInvoices.filter(invoice => invoice.type === paymentPeriod).map(invoice => {
                  const student = mockStudents.find(s => s.id === invoice.student_id);
                  const creditNote = allCreditNotes.find(cn => cn.student_id === invoice.student_id);
                  return (
                    <div key={invoice.id} className="space-y-2">
                      {/* Student identification tag */}
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                          {student?.name} - {student?.class}
                        </Badge>
                      </div>
                      <InvoiceCard
                        invoice={invoice}
                        creditBalance={creditNote?.balance || 0}
                        onAddToCart={(invoiceId) => handleAddToCart(invoiceId, 'tuition')}
                        studentName={student?.name}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Right 30% - Tuition Cart Sidebar - Hidden on Mobile */}
              <div className="hidden lg:block lg:col-span-3">
                <TuitionCartSidebar
                  items={cartItems.filter(item => item.type === 'tuition').map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    studentName: item.studentName,
                    studentId: item.studentId
                  }))}
                  onRemoveItem={handleRemoveFromCart}
                  onCheckout={handleGoToCart}
                  campus={currentCampus}
                />
              </div>
            </div>
          </TabsContent>

          {/* After School Tab - 70/30 Split */}
          <TabsContent value="afterschool" className="space-y-0">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
              {/* Left 70% - Course List */}
              <div className="lg:col-span-7 space-y-4">
                {/* Student Filter and Search - Desktop */}
                {!isMobile && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className={`text-sm font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {t('portal.studentFilter')}:
                      </span>
                      <StudentFilter 
                        onStudentChange={handleStudentChange}
                        selectedStudent={mockStudents.find(s => s.id.toString() === selectedStudent) || mockStudents[0]}
                      />
                      
                      <Select value={filterDay} onValueChange={setFilterDay}>
                        <SelectTrigger className={`w-[200px] h-10 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                          <SelectValue placeholder={language === 'th' ? 'กรองตามวัน' : 'Filter by Day'} />
                        </SelectTrigger>
                        <SelectContent className="bg-background/95 backdrop-blur-sm border z-50">
                          <SelectItem value="all">{language === 'th' ? 'ทุกวัน' : 'All Days'}</SelectItem>
                          <SelectItem value="Mon">{language === 'th' ? 'จันทร์' : 'Monday'}</SelectItem>
                          <SelectItem value="Tue">{language === 'th' ? 'อังคาร' : 'Tuesday'}</SelectItem>
                          <SelectItem value="Wed">{language === 'th' ? 'พุธ' : 'Wednesday'}</SelectItem>
                          <SelectItem value="Thu">{language === 'th' ? 'พฤหัสบดี' : 'Thursday'}</SelectItem>
                          <SelectItem value="Fri">{language === 'th' ? 'ศุกร์' : 'Friday'}</SelectItem>
                          <SelectItem value="Sat">{language === 'th' ? 'เสาร์' : 'Saturday'}</SelectItem>
                          <SelectItem value="Sun">{language === 'th' ? 'อาทิตย์' : 'Sunday'}</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {/* Search Input */}
                      <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder={language === 'th' ? 'ค้นหากิจกรรม...' : 'Search activities...'}
                          value={searchAfterSchool}
                          onChange={(e) => setSearchAfterSchool(e.target.value)}
                          className={`pl-10 h-10 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Mobile Filter Section */}
                {isMobile && (
                  <MobileFilterSection
                    searchValue={searchAfterSchool}
                    onSearchChange={setSearchAfterSchool}
                    selectedStudent={mockStudents.find(s => s.id.toString() === selectedStudent)}
                    onStudentChange={handleStudentChange}
                    dayFilter={filterDay}
                    onDayFilterChange={setFilterDay}
                    showDayFilter={true}
                    showStudentFilter={true}
                    searchPlaceholder={language === 'th' ? 'ค้นหากิจกรรม...' : 'Search activities...'}
                    showWeeklyScheduleButton={true}
                    onToggleWeeklySchedule={() => setIsWeeklyScheduleOpen(!isWeeklyScheduleOpen)}
                    isWeeklyScheduleOpen={isWeeklyScheduleOpen}
                  />
                )}
                
                {/* Course Cards with Loading State */}
                {isLoading && isMobile ? (
                  <MobileCardSkeleton variant="course" count={4} />
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {filterCourses(getMockDataForStudent(parseInt(selectedStudent)).courses, searchAfterSchool)
                      .filter(course => filterDay === 'all' || course.day === filterDay)
                      .map((course, index) => (
                        <div 
                          key={course.id}
                          className={isMobile ? "animate-stagger-in opacity-0" : ""}
                          style={isMobile ? { animationDelay: `${index * 50}ms` } : undefined}
                        >
                          <CourseCard
                            course={course}
                            isCamp={false}
                            isInCart={isInCart(course.id, selectedStudent)}
                            onAddToCart={(id) => handleAddToCart(id, 'course', selectedStudent)}
                            onRemoveFromCart={() => handleRemoveFromCart(course.id, selectedStudent)}
                          />
                        </div>
                      ))}
                  </div>
                )}
                
                {/* No results message */}
                {filterCourses(getMockDataForStudent(parseInt(selectedStudent)).courses, searchAfterSchool).filter(course => filterDay === 'all' || course.day === filterDay).length === 0 && (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                    <p className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                      {language === 'th' ? 'ไม่พบกิจกรรมที่ค้นหา' : 'No activities found'}
                    </p>
                  </div>
                )}
              </div>

              {/* Right 30% - Course Cart Sidebar - Hidden on Mobile */}
              <div className="hidden lg:block lg:col-span-3">
                <CourseCartSidebar
                  items={cartItems.filter(item => item.type === 'course').map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    studentName: item.studentName,
                    studentId: item.studentId,
                    type: item.type
                  }))}
                  onRemoveItem={handleRemoveFromCart}
                  onCheckout={handleGoToCart}
                  onClearAll={() => handleClearAllCart('course')}
                  campus={currentCampus}
                  cartType="course"
                />
              </div>
            </div>
          </TabsContent>

          {/* Summer Activities Tab - 70/30 Split */}
          <TabsContent value="summer" className="space-y-0">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
              {/* Left 70% - Activity List */}
              <div className="lg:col-span-7 space-y-4">
                {/* Student Filter and Search - Desktop */}
                {!isMobile && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <span className={`text-sm font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {t('portal.studentFilter')}:
                      </span>
                      <StudentFilter 
                        onStudentChange={handleStudentChange}
                        selectedStudent={mockStudents.find(s => s.id.toString() === selectedStudent) || mockStudents[0]}
                      />
                    </div>
                    
                    {/* Search Input */}
                    <div className="relative flex-1 w-full sm:max-w-xs">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder={language === 'th' ? 'ค้นหาค่ายกิจกรรม...' : 'Search camps...'}
                        value={searchSummer}
                        onChange={(e) => setSearchSummer(e.target.value)}
                        className={`pl-10 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                      />
                    </div>
                  </div>
                )}

                {/* Mobile Filter Section */}
                {isMobile && (
                  <MobileFilterSection
                    searchValue={searchSummer}
                    onSearchChange={setSearchSummer}
                    selectedStudent={mockStudents.find(s => s.id.toString() === selectedStudent)}
                    onStudentChange={handleStudentChange}
                    showDayFilter={false}
                    showStudentFilter={true}
                    searchPlaceholder={language === 'th' ? 'ค้นหาค่ายกิจกรรม...' : 'Search camps...'}
                  />
                )}
                
                {/* Camp Cards with Loading State */}
                {isLoading && isMobile ? (
                  <MobileCardSkeleton variant="course" count={4} />
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {filterCourses(getMockDataForStudent(parseInt(selectedStudent)).summerActivities, searchSummer).map((activity, index) => (
                      <div 
                        key={activity.id}
                        className={isMobile ? "animate-stagger-in opacity-0" : ""}
                        style={isMobile ? { animationDelay: `${index * 50}ms` } : undefined}
                      >
                        <CourseCard
                          course={activity}
                          isCamp={true}
                          isInCart={isInCart(activity.id, selectedStudent)}
                          onAddToCart={(id, campConfig) => handleAddToCart(id, 'activity', selectedStudent, campConfig)}
                          onRemoveFromCart={() => handleRemoveFromCart(activity.id, selectedStudent)}
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {/* No results message */}
                {searchSummer && filterCourses(getMockDataForStudent(parseInt(selectedStudent)).summerActivities, searchSummer).length === 0 && (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                    <p className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                      {language === 'th' ? 'ไม่พบค่ายกิจกรรมที่ค้นหา' : 'No camps found'}
                    </p>
                  </div>
                )}
              </div>

              {/* Right 30% - Camp Cart Sidebar - Hidden on Mobile */}
              <div className="hidden lg:block lg:col-span-3">
                <CourseCartSidebar
                  items={cartItems.filter(item => item.type === 'activity').map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    studentName: item.studentName,
                    studentId: item.studentId,
                    type: item.type
                  }))}
                  onRemoveItem={handleRemoveFromCart}
                  onCheckout={handleGoToCart}
                  onClearAll={() => handleClearAllCart('activity')}
                  campus={currentCampus}
                  cartType="camp"
                />
              </div>
            </div>
          </TabsContent>

          {/* Event Tab - with submenu for Exam, Trip, and Carnivals & Concerts */}
          <TabsContent value="event" className="space-y-6">
            {/* Submenu Tabs - Mobile Scrollable */}
            <div className="flex gap-1 border-b overflow-x-auto pb-0.5">
              <button
                onClick={() => setEventSubTab('exam')}
                className={`px-4 py-2 text-sm font-medium transition-colors relative flex items-center gap-2 ${
                  eventSubTab === 'exam' 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                } ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              >
                <FileText className="h-4 w-4" />
                {t('portal.eventExam')}
                {eventSubTab === 'exam' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
              <button
                onClick={() => setEventSubTab('trip')}
                className={`px-4 py-2 text-sm font-medium transition-colors relative flex items-center gap-2 ${
                  eventSubTab === 'trip' 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                } ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              >
                <Bus className="h-4 w-4" />
                {t('portal.eventTrip')}
                {eventSubTab === 'trip' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
              <button
                onClick={() => setEventSubTab('carnival')}
                className={`px-4 py-2 text-sm font-medium transition-colors relative flex items-center gap-2 ${
                  eventSubTab === 'carnival' 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                } ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              >
                <PartyPopper className="h-4 w-4" />
                {t('portal.eventCarnival')}
                {eventSubTab === 'carnival' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            </div>

            {/* Exam Sub-tab */}
            {eventSubTab === 'exam' && (
              <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                {/* Left 70% - Exam List */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Student Filter and Search - Desktop */}
                  {!isMobile && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <span className={`text-sm font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                          {t('portal.studentFilter')}:
                        </span>
                        <StudentFilter 
                          onStudentChange={handleStudentChange}
                          selectedStudent={mockStudents.find(s => s.id.toString() === selectedStudent) || mockStudents[0]}
                        />
                      </div>
                      
                      {/* Search Input */}
                      <div className="relative flex-1 w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder={language === 'th' ? 'ค้นหาการสอบ...' : 'Search exams...'}
                          value={searchExam}
                          onChange={(e) => setSearchExam(e.target.value)}
                          className={`pl-10 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Mobile Filter Section */}
                  {isMobile && (
                    <MobileFilterSection
                      searchValue={searchExam}
                      onSearchChange={setSearchExam}
                      selectedStudent={mockStudents.find(s => s.id.toString() === selectedStudent)}
                      onStudentChange={handleStudentChange}
                      showDayFilter={false}
                      showStudentFilter={true}
                      searchPlaceholder={language === 'th' ? 'ค้นหาการสอบ...' : 'Search exams...'}
                    />
                  )}
                  
                  {/* Exam Cards with Loading State */}
                  {isLoading && isMobile ? (
                    <MobileCardSkeleton variant="exam" count={4} />
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {filterCourses(getMockDataForStudent(parseInt(selectedStudent)).examActivities, searchExam).map((exam: any, index: number) => (
                        <div 
                          key={exam.id}
                          className={isMobile ? "animate-stagger-in opacity-0" : ""}
                          style={isMobile ? { animationDelay: `${index * 50}ms` } : undefined}
                        >
                          <ExamCard
                            exam={exam}
                            isInCart={isInCart(exam.id, selectedStudent)}
                            onAddToCart={(id, registrationData) => handleAddToCart(id, 'exam', selectedStudent, registrationData)}
                            onRemoveFromCart={() => handleRemoveFromCart(exam.id, selectedStudent)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* No results message */}
                  {searchExam && filterCourses(getMockDataForStudent(parseInt(selectedStudent)).examActivities, searchExam).length === 0 && (
                    <div className="text-center py-12">
                      <Search className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                      <p className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {language === 'th' ? 'ไม่พบการสอบที่ค้นหา' : 'No exams found'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right 30% - Exam Cart Sidebar - Hidden on Mobile */}
                <div className="hidden lg:block lg:col-span-3">
                  <CourseCartSidebar
                    items={cartItems.filter(item => item.type === 'exam').map(item => ({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      studentName: item.studentName,
                      studentId: item.studentId,
                      type: item.type
                    }))}
                    onRemoveItem={handleRemoveFromCart}
                    onCheckout={handleGoToCart}
                    onClearAll={() => handleClearAllCart('exam' as any)}
                    campus={currentCampus}
                    cartType="exam"
                  />
                </div>
              </div>
            )}

            {/* Trip Sub-tab */}
            {eventSubTab === 'trip' && (
              <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                {/* Left 70% - Trip Cards */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Student Filter and Search - Desktop */}
                  {!isMobile && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <span className={`text-sm font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                          {t('portal.studentFilter')}:
                        </span>
                        <StudentFilter 
                          onStudentChange={handleStudentChange}
                          selectedStudent={mockStudents.find(s => s.id.toString() === selectedStudent) || mockStudents[0]}
                        />
                      </div>
                      
                      {/* Search Input */}
                      <div className="relative flex-1 w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder={t('trip.searchTrips')}
                          value={searchTrip}
                          onChange={(e) => setSearchTrip(e.target.value)}
                          className={`pl-10 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Mobile Filter Section */}
                  {isMobile && (
                    <MobileFilterSection
                      searchValue={searchTrip}
                      onSearchChange={setSearchTrip}
                      selectedStudent={mockStudents.find(s => s.id.toString() === selectedStudent)}
                      onStudentChange={handleStudentChange}
                      showDayFilter={false}
                      showStudentFilter={true}
                      searchPlaceholder={language === 'th' ? 'ค้นหาทัศนศึกษา...' : 'Search trips...'}
                    />
                  )}
                  
                  {/* Trip Cards with Loading State */}
                  {isLoading && isMobile ? (
                    <MobileCardSkeleton variant="trip" count={4} />
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {filterCourses(getMockDataForStudent(parseInt(selectedStudent)).tripActivities, searchTrip).map((trip: any, index: number) => {
                        const tripStatus = tripStatuses[trip.id] || trip.status;
                        const currentStudent = mockStudents.find(s => s.id.toString() === selectedStudent);
                        
                        return (
                          <div 
                            key={trip.id}
                            className={isMobile ? "animate-stagger-in opacity-0" : ""}
                            style={isMobile ? { animationDelay: `${index * 50}ms` } : undefined}
                          >
                            <TripCard
                              trip={{ ...trip, status: tripStatus } as Trip}
                              onAccept={(tripId) => {
                                setTripStatuses(prev => ({ ...prev, [tripId]: 'accepted' }));
                                // Add to trip cart
                                setTripCartItems(prev => [
                                  ...prev.filter(item => item.id !== tripId), // Remove if exists
                                  {
                                    id: tripId,
                                    name: trip.name,
                                    price: trip.price,
                                    studentName: currentStudent?.name || '',
                                    studentId: selectedStudent,
                                    date: trip.date,
                                    location: trip.location
                                  }
                                ]);
                                toast({
                                  title: language === 'th' ? 'ยืนยันเข้าร่วมแล้ว' : 'Trip Accepted',
                                  description: language === 'th' ? 'เพิ่มในตะกร้าทัศนศึกษาแล้ว' : 'Added to Trip Cart',
                                });
                              }}
                              onDecline={(tripId) => {
                                setTripStatuses(prev => ({ ...prev, [tripId]: 'declined' }));
                                toast({
                                  title: language === 'th' ? 'ไม่เข้าร่วม' : 'Trip Declined',
                                  description: language === 'th' ? 'คุณสามารถเปลี่ยนใจได้ก่อนวันกำหนด' : 'You can change your decision before the deadline',
                                });
                              }}
                              onCancel={(tripId) => {
                                setTripStatuses(prev => ({ ...prev, [tripId]: 'pending' }));
                                setTripCartItems(prev => prev.filter(item => item.id !== tripId));
                                toast({
                                  title: language === 'th' ? 'ยกเลิกแล้ว' : 'Trip Cancelled',
                                  description: language === 'th' ? 'ลบออกจากตะกร้าทัศนศึกษาแล้ว' : 'Removed from Trip Cart',
                                });
                              }}
                              onChangeDecision={(tripId) => {
                                setTripStatuses(prev => ({ ...prev, [tripId]: 'pending' }));
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  {/* No results message */}
                  {searchTrip && filterCourses(getMockDataForStudent(parseInt(selectedStudent)).tripActivities, searchTrip).length === 0 && (
                    <div className="text-center py-12">
                      <Search className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                      <p className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {t('trip.noTripsFound')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right 30% - Trip Cart Sidebar - Hidden on Mobile */}
                <div className="hidden lg:block lg:col-span-3">
                  <TripCartSidebar
                    items={tripCartItems}
                    onRemoveItem={(tripId) => {
                      setTripStatuses(prev => ({ ...prev, [tripId]: 'pending' }));
                      setTripCartItems(prev => prev.filter(item => item.id !== tripId));
                      toast({
                        title: language === 'th' ? 'ยกเลิกแล้ว' : 'Trip Cancelled',
                        description: language === 'th' ? 'ลบออกจากตะกร้าทัศนศึกษาแล้ว' : 'Removed from Trip Cart',
                      });
                    }}
                    onCheckout={() => {
                      toast({
                        title: language === 'th' ? 'กำลังไปหน้าชำระเงิน' : 'Proceeding to Payment',
                        description: `${tripCartItems.length} ${language === 'th' ? 'รายการ' : 'trips selected'}`,
                      });
                      onGoToTripCart(tripCartItems);
                    }}
                    onClearAll={() => {
                      tripCartItems.forEach(item => {
                        setTripStatuses(prev => ({ ...prev, [item.id]: 'pending' }));
                      });
                      setTripCartItems([]);
                      toast({
                        title: language === 'th' ? 'ล้างรายการสำเร็จ' : 'Cart Cleared',
                        description: language === 'th' ? 'ลบรายการทั้งหมดออกจากตะกร้าแล้ว' : 'All trips removed from cart',
                      });
                    }}
                    campus={currentCampus}
                  />
                </div>
              </div>
            )}

            {/* Carnivals & Concerts Sub-tab - Empty State */}
            {eventSubTab === 'carnival' && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="p-6 bg-muted/30 rounded-full mb-6">
                  <PartyPopper className="h-16 w-16 text-muted-foreground" />
                </div>
                <h3 className={`text-2xl font-semibold mb-3 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {t('portal.eventCarnival')}
                </h3>
                <p className={`text-muted-foreground max-w-md ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {t('carnival.stayTuned')}
                </p>
                <Badge variant="secondary" className="mt-4">
                  {t('carnival.comingSoon')}
                </Badge>
              </div>
            )}
          </TabsContent>

          {/* Transaction History Tab - with submenu for Receipts and Credit Note */}
          <TabsContent value="transaction" className="space-y-6">
            {/* Submenu Tabs */}
            <div className="flex gap-1 border-b">
              <button
                onClick={() => setTransactionSubTab('receipts')}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  transactionSubTab === 'receipts' 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                } ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              >
                {t('portal.receipts')}
                {transactionSubTab === 'receipts' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
              <button
                onClick={() => setTransactionSubTab('creditNote')}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  transactionSubTab === 'creditNote' 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                } ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              >
                {t('creditNote.title')}
                {transactionSubTab === 'creditNote' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            </div>

            {/* Receipts Sub-tab */}
            {transactionSubTab === 'receipts' && (
              <ReceiptList 
                receipts={allReceipts}
                onDownload={handleDownloadReceipt}
              />
            )}

            {/* Credit Note Sub-tab */}
            {transactionSubTab === 'creditNote' && (
              <CreditNoteHistory creditNotes={mockCreditNoteHistory} />
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Weekly Calendar View - Fixed Footer (Desktop: always show when afterschool, Mobile: controlled by toggle) */}
      {activeTab === 'afterschool' && (!isMobile || isWeeklyScheduleOpen) && (
        <WeeklyCalendarView 
          courses={calendarCourses} 
          mandatoryCourses={calendarMandatoryCourses}
          students={calendarStudents}
          onAddToCart={(courseId, studentId) => handleAddToCart(courseId, 'course', studentId)}
          onRemoveFromCart={handleRemoveFromCart}
          isMobile={isMobile}
          onClose={() => setIsWeeklyScheduleOpen(false)}
        />
      )}

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as 'dashboard' | 'tuition' | 'afterschool' | 'summer' | 'event' | 'transaction')}
        cartItemCount={cartItems.length}
        isSISBStudent={isSISBStudent}
        onToggleWeeklySchedule={() => setIsWeeklyScheduleOpen(!isWeeklyScheduleOpen)}
        isWeeklyScheduleOpen={isWeeklyScheduleOpen}
      />

      {/* Mobile Cart Drawer */}
      <MobileCartDrawer
        isOpen={mobileCartOpen}
        onOpenChange={setMobileCartOpen}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleGoToCart}
        onClearAll={() => {
          cartItems.forEach(item => handleRemoveFromCart(item.id, item.studentId));
        }}
      />

      {/* Mobile Floating Cart Button - Always visible */}
      {isMobile && (
        <button
          onClick={() => setMobileCartOpen(true)}
          className={cn(
            "fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 animate-scale-in",
            cartItems.length > 0 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-muted-foreground opacity-70 hover:opacity-100 hover:bg-primary hover:text-primary-foreground",
            cartBounce && "animate-bounce"
          )}
        >
          <ShoppingCart className={cn("h-6 w-6", cartBounce && "animate-ping")} />
          {cartItems.length > 0 && (
            <Badge 
              variant="destructive" 
              className={cn(
                "absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs font-bold",
                cartBounce && "animate-bounce"
              )}
            >
              {cartItems.length > 99 ? '99+' : cartItems.length}
            </Badge>
          )}
        </button>
      )}
    </div>
  );
};