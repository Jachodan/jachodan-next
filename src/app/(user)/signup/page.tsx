"use client";

import { joinSchema, JoinValues } from "@/lib/schemas/auth/signup.schema";
import { useLayout } from "@/components/layouts/provider/LayoutProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function JoinPage() {
  const { setHeaderTitle } = useLayout();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinValues>({
    resolver: zodResolver(joinSchema),
    shouldFocusError: true,
    defaultValues: {
      signupEmail: "",
      signupUserName: "",
      signupUserPhone: "",
      signupStoreName: "",
      signupStoreCall: "",
      signupStoreAdd: "",
      signupStoreDetailAdd: "",
    },
  });

  const onSubmit = (values: JoinValues) => {
    console.log("회원가입 제출");
    console.log(values);
  };

  useEffect(() => {
    setHeaderTitle("회원가입");
  }, [setHeaderTitle]);

  return (
    <div className="flex items-center justify-center p-6 pt-20">
      <div className="flex flex-col items-center w-full max-w-sm gap-4 p-8">
        <h1 className="text-2xl font-bold">회원가입</h1>

        <form className="flex flex-col w-full gap-4" onSubmit={handleSubmit(onSubmit)}>
          {/* 메일 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">이메일</label>
            <div className="flex flex-col gap-1">
              <Input type="email" {...register("signupEmail")} placeholder="email@mail.com" />
              {errors.signupEmail && <p className="text-sm text-destructive">{errors.signupEmail.message}</p>}
            </div>
          </div>

          {/* 이름 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">이름</label>
            <div className="flex flex-col gap-1">
              <Input type="text" {...register("signupUserName")} placeholder="홍길동" />
              {errors.signupUserName && <p className="text-sm text-destructive">{errors.signupUserName.message}</p>}
            </div>
          </div>

          {/* 사장님 번호 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">개인번호</label>
            <div className="flex flex-col gap-1">
              <Input type="tel" {...register("signupUserPhone")} placeholder="010-0000-0000" />
              {errors.signupUserPhone && <p className="text-sm text-destructive">{errors.signupUserPhone.message}</p>}
            </div>
          </div>

          <Separator />

          {/* 상호 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">매장명</label>
            <div className="flex flex-col gap-1">
              <Input type="text" {...register("signupStoreName")} placeholder="피자스쿨 OO점" />
              {errors.signupStoreName && <p className="text-sm text-destructive">{errors.signupStoreName.message}</p>}
            </div>
          </div>

          {/* 매장 연락처 */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">매장 연락처</label>
            <div className="flex flex-col gap-1">
              <Input type="tel" {...register("signupStoreCall")} placeholder="02-0000-0000" />
              {errors.signupStoreCall && <p className="text-sm text-destructive">{errors.signupStoreCall.message}</p>}
            </div>
          </div>

          {/* 주소 */}
          <div className="flex flex-col gap-1">
            <label className="pt-2 text-sm font-medium">주소</label>
            <div className="flex flex-col gap-2">
              <Input type="text" {...register("signupStoreAdd")} placeholder="서울특별시 강서구00길 00" />
            </div>
            <label className="pt-2 text-sm font-medium">상세 주소</label>
            <div>
              <Input type="text" {...register("signupStoreDetailAdd")} placeholder="0층 0호" />
            </div>
            {errors.signupStoreAdd && <p className="text-sm text-destructive">{errors.signupStoreAdd?.message}</p>}
          </div>

          <Button type="submit" size="lg" className="w-full">
            회원가입
          </Button>
        </form>

        <Link href="/login" className="pt-3 text-sm text-muted-foreground">
          로그인
        </Link>
      </div>
    </div>
  );
}
