import ImageComponent from '@/components/ui/ImageComponent'
import React from 'react'

export default function MeetOurTeam() {
    return (
        <>
            <section className="py-16 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">Meet the Team</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            The passionate people behind Taaluma
                        </p>
                    </div>

                    {/* Team Photo */}
                    <div className="max-w-4xl mx-auto mb-12">
                        <div className="relative rounded-3xl overflow-hidden shadow-lg">
                            <div className='h-64 md:h-80'>
                                <ImageComponent
                                    src="https://images.unsplash.com/photo-1624555130296-e551faf8969b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwdGVhbSUyMHdvcmtpbmd8ZW58MXx8fHwxNzY3OTM4Mjg1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                                    alt="Taaluma team working together"
                                    object_cover={true}
                                    priority={true}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {/* Team Member 1 */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold mx-auto mb-4">
                                SK
                            </div>
                            <h3 className="font-semibold text-lg mb-1">Sarah Kim</h3>
                            <p className="text-sm text-muted-foreground mb-3">Founder & CEO</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Former educator passionate about making reading accessible to all teens.
                            </p>
                        </div>

                        {/* Team Member 2 */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                            <div className="w-24 h-24 rounded-full bg-secondary-accent/10 flex items-center justify-center text-secondary-accent text-3xl font-bold mx-auto mb-4">
                                MJ
                            </div>
                            <h3 className="font-semibold text-lg mb-1">Marcus Johnson</h3>
                            <p className="text-sm text-muted-foreground mb-3">Head of Product</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Tech enthusiast focused on creating seamless user experiences.
                            </p>
                        </div>

                        {/* Team Member 3 */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                            <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center text-success text-3xl font-bold mx-auto mb-4">
                                LP
                            </div>
                            <h3 className="font-semibold text-lg mb-1">Lisa Patel</h3>
                            <p className="text-sm text-muted-foreground mb-3">Content Director</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Avid reader curating the best stories for our community.
                            </p>
                        </div>

                        {/* Team Member 4 */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold mx-auto mb-4">
                                DW
                            </div>
                            <h3 className="font-semibold text-lg mb-1">David Wong</h3>
                            <p className="text-sm text-muted-foreground mb-3">Community Manager</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Building connections between readers and authors worldwide.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
