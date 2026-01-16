# Gobuster: Common Enumeration Commands

Gobuster is a fast brute-force enumeration tool used to discover hidden content on web servers and infrastructure. It is commonly used to find unlinked directories, files, virtual hosts, and subdomains that are not visible through normal browsing.

In both CTFs and professional penetration tests, Gobuster comes in handy during early web reconnaissance, helping identify attack surfaces such as admin panels, backup files, or internal applications. Its speed and simplicity make it especially effective when quickly mapping a target and uncovering functionality that may lead to further exploitation.
___
This note documents the Gobuster commands I use most often during web enumeration. These commands focus on speed, common use cases, and gathering useful information early when attacking web applications.

They are not exhaustive — just the ones I reach for repeatedly.

---
## Default directory enumeration

```bash
gobuster dir -u http://<IP> -w /path/to/wordlist.txt
```

This is my most commonly used Gobuster command and is usually the first scan  
I run against a web server (along with nmap scan for open ports).
### What it does
- `dir`  
    Runs Gobuster in directory/file brute-forcing mode.
- `-u`
    Specifies the target URL (or IP, depends on what you are given/what you know).
- `-w` 
    Specifies the wordlist to use for enumeration.

Gobuster sends HTTP requests to discover hidden directories and files that are not linked publicly.

### When to use it
- Initial web enumeration
- When a site has minimal visible content
- CTFs, labs, and general recon
---
## Directory enumeration with common extensions

```bash
gobuster dir -u http://<IP> -w /path/to/wordlist.txt -x php,txt,html
```

Adds file extension brute forcing to directory enumeration.

### What it does
- `-x`
    Appends file extensions to each word in the wordlist.
    
This helps identify files that may not appear as directories, such as:
- PHP source files
- configuration or backup files
- static content
### When to use it
- When the application is likely using a specific backend (e.g. PHP)
- After finding directories that look interesting

---
## Directory enumeration with status code filtering

```bash
gobuster dir -u http://<IP> -w /path/to/wordlist.txt -b 404
```

Filters out unwanted HTTP response codes.

### What it does
- `-b`
    Excludes responses with the specified status codes.

This reduces noise when servers return misleading responses for non-existent pages.

### When to use it
- When everything appears to return `200 OK`
- When the output is too noisy to be useful

---
## Virtual host enumeration

```bash
gobuster vhost -u http://<IP> -w /path/to/wordlist.txt
```

Brute forces virtual hosts using the `Host` header.
### What it does
- `vhost`
    Runs Gobuster in virtual host discovery mode.

This is useful for discovering:
- hidden subdomains
- internal applications
- alternate sites hosted on the same IP

### When to use it
- When an IP hosts multiple sites
- After DNS or subdomain enumeration

---
## DNS subdomain enumeration

```bash
gobuster dns -d example.com -w /path/to/wordlist.txt
```

Performs DNS-based subdomain brute forcing.

### What it does
- `dns`
    Uses DNS queries instead of HTTP requests.
- `-d`
    Specifies the target domain.
### When to use it
- Early recon against a domain
- When HTTP-based enumeration isn’t possible

---
## Increasing speed (labs / CTFs)

```bash
gobuster dir -u http://<IP> -w /path/to/wordlist.txt -t 50
```

Increases the number of concurrent threads.

### What it does
- `-t`
    Sets the number of threads used by Gobuster.

Higher thread counts significantly speed up scans but increase noise.

### When to use it
- Labs and CTFs
- Never against production systems without permission

---
## Outputting results to a file

```bash
gobuster dir -u http://<IP> -w /path/to/wordlist.txt -o filename.txt
```

Saving output makes it easier to:
- review results later
- search for keywords
- include findings in writeups

---
## Overview and tips

|Option / Flag|Description|
|---|---|
|dir|Directory and file brute forcing mode|
|vhost|Virtual host discovery mode|
|dns|DNS subdomain enumeration mode|
|-u|Target URL|
|-d|Target domain (DNS mode)|
|-w|Wordlist to use|
|-x|File extensions to append|
|-b|Exclude specific HTTP status codes|
|-t|Number of concurrent threads|
|-o|Output results to a file|

- I usually start with **dir mode** and expand as needed
- Combine Gobuster results with manual testing and `curl`
- Enumeration is iterative — rerun scans as new information appears
- **Only scan targets you own or have permission to test**

This note will be updated as my workflow evolves.
