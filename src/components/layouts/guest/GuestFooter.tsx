export default function GuestFooter() {
    return (
        <footer className="h-16 border-t bg-background">
            <div className="container flex items-center justify-center h-full px-4 mx-auto">
                <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} 재고키퍼!</p>
            </div>
        </footer>
    );
}
