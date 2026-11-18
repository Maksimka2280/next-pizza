
import { cn } from "../../lib/utils";
type Props = {
  className?: string;
  src?: string;
}
export const CheckoutImg: React.FC<Props> = ({ src, className }) => {
  return <img className={cn('h-12 w-12 shrink-0 object-contain sm:h-[60px] sm:w-[60px]', className)} src={src} />;
};