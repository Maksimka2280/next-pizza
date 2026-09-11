
import { cn } from "../../lib/utils";
type Props = {
value: number;
className?: string;
}
export const CheckoutPrice: React.FC<Props> = ({ value, className }) => {
  return <h2 className={cn('font-bold', className)}>{value} ₴</h2>;
};