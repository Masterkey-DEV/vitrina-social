import { Phone, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SupportSection() {
  return (
    <section id="support" className="px-4 py-8 text-center">
      <h2 className="text-xl font-bold text-foreground mb-2">
        Need Direct Support?
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Our team is here to listen and guide you through the available resources.
      </p>
      <div className="flex gap-3 justify-center">
        <Button
          variant="outline"
          className="rounded-full flex items-center gap-2 px-6 py-5 border-border text-foreground font-medium hover:bg-accent bg-transparent"
        >
          <Phone className="h-4 w-4" />
          Call Us
        </Button>
        <Button className="rounded-full flex items-center gap-2 px-6 py-5 bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
          <MessageSquare className="h-4 w-4" />
          Chat Now
        </Button>
      </div>
    </section>
  )
}
