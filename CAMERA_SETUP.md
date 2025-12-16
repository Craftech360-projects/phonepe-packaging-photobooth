# Camera Access Fix for Tablets - Setup Guide

## The Problem

Modern browsers require **HTTPS (secure connection)** to access the camera, except when using `localhost`. When you access your app from a tablet using your computer's IP address (like `http://192.168.x.x:5173`), the browser blocks camera access because it's not a secure connection.

## The Solution

I've configured your app to run with HTTPS using a self-signed certificate. This will allow camera access from tablets on your local network.

## How to Run the App with HTTPS

### Step 1: Stop the Current Server

If your dev server is still running, stop it with `Ctrl+C` in the terminal.

### Step 2: Start the Server with HTTPS

Run the development server normally:

```bash
npm run dev
```

The server will now start with HTTPS enabled and will be accessible from your local network.

### Step 3: Find Your Server Address

When the server starts, you'll see output like:

```
VITE v7.3.0  ready in 105 ms

➜  Local:   https://localhost:5173/
➜  Network: https://192.168.1.100:5173/
```

**Use the Network URL** (the one with your local IP address) to access from your tablet.

### Step 4: Access from Tablet

1. **Open your tablet's browser** (Chrome, Safari, etc.)
2. **Type the Network URL** from Step 3 (e.g., `https://192.168.1.100:5173/`)
3. **Accept the security warning**:

   - **Chrome/Android**: Tap "Advanced" → "Proceed to [IP address] (unsafe)"
   - **Safari/iPad**: Tap "Show Details" → "visit this website"

   ⚠️ This warning appears because we're using a self-signed certificate. It's safe to proceed on your local network.

4. **Allow camera permissions** when prompted

## Improved Error Messages

I've also updated the camera code to provide specific error messages:

- ✅ **Permission denied** - Shows instructions to enable camera in browser settings
- ✅ **No camera found** - Indicates the device doesn't have a camera
- ✅ **Camera in use** - Another app is using the camera
- ✅ **HTTPS required** - Reminds you to use https:// instead of http://
- ✅ **Fallback constraints** - Tries basic camera settings if ideal settings fail

## Troubleshooting

### Camera still not working?

1. **Check the URL** - Make sure it starts with `https://` not `http://`
2. **Check browser console** - Open developer tools to see the specific error
3. **Try a different browser** - Some browsers handle permissions differently
4. **Restart the browser** - Close all tabs and reopen
5. **Check tablet settings** - Ensure camera permissions are enabled for the browser app

### Certificate warnings on every visit?

This is normal with self-signed certificates. For production deployment, use a proper SSL certificate from your hosting provider.

### Can't connect from tablet?

1. **Check same network** - Ensure tablet and computer are on the same WiFi
2. **Check firewall** - Your computer's firewall might be blocking connections
3. **Try the IP address** - Use the exact Network URL shown in the terminal

## For Production Deployment

When you deploy to a real server (Netlify, Vercel, etc.), they provide proper SSL certificates automatically, so you won't need to accept security warnings.

## What Changed

### Files Modified:

1. **[vite.config.js](file:///Users/cft_mac_mini/Documents/packaging-photobooth/vite.config.js)**

   - Added `@vitejs/plugin-basic-ssl` for automatic HTTPS
   - Enabled `host: true` to listen on all network interfaces

2. **[src/App.jsx](file:///Users/cft_mac_mini/Documents/packaging-photobooth/src/App.jsx)**

   - Improved camera error handling with specific messages
   - Added fallback camera constraints for better device compatibility
   - Detects HTTPS requirement and shows appropriate message

3. **package.json**
   - Added `@vitejs/plugin-basic-ssl` dependency

## Quick Reference

```bash
# Start server with HTTPS
npm run dev

# The server will show:
# ➜  Local:   https://localhost:5173/
# ➜  Network: https://192.168.x.x:5173/  ← Use this on tablet
```

---

**Ready to test!** Restart your dev server and access the Network URL from your tablet. The camera should now work after accepting the certificate warning. 📷✨
