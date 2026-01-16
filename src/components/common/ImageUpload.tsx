import Image from "next/image";
import { Input } from "@/components/ui/input";
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
                <Input type="file" accept="image/*" onChange={onImageChange} />
            </div>
        </div>
    );
}
