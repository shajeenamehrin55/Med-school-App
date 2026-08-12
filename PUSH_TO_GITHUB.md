# Pushing this to your repo

I can't reach the network from this sandbox, so I can't push directly —
here's the exact sequence to do it yourself (2 minutes).

## 1. Get the web app into your repo

Unzip `med-school-app-web.zip`. It contains: `index.html`, `style.css`,
`app.js`, `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`.

```bash
git clone https://github.com/shajeenamehrin55/Med-school-App.git
cd Med-school-App

# copy the unzipped files in, replacing what's there
cp /path/to/unzipped/med-school-app/* .

git add .
git commit -m "Rebuild as functional PWA: real spaced repetition, live prayer times, focus lockdown"
git push origin main
```

GitHub Pages will redeploy automatically (same as your current site) —
check **Settings > Pages** in the repo to confirm it's still serving
from the branch/folder you push to.

## 2. (Optional) Add the native Android scaffold to the same repo

Unzip `med-school-app-native-android.zip` as a subfolder so the repo
holds both the live web app and the native project:

```bash
cd Med-school-App
cp -r /path/to/unzipped/med-school-app-native ./android-native
git add android-native
git commit -m "Add native Android scaffold for phone-wide lockdown"
git push origin main
```

Then open `android-native/` in Android Studio to continue — see
`android-native/README.md` for the exact remaining steps (icon,
block-list UI, Play Console setup).

## 3. Quick sanity check after pushing

Visit `https://shajeenamehrin55.github.io/Med-school-App/` a minute or
two after the push (GitHub Pages takes a little time to rebuild) and
confirm:
- Dashboard loads with real numbers (0s at first — that's correct, no data yet)
- Study tab shows the seeded flashcard deck and lets you rate cards
- Lockdown tab starts a real countdown
- Settings tab lets you set your city so the prayer countdown works
