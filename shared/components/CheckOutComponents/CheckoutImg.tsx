
import { cn } from "../../lib/utils";
type Props = {
  className?: string;
  src?: string;
}
export const CheckoutImg: React.FC<Props> = ({ src, className }) => {
  return <img className={cn('w-[60px] h-[60px]', className)} src={src} />;
};