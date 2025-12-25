import AuthLayout from "@/components/layouts/AuthLayout";

export default function AuthpageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthLayout>{children}</AuthLayout>;
}
