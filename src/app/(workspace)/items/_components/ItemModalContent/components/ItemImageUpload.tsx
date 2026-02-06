import ClickableImageUpload from "@/components/common/ClickableImageUpload";

interface ItemImageUploadProps {
    imagePreview: string | null;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ItemImageUpload({ imagePreview, onImageChange }: ItemImageUploadProps) {
    return (
        <ClickableImageUpload
            imagePreview={imagePreview}
            onImageChange={onImageChange}
            emptyText="클릭하여 이미지 업로드"
            id="item-image-upload"
        />
    );
}
