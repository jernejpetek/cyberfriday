# Operating System Internals and Active Directory Attack Defense

This article explores Windows and Linux security internals, Active Directory attack vectors, API security risks, malware evasion techniques, and penetration testing methodology. It connects host-level controls with enterprise identity infrastructure and examines how privilege escalation and credential compromise affect domain security. The goal is to bridge theoretical understanding with practical exploitation and defense patterns.

These notes were prepared as part of my own structured learning process using officially purchased study material. They are intended to reinforce understanding and provide additional depth beyond surface-level exam preparation.

------------------------------------------------------------------------

# Chapter 49: Windows Security Internals

Modern enterprise environments rely heavily on Windows-based systems.
Understanding Windows security architecture is critical for both defense
and examination readiness.

## Security Account Manager (SAM)

The Security Account Manager stores local user account credentials in
hashed form. Attackers targeting Windows systems frequently attempt to
extract these hashes for offline cracking or pass-the-hash attacks.

Access to SAM is restricted by the operating system. However, if
administrative privileges are obtained, attackers may dump credentials
using memory scraping tools.

## LSASS (Local Security Authority Subsystem Service)

LSASS manages authentication and stores credential material in memory
for active sessions.

Credential dumping tools often target LSASS memory to extract plaintext
passwords or NTLM hashes.

Modern defenses include: 
- Credential Guard 
- Protected Process Light(PPL) 
- Limiting administrative privileges

## User Account Control (UAC)

UAC limits administrative privilege escalation by requiring consent for
elevated tasks.

Misconfiguration or disabling UAC weakens host-level defense.

## Service Accounts

Service accounts run background processes. Improperly configured service
accounts with excessive privileges can be exploited for lateral
movement.

Managed service accounts reduce password management exposure.

------------------------------------------------------------------------

# Chapter 50: Active Directory Attack Vectors and Defense

Active Directory (AD) centralizes identity and authorization in Windows
domains.

## Domain Controllers

Domain controllers store directory databases and manage authentication
requests.

If a domain controller is compromised, attackers may gain full domain
control.

## Kerberoasting

Attackers request service tickets for service accounts and attempt
offline cracking of the ticket hashes.

Mitigation: 
- Strong service account passwords 
- Use of managed service accounts

## Golden Ticket Attacks

If attackers obtain the KRBTGT account hash, they can forge Kerberos
tickets granting arbitrary privileges.

Mitigation includes: 
- Securing domain controllers 
- Rotating KRBTGT keys after compromise

## Group Policy Objects (GPO)

GPOs enforce configuration settings across domain systems.

Improper GPO permissions allow attackers to push malicious policies.

------------------------------------------------------------------------

# Chapter 51: API Security and Modern Web Architecture

Modern applications frequently expose RESTful APIs.

## API Attack Surface

APIs may be vulnerable to:

- Broken object-level authorization
- Insecure direct object references
- Insufficient rate limiting
- Injection attacks
- Improper authentication

## JSON Web Tokens (JWT)

JWTs encode authentication claims.

Improper signature validation or weak signing keys allow token forgery.

Tokens must be signed and validated securely.

## Server-Side Request Forgery (SSRF)

SSRF exploits occur when applications fetch remote resources based on
user-supplied input.

Attackers may target internal services or cloud metadata endpoints.

Mitigation requires strict URL validation and network segmentation.

------------------------------------------------------------------------

# Chapter 52: Advanced Malware Evasion Techniques

Malware authors design payloads to evade detection.

## Obfuscation

Code is modified to appear benign or unreadable.

Techniques include: 
- Packing 
- Encryption of payload sections 
- Polymorphic code generation

## Living off the Land (LotL)

Attackers abuse legitimate system tools such as PowerShell or WMI to
avoid detection.

Behavioral monitoring is required to detect misuse of legitimate tools.

## Rootkits

Rootkits modify operating system components to hide processes and files.

Kernel-level rootkits are particularly difficult to detect.

------------------------------------------------------------------------

# Chapter 53: Penetration Testing Methodology

Penetration testing simulates adversarial attacks in a controlled
environment.

## Phases of Testing

1. Scoping and authorization
2. Reconnaissance
3. Vulnerability identification
4. Exploitation
5. Post-exploitation
6. Reporting

Authorization is mandatory before testing begins.

## Reconnaissance Techniques

Passive reconnaissance collects publicly available information. Active
reconnaissance interacts directly with target systems.

## Reporting

Effective reports include:

- Executive summary
- Technical findings
- Risk ratings
- Remediation guidance

Clear documentation ensures value beyond the testing engagement.

------------------------------------------------------------------------

# Chapter 54: Secure Configuration Baselines

Secure configuration reduces attack surface.

## Baseline Standards

Organizations define secure configuration templates for:

- Operating systems
- Network devices
- Cloud environments
- Applications

Configuration drift occurs when systems deviate from approved baselines.

Automated compliance scanning identifies deviations.

------------------------------------------------------------------------

End of Part 8.
