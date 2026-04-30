import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, AlertCircle, Bus, FileText, School, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export interface Trip {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  paymentDeadline: string;
  details: string;
  organizer: string;
  status: 'pending' | 'accepted' | 'declined' | 'paid';
  campus?: string;
  participants?: string[];
  consentFormLink?: string;
  tripStatus?: 'open' | 'full' | 'completed' | 'draft';
}

interface TripCardProps {
  trip: Trip;
  isInCart?: boolean;
  onAddToCart: (tripId: string) => void;
  onRemoveFromCart: (tripId: string) => void;
}

export const TripCard = ({
  trip,
  isInCart,
  onAddToCart,
  onRemoveFromCart,
}: TripCardProps) => {
  const { t, language, formatCurrency } = useLanguage();

  // Check if deadline has passed
  const isDeadlinePassed = new Date(trip.paymentDeadline) < new Date();
  const isPaid = trip.status === 'paid';

  const formatDeadline = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'th' ? 'th-TH' : language === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className={`relative overflow-hidden transition-all ${isPaid ? 'border-green-500/50 bg-green-50/30' : ''}`}>
      {/* Status Badge */}
      {isPaid && (
        <div className="absolute top-3 right-3">
          <Badge className="bg-green-500 text-white">
            {t('trip.paid')}
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bus className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0 pr-16">
            <CardTitle className={`text-lg leading-tight ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {trip.name}
            </CardTitle>
            <p className={`text-sm text-muted-foreground mt-1 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {trip.description}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Trip Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
              {trip.date}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
              {trip.time}
            </span>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
              {trip.location}
            </span>
          </div>
        </div>

        {/* Payment Deadline */}
        <div className={`flex items-center gap-2 p-2 rounded-md ${
          isDeadlinePassed ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning-foreground'
        }`}>
          <AlertCircle className="h-4 w-4" />
          <span className={`text-sm font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {t('trip.paymentDeadline')}: {formatDeadline(trip.paymentDeadline)}
            {isDeadlinePassed && ` (${t('trip.deadlinePassed')})`}
          </span>
        </div>

        {/* Campus & Participants */}
        {(trip.campus || trip.participants?.length) && (
          <div className="grid grid-cols-2 gap-3 text-sm">
            {trip.campus && (
              <div className="flex items-center gap-2">
                <School className="h-4 w-4 text-muted-foreground" />
                <span className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
                  {trip.campus}
                </span>
              </div>
            )}
            {trip.participants && trip.participants.length > 0 && (
              <div className="flex items-start gap-2 col-span-2">
                <Users className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <span className={`text-xs text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {trip.participants.join(', ')}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Consent Form Link */}
        {trip.consentFormLink && (
          <a
            href={trip.consentFormLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <FileText className="h-4 w-4" />
            <span className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
              {language === 'th' ? 'แบบฟอร์มยินยอม' : 'Consent Form'}
            </span>
          </a>
        )}

        {/* Trip Details Bullet Points */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className={`text-sm font-medium mb-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {t('trip.tripDetails')}:
          </p>
          <div className={`text-sm text-muted-foreground whitespace-pre-line ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {trip.details}
          </div>
        </div>

        {/* Price and Organizer */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <span className={`text-lg font-bold text-primary ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {formatCurrency(trip.price)}
            </span>
          </div>
          <span className={`text-xs text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {trip.organizer}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="pt-2">
          {isPaid ? (
            <div className="text-center py-2">
              <p className={`text-sm text-green-600 font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                ✓ {t('trip.paymentConfirmed')}
              </p>
            </div>
          ) : isDeadlinePassed ? (
            <div className="text-center py-2">
              <p className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {t('trip.deadlinePassed')}
              </p>
            </div>
          ) : isInCart ? (
            <Button
              variant="destructive"
              className={`w-full ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              onClick={() => onRemoveFromCart(trip.id)}
            >
              {t('portal.removeFromCart')}
            </Button>
          ) : (
            <Button
              className={`w-full ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              onClick={() => onAddToCart(trip.id)}
            >
              {language === 'th' ? 'ลงทะเบียน' : 'Register'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
