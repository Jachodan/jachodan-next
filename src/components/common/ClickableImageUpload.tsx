import Image from "next/image";

interface ClickableImageUploadProps {
    imagePreview: string | null;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    emptyText?: string;
    size?: "sm" | "md" | "lg";
    rounded?: boolean;
    id?: string;
}

const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-32 h-32",
    lg: "w-full aspect-square",
};

export default function ClickableImageUpload({
    imagePreview,
    onImageChange,
    emptyText = "클릭하여 이미지 업로드",
    size = "lg",
    rounded = false,
    id = "image-upload",
}: ClickableImageUploadProps) {
    const sizeClass = sizeClasses[size];
    const roundedClass = rounded ? "rounded-full" : "rounded-md";

    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block cursor-pointer">
                {imagePreview ? (
                    <div
                        className={`relative ${sizeClass} bg-muted ${roundedClass} overflow-hidden hover:opacity-80 transition-opacity mx-auto`}
                    >
                        <Image src={imagePreview} alt="업로드 이미지" fill className="object-cover" />
                    </div>
                ) : (
                    <div
                        className={`${sizeClass} bg-muted ${roundedClass} flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-colors text-sm mx-auto`}
                    >
                        {emptyText}
                    </div>
                )}
            </label>
            <input
                id={id}
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="hidden"
            />
        </div>
    );
}
