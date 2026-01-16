# How to Test for CVE-2025-55182 Using React2Shell Scanner

**CVE-2025-55182** is a vulnerability affecting certain Next.js / React server-side rendering setups, where improper handling of server-side rendering errors can leak internal application behavior. It was disclosed in **late 2025, in December**, and allows attackers to trigger observable server-side errors that indicate a vulnerable configuration, potentially enabling further exploitation paths.
This guide walks through a **hands-on method for testing CVE-2025-55182** using the **React2Shell scanner**. You will set up both a **deliberately vulnerable application** and a **standard, non-vulnerable Next.js application**, scan both targets, and compare the results.

More info: https://nvd.nist.gov/vuln/detail/CVE-2025-55182

The goal is to help you:
- understand how the vulnerability is detected
- verify scanner behavior in a safe and vulnerable environment
- know what results to expect when testing real applications

This tutorial is suitable for **CTFs, lab environments, learning AppSec, and professional security testing**.

---

## What You Will Build

By the end of this guide, you will have:
- a vulnerable Next.js application affected by CVE-2025-55182
- a clean, non-vulnerable Next.js application
- hands-on experience running React2Shell in safe detection mode
- a clear understanding of vulnerable vs non-vulnerable scan output

---

## Environment Overview
The setup used in this guide:
- **Windows host**
    - Docker Desktop installed
    - WSL (Windows Subsystem for Linux) enabled
- **Docker**
    - Used to run the intentionally vulnerable application
- **WSL (Kali Linux)**
    - Used to run the React2Shell scanner
    - Used to create and run the safe Next.js application

> You can adapt this to Linux or macOS easily, but the steps below assume **Windows + Docker + WSL (Kali)**.

---

## 1. Setting Up a Vulnerable Application (CVE-2025-55182)

To safely test detection, we use a **publicly available, intentionally vulnerable Docker image** created specifically to demonstrate CVE-2025-55182.

### Run the vulnerable container (Powershell or CMD)

```Powershell
docker run --rm -p 127.0.0.1:3000:3000 ghcr.io/l4rm4nd/cve-2025-55182:latest
```

Once running, open your browser and visit:

`http://127.0.0.1:3000/`

This application is **known to be vulnerable** and serves as a baseline for expected detection.

---

## 2. Installing the React2Shell Scanner

In a Kali WSL terminal clone the React2Shell scanner repository:
```bash
git clone https://github.com/assetnote/react2shell-scanner.git cd react2shell-scanner
```

The scanner is written in Python and does not require additional setup beyond standard dependencies.

**All scanning is performed from Kali Linux running in WSL.**

---

## 3. Scanning the Vulnerable Application

Now run the scanner in **safe-check mode**, which performs non-intrusive, behavior-based detection.

```bash
python3 scanner.py -u http://127.0.0.1:3000 --safe-check
```

### Expected result (vulnerable target)

`[VULNERABLE] http://127.0.0.1:3000 - Status: 500`

**Scan summary:**

```
============================================================ SCAN SUMMARY ============================================================ 
Total hosts scanned: 1 
Vulnerable: 1 
Not vulnerable: 0 
Errors: 0 
============================================================
```

At this point, the scanner has correctly identified the vulnerable application.

---

## 4. Setting Up a Safe (Non-Vulnerable) Next.js Application

Next, create a clean Next.js application to confirm how a **non-vulnerable target** behaves.

### Create a new Next.js project (inside WSL)

```bash
npx create-next-app@latest safe-next
```

The project will be created in a directory called `safe-next`.

### Start the application

```bash
cd safe-next npm run dev -- -p 3001
```


The application will be accessible at:

`http://127.0.0.1:3001`

This represents a **default, patched Next.js setup**.

---

## 5. Scanning the Safe Application

Run the same scan against the safe target:

```bash
python3 scanner.py -u http://127.0.0.1:3001 --safe-check
```

### Expected result (safe target)

`[NOT VULNERABLE] http://127.0.0.1:3001 - Status: 404`

**Scan summary:**

```
============================================================ SCAN SUMMARY ============================================================ 
Total hosts scanned: 1
Vulnerable: 0 
Not vulnerable: 1 
Errors: 0 
============================================================
```

The scanner correctly reports that the application is **not vulnerable**.

---

## 6. Comparing Results

|Application Type|Port|Expected Result|Scanner Output|
|---|---|---|---|
|Vulnerable demo application|3000|Vulnerable|Vulnerability detected|
|Default Next.js application|3001|Safe|Not vulnerable|

This side-by-side comparison makes it easy to understand how CVE-2025-55182 detection looks in practice.

---

## 7. How to Use This in Practice

Once you understand the expected output, you can apply the same process to real targets:

```bash
python3 scanner.py -u <TARGET_URL> --safe-check
```

### Why use `--safe-check`
- no exploitation
- no payload execution
- suitable for internal testing and production-adjacent systems
- ideal for early detection and triage

---
## Conclusion

This tutorial demonstrates a practical, repeatable method for testing **CVE-2025-55182** using the React2Shell scanner. By setting up both vulnerable and safe environments, you can confidently interpret scan results and understand what true positives and clean results look like.

**This approach allows testers to safely learn, validate, and apply CVE-2025-55182 detection in real-world scenarios.**