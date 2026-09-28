'use client'

import { Bell } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { AdminPanel } from '@/components/admin/layout/AdminContent'
import { useWebPush } from '@/hooks/useWebPush'

function statusCopy(permission: string, subscribed: boolean, supported: boolean): string {
    if (!supported) return 'This browser does not support notifications.'
    if (permission === 'denied') {
        return 'Notifications are blocked. Allow them in your browser site settings, then turn this on again.'
    }
    if (subscribed) return 'This browser will show alerts for your account.'
    return 'Turn on to get alerts on this device.'
}

export function WebPushSettingsCard({ appearance = 'section' }: { appearance?: 'section' | 'panel' }) {
    const { ready, supported, permission, subscribed, busy, enable, disable } = useWebPush()

    const body = (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50/60">
                    <Bell className="h-4 w-4 text-primary" aria-hidden />
                </span>
                <div className="min-w-0">
                    <h2 className="text-base font-semibold text-gray-900">Browser notifications</h2>
                    <p className="mt-0.5 text-sm text-gray-500">
                        {ready ? statusCopy(permission, subscribed, supported) : 'Checking notification settings…'}
                    </p>
                </div>
            </div>
            <Switch
                checked={subscribed}
                disabled={!ready || busy || !supported || permission === 'denied'}
                onCheckedChange={(checked) => {
                    void (checked ? enable() : disable())
                }}
                aria-label="Browser notifications"
            />
        </div>
    )

    if (appearance === 'panel') {
        return <AdminPanel>{body}</AdminPanel>
    }

    return (
        <section className="border-t border-gray-100 px-4 py-5 sm:px-8 sm:py-6">
            {body}
        </section>
    )
}
