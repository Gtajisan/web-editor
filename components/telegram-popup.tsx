"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"
import { MessageCircle, X } from "lucide-react"

const POPUP_STORAGE_KEY = "anbu-telegram-popup-last"
const POPUP_INTERVAL_DAYS = 10

export function TelegramPopup() {
  const [open, setOpen] = useState(false)
  const { t } = useI18n()
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Check if we should show the popup
    const lastShown = localStorage.getItem(POPUP_STORAGE_KEY)
    const now = Date.now()

    if (!lastShown) {
      // First visit - show after 5 seconds
      setTimeout(() => setOpen(true), 5000)
    } else {
      const daysSince = (now - Number.parseInt(lastShown)) / (1000 * 60 * 60 * 24)
      if (daysSince >= POPUP_INTERVAL_DAYS) {
        setTimeout(() => setOpen(true), 3000)
      }
    }

    // Check theme
    setIsDark(document.documentElement.classList.contains("dark"))
  }, [])

  const handleClose = () => {
    setOpen(false)
    localStorage.setItem(POPUP_STORAGE_KEY, Date.now().toString())
  }

  const handleJoin = () => {
    window.open("https://t.me/anbuinfosec", "_blank")
    handleClose()
  }

  const telegramImageUrl = isDark
    ? "https://tginvite.pages.dev/anbuinfosec?style=discord&theme=dark&color=%235865f2"
    : "https://tginvite.pages.dev/anbuinfosec?style=discord&theme=light&color=%235865f2"

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Telegram invite card image */}
          <div className="w-full mb-4 rounded-lg overflow-hidden">
            <img src={telegramImageUrl || "/placeholder.svg"} alt="Anbu Soft Telegram" className="w-full h-auto" />
          </div>

          <DialogHeader className="text-center">
            <DialogTitle className="flex items-center justify-center gap-2 text-xl">
              <MessageCircle className="h-5 w-5 text-[#0088cc]" />
              {t("joinTelegram")}
            </DialogTitle>
            <DialogDescription className="text-center">{t("joinTelegramDesc")}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full">
            <Button onClick={handleJoin} className="flex-1 bg-[#0088cc] hover:bg-[#0077b5] text-white">
              <MessageCircle className="h-4 w-4 mr-2" />
              {t("joinNow")}
            </Button>
            <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
              {t("maybeLater")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
