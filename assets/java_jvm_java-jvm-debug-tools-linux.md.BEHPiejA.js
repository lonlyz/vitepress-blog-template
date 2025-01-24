import{_ as s,c as n,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const u=JSON.parse('{"title":"调试排错 - Java 问题排查之Linux命令","description":"","frontmatter":{},"headers":[],"relativePath":"java/jvm/java-jvm-debug-tools-linux.md","filePath":"java/jvm/java-jvm-debug-tools-linux.md","lastUpdated":1737706346000}'),l={name:"java/jvm/java-jvm-debug-tools-linux.md"};function i(t,a,c,o,d,r){return e(),n("div",null,a[0]||(a[0]=[p(`<h1 id="调试排错-java-问题排查之linux命令" tabindex="-1">调试排错 - Java 问题排查之Linux命令 <a class="header-anchor" href="#调试排错-java-问题排查之linux命令" aria-label="Permalink to &quot;调试排错 - Java 问题排查之Linux命令&quot;">​</a></h1><blockquote><p>Java 在线问题排查主要分两篇：本文是第一篇，通过linux常用命令排查。@pdai</p></blockquote><h2 id="文本操作" tabindex="-1">文本操作 <a class="header-anchor" href="#文本操作" aria-label="Permalink to &quot;文本操作&quot;">​</a></h2><h3 id="文本查找-grep" tabindex="-1">文本查找 - grep <a class="header-anchor" href="#文本查找-grep" aria-label="Permalink to &quot;文本查找 - grep&quot;">​</a></h3><p>grep常用命令：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 基本使用</span></span>
<span class="line"><span>grep yoursearchkeyword f.txt     #文件查找</span></span>
<span class="line"><span>grep &#39;KeyWord otherKeyWord&#39; f.txt cpf.txt #多文件查找, 含空格加引号</span></span>
<span class="line"><span>grep &#39;KeyWord&#39; /home/admin -r -n #目录下查找所有符合关键字的文件</span></span>
<span class="line"><span>grep &#39;keyword&#39; /home/admin -r -n -i # -i 忽略大小写</span></span>
<span class="line"><span>grep &#39;KeyWord&#39; /home/admin -r -n --include *.{vm,java} #指定文件后缀</span></span>
<span class="line"><span>grep &#39;KeyWord&#39; /home/admin -r -n --exclude *.{vm,java} #反匹配</span></span>
<span class="line"><span></span></span>
<span class="line"><span># cat + grep</span></span>
<span class="line"><span>cat f.txt | grep -i keyword # 查找所有keyword且不分大小写  </span></span>
<span class="line"><span>cat f.txt | grep -c &#39;KeyWord&#39; # 统计Keyword次数</span></span>
<span class="line"><span></span></span>
<span class="line"><span># seq + grep</span></span>
<span class="line"><span>seq 10 | grep 5 -A 3    #上匹配</span></span>
<span class="line"><span>seq 10 | grep 5 -B 3    #下匹配</span></span>
<span class="line"><span>seq 10 | grep 5 -C 3    #上下匹配，平时用这个就妥了</span></span></code></pre></div><p>Grep的参数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>--color=auto：显示颜色;</span></span>
<span class="line"><span>-i, --ignore-case：忽略字符大小写;</span></span>
<span class="line"><span>-o, --only-matching：只显示匹配到的部分;</span></span>
<span class="line"><span>-n, --line-number：显示行号;</span></span>
<span class="line"><span>-v, --invert-match：反向显示,显示未匹配到的行;</span></span>
<span class="line"><span>-E, --extended-regexp：支持使用扩展的正则表达式;</span></span>
<span class="line"><span>-q, --quiet, --silent：静默模式,即不输出任何信息;</span></span>
<span class="line"><span>-w, --word-regexp：整行匹配整个单词;</span></span>
<span class="line"><span>-c, --count：统计匹配到的行数; print a count of matching lines;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>-B, --before-context=NUM：print NUM lines of leading context   后#行 </span></span>
<span class="line"><span>-A, --after-context=NUM：print NUM lines of trailing context   前#行 </span></span>
<span class="line"><span>-C, --context=NUM：print NUM lines of output context           前后各#行</span></span></code></pre></div><h3 id="文本分析-awk" tabindex="-1">文本分析 - awk <a class="header-anchor" href="#文本分析-awk" aria-label="Permalink to &quot;文本分析 - awk&quot;">​</a></h3><p>awk基本命令：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 基本使用</span></span>
<span class="line"><span>awk &#39;{print $4,$6}&#39; f.txt</span></span>
<span class="line"><span>awk &#39;{print NR,$0}&#39; f.txt cpf.txt    </span></span>
<span class="line"><span>awk &#39;{print FNR,$0}&#39; f.txt cpf.txt</span></span>
<span class="line"><span>awk &#39;{print FNR,FILENAME,$0}&#39; f.txt cpf.txt</span></span>
<span class="line"><span>awk &#39;{print FILENAME,&quot;NR=&quot;NR,&quot;FNR=&quot;FNR,&quot;$&quot;NF&quot;=&quot;$NF}&#39; f.txt cpf.txt</span></span>
<span class="line"><span>echo 1:2:3:4 | awk -F: &#39;{print $1,$2,$3,$4}&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 匹配</span></span>
<span class="line"><span>awk &#39;/ldb/ {print}&#39; f.txt   #匹配ldb</span></span>
<span class="line"><span>awk &#39;!/ldb/ {print}&#39; f.txt  #不匹配ldb</span></span>
<span class="line"><span>awk &#39;/ldb/ &amp;&amp; /LISTEN/ {print}&#39; f.txt   #匹配ldb和LISTEN</span></span>
<span class="line"><span>awk &#39;$5 ~ /ldb/ {print}&#39; f.txt #第五列匹配ldb</span></span></code></pre></div><p>内建变量</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>\`NR\`: NR表示从awk开始执行后，按照记录分隔符读取的数据次数，默认的记录分隔符为换行符，因此默认的就是读取的数据行数，NR可以理解为Number of Record的缩写。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`FNR\`: 在awk处理多个输入文件的时候，在处理完第一个文件后，NR并不会从1开始，而是继续累加，因此就出现了FNR，每当处理一个新文件的时候，FNR就从1开始计数，FNR可以理解为File Number of Record。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`NF\`: NF表示目前的记录被分割的字段的数目，NF可以理解为Number of Field。</span></span></code></pre></div><p>更多请参考：<a href="https://www.runoob.com/linux/linux-comm-awk.html" target="_blank" rel="noreferrer">Linux awk 命令在新窗口打开</a></p><h3 id="文本处理-sed" tabindex="-1">文本处理 - sed <a class="header-anchor" href="#文本处理-sed" aria-label="Permalink to &quot;文本处理 - sed&quot;">​</a></h3><p>sed常用：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 文本打印</span></span>
<span class="line"><span>sed -n &#39;3p&#39; xxx.log #只打印第三行</span></span>
<span class="line"><span>sed -n &#39;$p&#39; xxx.log #只打印最后一行</span></span>
<span class="line"><span>sed -n &#39;3,9p&#39; xxx.log #只查看文件的第3行到第9行</span></span>
<span class="line"><span>sed -n -e &#39;3,9p&#39; -e &#39;=&#39; xxx.log #打印3-9行，并显示行号</span></span>
<span class="line"><span>sed -n &#39;/root/p&#39; xxx.log #显示包含root的行</span></span>
<span class="line"><span>sed -n &#39;/hhh/,/omc/p&#39; xxx.log # 显示包含&quot;hhh&quot;的行到包含&quot;omc&quot;的行之间的行</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 文本替换</span></span>
<span class="line"><span>sed -i &#39;s/root/world/g&#39; xxx.log # 用world 替换xxx.log文件中的root; s==search  查找并替换, g==global  全部替换, -i: implace</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 文本插入</span></span>
<span class="line"><span>sed &#39;1,4i hahaha&#39; xxx.log # 在文件第一行和第四行的每行下面添加hahaha</span></span>
<span class="line"><span>sed -e &#39;1i happy&#39; -e &#39;$a new year&#39; xxx.log  #【界面显示】在文件第一行添加happy,文件结尾添加new year</span></span>
<span class="line"><span>sed -i -e &#39;1i happy&#39; -e &#39;$a new year&#39; xxx.log #【真实写入文件】在文件第一行添加happy,文件结尾添加new year</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 文本删除</span></span>
<span class="line"><span>sed  &#39;3,9d&#39; xxx.log # 删除第3到第9行,只是不显示而已</span></span>
<span class="line"><span>sed &#39;/hhh/,/omc/d&#39; xxx.log # 删除包含&quot;hhh&quot;的行到包含&quot;omc&quot;的行之间的行</span></span>
<span class="line"><span>sed &#39;/omc/,10d&#39; xxx.log # 删除包含&quot;omc&quot;的行到第十行的内容</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 与find结合</span></span>
<span class="line"><span>find . -name  &quot;*.txt&quot; |xargs   sed -i &#39;s/hhhh/\\hHHh/g&#39;</span></span>
<span class="line"><span>find . -name  &quot;*.txt&quot; |xargs   sed -i &#39;s#hhhh#hHHh#g&#39;</span></span>
<span class="line"><span>find . -name  &quot;*.txt&quot; -exec sed -i &#39;s/hhhh/\\hHHh/g&#39; {} \\;</span></span>
<span class="line"><span>find . -name  &quot;*.txt&quot; |xargs cat</span></span></code></pre></div><p>更多请参考：<a href="https://www.runoob.com/linux/linux-comm-sed.html" target="_blank" rel="noreferrer">Linux sed 命令在新窗口打开</a> 或者 <a href="https://www.cnblogs.com/ftl1012/p/9250171.html" target="_blank" rel="noreferrer">Linux sed命令详解在新窗口打开</a></p><h2 id="文件操作" tabindex="-1">文件操作 <a class="header-anchor" href="#文件操作" aria-label="Permalink to &quot;文件操作&quot;">​</a></h2><h3 id="文件监听-tail" tabindex="-1">文件监听 - tail <a class="header-anchor" href="#文件监听-tail" aria-label="Permalink to &quot;文件监听 - tail&quot;">​</a></h3><p>最常用的<code>tail -f filename</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 基本使用</span></span>
<span class="line"><span>tail -f xxx.log # 循环监听文件</span></span>
<span class="line"><span>tail -300f xxx.log #倒数300行并追踪文件</span></span>
<span class="line"><span>tail +20 xxx.log #从第 20 行至文件末尾显示文件内容</span></span>
<span class="line"><span></span></span>
<span class="line"><span># tailf使用</span></span>
<span class="line"><span>tailf xxx.log #等同于tail -f -n 10 打印最后10行，然后追踪文件</span></span></code></pre></div><p>tail -f 与tail F 与tailf三者区别</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>\`tail  -f \`  等于--follow=descriptor，根据文件描述进行追踪，当文件改名或删除后，停止追踪。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`tail -F\` 等于 --follow=name ==retry，根据文件名字进行追踪，当文件改名或删除后，保持重试，当有新的文件和他同名时，继续追踪</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`tailf\` 等于tail -f -n 10（tail -f或-F默认也是打印最后10行，然后追踪文件），与tail -f不同的是，如果文件不增长，它不会去访问磁盘文件，所以tailf特别适合那些便携机上跟踪日志文件，因为它减少了磁盘访问，可以省电。</span></span></code></pre></div><p>tail的参数</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>-f 循环读取</span></span>
<span class="line"><span>-q 不显示处理信息</span></span>
<span class="line"><span>-v 显示详细的处理信息</span></span>
<span class="line"><span>-c&lt;数目&gt; 显示的字节数</span></span>
<span class="line"><span>-n&lt;行数&gt; 显示文件的尾部 n 行内容</span></span>
<span class="line"><span>--pid=PID 与-f合用,表示在进程ID,PID死掉之后结束</span></span>
<span class="line"><span>-q, --quiet, --silent 从不输出给出文件名的首部</span></span>
<span class="line"><span>-s, --sleep-interval=S 与-f合用,表示在每次反复的间隔休眠S秒</span></span></code></pre></div><h3 id="文件查找-find" tabindex="-1">文件查找 - find <a class="header-anchor" href="#文件查找-find" aria-label="Permalink to &quot;文件查找 - find&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>sudo -u admin find /home/admin /tmp /usr -name \\*.log(多个目录去找)</span></span>
<span class="line"><span>find . -iname \\*.txt(大小写都匹配)</span></span>
<span class="line"><span>find . -type d(当前目录下的所有子目录)</span></span>
<span class="line"><span>find /usr -type l(当前目录下所有的符号链接)</span></span>
<span class="line"><span>find /usr -type l -name &quot;z*&quot; -ls(符号链接的详细信息 eg:inode,目录)</span></span>
<span class="line"><span>find /home/admin -size +250000k(超过250000k的文件，当然+改成-就是小于了)</span></span>
<span class="line"><span>find /home/admin f -perm 777 -exec ls -l {} \\; (按照权限查询文件)</span></span>
<span class="line"><span>find /home/admin -atime -1  1天内访问过的文件</span></span>
<span class="line"><span>find /home/admin -ctime -1  1天内状态改变过的文件    </span></span>
<span class="line"><span>find /home/admin -mtime -1  1天内修改过的文件</span></span>
<span class="line"><span>find /home/admin -amin -1  1分钟内访问过的文件</span></span>
<span class="line"><span>find /home/admin -cmin -1  1分钟内状态改变过的文件    </span></span>
<span class="line"><span>find /home/admin -mmin -1  1分钟内修改过的文件</span></span></code></pre></div><h3 id="pgm" tabindex="-1">pgm <a class="header-anchor" href="#pgm" aria-label="Permalink to &quot;pgm&quot;">​</a></h3><p>批量查询vm-shopbase满足条件的日志</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pgm -A -f vm-shopbase &#39;cat /home/admin/shopbase/logs/shopbase.log.2017-01-17|grep 2069861630&#39;</span></span></code></pre></div><h2 id="查看网络和进程" tabindex="-1">查看网络和进程 <a class="header-anchor" href="#查看网络和进程" aria-label="Permalink to &quot;查看网络和进程&quot;">​</a></h2><h3 id="查看所有网络接口的属性" tabindex="-1">查看所有网络接口的属性 <a class="header-anchor" href="#查看所有网络接口的属性" aria-label="Permalink to &quot;查看所有网络接口的属性&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@pdai.tech ~]# ifconfig</span></span>
<span class="line"><span>eth0: flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt;  mtu 1500</span></span>
<span class="line"><span>        inet 172.31.165.194  netmask 255.255.240.0  broadcast 172.31.175.255</span></span>
<span class="line"><span>        ether 00:16:3e:08:c1:ea  txqueuelen 1000  (Ethernet)</span></span>
<span class="line"><span>        RX packets 21213152  bytes 2812084823 (2.6 GiB)</span></span>
<span class="line"><span>        RX errors 0  dropped 0  overruns 0  frame 0</span></span>
<span class="line"><span>        TX packets 25264438  bytes 46566724676 (43.3 GiB)</span></span>
<span class="line"><span>        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>lo: flags=73&lt;UP,LOOPBACK,RUNNING&gt;  mtu 65536</span></span>
<span class="line"><span>        inet 127.0.0.1  netmask 255.0.0.0</span></span>
<span class="line"><span>        loop  txqueuelen 1000  (Local Loopback)</span></span>
<span class="line"><span>        RX packets 502  bytes 86350 (84.3 KiB)</span></span>
<span class="line"><span>        RX errors 0  dropped 0  overruns 0  frame 0</span></span>
<span class="line"><span>        TX packets 502  bytes 86350 (84.3 KiB)</span></span>
<span class="line"><span>        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0</span></span></code></pre></div><h3 id="查看防火墙设置" tabindex="-1">查看防火墙设置 <a class="header-anchor" href="#查看防火墙设置" aria-label="Permalink to &quot;查看防火墙设置&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@pdai.tech ~]# iptables -L</span></span>
<span class="line"><span>Chain INPUT (policy ACCEPT)</span></span>
<span class="line"><span>target     prot opt source               destination</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Chain FORWARD (policy ACCEPT)</span></span>
<span class="line"><span>target     prot opt source               destination</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Chain OUTPUT (policy ACCEPT)</span></span>
<span class="line"><span>target     prot opt source               destination</span></span></code></pre></div><h3 id="查看路由表" tabindex="-1">查看路由表 <a class="header-anchor" href="#查看路由表" aria-label="Permalink to &quot;查看路由表&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@pdai.tech ~]# route -n</span></span>
<span class="line"><span>Kernel IP routing table</span></span>
<span class="line"><span>Destination     Gateway         Genmask         Flags Metric Ref    Use Iface</span></span>
<span class="line"><span>0.0.0.0         172.31.175.253  0.0.0.0         UG    0      0        0 eth0</span></span>
<span class="line"><span>169.254.0.0     0.0.0.0         255.255.0.0     U     1002   0        0 eth0</span></span>
<span class="line"><span>172.31.160.0    0.0.0.0         255.255.240.0   U     0      0        0 eth0</span></span></code></pre></div><h3 id="netstat" tabindex="-1">netstat <a class="header-anchor" href="#netstat" aria-label="Permalink to &quot;netstat&quot;">​</a></h3><p>查看所有监听端口</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@pdai.tech ~]# netstat -lntp</span></span>
<span class="line"><span>Active Internet connections (only servers)</span></span>
<span class="line"><span>Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name  </span></span>
<span class="line"><span>tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN      970/nginx: master p</span></span>
<span class="line"><span>tcp        0      0 0.0.0.0:9999            0.0.0.0:*               LISTEN      1249/java         </span></span>
<span class="line"><span>tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      970/nginx: master p</span></span>
<span class="line"><span>tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1547/sshd         </span></span>
<span class="line"><span>tcp6       0      0 :::3306                 :::*                    LISTEN      1894/mysqld</span></span></code></pre></div><p>查看所有已经建立的连接</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@pdai.tech ~]# netstat -antp</span></span>
<span class="line"><span>Active Internet connections (servers and established)</span></span>
<span class="line"><span>Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name</span></span>
<span class="line"><span>tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN      970/nginx: master p</span></span>
<span class="line"><span>tcp        0      0 0.0.0.0:9999            0.0.0.0:*               LISTEN      1249/java</span></span>
<span class="line"><span>tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      970/nginx: master p</span></span>
<span class="line"><span>tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1547/sshd</span></span>
<span class="line"><span>tcp        0      0 172.31.165.194:53874    100.100.30.25:80        ESTABLISHED 18041/AliYunDun</span></span>
<span class="line"><span>tcp        0     64 172.31.165.194:22       xxx.194.1.200:2649      ESTABLISHED 32516/sshd: root@pt</span></span>
<span class="line"><span>tcp6       0      0 :::3306                 :::*                    LISTEN      1894/m</span></span></code></pre></div><p>查看当前连接</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@pdai.tech ~]# netstat -nat|awk  &#39;{print $6}&#39;|sort|uniq -c|sort -rn</span></span>
<span class="line"><span>      5 LISTEN</span></span>
<span class="line"><span>      2 ESTABLISHED</span></span>
<span class="line"><span>      1 Foreign</span></span>
<span class="line"><span>      1 established)</span></span></code></pre></div><p>查看网络统计信息进程</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@pdai.tech ~]# netstat -s</span></span>
<span class="line"><span>Ip:</span></span>
<span class="line"><span>    21017132 total packets received</span></span>
<span class="line"><span>    0 forwarded</span></span>
<span class="line"><span>    0 incoming packets discarded</span></span>
<span class="line"><span>    21017131 incoming packets delivered</span></span>
<span class="line"><span>    25114367 requests sent out</span></span>
<span class="line"><span>    324 dropped because of missing route</span></span>
<span class="line"><span>Icmp:</span></span>
<span class="line"><span>    18088 ICMP messages received</span></span>
<span class="line"><span>    692 input ICMP message failed.</span></span>
<span class="line"><span>    ICMP input histogram:</span></span>
<span class="line"><span>        destination unreachable: 4241</span></span>
<span class="line"><span>        timeout in transit: 19</span></span>
<span class="line"><span>        echo requests: 13791</span></span>
<span class="line"><span>        echo replies: 4</span></span>
<span class="line"><span>        timestamp request: 33</span></span>
<span class="line"><span>    13825 ICMP messages sent</span></span>
<span class="line"><span>    0 ICMP messages failed</span></span>
<span class="line"><span>    ICMP output histogram:</span></span>
<span class="line"><span>        destination unreachable: 1</span></span>
<span class="line"><span>        echo replies: 13791</span></span>
<span class="line"><span>        timestamp replies: 33</span></span>
<span class="line"><span>IcmpMsg:</span></span>
<span class="line"><span>        InType0: 4</span></span>
<span class="line"><span>        InType3: 4241</span></span>
<span class="line"><span>        InType8: 13791</span></span>
<span class="line"><span>        InType11: 19</span></span>
<span class="line"><span>        InType13: 33</span></span>
<span class="line"><span>        OutType0: 13791</span></span>
<span class="line"><span>        OutType3: 1</span></span>
<span class="line"><span>        OutType14: 33</span></span>
<span class="line"><span>Tcp:</span></span>
<span class="line"><span>    12210 active connections openings</span></span>
<span class="line"><span>    208820 passive connection openings</span></span>
<span class="line"><span>    54198 failed connection attempts</span></span>
<span class="line"><span>    9805 connection resets received</span></span>
<span class="line"><span>...</span></span></code></pre></div><p>netstat 请参考这篇文章: <a href="https://www.cnblogs.com/ftl1012/p/netstat.html" target="_blank" rel="noreferrer">Linux netstat命令详解在新窗口打开</a></p><h3 id="查看所有进程" tabindex="-1">查看所有进程 <a class="header-anchor" href="#查看所有进程" aria-label="Permalink to &quot;查看所有进程&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@pdai.tech ~]# ps -ef | grep java</span></span>
<span class="line"><span>root      1249     1  0 Nov04 ?        00:58:05 java -jar /opt/tech_doc/bin/tech_arch-0.0.1-RELEASE.jar --server.port=9999</span></span>
<span class="line"><span>root     32718 32518  0 08:36 pts/0    00:00:00 grep --color=auto java</span></span></code></pre></div><h3 id="top" tabindex="-1">top <a class="header-anchor" href="#top" aria-label="Permalink to &quot;top&quot;">​</a></h3><p>top除了看一些基本信息之外，剩下的就是配合来查询vm的各种问题了</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># top -H -p pid</span></span>
<span class="line"><span>top - 08:37:51 up 45 days, 18:45,  1 user,  load average: 0.01, 0.03, 0.05</span></span>
<span class="line"><span>Threads:  28 total,   0 running,  28 sleeping,   0 stopped,   0 zombie</span></span>
<span class="line"><span>%Cpu(s):  0.7 us,  0.7 sy,  0.0 ni, 98.6 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st</span></span>
<span class="line"><span>KiB Mem :  1882088 total,    74608 free,   202228 used,  1605252 buff/cache</span></span>
<span class="line"><span>KiB Swap:  2097148 total,  1835392 free,   261756 used.  1502036 avail Mem</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  PID USER      PR  NI    VIRT    RES    SHR S %CPU %MEM     TIME+ COMMAND</span></span>
<span class="line"><span> 1347 root      20   0 2553808 113752   1024 S  0.3  6.0  48:46.74 VM Periodic Tas</span></span>
<span class="line"><span> 1249 root      20   0 2553808 113752   1024 S  0.0  6.0   0:00.00 java</span></span>
<span class="line"><span> 1289 root      20   0 2553808 113752   1024 S  0.0  6.0   0:03.74 java</span></span>
<span class="line"><span>...</span></span></code></pre></div><h2 id="查看磁盘和内存相关" tabindex="-1">查看磁盘和内存相关 <a class="header-anchor" href="#查看磁盘和内存相关" aria-label="Permalink to &quot;查看磁盘和内存相关&quot;">​</a></h2><h3 id="查看内存使用-free-m" tabindex="-1">查看内存使用 - free -m <a class="header-anchor" href="#查看内存使用-free-m" aria-label="Permalink to &quot;查看内存使用 - free -m&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@pdai.tech ~]# free -m</span></span>
<span class="line"><span>              total        used        free      shared  buff/cache   available</span></span>
<span class="line"><span>Mem:           1837         196         824           0         816        1469</span></span>
<span class="line"><span>Swap:          2047         255        1792</span></span></code></pre></div><h3 id="查看各分区使用情况" tabindex="-1">查看各分区使用情况 <a class="header-anchor" href="#查看各分区使用情况" aria-label="Permalink to &quot;查看各分区使用情况&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@pdai.tech ~]# df -h</span></span>
<span class="line"><span>Filesystem      Size  Used Avail Use% Mounted on</span></span>
<span class="line"><span>devtmpfs        909M     0  909M   0% /dev</span></span>
<span class="line"><span>tmpfs           919M     0  919M   0% /dev/shm</span></span>
<span class="line"><span>tmpfs           919M  452K  919M   1% /run</span></span>
<span class="line"><span>tmpfs           919M     0  919M   0% /sys/fs/cgroup</span></span>
<span class="line"><span>/dev/vda1        40G   15G   23G  40% /</span></span>
<span class="line"><span>tmpfs           184M     0  184M   0% /run/user/0</span></span></code></pre></div><h3 id="查看指定目录的大小" tabindex="-1">查看指定目录的大小 <a class="header-anchor" href="#查看指定目录的大小" aria-label="Permalink to &quot;查看指定目录的大小&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@pdai.tech ~]# du -sh</span></span>
<span class="line"><span>803M</span></span></code></pre></div><h3 id="查看内存总量" tabindex="-1">查看内存总量 <a class="header-anchor" href="#查看内存总量" aria-label="Permalink to &quot;查看内存总量&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@pdai.tech ~]# grep MemTotal /proc/meminfo</span></span>
<span class="line"><span>MemTotal:        1882088 kB</span></span></code></pre></div><h3 id="查看空闲内存量" tabindex="-1">查看空闲内存量 <a class="header-anchor" href="#查看空闲内存量" aria-label="Permalink to &quot;查看空闲内存量&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@pdai.tech ~]# grep MemFree /proc/meminfo</span></span>
<span class="line"><span>MemFree:           74120 kB</span></span></code></pre></div><h3 id="查看系统负载磁盘和分区" tabindex="-1">查看系统负载磁盘和分区 <a class="header-anchor" href="#查看系统负载磁盘和分区" aria-label="Permalink to &quot;查看系统负载磁盘和分区&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@pdai.tech ~]# grep MemFree /proc/meminfo</span></span>
<span class="line"><span>MemFree:           74120 kB</span></span></code></pre></div><h3 id="查看系统负载磁盘和分区-1" tabindex="-1">查看系统负载磁盘和分区 <a class="header-anchor" href="#查看系统负载磁盘和分区-1" aria-label="Permalink to &quot;查看系统负载磁盘和分区&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@pdai.tech ~]# cat /proc/loadavg</span></span>
<span class="line"><span>0.01 0.04 0.05 2/174 32751</span></span></code></pre></div><h3 id="查看挂接的分区状态" tabindex="-1">查看挂接的分区状态 <a class="header-anchor" href="#查看挂接的分区状态" aria-label="Permalink to &quot;查看挂接的分区状态&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@pdai.tech ~]# mount | column -t</span></span>
<span class="line"><span>sysfs       on  /sys                             type  sysfs       (rw,nosuid,nodev,noexec,relatime)</span></span>
<span class="line"><span>proc        on  /proc                            type  proc        (rw,nosuid,nodev,noexec,relatime)</span></span>
<span class="line"><span>devtmpfs    on  /dev                             type  devtmpfs    (rw,nosuid,size=930732k,nr_inodes=232683,mode=755)</span></span>
<span class="line"><span>securityfs  on  /sys/kernel/security             type  securityfs  (rw,nosuid,nodev,noexec,relatime)</span></span>
<span class="line"><span>...</span></span></code></pre></div><h3 id="查看所有分区" tabindex="-1">查看所有分区 <a class="header-anchor" href="#查看所有分区" aria-label="Permalink to &quot;查看所有分区&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@pdai.tech ~]# fdisk -l</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Disk /dev/vda: 42.9 GB, 42949672960 bytes, 83886080 sectors</span></span>
<span class="line"><span>Units = sectors of 1 * 512 = 512 bytes</span></span>
<span class="line"><span>Sector size (logical/physical): 512 bytes / 512 bytes</span></span>
<span class="line"><span>I/O size (minimum/optimal): 512 bytes / 512 bytes</span></span>
<span class="line"><span>Disk label type: dos</span></span>
<span class="line"><span>Disk identifier: 0x0008d73a</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   Device Boot      Start         End      Blocks   Id  System</span></span>
<span class="line"><span>/dev/vda1   *        2048    83884031    41940992   83  Linux</span></span></code></pre></div><h3 id="查看所有交换分区" tabindex="-1">查看所有交换分区 <a class="header-anchor" href="#查看所有交换分区" aria-label="Permalink to &quot;查看所有交换分区&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@pdai.tech ~]# swapon -s</span></span>
<span class="line"><span>Filename                                Type            Size    Used    Priority</span></span>
<span class="line"><span>/etc/swap                               file    2097148 261756  -2</span></span></code></pre></div><h3 id="查看硬盘大小" tabindex="-1">查看硬盘大小 <a class="header-anchor" href="#查看硬盘大小" aria-label="Permalink to &quot;查看硬盘大小&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@pdai.tech ~]# fdisk -l |grep Disk</span></span>
<span class="line"><span>Disk /dev/vda: 42.9 GB, 42949672960 bytes, 83886080 sectors</span></span>
<span class="line"><span>Disk label type: dos</span></span>
<span class="line"><span>Disk identifier: 0x0008d73a</span></span></code></pre></div><h2 id="查看用户和组相关" tabindex="-1">查看用户和组相关 <a class="header-anchor" href="#查看用户和组相关" aria-label="Permalink to &quot;查看用户和组相关&quot;">​</a></h2><h3 id="查看活动用户" tabindex="-1">查看活动用户 <a class="header-anchor" href="#查看活动用户" aria-label="Permalink to &quot;查看活动用户&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@pdai.tech ~]# w</span></span>
<span class="line"><span> 08:47:20 up 45 days, 18:54,  1 user,  load average: 0.01, 0.03, 0.05</span></span>
<span class="line"><span>USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT</span></span>
<span class="line"><span>root     pts/0    xxx.194.1.200    08:32    0.00s  0.32s  0.32s -bash</span></span></code></pre></div><h3 id="查看指定用户信息" tabindex="-1">查看指定用户信息 <a class="header-anchor" href="#查看指定用户信息" aria-label="Permalink to &quot;查看指定用户信息&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@pdai.tech ~]# id</span></span>
<span class="line"><span>uid=0(root) gid=0(root) groups=0(root)</span></span></code></pre></div><h3 id="查看用户登录日志" tabindex="-1">查看用户登录日志 <a class="header-anchor" href="#查看用户登录日志" aria-label="Permalink to &quot;查看用户登录日志&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@pdai.tech ~]# last</span></span>
<span class="line"><span>root     pts/0        xxx.194.1.200    Fri Dec 20 08:32   still logged in</span></span>
<span class="line"><span>root     pts/0        xxx.73.164.60     Thu Dec 19 21:47 - 00:28  (02:41)</span></span>
<span class="line"><span>root     pts/0        xxx.106.236.255  Thu Dec 19 16:00 - 18:24  (02:23)</span></span>
<span class="line"><span>root     pts/1        xxx.194.3.173    Tue Dec 17 13:35 - 17:37  (04:01)</span></span>
<span class="line"><span>root     pts/0        xxx.194.3.173    Tue Dec 17 13:35 - 17:37  (04:02)</span></span>
<span class="line"><span>...</span></span></code></pre></div><h3 id="查看系统所有用户" tabindex="-1">查看系统所有用户 <a class="header-anchor" href="#查看系统所有用户" aria-label="Permalink to &quot;查看系统所有用户&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@pdai.tech ~]# cut -d: -f1 /etc/passwd</span></span>
<span class="line"><span>root</span></span>
<span class="line"><span>bin</span></span>
<span class="line"><span>daemon</span></span>
<span class="line"><span>adm</span></span>
<span class="line"><span>...</span></span></code></pre></div><h3 id="查看系统所有组" tabindex="-1">查看系统所有组 <a class="header-anchor" href="#查看系统所有组" aria-label="Permalink to &quot;查看系统所有组&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>cut -d: -f1 /etc/group</span></span></code></pre></div><h2 id="查看服务-模块和包相关" tabindex="-1">查看服务，模块和包相关 <a class="header-anchor" href="#查看服务-模块和包相关" aria-label="Permalink to &quot;查看服务，模块和包相关&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 查看当前用户的计划任务服务</span></span>
<span class="line"><span>crontab -l </span></span>
<span class="line"><span></span></span>
<span class="line"><span># 列出所有系统服务</span></span>
<span class="line"><span>chkconfig –list </span></span>
<span class="line"><span></span></span>
<span class="line"><span># 列出所有启动的系统服务程序</span></span>
<span class="line"><span>chkconfig –list | grep on </span></span>
<span class="line"><span></span></span>
<span class="line"><span># 查看所有安装的软件包</span></span>
<span class="line"><span>rpm -qa </span></span>
<span class="line"><span></span></span>
<span class="line"><span># 列出加载的内核模块</span></span>
<span class="line"><span>lsmod</span></span></code></pre></div><h2 id="查看系统-设备-环境信息" tabindex="-1">查看系统，设备，环境信息 <a class="header-anchor" href="#查看系统-设备-环境信息" aria-label="Permalink to &quot;查看系统，设备，环境信息&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 常用</span></span>
<span class="line"><span>env # 查看环境变量资源</span></span>
<span class="line"><span>uptime # 查看系统运行时间、用户数、负载</span></span>
<span class="line"><span>lsusb -tv # 列出所有USB设备的linux系统信息命令</span></span>
<span class="line"><span>lspci -tv # 列出所有PCI设备</span></span>
<span class="line"><span>head -n 1 /etc/issue # 查看操作系统版本，是数字1不是字母L</span></span>
<span class="line"><span>uname -a # 查看内核/操作系统/CPU信息的linux系统信息命令</span></span>
<span class="line"><span></span></span>
<span class="line"><span># /proc/</span></span>
<span class="line"><span>cat /proc/cpuinfo ：查看CPU相关参数的linux系统命令</span></span>
<span class="line"><span>cat /proc/partitions ：查看linux硬盘和分区信息的系统信息命令</span></span>
<span class="line"><span>cat /proc/meminfo ：查看linux系统内存信息的linux系统命令</span></span>
<span class="line"><span>cat /proc/version ：查看版本，类似uname -r</span></span>
<span class="line"><span>cat /proc/ioports ：查看设备io端口</span></span>
<span class="line"><span>cat /proc/interrupts ：查看中断</span></span>
<span class="line"><span>cat /proc/pci ：查看pci设备的信息</span></span>
<span class="line"><span>cat /proc/swaps ：查看所有swap分区的信息</span></span>
<span class="line"><span>cat /proc/cpuinfo |grep &quot;model name&quot; &amp;&amp; cat /proc/cpuinfo |grep &quot;physical id&quot;</span></span></code></pre></div><h2 id="tsar" tabindex="-1">tsar <a class="header-anchor" href="#tsar" aria-label="Permalink to &quot;tsar&quot;">​</a></h2><p>tsar是淘宝开源的的采集工具。很好用, 将历史收集到的数据持久化在磁盘上，所以我们快速来查询历史的系统数据。当然实时的应用情况也是可以查询的啦。大部分机器上都有安装。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>tsar  ##可以查看最近一天的各项指标</span></span>
<span class="line"><span>tsar --live ##可以查看实时指标，默认五秒一刷</span></span>
<span class="line"><span>tsar -d 20161218 ##指定查看某天的数据，貌似最多只能看四个月的数据</span></span>
<span class="line"><span>tsar --mem</span></span>
<span class="line"><span>tsar --load</span></span>
<span class="line"><span>tsar --cpu ##当然这个也可以和-d参数配合来查询某天的单个指标的情况</span></span></code></pre></div><p>具体可以看这篇文章：<a href="https://www.jianshu.com/p/5562854ed901" target="_blank" rel="noreferrer">linux 淘宝开源监控工具tsar在新窗口打开</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,96)]))}const g=s(l,[["render",i]]);export{u as __pageData,g as default};
