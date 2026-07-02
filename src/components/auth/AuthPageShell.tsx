import type { ReactNode } from 'react';

type AuthPageShellProps = {
    title: string;
    subtitle?: string;
    icon?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
};

export function AuthPageShell({ title, subtitle, icon, children, footer }: AuthPageShellProps) {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
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
                    <div className="mt-6 text-center text-sm text-muted-foreground space-y-2">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
