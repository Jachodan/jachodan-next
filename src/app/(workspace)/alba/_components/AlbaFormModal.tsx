"use client";

import { useState } from "react";
import CommonModal from "@/components/common/CommonModal";
import ImageUpload from "@/components/common/ImageUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SCHEDULE_DAYS, type ScheduleDays } from "@/types/work";

export interface AlbaFormData {
    albaName: string;
    albaPhone: string;
    workDays: ScheduleDays[];
    albaEmail: string;
    profileImage?: File;
}

interface AlbaFormModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: AlbaFormData) => void;
    storeName: string;
}

export default function AlbaFormModal({ open, onClose, onSave, storeName }: AlbaFormModalProps) {
    const [formData, setFormData] = useState<AlbaFormData>({
        albaName: "",
        albaPhone: "",
        workDays: [],
        albaEmail: "",
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({ ...prev, profileImage: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (field: keyof AlbaFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const formatPhoneNumber = (value: string) => {
        // 숫자만 추출
        const numbers = value.replace(/[^\d]/g, "");

        // 010-0000-0000 형식으로 변환
        if (numbers.length <= 3) {
            return numbers;
        } else if (numbers.length <= 7) {
            return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
        } else {
            return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
        }
    };

    const handlePhoneChange = (value: string) => {
        const formatted = formatPhoneNumber(value);
        setFormData((prev) => ({ ...prev, albaPhone: formatted }));
    };

    const toggleWorkDay = (day: ScheduleDays) => {
        setFormData((prev) => ({
            ...prev,
            workDays: prev.workDays.includes(day) ? prev.workDays.filter((d) => d !== day) : [...prev.workDays, day],
        }));
    };

    const handleSave = () => {
        onSave(formData);
        alert(`${storeName} 근무를 환영합니다`);
        handleClose();
    };

    const handleClose = () => {
        setFormData({
            albaName: "",
            albaPhone: "",
            workDays: [],
            albaEmail: "",
        });
        setImagePreview(null);
        onClose();
    };

    const handleModalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div onClick={handleModalClick}>
            <CommonModal
                open={open}
                onClose={handleClose}
                title="알바 추가"
                size="md"
                footer={
                    <>
                        <Button variant="outline" onClick={handleClose}>
                            취소
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={!formData.albaName || !formData.albaPhone || formData.workDays.length === 0}
                        >
                            등록
                        </Button>
                    </>
                }
            >
                <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                    {/* 프로필 이미지 업로드 */}
                    <ImageUpload
                        label="프로필 사진"
                        imagePreview={imagePreview}
                        onImageChange={handleImageChange}
                        emptyText="프로필 사진 없음"
                        size="md"
                        rounded={true}
                    />

                    {/* 이름 입력 */}
                    <div className="space-y-2">
                        <Label htmlFor="albaName">이름</Label>
                        <Input
                            id="albaName"
                            value={formData.albaName}
                            onChange={(e) => handleInputChange("albaName", e.target.value)}
                            placeholder="이름을 입력하세요"
                        />
                    </div>

                    {/* 연락처 입력 */}
                    <div className="space-y-2">
                        <Label htmlFor="albaPhone">연락처</Label>
                        <Input
                            id="albaPhone"
                            value={formData.albaPhone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            placeholder="010-1234-5678"
                            maxLength={13}
                        />
                    </div>

                    {/* 근무요일 선택 */}
                    <div className="space-y-2">
                        <Label>근무요일</Label>
                        <div className="flex gap-2 justify-center">
                            {SCHEDULE_DAYS.map((day) => (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => toggleWorkDay(day)}
                                    className={`flex items-center justify-center w-10 h-10 text-sm border rounded transition-colors ${
                                        formData.workDays.includes(day)
                                            ? "bg-black text-white border-black"
                                            : "bg-white text-gray-400 border-gray-200 hover:border-gray-400"
                                    }`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 이메일 입력 */}
                    <div className="space-y-2">
                        <Label htmlFor="albaEmail">이메일</Label>
                        <Input
                            id="albaEmail"
                            type="email"
                            value={formData.albaEmail}
                            onChange={(e) => handleInputChange("albaEmail", e.target.value)}
                            placeholder="example@email.com"
                        />
                    </div>
                </div>
            </CommonModal>
        </div>
    );
}
