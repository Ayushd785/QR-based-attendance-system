# Fixing Blank Page Issue

## Step-by-Step Debugging

### 1. Open Browser Console (CRITICAL!)
- Press **F12** or **Ctrl+Shift+I**
- Go to **Console** tab
- Look for **RED error messages**
- **Copy and share any errors you see**

### 2. Check Network Tab
- In DevTools, click **Network** tab
- Refresh the page (F5)
- Look for files with **red status** (failed to load)
- Check if `main.jsx` loads successfully

### 3. Quick Test - Temporarily Replace App.jsx

To test if React is working, temporarily replace `frontend/src/App.jsx` with:

```jsx
function App() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1 style={{ color: 'green' }}>✅ React is Working!</h1>
      <p>If you see this, React is rendering correctly.</p>
    </div>
  );
}

export default App;
```

**If you see the green message:**
- React is working ✅
- The issue is in your App component
- Restore the original App.jsx and check for errors

**If still blank:**
- React setup issue
- Check browser console for errors
- Check if TailwindCSS is loading

### 4. Check TailwindCSS

The blank page might be because TailwindCSS isn't loading. Check:

1. Open browser console (F12)
2. Go to **Network** tab
3. Look for `index.css` - is it loading?
4. Check if styles are applied (inspect element)

### 5. Common Issues & Fixes

#### Issue: "Cannot find module"
**Fix:**
```bash
cd frontend
rm -rf node_modules
npm install
```

#### Issue: "Failed to fetch" or Network errors
**Fix:**
- Check if backend is running: `curl http://localhost:5000/api/health`
- Check CORS settings

#### Issue: TailwindCSS not working
**Fix:**
- Verify `tailwind.config.js` exists
- Verify `postcss.config.js` exists
- Check `index.css` imports Tailwind

### 6. Hard Refresh
- **Ctrl+Shift+R** (Linux/Windows)
- **Cmd+Shift+R** (Mac)
- Or clear browser cache completely

### 7. Check Terminal Output
Look at the terminal where `npm run dev` is running:
- Are there any error messages?
- Does it say "ready in xxx ms"?
- Any red error text?

## What to Share for Help

1. **Browser Console Errors** (F12 → Console tab)
2. **Network Tab** - any failed requests?
3. **Terminal Output** from `npm run dev`
4. **What you see** - completely blank? Any text? Any errors?

## Quick Fix Commands

```bash
# Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install

# Restart dev server
npm run dev

# Check if backend is running
curl http://localhost:5000/api/health
```

