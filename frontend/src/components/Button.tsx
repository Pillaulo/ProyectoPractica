import type { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export function Button({ variant = 'primary', className = '', ...rest }: Props) {
  const variantClass = variant === 'primary' ? 'btnPrimary' : 'btnSecondary';
  return <button className={`btn ${variantClass} ${className}`.trim()} {...rest} />;
}

