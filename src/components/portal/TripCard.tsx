import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Trip } from "@/data/mockData";

interface TripCardProps {
  trip: Trip;
  isInCart?: boolean;
  isRegistered?: boolean;
  onRegister: (trip: Trip) => void;
}

export const TripCard = ({ trip, isInCart, isRegistered, onRegister }: TripCardProps) => {
  const { language, formatCurrency } = useLanguage();
  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';

  const spotsLeft = trip.capacity - trip.enrolled;
  const isFullyBooked = trip.status === 'full' || spotsLeft <= 0;
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

  const formatDateRange = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const locale = language === 'th' ? 'th-TH' : language === 'zh' ? 'zh-CN' : 'en-US';
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    if (start === end) return s.toLocaleDateString(locale, opts);
    return `${s.toLocaleDateString(locale, opts)} – ${e.toLocaleDateString(locale, opts)}`;
  };

  const getButtonLabel = () => {
    if (trip.status === 'closed') return language === 'th' ? 'ปิดรับสมัคร' : language === 'zh' ? '已关闭' : 'Closed';
    if (isFullyBooked) return language === 'th' ? 'เต็มแล้ว' : language === 'zh' ? '已满' : 'Fully Booked';
    if (isRegistered) return language === 'th' ? 'ลงทะเบียนแล้ว' : language === 'zh' ? '已注册' : 'Registered';
    if (isInCart) return language === 'th' ? 'อยู่ในตะกร้าแล้ว' : language === 'zh' ? '已在购物车' : 'In Cart';
    return language === 'th' ? 'ลงทะเบียน' : language === 'zh' ? '注册' : 'Register';
  };

  const isDisabled = trip.status === 'closed' || isFullyBooked || isRegistered || isInCart;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <h3 className={`font-semibold text-base leading-tight flex-1 ${fontClass}`}>
              {trip.name[language] ?? trip.name.en}
            </h3>
            <span className={`text-xl font-bold text-blue-600 whitespace-nowrap ${fontClass}`}>
              {formatCurrency(trip.price)}
            </span>
          </div>

          <Badge variant="outline" className={`text-xs ${fontClass}`}>
            {trip.destination[language] ?? trip.destination.en}
          </Badge>

          <p className={`text-sm text-muted-foreground ${fontClass}`}>
            {trip.descriptions[language] ?? trip.descriptions.en}
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
            <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
          </div>
          <div className={`flex items-center gap-2 ${fontClass}`}>
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{trip.destination[language] ?? trip.destination.en}</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className={`text-muted-foreground ${fontClass}`}>
              {language === 'th' ? 'ความจุ' : language === 'zh' ? '容量' : 'Capacity'}:
            </span>
            <span className={`font-medium ${fontClass}`}>{trip.enrolled}/{trip.capacity}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-2 rounded-full bg-primary transition-all"
              style={{ width: `${(trip.enrolled / trip.capacity) * 100}%` }}
            />
          </div>
        </div>

        <a
          href={trip.consentFormUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-xs text-primary hover:underline ${fontClass}`}
        >
          {language === 'th' ? 'ดูแบบฟอร์มยินยอม →' : language === 'zh' ? '查看知情同意书 →' : 'View Consent Form →'}
        </a>

        <Button
          className={`w-full ${fontClass}`}
          disabled={isDisabled}
          variant={isInCart || isRegistered ? 'outline' : 'default'}
          onClick={() => !isDisabled && onRegister(trip)}
        >
          {getButtonLabel()}
        </Button>
      </CardContent>
    </Card>
  );
};
