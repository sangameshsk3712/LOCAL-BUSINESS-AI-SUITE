# Deployment Guide

Step-by-step instructions for deploying Local Business AI Suite to production.

## Prerequisites

- Node.js 18+
- Google Gemini API key
- Deployment platform account (Google Cloud, Heroku, AWS, etc.)
- Git and GitHub account

## Environment Variables

Create a `.env` file with these required variables:

```env
# AI Configuration
GEMINI_API_KEY="your_gemini_api_key_here"
APP_URL="https://your-app-url.com"

# Server Configuration
PORT="3000"
NODE_ENV="production"

# Optional: Budget safeguards
GEMINI_BUDGET_CEILING_USD="50.00"
GEMINI_BUDGET_ALERT_USD="25.00"
```

## Deployment Options

### 1. Google Cloud Run (Recommended)

**Advantages:**
- Serverless (pay per request)
- Automatic scaling
- Built for Node.js apps
- $5.00/month free tier
- Easy GitHub integration

**Steps:**

1. Create a `Dockerfile`:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "run", "start"]
   ```

2. Deploy to Cloud Run:
   ```bash
   gcloud run deploy local-business-ai \
     --source . \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars GEMINI_API_KEY=$GEMINI_API_KEY,APP_URL=$APP_URL
   ```

3. Get your deployment URL:
   ```bash
   gcloud run services describe local-business-ai \
     --region us-central1 \
     --format='value(status.url)'
   ```

**Cost Estimation:**
- First 2 million requests/month: FREE
- After: $0.40 per 1 million requests
- CPU: $0.0000417 per vCPU-second
- Memory: $0.0000083 per GB-second
- Typical small business: $10-30/month

### 2. Heroku

**Advantages:**
- Simple git-based deployment
- Built-in PostgreSQL support
- Hobby tier: $5/month

**Steps:**

1. Install Heroku CLI:
   ```bash
   npm install -g heroku
   heroku login
   ```

2. Create a `Procfile`:
   ```
   web: npm run start
   ```

3. Deploy:
   ```bash
   heroku create local-business-ai
   heroku config:set GEMINI_API_KEY=$GEMINI_API_KEY
   git push heroku main
   ```

### 3. AWS (EC2 / Elastic Beanstalk)

**Steps:**

1. Create an EC2 instance (t3.micro = free tier)
2. SSH into instance
3. Install Node.js and PM2:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 18
   npm install -g pm2
   ```

4. Clone and deploy:
   ```bash
   git clone https://github.com/sangameshsk3712/LOCAL-BUSINESS-AI-SUITE.git
   cd LOCAL-BUSINESS-AI-SUITE
   npm install
   pm2 start npm --name "local-business-ai" -- start
   pm2 startup
   pm2 save
   ```

5. Set up reverse proxy (Nginx):
   ```bash
   sudo apt install nginx
   # Configure nginx to proxy to localhost:3000
   ```

### 4. Docker Compose (Local/VPS)

**Steps:**

1. Create `docker-compose.yml`:
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         NODE_ENV: production
         GEMINI_API_KEY: ${GEMINI_API_KEY}
         APP_URL: ${APP_URL}
       restart: always
   ```

2. Deploy:
   ```bash
   docker-compose up -d
   ```

### 5. Traditional Hosting (Shared/VPS)

**Steps:**

1. SSH into server
2. Install Node.js
3. Clone repository
4. Install dependencies: `npm install`
5. Build: `npm run build`
6. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start npm --name "app" -- start
   ```

7. Set up Nginx reverse proxy
8. Configure SSL with Let's Encrypt

## Post-Deployment

### 1. Health Check

```bash
curl https://your-app.com/api/production-check
```

Expected response:
```json
{
  "overallStatus": "READY_FOR_HIGH_SCALE_PRODUCTION"
}
```

### 2. Monitor Costs

```bash
curl https://your-app.com/api/monitoring/costs-and-resilience
```

### 3. Set Up Alerts

- Google Cloud: Set up budget alerts in Cloud Billing
- AWS: CloudWatch alarms
- Custom: Check `/monitoring/costs-and-resilience` periodically

### 4. Enable HTTPS

- **Cloud Run:** Automatic
- **Heroku:** Automatic
- **AWS EC2:** Use Let's Encrypt + Certbot
- **VPS:** Use Certbot or similar

### 5. Database Backup

Current implementation uses in-memory stores. For production:

```bash
# Add PostgreSQL connection
npm install pg dotenv
```

Then update `server.ts` to use database instead of in-memory storage.

## Scaling Considerations

### Vertical Scaling
- Increase machine memory/CPU
- Cloud Run: Automatic with traffic
- AWS: Upgrade EC2 instance type

### Horizontal Scaling
- Cloud Run: Automatic
- Heroku: Add dynos
- AWS: Use Auto Scaling Group

### Database Scaling
- Switch from in-memory to PostgreSQL
- Add read replicas for high traffic
- Implement caching layer (Redis)

## Security Checklist

- [ ] Environment variables are not in git
- [ ] API key is rotated regularly
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Error messages don't leak sensitive info
- [ ] Database is backed up
- [ ] Monitoring is active
- [ ] SSL certificate is valid
- [ ] Firewall rules restrict access appropriately

## Performance Optimization

### 1. Enable Caching

```bash
npm install redis
```

### 2. Compress Responses

```typescript
import compression from 'compression';
app.use(compression());
```

### 3. Use CDN

- Cloudflare (free tier)
- AWS CloudFront
- Google Cloud CDN

### 4. Database Optimization

- Add indexes
- Implement query caching
- Use connection pooling

## Monitoring & Logging

### Cloud Run
```bash
# View logs
gcloud run logs read local-business-ai --limit 50

# Real-time logs
gcloud run logs read local-business-ai --limit 50 --follow
```

### Application Insights

```bash
npm install applicationinsights
```

Add to `server.ts`:
```typescript
let appInsights = require("applicationinsights");
appInsights.setup().start();
```

### Custom Monitoring

Use built-in endpoints:
- `/api/production-check`
- `/api/monitoring/costs-and-resilience`

## Troubleshooting

### Issue: App crashes on startup

**Solution:**
```bash
# Check for TypeScript errors
npm run lint

# Check environment variables
echo $GEMINI_API_KEY
```

### Issue: High API costs

**Solution:**
```bash
# Check usage
curl https://your-app.com/api/monitoring/costs-and-resilience

# Reduce temperature/tokens
# Enable budget ceiling in .env
```

### Issue: Slow response times

**Solution:**
- Add caching layer
- Optimize database queries
- Upgrade machine size
- Enable compression

### Issue: Out of memory

**Solution:**
- Increase memory allocation
- Implement pagination for large datasets
- Clear old session data

## Backup & Recovery

### Backup Strategy

```bash
# Daily backup
0 0 * * * /path/to/backup.sh
```

### Restore from Backup

```bash
# Restore latest backup
./restore.sh latest
```

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: google-github-actions/setup-gcloud@v0
      - run: npm install && npm run build
      - run: gcloud run deploy local-business-ai --source .
```

## Support

- **Issues:** GitHub Issues
- **Email:** sangameshkhatge@gmail.com
- **Documentation:** See `README.md` and `docs/`

---

**Last Updated:** October 2026
