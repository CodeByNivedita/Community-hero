export default function AuthLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
 <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent dark:from-primary dark:via-secondary dark:to-accent p-4">
 {/* Decorative background elements */}
 <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
 <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white/20 rounded-full blur-3xl" />
 <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-black/20 rounded-full blur-3xl" />
 </div>

 <div className="z-10 w-full max-w-md">
 {children}
 </div>
 </div>
 );
}
