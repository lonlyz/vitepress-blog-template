import{_ as s,c as n,ai as e,o as p}from"./chunks/framework.BrYByd3F.js";const u=JSON.parse('{"title":"Linux - Linux 常用","description":"","frontmatter":{},"headers":[],"relativePath":"tool/linux-usage.md","filePath":"tool/linux-usage.md","lastUpdated":1737706346000}'),t={name:"tool/linux-usage.md"};function l(o,a,i,c,h,r){return p(),n("div",null,a[0]||(a[0]=[e(`<h1 id="linux-linux-常用" tabindex="-1">Linux - Linux 常用 <a class="header-anchor" href="#linux-linux-常用" aria-label="Permalink to &quot;Linux - Linux 常用&quot;">​</a></h1><blockquote><p>本文记录常用的Linux命令, 主要使用CentOS7 @pdai</p></blockquote><h2 id="常用" tabindex="-1">常用 <a class="header-anchor" href="#常用" aria-label="Permalink to &quot;常用&quot;">​</a></h2><h3 id="network" tabindex="-1">Network <a class="header-anchor" href="#network" aria-label="Permalink to &quot;Network&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@docker ~]#  vi /etc/sysconfig/network-scripts/ifcfg-ens160</span></span>
<span class="line"><span>TYPE=Ethernet</span></span>
<span class="line"><span>PROXY_METHOD=none</span></span>
<span class="line"><span>BROWSER_ONLY=no</span></span>
<span class="line"><span>BOOTPROTO=none</span></span>
<span class="line"><span>DEFROUTE=yes</span></span>
<span class="line"><span>IPV4_FAILURE_FATAL=no</span></span>
<span class="line"><span>IPV6INIT=yes</span></span>
<span class="line"><span>IPV6_AUTOCONF=yes</span></span>
<span class="line"><span>IPV6_DEFROUTE=yes</span></span>
<span class="line"><span>IPV6_FAILURE_FATAL=no</span></span>
<span class="line"><span>IPV6_ADDR_GEN_MODE=stable-privacy</span></span>
<span class="line"><span>NAME=ens160</span></span>
<span class="line"><span>UUID=ae63abaa-be93-4f70-a7b8-8da53e1c3aa8</span></span>
<span class="line"><span>DEVICE=ens160</span></span>
<span class="line"><span>ONBOOT=yes</span></span>
<span class="line"><span>IPADDR=10.11.39.21</span></span>
<span class="line"><span>PREFIX=24</span></span>
<span class="line"><span>GATEWAY=10.11.39.254</span></span>
<span class="line"><span>DNS1=10.11.105.201</span></span>
<span class="line"><span>IPV6_PRIVACY=no</span></span></code></pre></div><h3 id="设置host-name" tabindex="-1">设置host-name <a class="header-anchor" href="#设置host-name" aria-label="Permalink to &quot;设置host-name&quot;">​</a></h3><p><strong>centos6</strong></p><p>需要修改两处: 一处是/etc/sysconfig/network，另一处是/etc/hosts，只修改任一处会导致系统启动异常。首先切换到root用户。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/etc/sysconfig/network</span></span>
<span class="line"><span>打开该文件，里面有一行 \`HOSTNAME=localhost.localdomain，修改 localhost.localdomain 为你的主机名。</span></span>
<span class="line"><span>/etc/hosts</span></span>
<span class="line"><span> 打开该文件，会有一行 127.0.0.1 localhost.localdomain localhost其中 127.0.0.1 是本地环路地址， localhost.localdomain 是主机名(hostname)，也就是你待修改的。</span></span></code></pre></div><p>将上面两个文件修改完后，并不能立刻生效。如果要立刻生效的话，可以用 hostname your-hostname 作临时修改(或者修改完之后执行exec bash立即改变)，它只是临时地修改主机名，查看主机名uname -n系统重启后会恢复原样的。</p><p>但修改上面两个文件是永久的，重启系统会得到新的主机名。 最后，重启后查看主机名 uname -n 。</p><p><strong>centos7</strong></p><p>临时生效</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@centos7 ~]# hostname 132</span></span>
<span class="line"><span>[root@centos7 ~]# hostname</span></span>
<span class="line"><span>132</span></span></code></pre></div><p>永久生效(不会立刻修改，需重启)</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@centos7 ~]# hostnamectl set-hostname centos7</span></span>
<span class="line"><span>(或者修改完之后执行\`exec bash\`立即改变)，</span></span></code></pre></div><p>可以参考如下工具: hostnamectl <a href="https://blog.csdn.net/younger%5C_china/article/details/51757979" target="_blank" rel="noreferrer">https://blog.csdn.net/younger\\_china/article/details/51757979</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ceph@client-node ~]$ hostnamectlstatus</span></span>
<span class="line"><span>  Static hostname: client-node</span></span>
<span class="line"><span>         Icon name: computer-vm</span></span>
<span class="line"><span>           Chassis: vm</span></span>
<span class="line"><span>        Machine ID:cfc5689e4c90435dbf037c4b600bdba2</span></span>
<span class="line"><span>           Boot ID:0723cc481fd34048ab20036d0367ffc2</span></span>
<span class="line"><span>   Virtualization: vmware</span></span>
<span class="line"><span> Operating System: CentOS Linux 7 (Core)</span></span>
<span class="line"><span>       CPE OS Name: cpe:/o:centos:centos:7</span></span>
<span class="line"><span>            Kernel: Linux 3.10.0-327.el7.x86_64</span></span>
<span class="line"><span>     Architecture: x86-64</span></span>
<span class="line"><span>[ceph@client-node ~]$</span></span></code></pre></div><h2 id="工具" tabindex="-1">工具 <a class="header-anchor" href="#工具" aria-label="Permalink to &quot;工具&quot;">​</a></h2><h3 id="查看端口" tabindex="-1">查看端口 <a class="header-anchor" href="#查看端口" aria-label="Permalink to &quot;查看端口&quot;">​</a></h3><p>netstat -nltp</p><p>需安装net-tools yum install net-tools</p><p>参考</p><h3 id="top-htop" tabindex="-1">top/htop <a class="header-anchor" href="#top-htop" aria-label="Permalink to &quot;top/htop&quot;">​</a></h3><p>htop</p><p>需安装htop yum install htop</p><p><strong>参考</strong></p><ul><li>官网 <a href="http://hisham.hm/htop/" target="_blank" rel="noreferrer">http://hisham.hm/htop/</a></li><li>htop详解 <a href="https://www.cnblogs.com/lazyfang/p/7650010.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/lazyfang/p/7650010.html</a></li><li>htop的安装和使用！ <a href="https://www.cnblogs.com/enet01/p/8316006.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/enet01/p/8316006.html</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,29)]))}const m=s(t,[["render",l]]);export{u as __pageData,m as default};
