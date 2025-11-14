# CTF-platform

A modern, open-source Capture The Flag (CTF) platform built for CyberVanguard - Cyber Club @AAU.

## Features

- 🎯 General CTF playing area with filtering
- ⏱️ Event-based CTF competitions
- 📋 Challenge management system
- 🎨 Beautiful, responsive UI with Tailwind CSS
- ⚡ Built with Next.js 14 and TypeScript
- 🔧 PHP backend for cPanel hosting
- 👨‍💼 Admin panel for platform management
- 📊 Real-time scoreboard
- 🏆 Archived event scoreboards

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

- **Events Management** (`/admin/events`)
  - Create new CTF events
  - Set event dates and banners
  - Archive events (moves challenges to general area)

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
  - Manage sponsor display order

- **Categories** (`/admin/categories`)
  - Create new challenge categories
  - Manage existing categories

## Project Structure

```
CTF-platform/
├── api/                    # PHP backend API
│   ├── config.php         # Database and admin config
│   ├── auth.php           # Authentication endpoints
│   ├── challenges.php     # Challenge CRUD operations
│   ├── events.php         # Event management
│   ├── users.php          # User management
│   └── sponsors.php       # Sponsor management
├── app/
│   ├── page.tsx           # Landing page (general platform)
│   ├── play/              # General CTF playing area
│   ├── admin/             # Admin panel pages
│   ├── dashboard/         # User dashboard
│   ├── challenges/        # Challenge detail pages
│   ├── events/            # Event pages
│   ├── scoreboard/        # Global scoreboard
│   └── profile/           # User profile
├── components/            # React components
├── contexts/              # React contexts (Auth)
├── database/
│   └── schema.sql        # Database schema
└── ...
```

## API Endpoints

All API endpoints are in the `/api` directory:

- `auth.php?action=login` - User/admin authentication
- `challenges.php?action=list` - Get challenges (supports filters)
- `challenges.php?action=add` - Add challenge (admin)
- `challenges.php?action=update` - Update challenge (admin)
- `challenges.php?action=delete` - Delete challenge (admin)
- `events.php?action=active` - Get active event
- `events.php?action=list` - Get all events
- `events.php?action=create` - Create event (admin)
- `users.php?action=list` - Get all users (admin)
- `sponsors.php?action=list` - Get sponsors

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

## Deployment to cPanel

1. Upload all files to your cPanel hosting
2. Ensure PHP 7.4+ is available
3. Set up MySQL database and import schema
4. Update database credentials in `api/config.php`
5. Build the Next.js app:
   ```bash
   npm run build
   ```
6. Configure your domain to point to the `out` directory (for static export) or use a Node.js hosting solution

## Security Notes

1. **Change default admin password immediately**
2. Use strong passwords for admin account
3. Consider implementing session-based authentication for production
4. Add rate limiting to API endpoints
5. Validate all inputs on both frontend and backend
6. Use HTTPS in production

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

## Contributing

This is an open-source project. Contributions are welcome!

## License

[Add your license here]

---

Built with ❤️ by CyberVanguard - Cyber Club @AAU
