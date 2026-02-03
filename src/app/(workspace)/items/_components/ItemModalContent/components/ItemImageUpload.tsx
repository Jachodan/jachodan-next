import Image from "next/image";

interface ItemImageUploadProps {
    imagePreview: string | null;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ItemImageUpload({ imagePreview, onImageChange }: ItemImageUploadProps) {
    return (
        <div className="space-y-2">
            <label htmlFor="image-upload" className="block cursor-pointer">
                {imagePreview ? (
                    <div className="relative w-full aspect-square bg-muted rounded-md overflow-hidden hover:opacity-80 transition-opacity">
                        <Image src={imagePreview} alt="상품 이미지" fill className="object-cover" />
                    </div>
                ) : (
                    <div className="w-full aspect-square bg-muted rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-colors">
                        클릭하여 이미지 업로드
                    </div>
                )}
            </label>
            <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="hidden"
            />
        </div>
    );
}
