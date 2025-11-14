# Database Import Instructions for cPanel

## Step-by-Step Guide

### 1. Create Database in cPanel

1. Log in to your cPanel account
2. Navigate to **MySQL Databases** (or **MySQL Database Wizard**)
3. Create a new database:
   - Enter database name (e.g., `ctf_platform`)
   - Click **Create Database**
4. Create a database user:
   - Enter username and password
   - Click **Create User**
5. Add user to database:
   - Select the user and database
   - Click **Add**
   - Grant **ALL PRIVILEGES**
   - Click **Make Changes**

### 2. Update API Configuration

Before importing, update `api/config.php` with your database credentials:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_database_name');  // e.g., 'username_ctf_platform'
define('DB_USER', 'your_db_user');        // e.g., 'username_dbuser'
define('DB_PASS', 'your_db_password');
```

**Note:** In cPanel, database names and usernames are usually prefixed with your cPanel username (e.g., `username_`)

### 3. Import Schema via phpMyAdmin

1. Go to **phpMyAdmin** in cPanel
2. Select your database from the left sidebar
3. Click the **Import** tab at the top
4. Click **Choose File** and select `schema.sql`
5. Under **Format**, make sure **SQL** is selected
6. Click **Go** button at the bottom

### 4. Verify Import

After import, verify that all tables were created:

- `users`
- `events`
- `categories`
- `challenges`
- `submitted_flags`
- `sponsors`

You should see 4 default categories inserted in the `categories` table.

## Troubleshooting

### Error: "Access denied"
- Make sure the database user has proper permissions
- Verify credentials in `api/config.php`

### Error: "Table already exists"
- The schema uses `CREATE TABLE IF NOT EXISTS`, so this shouldn't happen
- If it does, you can drop existing tables first or use a fresh database

### Error: "Unknown collation"
- The schema uses `utf8mb4_unicode_ci` which is standard in modern MySQL
- If your MySQL version is old, you might need to change to `utf8_unicode_ci`

### Foreign Key Errors
- Make sure all tables are created in the correct order
- The schema is already ordered correctly (users, events, categories first, then challenges, then submitted_flags)

## Database Structure

```
users
  ├── id (PK)
  ├── name
  ├── email (UNIQUE)
  ├── password (bcrypt hash, 60 chars)
  ├── total_points
  ├── challenges_solved
  └── created_at

events
  ├── id (PK)
  ├── name
  ├── description
  ├── banner_url
  ├── start_date
  ├── end_date
  ├── status
  └── created_at

categories
  ├── id (PK)
  ├── name (UNIQUE)
  ├── description
  └── created_at

challenges
  ├── id (PK)
  ├── title
  ├── description
  ├── category
  ├── difficulty
  ├── points
  ├── flag_hash (SHA-256 hash, 64 chars)
  ├── files (JSON)
  ├── challenge_link
  ├── event_id (FK -> events.id)
  ├── status
  └── created_at

submitted_flags
  ├── id (PK)
  ├── user_id (FK -> users.id)
  ├── challenge_id (FK -> challenges.id)
  ├── flag
  ├── is_correct
  ├── submitted_at
  └── UNIQUE(user_id, challenge_id)

sponsors
  ├── id (PK)
  ├── name
  ├── logo_url
  ├── website_url
  ├── display_order
  └── created_at
```

## Security Notes

### Password Storage
- Passwords are stored as bcrypt hashes (60 characters)
- Never store plaintext passwords
- Use `password_hash()` when creating users programmatically

### Flag Storage
- Flags are stored as SHA-256 hashes (64 characters) in `flag_hash` column
- Never store plaintext flags
- Use `hash('sha256', trim($flag))` when creating challenges programmatically

### Migration
If you have existing data with plaintext passwords or flags:
- See `database/migration_flag_hash.sql` for flag migration
- Passwords need to be re-hashed using bcrypt
- Users will need to reset passwords if you can't hash existing ones

## Next Steps

After importing the schema:

1. Update `api/config.php` with your database credentials
2. Test the connection by accessing any API endpoint
3. Create your admin account (credentials in `api/config.php`)
4. Start adding challenges and events through the admin panel
5. Review security settings in `SECURITY.md`

