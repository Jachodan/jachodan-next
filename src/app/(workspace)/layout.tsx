import WorkspaceLayout from "@/components/layouts/WorkspaceLayout";

export default function WorkspaceGroupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <WorkspaceLayout>{children}</WorkspaceLayout>;
}
