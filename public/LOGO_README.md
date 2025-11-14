# Logo Setup Instructions

## Adding Your Club Logo

1. **Place your logo file** in the `/public` directory
   - Recommended formats: PNG, SVG, JPG
   - Recommended size: 200x200px or 400x400px
   - Name it `logo.png` (or update the path in Header.tsx)

2. **Update Header.tsx:**
   - Open `components/Header.tsx`
   - Find the logo section (around line 22-30)
   - Uncomment the `Image` component
   - Update the `src` path to match your logo filename

3. **Example:**
   ```tsx
   <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
     <Image
       src="/logo.png"
       alt="CyberVanguard Logo"
       fill
       className="object-contain"
       priority
     />
   </div>
   ```

4. **Remove the placeholder:**
   - Delete or comment out the placeholder div with "CV" text

## Current Implementation

The header currently shows a placeholder with "CV" text. Once you add your logo, it will automatically replace the placeholder.

