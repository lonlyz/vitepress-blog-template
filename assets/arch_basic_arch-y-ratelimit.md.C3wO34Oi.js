import{_ as n,a as s}from"./chunks/arch-xianliu-2.Cu24I_LP.js";import{_ as e,c as p,ai as i,o as t}from"./chunks/framework.BrYByd3F.js";const g=JSON.parse('{"title":"架构之高并发：限流","description":"","frontmatter":{},"headers":[],"relativePath":"arch/basic/arch-y-ratelimit.md","filePath":"arch/basic/arch-y-ratelimit.md","lastUpdated":1737706346000}'),l={name:"arch/basic/arch-y-ratelimit.md"};function r(o,a,c,u,h,m){return t(),p("div",null,a[0]||(a[0]=[i('<h1 id="架构之高并发-限流" tabindex="-1">架构之高并发：限流 <a class="header-anchor" href="#架构之高并发-限流" aria-label="Permalink to &quot;架构之高并发：限流&quot;">​</a></h1><blockquote><p>每个系统都有服务的上线，所以当流量超过服务极限能力时，系统可能会出现卡死、崩溃的情况，所以就有了降级和限流。限流其实就是：当高并发或者瞬时高并发时，为了保证系统的稳定性、可用性，系统以牺牲部分请求为代价或者延迟处理请求为代价，保证系统整体服务可用。@pdai</p></blockquote><h2 id="限流简介" tabindex="-1">限流简介 <a class="header-anchor" href="#限流简介" aria-label="Permalink to &quot;限流简介&quot;">​</a></h2><p>每个系统都有服务的上线，所以当流量超过服务极限能力时，系统可能会出现卡死、崩溃的情况，所以就有了降级和限流。限流其实就是：当高并发或者瞬时高并发时，为了保证系统的稳定性、可用性，系统以牺牲部分请求为代价或者延迟处理请求为代价，保证系统整体服务可用。</p><h3 id="算法" tabindex="-1">算法 <a class="header-anchor" href="#算法" aria-label="Permalink to &quot;算法&quot;">​</a></h3><p>令牌桶(Token Bucket)、漏桶(leaky bucket)和计数器算法是最常用的三种限流的算法。</p><h3 id="分类" tabindex="-1">分类 <a class="header-anchor" href="#分类" aria-label="Permalink to &quot;分类&quot;">​</a></h3><h4 id="应用级-单机" tabindex="-1">应用级 - 单机 <a class="header-anchor" href="#应用级-单机" aria-label="Permalink to &quot;应用级 - 单机&quot;">​</a></h4><p>应用级限流方式只是单应用内的请求限流，不能进行全局限流。</p><ol><li>限流总资源数</li><li>限流总并发/连接/请求数</li><li>限流某个接口的总并发/请求数</li><li>限流某个接口的时间窗请求数</li><li>平滑限流某个接口的请求数</li><li>Guava RateLimiter</li></ol><h4 id="分布式" tabindex="-1">分布式 <a class="header-anchor" href="#分布式" aria-label="Permalink to &quot;分布式&quot;">​</a></h4><p>我们需要<strong>分布式限流</strong>和<strong>接入层限流</strong>来进行全局限流。</p><ol><li>redis+lua实现中的lua脚本</li><li>使用Nginx+Lua实现的Lua脚本</li><li>使用 OpenResty 开源的限流方案</li><li>限流框架，比如Sentinel实现降级限流熔断</li></ol><h2 id="方案一-令牌桶方式-token-bucket" tabindex="-1">方案一：令牌桶方式(Token Bucket) <a class="header-anchor" href="#方案一-令牌桶方式-token-bucket" aria-label="Permalink to &quot;方案一：令牌桶方式(Token Bucket)&quot;">​</a></h2><blockquote><p>令牌桶算法是网络流量整形（Traffic Shaping）和速率限制（Rate Limiting）中最常使用的一种算法。先有一个木桶，系统按照固定速度，往桶里加入Token，如果桶已经满了就不再添加。当有请求到来时，会各自拿走一个Token，取到Token 才能继续进行请求处理，没有Token 就拒绝服务。</p></blockquote><p><img src="'+n+`" alt="error.图片加载失败"></p><p>这里如果一段时间没有请求时，桶内就会积累一些Token，下次一旦有突发流量，只要Token足够，也能一次处理，所以令牌桶算法的特点是_允许突发流量_。</p><h3 id="举例-guava-ratelimiter-平滑突发限流-smoothbursty" tabindex="-1">举例：Guava RateLimiter - 平滑突发限流(SmoothBursty) <a class="header-anchor" href="#举例-guava-ratelimiter-平滑突发限流-smoothbursty" aria-label="Permalink to &quot;举例：Guava RateLimiter - 平滑突发限流(SmoothBursty)&quot;">​</a></h3><blockquote><p>Guava RateLimiter提供了令牌桶算法实现：平滑突发限流(SmoothBursty)和平滑预热限流(SmoothWarmingUp)实现。</p></blockquote><ul><li>Case 1</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>RateLimiter limiter = RateLimiter.create(5);</span></span>
<span class="line"><span>System.out.println(limiter.acquire());</span></span>
<span class="line"><span>System.out.println(limiter.acquire());</span></span>
<span class="line"><span>System.out.println(limiter.acquire());</span></span>
<span class="line"><span>System.out.println(limiter.acquire());</span></span>
<span class="line"><span>System.out.println(limiter.acquire());</span></span>
<span class="line"><span>System.out.println(limiter.acquire());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 将得到类似如下的输出：</span></span>
<span class="line"><span>0.0</span></span>
<span class="line"><span>0.198239</span></span>
<span class="line"><span>0.196083</span></span>
<span class="line"><span>0.200609</span></span>
<span class="line"><span>0.199599</span></span>
<span class="line"><span>0.19961</span></span></code></pre></div><p>1、RateLimiter.create(5)表示桶容量为5且每秒新增5个令牌，即每隔200毫秒新增一个令牌；</p><p>2、limiter.acquire()表示消费一个令牌，如果当前桶中有足够令牌则成功（返回值为0），如果桶中没有令牌则暂停一段时间，比如发令牌间隔是200毫秒，则等待200毫秒后再去消费令牌（如上测试用例返回的为0.198239，差不多等待了200毫秒桶中才有令牌可用），这种实现将突发请求速率平均为了固定请求速率。如果结构不想等待可以采用tryAcquire立刻返回！</p><ul><li>Case 2 - RateLimiter的突发情况处理:</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>RateLimiter limiter = RateLimiter.create(5);</span></span>
<span class="line"><span>System.out.println(limiter.acquire(5));</span></span>
<span class="line"><span>System.out.println(limiter.acquire(1));</span></span>
<span class="line"><span>System.out.println(limiter.acquire(1))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 将得到类似如下的输出：</span></span>
<span class="line"><span>0.0</span></span>
<span class="line"><span>0.98745</span></span>
<span class="line"><span>0.183553</span></span>
<span class="line"><span>0.199909</span></span></code></pre></div><p>limiter.acquire(5)表示桶的容量为5且每秒新增5个令牌，令牌桶算法允许一定程度的突发，所以可以一次性消费5个令牌，但接下来的limiter.acquire(1)将等待差不多1秒桶中才能有令牌，且接下来的请求也整形为固定速率了。</p><ul><li>Case 3 - RateLimiter的突发情况处理:</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>RateLimiter limiter = RateLimiter.create(5);</span></span>
<span class="line"><span>System.out.println(limiter.acquire(10));</span></span>
<span class="line"><span>System.out.println(limiter.acquire(1));</span></span>
<span class="line"><span>System.out.println(limiter.acquire(1));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 将得到类似如下的输出：</span></span>
<span class="line"><span>0.0</span></span>
<span class="line"><span>1.997428</span></span>
<span class="line"><span>0.192273</span></span>
<span class="line"><span>0.200616</span></span></code></pre></div><p>同上边的例子类似，第一秒突发了10个请求，令牌桶算法也允许了这种突发（允许消费未来的令牌），但接下来的limiter.acquire(1)将等待差不多2秒桶中才能有令牌，且接下来的请求也整形为固定速率了。</p><ul><li>Case 4</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>RateLimiter limiter = RateLimiter.create(2);</span></span>
<span class="line"><span>System.out.println(limiter.acquire());</span></span>
<span class="line"><span>Thread.sleep(2000L);</span></span>
<span class="line"><span>System.out.println(limiter.acquire());</span></span>
<span class="line"><span>System.out.println(limiter.acquire());</span></span>
<span class="line"><span>System.out.println(limiter.acquire());</span></span>
<span class="line"><span>System.out.println(limiter.acquire());</span></span>
<span class="line"><span>System.out.println(limiter.acquire());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 将得到类似如下的输出：</span></span>
<span class="line"><span>0.0</span></span>
<span class="line"><span>0.0</span></span>
<span class="line"><span>0.0</span></span>
<span class="line"><span>0.0</span></span>
<span class="line"><span>0.499876</span></span>
<span class="line"><span>0.495799</span></span></code></pre></div><p>1、创建了一个桶容量为2且每秒新增2个令牌； 2、首先调用limiter.acquire()消费一个令牌，此时令牌桶可以满足（返回值为0）； 3、然后线程暂停2秒，接下来的两个limiter.acquire()都能消费到令牌，第三个limiter.acquire()也同样消费到了令牌，到第四个时就需要等待500毫秒了。</p><p>此处可以看到我们设置的桶容量为2（即允许的突发量），这是因为SmoothBursty中有一个参数：最大突发秒数（maxBurstSeconds）默认值是1s，突发量/桶容量=速率*maxBurstSeconds，所以本示例桶容量/突发量为2，例子中前两个是消费了之前积攒的突发量，而第三个开始就是正常计算的了。令牌桶算法允许将一段时间内没有消费的令牌暂存到令牌桶中，留待未来使用，并允许未来请求的这种突发.</p><p>SmoothBursty通过平均速率和最后一次新增令牌的时间计算出下次新增令牌的时间的，另外需要一个桶暂存一段时间内没有使用的令牌（即可以突发的令牌数）。另外RateLimiter还提供了tryAcquire方法来进行无阻塞或可超时的令牌消费。</p><p>因为SmoothBursty允许一定程度的突发，会有人担心如果允许这种突发，假设突然间来了很大的流量，那么系统很可能扛不住这种突发。因此需要一种平滑速率的限流工具，从而系统冷启动后慢慢的趋于平均固定速率（即刚开始速率小一些，然后慢慢趋于我们设置的固定速率）。Guava也提供了SmoothWarmingUp来实现这种需求类似漏桶算法;</p><h3 id="举例-guava-ratelimiter-smoothwarmingup" tabindex="-1">举例：Guava RateLimiter - SmoothWarmingUp <a class="header-anchor" href="#举例-guava-ratelimiter-smoothwarmingup" aria-label="Permalink to &quot;举例：Guava RateLimiter - SmoothWarmingUp&quot;">​</a></h3><p>SmoothWarmingUp创建方式：RateLimiter.create(doublepermitsPerSecond, long warmupPeriod, TimeUnit unit)</p><p>permitsPerSecond表示每秒新增的令牌数，warmupPeriod表示在从冷启动速率过渡到平均速率的时间间隔。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>RateLimiter limiter = RateLimiter.create(5,1000, TimeUnit.MILLISECONDS);</span></span>
<span class="line"><span>for(inti =1; i &lt; 5;i++) {</span></span>
<span class="line"><span>    System.out.println(limiter.acquire());</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>Thread.sleep(1000L);</span></span>
<span class="line"><span>for(inti =1; i &lt; 5;i++) {</span></span>
<span class="line"><span>    System.out.println(limiter.acquire());</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 将得到类似如下的输出：</span></span>
<span class="line"><span>0.0</span></span>
<span class="line"><span>0.51767</span></span>
<span class="line"><span>0.357814</span></span>
<span class="line"><span>0.219992</span></span>
<span class="line"><span>0.199984</span></span>
<span class="line"><span>0.0</span></span>
<span class="line"><span>0.360826</span></span>
<span class="line"><span>0.220166</span></span>
<span class="line"><span>0.199723</span></span>
<span class="line"><span>0.199555</span></span></code></pre></div><p>速率是梯形上升速率的，也就是说冷启动时会以一个比较大的速率慢慢到平均速率；然后趋于平均速率（梯形下降到平均速率）。可以通过调节warmupPeriod参数实现一开始就是平滑固定速率。</p><h2 id="方案二-漏桶方式" tabindex="-1">方案二：漏桶方式 <a class="header-anchor" href="#方案二-漏桶方式" aria-label="Permalink to &quot;方案二：漏桶方式&quot;">​</a></h2><p>水(请求)先进入到漏桶里,漏桶以一定的速度出水(接口有响应速率),当水流入速度过大会直接溢出（访问频率超过接口响应速率),然后就拒绝请求,可以看出漏桶算法能强行限制数据的传输速率。</p><p><img src="`+s+`" alt="error.图片加载失败"></p><p>可见这里有两个变量,一个是桶的大小,支持流量突发增多时可以存多少的水(burst),另一个是水桶漏洞的大小(rate)。</p><p>因为漏桶的漏出速率是固定的参数,所以,即使网络中不存在资源冲突(没有发生拥塞),漏桶算法也不能使流突发(burst)到端口速率.因此,漏桶算法对于存在突发特性的流量来说缺乏效率.</p><h3 id="令牌桶和漏桶对比" tabindex="-1">令牌桶和漏桶对比 <a class="header-anchor" href="#令牌桶和漏桶对比" aria-label="Permalink to &quot;令牌桶和漏桶对比&quot;">​</a></h3><ul><li>令牌桶是按照固定速率往桶中添加令牌，请求是否被处理需要看桶中令牌是否足够，当令牌数减为零时则拒绝新的请求；</li><li>漏桶则是按照常量固定速率流出请求，流入请求速率任意，当流入的请求数累积到漏桶容量时，则新流入的请求被拒绝；</li><li>令牌桶限制的是平均流入速率（允许突发请求，只要有令牌就可以处理，支持一次拿3个令牌，4个令牌），并允许一定程度突发流量；</li><li>漏桶限制的是常量流出速率（即流出速率是一个固定常量值，比如都是1的速率流出，而不能一次是1，下次又是2），从而平滑突发流入速率；</li><li>令牌桶允许一定程度的突发，而漏桶主要目的是平滑流入速率；</li><li>两个算法实现可以一样，但是方向是相反的，对于相同的参数得到的限流效果是一样的。</li></ul><h2 id="方案三-计数器方式" tabindex="-1">方案三：计数器方式 <a class="header-anchor" href="#方案三-计数器方式" aria-label="Permalink to &quot;方案三：计数器方式&quot;">​</a></h2><p>计数器限流算法也是比较常用的，主要用来限制总并发数，比如数据库连接池大小、线程池大小、程序访问并发数等都是使用计数器算法。也是最简单粗暴的算法。</p><h3 id="采用atomicinteger" tabindex="-1">采用AtomicInteger <a class="header-anchor" href="#采用atomicinteger" aria-label="Permalink to &quot;采用AtomicInteger&quot;">​</a></h3><p>使用AomicInteger来进行统计当前正在并发执行的次数，如果超过域值就简单粗暴的直接响应给用户，说明系统繁忙，请稍后再试或其它跟业务相关的信息。</p><p>弊端：使用 AomicInteger 简单粗暴超过域值就拒绝请求，可能只是瞬时的请求量高，也会拒绝请求。</p><h3 id="采用令牌semaphore" tabindex="-1">采用令牌Semaphore <a class="header-anchor" href="#采用令牌semaphore" aria-label="Permalink to &quot;采用令牌Semaphore&quot;">​</a></h3><p>使用Semaphore信号量来控制并发执行的次数，如果超过域值信号量，则进入阻塞队列中排队等待获取信号量进行执行。如果阻塞队列中排队的请求过多超出系统处理能力，则可以在拒绝请求。</p><p>相对Atomic优点：如果是瞬时的高并发，可以使请求在阻塞队列中排队，而不是马上拒绝请求，从而达到一个流量削峰的目的。</p><h3 id="采用threadpoolexecutor-java线程池" tabindex="-1">采用ThreadPoolExecutor java线程池 <a class="header-anchor" href="#采用threadpoolexecutor-java线程池" aria-label="Permalink to &quot;采用ThreadPoolExecutor java线程池&quot;">​</a></h3><p>固定线程池大小,超出固定先线程池和最大的线程数,拒绝线程请求;</p><h2 id="压力测试" tabindex="-1">压力测试 <a class="header-anchor" href="#压力测试" aria-label="Permalink to &quot;压力测试&quot;">​</a></h2><blockquote><p>给个思路</p></blockquote><ul><li>Linux AB</li></ul><p>可以参考<a href="https://pdai.tech/md/devops/linux/linux-ab-test.html" target="_blank" rel="noreferrer">Linux - ab压力测试</a></p><ul><li>写代码</li></ul><p>比如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@SneakyThrows</span></span>
<span class="line"><span>public static void test(int clientSize) {</span></span>
<span class="line"><span>    CountDownLatch downLatch = new CountDownLatch(clientSize);</span></span>
<span class="line"><span>    ExecutorService fixedThreadPool = Executors.newFixedThreadPool(clientSize);</span></span>
<span class="line"><span>    IntStream.range(0, clientSize).forEach(i -&gt;</span></span>
<span class="line"><span>            fixedThreadPool.submit(() -&gt; {</span></span>
<span class="line"><span>                RestTemplate restTemplate = new RestTemplate();</span></span>
<span class="line"><span>                restTemplate.getForObject(&quot;http://localhost:8080/limit1&quot;, ResponseResult.class);</span></span>
<span class="line"><span>                downLatch.countDown();</span></span>
<span class="line"><span>            })</span></span>
<span class="line"><span>    );</span></span>
<span class="line"><span>    downLatch.await();</span></span>
<span class="line"><span>    fixedThreadPool.shutdown();</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>其它测试工具，LoadRunner，Jmeter...</li></ul><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li><p>聊聊互联网限流方案 <a href="http://www.dczou.com/viemall/852.html" target="_blank" rel="noreferrer">http://www.dczou.com/viemall/852.html</a></p></li><li><p><a href="https://www.cnblogs.com/cmfwm/p/8032994.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/cmfwm/p/8032994.html</a></p></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,68)]))}const q=e(l,[["render",r]]);export{g as __pageData,q as default};
