# SPA Routing Configuration Guide

When you navigate directly to routes like `/about-us`, the server needs to be configured to serve `index.html` for all routes so React Router can handle the routing client-side.

## The Issue

When you visit `/about-us` directly:
- The server looks for a physical file at that path
- It doesn't find it (because it's a React Router route, not a file)
- The server either returns 404 or redirects to home

## Solutions by Hosting Platform

### Netlify
The `_redirects` file in the `public` folder will handle this automatically after build.

### Vercel
The `vercel.json` file will handle this automatically.

### Apache (cPanel, shared hosting)
The `.htaccess` file will handle this automatically.

### Nginx
Use the `nginx.conf` configuration provided. Update your Nginx server config to include:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Express/Node.js Server
If serving the frontend with Express, add this catch-all route:
```javascript
app.use(express.static('dist')); // or 'build' depending on your build output

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
```

### Development
During development with `npm run dev`, Vite handles this automatically. The issue only occurs in production builds.

## Testing

After deployment:
1. Build your app: `npm run build`
2. Deploy with the appropriate config file
3. Test direct navigation: `yourdomain.com/about-us`
4. It should work without redirecting to home

## Common Routes in Your App

- `/` - Home
- `/about-us` - About Us
- `/join` - Join/Register
- `/events` - Events
- `/faq` - FAQ
- `/policy` - Policy
- `/terms` - Terms
- `/partner` - Partner
- `/contact` - Contact
- `/admin/login` - Admin Login
- `/admin/dashboard` - Admin Dashboard

