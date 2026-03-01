"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { signupSchema, SignupValues } from "@/lib/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { UserFormField } from "../_components/UserFormField";
import { toast } from "sonner";
import { useUserFormError } from "@/hooks/useUserFormError";

function SignupForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session } = useSession();

    const isSocialSignup = !!searchParams.get("provider");

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<SignupValues>({
        resolver: zodResolver(signupSchema),
        shouldFocusError: true,
        defaultValues: {
            email: "",
            userName: "",
            userPhone: "",
            storeName: "",
            storeCall: "",
            storeAdd: "",
            storeDetailAdd: "",
        },
    });

    useEffect(() => {
        if (isSocialSignup && session?.user) {
            if (session.user.email) setValue("email", session.user.email);
            if (session.user.name) setValue("userName", session.user.name);
        }
    }, [isSocialSignup, session, setValue]);

    const [isCodeSent, setIsCodeSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);
    const [canResend, setCanResend] = useState(false);
    const [hasSentBefore, setHasSentBefore] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const resendTimerRef = useRef<NodeJS.Timeout | null>(null);

    const clearTimers = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (resendTimerRef.current) clearTimeout(resendTimerRef.current);
    }, []);

    useEffect(() => {
        return () => clearTimers();
    }, [clearTimers]);

    const startTimers = useCallback(() => {
        clearTimers();
        setRemainingTime(180);
        setCanResend(false);
        setIsVerified(false);
        setVerificationCode("");

        timerRef.current = setInterval(() => {
            setRemainingTime((prev) => {
                if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    toast.error("인증 유효시간이 종료되었습니다. 인증코드를 재발송해주세요.");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        resendTimerRef.current = setTimeout(() => {
            setCanResend(true);
        }, 10000);
    }, [clearTimers]);

    const handleSendCode = async () => {
        const email = getValues("email");
        if (!email) {
            toast.error("이메일을 입력해주세요.");
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/email/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                toast.error(data?.message || "인증코드 발송에 실패했습니다.");
                return;
            }

            const isResend = hasSentBefore;
            setIsCodeSent(true);
            setHasSentBefore(true);
            startTimers();
            toast.success(isResend ? "인증코드가 재발송되었습니다." : "인증코드가 발송되었습니다.");
        } catch {
            toast.error("서버 연결에 실패했습니다.");
        }
    };

    const handleVerifyCode = async () => {
        if (remainingTime <= 0) {
            toast.error("인증 유효시간이 종료되었습니다. 인증코드를 재발송해주세요.");
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/email/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: getValues("email"), code: verificationCode }),
            });

            if (!res.ok) {
                toast.error("인증코드가 일치하지 않습니다.");
                return;
            }

            clearTimers();
            setIsVerified(true);
            toast.success("인증코드가 확인되었습니다.");
        } catch {
            toast.error("서버 연결에 실패했습니다.");
        }
    };

    const { showErrors } = useUserFormError<SignupValues>({
        title: "입력 정보를 확인해주세요",
        duration: 5000,
    });

    const onSubmit = async (values: SignupValues) => {
        try {
            const res = await fetch("/api/backend/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                toast.error(data?.message || "회원가입에 실패했습니다.");
                return;
            }

            toast.success("회원가입 성공");
            router.push("/login");
        } catch {
            toast.error("서버 연결에 실패했습니다.");
        }
    };

    return (
        <div className="flex items-center justify-center p-6 pt-14">
            <div className="flex flex-col items-center w-full max-w-sm gap-4">
                <div className="text-2xl font-bold">회원가입</div>

                <form className="flex flex-col w-full gap-4" onSubmit={handleSubmit(onSubmit, showErrors)}>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="text-sm font-medium">
                            이메일<span className="pl-1 text-destructive">*</span>
                        </label>
                        <div className="flex gap-2">
                            <Input
                                id="email"
                                type="email"
                                placeholder="email@mail.com"
                                disabled={isSocialSignup}
                                {...register("email")}
                            />
                            {!isSocialSignup && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="shrink-0"
                                    disabled={isVerified || (isCodeSent && !canResend)}
                                    onClick={handleSendCode}
                                >
                                    {hasSentBefore ? "재발송" : "인증 요청"}
                                </Button>
                            )}
                        </div>
                        {errors.email?.message && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                    </div>

                    {!isSocialSignup && isCodeSent && (
                        <div className="flex flex-col gap-2">
                            {!isVerified && remainingTime > 0 && (
                                <p className="text-sm text-muted-foreground">
                                    인증코드 유효시간{" "}
                                    <span className={remainingTime <= 30 ? "text-destructive font-medium" : "font-medium"}>
                                        {String(Math.floor(remainingTime / 60)).padStart(2, "0")}:
                                        {String(remainingTime % 60).padStart(2, "0")}
                                    </span>
                                </p>
                            )}
                            {!isVerified && remainingTime <= 0 && (
                                <p className="text-sm text-destructive">
                                    인증 유효시간이 종료되었습니다.
                                </p>
                            )}
                            <div className="flex gap-2">
                                <Input
                                    placeholder="인증코드를 입력하세요"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    disabled={isVerified || remainingTime <= 0}
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="shrink-0"
                                    disabled={isVerified || remainingTime <= 0 || !verificationCode}
                                    onClick={handleVerifyCode}
                                >
                                    {isVerified ? "인증 완료" : "확인"}
                                </Button>
                            </div>
                        </div>
                    )}

                    <UserFormField
                        label="이름"
                        type="text"
                        register={register("userName")}
                        placeholder="홍길동"
                        error={errors.userName?.message}
                        required
                        disabled={isSocialSignup}
                    />
                    <UserFormField
                        label="개인번호"
                        type="tel"
                        register={register("userPhone")}
                        placeholder="010-0000-0000"
                        error={errors.userPhone?.message}
                        required
                    />

                    <Separator />

                    <UserFormField
                        label="상호"
                        type="text"
                        register={register("storeName")}
                        placeholder="OO치킨 OO점"
                        error={errors.storeName?.message}
                        required
                    />
                    <UserFormField
                        label="매장 연락처"
                        type="tel"
                        register={register("storeCall")}
                        placeholder="02-0000-0000"
                        error={errors.storeCall?.message}
                        required
                    />
                    <UserFormField
                        label="주소"
                        type="text"
                        register={register("storeAdd")}
                        placeholder="서울특별시 강서구00길 00"
                        error={errors.storeAdd?.message}
                    />
                    <UserFormField
                        label="상세 주소"
                        type="text"
                        register={register("storeDetailAdd")}
                        placeholder="0층 0호"
                    />

                    <Button type="submit" size="lg" className="w-full">
                        회원가입
                    </Button>
                </form>

                <Link href="/login" className="pt-3 text-sm text-muted-foreground hover:underline">
                    로그인
                </Link>
            </div>
        </div>
    );
}

export default function JoinPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center p-6 pt-14">로딩중...</div>}>
            <SignupForm />
        </Suspense>
    );
}
