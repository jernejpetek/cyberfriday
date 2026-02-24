
# Cryptography, PKI, and Network Defense: A Deeper Technical Exploration

------------------------------------------------------------------------
This article continues the cybersecurity deep-dive series by moving beyond foundational principles into the mechanics of how security controls actually function at a technical level. Rather than presenting high-level summaries, this material examines how cryptographic algorithms operate internally, how trust is established through public key infrastructure, how network segmentation limits lateral movement, and how attack techniques exploit architectural weaknesses.

These notes were prepared by me as part of my structured study process using officially purchased learning materials. They reflect my own interpretation and organization of the concepts. They are not intended to replace official certification guides or serve as a standalone exam-preparation resource. Instead, they are designed to reinforce understanding and provide additional technical depth for learners who want to understand not just what security controls do, but how and why they work.
___
# Chapter 6: Advanced Cryptographic Mechanics

Cryptography is not simply the act of encrypting data. It is a
structured mathematical discipline that governs how trust is
established, how secrets are protected, and how identity is verified in
distributed systems.

## Symmetric Encryption -- Internal Mechanics

Symmetric encryption operates using substitution and permutation
principles. Modern symmetric algorithms such as AES rely on iterative
rounds of transformation. Each round typically includes:

- Substitution (non-linear transformation)
- Permutation (rearrangement of bits)
- Mixing operations
- Key addition

AES uses fixed block sizes of 128 bits and variable key lengths (128,
192, 256 bits). The number of transformation rounds depends on the key
length.

The security of symmetric encryption depends on: 
- Key entropy 
- Secure key storage 
- Protection against brute-force attempts 
- Proper implementation (avoiding side-channel leakage)

Modes of operation define how block ciphers process larger data streams:

- ECB (Electronic Codebook) -- insecure due to pattern leakage
- CBC (Cipher Block Chaining) -- introduces chaining dependency
- GCM (Galois/Counter Mode) -- provides authenticated encryption

Authenticated encryption ensures both confidentiality and integrity in
one operation.

## Asymmetric Encryption -- Mathematical Basis

Asymmetric cryptography relies on mathematical asymmetry. RSA depends on
the difficulty of factoring large integers. Elliptic Curve Cryptography
(ECC) relies on the complexity of discrete logarithm problems over
elliptic curves.

Public keys may be widely distributed. Private keys must remain
confidential.

Digital signatures operate as follows:

1. A hash is generated from data.
2. The hash is encrypted with the private key.
3. The recipient decrypts the signature using the public key.
4. The recipient compares the decrypted hash to a newly generated hash
    of the received data.

If they match, integrity and authenticity are confirmed.

Nonrepudiation depends on exclusive control of the private key.

## Hashing and Collision Resistance

Hash functions must demonstrate: 
- Preimage resistance 
- Second preimage resistance 
- Collision resistance

If two different inputs produce the same hash output (collision), trust
in the algorithm weakens.

Hashing is used in: 
- Digital signatures 
- File verification 
- Password storage 
- Blockchain validation

Password hashing requires salting and iterative processing (key
stretching) to resist brute-force attacks.

------------------------------------------------------------------------

# Chapter 7: Public Key Infrastructure (PKI)

PKI establishes trust relationships in distributed systems.

## Certificate Lifecycle

A digital certificate binds a public key to an identity. The certificate
lifecycle includes:

- Key pair generation
- Certificate Signing Request (CSR)
- Validation by Certificate Authority (CA)
- Certificate issuance
- Revocation (CRL or OCSP)
- Expiration and renewal

Trust chains begin at a root CA. Intermediate CAs extend trust hierarchy
while protecting the root key.

If a certificate is compromised, revocation mechanisms must invalidate
trust immediately.

## Online Certificate Status Protocol (OCSP)

OCSP allows real-time certificate validation. Instead of downloading an
entire revocation list, systems query the CA for certificate status.

Failure to validate certificate status creates exposure to
man-in-the-middle attacks.

------------------------------------------------------------------------

# Chapter 8: Network Security Architecture

## VLAN Segmentation and 802.1Q Tagging

Virtual LANs logically separate broadcast domains within a switch.

802.1Q tagging inserts a VLAN identifier into Ethernet frames. This
allows trunk ports to carry traffic for multiple VLANs.

Security considerations include:
- VLAN hopping attacks 
- Native VLAN misconfiguration 
- Improper trunk configuration

Inter-VLAN communication requires routing at Layer 3.

Segmentation limits lateral movement during compromise.

## Firewalls and Rule Processing

Firewalls operate based on rule evaluation. Rules are processed
sequentially. The first match determines action.

Types of firewalls include:
- Packet filtering 
- Stateful inspection 
- Application-layer filtering

Stateful firewalls track session state. Application-layer firewalls
inspect payload data.

Improper rule ordering may unintentionally allow malicious traffic.

## Intrusion Detection vs Prevention

Intrusion Detection Systems (IDS) monitor traffic and generate alerts.

Intrusion Prevention Systems (IPS) actively block malicious traffic.

Detection methods include:
- Signature-based detection 
- Anomaly-based detection 
- Behavior-based detection

Establishing a baseline is necessary for anomaly detection accuracy.

------------------------------------------------------------------------

# Chapter 9: Attack Techniques and Exploitation

## Directory Traversal Mechanics

Directory traversal exploits insufficient input validation in web
applications.

By manipulating file path input parameters (e.g., using ../ sequences),
attackers may access restricted files.

Proper mitigation requires: 
- Input sanitization 
- Canonical path validation 
- Principle of least privilege for application processes

## LDAP Injection

LDAP injection occurs when unsanitized input is incorporated into
directory queries.

Attackers may manipulate query filters to bypass authentication or
retrieve unauthorized data.

Parameterized queries prevent injection vulnerabilities.

## Smurf Amplification Attacks

Smurf attacks leverage broadcast amplification.

The attacker sends ICMP echo requests to a broadcast address while
spoofing the victim's IP.

All hosts respond to the victim, overwhelming its network capacity.

Mitigation includes: 
- Disabling IP-directed broadcasts 
- Filtering spoofed traffic

## Password Spraying vs Dictionary Attacks

Password spraying attempts one password across many accounts to avoid
lockout thresholds.

Dictionary attacks attempt many passwords against one account.

Lockout policies and monitoring failed login patterns mitigate
credential attacks.

------------------------------------------------------------------------

# Chapter 10: Incident Response and Operational Security

## Incident Response Depth

Preparation includes: 
- Defined roles 
- Communication channels 
- Forensic readiness 
- Backup verification

Containment strategies include:
- Network isolation 
- Credential resets 
- Blocking malicious IP ranges

Eradication removes malware, closes vulnerabilities, and patches
exploited systems.

Recovery restores systems to operational state while monitoring for
reinfection.

Lessons learned update procedures and improve detection controls.

## Security Information and Event Management (SIEM)

SIEM systems collect logs from multiple sources and correlate events.

Correlation rules detect suspicious patterns across disparate systems.

Retention policies ensure compliance and forensic capability.

## Security Orchestration, Automation, and Response (SOAR)

SOAR platforms automate response workflows through predefined playbooks.

Automation reduces response time and minimizes human error.

------------------------------------------------------------------------

# Chapter 11: Risk Management and Governance

## Quantitative Risk Analysis

Risk is calculated as probability multiplied by impact.

Single Loss Expectancy (SLE) represents financial impact of a single
event.

Annualized Rate of Occurrence (ARO) estimates frequency.

Annualized Loss Expectancy (ALE) = SLE × ARO.

Risk treatment options include: 
- Mitigation
- Transfer
- Acceptance
- Avoidance

Cybersecurity insurance represents risk transfer.

## Business Impact Analysis (BIA)

BIA identifies: 
- Critical systems
- Recovery Time Objective (RTO)
- Recovery Point Objective (RPO)
- Financial and operational impact

Testing continuity plans ensures readiness.

------------------------------------------------------------------------

End of Part 2.
