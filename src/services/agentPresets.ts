import { AgentPreset } from '../types/agent';

export const AGENT_PRESETS: AgentPreset[] = [
  {
    id: 'freelancer-pro',
    name: 'Freelance Proposal & Code Deliverable Agent',
    category: 'freelance',
    tagline: 'Automates winning client proposals & builds production code deliverables',
    description: 'Scans high-ticket client job listings, crafts persuasive customized proposal bids, and automatically builds complete production-ready code deliverables (React UIs, Python scraper scripts, REST APIs) to complete client orders fast.',
    iconName: 'Briefcase',
    estimatedRoi: '$150 - $1,200 / client project',
    avgDeliveryTime: '45 seconds per proposal & code build',
    monetizationStrategy: 'Direct client contracts on Upwork, Fiverr Pro, Toptal, & Twitter/X DM outreach',
    defaultPrompt: 'Find high-budget web development or Python automation jobs, write a personalized proposal highlighting modern architecture, and auto-generate the complete working source code for the client request.',
    tools: ['Upwork Job Matcher', 'React/TS Code Synthesizer', 'Python Script Generator', 'Proposal Persuasion Engine'],
    suggestedTasks: [
      'Build a React & Tailwind Dashboard component for an e-commerce client ($350 budget)',
      'Write a Python Web Scraping & Data Pipeline script for real estate listings ($250 budget)',
      'Generate a Node.js REST API with JWT Auth and Supabase integration ($450 budget)'
    ],
    color: 'emerald'
  },
  {
    id: 'leadgen-master',
    name: 'B2B High-Ticket Lead Gen & Outreach Agent',
    category: 'leadgen',
    tagline: 'Discovers target business leads & generates personalized cold outreach',
    description: 'Mines targeted B2B decision makers (CEOs, CTOs, Agency Owners), extracts verified contact intelligence, enriches company profiles, and drafts high-converting 3-step cold email sequences tailored to their exact pain points.',
    iconName: 'Target',
    estimatedRoi: '$500 - $3,000 / closed retainer',
    avgDeliveryTime: '30 seconds per prospect cluster',
    monetizationStrategy: 'B2B Lead Generation Agency services, cold outreach automation for high-ticket services',
    defaultPrompt: 'Target B2B SaaS and digital agencies doing $10k-$100k/mo, identify decision maker contacts, enrich their tech stack details, and write personalized pain-point cold outreach email sequences.',
    tools: ['Prospect Email Miner', 'Company Tech Stack Analyzer', 'Cold Email Sequence Architect', 'Lead Score Calculator'],
    suggestedTasks: [
      'Extract 10 high-value B2B SaaS Leads looking to implement AI features + 3-step Email Sequence',
      'Find Dental & Healthcare practices needing modern online booking websites + Cold Call Scripts',
      'Mine E-commerce brands with slow loading speeds + Technical Audit & Offer Pitch'
    ],
    color: 'cyan'
  },
  {
    id: 'content-monetizer',
    name: 'Digital Content & Affiliate Growth Engine',
    category: 'content',
    tagline: 'Creates SEO-ranked articles, viral social threads, & affiliate reviews',
    description: 'Autonomous content strategist that performs keyword gap research, writes long-form SEO-optimized articles, constructs viral X/Twitter threads, creates LinkedIn carousels, and embeds high-converting affiliate product call-to-actions.',
    iconName: 'Sparkles',
    estimatedRoi: '$200 - $2,500 / month passive affiliate & ad revenue',
    avgDeliveryTime: '60 seconds per content package',
    monetizationStrategy: 'Affiliate marketing commissions (Amazon, Software SaaS), AdSense, paid newsletter subscriptions',
    defaultPrompt: 'Generate a top-ranking 2,000-word SEO article review of top AI productivity tools, complete with comparison tables, pros/cons, and affiliate link insertion placeholders.',
    tools: ['SEO Keyword Analyzer', 'Viral Thread Builder', 'Affiliate Link Injector', 'Markdown Article Generator'],
    suggestedTasks: [
      'Write a comprehensive "Top 7 AI Tools for Developers in 2026" SEO Article with comparison table',
      'Construct a 10-part Viral Twitter/X Thread explaining "How to Monetize AI Micro-SaaS"',
      'Generate a 5-day Email Nurture Sequence for selling a $47 Digital E-Book'
    ],
    color: 'violet'
  },
  {
    id: 'market-hunter',
    name: 'Market Intelligence & Micro-Niche Arbitrage Agent',
    category: 'arbitrage',
    tagline: 'Uncovers low-competition Micro-SaaS niches & e-commerce arbitrage',
    description: 'Scans market demand trends, Github trending repos, ProductHunt launches, and Amazon/Shopify sales rank data to identify low-competition, high-margin software & product opportunities before others.',
    iconName: 'TrendingUp',
    estimatedRoi: '$1,000 - $10,000 / micro-SaaS or product launch',
    avgDeliveryTime: '40 seconds per dossier report',
    monetizationStrategy: 'Building & launching Micro-SaaS tools, domain flipping, dropshipping price arbitrage',
    defaultPrompt: 'Identify 3 unserved software micro-niches in the developer/creator tool space with high search intent, low domain authority competition, and draft product specification blueprints.',
    tools: ['Market Demand Scanner', 'Competitor Gap Finder', 'Micro-SaaS Blueprint Generator', 'Pricing & Margin Calculator'],
    suggestedTasks: [
      'Scan micro-niche SaaS gaps in Chrome Extensions for Notion & Figma users',
      'Calculate e-commerce price arbitrage margin for trending tech accessories on Shopify vs Suppliers',
      'Generate a complete Product Requirement Document (PRD) for an AI PDF Summarizer SaaS'
    ],
    color: 'amber'
  }
];
