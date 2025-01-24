import{_ as a,c as n,ai as t,o as p}from"./chunks/framework.BrYByd3F.js";const o="/vitepress-blog-template/images/tomcat/tomcat-x-sourcecode-2.png",e="/vitepress-blog-template/images/tomcat/tomcat-x-sourcecode-3.png",l="/vitepress-blog-template/images/tomcat/tomcat-x-sourcecode-4.png",i="/vitepress-blog-template/images/tomcat/tomcat-x-sourcecode-1.png",c="/vitepress-blog-template/images/tomcat/tomcat-x-sourcecode-5.png",u="/vitepress-blog-template/images/tomcat/tomcat-x-sourcecode-6.png",E=JSON.parse('{"title":"Tomcat - 源码分析准备和分析入口","description":"","frontmatter":{},"headers":[],"relativePath":"framework/tomcat/tomcat-x-sourcecode.md","filePath":"framework/tomcat/tomcat-x-sourcecode.md","lastUpdated":1737706346000}'),r={name:"framework/tomcat/tomcat-x-sourcecode.md"};function A(q,s,d,g,h,_){return p(),n("div",null,s[0]||(s[0]=[t('<h1 id="tomcat-源码分析准备和分析入口" tabindex="-1">Tomcat - 源码分析准备和分析入口 <a class="header-anchor" href="#tomcat-源码分析准备和分析入口" aria-label="Permalink to &quot;Tomcat - 源码分析准备和分析入口&quot;">​</a></h1><blockquote><p>上文我们介绍了Tomcat的架构设计，接下来我们便可以下载源码以及寻找源码入口了。@pdai</p></blockquote><h2 id="源代码下载和编译" tabindex="-1">源代码下载和编译 <a class="header-anchor" href="#源代码下载和编译" aria-label="Permalink to &quot;源代码下载和编译&quot;">​</a></h2><p>首先是去官网下载Tomcat的源代码和二进制安装包，我这里分析最新的<a href="https://tomcat.apache.org/download-90.cgi" target="_blank" rel="noreferrer">Tomcat9.0.39稳定版本在新窗口打开</a><a href="https://tomcat.apache.org/download-90.cgi" target="_blank" rel="noreferrer">https://tomcat.apache.org/download-90.cgi</a></p><h3 id="下载二进制包和源码" tabindex="-1">下载二进制包和源码 <a class="header-anchor" href="#下载二进制包和源码" aria-label="Permalink to &quot;下载二进制包和源码&quot;">​</a></h3><blockquote><p>下载二进制包的主要目的在于，让我们回顾一下包中的内容；其次，在我们后面通过源码包编译后，以方便和二进制包进行对比。</p></blockquote><ul><li>下载两个包</li></ul><p><img src="'+o+'" alt="error.图片加载失败"></p><ul><li>查看二进制包中主要模块</li></ul><p><img src="'+e+'" alt="error.图片加载失败"></p><h3 id="编译源码" tabindex="-1">编译源码 <a class="header-anchor" href="#编译源码" aria-label="Permalink to &quot;编译源码&quot;">​</a></h3><ul><li>导入IDEA</li></ul><p><img src="'+l+'" alt="error.图片加载失败"></p><ul><li>使用ant编译</li></ul><p><img src="'+i+'" alt="error.图片加载失败"></p><h3 id="理解编译后模块" tabindex="-1">理解编译后模块 <a class="header-anchor" href="#理解编译后模块" aria-label="Permalink to &quot;理解编译后模块&quot;">​</a></h3><blockquote><p>这里有两点要注意下：第一：在编译完之后，编译输出到哪里了呢？第二：编译后的结果是不是和我们下载的二进制文件对的上呢？</p></blockquote><ul><li>编译的输出在哪里</li></ul><p><img src="'+c+'" alt="error.图片加载失败"></p><ul><li>编译的输出结果是否对的上，很显然和上面的二进制包一致</li></ul><p><img src="'+u+`" alt="error.图片加载失败"></p><h2 id="从启动脚本定位tomcat源码入口" tabindex="-1">从启动脚本定位Tomcat源码入口 <a class="header-anchor" href="#从启动脚本定位tomcat源码入口" aria-label="Permalink to &quot;从启动脚本定位Tomcat源码入口&quot;">​</a></h2><blockquote><p>好了，到这里我们基本上已经有准备好代码了，接下来便是寻找代码入口了。@pdai</p></blockquote><h3 id="startup-bat" tabindex="-1">startup.bat <a class="header-anchor" href="#startup-bat" aria-label="Permalink to &quot;startup.bat&quot;">​</a></h3><blockquote><p>当我们初学tomcat的时候, 肯定先要学习怎样启动tomcat. 在tomcat的bin目录下有两个启动tomcat的文件, 一个是startup.bat, 它用于windows环境下启动tomcat; 另一个是startup.sh, 它用于linux环境下tomcat的启动. 两个文件中的逻辑是一样的, 我们只分析其中的startup.bat.</p></blockquote><ul><li>startup.bat的源码: <strong>startup.bat文件实际上就做了一件事情: 启动catalina.bat.</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@echo off</span></span>
<span class="line"><span>rem Licensed to the Apache Software Foundation (ASF) under one or more</span></span>
<span class="line"><span>rem contributor license agreements.  See the NOTICE file distributed with</span></span>
<span class="line"><span>rem this work for additional information regarding copyright ownership.</span></span>
<span class="line"><span>rem The ASF licenses this file to You under the Apache License, Version 2.0</span></span>
<span class="line"><span>rem (the &quot;License&quot;); you may not use this file except in compliance with</span></span>
<span class="line"><span>rem the License.  You may obtain a copy of the License at</span></span>
<span class="line"><span>rem</span></span>
<span class="line"><span>rem     http://www.apache.org/licenses/LICENSE-2.0</span></span>
<span class="line"><span>rem</span></span>
<span class="line"><span>rem Unless required by applicable law or agreed to in writing, software</span></span>
<span class="line"><span>rem distributed under the License is distributed on an &quot;AS IS&quot; BASIS,</span></span>
<span class="line"><span>rem WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.</span></span>
<span class="line"><span>rem See the License for the specific language governing permissions and</span></span>
<span class="line"><span>rem limitations under the License.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>rem ---------------------------------------------------------------------------</span></span>
<span class="line"><span>rem Start script for the CATALINA Server</span></span>
<span class="line"><span>rem ---------------------------------------------------------------------------</span></span>
<span class="line"><span></span></span>
<span class="line"><span>setlocal</span></span>
<span class="line"><span></span></span>
<span class="line"><span>rem Guess CATALINA_HOME if not defined</span></span>
<span class="line"><span>set &quot;CURRENT_DIR=%cd%&quot;</span></span>
<span class="line"><span>if not &quot;%CATALINA_HOME%&quot; == &quot;&quot; goto gotHome</span></span>
<span class="line"><span>set &quot;CATALINA_HOME=%CURRENT_DIR%&quot;</span></span>
<span class="line"><span>if exist &quot;%CATALINA_HOME%\\bin\\catalina.bat&quot; goto okHome</span></span>
<span class="line"><span>cd ..</span></span>
<span class="line"><span>set &quot;CATALINA_HOME=%cd%&quot;</span></span>
<span class="line"><span>cd &quot;%CURRENT_DIR%&quot;</span></span>
<span class="line"><span>:gotHome</span></span>
<span class="line"><span>if exist &quot;%CATALINA_HOME%\\bin\\catalina.bat&quot; goto okHome</span></span>
<span class="line"><span>echo The CATALINA_HOME environment variable is not defined correctly</span></span>
<span class="line"><span>echo This environment variable is needed to run this program</span></span>
<span class="line"><span>goto end</span></span>
<span class="line"><span>:okHome</span></span>
<span class="line"><span></span></span>
<span class="line"><span>set &quot;EXECUTABLE=%CATALINA_HOME%\\bin\\catalina.bat&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>rem Check that target executable exists</span></span>
<span class="line"><span>if exist &quot;%EXECUTABLE%&quot; goto okExec</span></span>
<span class="line"><span>echo Cannot find &quot;%EXECUTABLE%&quot;</span></span>
<span class="line"><span>echo This file is needed to run this program</span></span>
<span class="line"><span>goto end</span></span>
<span class="line"><span>:okExec</span></span>
<span class="line"><span></span></span>
<span class="line"><span>rem Get remaining unshifted command line arguments and save them in the</span></span>
<span class="line"><span>set CMD_LINE_ARGS=</span></span>
<span class="line"><span>:setArgs</span></span>
<span class="line"><span>if &quot;&quot;%1&quot;&quot;==&quot;&quot;&quot;&quot; goto doneSetArgs</span></span>
<span class="line"><span>set CMD_LINE_ARGS=%CMD_LINE_ARGS% %1</span></span>
<span class="line"><span>shift</span></span>
<span class="line"><span>goto setArgs</span></span>
<span class="line"><span>:doneSetArgs</span></span>
<span class="line"><span></span></span>
<span class="line"><span>call &quot;%EXECUTABLE%&quot; start %CMD_LINE_ARGS%</span></span>
<span class="line"><span></span></span>
<span class="line"><span>:end</span></span></code></pre></div><ul><li><p>当然如果你感兴趣，不妨也可以看下上面脚本的含义</p><ul><li>.bat文件中@echo是打印指令, 用于控制台输出信息, rem是注释符.</li><li>跳过开头的注释, 我们来到配置CATALINA_HOME的代码段, 执行startup.bat文件首先会设置CATALINA_HOME.</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>set &quot;CURRENT_DIR=%cd%&quot;</span></span>
<span class="line"><span>if not &quot;%CATALINA_HOME%&quot; == &quot;&quot; goto gotHome</span></span>
<span class="line"><span>set &quot;CATALINA_HOME=%CURRENT_DIR%&quot;</span></span>
<span class="line"><span>if exist &quot;%CATALINA_HOME%\\bin\\catalina.bat&quot; goto okHome</span></span>
<span class="line"><span>cd ..</span></span>
<span class="line"><span>set &quot;CATALINA_HOME=%cd%&quot;</span></span>
<span class="line"><span>cd &quot;%CURRENT_DIR%&quot;</span></span>
<span class="line"><span>:gotHome</span></span>
<span class="line"><span>if exist &quot;%CATALINA_HOME%\\bin\\catalina.bat&quot; goto okHome</span></span>
<span class="line"><span>echo The CATALINA_HOME environment variable is not defined correctly</span></span>
<span class="line"><span>echo This environment variable is needed to run this program</span></span>
<span class="line"><span>goto end</span></span>
<span class="line"><span>:okHome</span></span></code></pre></div><ul><li>先通过set指令把当前目录设置到一个名为CURRENT_DIR的变量中,</li><li>如果系统中配置过CATALINA_HOME则跳到gotHome代码段. 正常情况下我们的电脑都没有配置CATALINA_HOME, 所以往下执行, 把当前目录设置为CATALINA_HOME.</li><li>然后判断CATALINA_HOME目录下是否存在catalina.bat文件, 如果存在就跳到okHome代码块.</li><li>在okHome中, 会把catalina.bat文件的的路径赋给一个叫EXECUTABLE的变量, 然后会进一步判断这个路径是否存在, 存在则跳转到okExec代码块, 不存在的话会在控制台输出一些错误信息.</li><li>在okExec中, 会把setArgs代码块的返回结果赋值给CMD_LINE_ARGS变量, 这个变量用于存储启动参数.</li><li>setArgs中首先会判断是否有参数, (if &quot;&quot;%1&quot;&quot;==&quot;&quot;&quot;&quot;判断第一个参数是否为空), 如果没有参数则相当于参数项为空. 如果有参数则循环遍历所有的参数(每次拼接第一个参数).</li><li>最后执行call &quot;%EXECUTABLE%&quot; start %CMD_LINE_ARGS%, 也就是说执行catalina.bat文件, 如果有参数则带上参数.</li></ul></li></ul><blockquote><p>这样看来, 在windows下启动tomcat未必一定要通过startup.bat, 用catalina.bat start也是可以的.</p></blockquote><h3 id="catalina-bat" tabindex="-1">catalina.bat <a class="header-anchor" href="#catalina-bat" aria-label="Permalink to &quot;catalina.bat&quot;">​</a></h3><blockquote><p>catalina的脚本有点多，我们分开看：</p></blockquote><ul><li>跳过开头的注释, 我们来到下面的代码段:</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>setlocal</span></span>
<span class="line"><span></span></span>
<span class="line"><span>rem Suppress Terminate batch job on CTRL+C</span></span>
<span class="line"><span>if not &quot;&quot;%1&quot;&quot; == &quot;&quot;run&quot;&quot; goto mainEntry</span></span>
<span class="line"><span>if &quot;%TEMP%&quot; == &quot;&quot; goto mainEntry</span></span>
<span class="line"><span>if exist &quot;%TEMP%\\%~nx0.run&quot; goto mainEntry</span></span>
<span class="line"><span>echo Y&gt;&quot;%TEMP%\\%~nx0.run&quot;</span></span>
<span class="line"><span>if not exist &quot;%TEMP%\\%~nx0.run&quot; goto mainEntry</span></span>
<span class="line"><span>echo Y&gt;&quot;%TEMP%\\%~nx0.Y&quot;</span></span>
<span class="line"><span>call &quot;%~f0&quot; %* &lt;&quot;%TEMP%\\%~nx0.Y&quot;</span></span>
<span class="line"><span>rem Use provided errorlevel</span></span>
<span class="line"><span>set RETVAL=%ERRORLEVEL%</span></span>
<span class="line"><span>del /Q &quot;%TEMP%\\%~nx0.Y&quot; &gt;NUL 2&gt;&amp;1</span></span>
<span class="line"><span>exit /B %RETVAL%</span></span>
<span class="line"><span>:mainEntry</span></span>
<span class="line"><span>del /Q &quot;%TEMP%\\%~nx0.run&quot; &gt;NUL 2&gt;&amp;1</span></span></code></pre></div><ul><li>大多情况下我们启动tomcat都没有设置参数, 所以直接跳到mainEntry代码段, 删除了一个临时文件后, 继续往下执行.</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>rem Guess CATALINA_HOME if not defined</span></span>
<span class="line"><span>set &quot;CURRENT_DIR=%cd%&quot;</span></span>
<span class="line"><span>if not &quot;%CATALINA_HOME%&quot; == &quot;&quot; goto gotHome</span></span>
<span class="line"><span>set &quot;CATALINA_HOME=%CURRENT_DIR%&quot;</span></span>
<span class="line"><span>if exist &quot;%CATALINA_HOME%\\bin\\catalina.bat&quot; goto okHome</span></span>
<span class="line"><span>cd ..</span></span>
<span class="line"><span>set &quot;CATALINA_HOME=%cd%&quot;</span></span>
<span class="line"><span>cd &quot;%CURRENT_DIR%&quot;</span></span>
<span class="line"><span>:gotHome</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if exist &quot;%CATALINA_HOME%\\bin\\catalina.bat&quot; goto okHome</span></span>
<span class="line"><span>echo The CATALINA_HOME environment variable is not defined correctly</span></span>
<span class="line"><span>echo This environment variable is needed to run this program</span></span>
<span class="line"><span>goto end</span></span>
<span class="line"><span>:okHome</span></span>
<span class="line"><span></span></span>
<span class="line"><span>rem Copy CATALINA_BASE from CATALINA_HOME if not defined</span></span>
<span class="line"><span>if not &quot;%CATALINA_BASE%&quot; == &quot;&quot; goto gotBase</span></span>
<span class="line"><span>set &quot;CATALINA_BASE=%CATALINA_HOME%&quot;</span></span></code></pre></div><ul><li>可以看到这段代码与startup.bat中开头的代码相似, 在确定CATALINA_HOME下有catalina.bat后把CATALINA_HOME赋给变量CATALINA_BASE.</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>rem Get standard environment variables</span></span>
<span class="line"><span>if not exist &quot;%CATALINA_BASE%\\bin\\setenv.bat&quot; goto checkSetenvHome</span></span>
<span class="line"><span>call &quot;%CATALINA_BASE%\\bin\\setenv.bat&quot;</span></span>
<span class="line"><span>goto setenvDone</span></span>
<span class="line"><span>:checkSetenvHome</span></span>
<span class="line"><span>if exist &quot;%CATALINA_HOME%\\bin\\setenv.bat&quot; call &quot;%CATALINA_HOME%\\bin\\setenv.bat&quot;</span></span>
<span class="line"><span>:setenvDone</span></span>
<span class="line"><span></span></span>
<span class="line"><span>rem Get standard Java environment variables</span></span>
<span class="line"><span>if exist &quot;%CATALINA_HOME%\\bin\\setclasspath.bat&quot; goto okSetclasspath</span></span>
<span class="line"><span>echo Cannot find &quot;%CATALINA_HOME%\\bin\\setclasspath.bat&quot;</span></span>
<span class="line"><span>echo This file is needed to run this program</span></span>
<span class="line"><span>goto end</span></span>
<span class="line"><span>:okSetclasspath</span></span>
<span class="line"><span>call &quot;%CATALINA_HOME%\\bin\\setclasspath.bat&quot; %1</span></span>
<span class="line"><span>if errorlevel 1 goto end</span></span>
<span class="line"><span></span></span>
<span class="line"><span>rem Add on extra jar file to CLASSPATH</span></span>
<span class="line"><span>rem Note that there are no quotes as we do not want to introduce random</span></span>
<span class="line"><span>rem quotes into the CLASSPATH</span></span>
<span class="line"><span>if &quot;%CLASSPATH%&quot; == &quot;&quot; goto emptyClasspath</span></span>
<span class="line"><span>set &quot;CLASSPATH=%CLASSPATH%;&quot;</span></span>
<span class="line"><span>:emptyClasspath</span></span>
<span class="line"><span>set &quot;CLASSPATH=%CLASSPATH%%CATALINA_HOME%\\bin\\bootstrap.jar&quot;</span></span></code></pre></div><blockquote><p>上面这段代码依次执行了setenv.bat和setclasspath.bat文件, 目的是获得CLASSPATH, 相信会Java的同学应该都会在配置环境变量时都配置过classpath, 系统拿到classpath路径后把它和CATALINA_HOME拼接在一起, 最终定位到一个叫bootstrap.jar的文件. 虽然后面还有很多代码, 但是这里必须暂停提示一下: bootstrap.jar将是我们启动tomcat的环境.</p></blockquote><ul><li>接下来从gotTmpdir代码块到noEndorsedVar代码块进行了一些配置, 由于不是主要内容暂且跳过.</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>echo Using CATALINA_BASE:   &quot;%CATALINA_BASE%&quot;</span></span>
<span class="line"><span>echo Using CATALINA_HOME:   &quot;%CATALINA_HOME%&quot;</span></span>
<span class="line"><span>echo Using CATALINA_TMPDIR: &quot;%CATALINA_TMPDIR%&quot;</span></span>
<span class="line"><span>if &quot;&quot;%1&quot;&quot; == &quot;&quot;debug&quot;&quot; goto use_jdk</span></span>
<span class="line"><span>echo Using JRE_HOME:        &quot;%JRE_HOME%&quot;</span></span>
<span class="line"><span>goto java_dir_displayed</span></span>
<span class="line"><span>:use_jdk</span></span>
<span class="line"><span>echo Using JAVA_HOME:       &quot;%JAVA_HOME%&quot;</span></span>
<span class="line"><span>:java_dir_displayed</span></span>
<span class="line"><span>echo Using CLASSPATH:       &quot;%CLASSPATH%&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>set _EXECJAVA=%_RUNJAVA%</span></span>
<span class="line"><span>set MAINCLASS=org.apache.catalina.startup.Bootstrap</span></span>
<span class="line"><span>set ACTION=start</span></span>
<span class="line"><span>set SECURITY_POLICY_FILE=</span></span>
<span class="line"><span>set DEBUG_OPTS=</span></span>
<span class="line"><span>set JPDA=</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if not &quot;&quot;%1&quot;&quot; == &quot;&quot;jpda&quot;&quot; goto noJpda</span></span>
<span class="line"><span>set JPDA=jpda</span></span>
<span class="line"><span>if not &quot;%JPDA_TRANSPORT%&quot; == &quot;&quot; goto gotJpdaTransport</span></span>
<span class="line"><span>set JPDA_TRANSPORT=dt_socket</span></span>
<span class="line"><span>:gotJpdaTransport</span></span>
<span class="line"><span>if not &quot;%JPDA_ADDRESS%&quot; == &quot;&quot; goto gotJpdaAddress</span></span>
<span class="line"><span>set JPDA_ADDRESS=8000</span></span>
<span class="line"><span>:gotJpdaAddress</span></span>
<span class="line"><span>if not &quot;%JPDA_SUSPEND%&quot; == &quot;&quot; goto gotJpdaSuspend</span></span>
<span class="line"><span>set JPDA_SUSPEND=n</span></span>
<span class="line"><span>:gotJpdaSuspend</span></span>
<span class="line"><span>if not &quot;%JPDA_OPTS%&quot; == &quot;&quot; goto gotJpdaOpts</span></span>
<span class="line"><span>set JPDA_OPTS=-agentlib:jdwp=transport=%JPDA_TRANSPORT%,address=%JPDA_ADDRESS%,server=y,suspend=%JPDA_SUSPEND%</span></span>
<span class="line"><span>:gotJpdaOpts</span></span>
<span class="line"><span>shift</span></span>
<span class="line"><span>:noJpda</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if &quot;&quot;%1&quot;&quot; == &quot;&quot;debug&quot;&quot; goto doDebug</span></span>
<span class="line"><span>if &quot;&quot;%1&quot;&quot; == &quot;&quot;run&quot;&quot; goto doRun</span></span>
<span class="line"><span>if &quot;&quot;%1&quot;&quot; == &quot;&quot;start&quot;&quot; goto doStart</span></span>
<span class="line"><span>if &quot;&quot;%1&quot;&quot; == &quot;&quot;stop&quot;&quot; goto doStop</span></span>
<span class="line"><span>if &quot;&quot;%1&quot;&quot; == &quot;&quot;configtest&quot;&quot; goto doConfigTest</span></span>
<span class="line"><span>if &quot;&quot;%1&quot;&quot; == &quot;&quot;version&quot;&quot; goto doVersion</span></span></code></pre></div><ul><li>接下来, 我们能看到一些重要的信息, 其中的重点是:</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>set _EXECJAVA=%_RUNJAVA%, 设置了jdk中bin目录下的java.exe文件路径.</span></span>
<span class="line"><span>set MAINCLASS=org.apache.catalina.startup.Bootstrap, 设置了tomcat的启动类为Bootstrap这个类. (后面会分析这个类)</span></span>
<span class="line"><span>set ACTION=start设置tomcat启动</span></span></code></pre></div><blockquote><p>大家可以留意这些参数, 最后执行tomcat的启动时会用到.</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if not &quot;&quot;%1&quot;&quot; == &quot;&quot;jpda&quot;&quot; goto noJpda</span></span>
<span class="line"><span>set JPDA=jpda</span></span>
<span class="line"><span>if not &quot;%JPDA_TRANSPORT%&quot; == &quot;&quot; goto gotJpdaTransport</span></span>
<span class="line"><span>set JPDA_TRANSPORT=dt_socket</span></span>
<span class="line"><span>:gotJpdaTransport</span></span>
<span class="line"><span>if not &quot;%JPDA_ADDRESS%&quot; == &quot;&quot; goto gotJpdaAddress</span></span>
<span class="line"><span>set JPDA_ADDRESS=8000</span></span>
<span class="line"><span>:gotJpdaAddress</span></span>
<span class="line"><span>if not &quot;%JPDA_SUSPEND%&quot; == &quot;&quot; goto gotJpdaSuspend</span></span>
<span class="line"><span>set JPDA_SUSPEND=n</span></span>
<span class="line"><span>:gotJpdaSuspend</span></span>
<span class="line"><span>if not &quot;%JPDA_OPTS%&quot; == &quot;&quot; goto gotJpdaOpts</span></span>
<span class="line"><span>set JPDA_OPTS=-agentlib:jdwp=transport=%JPDA_TRANSPORT%,address=%JPDA_ADDRESS%,server=y,suspend=%JPDA_SUSPEND%</span></span>
<span class="line"><span>:gotJpdaOpts</span></span>
<span class="line"><span>shift</span></span>
<span class="line"><span>:noJpda</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if &quot;&quot;%1&quot;&quot; == &quot;&quot;debug&quot;&quot; goto doDebug</span></span>
<span class="line"><span>if &quot;&quot;%1&quot;&quot; == &quot;&quot;run&quot;&quot; goto doRun</span></span>
<span class="line"><span>if &quot;&quot;%1&quot;&quot; == &quot;&quot;start&quot;&quot; goto doStart</span></span>
<span class="line"><span>if &quot;&quot;%1&quot;&quot; == &quot;&quot;stop&quot;&quot; goto doStop</span></span>
<span class="line"><span>if &quot;&quot;%1&quot;&quot; == &quot;&quot;configtest&quot;&quot; goto doConfigTest</span></span>
<span class="line"><span>if &quot;&quot;%1&quot;&quot; == &quot;&quot;version&quot;&quot; goto doVersion</span></span></code></pre></div><ul><li>接着判断第一个参数是否是jpda, 是则进行一些设定. 而正常情况下第一个参数是start, 所以跳过这段代码. 接着会判断第一个参数的内容, 根据判断, 我们会跳到doStart代码段. (有余力的同学不妨看下debug, run等启动方式)</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>:doStart</span></span>
<span class="line"><span>shift</span></span>
<span class="line"><span>if &quot;%TITLE%&quot; == &quot;&quot; set TITLE=Tomcat</span></span>
<span class="line"><span>set _EXECJAVA=start &quot;%TITLE%&quot; %_RUNJAVA%</span></span>
<span class="line"><span>if not &quot;&quot;%1&quot;&quot; == &quot;&quot;-security&quot;&quot; goto execCmd</span></span>
<span class="line"><span>shift</span></span>
<span class="line"><span>echo Using Security Manager</span></span>
<span class="line"><span>set &quot;SECURITY_POLICY_FILE=%CATALINA_BASE%\\conf\\catalina.policy&quot;</span></span>
<span class="line"><span>goto execCmd</span></span></code></pre></div><ul><li>可以看到doStart中无非也是设定一些参数, 最终会跳转到execCmd代码段</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>:execCmd</span></span>
<span class="line"><span>rem Get remaining unshifted command line arguments and save them in the</span></span>
<span class="line"><span>set CMD_LINE_ARGS=</span></span>
<span class="line"><span>:setArgs</span></span>
<span class="line"><span>if &quot;&quot;%1&quot;&quot;==&quot;&quot;&quot;&quot; goto doneSetArgs</span></span>
<span class="line"><span>set CMD_LINE_ARGS=%CMD_LINE_ARGS% %1</span></span>
<span class="line"><span>shift</span></span>
<span class="line"><span>goto setArgs</span></span>
<span class="line"><span>:doneSetArgs</span></span></code></pre></div><blockquote><p>可以看到这段代码也是在拼接参数, 把参数拼接到一个叫CMD_LINE_ARGS的变量中, 接下来就是catalina最后的一段代码了.</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>rem Execute Java with the applicable properties</span></span>
<span class="line"><span>if not &quot;%JPDA%&quot; == &quot;&quot; goto doJpda</span></span>
<span class="line"><span>if not &quot;%SECURITY_POLICY_FILE%&quot; == &quot;&quot; goto doSecurity</span></span>
<span class="line"><span>%_EXECJAVA% %LOGGING_CONFIG% %LOGGING_MANAGER% %JAVA_OPTS% %CATALINA_OPTS% %DEBUG_OPTS% -D%ENDORSED_PROP%=&quot;%JAVA_ENDORSED_DIRS%&quot; -classpath &quot;%CLASSPATH%&quot; -Dcatalina.base=&quot;%CATALINA_BASE%&quot; -Dcatalina.home=&quot;%CATALINA_HOME%&quot; -Djava.io.tmpdir=&quot;%CATALINA_TMPDIR%&quot; %MAINCLASS% %CMD_LINE_ARGS% %ACTION%</span></span>
<span class="line"><span>goto end</span></span>
<span class="line"><span>:doSecurity</span></span>
<span class="line"><span>%_EXECJAVA% %LOGGING_CONFIG% %LOGGING_MANAGER% %JAVA_OPTS% %CATALINA_OPTS% %DEBUG_OPTS% -D%ENDORSED_PROP%=&quot;%JAVA_ENDORSED_DIRS%&quot; -classpath &quot;%CLASSPATH%&quot; -Djava.security.manager -Djava.security.policy==&quot;%SECURITY_POLICY_FILE%&quot; -Dcatalina.base=&quot;%CATALINA_BASE%&quot; -Dcatalina.home=&quot;%CATALINA_HOME%&quot; -Djava.io.tmpdir=&quot;%CATALINA_TMPDIR%&quot; %MAINCLASS% %CMD_LINE_ARGS% %ACTION%</span></span>
<span class="line"><span>goto end</span></span>
<span class="line"><span>:doJpda</span></span>
<span class="line"><span>if not &quot;%SECURITY_POLICY_FILE%&quot; == &quot;&quot; goto doSecurityJpda</span></span>
<span class="line"><span>%_EXECJAVA% %LOGGING_CONFIG% %LOGGING_MANAGER% %JAVA_OPTS% %JPDA_OPTS% %CATALINA_OPTS% %DEBUG_OPTS% -D%ENDORSED_PROP%=&quot;%JAVA_ENDORSED_DIRS%&quot; -classpath &quot;%CLASSPATH%&quot; -Dcatalina.base=&quot;%CATALINA_BASE%&quot; -Dcatalina.home=&quot;%CATALINA_HOME%&quot; -Djava.io.tmpdir=&quot;%CATALINA_TMPDIR%&quot; %MAINCLASS% %CMD_LINE_ARGS% %ACTION%</span></span>
<span class="line"><span>goto end</span></span>
<span class="line"><span>:doSecurityJpda</span></span>
<span class="line"><span>%_EXECJAVA% %LOGGING_CONFIG% %LOGGING_MANAGER% %JAVA_OPTS% %JPDA_OPTS% %CATALINA_OPTS% %DEBUG_OPTS% -D%ENDORSED_PROP%=&quot;%JAVA_ENDORSED_DIRS%&quot; -classpath &quot;%CLASSPATH%&quot; -Djava.security.manager -Djava.security.policy==&quot;%SECURITY_POLICY_FILE%&quot; -Dcatalina.base=&quot;%CATALINA_BASE%&quot; -Dcatalina.home=&quot;%CATALINA_HOME%&quot; -Djava.io.tmpdir=&quot;%CATALINA_TMPDIR%&quot; %MAINCLASS% %CMD_LINE_ARGS% %ACTION%</span></span>
<span class="line"><span>goto end</span></span>
<span class="line"><span></span></span>
<span class="line"><span>:end</span></span></code></pre></div><ul><li>跳过前面两行判断后, 来到了关键语句:</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>%_EXECJAVA% %LOGGING_CONFIG% %LOGGING_MANAGER% %JAVA_OPTS% %CATALINA_OPTS% %DEBUG_OPTS% -D%ENDORSED_PROP%=&quot;%JAVA_ENDORSED_DIRS%&quot; -classpath &quot;%CLASSPATH%&quot; -Dcatalina.base=&quot;%CATALINA_BASE%&quot; -Dcatalina.home=&quot;%CATALINA_HOME%&quot; -Djava.io.tmpdir=&quot;%CATALINA_TMPDIR%&quot; %MAINCLASS% %CMD_LINE_ARGS% %ACTION%</span></span></code></pre></div><blockquote><p>_EXECJAVA也就是_RUNJAVA, 也就是平时说的java指令, 但在之前的doStart代码块中把_EXECJAVA改为了start &quot;%TITLE%&quot; %_RUNJAVA%, 所以系统会另启一个命令行窗口, 名字叫Tomcat. 在拼接一系列参数后, 我们会看见%MAINCLASS%, 也就是org.apache.catalina.startup.Bootstrap启动类, 拼接完启动参数后, 最后拼接的是%ACTION%, 也就是start.</p></blockquote><p><strong>总结</strong>:</p><ul><li><strong>catalina.bat最终执行了Bootstrap类中的main方法</strong>.</li><li>我们可以通过设定不同的参数让tomcat以不同的方式运行. 在ide中我们是可以选择debug等模式启动tomcat的, 也可以为其配置参数, 在catalina.bat中我们看到了启动tomcat背后的运作流程.</li></ul><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li><a href="https://www.cnblogs.com/tanshaoshenghao/p/10932306.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/tanshaoshenghao/p/10932306.html</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,58)]))}const T=a(r,[["render",A]]);export{E as __pageData,T as default};
