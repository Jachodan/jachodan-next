"use client";

import { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CommonModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footer?: ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
    sm: "sm:max-w-[400px]",
    md: "sm:max-w-[500px]",
    lg: "sm:max-w-[600px]",
    xl: "sm:max-w-[800px]",
};


export default function CommonModal({ open, onClose, children, footer, size = "md" }: CommonModalProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className={sizeClasses[size]}>
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                </DialogHeader>
                <div className="py-4">{children}</div>
                {footer && <div className="flex gap-2 justify-end pt-4 border-t">{footer}</div>}
            </DialogContent>
        </Dialog>
    );
}
