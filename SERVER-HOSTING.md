# Frankfurt server — simple setup

1. Upload this complete folder. Do not remove `assets` or `planck.mjs`.
2. Select Node.js 24.
3. Set the start command to:

```text
npm start
```

4. Add these environment variables:

```text
NC11_HOST=0.0.0.0
NC11_ADMIN_PASSWORD=Chicken999!
```

5. Start or deploy the server.
6. Open `https://one1v11.onrender.com/health`. If it shows `"ok":true`, the server is working.

The hosting provider supplies the port automatically. Do not enable `NC11_TESTING`.

For later server updates, keep the same domain and settings: replace the files and redeploy. Players continue connecting to the same address automatically.
