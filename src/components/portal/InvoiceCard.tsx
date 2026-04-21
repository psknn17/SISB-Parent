import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar, ShoppingCart, AlertCircle, CheckCircle, ChevronDown, ChevronUp, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { downloadReceiptPDF } from "@/lib/downloadUtils";

interface InvoiceCardProps {
  invoice: {
    id: string;
    type: 'Yearly' | 'Termly' | 'Monthly';
    amount_due: number;
    due_date: string;
    status: 'pending' | 'overdue' | 'paid' | 'partial';
    description: string;
    term?: string;
    line_items?: Array<{
      id: string;
      description: string;
      amount: number;
      category: string;
    }>;
  };
  creditBalance?: number;
  onAddToCart?: (invoiceId: string, paymentOption?: string, amount?: number) => void;
  onRemoveFromCart?: (invoiceId: string) => void;
  isInCart?: boolean;
  studentName?: string;
  initialPaymentOption?: string;
}

export const InvoiceCard = ({ invoice, creditBalance = 0, onAddToCart, onRemoveFromCart, isInCart = false, studentName, initialPaymentOption = '' }: InvoiceCardProps) => {
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<string>(initialPaymentOption);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const isOverdue = new Date(invoice.due_date) < new Date() && invoice.status !== 'paid';
  const { language, formatCurrency, t } = useLanguage();
  
  // Payment options with different amounts
  const paymentOptions = [
    {
      id: "yearly",
      label: "Yearly Payment",
      amount: invoice.amount_due,
      description: "Pay full amount for the academic year",
      discount: "Save ฿10,000 with yearly payment"
    },
    {
      id: "termly",
      label: "Termly Payment",
      amount: Math.round((invoice.amount_due + 10000) / 3), // Add ฿10,000 and divide by 3 terms
      description: "Pay in 3 installments (Term 1, 2 & 3)",
      note: "First term payment"
    }
  ];
  
  const selectedOption = paymentOptions.find(option => option.id === selectedPaymentOption);
  const currentAmount = selectedOption ? selectedOption.amount : invoice.amount_due;
  const canPayWithCredit = creditBalance >= currentAmount;

  const handleDownloadInvoice = () => {
    downloadReceiptPDF({
      title: 'Invoice',
      receiptId: invoice.id,
      studentName: studentName ?? 'Student',
      amount: formatCurrency(invoice.amount_due),
      paymentDate: formatDate(invoice.due_date),
      paymentMethod: invoice.status === 'paid' ? 'Paid' : 'Due',
      description: `${invoice.description}${invoice.term ? ' — ' + invoice.term : ''}`,
      items: invoice.line_items?.map(item => ({
        name: `${item.description} (${item.category})`,
        price: formatCurrency(item.amount),
      })),
    });
  };
  
  const statusConfig = {
    pending: { label: t('invoice.pending'), color: 'bg-warning-orange/20 text-warning-orange' },
    overdue: { label: t('invoice.overdue'), color: 'bg-destructive/20 text-destructive' },
    paid: { label: t('invoice.paid'), color: 'bg-finance-green/20 text-finance-green' },
    partial: { label: t('invoice.partial'), color: 'bg-info-cyan/20 text-info-cyan' },
  };

  const formatDate = (dateString: string) => {
    const locale = language === 'th' ? 'th-TH' : language === 'zh' ? 'zh-CN' : 'en-US';
    return new Date(dateString).toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };


  return (
    <Card className={`relative ${isOverdue ? 'border-destructive/50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className={`font-semibold text-base ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{invoice.description}</h3>
            </div>
            {studentName && (
              <p className={`text-xs text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {t('portal.student')}: {studentName}
              </p>
            )}
            {invoice.term && (
              <p className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{invoice.term}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownloadInvoice}
              className={`p-2 h-8 w-8 hover:bg-muted ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              title="Download Invoice"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Badge className={`${statusConfig[invoice.status].color} ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {statusConfig[invoice.status].label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            <Calendar className="h-4 w-4" />
            <span>{t('invoice.due')}: {formatDate(invoice.due_date)}</span>
            {isOverdue && <AlertCircle className="h-4 w-4 text-destructive" />}
          </div>
        </div>

        <div className="space-y-3">
          {/* Payment Options */}
          {invoice.status !== 'paid' && (
            <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
              <div className={`text-sm font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                Select Payment Option:
              </div>
              <RadioGroup value={selectedPaymentOption} onValueChange={setSelectedPaymentOption} disabled={isInCart}>
                {paymentOptions.map((option) => (
                  <div key={option.id} className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value={option.id} id={`${invoice.id}-${option.id}`} />
                      <Label htmlFor={`${invoice.id}-${option.id}`} className="cursor-pointer flex-1">
                        <div className={`space-y-1 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{option.label}</span>
                            <span className="font-bold text-primary">
                              {formatCurrency(option.amount)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                          {option.discount && (
                            <p className="text-xs text-green-600 font-medium">{option.discount}</p>
                          )}
                          {option.note && (
                            <p className="text-xs text-blue-600">{option.note}</p>
                          )}
                        </div>
                      </Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Detailed Breakdown Toggle */}
          {invoice.line_items && invoice.line_items.length > 0 && (
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className={`w-full justify-between p-2 h-auto text-sm ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              >
                <span>View Detailed Breakdown</span>
                {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              
              {showDetails && (
                <div className="space-y-2 p-3 bg-muted/20 rounded-lg border">
                  <div className={`text-sm font-medium mb-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    Invoice Details:
                  </div>
                  {invoice.line_items.map((item, index) => (
                    <div key={item.id} className={`flex items-center justify-between py-1 ${index !== invoice.line_items!.length - 1 ? 'border-b border-muted' : ''}`}>
                      <div className="flex-1">
                        <div className={`text-sm ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                          {item.description}
                        </div>
                        <div className={`text-xs text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                          {item.category}
                        </div>
                      </div>
                      <div className={`text-sm font-medium text-right ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {formatCurrency(item.amount)}
                      </div>
                    </div>
                  ))}
                  <div className={`flex items-center justify-between pt-2 border-t border-primary/20 font-bold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    <span>Total:</span>
                    <span className="text-primary">{formatCurrency(invoice.amount_due)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className={`font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {selectedOption ? `Amount to Pay (${selectedOption.label}):` : t('invoice.amountDue') + ':'}
            </span>
            <span className={`text-lg font-bold text-primary ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {formatCurrency(currentAmount)}
            </span>
          </div>
          
          {creditBalance > 0 && invoice.status !== 'paid' && (
            <div className="flex items-center justify-between text-sm">
              <span className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('invoice.availableCredit')}:</span>
              <span className={`text-finance-green font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {formatCurrency(creditBalance)}
              </span>
            </div>
          )}
        </div>

        {invoice.status !== 'paid' && (
          <div className="pt-2 space-y-2">
            {canPayWithCredit && (
              <div className={`flex items-center gap-2 text-sm text-finance-green bg-finance-green/10 p-2 rounded ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                <CheckCircle className="h-4 w-4" />
                <span>{t('invoice.canPayWithCredit')}</span>
              </div>
            )}
            
            {isInCart ? (
              <Button
                className={`w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                variant="outline"
                onClick={() => onRemoveFromCart?.(invoice.id)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {language === 'th' ? 'ลบออกจากตะกร้า' : language === 'zh' ? '从购物车移除' : 'Remove from Cart'}
              </Button>
            ) : (
              <Button
                className={`w-full ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                onClick={() => onAddToCart?.(invoice.id, selectedPaymentOption, currentAmount)}
                variant={isOverdue ? "destructive" : "default"}
                disabled={!selectedPaymentOption}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {!selectedPaymentOption
                  ? (language === 'th' ? 'เลือกตัวเลือกการชำระเงิน' : language === 'zh' ? '请选择付款方式' : 'Select Payment Option to Continue')
                  : (language === 'th' ? 'เพิ่มลงตะกร้า' : language === 'zh' ? '加入购物车' : 'Add to Cart')
                }
              </Button>
            )}

            {!selectedPaymentOption && !isInCart && (
              <p className={`text-xs text-muted-foreground text-center ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {language === 'th' ? 'กรุณาเลือกตัวเลือกการชำระเงินด้านบน' : language === 'zh' ? '请在上方选择付款选项' : 'Please select yearly or termly payment option above'}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};