# Taskly Android APK — Hinglish Guide

## APK download karne ke steps
1. Repository ke **Actions** tab par jao: https://github.com/RaviYadav761/TaskManager761/actions
2. **Build Taskly Android APK** workflow select karo.
3. **Run workflow** par click karo aur branch `main) select karke run karo.
4. Workflow complete hone ka wait karo. Green tick aane par run open karo.
5. Neeche **Artifacts** section se `taskly-debug-apk` download karo.
6. Downloaded ZIP extract karo. Uske andar `app-debug.apk` milega.
7. APK phone mein open karke install karo. Android prompt aaye to sirf is APK ke liye install permission allow karo.

## Important
- Ye testing ke liye **debug APK** hai, Play Store release-signed APK nahi.
- App tumhare existing React/Vite UI ko Android WebView ke andar package karta hai. Har screen ka mobile layout aur device testing alag se verify karna zaroori hai.
- Login, tasks save hona, API/chatbot aur automation features phone par test karo.
- Agar app data browser localStorage mein save hota hai, app data clear ya uninstall karne se woh delete ho sakta hai.
- Workflow fail ho to Actions run ke logs ka screenshot share karo, main fix karne mein help karunga.
