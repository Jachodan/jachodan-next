import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("이메일 형식을 확인해주세요."),
  userName: z.string().min(2, "이름을 2글자 이상 작성해주세요.").max(10, "이름은 10글자 미만입니다."),
  storeName: z.string().min(1, "상호를 작성해주세요.").max(20, "상호는 20글자 미만입니다."),
});

export const signupSchema = loginSchema.extend({
  userPhone: z
    .string()
    .min(1, "휴대폰 번호를 작성해주세요.")
    .regex(/^(01[016789])-\d{3,4}-\d{4}$/, "휴대폰 번호 형식이 올바르지 않습니다."),

  storeCall: z
    .string()
    .min(1, "가게 전화번호를 작성해주세요.")
    .regex(/^(02-\d{3,4}-\d{4}|0[3-9]\d-\d{3,4}-\d{4}|0(50|70)-\d{4}-\d{4})$/, "가게 전화번호 형식이 올바르지 않습니다."),
  storeAdd: z.string(),
  storeDetailAdd: z.string(),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;
