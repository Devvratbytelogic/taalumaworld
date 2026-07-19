import React from 'react'
import Link from 'next/link'
import MentorCard from '@/components/pages-components/mentor/MentorCard'
import { getAllAuthorsRoutePath, getMentorSignupRoutePath } from '@/routes/routes'
import type { IUserAllAuthorsDataEntity } from '@/types/user/allAuthors'

interface FeaturedMentorsSectionProps {
    mentors: IUserAllAuthorsDataEntity[];
}

export default function FeaturedMentorsSection({ mentors }: FeaturedMentorsSectionProps) {
    return (
        <div className="container">
            <div className='grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {mentors && mentors?.length > 0 && mentors?.map((mentor, index) => (
                    <MentorCard
                        key={index}
                        mentor={mentor}
                        index={index}
                    />
                ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center mt-10">
                <Link
                    className="global_btn rounded_full outline_primary w_fit"
                    href={getAllAuthorsRoutePath()}
                >
                    View All Mentors
                </Link>
                <Link
                    className="global_btn rounded_full bg_primary w_fit"
                    href={getMentorSignupRoutePath()}
                >
                    Become a Mentor
                </Link>
            </div>
        </div>
    )
}
