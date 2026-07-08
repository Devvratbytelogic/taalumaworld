'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import { Input } from '@/components/ui/input'
import Button from '@/components/ui/Button'
import toast from '@/utils/toast'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { closeModal, openModal } from '@/store/slices/allModalSlice'
import { useFormik } from 'formik'
import { signInSchema } from '@/utils/formValidation'
import { useUserLoginMutation } from '@/store/rtkQueries/userAuthApi'
import { setAuthCookies } from '@/utils/authCookies'
import { rtkQuerieSetup } from '@/store/services/rtkQuerieSetup'
import { RootState } from '@/store/store'
import { getMentorLoginRoutePath } from '@/routes/routes'


export default function SignIn() {
    const [showPassword, setShowPassword] = useState(false)
    const dispatch = useDispatch()
    const router = useRouter()
    const { isOpen } = useSelector((state: RootState) => state.allModal)
    const [userLogin, { isLoading: userLoginLoading }] = useUserLoginMutation()

    const { errors, touched, isSubmitting, values, handleSubmit, handleChange, handleBlur } = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: signInSchema,
        onSubmit: async (vals) => {

            try {
                const res = await userLogin({ email: vals.email, password: vals.password }).unwrap()
                console.log('res', res);

                if (res?.http_status_code === 200 || res?.http_status_code === 201) {
                    setAuthCookies({
                        token: res?.data?.token ?? '',
                        user: { id: res?.data?.id, email: res?.data?.email },
                        role: res?.data?.userRole?.name ?? '',
                    })

                    dispatch(rtkQuerieSetup.util.invalidateTags([
                        'AllChapters', 'Cart', 'UserProfile', 'MyChapters', 'ReadingHistory',
                    ]))

                    router.refresh()
                    toast.success(res?.message ?? 'Sign in successful!')
                    dispatch(closeModal())
                }

            } catch (error) {
                const errMsg = (error as { data?: { message?: string } })?.data?.message ?? ''
                if (errMsg.toLowerCase().includes('verify your account')) {
                    toast.info(errMsg)
                    dispatch(openModal({
                        componentName: 'OtpVerification',
                        data: { email: vals.email, type: 'account' },
                    }))
                }
            }
        },
    })


    return (
        <Modal isOpen={isOpen} onClose={() => dispatch(closeModal())} className="modal_container">
            <ModalContent>
                <ModalHeader className="flex flex-col items-center text-center gap-2">
                    <p className="text-2xl font-semibold text-foreground">Sign In</p>
                    <p className="text-sm text-muted-foreground font-normal">
                        Continue your learning journey with TaalumaWorld
                    </p>
                </ModalHeader>
                <ModalBody>
                    <form className="space-y-3" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label htmlFor="signin-email" className="text-sm font-medium text-foreground">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="signin-email"
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    className={`user_input_style ${errors.email && touched.email && 'border-red-500'}`}
                                    disabled={isSubmitting}
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </div>
                            {errors.email && touched.email && (
                                <p className="text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="signin-password" className="text-sm font-medium text-foreground">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="signin-password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Enter your password"
                                    className={`user_input_style ${errors.password && touched.password && 'border-red-500'}`}
                                    disabled={isSubmitting}
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    disabled={isSubmitting}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && touched.password && (
                                <p className="text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <div className="text-right">
                            <button
                                type="button"
                                onClick={() => dispatch(openModal({ componentName: 'ForgotPassword', data: '' }))}
                                className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                                disabled={isSubmitting}
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <Button
                            type="submit"
                            className="global_btn bg_primary w-full"
                            disabled={isSubmitting || userLoginLoading}
                            isLoading={isSubmitting || userLoginLoading}
                        >
                            Sign In
                        </Button>
                    </form>
                    <ModalFooter className="flex flex-col gap-2">
                        <div className="w-full text-center text-sm text-muted-foreground">
                            <span>Don&apos;t have an account? </span>
                            <button
                                type="button"
                                className="font-medium text-primary hover:text-primary/80 transition-colors"
                                onClick={() => dispatch(openModal({ componentName: 'SignUp', data: '' }))}
                                disabled={isSubmitting}
                            >
                                Sign Up
                            </button>
                        </div>
                        <div className="w-full text-center text-sm text-muted-foreground">
                            <Link
                                href={getMentorLoginRoutePath()}
                                className="font-medium text-primary hover:text-primary/80 transition-colors"
                                onClick={() => dispatch(closeModal())}
                            >
                                Sign in as Mentor
                            </Link>
                        </div>
                    </ModalFooter>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
