interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'h-8 w-auto',
  md: 'h-12 w-auto',
  lg: 'h-16 w-auto'
};

const textSizeMap = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl'
};

export function Logo({ className = '', size = 'md' }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img 
        src="/assets/logo_head.png" 
        alt="PDF AI Viewer Logo" 
        className={sizeMap[size]}
      />
      <h1 className={`font-bold ${textSizeMap[size]}`}>
        PDF AI Viewer
      </h1>
    </div>
  );
}
