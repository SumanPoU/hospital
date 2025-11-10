# 🏥 Sunrise Hospital - Website Demo

A modern, full-stack hospital management system built with cutting-edge web technologies. This project demonstrates a complete patient-doctor-admin management platform with authentication, role-based access control, and real-time communication features.

**Live Demo:** [https://hospital-zeta-snowy.vercel.app/](https://hospital-zeta-snowy.vercel.app/)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Requirements](#system-requirements)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Build & Deployment](#build--deployment)
- [Test Credentials](#test-credentials)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

- 🔐 **Multi-Role Authentication**: User, Doctor, and Admin roles with JWT-based authentication
- 📱 **Responsive Design**: Fully responsive UI using Tailwind CSS
- ⚡ **Smooth Animations**: Powered by Framer Motion and GSAP
- 🎨 **Modern UI Components**: Built with shadcn/ui for consistent design
- 🔒 **Role-Based Access Control (RBAC)**: Secure endpoints and features based on user roles
- 📧 **Email Notifications**: SMTP integration for sending emails
- 📞 **SMS Integration**: Twilio integration for SMS notifications
- 🗄️ **PostgreSQL Database**: Managed with Prisma ORM
- 🚀 **Production Ready**: Optimized for performance and security

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) - React framework with App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - High-quality React components
- **Animations**: [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://gsap.com/) - Advanced animations

### Backend & Authentication
- **Next.js API Routes**: Serverless backend functions
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
- **JWT**: JSON Web Tokens for secure session management
- **Role-Based Access**: Custom middleware for RBAC

### Database & ORM
- **Database**: PostgreSQL
- **ORM**: [Prisma](https://www.prisma.io/) - Next-generation ORM

### External Services
- **Email**: SMTP (configurable with any email provider)
- **SMS**: [Twilio](https://www.twilio.com/) - SMS messaging service

---

## 💻 System Requirements

- **Node.js**: v18.0 or higher
- **npm**: v9.0 or higher 
- **PostgreSQL**: v12 or higher
- **Git**: For version control

---

## 📦 Installation & Setup

### Step 1: Clone the Repository

\`\`\`bash
git clone https://github.com/SumanPoU/sunrise-hospital.git
cd sunrise-hospital
\`\`\`

### Step 2: Install Dependencies

\`\`\`bash
npm install
\`\`\`

### Step 3: Set Up Environment Variables

Create a `.env.local` file in the root directory and add all required environment variables (see [Environment Variables](#environment-variables) section below).

\`\`\`bash
cp .env.example .env.local
# Then edit .env.local with your values
\`\`\`

### Step 4: Set Up the Database

Run Prisma migrations to set up your PostgreSQL database:

\`\`\`bash
npx prisma migrate dev --name init
\`\`\`

This will:
- Create all necessary tables in PostgreSQL
- Generate Prisma Client
- Seed the database with initial data (if configured)

### Step 5: Generate Prisma Client

\`\`\`bash
npx prisma generate
\`\`\`

---

## 🔑 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`env
# Database
DIRECT_URL=postgresql://user:password@localhost:5432/sunrise_hospital
DATABASE_URL=postgresql://user:password@localhost:5432/sunrise_hospital

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_WEBSITE_URL=http://localhost:3000
NEXT_PUBLIC_WEBSITE_NAME=Sunrise Hospital

# JWT Configuration
JWT_EXPIRES_IN=7d

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
CONTACT_RECEIVER_EMAIL=admin@sunrisehospital.com

# Twilio Configuration (SMS)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
\`\`\`

### Environment Variable Descriptions

| Variable | Description |
|----------|-------------|
| `DIRECT_URL` | Direct PostgreSQL connection URL |
| `DATABASE_URL` | Primary database connection URL |
| `NEXTAUTH_SECRET` | Secret key for NextAuth session encryption (generate: `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Base URL for NextAuth callback (use `http://localhost:3000` for local, your domain for production) |
| `NEXT_PUBLIC_API_URL` | Public API base URL for frontend requests |
| `NEXT_PUBLIC_WEBSITE_URL` | Website URL visible to frontend |
| `NEXT_PUBLIC_WEBSITE_NAME` | Hospital name |
| `JWT_EXPIRES_IN` | JWT token expiration time |
| `SMTP_*` | Email service credentials |
| `CONTACT_RECEIVER_EMAIL` | Email to receive contact form submissions |
| `TWILIO_*` | SMS service credentials |

---

## 🚀 Running the Project

### Development Mode

Start the development server with hot reload:

\`\`\`bash
npm run dev
\`\`\`

The application will be available at **http://localhost:3000**

### Production Build

Create an optimized production build:

\`\`\`bash
npm run build
\`\`\`

### Start Production Server

Run the application in production mode:

\`\`\`bash
npm start
\`\`\`

---

## 🔨 Build & Deployment

### Local Testing with Production Build

\`\`\`bash
# Create production build
npm run build

# Start production server
npm start

# Access at http://localhost:3000
\`\`\`

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project" and select your repository
4. Add all environment variables in Vercel settings
5. Click "Deploy"

\`\`\`bash
# Or deploy via CLI
npm i -g vercel
vercel
\`\`\`

### Deploy to Other Platforms

The project can be deployed to any platform supporting Node.js:
- Heroku
- Railway
- Render
- AWS
- DigitalOcean
- etc.

---

## 🔐 Test Credentials

Use these credentials to test different user roles:

### Patient Login
- **Email**: `acharyas186@gmail.com`
- **Password**: `123Example@#`
- **Role**: Patient
- **Access**: Patient dashboard, view appointments, medical history

### Doctor Login
- **Email**: `sumanacharyas186@gmail.com`
- **Password**: `123Example@#`
- **Role**: Doctor
- **Access**: Doctor dashboard, manage appointments, view patients

### Admin Login
- **Email**: `suman9815029324@gmail.com`
- **Password**: `123Example@#`
- **Role**: Administrator
- **Access**: Admin dashboard, manage users, view analytics, system settings

### Access Authentication Pages

- **Login Page**: [http://localhost:3000/auth?tab=login](http://localhost:3000/auth?tab=login)
- **Register Page**: [http://localhost:3000/auth?tab=register](http://localhost:3000/auth?tab=register)


---


## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 Support & Contact

For support, email acharyas186@gmail.com or open an issue on GitHub.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Vercel](https://vercel.com/) - Hosting and deployment
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Prisma](https://www.prisma.io/) - Database ORM
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [GSAP](https://gsap.com/) - Animation library
- [NextAuth.js](https://next-auth.js.org/) - Authentication

---

**Made with ❤️ by Suman Acharya**

Last Updated: 2025
