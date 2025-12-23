import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4">
            <section className="text-center space-y-6 max-w-2xl">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    서비스에 오신 것을 환영합니다
                </h1>
                <p className="text-lg text-muted-foreground">
                    편리하고 효율적인 재고 관리 시스템을 경험해보세요.
                    간편한 UI로 매장 운영을 더욱 쉽게 만들어드립니다.
                </p>
                <div className="flex items-center justify-center gap-4">
                    <Button size="lg" asChild>
                        <Link href="/signup">시작하기</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link href="/login">로그인</Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
