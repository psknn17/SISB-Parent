import { useState } from "react";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { ChildrenOverview } from "@/components/portal/ChildrenOverview";
import { SummaryBox } from "@/components/portal/SummaryBox";
import { InvoiceCard } from "@/components/portal/InvoiceCard";
import { CourseCard } from "@/components/portal/CourseCard";
import { ReceiptList } from "@/components/portal/ReceiptList";
import { StudentFilter } from "@/components/portal/StudentFilter";
import { CountdownTimer } from "@/components/portal/CountdownTimer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  AlertCircle
} from "lucide-react";
import { mockStudents, getMockDataForStudent, mockInvoices, mockCreditNotes, mockReceipts } from "@/data/mockData";
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tuition' | 'afterschool' | 'summer' | 'receipts'>('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<string>(mockStudents[0]?.id.toString() || '1');
  
  
  
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
    availableCourses: 15,
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

  return (
    <div className="min-h-screen bg-background">
        <PortalHeader 
          onLogout={onLogout} 
          activeTab={activeTab}
          onTabChange={(tab: string) => setActiveTab(tab as 'dashboard' | 'tuition' | 'afterschool' | 'summer' | 'receipts')}
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
            <ChildrenOverview />
          </div>
        </div>


        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'dashboard' | 'tuition' | 'afterschool' | 'summer' | 'receipts')} className="space-y-6">
          {/* Desktop Navigation - Tabs */}
          <TabsList className="hidden md:grid w-full grid-cols-5 gap-1">
            <TabsTrigger value="dashboard" className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
              <GraduationCap className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">{t('portal.dashboard')}</span>
            </TabsTrigger>
            <TabsTrigger value="tuition" className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
              <DollarSign className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">{t('portal.tuition')}</span>
            </TabsTrigger>
            <TabsTrigger value="afterschool" className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
              <Clock className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">{t('portal.afterSchool')}</span>
            </TabsTrigger>
            <TabsTrigger value="summer" className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
              <Sun className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">{t('portal.summer')}</span>
            </TabsTrigger>
            <TabsTrigger value="receipts" className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
              <Receipt className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">{t('portal.receipts')}</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab - Combined data for all students with student tags */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Summary Stats - Combined across all students */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <SummaryBox
                title={t('portal.outstandingInvoices')}
                value={formatCurrency(outstandingAmount)}
                subtitle={`${allInvoices.filter(i => i.status === 'pending').length} ${t('portal.pending')}`}
                icon={DollarSign}
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
              
              <SummaryBox
                title={t('portal.availableCourses')}
                value={stats.availableCourses}
                subtitle={t('portal.coursesWithSpots')}
                icon={GraduationCap}
                color="education"
              />
            </div>

            {/* Upcoming Deadlines - Combined with student identification */}
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

          {/* Tuition Tab - Combined data with student identification */}
          <TabsContent value="tuition" className="space-y-6">
            <div className="grid gap-4">
              {allInvoices.map(invoice => {
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
                      onAddToCart={(invoiceId, paymentOption, amount) => {
                        const invoiceItem = {
                          id: invoiceId,
                          name: invoice.description,
                          price: amount || invoice.amount_due,
                          type: 'tuition',
                          studentId: selectedStudent,
                          studentName: student?.name,
                          paymentOption: paymentOption,
                          originalAmount: invoice.amount_due
                        };
                        handleAddToCart(invoiceId, 'tuition', selectedStudent, invoiceItem);
                      }}
                      studentName={student?.name}
                    />
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* After School Tab - Filtered by selected student */}
          <TabsContent value="afterschool" className="space-y-6">
            {/* Student Filter */}
            <div className="flex items-center gap-4">
              <span className={`text-sm font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {t('portal.studentFilter')}:
              </span>
              <StudentFilter 
                onStudentChange={(student) => setSelectedStudent(student.id.toString())}
                selectedStudent={mockStudents.find(s => s.id.toString() === selectedStudent) || mockStudents[0]}
              />
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {getMockDataForStudent(parseInt(selectedStudent)).courses.map(course => (
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

          {/* Summer Activities Tab - Filtered by selected student */}
          <TabsContent value="summer" className="space-y-6">
            {/* Student Filter */}
            <div className="flex items-center gap-4">
              <span className={`text-sm font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {t('portal.studentFilter')}:
              </span>
              <StudentFilter 
                onStudentChange={(student) => setSelectedStudent(student.id.toString())}
                selectedStudent={mockStudents.find(s => s.id.toString() === selectedStudent) || mockStudents[0]}
              />
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {getMockDataForStudent(parseInt(selectedStudent)).summerActivities.map(activity => (
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