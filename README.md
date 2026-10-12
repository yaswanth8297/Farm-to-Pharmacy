# Farm to Pharmacy (HerbLink) — Android Mobile Application

An AI-enabled B2B mobile marketplace connecting grassroots farmers directly with pharmaceutical companies, Ayurvedic formulation laboratories, and pharmacy technicians. Built with **React Native**, **Expo SDK 57**, and a native **Android Studio Gradle Project**, reproducing all **15 Figma UI Screens** with pixel precision, offline draft caching, dynamic 2D QR batch provenance, and simulated AI leaf classification.

---

## 🌟 Key Features

1. **Dual Role Architecture (Farmer & Pharmacy Buyer)**
   - **Farmer Mode**: AI weed/leaf scanner, 3-minute batch listing wizard, offline draft caching, gamified reward points wallet, printable QR label generator, order dispatch tracker.
   - **Buyer / Pharma Tech Mode**: Filterable medicinal raw herb catalog (Tulsi, Aloe Vera, Neem, Turmeric, Ashwagandha, Brahmi, etc.), AYUSH quality monographs, direct messaging with growers, shopping cart, order placement, and dock QR verification.

2. **Full Implementation of All 15 Figma Screens**
   - **Screen 01**: `SplashScreen.js` — Role selection ("I'm a Farmer" / "I'm a Pharma Tech"), trust badges.
   - **Screen 02**: `FarmerHomeScreen.js` — Amber gold reward balance card (1,240 pts), 3 metric cards (Listings, Earned, Orders), big upload CTA, recent listings, and agrarian tip.
   - **Screen 03**: `FarmerUploadScreen.js` — Field photo picker, 9-plant quick selector, listing details (kg, ₹/kg, harvest date), offline draft caching.
   - **Screen 04**: `FarmerListingsScreen.js` — All / Live / Sold filter chips, earned revenue, points earned, offline draft drawer, and dynamic QR modal trigger.
   - **Screen 05**: `FarmerRewardsScreen.js` — Total points balance, Gold member tier, progress to Platinum bar (1,240 / 1,500 pts), 4 redeemable input vouchers (Pesticide, Fertilizer, Seeds, Free Delivery), points ledger.
   - **Screen 06**: `FarmerOrdersScreen.js` — Sales history (`#F2407`, `#F2406`, `#F2405`, `#F2404`), status chips (Delivered, Processing, Cancelled), buyer chat, dispatch action.
   - **Screen 07**: `NotificationsScreen.js` — Alerts & updates (Order received, Payment confirmed, Points earned, New plant nearby, Delivery), mark all read.
   - **Screen 08**: `FarmerProfileScreen.js` — Verified Organic Farmer (Ramesh Kumar, Pune), stats strip, settings menu, Switch Role to Pharma Tech, Log Out.
   - **Screen 09**: `BuyerHomeScreen.js` — "Good Morning, Dr. Priya", active orders, plants bought, total spent, category pills (Immunity, Skin Care, Digestive, Brain), trending plant cards.
   - **Screen 10**: `BuyerPlantDetailScreen.js` — Large botanical hero image, medicinal benefit chips, farmer contact card, quantity stepper, dynamic QR audit trigger, sticky Add to Cart.
   - **Screen 11**: `BuyerBrowseScreen.js` — Search bar, category filter chips, 10 plants available, 2-column cards grid.
   - **Screen 12**: `BuyerCartScreen.js` — Multi-item cart, quantity adjusters, item removal, order summary (with FREE delivery), Place Order CTA.
   - **Screen 13**: `BuyerOrderPlacedScreen.js` — Animated green checkmark, total order value, delivery ETA (2–3 business days), Continue shopping & View orders.
   - **Screen 14**: `BuyerMyOrdersScreen.js` — Purchase history (`#P1204`, `#P1203`, `#P1202`, `#P1201`), status tags (Out for Delivery, Delivered, Processing), 1-tap reorder, dock scan banner.
   - **Screen 15**: `BuyerProfileScreen.js` — Licensed Pharmacy Technician (Dr. Priya Sharma, Mumbai), stats strip, saved plants, Switch Role to Farmer, Log Out.

3. **Offline Draft Caching (AsyncStorage)**
   - Farmers working in remote rural fields with intermittent internet connectivity can save listings as offline drafts.
   - Drafts are stored locally on the Android device via `@react-native-async-storage/async-storage` and can be synced to the live marketplace with one tap once connection is restored.

4. **Dynamic 2D QR Code & Provenance Audit Modal**
   - Renders a cryptographic 2D SVG QR matrix for every listing and batch.
   - Carries farm GPS district, certified grower name, harvest timestamp, AYUSH Grade A purity certification, moisture percentage, and SHA-256 batch hash.
   - Supports printing bag stickers and sharing digital provenance certificates.

5. **Interactive AI Leaf Scanner (Computer Vision Simulation)**
   - Animated laser viewfinder scanning camera input.
   - Simulates Convolutional Neural Network (CNN) inference in < 1.5 seconds.
   - Returns botanical taxonomy, Hindi vernacular name, confidence score (91%–95%), active chemical constituents (Eugenol, Curcumin, Withanolides), and AYUSH benchmark prices.

---

## 🚀 How to Run the App on an Android Phone

### Option A: Run via Expo Go on Any Android Phone (Quickest & Easiest)
1. Install **Expo Go** from the Google Play Store on your Android phone.
2. Open your terminal and navigate to the project directory:
   ```bash
   cd "herblink-app"
   npm start
   ```
3. A QR code will appear in the terminal.
4. Open the Expo Go app on your phone, tap **Scan QR code**, and scan the QR code from the terminal.
5. The application will immediately load and run with live hot reloading!

### Option B: Open and Build in Android Studio
The project contains pre-generated native Android Studio files inside `herblink-app/android`:
1. Launch **Android Studio**.
2. Select **Open an Existing Project** and choose:
   ```
   c:\Users\yaswa\OneDrive\Documents\Farm to Pharmacy\herblink-app\android
   ```
3. Wait for Gradle sync to complete.
4. Connect your Android phone via USB (with USB Debugging enabled) or start an Android Emulator.
5. Click the green **Run** button (or build the APK via **Build > Build Bundle(s) / APK(s) > Build APK(s)**).

### Option C: Build APK Directly from Terminal
Using the included Gradle wrapper:
```bash
cd "herblink-app/android"
gradlew assembleDebug
```
The debug `.apk` will be generated at:
```
herblink-app/android/app/build/outputs/apk/debug/app-debug.apk
```

### Option D: Run and Test Locally in Web Browser
```bash
cd "herblink-app"
npm run web
```
This opens the mobile responsive app in your web browser (Chrome, Edge, Firefox) at `http://localhost:8081`.

---

## 📁 Project Structure

```
herblink-app/
├── android/                         # Native Android Studio Project (Gradle, Manifest, Java/Kotlin)
│   ├── app/
│   │   ├── src/main/AndroidManifest.xml
│   │   └── build.gradle
│   ├── gradlew.bat
│   └── settings.gradle
├── assets/
│   ├── images/                      # Extracted plant photos, avatars, and role cards
│   │   ├── tulsi.png, neem.png, aloe_vera.png, turmeric.png...
│   │   └── farmer_avatar.png, buyer_avatar.png, logo.png...
│   └── figma-screens/               # 15 Original Figma Screen PNG references
├── src/
│   ├── constants/
│   │   ├── theme.js                 # Colors (#226E3A, #F59E0B, #03695D), radii, status badges
│   │   └── plantData.js             # 10 Botanical species, AYUSH monographs, listings, orders
│   ├── context/
│   │   └── AppContext.js            # Dual role state, cart, orders, rewards, offline drafts
│   ├── components/
│   │   ├── AndroidStatusBar.js      # Realistic Android 9:41 status bar with WiFi & battery
│   │   ├── Header.js                # Solid green top header with greeting & notification bell
│   │   ├── BottomTabBar.js          # Custom Android bottom navigation + floating center Upload
│   │   ├── PlantCard.js             # 2-column card with Hindi/English name, badge, price, stock
│   │   ├── QrProvenanceModal.js     # SVG Dynamic QR generator & public provenance audit sheet
│   │   ├── AiScanModal.js           # Animated laser leaf scanner & CNN identification
│   │   ├── MessageModal.js          # Direct buyer-farmer messaging modal
│   │   └── Toast.js                 # Floating action feedback toast
│   ├── screens/
│   │   ├── SplashScreen.js          # Screen 01: Splash & Role Select
│   │   ├── farmer/
│   │   │   ├── FarmerHomeScreen.js     # Screen 02: Farmer Dashboard
│   │   │   ├── FarmerUploadScreen.js   # Screen 03: Upload Plant & Offline Draft
│   │   │   ├── FarmerListingsScreen.js # Screen 04: My Listings (All, Live, Sold)
│   │   │   ├── FarmerRewardsScreen.js  # Screen 05: Rewards Wallet & Vouchers
│   │   │   ├── FarmerOrdersScreen.js   # Screen 06: Farmer Orders & Sales History
│   │   │   └── FarmerProfileScreen.js  # Screen 08: Farmer Profile & Role Switcher
│   │   ├── buyer/
│   │   │   ├── BuyerHomeScreen.js      # Screen 09: Buyer Dashboard
│   │   │   ├── BuyerPlantDetailScreen.js # Screen 10: Plant Detail & Quantity Stepper
│   │   │   ├── BuyerBrowseScreen.js    # Screen 11: Browse Catalog & Filters
│   │   │   ├── BuyerCartScreen.js      # Screen 12: Cart & Order Summary
│   │   │   ├── BuyerOrderPlacedScreen.js # Screen 13: Order Confirmation
│   │   │   ├── BuyerMyOrdersScreen.js  # Screen 14: Purchase History & Reorder
│   │   │   └── BuyerProfileScreen.js   # Screen 15: Buyer Profile & Role Switcher
│   │   └── shared/
│   │       └── NotificationsScreen.js  # Screen 07: Notifications & Alerts
│   └── utils/
│       └── storage.js               # AsyncStorage persistence for offline drafts & state
├── App.js                           # App root with state navigation & modals
├── app.json                         # Expo & Android package configuration
└── package.json
```

---

## 🏆 Alignment with Academic PRD & Project Report
- **Academic Project**: *Design Thinking and Product Innovation Laboratory*, Dr. Lankapalli Bullayya College of Engineering (Batch 7, 2026).
- **Core Principle**: *Inform → Verify → Connect*.
- **Problem Solved**: Eliminates bio-waste by helping rural growers identify wild medicinal herbs, bypass predatory middlemen (saving 40–65% margin), and deliver traceable batches with verifiable QR provenance to pharmaceutical manufacturers.
