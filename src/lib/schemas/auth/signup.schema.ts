import * as z from "zod";

export const joinSchema = z.object({
  email: z.string().email("이메일 형식을 확인해주세요."),
  userName: z.string().min(2, "이름을 2글자 이상 작성해주세요.").max(10, "이름은 10글자 미만입니다."),
  userPhone: z
    .string()
    .min(1, "휴대폰 번호를 작성해주세요.")
    .regex(/^\d+$/, "숫자만 입력해주세요.")
    .regex(/^01[016789]\d{7,8}$/, "휴대폰 번호 형식이 올바르지 않습니다."),

  storeName: z.string().min(1, "상호명을 작성해주세요.").max(20, "상호명은 20글자 미만입니다."),
  storeCall: z
    .string()
    .min(1, "가게 전화번호를 작성해주세요.")
    .regex(/^\d+$/, "숫자만 입력해주세요.")
    .regex(/^(02\d{7,8}|070\d{8}|031\d{8}|0\d{2}\d{7,8})$/, "가게 전화번호 형식이 올바르지 않습니다."),
  storeAdd: z.string().min(1, "가게 주소를 작성해주세요."),
  storeDetailAdd: z.string(),
});

export type JoinValues = z.infer<typeof joinSchema>;
