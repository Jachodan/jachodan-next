import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ItemImageUploadProps {
    imagePreview: string | null;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ItemImageUpload({ imagePreview, onImageChange }: ItemImageUploadProps) {
    return (
        <div className="space-y-2">
            <Label>상품 이미지</Label>
            <div className="flex flex-col gap-2">
                {imagePreview ? (
                    <div className="relative w-full aspect-square bg-muted rounded-md overflow-hidden">
                        <Image src={imagePreview} alt="상품 이미지" fill className="object-cover" />
                    </div>
                ) : (
                    <div className="w-full aspect-square bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                        이미지 없음
                    </div>
                )}
                <Input type="file" accept="image/*" onChange={onImageChange} />
            </div>
        </div>
    );
}
