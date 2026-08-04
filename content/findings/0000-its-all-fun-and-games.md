---
title: "It's all fun and games"
number: 0
author: "Kent Ballon"
state: "published"
date: 2018-08-10
tags: ["security","penetration testing"]
---

## Summary

A collection of Penetration Testing Labs I accomplished a while back.

## Context

Ages ago, cybersecurity was all but magic to me so I took part in [HackTheBox](https://www.hackthebox.com/) challenges and rooted a couple of their free boxes.

At a time when LLMs were still but figments of our imagination, there was a great sense of fun and achievement doing independent research, participation in forum discussions, and testing of exploits.

## Details

### Bounty Box

[Bounty](https://www.hackthebox.com/machines/bounty) is an easy to medium difficulty machine, which features an interesting technique to bypass file uploader protections and achieve code execution. This machine also highlights the importance of keeping systems updated with the latest security patches.

<img src="https://kentballon.github.io/odyssey/images/htb/bounty.png" alt="NLBALB" style="width:100%; height:auto;">

### Celestial Box

[Celestial](https://www.hackthebox.com/machines/celestial) is a medium difficulty machine which focuses on deserialization exploits. It is not the most realistic, however it provides a practical example of abusing client-size serialized objects in NodeJS framework.


<img src="https://kentballon.github.io/odyssey/images/htb/celestial.png" alt="NLBALB" style="width:100%; height:auto;">

### DevOops Box

[DevOops](https://www.hackthebox.com/machines/devoops) is a relatively quick machine to complete which focuses on XML external entities and Python pickle vulnerabilities to gain a foothold.

<img src="https://kentballon.github.io/odyssey/images/htb/devops.png" alt="NLBALB" style="width:100%; height:auto;">

### Hawk Box

[Hawk](https://www.hackthebox.com/machines/hawk) is a medium to hard difficulty machine, which provides excellent practice in pentesting Drupal. The exploitable H2 DBMS installation is also realistic as web-based SQL consoles (RavenDB etc.) are found in many environments. The OpenSSL decryption challenge increases the difficulty of this machine.

<img src="https://kentballon.github.io/odyssey/images/htb/hawk.png" alt="NLBALB" style="width:100%; height:auto;">

### Jerry Box

[Jerry](https://www.hackthebox.com/machines/jerry) is an easy-difficulty Windows machine that showcases how to exploit Apache Tomcat, leading to an `NT Authority\SYSTEM` shell, thus fully compromising the target.


<img src="https://kentballon.github.io/odyssey/images/htb/jerry.png" alt="NLBALB" style="width:100%; height:auto;">

### Networked Box

[Networked](https://www.hackthebox.com/machines/networked) is an Easy difficulty Linux box vulnerable to file upload bypass, leading to code execution. Due to improper sanitization, a crontab running as the user can be exploited to achieve command execution. The user has privileges to execute a network configuration script, which can be leveraged to execute commands as root.

<img src="https://kentballon.github.io/odyssey/images/htb/networked.png" alt="NLBALB" style="width:100%; height:auto;">

### Poison Box

[Poison](https://www.hackthebox.com/machines/poison) is a fairly easy machine which focuses mainly on log poisoning and port forwarding/tunneling. The machine is running FreeBSD which presents a few challenges for novice users as many common binaries from other distros are not available.

<img src="https://kentballon.github.io/odyssey/images/htb/poison.png" alt="NLBALB" style="width:100%; height:auto;">

### Stratosphere Box

[Stratosphere](https://www.hackthebox.com/machines/stratosphere) focuses on the use of an Apache Struts code execution vulnerability which was leveraged in a large-scale breach, resulting in the disclosure of millions of peoples&amp;#039; credit information.

<img src="https://kentballon.github.io/odyssey/images/htb/stratosphere.png" alt="NLBALB" style="width:100%; height:auto;">

### Waldo Box

[Waldo](https://www.hackthebox.com/machines/waldo) is a medium difficulty machine, which highlights the risk of insufficient input validation, provides the challenge of rbash escape or bypassing, and showcases an interesting privilege escalation vector involving Linux Capabilities, all of which may be found in real environments.

<img src="https://kentballon.github.io/odyssey/images/htb/waldo.png" alt="NLBALB" style="width:100%; height:auto;">

## References

- [Bounty](https://www.hackthebox.com/machines/bounty)
- [Celestial](https://www.hackthebox.com/machines/celestial)
- [DevOops](https://www.hackthebox.com/machines/devoops)
- [Hawk](https://www.hackthebox.com/machines/hawk)
- [Jerry](https://www.hackthebox.com/machines/jerry)
- [Networked](https://www.hackthebox.com/machines/networked)
- [Poison](https://www.hackthebox.com/machines/poison)
- [Stratosphere](https://www.hackthebox.com/machines/stratosphere)
- [Waldo](https://www.hackthebox.com/machines/waldo)