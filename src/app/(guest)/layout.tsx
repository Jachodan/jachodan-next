import GuestHeader from "@/components/layouts/guest/GuestHeader";
import GuestFooter from "@/components/layouts/guest/GuestFooter";

export default function GuestGroupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <GuestHeader />
            <main className="flex-1">{children}</main>
            <GuestFooter />
        </div>
    );
}
