"use client";

import { useLayout } from "@/components/layouts/provider/LayoutProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { signinSchema, SigninValues } from "@/lib/schemas/auth/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function Login() {
  const { setHeaderTitle } = useLayout();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      userName: "",
      storeName: "",
    },
  });

  const onSubmit = (values: SigninValues) => {
    console.log("로그인 제출");
    console.log(values);
  };

  useEffect(() => {
    setHeaderTitle("로그인");
  }, [setHeaderTitle]);

  return (
    <div className="flex items-center justify-center p-6 pt-20">
      <div className="flex flex-col items-center w-full max-w-sm gap-4">
        <h1 className="mb-4 text-2xl font-bold">로그인</h1>
        <Image src="/logo-temp.jpeg" alt="재고키퍼 로고" width={180} height={180} priority />

        <form className="flex flex-col w-full gap-4" onSubmit={handleSubmit(onSubmit)}>
          {/* 메일 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">이메일</label>
            <Input type="email" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          {/* 이름 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-md">사용자 이름</label>
            <Input type="text" {...register("userName")} />
            {errors.userName && <p className="text-sm text-destructive">{errors.userName.message}</p>}
          </div>

          {/* 상호 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">상호명</label>
            <Input type="text" {...register("storeName")} />
            {errors.storeName && <p className="text-sm text-destructive">{errors.storeName.message}</p>}
          </div>
          <Button size="lg" className="w-full">
            로그인
          </Button>
        </form>

        <Link href="/signup" className="text-sm text-muted-foreground">
          회원가입
        </Link>

        <Separator></Separator>

        <Button size="lg" disabled className="w-full">
          네이버
        </Button>

        <Button size="lg" disabled className="w-full">
          구글
        </Button>

        <Button size="lg" disabled className="w-full">
          카카오
        </Button>
      </div>
    </div>
  );
}
