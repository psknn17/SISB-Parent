import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertCircle, CheckCircle, ChevronDown, ChevronUp, DollarSign, Lock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LineItem {
  id: string;
  description: string;
  amount: number;
  category: string;
}

interface InvoiceCardProps {
  invoice: {
    id: string;
    type: 'Yearly' | 'Termly' | 'Monthly';
    amount_due: number;
    due_date: string;
    status: 'paid' | 'unpaid' | 'overdue' | 'cancelled' | 'on_hold';
    description: string;
    term?: string;
    line_items?: LineItem[];
  };
  creditBalance?: number;
  onAddToCart?: (invoiceId: string, amount?: number) => void;
  onRemoveFromCart?: (invoiceId: string) => void;
  isInCart?: boolean;
  isLocked?: boolean;
  lockedReason?: string;
  isOnHold?: boolean;
  studentName?: string;
  remainingAmount?: number;
}

export const InvoiceCard = ({ invoice, creditBalance = 0, onAddToCart, onRemoveFromCart, isInCart, isLocked, lockedReason, isOnHold, studentName, remainingAmount }: InvoiceCardProps) => {
  const isOverdue = invoice.status === 'overdue';
  const canPay = invoice.status === 'unpaid' || invoice.status === 'overdue';
  const canPayWithCredit = creditBalance >= invoice.amount_due;
  const { language, formatCurrency, t } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);
  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';
  
  const statusConfig = {
    paid: { label: language === 'th' ? 'ชำระแล้ว' : language === 'zh' ? '已付款' : 'Paid', color: 'bg-finance-green/20 text-finance-green' },
    unpaid: { label: language === 'th' ? 'ยังไม่ชำระ' : language === 'zh' ? '未付款' : 'Unpaid', color: 'bg-warning-orange/20 text-warning-orange' },
    overdue: { label: language === 'th' ? 'เกินกำหนด' : language === 'zh' ? '逾期' : 'Overdue', color: 'bg-destructive/20 text-destructive' },
    cancelled: { label: language === 'th' ? 'ยกเลิกแล้ว' : language === 'zh' ? '已取消' : 'Cancelled', color: 'bg-muted text-muted-foreground' },
    on_hold: { label: language === 'th' ? 'พักไว้ชั่วคราว' : language === 'zh' ? '暂停' : 'On Hold', color: 'bg-muted text-muted-foreground' },
  };

  const formatDate = (dateString: string) => {
    const locale = language === 'th' ? 'th-TH' : language === 'zh' ? 'zh-CN' : 'en-US';
    return new Date(dateString).toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };


  const isPaid = invoice.status === 'paid';
  const accentColor = invoice.status === 'on_hold' || isOnHold ? 'bg-muted' : isPaid ? 'bg-finance-green' : isOverdue ? 'bg-destructive' : invoice.status === 'cancelled' ? 'bg-muted' : 'bg-warning-orange';

  return (
    <Card className={`overflow-hidden transition-all ${isOverdue ? 'border-destructive/50' : ''}`}>
      <div className={`h-1 w-full ${accentColor}`} />
      <CardContent className="p-4 space-y-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className={`p-2 rounded-lg shrink-0 ${isPaid ? 'bg-finance-green/10' : 'bg-primary/10'}`}>
              <DollarSign className={`h-5 w-5 ${isPaid ? 'text-finance-green' : 'text-primary'}`} />
            </div>
            <div className="min-w-0">
              <p className={`font-semibold text-base leading-snug ${fontClass}`}>{invoice.description}</p>
              {studentName && (
                <p className={`text-sm text-muted-foreground mt-0.5 ${fontClass}`}>{t('portal.student')}: {studentName}</p>
              )}
              {invoice.term && (
                <p className={`text-sm text-muted-foreground mt-0.5 ${fontClass}`}>{invoice.term}</p>
              )}
            </div>
          </div>
          <Badge variant="outline" className={`shrink-0 text-xs ${isInCart ? 'bg-primary/10 text-primary border-primary/30' : statusConfig[invoice.status].color} ${fontClass}`}>
            {isInCart ? (language === 'th' ? 'ในตะกร้า' : language === 'zh' ? '已加入购物车' : 'In Cart') : statusConfig[invoice.status].label}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 text-sm text-muted-foreground ${fontClass}`}>
            <Calendar className="h-4 w-4" />
            <span>{t('invoice.due')}: {formatDate(invoice.due_date)}</span>
            {isOverdue && <AlertCircle className="h-4 w-4 text-destructive" />}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`font-medium ${fontClass}`}>{t('invoice.amountDue')}:</span>
            <span className={`text-lg font-bold text-primary ${fontClass}`}>
              {formatCurrency(invoice.amount_due)}
            </span>
          </div>

          {remainingAmount !== undefined && canPay && (
            <div className="rounded-lg border border-border bg-muted/30 px-3 py-2.5 space-y-1.5 text-sm">
              <div className="flex items-center justify-between">
                <span className={`text-muted-foreground ${fontClass}`}>
                  {language === 'th' ? 'รวม (รายปี)' : language === 'zh' ? '总计（年度）' : 'Total (Yearly)'}:
                </span>
                <span className={`font-medium ${fontClass}`}>{formatCurrency(invoice.amount_due)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-muted-foreground ${fontClass}`}>
                  {language === 'th' ? 'ชำระแล้ว (รายเทอม)' : language === 'zh' ? '已付（学期）' : 'Paid (Termly)'}:
                </span>
                <span className={`text-destructive font-medium ${fontClass}`}>−{formatCurrency(invoice.amount_due - remainingAmount)}</span>
              </div>
              <div className="border-t border-border pt-1.5 flex items-center justify-between">
                <span className={`font-semibold ${fontClass}`}>
                  {language === 'th' ? 'ยอดคงเหลือ' : language === 'zh' ? '剩余金额' : 'Remaining'}:
                </span>
                <span className={`font-bold text-primary ${fontClass}`}>{formatCurrency(remainingAmount)}</span>
              </div>
            </div>
          )}

          {creditBalance > 0 && canPay && (
            <div className="flex items-center justify-between text-sm">
              <span className={`text-muted-foreground ${fontClass}`}>{t('invoice.availableCredit')}:</span>
              <span className={`text-finance-green font-medium ${fontClass}`}>
                {formatCurrency(creditBalance)}
              </span>
            </div>
          )}
        </div>

        {/* Line items toggle */}
        {invoice.line_items && invoice.line_items.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium bg-muted/40 hover:bg-muted/70 transition-colors ${fontClass}`}
            >
              <span>
                {language === 'th' ? 'รายการค่าใช้จ่าย' : language === 'zh' ? '费用明细' : 'Fee Breakdown'}
                <span className="ml-1.5 text-xs text-muted-foreground font-normal">
                  ({invoice.line_items.length} {language === 'th' ? 'รายการ' : language === 'zh' ? '项' : 'items'})
                </span>
              </span>
              {showDetails ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>

            {showDetails && (
              <div className="divide-y divide-border">
                {invoice.line_items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <div className="min-w-0">
                      <p className={`font-medium truncate ${fontClass}`}>{item.description}</p>
                      <p className={`text-xs text-muted-foreground ${fontClass}`}>{item.category}</p>
                    </div>
                    <span className={`ml-4 shrink-0 font-medium ${fontClass}`}>{formatCurrency(item.amount)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30">
                  <span className={`text-sm font-semibold ${fontClass}`}>
                    {language === 'th' ? 'รวมทั้งหมด' : language === 'zh' ? '合计' : 'Total'}
                  </span>
                  <span className={`text-sm font-bold text-primary ${fontClass}`}>{formatCurrency(invoice.amount_due)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {canPay && (
          <div className="pt-2 space-y-2">
            {canPayWithCredit && !isInCart && !isLocked && (
              <div className={`flex items-center gap-2 text-sm text-finance-green bg-finance-green/10 p-2 rounded ${fontClass}`}>
                <CheckCircle className="h-4 w-4" />
                <span>{t('invoice.canPayWithCredit')}</span>
              </div>
            )}

            {isOnHold ? (
              <div className={`flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 border border-border p-3 rounded-lg ${fontClass}`}>
                <Lock className="h-4 w-4 shrink-0" />
                <span>
                  {language === 'th'
                    ? 'ใบแจ้งชำระนี้ถูกพักไว้ชั่วคราว กรุณาติดต่อโรงเรียนเพื่อข้อมูลเพิ่มเติม'
                    : language === 'zh'
                    ? '此发票暂时搁置，请联系学校了解更多信息。'
                    : 'This invoice is currently on hold. Please contact the school for more information.'}
                </span>
              </div>
            ) : isLocked ? (
              <div className={`flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 border border-border p-3 rounded-lg ${fontClass}`}>
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{lockedReason}</span>
              </div>
            ) : isInCart ? (
              <Button
                variant="destructive"
                className={`w-full ${fontClass}`}
                onClick={() => onRemoveFromCart?.(invoice.id)}
              >
                {language === 'th' ? 'นำออกจากตะกร้า' : language === 'zh' ? '从购物车移除' : 'Remove from Cart'}
              </Button>
            ) : (
              <Button
                className={`w-full ${fontClass}`}
                onClick={() => onAddToCart?.(invoice.id, remainingAmount)}
              >
                {language === 'th' ? 'เพิ่มเข้าตะกร้า' : language === 'zh' ? '加入购物车' : 'Add to Cart'}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};