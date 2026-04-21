import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye, GraduationCap, Clock, Sun, CheckCircle, XCircle, AlertCircle, FlaskConical, MapPin } from "lucide-react";
import { mockStudents, getMockDataForStudent, mockSummerActivities, mockExams, mockTripRegistrations } from "@/data/mockData";
import { useLanguage } from "@/contexts/LanguageContext";

interface ChildrenOverviewProps {
  activeTab?: string;
}

export const ChildrenOverview = ({ activeTab = 'dashboard' }: ChildrenOverviewProps) => {
  const [open, setOpen] = useState(false);
  const { t, language } = useLanguage();

  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const getEnrollmentStatus = (studentId: number) => {
    const studentData = getMockDataForStudent(studentId);
    const { invoices, courses } = studentData;

    let tuitionStatus: 'paid' | 'pending' | 'none' = 'none';
    if (invoices.length > 0) {
      const hasPaidInvoice = invoices.find(inv => inv.status === 'paid');
      tuitionStatus = hasPaidInvoice ? 'paid' : 'pending';
    }

    const afterschoolActivities = courses.filter(course =>
      (studentId === 1 && ['course-002'].includes(course.id)) ||
      (studentId === 2 && ['course-001', 'course-003'].includes(course.id)) ||
      (studentId === 3 && ['course-004'].includes(course.id))
    );

    const summerActivities = mockSummerActivities.filter(activity =>
      (studentId === 1 && ['summer-001'].includes(activity.id)) ||
      (studentId === 2 && ['summer-002', 'summer-003'].includes(activity.id)) ||
      (studentId === 3 && ['summer-001'].includes(activity.id))
    );

    // Simulate exam registrations per student
    const registeredExamIds: Record<number, string[]> = {
      1: ['exam-001', 'exam-003'],
      2: ['exam-002'],
      3: ['exam-004', 'exam-005'],
    };
    const exams = mockExams.filter(e => (registeredExamIds[studentId] ?? []).includes(e.id));

    // Trip registrations from real mock data
    const trips = mockTripRegistrations.filter(r => r.studentId === studentId);

    return { tuitionStatus, afterschoolActivities, summerActivities, exams, trips };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4 text-finance-green" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-warning-orange" />;
      default: return <XCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className={`bg-finance-green/20 text-finance-green ${fontClass}`}>{t('portal.paid')}</Badge>;
      case 'pending':
        return <Badge className={`bg-warning-orange/20 text-warning-orange ${fontClass}`}>{t('portal.pendingStatus')}</Badge>;
      default:
        return <Badge variant="outline" className={fontClass}>{t('portal.noInvoice')}</Badge>;
    }
  };

  const paymentStatusBadge = (status: 'paid' | 'pending' | 'overdue') => {
    if (status === 'paid') return <Badge className={`bg-finance-green/20 text-finance-green ${fontClass}`}>{t('invoice.paid')}</Badge>;
    if (status === 'overdue') return <Badge className={`bg-destructive/20 text-destructive ${fontClass}`}>{t('invoice.overdue')}</Badge>;
    return <Badge className={`bg-warning-orange/20 text-warning-orange ${fontClass}`}>{t('invoice.pending')}</Badge>;
  };

  const showAll = activeTab === 'dashboard';
  const showTuition = showAll || activeTab === 'tuition';
  const showECA = showAll || activeTab === 'eca-eas';
  const showCamp = showAll || activeTab === 'camp';
  const showExam = showAll || activeTab === 'event-exam';
  const showTrip = showAll || activeTab === 'trip';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={`gap-2 ${fontClass}`}>
          <Eye className="h-4 w-4" />
          {t('portal.viewAllChildren')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${fontClass}`}>
            <GraduationCap className="h-5 w-5" />
            {t('portal.childrenOverviewTitle')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {mockStudents.map((student) => {
            const enrollment = getEnrollmentStatus(student.id);

            return (
              <Card key={student.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
                        {getInitials(student.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className={`text-lg ${fontClass}`}>{student.name}</CardTitle>
                      <p className={`text-sm text-muted-foreground ${fontClass}`}>{student.class} • {student.year}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Tuition */}
                  {showTuition && (
                    <div className="space-y-2">
                      <div className={`flex items-center gap-2 ${fontClass}`}>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                          <GraduationCap className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium">{t('portal.tuitionStatus')}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className={`flex items-center gap-2 ${fontClass}`}>
                          {getStatusIcon(enrollment.tuitionStatus)}
                          <span>{t('portal.academicYear')}</span>
                        </div>
                        {getStatusBadge(enrollment.tuitionStatus)}
                      </div>
                    </div>
                  )}

                  {/* After School Activities */}
                  {showECA && (
                    <div className="space-y-2">
                      <div className={`flex items-center gap-2 ${fontClass}`}>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium">{t('portal.afterSchoolActivities')}</span>
                      </div>
                      {enrollment.afterschoolActivities.length > 0 ? (
                        <div className="space-y-2">
                          {enrollment.afterschoolActivities.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <div>
                                <span className={`font-medium ${fontClass}`}>{activity.name}</span>
                                <p className={`text-sm text-muted-foreground ${fontClass}`}>{activity.schedule}</p>
                              </div>
                              <Badge className={`bg-finance-green/20 text-finance-green ${fontClass}`}>{t('invoice.paid')}</Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={`p-3 bg-muted/50 rounded-lg text-center text-muted-foreground ${fontClass}`}>
                          {t('portal.noAfterSchoolEnrolled')}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Summer Activities */}
                  {showCamp && (
                    <div className="space-y-2">
                      <div className={`flex items-center gap-2 ${fontClass}`}>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                          <Sun className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium">{t('portal.summerActivities')}</span>
                      </div>
                      {enrollment.summerActivities.length > 0 ? (
                        <div className="space-y-2">
                          {enrollment.summerActivities.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <div>
                                <span className={`font-medium ${fontClass}`}>{activity.name}</span>
                                <p className={`text-sm text-muted-foreground ${fontClass}`}>{activity.schedule}</p>
                              </div>
                              <Badge className={`bg-finance-green/20 text-finance-green ${fontClass}`}>{t('invoice.paid')}</Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={`p-3 bg-muted/50 rounded-lg text-center text-muted-foreground ${fontClass}`}>
                          {t('portal.noSummerEnrolled')}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Exams */}
                  {showExam && (
                    <div className="space-y-2">
                      <div className={`flex items-center gap-2 ${fontClass}`}>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center">
                          <FlaskConical className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium">
                          {language === 'th' ? 'การสอบที่ลงทะเบียน' : language === 'zh' ? '已注册考试' : 'Registered Exams'}
                        </span>
                      </div>
                      {enrollment.exams.length > 0 ? (
                        <div className="space-y-2">
                          {enrollment.exams.map((exam) => (
                            <div key={exam.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <div>
                                <span className={`font-medium ${fontClass}`}>{exam.name}</span>
                                <p className={`text-sm text-muted-foreground ${fontClass}`}>{exam.date} · {exam.time}</p>
                              </div>
                              <Badge className={`bg-finance-green/20 text-finance-green ${fontClass}`}>{t('invoice.paid')}</Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={`p-3 bg-muted/50 rounded-lg text-center text-muted-foreground ${fontClass}`}>
                          {language === 'th' ? 'ยังไม่มีการลงทะเบียนสอบ' : language === 'zh' ? '暂无注册考试' : 'No exams registered'}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Trips */}
                  {showTrip && (
                    <div className="space-y-2">
                      <div className={`flex items-center gap-2 ${fontClass}`}>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium">
                          {language === 'th' ? 'ทัศนศึกษาที่ลงทะเบียน' : language === 'zh' ? '已注册旅行' : 'Registered Trips'}
                        </span>
                      </div>
                      {enrollment.trips.length > 0 ? (
                        <div className="space-y-2">
                          {enrollment.trips.map((reg) => (
                            <div key={reg.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <div>
                                <span className={`font-medium ${fontClass}`}>{reg.tripName[language] ?? reg.tripName.en}</span>
                                <p className={`text-sm text-muted-foreground ${fontClass}`}>{reg.startDate} – {reg.endDate}</p>
                              </div>
                              {paymentStatusBadge(reg.paymentStatus)}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={`p-3 bg-muted/50 rounded-lg text-center text-muted-foreground ${fontClass}`}>
                          {language === 'th' ? 'ยังไม่มีการลงทะเบียนทัศนศึกษา' : language === 'zh' ? '暂无注册旅行' : 'No trips registered'}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
