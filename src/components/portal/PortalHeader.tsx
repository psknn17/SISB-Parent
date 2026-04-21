import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, LogOut, Bell, DollarSign, Clock, Sun, Receipt, ShoppingCart, ChevronDown, Calendar, MapPin } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ParentAccountSelector } from "./ParentAccountSelector";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CountdownTimer } from "./CountdownTimer";
import { mockStudents } from "@/data/mockData";

interface PortalHeaderProps {
  onLogout?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  cartItemCount?: number;
  onGoToCart?: () => void;
  showCountdown?: boolean;
  onCountdownExpired?: () => void;
  onCancelCountdown?: () => void;
}

export const PortalHeader = ({ 
  onLogout, 
  activeTab = "dashboard", 
  onTabChange, 
  cartItemCount = 0, 
  onGoToCart,
  showCountdown = false,
  onCountdownExpired,
  onCancelCountdown
}: PortalHeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const selectedCampus = mockStudents[0]?.campus ?? "CM";
  const { t, language } = useLanguage();

  const allCampusOptions = [
    { value: "CM", label: "CM – Chiang Mai" },
    { value: "NB", label: "NB – Nonthaburi" },
    { value: "PU", label: "PU – Phuket" },
    { value: "RY", label: "RY – Rayong" },
    { value: "SV", label: "SV – Suvarnabhumi" },
    { value: "TB", label: "TB – Thonburi" },
  ];

  const studentCampuses = new Set(mockStudents.map(s => s.campus));
  const campusOptions = allCampusOptions.filter(c => studentCampuses.has(c.value));
  
  // Mock notification data
  const notifications = {
    tuitionPayment: [
      { id: 1, message: "Tuition fee for March is due", date: "2024-03-01" },
      { id: 2, message: "Payment received for February", date: "2024-02-15" }
    ],
    extraActivities: [
      { id: 3, message: "Soccer practice cancelled today", date: "2024-03-04" },
      { id: 4, message: "Art class registration open", date: "2024-03-02" }
    ],
    others: [
      { id: 5, message: "Parent-teacher conference scheduled", date: "2024-03-10" },
      { id: 6, message: "School holiday announcement", date: "2024-03-01" }
    ]
  };

  const totalNotifications = notifications.tuitionPayment.length + 
                            notifications.extraActivities.length + 
                            notifications.others.length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = [
      'day.sunday', 'day.monday', 'day.tuesday', 'day.wednesday', 
      'day.thursday', 'day.friday', 'day.saturday'
    ];
    const months = [
      'month.january', 'month.february', 'month.march', 'month.april',
      'month.may', 'month.june', 'month.july', 'month.august',
      'month.september', 'month.october', 'month.november', 'month.december'
    ];
    
    const dayName = t(days[date.getDay()]);
    const monthName = t(months[date.getMonth()]);
    
    if (language === 'en') {
      return `${dayName}, ${monthName} ${date.getDate()}, ${date.getFullYear()}`;
    } else if (language === 'th') {
      return `${dayName}ที่ ${date.getDate()} ${monthName} ${date.getFullYear() + 543}`;
    } else if (language === 'zh') {
      return `${date.getFullYear()}年${monthName}${date.getDate()}日 ${dayName}`;
    }
    return dateString;
  };

  const today = new Date();
  const formattedToday = formatDate(today.toISOString().split('T')[0]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className={`text-lg font-bold text-primary ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>Schooney</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4">
              <ParentAccountSelector onLogout={onLogout} />
              <LanguageSelector />
              
              {/* Cart Icon */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative"
                onClick={onGoToCart}
              >
                <ShoppingCart className="h-4 w-4" />
                {cartItemCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
              
              {/* Notification Bell */}
              <Dialog open={notificationOpen} onOpenChange={setNotificationOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-4 w-4" />
                    {totalNotifications > 0 && (
                      <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {totalNotifications}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>{t('portal.notifications')}</DialogTitle>
                  </DialogHeader>
                  <Tabs defaultValue="tuitionPayment" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="tuitionPayment" className={`text-xs ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {t('portal.tuitionPayment')}
                        {notifications.tuitionPayment.length > 0 && (
                          <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                            {notifications.tuitionPayment.length}
                          </Badge>
                        )}
                      </TabsTrigger>
                      <TabsTrigger value="extraActivities" className={`text-xs ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {t('portal.extraActivities')}
                        {notifications.extraActivities.length > 0 && (
                          <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                            {notifications.extraActivities.length}
                          </Badge>
                        )}
                      </TabsTrigger>
                      <TabsTrigger value="others" className={`text-xs ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {t('portal.others')}
                        {notifications.others.length > 0 && (
                          <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                            {notifications.others.length}
                          </Badge>
                        )}
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="tuitionPayment" className="space-y-2 mt-4">
                      {notifications.tuitionPayment.map((notification) => (
                        <div key={notification.id} className="p-3 bg-muted rounded-lg">
                          <p className={`text-sm ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{notification.message}</p>
                          <p className={`text-xs text-muted-foreground mt-1 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{formatDate(notification.date)}</p>
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="extraActivities" className="space-y-2 mt-4">
                      {notifications.extraActivities.map((notification) => (
                        <div key={notification.id} className="p-3 bg-muted rounded-lg">
                          <p className={`text-sm ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{notification.message}</p>
                          <p className={`text-xs text-muted-foreground mt-1 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{formatDate(notification.date)}</p>
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="others" className="space-y-2 mt-4">
                      {notifications.others.map((notification) => (
                        <div key={notification.id} className="p-3 bg-muted rounded-lg">
                          <p className={`text-sm ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{notification.message}</p>
                          <p className={`text-xs text-muted-foreground mt-1 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{formatDate(notification.date)}</p>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-sm">
              <div className="px-2 py-4 space-y-4">
                
                {/* Navigation Menu */}
                <div className="px-2">
                  <h4 className={`font-medium mb-3 text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('nav.home')}</h4>
                  <div className="space-y-1">
                    <button
                      onClick={() => onTabChange?.("tuition")}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                        activeTab === "tuition"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-muted-foreground"
                      } ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                    >
                      <DollarSign className="h-4 w-4" />
                      Tuition
                    </button>
                    <button
                      onClick={() => onTabChange?.("eca-eas")}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                        activeTab === "eca-eas"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-muted-foreground"
                      } ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                    >
                      <Clock className="h-4 w-4" />
                      ECA &amp; EAS
                    </button>
                    <button
                      onClick={() => onTabChange?.("camp")}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                        activeTab === "camp"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-muted-foreground"
                      } ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                    >
                      <Sun className="h-4 w-4" />
                      Camp
                    </button>
                    <button
                      onClick={() => onTabChange?.("event-exam")}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                        activeTab === "event-exam"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-muted-foreground"
                      } ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                    >
                      <Calendar className="h-4 w-4" />
                      Event &amp; Exam
                    </button>
                    <button
                      onClick={() => onTabChange?.("trip")}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                        activeTab === "trip"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-muted-foreground"
                      } ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                    >
                      <MapPin className="h-4 w-4" />
                      Trip
                    </button>
                    <button
                      onClick={() => onTabChange?.("receipts")}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                        activeTab === "receipts"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-muted-foreground"
                      } ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                    >
                      <Receipt className="h-4 w-4" />
                      Receipts
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between px-2 pt-3 border-t border-border">
                  <LanguageSelector />
                <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="relative"
                      onClick={onGoToCart}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {cartItemCount > 0 && (
                        <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                          {cartItemCount}
                        </Badge>
                      )}
                    </Button>
                    <Dialog open={notificationOpen} onOpenChange={setNotificationOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="relative">
                          <Bell className="h-4 w-4" />
                          {totalNotifications > 0 && (
                            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                              {totalNotifications}
                            </Badge>
                          )}
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h2 className={`text-xl font-semibold text-primary ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {t('portal.welcome')}, John Smith
                </h2>
                <p className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {t('portal.today')}: {formattedToday}
                </p>
              </div>

              {/* Countdown Timer */}
              {showCountdown && onCountdownExpired && onCancelCountdown && (
                <CountdownTimer
                  onTimeExpired={onCountdownExpired}
                  onCancel={onCancelCountdown}
                />
              )}
            </div>

            {/* Campus Display - Right Side */}
            <div className="flex items-center gap-2">
              <span className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {t('portal.loggedInCampus')}:
              </span>
              <span className={`text-sm font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {campusOptions[0]?.label ?? selectedCampus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};