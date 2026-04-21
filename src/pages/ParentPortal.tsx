import { useState } from "react";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { ChildrenOverview } from "@/components/portal/ChildrenOverview";
import { SummaryBox } from "@/components/portal/SummaryBox";
import { InvoiceCard } from "@/components/portal/InvoiceCard";
import { CourseCard } from "@/components/portal/CourseCard";
import { ExamCard } from "@/components/portal/ExamCard";
import { ExamRegistrationModal, ExamRegistration } from "@/components/portal/ExamRegistrationModal";
import { TripCard } from "@/components/portal/TripCard";
import { TripRegistrationModal, TripRegistrationData } from "@/components/portal/TripRegistrationModal";
import { ReceiptList } from "@/components/portal/ReceiptList";
import { StudentFilter } from "@/components/portal/StudentFilter";
import { CountdownTimer } from "@/components/portal/CountdownTimer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Search,
  X,
  Download
} from "lucide-react";
import { BahtIcon } from "@/components/icons/BahtIcon";
import { mockStudents, getMockDataForStudent, mockInvoices, mockCreditNotes, mockReceipts, mockExams, mockTrips, mockTripRegistrations, Exam, Trip } from "@/data/mockData";
import { downloadReceiptPDF } from "@/lib/downloadUtils";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface ParentPortalProps {
  onLogout: () => void;
  onGoToCart: () => void;
  onGoToCheckout: (data: any) => void;
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
  cartItems, 
  onAddToCart, 
  onRemoveFromCart, 
  isInCart,
  showCountdown = false,
  onCountdownExpired,
  onCancelCountdown
}: ParentPortalProps) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tuition' | 'eca-eas' | 'camp' | 'event-exam' | 'trip' | 'receipts'>('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<string>(mockStudents[0]?.id.toString() || '1');

  // Tuition tab state
  const [tuitionStudent, setTuitionStudent] = useState(mockStudents[0]);

  // ECA & Camp tab state
  const [ecaSearch, setEcaSearch] = useState('');
  const [campSearch, setCampSearch] = useState('');

  // Exam tab state
  const [examStudentId, setExamStudentId] = useState<string>(mockStudents[0]?.id.toString() || '1');
  const [examSearch, setExamSearch] = useState('');
  const [examModalOpen, setExamModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  // Trip tab state
  const [tripStudentId, setTripStudentId] = useState<string>(mockStudents[0]?.id.toString() || '1');
  const [tripSearch, setTripSearch] = useState('');
  const [tripModalOpen, setTripModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const { t, language, formatCurrency } = useLanguage();
  
  // Get combined data for all students
  const allInvoices = mockInvoices;
  const allCreditNotes = mockCreditNotes;
  const allReceipts = mockReceipts;
  
  // Calculate combined statistics
  const stats = {
    outstandingInvoices: allInvoices.filter(inv => inv.status === 'pending').length,
    paidThisTerm: allInvoices.filter(inv => inv.status === 'paid').length,
    creditBalance: allCreditNotes.reduce((sum, cn) => sum + cn.balance, 0),
  };
  
  const outstandingAmount = allInvoices
    .filter(inv => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.amount_due, 0);
    
  const paidThisTerm = allReceipts
    .filter(rec => rec.status === 'completed')
    .reduce((sum, rec) => sum + rec.amount, 0);
    
  const overdueCount = 0;

  const handleAddToCart = (itemId: string, type: 'course' | 'activity' | 'tuition', studentId?: string, customItem?: any) => {
    let item: any;
    let studentInfo: { studentId?: string; studentName?: string } = {};
    
    if (type === 'tuition') {
      if (customItem) {
        // Use the custom item passed from InvoiceCard with payment option details
        item = customItem;
      } else {
        const invoice = mockInvoices.find(inv => inv.id === itemId);
        if (!invoice) return;
        
        // Find student info for tuition
        const student = mockStudents.find(s => s.id === invoice.student_id);
        if (student) {
          studentInfo = { studentId: student.id.toString(), studentName: student.name };
        }
        
        item = {
          id: itemId,
          name: invoice.description,
          price: invoice.amount_due,
          type,
          ...studentInfo
        };
      }
    } else {
      const studentData = getMockDataForStudent(parseInt(studentId || selectedStudent));
      
      // Check if it's from courses (after-school) or summer activities
      let course = studentData.courses.find(c => c.id === itemId);
      let category = 'after-school';
      
      if (!course) {
        course = studentData.summerActivities.find(c => c.id === itemId);
        category = 'summer';
      }
      
      if (!course) return;
      
      // Find student info for courses
      const currentStudent = mockStudents.find(s => s.id.toString() === studentId);
      if (currentStudent) {
        studentInfo = { studentId: currentStudent.id.toString(), studentName: currentStudent.name };
      }
      
      item = {
        id: itemId,
        name: course.name,
        price: course.price,
        type,
        category,
        ...studentInfo
      };
    }
    
    const success = onAddToCart(item);
    if (success) {
      toast({
        title: `${item.name} ${t('portal.addedToCart')}`,
        description: `${item.studentName || ''} - ${t('portal.courseSelected')}`,
        duration: 2000,
      });
    }
  };

  const handleRemoveFromCart = (itemId: string, studentId?: string) => {
    onRemoveFromCart(itemId, studentId);
  };

  const handleExamRegistration = (reg: ExamRegistration) => {
    const student = mockStudents.find(s => s.id.toString() === examStudentId);
    const item = {
      id: `${reg.examId}-${examStudentId}-${Date.now()}`,
      name: reg.examName,
      price: reg.price,
      type: 'exam' as const,
      studentId: examStudentId,
      studentName: student?.name,
    };
    const success = onAddToCart(item);
    if (success) {
      toast({ title: `${reg.examName} ${t('portal.addedToCart')}`, duration: 2000 });
      setExamModalOpen(false);
    }
  };

  const handleTripRegistration = (data: TripRegistrationData) => {
    const student = mockStudents.find(s => s.id.toString() === tripStudentId);
    const item = {
      id: `${data.tripId}-${tripStudentId}-${Date.now()}`,
      name: data.tripName[language] ?? data.tripName.en,
      price: data.price,
      type: 'trip' as const,
      studentId: tripStudentId,
      studentName: student?.name,
    };
    const success = onAddToCart(item);
    if (success) {
      toast({ title: `${item.name} ${t('portal.addedToCart')}`, duration: 2000 });
      setTripModalOpen(false);
    }
  };

  const examCartItems = cartItems.filter((item: any) => item.type === 'exam');

  const filteredExams = mockExams.filter(exam => {
    const student = mockStudents.find(s => s.id.toString() === examStudentId);
    const gradeMatch = !student || exam.eligibleGrades.includes(student.class);
    const searchMatch = !examSearch || exam.name.toLowerCase().includes(examSearch.toLowerCase());
    return gradeMatch && searchMatch;
  });

  const handleGoToCart = () => {
    onGoToCart();
  };

  const handleDownloadReceipt = (receiptId: string) => {
    const receipt = mockReceipts.find(r => r.id === receiptId);
    const tripReg = mockTripRegistrations.find(r => r.id === receiptId);

    if (receipt) {
      downloadReceiptPDF({
        title: 'Payment Receipt',
        receiptId: receipt.id,
        studentName: mockStudents.find(s => mockInvoices.find(i => i.id === receipt.invoice_id)?.student_id === s.id)?.name ?? 'Student',
        amount: formatCurrency(receipt.amount),
        paymentDate: new Date(receipt.paid_at).toLocaleDateString(),
        paymentMethod: receipt.payment_method.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
        description: receipt.description,
        referenceNumber: receipt.reference_number,
      });
    } else if (tripReg) {
      downloadReceiptPDF({
        title: 'Trip Registration Receipt',
        receiptId: tripReg.id,
        studentName: tripReg.studentName,
        amount: formatCurrency(tripReg.price),
        paymentDate: new Date(tripReg.registeredAt).toLocaleDateString(),
        paymentMethod: 'Paid',
        description: `${tripReg.tripName.en} — ${tripReg.destination.en}`,
      });
    } else {
      downloadReceiptPDF({
        title: 'Payment Receipt',
        receiptId,
        studentName: 'Student',
        amount: '-',
        paymentDate: new Date().toLocaleDateString(),
        paymentMethod: '-',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
        <PortalHeader 
          onLogout={onLogout} 
          activeTab={activeTab}
          onTabChange={(tab: string) => setActiveTab(tab as 'dashboard' | 'tuition' | 'eca-eas' | 'camp' | 'event-exam' | 'trip' | 'receipts')}
          cartItemCount={cartItems.length}
          onGoToCart={handleGoToCart}
          showCountdown={showCountdown}
          onCountdownExpired={onCountdownExpired}
          onCancelCountdown={onCancelCountdown}
        />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Children Overview Banner */}
        <div className="mb-6 p-3 sm:p-4 bg-gradient-to-r from-primary/10 to-education-blue/5 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-primary" />
              <div className="min-w-0 flex-1">
                <h2 className={`text-lg sm:text-xl font-bold truncate ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {t('portal.allStudents')} ({mockStudents.length} {t('portal.items')})
                </h2>
                <p className={`text-muted-foreground text-sm truncate ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {mockStudents.map(s => s.name).join(', ')}
                </p>
              </div>
            </div>
            <ChildrenOverview activeTab={activeTab} />
          </div>
        </div>


        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'dashboard' | 'tuition' | 'eca-eas' | 'camp' | 'event-exam' | 'trip' | 'receipts')} className="space-y-6">
          {/* Desktop Navigation - Tabs */}
          <TabsList className="hidden md:grid w-full grid-cols-7 gap-1">
            <TabsTrigger value="dashboard" className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
              <GraduationCap className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">{t('portal.dashboard')}</span>
            </TabsTrigger>
            <TabsTrigger value="tuition" className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
              <DollarSign className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">{t('portal.tuition')}</span>
            </TabsTrigger>
            <TabsTrigger value="eca-eas" className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
              <Clock className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">{t('portal.ecaEas')}</span>
            </TabsTrigger>
            <TabsTrigger value="camp" className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
              <Sun className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">{t('portal.camp')}</span>
            </TabsTrigger>
            <TabsTrigger value="event-exam" className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
              <Calendar className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">{t('portal.eventExam')}</span>
            </TabsTrigger>
            <TabsTrigger value="trip" className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
              <MapPin className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">{t('portal.trip')}</span>
            </TabsTrigger>
            <TabsTrigger value="receipts" className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
              <Receipt className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">{t('portal.receipts')}</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <SummaryBox
                title={t('portal.outstandingInvoices')}
                value={formatCurrency(outstandingAmount)}
                subtitle={`${allInvoices.filter(i => i.status === 'pending').length} ${t('portal.pending')}`}
                icon={BahtIcon}
                color={overdueCount > 0 ? 'destructive' : 'warning'}
              />
              <SummaryBox
                title={t('portal.paidThisTerm')}
                value={formatCurrency(paidThisTerm)}
                subtitle={t('portal.completedPayments')}
                icon={CreditCard}
                color="success"
              />
              <SummaryBox
                title={t('portal.creditBalance')}
                value={formatCurrency(stats.creditBalance)}
                subtitle={t('portal.availableCredit')}
                icon={Receipt}
                color="info"
              />
            </div>

            {/* Upcoming Deadlines */}
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
                <div className="space-y-3">
                  {allInvoices
                    .filter(inv => inv.status === 'pending')
                    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
                    .slice(0, 5)
                    .map(invoice => {
                      const student = mockStudents.find(s => s.id === invoice.student_id);
                      return (
                        <div key={invoice.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted/50 rounded-lg gap-2">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className={`font-medium text-sm sm:text-base truncate ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {invoice.description}
                              </p>
                              <p className={`text-xs sm:text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {student?.name} • {t('portal.due')}: {new Date(invoice.due_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant="default" className="self-start sm:self-center">
                            {formatCurrency(invoice.amount_due)}
                          </Badge>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tuition Tab */}
          <TabsContent value="tuition" className="space-y-6">
            <div className="flex items-center gap-4">
              <span className={`text-sm font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {t('portal.filterByStudent')}:
              </span>
              <StudentFilter
                selectedStudent={tuitionStudent}
                onStudentChange={(s) => setTuitionStudent(s)}
              />
            </div>
            <div className="grid gap-4">
              {allInvoices.filter(inv => inv.student_id === tuitionStudent?.id).map(invoice => {
                const student = mockStudents.find(s => s.id === invoice.student_id);
                const creditNote = allCreditNotes.find(cn => cn.student_id === invoice.student_id);
                return (
                  <InvoiceCard
                    key={invoice.id}
                    invoice={invoice}
                    creditBalance={creditNote?.balance || 0}
                    isInCart={isInCart(invoice.id)}
                    initialPaymentOption={cartItems.find(i => i.id === invoice.id)?.paymentOption || ''}
                    onRemoveFromCart={(invoiceId) => onRemoveFromCart(invoiceId, student?.id.toString())}
                    onAddToCart={(invoiceId, paymentOption, amount) => {
                      const invoiceItem = {
                        id: invoiceId,
                        name: invoice.description,
                        price: amount || invoice.amount_due,
                        type: 'tuition',
                        studentId: tuitionStudent?.id.toString(),
                        studentName: student?.name,
                        paymentOption: paymentOption,
                        originalAmount: invoice.amount_due
                      };
                      handleAddToCart(invoiceId, 'tuition', tuitionStudent?.id.toString(), invoiceItem);
                    }}
                    studentName={student?.name}
                  />
                );
              })}
            </div>
          </TabsContent>

          {/* ECA & EAS Tab */}
          <TabsContent value="eca-eas" className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`text-sm font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {t('portal.studentFilter')}:
              </span>
              <StudentFilter
                onStudentChange={(student) => setSelectedStudent(student.id.toString())}
                selectedStudent={mockStudents.find(s => s.id.toString() === selectedStudent) || mockStudents[0]}
              />
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className={`pl-9 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                  placeholder={language === 'th' ? 'ค้นหากิจกรรม…' : language === 'zh' ? '搜索活动…' : 'Search activities…'}
                  value={ecaSearch}
                  onChange={(e) => setEcaSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {getMockDataForStudent(parseInt(selectedStudent)).courses
                .filter(c => c.name.toLowerCase().includes(ecaSearch.toLowerCase()))
                .map(course => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    isInCart={isInCart(course.id, selectedStudent)}
                    onAddToCart={() => handleAddToCart(course.id, 'course', selectedStudent)}
                    onRemoveFromCart={() => handleRemoveFromCart(course.id, selectedStudent)}
                  />
                ))}
            </div>
          </TabsContent>

          {/* Camp Tab */}
          <TabsContent value="camp" className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`text-sm font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {t('portal.studentFilter')}:
              </span>
              <StudentFilter
                onStudentChange={(student) => setSelectedStudent(student.id.toString())}
                selectedStudent={mockStudents.find(s => s.id.toString() === selectedStudent) || mockStudents[0]}
              />
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className={`pl-9 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                  placeholder={language === 'th' ? 'ค้นหากิจกรรม…' : language === 'zh' ? '搜索活动…' : 'Search activities…'}
                  value={campSearch}
                  onChange={(e) => setCampSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {getMockDataForStudent(parseInt(selectedStudent)).summerActivities
                .filter(a => a.name.toLowerCase().includes(campSearch.toLowerCase()))
                .map(activity => (
                  <CourseCard
                    key={activity.id}
                    course={activity}
                    isInCart={isInCart(activity.id, selectedStudent)}
                    onAddToCart={() => handleAddToCart(activity.id, 'activity', selectedStudent)}
                    onRemoveFromCart={() => handleRemoveFromCart(activity.id, selectedStudent)}
                  />
                ))}
            </div>
          </TabsContent>

          {/* Event & Exam Tab */}
          <TabsContent value="event-exam" className="space-y-4">
            <div className="space-y-4">
              {/* Filter row */}
              <div className="flex flex-wrap items-center gap-3">
                <span className={`text-sm font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {t('portal.studentFilter')}:
                </span>
                <StudentFilter
                  onStudentChange={(student) => setExamStudentId(student.id.toString())}
                  selectedStudent={mockStudents.find(s => s.id.toString() === examStudentId) || mockStudents[0]}
                />
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className={`pl-9 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                    placeholder={language === 'th' ? 'ค้นหาการสอบ…' : language === 'zh' ? '搜索考试…' : 'Search exams…'}
                    value={examSearch}
                    onChange={(e) => setExamSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Exam Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredExams.map(exam => (
                  <ExamCard
                    key={exam.id}
                    exam={exam}
                    isInCart={examCartItems.some((item: any) => item.id.startsWith(exam.id))}
                    onRegister={(exam) => {
                      setSelectedExam(exam);
                      setExamModalOpen(true);
                    }}
                  />
                ))}
                {filteredExams.length === 0 && (
                  <div className="col-span-2 flex items-center justify-center py-16 text-muted-foreground">
                    <p className={`text-sm ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                      {language === 'th' ? 'ไม่พบการสอบ' : language === 'zh' ? '未找到考试' : 'No exams found'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <ExamRegistrationModal
              exam={selectedExam}
              open={examModalOpen}
              onOpenChange={setExamModalOpen}
              onSubmit={handleExamRegistration}
            />
          </TabsContent>

          {/* Trip Tab */}
          <TabsContent value="trip" className="space-y-6">
            {/* Student Filter + Search */}
            <div className="flex flex-wrap items-center gap-3">
              <span className={`text-sm font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {t('portal.studentFilter')}:
              </span>
              <StudentFilter
                onStudentChange={(student) => setTripStudentId(student.id.toString())}
                selectedStudent={mockStudents.find(s => s.id.toString() === tripStudentId) || mockStudents[0]}
              />
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className={`pl-9 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                  placeholder={language === 'th' ? 'ค้นหาทัศนศึกษา…' : language === 'zh' ? '搜索旅行…' : 'Search trips…'}
                  value={tripSearch}
                  onChange={(e) => setTripSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Available Trips */}
            <div className="space-y-3">
              <h2 className={`text-lg font-semibold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {language === 'th' ? 'ทัศนศึกษาที่เปิดรับสมัคร' : language === 'zh' ? '可报名考察活动' : 'Available Trips'}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {(() => {
                  const student = mockStudents.find(s => s.id.toString() === tripStudentId);
                  const filtered = mockTrips
                    .filter(trip => !student || trip.eligibleGrades.includes(student.class))
                    .filter(trip => trip.name.en.toLowerCase().includes(tripSearch.toLowerCase()) || trip.destination.en.toLowerCase().includes(tripSearch.toLowerCase()))
                    .sort((a, b) => {
                      const order = { open: 0, full: 1, closed: 2 };
                      return order[a.status] - order[b.status];
                    });
                  if (filtered.length === 0) {
                    return (
                      <div className="col-span-2 flex items-center justify-center py-12 text-muted-foreground">
                        <p className={`text-sm ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                          {language === 'th' ? 'ไม่มีทัศนศึกษาสำหรับนักเรียนคนนี้' : language === 'zh' ? '暂无适合该学生的考察活动' : 'No trips available for this student'}
                        </p>
                      </div>
                    );
                  }
                  return filtered.map(trip => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      isInCart={cartItems.some((item: any) => item.type === 'trip' && item.id.startsWith(trip.id))}
                      isRegistered={mockTripRegistrations.some(r => r.tripId === trip.id && r.studentId.toString() === tripStudentId)}
                      onRegister={(trip) => {
                        setSelectedTrip(trip);
                        setTripModalOpen(true);
                      }}
                    />
                  ));
                })()}
              </div>
            </div>

            {/* My Registered Trips */}
            <div className="space-y-3">
              <h2 className={`text-lg font-semibold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {language === 'th' ? 'ทัศนศึกษาที่ลงทะเบียนแล้ว' : language === 'zh' ? '已注册考察活动' : 'My Registered Trips'}
              </h2>
              {(() => {
                const registrations = mockTripRegistrations.filter(r => r.studentId.toString() === tripStudentId);
                if (registrations.length === 0) {
                  return (
                    <div className="flex items-center justify-center py-8 text-muted-foreground border rounded-lg">
                      <p className={`text-sm ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {language === 'th' ? 'ยังไม่มีทัศนศึกษาที่ลงทะเบียน' : language === 'zh' ? '尚无已注册的考察活动' : 'No registered trips yet'}
                      </p>
                    </div>
                  );
                }
                return (
                  <div className="space-y-2">
                    {registrations.map(reg => {
                      const statusColors: Record<string, string> = {
                        paid: 'bg-finance-green/10 text-finance-green',
                        pending: 'bg-warning-orange/10 text-warning-orange',
                        overdue: 'bg-destructive/10 text-destructive',
                      };
                      const statusLabels: Record<string, string> = {
                        paid: language === 'th' ? 'ชำระแล้ว' : language === 'zh' ? '已付款' : 'Paid',
                        pending: language === 'th' ? 'รอชำระ' : language === 'zh' ? '待付款' : 'Pending',
                        overdue: language === 'th' ? 'เกินกำหนด' : language === 'zh' ? '已逾期' : 'Overdue',
                      };
                      const s = new Date(reg.startDate);
                      const e = new Date(reg.endDate);
                      const locale = language === 'th' ? 'th-TH' : language === 'zh' ? 'zh-CN' : 'en-US';
                      const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
                      const dateRange = reg.startDate === reg.endDate
                        ? s.toLocaleDateString(locale, opts)
                        : `${s.toLocaleDateString(locale, opts)} – ${e.toLocaleDateString(locale, opts)}`;
                      return (
                        <div key={reg.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg">
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <p className={`font-medium text-sm leading-tight ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                              {reg.tripName[language] ?? reg.tripName.en}
                            </p>
                            <p className={`text-xs text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                              {reg.destination[language] ?? reg.destination.en} • {dateRange}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className={`font-semibold text-sm ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                              {formatCurrency(reg.price)}
                            </span>
                            <Badge className={`text-xs ${statusColors[reg.paymentStatus]} ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                              {statusLabels[reg.paymentStatus]}
                            </Badge>
                            {reg.paymentStatus === 'paid' && reg.receiptUrl && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleDownloadReceipt(reg.id)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            <TripRegistrationModal
              trip={selectedTrip}
              open={tripModalOpen}
              onOpenChange={setTripModalOpen}
              onSubmit={handleTripRegistration}
            />
          </TabsContent>

          {/* Receipts Tab - Combined data with student identification */}
          <TabsContent value="receipts" className="space-y-6">
            <ReceiptList 
              receipts={allReceipts}
              onDownload={handleDownloadReceipt}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};