import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Trip, LocalizedString } from "@/data/mockData";

export interface TripRegistrationData {
  tripId: string;
  tripName: LocalizedString;
  destination: LocalizedString;
  price: number;
  emergencyContactName: string;
  emergencyContactPhone: string;
  dietaryNotes: string;
  medicalNotes: string;
  consentAgreed: boolean;
}

interface TripRegistrationModalProps {
  trip: Trip | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TripRegistrationData) => void;
}

export const TripRegistrationModal = ({
  trip,
  open,
  onOpenChange,
  onSubmit,
}: TripRegistrationModalProps) => {
  const { language, formatCurrency } = useLanguage();
  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';

  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [consentAgreed, setConsentAgreed] = useState(false);

  if (!trip) return null;

  const isValid = emergencyContactName.trim() !== '' && emergencyContactPhone.trim() !== '' && consentAgreed;

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit({
      tripId: trip.id,
      tripName: trip.name,
      destination: trip.destination,
      price: trip.price,
      emergencyContactName,
      emergencyContactPhone,
      dietaryNotes,
      medicalNotes,
      consentAgreed,
    });
    setEmergencyContactName('');
    setEmergencyContactPhone('');
    setDietaryNotes('');
    setMedicalNotes('');
    setConsentAgreed(false);
  };

  const formatDateRange = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const locale = language === 'th' ? 'th-TH' : language === 'zh' ? 'zh-CN' : 'en-US';
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    if (start === end) return s.toLocaleDateString(locale, opts);
    return `${s.toLocaleDateString(locale, opts)} – ${e.toLocaleDateString(locale, opts)}`;
  };

  const T = {
    title:                language === 'th' ? 'ลงทะเบียนทัศนศึกษา'                         : language === 'zh' ? '注册校外考察'                    : 'Trip Registration',
    emergencyName:        language === 'th' ? 'ชื่อผู้ติดต่อฉุกเฉิน'                       : language === 'zh' ? '紧急联系人姓名'                  : 'Emergency Contact Name',
    emergencyNamePh:      language === 'th' ? 'กรอกชื่อผู้ติดต่อ'                           : language === 'zh' ? '输入联系人姓名'                  : 'Enter contact name',
    emergencyPhone:       language === 'th' ? 'เบอร์โทรผู้ติดต่อฉุกเฉิน'                   : language === 'zh' ? '紧急联系人电话'                  : 'Emergency Contact Phone',
    emergencyPhonePh:     language === 'th' ? 'กรอกเบอร์โทรศัพท์'                           : language === 'zh' ? '输入电话号码'                    : 'Enter phone number',
    dietary:              language === 'th' ? 'ข้อจำกัดด้านอาหาร (ถ้ามี)'                   : language === 'zh' ? '饮食限制（如有）'                : 'Dietary Restrictions (optional)',
    dietaryPh:            language === 'th' ? 'เช่น มังสวิรัติ, แพ้ถั่ว'                    : language === 'zh' ? '例如：素食、坚果过敏'            : 'e.g. vegetarian, nut allergy',
    medical:              language === 'th' ? 'หมายเหตุทางการแพทย์ (ถ้ามี)'                 : language === 'zh' ? '医疗备注（如有）'                : 'Medical Notes (optional)',
    medicalPh:            language === 'th' ? 'เช่น โรคประจำตัว, ยาที่ใช้'                  : language === 'zh' ? '例如：慢性病、用药情况'          : 'e.g. chronic conditions, medications',
    viewConsent:          language === 'th' ? 'ดูแบบฟอร์มยินยอม'                            : language === 'zh' ? '查看知情同意书'                  : 'View Consent Form',
    consentAgree:         language === 'th' ? 'ฉันได้อ่านและยินยอมในแบบฟอร์มยินยอมแล้ว'   : language === 'zh' ? '我已阅读并同意知情同意书'        : 'I have read and agree to the consent form',
    total:                language === 'th' ? 'รวมทั้งหมด'                                   : language === 'zh' ? '总计'                            : 'Total',
    cancel:               language === 'th' ? 'ยกเลิก'                                       : language === 'zh' ? '取消'                            : 'Cancel',
    addToCart:            language === 'th' ? 'เพิ่มลงตะกร้า'                               : language === 'zh' ? '加入购物车'                      : 'Add to Cart',
  };

  const RequiredLabel = ({ text }: { text: string }) => (
    <Label className={`text-sm font-medium flex items-center gap-1 ${fontClass}`}>
      {text} <span className="text-destructive">*</span>
    </Label>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={fontClass}>{T.title}</DialogTitle>
          <p className={`text-sm text-primary font-medium ${fontClass}`}>
            {trip.name[language] ?? trip.name.en}
          </p>
          <p className={`text-xs text-muted-foreground ${fontClass}`}>
            {trip.destination[language] ?? trip.destination.en}
          </p>
        </DialogHeader>

        {/* Date row */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground border-b pb-4">
          <Calendar className="h-4 w-4 shrink-0" />
          <span className={fontClass}>{formatDateRange(trip.startDate, trip.endDate)}</span>
        </div>

        <div className="space-y-4">
          {/* Emergency Contact Name */}
          <div className="space-y-1.5">
            <RequiredLabel text={T.emergencyName} />
            <Input
              className={fontClass}
              placeholder={T.emergencyNamePh}
              value={emergencyContactName}
              onChange={(e) => setEmergencyContactName(e.target.value)}
            />
          </div>

          {/* Emergency Contact Phone */}
          <div className="space-y-1.5">
            <RequiredLabel text={T.emergencyPhone} />
            <Input
              className={fontClass}
              type="tel"
              placeholder={T.emergencyPhonePh}
              value={emergencyContactPhone}
              onChange={(e) => setEmergencyContactPhone(e.target.value)}
            />
          </div>

          {/* Dietary Restrictions */}
          <div className="space-y-1.5">
            <Label className={`text-sm font-medium ${fontClass}`}>{T.dietary}</Label>
            <Textarea
              className={fontClass}
              placeholder={T.dietaryPh}
              value={dietaryNotes}
              onChange={(e) => setDietaryNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* Medical Notes */}
          <div className="space-y-1.5">
            <Label className={`text-sm font-medium ${fontClass}`}>{T.medical}</Label>
            <Textarea
              className={fontClass}
              placeholder={T.medicalPh}
              value={medicalNotes}
              onChange={(e) => setMedicalNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* Consent section */}
          <div className="border-2 border-dashed border-border rounded-lg p-4 space-y-3">
            <a
              href={trip.consentFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm text-primary hover:underline block ${fontClass}`}
            >
              {T.viewConsent} →
            </a>
            <div className="flex items-start gap-2">
              <Checkbox
                id="consent-checkbox"
                checked={consentAgreed}
                onCheckedChange={(checked) => setConsentAgreed(checked === true)}
                className="mt-0.5"
              />
              <label
                htmlFor="consent-checkbox"
                className={`text-sm cursor-pointer leading-snug ${fontClass}`}
              >
                {T.consentAgree} <span className="text-destructive">*</span>
              </label>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between py-2 border-t">
          <span className={`text-sm font-semibold ${fontClass}`}>{T.total}</span>
          <span className={`text-xl font-bold text-primary ${fontClass}`}>
            {formatCurrency(trip.price)}
          </span>
        </div>

        {/* Footer */}
        <div className="flex gap-2 justify-end">
          <Button variant="outline" className={fontClass} onClick={() => onOpenChange(false)}>
            {T.cancel}
          </Button>
          <Button className={fontClass} disabled={!isValid} onClick={handleSubmit}>
            {T.addToCart}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
