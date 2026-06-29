'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { RootState } from '@/store/store'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Button from '@/components/ui/Button'
import toast from '@/utils/toast'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { closeModal, openModal } from '@/store/slices/allModalSlice'
import { useFormik } from 'formik'
import { signInSchema } from '@/utils/formValidation'
import { useUserLoginMutation } from '@/store/rtkQueries/userAuthApi'
import { useAdminLoginMutation } from '@/store/rtkQueries/adminAuth'
import { setAuthCookies } from '@/utils/authCookies'
import { rtkQuerieSetup } from '@/store/services/rtkQuerieSetup'

type SignModalData = { redirectTo?: string; signInAs?: 'author' | 'user' }

type SignRole = 'user' | 'author'

export default function SignIn() {
    const [showPassword, setShowPassword] = useState(false)
    const [signRole, setSignRole] = useState<SignRole>('user')
    const dispatch = useDispatch()
    const router = useRouter()
    const { isOpen, data, componentName } = useSelector((state: RootState) => state.allModal)

    const [userLogin, { isLoading: userLoginLoading }] = useUserLoginMutation()
    const [adminLogin, { isLoading: adminLoginLoading }] = useAdminLoginMutation()

    const { errors, touched, isSubmitting, values, handleSubmit, handleChange, handleBlur, resetForm } = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: signInSchema,
        onSubmit: async (vals, formikHelpers) => {
            const { resetForm: rf } = formikHelpers
            const modalPayload = data as SignModalData | null | undefined

            try {
                if (signRole === 'user') {
                    const res = await userLogin({ email: vals.email, password: vals.password }).unwrap()
                    if (res.success && res.data) {
                        const { token, user } = res.data as {
                            token: string
                            user: { name: string; id?: string | number; _id?: string; profile_pic?: string | null }
                        }
                        setAuthCookies({
                            token,
                            user: { id: String(user.id ?? user._id), _id: user._id },
                            role: 'user',
                        })
                        dispatch(rtkQuerieSetup.util.invalidateTags([
                            'AllChapters', 'Cart', 'UserProfile', 'MyChapters', 'ReadingHistory',
                        ]))
                        const redirectTo = modalPayload?.redirectTo
                        dispatch(closeModal())
                        rf()
                        toast.success(res.message ?? 'Sign in successful!')
                        if (redirectTo) router.push(redirectTo)
                    }
                } else {
                    const res = await adminLogin({ email: vals.email, password: vals.password }).unwrap()
                    if (res.success && res.data) {
                        const { token, userRole } = res.data as {
                            token: string
                            userRole: {
                                name: string
                                id?: number
                                _id?: string
                                user_id?: string | number
                                profile_pic?: string | null
                            }
                        }
                        setAuthCookies({
                            token,
                            user: { id: String(userRole.user_id), _id: userRole._id },
                            role: {
                                name: userRole.name,
                                id: userRole.id !== undefined ? String(userRole.id) : undefined,
                                _id: userRole._id,
                            },
                        })
                        dispatch(rtkQuerieSetup.util.invalidateTags([
                            'AllChapters', 'Cart', 'UserProfile', 'MyChapters', 'ReadingHistory',
                        ]))
                        dispatch(closeModal())
                        rf()
                        toast.success(res.message ?? 'Sign in successful!')
                        router.push('/admin/dashboard')
                    }
                }
            } catch (error) {
                const errMsg = (error as { data?: { message?: string } })?.data?.message ?? ''
                if (errMsg.toLowerCase().includes('verify your account')) {
                    toast.info(errMsg)
                    dispatch(
                        openModal({
                            componentName: signRole === 'user' ? 'OtpVerification' : 'AuthorOtpVerification',
                            data: { email: vals.email, type: 'account' },
                        }),
                    )
                } else {
                    console.log(errMsg || 'Invalid email or password. Please try again.')
                }
            }
        },
    })

    useEffect(() => {
        if (!isOpen) return

        const payload = data as SignModalData | null | undefined
        const wantsAuthor =
            componentName === 'AuthorSignIn' || payload?.signInAs === 'author'
        setSignRole(wantsAuthor ? 'author' : 'user')
        resetForm()
    }, [isOpen, componentName, data, resetForm])

    const forgotPasswordModal = signRole === 'user' ? 'ForgotPassword' : 'AuthorForgotPassword'
    const signupModal = signRole === 'user' ? 'SignUp' : 'AuthorRegister'
    const loginLoading = signRole === 'user' ? userLoginLoading : adminLoginLoading

    const onRoleChange = (next: SignRole) => {
        setSignRole(next)
        resetForm()
    }

    const headerTitle = signRole === 'user' ? 'Sign In' : 'Mentor Sign In'
    const headerSubtitle =
        signRole === 'user'
            ? 'Continue your learning journey with TaalumaWorld'
            : 'Sign in to publish and manage your content'

    return (
        <Modal isOpen={isOpen} onClose={() => dispatch(closeModal())} className="modal_container">
            <ModalContent>
                <ModalHeader className="flex flex-col items-center text-center gap-2">
                    <p className="text-2xl font-semibold text-foreground">{headerTitle}</p>
                    <p className="text-sm text-muted-foreground font-normal">{headerSubtitle}</p>
                    <div className="w-full mt-3">
                        <Tabs
                            value={signRole === 'author' ? 'author' : 'user'}
                            onValueChange={(v) => onRoleChange(v === 'author' ? 'author' : 'user')}
                            className="w-full"
                        >
                            <TabsList className="grid w-full grid-cols-2 rounded-2xl p-1 h-11 gap-1">
                                <TabsTrigger value="user" className="rounded-xl text-sm">
                                    Career Architect
                                </TabsTrigger>
                                <TabsTrigger value="author" className="rounded-xl text-sm">
                                    Mentor
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
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
                                    className={`pl-12 h-12 rounded-2xl ${errors.email && touched.email ? 'border-red-500' : ''}`}
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
                                    className={`pl-12 pr-12 h-12 rounded-2xl ${errors.password && touched.password ? 'border-red-500' : ''}`}
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
                                onClick={() => dispatch(openModal({ componentName: forgotPasswordModal, data: '' }))}
                                className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                                disabled={isSubmitting}
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <Button
                            type="submit"
                            className="global_btn bg_primary w-full"
                            disabled={isSubmitting || loginLoading}
                            isLoading={isSubmitting || loginLoading}
                        >
                            Sign In
                        </Button>
                    </form>
                    <ModalFooter>
                        <div className="w-full text-center text-sm text-muted-foreground">
                            <span>Don&apos;t have an account? </span>
                            <button
                                type="button"
                                className="font-medium text-primary hover:text-primary/80 transition-colors"
                                onClick={() => dispatch(openModal({ componentName: signupModal, data: '' }))}
                                disabled={isSubmitting}
                            >
                                {signRole === 'user' ? 'Sign Up' : 'Register as Mentor'}
                            </button>
                        </div>
                    </ModalFooter>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
