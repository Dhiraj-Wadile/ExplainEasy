import type { Concept } from '@/types'

interface NewsletterData {
  featuredConcept: Concept
  latestConcepts: Concept[]
  roadmaps: { title: string; url: string; description: string; color: string; icon: string }[]
  totalConcepts: number
  totalCategories: number
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://explaineasy.com'

export function buildNewsletterEmailHtml(data: NewsletterData): string {
  const featured = data.featuredConcept
  const latest = data.latestConcepts.slice(0, 4)
  const roadmaps = data.roadmaps

  const featuredUrl = `${BASE_URL}/terms/${featured.slug}`
  const difficultyColor =
    featured.difficulty === 'Beginner' ? '#22C55E' :
    featured.difficulty === 'Intermediate' ? '#F59E0B' : '#3B82F6'

  const conceptCards = latest.map((c, i) => {
    const diffColor =
      c.difficulty === 'Beginner' ? '#22C55E' :
      c.difficulty === 'Intermediate' ? '#F59E0B' : '#3B82F6'
    const cUrl = `${BASE_URL}/terms/${c.slug}`
    return `
    <tr><td style="padding:0 32px ${i < latest.length - 1 ? '12px' : '0'}">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(124,108,242,0.04);border-radius:12px;border:1px solid rgba(124,108,242,0.08)">
        <tr><td style="padding:16px 20px">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:28px;vertical-align:top;padding-top:1px;font-size:20px;line-height:1">${c.icon ? getIcon(c.icon) : '📘'}</td>
              <td style="padding-left:12px">
                <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#F8FAFC">${c.name}</p>
                <p style="margin:0 0 8px;font-size:12px;color:#64748B">${c.category} &middot; <span style="color:${diffColor}">${c.difficulty}</span> &middot; ${c.readTime || 3} min read</p>
                <p style="margin:0 0 10px;font-size:13px;color:#94A3B8;line-height:1.5">${c.quickSummary || c.simpleExplanation.substring(0, 100)}...</p>
                <table cellpadding="0" cellspacing="0">
                  <tr><td style="background:rgba(124,108,242,0.1);border-radius:8px;padding:6px 14px">
                    <a href="${cUrl}" style="color:#A78BFA;font-size:12px;font-weight:600;text-decoration:none">Read More</a>
                  </td></tr>
                </table>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </td></tr>`
  }).join('')

  const roadmapRows = roadmaps.map((r, i) => {
    const rUrl = `${BASE_URL}${r.url}`
    return `
    <tr><td style="padding:0 32px ${i < roadmaps.length - 1 ? '10px' : '0'}">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(124,108,242,0.03);border-radius:10px;border:1px solid rgba(124,108,242,0.06)">
        <tr><td style="padding:14px 18px">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:40px;vertical-align:middle">
                <div style="width:36px;height:36px;border-radius:10px;background:${r.color};display:inline-flex;align-items:center;justify-content:center;font-size:18px;line-height:1">${r.icon}</div>
              </td>
              <td style="padding-left:12px;vertical-align:middle">
                <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#F8FAFC">${r.title}</p>
                <p style="margin:0;font-size:12px;color:#64748B">${r.description}</p>
              </td>
              <td style="width:70px;vertical-align:middle;text-align:right">
                <table cellpadding="0" cellspacing="0" style="margin:0 0 0 auto">
                  <tr><td style="background:rgba(124,108,242,0.1);border-radius:8px;padding:6px 12px">
                    <a href="${rUrl}" style="color:#A78BFA;font-size:11px;font-weight:600;text-decoration:none;white-space:nowrap">Explore</a>
                  </td></tr>
                </table>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </td></tr>`
  }).join('')

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ExplainEasy Newsletter</title>
<style type="text/css">
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.7} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
  @keyframes glow { 0%,100%{box-shadow:0 4px 20px rgba(124,108,242,0.3)} 50%{box-shadow:0 4px 32px rgba(124,108,242,0.5)} }
  @keyframes fadeUp { 0%{opacity:0;transform:translateY(10px)} 100%{opacity:1;transform:translateY(0)} }
  .anim-shimmer { background:linear-gradient(90deg,rgba(124,108,242,0.08),rgba(167,139,250,0.15),rgba(124,108,242,0.08));background-size:200% 100%;animation:shimmer 4s ease-in-out infinite !important; }
  .anim-pulse { animation:pulse 3s ease-in-out infinite !important; }
  .anim-float { animation:float 3s ease-in-out infinite !important; }
  .anim-glow { animation:glow 3s ease-in-out infinite !important; }
  .anim-fadeUp { animation:fadeUp 0.6s ease-out !important; }
  @media only screen and (max-width:520px){ .responsive-pad{padding-left:16px !important;padding-right:16px !important} .responsive-stack{display:block !important;width:100% !important} }
</style>
</head>
<body style="margin:0;padding:0;background:#05080F;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased">

<!-- Outer wrapper -->
<table width="100%" cellpadding="0" cellspacing="0" style="background:#05080F;padding:30px 10px">
<tr><td align="center">

<!-- Main card -->
<table width="540" cellpadding="0" cellspacing="0" style="background:#0F1322;border-radius:24px;border:1px solid rgba(124,108,242,0.1);overflow:hidden">

<!-- ======== HERO SECTION ======== -->
<tr><td style="background:linear-gradient(135deg,#0F1322 0%,#1A1040 50%,#0F1322 100%);padding:0">
  <div class="anim-shimmer" style="padding:40px 32px 32px;text-align:center;border-bottom:1px solid rgba(124,108,242,0.08)">
    <div class="anim-float" style="width:72px;height:72px;border-radius:20px;background:linear-gradient(135deg,#7C6CF2,#A78BFA);display:inline-flex;align-items:center;justify-content:center;margin:0 auto 16px;box-shadow:0 8px 32px rgba(124,108,242,0.3)">
      <span style="font-size:34px;line-height:1">🚀</span>
    </div>
    <p style="margin:0 0 4px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#7C6CF2">ExplainEasy Newsletter</p>
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#F8FAFC;letter-spacing:-0.03em;line-height:1.2">New Concepts to Explore</h1>
    <p style="margin:0;font-size:14px;color:#64748B;line-height:1.6">Handpicked business concepts, learning roadmaps, and fresh content curated for you.</p>
  </div>
</td></tr>

<!-- ======== FEATURED CONCEPT ======== -->
<tr><td style="padding:28px 32px 20px">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding-bottom:16px">
      <p style="margin:0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#7C6CF2">Featured Concept</p>
    </td></tr>
  </table>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,rgba(124,108,242,0.06),rgba(167,139,250,0.02));border-radius:16px;border:1px solid rgba(124,108,242,0.1);overflow:hidden">
    <tr><td style="padding:24px 24px 20px">
      <div style="width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#7C6CF2,#A78BFA);display:inline-flex;align-items:center;justify-content:center;margin-bottom:14px;font-size:22px;line-height:1">${getIcon(featured.icon)}</div>
      <h2 style="margin:0 0 6px;font-size:20px;font-weight:700;color:#F8FAFC;letter-spacing:-0.02em">${featured.name}</h2>
      <p style="margin:0 0 14px;font-size:12px;color:#64748B">
        <span style="display:inline-block;padding:2px 10px;border-radius:999px;background:rgba(124,108,242,0.1);color:#7C6CF2;margin-right:6px">${featured.category}</span>
        <span style="display:inline-block;padding:2px 10px;border-radius:999px;background:${difficultyColor}12;color:${difficultyColor}">${featured.difficulty}</span>
      </p>
      <p style="margin:0 0 4px;font-size:14px;color:#CBD5E1;line-height:1.7">${featured.simpleExplanation}</p>
    </td></tr>
    <tr><td style="padding:0 24px 20px">
      ${featured.whyItMatters ? `
      <div style="background:rgba(34,197,94,0.04);border-radius:10px;padding:14px 18px;border-left:3px solid #22C55E;margin-bottom:14px">
        <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#22C55E">Why It Matters</p>
        <p style="margin:0;font-size:13px;color:#94A3B8;line-height:1.6">${featured.whyItMatters}</p>
      </div>` : ''}
      ${featured.example ? `
      <div style="background:rgba(251,191,36,0.04);border-radius:10px;padding:14px 18px;border-left:3px solid #F59E0B">
        <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#F59E0B">Real-World Example</p>
        <p style="margin:0;font-size:13px;color:#94A3B8;line-height:1.6">${featured.example}</p>
      </div>` : ''}
    </td></tr>
    <tr><td style="padding:0 24px 24px;text-align:center">
      <div class="anim-glow" style="display:inline-block;background:linear-gradient(135deg,#7C6CF2,#A78BFA);border-radius:12px;padding:14px 36px;">
        <a href="${featuredUrl}" style="color:#fff;font-size:15px;font-weight:700;text-decoration:none;display:inline-block">Read Full Explanation →</a>
      </div>
    </td></tr>
  </table>
</td></tr>

<!-- ======== LATEST CONCEPTS ======== -->
${latest.length > 0 ? `
<tr><td style="padding:8px 32px 20px">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding-bottom:14px">
      <p style="margin:0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#7C6CF2">More Concepts to Explore</p>
    </td></tr>
  </table>
  ${conceptCards}
</td></tr>` : ''}

<!-- ======== ROADMAPS ======== -->
${roadmaps.length > 0 ? `
<tr><td style="padding:4px 32px 20px">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding-bottom:14px">
      <p style="margin:0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#7C6CF2">Interactive Learning Roadmaps</p>
    </td></tr>
  </table>
  ${roadmapRows}
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:12px 0 0;text-align:center">
    <table cellpadding="0" cellspacing="0" style="margin:0 auto">
      <tr><td style="background:rgba(124,108,242,0.06);border-radius:10px;padding:10px 24px;border:1px solid rgba(124,108,242,0.08)">
        <a href="${BASE_URL}/roadmaps" style="color:#A78BFA;font-size:13px;font-weight:600;text-decoration:none">View All Roadmaps →</a>
      </td></tr>
    </table>
  </td></tr></table>
</td></tr>` : ''}

<!-- ======== STATS BANNER ======== -->
<tr><td style="padding:4px 32px 20px">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,rgba(124,108,242,0.04),rgba(167,139,250,0.02));border-radius:14px;border:1px solid rgba(124,108,242,0.06);overflow:hidden">
    <tr>
      <td style="padding:18px 16px;text-align:center;width:33%">
        <p style="margin:0 0 2px;font-size:24px;font-weight:800;color:#7C6CF2">${data.totalConcepts}+</p>
        <p style="margin:0;font-size:11px;color:#64748B;text-transform:uppercase;letter-spacing:1px">Concepts</p>
      </td>
      <td style="padding:18px 16px;text-align:center;width:33%;border-left:1px solid rgba(124,108,242,0.06)">
        <p style="margin:0 0 2px;font-size:24px;font-weight:800;color:#A78BFA">${data.totalCategories}</p>
        <p style="margin:0;font-size:11px;color:#64748B;text-transform:uppercase;letter-spacing:1px">Categories</p>
      </td>
      <td style="padding:18px 16px;text-align:center;width:33%;border-left:1px solid rgba(124,108,242,0.06)">
        <p style="margin:0 0 2px;font-size:24px;font-weight:800;color:#C4B5FD">${roadmaps.length}</p>
        <p style="margin:0;font-size:11px;color:#64748B;text-transform:uppercase;letter-spacing:1px">Roadmaps</p>
      </td>
    </tr>
  </table>
</td></tr>

<!-- ======== CTA SECTION ======== -->
<tr><td style="padding:0 32px 28px;text-align:center">
  <div style="background:rgba(124,108,242,0.03);border-radius:14px;border:1px solid rgba(124,108,242,0.06);padding:24px 20px">
    <p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#F8FAFC">Ready to dive deeper?</p>
    <p style="margin:0 0 18px;font-size:13px;color:#64748B;line-height:1.5">Take quizzes, track progress, test your knowledge with flashcards, and earn achievements.</p>
    <table cellpadding="0" cellspacing="0" style="margin:0 auto">
      <tr>
        <td style="padding:0 6px 6px 0"><table cellpadding="0" cellspacing="0"><tr><td style="background:rgba(124,108,242,0.08);border-radius:10px;padding:10px 20px;border:1px solid rgba(124,108,242,0.1)"><a href="${BASE_URL}/learn" style="color:#A78BFA;font-size:13px;font-weight:600;text-decoration:none">Start Learning</a></td></tr></table></td>
        <td style="padding:0 0 6px 6px"><table cellpadding="0" cellspacing="0"><tr><td style="background:rgba(124,108,242,0.08);border-radius:10px;padding:10px 20px;border:1px solid rgba(124,108,242,0.1)"><a href="${BASE_URL}/search" style="color:#A78BFA;font-size:13px;font-weight:600;text-decoration:none">Browse All</a></td></tr></table></td>
      </tr>
    </table>
  </div>
</td></tr>

<!-- ======== FOOTER ======== -->
<tr><td style="padding:20px 32px;border-top:1px solid rgba(124,108,242,0.06);text-align:center;background:rgba(0,0,0,0.15)">
  <p style="margin:0 0 6px;font-size:11px;color:#475569">You're receiving this because you subscribed to ExplainEasy updates.</p>
  <p style="margin:0 0 10px;font-size:11px;color:#475569">
    <a href="${BASE_URL}" style="color:#7C6CF2;text-decoration:none">ExplainEasy</a>
    &nbsp;&middot;&nbsp;
    <a href="${BASE_URL}/about" style="color:#7C6CF2;text-decoration:none">About</a>
    &nbsp;&middot;&nbsp;
    <a href="%unsubscribe_url%" style="color:#7C6CF2;text-decoration:none">Unsubscribe</a>
  </p>
  <p style="margin:0;font-size:10px;color:#333">${new Date().getFullYear()} ExplainEasy. All rights reserved.</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

function getIcon(icon: string): string {
  const icons: Record<string, string> = {
    BookOpen: '📖',
    TrendingUp: '📈',
    DollarSign: '💰',
    Users: '👥',
    Lightbulb: '💡',
    Target: '🎯',
    BarChart3: '📊',
    Shield: '🛡️',
    Zap: '⚡',
    Brain: '🧠',
    MessageSquare: '💬',
    Rocket: '🚀',
    Globe: '🌍',
    Puzzle: '🧩',
    Scale: '⚖️',
    Star: '⭐',
    Heart: '❤️',
    Clock: '⏰',
    Compass: '🧭',
    Flag: '🏁',
    Filter: '🔍',
    Github: '💻',
    Linkedin: '🔗',
    Twitter: '🐦',
    Youtube: '📺',
    Play: '▶️',
    Check: '✅',
    X: '❌',
    AlertTriangle: '⚠️',
    Info: 'ℹ️',
  }
  return icons[icon] || '📘'
}
