# Admin Panel Setup Guide

## Database Setup

1. **Create Database:**
   - Import `database/schema.sql` into your MySQL database via cPanel phpMyAdmin
   - Update database credentials in `api/config.php`

2. **Update Admin Credentials:**
   - Edit `api/config.php`
   - Change `ADMIN_EMAIL` and `ADMIN_PASSWORD` to your secure credentials
   - **IMPORTANT:** Change the default password before going live!

## Admin Login

- Use the regular login page (`/login`)
- Enter admin email and password
- You'll be redirected to `/admin` panel

## Admin Features

### 1. Challenges Management (`/admin/challenges`)
- Add new challenges
- Edit existing challenges
- Enable/Disable challenges
- Delete challenges

### 2. Events Management (`/admin/events`)
- Create new CTF events
- Set event dates (start/end)
- Add event banner
- Archive events (moves challenges to general area)

### 3. Users Management (`/admin/users`)
- View all users
- Delete users
- View user statistics

### 4. Submitted Flags (`/admin/flags`)
- View all flag submissions
- Filter by challenge
- See which flags were correct/incorrect

### 5. Sponsors (`/admin/sponsors`)
- Add sponsor logos
- Manage sponsor display order

### 6. Categories (`/admin/categories`)
- Create new challenge categories
- Manage existing categories

## API Endpoints

All API endpoints are in the `/api` directory:
- `auth.php` - Authentication
- `challenges.php` - Challenge management
- `events.php` - Event management
- `users.php` - User management
- `sponsors.php` - Sponsor management

## Flag Format

Default flag format: `cvctf{...}` (configurable in `api/config.php`)

## File Structure

```
/api/
  ├── config.php          # Database and admin config
  ├── auth.php            # Authentication endpoints
  ├── challenges.php      # Challenge CRUD operations
  ├── events.php          # Event management
  ├── users.php           # User management
  └── sponsors.php       # Sponsor management

/database/
  └── schema.sql         # Database schema

/app/admin/
  ├── page.tsx           # Admin dashboard
  ├── challenges/        # Challenge management
  ├── events/            # Event management
  ├── users/             # User management
  ├── flags/             # Flag submissions
  ├── sponsors/          # Sponsor management
  └── categories/        # Category management
```

## Security Notes

1. **Change default admin password immediately**
2. Use strong passwords for admin account
3. Consider implementing session-based authentication for production
4. Add rate limiting to API endpoints
5. Validate all inputs on both frontend and backend

