# Flag Security Implementation

## Overview

The CTF platform now uses **SHA-256 hashing** for all flags to prevent cheating and unauthorized access to flag values. Flags are never stored in plaintext in the database.

## How It Works

### 1. Flag Storage
- When an admin creates or updates a challenge, the flag is hashed using SHA-256 before being stored
- The database stores `flag_hash` (64-character hexadecimal string) instead of the plaintext flag
- Original plaintext flags are never stored in the database

### 2. Flag Submission
- When a user submits a flag, it is hashed client-side using the Web Crypto API
- The hashed value is sent to the server (or compared locally in development mode)
- The server compares the submitted hash with the stored hash using timing-safe comparison (`hash_equals`)

### 3. Security Benefits
- **Prevents database leaks**: Even if the database is compromised, attackers cannot see the actual flags
- **Prevents SQL injection flag extraction**: Attackers cannot extract flags through SQL injection
- **Prevents insider threats**: Database administrators cannot see flags
- **Timing-safe comparison**: Uses `hash_equals()` to prevent timing attacks

## Implementation Details

### Database Schema
```sql
CREATE TABLE challenges (
    ...
    flag_hash VARCHAR(64) NOT NULL COMMENT 'SHA-256 hash of the flag',
    ...
);
```

### API Endpoints

#### Creating/Updating Challenges
- **Endpoint**: `/api/challenges.php?action=add` or `update`
- **Process**: 
  1. Admin submits plaintext flag
  2. PHP hashes it using `hash('sha256', trim($flag))`
  3. Hash is stored in database

#### Submitting Flags
- **Endpoint**: `/api/submit_flag.php`
- **Process**:
  1. User submits plaintext flag
  2. Client hashes it using Web Crypto API
  3. Server hashes it again (for verification)
  4. Server compares hashes using `hash_equals()`

### Frontend Implementation

#### Client-Side Hashing
```typescript
// Hash the submitted flag
const encoder = new TextEncoder()
const data = encoder.encode(flag.trim())
const hashBuffer = await crypto.subtle.digest('SHA-256', data)
const hashArray = Array.from(new Uint8Array(hashBuffer))
const submittedFlagHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
```

#### Comparison
- If API is available: Server handles hashing and comparison
- If API unavailable (development): Client compares hashes locally

## Migration Guide

If you have an existing database with plaintext flags, use the migration script:

1. **Backup your database** (critical!)
2. Run `database/migration_flag_hash.sql`
3. Use the provided PHP script to hash existing flags
4. Remove the old `flag` column (optional, for security)

See `database/migration_flag_hash.sql` for detailed instructions.

## Development vs Production

### Development Mode (localStorage)
- Flags can be stored with `flag_hash` or `flag` (for backward compatibility)
- System checks for `flag_hash` first, falls back to `flag` if not present
- Allows gradual migration

### Production Mode (Database)
- All flags must be stored as `flag_hash`
- Plaintext flags are never stored
- API handles all hashing server-side

## Security Considerations

### ✅ Implemented
- SHA-256 hashing (cryptographically secure)
- Timing-safe comparison (`hash_equals`)
- Client-side hashing (reduces plaintext transmission)
- Server-side verification (double-check)

### ⚠️ Important Notes
- **Never log flags**: Ensure logging doesn't capture plaintext flags
- **Secure admin panel**: Only admins should be able to create challenges
- **HTTPS required**: In production, always use HTTPS to protect flag submissions
- **Rate limiting**: Consider implementing rate limiting on flag submissions

## Testing

To test the flag system:

1. Create a challenge with flag: `cvctf{test_flag}`
2. Check database: Verify `flag_hash` is stored (not plaintext)
3. Submit flag: Try submitting the correct flag
4. Verify: Should return success
5. Submit wrong flag: Should return failure

## Troubleshooting

### "Flag hash mismatch"
- Ensure flags are trimmed before hashing
- Check that both client and server use the same normalization

### "Database error"
- Verify `flag_hash` column exists
- Check column is VARCHAR(64) or larger

### "Flag not found"
- Ensure challenge exists in database
- Check challenge ID is correct

## Future Enhancements

Potential improvements:
- Add salt to flags (though not necessary for CTF flags)
- Implement rate limiting per user
- Add flag submission history/audit log
- Add flag format validation (e.g., must start with `cvctf{`)

