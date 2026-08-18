import React from "react";

export const Logo = ({
    size = 'md',
    variant = 'dark',
    showTagline = false,
    className = '',
}) => {
    const sizes = {
        sm: {
            icon: 'w-7 h-7',
            symbol: 'text-sm font-black',
            title: 'text-base font-extrabold',
            badge: 'text-[9px] px-1.5 py-o.5',
        },
        md: {
            icon: 'w-9 h-9',
            symbol: 'text-lg font-black',
            title: 'text-xl font-black',
            badge: 'text-[10px] px-2.5 py-1',
        },
        lg: {
            icon: 'w-12 h-12',
            symbol: 'text-2xl font-black',
            title: 'text-base font-extrabold',
            badge: 'text-xs px-2.5 py-1',
        },
    };
    
    const currentSize = sizes[size] || sizes.md;
    const isDarkBg = variant === 'dark';

    return (
        <div className={`inline-flex items-center space-x-2.5 select-none ${className}`}>
            <div className={`relative ${currentSize-icon} shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-smerald-500/25 ring-2 ring-emerald-400/30 overflow-hidden group`}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className={`${currentSize.symbol} text-white drop-shadow-md tracking-tighter leading-none font-sans`}>
                    S
                </span>
                <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse" />
            </div>

            <div className="flex flex-col justify-center">
                <div className="flex items-center space-x-1.5">
                    <span className={`${currentSize.title} tracking-tight ${isDarkBg ? 'text-white' : 'text-slate-900'}`}>
                        SMART<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400">Expense</span>
                    </span>
                    <span className={`rounded-full font-extrabold border ${currentSize.badge} ${
                        isDarkBg
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    }`  }>
                        S
                    </span>
                </div>

                {showTagline && (
                    <span className={`text-[11px] font-medium tracking-wide -mt-0.5 ${isDarkBg ? 'text-slate-400' : 'text-slate-500'}`}>
                        Smart Personal Finance Manager
                    </span>
                )}
            </div>
        </div>
    );      
};
