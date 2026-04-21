import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, Globe, Upload } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Exam } from "@/data/mockData";

export interface ExamRegistration {
  examId: string;
  examName: string;
  nationality: string;
  documentType: string;
  documentNumber: string;
  gender: string;
  photoFile: File | null;
  option: 'exam_only' | 'exam_with_results';
  price: number;
}

interface ExamRegistrationModalProps {
  exam: Exam | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (registration: ExamRegistration) => void;
}

export const ExamRegistrationModal = ({
  exam,
  open,
  onOpenChange,
  onSubmit,
}: ExamRegistrationModalProps) => {
  const { language, formatCurrency } = useLanguage();
  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nationality, setNationality] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [gender, setGender] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [option, setOption] = useState<'exam_only' | 'exam_with_results'>('exam_only');

  if (!exam) return null;

  const price = option === 'exam_with_results'
    ? exam.price + exam.resultsDeliveryPrice
    : exam.price;

  const isValid = nationality && documentType && documentNumber.trim() && gender;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoFile(e.target.files?.[0] ?? null);
  };

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit({ examId: exam.id, examName: exam.name, nationality, documentType, documentNumber, gender, photoFile, option, price });
    setNationality(''); setDocumentType(''); setDocumentNumber('');
    setGender(''); setPhotoFile(null); setOption('exam_only');
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (language === 'th') return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
    if (language === 'zh') return d.toLocaleDateString('zh-CN', { day: 'numeric', month: 'short', year: 'numeric' });
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const T = {
    title:           language === 'th' ? 'ลงทะเบียนสอบ'                      : language === 'zh' ? '考试注册'       : 'Exam Registration',
    nationality:     language === 'th' ? 'สัญชาติ'                            : language === 'zh' ? '国籍'           : 'Nationality',
    selNat:          language === 'th' ? 'เลือกสัญชาติ...'                    : language === 'zh' ? '选择国籍...'    : 'Select nationality...',
    docType:         language === 'th' ? 'ประเภทเอกสาร'                       : language === 'zh' ? '证件类型'       : 'Document Type',
    selDoc:          language === 'th' ? 'เลือกประเภทเอกสาร...'              : language === 'zh' ? '选择类型...'    : 'Select document type...',
    nationalId:      language === 'th' ? 'บัตรประจำตัวประชาชน'               : language === 'zh' ? '身份证'         : 'National ID',
    passport:        language === 'th' ? 'หนังสือเดินทาง'                     : language === 'zh' ? '护照'           : 'Passport',
    docNumber:       language === 'th' ? 'หมายเลขบัตร / หนังสือเดินทาง'     : language === 'zh' ? '证件号码'       : 'ID/Passport Number',
    docPlaceholder:  language === 'th' ? 'กรอกหมายเลขเอกสาร'                 : language === 'zh' ? '输入证件号码'   : 'Enter ID/Passport number',
    gender:          language === 'th' ? 'เพศ'                                : language === 'zh' ? '性别'           : 'Gender',
    selGender:       language === 'th' ? 'เลือกเพศ...'                        : language === 'zh' ? '选择性别...'    : 'Select gender...',
    female:          language === 'th' ? 'หญิง'                               : language === 'zh' ? '女'             : 'Female',
    male:            language === 'th' ? 'ชาย'                                : language === 'zh' ? '男'             : 'Male',
    preferNot:       language === 'th' ? 'ไม่ระบุ'                            : language === 'zh' ? '不公开'         : 'Prefer not to say',
    photo:           language === 'th' ? 'รูปถ่ายบัตร / หนังสือเดินทาง'     : language === 'zh' ? '证件照片'       : 'ID/Passport Photo',
    clickUpload:     language === 'th' ? 'คลิกเพื่ออัปโหลดรูปภาพ'           : language === 'zh' ? '点击上传照片'   : 'Click to upload photo',
    fileHint:        language === 'th' ? 'JPG, PNG ขนาดไม่เกิน 5 MB'         : language === 'zh' ? 'JPG, PNG 不超过 5 MB' : 'JPG, PNG up to 5 MB',
    examOption:      language === 'th' ? 'เลือกตัวเลือกการสอบ'               : language === 'zh' ? '选择考试选项'   : 'Select Exam Option',
    examOnly:        language === 'th' ? 'สอบอย่างเดียว'                      : language === 'zh' ? '仅考试'         : 'Exam Only',
    examResults:     language === 'th' ? 'สอบ + ผลคะแนน'                     : language === 'zh' ? '考试 + 成绩'    : 'Exam + Results Delivery',
    cancel:          language === 'th' ? 'ยกเลิก'                             : language === 'zh' ? '取消'           : 'Cancel',
    addToCart:       language === 'th' ? 'เพิ่มลงตะกร้า'                     : language === 'zh' ? '加入购物车'     : 'Add to Cart',
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
          <p className={`text-sm text-primary font-medium ${fontClass}`}>{exam.name}</p>
        </DialogHeader>

        {/* Date + Time */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground border-b pb-4">
          <span className={`flex items-center gap-1.5 ${fontClass}`}>
            <Calendar className="h-4 w-4" /> {formatDate(exam.date)}
          </span>
          <span className={`flex items-center gap-1.5 ${fontClass}`}>
            <Clock className="h-4 w-4" /> {exam.time}
          </span>
        </div>

        <div className="space-y-4">
          {/* Nationality */}
          <div className="space-y-1.5">
            <Label className={`text-sm font-medium flex items-center gap-1.5 ${fontClass}`}>
              <Globe className="h-4 w-4 text-muted-foreground" />
              {T.nationality} <span className="text-destructive">*</span>
            </Label>
            <Select value={nationality} onValueChange={setNationality}>
              <SelectTrigger className={fontClass}>
                <SelectValue placeholder={T.selNat} />
              </SelectTrigger>
              <SelectContent>
                {['ไทย / Thai', 'อังกฤษ / British', 'อเมริกัน / American', 'จีน / Chinese', 'อื่นๆ / Other'].map(n => (
                  <SelectItem key={n} value={n} className={fontClass}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Document Type */}
          <div className="space-y-1.5">
            <RequiredLabel text={T.docType} />
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger className={fontClass}>
                <SelectValue placeholder={T.selDoc} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="national_id" className={fontClass}>{T.nationalId}</SelectItem>
                <SelectItem value="passport" className={fontClass}>{T.passport}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Document Number */}
          <div className="space-y-1.5">
            <RequiredLabel text={T.docNumber} />
            <Input
              className={fontClass}
              placeholder={T.docPlaceholder}
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
            />
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <RequiredLabel text={T.gender} />
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className={fontClass}>
                <SelectValue placeholder={T.selGender} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female" className={fontClass}>{T.female}</SelectItem>
                <SelectItem value="male" className={fontClass}>{T.male}</SelectItem>
                <SelectItem value="prefer_not" className={fontClass}>{T.preferNot}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Photo Upload */}
          <div className="space-y-1.5">
            <RequiredLabel text={T.photo} />
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <div
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:text-primary transition-colors text-muted-foreground"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-6 w-6 mx-auto mb-2 opacity-60" />
              <p className={`text-sm font-medium ${fontClass}`}>
                {photoFile ? photoFile.name : T.clickUpload}
              </p>
            </div>
          </div>

          {/* Exam Option — full-width radio rows */}
          <div className="space-y-2">
            <Label className={`text-sm font-medium ${fontClass}`}>{T.examOption}</Label>
            <div className="space-y-2">
              {/* Exam Only */}
              <div
                className={`flex items-center justify-between border-2 rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                  option === 'exam_only' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                }`}
                onClick={() => setOption('exam_only')}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    option === 'exam_only' ? 'border-primary' : 'border-muted-foreground'
                  }`}>
                    {option === 'exam_only' && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <span className={`text-sm font-medium ${fontClass}`}>{T.examOnly}</span>
                </div>
                <span className={`text-sm font-bold ${fontClass}`}>{formatCurrency(exam.price)}</span>
              </div>

              {/* Exam + Results Delivery */}
              <div
                className={`flex items-center justify-between border-2 rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                  option === 'exam_with_results' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                }`}
                onClick={() => setOption('exam_with_results')}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    option === 'exam_with_results' ? 'border-primary' : 'border-muted-foreground'
                  }`}>
                    {option === 'exam_with_results' && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <span className={`text-sm font-medium ${fontClass}`}>{T.examResults}</span>
                </div>
                <span className={`text-sm font-bold ${fontClass}`}>{formatCurrency(exam.price + exam.resultsDeliveryPrice)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between py-2 border-t">
          <span className={`text-sm font-semibold ${fontClass}`}>
            {language === 'th' ? 'รวมทั้งหมด' : language === 'zh' ? '总计' : 'Total'}
          </span>
          <span className={`text-xl font-bold text-primary ${fontClass}`}>
            {formatCurrency(price)}
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
