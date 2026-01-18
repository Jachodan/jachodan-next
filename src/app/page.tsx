import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center px-6">
                <div className="max-w-2xl text-center space-y-6">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                        재고 관리를 더 쉽게
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        간편한 재고 관리 시스템으로 비즈니스를 효율적으로
                        운영하세요.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button asChild size="lg">
                            <Link href="/login">로그인</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href="/signup">회원가입</Link>
                        </Button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 text-center text-sm text-muted-foreground">
                <p>&copy; 2026 재고관리. All rights reserved.</p>
            </footer>
        </div>
    );
}
