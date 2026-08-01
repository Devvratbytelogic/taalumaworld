import ContactUsContent from '@/components/pages-components/contact/ContactUsContent'
import { ISR_REVALIDATE_SECONDS } from '@/constants/isr'

export const revalidate = ISR_REVALIDATE_SECONDS;

export default function ContactUsPage() {
    return <ContactUsContent />
}
