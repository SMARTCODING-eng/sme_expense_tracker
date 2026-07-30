import React from 'react';
import {
  Utensils,
  ShoppingBag,
  Home,
  Car,
  Zap,
  Film,
  HeartPulse,
  GraduationCap,
  Wallet,
  Briefcase,
  TrendingUp,
  Coins,
  MoreHorizontal,
  CreditCard,
  Banknote,
  ArrowRightLeft,
  Smartphone,
} from 'lucide-react';

const NairaIcon = ({ className = "", ...props }) => (
    <span
        className={'font-bold ${className}'}
        {...props}
    >
        
    </span>
);
export const CategoryIcon = ({ name, ...props }) => {
  switch (name) {
    case 'Utensils':
      return <Utensils {...props} />;
    case 'ShoppingBag':
      return <ShoppingBag {...props} />;
    case 'Home':
      return <Home {...props} />;
    case 'Car':
      return <Car {...props} />;
    case 'Zap':
      return <Zap {...props} />;
    case 'Film':
      return <Film {...props} />;
    case 'HeartPulse':
      return <HeartPulse {...props} />;
    case 'GraduationCap':
      return <GraduationCap {...props} />;
    case 'Wallet':
      return <Wallet {...props} />;
    case 'Briefcase':
      return <Briefcase {...props} />;
    case 'TrendingUp':
      return <TrendingUp {...props} />;
    case 'Coins':
      return <Coins {...props} />;
    case 'CreditCard':
      return <CreditCard {...props} />;
    case 'Banknote':
      return <Banknote {...props} />;
    case 'ArrowRightLeft':
      return <ArrowRightLeft {...props} />;
    case 'Smartphone':
      return <Smartphone {...props} />;
    case 'MoreHorizontal':
      return <MoreHorizontal {...props} />;
    default:
      return <NairaIcon {...props} />;
  }
};

export const getPaymentIcon = (method) => {
  switch (method) {
    case 'card':
      return <CreditCard className="w-3.5 h-3.5" />;
    case 'cash':
      return <Banknote className="w-3.5 h-3.5" />;
    case 'transfer':
      return <ArrowRightLeft className="w-3.5 h-3.5" />;
    case 'digital_wallet':
      return <Smartphone className="w-3.5 h-3.5" />;
    default:
      return <CreditCard className="w-3.5 h-3.5" />;
  }
};

export const getPaymentLabel = (method) => {
  switch (method) {
    case 'card':
      return 'Card';
    case 'cash':
      return 'Cash';
    case 'transfer':
      return 'Bank Transfer';
    case 'digital_wallet':
      return 'Digital Wallet';
    default:
      return method;
  }
};
