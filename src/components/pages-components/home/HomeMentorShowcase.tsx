'use client'
import { Users } from 'lucide-react'
import Link from 'next/link'
import ImageComponent from '@/components/ui/ImageComponent'
import Button from '@/components/ui/Button'
import { getAllAuthorsRoutePath, getMentorSignupRoutePath } from '@/routes/routes'
import { IUserAllAuthorsDataEntity } from '@/types/user/allAuthors'

const avatarColors = ['#7c3aed', '#2563eb', '#059669', '#d97706', '#dc2626']

interface HomeMentorShowcaseProps {
    mentors: IUserAllAuthorsDataEntity[]
}
export default function HomeMentorShowcase({ mentors }: HomeMentorShowcaseProps) {

    return (
        <>
            <div className="container">

                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-secondary-accent/10 border border-secondary-accent/20 px-4 py-1.5 rounded-full mb-4">
                        <Users className="w-4 h-4 text-secondary-accent" />
                        <span className="text-sm font-medium text-secondary-accent">The Mentors</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">Learn From Mentors Around the World</h2>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        People trust people — not platforms. Meet the experts behind the Blueprints.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {mentors?.map((mentor, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-md p-6 border transition-shadow flex flex-col items-center text-center gap-3"
                        >
                            {mentor?.profile_pic ? (
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border shrink-0">
                                    <ImageComponent src={mentor?.profile_pic} alt={mentor?.name} object_cover={true} />
                                </div>
                            ) : (
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0"
                                    style={{ backgroundColor: avatarColors[index % avatarColors.length] }}
                                >
                                    {mentor?.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="space-y-1">
                                <h3 className="font-semibold text-foreground leading-tight">{mentor?.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-2 justify-center mt-10">
                    <Button
                        className="global_btn rounded_full outline_primary"
                        as={Link}
                        href={getAllAuthorsRoutePath()}
                    >
                        View All Mentors
                    </Button>
                    <Button
                        className="global_btn rounded_full bg_primary"
                        as={Link}
                        href={getMentorSignupRoutePath()}
                    >
                        Become a Mentor
                    </Button>
                </div>
            </div>
        </>
    )
}
