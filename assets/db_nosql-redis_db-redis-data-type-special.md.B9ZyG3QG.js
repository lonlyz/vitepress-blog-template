import{_ as s,c as n,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const d=JSON.parse('{"title":"Redis入门 - 数据类型：3种特殊类型详解","description":"","frontmatter":{},"headers":[],"relativePath":"db/nosql-redis/db-redis-data-type-special.md","filePath":"db/nosql-redis/db-redis-data-type-special.md","lastUpdated":1737706346000}'),t={name:"db/nosql-redis/db-redis-data-type-special.md"};function i(l,a,o,c,u,g){return e(),n("div",null,a[0]||(a[0]=[p(`<h1 id="redis入门-数据类型-3种特殊类型详解" tabindex="-1">Redis入门 - 数据类型：3种特殊类型详解 <a class="header-anchor" href="#redis入门-数据类型-3种特殊类型详解" aria-label="Permalink to &quot;Redis入门 - 数据类型：3种特殊类型详解&quot;">​</a></h1><blockquote><p>Redis除了上文中5种基础数据类型，还有三种特殊的数据类型，分别是 <strong>HyperLogLogs</strong>（基数统计）， <strong>Bitmaps</strong> (位图) 和 <strong>geospatial</strong> （地理位置）。@pdai</p></blockquote><h2 id="hyperloglogs-基数统计" tabindex="-1">HyperLogLogs（基数统计） <a class="header-anchor" href="#hyperloglogs-基数统计" aria-label="Permalink to &quot;HyperLogLogs（基数统计）&quot;">​</a></h2><blockquote><p>Redis 2.8.9 版本更新了 Hyperloglog 数据结构！</p></blockquote><ul><li><strong>什么是基数？</strong></li></ul><p>举个例子，A = {1, 2, 3, 4, 5}， B = {3, 5, 6, 7, 9}；那么基数（不重复的元素）= 1, 2, 4, 6, 7, 9； （允许容错，即可以接受一定误差）</p><ul><li><strong>HyperLogLogs 基数统计用来解决什么问题</strong>？</li></ul><p>这个结构可以非常省内存的去统计各种计数，比如注册 IP 数、每日访问 IP 数、页面实时UV、在线用户数，共同好友数等。</p><ul><li><strong>它的优势体现在哪</strong>？</li></ul><p>一个大型的网站，每天 IP 比如有 100 万，粗算一个 IP 消耗 15 字节，那么 100 万个 IP 就是 15M。而 HyperLogLog 在 Redis 中每个键占用的内容都是 12K，理论存储近似接近 2^64 个值，不管存储的内容是什么，它一个基于基数估算的算法，只能比较准确的估算出基数，可以使用少量固定的内存去存储并识别集合中的唯一元素。而且这个估算的基数并不一定准确，是一个带有 0.81% 标准错误的近似值（对于可以接受一定容错的业务场景，比如IP数统计，UV等，是可以忽略不计的）。</p><ul><li><strong>相关命令使用</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>127.0.0.1:6379&gt; pfadd key1 a b c d e f g h i	# 创建第一组元素</span></span>
<span class="line"><span>(integer) 1</span></span>
<span class="line"><span>127.0.0.1:6379&gt; pfcount key1					# 统计元素的基数数量</span></span>
<span class="line"><span>(integer) 9</span></span>
<span class="line"><span>127.0.0.1:6379&gt; pfadd key2 c j k l m e g a		# 创建第二组元素</span></span>
<span class="line"><span>(integer) 1</span></span>
<span class="line"><span>127.0.0.1:6379&gt; pfcount key2</span></span>
<span class="line"><span>(integer) 8</span></span>
<span class="line"><span>127.0.0.1:6379&gt; pfmerge key3 key1 key2			# 合并两组：key1 key2 -&gt; key3 并集</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span>127.0.0.1:6379&gt; pfcount key3</span></span>
<span class="line"><span>(integer) 13</span></span></code></pre></div><h2 id="bitmap-位存储" tabindex="-1">Bitmap （位存储） <a class="header-anchor" href="#bitmap-位存储" aria-label="Permalink to &quot;Bitmap （位存储）&quot;">​</a></h2><blockquote><p>Bitmap 即位图数据结构，都是操作二进制位来进行记录，只有0 和 1 两个状态。</p></blockquote><ul><li><strong>用来解决什么问题</strong>？</li></ul><p>比如：统计用户信息，活跃，不活跃！ 登录，未登录！ 打卡，不打卡！ <strong>两个状态的，都可以使用 Bitmaps</strong>！</p><p>如果存储一年的打卡状态需要多少内存呢？ 365 天 = 365 bit 1字节 = 8bit 46 个字节左右！</p><ul><li><strong>相关命令使用</strong></li></ul><p>使用bitmap 来记录 周一到周日的打卡！ 周一：1 周二：0 周三：0 周四：1 ......</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>127.0.0.1:6379&gt; setbit sign 0 1</span></span>
<span class="line"><span>(integer) 0</span></span>
<span class="line"><span>127.0.0.1:6379&gt; setbit sign 1 1</span></span>
<span class="line"><span>(integer) 0</span></span>
<span class="line"><span>127.0.0.1:6379&gt; setbit sign 2 0</span></span>
<span class="line"><span>(integer) 0</span></span>
<span class="line"><span>127.0.0.1:6379&gt; setbit sign 3 1</span></span>
<span class="line"><span>(integer) 0</span></span>
<span class="line"><span>127.0.0.1:6379&gt; setbit sign 4 0</span></span>
<span class="line"><span>(integer) 0</span></span>
<span class="line"><span>127.0.0.1:6379&gt; setbit sign 5 0</span></span>
<span class="line"><span>(integer) 0</span></span>
<span class="line"><span>127.0.0.1:6379&gt; setbit sign 6 1</span></span>
<span class="line"><span>(integer) 0</span></span></code></pre></div><p>查看某一天是否有打卡！</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>127.0.0.1:6379&gt; getbit sign 3</span></span>
<span class="line"><span>(integer) 1</span></span>
<span class="line"><span>127.0.0.1:6379&gt; getbit sign 5</span></span>
<span class="line"><span>(integer) 0</span></span></code></pre></div><p>统计操作，统计 打卡的天数！</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>127.0.0.1:6379&gt; bitcount sign # 统计这周的打卡记录，就可以看到是否有全勤！</span></span>
<span class="line"><span>(integer) 3</span></span></code></pre></div><h2 id="geospatial-地理位置" tabindex="-1">geospatial (地理位置) <a class="header-anchor" href="#geospatial-地理位置" aria-label="Permalink to &quot;geospatial (地理位置)&quot;">​</a></h2><blockquote><p>Redis 的 Geo 在 Redis 3.2 版本就推出了! 这个功能可以推算地理位置的信息: 两地之间的距离, 方圆几里的人</p></blockquote><h3 id="geoadd" tabindex="-1">geoadd <a class="header-anchor" href="#geoadd" aria-label="Permalink to &quot;geoadd&quot;">​</a></h3><blockquote><p>添加地理位置</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>127.0.0.1:6379&gt; geoadd china:city 118.76 32.04 manjing 112.55 37.86 taiyuan 123.43 41.80 shenyang</span></span>
<span class="line"><span>(integer) 3</span></span>
<span class="line"><span>127.0.0.1:6379&gt; geoadd china:city 144.05 22.52 shengzhen 120.16 30.24 hangzhou 108.96 34.26 xian</span></span>
<span class="line"><span>(integer) 3</span></span></code></pre></div><p><strong>规则</strong></p><p>两级无法直接添加，我们一般会下载城市数据(这个网址可以查询 GEO： <a href="http://www.jsons.cn/lngcode" target="_blank" rel="noreferrer">http://www.jsons.cn/lngcode</a>)！</p><ul><li>有效的经度从-180度到180度。</li><li>有效的纬度从-85.05112878度到85.05112878度。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 当坐标位置超出上述指定范围时，该命令将会返回一个错误。</span></span>
<span class="line"><span>127.0.0.1:6379&gt; geoadd china:city 39.90 116.40 beijin</span></span>
<span class="line"><span>(error) ERR invalid longitude,latitude pair 39.900000,116.400000</span></span></code></pre></div><h3 id="geopos" tabindex="-1">geopos <a class="header-anchor" href="#geopos" aria-label="Permalink to &quot;geopos&quot;">​</a></h3><blockquote><p>获取指定的成员的经度和纬度</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>127.0.0.1:6379&gt; geopos china:city taiyuan manjing</span></span>
<span class="line"><span>1) 1) &quot;112.54999905824661255&quot;</span></span>
<span class="line"><span>   1) &quot;37.86000073876942196&quot;</span></span>
<span class="line"><span>2) 1) &quot;118.75999957323074341&quot;</span></span>
<span class="line"><span>   1) &quot;32.03999960287850968&quot;</span></span></code></pre></div><p>获得当前定位, 一定是一个坐标值!</p><h3 id="geodist" tabindex="-1">geodist <a class="header-anchor" href="#geodist" aria-label="Permalink to &quot;geodist&quot;">​</a></h3><blockquote><p>如果不存在, 返回空</p></blockquote><p>单位如下</p><ul><li>m</li><li>km</li><li>mi 英里</li><li>ft 英尺</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>127.0.0.1:6379&gt; geodist china:city taiyuan shenyang m</span></span>
<span class="line"><span>&quot;1026439.1070&quot;</span></span>
<span class="line"><span>127.0.0.1:6379&gt; geodist china:city taiyuan shenyang km</span></span>
<span class="line"><span>&quot;1026.4391&quot;</span></span></code></pre></div><h3 id="georadius" tabindex="-1">georadius <a class="header-anchor" href="#georadius" aria-label="Permalink to &quot;georadius&quot;">​</a></h3><blockquote><p>附近的人 ==&gt; 获得所有附近的人的地址, 定位, 通过半径来查询</p></blockquote><p>获得指定数量的人</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>127.0.0.1:6379&gt; georadius china:city 110 30 1000 km			以 100,30 这个坐标为中心, 寻找半径为1000km的城市</span></span>
<span class="line"><span>1) &quot;xian&quot;</span></span>
<span class="line"><span>2) &quot;hangzhou&quot;</span></span>
<span class="line"><span>3) &quot;manjing&quot;</span></span>
<span class="line"><span>4) &quot;taiyuan&quot;</span></span>
<span class="line"><span>127.0.0.1:6379&gt; georadius china:city 110 30 500 km</span></span>
<span class="line"><span>1) &quot;xian&quot;</span></span>
<span class="line"><span>127.0.0.1:6379&gt; georadius china:city 110 30 500 km withdist</span></span>
<span class="line"><span>1) 1) &quot;xian&quot;</span></span>
<span class="line"><span>   2) &quot;483.8340&quot;</span></span>
<span class="line"><span>127.0.0.1:6379&gt; georadius china:city 110 30 1000 km withcoord withdist count 2</span></span>
<span class="line"><span>1) 1) &quot;xian&quot;</span></span>
<span class="line"><span>   2) &quot;483.8340&quot;</span></span>
<span class="line"><span>   3) 1) &quot;108.96000176668167114&quot;</span></span>
<span class="line"><span>      2) &quot;34.25999964418929977&quot;</span></span>
<span class="line"><span>2) 1) &quot;manjing&quot;</span></span>
<span class="line"><span>   2) &quot;864.9816&quot;</span></span>
<span class="line"><span>   3) 1) &quot;118.75999957323074341&quot;</span></span>
<span class="line"><span>      2) &quot;32.03999960287850968&quot;</span></span></code></pre></div><p>参数 key 经度 纬度 半径 单位 [显示结果的经度和纬度] [显示结果的距离] [显示的结果的数量]</p><h3 id="georadiusbymember" tabindex="-1">georadiusbymember <a class="header-anchor" href="#georadiusbymember" aria-label="Permalink to &quot;georadiusbymember&quot;">​</a></h3><blockquote><p>显示与指定成员一定半径范围内的其他成员</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>127.0.0.1:6379&gt; georadiusbymember china:city taiyuan 1000 km</span></span>
<span class="line"><span>1) &quot;manjing&quot;</span></span>
<span class="line"><span>2) &quot;taiyuan&quot;</span></span>
<span class="line"><span>3) &quot;xian&quot;</span></span>
<span class="line"><span>127.0.0.1:6379&gt; georadiusbymember china:city taiyuan 1000 km withcoord withdist count 2</span></span>
<span class="line"><span>1) 1) &quot;taiyuan&quot;</span></span>
<span class="line"><span>   2) &quot;0.0000&quot;</span></span>
<span class="line"><span>   3) 1) &quot;112.54999905824661255&quot;</span></span>
<span class="line"><span>      2) &quot;37.86000073876942196&quot;</span></span>
<span class="line"><span>2) 1) &quot;xian&quot;</span></span>
<span class="line"><span>   2) &quot;514.2264&quot;</span></span>
<span class="line"><span>   3) 1) &quot;108.96000176668167114&quot;</span></span>
<span class="line"><span>      2) &quot;34.25999964418929977&quot;</span></span></code></pre></div><p>参数与 georadius 一样</p><h3 id="geohash-较少使用" tabindex="-1">geohash(较少使用) <a class="header-anchor" href="#geohash-较少使用" aria-label="Permalink to &quot;geohash(较少使用)&quot;">​</a></h3><blockquote><p>该命令返回11个字符的hash字符串</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>127.0.0.1:6379&gt; geohash china:city taiyuan shenyang</span></span>
<span class="line"><span>1) &quot;ww8p3hhqmp0&quot;</span></span>
<span class="line"><span>2) &quot;wxrvb9qyxk0&quot;</span></span></code></pre></div><p>将二维的经纬度转换为一维的字符串, 如果两个字符串越接近, 则距离越近</p><h3 id="底层" tabindex="-1">底层 <a class="header-anchor" href="#底层" aria-label="Permalink to &quot;底层&quot;">​</a></h3><blockquote><p>geo底层的实现原理实际上就是Zset, 我们可以通过Zset命令来操作geo</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>127.0.0.1:6379&gt; type china:city</span></span>
<span class="line"><span>zset</span></span></code></pre></div><p>查看全部元素 删除指定的元素</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>127.0.0.1:6379&gt; zrange china:city 0 -1 withscores</span></span>
<span class="line"><span> 1) &quot;xian&quot;</span></span>
<span class="line"><span> 2) &quot;4040115445396757&quot;</span></span>
<span class="line"><span> 3) &quot;hangzhou&quot;</span></span>
<span class="line"><span> 4) &quot;4054133997236782&quot;</span></span>
<span class="line"><span> 5) &quot;manjing&quot;</span></span>
<span class="line"><span> 6) &quot;4066006694128997&quot;</span></span>
<span class="line"><span> 7) &quot;taiyuan&quot;</span></span>
<span class="line"><span> 8) &quot;4068216047500484&quot;</span></span>
<span class="line"><span> 9) &quot;shenyang&quot;</span></span>
<span class="line"><span>1)  &quot;4072519231994779&quot;</span></span>
<span class="line"><span>2)  &quot;shengzhen&quot;</span></span>
<span class="line"><span>3)  &quot;4154606886655324&quot;</span></span>
<span class="line"><span>127.0.0.1:6379&gt; zrem china:city manjing</span></span>
<span class="line"><span>(integer) 1</span></span>
<span class="line"><span>127.0.0.1:6379&gt; zrange china:city 0 -1</span></span>
<span class="line"><span>1) &quot;xian&quot;</span></span>
<span class="line"><span>2) &quot;hangzhou&quot;</span></span>
<span class="line"><span>3) &quot;taiyuan&quot;</span></span>
<span class="line"><span>4) &quot;shenyang&quot;</span></span>
<span class="line"><span>5) &quot;shengzhen&quot;</span></span></code></pre></div><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li><a href="http://www.jsons.cn/lngcode" target="_blank" rel="noreferrer">http://www.jsons.cn/lngcode</a></li><li><a href="https://www.cnblogs.com/junlinsky/p/13528452.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/junlinsky/p/13528452.html</a></li><li><a href="https://www.cnblogs.com/touyel/p/12728096.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/touyel/p/12728096.html</a></li><li><a href="https://www.cnblogs.com/junlinsky/p/13528452.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/junlinsky/p/13528452.html</a></li><li><a href="https://www.cnblogs.com/wang-sky/p/13857787.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/wang-sky/p/13857787.html</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,63)]))}const h=s(t,[["render",i]]);export{d as __pageData,h as default};
