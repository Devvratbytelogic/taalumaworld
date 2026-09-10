import type { ReactNode } from 'react';
import { cn } from '@/components/ui/utils';

type AuthPageShellProps = {
    title: string;
    subtitle?: string;
    icon?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    wide?: boolean;
    fullViewport?: boolean;
};

export function AuthPageShell({ title, subtitle, icon, children, footer, wide, fullViewport = true }: AuthPageShellProps) {
    return (
        <div
            className={cn(
                'flex items-center justify-center px-4 py-12 bg-linear-to-b from-primary/5 to-background',
                fullViewport && 'min-h-screen',
            )}
        >
            <div className={`w-full ${wide ? 'max-w-xl' : 'max-w-md'} bg-white rounded-md border p-8 sm:p-10`}>
                <div className="text-center mb-8">
                    {icon && (
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                            {icon}
                        </div>
                    )}
                    <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                    {subtitle && (
                        <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
                    )}
                </div>
                {children}
                {footer && (
                    <div className="mt-8 border-t border-gray-100 pt-6 text-center text-sm text-muted-foreground">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
