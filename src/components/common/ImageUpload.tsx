import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ImageUploadProps {
    label: string;
    imagePreview: string | null;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    emptyText?: string;
    size?: "sm" | "md" | "lg";
    rounded?: boolean;
}

const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-32 h-32",
    lg: "w-full aspect-square",
};

export default function ImageUpload({
    label,
    imagePreview,
    onImageChange,
    emptyText = "이미지 없음",
    size = "lg",
    rounded = false,
}: ImageUploadProps) {
    const sizeClass = sizeClasses[size];
    const roundedClass = rounded ? "rounded-full" : "rounded-md";
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setFileName(file ? file.name : null);
        onImageChange(e);
    };

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="flex flex-col gap-2 items-center">
                {imagePreview ? (
                    <div className={`relative ${sizeClass} bg-muted ${roundedClass} overflow-hidden`}>
                        <Image src={imagePreview} alt={label} fill className="object-cover" />
                    </div>
                ) : (
                    <div
                        className={`${sizeClass} bg-muted ${roundedClass} flex items-center justify-center text-muted-foreground text-sm`}
                    >
                        {emptyText}
                    </div>
                )}
                <div className="flex items-center gap-2 w-full">
                    <Button type="button" variant="outline" size="sm" onClick={handleButtonClick}>
                        파일 선택
                    </Button>
                    <span className="text-sm text-muted-foreground truncate flex-1">
                        {fileName || "선택된 파일 없음"}
                    </span>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
        </div>
    );
}
