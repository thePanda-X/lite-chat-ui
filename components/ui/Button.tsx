import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({ 
  className = '', 
  variant = 'default', 
  size = 'md', 
  children, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]";
  
  const variants = {
    default: "bg-gradient-to-br from-primary/90 to-primary/80 text-primary-foreground shadow-lg shadow-primary/20 hover:from-primary hover:to-primary/90 hover:shadow-xl hover:shadow-primary/25",
    outline: "bg-transparent hover:bg-white/5 hover:text-foreground",
    ghost: "hover:bg-white/5 hover:text-foreground",
    destructive: "bg-gradient-to-br from-destructive/90 to-destructive/80 text-destructive-foreground shadow-lg hover:from-destructive hover:to-destructive/90",
    secondary: "bg-secondary/50 text-secondary-foreground hover:bg-secondary/70",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
    md: "h-10 px-4 text-sm rounded-xl gap-2",
    lg: "h-11 px-6 text-base rounded-xl gap-2",
    icon: "h-10 w-10 rounded-xl",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};
