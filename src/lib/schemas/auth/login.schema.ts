import * as z from "zod";

export const signinSchema = z.object({
  email: z.string().email("이메일 형식을 확인해주세요."),
  userName: z.string().min(2, "이름을 2글자 이상 작성해주세요.").max(10, "이름은 10글자 미만입니다."),
  storeName: z.string().min(1, "상호명을 작성해주세요.").max(20, "상호명은 20글자 미만입니다."),
});

export type SigninValues = z.infer<typeof signinSchema>;
