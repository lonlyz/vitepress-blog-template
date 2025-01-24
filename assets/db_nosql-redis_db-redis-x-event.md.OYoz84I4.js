import{_ as n,a,b as p,c as e}from"./chunks/db-redis-event-4.DGJpAshd.js";import{_ as l,c as t,ai as i,o}from"./chunks/framework.BrYByd3F.js";const c="/vitepress-blog-template/images/db/redis/db-redis-event-0.jpg",r="/vitepress-blog-template/images/db/redis/db-redis-event-5.png",d="/vitepress-blog-template/images/db/redis/db-redis-event-6.png",b=JSON.parse('{"title":"Redis进阶 - 事件：Redis事件机制详解","description":"","frontmatter":{},"headers":[],"relativePath":"db/nosql-redis/db-redis-x-event.md","filePath":"db/nosql-redis/db-redis-x-event.md","lastUpdated":1737706346000}'),v={name:"db/nosql-redis/db-redis-x-event.md"};function g(m,s,f,h,E,u){return o(),t("div",null,s[0]||(s[0]=[i('<h1 id="redis进阶-事件-redis事件机制详解" tabindex="-1">Redis进阶 - 事件：Redis事件机制详解 <a class="header-anchor" href="#redis进阶-事件-redis事件机制详解" aria-label="Permalink to &quot;Redis进阶 - 事件：Redis事件机制详解&quot;">​</a></h1><blockquote><p>Redis 采用事件驱动机制来处理大量的网络IO。它并没有使用 libevent 或者 libev 这样的成熟开源方案，而是自己实现一个非常简洁的事件驱动库 ae_event。@pdai</p></blockquote><h2 id="事件机制" tabindex="-1">事件机制 <a class="header-anchor" href="#事件机制" aria-label="Permalink to &quot;事件机制&quot;">​</a></h2><blockquote><p>Redis中的事件驱动库只关注网络IO，以及定时器。</p></blockquote><p>该事件库处理下面两类事件：</p><ul><li><strong>文件事件</strong>(file event)：用于处理 Redis 服务器和客户端之间的网络IO。</li><li><strong>时间事件</strong>(time eveat)：Redis 服务器中的一些操作（比如serverCron函数）需要在给定的时间点执行，而时间事件就是处理这类定时操作的。</li></ul><p>事件驱动库的代码主要是在<code>src/ae.c</code>中实现的，其示意图如下所示。</p><p><img src="'+n+'" alt="error.图片加载失败"></p><p><code>aeEventLoop</code>是整个事件驱动的核心，它管理着文件事件表和时间事件列表，不断地循环处理着就绪的文件事件和到期的时间事件。</p><h3 id="文件事件" tabindex="-1">文件事件 <a class="header-anchor" href="#文件事件" aria-label="Permalink to &quot;文件事件&quot;">​</a></h3><blockquote><p>Redis基于<strong>Reactor模式</strong>开发了自己的网络事件处理器，也就是文件事件处理器。文件事件处理器使用<strong>IO多路复用技术</strong>（建议先看下 <a href="https://pdai.tech/md/java/io/java-io-nio-select-epoll.html" target="_blank" rel="noreferrer">Java IO多路复用详解</a> ），同时监听多个套接字，并为套接字关联不同的事件处理函数。当套接字的可读或者可写事件触发时，就会调用相应的事件处理函数。</p></blockquote><ul><li><strong>1. 为什么单线程的 Redis 能那么快</strong>？</li></ul><p>Redis的瓶颈主要在IO而不是CPU，所以为了省开发量，在6.0版本前是单线程模型；其次，Redis 是单线程主要是指 <strong>Redis 的网络 IO 和键值对读写是由一个线程来完成的</strong>，这也是 Redis 对外提供键值存储服务的主要流程。（但 Redis 的其他功能，比如持久化、异步删除、集群数据同步等，其实是由额外的线程执行的）。</p><p>Redis 采用了多路复用机制使其在网络 IO 操作中能并发处理大量的客户端请求，实现高吞吐率。</p><ul><li><strong>2. Redis事件响应框架ae_event及文件事件处理器</strong></li></ul><p>Redis并没有使用 libevent 或者 libev 这样的成熟开源方案，而是自己实现一个非常简洁的事件驱动库 ae_event。@pdai</p><p>Redis 使用的IO多路复用技术主要有：<code>select</code>、<code>epoll</code>、<code>evport</code>和<code>kqueue</code>等。每个IO多路复用函数库在 Redis 源码中都对应一个单独的文件，比如<code>ae_select.c</code>，<code>ae_epoll.c</code>， <code>ae_kqueue.c</code>等。Redis 会根据不同的操作系统，按照不同的优先级选择多路复用技术。事件响应框架一般都采用该架构，比如 netty 和 libevent。</p><p><img src="'+a+'" alt="error.图片加载失败"></p><p>如下图所示，文件事件处理器有四个组成部分，它们分别是套接字、I/O多路复用程序、文件事件分派器以及事件处理器。</p><p><img src="'+p+'" alt="error.图片加载失败"></p><p>文件事件是对套接字操作的抽象，每当一个套接字准备好执行 <code>accept</code>、<code>read</code>、<code>write</code>和 <code>close</code> 等操作时，就会产生一个文件事件。因为 Redis 通常会连接多个套接字，所以多个文件事件有可能并发的出现。</p><p>I/O多路复用程序负责监听多个套接字，并向文件事件派发器传递那些产生了事件的套接字。</p><p>尽管多个文件事件可能会并发地出现，但I/O多路复用程序总是会将所有产生的套接字都放到同一个队列(也就是后文中描述的aeEventLoop的fired就绪事件表)里边，然后文件事件处理器会以有序、同步、单个套接字的方式处理该队列中的套接字，也就是处理就绪的文件事件。</p><p><img src="'+e+'" alt="error.图片加载失败"></p><p>所以，一次 Redis 客户端与服务器进行连接并且发送命令的过程如上图所示。</p><ul><li><p>客户端向服务端发起<strong>建立 socket 连接的请求</strong>，那么监听套接字将产生 AE_READABLE 事件，触发连接应答处理器执行。处理器会对客户端的连接请求</p></li><li><p>进行<strong>应答</strong>，然后创建客户端套接字，以及客户端状态，并将客户端套接字的 AE_READABLE 事件与命令请求处理器关联。</p></li><li><p>客户端建立连接后，向服务器<strong>发送命令</strong>，那么客户端套接字将产生 AE_READABLE 事件，触发命令请求处理器执行，处理器读取客户端命令，然后传递给相关程序去执行。</p></li><li><p><strong>执行命令获得相应的命令回复</strong>，为了将命令回复传递给客户端，服务器将客户端套接字的 AE_WRITEABLE 事件与命令回复处理器关联。当客户端试图读取命令回复时，客户端套接字产生 AE_WRITEABLE 事件，触发命令回复处理器将命令回复全部写入到套接字中。</p></li><li><p><strong>3. Redis IO多路复用模型</strong></p></li></ul><blockquote><p>PS：了解处理流程后，我们有必要深入看下Redis IO多路复用的模型，正好我看到极客时间中《Redis核心技术与实战》中相关内容讲的挺容易理解的，就转过来了@pdai</p></blockquote><p>在 Redis 只运行单线程的情况下，<strong>该机制允许内核中，同时存在多个监听套接字和已连接套接字</strong>。内核会一直监听这些套接字上的连接请求或数据请求。一旦有请求到达，就会交给 Redis 线程处理，这就实现了一个 Redis 线程处理多个 IO 流的效果。</p><p>下图就是基于多路复用的 Redis IO 模型。图中的多个 FD 就是刚才所说的多个套接字。Redis 网络框架调用 epoll 机制，让内核监听这些套接字。此时，Redis 线程不会阻塞在某一个特定的监听或已连接套接字上，也就是说，不会阻塞在某一个特定的客户端请求处理上。正因为此，Redis 可以同时和多个客户端连接并处理请求，从而提升并发性。</p><p><img src="'+c+`" alt="error.图片加载失败"></p><p>基于多路复用的Redis高性能IO模型为了在请求到达时能通知到 Redis 线程，select/epoll 提供了基于事件的回调机制，即针对不同事件的发生，调用相应的处理函数。那么，回调机制是怎么工作的呢？</p><p>其实，select/epoll 一旦监测到 FD 上有请求到达时，就会触发相应的事件。这些事件会被放进一个事件队列，Redis 单线程对该事件队列不断进行处理。这样一来，Redis 无需一直轮询是否有请求实际发生，这就可以避免造成 CPU 资源浪费。同时，Redis 在对事件队列中的事件进行处理时，会调用相应的处理函数，这就实现了基于事件的回调。因为 Redis 一直在对事件队列进行处理，所以能及时响应客户端请求，提升 Redis 的响应性能。</p><p>为了方便你理解，我再以连接请求和读数据请求为例，具体解释一下。</p><p>这两个请求分别对应 Accept 事件和 Read 事件，Redis 分别对这两个事件注册 accept 和 get 回调函数。当 Linux 内核监听到有连接请求或读数据请求时，就会触发 Accept 事件和 Read 事件，此时，内核就会回调 Redis 相应的 accept 和 get 函数进行处理。</p><p>这就像病人去医院瞧病。在医生实际诊断前，每个病人（等同于请求）都需要先分诊、测体温、登记等。如果这些工作都由医生来完成，医生的工作效率就会很低。所以，医院都设置了分诊台，分诊台会一直处理这些诊断前的工作（类似于 Linux 内核监听请求），然后再转交给医生做实际诊断。这样即使一个医生（相当于 Redis 单线程），效率也能提升。</p><h3 id="时间事件" tabindex="-1">时间事件 <a class="header-anchor" href="#时间事件" aria-label="Permalink to &quot;时间事件&quot;">​</a></h3><blockquote><p>Redis 的时间事件分为以下两类：</p></blockquote><ul><li><strong>定时事件</strong>：让一段程序在指定的时间之后执行一次。</li><li><strong>周期性事件</strong>：让一段程序每隔指定时间就执行一次。</li></ul><p>Redis 的时间事件的具体定义结构如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>typedef struct aeTimeEvent {</span></span>
<span class="line"><span>    /* 全局唯一ID */</span></span>
<span class="line"><span>    long long id; /* time event identifier. */</span></span>
<span class="line"><span>    /* 秒精确的UNIX时间戳，记录时间事件到达的时间*/</span></span>
<span class="line"><span>    long when_sec; /* seconds */</span></span>
<span class="line"><span>    /* 毫秒精确的UNIX时间戳，记录时间事件到达的时间*/</span></span>
<span class="line"><span>    long when_ms; /* milliseconds */</span></span>
<span class="line"><span>    /* 时间处理器 */</span></span>
<span class="line"><span>    aeTimeProc *timeProc;</span></span>
<span class="line"><span>    /* 事件结束回调函数，析构一些资源*/</span></span>
<span class="line"><span>    aeEventFinalizerProc *finalizerProc;</span></span>
<span class="line"><span>    /* 私有数据 */</span></span>
<span class="line"><span>    void *clientData;</span></span>
<span class="line"><span>    /* 前驱节点 */</span></span>
<span class="line"><span>    struct aeTimeEvent *prev;</span></span>
<span class="line"><span>    /* 后继节点 */</span></span>
<span class="line"><span>    struct aeTimeEvent *next;</span></span>
<span class="line"><span>} aeTimeEvent;</span></span></code></pre></div><p>一个时间事件是定时事件还是周期性事件取决于时间处理器的返回值：</p><ul><li>如果返回值是 <code>AE_NOMORE</code>，那么这个事件是一个定时事件，该事件在达到后删除，之后不会再重复。</li><li>如果返回值是非 <code>AE_NOMORE</code> 的值，那么这个事件为周期性事件，当一个时间事件到达后，服务器会根据时间处理器的返回值，对时间事件的 when 属性进行更新，让这个事件在一段时间后再次达到。</li></ul><p><img src="`+r+`" alt="error.图片加载失败"></p><p>服务器所有的时间事件都放在一个无序链表中，每当时间事件执行器运行时，它就遍历整个链表，查找所有已到达的时间事件，并调用相应的事件处理器。正常模式下的Redis服务器只使用serverCron一个时间事件，而在benchmark模式下，服务器也只使用两个时间事件，所以不影响事件执行的性能。</p><h2 id="aeeventloop的具体实现" tabindex="-1">aeEventLoop的具体实现 <a class="header-anchor" href="#aeeventloop的具体实现" aria-label="Permalink to &quot;aeEventLoop的具体实现&quot;">​</a></h2><blockquote><p>介绍完文件事件和时间事件，我们接下来看一下 aeEventLoop的具体实现; 强烈建议先看下 <a href="https://pdai.tech/md/java/io/java-io-nio-select-epoll.html" target="_blank" rel="noreferrer">Java IO多路复用详解</a>，再来理解。</p></blockquote><h3 id="创建事件管理器" tabindex="-1">创建事件管理器 <a class="header-anchor" href="#创建事件管理器" aria-label="Permalink to &quot;创建事件管理器&quot;">​</a></h3><p>Redis 服务端在其初始化函数 initServer中，会创建事件管理器aeEventLoop对象。</p><p>函数aeCreateEventLoop将创建一个事件管理器，主要是初始化 aeEventLoop的各个属性值，比如events、fired、timeEventHead和apidata：</p><ul><li>首先创建aeEventLoop对象。</li><li>初始化未就绪文件事件表、就绪文件事件表。events指针指向未就绪文件事件表、fired指针指向就绪文件事件表。表的内容在后面添加具体事件时进行初变更。</li><li>初始化时间事件列表，设置timeEventHead和timeEventNextId属性。</li><li>调用aeApiCreate 函数创建epoll实例，并初始化 apidata。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>aeEventLoop *aeCreateEventLoop(int setsize) {</span></span>
<span class="line"><span>    aeEventLoop *eventLoop;</span></span>
<span class="line"><span>    int i;</span></span>
<span class="line"><span>    /* 创建事件状态结构 */</span></span>
<span class="line"><span>    if ((eventLoop = zmalloc(sizeof(*eventLoop))) == NULL) goto err;</span></span>
<span class="line"><span>    /* 创建未就绪事件表、就绪事件表 */</span></span>
<span class="line"><span>    eventLoop-&gt;events = zmalloc(sizeof(aeFileEvent)*setsize);</span></span>
<span class="line"><span>    eventLoop-&gt;fired = zmalloc(sizeof(aeFiredEvent)*setsize);</span></span>
<span class="line"><span>    if (eventLoop-&gt;events == NULL || eventLoop-&gt;fired == NULL) goto err;</span></span>
<span class="line"><span>    /* 设置数组大小 */</span></span>
<span class="line"><span>    eventLoop-&gt;setsize = setsize;</span></span>
<span class="line"><span>    /* 初始化执行最近一次执行时间 */</span></span>
<span class="line"><span>    eventLoop-&gt;lastTime = time(NULL);</span></span>
<span class="line"><span>    /* 初始化时间事件结构 */</span></span>
<span class="line"><span>    eventLoop-&gt;timeEventHead = NULL;</span></span>
<span class="line"><span>    eventLoop-&gt;timeEventNextId = 0;</span></span>
<span class="line"><span>    eventLoop-&gt;stop = 0;</span></span>
<span class="line"><span>    eventLoop-&gt;maxfd = -1;</span></span>
<span class="line"><span>    eventLoop-&gt;beforesleep = NULL;</span></span>
<span class="line"><span>    eventLoop-&gt;aftersleep = NULL;</span></span>
<span class="line"><span>    /* 将多路复用io与事件管理器关联起来 */</span></span>
<span class="line"><span>    if (aeApiCreate(eventLoop) == -1) goto err;</span></span>
<span class="line"><span>    /* 初始化监听事件 */</span></span>
<span class="line"><span>    for (i = 0; i &lt; setsize; i++)</span></span>
<span class="line"><span>        eventLoop-&gt;events[i].mask = AE_NONE;</span></span>
<span class="line"><span>    return eventLoop;</span></span>
<span class="line"><span>err:</span></span>
<span class="line"><span>   .....</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>aeApiCreate 函数首先创建了aeApiState对象，初始化了epoll就绪事件表；然后调用epoll_create创建了epoll实例，最后将该aeApiState赋值给apidata属性。</p><p>aeApiState对象中epfd存储epoll的标识，events是一个epoll就绪事件数组，当有epoll事件发生时，所有发生的epoll事件和其描述符将存储在这个数组中。这个就绪事件数组由应用层开辟空间、内核负责把所有发生的事件填充到该数组。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int aeApiCreate(aeEventLoop *eventLoop) {</span></span>
<span class="line"><span>    aeApiState *state = zmalloc(sizeof(aeApiState));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (!state) return -1;</span></span>
<span class="line"><span>    /* 初始化epoll就绪事件表 */</span></span>
<span class="line"><span>    state-&gt;events = zmalloc(sizeof(struct epoll_event)*eventLoop-&gt;setsize);</span></span>
<span class="line"><span>    if (!state-&gt;events) {</span></span>
<span class="line"><span>        zfree(state);</span></span>
<span class="line"><span>        return -1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    /* 创建 epoll 实例 */</span></span>
<span class="line"><span>    state-&gt;epfd = epoll_create(1024); /* 1024 is just a hint for the kernel */</span></span>
<span class="line"><span>    if (state-&gt;epfd == -1) {</span></span>
<span class="line"><span>        zfree(state-&gt;events);</span></span>
<span class="line"><span>        zfree(state);</span></span>
<span class="line"><span>        return -1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    /* 事件管理器与epoll关联 */</span></span>
<span class="line"><span>    eventLoop-&gt;apidata = state;</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>typedef struct aeApiState {</span></span>
<span class="line"><span>    /* epoll_event 实例描述符*/</span></span>
<span class="line"><span>    int epfd;</span></span>
<span class="line"><span>    /* 存储epoll就绪事件表 */</span></span>
<span class="line"><span>    struct epoll_event *events;</span></span>
<span class="line"><span>} aeApiState;</span></span></code></pre></div><h3 id="创建文件事件" tabindex="-1">创建文件事件 <a class="header-anchor" href="#创建文件事件" aria-label="Permalink to &quot;创建文件事件&quot;">​</a></h3><p>aeFileEvent是文件事件结构，对于每一个具体的事件，都有读处理函数和写处理函数等。Redis 调用aeCreateFileEvent函数针对不同的套接字的读写事件注册对应的文件事件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>typedef struct aeFileEvent {</span></span>
<span class="line"><span>    /* 监听事件类型掩码,值可以是 AE_READABLE 或 AE_WRITABLE */</span></span>
<span class="line"><span>    int mask;</span></span>
<span class="line"><span>    /* 读事件处理器 */</span></span>
<span class="line"><span>    aeFileProc *rfileProc;</span></span>
<span class="line"><span>    /* 写事件处理器 */</span></span>
<span class="line"><span>    aeFileProc *wfileProc;</span></span>
<span class="line"><span>    /* 多路复用库的私有数据 */</span></span>
<span class="line"><span>    void *clientData;</span></span>
<span class="line"><span>} aeFileEvent;</span></span>
<span class="line"><span>/* 使用typedef定义的处理器函数的函数类型 */</span></span>
<span class="line"><span>typedef void aeFileProc(struct aeEventLoop *eventLoop, </span></span>
<span class="line"><span>int fd, void *clientData, int mask);</span></span></code></pre></div><p>比如说，Redis 进行主从复制时，从服务器需要主服务器建立连接，它会发起一个 socekt连接，然后调用aeCreateFileEvent函数针对发起的socket的读写事件注册了对应的事件处理器，也就是syncWithMaster函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>aeCreateFileEvent(server.el,fd,AE_READABLE|AE_WRITABLE,syncWithMaster,NULL);</span></span>
<span class="line"><span>/* 符合aeFileProc的函数定义 */</span></span>
<span class="line"><span>void syncWithMaster(aeEventLoop *el, int fd, void *privdata, int mask) {....}</span></span></code></pre></div><p>aeCreateFileEvent的参数fd指的是具体的socket套接字，proc指fd产生事件时，具体的处理函数，clientData则是回调处理函数时需要传入的数据。</p><p>aeCreateFileEvent主要做了三件事情：</p><ul><li>以fd为索引，在events未就绪事件表中找到对应事件。</li><li>调用aeApiAddEvent函数，该事件注册到具体的底层 I/O 多路复用中，本例为epoll。</li><li>填充事件的回调、参数、事件类型等参数。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int aeCreateFileEvent(aeEventLoop *eventLoop, int fd, int mask,</span></span>
<span class="line"><span>                       aeFileProc *proc, void *clientData)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    /* 取出 fd 对应的文件事件结构, fd 代表具体的 socket 套接字 */</span></span>
<span class="line"><span>    aeFileEvent *fe = &amp;eventLoop-&gt;events[fd];</span></span>
<span class="line"><span>    /* 监听指定 fd 的指定事件 */</span></span>
<span class="line"><span>    if (aeApiAddEvent(eventLoop, fd, mask) == -1)</span></span>
<span class="line"><span>        return AE_ERR;</span></span>
<span class="line"><span>    /* 置文件事件类型，以及事件的处理器 */</span></span>
<span class="line"><span>    fe-&gt;mask |= mask;</span></span>
<span class="line"><span>    if (mask &amp; AE_READABLE) fe-&gt;rfileProc = proc;</span></span>
<span class="line"><span>    if (mask &amp; AE_WRITABLE) fe-&gt;wfileProc = proc;</span></span>
<span class="line"><span>    /* 私有数据 */</span></span>
<span class="line"><span>    fe-&gt;clientData = clientData;</span></span>
<span class="line"><span>    if (fd &gt; eventLoop-&gt;maxfd)</span></span>
<span class="line"><span>        eventLoop-&gt;maxfd = fd;</span></span>
<span class="line"><span>    return AE_OK;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如上文所说，<strong>Redis 基于的底层 I/O 多路复用库有多套</strong>，所以aeApiAddEvent也有多套实现，下面的源码是epoll下的实现。其核心操作就是调用epoll的epoll_ctl函数来向epoll注册响应事件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int aeApiAddEvent(aeEventLoop *eventLoop, int fd, int mask) {</span></span>
<span class="line"><span>    aeApiState *state = eventLoop-&gt;apidata;</span></span>
<span class="line"><span>    struct epoll_event ee = {0}; /* avoid valgrind warning */</span></span>
<span class="line"><span>    /* 如果 fd 没有关联任何事件，那么这是一个 ADD 操作。如果已经关联了某个/某些事件，那么这是一个 MOD 操作。 */</span></span>
<span class="line"><span>    int op = eventLoop-&gt;events[fd].mask == AE_NONE ?</span></span>
<span class="line"><span>            EPOLL_CTL_ADD : EPOLL_CTL_MOD;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /* 注册事件到 epoll */</span></span>
<span class="line"><span>    ee.events = 0;</span></span>
<span class="line"><span>    mask |= eventLoop-&gt;events[fd].mask; /* Merge old events */</span></span>
<span class="line"><span>    if (mask &amp; AE_READABLE) ee.events |= EPOLLIN;</span></span>
<span class="line"><span>    if (mask &amp; AE_WRITABLE) ee.events |= EPOLLOUT;</span></span>
<span class="line"><span>    ee.data.fd = fd;</span></span>
<span class="line"><span>    /* 调用epoll_ctl 系统调用，将事件加入epoll中 */</span></span>
<span class="line"><span>    if (epoll_ctl(state-&gt;epfd,op,fd,&amp;ee) == -1) return -1;</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="事件处理" tabindex="-1">事件处理 <a class="header-anchor" href="#事件处理" aria-label="Permalink to &quot;事件处理&quot;">​</a></h3><p>因为 Redis 中同时存在文件事件和时间事件两个事件类型，所以服务器必须对这两个事件进行调度，决定何时处理文件事件，何时处理时间事件，以及如何调度它们。</p><p>aeMain函数以一个无限循环不断地调用aeProcessEvents函数来处理所有的事件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void aeMain(aeEventLoop *eventLoop) {</span></span>
<span class="line"><span>    eventLoop-&gt;stop = 0;</span></span>
<span class="line"><span>    while (!eventLoop-&gt;stop) {</span></span>
<span class="line"><span>        /* 如果有需要在事件处理前执行的函数，那么执行它 */</span></span>
<span class="line"><span>        if (eventLoop-&gt;beforesleep != NULL)</span></span>
<span class="line"><span>            eventLoop-&gt;beforesleep(eventLoop);</span></span>
<span class="line"><span>        /* 开始处理事件*/</span></span>
<span class="line"><span>        aeProcessEvents(eventLoop, AE_ALL_EVENTS|AE_CALL_AFTER_SLEEP);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>下面是aeProcessEvents的伪代码，它会首先计算距离当前时间最近的时间事件，以此计算一个超时时间；然后调用aeApiPoll函数去等待底层的I/O多路复用事件就绪；aeApiPoll函数返回之后，会处理所有已经产生文件事件和已经达到的时间事件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* 伪代码 */</span></span>
<span class="line"><span>int aeProcessEvents(aeEventLoop *eventLoop, int flags) {</span></span>
<span class="line"><span>    /* 获取到达时间距离当前时间最接近的时间事件*/</span></span>
<span class="line"><span>    time_event = aeSearchNearestTimer();</span></span>
<span class="line"><span>    /* 计算最接近的时间事件距离到达还有多少毫秒*/</span></span>
<span class="line"><span>    remaind_ms = time_event.when - unix_ts_now();</span></span>
<span class="line"><span>    /* 如果事件已经到达，那么remaind_ms为负数，将其设置为0 */</span></span>
<span class="line"><span>    if (remaind_ms &lt; 0) remaind_ms = 0;</span></span>
<span class="line"><span>    /* 根据 remaind_ms 的值，创建 timeval 结构*/</span></span>
<span class="line"><span>    timeval = create_timeval_with_ms(remaind_ms);</span></span>
<span class="line"><span>    /* 阻塞并等待文件事件产生，最大阻塞时间由传入的 timeval 结构决定，如果remaind_ms 的值为0，则aeApiPoll 调用后立刻返回，不阻塞*/</span></span>
<span class="line"><span>    /* aeApiPoll调用epoll_wait函数，等待I/O事件*/</span></span>
<span class="line"><span>    aeApiPoll(timeval);</span></span>
<span class="line"><span>    /* 处理所有已经产生的文件事件*/</span></span>
<span class="line"><span>    processFileEvents();</span></span>
<span class="line"><span>    /* 处理所有已经到达的时间事件*/</span></span>
<span class="line"><span>    processTimeEvents();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>与aeApiAddEvent类似，aeApiPoll也有多套实现，它其实就做了两件事情，调用epoll_wait阻塞等待epoll的事件就绪，超时时间就是之前根据最快达到时间事件计算而来的超时时间；然后将就绪的epoll事件转换到fired就绪事件。aeApiPoll就是上文所说的I/O多路复用程序。具体过程如下图所示。</p><p><img src="`+d+`" alt="error.图片加载失败"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int aeApiPoll(aeEventLoop *eventLoop, struct timeval *tvp) </span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    aeApiState *state = eventLoop-&gt;apidata;</span></span>
<span class="line"><span>    int retval, numevents = 0;</span></span>
<span class="line"><span>    // 调用epoll_wait函数，等待时间为最近达到时间事件的时间计算而来。</span></span>
<span class="line"><span>    retval = epoll_wait(state-&gt;epfd,state-&gt;events,eventLoop-&gt;setsize,</span></span>
<span class="line"><span>            tvp ? (tvp-&gt;tv_sec*1000 + tvp-&gt;tv_usec/1000) : -1);</span></span>
<span class="line"><span>    // 有至少一个事件就绪？</span></span>
<span class="line"><span>    if (retval &gt; 0) </span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        int j;</span></span>
<span class="line"><span>        /*为已就绪事件设置相应的模式，并加入到 eventLoop 的 fired 数组中*/</span></span>
<span class="line"><span>        numevents = retval;</span></span>
<span class="line"><span>        for (j = 0; j &lt; numevents; j++) </span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>            int mask = 0;</span></span>
<span class="line"><span>            struct epoll_event *e = state-&gt;events+j;</span></span>
<span class="line"><span>            if (e-&gt;events &amp; EPOLLIN)</span></span>
<span class="line"><span>        mask |= AE_READABLE;</span></span>
<span class="line"><span>            if (e-&gt;events &amp; EPOLLOUT)</span></span>
<span class="line"><span>        mask |= AE_WRITABLE;</span></span>
<span class="line"><span>            if (e-&gt;events &amp; EPOLLERR) </span></span>
<span class="line"><span>        mask |= AE_WRITABLE;</span></span>
<span class="line"><span>            if (e-&gt;events &amp; EPOLLHUP)</span></span>
<span class="line"><span>        mask |= AE_WRITABLE;</span></span>
<span class="line"><span>            /* 设置就绪事件表元素 */</span></span>
<span class="line"><span>            eventLoop-&gt;fired[j].fd = e-&gt;data.fd;</span></span>
<span class="line"><span>            eventLoop-&gt;fired[j].mask = mask;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 返回已就绪事件个数</span></span>
<span class="line"><span>    return numevents;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>processFileEvent是处理就绪文件事件的伪代码，也是上文所述的文件事件分派器，它其实就是遍历fired就绪事件表，然后根据对应的事件类型来调用事件中注册的不同处理器，读事件调用rfileProc，而写事件调用wfileProc。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void processFileEvent(int numevents) {</span></span>
<span class="line"><span>    for (j = 0; j &lt; numevents; j++) {</span></span>
<span class="line"><span>            /* 从已就绪数组中获取事件 */</span></span>
<span class="line"><span>            aeFileEvent *fe = &amp;eventLoop-&gt;events[eventLoop-&gt;fired[j].fd];</span></span>
<span class="line"><span>            int mask = eventLoop-&gt;fired[j].mask;</span></span>
<span class="line"><span>            int fd = eventLoop-&gt;fired[j].fd;</span></span>
<span class="line"><span>            int fired = 0;</span></span>
<span class="line"><span>            int invert = fe-&gt;mask &amp; AE_BARRIER;</span></span>
<span class="line"><span>            /* 读事件 */</span></span>
<span class="line"><span>            if (!invert &amp;&amp; fe-&gt;mask &amp; mask &amp; AE_READABLE) {</span></span>
<span class="line"><span>                /* 调用读处理函数 */</span></span>
<span class="line"><span>                fe-&gt;rfileProc(eventLoop,fd,fe-&gt;clientData,mask);</span></span>
<span class="line"><span>                fired++;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            /* 写事件. */</span></span>
<span class="line"><span>            if (fe-&gt;mask &amp; mask &amp; AE_WRITABLE) {</span></span>
<span class="line"><span>                if (!fired || fe-&gt;wfileProc != fe-&gt;rfileProc) {</span></span>
<span class="line"><span>                    fe-&gt;wfileProc(eventLoop,fd,fe-&gt;clientData,mask);</span></span>
<span class="line"><span>                    fired++;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (invert &amp;&amp; fe-&gt;mask &amp; mask &amp; AE_READABLE) {</span></span>
<span class="line"><span>                if (!fired || fe-&gt;wfileProc != fe-&gt;rfileProc) {</span></span>
<span class="line"><span>                    fe-&gt;rfileProc(eventLoop,fd,fe-&gt;clientData,mask);</span></span>
<span class="line"><span>                    fired++;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            processed++;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>而processTimeEvents是处理时间事件的函数，它会遍历aeEventLoop的事件事件列表，如果时间事件到达就执行其timeProc函数，并根据函数的返回值是否等于AE_NOMORE来决定该时间事件是否是周期性事件，并修改器到达时间。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int processTimeEvents(aeEventLoop *eventLoop) {</span></span>
<span class="line"><span>    int processed = 0;</span></span>
<span class="line"><span>    aeTimeEvent *te;</span></span>
<span class="line"><span>    long long maxId;</span></span>
<span class="line"><span>    time_t now = time(NULL);</span></span>
<span class="line"><span>    ....</span></span>
<span class="line"><span>    eventLoop-&gt;lastTime = now;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    te = eventLoop-&gt;timeEventHead;</span></span>
<span class="line"><span>    maxId = eventLoop-&gt;timeEventNextId-1;</span></span>
<span class="line"><span>    /* 遍历时间事件链表 */</span></span>
<span class="line"><span>    while(te) {</span></span>
<span class="line"><span>        long now_sec, now_ms;</span></span>
<span class="line"><span>        long long id;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        /* 删除需要删除的时间事件 */</span></span>
<span class="line"><span>        if (te-&gt;id == AE_DELETED_EVENT_ID) {</span></span>
<span class="line"><span>            aeTimeEvent *next = te-&gt;next;</span></span>
<span class="line"><span>            if (te-&gt;prev)</span></span>
<span class="line"><span>                te-&gt;prev-&gt;next = te-&gt;next;</span></span>
<span class="line"><span>            else</span></span>
<span class="line"><span>                eventLoop-&gt;timeEventHead = te-&gt;next;</span></span>
<span class="line"><span>            if (te-&gt;next)</span></span>
<span class="line"><span>                te-&gt;next-&gt;prev = te-&gt;prev;</span></span>
<span class="line"><span>            if (te-&gt;finalizerProc)</span></span>
<span class="line"><span>                te-&gt;finalizerProc(eventLoop, te-&gt;clientData);</span></span>
<span class="line"><span>            zfree(te);</span></span>
<span class="line"><span>            te = next;</span></span>
<span class="line"><span>            continue;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        /* id 大于最大maxId,是该循环周期生成的时间事件，不处理 */</span></span>
<span class="line"><span>        if (te-&gt;id &gt; maxId) {</span></span>
<span class="line"><span>            te = te-&gt;next;</span></span>
<span class="line"><span>            continue;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        aeGetTime(&amp;now_sec, &amp;now_ms);</span></span>
<span class="line"><span>        /* 事件已经到达，调用其timeProc函数*/</span></span>
<span class="line"><span>        if (now_sec &gt; te-&gt;when_sec ||</span></span>
<span class="line"><span>            (now_sec == te-&gt;when_sec &amp;&amp; now_ms &gt;= te-&gt;when_ms))</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            int retval;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            id = te-&gt;id;</span></span>
<span class="line"><span>            retval = te-&gt;timeProc(eventLoop, id, te-&gt;clientData);</span></span>
<span class="line"><span>            processed++;</span></span>
<span class="line"><span>            /* 如果返回值不等于 AE_NOMORE,表示是一个周期性事件，修改其when_sec和when_ms属性*/</span></span>
<span class="line"><span>            if (retval != AE_NOMORE) {</span></span>
<span class="line"><span>                aeAddMillisecondsToNow(retval,&amp;te-&gt;when_sec,&amp;te-&gt;when_ms);</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                /* 一次性事件，标记为需删除，下次遍历时会删除*/</span></span>
<span class="line"><span>                te-&gt;id = AE_DELETED_EVENT_ID;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        te = te-&gt;next;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return processed;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="删除事件" tabindex="-1">删除事件 <a class="header-anchor" href="#删除事件" aria-label="Permalink to &quot;删除事件&quot;">​</a></h3><p>当不在需要某个事件时，需要把事件删除掉。例如: 如果fd同时监听读事件、写事件。当不在需要监听写事件时，可以把该fd的写事件删除。</p><p>aeDeleteEventLoop函数的执行过程总结为以下几个步骤</p><ul><li>根据fd在未就绪表中查找到事件</li><li>取消该fd对应的相应事件标识符</li><li>调用aeApiFree函数，内核会将epoll监听红黑树上的相应事件监听取消。</li></ul><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><p>本文主要参考整理自</p><ul><li><a href="https://segmentfault.com/a/1190000020014518" target="_blank" rel="noreferrer">https://segmentfault.com/a/1190000020014518</a></li></ul><p>还参考了</p><ul><li><a href="https://www.cnblogs.com/pinxiong/p/13288094.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/pinxiong/p/13288094.html</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,88)]))}const k=l(v,[["render",g]]);export{b as __pageData,k as default};
