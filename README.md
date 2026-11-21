# Redro Islamic

تطبيق إسلامي عربي يعمل كتطبيق Web/PWA ويمكن تغليفه كتطبيق Android عبر Capacitor.

## الميزات

- مواقيت الصلاة حسب الموقع عبر [AlAdhan API](https://aladhan.com/prayer-times-api).
- مصحف وأذكار وسبحة وقبلة وحاسبة زكاة وتتبع يومي.
- إعدادات لإشعارات كل صلاة بشكل مستقل.
- جدولة إشعارات محلية على Android للأيام السبعة القادمة.
- معاينة واختيار أصوات أذان متعددة من AlAdhan.
- حفظ الإعدادات والموقع والتقدم محليًا في `localStorage`.

## تشغيل الويب

افتح `index.html` عبر خادم HTTP محلي حتى يعمل Service Worker والموقع الجغرافي.

## بناء Android

```bash
npm install
npm run build
npx cap add android
npx cap sync android
cd android && ./gradlew assembleDebug
```

الناتج يكون داخل `android/app/build/outputs/apk/debug/`.

> يحتاج Android 13 إلى صلاحية الإشعارات. وتحتاج جدولة الأوقات الدقيقة على Android 12+ إلى السماح بالمنبهات الدقيقة من إعدادات النظام. صوت الإشعار المضمّن في APK هو الأذان الافتراضي، بينما تتيح الإعدادات معاينة أصوات المؤذنين.
