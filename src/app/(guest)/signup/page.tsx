"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function SignupPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-8">
            <section className="flex flex-col items-center w-full max-w-sm gap-6">
                <h1 className="text-2xl font-bold">회원가입</h1>

                <form className="flex flex-col w-full gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-medium">
                            이메일
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="example@email.com"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            이름
                        </label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="이름을 입력하세요"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="text-sm font-medium">
                            비밀번호
                        </label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="passwordConfirm" className="text-sm font-medium">
                            비밀번호 확인
                        </label>
                        <Input
                            id="passwordConfirm"
                            type="password"
                            placeholder="비밀번호를 다시 입력하세요"
                        />
                    </div>

                    <Button type="submit" size="lg" className="w-full mt-2">
                        회원가입
                    </Button>
                </form>

                <Link href="/login" className="text-sm text-muted-foreground">
                    이미 계정이 있으신가요? 로그인
                </Link>
            </section>
        </div>
    );
}
