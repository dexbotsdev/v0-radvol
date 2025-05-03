import { redirect } from "next/navigation"

export default function HomePage() {
  // Redirect to dashboard by default since bundler-bnb was removed
  redirect("/trading")
}
