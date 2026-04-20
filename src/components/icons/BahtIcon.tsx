import { LucideProps } from "lucide-react";

export const BahtIcon = ({ className, ...props }: LucideProps) => {
  return (
    <div
      className={`inline-flex items-center justify-center font-bold text-current ${className}`}
      style={{ fontSize: 'inherit' }}
      {...props}
    >
      ฿
    </div>
  );
};