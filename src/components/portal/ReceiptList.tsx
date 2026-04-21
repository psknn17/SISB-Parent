import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Receipt, CreditCard, DollarSign, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Receipt {
  id: string;
  invoice_id: string;
  amount: number;
  payment_method: 'credit_card' | 'bank_transfer' | 'credit_note' | 'cash' | 'promptpay';
  paid_at: string;
  receipt_url: string;
  status: 'completed' | 'processing' | 'failed';
  description: string;
  reference_number: string;
}

interface ReceiptListProps {
  receipts: Receipt[];
  onDownload?: (receiptId: string) => void;
}

export const ReceiptList = ({ receipts, onDownload }: ReceiptListProps) => {
  const { language, formatCurrency, t } = useLanguage();

  const paymentMethodConfig = {
    credit_card: { 
      label: t('payment.creditCard'), 
      icon: CreditCard, 
      gradient: 'from-blue-500 to-purple-600' 
    },
    bank_transfer: { 
      label: t('payment.bankTransfer'), 
      icon: DollarSign, 
      gradient: 'from-green-500 to-emerald-600' 
    },
    credit_note: { 
      label: t('payment.creditNote'), 
      icon: FileText, 
      gradient: 'from-orange-500 to-amber-600' 
    },
    cash: {
      label: t('payment.cash'),
      icon: DollarSign,
      gradient: 'from-gray-500 to-slate-600'
    },
    promptpay: {
      label: 'PromptPay',
      icon: CreditCard,
      gradient: 'from-violet-500 to-purple-600'
    },
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'th' ? 'th-TH' : language === 'zh' ? 'zh-CN' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (receipts.length === 0) {
    return (
      <div className={`text-center py-8 text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
        <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>{t('portal.noReceipts')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 rounded-lg text-sm font-medium text-muted-foreground">
        <div className={`col-span-4 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
          {t('portal.receiptName')}
        </div>
        <div className={`col-span-3 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
          {t('portal.dateOfPurchase')}
        </div>
        <div className={`col-span-2 text-right ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
          {t('portal.amount')}
        </div>
        <div className={`col-span-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
          {t('portal.category')}
        </div>
        <div className="col-span-1"></div>
      </div>

      {/* Receipts */}
      {receipts.map((receipt) => {
        const PaymentIcon = paymentMethodConfig[receipt.payment_method].icon;
        const iconGradient = paymentMethodConfig[receipt.payment_method].gradient;

        return (
          <div
            key={receipt.id}
            className="grid grid-cols-12 gap-4 px-4 py-4 bg-card rounded-lg border hover:bg-accent/50 transition-colors"
          >
            {/* Receipt Name with Icon */}
            <div className="col-span-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${iconGradient} flex-shrink-0`}>
                <Receipt className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className={`font-semibold text-sm truncate ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {receipt.description}
                </p>
                <p className={`text-xs text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  Ref: {receipt.reference_number}
                </p>
              </div>
            </div>

            {/* Date */}
            <div className={`col-span-3 flex items-center text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {formatDate(receipt.paid_at)}
            </div>

            {/* Amount */}
            <div className={`col-span-2 flex items-center justify-end text-sm font-semibold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {formatCurrency(receipt.amount)}
            </div>

            {/* Category (Payment Method) */}
            <div className="col-span-2 flex items-center">
              <Badge 
                variant="outline" 
                className={`gap-1 ${
                  receipt.payment_method === 'credit_card' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                  receipt.payment_method === 'bank_transfer' ? 'border-green-200 text-green-700 bg-green-50' :
                  receipt.payment_method === 'credit_note' ? 'border-orange-200 text-orange-700 bg-orange-50' :
                  'border-gray-200 text-gray-700 bg-gray-50'
                }`}
              >
                <PaymentIcon className="h-3 w-3" />
                <span className={`text-xs ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {paymentMethodConfig[receipt.payment_method].label}
                </span>
              </Badge>
            </div>

            {/* Action */}
            <div className="col-span-1 flex items-center justify-end">
              {receipt.status === 'completed' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-primary/10"
                  onClick={() => onDownload?.(receipt.id)}
                  title={t('portal.downloadReceipt')}
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};