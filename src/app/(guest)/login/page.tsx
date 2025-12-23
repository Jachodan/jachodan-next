"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 테스트 계정 확인
        if (email === "test@gmail.com" && password === "1234") {
            router.push("/dashboard");
        } else {
            setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
            <section className="flex flex-col items-center w-full max-w-sm gap-6">
                <h1 className="text-2xl font-bold">로그인</h1>

                <form className="flex flex-col w-full gap-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-medium">
                            이메일
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}

                    <Button type="submit" size="lg" className="w-full mt-2">
                        로그인
                    </Button>
                </form>

                <Link href="/signup" className="text-sm text-muted-foreground">
                    계정이 없으신가요? 회원가입
                </Link>

                <Separator />

                <div className="flex flex-col w-full gap-3">
                    <Button variant="outline" size="lg" className="w-full" disabled>
                        네이버로 로그인
                    </Button>
                    <Button variant="outline" size="lg" className="w-full" disabled>
                        카카오로 로그인
                    </Button>
                    <Button variant="outline" size="lg" className="w-full" disabled>
                        구글로 로그인
                    </Button>
                </div>
            </section>
        </div>
    );
}
