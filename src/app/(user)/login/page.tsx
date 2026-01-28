"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    return (
        <div className="flex items-center justify-center p-6 pt-14">
            <div className="flex flex-col items-center w-full max-w-sm gap-4">
                <div className="mb-4 text-2xl font-bold">로그인</div>
                <Image src="/logo-temp.jpeg" alt="재고키퍼 로고" width={180} height={180} priority />

                {error && (
                    <div className="w-full p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                        {error === "OAuthCallback" && "소셜 로그인에 실패했습니다. 다시 시도해주세요."}
                        {error === "AccessDenied" && "접근이 거부되었습니다."}
                        {!["OAuthCallback", "AccessDenied"].includes(error) && "로그인 중 오류가 발생했습니다."}
                    </div>
                )}

                <div className="flex flex-col w-full gap-3">
                    <Button
                        type="button"
                        size="lg"
                        className="w-full bg-[#03C75A] hover:bg-[#02b351] text-white"
                        onClick={() => signIn("naver", { callbackUrl: "/home" })}
                    >
                        네이버로 로그인
                    </Button>

                    <Button
                        type="button"
                        size="lg"
                        className="w-full bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"
                        onClick={() => signIn("google", { callbackUrl: "/home" })}
                    >
                        구글로 로그인
                    </Button>

                    <Button
                        type="button"
                        size="lg"
                        className="w-full bg-[#FEE500] hover:bg-[#FDD800] text-[#191919]"
                        onClick={() => signIn("kakao", { callbackUrl: "/home" })}
                    >
                        카카오로 로그인
                    </Button>
                </div>

                <Separator />

                <Link href="/signup" className="text-sm text-muted-foreground hover:underline">
                    회원가입
                </Link>
            </div>
        </div>
    );
}

export default function Login() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center p-6 pt-14">로딩중...</div>}>
            <LoginContent />
        </Suspense>
    );
}
