import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ItemAlertDialogsProps {
    showSaveAlert: boolean;
    showDeleteAlert: boolean;
    itemName?: string;
    onSaveAlertChange: (open: boolean) => void;
    onDeleteAlertChange: (open: boolean) => void;
    onSaveConfirm: () => void;
    onDeleteConfirm: () => void;
}

export default function ItemAlertDialogs({
    showSaveAlert,
    showDeleteAlert,
    itemName,
    onSaveAlertChange,
    onDeleteAlertChange,
    onSaveConfirm,
    onDeleteConfirm,
}: ItemAlertDialogsProps) {
    return (
        <>
            {/* 수정 확인 Alert */}
            <AlertDialog open={showSaveAlert} onOpenChange={onSaveAlertChange}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>상품 수정</AlertDialogTitle>
                        <AlertDialogDescription>{itemName}의 정보를 수정하시겠습니까?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction onClick={onSaveConfirm}>확인</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* 삭제 확인 Alert */}
            <AlertDialog open={showDeleteAlert} onOpenChange={onDeleteAlertChange}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>상품 삭제</AlertDialogTitle>
                        <AlertDialogDescription>
                            {itemName}을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={onDeleteConfirm}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            삭제
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
