# Deep Foundations of Cybersecurity: Core Principles Explained

This article is part of a broader cybersecurity deep-dive series designed to strengthen foundational understanding for students and professionals preparing for certifications such as CompTIA Security+. Rather than serving as an exam checklist, this material focuses on explaining the underlying concepts that govern secure system design, identity management, cryptography, and operational defense. It is intended to reinforce comprehension and provide technical clarity that extends beyond memorization.

These notes were prepared by me based on the study materials I personally purchased and worked through during my certification preparation. They reflect my own structured understanding and interpretation of the topics. They are not intended to replace official study guides, instructor-led training, or authorized certification resources, and should not be used as a standalone source for exam preparation. Instead, they are meant to serve as supplemental reinforcement and deeper conceptual clarification alongside primary study materials.


------------------------------------------------------------------------

# Chapter 1: Core Security Principles

Security engineering begins with the control of trust. Every system must
determine who is allowed to interact with resources, how that identity
is verified, and what protections remain in place after access is
granted.

The three foundational properties that govern secure system design are
confidentiality, integrity, and availability. These are not theoretical
ideals. They are engineering constraints that shape how networks are
built, how applications are coded, and how infrastructure is hardened.

## Confidentiality

Confidentiality ensures that information is accessible only to
authorized entities. This protection extends to data at rest, data in
transit, and data in use.

Data at rest protection involves encryption mechanisms such as full disk
encryption, database encryption, and hardware-backed key storage. The
purpose is to prevent unauthorized access if physical storage media are
stolen or compromised.

Data in transit protection relies on secure communication protocols.
Transport Layer Security (TLS), Secure Shell (SSH), and IPSec encrypt
communications to prevent interception and modification.

Data in use protection focuses on controlling memory access and
preventing unauthorized processes from reading sensitive information.

Confidentiality fails when: - Weak authentication allows unauthorized
access. - Encryption keys are improperly stored. - Access controls are
misconfigured. - Sensitive data is overexposed through excessive
permissions.

Confidentiality is therefore enforced not only through cryptography but
through identity management and least privilege design.

## Integrity

Integrity guarantees that information remains accurate and unaltered
unless modification is authorized.

Integrity protection is achieved through cryptographic hashing, digital
signatures, message authentication codes (MACs), and logging systems.

A hash function produces a fixed-length digest from input data. Even a
minor change to the input produces a drastically different output. This
property allows systems to detect tampering.

Digital signatures combine hashing with asymmetric encryption. A sender
generates a hash of data and encrypts that hash using a private key.
Anyone with the corresponding public key can verify the signature. This
provides integrity and nonrepudiation.

Integrity also applies to software distribution. Code signing ensures
that executable files have not been modified since publication.

Integrity fails when: - Hash algorithms suffer collision
vulnerabilities. - Logs are not protected from alteration. - Software
updates are unsigned or improperly validated.

## Availability

Availability ensures that systems and data remain accessible when
needed.

This principle is enforced through redundancy, fault tolerance, load
balancing, clustering, backup strategies, and disaster recovery
planning.

Denial-of-service attacks directly target availability by exhausting
system resources. Infrastructure failures also threaten availability if
redundancy is not properly implemented.

Availability engineering includes: - RAID configurations for storage
redundancy. - Multiple network paths to avoid single points of
failure. - Geographic replication of critical systems. - Regular backup
verification and testing.

A secure system must balance confidentiality, integrity, and
availability. Overemphasis on one can weaken another. Excessive
encryption without performance planning may degrade availability.
Excessive access restrictions may impede operational efficiency.

------------------------------------------------------------------------

# Chapter 2: Identity and Access Management

Identity is the foundation of access control. Every security decision
depends on correctly identifying subjects and enforcing appropriate
permissions.

## Authentication

Authentication verifies identity claims. Authentication mechanisms are
divided into three categories:

-   Something you know (passwords, PINs)
-   Something you have (smartcards, hardware tokens)
-   Something you are (biometrics)

True multi-factor authentication requires combining different
categories. Using two passwords is not multi-factor authentication.

Enterprise authentication commonly uses certificate-based mechanisms
such as EAP-TLS, where both client and server validate each other's
digital certificates.

Weak authentication mechanisms expose systems to credential attacks such
as password spraying, dictionary attacks, and pass-the-hash techniques.

## Authorization

Authorization determines what an authenticated entity is permitted to
access.

Role-Based Access Control (RBAC) assigns permissions to roles rather
than individuals. This improves scalability and reduces administrative
overhead.

The principle of least privilege ensures that users receive only the
permissions necessary to perform their job functions.

Improper authorization results in privilege escalation risks and
excessive data exposure.

## Accounting

Accounting provides traceability. Systems record authentication
attempts, resource access, and administrative actions in audit logs.

Logs must be protected from tampering and regularly reviewed.
Centralized log aggregation through SIEM platforms enables correlation
and anomaly detection.

------------------------------------------------------------------------

# Chapter 3: Cryptography and Secure Communication

Cryptography protects confidentiality and integrity through mathematical
transformation.

## Symmetric Encryption

Symmetric encryption uses a single shared key for both encryption and
decryption. It is computationally efficient and used for bulk data
encryption.

Key management is critical. If a symmetric key is exposed, all encrypted
data becomes readable.

## Asymmetric Encryption

Asymmetric encryption uses mathematically linked public and private
keys. The public key can be distributed openly, while the private key
remains secret.

Digital signatures use private keys to sign data, ensuring
nonrepudiation.

## Hashing

Hash functions generate fixed-length outputs from arbitrary input data.
They are used for integrity verification and password storage.

Salting passwords prevents rainbow table attacks by adding unique
randomness before hashing.

## IPSec and Secure Tunnels

IPSec provides encrypted communication at the network layer. It operates
in transport mode (protecting payload only) or tunnel mode
(encapsulating the entire packet).

Internet Key Exchange (IKE) negotiates security associations and uses
UDP port 500.

L2TP often pairs with IPSec to provide encrypted VPN tunnels.

------------------------------------------------------------------------

# Chapter 4: Threats and Attack Mechanics

Understanding attacks is necessary to design effective defenses.

## Malware

Worms self-replicate across networks without user interaction, often
exploiting vulnerable services.

Boot sector malware modifies disk startup code, preventing proper system
initialization.

Remote Access Trojans establish persistent backdoors for attackers.

## Web Application Attacks

Directory traversal exploits improper input validation to access
restricted filesystem paths.

LDAP injection manipulates directory queries, potentially bypassing
authentication mechanisms.

Cross-site request forgery tricks authenticated users into performing
unintended actions.

Watering hole attacks compromise trusted websites to infect targeted
users.

## Network Attacks

Smurf attacks amplify ICMP traffic by spoofing source addresses and
sending broadcast requests.

Botnets coordinate distributed denial-of-service attacks and spam
campaigns.

Password spraying attempts a single password across multiple accounts to
evade lockout policies.

------------------------------------------------------------------------

# Chapter 5: Security Operations and Incident Response

Security operations focus on monitoring, detection, and response.

## Logging and Monitoring

Security logs record authentication events and system activity.
Establishing a baseline of normal behavior enables anomaly detection.

Tools such as netstat identify listening ports. Packet capture tools
such as tcpdump analyze network traffic.

SIEM platforms aggregate logs. SOAR platforms automate response
workflows.

## Incident Response Lifecycle

The incident response process consists of preparation, identification,
containment, eradication, recovery, and lessons learned.

Containment prevents the spread of malicious activity.

Lessons learned improve future defenses.

## Business Continuity

Business Impact Analysis identifies operational and financial impacts of
disruption.

Regular testing ensures recovery plans remain viable.
