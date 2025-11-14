# Security Implementation Guide

This document outlines all security measures implemented in the CTF Platform.

## 🔒 Implemented Security Measures

### 1. CSRF Protection

**Implementation:**
- Server-side CSRF token generation using `bin2hex(random_bytes(32))`
- Tokens stored in PHP sessions
- Client-side token fetching via `/api/csrf.php`
- All form submissions require valid CSRF tokens
- Tokens validated using `hash_equals()` for timing-safe comparison

**Files:**
- `api/config.php` - CSRF token generation and validation functions
- `api/csrf.php` - Endpoint to fetch CSRF tokens
- `hooks/useCSRF.ts` - React hook to fetch and manage CSRF tokens
- All API endpoints validate CSRF tokens

**Usage:**
```typescript
// In React components
const { csrfToken } = useCSRF()

// Include in API calls
fetch('/api/endpoint.php', {
  method: 'POST',
  body: JSON.stringify({
    ...data,
    csrf_token: csrfToken
  })
})
```

### 2. Password Hashing (bcrypt)

**Implementation:**
- All passwords hashed using bcrypt with cost factor of 12
- PHP's `password_hash()` and `password_verify()` functions
- Passwords never stored in plaintext
- Backward compatibility maintained for localStorage (development only)

**Files:**
- `api/config.php` - `hashPassword()` and `verifyPassword()` functions
- `api/auth.php` - Registration and login use bcrypt
- Database stores bcrypt hashes (60 characters)

**Migration:**
If you have existing plaintext passwords, you'll need to:
1. Hash all existing passwords
2. Update the database
3. Users will need to reset passwords if you can't hash existing ones

### 3. Directory Listing Prevention

**Implementation:**
- `.htaccess` file disables directory listing
- `Options -Indexes` directive
- Separate `.htaccess` in `public/` directory
- Next.js configuration for additional security

**Files:**
- `.htaccess` - Root directory security
- `public/.htaccess` - Public directory security
- `next.config.js` - Next.js security headers

### 4. Input Sanitization

**Implementation:**
- All user inputs sanitized using `sanitizeInput()`
- HTML entities encoded
- Tags stripped
- Whitespace trimmed
- Array inputs recursively sanitized

**Files:**
- `api/config.php` - `sanitizeInput()` function
- All API endpoints sanitize inputs before processing

### 5. Rate Limiting

**Implementation:**
- In-memory rate limiting (simple implementation)
- Configurable limits per endpoint
- Based on IP address and User-Agent
- Prevents brute force attacks

**Limits:**
- Authentication: 5 requests per 60 seconds
- Flag submissions: 30 requests per 60 seconds
- Admin actions: 20 requests per 60 seconds

**Files:**
- `api/config.php` - `checkRateLimit()` and `getClientIdentifier()` functions
- Applied to sensitive endpoints

### 6. Security Headers

**Implementation:**
- X-Frame-Options: SAMEORIGIN (prevents clickjacking)
- X-Content-Type-Options: nosniff (prevents MIME sniffing)
- X-XSS-Protection: 1; mode=block (XSS protection)
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: restricts camera, microphone, geolocation

**Files:**
- `.htaccess` - Apache security headers
- `next.config.js` - Next.js security headers

### 7. SQL Injection Prevention

**Implementation:**
- All database queries use prepared statements
- PDO with `ATTR_EMULATE_PREPARES => false`
- Parameter binding for all user inputs
- No direct string concatenation in queries

**Files:**
- All API files use prepared statements
- `api/config.php` - PDO configuration

### 8. XSS Protection

**Implementation:**
- Input sanitization strips HTML tags
- Output encoding via `htmlspecialchars()`
- React automatically escapes content
- Content Security Policy headers

**Files:**
- `api/config.php` - Sanitization functions
- React components (automatic escaping)

### 9. Flag Security (SHA-256 Hashing)

**Implementation:**
- All flags hashed with SHA-256 before storage
- Database stores `flag_hash` (64 characters)
- Client-side hashing before submission
- Server-side verification using `hash_equals()`

**Files:**
- `api/config.php` - `hashFlag()` function
- `api/challenges.php` - Flag hashing on creation
- `api/submit_flag.php` - Flag verification
- `contexts/AuthContext.tsx` - Client-side hashing

### 10. File Access Protection

**Implementation:**
- Sensitive files blocked via `.htaccess`
- Configuration files protected
- Backup files denied
- Hidden files (starting with `.`) blocked

**Files:**
- `.htaccess` - File access rules

## 🛡️ Additional Security Best Practices

### Session Security
- PHP sessions used for CSRF tokens
- Session cookies should be HttpOnly and Secure in production
- Session timeout recommended

### HTTPS
- Uncomment HTTPS redirect in `.htaccess` for production
- All sensitive data transmitted over HTTPS
- Secure cookies in production

### Error Handling
- Errors logged, not displayed to users
- Generic error messages for security
- Detailed errors only in development

### Database Security
- Prepared statements (already implemented)
- Least privilege database user
- Regular backups
- Encrypted connections (SSL/TLS)

### Authentication
- Strong password requirements
- Password strength checking
- Account lockout after failed attempts (can be added)
- Two-factor authentication (future enhancement)

## 📋 Security Checklist

- [x] CSRF protection on all forms
- [x] Password hashing (bcrypt)
- [x] Directory listing disabled
- [x] Input sanitization
- [x] Rate limiting
- [x] Security headers
- [x] SQL injection prevention
- [x] XSS protection
- [x] Flag hashing (SHA-256)
- [x] File access protection
- [ ] HTTPS enforcement (uncomment in .htaccess)
- [ ] Session security (HttpOnly, Secure cookies)
- [ ] Account lockout mechanism
- [ ] Security logging/auditing
- [ ] Regular security updates

## 🚀 Production Deployment

Before deploying to production:

1. **Update `.htaccess`:**
   - Uncomment HTTPS redirect
   - Set proper error log path
   - Configure session settings

2. **Update `api/config.php`:**
   - Set secure session cookie settings
   - Configure proper error logging
   - Set production database credentials

3. **Environment Variables:**
   - Move sensitive data to environment variables
   - Never commit credentials to git

4. **HTTPS:**
   - Obtain SSL certificate
   - Force HTTPS redirect
   - Use secure cookies

5. **Monitoring:**
   - Set up error logging
   - Monitor rate limit violations
   - Track failed login attempts

## 🔍 Security Testing

Test the following:
- CSRF token validation
- Password hashing verification
- Rate limiting functionality
- Input sanitization
- SQL injection attempts
- XSS attempts
- Directory listing (should be disabled)

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [PHP Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)

