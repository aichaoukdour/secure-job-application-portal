export default function Footer() {
    return (
        <footer className="w-full border-t bg-gray-50 py-8">
            <div className="mx-auto max-w-6xl px-4 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} CompanyName. All rights reserved.
            </div>
        </footer>
    );
}
