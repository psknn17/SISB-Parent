import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Exam } from "@/data/mockData";

interface ExamCardProps {
  exam: Exam;
  isInCart?: boolean;
  onRegister: (exam: Exam) => void;
}

export const ExamCard = ({ exam, isInCart, onRegister }: ExamCardProps) => {
  const { language, formatCurrency } = useLanguage();
  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';

  const spotsLeft = exam.capacity - exam.enrolled;
  const isFullyBooked = spotsLeft <= 0;
  const isLowCapacity = spotsLeft <= 3 && spotsLeft > 0;

  const getSpotsLabel = () => {
    if (isFullyBooked) return language === 'th' ? 'เต็มแล้ว' : language === 'zh' ? '已满' : 'Fully Booked';
    if (isLowCapacity) return language === 'th' ? `เหลือ ${spotsLeft} ที่` : language === 'zh' ? `剩余 ${spotsLeft} 名额` : `${spotsLeft} spots left`;
    return language === 'th' ? `ว่างอีก ${spotsLeft} ที่` : language === 'zh' ? `可用 ${spotsLeft} 名额` : `${spotsLeft} spots available`;
  };

  const getSpotsColor = () => {
    if (isFullyBooked) return 'bg-destructive/10 text-destructive';
    if (isLowCapacity) return 'bg-warning-orange/10 text-warning-orange';
    return 'bg-finance-green/10 text-finance-green';
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (language === 'th') return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
    if (language === 'zh') return d.toLocaleDateString('zh-CN', { day: 'numeric', month: 'short', year: 'numeric' });
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const vendorLabel = language === 'th' ? 'ผู้จัด' : language === 'zh' ? '主办方' : 'Vendor';
  const resultsLabel = language === 'th' ? 'บริการผลคะแนน' : language === 'zh' ? '成绩递送' : 'Results delivery';

  const getButtonLabel = () => {
    if (isFullyBooked) return language === 'th' ? 'เต็มแล้ว' : language === 'zh' ? '已满' : 'Fully Booked';
    if (isInCart) return language === 'th' ? 'อยู่ในตะกร้าแล้ว' : language === 'zh' ? '已在购物车' : 'In Cart';
    return language === 'th' ? 'ลงทะเบียน' : language === 'zh' ? '注册' : 'Register';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <h3 className={`font-semibold text-base leading-tight flex-1 ${fontClass}`}>
              {exam.name}
            </h3>
            <span className={`text-xl font-bold text-blue-600 whitespace-nowrap ${fontClass}`}>
              {formatCurrency(exam.price)}
            </span>
          </div>

          <Badge variant="outline" className={`text-xs ${fontClass}`}>
            {language === 'th' ? 'สอบอย่างเดียว' : language === 'zh' ? '仅考试' : 'Exam Only'}
          </Badge>

          <p className={`text-sm text-muted-foreground ${fontClass}`}>
            {exam.descriptions[language] ?? exam.descriptions.en}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <Badge className={`${getSpotsColor()} ${fontClass}`}>
          {getSpotsLabel()}
        </Badge>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className={`flex items-center gap-2 ${fontClass}`}>
            <Calendar className="h-4 w-4 shrink-0" />
            <span>{formatDate(exam.date)}</span>
          </div>
          <div className={`flex items-center gap-2 ${fontClass}`}>
            <Clock className="h-4 w-4 shrink-0" />
            <span>{exam.time}</span>
          </div>
          <div className={`flex items-center gap-2 ${fontClass}`}>
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{exam.locations[language] ?? exam.locations.en}</span>
          </div>
        </div>

        <p className={`text-xs text-muted-foreground ${fontClass}`}>
          <span className="font-medium">{vendorLabel}:</span>{' '}
          {exam.vendors[language] ?? exam.vendors.en}
        </p>

        <p className={`text-xs text-muted-foreground ${fontClass}`}>
          {resultsLabel}: +{formatCurrency(exam.resultsDeliveryPrice)}
        </p>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className={`text-muted-foreground ${fontClass}`}>
              {language === 'th' ? 'ความจุ' : language === 'zh' ? '容量' : 'Capacity'}:
            </span>
            <span className={`font-medium ${fontClass}`}>{exam.enrolled}/{exam.capacity}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-2 rounded-full bg-primary transition-all"
              style={{ width: `${(exam.enrolled / exam.capacity) * 100}%` }}
            />
          </div>
        </div>

        <Button
          className={`w-full ${fontClass}`}
          disabled={isFullyBooked || isInCart}
          variant={isInCart ? 'outline' : 'default'}
          onClick={() => !isFullyBooked && !isInCart && onRegister(exam)}
        >
          {getButtonLabel()}
        </Button>
      </CardContent>
    </Card>
  );
};
