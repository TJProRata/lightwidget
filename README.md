# LightWidget - Multi-Tenant AI Chat Widget

A production-ready, embeddable AI chat widget with multi-tenant architecture, custom OpenAI key support, and comprehensive admin dashboard.

## 🚀 Features

### Widget Features
- **Iframe-based isolation** - Complete CSS/JS isolation from host page
- **Context-aware responses** - Reads webpage content for contextual AI answers
- **Customizable appearance** - Theme, position, and brand color customization
- **Async loading** - Non-blocking script loading for optimal performance
- **React + Convex powered** - Real-time database with TypeScript backend

### Multi-Tenant Architecture
- **Customer isolation** - Each customer has isolated data and API keys
- **Custom OpenAI keys** - Customers can use their own OpenAI API keys
- **Domain validation** - Wildcard domain support (*.example.com)
- **API key authentication** - Secure widget authentication per customer

### Admin Dashboard
- **Customer management** - Create, view, edit, and manage customers
- **Usage analytics** - Track queries by customer (total, today, 7d, 30d)
- **API key management** - View, copy, and regenerate API keys
- **Settings control** - Configure widget theme, position, and branding
- **Installation code** - Auto-generated embed code for each customer

## 📦 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion
- **Backend**: Convex (TypeScript)
- **AI**: OpenAI GPT-4
- **Deployment**: Vercel
- **Routing**: React Router

## 🛠️ Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Convex account (https://convex.dev)
- OpenAI API key (optional - customers can provide their own)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/TJProRata/lightwidget.git
cd lightwidget/website
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add:
```env
VITE_CONVEX_URL=https://your-convex-instance.convex.cloud
OPENAI_API_KEY=sk-your-openai-api-key-here
```

4. **Deploy Convex schema**
```bash
npx convex dev
```

5. **Start development server**
```bash
npm run dev
```

Visit http://localhost:3001

## 📝 Usage

### Creating a Test Customer

Run the customer creation script:
```bash
node scripts/createTestCustomer.js
```

This will output an API key like: `lw_xxxxxxxxxxxxx`

### Admin Dashboard

Access the admin dashboard at:
```
http://localhost:3001/admin
```

Features:
- View all customers
- Create new customers
- Manage API keys
- Configure OpenAI keys
- View usage analytics
- Copy installation code

### Customer Installation

Customers add this code to their website (before `</body>`):

```html
<!-- LightWidget Installation -->
<script>
  window.LightWidgetConfig = {
    apiKey: 'lw_your_api_key_here',
    position: 'bottom-center',
    theme: 'light'
  };
</script>
<script src="https://widget.lightwidget.com/loader.js" async></script>
```

## 🏗️ Build & Deploy

### Build for Production

```bash
# Build main app and widget
npm run build:all

# Or build separately
npm run build          # Main app
npm run build:widget   # Widget bundle
```

### Deploy to Vercel

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
npm run deploy
```

Or use the Vercel dashboard:
1. Import the GitHub repository
2. Configure environment variables
3. Deploy

### Environment Variables (Vercel)

Add these to your Vercel project:
- `VITE_CONVEX_URL` - Your Convex deployment URL
- `OPENAI_API_KEY` - Fallback OpenAI key (optional)

## 📂 Project Structure

```
website/
├── src/
│   ├── components/
│   │   └── ChatWidget2/          # Main widget component
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx     # Admin dashboard
│   │   │   └── CustomerDetail.jsx # Customer management
│   │   └── [other pages]
│   └── widget/
│       ├── index.js               # Widget entry point
│       └── loader.js              # Async loader script
├── convex/
│   ├── customers.ts               # Customer management
│   ├── auth.ts                    # API key validation
│   ├── messages.ts                # Message storage
│   ├── webpage.ts                 # Webpage content
│   ├── analytics.ts               # Usage analytics
│   └── openai.ts                  # OpenAI integration
├── scripts/
│   └── createTestCustomer.js     # Test customer creation
├── vite.config.js                 # Main app config
├── vite.config.widget.js         # Widget build config
└── vercel.json                    # Vercel configuration
```

## 🔧 Configuration

### Widget Configuration Options

```javascript
window.LightWidgetConfig = {
  apiKey: 'lw_xxxxx',           // Required: Customer API key
  position: 'bottom-center',     // Position on page
  theme: 'light',                // 'light' or 'dark'
  brandColor: '#C081FF'          // Brand color (hex)
};
```

### Position Options
- `bottom-left`
- `bottom-center`
- `bottom-right`
- `top-left`
- `top-center`
- `top-right`

## 📊 Database Schema

### Customers Table
```typescript
{
  customerId: string;
  apiKey: string;
  openaiApiKey: string;
  domain: string;
  isActive: boolean;
  plan: string;
  createdAt: number;
  settings: {
    theme: string;
    position: string;
    brandColor: string;
  };
}
```

### Messages Table
```typescript
{
  query: string;
  answer: string;
  userId: string;
  customerId: string;
  sessionId: string;
  timestamp: number;
  sequenceNumber: number;
  conversationPath: string;
}
```

## 🔐 Security

- API keys use `lw_` prefix with 32 random characters
- Domain validation with wildcard support
- Customer data isolation via `customerId`
- Iframe isolation for widget security
- CORS headers properly configured
- Customer OpenAI keys stored securely

## 📈 Analytics

Track customer usage via the admin dashboard:
- Total queries (all-time)
- Queries today
- Queries last 7 days
- Queries last 30 days

## 🐛 Troubleshooting

### Widget not loading
1. Check API key is valid
2. Verify domain matches customer configuration
3. Check browser console for errors
4. Ensure CORS headers are configured

### OpenAI errors
1. Verify customer has configured OpenAI key
2. Check fallback OpenAI key in environment
3. Verify OpenAI API key has credits

### Admin dashboard not accessible
1. Navigate to `/admin` route
2. Check Convex connection
3. Verify database has customer data

## 📄 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📧 Support

For issues and questions:
- GitHub Issues: https://github.com/TJProRata/lightwidget/issues

## 🎯 Roadmap

- [ ] Customer self-service portal
- [ ] Advanced analytics with charts
- [ ] Admin authentication system
- [ ] Webhook notifications
- [ ] Custom AI model support
- [ ] Widget analytics dashboard
- [ ] A/B testing for widget variants
- [ ] Multi-language support

---

Built with ❤️ using React, Convex, and OpenAI