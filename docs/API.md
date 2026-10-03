# API Reference

Complete documentation of all Local Business AI Suite endpoints.

## Base URL

```
http://localhost:3000/api
```

## Authentication

All endpoints are currently publicly accessible. In production, add authentication headers:

```bash
Authorization: Bearer YOUR_API_KEY
```

## AI & Content Generation

### OmniBiz GPT - Business Strategy AI

**Endpoint:** `POST /chat/business-gpt`

**Request:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "How do I scale my restaurant from 1 to 5 locations?"
    }
  ],
  "mode": "scale_100cr",
  "temperature": 0.7
}
```

**Response:**
```json
{
  "reply": "Strategic analysis...",
  "modelUsed": "gemini-3.8-flash",
  "latencyMs": 1250,
  "tokensEstimated": 450
}
```

### Multi-Model SuperBrain AI

**Endpoint:** `POST /ai/omni-superbrain`

**Request:**
```json
{
  "prompt": "How should I market my new cafe?",
  "mode": "viral_launch",
  "activeEngines": ["gemini", "chatgpt", "nanobanana", "googleai"]
}
```

**Response:**
```json
{
  "success": true,
  "consensusReply": "Multi-model analysis...",
  "engineOutputs": {
    "gemini": { "name": "Google Gemini 3.8 Flash", "content": "..." },
    "chatgpt": { "name": "OpenAI ChatGPT-4o", "content": "..." },
    "nanobanana": { "name": "NanoBanana Neural Core", "content": "..." },
    "googleai": { "name": "Google AI Grounding Engine", "content": "..." }
  },
  "metrics": {
    "consensusScore": "99.6%",
    "totalEngines": 4,
    "orchestrationLatencyMs": 1800
  }
}
```

### Business Content Generation

**Endpoint:** `POST /business/generate`

**Types:**
- `review_responder` — AI-generated review responses
- `social_post` — Instagram/Facebook content
- `seo_optimizer` — Google Business optimization
- `customer_email` — Email campaign copy
- `whatsapp_formatter` — WhatsApp message formatting
- `geo_grid_booster` — Local SEO tactical recommendations

**Example Request:**
```json
{
  "type": "review_responder",
  "payload": {
    "businessName": "Royal Spice Cafe",
    "customerName": "Priya",
    "rating": 5,
    "reviewText": "Amazing food and service!",
    "tone": "Warm and appreciative"
  }
}
```

**Response:**
```json
{
  "result": "Thank you so much for the wonderful review...",
  "modelUsed": "gemini-3.8-flash"
}
```

### Content Studio - All-in-One Suite

**Endpoint:** `POST /content-studio/generate`

**Request:**
```json
{
  "topic": "Weekend Brunch Special",
  "brandVoice": "Warm & Community",
  "language": "English",
  "targetAudience": "Foodies & Weekend Brunch Lovers",
  "businessName": "Artisan Cafe",
  "industry": "Cafe & Brunch",
  "offerDetails": "Buy 2, Get 1 Free on Pastries"
}
```

**Response includes:**
- Instagram post with caption
- Reels script with timing
- YouTube Shorts script
- Ad copy for Meta/Google
- Product description with sensory appeal
- Promotional offer details
- Hashtag suggestions (high-reach, local, industry)

## CRM & Lead Management

### Generate AI Follow-up

**Endpoint:** `POST /crm/generate-followup`

**Request:**
```json
{
  "contact": {
    "fullName": "Rajesh Kumar",
    "company": "Kumar Enterprises",
    "status": "Warm Lead",
    "dealValue": 5000,
    "notes": "Interested in catering for 200-person event"
  },
  "channel": "WhatsApp",
  "businessName": "Royal Spice Catering"
}
```

**Response:**
```json
{
  "success": true,
  "draft": {
    "channel": "WhatsApp",
    "draftText": "Hi Rajesh! 👋 Following up on your catering inquiry...",
    "recommendedAction": "Send and follow up if no response in 24 hours"
  }
}
```

## Growth & Analytics

### AI Growth Agent

**Endpoint:** `POST /growth-agent/generate`

**Request:**
```json
{
  "businessName": "Local Bakery",
  "industry": "Bakery & Cafe",
  "location": "Downtown",
  "targetCustomers": "Office workers & families",
  "budget": 20000,
  "currency": "INR"
}
```

**Response includes:**
- Executive summary
- 3-phase growth plan (30-day breakdown)
- Customer acquisition strategy
- Budget allocation across channels
- Marketing calendar with daily actions
- Weekly action checklist

### Analytics AI Insights

**Endpoint:** `POST /analytics/ai-insights`

**Request:**
```json
{
  "businessName": "Local Cafe",
  "leads": [
    {
      "source": "WhatsApp",
      "stage": "Closed-Won",
      "amount": 2500
    }
  ],
  "sales": [
    { "amount": 45000 },
    { "amount": 35000 }
  ],
  "expenses": [
    { "campaignName": "Meta Ads", "amountSpent": 3000 }
  ]
}
```

**Response includes:**
- Key metrics summary (revenue, profit, CAC, ROI)
- AI-generated insights with business impact
- Actionable recommendations
- Projected revenue impact

### Connected Business Metrics

**Endpoint:** `GET /analytics/connected-metrics`

**Response includes:**
- Real campaign performance data
- Lead conversion funnel
- Before-and-after growth metrics
- Certified ROI and impact analysis

## Marketing Automation

### Generate Marketing Calendar

**Endpoint:** `POST /marketing-automation/generate-calendar`

**Request:**
```json
{
  "businessName": "Royal Spice Cafe",
  "industry": "Restaurant",
  "weeklyFocus": "Weekend Promotions"
}
```

**Response:**
Array of scheduled posts with:
- Day and time
- Platforms (Instagram, WhatsApp, Google Business)
- Content and visual direction
- Status tracking

## Audio & Voice

### Audio Transcription

**Endpoint:** `POST /audio/transcribe`

**Request:**
```json
{
  "audioData": "base64_encoded_audio",
  "mimeType": "audio/webm",
  "prompt": "Transcribe accurately with punctuation",
  "summarize": true
}
```

**Response:**
```json
{
  "transcript": "Full transcription text...",
  "modelUsed": "gemini-3.5-transcribe",
  "summary": "Executive summary...",
  "actionItems": ["Action 1", "Action 2"]
}
```

### AI Voice Receptionist

**Endpoint:** `POST /voice-receptionist/respond`

**Request:**
```json
{
  "callerMessage": "Hi, I'd like to book a table for 4 people tomorrow at 7 PM",
  "isFirstTurn": false,
  "config": {
    "businessName": "Royal Spice Cafe",
    "transferPhoneNumber": "8431107332"
  }
}
```

**Response:**
```json
{
  "success": true,
  "aiVoiceReply": "I'd be delighted to help with your reservation...",
  "intent": "Booking / Reservation",
  "leadCaptured": true,
  "leadData": { "phone": "+91 8431107332" },
  "transferToHuman": false
}
```

## Billing & Monetization

### Get Billing Tiers

**Endpoint:** `GET /billing/tiers`

**Response:**
```json
{
  "success": true,
  "tiers": [
    {
      "id": "basic",
      "name": "Basic Store Plan",
      "pricePerMonthInr": 1499,
      "locationsLimit": 1,
      "features": ["WhatsApp CRM", "Review Booster", "Social Post Generator"]
    },
    {
      "id": "pro",
      "name": "Pro Multi-Branch Plan",
      "pricePerMonthInr": 4999,
      "locationsLimit": 5,
      "features": ["Geo-Grid Radar", "Voice Receptionist", "OmniBiz Closer"]
    }
  ]
}
```

### Create Payment Order

**Endpoint:** `POST /billing/create-order`

**Request:**
```json
{
  "tierId": "pro",
  "gateway": "razorpay",
  "customerEmail": "owner@business.com",
  "customerPhone": "8431107332",
  "tenantId": "tenant-1"
}
```

## System & Health

### Production Readiness Check

**Endpoint:** `GET /production-check`

**Response includes:**
- Credentials verification status
- Error handling configuration
- API cost tracking and budgets
- Overall system readiness

### Monitoring - Costs & Resilience

**Endpoint:** `GET /monitoring/costs-and-resilience`

**Response includes:**
- Total API requests and token usage
- Estimated spend (USD/INR)
- Retry metrics (429, 503 catches)
- Recent request logs

## Error Handling

### Common Status Codes

| Code | Meaning |
|------|----------|
| 200 | Success |
| 202 | Accepted (async processing) |
| 400 | Bad request |
| 401 | Unauthorized / API key invalid |
| 402 | Payment required |
| 404 | Resource not found |
| 429 | Rate limited (auto-retry active) |
| 500 | Server error |
| 503 | Service unavailable (auto-retry active) |

### Error Response Format

```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human-readable error message"
}
```

## Rate Limiting

- No hard rate limits on most endpoints
- Automatic exponential backoff on 429 errors
- Gemini API budget safeguards to prevent bill shock
- Use `/monitoring/costs-and-resilience` to track usage

## Webhooks

### WhatsApp Incoming Messages

**Endpoint:** `POST /webhooks/whatsapp`

**Payload:**
```json
{
  "sender": "+918431107332",
  "message": "Hi, I'm interested in your services",
  "tenantId": "tenant-1"
}
```

**Response:**
```json
{
  "success": true,
  "status": "ACCEPTED_ASYNC",
  "jobId": "job-wa-123456"
}
```

## Best Practices

1. **Always include error handling** — APIs may timeout or rate-limit
2. **Use exponential backoff** — Built-in, but be aware
3. **Monitor costs** — Check `/monitoring/costs-and-resilience` regularly
4. **Cache responses** — Avoid duplicate AI calls for same input
5. **Validate inputs** — Client-side validation before API calls

## Support

- Issues: GitHub Issues
- Questions: GitHub Discussions
- Email: sangameshkhatge@gmail.com

---

**Last Updated:** October 2026
**API Version:** 1.0
