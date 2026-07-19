'use client'
import { useGetAllChaptersQuery } from '@/store/rtkQueries/userGetAPI'
import { BookOpen, Users, Route, Globe } from 'lucide-react'
import React from 'react'

export default function TodayOnTaaluma() {
    const { data } = useGetAllChaptersQuery({})

    const blueprintCount = data?.data?.total

    const stats = [
        {
            icon: BookOpen,
            value: blueprintCount ? `${blueprintCount}+` : '5+',
            label: 'Published Blueprints',
            iconBg: 'bg-primary/10',
            iconColor: 'text-primary',
            valueColor: 'text-primary',
        },
        {
            icon: Users,
            value: null,
            label: 'Growing Mentor Network',
            iconBg: 'bg-secondary-accent/10',
            iconColor: 'text-secondary-accent',
            valueColor: 'text-secondary-accent',
        },
        {
            icon: Route,
            value: null,
            label: 'Multiple Career Paths Covered',
            iconBg: 'bg-success/10',
            iconColor: 'text-success',
            valueColor: 'text-success',
        },
        {
            icon: Globe,
            value: null,
            label: 'Global Ambition, African Roots',
            iconBg: 'bg-primary/10',
            iconColor: 'text-primary',
            valueColor: 'text-primary',
        },
    ]

    return (
        <div className="container">
            <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Today on Taaluma</h3>
                <p className="text-muted-foreground">A snapshot of where we stand right now.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map(({ icon: Icon, value, label, iconBg, iconColor, valueColor }) => (
                    <div key={label} className="bg-white rounded-md border p-5 flex flex-col items-center text-center gap-3">
                        <div className={`w-11 h-11 rounded-full ${iconBg} flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 ${iconColor}`} />
                        </div>
                        {value && (
                            <span className={`text-3xl font-black ${valueColor}`}>{value}</span>
                        )}
                        <p className="text-sm font-medium text-muted-foreground leading-snug">{label}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
