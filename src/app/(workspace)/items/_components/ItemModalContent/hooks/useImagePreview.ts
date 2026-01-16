import { useState } from "react";

interface UseImagePreviewProps {
    initialImageId?: number;
}

export function useImagePreview({ initialImageId }: UseImagePreviewProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(
        initialImageId ? `/api/images/${initialImageId}` : null
    );

    const handleImageChange = (file: File, onFileChange: (file: File) => void) => {
        onFileChange(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    return {
        imagePreview,
        handleImageChange,
    };
}
