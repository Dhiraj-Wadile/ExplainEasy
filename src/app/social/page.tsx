import { ExternalLink, Heart, Globe, Play, Bookmark } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/shared/motion'

const platforms = [
  {
    name: 'Instagram',
    handle: '@explaineasyofficial',
    url: 'https://instagram.com/explaineasyofficial',
    icon: Globe,
    stats: '10K+ followers',
    description: 'Daily concept visuals, carousel explainers, and interactive stories.',
  },
  {
    name: 'YouTube',
    handle: 'ExplainEasy',
    url: 'https://www.youtube.com/@ExplainEasy55',
    icon: Play,
    stats: '5K+ subscribers',
    description: 'In-depth video explanations, tutorials, and concept deep dives.',
  },
  {
    name: 'Pinterest',
    handle: '@explaineasy',
    url: 'https://pinterest.com/explaineasy',
    icon: Bookmark,
    stats: '3K+ followers',
    description: 'Infographics, cheatsheets, and visual learning boards.',
  },
]

export default function SocialPage() {
  return (
    <main className="min-h-screen">
      <section className="section-padding">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <FadeInUp>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Heart className="w-4 h-4" />
              Join Our Community
            </div>
            <h1 className="heading-xl mb-4">Follow ExplainEasy</h1>
            <p className="body-lg max-w-2xl mx-auto">
              Learn business concepts across all your favorite platforms.
            </p>
          </FadeInUp>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="max-w-6xl mx-auto px-4">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {platforms.map((platform) => (
              <StaggerItem key={platform.name}>
                <Card className="p-8 text-center h-full group hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                    <platform.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{platform.name}</h3>
                  <p className="text-sm text-primary mb-3">{platform.handle}</p>
                  <p className="text-muted-foreground mb-4">{platform.description}</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                    <Badge variant="secondary">{platform.stats}</Badge>
                  </div>
                  <a href={platform.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="gap-2 w-full">
                      Follow <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </main>
  )
}
