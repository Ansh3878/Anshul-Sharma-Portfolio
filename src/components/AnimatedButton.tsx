import { ArrowUpRight } from "lucide-react";

interface AnimatedButtonProps {
  label: string;
  href?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
}

const AnimatedButton = ({
  label,
  href,
  onClick,
  target,
  rel,
}: AnimatedButtonProps) => {
  const inner = (
    <span className="animated-btn relative text-sm font-semibold rounded-full h-12 p-1 ps-6 pe-14 inline-flex items-center w-fit overflow-hidden cursor-pointer select-none">
      <span className="animated-btn__text relative z-10 transition-all duration-500 whitespace-nowrap">
        {label}
      </span>
      <span className="animated-btn__icon absolute right-1 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500">
        <ArrowUpRight size={18} />
      </span>
    </span>
  );

  if (href) {
    return (
      <a href={href} target={target} rel={rel} onClick={onClick} className="animated-btn-wrapper">
        {inner}
      </a>
    );
  }

  return (
    <button onClick={onClick} className="animated-btn-wrapper">
      {inner}
    </button>
  );
};

export default AnimatedButton;
