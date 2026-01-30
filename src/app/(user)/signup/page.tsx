"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signupSchema, SignupValues } from "@/lib/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
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
                    <UserFormField
                        label="이메일"
                        type="email"
                        register={register("email")}
                        placeholder="email@mail.com"
                        error={errors.email?.message}
                        required
                        disabled={isSocialSignup}
                    />
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
