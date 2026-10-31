# Nmap Scan Patterns I Use Frequently

This note documents the Nmap scan patterns I use most often during
enumeration. These commands are focused on speed, useful defaults,
and gathering actionable information early.

They are not exhaustive — just the ones I reach for repeatedly.

---

## Default enumeration scan

```bash
nmap -sC -sV <IP>
```

This is my most commonly used Nmap command and usually the first scan  
I run against a target.
### What it does
- `-sC`  
    Runs Nmap’s default scripts. These scripts perform safe checks such as:
    - service discovery
    - basic authentication checks
    - common misconfigurations
- `-sV`  
    Attempts to detect service versions running on open ports.  
    This is essential for identifying:
    - outdated software
    - known vulnerable services
    - misidentified ports
### When to use it
- Initial enumeration
- When you want meaningful output without overthinking options
- CTFs, labs, and general recon
- ---
## Full port scan with service detection

```bash
nmap -p- -sC -sV <IP>
```

Combines a full port scan with default scripts and version detection.
### When to use it
- When you want completeness over speed
- When the target is stable and rate-limiting is unlikely

---
## Aggressive scan

```bash
 nmap -A <IP>
```

Runs OS detection, version detection, script scanning, and traceroute.
### Additional info
- Very noisy
- Slower
- Not always necessary

### When to use it
- Labs and practice environments
- Never on targets without permission

---
## UDP scan (basic)

```bash
nmap -sU <IP>
```

UDP scans are slow and noisy, but sometimes necessary.

### When to use it
- When TCP scans don’t reveal enough
- When you suspect services like DNS, SNMP, or TFTP

---

## Outputting results to a file

```bash
nmap -sC -sV <IP> -oN scan.txt
```

Saving scan results makes it easier to:
- review findings later
- search for keywords
- include output in writeups

---
## Overview and tips

| Option / Flag        | Description |
|----------------------|-------------|
| `-sC`               | Runs Nmap’s default set of safe scripts. These scripts perform basic enumeration such as service checks, common misconfigurations, and light authentication testing. |
| `-sV`               | Attempts to detect the version of services running on open ports. Useful for identifying outdated or vulnerable software. |
| `-p-`               | Scans all 65,535 TCP ports instead of only the top 1000. Essential when services may be running on non-standard ports. |
| `--min-rate 1000`   | Forces Nmap to send packets at a minimum rate, significantly speeding up scans in lab or CTF environments. |
| `-A`                | Enables aggressive scanning, including OS detection, version detection, script scanning, and traceroute. Very noisy and slow. |
| `-sU`               | Performs a UDP scan. UDP scans are slower and less reliable but necessary for discovering certain services like DNS or SNMP. |
| `-oN <file>`        | Outputs scan results in a normal, human-readable format to a file. Useful for documentation and writeups. |
| `<IP>`              | The target IP address or hostname being scanned. |

- I usually start with `-sC -sV` and expand from there
- Enumeration is iterative — rerun scans as new information appears
- Scan responsibly and only against targets you own or have permission to test

This note will be updated as my workflow evolves.