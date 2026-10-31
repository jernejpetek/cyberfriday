#  curl Basics for Web Testing

curl is a command-line tool used to send and inspect HTTP requests directly from the terminal. It is commonly used during web enumeration and testing to manually interact with web servers, APIs, and endpoints without relying on a browser.

In CTFs and professional penetration tests, curl is especially useful for verifying automated scan results, inspecting headers, testing authentication, replaying requests, and debugging application behavior. Its flexibility makes it an essential tool for understanding how a web application responds at a low level.
___
This note documents the curl commands I use most often during web enumeration and manual testing. These commands focus on inspecting HTTP behavior, interacting with endpoints directly, and validating findings from automated tools.

---
## Basic HTTP request

```bash
curl http://<IP>
```

This is the simplest curl command and is often the first manual request  
I send to a web server.

### What it does
- Sends a basic HTTP GET request
- Returns the raw response body
    
Useful for quickly confirming:
- the site is reachable
- what content is returned by default

### When to use it
- Initial web enumeration
- Verifying a service discovered by tools like Nmap or Gobuster

---
## Viewing response headers

```bash
curl -I http://<IP>
```

Fetches only HTTP response headers.

### What it does
- `-I`
    Sends a `HEAD` request instead of `GET`.

This reveals useful information such as:
- server type
- content type
- redirects
- security headers

### When to use it
- Early recon
- Identifying technologies and misconfigurations
- Checking for redirects or access controls

---
## Verbose output (debugging requests)

```bash
curl -v http://<IP>
```

Shows detailed request and response information.

### What it does
- `-v`
    Enables verbose mode.
    
_Verbose mode increases the amount of detail a program shows while it runs, displaying extra information about what the tool is doing behind the scenes. It is mainly used for debugging and understanding how a command or process works._

Displays:
- request headers sent
- response headers received
- connection details

### When to use it
- Debugging unexpected behavior
- Understanding authentication or redirects
- Seeing exactly what the server is doing

---

## Following redirects

```bash
curl -L http://<IP>
```


Automatically follows HTTP redirects.

### What it does
- `-L`
    Follows `3xx` redirect responses.

Many web apps redirect:
- HTTP → HTTPS
- unauthenticated → login pages

### When to use it
- When a request returns a redirect
- When content appears missing without `-L`

---

## Sending POST requests

```bash
curl -X POST http://<IP>/login -d "username=admin&password=admin"
```

Manually sends POST data to an endpoint.

### What it does
- `-X POST`
    Specifies the HTTP method.
- `-d`
    Sends data in the request body.

Commonly used for:
- testing login forms
- interacting with APIs
- replaying requests manually

### When to use it
- After identifying parameters
- Testing authentication or input handling

---

## Adding custom headers

```bash
curl -H "Authorization: Bearer <token>" http://<IP>/api
```

Adds custom headers to a request.

### What it does
- `-H`
    Specifies a custom HTTP header.

Useful for:
- authentication tokens
- API keys
- changing user agents

### When to use it
- API testing
- authenticated endpoints
- bypassing basic access controls

---

## Changing the request method

```bash
curl -X OPTIONS http://<IP>
```

Manually sets the HTTP method.

### What it does
- `-X`
    Specifies the request method.

Useful for testing allowed methods such as:
- `GET`
- `POST`
- `PUT`
- `DELETE`

### When to use it
- Testing method restrictions
- Checking for misconfigured APIs

---

## Saving output to a file

```bash
curl http://<IP> -o response.html
```

Writes response content to a file.

### What it does
- `-o`
    Outputs response data to a file.

Helpful for:
- reviewing large responses
- downloading files
- analyzing source code offline

---

## Ignoring SSL certificate errors

```bash
curl -k https://<IP>
```

Bypasses SSL/TLS certificate validation.

### What it does
- `-k`
    Allows insecure HTTPS connections.

### When to use it
- Labs and CTFs
- Self-signed certificates
- **Never recommended for production environments**

---

## Overview and tips

| Option / Flag | Description                       |
| ------------- | --------------------------------- |
| `-I`          | Fetch only HTTP headers           |
| `-v`          | Enable verbose output             |
| `-L`          | Follow redirects                  |
| `-X`          | Specify HTTP request method       |
| `-d`          | Send data in request body         |
| `-H`          | Add custom HTTP headers           |
| `-o`          | Write output to a file            |
| `-k`          | Ignore SSL certificate validation |

- curl is best used alongside automated tools, not instead of them
- Use it to **verify**, **replay**, and **manually test** findings
- Combine curl with Gobuster results for deeper enumeration
- Pay close attention to **headers, status codes, and redirects**

