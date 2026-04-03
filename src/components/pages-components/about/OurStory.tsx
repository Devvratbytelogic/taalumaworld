import ImageComponent from '@/components/ui/ImageComponent'
import React from 'react'

export default function OurStory() {
    return (
        <>
            {/* About Taaluma.World */}
            <section className="pt-8 sm:pt-16 bg-accent/30">
                <div className="container mx-auto sm:px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-3">About Taaluma.World</h2>
                            <p className="text-lg text-muted-foreground">
                                A living community built for value and growth
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Story Image */}
                            <div className="relative">
                                <div className="relative z-10 rounded-3xl overflow-hidden shadow-lg h-full max-h-75">
                                    <div className='w-[80%] ml-auto'>
                                        <ImageComponent
                                            src="/images/common/about-img2.png"
                                            alt="Colorful stack of books"
                                            object_cover={true}
                                            priority={true}
                                        />
                                    </div>
                                </div>
                                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary-accent/20 rounded-full blur-2xl"></div>
                                <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
                            </div>

                            {/* Story Text */}
                            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
                                <h3 className="text-xl font-bold text-foreground">Born in the Trenches. Engineered for the Future.</h3>
                                <p className="text-base text-muted-foreground leading-relaxed">
                                    Taaluma.World was born from a 10-page "monster" CV and a 4,000-mile wake-up call in London. Our founder, Daniel Muchika, learned the hard way that in the real world, <b>what matters is what you have IN you, not what you have WITH you.</b> After surviving the "Auctioneer’s Block" and navigating the "Ghost of the Holy Trinity," he realized that traditional career advice is a "4-Year Illusion" that leaves graduates unprepared for the brutal financial realities of the modern marketplace.
                                </p>
                                <p className="text-base text-muted-foreground leading-relaxed">
                                    We are a living ecosystem built to replace passive "reading" with <b>Active Execution.</b> At Taaluma, we don't just tell stories; we provide the <b>Strategic Blueprints</b>—from the <b>3S Framework to First Principles Thinking</b>—that allow you to upgrade your Career Operating System in real-time. We are here to help you move beyond "laying bricks" for subsistence and start architecting a <b>Portfolio of Capacity</b> that no AI can replicate. Whether you are a student searching for your <b>True North</b> or a professional seeking your unique <b>Ikigai</b>, Taaluma.World is your laboratory for becoming an <b>Irreplaceable Career Architect.</b>


                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Revolution & Internal Compass */}
            <section className="pt-16 bg-background">
                <div className="container mx-auto sm:px-4">
                    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
                        {/* AI Revolution */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                                <span className="text-2xl">🤖</span>
                            </div>
                            <h3 className="text-xl font-bold text-foreground">The AI Revolution: From CVs to Skill Badges</h3>
                            <p className="text-base text-muted-foreground leading-relaxed">
                                On November 30, 2022, the launch of ChatGPT changed the game forever. The career landscape shifted overnight from manual searches to a high-speed, AI-driven marketplace.
                            </p>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex items-start gap-3">
                                    <span className="text-primary font-bold mt-0.5">*</span>
                                    <p>The <strong className="text-foreground">&quot;Standard Resume&quot;</strong> is a relic. Hiring bots scan your digital footprint before you even hit &quot;submit.&quot;</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-primary font-bold mt-0.5">*</span>
                                    <p><strong className="text-foreground">Learning Velocity</strong>—the speed at which you master and deploy new tools—is the new currency of success.</p>
                                </li>
                            </ul>
                        </div>

                        {/* Internal Compass */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-secondary-accent/10 flex items-center justify-center mb-2">
                                <span className="text-2xl">🧭</span>
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Your Superpower: The Internal Compass</h3>
                            <p className="text-base text-muted-foreground leading-relaxed">
                                In the age of Gen AI, success begins with self-knowledge. AI can generate data, but it cannot replicate your indispensable skills—the things you were born with that feel like play but look like work to others.
                            </p>
                            <p className="text-base text-muted-foreground leading-relaxed">
                                Taaluma doesn&apos;t just point you toward a specific job; it points you inward. We help you sharpen your &quot;internal compass&quot;—that essential gut feeling that tells you when a direction is truly yours. Whether you are launching your first career or looking for a &quot;mid-flight&quot; upgrade to your current business or job, we provide the strategic roadmap to make you irreplaceable.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
