import{_ as a,a as n}from"./chunks/db-redis-trans-1.CufYKKOV.js";import{_ as p,c as e,ai as l,o as i}from"./chunks/framework.BrYByd3F.js";const b=JSON.parse('{"title":"Redis进阶 - 事务：Redis事务详解","description":"","frontmatter":{},"headers":[],"relativePath":"db/nosql-redis/db-redis-x-trans.md","filePath":"db/nosql-redis/db-redis-x-trans.md","lastUpdated":1737706346000}'),t={name:"db/nosql-redis/db-redis-x-trans.md"};function o(c,s,r,d,g,h){return i(),e("div",null,s[0]||(s[0]=[l(`<h1 id="redis进阶-事务-redis事务详解" tabindex="-1">Redis进阶 - 事务：Redis事务详解 <a class="header-anchor" href="#redis进阶-事务-redis事务详解" aria-label="Permalink to &quot;Redis进阶 - 事务：Redis事务详解&quot;">​</a></h1><blockquote><p>Redis 事务的本质是一组命令的集合。事务支持一次执行多个命令，一个事务中所有命令都会被序列化。在事务执行过程，会按照顺序串行化执行队列中的命令，其他客户端提交的命令请求不会插入到事务执行命令序列中。@pdai</p></blockquote><h2 id="什么是redis事务" tabindex="-1">什么是Redis事务 <a class="header-anchor" href="#什么是redis事务" aria-label="Permalink to &quot;什么是Redis事务&quot;">​</a></h2><p>Redis 事务的本质是一组命令的集合。事务支持一次执行多个命令，一个事务中所有命令都会被序列化。在事务执行过程，会按照顺序串行化执行队列中的命令，其他客户端提交的命令请求不会插入到事务执行命令序列中。</p><p>总结说：redis事务就是一次性、顺序性、排他性的执行一个队列中的一系列命令。</p><h2 id="redis事务相关命令和使用" tabindex="-1">Redis事务相关命令和使用 <a class="header-anchor" href="#redis事务相关命令和使用" aria-label="Permalink to &quot;Redis事务相关命令和使用&quot;">​</a></h2><blockquote><p>MULTI 、 EXEC 、 DISCARD 和 WATCH 是 Redis 事务相关的命令。</p></blockquote><ul><li>MULTI ：开启事务，redis会将后续的命令逐个放入队列中，然后使用EXEC命令来原子化执行这个命令系列。</li><li>EXEC：执行事务中的所有操作命令。</li><li>DISCARD：取消事务，放弃执行事务块中的所有命令。</li><li>WATCH：监视一个或多个key,如果事务在执行前，这个key(或多个key)被其他命令修改，则事务被中断，不会执行事务中的任何命令。</li><li>UNWATCH：取消WATCH对所有key的监视。</li></ul><h3 id="标准的事务执行" tabindex="-1">标准的事务执行 <a class="header-anchor" href="#标准的事务执行" aria-label="Permalink to &quot;标准的事务执行&quot;">​</a></h3><p>给k1、k2分别赋值，在事务中修改k1、k2，执行事务后，查看k1、k2值都被修改。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>127.0.0.1:6379&gt; set k1 v1</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span>127.0.0.1:6379&gt; set k2 v2</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span>127.0.0.1:6379&gt; MULTI</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span>127.0.0.1:6379&gt; set k1 11</span></span>
<span class="line"><span>QUEUED</span></span>
<span class="line"><span>127.0.0.1:6379&gt; set k2 22</span></span>
<span class="line"><span>QUEUED</span></span>
<span class="line"><span>127.0.0.1:6379&gt; EXEC</span></span>
<span class="line"><span>1) OK</span></span>
<span class="line"><span>2) OK</span></span>
<span class="line"><span>127.0.0.1:6379&gt; get k1</span></span>
<span class="line"><span>&quot;11&quot;</span></span>
<span class="line"><span>127.0.0.1:6379&gt; get k2</span></span>
<span class="line"><span>&quot;22&quot;</span></span>
<span class="line"><span>127.0.0.1:6379&gt;</span></span></code></pre></div><h3 id="事务取消" tabindex="-1">事务取消 <a class="header-anchor" href="#事务取消" aria-label="Permalink to &quot;事务取消&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>127.0.0.1:6379&gt; MULTI</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span>127.0.0.1:6379&gt; set k1 33</span></span>
<span class="line"><span>QUEUED</span></span>
<span class="line"><span>127.0.0.1:6379&gt; set k2 34</span></span>
<span class="line"><span>QUEUED</span></span>
<span class="line"><span>127.0.0.1:6379&gt; DISCARD</span></span>
<span class="line"><span>OK</span></span></code></pre></div><h3 id="事务出现错误的处理" tabindex="-1">事务出现错误的处理 <a class="header-anchor" href="#事务出现错误的处理" aria-label="Permalink to &quot;事务出现错误的处理&quot;">​</a></h3><ul><li><strong>语法错误（编译器错误）</strong></li></ul><p>在开启事务后，修改k1值为11，k2值为22，但k2语法错误，最终导致事务提交失败，k1、k2保留原值。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>127.0.0.1:6379&gt; set k1 v1</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span>127.0.0.1:6379&gt; set k2 v2</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span>127.0.0.1:6379&gt; MULTI</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span>127.0.0.1:6379&gt; set k1 11</span></span>
<span class="line"><span>QUEUED</span></span>
<span class="line"><span>127.0.0.1:6379&gt; sets k2 22</span></span>
<span class="line"><span>(error) ERR unknown command \`sets\`, with args beginning with: \`k2\`, \`22\`, </span></span>
<span class="line"><span>127.0.0.1:6379&gt; exec</span></span>
<span class="line"><span>(error) EXECABORT Transaction discarded because of previous errors.</span></span>
<span class="line"><span>127.0.0.1:6379&gt; get k1</span></span>
<span class="line"><span>&quot;v1&quot;</span></span>
<span class="line"><span>127.0.0.1:6379&gt; get k2</span></span>
<span class="line"><span>&quot;v2&quot;</span></span>
<span class="line"><span>127.0.0.1:6379&gt;</span></span></code></pre></div><ul><li><strong>Redis类型错误（运行时错误）</strong></li></ul><p>在开启事务后，修改k1值为11，k2值为22，但将k2的类型作为List，在运行时检测类型错误，最终导致事务提交失败，此时事务并没有回滚，而是跳过错误命令继续执行， 结果k1值改变、k2保留原值</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>127.0.0.1:6379&gt; set k1 v1</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span>127.0.0.1:6379&gt; set k1 v2</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span>127.0.0.1:6379&gt; MULTI</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span>127.0.0.1:6379&gt; set k1 11</span></span>
<span class="line"><span>QUEUED</span></span>
<span class="line"><span>127.0.0.1:6379&gt; lpush k2 22</span></span>
<span class="line"><span>QUEUED</span></span>
<span class="line"><span>127.0.0.1:6379&gt; EXEC</span></span>
<span class="line"><span>1) OK</span></span>
<span class="line"><span>2) (error) WRONGTYPE Operation against a key holding the wrong kind of value</span></span>
<span class="line"><span>127.0.0.1:6379&gt; get k1</span></span>
<span class="line"><span>&quot;11&quot;</span></span>
<span class="line"><span>127.0.0.1:6379&gt; get k2</span></span>
<span class="line"><span>&quot;v2&quot;</span></span>
<span class="line"><span>127.0.0.1:6379&gt;</span></span></code></pre></div><h3 id="cas操作实现乐观锁" tabindex="-1">CAS操作实现乐观锁 <a class="header-anchor" href="#cas操作实现乐观锁" aria-label="Permalink to &quot;CAS操作实现乐观锁&quot;">​</a></h3><blockquote><p>WATCH 命令可以为 Redis 事务提供 check-and-set （CAS）行为。</p></blockquote><ul><li><strong>CAS? 乐观锁</strong>？Redis官方的例子帮你理解</li></ul><p>被 WATCH 的键会被监视，并会发觉这些键是否被改动过了。 如果有至少一个被监视的键在 EXEC 执行之前被修改了， 那么整个事务都会被取消， EXEC 返回nil-reply来表示事务已经失败。</p><p>举个例子， 假设我们需要原子性地为某个值进行增 1 操作（假设 INCR 不存在）。</p><p>首先我们可能会这样做：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>val = GET mykey</span></span>
<span class="line"><span>val = val + 1</span></span>
<span class="line"><span>SET mykey $val</span></span></code></pre></div><p>上面的这个实现在只有一个客户端的时候可以执行得很好。 但是， 当多个客户端同时对同一个键进行这样的操作时， 就会产生竞争条件。举个例子， 如果客户端 A 和 B 都读取了键原来的值， 比如 10 ， 那么两个客户端都会将键的值设为 11 ， 但正确的结果应该是 12 才对。</p><p>有了 WATCH ，我们就可以轻松地解决这类问题了：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>WATCH mykey</span></span>
<span class="line"><span>val = GET mykey</span></span>
<span class="line"><span>val = val + 1</span></span>
<span class="line"><span>MULTI</span></span>
<span class="line"><span>SET mykey $val</span></span>
<span class="line"><span>EXEC</span></span></code></pre></div><p>使用上面的代码， 如果在 WATCH 执行之后， EXEC 执行之前， 有其他客户端修改了 mykey 的值， 那么当前客户端的事务就会失败。 程序需要做的， 就是不断重试这个操作， 直到没有发生碰撞为止。</p><p>这种形式的锁被称作乐观锁， 它是一种非常强大的锁机制。 并且因为大多数情况下， 不同的客户端会访问不同的键， 碰撞的情况一般都很少， 所以通常并不需要进行重试。</p><ul><li><strong>watch是如何监视实现的呢</strong>？</li></ul><p>Redis使用WATCH命令来决定事务是继续执行还是回滚，那就需要在MULTI之前使用WATCH来监控某些键值对，然后使用MULTI命令来开启事务，执行对数据结构操作的各种命令，此时这些命令入队列。</p><p>当使用EXEC执行事务时，首先会比对WATCH所监控的键值对，如果没发生改变，它会执行事务队列中的命令，提交事务；如果发生变化，将不会执行事务中的任何命令，同时事务回滚。当然无论是否回滚，Redis都会取消执行事务前的WATCH命令。</p><p><img src="`+a+`" alt="error.图片加载失败"></p><ul><li><strong>watch 命令实现监视</strong></li></ul><p>在事务开始前用WATCH监控k1，之后修改k1为11，说明事务开始前k1值被改变，MULTI开始事务，修改k1值为12，k2为22，执行EXEC，发回nil，说明事务回滚；查看下k1、k2的值都没有被事务中的命令所改变。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>127.0.0.1:6379&gt; set k1 v1</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span>127.0.0.1:6379&gt; set k2 v2</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span>127.0.0.1:6379&gt; WATCH k1</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span>127.0.0.1:6379&gt; set k1 11</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span>127.0.0.1:6379&gt; MULTI</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span>127.0.0.1:6379&gt; set k1 12</span></span>
<span class="line"><span>QUEUED</span></span>
<span class="line"><span>127.0.0.1:6379&gt; set k2 22</span></span>
<span class="line"><span>QUEUED</span></span>
<span class="line"><span>127.0.0.1:6379&gt; EXEC</span></span>
<span class="line"><span>(nil)</span></span>
<span class="line"><span>127.0.0.1:6379&gt; get k1</span></span>
<span class="line"><span>&quot;11&quot;</span></span>
<span class="line"><span>127.0.0.1:6379&gt; get k2</span></span>
<span class="line"><span>&quot;v2&quot;</span></span>
<span class="line"><span>127.0.0.1:6379&gt;</span></span></code></pre></div><ul><li><strong>UNWATCH取消监视</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>127.0.0.1:6379&gt; set k1 v1</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span>127.0.0.1:6379&gt; set k2 v2</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span>127.0.0.1:6379&gt; WATCH k1</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span>127.0.0.1:6379&gt; set k1 11</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span>127.0.0.1:6379&gt; UNWATCH</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span>127.0.0.1:6379&gt; MULTI</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span>127.0.0.1:6379&gt; set k1 12</span></span>
<span class="line"><span>QUEUED</span></span>
<span class="line"><span>127.0.0.1:6379&gt; set k2 22</span></span>
<span class="line"><span>QUEUED</span></span>
<span class="line"><span>127.0.0.1:6379&gt; exec</span></span>
<span class="line"><span>1) OK</span></span>
<span class="line"><span>2) OK</span></span>
<span class="line"><span>127.0.0.1:6379&gt; get k1</span></span>
<span class="line"><span>&quot;12&quot;</span></span>
<span class="line"><span>127.0.0.1:6379&gt; get k2</span></span>
<span class="line"><span>&quot;22&quot;</span></span>
<span class="line"><span>127.0.0.1:6379&gt;</span></span></code></pre></div><h2 id="redis事务执行步骤" tabindex="-1">Redis事务执行步骤 <a class="header-anchor" href="#redis事务执行步骤" aria-label="Permalink to &quot;Redis事务执行步骤&quot;">​</a></h2><p>通过上文命令执行，很显然Redis事务执行是三个阶段：</p><ul><li><p><strong>开启</strong>：以MULTI开始一个事务</p></li><li><p><strong>入队</strong>：将多个命令入队到事务中，接到这些命令并不会立即执行，而是放到等待执行的事务队列里面</p></li><li><p><strong>执行</strong>：由EXEC命令触发事务</p></li></ul><p>当一个客户端切换到事务状态之后， 服务器会根据这个客户端发来的不同命令执行不同的操作：</p><ul><li>如果客户端发送的命令为 EXEC 、 DISCARD 、 WATCH 、 MULTI 四个命令的其中一个， 那么服务器立即执行这个命令。</li><li>与此相反， 如果客户端发送的命令是 EXEC 、 DISCARD 、 WATCH 、 MULTI 四个命令以外的其他命令， 那么服务器并不立即执行这个命令， 而是将这个命令放入一个事务队列里面， 然后向客户端返回 QUEUED 回复。</li></ul><p><img src="`+n+'" alt="error.图片加载失败"></p><h2 id="更深入的理解" tabindex="-1">更深入的理解 <a class="header-anchor" href="#更深入的理解" aria-label="Permalink to &quot;更深入的理解&quot;">​</a></h2><blockquote><p>我们再通过几个问题来深入理解Redis事务。</p></blockquote><h3 id="为什么-redis-不支持回滚" tabindex="-1">为什么 Redis 不支持回滚？ <a class="header-anchor" href="#为什么-redis-不支持回滚" aria-label="Permalink to &quot;为什么 Redis 不支持回滚？&quot;">​</a></h3><blockquote><p>如果你有使用关系式数据库的经验， 那么 “<strong>Redis 在事务失败时不进行回滚，而是继续执行余下的命令</strong>”这种做法可能会让你觉得有点奇怪。</p></blockquote><p>以下是这种做法的优点：</p><ul><li>Redis 命令只会因为错误的语法而失败（并且这些问题不能在入队时发现），或是命令用在了错误类型的键上面：这也就是说，从实用性的角度来说，失败的命令是由编程错误造成的，而这些错误应该在开发的过程中被发现，而不应该出现在生产环境中。</li><li>因为不需要对回滚进行支持，所以 Redis 的内部可以保持简单且快速。</li></ul><p>有种观点认为 Redis 处理事务的做法会产生 bug ， 然而需要注意的是， 在通常情况下， <strong>回滚并不能解决编程错误带来的问题</strong>。 举个例子， 如果你本来想通过 INCR 命令将键的值加上 1 ， 却不小心加上了 2 ， 又或者对错误类型的键执行了 INCR ， 回滚是没有办法处理这些情况的。</p><h3 id="如何理解redis与事务的acid" tabindex="-1">如何理解Redis与事务的ACID？ <a class="header-anchor" href="#如何理解redis与事务的acid" aria-label="Permalink to &quot;如何理解Redis与事务的ACID？&quot;">​</a></h3><blockquote><p>一般来说，事务有四个性质称为ACID，分别是原子性，一致性，隔离性和持久性。这是基础，但是很多文章对Redis 是否支持ACID有一些异议，我觉的有必要梳理下：</p></blockquote><ul><li><strong>原子性atomicity</strong></li></ul><p>首先通过上文知道 运行期的错误是不会回滚的，很多文章由此说Redis事务违背原子性的；而官方文档认为是遵从原子性的。</p><p>Redis官方文档给的理解是，<strong>Redis的事务是原子性的：所有的命令，要么全部执行，要么全部不执行</strong>。而不是完全成功。</p><ul><li><strong>一致性consistency</strong></li></ul><p>redis事务可以保证命令失败的情况下得以回滚，数据能恢复到没有执行之前的样子，是保证一致性的，除非redis进程意外终结。</p><ul><li><strong>隔离性Isolation</strong></li></ul><p>redis事务是严格遵守隔离性的，原因是redis是单进程单线程模式(v6.0之前），可以保证命令执行过程中不会被其他客户端命令打断。</p><p>但是，Redis不像其它结构化数据库有隔离级别这种设计。</p><ul><li><strong>持久性Durability</strong></li></ul><p><strong>redis事务是不保证持久性的</strong>，这是因为redis持久化策略中不管是RDB还是AOF都是异步执行的，不保证持久性是出于对性能的考虑。</p><h3 id="redis事务其它实现" tabindex="-1">Redis事务其它实现 <a class="header-anchor" href="#redis事务其它实现" aria-label="Permalink to &quot;Redis事务其它实现&quot;">​</a></h3><ul><li><p>基于Lua脚本，Redis可以保证脚本内的命令一次性、按顺序地执行，其同时也不提供事务运行错误的回滚，执行过程中如果部分命令运行错误，剩下的命令还是会继续运行完</p></li><li><p>基于中间标记变量，通过另外的标记变量来标识事务是否执行完成，读取数据时先读取该标记变量判断是否事务执行完成。但这样会需要额外写代码实现，比较繁琐</p></li></ul><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><p>本文主要参考了</p><ul><li><a href="http://redisbook.com/preview/transaction/transaction%5C_implement.html" target="_blank" rel="noreferrer">http://redisbook.com/preview/transaction/transaction\\_implement.html</a></li><li><a href="http://ifeve.com/redis-transactions/" target="_blank" rel="noreferrer">官方文档-事务在新窗口打开</a></li><li><a href="https://www.cnblogs.com/fengguozhong/p/12161363.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/fengguozhong/p/12161363.html</a></li></ul><p>此外还参考了</p><ul><li><a href="https://www.runoob.com/redis/redis-transactions.html" target="_blank" rel="noreferrer">https://www.runoob.com/redis/redis-transactions.html</a></li><li><a href="https://zhuanlan.zhihu.com/p/101902825" target="_blank" rel="noreferrer">https://zhuanlan.zhihu.com/p/101902825</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',74)]))}const m=p(t,[["render",o]]);export{b as __pageData,m as default};
