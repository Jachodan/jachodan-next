"use client";

import { useLayout } from "@/components/layouts/provider/LayoutProvider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { loginSchema, LoginValues } from "@/lib/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { UserFormField } from "../_components/UserFormField";
import { toast } from "sonner";

export default function Login() {
  const { setHeaderTitle } = useLayout();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    shouldFocusError: true,
    defaultValues: {
      email: "",
      userName: "",
      storeName: "",
    },
  });

  const onSubmit = (values: LoginValues) => {
    console.log(values);
    router.push("/");
  };

  const onError = (errors: FieldErrors<LoginValues>) => {
    const errorMessages = Object.values(errors)
      .map((error) => error?.message)
      .filter(Boolean);

    if (errorMessages.length > 0) {
      toast.error("입력 정보를 확인해주세요", {
        description: (
          <ul className="mt-2 space-y-1">
            {errorMessages.map((message, index) => (
              <li key={index} className="text-sm">
                • {message}
              </li>
            ))}
          </ul>
        ),
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    setHeaderTitle("로그인");
  }, [setHeaderTitle]);

  return (
    <div className="flex items-center justify-center p-6 pt-14">
      <div className="flex flex-col items-center w-full max-w-sm gap-4">
        <div className="mb-4 text-2xl font-bold">로그인</div>
        <Image src="/logo-temp.jpeg" alt="재고키퍼 로고" width={180} height={180} priority />

        <form className="flex flex-col w-full gap-4" onSubmit={handleSubmit(onSubmit, onError)}>
          <UserFormField label="이메일" type="email" register={register("email")} placeholder="email@mail.com" error={errors.email?.message} />
          <UserFormField label="사용자 이름" type="text" register={register("userName")} placeholder="홍길동" error={errors.userName?.message} />
          <UserFormField label="상호" type="text" register={register("storeName")} placeholder="OO치킨 OO점" error={errors.storeName?.message} />

          <Button type="submit" size="lg" className="w-full">
            로그인
          </Button>
        </form>

        <Link href="/signup" className="text-sm text-muted-foreground hover:underline">
          회원가입
        </Link>

        <Separator />

        <Button type="button" size="lg" disabled className="w-full">
          네이버
        </Button>

        <Button type="button" size="lg" disabled className="w-full">
          구글
        </Button>

        <Button type="button" size="lg" disabled className="w-full">
          카카오
        </Button>
      </div>
    </div>
  );
}
