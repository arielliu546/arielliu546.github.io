---
title: Here's my first blog
date: 2024-10-20 19:36:48
tags:
---

# Development
今天终于把blog的雏形做出来了！中间遇到了一个问题，就是在 terminal git push 的时候，github响应太慢甚至失败，于是
通过这一篇[文章](#https://www.jianshu.com/p/c80c50267227)来进行了一些mac的系统config。具体就是在`\etc\hosts`下面加了一行：
```
146.75.121.194 github.global.ssl.fastly.net
140.82.121.3 github.com
20.205.243.166 github.com
```

注意注意，`git push origin main`的时候别开VPN，如果还不行可使用手机热点。

deleted this in .gitmodules to use the newer version of NexT
```
[submodule "themes/next"]
	path = themes/next
	url = https://github.com/next-theme/hexo-theme-next
```
and this from .git/config
```[submodule "themes/next"]
	active = true
	url = https://github.com/next-theme/hexo-theme-next
```

removed the word in [] in root/.github/workflows/pages.yml
 ```- uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          # If your repository depends on submodule, please see: https://github.com/actions/checkout
          submodules: [recursive]
		  ```

wrote this in ~/.zshrc
`export PATH="/usr/local/texlive/2024/bin/universal-darwin:$PATH"`
# Journal
开心的一天，和班里的同学一起去爬了香山。虽然天气很冷，山上叶子也还没变红，但是一路说说笑笑吃吃喝喝很开心。
<br>就是有同行的同学倾向于以直接咬的形式分享食物，让我感觉有点难受。

睡太晚啦！

# Reflections
今天晚上清洁电脑屏幕的时候发现了一个小点，以为就是脏了，但在用无尘布百般擦拭和用手电筒照射后，发现它就是一个针尖大小的凹坑（dimple）！感觉好难受啊！一万多买来的好电脑，屏幕如此脆弱，因我的疏忽受到如此伤害，心痛不已。

害，只能安慰自己，反正一点小伤不影响正常使用。那天AI沙龙，看到开发部大佬用的mac，上面全是油印，看来大佬是不会在意这些无关紧要的细节的！

Don't dwell on things.