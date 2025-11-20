# Frontend Debugging Guide

If you see a blank page, check the following:

## 1. Open Browser Console (F12)
Look for JavaScript errors. Common issues:
- Import errors
- Module not found
- React errors

## 2. Check Network Tab
- Are all files loading?
- Any 404 errors?
- Check if API calls are working

## 3. Common Issues

### Issue: Blank white page
**Possible causes:**
- JavaScript error preventing React from rendering
- Missing component files
- Import path errors

### Issue: "Cannot find module"
**Solution:**
```bash
cd frontend
rm -rf node_modules
npm install
```

### Issue: TailwindCSS not working
**Solution:**
- Check if `index.css` is imported in `main.jsx`
- Verify `tailwind.config.js` exists
- Check `postcss.config.js` exists

## 4. Quick Fixes

### Clear browser cache:
- Hard refresh: Ctrl+Shift+R (Linux/Windows) or Cmd+Shift+R (Mac)
- Or clear browser cache completely

### Reinstall dependencies:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Check if backend is running:
```bash
curl http://localhost:5000/api/health
```

## 5. Test React is Working

Create a simple test component to verify React is rendering:

```jsx
// Test in App.jsx - temporarily replace with:
function App() {
  return <div>React is working!</div>;
}
```

If this shows, React is working and the issue is in components.
If this is blank, there's a React setup issue.

