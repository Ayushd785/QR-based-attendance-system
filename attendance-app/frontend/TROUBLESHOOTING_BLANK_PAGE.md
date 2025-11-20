# Troubleshooting Blank Page Issue

## Quick Steps to Fix

### 1. Open Browser Developer Tools
Press **F12** or **Ctrl+Shift+I** (Linux/Windows) or **Cmd+Option+I** (Mac)

### 2. Check Console Tab
Look for any red error messages. Common errors:
- `Cannot find module`
- `Failed to fetch`
- `React is not defined`
- `Uncaught TypeError`

### 3. Check Network Tab
- Look for failed requests (red)
- Check if `main.jsx` is loading
- Verify API calls are working

### 4. Common Fixes

#### Fix 1: Clear Browser Cache
- Hard refresh: **Ctrl+Shift+R** (Linux/Windows) or **Cmd+Shift+R** (Mac)
- Or clear all browser data

#### Fix 2: Reinstall Dependencies
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### Fix 3: Check if Backend is Running
```bash
curl http://localhost:5000/api/health
```
Should return: `{"status":"ok","timestamp":"..."}`

#### Fix 4: Check Port Conflicts
```bash
lsof -i :3000
```
If something is using port 3000, kill it or change port in `vite.config.js`

#### Fix 5: Check Browser Console for Specific Errors
1. Open browser console (F12)
2. Look for the exact error message
3. Share the error message for help

### 5. Test if React is Working

Temporarily replace `App.jsx` content with:
```jsx
function App() {
  return <div style={{padding: '20px'}}>React is working! If you see this, React is fine.</div>;
}
export default App;
```

If you see the message, React works - the issue is in components.
If still blank, there's a React setup issue.

### 6. Check Vite Dev Server

Make sure you see in terminal:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

### 7. Verify File Structure

Make sure these files exist:
- `frontend/src/main.jsx`
- `frontend/src/App.jsx`
- `frontend/src/components/Login.jsx`
- `frontend/index.html`

### 8. Check Import Paths

All imports should use:
- `./` for same directory
- `../` for parent directory
- No `.jsx` extension needed (but can include it)

## Still Not Working?

1. **Share the browser console error** (F12 → Console tab)
2. **Share the terminal output** from `npm run dev`
3. **Check if you can access** `http://localhost:3000` directly

The error boundary I added will now show errors on the page if React crashes.

