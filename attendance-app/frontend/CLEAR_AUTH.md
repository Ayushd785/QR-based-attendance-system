# Clear Authentication Data

If you're being redirected to dashboard but see errors, clear your browser's localStorage:

## Quick Fix - Clear Auth Data

### Option 1: Browser Console (Easiest)
1. Open browser console (F12)
2. Go to **Console** tab
3. Type and press Enter:
```javascript
localStorage.clear()
```
4. Refresh the page (F5)

### Option 2: Application Tab
1. Open browser DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click **Local Storage** → `http://localhost:3000`
4. Right-click and **Clear** or delete `token` and `user` entries
5. Refresh the page

### Option 3: Incognito/Private Window
- Open a new incognito/private window
- Go to `http://localhost:3000`
- This will have no stored auth data

## After Clearing

You should be redirected to the login page. Then:
1. Login with: `admin` / `admin123`
2. You'll be properly authenticated
3. Dashboard should work correctly

