import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, MapPin, AlertTriangle, BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CampConfigDialog } from "./CampConfigDialog";

interface BoardingOption {
  id: string;
  name: string;
  price: number;
}

interface Course {
  id: string;
  name: string;
  description: string;
  capacity: number;
  enrolled: number;
  schedule: string;
  location: string;
  price: number;
  duration: string;
  vendor: string;
  hasConflict?: boolean;
  campType?: 'flexible' | 'package';
  campus?: string;
  totalWeeks?: number;
  availableWeeks?: number[];
  pricePerWeek?: number;
  boardingOptions?: BoardingOption[];
  weekDates?: { [key: number]: { start: string; end: string } };
}

interface CourseCardProps {
  course: Course;
  onAddToCart?: (courseId: string, campConfig?: any) => void;
  onRemoveFromCart?: (courseId: string) => void;
  isInCart?: boolean;
  isCamp?: boolean;
}

export const CourseCard = ({ course, onAddToCart, onRemoveFromCart, isInCart, isCamp = false }: CourseCardProps) => {
  const spotsLeft = course.capacity - course.enrolled;
  const isFullyBooked = spotsLeft <= 0;
  const isLowCapacity = spotsLeft <= 3 && spotsLeft > 0;
  const [showCampDialog, setShowCampDialog] = useState(false);

  const { language, formatCurrency, t } = useLanguage();

  const getCampusColor = (campus?: string) => {
    switch(campus) {
      case 'Chiangmai': return 'bg-purple-500/20 text-purple-700 dark:text-purple-300';
      case 'Nonthaburi': return 'bg-blue-500/20 text-blue-700 dark:text-blue-300';
      case 'Rayong': return 'bg-green-500/20 text-green-700 dark:text-green-300';
      case 'Bangkok': return 'bg-orange-500/20 text-orange-700 dark:text-orange-300';
      default: return 'bg-gray-500/20 text-gray-700 dark:text-gray-300';
    }
  };

  const getCampTypeLabel = (campType?: 'flexible' | 'package') => {
    if (!campType) return null;
    if (campType === 'flexible') {
      return language === 'th' ? 'เลือกสัปดาห์ได้' : language === 'zh' ? '可选周' : 'Flexible Weeks';
    }
    return language === 'th' ? 'แพ็คเกจเต็ม' : language === 'zh' ? '完整套餐' : 'Full Package';
  };

  const getAvailabilityColor = () => {
    if (isFullyBooked) return 'bg-destructive/20 text-destructive';
    if (isLowCapacity) return 'bg-warning-orange/20 text-warning-orange';
    return 'bg-finance-green/20 text-finance-green';
  };

  const getAvailabilityText = () => {
    if (isFullyBooked) return t('portal.fullyBooked');
    if (isLowCapacity) return `${spotsLeft} ${t('portal.spotsLeft')}`;
    return `${spotsLeft} ${t('portal.spotsAvailable')}`;
  };

  const handleAddToCart = () => {
    if (isCamp && course.campType && course.boardingOptions) {
      setShowCampDialog(true);
    } else {
      onAddToCart?.(course.id);
    }
  };

  const handleCampConfigConfirm = (config: any) => {
    onAddToCart?.(course.id, config);
  };

  return (
    <Card className={`overflow-hidden transition-all ${course.hasConflict ? 'border-warning-orange/50' : ''}`}>
      <div className="h-1 w-full bg-primary" />
      <CardContent className="p-4 space-y-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="p-2 rounded-lg shrink-0 bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className={`font-semibold text-base leading-snug ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{course.name}</p>
              <p className={`text-sm text-muted-foreground mt-0.5 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{course.description}</p>
            </div>
          </div>
          <span className={`text-xl font-bold text-blue-600 whitespace-nowrap shrink-0 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {formatCurrency(course.price)}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge className={getAvailabilityColor()}>
            <span className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
              {getAvailabilityText()}
            </span>
          </Badge>

          {course.campus && (
            <Badge className={getCampusColor(course.campus)}>
              <span className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
                #{course.campus}
              </span>
            </Badge>
          )}

          {course.campType && (
            <Badge variant="outline" className="border-primary/50">
              <span className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
                {getCampTypeLabel(course.campType)}
              </span>
            </Badge>
          )}
        </div>
        <div className="space-y-3 text-sm">
          <div className={`flex items-center gap-2 text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            <Clock className="h-4 w-4" />
            <span>{course.schedule} • {course.duration}</span>
          </div>
          
          <div className={`flex items-center gap-2 text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            <Users className="h-4 w-4" />
            <span>{t('portal.vendor')}: {course.vendor}</span>
          </div>
          
          <div className={`flex items-center gap-2 text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            <MapPin className="h-4 w-4" />
            <span>{course.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('portal.capacity')}:</span>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted rounded-full h-2 w-20">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(course.enrolled / course.capacity) * 100}%` }}
              />
            </div>
            <span className={`font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{course.enrolled}/{course.capacity}</span>
          </div>
        </div>

        {course.hasConflict && (
          <div className={`flex items-center gap-2 text-sm text-warning-orange bg-warning-orange/10 p-2 rounded ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            <AlertTriangle className="h-4 w-4" />
            <span>{t('portal.scheduleConflict')}</span>
          </div>
        )}

        <div className="pt-2">
          {isFullyBooked ? (
            <Button variant="outline" className={`w-full ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`} disabled>
              {t('portal.fullyBooked')}
            </Button>
          ) : isInCart ? (
            <Button
              variant="destructive"
              className={`w-full ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              onClick={() => onRemoveFromCart?.(course.id)}
            >
              {t('portal.removeFromCart')}
            </Button>
          ) : (
            <Button 
              className={`w-full ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              onClick={handleAddToCart}
              disabled={course.hasConflict}
            >
              {t('portal.addToCart')}
            </Button>
          )}
        </div>
      </CardContent>

      {/* Camp Configuration Dialog */}
      {isCamp && course.campType && course.boardingOptions && course.availableWeeks && (
        <CampConfigDialog
          open={showCampDialog}
          onOpenChange={setShowCampDialog}
          camp={{
            id: course.id,
            name: course.name,
            price: course.price,
            campType: course.campType,
            campus: course.campus || '',
            totalWeeks: course.totalWeeks || 0,
            availableWeeks: course.availableWeeks,
            pricePerWeek: course.pricePerWeek || 0,
            boardingOptions: course.boardingOptions,
            weekDates: course.weekDates,
          }}
          onConfirm={handleCampConfigConfirm}
        />
      )}
    </Card>
  );
};