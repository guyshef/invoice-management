# LLC Invoice Manager

A premium, SaaS-grade web application built to help business owners effortlessly manage their LLCs, organize vendor invoices, and track expenses across multiple fiscal years.

## 🚀 Features

- **Multi-LLC Management**: Seamlessly add and switch between multiple companies from a unified Dashboard.
- **Deep Folder Organization**: File invoices within a structured nested system: `Company` → `Year` → `Category Folder` (e.g., Tax, Insurance).
- **Pro Folder Features**: Effortlessly create, safely rename, and selectively delete category folders.
- **Secure File Storage**: Upload and manage PDF and Image invoices directly into your organized folders via Supabase Storage.
- **Tier-1 SaaS UI Architecture**: 
  - **Split-Pane Layout**: An intuitive desktop layout mimicking professional tools like AWS and Google Drive.
  - **Segmented Control Tabs**: Effortless, zero-overlap year-swapping navigation.
  - **Actionable Empty States**: Beautiful, large ghost-icon placeholders that guide users directly to their next action (like Quick Upload).
  - **Breadcrumb Navigation**: Instantly know exactly where you are in the application.
- **Custom Aesthetic**: A beautiful Charcoal Navy (`#0f172a`) theme replacing standard harsh dark modes, paired perfectly with the ultra-clean **Inter** font family.
- **Enterprise-Grade Security**: Full user authentication powered by Supabase Auth with Row-Level Security (RLS) guaranteeing absolute data isolation.

## 🛠 Tech Stack

- **Framework**: [Next.js 16.2](https://nextjs.org/) (App Router & Server Actions)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, standardizing on soft drop-shadows, rounded-md interactive elements, and subtle primary radiants.
- **Icons & Animation**: Lucide React + Framer Motion
- **Database, Auth & Storage**: [Supabase](https://supabase.com/)

## ⚙️ Local Development Setup

1. **Clone the repository** and install dependencies:
   ```bash
   npm install
   ```

2. **Configure your environment**:
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Initialize the Database Schema**:
   Run the provided `supabase_schema.sql` script directly in your Supabase SQL Editor. This script configures the:
   - `companies`, `folders`, and `invoices` tables
   - Supabase Storage buckets
   - Row-Level Security (RLS) Policies (including the powerful `FOR ALL` policy for native Rename/Delete access)

4. **Launch the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🌟 Recent Version Updates
- Converted navigation to a horizontal segmented-control year format inside a dedicated Left Sidebar.
- Fully implemented Folder renaming and cascading deletions.
- Global UI shifted to Inter font and slate-900 (Navy Charcoal) for superior contrast and eye-comfort.
- Added Tax ID badging to the breadcrumb header.
