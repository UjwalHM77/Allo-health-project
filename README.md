# Allo Health - Advanced Healthcare Management System

A comprehensive, modern healthcare management system built with Next.js, TypeScript, and Tailwind CSS. This application provides a complete solution for clinic front desk operations with enhanced visuals, animations, and real-time analytics.

## 🏥 Features

### Core Functionality
- **Patient Management**: Complete patient records with medical history, allergies, and emergency contacts
- **Appointment Scheduling**: Advanced appointment booking with calendar integration
- **Queue Management**: Real-time queue monitoring with priority-based ordering
- **Doctor Management**: Comprehensive doctor profiles with availability tracking
- **Dashboard Analytics**: Interactive charts and statistics for clinic performance

### Enhanced Visual Features
- **Animated UI**: Smooth animations using Framer Motion
- **Interactive Charts**: Real-time data visualization with Chart.js
- **Responsive Design**: Mobile-first approach with beautiful UI/UX
- **Real-time Updates**: Live queue status and appointment tracking
- **Modern Design**: Clean, professional healthcare interface

### Technical Features
- **TypeScript**: Full type safety and better development experience
- **Next.js 14**: Latest React framework with App Router
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components
- **Framer Motion**: Smooth animations and transitions
- **Chart.js**: Interactive data visualization
- **Lucide React**: Beautiful icons

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd allo-health
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Database (MySQL + Prisma)

1. Copy `env.example` to `.env` and update `DATABASE_URL`.
2. Optional local DB: `docker compose up -d mysql`
3. Install Prisma: `npm i -D prisma` and `npm i @prisma/client`
4. Generate client: `npx prisma generate`
5. Create tables: `npx prisma migrate dev --name init`

API routes:
- `GET/POST /api/doctors`
- `GET/POST /api/patients`
- `GET/POST /api/appointments`

Pages `Book` and `Appointments` are wired to these APIs.

### Demo Credentials
- **Email**: admin@clinic.com
- **Password**: admin123

## 📊 Dashboard Features

### Enhanced Analytics
- **Patient Growth Charts**: Monthly registration trends
- **Appointment Distribution**: Weekly appointment statistics
- **Satisfaction Metrics**: Patient feedback visualization
- **Real-time Statistics**: Live updates with CountUp animations

### Interactive Components
- **Animated Cards**: Hover effects and smooth transitions
- **Progress Indicators**: Visual progress tracking
- **Status Badges**: Color-coded priority and status indicators
- **Quick Actions**: One-click access to main functions

## 🏗️ Project Structure

```
allo-health/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard page
│   ├── appointments/      # Appointment management
│   ├── queue/            # Queue management
│   ├── doctors/          # Doctor profiles
│   ├── patients/         # Patient records
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Login page
├── components/           # Reusable components
│   ├── layouts/          # Layout components
│   └── ui/              # UI components (shadcn/ui)
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
└── public/              # Static assets
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (#3B82F6 to #06B6D4)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Info**: Purple (#8B5CF6)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700
- **Sizes**: Responsive text scaling

### Components
- **Cards**: Elevated with hover effects
- **Buttons**: Gradient backgrounds with animations
- **Forms**: Clean, accessible input fields
- **Modals**: Smooth dialog transitions

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured dashboard experience
- **Tablet**: Optimized layout for touch interaction
- **Mobile**: Streamlined interface for on-the-go use

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_APP_NAME=MedFlow Clinic
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Tailwind Configuration
The project uses a custom Tailwind configuration with:
- Extended color palette
- Custom animations
- Responsive breakpoints
- Component-specific utilities

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository**
   - Push your code to GitHub
   - Connect to Vercel dashboard

2. **Configure build settings**
   ```bash
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

3. **Deploy**
   - Vercel will automatically deploy on push
   - Custom domain can be configured

### Netlify

1. **Build settings**
   ```bash
   Build command: npm run build
   Publish directory: .next
   ```

2. **Environment variables**
   - Add in Netlify dashboard
   - Configure redirects for Next.js

### Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and run**
   ```bash
   docker build -t medflow-clinic .
   docker run -p 3000:3000 medflow-clinic
   ```

## 🔒 Security Features

- **Authentication**: JWT-based session management
- **Input Validation**: Form validation with Zod
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Built-in Next.js protection

## 📈 Performance Optimization

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Built-in webpack analysis
- **Caching**: Static generation where possible

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 🔄 Updates

### Recent Enhancements
- ✅ Added comprehensive dashboard with charts
- ✅ Enhanced login page with animations
- ✅ Improved queue management with real-time updates
- ✅ Added patient and doctor management
- ✅ Implemented appointment scheduling
- ✅ Added responsive design improvements

### Planned Features
- 🔄 Patient portal integration
- 🔄 Telemedicine capabilities
- 🔄 Advanced reporting
- 🔄 Multi-language support
- 🔄 Mobile app companion

## 🏆 Acknowledgments

- **shadcn/ui** for beautiful components
- **Framer Motion** for smooth animations
- **Chart.js** for data visualization
- **Lucide React** for icons
- **Tailwind CSS** for styling

---

**MedFlow Clinic** - Transforming healthcare management with modern technology. 