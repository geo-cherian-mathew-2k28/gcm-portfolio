import './globals.css';

export const metadata = {
    title: 'Geo Cherian Mathew | AI & IoT Developer',
    description: 'Portfolio of Geo Cherian Mathew — AI, IoT & full-stack developer from Kerala, India.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* Performance: pre-establish connections */}
                <link rel="preconnect" href="https://gcbppyetisfunawqzzjt.supabase.co" />
                <link rel="dns-prefetch" href="https://gcbppyetisfunawqzzjt.supabase.co" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
                <script noModule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
            </head>
            <body suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
