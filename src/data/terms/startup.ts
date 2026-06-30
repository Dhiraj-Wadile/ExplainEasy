import { Concept } from '@/types'

export const startupTerms: Concept[] = [

  {
    id: 'startup-2',
    slug: 'product-market-fit',
    name: 'PMF (Product-Market Fit)',
    category: 'Startup',
    subcategory: 'Growth & Strategy',
    definition:
      'Product-Market Fit is the degree to which a product satisfies strong market demand. Coined by Marc Andreessen, PMF is the moment when a startup finally builds a product that resonates with a large enough audience. It is often described as the point where customers are buying the product just as fast as you can make it or when usage growth is driven primarily by word-of-mouth.',
    simpleExplanation:
      'Product-Market Fit means you have built something people actually want and are willing to pay for, and the market is big enough to build a real business around it.',
    example:
      'Slack initially launched as an internal communication tool for a gaming company. When the game failed, the team realized the chat tool was more valuable. They pivoted to focus solely on Slack, and within two weeks of public launch, 8,000 companies signed up.',
    whyItMatters:
      'Before PMF, startups are in search mode. After PMF, they enter execution mode. Most startups fail because they never reach PMF. Sean Ellis survey question with 40%+ answering very disappointed is a strong PMF indicator.',
    relatedTerms: ['minimum-viable-product', 'pivot', 'lean-startup', 'traction', 'growth-metrics'],
    interviewQuestions: [
      'How do you measure product-market fit quantitatively?',
      'What surveys or metrics do you use to determine if you have achieved PMF?',
      'Tell me about a time your team achieved PMF and how you knew.',
      'What do you do if you cannot seem to find product-market fit?',
      'How do you know when to pivot versus when to persevere in the search for PMF?',
    ],
    sharkTankExample:
      'Bombas socks appeared on Shark Tank with a clear PMF story: they had already sold 50,000 pairs and had a 25% repeat purchase rate. Daymond John invested and Bombas became one of the most successful Shark Tank companies ever.',
    realCompanyExample:
      'Airbnb struggled for years. The founders realized the problem was poor listing photos. They personally photographed every listing in New York, and bookings doubled. This was the turning point that revealed PMF.',
    faqs: [
      {
        question: 'How long does it take to achieve product-market fit?',
        answer:
          'It varies enormously. Some startups achieve PMF in months, others take years. The average time across successful startups is estimated at 12-24 months.',
      },
      {
        question: 'What are the leading indicators of product-market fit?',
        answer:
          'Organic growth rate above 20% MoM, net promoter score above 40, paid CAC lower than LTV, and the Sean Ellis test showing 40%+ users would be very disappointed without the product.',
      },
      {
        question: 'Can you have product-market fit and still fail?',
        answer:
          'Yes. PMF means the product satisfies market demand, but the company can still fail due to poor business model, insufficient funding, or execution failures.',
      },
      {
        question: 'Does product-market fit happen once or multiple times?',
        answer:
          'PMF is not a one-time event. Companies must continuously find PMF as they expand to new segments, geographies, or product lines.',
      },
    ],
    references: [
      'Andreessen, M. (2007). Product-Market Fit. PMArca.',
      'Ellis, S. (2017). Hacking Growth. Crown Business.',
      'Maurya, A. (2012). Running Lean. OReilly Media.',
    ],
    tags: ['product-market-fit', 'pmf', 'growth', 'traction', 'validation', 'startup-success'],
    icon: 'Target',
    difficulty: 'Intermediate',
    featured: true,
    popular: true,
    createdAt: '2025-01-12T00:00:00.000Z',
  },

  {
    id: 'startup-4',
    slug: 'unicorn',
    name: 'Unicorn',
    category: 'Startup',
    subcategory: 'Valuation & Funding',
    definition:
      'A unicorn is a privately held startup company valued at over  billion. The Concept was coined in 2013 by venture capitalist Aileen Lee. As of 2025, there are over 1,200 unicorns globally, with the United States, China, and India being the top countries.',
    simpleExplanation:
      'A unicorn is a private company worth more than  billion, which is rare and magical in the startup world.',
    example:
      'Stripe was valued at .75 billion in 2014 after its Series B round, earning unicorn status just four years after founding. By 2024, Stripe was valued at  billion.',
    whyItMatters:
      'Unicorn status is a powerful signal to investors, employees, and the market. It validates that the company has found a scalable business model. However, it also brings increased scrutiny and pressure to maintain growth.',
    relatedTerms: ['decacorn', 'hectocorn', 'venture-capital', 'valuation', 'series-c', 'exit-strategy'],
    interviewQuestions: [
      'What factors contribute to a startup becoming a unicorn?',
      'Is unicorn status always a positive sign? What are the risks?',
      'How does unicorn valuation differ from public company valuation?',
      'Why do some unicorns fail after reaching billion-dollar valuations?',
      'What industries have produced the most unicorns in the last decade?',
    ],
    realCompanyExample:
      'DoorDash became a unicorn in 2018 when it raised  million at a .4 billion valuation. The company grew from a small Stanford campus delivery service to a + billion public company.',
    faqs: [
      { question: 'Who coined the Concept unicorn?', answer: 'Aileen Lee, founder of Cowboy Ventures, coined the Concept in a 2013 TechCrunch article.' },
      { question: 'How many unicorns exist today?', answer: 'Approximately 1,200+ unicorns worldwide as of early 2025.' },
      { question: 'Can a startup become a unicorn without venture capital?', answer: 'Yes, but rare. Mailchimp and Zoho achieved unicorn status without VC.' },
      { question: 'What happens if a unicorns valuation drops below  billion?', answer: 'It loses its unicorn status. WeWorks valuation dropped from  to .' },
    ],
    references: [
      'Lee, A. (2013). Welcome to the Unicorn Club. TechCrunch.',
      'CB Insights. (2025). The Global Unicorn Club.',
      'Crunchbase. (2025). Unicorn Tracker.',
    ],
    tags: ['unicorn', 'valuation', 'startup', 'billion-dollar', 'venture-capital', 'growth'],
    icon: 'Sparkles',
    difficulty: 'Beginner',
    featured: true,
    popular: true,
    createdAt: '2025-01-18T00:00:00.000Z',
  },
  {
    id: 'startup-5',
    slug: 'decacorn',
    name: 'Decacorn',
    category: 'Startup',
    subcategory: 'Valuation & Funding',
    definition:
      'A decacorn is a privately held startup company valued at over  billion. Decacorns are exceptionally rare and typically represent companies that have scaled globally and created defensible competitive advantages.',
    simpleExplanation:
      'A decacorn is a private company worth more than  billion - ten times rarer than a unicorn.',
    example:
      'SpaceX became a decacorn after its 2015 valuation of  billion. The company reached  billion by 2024 through Starlink and reusable rocket technology.',
    whyItMatters:
      'Decacorns represent the top echelon of private company success. Reaching decacorn status requires operating in a massive addressable market and building a strong moat.',
    relatedTerms: ['unicorn', 'hectocorn', 'venture-capital', 'valuation', 'series-c', 'mega-round'],
    interviewQuestions: [
      'What differentiates a decacorn from a regular unicorn?',
      'What industries produce the most decacorns?',
      'How do decacorns maintain growth at large scale?',
      'What are the risks of investing in decacorns?',
      'Why do some decacorns stay private for so long?',
    ],
    realCompanyExample:
      'ByteDance became a decacorn in 2018 and was valued at over  billion by 2024. Other decacorns include Stripe, Epic Games, Canva, and Revolut.',
    faqs: [
      { question: 'How many decacorns exist?', answer: 'Approximately 50-60 globally as of 2025.' },
      { question: 'Can a decacorn fail?', answer: 'Yes. WeWork valuation collapsed from  to  despite being a decacorn.' },
      { question: 'What is the highest valuation ever achieved by a private company?', answer: 'ByteDance at over  billion.' },
      { question: 'How long to become a decacorn?', answer: 'Most take 7-15 years.' },
    ],
    references: [
      'CB Insights. (2025). From Unicorn to Decacorn.',
      'PitchBook. (2024). Private Company Valuations Report.',
      'Forbes. (2024). The Decacorn Club: Private Companies Worth +.',
    ],
    tags: ['decacorn', 'valuation', 'startup', 'billion-dollar', 'mega-round', 'growth'],
    icon: 'TrendingUp',
    difficulty: 'Intermediate',
    featured: false,
    popular: true,
    createdAt: '2025-01-20T00:00:00.000Z',
  },
  {
    id: 'startup-6',
    slug: 'hectocorn',
    name: 'Hectocorn',
    category: 'Startup',
    subcategory: 'Valuation & Funding',
    definition:
      'A hectocorn is a privately held startup company valued at over  billion. Hectocorns are the rarest class of private companies, representing organizations that have grown beyond startups into global economic powerhouses.',
    simpleExplanation:
      'A hectocorn is a private company worth more than  billion - the rarest type of startup.',
    example:
      'ByteDance became the first hectocorn in 2020 when its valuation exceeded  billion. By 2024, its valuation reached + billion driven by TikToks global growth.',
    whyItMatters:
      'Hectocorns demonstrate that private markets can support companies at scales previously only seen in public markets.',
    relatedTerms: ['unicorn', 'decacorn', 'venture-capital', 'mega-round', 'valuation'],
    interviewQuestions: [
      'What unique challenges do hectocorns face?',
      'Why are hectocorns still private rather than going public?',
      'What does the rise of hectocorns mean for the IPO market?',
      'How do hectocorns manage regulatory risks?',
      'Do you expect more hectocorns in the next decade?',
    ],
    realCompanyExample:
      'SpaceX joined the hectocorn club in 2022 at  billion. By 2024, it reached  billion driven by Starlink.',
    faqs: [
      { question: 'How many hectocorns exist?', answer: 'Only ByteDance and SpaceX as of 2025.' },
      { question: 'Can a company become a hectocorn without operating globally?', answer: 'Almost certainly not.' },
      { question: 'Why do hectocorns stay private?', answer: 'To maintain founder control and avoid quarterly earnings pressure.' },
    ],
    references: [
      'CB Insights. (2025). The Hectocorn Club.',
      'Forbes. (2024). SpaceX Joins the  Billion Club.',
      'Bloomberg. (2024). ByteDance Valued at  Billion.',
    ],
    tags: ['hectocorn', 'valuation', 'startup', '100-billion', 'mega-round', 'global'],
    icon: 'Globe',
    difficulty: 'Advanced',
    featured: false,
    popular: false,
    createdAt: '2025-01-22T00:00:00.000Z',
  },
  {
    id: 'startup-7',
    slug: 'bootstrap',
    name: 'Bootstrap',
    category: 'Startup',
    subcategory: 'Funding & Finance',
    definition:
      'Bootstrapping is the practice of building and growing a company using personal finances, organic revenue, and minimal external capital. Bootstrapped founders rely on customer revenue to fund operations rather than seeking venture capital.',
    simpleExplanation:
      'Bootstrapping means starting a business with your own money and using customer revenue to grow, without outside investments.',
    example:
      'Mailchimp was bootstrapped for 17 years before taking any investment. Founders reinvested profits back into the business and sold to Intuit for  billion in 2021.',
    whyItMatters:
      'Bootstrapping gives founders complete control. No pressure from investors to prioritize growth over profitability. However, it limits growth speed and may cause missed market opportunities.',
    relatedTerms: ['bootstrapping', 'venture-capital', 'angel-investor', 'profitability', 'founders-equity'],
    interviewQuestions: [
      'What are the advantages and disadvantages of bootstrapping versus raising venture capital?',
      'How would you manage cash flow in a bootstrapped startup?',
      'What metrics would you focus on most in a bootstrapped business?',
      'Can you name successful bootstrapped companies?',
      'Would you ever choose to bootstrap?',
    ],
    sharkTankExample:
      'Most Shark Tank companies are bootstrapped before appearing. Squatty Potty founders bootstrapped to  in annual sales before the show.',
    realCompanyExample:
      'Basecamp has been bootstrapped since 1999. Co-founders Jason Fried and David Heinemeier Hansson run a profitable business with a small team.',
    faqs: [
      { question: 'What is the difference between bootstrapping and being self-funded?', answer: 'Bootstrapping specifically implies using customer revenue to fund growth.' },
      { question: 'Can a bootstrapped company become a unicorn?', answer: 'Yes, Mailchimp, Zoho, and Shutterstock did it.' },
      { question: 'What are the biggest risks of bootstrapping?', answer: 'Slow growth and missing market windows to well-funded competitors.' },
      { question: 'When should a startup stop bootstrapping and raise capital?', answer: 'After proving product-market fit and unit economics.' },
    ],
    references: [
      'Fried, J., & Hansson, D. H. (2010). Rework. Crown Business.',
      'Chestnut, B. (2021). Mailchimps  Billion Bootstrapped Journey. Inc.',
      'Camp, J. (2020). Startup Bootstrapping 101. Forbes.',
    ],
    tags: ['bootstrap', 'bootstrapping', 'self-funded', 'startup', 'entrepreneurship', 'profitability'],
    icon: 'Anchor',
    difficulty: 'Beginner',
    featured: false,
    popular: true,
    createdAt: '2025-01-25T00:00:00.000Z',
  },
  {
    id: 'startup-8',
    slug: 'bootstrapping',
    name: 'Bootstrapping',
    category: 'Startup',
    subcategory: 'Funding & Finance',
    definition:
      'Bootstrapping is the process of building a company from the ground up with personal savings, sweat equity, and revenue generated by the business itself. This approach demands extreme resourcefulness, lean operations, and a product that generates cash flow from day one.',
    simpleExplanation:
      'Bootstrapping means building your business with your own money and customer payments, without taking loans or selling equity.',
    example:
      'GitLab bootstrapped initially, with founder Sid Sijbrandij building the first version himself. The company focused on generating revenue from enterprise customers early on.',
    whyItMatters:
      'Bootstrapping teaches founders the most important business lesson: you must create value that customers will pay for. Without investor capital, every decision is measured against its impact on survival.',
    relatedTerms: ['bootstrap', 'venture-capital', 'profitability', 'cash-flow', 'lean-startup'],
    interviewQuestions: [
      'What strategies would you use to bootstrap a SaaS company?',
      'How do you prioritize spending with limited capital?',
      'What are key culture differences between bootstrapped and VC-backed startups?',
      'How do you attract talent to a bootstrapped company?',
    ],
    sharkTankExample:
      'Scrub Daddy founder Aaron Krause bootstrapped for years before Shark Tank, developing the product and building manufacturing relationships himself.',
    realCompanyExample:
      'Atlassian was bootstrapped for 8 years. Founders started with ,000 in credit card debt and built a + public company.',
    faqs: [
      { question: 'How do bootstrapped founders pay themselves?', answer: 'Minimal or no salary in early years, reinvesting all revenue.' },
      { question: 'Biggest mistake bootstrapped founders make?', answer: 'Spending on non-essentials before achieving product-market fit.' },
      { question: 'Can you bootstrap a hardware startup?', answer: 'Extremely difficult due to upfront capital requirements.' },
    ],
    references: [
      'Graham, P. (2009). Ramen Profitable. PaulGraham.com.',
      'Cannon-Brookes, M. (2015). Atlassians Bootstrapping Story. Forbes.',
      'Feld, B. (2013). Startup Bootstrapping. Feld Thoughts.',
    ],
    tags: ['bootstrapping', 'bootstrap', 'self-funded', 'startup', 'lean', 'profitability'],
    icon: 'Anchor',
    difficulty: 'Beginner',
    featured: false,
    popular: true,
    createdAt: '2025-01-26T00:00:00.000Z',
  },

  {
    id: 'startup-9',
    slug: 'angel-investor',
    name: 'Angel Investor',
    category: 'Startup',
    subcategory: 'Funding & Finance',
    definition:
      'An angel investor is a high-net-worth individual who provides capital to startups in exchange for equity or convertible debt. Angels typically invest in the earliest stages, often before the startup has significant revenue. They invest their own money and often provide mentorship and industry connections.',
    simpleExplanation:
      'An angel investor is a wealthy person who gives money to early-stage startups in exchange for a piece of the company, often helping with advice too.',
    example:
      'Peter Thiel invested ,000 in Facebook in 2004 as an angel investor. His investment was worth over  billion at Facebooks IPO in 2012.',
    whyItMatters:
      'Angels fill a critical funding gap between friends-and-family and institutional VC. They are often the first outside capital a startup receives.',
    relatedTerms: ['venture-capital', 'seed-funding', 'convertible-note', 'equity', 'Concept-sheet'],
    interviewQuestions: [
      'How do you find and approach angel investors?',
      'What do angel investors look for in a startup?',
      'What is the difference between an angel investor and a venture capitalist?',
      'How would you structure a deal with an angel investor?',
      'What are the risks for an angel investor?',
    ],
    sharkTankExample:
      'The Sharks on Shark Tank are effectively angel investors. Mark Cuban invested ,000 in BeatBox Beverages for 33% equity.',
    realCompanyExample:
      'Ubers first angel investment came from Jason Calacanis and Marc Andreessen who invested ,000 at a  million valuation in 2009.',
    faqs: [
      { question: 'How do I find angel investors?', answer: 'AngelList, local angel networks, accelerator demo days, and warm introductions.' },
      { question: 'What is the difference between an angel investor and an accredited investor?', answer: 'All angels are accredited investors, but not all accredited investors are angels.' },
      { question: 'How much equity should I give an angel?', answer: 'Typically 5-20% depending on investment amount and valuation.' },
      { question: 'What are the risks for angels?', answer: 'Over 70% of angel investments fail completely.' },
    ],
    references: [
      'Rose, D. (2014). Angel Investing. Wiley.',
      'Angel Capital Association. (2025). Angel Investing Best Practices.',
      'Thiel, P. (2014). Zero to One. Crown Business.',
    ],
    tags: ['angel-investor', 'early-stage', 'startup-funding', 'equity', 'mentorship', 'venture'],
    icon: 'UserCircle',
    difficulty: 'Beginner',
    featured: false,
    popular: true,
    createdAt: '2025-01-28T00:00:00.000Z',
  },
  {
    id: 'startup-10',
    slug: 'venture-capital',
    name: 'Venture Capital',
    category: 'Startup',
    subcategory: 'Funding & Finance',
    definition:
      'Venture capital (VC) is a form of private equity financing provided by firms to early-stage, high-potential startups in exchange for equity. VC firms pool money from limited partners (pension funds, endowments, family offices) and invest with the expectation of outsized returns through exits via IPO or acquisition.',
    simpleExplanation:
      'Venture capital is money that professional investors give to risky startups in exchange for ownership, hoping a few will become the next Google.',
    example:
      'Sequoia Capital invested .5 million in Google in 1999 for ~10% of the company. At Google\'s IPO, Sequoias stake was worth over  billion.',
    whyItMatters:
      'VC has been the primary engine behind most valuable technology companies. Without VC, Google, Amazon, Facebook, and Tesla might never have scaled.',
    relatedTerms: ['angel-investor', 'seed-funding', 'series-a', 'series-b', 'series-c', 'limited-partner'],
    interviewQuestions: [
      'What is the venture capital model and how do VC firms make money?',
      'What metrics do VCs look for when evaluating a startup?',
      'What is the difference between early-stage and late-stage VC?',
      'How does carried interest work in venture capital?',
    ],
    sharkTankExample:
      'Mark Cuban often structures his investments similar to VC deals with specific liquidation preference terms.',
    realCompanyExample:
      'Benchmark Capital invested  million in Ubers Series A in 2011 at a  million valuation. That investment was worth billions after Ubers IPO.',
    faqs: [
      { question: 'How do VCs make money?', answer: 'Management fees (2%) and carried interest (20% of profits).' },
      { question: 'What percentage of VC-backed startups succeed?', answer: 'About 75% fail to return capital. Only 1% become 10x+ home runs.' },
      { question: 'How do I get a meeting with a VC?', answer: 'Warm introductions from trusted sources work best.' },
      { question: 'What is the difference between VC and private equity?', answer: 'VC invests in early-stage unproven companies. PE invests in mature cash-flow-positive businesses.' },
    ],
    references: [
      'Gompers, P., & Lerner, J. (2004). The Venture Capital Cycle. MIT Press.',
      'Metrick, A., & Yasuda, A. (2010). Venture Capital and the Finance of Innovation. Wiley.',
      'Horowitz, B. (2014). The Hard Thing About Hard Things. HarperBusiness.',
    ],
    tags: ['venture-capital', 'vc', 'startup-funding', 'equity', 'investment', 'entrepreneurship'],
    icon: 'Briefcase',
    difficulty: 'Intermediate',
    featured: true,
    popular: true,
    createdAt: '2025-02-01T00:00:00.000Z',
  },
  {
    id: 'startup-11',
    slug: 'seed-funding',
    name: 'Seed Funding',
    category: 'Startup',
    subcategory: 'Funding & Finance',
    definition:
      'Seed funding is the earliest stage of institutional startup financing, typically following friends-and-family and preceding Series A. Seed rounds range from  to  and come from angel investors, seed-stage venture funds, and accelerator programs.',
    simpleExplanation:
      'Seed funding is early money that helps a startup get from an idea to a working product with initial users.',
    example:
      'WeWork raised a ,000 seed round in 2010 to launch its first co-working space in SoHo, New York, before raising a  Series A.',
    whyItMatters:
      'Seed funding bridges the gap between idea and fundable business. Many startups never get past seed because they cannot achieve traction for Series A.',
    relatedTerms: ['angel-investor', 'venture-capital', 'series-a', 'y-combinator', 'accelerator'],
    interviewQuestions: [
      'What milestones should a startup achieve with seed funding before Series A?',
      'How do you determine the right amount of seed funding?',
      'What is the difference between seed and Series A?',
      'How do seed valuations work?',
    ],
    sharkTankExample:
      'Mark Cubans ,000 investment in BeatBox Beverages functioned as seed funding for distribution and packaging expansion.',
    realCompanyExample:
      'Airbnb raised ,000 in seed funding from Sequoia and Y Combinator in 2009, allowing them to expand beyond their initial concept.',
    faqs: [
      { question: 'How much equity should I give up in a seed round?', answer: 'Typically 10-25%.' },
      { question: 'Difference between seed and pre-seed?', answer: 'Pre-seed is founders/friends/family. Seed is first institutional round.' },
      { question: 'How long does seed funding last?', answer: '12-18 months of runway.' },
      { question: 'Can you raise seed without a product?', answer: 'Increasingly yes, with a strong founding team.' },
    ],
    references: [
      'Feld, B., & Mendelson, J. (2016). Venture Deals. Wiley.',
      'Y Combinator. (2024). Safe Agreement Documentation.',
      'CB Insights. (2024). State of Seed Funding.',
    ],
    tags: ['seed-funding', 'seed-round', 'early-stage', 'startup-funding', 'venture-capital'],
    icon: 'Seedling',
    difficulty: 'Beginner',
    featured: false,
    popular: true,
    createdAt: '2025-02-03T00:00:00.000Z',
  },
  {
    id: 'startup-12',
    slug: 'series-a',
    name: 'Series A',
    category: 'Startup',
    subcategory: 'Funding & Finance',
    definition:
      'Series A is the first major round of institutional VC financing for startups with proven product and initial traction. Unlike seed funding (validating idea), Series A validates the business model. Rounds typically range from  to  with lead investors taking board seats.',
    simpleExplanation:
      'Series A is the first big investment round where VCs invest millions to help a startup scale after proving customers want its product.',
    example:
      'Instacart raised .5M Series A led by Sequoia Capital in 2012, allowing expansion to multiple cities and logistics infrastructure building.',
    whyItMatters:
      'Series A is the valley of death crossing point. Most seeded startups never make it here. It provides capital to build sales team and scale operations.',
    relatedTerms: ['seed-funding', 'series-b', 'series-c', 'venture-capital', 'Concept-sheet', 'dilution'],
    interviewQuestions: [
      'What metrics should a startup have to raise a Series A?',
      'How do Series A valuations work?',
      'What is the process of raising a Series A?',
      'How much of the company should founders give up in Series A?',
    ],
    sharkTankExample:
      'Shark Tank deals are structurally similar to Series A: due diligence, valuation negotiation, and often board seats.',
    realCompanyExample:
      'Slack raised .75M Series A in 2014 led by Accel at 8 months old with 120,000 active users. This gave Slack capital to build enterprise sales.',
    faqs: [
      { question: 'Typical dilution in Series A?', answer: '15-25% of the company.' },
      { question: 'Lead investor vs participating investor?', answer: 'Lead negotiates terms and takes board seat. Participants follow terms.' },
      { question: 'How long to raise Series A?', answer: '3-6 months. Start with 6-9 months of runway remaining.' },
      { question: 'What if startup cannot raise Series A?', answer: 'Extend seed round, achieve profitability, get acquired, or shut down.' },
    ],
    references: [
      'Feld, B., & Mendelson, J. (2016). Venture Deals. Wiley.',
      'Suster, M. (2012). What Makes a Series A Great?. Both Sides of the Table.',
      'Crunchbase. (2025). Series A Funding Trends.',
    ],
    tags: ['series-a', 'venture-capital', 'startup-funding', 'equity', 'dilution', 'scaling'],
    icon: 'TrendingUp',
    difficulty: 'Intermediate',
    featured: false,
    popular: true,
    createdAt: '2025-02-05T00:00:00.000Z',
  },
  {
    id: 'startup-14',
    slug: 'series-c',
    name: 'Series C',
    category: 'Startup',
    subcategory: 'Funding & Finance',
    definition:
      'Series C is a late-stage VC round for established companies preparing for IPO or acquisition. Companies have significant revenue (+ ARR) and proven unit economics. Rounds range from  to  attracting hedge funds and sovereign wealth funds.',
    simpleExplanation:
      'Series C is a large funding round for mature startups preparing to go public.',
    example:
      'Robinhood raised  Series C in 2018 led by DST Global with 4M users, funding international expansion and crypto trading.',
    whyItMatters:
      'Series C is often the final private round before IPO. The quality of investors signals public market readiness.',
    relatedTerms: ['series-b', 'series-a', 'ipo', 'venture-capital', 'exit-strategy', 'late-stage'],
    interviewQuestions: [
      'What differentiates Series C from earlier-stage investing?',
      'How do you prepare a company for Series C?',
      'What role do secondary sales play in Series C?',
      'What are typical Series C terms?',
    ],
    realCompanyExample:
      'Epic Games raised .78B Series C in 2020 led by Sony, valuing it at .3B, funding the Unreal Engine and Epic Games Store.',
    faqs: [
      { question: 'How is Series C different from going public?', answer: 'Still private with fewer regulatory requirements than IPO.' },
      { question: 'Typical Series C valuation?', answer: ' to , sometimes exceeding .' },
      { question: 'Can a company raise multiple Series C rounds?', answer: 'Yes, extensions are common when IPO conditions are unfavorable.' },
      { question: 'Do founders maintain control after Series C?', answer: 'Typically own 15-30% and may have dual-class stock protection.' },
    ],
    references: [
      'Feld, B., & Mendelson, J. (2016). Venture Deals. Wiley.',
      'CB Insights. (2025). Series C and Beyond: Late Stage Funding.',
      'Ramsay, J. (2020). Epic Games .78B Series C. Bloomberg.',
    ],
    tags: ['series-c', 'late-stage', 'venture-capital', 'ipo', 'funding', 'scaling'],
    icon: 'Building2',
    difficulty: 'Advanced',
    featured: false,
    popular: true,
    createdAt: '2025-02-10T00:00:00.000Z',
  },
  {
    id: 'startup-15',
    slug: 'bridge-round',
    name: 'Bridge Round',
    category: 'Startup',
    subcategory: 'Funding & Finance',
    definition:
      'A bridge round is short-Concept financing to provide a startup enough capital to reach its next major milestone. Typically between larger rounds, structured as convertible notes or SAFEs. Ranges from  to  and can signal either normal progress or financial distress.',
    simpleExplanation:
      'A bridge round is temporary funding that keeps a startup alive until it can raise its next big investment round.',
    example:
      'Oculus VR raised .4M bridge round from a16z in 2013 to complete the Rift development kit before a larger Series B.',
    whyItMatters:
      'Bridge rounds can be a lifeline but multiple bridges without a priced round indicate fundraising struggles.',
    relatedTerms: ['down-round', 'convertible-note', 'safe', 'series-a', 'series-b', 'runway'],
    interviewQuestions: [
      'When is it appropriate to raise a bridge round?',
      'What are typical bridge round terms?',
      'How does a bridge round affect the cap table?',
      'What signals does a bridge round send?',
      'How do you avoid needing multiple bridge rounds?',
    ],
    realCompanyExample:
      'Square raised  bridge round in 2009 from Sequoia while struggling to get payment approvals. The bridge gave time to negotiate retail deals.',
    faqs: [
      { question: 'Difference between bridge round and Series A extension?', answer: 'Bridge is smaller, shorter-Concept (3-9 months).' },
      { question: 'Typical bridge terms?', answer: '20-30% discount to next round, valuation cap, 5-8% interest.' },
      { question: 'Is a bridge round a bad signal?', answer: 'Not necessarily. Many successful companies raised bridges.' },
    ],
    references: [
      'Feld, B., & Mendelson, J. (2016). Venture Deals. Wiley.',
      'Suster, M. (2013). The Bridge Round. Both Sides of the Table.',
    ],
    tags: ['bridge-round', 'interim-funding', 'convertible-note', 'venture-capital', 'runway'],
    icon: 'Link',
    difficulty: 'Advanced',
    featured: false,
    popular: false,
    createdAt: '2025-02-12T00:00:00.000Z',
  },
  {
    id: 'startup-16',
    slug: 'down-round',
    name: 'Down Round',
    category: 'Startup',
    subcategory: 'Funding & Finance',
    definition:
      'A down round occurs when a startup raises capital at a lower valuation than the previous round. It signals that the companys value has decreased in investors eyes. Can trigger anti-dilution provisions that further dilute common shareholders.',
    simpleExplanation:
      'A down round happens when a company sells shares for less than before, meaning investors think its worth less.',
    example:
      'WeWorks valuation collapsed from  to  in 2020. Emergency funding from SoftBank was at the lower valuation.',
    whyItMatters:
      'Down rounds are devastating for morale and cap table dynamics. They dilute employees and founders most severely.',
    relatedTerms: ['bridge-round', 'valuation', 'dilution', 'anti-dilution', 'cap-table', 'liquidation-preference'],
    interviewQuestions: [
      'How would you handle a down round as a founder?',
      'What are typical down round terms?',
      'How does a down round affect employee retention?',
      'What anti-dilution provisions matter most?',
    ],
    sharkTankExample:
      'Kevin OLeary is notorious for offering down round deals - demanding more equity for less money than previous investors.',
    realCompanyExample:
      'Snapchat raised a down round in 2012 at  valuation (down from ). Despite this, Snapchat recovered and went public at .',
    faqs: [
      { question: 'How common are down rounds?', answer: '10-15% in normal markets, 30%+ in downturns.' },
      { question: 'What happens to employee options in a down round?', answer: 'Options become underwater. Companies often reprice.' },
      { question: 'Can a company recover from a down round?', answer: 'Yes. Snapchat, Uber, and Palantir all recovered from down rounds.' },
    ],
    references: [
      'Feld, B., & Mendelson, J. (2016). Venture Deals. Wiley.',
      'Gurley, B. (2016). The Down Round. Above the Crowd.',
      'Rao, L. (2012). Snapchats Down Round. TechCrunch.',
    ],
    tags: ['down-round', 'valuation', 'dilution', 'venture-capital', 'funding'],
    icon: 'ArrowDownCircle',
    difficulty: 'Advanced',
    featured: false,
    popular: false,
    createdAt: '2025-02-15T00:00:00.000Z',
  },

  {
    id: 'startup-17',
    slug: 'cap-table',
    name: 'Cap Table',
    category: 'Startup',
    subcategory: 'Funding & Finance',
    definition:
      'A capitalization table (cap table) shows the complete ownership breakdown of a company, including common shares, preferred shares, options, warrants, convertible notes, and SAFEs. It tracks who owns what, at what price, and what percentage each stakeholder controls.',
    simpleExplanation:
      'A cap table is a list of everyone who owns a piece of your company and how much they own.',
    example:
      'A pre-seed cap table might show: Founder A owns 800,000 shares (40%), Founder B owns 800,000 (40%), an angel owns 200,000 (10%), and an option pool holds 200,000 (10%).',
    whyItMatters:
      'The cap table determines voting control, who gets paid first in an exit, and dilution impact. Mismanaged cap tables cause investor disputes and failed fundraising.',
    relatedTerms: ['dilution', 'option-pool', 'esop', 'vesting', 'Concept-sheet', 'founders-equity'],
    interviewQuestions: [
      'How do you build and maintain a cap table?',
      'What is the difference between basic and fully diluted shares?',
      'How does a new funding round affect the cap table?',
      'How do convertible notes and SAFEs appear on a cap table?',
    ],
    realCompanyExample:
      'When Facebook acquired Instagram for , the clean cap table with few shareholders made the acquisition smooth.',
    faqs: [
      { question: 'What software for cap table management?', answer: 'Carta, Pully, or LTSE Equity for complex cap tables.' },
      { question: 'Pre-money vs post-money valuation?', answer: 'Pre-money is value before investment. Post-money = pre-money + investment.' },
      { question: 'How often to update cap table?', answer: 'Every time any security is issued. Review at least quarterly.' },
      { question: 'What is fully diluted shares?', answer: 'All outstanding shares plus potential shares from options, warrants, and conversions.' },
      { question: 'Can cap table errors cause legal problems?', answer: 'Yes, errors have caused lawsuits and delayed acquisitions.' },
    ],
    references: [
      'Feld, B., & Mendelson, J. (2016). Venture Deals. Wiley.',
      'Carta. (2025). Cap Table Management Guide.',
      'WilmerHale. (2023). Startup Cap Table Best Practices.',
    ],
    tags: ['cap-table', 'capitalization-table', 'equity', 'ownership', 'dilution', 'startup-finance'],
    icon: 'Table',
    difficulty: 'Intermediate',
    featured: false,
    popular: true,
    createdAt: '2025-02-18T00:00:00.000Z',
  },
  {
    id: 'startup-18',
    slug: 'esop',
    name: 'ESOP (Employee Stock Option Plan)',
    category: 'Startup',
    subcategory: 'People & Culture',
    definition:
      'An ESOP grants employees the right to purchase shares at a predetermined price (strike price) after a vesting period. Used by startups to attract talent when they cannot offer competitive cash salaries. Options align employee and shareholder interests.',
    simpleExplanation:
      'An ESOP gives employees the right to buy company stock at a discount, so if the company succeeds, employees share the financial upside.',
    example:
      'A startup grants Engineer Alice 20,000 options at  strike price with 4-year vesting. If acquired at /share, her profit is ,000.',
    whyItMatters:
      'ESOPs are the primary wealth-creation mechanism for startup employees. Without them, startups could not compete with big companies for talent.',
    relatedTerms: ['vesting', 'cliff', 'option-pool', 'cap-table', 'dilution', 'founders-equity'],
    interviewQuestions: [
      'How would you structure an ESOP for a 50-person startup?',
      'What is the difference between ISOs and NSOs?',
      'How do ESOPs affect the cap table?',
      'What happens to employee options in an acquisition?',
    ],
    realCompanyExample:
      'When Google went public in 2004, its ESOP created hundreds of millionaires among early employees.',
    faqs: [
      { question: 'Difference between ISOs and NSOs?', answer: 'ISOs get favorable tax treatment but more restrictions. NSOs are simpler.' },
      { question: 'What happens to options if I leave?', answer: '90 days to exercise vested options, then they revert to the company.' },
      { question: 'How many options for early employee?', answer: '0.5-2% for early engineers at pre-seed stage.' },
      { question: 'What is an option pool?', answer: 'Reserve of shares for future grants, typically 10-20% of fully diluted shares.' },
    ],
    references: [
      'Feld, B., & Mendelson, J. (2016). Venture Deals. Wiley.',
      'Carta. (2025). ESOP Best Practices Guide.',
      'National Center for Employee Ownership. (2025). ESOP Basics.',
    ],
    tags: ['esop', 'stock-options', 'equity', 'compensation', 'startup', 'employees'],
    icon: 'Gift',
    difficulty: 'Intermediate',
    featured: false,
    popular: true,
    createdAt: '2025-02-20T00:00:00.000Z',
  },
  {
    id: 'startup-20',
    slug: 'ipo',
    name: 'IPO (Initial Public Offering)',
    category: 'Startup',
    subcategory: 'Funding & Finance',
    definition:
      'An IPO is the process by which a private company sells shares to the public for the first time. It involves hiring investment banks, filing with the SEC, conducting a roadshow, and listing on an exchange like NYSE or NASDAQ. Provides liquidity for all shareholders.',
    simpleExplanation:
      'An IPO is when a private company sells shares to the public for the first time on the stock market.',
    example:
      'Snowflakes 2020 IPO was the largest software IPO ever. Priced at , opened at , raising .4 billion.',
    whyItMatters:
      'IPO is the ultimate validation of a business model. It provides liquidity, raises capital, and creates currency for acquisitions.',
    relatedTerms: ['exit-strategy', 'acquisition', 'secondary-offering', 'valuation', 'venture-capital'],
    interviewQuestions: [
      'What is the process of taking a company public?',
      'How do investment banks help with an IPO?',
      'What are the pros and cons of going public?',
      'How is the IPO price determined?',
      'What is a lock-up period?',
    ],
    realCompanyExample:
      'Airbnb went public in December 2020 at /share. Shares opened at , giving a + market cap.',
    faqs: [
      { question: 'How long does the IPO process take?', answer: '6-12 months from decision to trading.' },
      { question: 'What is a SPAC IPO?', answer: 'A blank check company that raises money to acquire a private company.' },
      { question: 'What is a direct listing?', answer: 'Existing shareholders sell directly without underwriters. Spotify did this.' },
      { question: 'What is underpricing?', answer: 'IPO price set below market demand causing first-day pop. Average is 15-18%.' },
    ],
    references: [
      'Ritter, J. (2024). IPO Data. University of Florida.',
      'SEC. (2025). Going Public: A Guide for Entrepreneurs.',
      'Goldstein, M. (2020). Snowflakes Record IPO. Bloomberg.',
    ],
    tags: ['ipo', 'initial-public-offering', 'exit-strategy', 'public-company', 'stock-market'],
    icon: 'Landmark',
    difficulty: 'Advanced',
    featured: true,
    popular: true,
    createdAt: '2025-02-25T00:00:00.000Z',
  },
  {
    id: 'startup-21',
    slug: 'due-diligence',
    name: 'Due Diligence',
    category: 'Startup',
    subcategory: 'Legal & Compliance',
    definition:
      'Due diligence is a comprehensive investigation of a startup by potential investors or acquirers covering financials, legal, IP, contracts, employees, regulatory compliance, and technology. Can last weeks to months and involves lawyers, accountants, and industry experts.',
    simpleExplanation:
      'Due diligence is the thorough check investors do before putting money into a company.',
    example:
      'When Microsoft acquired GitHub for .5B in 2018, due diligence reviewed code repositories, user data, security, financials, and IP.',
    whyItMatters:
      'Due diligence protects investors from decisions based on incomplete information. Can uncover fatal flaws or reveal risks needing deal structure changes.',
    relatedTerms: ['Concept-sheet', 'valuation', 'audit', 'legal', 'compliance', 'acquisition'],
    interviewQuestions: [
      'What are the key areas covered in due diligence?',
      'How do you prepare a startup for due diligence?',
      'What red flags might cause a deal to fail?',
      'What is the role of lawyers in due diligence?',
    ],
    sharkTankExample:
      'Sharks conduct informal due diligence. Kevin OLeary backed out of a deal after due diligence revealed sales claim discrepancies.',
    realCompanyExample:
      'Verizon discovered two massive Yahoo data breaches during due diligence and negotiated a  discount on the .48B purchase price.',
    faqs: [
      { question: 'What documents are needed?', answer: 'Financials, tax returns, cap table, contracts, IP registrations, board minutes.' },
      { question: 'Legal vs financial vs technical due diligence?', answer: 'Legal checks contracts/IP. Financial audits revenue. Technical evaluates code/security.' },
      { question: 'Can a startup fail due diligence?', answer: 'Yes, due to inaccurate financials, IP disputes, or regulatory violations.' },
    ],
    references: [
      'Feld, B., & Mendelson, J. (2016). Venture Deals. Wiley.',
      'Sjostrom, W. K. (2021). Legal Due Diligence in M&A. Harvard Law School.',
      'PwC. (2024). Due Diligence Best Practices Guide.',
    ],
    tags: ['due-diligence', 'investor', 'legal', 'audit', 'compliance', 'acquisition'],
    icon: 'SearchCheck',
    difficulty: 'Intermediate',
    featured: false,
    popular: true,
    createdAt: '2025-02-28T00:00:00.000Z',
  },
  {
    id: 'startup-22',
    slug: 'tam',
    name: 'TAM (Total Addressable Market)',
    category: 'Startup',
    subcategory: 'Market Analysis',
    definition:
      'Total Addressable Market (TAM) is the total market demand for a product or service - the maximum revenue if a company captured 100% of its target market. Calculated via top-down (industry data) or bottom-up (unit economics x potential customers) analysis.',
    simpleExplanation:
      'TAM is the total money a company could make if every potential customer bought its product.',
    example:
      'Ubers TAM includes not just the global taxi market () but all personal transportation including car ownership (-3 trillion).',
    whyItMatters:
      'TAM is the starting point for every investment thesis. VCs typically require + TAM. A startup in a  market has limited VC appeal.',
    relatedTerms: ['sam', 'som', 'market-sizing', 'addressable-market', 'market-segmentation'],
    interviewQuestions: [
      'How do you calculate TAM for a new market?',
      'What is the difference between top-down and bottom-up TAM?',
      'Why is TAM important for VC investing?',
      'Can a startup succeed in a small TAM?',
    ],
    sharkTankExample:
      'Sharks frequently ask about market size. Ring pitched the  home security market, which excited them.',
    realCompanyExample:
      'Slack pitched itself in the enterprise productivity market () rather than the team messaging market, justifying a higher valuation.',
    faqs: [
      { question: 'Difference between TAM, SAM, SOM?', answer: 'TAM > SAM > SOM. TAM is total market, SAM is serviceable, SOM is obtainable.' },
      { question: 'What is a good TAM?', answer: '+ for VC-backed startups. -200M for bootstrapped.' },
      { question: 'Common TAM mistakes?', answer: 'Defining market too broadly, using outdated data, confusing customers with revenue.' },
    ],
    references: [
      'Blank, S. (2013). The Four Steps to the Epiphany. K&S Ranch.',
      'Moore, G. (2014). Crossing the Chasm. HarperBusiness.',
      'Kenton, W. (2024). Total Addressable Market. Investopedia.',
    ],
    tags: ['tam', 'total-addressable-market', 'market-sizing', 'valuation', 'investor'],
    icon: 'Globe2',
    difficulty: 'Intermediate',
    featured: false,
    popular: true,
    createdAt: '2025-03-01T00:00:00.000Z',
  },
  {
    id: 'startup-23',
    slug: 'sam',
    name: 'SAM (Serviceable Addressable Market)',
    category: 'Startup',
    subcategory: 'Market Analysis',
    definition:
      'Serviceable Addressable Market (SAM) is the portion of TAM that a companys products can actually address, considering geographic, regulatory, technical, and operational constraints. SAM is more realistic than TAM for business planning.',
    simpleExplanation:
      'SAM is the part of the total market your specific product could actually serve given your capabilities.',
    example:
      'A fintech startup in India: TAM = global payments (), SAM = Indian small business payments ().',
    whyItMatters:
      'SAM provides a realistic framework. While TAM shows the ceiling, SAM shows the plausible opportunity for near-Concept planning.',
    relatedTerms: ['tam', 'som', 'market-sizing', 'market-segmentation', 'go-to-market'],
    interviewQuestions: [
      'How do you calculate your SAM?',
      'What factors limit your SAM compared to TAM?',
      'How does SAM change as you expand?',
      'Why is SAM more important for operational planning?',
    ],
    realCompanyExample:
      'Zoom calculated its SAM as enterprise video conferencing in North America (~), allowing focused product optimization.',
    faqs: [
      { question: 'How is SAM different from TAM?', answer: 'TAM is total opportunity. SAM is what you can actually serve.' },
      { question: 'Should SAM or TAM be used in projections?', answer: 'SAM for near-Concept (1-3 years), TAM for long-Concept vision.' },
      { question: 'Can SAM expand over time?', answer: 'Yes, as you enter new geographies or develop new products.' },
    ],
    references: [
      'Collins, J. (2019). TAM, SAM, SOM: Market Sizing Explained. Medium.',
      'Moore, G. (2014). Crossing the Chasm. HarperBusiness.',
    ],
    tags: ['sam', 'serviceable-addressable-market', 'market-sizing', 'target-market', 'startup'],
    icon: 'Target',
    difficulty: 'Intermediate',
    featured: false,
    popular: false,
    createdAt: '2025-03-03T00:00:00.000Z',
  },
  {
    id: 'startup-24',
    slug: 'som',
    name: 'SOM (Serviceable Obtainable Market)',
    category: 'Startup',
    subcategory: 'Market Analysis',
    definition:
      'Serviceable Obtainable Market (SOM) is the portion of SAM a startup can realistically capture in the near Concept (1-3 years). Accounts for competition, brand recognition, sales capacity, and distribution channels. The most conservative market sizing metric.',
    simpleExplanation:
      'SOM is the slice of the market you can realistically capture in the next few years with your current resources.',
    example:
      'CRM startup: TAM = global CRM (), SAM = US small biz CRM (), SOM = Texas small biz CRM direct sales ().',
    whyItMatters:
      'SOM prevents unrealistic market share assumptions. Investors use SOM to sanity-check revenue projections.',
    relatedTerms: ['tam', 'sam', 'market-sizing', 'revenue-projection', 'go-to-market'],
    interviewQuestions: [
      'How do you calculate your SOM?',
      'What assumptions underpin your SOM projections?',
      'What factors could make your SOM larger or smaller?',
      'How do you validate your SOM is realistic?',
    ],
    realCompanyExample:
      'Tesla Model S SOM was early adopter luxury EV buyers in California (~-3B), guiding production volume and service center placement.',
    faqs: [
      { question: 'Why is SOM most important for early-stage?', answer: 'TAM is for vision, SAM for strategy, SOM for execution.' },
      { question: 'Realistic SOM percentage?', answer: '1-5% of SAM within 3 years.' },
      { question: 'Do investors care about SOM?', answer: 'Yes, it shows whether founders understand go-to-market reality.' },
    ],
    references: [
      'Collins, J. (2019). TAM, SAM, SOM: Market Sizing Explained. Medium.',
      'Kawasaki, G. (2015). The Art of the Start 2.0. Portfolio.',
      'Suster, M. (2013). Market Sizing for Startups. Both Sides of the Table.',
    ],
    tags: ['som', 'serviceable-obtainable-market', 'market-sizing', 'revenue', 'execution'],
    icon: 'Crosshair',
    difficulty: 'Intermediate',
    featured: false,
    popular: false,
    createdAt: '2025-03-05T00:00:00.000Z',
  },

  {
    id: 'startup-25',
    slug: 'accelerator',
    name: 'Accelerator',
    category: 'Startup',
    subcategory: 'Resources & Support',
    definition:
      'A startup accelerator is a fixed-Concept, cohort-based program offering seed funding, mentorship, education, and networking in exchange for equity (5-10%). Programs last 3-6 months and culminate in a demo day. Famous ones include Y Combinator, Techstars, and 500 Startups.',
    simpleExplanation:
      'An accelerator is a boot camp for startups providing money, mentorship, and connections in exchange for a small piece of your company.',
    example:
      'Airbnb went through Y Combinator in 2009, receiving ,000 for 6% equity and intensive mentoring that helped them focus on growth.',
    whyItMatters:
      'Accelerators reduce startup failure rates by providing structured guidance and powerful networks. YC alone has funded 4,000+ companies worth + combined.',
    relatedTerms: ['incubator', 'y-combinator', 'seed-funding', 'demo-day', 'mentorship'],
    interviewQuestions: [
      'What is the difference between an accelerator and an incubator?',
      'How do you choose the right accelerator?',
      'What is the typical accelerator application process?',
      'What are the pros and cons of joining an accelerator?',
    ],
    realCompanyExample:
      'Stripe went through Y Combinator in 2010, which helped simplify its product and focus on developer experience. Now one of the most valuable private companies.',
    faqs: [
      { question: 'How much equity do accelerators take?', answer: 'YC and Techstars take 6-10% for -.' },
      { question: 'What is acceptance rate for top accelerators?', answer: 'YC accepts 1-2%, Techstars ~1%.' },
      { question: 'Is an accelerator worth it for pre-revenue startups?', answer: 'Yes, for structure, mentorship, and initial funding.' },
    ],
    references: [
      'Y Combinator. (2025). YC Startup School.',
      'Techstars. (2024). Accelerator Program Guide.',
      'Cohen, S., & Hochberg, Y. V. (2014). Accelerating Startups.',
    ],
    tags: ['accelerator', 'startup-program', 'y-combinator', 'techstars', 'mentorship', 'seed-funding'],
    icon: 'Zap',
    difficulty: 'Beginner',
    featured: false,
    popular: true,
    createdAt: '2025-03-08T00:00:00.000Z',
  },
  {
    id: 'startup-26',
    slug: 'incubator',
    name: 'Incubator',
    category: 'Startup',
    subcategory: 'Resources & Support',
    definition:
      'A startup incubator provides resources like office space, mentorship, legal services, and investor access - typically without taking equity. Unlike accelerators, incubators have no fixed schedule or cohort structure. Startups can stay 1-3 years.',
    simpleExplanation:
      'An incubator is like a nursery for new businesses, providing workspace and support to help startups grow at their own pace.',
    example:
      'Dropbox was part of the MIT incubator while founder Drew Houston was a student, giving access to faculty advisors and legal resources.',
    whyItMatters:
      'Incubators provide a safe environment for earliest-stage ideas. Companies like Google (Stanford) and Microsoft (Harvard) began in incubators.',
    relatedTerms: ['accelerator', 'y-combinator', 'coworking', 'startup-ecosystem', 'innovation-hub'],
    interviewQuestions: [
      'How does an incubator differ from an accelerator?',
      'What types of startups benefit most from incubators?',
      'What services do incubators provide?',
      'How do incubators make money?',
    ],
    realCompanyExample:
      'Biolabs in Cambridge, MA provides shared lab space to biotech startups, dramatically reducing capital needs for early-stage research.',
    faqs: [
      { question: 'Main difference between incubator and accelerator?', answer: 'Incubators are open-ended with no fixed program. Accelerators are fixed-Concept, cohort-based.' },
      { question: 'Do incubators take equity?', answer: 'Some do (2-5%), but many university incubators are free.' },
      { question: 'How long can you stay in an incubator?', answer: '6-24 months typically.' },
    ],
    references: [
      'Hausberg, J. P., & Korreck, S. (2020). Business Incubators and Accelerators.',
      'Stanford StartX. (2025). Incubator Program Guide.',
    ],
    tags: ['incubator', 'startup-support', 'coworking', 'mentorship', 'entrepreneurship'],
    icon: 'Egg',
    difficulty: 'Beginner',
    featured: false,
    popular: false,
    createdAt: '2025-03-10T00:00:00.000Z',
  },
  {
    id: 'startup-27',
    slug: 'y-combinator',
    name: 'Y Combinator',
    category: 'Startup',
    subcategory: 'Resources & Support',
    definition:
      'Y Combinator (YC) is the most prestigious startup accelerator, founded in 2005. It provides seed funding, intensive mentorship, and a powerful alumni network. YC has funded 4,000+ companies including Airbnb, Stripe, Dropbox, DoorDash, and Reddit.',
    simpleExplanation:
      'Y Combinator is the worlds best startup accelerator that launched Airbnb, Dropbox, and many other famous companies.',
    example:
      'DoorDash was founded by Stanford students, accepted to YC in 2013. During the program they focused on growth, going from dozens to thousands of orders weekly.',
    whyItMatters:
      'YC has fundamentally changed startup funding. Its standardized terms and build-what-users-want philosophy are adopted worldwide.',
    relatedTerms: ['accelerator', 'seed-funding', 'safe', 'demo-day', 'paul-graham'],
    interviewQuestions: [
      'What makes YC different from other accelerators?',
      'What does YC look for in applications?',
      'How has YC changed the startup ecosystem?',
      'What is the YC application and interview process?',
    ],
    realCompanyExample:
      'Reddit was in YCs first batch in 2005. Founders built it during the program. Reddit went public in 2024 at a .4B valuation.',
    faqs: [
      { question: 'What is the YC application process?', answer: 'Online application, 10-minute interview. 1-2% acceptance rate.' },
      { question: 'How much funding does YC provide?', answer: ',000 for 7% equity as of 2025.' },
      { question: 'Do you need to be in Silicon Valley?', answer: 'YC is remote-friendly since 2020.' },
      { question: 'Can you apply multiple times?', answer: 'Yes, many successful companies were accepted on later attempts.' },
    ],
    references: [
      'Y Combinator. (2025). About Y Combinator.',
      'Graham, P. (2012). How Y Combinator Started. PaulGraham.com.',
      'Livingston, J. (2007). Founders at Work. Apress.',
    ],
    tags: ['y-combinator', 'accelerator', 'seed-funding', 'startup', 'paul-graham'],
    icon: 'Flame',
    difficulty: 'Beginner',
    featured: true,
    popular: true,
    createdAt: '2025-03-12T00:00:00.000Z',
  },
  {
    id: 'startup-30',
    slug: 'Concept-sheet',
    name: 'Concept Sheet',
    category: 'Startup',
    subcategory: 'Funding & Finance',
    definition:
      'A Concept sheet outlines the key terms and conditions of an investment offer. It covers valuation, investment amount, type of security, liquidation preferences, anti-dilution provisions, board composition, and vesting schedules. Non-binding except for exclusivity and confidentiality clauses.',
    simpleExplanation:
      'A Concept sheet is an investors offer letter listing the key terms of their investment.',
    example:
      'A Series A Concept sheet: Sequoia Capital investing  at  pre-money valuation with 1x liquidation preference and one board seat.',
    whyItMatters:
      'Concept sheet terms determine the economic and control structure. Founders who do not understand terms can give away far more than they realize.',
    relatedTerms: ['cap-table', 'dilution', 'liquidation-preference', 'anti-dilution', 'valuation'],
    interviewQuestions: [
      'What are the most important terms in a Concept sheet?',
      'What is a liquidation preference and how does it work?',
      'What is the difference between participating and non-participating preferred?',
      'How do anti-dilution provisions work?',
    ],
    sharkTankExample:
      'Kevin OLearys offers often demonstrate Concept sheet concepts. When he offers  for 25% plus royalty, he creates hybrid debt-equity terms.',
    realCompanyExample:
      'Mark Zuckerberg accepted Peter Thiels  Concept sheet with standard 1x liquidation preference and a board seat, setting precedent for all Facebook rounds.',
    faqs: [
      { question: 'Is a Concept sheet legally binding?', answer: 'Only exclusivity, confidentiality, and legal fee provisions.' },
      { question: 'What is a liquidation preference?', answer: 'Determines who gets paid first and how much in an exit.' },
      { question: 'What is anti-dilution protection?', answer: 'Protects investors from future down rounds by adjusting conversion price.' },
      { question: 'Should I hire a lawyer?', answer: 'Absolutely. Never sign without experienced startup counsel.' },
    ],
    references: [
      'Feld, B., & Mendelson, J. (2016). Venture Deals. Wiley.',
      'WilmerHale. (2024). Venture Capital Concept Sheet Guide.',
      'YC. (2025). Safe Primer.',
    ],
    tags: ['Concept-sheet', 'investment', 'venture-capital', 'legal', 'fundraising', 'negotiation'],
    icon: 'FileText',
    difficulty: 'Advanced',
    featured: false,
    popular: true,
    createdAt: '2025-03-20T00:00:00.000Z',
  },
  {
    id: 'startup-31',
    slug: 'founders-equity',
    name: 'Founders Equity',
    category: 'Startup',
    subcategory: 'People & Culture',
    definition:
      'Founders equity is the ownership stake founders hold in their company, typically common stock. It represents the financial reward for the risk and effort of building the business. How equity is split among co-founders is critical and can be a source of conflict.',
    simpleExplanation:
      'Founders equity is the percentage of the company that founders own - their share of the value they create.',
    example:
      'Larry Page and Sergey Brin split Google equity 50/50. After multiple funding rounds their stakes were diluted but still worth billions at IPO.',
    whyItMatters:
      'Founders equity is the most valuable asset most founders will ever create. Getting the split right is critical - unequal splits can cause resentment.',
    relatedTerms: ['co-founder', 'vesting', 'dilution', 'cap-table', 'esop', 'common-stock'],
    interviewQuestions: [
      'How would you split equity among co-founders?',
      'What happens to founders equity in a funding round?',
      'Should founders equity vest over time?',
      'What is the difference between founders shares and investor shares?',
    ],
    sharkTankExample:
      'Sharks frequently ask about equity split among co-founders to understand the team dynamic.',
    realCompanyExample:
      'Airbnb co-founders split equity unevenly reflecting their different roles: Chesky (CEO) got the largest share.',
    faqs: [
      { question: 'What is a fair equity split?', answer: 'Equal or slightly differentiated based on role, experience, and contribution.' },
      { question: 'Should founders equity vest?', answer: 'Yes, 4-year vesting with 1-year cliff is standard.' },
      { question: 'What happens to equity when raising VC?', answer: 'Founders equity is diluted in each round.' },
      { question: 'Can founders sell equity before exit?', answer: 'Yes, through secondary sales in later rounds.' },
    ],
    references: [
      'Feld, B., & Mendelson, J. (2016). Venture Deals. Wiley.',
      'Graham, P. (2006). How to Split Equity. PaulGraham.com.',
      'Wasserman, N. (2012). The Founders Dilemmas. Princeton University Press.',
    ],
    tags: ['founders-equity', 'co-founder', 'equity-split', 'startup', 'ownership'],
    icon: 'UserCheck',
    difficulty: 'Intermediate',
    featured: false,
    popular: true,
    createdAt: '2025-03-22T00:00:00.000Z',
  },
  {
    id: 'startup-33',
    slug: 'advisors',
    name: 'Advisors',
    category: 'Startup',
    subcategory: 'People & Culture',
    definition:
      'Advisors are experienced professionals who provide strategic guidance, industry connections, and credibility to startups in exchange for equity or cash. Unlike board members, they have no fiduciary duties or voting rights. Good advisors open doors to customers, partners, and investors.',
    simpleExplanation:
      'Advisors are experienced experts who give startups advice and introductions in exchange for a small piece of the company.',
    example:
      'Mark Cuban served as an advisor to several startups before becoming a Shark, providing sales strategy and distribution connections.',
    whyItMatters:
      'The right advisors accelerate startup trajectory with domain expertise and network access. Poorly chosen advisors waste time and dilute the cap table.',
    relatedTerms: ['board-of-directors', 'mentorship', 'startup-team', 'co-founder'],
    interviewQuestions: [
      'How do you choose the right advisors?',
      'What is standard equity compensation for advisors?',
      'How do you manage advisor relationships?',
      'What is the difference between an advisor and a board member?',
    ],
    realCompanyExample:
      'Google founders were advised by Andy Bechtolsheim (first check writer) and Eric Schmidt (later CEO).',
    faqs: [
      { question: 'How much equity for an advisor?', answer: '0.1-1% vested over 2 years with 3-6 month cliff.' },
      { question: 'How do I find good advisors?', answer: 'Accelerators, investor introductions, industry events.' },
      { question: 'Can I have too many advisors?', answer: 'Yes, more than 5 becomes unmanageable.' },
    ],
    references: [
      'Feld, B., & Mendelson, J. (2016). Venture Deals. Wiley.',
      'Horowitz, B. (2014). The Hard Thing About Hard Things. HarperBusiness.',
    ],
    tags: ['advisors', 'mentorship', 'startup-team', 'equity', 'guidance'],
    icon: 'UserPlus',
    difficulty: 'Intermediate',
    featured: false,
    popular: false,
    createdAt: '2025-03-28T00:00:00.000Z',
  },
  {
    id: 'startup-35',
    slug: 'vesting',
    name: 'Vesting',
    category: 'Startup',
    subcategory: 'People & Culture',
    definition:
      'Vesting is the process by which employees or founders earn their equity over time. Standard vesting is 4 years with a 1-year cliff. Vesting ensures equity is earned through continued contribution and protects the company if someone leaves early.',
    simpleExplanation:
      'Vesting means you earn your company shares gradually over time, so if you leave early you only keep what you have earned.',
    example:
      'Employee receives 4,800 options with 4-year vesting and 1-year cliff. After year 1: 1,200 vest. After year 2: another 1,200. If they leave at 18 months, they keep 1,200.',
    whyItMatters:
      'Vesting aligns incentives by ensuring equity is earned through sustained contribution. Without it, someone could join and leave immediately with full equity.',
    relatedTerms: ['cliff', 'esop', 'option-pool', 'founders-equity', 'dilution'],
    interviewQuestions: [
      'How does a standard vesting schedule work?',
      'What is the purpose of a vesting cliff?',
      'Can vesting be accelerated in an acquisition?',
      'What happens to unvested equity if terminated?',
    ],
    realCompanyExample:
      'Facebook had standard 4-year vesting. Employees who stayed 4+ years had fully vested options worth millions at IPO.',
    faqs: [
      { question: 'What is a typical vesting schedule?', answer: '4 years with 1-year cliff, monthly vesting after.' },
      { question: 'What is a cliff?', answer: 'Minimum period before any equity vests. Leave before cliff, get nothing.' },
      { question: 'Can vesting be accelerated?', answer: 'Yes. Single-trigger (on acquisition) or double-trigger (acquisition + termination).' },
      { question: 'Do founders have vesting?', answer: 'Yes, investors require founder vesting.' },
    ],
    references: [
      'Feld, B., & Mendelson, J. (2016). Venture Deals. Wiley.',
      'Carta. (2025). Equity Vesting Guide.',
      'YC Startup School. (2025). Understanding Vesting.',
    ],
    tags: ['vesting', 'equity', 'stock-options', 'compensation', 'startup', 'retention'],
    icon: 'Clock',
    difficulty: 'Intermediate',
    featured: false,
    popular: true,
    createdAt: '2025-04-03T00:00:00.000Z',
  },
  {
    id: 'startup-36',
    slug: 'cliff',
    name: 'Cliff',
    category: 'Startup',
    subcategory: 'People & Culture',
    definition:
      'A cliff is the initial period in a vesting schedule during which no equity vests. If the person leaves before the cliff ends, they forfeit all equity. Standard cliff is 12 months. After the cliff, vesting typically occurs monthly.',
    simpleExplanation:
      'A cliff is a probation period for your equity - if you leave before it ends, you get nothing.',
    example:
      'Employee has 4-year vesting with 1-year cliff. Leaves at 11 months: zero options. Leaves at 13 months: gets 25% (1 year) plus extra month.',
    whyItMatters:
      'The cliff prevents people from joining a startup, receiving equity, and leaving immediately. It ensures equity goes to committed team members.',
    relatedTerms: ['vesting', 'esop', 'option-pool', 'founders-equity', 'retention'],
    interviewQuestions: [
      'Why do startups use cliffs?',
      'How does a cliff protect the company?',
      'What is a typical cliff period?',
      'What happens to cliffed shares?',
    ],
    realCompanyExample:
      'Buffer experimented with different cliff structures and settled on standard 1-year cliff with monthly vesting after.',
    faqs: [
      { question: 'Why is standard cliff 12 months?', answer: 'Enough time to evaluate long-Concept fit. Aligns with annual review cycles.' },
      { question: 'Can cliff be less than 12 months?', answer: 'Yes, 6-month cliffs exist for senior hires.' },
      { question: 'Is cliff same as probation?', answer: 'Similar concept but cliff is about equity vesting, not employment.' },
    ],
    references: [
      'Feld, B., & Mendelson, J. (2016). Venture Deals. Wiley.',
      'Carta. (2025). Vesting Schedules Explained.',
    ],
    tags: ['cliff', 'vesting', 'equity', 'options', 'startup', 'compensation'],
    icon: 'TriangleAlert',
    difficulty: 'Intermediate',
    featured: false,
    popular: false,
    createdAt: '2025-04-05T00:00:00.000Z',
  },
  {
    id: 'startup-37',
    slug: 'burn-multiple',
    name: 'Burn Multiple',
    category: 'Startup',
    subcategory: 'Metrics & KPIs',
    definition:
      'Burn Multiple measures capital efficiency by dividing net cash burn by net new ARR added. A lower number indicates higher efficiency. 1x means  burned for  of new ARR. Became the key efficiency metric for SaaS post-2022.',
    simpleExplanation:
      'Burn Multiple shows how many dollars a startup burns to generate each dollar of new revenue - lower is better.',
    example:
      'A startup burns  in a quarter and adds  net new ARR = 3x burn multiple. If burn drops to .5M with same ARR = 1.5x.',
    whyItMatters:
      'Investors now prioritize companies with burn multiples under 2x. High burn multiples make fundraising difficult.',
    formula: 'Burn Multiple = Net Cash Burn / Net New ARR',
    formulaDescription: 'Net cash burn is total cash spent minus cash collected. Net new ARR is added minus churned revenue.',
    relatedTerms: ['growth-rate', 'arr', 'saas-metrics', 'runway', 'efficiency'],
    interviewQuestions: [
      'What is a good burn multiple for early-stage SaaS?',
      'How do you improve your burn multiple?',
      'Why has burn multiple become more important?',
      'How does burn multiple relate to the rule of 40?',
    ],
    realCompanyExample:
      'Zoom historically has one of the best burn multiples (<1x). Some 2021-era companies had 5-10x which became unsustainable.',
    faqs: [
      { question: 'What is a good burn multiple?', answer: 'Under 2x is good, under 1x is excellent.' },
      { question: 'Can burn multiple be negative?', answer: 'Yes, if company is cash flow positive.' },
      { question: 'How often to track?', answer: 'Monthly for startups, quarterly for established companies.' },
    ],
    references: [
      'Curry, D. (2022). The Burn Multiple. SaaStr.',
      'Kranz, G. (2024). SaaS Metrics Guide. KBCM.',
    ],
    tags: ['burn-multiple', 'efficiency', 'saas-metrics', 'cash-burn', 'growth-metrics'],
    icon: 'Flame',
    difficulty: 'Advanced',
    featured: false,
    popular: false,
    createdAt: '2025-04-08T00:00:00.000Z',
  },
  {
    id: 'startup-38',
    slug: 'growth-rate',
    name: 'Growth Rate',
    category: 'Startup',
    subcategory: 'Metrics & KPIs',
    definition:
      'Growth rate measures the percentage increase in a key metric (revenue, users, customers) over a specific period. For startups, it is the single most important metric after PMF. High-growth startups grow 100-500% per year. Investors use it to determine valuation multiples.',
    simpleExplanation:
      'Growth rate measures how fast your business is getting bigger - the key number investors care about most.',
    example:
      'Startup with  ARR at year start and  at year end: 200% YoY growth. Later-stage: 30-50% YoY is strong.',
    whyItMatters:
      'Growth rate is the primary driver of startup valuations. 100% YoY growth can command 10-20x ARR multiple; 20% growth gets 3-5x.',
    formula: 'Growth Rate (%) = ((Current - Previous) / Previous) x 100',
    formulaDescription: 'The percentage change in value from one period to the next.',
    relatedTerms: ['month-over-month-growth', 'year-over-year-growth', 'arr', 'saas-metrics', 'traction'],
    interviewQuestions: [
      'What is a good growth rate for different stages?',
      'How does growth rate affect valuation?',
      'What is the difference between MoM and YoY growth?',
      'How do you sustain growth as you scale?',
    ],
    realCompanyExample:
      'Slack grew from  to  ARR (year 1),  (year 2),  (year 3). Early growth exceeded 1000% YoY.',
    faqs: [
      { question: 'What is the rule of 40?', answer: 'Growth rate + profit margin should exceed 40%.' },
      { question: 'Good growth rate by stage?', answer: 'Seed: 100%+ YoY. Series A: 100%+. Series B: 70-100%. Public: 15-30%.' },
      { question: 'Can growth rate be too high?', answer: 'Hypergrowth can cause operational problems like culture dilution.' },
    ],
    references: [
      'Ellis, S. (2017). Hacking Growth. Crown Business.',
      'Suster, M. (2014). Growth Rate is the King. Both Sides of the Table.',
    ],
    tags: ['growth-rate', 'metrics', 'saas', 'startup-growth', 'kpi', 'revenue'],
    icon: 'TrendingUp',
    difficulty: 'Intermediate',
    featured: false,
    popular: true,
    createdAt: '2025-04-10T00:00:00.000Z',
  },
  {
    id: 'startup-39',
    slug: 'month-over-month-growth',
    name: 'Month-over-Month Growth',
    category: 'Startup',
    subcategory: 'Metrics & KPIs',
    definition:
      'Month-over-Month (MoM) growth measures the percentage change in a key metric from one month to the next. It is the most granular growth metric used by early-stage startups. Consistent positive MoM growth indicates product-market fit and sustainable acquisition.',
    simpleExplanation:
      'MoM growth shows how much your business grew this month compared to last month.',
    example:
      'Startup has 1,000 users in January and 1,300 in February: 30% MoM growth. If March has 1,560 users: 20% MoM growth.',
    whyItMatters:
      'MoM growth is the most sensitive indicator of traction. Investors look for 15-20%+ MoM growth in early-stage startups. As companies scale, MoM naturally decreases but should remain positive.',
    formula: 'MoM Growth (%) = ((Current Month - Previous Month) / Previous Month) x 100',
    formulaDescription: 'The percentage change in a metric from one month to the next.',
    relatedTerms: ['growth-rate', 'year-over-year-growth', 'traction', 'metrics'],
    interviewQuestions: [
      'What is a good MoM growth rate for an early-stage startup?',
      'How does MoM growth differ from YoY growth?',
      'What factors can cause MoM growth to decline?',
      'How do you project future growth from MoM trends?',
    ],
    realCompanyExample:
      'Facebook had 100,000 users in December 2004, growing to 5.5 million by December 2005. Their early MoM growth averaged 30-50% as they expanded across college campuses.',
    faqs: [
      { question: 'What is a good MoM growth rate?', answer: '15-20%+ is excellent for early-stage SaaS.' },
      { question: 'How is MoM different from YoY?', answer: 'MoM shows short-Concept trajectory, YoY shows annual trend. YoY smooths out seasonality.' },
      { question: 'When should you track MoM vs YoY?', answer: 'MoM for early-stage (high growth, less data). YoY for mature companies.' },
    ],
    references: [
      'Ellis, S. (2017). Hacking Growth. Crown Business.',
      'Skok, D. (2020). Startup Metrics. ForEntrepreneurs.',
    ],
    tags: ['month-over-month', 'mom-growth', 'growth-metrics', 'saas', 'traction'],
    icon: 'BarChart4',
    difficulty: 'Intermediate',
    featured: false,
    popular: false,
    createdAt: '2025-04-12T00:00:00.000Z',
  },
  {
    id: 'startup-40',
    slug: 'year-over-year-growth',
    name: 'Year-over-Year Growth',
    category: 'Startup',
    subcategory: 'Metrics & KPIs',
    definition:
      'Year-over-Year (YoY) growth measures the percentage change in a metric compared to the same period in the previous year. It is the standard growth metric for established companies and is used to evaluate long-Concept trends while accounting for seasonality.',
    simpleExplanation:
      'YoY growth shows how your business performed this year compared to the same time last year.',
    example:
      'A company had  revenue in Q1 2024 and  in Q1 2025: 30% YoY growth. This removes seasonal effects that MoM comparisons would include.',
    whyItMatters:
      'YoY is the most common growth metric reported in earnings and used by public market investors. It provides a clearer picture of sustainable growth by removing seasonal fluctuations.',
    formula: 'YoY Growth (%) = ((Current Year - Previous Year) / Previous Year) x 100',
    formulaDescription: 'The percentage change in a metric compared to the same period one year earlier.',
    relatedTerms: ['growth-rate', 'month-over-month-growth', 'arr', 'revenue-growth'],
    interviewQuestions: [
      'Why is YoY growth preferred over MoM for established companies?',
      'How does seasonality affect YoY comparisons?',
      'What is a good YoY growth rate for a public SaaS company?',
      'How do you project future YoY growth?',
    ],
    realCompanyExample:
      'Amazon has maintained 20-30% YoY revenue growth for over a decade, an exceptional feat given its + revenue base. This consistent YoY growth is why Amazon commands a premium valuation.',
    faqs: [
      { question: 'What is a good YoY growth rate?', answer: '100%+ for early-stage, 30-50% for growth stage, 15-30% for public companies.' },
      { question: 'How is YoY different from MoM?', answer: 'YoY compares same period last year, removing seasonality. MoM compares consecutive months.' },
      { question: 'Do investors prefer MoM or YoY?', answer: 'Both. MoM for early-stage trajectory, YoY for sustainable growth trend.' },
    ],
    references: [
      'Damodaran, A. (2012). Investment Valuation. Wiley.',
      'Skok, D. (2020). Startup Metrics. ForEntrepreneurs.',
    ],
    tags: ['year-over-year', 'yoy-growth', 'growth-metrics', 'saas', 'revenue', 'annual-growth'],
    icon: 'LineChart',
    difficulty: 'Intermediate',
    featured: false,
    popular: false,
    createdAt: '2025-04-15T00:00:00.000Z',
  },

  {
    id: 'startup-41',
    slug: 'viral-coefficient',
    name: 'Viral Coefficient',
    category: 'Startup',
    subcategory: 'Metrics & KPIs',
    definition:
      'The viral coefficient (k-factor) measures how many new users each existing user brings to a product. A k-factor above 1 means viral growth (each user brings more than one new user), enabling exponential organic growth. It is calculated by multiplying the number of invitations sent per user by the conversion rate of those invitations.',
    simpleExplanation:
      'The viral coefficient measures how many new customers each existing customer brings in - above 1 means the product grows by itself.',
    example:
      'If each Dropbox user invites 5 friends and 20% sign up, the viral coefficient is 5 x 0.2 = 1.0. Each user replaces themselves. If it were 1.2, Dropbox would grow exponentially without paid marketing.',
    whyItMatters:
      'Products with viral coefficients above 1 achieve exponential, self-sustaining growth. This is the holy grail of growth because it dramatically reduces customer acquisition costs. Products like WhatsApp, Facebook, and TikTok achieved massive scale through viral loops.',
    formula: 'Viral Coefficient (k) = Invitations Sent x Conversion Rate',
    formulaDescription: 'The number of invitations each user sends to others, multiplied by the percentage of recipients who convert to active users.',
    relatedTerms: ['network-effects', 'flywheel-effect', 'word-of-mouth', 'organic-growth', 'growth-hacking'],
    interviewQuestions: [
      'How do you calculate the viral coefficient?',
      'What is the difference between a viral coefficient above 1 vs below 1?',
      'How can you improve your viral coefficient?',
      'What products have the highest viral coefficients?',
      'What is the difference between viral and network effects?',
    ],
    sharkTankExample:
      'Products with viral potential excite Sharks because they reduce the need for marketing spend. Ring grew virally before Shark Tank as neighbors shared videos of package thieves.',
    realCompanyExample:
      'Hotmail had one of the most famous viral loops: every email sent included a Get your free Hotmail account link at the bottom. This simple viral mechanism grew Hotmail to 12 million users in 18 months, leading to a  acquisition by Microsoft.',
    faqs: [
      { question: 'What is a good viral coefficient?', answer: 'Above 1.0 means viral growth. Below 1.0 requires paid acquisition.' },
      { question: 'How do you increase viral coefficient?', answer: 'Simplify sharing, incentivize referrals, reduce friction in the invite flow.' },
      { question: 'What is the difference between viral and organic growth?', answer: 'Viral growth is exponential through user referrals. Organic growth is linear through search and word-of-mouth.' },
    ],
    references: [
      'Chen, A. (2014). The Viral Coefficient Explained. AndrewChen.co.',
      'Ellis, S. (2017). Hacking Growth. Crown Business.',
      'Nir, E. (2013). Hooked: How to Build Habit-Forming Products. Portfolio.',
    ],
    tags: ['viral-coefficient', 'k-factor', 'virality', 'growth', 'saas-metrics', 'user-acquisition'],
    icon: 'Share2',
    difficulty: 'Advanced',
    featured: false,
    popular: true,
    createdAt: '2025-04-18T00:00:00.000Z',
  },
  {
    id: 'startup-42',
    slug: 'network-effects',
    name: 'Network Effects',
    category: 'Startup',
    subcategory: 'Growth & Strategy',
    definition:
      'Network effects occur when a product or service becomes more valuable as more people use it. This creates a powerful competitive moat because users have an incentive to join the platform with the largest user base. Types include direct (Facebook), two-sided (Uber), data (Waze), and platform (iOS) network effects.',
    simpleExplanation:
      'Network effects mean your product gets better and more valuable every time a new person joins.',
    example:
      'Facebook becomes more valuable with each new user because there are more people to connect with. Uber becomes more valuable with more drivers (faster pickups) and more riders (more earning opportunities for drivers).',
    whyItMatters:
      'Network effects create the strongest competitive advantage in business. Companies with strong network effects are hard to displace because users have high switching costs. This is why Facebook beat MySpace and why Uber dominates ride-sharing despite many competitors.',
    formula: undefined,
    formulaDescription: undefined,
    relatedTerms: ['viral-coefficient', 'flywheel-effect', 'moat', 'competitive-advantage', 'platform'],
    interviewQuestions: [
      'What are the different types of network effects?',
      'How do network effects create a competitive moat?',
      'What is the cold start problem and how do you overcome it?',
      'Can network effects be negative?',
      'How do you measure network effects?',
    ],
    sharkTankExample:
      'The Sharks love businesses with network effects. When Uber was pitched, the two-sided network effect (more drivers = faster pickups = more riders = more drivers) was a key reason investors were excited.',
    realCompanyExample:
      'Airbnb demonstrates strong cross-side network effects: more listings attract more travelers, which attracts more hosts to list properties. By 2024, Airbnb had 8 million listings globally, creating an insurmountable lead over competitors like Vrbo.',
    faqs: [
      { question: 'What is the cold start problem?', answer: 'The challenge of getting initial users when the product has no value without users. Overcome by seeding supply (e.g., Airbnb photographed initial listings themselves).' },
      { question: 'What are negative network effects?', answer: 'When more users degrade the experience. Example: too many users on a dating app make it harder to find matches. Congestion in ride-sharing raises prices.' },
      { question: 'How do you measure network effects?', answer: 'By correlating user growth with engagement, retention, and willingness to pay. Strong network effects show increasing per-user value as the network grows.' },
    ],
    references: [
      'Parker, G., Van Alstyne, M., & Choudary, S. P. (2016). Platform Revolution. W.W. Norton.',
      'Chen, A. (2016). Network Effects. NFX.',
      'Rochet, J. C., & Tirole, J. (2003). Platform Competition in Two-Sided Markets. Journal of the European Economic Association.',
    ],
    tags: ['network-effects', 'platform', 'moat', 'competitive-advantage', 'growth', 'marketplace'],
    icon: 'ShareNetwork',
    difficulty: 'Intermediate',
    featured: false,
    popular: true,
    createdAt: '2025-04-20T00:00:00.000Z',
  },
  {
    id: 'startup-43',
    slug: 'flywheel-effect',
    name: 'Flywheel Effect',
    category: 'Startup',
    subcategory: 'Growth & Strategy',
    definition:
      'The flywheel effect describes how small wins compound over time to create powerful momentum in a business. Coined by Jim Collins in Good to Great, the concept compares business growth to a heavy flywheel: initial pushes are difficult, but as momentum builds, each push adds more energy, eventually creating unstoppable force.',
    simpleExplanation:
      'The flywheel effect means that early hard work builds momentum that makes everything easier over time, like pushing a heavy wheel that eventually spins on its own.',
    example:
      'Amazons flywheel: Lower prices attract more customers. More customers attract more sellers. More sellers improve selection and reduce costs. Lower costs enable even lower prices. The cycle repeats, gaining momentum.',
    whyItMatters:
      'Understanding the flywheel helps startups identify their virtuous cycles and invest in activities that compound. Instead of chasing one-time growth hacks, they build systems that generate self-reinforcing momentum.',
    formula: undefined,
    formulaDescription: undefined,
    relatedTerms: ['network-effects', 'viral-coefficient', 'compound-growth', 'virtuous-cycle'],
    interviewQuestions: [
      'What is the flywheel effect and how does it apply to startups?',
      'What is Amazons flywheel and how does it work?',
      'How is a flywheel different from a funnel?',
      'How do you identify your companys flywheel?',
      'What activities should you invest in to accelerate the flywheel?',
    ],
    sharkTankExample:
      'The Sharks recognize flywheel dynamics in companies like Bombas: better product leads to more reviews, which leads to more sales, which funds more donations to homeless shelters, which creates positive brand sentiment, which drives more sales.',
    realCompanyExample:
      'Shopifys flywheel: More merchants create more variety, which attracts more buyers. More buyers attract more app developers. Better apps help merchants succeed, which attracts more merchants. Shopify grew from 1 million merchants in 2015 to 7.5 million in 2024 through this flywheel.',
    faqs: [
      { question: 'How is a flywheel different from a funnel?', answer: 'A funnel is linear and ends. A flywheel is circular and self-reinforcing. Funnels lose energy (leaks at each stage). Flywheels gain energy.' },
      { question: 'What are the components of a flywheel?', answer: 'The key virtuous cycles in your business model. For Amazon: price, selection, customer experience, traffic, sellers, cost structure.' },
      { question: 'How do you start a flywheel?', answer: 'Find the smallest cycle that can generate momentum. Focus on one virtuous loop before adding complexity.' },
    ],
    references: [
      'Collins, J. (2001). Good to Great. HarperBusiness.',
      'Collins, J. (2020). Turning the Flywheel. HarperBusiness.',
      'Baron, J. (2019). The Flywheel Effect in SaaS. SaaS Capital.',
    ],
    tags: ['flywheel-effect', 'compounding', 'growth-strategy', 'business-model', 'momentum'],
    icon: 'RefreshCw',
    difficulty: 'Intermediate',
    featured: false,
    popular: true,
    createdAt: '2025-04-22T00:00:00.000Z',
  },
  {
    id: 'startup-44',
    slug: 'product-led-growth',
    name: 'Product-Led Growth',
    category: 'Startup',
    subcategory: 'Growth & Strategy',
    definition:
      'Product-Led Growth (PLG) is a go-to-market strategy where the product itself drives customer acquisition, retention, and expansion. Instead of sales teams and marketing campaigns, users discover, try, and buy the product directly. Key PLG tactics include freemium models, self-serve signups, viral loops within the product, and usage-based pricing.',
    simpleExplanation:
      'Product-Led Growth means your product sells itself - users can sign up, try, and buy without ever talking to a salesperson.',
    example:
      'Slack offers a free version with limited features. Teams start using it organically within a company, then upgrade to paid when they need more. The product experience drives conversion, not a sales demo.',
    whyItMatters:
      'PLG companies grow faster and more efficiently than sales-led competitors. They have lower customer acquisition costs, faster sales cycles, and higher net revenue retention. By 2024, the majority of SaaS unicorns (Slack, Zoom, Atlassian, Canva) are PLG companies.',
    formula: undefined,
    formulaDescription: undefined,
    relatedTerms: ['sales-led-growth', 'freemium', 'self-serve', 'viral-coefficient', 'growth-hacking'],
    interviewQuestions: [
      'What is the difference between product-led and sales-led growth?',
      'What metrics do PLG companies track?',
      'How do you monetize a PLG product?',
      'When should a company transition from PLG to adding a sales team?',
      'What products are best suited for PLG?',
    ],
    sharkTankExample:
      'Products with PLG potential are attractive to Sharks because they can scale without large sales teams. Ring demonstrated PLG potential as users bought the product and shared videos, driving organic acquisition.',
    realCompanyExample:
      'Calendly is a pure PLG company. Users sign up for free, discover value, and invite colleagues who also start using it. Companies upgrade to paid plans as usage grows. Calendly reached + ARR with no sales team and minimal marketing spend.',
    faqs: [
      { question: 'What is the difference between PLG and freemium?', answer: 'Freemium is a pricing model (free + paid tiers). PLG is a broader strategy where the product drives acquisition, retention, and expansion. Freemium is often part of PLG.' },
      { question: 'What metrics do PLG companies track?', answer: 'Time to value, activation rate, self-serve conversion rate, viral coefficient, net revenue retention, and product-qualified leads.' },
      { question: 'When should PLG companies add a sales team?', answer: 'When targeting enterprise customers with complex needs or high contract values. Many PLG companies add sales for accounts above - ARR.' },
    ],
    references: [
      'Wes, K. (2021). Product-Led Growth. ProductLed.',
      'Bushnell, B. (2020). Product-Led Growth for Dummies. OpenView.',
      'Hamlet, B. (2022). The Product-Led Playbook. ProductLed Academy.',
    ],
    tags: ['product-led-growth', 'plg', 'saas', 'growth-strategy', 'freemium', 'self-serve'],
    icon: 'Package',
    difficulty: 'Intermediate',
    featured: false,
    popular: true,
    createdAt: '2025-04-25T00:00:00.000Z',
  },
  {
    id: 'startup-45',
    slug: 'sales-led-growth',
    name: 'Sales-Led Growth',
    category: 'Startup',
    subcategory: 'Growth & Strategy',
    definition:
      'Sales-Led Growth (SLG) is a go-to-market strategy where outbound sales teams drive customer acquisition through demos, negotiations, and contract management. Common in enterprise SaaS where products are complex and high-priced. SLG requires sales development reps, account executives, customer success managers, and sales engineers.',
    simpleExplanation:
      'Sales-Led Growth means your company relies on a sales team to find customers, demo the product, and close deals.',
    example:
      'Salesforce uses a sales-led model: sales reps prospect companies, schedule demos, negotiate multi-year contracts, and manage relationships. The product is complex and expensive (+/user/month), requiring human explanation and negotiation.',
    whyItMatters:
      'Despite the rise of PLG, sales-led growth remains essential for enterprise products and high-value deals. Complex products with long sales cycles, multiple stakeholders, and significant implementation needs require human selling.',
    formula: undefined,
    formulaDescription: undefined,
    relatedTerms: ['product-led-growth', 'enterprise-sales', 'saas', 'sales-playbook'],
    interviewQuestions: [
      'When is sales-led growth the right strategy?',
      'What is the difference between SLG and PLG?',
      'How do you structure a sales team?',
      'What metrics matter most in SLG?',
      'How do you transition from PLG to SLG?',
    ],
    realCompanyExample:
      'Workday uses a pure SLG model for its HR and finance software. Deals average + with 6-12 month sales cycles involving CFOs and CHROs. Their enterprise sales reps are highly compensated and supported by extensive pre-sales engineering teams.',
    faqs: [
      { question: 'What is the difference between SLG and PLG?', answer: 'SLG uses human sales teams for acquisition. PLG relies on product experience. SLG is better for high-ACV complex products; PLG is better for low-ACV products.' },
      { question: 'What are key SLG metrics?', answer: 'CAC, LTV:CAC ratio, sales cycle length, win rate, quota attainment, pipeline velocity.' },
      { question: 'Can you combine SLG and PLG?', answer: 'Yes. Many companies use PLG for bottom-up adoption and SLG for enterprise expansion. This is called product-led sales.' },
    ],
    references: [
      'Dixon, M., & Adamson, B. (2011). The Challenger Sale. Portfolio.',
      'Rackham, N. (1988). SPIN Selling. McGraw-Hill.',
      'Miller, J. (2022). Sales-Led Growth. SalesHacker.',
    ],
    tags: ['sales-led-growth', 'slg', 'enterprise-sales', 'saas', 'b2b', 'sales-strategy'],
    icon: 'Handshake',
    difficulty: 'Intermediate',
    featured: false,
    popular: false,
    createdAt: '2025-04-28T00:00:00.000Z',
  },
]
