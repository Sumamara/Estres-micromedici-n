import { Providers } from "@/components/Providers";
import "../index.css";

const basePath = process.env.RUTA_BASE || "";

/* Origen público del sitio para resolver imágenes de Open Graph correctamente. */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://inner-base.com";

export const metadata = {
    metadataBase: new URL(siteUrl),
    title: "Medición de control · Micro-Pulso Semanal (Sesiones 1 a 5)",
    description:
        "Registrá en 1 minuto tus 5 indicadores semanales (Desconectar, Organizar, Recargar, Regular y Carga Corporal) de 0% a 100% y seguí tu curva evolutiva de 5 semanas.",
    keywords: [
        "medición de control",
        "micro-pulso semanal",
        "manejo del estrés",
        "seguimiento semanal",
        "SIMs",
        "EMA",
        "efecto escalonado",
        "Inner Base",
    ],
    alternates: {
        canonical: basePath || "/",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
        },
    },
    icons: {
        icon: [
            { url: `${basePath}/favicon.ico` },
            { url: `${basePath}/favicon.png`, type: "image/png" },
        ],
        shortcut: `${basePath}/favicon.png`,
        apple: `${basePath}/favicon.png`,
    },
    openGraph: {
        type: "website",
        locale: "es_CR",
        url: basePath || "/",
        siteName: "Medición de control · Inner Base",
        title: "Medición de control · Micro-Pulso Semanal",
        description:
            "5 indicadores de 0% a 100% durante los últimos 7 días para trazar tu curva evolutiva de la Sesión 1 a la Sesión 5.",
        images: [
            {
                url: `${basePath}/og_banner_estres_final.jpg`,
                width: 1200,
                height: 630,
                type: "image/jpeg",
                alt: "Medición de control · Micro-Pulso Semanal de 5 indicadores",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Medición de control · Micro-Pulso Semanal",
        description:
            "Registrá tus 5 indicadores de los últimos 7 días y seguí tu curva evolutiva de 5 semanas.",
        images: [`${basePath}/og_banner_estres_final.jpg`],
    },
};

const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebApplication",
            name: "Medición de control · Micro-Pulso Semanal",
            url: `${siteUrl}${basePath}`,
            applicationCategory: "HealthApplication",
            operatingSystem: "Web",
            inLanguage: "es",
            isAccessibleForFree: true,
            description:
                "Micro-pulso semanal basado en Medidas de Ítem Único Validadas (SIMs / EMA) con 5 indicadores de 0% a 100% para trazar la curva evolutiva y el efecto escalonado de la Sesión 1 a la Sesión 5.",
        },
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es" suppressHydrationWarning>
            <body suppressHydrationWarning>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
