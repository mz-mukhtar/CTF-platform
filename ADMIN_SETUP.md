# Admin Panel Setup Guide

## Database Setup

1. **Create Database:**
   - Import `database/schema.sql` into your MySQL database via cPanel phpMyAdmin
   - See `database/IMPORT_INSTRUCTIONS.md` for detailed instructions
   - Update database credentials in `api/config.php`

2. **Update Admin Credentials:**
   - Edit `api/config.php`
   - Change `ADMIN_EMAIL` and `ADMIN_PASSWORD` to your secure credentials
   - **IMPORTANT:** Change the default password before going live!
   - Admin password should be strong (minimum 8 characters, mixed case, numbers, special chars)

## Admin Login

- Use the regular login page (`/login`)
- Enter admin email and password (configured in `api/config.php`)
- You'll be redirected to `/admin` panel automatically
- Admin session stored in localStorage (for development)

## Admin Features

### 1. Challenges Management (`/admin/challenges`)
- **Add new challenges:**
  - Title, description, category, difficulty
  - Points value
  - Flag (automatically hashed with SHA-256)
  - Files (JSON format)
  - Challenge link (optional)
  - Event association (optional)
  - Status (active/disabled)

- **Edit existing challenges:**
  - Update any challenge field
  - Change flag (will be re-hashed)
  - Modify files and links

- **Enable/Disable challenges:**
  - Toggle challenge status
  - Disabled challenges won't appear in play areas

- **Delete challenges:**
  - Permanently remove challenges
  - Associated flag submissions are also deleted

### 2. Events Management (`/admin/events`)
- **Create new CTF events:**
  - Event name and description
  - Start and end dates
  - Banner URL (optional)
  - Status (draft/active/archived)

- **Edit events:**
  - Update event details
  - Change dates
  - Update banner

- **Archive events:**
  - Manually archive events
  - Automatic archiving via cron job (`api/cron.php`)
  - Archived events' challenges move to general area

- **Delete events:**
  - Delete events (only if no challenges associated)
  - Prevents accidental data loss

### 3. Users Management (`/admin/users`)
- **View all users:**
  - Username, email
  - Total points
  - Challenges solved
  - Account creation date

- **Delete users:**
  - Remove user accounts
  - Associated flag submissions are also deleted

### 4. Submitted Flags (`/admin/flags`)
- **View all flag submissions:**
  - User who submitted
  - Challenge name
  - Submitted flag (plaintext for admin review)
  - Correct/incorrect status
  - Submission timestamp

- **Filter by challenge:**
  - See all submissions for a specific challenge

### 5. Sponsors (`/admin/sponsors`)
- **Add sponsor logos:**
  - Sponsor name
  - Logo URL
  - Website URL (optional)
  - Display order

- **Edit sponsors:**
  - Update sponsor information
  - Change display order

- **Delete sponsors:**
  - Remove sponsor entries

### 6. Categories (`/admin/categories`)
- **Create new challenge categories:**
  - Category name (unique)
  - Description

- **Edit categories:**
  - Update category name and description

- **Delete categories:**
  - Remove categories (ensure no challenges use it)

## API Endpoints

All API endpoints are in the `/api` directory:

### Authentication
- `auth.php?action=login` - Admin/user authentication
- `csrf.php` - Get CSRF token (required for all POST requests)

### Challenge Management
- `challenges.php?action=list` - List all challenges
- `challenges.php?action=get&id=X` - Get single challenge
- `challenges.php?action=add` - Add challenge (POST, requires CSRF)
- `challenges.php?action=update&id=X` - Update challenge (PUT, requires CSRF)
- `challenges.php?action=delete&id=X` - Delete challenge (DELETE)

### Event Management
- `events.php?action=list` - List all events
- `events.php?action=get&id=X` - Get single event
- `events.php?action=create` - Create event (POST)
- `events.php?action=update&id=X` - Update event (PUT)
- `events.php?action=archive&id=X` - Archive event (POST)
- `events.php?action=delete&id=X` - Delete event (DELETE)

### User Management
- `users.php?action=list` - List all users
- `users.php?action=delete&id=X` - Delete user (DELETE)

### Flag Submissions
- `submitted_flags.php?action=list` - List all submissions
- `submitted_flags.php?action=list&challenge_id=X` - Filter by challenge

### Sponsor Management
- `sponsors.php?action=list` - List all sponsors
- `sponsors.php?action=add` - Add sponsor (POST)
- `sponsors.php?action=update&id=X` - Update sponsor (PUT)
- `sponsors.php?action=delete&id=X` - Delete sponsor (DELETE)

### Category Management
- `categories.php?action=list` - List all categories
- `categories.php?action=add` - Add category (POST)
- `categories.php?action=update&id=X` - Update category (PUT)
- `categories.php?action=delete&id=X` - Delete category (DELETE)

## Security Features

### CSRF Protection
- All POST/PUT/DELETE requests require CSRF token
- Token obtained from `/api/csrf.php`
- Tokens validated server-side

### Rate Limiting
- Admin actions: 20 requests per 60 seconds
- Prevents abuse and brute force attacks

### Input Sanitization
- All inputs sanitized before processing
- HTML tags stripped
- SQL injection prevented via prepared statements

### Flag Security
- Flags automatically hashed with SHA-256
- Never stored in plaintext
- See `FLAG_SECURITY.md` for details

## Flag Format

Default flag format: `cvctf{...}` (configurable in `api/config.php`)

When creating challenges:
- Enter the plaintext flag
- System automatically hashes it before storage
- Flag hash stored in `flag_hash` column (64 characters)

## File Structure

```
/api/
  ├── config.php          # Database, security, and admin config
  ├── auth.php            # Authentication endpoints
  ├── csrf.php            # CSRF token endpoint
  ├── challenges.php     # Challenge CRUD operations
  ├── events.php          # Event management
  ├── users.php           # User management
  ├── sponsors.php        # Sponsor management
  ├── categories.php      # Category management
  ├── submit_flag.php     # Flag submission
  └── cron.php            # Automatic event archiving

/database/
  ├── schema.sql          # Database schema
  └── migration_flag_hash.sql # Flag hash migration

/app/admin/
  ├── page.tsx            # Admin dashboard
  ├── challenges/         # Challenge management
  ├── events/             # Event management
  ├── users/              # User management
  ├── flags/              # Flag submissions
  ├── sponsors/           # Sponsor management
  └── categories/          # Category management
```

## Automatic Event Archiving

Set up a cron job to automatically archive expired events:

```bash
# Run every hour
0 * * * * /usr/bin/php /path/to/api/cron.php
```

Or via cPanel Cron Jobs:
- Command: `/usr/bin/php /home/username/public_html/api/cron.php`
- Frequency: Every hour

## Security Best Practices

1. **Change default admin password immediately**
2. **Use strong passwords** (minimum 8 characters, mixed case, numbers, special chars)
3. **Enable HTTPS** in production (uncomment in `.htaccess`)
4. **Regular backups** of database
5. **Monitor flag submissions** for suspicious activity
6. **Review user accounts** regularly
7. **Keep PHP and dependencies updated**
8. **Use secure session settings** in production

## Troubleshooting

### "Invalid CSRF token" error
- Ensure CSRF token is fetched before making POST requests
- Check that token is included in request body
- Verify session is working on server

### "Rate limit exceeded"
- Wait 60 seconds before trying again
- Reduce number of requests per minute

### "Database error"
- Verify database credentials in `api/config.php`
- Check database connection
- Ensure all tables exist (run schema.sql)

### "Admin access required"
- Verify admin credentials in `api/config.php`
- Check that email matches exactly
- Ensure you're logged in as admin

## Additional Resources

- `SECURITY.md` - Complete security documentation
- `FLAG_SECURITY.md` - Flag hashing details
- `database/IMPORT_INSTRUCTIONS.md` - Database setup guide
