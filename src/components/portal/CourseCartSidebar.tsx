import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { X, ShoppingCart, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CourseCartItem {
  id: string;
  name: string;
  price: number;
  studentName?: string;
  studentId?: string;
  type: 'course' | 'activity';
  isMandatory?: boolean;
}

interface CourseCartSidebarProps {
  items: CourseCartItem[];
  onRemoveItem: (itemId: string, studentId?: string) => void;
  onCheckout: () => void;
  onClearAll?: () => void;
  cartType?: 'course' | 'camp' | 'event' | 'exam';
}


export const CourseCartSidebar = ({ items, onRemoveItem, onCheckout, onClearAll, cartType = 'course' }: CourseCartSidebarProps) => {
  const { t, language, formatCurrency } = useLanguage();
  
  // Get cart title based on type
  const getCartTitle = () => {
    if (cartType === 'camp') {
      return language === 'th' ? 'รายการค่าย' : 'Camp Cart';
    } else if (cartType === 'event') {
      return language === 'th' ? 'รายการกิจกรรม' : 'Event Cart';
    } else if (cartType === 'exam') {
      return language === 'th' ? 'รายการสอบ' : 'Exam Cart';
    }
    return language === 'th' ? 'รายการหลักสูตร' : 'Course Cart';
  };
  
  const getEmptyMessage = () => {
    if (cartType === 'camp') {
      return language === 'th' ? 'ยังไม่มีค่ายที่เลือก' : 'No camps selected';
    } else if (cartType === 'event') {
      return language === 'th' ? 'ยังไม่มีกิจกรรมที่เลือก' : 'No events selected';
    } else if (cartType === 'exam') {
      return language === 'th' ? 'ยังไม่มีการสอบที่เลือก' : 'No exams selected';
    }
    return language === 'th' ? 'ยังไม่มีรายการที่เลือก' : 'No courses selected';
  };
  
  const getEmptySubMessage = () => {
    if (cartType === 'camp') {
      return language === 'th' ? 'เลือกค่ายที่ต้องการลงทะเบียน' : 'Select camps to register';
    } else if (cartType === 'event') {
      return language === 'th' ? 'เลือกกิจกรรมที่ต้องการลงทะเบียน' : 'Select events to register';
    } else if (cartType === 'exam') {
      return language === 'th' ? 'เลือกการสอบที่ต้องการลงทะเบียน' : 'Select exams to register';
    }
    return language === 'th' ? 'เลือกหลักสูตรที่ต้องการลงทะเบียน' : 'Select courses to register';
  };
  
  const total = items.reduce((sum, item) => sum + item.price, 0);
  
  return (
    <div className="sticky top-6">
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className={`text-lg flex items-center gap-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            <ShoppingCart className="h-5 w-5" />
            {getCartTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
              <p className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {getEmptyMessage()}
              </p>
              <p className={`text-xs text-muted-foreground mt-1 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {getEmptySubMessage()}
              </p>
            </div>
          ) : (
            <>
              {/* Important Note */}
              <div className="bg-warning-orange/10 border border-warning-orange/20 p-3 rounded-lg flex gap-2">
                <AlertCircle className="h-4 w-4 text-warning-orange flex-shrink-0 mt-0.5" />
                <p className={`text-xs text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {language === 'th' 
                    ? 'หลักสูตรแยกจากค่าเล่าเรียน และไม่สามารถชำระแยก Campus ได้' 
                    : 'Courses are separate from tuition and cannot be paid across campuses'}
                </p>
              </div>

              {/* Total */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    {language === 'th' ? 'รายการ' : 'Items'}: {items.length}
                  </span>
                </div>

                {/* Item list */}
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.studentId}`} className="flex items-start justify-between gap-2 py-2 border-b border-border/50 last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                          {item.name}
                        </p>
                        {item.studentName && (
                          <p className={`text-xs text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                            {item.studentName}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className={`text-sm font-semibold text-primary ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                          {formatCurrency(item.price)}
                        </span>
                        {!item.isMandatory && (
                          <button
                            onClick={() => onRemoveItem(item.id, item.studentId)}
                            className="text-muted-foreground hover:text-destructive transition-colors ml-1"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                  <span className={`font-semibold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    {language === 'th' ? 'ยอดรวม' : 'Total'}
                  </span>
                  <span className={`text-xl font-bold text-primary ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {onClearAll && items.length > 0 && (
                  <Button 
                    onClick={onClearAll} 
                    variant="outline"
                    className={`w-full ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                  >
                    <X className="h-4 w-4 mr-2" />
                    {language === 'th' ? 'ล้างรายการทั้งหมด' : 'Clear All'}
                  </Button>
                )}
                
                <Button 
                  onClick={onCheckout} 
                  className={`w-full h-11 text-base ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                  disabled={items.length === 0}
                >
                  {language === 'th' ? 'ดำเนินการชำระเงิน' : 'Proceed to Payment'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};