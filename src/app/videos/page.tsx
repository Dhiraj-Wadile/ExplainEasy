import { Play, Eye, Globe } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FadeInUp } from '@/components/shared/motion'

const featuredVideo = {
  id: '1',
  title: 'Business Concepts Explained Simply',
  youtubeId: 'ZS2RDh5hXvM',
  category: 'Business',
  views: '15K',
}

export default function VideosPage() {
  return (
    <main className="min-h-screen">
      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4">
          <FadeInUp>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Globe className="w-4 h-4" />
              Video Library
            </div>
            <h1 className="heading-xl mb-4">Learn Through Videos</h1>
            <p className="body-lg max-w-2xl mx-auto mb-8">
              Watch curated video explanations for every business concept.
            </p>
          </FadeInUp>

          <FadeInUp>
            <Card className="overflow-hidden border border-border">
              <div className="relative aspect-video bg-muted">
                <iframe
                  src={`https://www.youtube.com/embed/${featuredVideo.youtubeId}`}
                  title={featuredVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="primary">{featuredVideo.category}</Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {featuredVideo.views}
                  </span>
                </div>
                <h2 className="heading-md mb-2">{featuredVideo.title}</h2>
                <p className="text-muted-foreground mb-4">Watch our featured video to understand key business concepts visually.</p>
                <a href={`https://youtu.be/${featuredVideo.youtubeId}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Play className="w-4 h-4" /> Watch on YouTube
                  </Button>
                </a>
              </div>
            </Card>
          </FadeInUp>

          <FadeInUp>
            <Card className="p-10 text-center mt-8">
              <Globe className="w-10 h-10 mx-auto mb-4 text-red-500" />
              <h2 className="heading-md mb-3">Subscribe on YouTube</h2>
              <p className="text-muted-foreground mb-6">Get notified when new explainer videos drop.</p>
              <a href="https://www.youtube.com/@ExplainEasy55" target="_blank" rel="noopener noreferrer">
                <Button className="gap-2">
                  <Globe className="w-5 h-5" /> Subscribe to ExplainEasy
                </Button>
              </a>
            </Card>
          </FadeInUp>
        </div>
      </section>
    </main>
  )
}
