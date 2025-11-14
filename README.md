# CTF-platform

A modern, secure, open-source Capture The Flag (CTF) platform built for CyberVanguard - Cyber Club @AAU.

## Features

- 🎯 General CTF playing area with filtering
- ⏱️ Event-based CTF competitions
- 📋 Challenge management system
- 🎨 Beautiful, responsive UI with Tailwind CSS
- ⚡ Built with Next.js 14 and TypeScript
- 🔧 PHP backend for cPanel hosting
- 👨‍💼 Complete admin panel for platform management
- 📊 Real-time scoreboard with performance metrics
- 🏆 Archived event scoreboards
- 🔒 Enterprise-grade security (CSRF, bcrypt, rate limiting)
- 🔐 SHA-256 flag hashing
- 👤 User profile management (username/password changes)
- 📜 Terms of Service and Usage Policy

## Platform Structure

### General CTF Area
- Browse all challenges (past events + general)
- Filter by category (Web, Cryptography, Forensics, Misc)
- Filter by difficulty (Easy, Medium, Hard)
- Filter by event type
- Search functionality

### Event System
- Admin can create events with custom banners
- Active events shown on landing page
- Event-specific playing areas
- Automatic archiving when events end
- Archived challenges move to general area
- Archived event scoreboards

### User Features
- User registration with password strength checking
- Terms of Service agreement required
- Profile management (change username/password)
- Dashboard with performance metrics
- Category and difficulty-based performance tracking
- Rank and percentile calculations

### Flag Format
All flags use the format: `cvctf{...}`

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PHP 7.4+ (for backend API)
- MySQL database (for cPanel hosting)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CTF-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
   - Import `database/schema.sql` into your MySQL database via cPanel phpMyAdmin
   - See `database/IMPORT_INSTRUCTIONS.md` for detailed steps
   - Update database credentials in `api/config.php`

4. Configure admin credentials:
   - Edit `api/config.php`
   - Change `ADMIN_EMAIL` and `ADMIN_PASSWORD` to your secure credentials
   - **IMPORTANT:** Change the default password before going live!

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Panel

### Accessing Admin Panel

1. Go to `/login`
2. Enter admin email and password (configured in `api/config.php`)
3. You'll be redirected to `/admin` panel

### Admin Features

- **Challenges Management** (`/admin/challenges`)
  - Add, edit, delete challenges
  - Enable/disable challenges
  - Set challenge categories and difficulties
  - Flags automatically hashed with SHA-256

- **Events Management** (`/admin/events`)
  - Create new CTF events
  - Set event dates and banners
  - Archive events (moves challenges to general area)
  - Delete events

- **Users Management** (`/admin/users`)
  - View all users
  - Delete users
  - View user statistics

- **Submitted Flags** (`/admin/flags`)
  - View all flag submissions
  - Filter by challenge
  - See correct/incorrect submissions

- **Sponsors** (`/admin/sponsors`)
  - Add sponsor logos
  - Edit and delete sponsors
  - Manage sponsor display order

- **Categories** (`/admin/categories`)
  - Create new challenge categories
  - Edit and delete categories
  - Manage existing categories

## Security Features

The platform implements enterprise-grade security measures:

- ✅ **CSRF Protection** - All forms protected against Cross-Site Request Forgery
- ✅ **Password Hashing** - bcrypt with cost factor 12
- ✅ **Flag Hashing** - SHA-256 hashing for all flags
- ✅ **Rate Limiting** - Prevents brute force attacks
- ✅ **Input Sanitization** - All user inputs sanitized
- ✅ **SQL Injection Prevention** - Prepared statements only
- ✅ **XSS Protection** - Input/output encoding
- ✅ **Security Headers** - X-Frame-Options, CSP, etc.
- ✅ **Directory Listing Disabled** - `.htaccess` protection

See `SECURITY.md` for detailed security documentation.

## Project Structure

```
CTF-platform/
├── api/                    # PHP backend API
│   ├── config.php         # Database, security, and admin config
│   ├── auth.php           # Authentication endpoints
│   ├── challenges.php     # Challenge CRUD operations
│   ├── events.php         # Event management
│   ├── users.php          # User management
│   ├── sponsors.php       # Sponsor management
│   ├── categories.php     # Category management
│   ├── submit_flag.php    # Flag submission endpoint
│   └── csrf.php           # CSRF token endpoint
├── app/
│   ├── page.tsx           # Landing page (general platform)
│   ├── play/              # General CTF playing area
│   ├── admin/             # Admin panel pages
│   ├── dashboard/         # User dashboard with performance metrics
│   ├── challenges/        # Challenge detail pages
│   ├── events/            # Event pages
│   ├── scoreboard/        # Global scoreboard
│   ├── profile/           # User profile (username/password change)
│   ├── terms/             # Terms of Service page
│   ├── login/             # Login page
│   └── register/          # Registration page
├── components/            # React components
│   ├── Header.tsx         # Universal header
│   ├── Footer.tsx         # Universal footer
│   ├── ChallengeCard.tsx  # Challenge display card
│   └── CountdownTimer.tsx # Event countdown timer
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
├── hooks/                 # React hooks
│   └── useCSRF.ts         # CSRF token hook
├── utils/                 # Utility functions
│   ├── passwordStrength.ts # Password strength checking
│   └── flagHash.ts        # Flag hashing utilities
├── database/
│   ├── schema.sql        # Database schema
│   ├── migration_flag_hash.sql # Flag hash migration
│   └── IMPORT_INSTRUCTIONS.md # Import guide
├── .htaccess             # Apache security configuration
└── ...
```

## API Endpoints

All API endpoints are in the `/api` directory:

### Authentication
- `auth.php?action=login` - User/admin authentication (requires CSRF token)
- `auth.php?action=register` - User registration (requires CSRF token)
- `csrf.php` - Get CSRF token

### Challenges
- `challenges.php?action=list` - Get challenges (supports filters)
- `challenges.php?action=get&id=X` - Get single challenge
- `challenges.php?action=add` - Add challenge (admin, requires CSRF)
- `challenges.php?action=update&id=X` - Update challenge (admin, requires CSRF)
- `challenges.php?action=delete&id=X` - Delete challenge (admin)

### Flags
- `submit_flag.php` - Submit flag (requires CSRF token, rate limited)

### Events
- `events.php?action=active` - Get active event
- `events.php?action=list` - Get all events
- `events.php?action=get&id=X` - Get single event
- `events.php?action=create` - Create event (admin)
- `events.php?action=scoreboard&id=X` - Get event scoreboard

### Users
- `users.php?action=list` - Get all users (admin)
- `users.php?action=delete&id=X` - Delete user (admin)

### Sponsors
- `sponsors.php?action=list` - Get sponsors
- `sponsors.php?action=add` - Add sponsor (admin)
- `sponsors.php?action=update&id=X` - Update sponsor (admin)

### Categories
- `categories.php?action=list` - Get categories
- `categories.php?action=add` - Add category (admin)

## Database Setup

1. Create a MySQL database in cPanel
2. Import `database/schema.sql` via phpMyAdmin
3. Update credentials in `api/config.php`:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'your_database_name');
   define('DB_USER', 'your_db_user');
   define('DB_PASS', 'your_db_password');
   ```
4. See `database/IMPORT_INSTRUCTIONS.md` for detailed instructions

## Deployment to cPanel

1. Upload all files to your cPanel hosting
2. Ensure PHP 7.4+ is available
3. Set up MySQL database and import schema
4. Update database credentials in `api/config.php`
5. Configure `.htaccess` (already included)
6. Build the Next.js app:
   ```bash
   npm run build
   ```
7. Configure your domain to point to the build output

## Security Notes

1. **Change default admin password immediately**
2. Use strong passwords for admin account
3. All passwords are hashed with bcrypt
4. All flags are hashed with SHA-256
5. CSRF protection on all forms
6. Rate limiting on sensitive endpoints
7. Input sanitization on all user inputs
8. Use HTTPS in production (uncomment redirect in `.htaccess`)
9. See `SECURITY.md` for complete security documentation

## Customization

### Flag Format

Update the flag format in `api/config.php`:
```php
define('FLAG_FORMAT', 'cvctf{');
```

### Admin Credentials

Change admin credentials in `api/config.php`:
```php
define('ADMIN_EMAIL', 'your-admin@email.com');
define('ADMIN_PASSWORD', 'your-secure-password');
```

### Terms of Service

Edit `app/terms/page.tsx` to customize the Terms of Service content.

## Documentation

- `SECURITY.md` - Complete security implementation guide
- `FLAG_SECURITY.md` - Flag hashing implementation details
- `ADMIN_SETUP.md` - Admin panel setup guide
- `IMPLEMENTATION_STATUS.md` - Feature implementation status
- `database/IMPORT_INSTRUCTIONS.md` - Database import guide

## Contributing

This is an open-source project. Contributions are welcome!

## License

[Add your license here]

---

Built with ❤️ by CyberVanguard - Cyber Club @AAU
