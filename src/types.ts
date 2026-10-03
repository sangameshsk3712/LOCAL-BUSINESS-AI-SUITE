export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  systemInstruction: string;
  template: string;
  temperature: number;
  variables: string[];
  createdAt: string;
}

export interface ApiKeyStatus {
  configured: boolean;
  keySnippet: string | null;
  authType?: string;
  migrated?: boolean;
  cloudRunReady?: boolean;
  rejectionNotice?: string | null;
}

export interface ProductionCheckReport {
  check1_credentials: {
    verified: boolean;
    authType: string;
    migrated: boolean;
    cloudRunIsolated: boolean;
    keySnippet: string | null;
    legacyOAuthRejected: boolean;
    clientSideExposures: number;
    description: string;
  };
  check2_errorHandling: {
    verified: boolean;
    retryStrategy: string;
    targetStatusCodes: number[];
    maxRetryAttempts: number;
    baseDelayMs: number;
    backoffMultiplier: number;
    modelFailoverChain: string[];
    total429Caught: number;
    total503Caught: number;
    successfulRetries: number;
    description: string;
  };
  check3_apiCosts: {
    verified: boolean;
    monitorActive: boolean;
    totalRequests: number;
    requestsToday: number;
    totalTokens: number;
    promptTokens: number;
    candidateTokens: number;
    estimatedSpendUsd: number;
    estimatedSpendInr: number;
    budgetCeilingUsd: number;
    budgetAlertThresholdUsd: number;
    spendingAlertActive: boolean;
    budgetCeilingReached: boolean;
    currencyRates: { USD_TO_INR: number };
    pricingTier: string;
    recentRequests: {
      id: string;
      timestamp: string;
      feature: string;
      model: string;
      promptTokens: number;
      candidateTokens: number;
      totalTokens: number;
      costUsd: number;
      latencyMs: number;
      retries: number;
      status: string;
    }[];
  };
  timestamp: string;
  overallStatus: "READY_FOR_HIGH_SCALE_PRODUCTION" | "CONFIGURATION_REQUIRED";
}

export const CATEGORIES = [
  "Conversational AI",
  "Summarization",
  "Translation",
  "Code Generation",
  "Data Extraction",
  "Creative Content",
  "Instruction Following"
];

export interface LocationBranch {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  managerName: string;
  healthScore: number;
  monthlyReviews: number;
  positiveRatio: number;
  activeAlerts: number;
  googleMapsRank: number;
  whatsappNumber: string;
}

export interface BrandGuardrails {
  brandName: string;
  maxDiscountPercent: number;
  requiredDisclaimer: string;
  bannedPhrases: string[];
  approvedTone: string;
  escalationKeywords: string[];
}

export interface CrisisAlert {
  id: string;
  locationId: string;
  locationName: string;
  severity: "critical" | "warning" | "info";
  triggerKeyword: string;
  snippet: string;
  customerName: string;
  timestamp: string;
  status: "open" | "resolved" | "escalated";
}

export interface ProActivationData {
  planId: "starter" | "franchise" | "lifetime";
  planName: string;
  userContact: string;
  code: string;
  activatedAt: string;
  amount?: number;
}

export interface ActivationCodeRecord {
  code: string;
  planId: "starter" | "franchise" | "lifetime";
  planName: string;
  userContact: string;
  amount: number;
  utr?: string;
  status: "active" | "redeemed" | "revoked";
  createdAt: string;
  redeemedAt: string | null;
  redeemedBy: string | null;
  notes?: string;
}

export interface PaymentSubmission {
  id: string;
  userContact: string;
  utr: string;
  planId: "starter" | "franchise" | "lifetime";
  planName: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  generatedCode?: string;
}

// ==========================================
// 1. AI BUSINESS GROWTH AGENT INTERFACES
// ==========================================
export interface MarketingCalendarDay {
  day: number;
  theme: string;
  channel: "Instagram" | "WhatsApp" | "Google Maps" | "In-Store" | "Email" | "YouTube Shorts";
  action: string;
  visualIdea: string;
  callToAction: string;
}

export interface WeeklyActionItem {
  id: string;
  week: 1 | 2 | 3 | 4;
  task: string;
  priority: "High" | "Medium" | "Low";
  targetChannel: string;
  expectedOutcome: string;
  completed?: boolean;
}

export interface BudgetChannelAllocation {
  channel: string;
  percentage: number;
  recommendedAmount: number;
  targetCAC: string;
  expectedReturn: string;
}

export interface GrowthPlan {
  id: string;
  businessName: string;
  industry: string;
  location: string;
  targetCustomers: string;
  budget: number;
  currency: string;
  createdAt: string;
  executiveSummary: string;
  growthPhases: {
    phase1: { title: string; objective: string; tactics: string[] };
    phase2: { title: string; objective: string; tactics: string[] };
    phase3: { title: string; objective: string; tactics: string[] };
  };
  customerAcquisitionStrategy: {
    organic: string[];
    localPartnerships: string[];
    paidAdvertising: string[];
    retentionAndReferrals: string[];
  };
  budgetAllocation: BudgetChannelAllocation[];
  marketingCalendar: MarketingCalendarDay[];
  weeklyActionChecklist: WeeklyActionItem[];
}

// ==========================================
// 2. ALL-IN-ONE CONTENT STUDIO INTERFACES
// ==========================================
export type ContentBrandVoice =
  | "Warm & Community"
  | "High-End Luxury"
  | "Energetic & Bold"
  | "Quirky & Humorous"
  | "Direct Sales & Urgency"
  | "Executive Professional";

export type ContentLanguage =
  | "English"
  | "Hindi"
  | "Kannada"
  | "Telugu"
  | "Tamil"
  | "Marathi"
  | "Bengali"
  | "Spanish"
  | "Arabic";

export interface GeneratedContentSuite {
  instagramPost: {
    caption: string;
    hook: string;
    callToAction: string;
    visualDirection: string;
  };
  reelsScript: {
    hookDuration: string;
    hookScript: string;
    visualScene1: string;
    bodyDuration: string;
    bodyScript: string;
    visualScene2: string;
    callToActionScript: string;
    audioSuggestion: string;
  };
  youtubeShortsScript: {
    title: string;
    script: string;
    editingTips: string;
  };
  adCopy: {
    primaryText: string;
    headline: string;
    description: string;
    buttonCTA: string;
    targetAudienceSuggestions: string[];
  };
  productDescription: {
    catchyTitle: string;
    sensoryDescription: string;
    bulletHighlights: string[];
    guaranteeNote: string;
  };
  promotionalOffer: {
    offerName: string;
    promoCode: string;
    discountType: string;
    scarcityTrigger: string;
    whatsappReadyBlast: string;
  };
  hashtags: {
    highReach: string[];
    localNiche: string[];
    industrySpecific: string[];
  };
}

// ==========================================
// 3. BUSINESS ANALYTICS DASHBOARD INTERFACES
// ==========================================
export interface LeadRecord {
  id: string;
  customerName: string;
  contact: string; // phone or email
  source: "WhatsApp" | "Google Maps" | "Instagram" | "Walk-In" | "Website" | "Referral";
  estimatedValue: number;
  stage: "New" | "Contacted" | "Qualified" | "Closed-Won" | "Lost";
  notes: string;
  createdAt: string;
}

export interface SaleRecord {
  id: string;
  customerName: string;
  productOrService: string;
  amount: number;
  paymentMethod: "FamPay UPI" | "Cash" | "Card" | "Bank Transfer";
  date: string;
}

export interface CampaignExpenseRecord {
  id: string;
  campaignName: string;
  platform: "Google Ads" | "Meta / Instagram" | "Flyers / Print" | "WhatsApp Broadcast" | "Local Event";
  amountSpent: number;
  leadsGenerated: number;
  salesGenerated: number;
  date: string;
}

export interface AnalyticsAIInsight {
  headline: string;
  metricAnalyzed: string;
  diagnosis: string;
  actionableStep: string;
  projectedRevenueImpact: string;
  priority: "High" | "Medium" | "Opportunity";
}

// ==========================================
// 4. AI CUSTOMER SUPPORT AGENT INTERFACES
// ==========================================
export interface BusinessFaqItem {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Hours & Location" | "Pricing & Menu" | "Delivery & Takeout" | "Policies";
}

export interface ProductCatalogItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  inStock: boolean;
}

export interface SupportChatMessage {
  id: string;
  sender: "customer" | "ai" | "system";
  text: string;
  timestamp: string;
  isLeadCaptured?: boolean;
  leadData?: { name?: string; contact?: string };
  escalationRequired?: boolean;
}

// ==========================================
// 5. COMPETITOR & SEO INTELLIGENCE INTERFACES
// ==========================================
export interface CompetitorIntelReport {
  competitorName: string;
  competitorUrlOrAddress: string;
  pricingBenchmark: {
    relativePricing: "Cheaper" | "Comparable" | "More Expensive" | "Premium";
    analysis: string;
  };
  offeringsComparison: {
    feature: string;
    competitorStatus: string;
    yourStoreStatus: string;
    advantage: "You" | "Competitor" | "Tie";
  }[];
  competitorStrengths: string[];
  competitorWeaknesses: string[];
  keywordOpportunities: {
    keyword: string;
    searchIntent: "High Commercial" | "Local Discovery" | "Emergency / Urgent";
    difficulty: "Low" | "Medium" | "Hard";
    recommendedAction: string;
  }[];
  localSeoPrescriptions: {
    category: "Google Business Profile" | "Local Citations" | "On-Page Schema" | "Review Strategy";
    prescription: string;
    impact: "High" | "Medium";
  }[];
  transparencyNotice: {
    verifiedAttributes: string[];
    aiMarketEstimates: string[];
  };
}

// ==========================================
// 6. PRO & ENTERPRISE WORKSPACE INTERFACES
// ==========================================
export interface SavedWorkspaceProject {
  id: string;
  title: string;
  type: "Growth Plan" | "Content Suite" | "Analytics Snapshot" | "Competitor Audit" | "Support Transcript";
  data: any;
  createdAt: string;
  lastModified: string;
  author: string;
  tags: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  emailOrPhone: string;
  role: "Owner" | "Store Manager" | "Marketing Lead" | "Staff / Cashier";
  active: boolean;
  joinedAt: string;
}

export interface WorkspaceUsageQuota {
  aiMonthlyGenerationsUsed: number;
  aiMonthlyGenerationsLimit: number;
  whatsAppCreditsUsed: number;
  whatsAppCreditsLimit: number;
  savedProjectsCount: number;
  savedProjectsLimit: number;
  locationsCount: number;
  locationsLimit: number;
  teamMembersCount: number;
  teamMembersLimit: number;
}

export interface WorkspaceAccount {
  id: string;
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  role: string;
  plan: "Free Explorer" | "Starter Pro" | "Franchise Pro Growth" | "Enterprise Lifetime";
  isPro: boolean;
  memberSince: string;
}

export const INITIAL_LOCATIONS: LocationBranch[] = [
  {
    id: "loc-1",
    name: "Austin Flagship Bakery & Cafe",
    city: "Austin, TX",
    address: "1204 S Congress Ave, Austin, TX 78704",
    phone: "+1 (512) 555-0192",
    managerName: "Sarah Jenkins",
    healthScore: 98,
    monthlyReviews: 184,
    positiveRatio: 96,
    activeAlerts: 0,
    googleMapsRank: 1,
    whatsappNumber: "+15125550192"
  },
  {
    id: "loc-2",
    name: "Downtown Manhattan Espresso Bar",
    city: "New York, NY",
    address: "450 Lexington Ave, New York, NY 10017",
    phone: "+1 (212) 555-8834",
    managerName: "Marcus Vance",
    healthScore: 91,
    monthlyReviews: 320,
    positiveRatio: 89,
    activeAlerts: 1,
    googleMapsRank: 2,
    whatsappNumber: "+12125558834"
  },
  {
    id: "loc-3",
    name: "London Covent Garden Patisserie",
    city: "London, UK",
    address: "18 Floral St, London WC2E 9DS",
    phone: "+44 20 7946 0912",
    managerName: "Oliver Davies",
    healthScore: 95,
    monthlyReviews: 210,
    positiveRatio: 93,
    activeAlerts: 0,
    googleMapsRank: 1,
    whatsappNumber: "+442079460912"
  },
  {
    id: "loc-4",
    name: "Mumbai Bandra West Cafe & Bistro",
    city: "Mumbai, India",
    address: "Hill Road, Bandra West, Mumbai 400050",
    phone: "+91 98200 55123",
    managerName: "Aarav Sharma",
    healthScore: 97,
    monthlyReviews: 412,
    positiveRatio: 95,
    activeAlerts: 0,
    googleMapsRank: 1,
    whatsappNumber: "+919820055123"
  }
];

export const DEFAULT_GUARDRAILS: BrandGuardrails = {
  brandName: "Artisan Bakery & Hospitality Group",
  maxDiscountPercent: 25,
  requiredDisclaimer: "Offers valid at participating locations. Terms apply. Subject to daily stock availability.",
  bannedPhrases: ["cheap", "unlimited free", "competitor is bad", "guaranteed miracle", "lowest quality"],
  approvedTone: "Warm, refined, community-centric, and exceptionally courteous",
  escalationKeywords: ["food poisoning", "allergy", "lawsuit", "refund denied", "illness", "police", "harassment"]
};

export const INITIAL_CRISIS_ALERTS: CrisisAlert[] = [
  {
    id: "alert-1",
    locationId: "loc-2",
    locationName: "Downtown Manhattan Espresso Bar",
    severity: "warning",
    triggerKeyword: "refund denied",
    snippet: "Customer claimed they were double-billed on Monday morning pour-over and refund took 48 hours.",
    customerName: "David K. (Yelp 2-Star)",
    timestamp: "18 mins ago",
    status: "open"
  }
];

export const INITIAL_PROMPTS: PromptTemplate[] = [
  {
    id: "prompt-1",
    title: "Expert Code Explainer & Optimizer",
    description: "Explains code snippets step-by-step and recommends execution optimizations.",
    category: "Code Generation",
    systemInstruction: "You are a world-class senior software engineer and engineering educator. Explain the provided code clearly, using bullet points for key concepts. Finally, write a performance-optimized version of the code using standard best practices.",
    template: "Please explain the following code snippet:\n```{{language}}\n{{code}}\n```\n\nFocus on the complexity and any performance recommendations.",
    temperature: 0.3,
    variables: ["language", "code"],
    createdAt: "2026-06-17T08:00:00.000Z"
  },
  {
    id: "prompt-2",
    title: "Concise Article Summarizer",
    description: "Processes detailed texts and formats key takeaways in interactive bullets.",
    category: "Summarization",
    systemInstruction: "You are an analytical reading assistant. Your goal is to digest long articles into highly scannable summaries. Keep sentences crisp, use high-contrast formatting, and include a section of key actionable terms.",
    template: "Please summarize the article provided below:\n\n### Title: {{articleTitle}}\n\n### Content:\n{{articleContent}}\n\nProvide the summary in exactly 3 bullet points, followed by a 'Core Objective' tagline.",
    temperature: 0.5,
    variables: ["articleTitle", "articleContent"],
    createdAt: "2026-06-17T08:01:00.000Z"
  },
  {
    id: "prompt-3",
    title: "Few-Shot JSON Translator",
    description: "Translates human statements into structured JSON objects using few-shot guidelines.",
    category: "Data Extraction",
    systemInstruction: "You are a high-speed text parser. You parse natural language sentences into highly structured JSON formats. Output ONLY raw JSON. Do not include markdown codeblocks or explaining sentences.",
    template: "Convert the following statement into a valid JSON object:\nStatement: \"{{userStatement}}\"\n\nJSON Schema:\n{\n  \"action\": \"string (e.g. create, update, delete)\",\n  \"item\": \"string (e.g. task, meeting)\",\n  \"priority\": \"string (high, medium, low)\",\n  \"date\": \"string (YYYY-MM-DD or null)\"\n}",
    temperature: 0.1,
    variables: ["userStatement"],
    createdAt: "2026-06-17T08:02:00.000Z"
  },
  {
    id: "prompt-4",
    title: "Email Tone Translator",
    description: "Re-writes emails to fit casual, professional, or diplomatic criteria.",
    category: "Translation",
    systemInstruction: "You are a business communications expert. Rewrite the user's draft to shift the tone to be exceptionally {{targetTone}} while preserving the original intent, details, and core call-to-action.",
    template: "Original email message draft:\n\"{{draftMessage}}\"\n\nPlease rewrite this email to make it strictly {{targetTone}}.",
    temperature: 0.7,
    variables: ["draftMessage", "targetTone"],
    createdAt: "2026-06-17T08:03:00.000Z"
  }
];

// ==========================================
// 7. AI AGENT BUILDER INTERFACES
// ==========================================
export interface AgentTool {
  id: string;
  name: string;
  description: string;
  category: "communication" | "database" | "reporting" | "verification";
  enabled: boolean;
}

export interface AgentDefinition {
  id: string;
  name: string;
  description: string;
  triggerTask: string;
  systemInstructions: string;
  approvedTools: string[];
  temperature: number;
  status: "active" | "testing" | "draft";
  executionCount: number;
  createdAt: string;
}

export interface AgentExecutionLog {
  id: string;
  agentId: string;
  agentName: string;
  input: string;
  output: string;
  toolsUsed: string[];
  latencyMs: number;
  status: "success" | "warning" | "error";
  timestamp: string;
}

// ==========================================
// 8. SMART CRM & LEAD MANAGER INTERFACES
// ==========================================
export interface CrmContact {
  id: string;
  fullName: string;
  company?: string;
  phone: string;
  email: string;
  source: "WhatsApp" | "Google Maps" | "Website" | "Walk-In" | "Referral" | "Voice Call";
  status: "New Lead" | "Contacted" | "Qualified" | "Proposal Sent" | "Negotiation" | "Closed-Won" | "Lost";
  dealValue: number;
  currency: string;
  followUpDate: string;
  lastContactedDate: string;
  notes: string;
  priority: "High" | "Medium" | "Low";
  tags: string[];
}

export interface CrmInteraction {
  id: string;
  contactId: string;
  type: "WhatsApp" | "Phone Call" | "Email" | "Store Visit";
  summary: string;
  date: string;
  author: string;
}

export interface CrmFollowUpDraft {
  channel: "WhatsApp" | "Email";
  subject?: string;
  draftText: string;
  recommendedAction: string;
}

// ==========================================
// 9. MARKETING AUTOMATION CENTER INTERFACES
// ==========================================
export interface ScheduledPost {
  id: string;
  title: string;
  scheduledDate: string;
  scheduledTime: string;
  dayOfWeek: string;
  platforms: ("Instagram" | "Facebook" | "Google Business" | "WhatsApp Broadcast" | "LinkedIn" | "X")[];
  content: string;
  visualPrompt: string;
  status: "Scheduled" | "Published" | "Draft" | "Failed";
  webhookPayloadUrl?: string;
}

export interface MarketingIntegration {
  id: string;
  platform: "Instagram & Meta" | "Google Business Profile" | "WhatsApp Cloud API" | "LinkedIn" | "Zapier / Webhook";
  status: "Connected" | "Ready for Webhook" | "Disconnected";
  apiStatus: string;
  webhookUrl: string;
  lastSync: string;
}

// ==========================================
// 10. AI VOICE RECEPTIONIST INTERFACES
// ==========================================
export interface VoiceReceptionistConfig {
  businessName: string;
  greetingMessage: string;
  consentDisclaimer: string;
  voiceGender: "female" | "male";
  voiceSpeed: number;
  transferPhoneNumber: string;
  enableConsentRecording: boolean;
  telephonyProvider: "Twilio TwiML" | "Exotel Webhook" | "SIP WebRTC Trunk";
  webhookUrl: string;
}

export interface VoiceCallRecord {
  id: string;
  callerNumber: string;
  callerName: string;
  durationSec: number;
  timestamp: string;
  consentAcknowledged: boolean;
  intent: "Booking / Reservation" | "Menu & Hours FAQ" | "Pricing Inquiry" | "Human Escalation" | "General";
  leadCaptured: boolean;
  transferredToHuman: boolean;
  transcript: { speaker: "Caller" | "AI Receptionist"; text: string; time: string }[];
  summary: string;
}

// ==========================================
// 11. WORKSPACE AUDIT LOG & PERMISSIONS
// ==========================================
export interface WorkspaceAuditLog {
  id: string;
  action: string;
  user: string;
  role: string;
  ipOrOrigin: string;
  timestamp: string;
  details: string;
}

// ==========================================
// 12. BETA LAUNCH & USER TESTING
// ==========================================
export interface BetaTesterRecord {
  id: string;
  name: string;
  contact: string;
  businessName: string;
  inviteCode: string;
  status: "Invited" | "Active Tester" | "Feedback Submitted";
  assignedPlan: "Free Beta" | "Pro Trial (VIP)" | "Enterprise Partner";
  invitedAt: string;
  lastActiveAt?: string;
  notes?: string;
}

export interface FeedbackRecord {
  id: string;
  type: "bug" | "confusing_ui" | "slow_response" | "feature_request" | "general_praise";
  screen: string;
  rating: number; // 1-5
  title: string;
  description: string;
  userContact: string;
  reportedAt: string;
  status: "new" | "in_review" | "resolved" | "backlog";
  latencyMs?: number;
  browserMeta?: string;
}

export interface StressTestResult {
  concurrencyLevel: number;
  totalFired: number;
  successful: number;
  failed: number;
  minLatencyMs: number;
  medianLatencyMs: number;
  p95LatencyMs: number;
  maxLatencyMs: number;
  retried429Or503: number;
  totalTokensConsumed: number;
  throughputRps: number;
  cloudRunStatus: string;
  timestamp: string;
  details: {
    workerId: number;
    latencyMs: number;
    status: "success" | "retry_recovered" | "failed";
    retries: number;
    tokens: number;
  }[];
}

// ==============================================================
// ENTERPRISE ROADMAP PILLARS: BILLING, RBAC & ASYNC JOB QUEUE
// ==============================================================

export type SubscriptionTier = "basic" | "pro" | "enterprise";

export interface SubscriptionTierDetails {
  id: SubscriptionTier;
  name: string;
  pricePerMonthInr: number;
  period: "month" | "year";
  locationLimit: number | "unlimited";
  features: string[];
  recommendedFor: string;
  badge?: string;
  color: string;
}

export type PaymentGatewayProvider = "razorpay" | "phonepe" | "stripe";

export interface GatewayOrderRecord {
  orderId: string;
  gateway: PaymentGatewayProvider;
  tier: SubscriptionTier;
  amount: number;
  currency: string;
  status: "created" | "paid" | "failed" | "renewed";
  customerEmail: string;
  customerPhone: string;
  tenantId: string;
  createdAt: string;
  paidAt?: string;
  receiptNumber: string;
  subscriptionSchedule: {
    nextBillingDate: string;
    autoDebitEnabled: boolean;
    cardOrVpaLast4?: string;
  };
}

export interface DunningLogRecord {
  id: string;
  tenantId: string;
  businessName: string;
  customerContact: string;
  attemptNumber: number;
  channel: "whatsapp" | "sms" | "email";
  status: "sent" | "delivered" | "payment_recovered" | "grace_period";
  messageBody: string;
  timestamp: string;
  paymentLink: string;
  recoveredAmount?: number;
}

export type StaffRole = "owner" | "manager" | "cashier";

export interface StaffMember {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  avatarInitials: string;
  status: "active" | "invited" | "suspended";
  permissions: {
    canViewRevenue: boolean;
    canManageBilling: boolean;
    canEditSettings: boolean;
    canManageStaff: boolean;
    canReplyWhatsAppLeads: boolean;
    canDraftSocialPosts: boolean;
    canTriggerReviewQr: boolean;
    canExportCrm: boolean;
  };
  lastActive: string;
}

export interface TenantWorkspace {
  id: string;
  businessName: string;
  category: string;
  tier: SubscriptionTier;
  locationsCount: number;
  customDomain?: string;
  staffCount: number;
  activeSince: string;
  totalCrmLeads: number;
  totalReviewsGenerated: number;
  isolatedDbNamespace: string;
  settings: {
    allowManagerCampaigns: boolean;
    allowCashierQROnly: boolean;
    webhookSecret: string;
    autoDunningEnabled: boolean;
  };
}

export type JobType =
  | "GEOGRID_RADAR_CALC"
  | "VOICE_AUDIO_TRANSCRIPTION"
  | "LYRIA_MUSIC_GENERATION"
  | "WHATSAPP_BULK_BROADCAST"
  | "SUPERBRAIN_BATCH_CONSENSUS";

export type JobStatus = "queued" | "processing" | "completed" | "failed";

export interface BackgroundJobRecord {
  id: string;
  type: JobType;
  title: string;
  status: JobStatus;
  progressPercent: number; // 0-100
  workerNodeId: string;
  tenantId: string;
  queuedAt: string;
  startedAt?: string;
  completedAt?: string;
  etaSeconds: number;
  params: any;
  resultPayload?: any;
  executionLogs: string[];
}

export interface WorkerNodeMetrics {
  nodeId: string;
  name: string;
  status: "idle" | "processing" | "ready";
  currentJobId?: string;
  totalProcessedToday: number;
  memoryUsageMb: number;
  cpuLoadPercent: number;
  lastHeartbeat: string;
}

// 4. WhatsApp Business API Self-Serve Onboarding & Template Portal Types
export type WhatsAppConnectionStatus = "disconnected" | "connecting" | "verified" | "live";
export type WhatsAppTemplateStatus = "APPROVED" | "PENDING" | "REJECTED";
export type WhatsAppTemplateCategory = "MARKETING" | "UTILITY" | "AUTHENTICATION";

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: WhatsAppTemplateCategory;
  language: string;
  status: WhatsAppTemplateStatus;
  bodyText: string;
  sampleVariables: Record<string, string>;
  headerType?: "TEXT" | "IMAGE" | "DOCUMENT" | "NONE";
  callToActionLabel?: string;
  callToActionUrl?: string;
  quickReplyButtons?: string[];
  rejectionReason?: string;
  lastUpdated: string;
}

export interface WhatsAppOnboardingState {
  status: WhatsAppConnectionStatus;
  wabaId: string;
  phoneNumberId: string;
  displayPhoneNumber: string;
  businessName: string;
  verifiedName: string;
  qualityRating: "GREEN" | "YELLOW" | "RED";
  messagingTier: string;
  webhookCallbackUrl: string;
  webhookVerifyToken: string;
  connectedAt?: string;
}

// 5. Enterprise Analytics & Proof of ROI Types
export interface RoiLeadFunnelStep {
  stage: "Inquiries" | "AI Qualified" | "Store Walk-in / Booking" | "Closed Transaction";
  count: number;
  conversionPercent: number;
  totalValueInr: number;
}

export interface LocalSeoRankDelta {
  keyword: string;
  previousRank: number;
  currentRank: number;
  delta: number; // e.g. +12
  topRadiusKm: number;
  gridScore: number; // 0-100
  estimatedMonthlySearches: number;
}

export interface ProofOfRoiReport {
  periodMonth: string;
  storeName: string;
  city: string;
  totalInquiriesHandledByAI: number;
  qualifiedLeadsCount: number;
  closedSalesAttributable: number;
  totalAttributableRevenueInr: number;
  softwareCostInr: number;
  roiMultiple: string; // e.g. "14.8x"
  rankImprovements: LocalSeoRankDelta[];
  avgMapsRankBefore: number;
  avgMapsRankAfter: number;
  footfallGrowthPercent: string;
  generatedAt: string;
}

// 6. Institutional Due-Diligence Package (M&A Ready) Types
export interface DueDiligenceItem {
  id: string;
  category: "Corporate & IP" | "Technical Architecture" | "Security & Compliance" | "Financials & SaaS Metrics";
  title: string;
  status: "VERIFIED" | "IN_REVIEW" | "CERTIFIED";
  details: string;
  auditorNotes: string;
  evidenceRef: string;
}

export interface DueDiligencePackage {
  entityName: string;
  founderName: string;
  founderEmail: string;
  founderPhone: string;
  incorporationJurisdiction: string;
  ipAssignmentStatus: string;
  techStackSummary: string;
  encryptionStandard: string;
  complianceStandards: string[];
  mrrInr: number;
  arrInr: number;
  activeStoresCount: number;
  churnRatePercent: string;
  items: DueDiligenceItem[];
  lastAudited: string;
}

// Free Local SEO Audit Lead Magnet Types
export interface FreeSeoAuditLead {
  id: string;
  storeName: string;
  phone: string;
  city: string;
  category: string;
  healthScore: number;
  rankSummary: string;
  gridHeatmapScores: number[][]; // 5x5 numbers
  topOpportunities: string[];
  sentToWhatsApp: boolean;
  createdAt: string;
}

// 1. Targeted Meta & Google Ads Types
export interface AdCampaignCreative {
  id: string;
  platform: "Meta (Instagram/FB)" | "Google Local Ads" | "YouTube Shorts";
  title: string;
  targetAudience: string;
  comparisonHook: {
    leftLabel: string; // e.g. "Unanswered Phone Calls"
    leftCost: string; // e.g. "-₹45,000 Lost Revenue"
    leftTone: string;
    rightLabel: string; // e.g. "24/7 AI Voice Reception"
    rightGain: string; // e.g. "+100% Leads Captured Instantly"
    rightTone: string;
  };
  headlineText: string;
  primaryBody: string;
  callToAction: string;
  estimatedRoas: string; // e.g. "4.8x ROAS"
  budgetPerDayInr: number;
}

// 2. In-App Referral Program Types
export interface ReferralRecord {
  id: string;
  invitedStoreName: string;
  ownerContact: string;
  dateInvited: string;
  status: "joined" | "pending" | "subscribed";
  rewardClaimedInr: number;
  freeMonthsGranted: number;
}

export interface ReferralProgramState {
  referralCode: string;
  referralLink: string;
  totalEarningsInr: number;
  totalFreeMonthsEarned: number;
  activeReferralsCount: number;
  referralHistory: ReferralRecord[];
}

// 3. Agency & Reseller White-Label Types
export interface AgencyClientStore {
  id: string;
  storeName: string;
  city: string;
  plan: string;
  monthlySpendInr: number;
  agencyCommissionInr: number; // 30% rev-share
  status: "active" | "trial" | "churned";
}

export interface AgencyResellerState {
  agencyName: string;
  contactEmail: string;
  customDomain: string;
  brandPrimaryColor: string;
  revenueSharePercent: number; // e.g. 30%
  totalMonthlyEarningsInr: number;
  clients: AgencyClientStore[];
}

// 4. Point-of-Sale (POS) Integrations Types
export interface PosIntegrationSystem {
  id: string;
  name: string;
  logo: string;
  category: "Restaurant POS" | "Retail Billing" | "Payment Terminal";
  status: "connected" | "disconnected" | "syncing";
  lastSyncTime?: string;
  autoSendInvoiceWhatsApp: boolean;
  autoTriggerReviewLink: boolean;
  webhookEndpoint: string;
  apiKeySnippet: string;
  totalInvoicesProcessed: number;
}

export interface PosCheckoutEvent {
  billNumber: string;
  customerName: string;
  customerPhone: string;
  billAmount: number;
  storeName: string;
  itemsSummary: string;
  timestamp: string;
  whatsAppDelivered: boolean;
  reviewLinkTriggered: boolean;
}

// 5. Regional Franchise Chains Expansion Types
export interface FranchiseChainContract {
  id: string;
  brandName: string;
  operatorName: string;
  operatorPhone: string;
  cityClusters: string[];
  storesCount: number; // e.g. 5-20 locations
  basePricePerStoreInr: number;
  volumeDiscountPercent: number;
  totalMonthlyContractInr: number;
  annualValueInr: number;
  contractStatus: "ACTIVE_SLA" | "PROPOSAL_SENT" | "PILOT_TRIAL";
  brandGuardrailsSynced: boolean;
}

// 6. Third-Party Webhook & Developer API Gateway Types
export type WebhookTriggerEvent =
  | "lead.created"
  | "review.received"
  | "voice_call.completed"
  | "pos.bill_settled"
  | "payment.failed"
  | "appointment.booked"
  | "geogrid.scan_finished";

export interface WebhookEndpointConfig {
  id: string;
  name: string;
  targetUrl: string;
  connectorType: "Zapier" | "Make.com" | "Pabbly Connect" | "Custom CRM Endpoint" | "Google Sheets Webhook" | "Tally Prime XML" | "Zoho Books / CRM" | "Marg ERP" | "SAP B1";
  eventsSubscribed: WebhookTriggerEvent[];
  signingSecret: string;
  status: "active" | "paused" | "failing";
  totalDeliveries: number;
  successRatePercent: number;
  lastDeliveryTime?: string;
}

export interface WebhookDeliveryLog {
  id: string;
  endpointId: string;
  event: WebhookTriggerEvent;
  timestamp: string;
  statusCode: number;
  latencyMs: number;
  payloadSnippet: string;
  status: "delivered" | "retrying" | "failed";
}

export interface PublicApiKeyConfig {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
  lastUsedAt: string;
  rateLimitPerMin: number;
  scopes: string[];
  status: "active" | "revoked";
}

// 7. Dynamic QR Review Flyer Generator Types
export interface QrFlyerConfig {
  storeName: string;
  tagline: string;
  discountIncentive: string; // e.g. "Scan & Review for 10% Off Dessert"
  googleMapsReviewUrl: string;
  phoneContact: string;
  themeStyle: "Modern Obsidian" | "Warm Artisan Gold" | "Fresh Emerald" | "Royal Purple";
  showWifiPassword: boolean;
  wifiName?: string;
  wifiPassword?: string;
}

// 8. Legacy ERP Connector & Technical Assessment Types
export interface LegacyErpVoucherSync {
  voucherType: "Sales" | "Receipt" | "Journal" | "Payment";
  voucherNumber: string;
  date: string;
  partyLedgerName: string;
  amount: number;
  narration: string;
  gstin?: string;
  items?: { name: string; qty: number; rate: number; amount: number }[];
}

export interface AssessmentDimensionItem {
  id: number;
  name: string;
  rating: number; // e.g. 10, 9.5, 9, 8.5
  maxRating: 10;
  badge: string;
  category: "Architecture" | "Operations" | "Security" | "Growth" | "Ecosystem";
  technicalAssessment: string;
  keyMoats: string[];
  verifiedStatus: "Pass" | "Moat" | "Enterprise Benchmark";
  liveLatencyOrMetric: string;
}




