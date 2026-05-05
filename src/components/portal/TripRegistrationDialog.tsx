import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { Trip } from "@/components/portal/TripCard";

interface TripRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: Trip | null;
  studentName: string;
  studentClass: string;
  onConfirm: (data: { allergies: string; medicalConditions: string }) => void;
}

export const TripRegistrationDialog = ({
  open,
  onOpenChange,
  trip,
  studentName,
  studentClass,
  onConfirm,
}: TripRegistrationDialogProps) => {
  const { language } = useLanguage();

  const [allergies, setAllergies] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [consented, setConsented] = useState(false);

  const fontClass =
    language === "th"
      ? "font-sukhumvit"
      : language === "zh"
      ? "font-noto-sc"
      : "font-lato";

  const resetForm = () => {
    setAllergies("");
    setMedicalConditions("");
    setConsented(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    if (!consented) return;
    onConfirm({ allergies, medicalConditions });
    resetForm();
  };

  if (!trip) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={fontClass}>
            {language === "th"
              ? "ลงทะเบียนทัศนศึกษา"
              : language === "zh"
              ? "报名参加校外活动"
              : "Trip Registration"}
          </DialogTitle>
          <DialogDescription className={fontClass}>
            {trip.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Student Information */}
          <div className="space-y-3">
            <h3
              className={`text-sm font-semibold text-muted-foreground uppercase tracking-wide ${fontClass}`}
            >
              {language === "th"
                ? "ข้อมูลนักเรียน"
                : language === "zh"
                ? "学生信息"
                : "Student Information"}
            </h3>
            <div className="p-3 bg-muted/50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className={`text-muted-foreground ${fontClass}`}>
                  {language === "th"
                    ? "ชื่อนักเรียน"
                    : language === "zh"
                    ? "学生姓名"
                    : "Student Name"}
                </span>
                <span className={`font-medium ${fontClass}`}>
                  {studentName}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={`text-muted-foreground ${fontClass}`}>
                  {language === "th"
                    ? "ชั้นเรียน"
                    : language === "zh"
                    ? "年级"
                    : "Class / Year Group"}
                </span>
                <span className={`font-medium ${fontClass}`}>
                  {studentClass}
                </span>
              </div>
            </div>
          </div>

          {/* Health Information */}
          <div className="space-y-3">
            <h3
              className={`text-sm font-semibold text-muted-foreground uppercase tracking-wide ${fontClass}`}
            >
              {language === "th"
                ? "ข้อมูลสุขภาพ"
                : language === "zh"
                ? "健康信息"
                : "Health Information"}{" "}
              ⚠️
            </h3>

            {/* Allergies */}
            <div className="space-y-2">
              <Label className={fontClass}>
                {language === "th"
                  ? "อาการแพ้"
                  : language === "zh"
                  ? "过敏情况"
                  : "Allergies"}
              </Label>
              <Textarea
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder={
                  language === "th"
                    ? "ไม่มี"
                    : language === "zh"
                    ? "无"
                    : "None"
                }
                className={`resize-none ${fontClass}`}
                rows={3}
              />
            </div>

            {/* Medical Conditions */}
            <div className="space-y-2">
              <Label className={fontClass}>
                {language === "th"
                  ? "ภาวะทางการแพทย์"
                  : language === "zh"
                  ? "病史/健康状况"
                  : "Medical Conditions"}
              </Label>
              <Textarea
                value={medicalConditions}
                onChange={(e) => setMedicalConditions(e.target.value)}
                placeholder={
                  language === "th"
                    ? "ไม่มี"
                    : language === "zh"
                    ? "无"
                    : "None"
                }
                className={`resize-none ${fontClass}`}
                rows={3}
              />
            </div>
          </div>

          {/* Consent */}
          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox
              checked={consented}
              onCheckedChange={(checked) => setConsented(checked === true)}
              className="mt-0.5"
            />
            <span className={`text-sm leading-snug ${fontClass}`}>
              {language === "th"
                ? "ฉันยืนยันว่าข้อมูลข้างต้นถูกต้องและยินยอมให้นักเรียนเข้าร่วมกิจกรรมทัศนศึกษานี้"
                : language === "zh"
                ? "我确认以上信息准确无误，并同意学生参加此次校外活动"
                : "I confirm the above information is accurate and consent to this trip"}
            </span>
          </label>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} className={fontClass}>
            {language === "th"
              ? "ยกเลิก"
              : language === "zh"
              ? "取消"
              : "Cancel"}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!consented}
            className={fontClass}
          >
            {language === "th"
              ? "ยืนยันการลงทะเบียน"
              : language === "zh"
              ? "确认报名"
              : "Confirm Register"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
