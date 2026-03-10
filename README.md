# 🚀 Sopon Islam — Next.js Portfolio v2.0

A modern, full-featured portfolio built with **Next.js 15**, **PostgreSQL**, **Prisma ORM**, **Better Auth**, **DaisyUI**, and **Framer Motion**.

## ✨ Features

- 🎨 **Beautiful UI** — Dark/Light theme, smooth animations, modern design
- 📊 **Admin Dashboard** — Full CMS to manage all portfolio content
- 🔐 **Role-Based Auth** — Admin vs User access control via Better Auth
- 🗄️ **PostgreSQL + Prisma** — Type-safe database with migrations
- 📱 **Fully Responsive** — Mobile-first design
- ⚡ **SSR + ISR** — Server-side rendering with Incremental Static Regeneration
- 🔍 **SEO Optimized** — OpenGraph, Twitter cards, sitemap-ready metadata
- 📧 **Contact Form** — With email notifications via Nodemailer
- 🎭 **Animations** — Framer Motion throughout
- 📦 **Type-Safe** — Full TypeScript

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15 (App Router) |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | Better Auth |
| Styling | Tailwind CSS v4 + DaisyUI v5 |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod |
| Theme | next-themes |
| Email | Nodemailer |
| Icons | Lucide React + React Icons |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (local or cloud like Neon, Supabase, Railway)
- Git

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Setup Environment

Copy the example env file:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://username:password@localhost:5432/portfolio_db"

# Better Auth secret (any random string, min 32 chars)
BETTER_AUTH_SECRET="your-super-secret-key-minimum-32-characters"
BETTER_AUTH_URL="http://localhost:3000"

# Email config (for contact form)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-gmail@gmail.com"
SMTP_PASS="your-gmail-app-password"  # See: https://myaccount.google.com/apppasswords
CONTACT_TO_EMAIL="your-email@gmail.com"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3️⃣ Setup Database

Generate Prisma client and push schema:

```bash
npm run db:push
```

Or use migrations:
```bash
npm run db:migrate
```

### 4️⃣ Seed Data

Populate the database with your portfolio content:

```bash
npm run db:seed
```

### 5️⃣ Create Admin User

```bash
npm run create-admin
```

Default admin credentials:
- **Email:** admin@sopon.dev
- **Password:** Admin@123456

⚠️ **Change these immediately after first login!**

You can customize admin credentials:
```bash
ADMIN_EMAIL="your@email.com" ADMIN_PASSWORD="YourPassword123" npm run create-admin
```

### 6️⃣ Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page (SSR)
│   ├── layout.tsx            # Root layout with metadata
│   ├── globals.css           # Global styles + animations
│   ├── auth/
│   │   ├── login/            # Login page
│   │   └── register/         # Register page
│   ├── admin/
│   │   ├── layout.tsx        # Admin sidebar layout
│   │   ├── page.tsx          # Dashboard overview
│   │   ├── hero/             # Edit hero section
│   │   ├── about/            # Edit about section
│   │   ├── skills/           # Manage skills
│   │   ├── projects/         # Manage projects
│   │   ├── messages/         # View contact messages
│   │   └── users/            # User management
│   └── api/
│       ├── auth/[...all]/    # Better Auth handler
│       ├── hero/             # Hero CRUD
│       ├── about/            # About CRUD
│       ├── skills/           # Skills CRUD
│       ├── projects/         # Projects CRUD
│       ├── contact/          # Contact form
│       ├── messages/         # Messages (admin only)
│       └── seed/             # Database seeder
├── components/
│   ├── layout/               # Navbar, Footer
│   ├── sections/             # Hero, About, Skills, Projects, Contact
│   ├── providers/            # ThemeProvider
│   └── ui/                   # Toaster, etc.
├── lib/
│   ├── prisma.ts             # Prisma client singleton
│   ├── auth.ts               # Better Auth server config
│   ├── auth-client.ts        # Better Auth client
│   ├── utils.ts              # Utility functions
│   └── seed-data.ts          # Default portfolio content
└── middleware.ts             # Route middleware
prisma/
└── schema.prisma             # Database schema
scripts/
├── seed.ts                   # DB seeder
└── create-admin.ts           # Admin user creator
```

---

## 🔑 Admin Panel

Access at `/admin` after signing in as admin.

### Features:
- **Dashboard** — Overview stats, quick actions, recent messages
- **Hero Section** — Edit name, title, description, image, social links, resume
- **About Section** — Edit bio with multi-paragraph support
- **Skills** — Add/delete/manage all tech skills with icons
- **Projects** — Full CRUD for portfolio projects with tech stack tags
- **Messages** — View, mark-read, delete contact submissions
- **Users** — View all registered users

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import on [vercel.com](https://vercel.com)
3. Add all environment variables
4. Deploy!

After deployment, run:
```bash
# Update BETTER_AUTH_URL and NEXT_PUBLIC_APP_URL to your domain
# Then push the schema to your production DB
DATABASE_URL="your-prod-db-url" npx prisma db push
DATABASE_URL="your-prod-db-url" npx tsx scripts/seed.ts
DATABASE_URL="your-prod-db-url" npm run create-admin
```

### Railway / Render / Fly.io

Same process — just set environment variables in their dashboards.

### PostgreSQL Options (Free Tiers)
- [Neon](https://neon.tech) — Serverless Postgres, great free tier
- [Supabase](https://supabase.com) — Postgres + many features
- [Railway](https://railway.app) — Easy deployment

---

## 📧 Email Setup (Gmail)

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Create an app password for "Mail"
5. Use that 16-character password in `SMTP_PASS`

---

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:generate  # Regenerate Prisma client
npm run db:studio    # Open Prisma Studio (DB GUI)
npm run db:seed      # Seed default portfolio data
npm run create-admin # Create admin user
npm run setup        # Run all setup steps at once
```

---

## 📝 Customization

All your portfolio content is managed through the **Admin Dashboard** at `/admin`.

After logging in as admin:
1. **Hero Section** → Edit your name, title, bio, image, CV link, social links
2. **About Section** → Write your story
3. **Skills** → Add your tech stack with icons
4. **Projects** → Showcase your work

---

## 🐛 Troubleshooting

### "PrismaClient not found"
```bash
npm run db:generate
```

### "Cannot connect to database"
- Check your `DATABASE_URL` format
- Make sure PostgreSQL is running
- For Neon/Supabase, use the connection pooling URL

### Admin login not working
- Make sure you ran `npm run create-admin`
- Better Auth stores hashed passwords — use the `create-admin` script

---

Made with ❤️ by Sopon Islam | [sopon-islam.web.app](https://sopon-islam.web.app)
