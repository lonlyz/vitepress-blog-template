import{_ as n,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const u=JSON.parse('{"title":"SpringBoot应用部署 - 在linux环境将jar制作成service","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-jar-service-linux.md","filePath":"spring/springboot/springboot-x-jar-service-linux.md","lastUpdated":1737706346000}'),l={name:"spring/springboot/springboot-x-jar-service-linux.md"};function i(c,s,t,o,r,d){return e(),a("div",null,s[0]||(s[0]=[p(`<h1 id="springboot应用部署-在linux环境将jar制作成service" tabindex="-1">SpringBoot应用部署 - 在linux环境将jar制作成service <a class="header-anchor" href="#springboot应用部署-在linux环境将jar制作成service" aria-label="Permalink to &quot;SpringBoot应用部署 - 在linux环境将jar制作成service&quot;">​</a></h1><blockquote><p>前文我们将SpringBoot应用打包成jar，那么如何将jar封装成service呢？本文主要介绍将SpringBoot应用部署成linux的service。@pdai</p></blockquote><h2 id="概述" tabindex="-1">概述 <a class="header-anchor" href="#概述" aria-label="Permalink to &quot;概述&quot;">​</a></h2><blockquote><p>基本的<code>java -jar</code>运行方式，和这种运行方式的缺陷。</p></blockquote><h3 id="java-jar运行" tabindex="-1">Java -jar运行？ <a class="header-anchor" href="#java-jar运行" aria-label="Permalink to &quot;Java -jar运行？&quot;">​</a></h3><p>Linux 运行jar包基本命令：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 当前ssh窗口被锁定，可按CTRL + C打断程序运行，或直接关闭窗口，程序退出</span></span>
<span class="line"><span>java -jar XXX.jar</span></span>
<span class="line"><span></span></span>
<span class="line"><span># &amp;代表在后台运行。当前ssh窗口不被锁定，但是当窗口关闭时，程序中止运行。</span></span>
<span class="line"><span>java -jar XXX.jar &amp;</span></span></code></pre></div><p>nohup命令， nohup 意思是不挂断运行命令,当账户退出或终端关闭时,程序仍然运行</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 当用 nohup 命令执行作业时，缺省情况下该作业的所有输出被重定向到nohup.out的文件中。</span></span>
<span class="line"><span>nohup java -jar XXX.jar &amp;  </span></span>
<span class="line"><span></span></span>
<span class="line"><span># 输出重定向到temp.txt文件</span></span>
<span class="line"><span>nohup java -jar XXX.jar &gt;temp.txt &amp;  </span></span>
<span class="line"><span></span></span>
<span class="line"><span># 程序在后台运行，当ssh窗口关闭，程序正常运行，且不会输出文件</span></span>
<span class="line"><span>nohup java -jar xx.jar &gt;/dev/null 2&gt;&amp;1 &amp;</span></span></code></pre></div><h3 id="这种运行方式的缺陷" tabindex="-1">这种运行方式的缺陷 <a class="header-anchor" href="#这种运行方式的缺陷" aria-label="Permalink to &quot;这种运行方式的缺陷&quot;">​</a></h3><blockquote><p>这种运行方式有何缺陷呢？</p></blockquote><ol><li>不优雅</li><li>无法向Linux服务一样简单易用，具备start,stop,restart等service操作方式。以及开机自启等。</li></ol><h2 id="在linux环境封装service" tabindex="-1">在Linux环境封装service <a class="header-anchor" href="#在linux环境封装service" aria-label="Permalink to &quot;在Linux环境封装service&quot;">​</a></h2><blockquote><p>加入我们编译出了一个tech_arch-0.0.1-RELEASE.jar，如何将它封装成service呢？</p></blockquote><h3 id="文件准备" tabindex="-1">文件准备 <a class="header-anchor" href="#文件准备" aria-label="Permalink to &quot;文件准备&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@docker opt]# tree -a</span></span>
<span class="line"><span>.</span></span>
<span class="line"><span>└── tech_doc</span></span>
<span class="line"><span>    ├── bin</span></span>
<span class="line"><span>    │   ├── logs</span></span>
<span class="line"><span>    │   │   └── service.2018-10-31.log</span></span>
<span class="line"><span>    │   └── tech_arch-0.0.1-RELEASE.jar</span></span>
<span class="line"><span>    └── tech_doc</span></span></code></pre></div><h3 id="创建启动文件" tabindex="-1">创建启动文件 <a class="header-anchor" href="#创建启动文件" aria-label="Permalink to &quot;创建启动文件&quot;">​</a></h3><p>tech_doc</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@docker opt]# cat tech_doc/tech_doc</span></span>
<span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#------------------------------------------------</span></span>
<span class="line"><span># function: services start</span></span>
<span class="line"><span># author: pdai</span></span>
<span class="line"><span># home: /opt/tech_doc/bin</span></span>
<span class="line"><span># log: /var/log/tech_doc/process</span></span>
<span class="line"><span>#------------------------------------------------</span></span>
<span class="line"><span></span></span>
<span class="line"><span>HOME=/opt/tech_doc/bin</span></span>
<span class="line"><span>LOGHOME=/var/log/tech_doc/process</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function serviceLoad()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  b=&#39;&#39;</span></span>
<span class="line"><span>  i=0</span></span>
<span class="line"><span>  while [ $i -le  100 ]</span></span>
<span class="line"><span>  do</span></span>
<span class="line"><span>      printf &quot;$1:[%-50s]%d%%\\r&quot; $b $i</span></span>
<span class="line"><span>      sleep 0.3</span></span>
<span class="line"><span>      i=\`expr 2 + $i\`</span></span>
<span class="line"><span>      b=#$b</span></span>
<span class="line"><span>  done</span></span>
<span class="line"><span>  echo</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function svcStart()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  echo &quot;Starting $2 ...&quot;</span></span>
<span class="line"><span>  cd $1</span></span>
<span class="line"><span>  PID=$(ps -ef | grep &quot;$4&quot; | grep -v grep | awk &#39;{print $2}&#39;)</span></span>
<span class="line"><span>  if [ -z &quot;$PID&quot; ]; then</span></span>
<span class="line"><span>          nohup java -jar $3  &gt; $5 2&gt; $6 &amp;</span></span>
<span class="line"><span>    serviceLoad $SERVICE_NAME</span></span>
<span class="line"><span>          echo &quot;$2 started ...&quot;</span></span>
<span class="line"><span>  else</span></span>
<span class="line"><span>          echo &quot;$2 is already running ...&quot;</span></span>
<span class="line"><span>  fi</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function svcStop()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  PID=$(ps -ef | grep &quot;$1&quot; | grep -v grep | awk &#39;{print $2}&#39;)</span></span>
<span class="line"><span>  if [ -z &quot;$PID&quot; ]; then</span></span>
<span class="line"><span>          echo &quot;$2 already stopped ...&quot;</span></span>
<span class="line"><span>  else</span></span>
<span class="line"><span>    kill $PID</span></span>
<span class="line"><span>        echo &quot;$2 is stoping ...&quot;</span></span>
<span class="line"><span>  fi</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function do_start()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  for FILE in \`ls $HOME | grep jar\`</span></span>
<span class="line"><span>  do</span></span>
<span class="line"><span>    FILE_NAME=$FILE</span></span>
<span class="line"><span>    SERVICE_JAR_PACKAGE_PATH=$HOME/$FILE</span></span>
<span class="line"><span>    SERVICE_NAME=\${FILE_NAME%-[0-9]*}</span></span>
<span class="line"><span>    SERVICE_LOG_PATH=&quot;$LOGHOME/$SERVICE_NAME.log&quot;</span></span>
<span class="line"><span>    SERVICE_ERR_LOG_PATH=&quot;$LOGHOME/$SERVICE_NAME.err&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    svcStart $HOME $SERVICE_NAME $SERVICE_JAR_PACKAGE_PATH $FILE_NAME $SERVICE_LOG_PATH $SERVICE_ERR_LOG_PATH</span></span>
<span class="line"><span>  done</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function do_stop()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    for FILE in \`ls $HOME | grep jar\`</span></span>
<span class="line"><span>  do</span></span>
<span class="line"><span>    FILE_NAME=$FILE</span></span>
<span class="line"><span>    SERVICE_NAME=\${FILE_NAME%-[0-9]*}</span></span>
<span class="line"><span>    SERVICE_PID_PATH=&quot;/tmp/$SERVICE_NAME.pid&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    svcStop $FILE_NAME $SERVICE_NAME</span></span>
<span class="line"><span>    sleep 1</span></span>
<span class="line"><span>  done</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function do_check()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    for FILE in \`ls $HOME | grep jar\`</span></span>
<span class="line"><span>  do</span></span>
<span class="line"><span>    FILE_NAME=$FILE</span></span>
<span class="line"><span>    SERVICE_NAME=\${FILE_NAME%-[0-9]*}</span></span>
<span class="line"><span>    PID=$(ps -ef | grep $FILE_NAME | grep -v grep | awk &#39;{print $2}&#39;)</span></span>
<span class="line"><span>  if [ -z &quot;$PID&quot; ]; then</span></span>
<span class="line"><span>          echo &quot;$SERVICE_NAME $PID is not running ...&quot;</span></span>
<span class="line"><span>  else</span></span>
<span class="line"><span>        echo &quot;$SERVICE_NAME $PID is running ...&quot;</span></span>
<span class="line"><span>  fi</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    sleep 1</span></span>
<span class="line"><span>  done</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>case &quot;$1&quot; in</span></span>
<span class="line"><span>    start)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        do_start</span></span>
<span class="line"><span>        echo start successful</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ;;</span></span>
<span class="line"><span>    stop)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        do_stop</span></span>
<span class="line"><span>        echo stop successful</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ;;</span></span>
<span class="line"><span>    restart)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        do_stop</span></span>
<span class="line"><span>              sleep 2</span></span>
<span class="line"><span>        do_start</span></span>
<span class="line"><span>        echo restart successful</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ;;</span></span>
<span class="line"><span>    status)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        do_check</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ;;</span></span>
<span class="line"><span>    *)</span></span>
<span class="line"><span>    echo &quot;Usage: {start|stop|restart|status}&quot; &gt;&amp;2</span></span>
<span class="line"><span>    exit 3</span></span>
<span class="line"><span>    ;;</span></span>
<span class="line"><span>esac</span></span>
<span class="line"><span>exit 0</span></span></code></pre></div><h3 id="制作服务" tabindex="-1">制作服务 <a class="header-anchor" href="#制作服务" aria-label="Permalink to &quot;制作服务&quot;">​</a></h3><p>在init.d下创建服务</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@docker init.d]# tree -a</span></span>
<span class="line"><span>.</span></span>
<span class="line"><span>├── functions</span></span>
<span class="line"><span>├── netconsole</span></span>
<span class="line"><span>├── network</span></span>
<span class="line"><span>├── README</span></span>
<span class="line"><span>└── tech-doc</span></span></code></pre></div><p>tech-doc内容如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@docker opt]# cd /etc/init.d</span></span>
<span class="line"><span>[root@docker init.d]# ls</span></span>
<span class="line"><span>functions  netconsole  network  README  tech-doc</span></span>
<span class="line"><span>[root@docker init.d]# tree -a</span></span>
<span class="line"><span>.</span></span>
<span class="line"><span>├── functions</span></span>
<span class="line"><span>├── netconsole</span></span>
<span class="line"><span>├── network</span></span>
<span class="line"><span>├── README</span></span>
<span class="line"><span>└── tech-doc</span></span>
<span class="line"><span></span></span>
<span class="line"><span>0 directories, 5 files</span></span>
<span class="line"><span>[root@docker init.d]# ^C</span></span>
<span class="line"><span>[root@docker init.d]# cat tech-doc</span></span>
<span class="line"><span>#!/bin/sh</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span># /etc/init.d/tech-doc</span></span>
<span class="line"><span># chkconfig: 2345 60 20</span></span>
<span class="line"><span># description: ms.</span></span>
<span class="line"><span># processname: tech-doc</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SCRIPT_HOME=/opt/tech_doc</span></span>
<span class="line"><span></span></span>
<span class="line"><span>case $1 in</span></span>
<span class="line"><span>    start)</span></span>
<span class="line"><span>        sh $SCRIPT_HOME/tech_doc start</span></span>
<span class="line"><span>    ;;</span></span>
<span class="line"><span>    stop)</span></span>
<span class="line"><span>        sh $SCRIPT_HOME/tech_doc stop</span></span>
<span class="line"><span>    ;;</span></span>
<span class="line"><span>    restart)</span></span>
<span class="line"><span>        sh $SCRIPT_HOME/tech_doc stop</span></span>
<span class="line"><span>        sh $SCRIPT_HOME/tech_doc start</span></span>
<span class="line"><span>    ;;</span></span>
<span class="line"><span>    status)</span></span>
<span class="line"><span>        sh $SCRIPT_HOME/tech_doc status</span></span>
<span class="line"><span>    ;;</span></span>
<span class="line"><span>    *)</span></span>
<span class="line"><span>    echo &quot;Usage: {start|stop|restart|status}&quot; &gt;&amp;2</span></span>
<span class="line"><span>    exit 3</span></span>
<span class="line"><span>    ;;</span></span>
<span class="line"><span>esac</span></span>
<span class="line"><span>exit 0</span></span></code></pre></div><h3 id="赋予权限" tabindex="-1">赋予权限 <a class="header-anchor" href="#赋予权限" aria-label="Permalink to &quot;赋予权限&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>chmod 777 /etc/init.d/tech-doc</span></span></code></pre></div><h3 id="开机自启" tabindex="-1">开机自启 <a class="header-anchor" href="#开机自启" aria-label="Permalink to &quot;开机自启&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>chkconfig --list</span></span>
<span class="line"><span>chkconfig tech-doc on</span></span></code></pre></div><h3 id="查看端口" tabindex="-1">查看端口 <a class="header-anchor" href="#查看端口" aria-label="Permalink to &quot;查看端口&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>netstat -nltp</span></span></code></pre></div><h3 id="查看防火墙" tabindex="-1">查看防火墙 <a class="header-anchor" href="#查看防火墙" aria-label="Permalink to &quot;查看防火墙&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>systemctl status firewalld</span></span></code></pre></div><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,35)]))}const g=n(l,[["render",i]]);export{u as __pageData,g as default};
