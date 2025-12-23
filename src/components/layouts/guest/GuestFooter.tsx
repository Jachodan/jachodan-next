export default function GuestFooter() {
    return (
        <footer className="h-16 border-t bg-background">
            <div className="container h-full mx-auto px-4 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} 재고키퍼!
                </p>
            </div>
        </footer>
    );
}
