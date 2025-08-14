# Kenya Climate Resilience Dashboard (KCRD)

The Kenya Climate Resilience Data Hub is a web-based decision-support tool designed to empower Kenyan frontline decision-makers, policymakers, and community leaders with real-time, actionable environmental insights.

This platform directly addresses the Triple Planetary Crisis — Climate Change, Biodiversity Loss, and Pollution & Waste — by integrating data from public and institutional sources into an interactive, location-based interface.

Through predictive analytics, data visualizations, and risk alerts, the dashboard enables users to:

* Monitor climate trends across counties, sub-counties, and wards.
* Track pollution levels and emerging environmental threats.
* Receive location-specific actionable insights for immediate intervention.
* Support long-term climate adaptation and environmental resilience strategies.

## 🏗️ Architecture

This project follows a **microservices architecture** with the following components:

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend API**: Node.js/Express.js REST API
- **Data Processor**: Background service for data ingestion and processing
- **Database**: PostgreSQL with PostGIS for spatial data
- **Cache**: Redis for session and data caching
- **Reverse Proxy**: Nginx for load balancing and SSL termination
- **Monitoring**: Prometheus and Grafana for observability

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Kenya-Resilience-Data-Hub-Team-18-Climate-Champs
   ```

2. **Copy environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start with Docker Compose**
   ```bash
   # Build and start all services
   docker-compose up -d
   
   # View logs
   docker-compose logs -f
   
   # Stop services
   docker-compose down
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:8000
   - Grafana: http://localhost:3001 (admin/admin)
   - Prometheus: http://localhost:9090

### Development Setup (Without Docker)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up database**
   ```bash
   # Start PostgreSQL and Redis
   docker-compose up postgres redis -d
   
   # Run database migrations
   npm run db:migrate
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Dashboard page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── dashboard/         # Dashboard-specific components
│   │   ├── layout/            # Layout components
│   │   ├── ui/                # Reusable UI components
│   │   └── providers/         # Context providers
│   ├── lib/                   # Utility functions
│   ├── types/                 # TypeScript type definitions
│   └── services/              # API services
├── services/                  # Microservices
│   ├── api/                   # Backend API service
│   └── data-processor/        # Data processing service
├── monitoring/                # Monitoring configuration
├── nginx/                     # Nginx configuration
├── docker-compose.yml         # Docker services
├── Dockerfile                 # Frontend Dockerfile
└── package.json               # Dependencies
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript check

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage

# Docker
npm run docker:build     # Build Docker image
npm run docker:run       # Run Docker container
npm run docker:compose   # Start with Docker Compose
```

### Code Quality

The project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Husky** for git hooks
- **Jest** for testing

### Database Schema

The database includes tables for:
- Users and authentication
- Regions (counties, sub-counties, wards)
- Climate data (temperature, rainfall, air quality)
- Alerts and notifications
- Insights and recommendations
- Reports and analytics
- Data sources

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```

2. **Set environment variables in Vercel dashboard**

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Docker Deployment

1. **Build images**
   ```bash
   docker-compose build
   ```

2. **Deploy to production**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## 📊 Monitoring

The application includes comprehensive monitoring:

- **Prometheus**: Metrics collection
- **Grafana**: Dashboards and visualization
- **Health checks**: Service health monitoring
- **Logging**: Structured logging with Winston

## 🔧 Configuration

### Environment Variables

Key environment variables:

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# Redis
REDIS_URL=redis://host:port

# Authentication
NEXTAUTH_SECRET=your-secret
JWT_SECRET=your-jwt-secret

# External APIs
OPENWEATHER_API_KEY=your-key
GOOGLE_MAPS_API_KEY=your-key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Use conventional commits
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**Team 18 Climate Champs**

- Building climate resilience solutions for Kenya
- Empowering decision-makers with data-driven insights
- Addressing the Triple Planetary Crisis

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 CI/CD Pipeline

The project includes a comprehensive CI/CD pipeline with:

- **Automated testing** on pull requests
- **Code quality checks** (linting, type checking)
- **Security scanning** with Snyk
- **Docker image building** and pushing
- **Automated deployment** to staging and production
- **Performance testing** with Lighthouse CI

## 📈 Roadmap

- [ ] Real-time data integration
- [ ] Advanced analytics and ML models
- [ ] Mobile application
- [ ] API documentation
- [ ] User management system
- [ ] Advanced reporting features
- [ ] Integration with government systems
