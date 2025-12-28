import * as z from "zod";

export const joinSchema = z.object({
  signupEmail: z.string().email("이메일 형식을 확인해주세요."),
  signupUserName: z.string().min(2, "이름을 2글자 이상 작성해주세요.").max(10, "이름은 10글자 미만입니다."),
  signupUserPhone: z
    .string()
    .min(1, "휴대폰 번호를 작성해주세요.")
    .regex(/^\d+$/, "숫자만 입력해주세요.")
    .regex(/^(01[016789])-\d{3,4}-\d{4}$/, "휴대폰 번호 형식이 올바르지 않습니다."),

  signupStoreName: z.string().min(1, "상호명을 작성해주세요.").max(20, "상호명은 20글자 미만입니다."),
  signupStoreCall: z
    .string()
    .min(1, "가게 전화번호를 작성해주세요.")
    .regex(/^\d+$/, "숫자만 입력해주세요.")
    .regex(
      /^(02-\d{3,4}-\d{4}|0[3-9]\d-\d{3,4}-\d{4}|0(50|70)-\d{4}-\d{4})$/,
      "가게 전화번호 형식이 올바르지 않습니다."
    ),
  signupStoreAdd: z.string().min(1, "가게 주소를 작성해주세요."),
  signupStoreDetailAdd: z.string(),
});

export type JoinValues = z.infer<typeof joinSchema>;
