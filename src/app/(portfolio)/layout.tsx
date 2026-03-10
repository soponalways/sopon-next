// src/app/(portfolio)/layout.tsx  ← নতুন folder
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
// ```

// তারপর `page.tsx` কে এই folder এ move করুন:
// ```
// src / app / (portfolio) / page.tsx   ← move করুন