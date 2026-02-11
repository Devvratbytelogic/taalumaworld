import React from 'react'
import Button from '../ui/Button'

export default function CommonCTA() {
    return (
        <>
            <section className="py-16 bg-linear-to-br from-primary/10 to-secondary-accent/10">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold">Join Our Community</h2>
                        <p className="text-lg text-muted-foreground">
                            Start your reading journey today and discover stories that inspire, challenge,
                            and entertain. Your next favorite book is just a chapter away.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                            <Button
                                className='global_btn rounded_full bg_primary hover-lift'
                            >
                                Start Reading
                            </Button>
                            <Button
                                className='global_btn rounded_full outline_primary hover-lift'>
                                Browse Books
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
