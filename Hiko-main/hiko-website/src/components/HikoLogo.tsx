import Image from 'next/image';

interface HikoLogoProps {
  variant?: 'green' | 'cream';
  className?: string;
}

export default function HikoLogo({ variant = 'green', className = '' }: HikoLogoProps) {
  const logoSrc = variant === 'green' ? '/Hiko Website Logo Green.png' : '/HikoApp Logo Cream.png';
  
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src={logoSrc}
        alt="Hiko Logo"
        width={120}
        height={40}
        className="flex-shrink-0"
        priority
      />
    </div>
  );
}
