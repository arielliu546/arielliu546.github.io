---
title: ssh journal
date: 2025-02-19 07:46:02
tags:
---
Trying to connect to wsl from MacOS through ssh. I experimented for a long time last night but it doesn't really work. It kept returning "Connection refused". I think I'd better write down what I did last night in case I forgot.

## First try

I first followed instructions on this [github link](https://github.com/ajithmoola/wsl-ssh-guide).

### Step 1: Setting up SSH server in WSL

```
# in wsl
sudo apt update
sudo apt install openssh-server
```

Then, edit the SSH config file:
```
sudo nano /etc/ssh/sshd_config
```

Ensure the following lines are present and uncommented:
```
Port 2222
PasswordAuthentication no
PubkeyAuthentication yes
```

Start the SSH service using the first line of code below. I also notice that there are some other functions with this command:
``` 
sudo service ssh start 
sudo service ssh restart 
sudo service ssh status
```

### Step 2: Set up port forwarding on Windows

Open PowerShell as administrater.
Get WSL IP address and set up port forwarding:
```
netsh interface portproxy add v4tov4 listenport=2222 listenaddress=0.0.0.0 connectport=2222 connectaddress=$((wsl hostname -i).trim())
```
You can get WSL IP with running `wsl hostname -i` from the PowerShell. My WSL IP is `172.0.1.1`.
Experimenting, I also ran:
```
netsh interface portproxy add v4tov4 listenport=2222 listenaddress=<windows-ip> connectport=2222 connectaddress=172.0.1.1
```


Here's a really good piece of instruction from [reddit](https://www.reddit.com/r/bashonubuntuonwindows/comments/jfch3c/ssh_connect_to_host_localhost_port_22_connection/)


As a general rule of thumb, if you get a "connection refused" message you are not being blocked by a firewall, you are hitting a port on your destination that has no process listening to it.

you are looking at the wrong file. /etc/ssh/ssh.config is the configuration of your SSH client. If you want to host localhost, you need to have sshd running, which is configured through /etc/ssh/sshd.config

In other words, check for the sshd process to be running on your destination host and if it is, it will connect.

#### on mac

To see mac ip address, run `ipconfig getifaddr en0`

`sudo systemsetup -getremotelogin` checks current ssh status

`sudo systemsetup -setremotelogin on` turns on ssh


## A successful try

First, reinstall openssh in wsl by running 
```
sudo apt-get remove --purge openssh-server
sudo apt-get install openssh-server
sudo apt-get --reinstall install openssh-client
```
Then, I was told that it'd be better to not use the default port 22, so I ran `sudo nano /etc/ssh/sshd-config` and set the port to 2222.
Then, restart ssh service `sudo service ssh --full-restart`

In PowerShell, run `wsl hostname -I` to see wsl ip. My wsl ip is 172.31.139.64.
Run `ssh arielliu@172.31.139.64 -p 2222`, input yes, enter password 2025tsinghua, voila, success!

windows ip: 101.5.164.159

can run `ssh demo@test.rebex.net` to test

```
Get-Service sshd
```