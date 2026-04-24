import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, User, Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SummerActivity } from "@/data/mockData";

const BOARDING_OPTIONS = [
  { id: "weekday",          labelKey: "boardingWeekday",        price: 3000 },
  { id: "weekend",          labelKey: "boardingWeekend",        price: 2000 },
  { id: "weekday_weekend",  labelKey: "boardingWeekdayWeekend", price: 4500 },
] as const;

const NATIONALITIES = [
  "Thai", "American", "British", "Australian", "Canadian",
  "Chinese", "Japanese", "Korean", "Singaporean", "German",
  "French", "Dutch", "Swedish", "Norwegian", "Indian",
  "Malaysian", "Indonesian", "Filipino", "Vietnamese", "Other",
];

export interface CampRegistrationData {
  activityId: string;
  selectedWeeks: string[];
  boardingSelections: Record<string, string>;
  nationality: string;
  gender: string;
  allergies: string;
  medicalConditions: string;
  totalPrice: number;
}

interface CampRegistrationModalProps {
  activity: SummerActivity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CampRegistrationData) => void;
}

export const CampRegistrationModal = ({
  activity,
  open,
  onOpenChange,
  onSubmit,
}: CampRegistrationModalProps) => {
  const { language, formatCurrency } = useLanguage();
  const fontClass = language === "th" ? "font-sukhumvit" : language === "zh" ? "font-noto-sc" : "font-lato";

  const [selectedWeeks, setSelectedWeeks] = useState<string[]>([]);
  const [boardingSelections, setBoardingSelections] = useState<Record<string, string>>({});
  const [nationality, setNationality] = useState("");
  const [gender, setGender] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");

  if (!activity) return null;

  const toggleWeek = (weekId: string) => {
    setSelectedWeeks(prev => {
      if (prev.includes(weekId)) {
        // Remove boarding selection for unchecked week
        setBoardingSelections(bs => { const next = { ...bs }; delete next[weekId]; return next; });
        return prev.filter(id => id !== weekId);
      }
      return [...prev, weekId];
    });
  };

  const pricePerWeek = activity.weeks?.[0]?.pricePerWeek ?? activity.price;
  const boardingTotal = Object.values(boardingSelections).reduce((sum, boardId) => {
    const opt = BOARDING_OPTIONS.find(o => o.id === boardId);
    return sum + (opt?.price ?? 0);
  }, 0);
  const totalPrice = selectedWeeks.length * pricePerWeek + boardingTotal;

  const allBoardingSelected = selectedWeeks.length > 0 &&
    selectedWeeks.every(wId => boardingSelections[wId] !== undefined);

  const isValid =
    selectedWeeks.length > 0 &&
    allBoardingSelected &&
    nationality !== "" &&
    gender !== "" &&
    allergies.trim() !== "" &&
    medicalConditions.trim() !== "";

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit({ activityId: activity.id, selectedWeeks, boardingSelections, nationality, gender, allergies, medicalConditions, totalPrice });
    setSelectedWeeks([]);
    setBoardingSelections({});
    setNationality("");
    setGender("");
    setAllergies("");
    setMedicalConditions("");
  };

  const T = {
    subtitle:               language === "th" ? "กรุณากรอกข้อมูลสำหรับลงทะเบียนแคมป์"   : language === "zh" ? "请填写营地注册信息"           : "Please fill in the information for camp registration",
    selectWeeks:            language === "th" ? "เลือกสัปดาห์"                              : language === "zh" ? "选择周次"                     : "Select Weeks",
    pricePerWeek:           language === "th" ? "ต่อสัปดาห์"                                : language === "zh" ? "每周"                          : "per week",
    selectBoarding:         language === "th" ? "เลือกที่พักสำหรับแต่ละสัปดาห์"            : language === "zh" ? "选择每周住宿"                 : "Select Boarding for Each Week",
    boardingWeekday:        language === "th" ? "ที่พักวันธรรมดา"                           : language === "zh" ? "工作日住宿"                   : "Weekday Boarding",
    boardingWeekend:        language === "th" ? "ที่พักวันหยุด"                             : language === "zh" ? "周末住宿"                     : "Weekend Boarding",
    boardingWeekdayWeekend: language === "th" ? "ที่พักวันธรรมดา + วันหยุด"               : language === "zh" ? "工作日+周末住宿"               : "Weekday + Weekend",
    studentInfo:            language === "th" ? "ข้อมูลนักเรียน"                            : language === "zh" ? "学生信息"                      : "Student Information",
    nationality:            language === "th" ? "สัญชาติ"                                   : language === "zh" ? "国籍"                          : "Nationality",
    nationalityPh:          language === "th" ? "เลือกสัญชาติ..."                           : language === "zh" ? "选择国籍..."                   : "Select nationality...",
    gender:                 language === "th" ? "เพศ"                                        : language === "zh" ? "性别"                          : "Gender",
    genderPh:               language === "th" ? "เลือกเพศ..."                               : language === "zh" ? "选择性别..."                   : "Select gender...",
    male:                   language === "th" ? "ชาย"                                        : language === "zh" ? "男"                            : "Male",
    female:                 language === "th" ? "หญิง"                                       : language === "zh" ? "女"                            : "Female",
    other:                  language === "th" ? "อื่นๆ"                                      : language === "zh" ? "其他"                          : "Other",
    healthInfo:             language === "th" ? "ข้อมูลสุขภาพนักเรียน"                      : language === "zh" ? "学生健康信息"                  : "Student Health Information",
    allergies:              language === "th" ? "การแพ้"                                     : language === "zh" ? "过敏情况"                      : "Allergies",
    allergiesPh:            language === "th" ? 'ระบุการแพ้ของนักเรียน (ถ้าไม่มี ให้พิมพ์ "ไม่มี")' : language === "zh" ? '请注明过敏情况（如无，请填写"无"）' : 'Please specify student allergies (if none, type "None")',
    medConditions:          language === "th" ? "โรคประจำตัว"                               : language === "zh" ? "病史"                          : "Medical Conditions",
    medConditionsPh:        language === "th" ? 'ระบุโรคประจำตัว (ถ้าไม่มี ให้พิมพ์ "ไม่มี")'    : language === "zh" ? '请注明病史（如无，请填写"无"）'       : 'Please specify medical conditions (if none, type "None")',
    campFee:                language === "th" ? "ค่าแคมป์"                                  : language === "zh" ? "营地费用"                      : "Camp Fee",
    cancel:                 language === "th" ? "ยกเลิก"                                    : language === "zh" ? "取消"                          : "Cancel",
    addToCart:              language === "th" ? "เพิ่มลงตะกร้า"                            : language === "zh" ? "加入购物车"                    : "Add to Cart",
  };

  const CalendarIcon = () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );

  const ShieldIcon = () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );

  const SectionHeader = ({ icon, text, required }: { icon: React.ReactNode; text: string; required?: boolean }) => (
    <div className={`flex items-center gap-2 text-sm font-semibold text-foreground mb-3 ${fontClass}`}>
      {icon}
      {text}
      {required && <span className="text-destructive">*</span>}
    </div>
  );

  const RequiredLabel = ({ text }: { text: string }) => (
    <Label className={`text-sm font-medium flex items-center gap-1 ${fontClass}`}>
      {text} <span className="text-destructive">*</span>
    </Label>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-lg max-h-[90vh] overflow-y-auto p-5">
        <DialogHeader className="space-y-1 pb-1">
          <div className="flex items-start justify-between gap-2">
            <DialogTitle className={`text-lg leading-tight ${fontClass}`}>
              {activity.name}
            </DialogTitle>
            {activity.campus && (
              <Badge variant="secondary" className={`shrink-0 text-xs ${fontClass}`}>
                #{activity.campus}
              </Badge>
            )}
          </div>
          <p className={`text-sm text-primary font-medium ${fontClass}`}>{T.subtitle}</p>
        </DialogHeader>

        <div className="space-y-5 pt-1">
          {/* Select Weeks */}
          <div>
            <SectionHeader icon={<CalendarIcon />} text={T.selectWeeks} />
            {activity.weeks && activity.weeks.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {activity.weeks.map(week => (
                  <label
                    key={week.id}
                    className={`flex items-center gap-2.5 p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedWeeks.includes(week.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <Checkbox
                      checked={selectedWeeks.includes(week.id)}
                      onCheckedChange={() => toggleWeek(week.id)}
                      className="shrink-0"
                    />
                    <span className={`text-sm ${fontClass}`}>
                      {week.label} ({week.dateRange})
                    </span>
                  </label>
                ))}
              </div>
            )}
            <p className={`text-sm text-primary font-medium mt-2 ${fontClass}`}>
              {formatCurrency(pricePerWeek)} {T.pricePerWeek}
            </p>
          </div>

          {/* Select Boarding — shown only when weeks are selected */}
          {selectedWeeks.length > 0 && (
            <>
              <div className="border-t" />
              <div>
                <SectionHeader icon={<Home className="h-4 w-4" />} text={T.selectBoarding} required />
                <div className="space-y-3">
                  {selectedWeeks.map(weekId => {
                    const week = activity.weeks?.find(w => w.id === weekId);
                    if (!week) return null;
                    return (
                      <div key={weekId} className="border rounded-xl overflow-hidden">
                        <div className="px-4 py-2.5 bg-muted/50 border-b">
                          <span className={`text-sm font-semibold ${fontClass}`}>
                            {week.label} ({week.dateRange})
                          </span>
                        </div>
                        <div className="divide-y">
                          {BOARDING_OPTIONS.map(opt => {
                            const isSelected = boardingSelections[weekId] === opt.id;
                            return (
                              <label
                                key={opt.id}
                                className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                                  isSelected ? "bg-primary/5" : "hover:bg-muted/30"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  {/* Custom radio */}
                                  <div
                                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                      isSelected ? "border-primary" : "border-muted-foreground/40"
                                    }`}
                                  >
                                    {isSelected && (
                                      <div className="w-2 h-2 rounded-full bg-primary" />
                                    )}
                                  </div>
                                  <span className={`text-sm ${fontClass}`}>
                                    {T[opt.labelKey as keyof typeof T]}
                                  </span>
                                </div>
                                <span className={`text-sm font-semibold text-primary tabular-nums ${fontClass}`}>
                                  +{formatCurrency(opt.price)}
                                </span>
                                <input
                                  type="radio"
                                  className="sr-only"
                                  name={`boarding-${weekId}`}
                                  value={opt.id}
                                  checked={isSelected}
                                  onChange={() =>
                                    setBoardingSelections(prev => ({ ...prev, [weekId]: opt.id }))
                                  }
                                />
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <div className="border-t" />

          {/* Student Information */}
          <div>
            <SectionHeader icon={<User className="h-4 w-4" />} text={T.studentInfo} />
            <div className="space-y-3">
              <div className="space-y-1.5">
                <RequiredLabel text={T.nationality} />
                <Select value={nationality} onValueChange={setNationality}>
                  <SelectTrigger className={fontClass}>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                      <SelectValue placeholder={T.nationalityPh} />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {NATIONALITIES.map(n => (
                      <SelectItem key={n} value={n} className={fontClass}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <RequiredLabel text={T.gender} />
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className={fontClass}>
                    <SelectValue placeholder={T.genderPh} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male" className={fontClass}>{T.male}</SelectItem>
                    <SelectItem value="female" className={fontClass}>{T.female}</SelectItem>
                    <SelectItem value="other" className={fontClass}>{T.other}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Student Health Information */}
          <div>
            <SectionHeader icon={<ShieldIcon />} text={T.healthInfo} />
            <div className="space-y-3">
              <div className="space-y-1.5">
                <RequiredLabel text={T.allergies} />
                <Textarea
                  className={fontClass}
                  placeholder={T.allergiesPh}
                  value={allergies}
                  onChange={e => setAllergies(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-1.5">
                <RequiredLabel text={T.medConditions} />
                <Textarea
                  className={fontClass}
                  placeholder={T.medConditionsPh}
                  value={medicalConditions}
                  onChange={e => setMedicalConditions(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Camp Fee */}
        <div className="flex items-center justify-between pt-3 border-t mt-2">
          <span className={`text-sm font-semibold ${fontClass}`}>{T.campFee}</span>
          <span className={`text-xl font-bold text-primary tabular-nums ${fontClass}`}>
            {formatCurrency(totalPrice)}
          </span>
        </div>

        {/* Footer */}
        <div className="flex gap-2 justify-end pt-1">
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
