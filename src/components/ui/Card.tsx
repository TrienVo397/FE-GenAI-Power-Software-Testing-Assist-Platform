import React, { ReactNode, ElementType, HTMLAttributes } from 'react';

/**
 * Card component wrapper
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`
        rounded-lg
        border border-gray-200
        bg-white
        text-gray-900
        shadow-sm
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card header container
 */
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '', ...props }: CardHeaderProps) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

/**
 * Card title with optional icon
 */
export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  /** Icon component displayed before title */
  icon?: ElementType;
  className?: string;
}

export function CardTitle({
  children,
  icon: Icon,
  className = '',
  ...props
}: CardTitleProps) {
  return (
    <h3
      className={`text-2xl font-semibold leading-none tracking-tight flex items-center gap-2 ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5 text-gray-500" />}
      {children}
    </h3>
  );
}

/**
 * Card description text
 */
export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className = '', ...props }: CardDescriptionProps) {
  return (
    <p className={`text-sm text-gray-500 ${className}`} {...props}>
      {children}
    </p>
  );
}

/**
 * Main content area of the card
 */
export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '', ...props }: CardContentProps) {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
}

/**
 * Footer area of the card
 */
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '', ...props }: CardFooterProps) {
  return (
    <div className={`flex items-center p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Card;
