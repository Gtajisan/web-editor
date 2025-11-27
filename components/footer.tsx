"use client"

import Link from "next/link"
import { Zap, Github, Twitter, MessageCircle, Youtube, Facebook, Instagram, Linkedin, Mail, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"

const socialLinks = [
  { name: "GitHub", href: "https://github.com/anbuinfosec", icon: Github },
  { name: "Telegram", href: "https://t.me/AnbuSoft", icon: MessageCircle },
  { name: "Twitter", href: "https://twitter.com/anbuinfosec", icon: Twitter },
  { name: "YouTube", href: "https://youtube.com/@anbuinfosec", icon: Youtube },
  { name: "Facebook", href: "https://facebook.com/anbuinfosec", icon: Facebook },
  { name: "Instagram", href: "https://instagram.com/anbuinfosec", icon: Instagram },
  { name: "LinkedIn", href: "https://linkedin.com/company/anbuinfosec", icon: Linkedin },
]

const quickLinks = [
  { labelKey: "home", href: "/" },
  { labelKey: "docs", href: "/docs" },
  { labelKey: "playground", href: "/playground" },
  { labelKey: "models", href: "/models" },
  { labelKey: "about", href: "/about" },
  { labelKey: "contact", href: "/contact" },
]

const resourceLinks = [
  { label: "API Reference", href: "/docs#api" },
  { label: "Examples", href: "/docs#examples" },
  { label: "Changelog", href: "/changelog" },
  { label: "Status", href: "/status" },
]

const legalLinks = [
  { labelKey: "privacy", href: "/privacy" },
  { labelKey: "terms", href: "/terms" },
]

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="border-t border-border/40 bg-card/50">
      <div className="container px-4 md:px-6 py-8 md:py-12 max-w-7xl mx-auto">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Anbu AI</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              {t("openSourceAI")}. Access powerful AI models for text generation and image creation.
            </p>

            {/* Social Links */}
            <div>
              <p className="text-sm font-medium mb-3">{t("followUs")}</p>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social) => (
                  <Button key={social.name} variant="outline" size="icon" asChild className="h-9 w-9 bg-transparent">
                    <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name}>
                      <social.icon className="h-4 w-4" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">{t("quickLinks")}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">{t("resources")}</h3>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">{t("legal")}</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact */}
            <div className="mt-6">
              <a
                href="mailto:anbuinfosec@gmail.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                anbuinfosec@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            {t("madeWith")} <Heart className="h-3 w-3 text-red-500 fill-red-500" /> {t("by")} Anbu Soft
          </p>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Anbu AI. {t("allRightsReserved")}</p>
        </div>
      </div>
    </footer>
  )
}
