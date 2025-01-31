import{_ as s,c as n,ai as e,o as p}from"./chunks/framework.BrYByd3F.js";const d=JSON.parse('{"title":"Linux - ab压力测试","description":"","frontmatter":{},"headers":[],"relativePath":"tool/linux-ab-test.md","filePath":"tool/linux-ab-test.md","lastUpdated":1737706346000}'),t={name:"tool/linux-ab-test.md"};function i(l,a,r,c,o,h){return p(),n("div",null,a[0]||(a[0]=[e(`<h1 id="linux-ab压力测试" tabindex="-1">Linux - ab压力测试 <a class="header-anchor" href="#linux-ab压力测试" aria-label="Permalink to &quot;Linux - ab压力测试&quot;">​</a></h1><blockquote><p>ab是apachebench命令的缩写, apache自带的压力测试工具。ab非常实用，它不仅可以对apache服务器进行网站访问压力测试，也可以对或其它类型的服务器进行压力测试。</p></blockquote><h2 id="ab的简介" tabindex="-1">ab的简介 <a class="header-anchor" href="#ab的简介" aria-label="Permalink to &quot;ab的简介&quot;">​</a></h2><p>ab是apachebench命令的缩写。</p><p>ab是apache自带的压力测试工具。ab非常实用，它不仅可以对apache服务器进行网站访问压力测试，也可以对或其它类型的服务器进行压力测试。比如nginx、tomcat、IIS等</p><h2 id="ab的原理" tabindex="-1">ab的原理 <a class="header-anchor" href="#ab的原理" aria-label="Permalink to &quot;ab的原理&quot;">​</a></h2><p>ab的原理：ab命令会创建多个并发访问线程，模拟多个访问者同时对某一URL地址进行访问。它的测试目标是基于URL的，因此，它既可以用来测试apache的负载压力，也可以测试nginx、lighthttp、tomcat、IIS等其它Web服务器的压力。</p><p>ab命令对发出负载的计算机要求很低，它既不会占用很高CPU，也不会占用很多内存。但却会给目标服务器造成巨大的负载，其原理类似CC攻击。自己测试使用也需要注意，否则一次上太多的负载。可能造成目标服务器资源耗完，严重时甚至导致死机。</p><h2 id="ab的安装" tabindex="-1">ab的安装 <a class="header-anchor" href="#ab的安装" aria-label="Permalink to &quot;ab的安装&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>yum -y install httpd-tools</span></span></code></pre></div><p>测试安装是否成功：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@vic html]# ab -V</span></span>
<span class="line"><span>This is ApacheBench, Version 2.3 &lt;$Revision: 655654 $&gt;</span></span>
<span class="line"><span>Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/</span></span>
<span class="line"><span>Licensed to The Apache Software Foundation, http://www.apache.org/</span></span></code></pre></div><h3 id="ab的参数说明" tabindex="-1">ab的参数说明 <a class="header-anchor" href="#ab的参数说明" aria-label="Permalink to &quot;ab的参数说明&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@vic html]# ab --help</span></span>
<span class="line"><span>ab: wrong number of arguments</span></span>
<span class="line"><span>Usage: ab [options] [http[s]://]hostname[:port]/path</span></span>
<span class="line"><span>Options are:</span></span>
<span class="line"><span>    -n requests     Number of requests to perform</span></span>
<span class="line"><span>    -c concurrency  Number of multiple requests to make</span></span>
<span class="line"><span>    -t timelimit    Seconds to max. wait for responses</span></span>
<span class="line"><span>    -b windowsize   Size of TCP send/receive buffer, in bytes</span></span>
<span class="line"><span>    -p postfile     File containing data to POST. Remember also to set -T</span></span>
<span class="line"><span>    -u putfile      File containing data to PUT. Remember also to set -T</span></span>
<span class="line"><span>    -T content-type Content-type header for POSTing, eg.</span></span>
<span class="line"><span>                    &#39;application/x-www-form-urlencoded&#39;</span></span>
<span class="line"><span>                    Default is &#39;text/plain&#39;</span></span>
<span class="line"><span>    -v verbosity    How much troubleshooting info to print</span></span>
<span class="line"><span>    -w              Print out results in HTML tables</span></span>
<span class="line"><span>    -i              Use HEAD instead of GET</span></span>
<span class="line"><span>    -x attributes   String to insert as table attributes</span></span>
<span class="line"><span>    -y attributes   String to insert as tr attributes</span></span>
<span class="line"><span>    -z attributes   String to insert as td or th attributes</span></span>
<span class="line"><span>    -C attribute    Add cookie, eg. &#39;Apache=1234. (repeatable)</span></span>
<span class="line"><span>    -H attribute    Add Arbitrary header line, eg. &#39;Accept-Encoding: gzip&#39;</span></span>
<span class="line"><span>                    Inserted after all normal header lines. (repeatable)</span></span>
<span class="line"><span>    -A attribute    Add Basic WWW Authentication, the attributes</span></span>
<span class="line"><span>                    are a colon separated username and password.</span></span>
<span class="line"><span>    -P attribute    Add Basic Proxy Authentication, the attributes</span></span>
<span class="line"><span>                    are a colon separated username and password.</span></span>
<span class="line"><span>    -X proxy:port   Proxyserver and port number to use</span></span>
<span class="line"><span>    -V              Print version number and exit</span></span>
<span class="line"><span>    -k              Use HTTP KeepAlive feature</span></span>
<span class="line"><span>    -d              Do not show percentiles served table.</span></span>
<span class="line"><span>    -S              Do not show confidence estimators and warnings.</span></span>
<span class="line"><span>    -g filename     Output collected data to gnuplot format file.</span></span>
<span class="line"><span>    -e filename     Output CSV file with percentages served</span></span>
<span class="line"><span>    -r              Don&#39;t exit on socket receive errors.</span></span>
<span class="line"><span>    -h              Display usage information (this message)</span></span>
<span class="line"><span>    -Z ciphersuite  Specify SSL/TLS cipher suite (See openssl ciphers)</span></span>
<span class="line"><span>    -f protocol     Specify SSL/TLS protocol (SSL2, SSL3, TLS1, or ALL)</span></span></code></pre></div><p>详情说明：</p><p>-n在测试会话中所执行的请求个数。默认时，仅执行一个请求。请求的总数量</p><p>-c一次产生的请求个数。默认是一次一个。请求的用户量</p><p>-t测试所进行的最大秒数。其内部隐含值是-n 50000，它可以使对服务器的测试限制在一个固定的总时间以内。默认时，没有时间限制。</p><p>-V显示版本号并退出。</p><h2 id="性能指标" tabindex="-1">性能指标 <a class="header-anchor" href="#性能指标" aria-label="Permalink to &quot;性能指标&quot;">​</a></h2><h3 id="吞吐量-requests-per-second" tabindex="-1">吞吐量（Requests per second） <a class="header-anchor" href="#吞吐量-requests-per-second" aria-label="Permalink to &quot;吞吐量（Requests per second）&quot;">​</a></h3><p>服务器并发处理能力的量化描述，单位是reqs/s，指的是在某个并发用户数下单位时间内处理的请求数。某个并发用户数下单位时间内能处理的最大请求数，称之为最大吞吐率。 记住：吞吐率是基于并发用户数的。这句话代表了两个含义：</p><ul><li>吞吐率和并发用户数相关</li><li>不同的并发用户数下，吞吐率一般是不同的</li></ul><p>计算公式：总请求数/处理完成这些请求数所花费的时间，即</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Request per second=Complete requests/Time taken for tests</span></span></code></pre></div><p>必须要说明的是，这个数值表示当前机器的整体性能，值越大越好。</p><h3 id="并发连接数-the-number-of-concurrent-connections" tabindex="-1">并发连接数（The number of concurrent connections） <a class="header-anchor" href="#并发连接数-the-number-of-concurrent-connections" aria-label="Permalink to &quot;并发连接数（The number of concurrent connections）&quot;">​</a></h3><p>并发连接数指的是某个时刻服务器所接受的请求数目，简单的讲，就是一个会话。</p><h3 id="并发用户数-concurrency-level" tabindex="-1">并发用户数（Concurrency Level） <a class="header-anchor" href="#并发用户数-concurrency-level" aria-label="Permalink to &quot;并发用户数（Concurrency Level）&quot;">​</a></h3><p>要注意区分这个概念和并发连接数之间的区别，一个用户可能同时会产生多个会话，也即连接数。在HTTP/1.1下，IE7支持两个并发连接，IE8支持6个并发连接，FireFox3支持4个并发连接，所以相应的，我们的并发用户数就得除以这个基数。</p><h3 id="用户平均请求等待时间-time-per-request" tabindex="-1">用户平均请求等待时间（Time per request） <a class="header-anchor" href="#用户平均请求等待时间-time-per-request" aria-label="Permalink to &quot;用户平均请求等待时间（Time per request）&quot;">​</a></h3><p>计算公式：处理完成所有请求数所花费的时间/（总请求数/并发用户数），即：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Time per request=Time taken for tests/（Complete requests/Concurrency Level）</span></span></code></pre></div><h3 id="服务器平均请求等待时间-time-per-request-across-all-concurrent-requests" tabindex="-1">服务器平均请求等待时间（Time per request:across all concurrent requests） <a class="header-anchor" href="#服务器平均请求等待时间-time-per-request-across-all-concurrent-requests" aria-label="Permalink to &quot;服务器平均请求等待时间（Time per request:across all concurrent requests）&quot;">​</a></h3><p>计算公式：处理完成所有请求数所花费的时间/总请求数，即：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Time taken for/testsComplete requests</span></span></code></pre></div><p>可以看到，它是吞吐率的倒数。</p><p>同时，它也等于用户平均请求等待时间/并发用户数，即Time per request/Concurrency Level</p><h2 id="ab的应用" tabindex="-1">ab的应用 <a class="header-anchor" href="#ab的应用" aria-label="Permalink to &quot;ab的应用&quot;">​</a></h2><p>ab的命令参数比较多，我们经常使用的是-c和-n参数。</p><p><code>ab -c 10 -n 100 http://www.myvick.cn/index.php</code>：同时处理100个请求并运行10次index.php</p><ul><li>-c10表示并发用户数为10</li><li>-n100表示请求总数为100</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@vic html]# ab -c 10 -n 100 http://www.myvick.cn/index.php</span></span>
<span class="line"><span>This is ApacheBench, Version 2.3 &lt;$Revision: 655654 $&gt;</span></span>
<span class="line"><span>Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/</span></span>
<span class="line"><span>Licensed to The Apache Software Foundation, http://www.apache.org/</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Benchmarking www.myvick.cn (be patient).....done</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>Server Software:        nginx/1.13.6   #测试服务器的名字</span></span>
<span class="line"><span>Server Hostname:        www.myvick.cn  #请求的URL主机名</span></span>
<span class="line"><span>Server Port:            80             #web服务器监听的端口</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Document Path:          /index.php　　  #请求的URL中的根绝对路径，通过该文件的后缀名，我们一般可以了解该请求的类型</span></span>
<span class="line"><span>Document Length:        799 bytes       #HTTP响应数据的正文长度</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Concurrency Level:      10　　　　　　　　# 并发用户数，这是我们设置的参数之一</span></span>
<span class="line"><span>Time taken for tests:   0.668 seconds   #所有这些请求被处理完成所花费的总时间 单位秒</span></span>
<span class="line"><span>Complete requests:      100 　　　　　　  # 总请求数量，这是我们设置的参数之一</span></span>
<span class="line"><span>Failed requests:        0　　　　　　　　  # 表示失败的请求数量，这里的失败是指请求在连接服务器、发送数据等环节发生异常，以及无响应后超时的情况</span></span>
<span class="line"><span>Write errors:           0</span></span>
<span class="line"><span>Total transferred:      96200 bytes　　　 #所有请求的响应数据长度总和。包括每个HTTP响应数据的头信息和正文数据的长度</span></span>
<span class="line"><span>HTML transferred:       79900 bytes　　　　# 所有请求的响应数据中正文数据的总和，也就是减去了Total transferred中HTTP响应数据中的头信息的长度</span></span>
<span class="line"><span>Requests per second:    149.71 [#/sec] (mean) #吞吐率，计算公式：Complete requests/Time taken for tests  总请求数/处理完成这些请求数所花费的时间</span></span>
<span class="line"><span>Time per request:       66.797 [ms] (mean)   # 用户平均请求等待时间，计算公式：Time token for tests/（Complete requests/Concurrency Level）。处理完成所有请求数所花费的时间/（总请求数/并发用户数）</span></span>
<span class="line"><span>Time per request:       6.680 [ms] (mean, across all concurrent requests) #服务器平均请求等待时间，计算公式：Time taken for tests/Complete requests，正好是吞吐率的倒数。也可以这么统计：Time per request/Concurrency Level</span></span>
<span class="line"><span>Transfer rate:          140.64 [Kbytes/sec] received  #表示这些请求在单位时间内从服务器获取的数据长度，计算公式：Total trnasferred/ Time taken for tests，这个统计很好的说明服务器的处理能力达到极限时，其出口宽带的需求量。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Connection Times (ms)</span></span>
<span class="line"><span>              min  mean[+/-sd] median   max</span></span>
<span class="line"><span>Connect:        1    2   0.7      2       5</span></span>
<span class="line"><span>Processing:     2   26  81.3      3     615</span></span>
<span class="line"><span>Waiting:        1   26  81.3      3     615</span></span>
<span class="line"><span>Total:          3   28  81.3      6     618</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Percentage of the requests served within a certain time (ms)</span></span>
<span class="line"><span>  50%      6</span></span>
<span class="line"><span>  66%      6</span></span>
<span class="line"><span>  75%      7</span></span>
<span class="line"><span>  80%      7</span></span>
<span class="line"><span>  90%     10</span></span>
<span class="line"><span>  95%    209</span></span>
<span class="line"><span>  98%    209</span></span>
<span class="line"><span>  99%    618</span></span>
<span class="line"><span> 100%    618 (longest request)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#Percentage of requests served within a certain time（ms）这部分数据用于描述每个请求处理时间的分布情况，比如以上测试，80%的请求处理时间都不超过7ms，这个处理时间是指前面的Time per request，即对于单个用户而言，平均每个请求的处理时间</span></span></code></pre></div><h2 id="文章来源" tabindex="-1">文章来源 <a class="header-anchor" href="#文章来源" aria-label="Permalink to &quot;文章来源&quot;">​</a></h2><ul><li>本文转载自 <a href="https://www.cnblogs.com/myvic/p/7703973.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/myvic/p/7703973.html</a></li><li>作者：myvic</li></ul><p>参考资料：</p><p><a href="http://www.jb51.net/article/59469.htm" target="_blank" rel="noreferrer">http://www.jb51.net/article/59469.htm</a></p><p><a href="http://blog.csdn.net/caotianyin/article/details/49253055" target="_blank" rel="noreferrer">http://blog.csdn.net/caotianyin/article/details/49253055</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,49)]))}const b=s(t,[["render",i]]);export{d as __pageData,b as default};
