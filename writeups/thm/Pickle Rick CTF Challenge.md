## Introduction

The **Pickle Rick** challenge is a Rick and Morty–themed CTF that is designed to be **beginner-friendly**. It focuses on basic web enumeration, command execution, and simple privilege escalation techniques.

I am still a beginner in the cybersecurity field, but I have solved a few CTF challenges before this one. Those experiences helped me start recognizing common patterns and workflows that are often used when approaching CTF machines.

In this write-up, I will try to explain every step as clearly as possible. In some cases, the reasoning behind certain steps might seem like a big jump. However, many of those decisions come from understanding the **general workflow used when solving CTF challenges**. Once you begin to recognize these patterns, it becomes much easier to figure out what the next logical step might be when you get stuck.

___
For CTF challenges like this, the first step is almost always **reconnaissance**, starting with an **Nmap scan** and basic service discovery. This helps identify open ports, running services, and potential entry points into the target machine.

If you're interested, you can see the scans I typically run during this phase here: https://cyberfriday.pro/read.html?md=notes/nmap-scan-patterns.md.

For this challenge, I started with the following Nmap scan:
```bash
nmap -sC -sV 10.113.147.216
```

The scan reveals two services running on the target machine:
![[PickleRick1.png]]

Accessing `http://10.113.147.216` on **port 80** reveals the following webpage:
![[PickleRick2.png]]

If we view the page source, a hidden username can be found:

![[Pickle Rick3.png]]

Username: `R1ckRul3s`

At this point, there is no additional useful information visible on the website.

The next logical step is to perform **directory enumeration** to look for hidden paths or files on the web server. To do this, I ran a basic **Gobuster** scan:
```bash
gobuster dir -u http://10.113.147.216 -w /usr/share/wordlists/dirb/common.txt
```

![[Pickle Rick4.png]]
We can now try to access the discovered paths, starting with the ones that returned a **200 status code**.

First, let's take a look at `/robots.txt`:

![[PickleRick5.png]]

At this point, I thought that `Wubbalubbadubdub` might be the password for Rick's account, so I tried using it for `ssh`

![[PickleRick6.png]]

Unfortunately, that was a bit too early. Since we still don't have a login portal to use it on, it makes sense to continue exploring the other discovered directories.

Navigating to the `/assets` directory reveals the following files:

![[Pickle Rick7.png]]

After checking all the items listed here and not finding anything particularly useful, I decided to run another Gobuster scan with a slightly different approach.

This time, I explicitly searched for common file extensions such as **php, html, css, js, txt, and pdf**:

```bash
gobuster dir -u http://10.113.147.216 -w /usr/share/wordlists/dirb/common.txt -x php,txt,html,css,js,pdf
```

![[Pickle Rick8.png]]

Bingo! The scan reveals what we were looking for — a login portal at `/login.php`.

![[Pickle Rick9.png]]

Let's try logging in using the credentials we discovered earlier:

Username: `R1ckRul3s`  
Password: `Wubbalubbadubdub`

![[Pickle Rick10.png]]
The login is successful and the **command panel** becomes available. However, access to the other tabs in the portal appears to be restricted.

Inside the command panel, I first tried running the `pwd` command to see what kind of commands were supported. It turns out that the panel allows the execution of **Linux commands**, which means we can start exploring the system directly.

To better understand the environment we are in, I started with a few basic Linux commands:

```bash
whoami
pwd
```

These commands help establish **who we are on the system** and **which directory we are currently in**, giving us a starting point for further exploration.

Next, I listed all files in the current directory, including hidden ones:
```bash
ls -a
```

![[Pickle Rick11.png]]

While listing the files in the directory, I noticed a file named `Sup3rS3cretPickl3Ingred.txt`. Since it looked important, I attempted to read its contents using the `cat` command.

```bash
cat Sup3rS3cretPickl3Ingred.txt
```

The `cat` command turned out to be disabled by none other than Rick himself.

![[Pickle Rick12.png]]

At this point, I needed to find alternatives to the `cat` command that could still display the contents of a file. Some possible options include:
```bash
more filename.txt
less filename.txt
head filename.txt
tail filename.txt
tac filename.txt
nl filename.txt
```

I decided to use `tac` to read the file:
```bash
tac Sup3rS3cretPickl3Ingred.txt
```

Success!

![[Pickle Rick13.png]]

This reveals the first ingredient, which also answers the first question:
```
mr. meeseek hair
```

Great, we now have the first answer.  
I revisited the earlier `ls -a` output to check if anything else looked interesting. 

![[Pickle Rick11.png]]

The only file that stands out is `clue.txt`, so let's try reading it the same way we did with `Sup3rS3cretPickl3Ingred.txt`, using the `tac` command.

```bash
tac clue.txt
```

![[Pickle Rick14.png]]

The message suggests looking around the file system. I first tried using commands like `cd ..` and `cd ../..` to move to other directories, but those attempts did not work.

Since changing directories was not possible, I tried another approach by checking the `/home` directory to see which users exist on the system:

```bash
ls /home
```

![[Pickle Rick15.png]]

Next, I wanted to take a closer look inside Rick's home directory.  
  
The `cd` command was ignored again, so instead I listed the contents of the directory directly using:

```bash
ls -l /home/rick
```

This revealed the following:
```
total 4
-rwxrwxrwx 1 root root 13 Feb 10  2019 second ingredients
```

Since the `cat` command did not work earlier, there was no reason to assume it would work here either. Instead, I tried reading the file using:

```bash
tac /home/rick/second ingredients
```

However, this command did not work. I spent some time trying to figure out why it was failing. I even tried a few other commands, but they either did not work or returned the same message saying the command was disabled.

After looking through some documentation and not finding a clear answer, I decided to ask ChatGPT whether my command was correct. The response pointed out something interesting:

![[Pickle Rick16.png]]

I was not aware of this before, so it was interesting to learn. Let's test it:
```bash
tac /home/rick/second\ ingredients
```

And sure enough — it worked. This reveals the second ingredient:

![[Pickle Rick17.png]]

All that remains now is the third flag. At this point, I needed to gather more information about the system. I suspected that retrieving the final ingredient would likely require some form of **privilege escalation**.  
  
To better understand my current position on the system, I ran a few commands:
```bash
pwd
whoami
ls /
sudo -l
```

The last command is particularly important:
```bash
sudo -l
```

The output revealed something very promising:

![[Pickle Rick18.png]]

This essentially means that we, as the user `www-data`, can execute **any command with `sudo` privileges** without being prompted for a password.

Running the following command to list the contents of the root directory:
```bash
sudo ls /root/
```

reveals the following:

![[Pickle Rick19.png]]

Great! We can see a file named `3rd.txt`, which is very likely the final ingredient.  
  
To finish the challenge, we can read the file using:

```bash
sudo tac /root/3rd.txt
```

This reveals the final ingredient:

![[Pickle Rick20.png]]

___
## Retrieved Ingredients

| Ingredient | Value |
|---|---|
| Ingredient #1 | `mr. meeseek hair` |
| Ingredient #2 | `1 jerry tear` |
| Ingredient #3 | `fleeb juice` |
___

## Conclusion

This challenge demonstrates a simple but very common CTF workflow: starting with **service discovery**, continuing with **web enumeration**, and finally achieving **privilege escalation** to retrieve the final flag.  
  
Along the way, we discovered hidden credentials in the page source, performed directory enumeration to locate the login portal, and used the command panel to explore the system. Even with certain commands disabled, alternative Linux utilities allowed us to read important files and continue progressing through the challenge.  
  
Finally, by checking the system's sudo permissions, we discovered that the `www-data` user could execute commands as root without a password. This allowed us to access the `/root` directory and retrieve the final ingredient.  
  
With all three ingredients collected, Rick can finally finish his potion and turn himself back into a human.  

___
