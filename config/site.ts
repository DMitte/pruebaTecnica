export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Prueba Tecnica Next.js",
  description: "Esta es una prueba tecnica de Next.js",
  navItems: [
    {
      label: "Dashboard",
      href: "/",
    },
    {
      label: "Usuarios",
      href: "/usuarios",
    },
    {
      label: "Ventas",
      href: "/ventas",
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
