import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Alex Chen",
    role: "Full Stack Developer",
    content:
      "This tool has been a game-changer for maintaining my GitHub activity. The automated commits keep my contribution graph green without any manual effort.",
    rating: 5,
  },
  {
    name: "Sarah Johnson",
    role: "DevOps Engineer",
    content:
      "Perfect for keeping project repositories active. The real-time monitoring and error recovery features make it incredibly reliable.",
    rating: 5,
  },
  {
    name: "Mike Rodriguez",
    role: "Software Engineer",
    content:
      "Simple setup, powerful features. I love how I can customize commit messages and intervals. It just works!",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">What Developers Say</h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Join thousands of developers who trust our auto-committer for their GitHub repositories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-600 mb-4">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold text-slate-900">{testimonial.name}</p>
                <p className="text-sm text-slate-500">{testimonial.role}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
