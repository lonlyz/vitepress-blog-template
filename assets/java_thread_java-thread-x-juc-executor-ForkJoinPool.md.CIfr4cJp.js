import{b as s,c as a,_ as p,a as e}from"./chunks/java-thread-x-forkjoin-3.c4XMUiOR.js";import{_ as l,c as i,ai as t,o}from"./chunks/framework.BrYByd3F.js";const r="/vitepress-blog-template/images/thread/java-thread-x-forkjoin-5.png",c="/vitepress-blog-template/images/thread/java-thread-x-forkjoin-6.png",v=JSON.parse('{"title":"JUC线程池: Fork/Join框架详解","description":"","frontmatter":{},"headers":[],"relativePath":"java/thread/java-thread-x-juc-executor-ForkJoinPool.md","filePath":"java/thread/java-thread-x-juc-executor-ForkJoinPool.md","lastUpdated":1737706346000}'),u={name:"java/thread/java-thread-x-juc-executor-ForkJoinPool.md"};function k(d,n,h,m,g,f){return o(),i("div",null,n[0]||(n[0]=[t(`<h1 id="juc线程池-fork-join框架详解" tabindex="-1">JUC线程池: Fork/Join框架详解 <a class="header-anchor" href="#juc线程池-fork-join框架详解" aria-label="Permalink to &quot;JUC线程池: Fork/Join框架详解&quot;">​</a></h1><blockquote><p>ForkJoinPool 是JDK 7加入的一个线程池类。Fork/Join 技术是分治算法(Divide-and-Conquer)的并行实现，它是一项可以获得良好的并行性能的简单且高效的设计技术。目的是为了帮助我们更好地利用多处理器带来的好处，使用所有可用的运算能力来提升应用的性能。@pdai</p></blockquote><h2 id="带着bat大厂的面试问题去理解fork-join框架" tabindex="-1">带着BAT大厂的面试问题去理解Fork/Join框架 <a class="header-anchor" href="#带着bat大厂的面试问题去理解fork-join框架" aria-label="Permalink to &quot;带着BAT大厂的面试问题去理解Fork/Join框架&quot;">​</a></h2><p>提示</p><p>请带着这些问题继续后文，会很大程度上帮助你更好的理解Fork/Join框架。@pdai</p><ul><li>Fork/Join主要用来解决什么样的问题?</li><li>Fork/Join框架是在哪个JDK版本中引入的?</li><li>Fork/Join框架主要包含哪三个模块? 模块之间的关系是怎么样的?</li><li>ForkJoinPool类继承关系?</li><li>ForkJoinTask抽象类继承关系? 在实际运用中，我们一般都会继承 RecursiveTask 、RecursiveAction 或 CountedCompleter 来实现我们的业务需求，而不会直接继承 ForkJoinTask 类。</li><li>整个Fork/Join 框架的执行流程/运行机制是怎么样的?</li><li>具体阐述Fork/Join的分治思想和work-stealing 实现方式?</li><li>有哪些JDK源码中使用了Fork/Join思想?</li><li>如何使用Executors工具类创建ForkJoinPool?</li><li>写一个例子: 用ForkJoin方式实现1+2+3+...+100000?</li><li>Fork/Join在使用时有哪些注意事项? 结合JDK中的斐波那契数列实例具体说明。</li></ul><h2 id="fork-join框架简介" tabindex="-1">Fork/Join框架简介 <a class="header-anchor" href="#fork-join框架简介" aria-label="Permalink to &quot;Fork/Join框架简介&quot;">​</a></h2><p>Fork/Join框架是Java并发工具包中的一种可以将一个大任务拆分为很多小任务来异步执行的工具，自JDK1.7引入。</p><h3 id="三个模块及关系" tabindex="-1">三个模块及关系 <a class="header-anchor" href="#三个模块及关系" aria-label="Permalink to &quot;三个模块及关系&quot;">​</a></h3><p>Fork/Join框架主要包含三个模块:</p><ul><li>任务对象: <code>ForkJoinTask</code> (包括<code>RecursiveTask</code>、<code>RecursiveAction</code> 和 <code>CountedCompleter</code>)</li><li>执行Fork/Join任务的线程: <code>ForkJoinWorkerThread</code></li><li>线程池: <code>ForkJoinPool</code></li></ul><p>这三者的关系是: ForkJoinPool可以通过池中的ForkJoinWorkerThread来处理ForkJoinTask任务。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// from 《A Java Fork/Join Framework》Dong Lea</span></span>
<span class="line"><span>Result solve(Problem problem) {</span></span>
<span class="line"><span>	if (problem is small)</span></span>
<span class="line"><span> 		directly solve problem</span></span>
<span class="line"><span> 	else {</span></span>
<span class="line"><span> 		split problem into independent parts</span></span>
<span class="line"><span> 		fork new subtasks to solve each part</span></span>
<span class="line"><span> 		join all subtasks</span></span>
<span class="line"><span> 		compose result from subresults</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>ForkJoinPool 只接收 ForkJoinTask 任务(在实际使用中，也可以接收 Runnable/Callable 任务，但在真正运行时，也会把这些任务封装成 ForkJoinTask 类型的任务)，RecursiveTask 是 ForkJoinTask 的子类，是一个可以递归执行的 ForkJoinTask，RecursiveAction 是一个无返回值的 RecursiveTask，CountedCompleter 在任务完成执行后会触发执行一个自定义的钩子函数。</p><p>在实际运用中，我们一般都会继承 <code>RecursiveTask</code> 、<code>RecursiveAction</code> 或 <code>CountedCompleter</code> 来实现我们的业务需求，而不会直接继承 ForkJoinTask 类。</p><h3 id="核心思想-分治算法-divide-and-conquer" tabindex="-1">核心思想: 分治算法(Divide-and-Conquer) <a class="header-anchor" href="#核心思想-分治算法-divide-and-conquer" aria-label="Permalink to &quot;核心思想: 分治算法(Divide-and-Conquer)&quot;">​</a></h3><p>分治算法(Divide-and-Conquer)把任务递归的拆分为各个子任务，这样可以更好的利用系统资源，尽可能的使用所有可用的计算能力来提升应用性能。首先看一下 Fork/Join 框架的任务运行机制:</p><p><img src="`+s+'" alt="error.图片加载失败"></p><ul><li>这里也可以一并看下: <a href="https://pdai.tech/md/algorithm/alg-core-divide-and-conquer.html" target="_blank" rel="noreferrer">算法思想 - 分治算法</a></li></ul><h3 id="核心思想-work-stealing-工作窃取-算法" tabindex="-1">核心思想: work-stealing(工作窃取)算法 <a class="header-anchor" href="#核心思想-work-stealing-工作窃取-算法" aria-label="Permalink to &quot;核心思想: work-stealing(工作窃取)算法&quot;">​</a></h3><p>work-stealing(工作窃取)算法: 线程池内的所有工作线程都尝试找到并执行已经提交的任务，或者是被其他活动任务创建的子任务(如果不存在就阻塞等待)。这种特性使得 ForkJoinPool 在运行多个可以产生子任务的任务，或者是提交的许多小任务时效率更高。尤其是构建异步模型的 ForkJoinPool 时，对不需要合并(join)的事件类型任务也非常适用。</p><p>在 ForkJoinPool 中，线程池中每个工作线程(ForkJoinWorkerThread)都对应一个任务队列(WorkQueue)，工作线程优先处理来自自身队列的任务(LIFO或FIFO顺序，参数 mode 决定)，然后以FIFO的顺序随机窃取其他队列中的任务。</p><p>具体思路如下:</p><ul><li>每个线程都有自己的一个WorkQueue，该工作队列是一个双端队列。</li><li>队列支持三个功能push、pop、poll</li><li>push/pop只能被队列的所有者线程调用，而poll可以被其他线程调用。</li><li>划分的子任务调用fork时，都会被push到自己的队列中。</li><li>默认情况下，工作线程从自己的双端队列获出任务并执行。</li><li>当自己的队列为空时，线程随机从另一个线程的队列末尾调用poll方法窃取任务。</li></ul><p><img src="'+a+'" alt="error.图片加载失败"></p><h3 id="fork-join-框架的执行流程" tabindex="-1">Fork/Join 框架的执行流程 <a class="header-anchor" href="#fork-join-框架的执行流程" aria-label="Permalink to &quot;Fork/Join 框架的执行流程&quot;">​</a></h3><p>上图可以看出ForkJoinPool 中的任务执行分两种:</p><ul><li>直接通过 FJP 提交的外部任务(external/submissions task)，存放在 workQueues 的偶数槽位；</li><li>通过内部 fork 分割的子任务(Worker task)，存放在 workQueues 的奇数槽位。</li></ul><p>那Fork/Join 框架的执行流程是什么样的?</p><p><img src="'+r+'" alt="error.图片加载失败"></p><blockquote><p>后续的源码解析将围绕上图进行。</p></blockquote><h2 id="fork-join类关系" tabindex="-1">Fork/Join类关系 <a class="header-anchor" href="#fork-join类关系" aria-label="Permalink to &quot;Fork/Join类关系&quot;">​</a></h2><h3 id="forkjoinpool继承关系" tabindex="-1">ForkJoinPool继承关系 <a class="header-anchor" href="#forkjoinpool继承关系" aria-label="Permalink to &quot;ForkJoinPool继承关系&quot;">​</a></h3><p><img src="'+p+'" alt="error.图片加载失败"></p><p>内部类介绍:</p><ul><li><p>ForkJoinWorkerThreadFactory: 内部线程工厂接口，用于创建工作线程ForkJoinWorkerThread</p></li><li><p>DefaultForkJoinWorkerThreadFactory: ForkJoinWorkerThreadFactory 的默认实现类</p></li><li><p>InnocuousForkJoinWorkerThreadFactory: 实现了 ForkJoinWorkerThreadFactory，无许可线程工厂，当系统变量中有系统安全管理相关属性时，默认使用这个工厂创建工作线程。</p></li><li><p>EmptyTask: 内部占位类，用于替换队列中 join 的任务。</p></li><li><p>ManagedBlocker: 为 ForkJoinPool 中的任务提供扩展管理并行数的接口，一般用在可能会阻塞的任务(如在 Phaser 中用于等待 phase 到下一个generation)。</p></li><li><p>WorkQueue: ForkJoinPool 的核心数据结构，本质上是work-stealing 模式的双端任务队列，内部存放 ForkJoinTask 对象任务，使用 @Contented 注解修饰防止伪共享。</p><ul><li>工作线程在运行中产生新的任务(通常是因为调用了 fork())时，此时可以把 WorkQueue 的数据结构视为一个栈，新的任务会放入栈顶(top 位)；工作线程在处理自己工作队列的任务时，按照 LIFO 的顺序。</li><li>工作线程在处理自己的工作队列同时，会尝试窃取一个任务(可能是来自于刚刚提交到 pool 的任务，或是来自于其他工作线程的队列任务)，此时可以把 WorkQueue 的数据结构视为一个 FIFO 的队列，窃取的任务位于其他线程的工作队列的队首(base位)。</li></ul></li><li><p>伪共享状态: 缓存系统中是以缓存行(cache line)为单位存储的。缓存行是2的整数幂个连续字节，一般为32-256个字节。最常见的缓存行大小是64个字节。当多线程修改互相独立的变量时，如果这些变量共享同一个缓存行，就会无意中影响彼此的性能，这就是伪共享。</p></li></ul><h3 id="forkjointask继承关系" tabindex="-1">ForkJoinTask继承关系 <a class="header-anchor" href="#forkjointask继承关系" aria-label="Permalink to &quot;ForkJoinTask继承关系&quot;">​</a></h3><p><img src="'+e+`" alt="error.图片加载失败"></p><p>ForkJoinTask 实现了 Future 接口，说明它也是一个可取消的异步运算任务，实际上ForkJoinTask 是 Future 的轻量级实现，主要用在纯粹是计算的函数式任务或者操作完全独立的对象计算任务。fork 是主运行方法，用于异步执行；而 join 方法在任务结果计算完毕之后才会运行，用来合并或返回计算结果。 其内部类都比较简单，ExceptionNode 是用于存储任务执行期间的异常信息的单向链表；其余四个类是为 Runnable/Callable 任务提供的适配器类，用于把 Runnable/Callable 转化为 ForkJoinTask 类型的任务(因为 ForkJoinPool 只可以运行 ForkJoinTask 类型的任务)。</p><h2 id="fork-join框架源码解析" tabindex="-1">Fork/Join框架源码解析 <a class="header-anchor" href="#fork-join框架源码解析" aria-label="Permalink to &quot;Fork/Join框架源码解析&quot;">​</a></h2><blockquote><p>分析思路: 在对类层次结构有了解以后，我们先看下内部核心参数，然后分析上述流程图。会分4个部分:</p></blockquote><ul><li>首先介绍任务的提交流程 - 外部任务(external/submissions task)提交</li><li>然后介绍任务的提交流程 - 子任务(Worker task)提交</li><li>再分析任务的执行过程(ForkJoinWorkerThread.run()到ForkJoinTask.doExec()这一部分)；</li><li>最后介绍任务的结果获取(ForkJoinTask.join()和ForkJoinTask.invoke())</li></ul><h3 id="forkjoinpool" tabindex="-1">ForkJoinPool <a class="header-anchor" href="#forkjoinpool" aria-label="Permalink to &quot;ForkJoinPool&quot;">​</a></h3><h4 id="核心参数" tabindex="-1">核心参数 <a class="header-anchor" href="#核心参数" aria-label="Permalink to &quot;核心参数&quot;">​</a></h4><p>在后面的源码解析中，我们会看到大量的位运算，这些位运算都是通过我们接下来介绍的一些常量参数来计算的。</p><p>例如，如果要更新活跃线程数，使用公式(UC_MASK &amp; (c + AC_UNIT)) | (SP_MASK &amp; c)；c 代表当前 ctl，UC_MASK 和 SP_MASK 分别是高位和低位掩码，AC_UNIT 为活跃线程的增量数，使用(UC_MASK &amp; (c + AC_UNIT))就可以计算出高32位，然后再加上低32位(SP_MASK &amp; c)，就拼接成了一个新的ctl。</p><p>这些运算的可读性很差，看起来有些复杂。在后面源码解析中有位运算的地方我都会加上注释，大家只需要了解它们的作用即可。</p><p>ForkJoinPool 与 内部类 WorkQueue 共享的一些常量:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Constants shared across ForkJoinPool and WorkQueue</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 限定参数</span></span>
<span class="line"><span>static final int SMASK = 0xffff;        //  低位掩码，也是最大索引位</span></span>
<span class="line"><span>static final int MAX_CAP = 0x7fff;        //  工作线程最大容量</span></span>
<span class="line"><span>static final int EVENMASK = 0xfffe;        //  偶数低位掩码</span></span>
<span class="line"><span>static final int SQMASK = 0x007e;        //  workQueues 数组最多64个槽位</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// ctl 子域和 WorkQueue.scanState 的掩码和标志位</span></span>
<span class="line"><span>static final int SCANNING = 1;             // 标记是否正在运行任务</span></span>
<span class="line"><span>static final int INACTIVE = 1 &lt;&lt; 31;       // 失活状态  负数</span></span>
<span class="line"><span>static final int SS_SEQ = 1 &lt;&lt; 16;       // 版本戳，防止ABA问题</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// ForkJoinPool.config 和 WorkQueue.config 的配置信息标记</span></span>
<span class="line"><span>static final int MODE_MASK = 0xffff &lt;&lt; 16;  // 模式掩码</span></span>
<span class="line"><span>static final int LIFO_QUEUE = 0; //LIFO队列</span></span>
<span class="line"><span>static final int FIFO_QUEUE = 1 &lt;&lt; 16;//FIFO队列</span></span>
<span class="line"><span>static final int SHARED_QUEUE = 1 &lt;&lt; 31;       // 共享模式队列，负数</span></span></code></pre></div><p>ForkJoinPool 中的相关常量和实例字段:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//  低位和高位掩码</span></span>
<span class="line"><span>private static final long SP_MASK = 0xffffffffL;</span></span>
<span class="line"><span>private static final long UC_MASK = ~SP_MASK;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 活跃线程数</span></span>
<span class="line"><span>private static final int AC_SHIFT = 48;</span></span>
<span class="line"><span>private static final long AC_UNIT = 0x0001L &lt;&lt; AC_SHIFT; //活跃线程数增量</span></span>
<span class="line"><span>private static final long AC_MASK = 0xffffL &lt;&lt; AC_SHIFT; //活跃线程数掩码</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 工作线程数</span></span>
<span class="line"><span>private static final int TC_SHIFT = 32;</span></span>
<span class="line"><span>private static final long TC_UNIT = 0x0001L &lt;&lt; TC_SHIFT; //工作线程数增量</span></span>
<span class="line"><span>private static final long TC_MASK = 0xffffL &lt;&lt; TC_SHIFT; //掩码</span></span>
<span class="line"><span>private static final long ADD_WORKER = 0x0001L &lt;&lt; (TC_SHIFT + 15);  // 创建工作线程标志</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 池状态</span></span>
<span class="line"><span>private static final int RSLOCK = 1;</span></span>
<span class="line"><span>private static final int RSIGNAL = 1 &lt;&lt; 1;</span></span>
<span class="line"><span>private static final int STARTED = 1 &lt;&lt; 2;</span></span>
<span class="line"><span>private static final int STOP = 1 &lt;&lt; 29;</span></span>
<span class="line"><span>private static final int TERMINATED = 1 &lt;&lt; 30;</span></span>
<span class="line"><span>private static final int SHUTDOWN = 1 &lt;&lt; 31;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 实例字段</span></span>
<span class="line"><span>volatile long ctl;                   // 主控制参数</span></span>
<span class="line"><span>volatile int runState;               // 运行状态锁</span></span>
<span class="line"><span>final int config;                    // 并行度|模式</span></span>
<span class="line"><span>int indexSeed;                       // 用于生成工作线程索引</span></span>
<span class="line"><span>volatile WorkQueue[] workQueues;     // 主对象注册信息，workQueue</span></span>
<span class="line"><span>final ForkJoinWorkerThreadFactory factory;// 线程工厂</span></span>
<span class="line"><span>final UncaughtExceptionHandler ueh;  // 每个工作线程的异常信息</span></span>
<span class="line"><span>final String workerNamePrefix;       // 用于创建工作线程的名称</span></span>
<span class="line"><span>volatile AtomicLong stealCounter;    // 偷取任务总数，也可作为同步监视器</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/** 静态初始化字段 */</span></span>
<span class="line"><span>//线程工厂</span></span>
<span class="line"><span>public static final ForkJoinWorkerThreadFactory defaultForkJoinWorkerThreadFactory;</span></span>
<span class="line"><span>//启动或杀死线程的方法调用者的权限</span></span>
<span class="line"><span>private static final RuntimePermission modifyThreadPermission;</span></span>
<span class="line"><span>// 公共静态pool</span></span>
<span class="line"><span>static final ForkJoinPool common;</span></span>
<span class="line"><span>//并行度，对应内部common池</span></span>
<span class="line"><span>static final int commonParallelism;</span></span>
<span class="line"><span>//备用线程数，在tryCompensate中使用</span></span>
<span class="line"><span>private static int commonMaxSpares;</span></span>
<span class="line"><span>//创建workerNamePrefix(工作线程名称前缀)时的序号</span></span>
<span class="line"><span>private static int poolNumberSequence;</span></span>
<span class="line"><span>//线程阻塞等待新的任务的超时值(以纳秒为单位)，默认2秒</span></span>
<span class="line"><span>private static final long IDLE_TIMEOUT = 2000L * 1000L * 1000L; // 2sec</span></span>
<span class="line"><span>//空闲超时时间，防止timer未命中</span></span>
<span class="line"><span>private static final long TIMEOUT_SLOP = 20L * 1000L * 1000L;  // 20ms</span></span>
<span class="line"><span>//默认备用线程数</span></span>
<span class="line"><span>private static final int DEFAULT_COMMON_MAX_SPARES = 256;</span></span>
<span class="line"><span>//阻塞前自旋的次数，用在在awaitRunStateLock和awaitWork中</span></span>
<span class="line"><span>private static final int SPINS  = 0;</span></span>
<span class="line"><span>//indexSeed的增量</span></span>
<span class="line"><span>private static final int SEED_INCREMENT = 0x9e3779b9;</span></span></code></pre></div><p>说明: ForkJoinPool 的内部状态都是通过一个64位的 long 型 变量ctl来存储，它由四个16位的子域组成:</p><ul><li>AC: 正在运行工作线程数减去目标并行度，高16位</li><li>TC: 总工作线程数减去目标并行度，中高16位</li><li>SS: 栈顶等待线程的版本计数和状态，中低16位</li><li>ID: 栈顶 WorkQueue 在池中的索引(poolIndex)，低16位</li></ul><p>在后面的源码解析中，某些地方也提取了ctl的低32位(sp=(int)ctl)来检查工作线程状态，例如，当sp不为0时说明当前还有空闲工作线程。</p><h4 id="forkjoinpool-workqueue-中的相关属性" tabindex="-1">ForkJoinPool.WorkQueue 中的相关属性: <a class="header-anchor" href="#forkjoinpool-workqueue-中的相关属性" aria-label="Permalink to &quot;ForkJoinPool.WorkQueue 中的相关属性:&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//初始队列容量，2的幂</span></span>
<span class="line"><span>static final int INITIAL_QUEUE_CAPACITY = 1 &lt;&lt; 13;</span></span>
<span class="line"><span>//最大队列容量</span></span>
<span class="line"><span>static final int MAXIMUM_QUEUE_CAPACITY = 1 &lt;&lt; 26; // 64M</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 实例字段</span></span>
<span class="line"><span>volatile int scanState;    // Woker状态, &lt;0: inactive; odd:scanning</span></span>
<span class="line"><span>int stackPred;             // 记录前一个栈顶的ctl</span></span>
<span class="line"><span>int nsteals;               // 偷取任务数</span></span>
<span class="line"><span>int hint;                  // 记录偷取者索引，初始为随机索引</span></span>
<span class="line"><span>int config;                // 池索引和模式</span></span>
<span class="line"><span>volatile int qlock;        // 1: locked, &lt; 0: terminate; else 0</span></span>
<span class="line"><span>volatile int base;         //下一个poll操作的索引(栈底/队列头)</span></span>
<span class="line"><span>int top;                   //  下一个push操作的索引(栈顶/队列尾)</span></span>
<span class="line"><span>ForkJoinTask&lt;?&gt;[] array;   // 任务数组</span></span>
<span class="line"><span>final ForkJoinPool pool;   // the containing pool (may be null)</span></span>
<span class="line"><span>final ForkJoinWorkerThread owner; // 当前工作队列的工作线程，共享模式下为null</span></span>
<span class="line"><span>volatile Thread parker;    // 调用park阻塞期间为owner，其他情况为null</span></span>
<span class="line"><span>volatile ForkJoinTask&lt;?&gt; currentJoin;  // 记录被join过来的任务</span></span>
<span class="line"><span>volatile ForkJoinTask&lt;?&gt; currentSteal; // 记录从其他工作队列偷取过来的任务</span></span></code></pre></div><h3 id="forkjointask" tabindex="-1">ForkJoinTask <a class="header-anchor" href="#forkjointask" aria-label="Permalink to &quot;ForkJoinTask&quot;">​</a></h3><h4 id="核心参数-1" tabindex="-1">核心参数 <a class="header-anchor" href="#核心参数-1" aria-label="Permalink to &quot;核心参数&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/** 任务运行状态 */</span></span>
<span class="line"><span>volatile int status; // 任务运行状态</span></span>
<span class="line"><span>static final int DONE_MASK   = 0xf0000000;  // 任务完成状态标志位</span></span>
<span class="line"><span>static final int NORMAL      = 0xf0000000;  // must be negative</span></span>
<span class="line"><span>static final int CANCELLED   = 0xc0000000;  // must be &lt; NORMAL</span></span>
<span class="line"><span>static final int EXCEPTIONAL = 0x80000000;  // must be &lt; CANCELLED</span></span>
<span class="line"><span>static final int SIGNAL      = 0x00010000;  // must be &gt;= 1 &lt;&lt; 16 等待信号</span></span>
<span class="line"><span>static final int SMASK       = 0x0000ffff;  //  低位掩码</span></span></code></pre></div><h2 id="fork-join框架源码解析-1" tabindex="-1">Fork/Join框架源码解析 <a class="header-anchor" href="#fork-join框架源码解析-1" aria-label="Permalink to &quot;Fork/Join框架源码解析&quot;">​</a></h2><h3 id="构造函数" tabindex="-1">构造函数 <a class="header-anchor" href="#构造函数" aria-label="Permalink to &quot;构造函数&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ForkJoinPool(int parallelism,</span></span>
<span class="line"><span>                    ForkJoinWorkerThreadFactory factory,</span></span>
<span class="line"><span>                    UncaughtExceptionHandler handler,</span></span>
<span class="line"><span>                    boolean asyncMode) {</span></span>
<span class="line"><span>    this(checkParallelism(parallelism),</span></span>
<span class="line"><span>            checkFactory(factory),</span></span>
<span class="line"><span>            handler,</span></span>
<span class="line"><span>            asyncMode ? FIFO_QUEUE : LIFO_QUEUE,</span></span>
<span class="line"><span>            &quot;ForkJoinPool-&quot; + nextPoolId() + &quot;-worker-&quot;);</span></span>
<span class="line"><span>    checkPermission();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 在 ForkJoinPool 中我们可以自定义四个参数:</p><ul><li>parallelism: 并行度，默认为CPU数，最小为1</li><li>factory: 工作线程工厂；</li><li>handler: 处理工作线程运行任务时的异常情况类，默认为null；</li><li>asyncMode: 是否为异步模式，默认为 false。如果为true，表示子任务的执行遵循 FIFO 顺序并且任务不能被合并(join)，这种模式适用于工作线程只运行事件类型的异步任务。</li></ul><p>在多数场景使用时，如果没有太强的业务需求，我们一般直接使用 ForkJoinPool 中的common池，在JDK1.8之后提供了ForkJoinPool.commonPool()方法可以直接使用common池，来看一下它的构造:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static ForkJoinPool makeCommonPool() {</span></span>
<span class="line"><span>    int parallelism = -1;</span></span>
<span class="line"><span>    ForkJoinWorkerThreadFactory factory = null;</span></span>
<span class="line"><span>    UncaughtExceptionHandler handler = null;</span></span>
<span class="line"><span>    try {  // ignore exceptions in accessing/parsing</span></span>
<span class="line"><span>        String pp = System.getProperty</span></span>
<span class="line"><span>                (&quot;java.util.concurrent.ForkJoinPool.common.parallelism&quot;);//并行度</span></span>
<span class="line"><span>        String fp = System.getProperty</span></span>
<span class="line"><span>                (&quot;java.util.concurrent.ForkJoinPool.common.threadFactory&quot;);//线程工厂</span></span>
<span class="line"><span>        String hp = System.getProperty</span></span>
<span class="line"><span>                (&quot;java.util.concurrent.ForkJoinPool.common.exceptionHandler&quot;);//异常处理类</span></span>
<span class="line"><span>        if (pp != null)</span></span>
<span class="line"><span>            parallelism = Integer.parseInt(pp);</span></span>
<span class="line"><span>        if (fp != null)</span></span>
<span class="line"><span>            factory = ((ForkJoinWorkerThreadFactory) ClassLoader.</span></span>
<span class="line"><span>                    getSystemClassLoader().loadClass(fp).newInstance());</span></span>
<span class="line"><span>        if (hp != null)</span></span>
<span class="line"><span>            handler = ((UncaughtExceptionHandler) ClassLoader.</span></span>
<span class="line"><span>                    getSystemClassLoader().loadClass(hp).newInstance());</span></span>
<span class="line"><span>    } catch (Exception ignore) {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (factory == null) {</span></span>
<span class="line"><span>        if (System.getSecurityManager() == null)</span></span>
<span class="line"><span>            factory = defaultForkJoinWorkerThreadFactory;</span></span>
<span class="line"><span>        else // use security-managed default</span></span>
<span class="line"><span>            factory = new InnocuousForkJoinWorkerThreadFactory();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (parallelism &lt; 0 &amp;&amp; // default 1 less than #cores</span></span>
<span class="line"><span>            (parallelism = Runtime.getRuntime().availableProcessors() - 1) &lt;= 0)</span></span>
<span class="line"><span>        parallelism = 1;//默认并行度为1</span></span>
<span class="line"><span>    if (parallelism &gt; MAX_CAP)</span></span>
<span class="line"><span>        parallelism = MAX_CAP;</span></span>
<span class="line"><span>    return new ForkJoinPool(parallelism, factory, handler, LIFO_QUEUE,</span></span>
<span class="line"><span>            &quot;ForkJoinPool.commonPool-worker-&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>使用common pool的优点就是我们可以通过指定系统参数的方式定义“并行度、线程工厂和异常处理类”；并且它使用的是同步模式，也就是说可以支持任务合并(join)。</p><h3 id="执行流程-外部任务-external-submissions-task-提交" tabindex="-1">执行流程 - 外部任务(external/submissions task)提交 <a class="header-anchor" href="#执行流程-外部任务-external-submissions-task-提交" aria-label="Permalink to &quot;执行流程 - 外部任务(external/submissions task)提交&quot;">​</a></h3><p>向 ForkJoinPool 提交任务有三种方式:</p><ul><li>invoke()会等待任务计算完毕并返回计算结果；</li><li>execute()是直接向池提交一个任务来异步执行，无返回结果；</li><li>submit()也是异步执行，但是会返回提交的任务，在适当的时候可通过task.get()获取执行结果。</li></ul><p>这三种提交方式都都是调用externalPush()方法来完成，所以接下来我们将从externalPush()方法开始逐步分析外部任务的执行过程。</p><h4 id="externalpush-forkjointask-task" tabindex="-1">externalPush(ForkJoinTask&lt;?&gt; task) <a class="header-anchor" href="#externalpush-forkjointask-task" aria-label="Permalink to &quot;externalPush(ForkJoinTask&lt;?&gt; task)&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//添加给定任务到submission队列中</span></span>
<span class="line"><span>final void externalPush(ForkJoinTask&lt;?&gt; task) {</span></span>
<span class="line"><span>    WorkQueue[] ws;</span></span>
<span class="line"><span>    WorkQueue q;</span></span>
<span class="line"><span>    int m;</span></span>
<span class="line"><span>    int r = ThreadLocalRandom.getProbe();//探针值，用于计算WorkQueue槽位索引</span></span>
<span class="line"><span>    int rs = runState;</span></span>
<span class="line"><span>    if ((ws = workQueues) != null &amp;&amp; (m = (ws.length - 1)) &gt;= 0 &amp;&amp;</span></span>
<span class="line"><span>            (q = ws[m &amp; r &amp; SQMASK]) != null &amp;&amp; r != 0 &amp;&amp; rs &gt; 0 &amp;&amp; //获取随机偶数槽位的workQueue</span></span>
<span class="line"><span>            U.compareAndSwapInt(q, QLOCK, 0, 1)) {//锁定workQueue</span></span>
<span class="line"><span>        ForkJoinTask&lt;?&gt;[] a;</span></span>
<span class="line"><span>        int am, n, s;</span></span>
<span class="line"><span>        if ((a = q.array) != null &amp;&amp;</span></span>
<span class="line"><span>                (am = a.length - 1) &gt; (n = (s = q.top) - q.base)) {</span></span>
<span class="line"><span>            int j = ((am &amp; s) &lt;&lt; ASHIFT) + ABASE;//计算任务索引位置</span></span>
<span class="line"><span>            U.putOrderedObject(a, j, task);//任务入列</span></span>
<span class="line"><span>            U.putOrderedInt(q, QTOP, s + 1);//更新push slot</span></span>
<span class="line"><span>            U.putIntVolatile(q, QLOCK, 0);//解除锁定</span></span>
<span class="line"><span>            if (n &lt;= 1)</span></span>
<span class="line"><span>                signalWork(ws, q);//任务数小于1时尝试创建或激活一个工作线程</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        U.compareAndSwapInt(q, QLOCK, 1, 0);//解除锁定</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    externalSubmit(task);//初始化workQueues及相关属性</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>首先说明一下externalPush和externalSubmit两个方法的联系: 它们的作用都是把任务放到队列中等待执行。不同的是，externalSubmit可以说是完整版的externalPush，在任务首次提交时，需要初始化workQueues及其他相关属性，这个初始化操作就是externalSubmit来完成的；而后再向池中提交的任务都是通过简化版的externalSubmit-externalPush来完成。</p><p>externalPush的执行流程很简单: 首先找到一个随机偶数槽位的 workQueue，然后把任务放入这个 workQueue 的任务数组中，并更新top位。如果队列的剩余任务数小于1，则尝试创建或激活一个工作线程来运行任务(防止在externalSubmit初始化时发生异常导致工作线程创建失败)。</p><h4 id="externalsubmit-forkjointask-task" tabindex="-1">externalSubmit(ForkJoinTask&lt;?&gt; task) <a class="header-anchor" href="#externalsubmit-forkjointask-task" aria-label="Permalink to &quot;externalSubmit(ForkJoinTask&lt;?&gt; task)&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//任务提交</span></span>
<span class="line"><span>private void externalSubmit(ForkJoinTask&lt;?&gt; task) {</span></span>
<span class="line"><span>    //初始化调用线程的探针值，用于计算WorkQueue索引</span></span>
<span class="line"><span>    int r;                                    // initialize caller&#39;s probe</span></span>
<span class="line"><span>    if ((r = ThreadLocalRandom.getProbe()) == 0) {</span></span>
<span class="line"><span>        ThreadLocalRandom.localInit();</span></span>
<span class="line"><span>        r = ThreadLocalRandom.getProbe();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (; ; ) {</span></span>
<span class="line"><span>        WorkQueue[] ws;</span></span>
<span class="line"><span>        WorkQueue q;</span></span>
<span class="line"><span>        int rs, m, k;</span></span>
<span class="line"><span>        boolean move = false;</span></span>
<span class="line"><span>        if ((rs = runState) &lt; 0) {// 池已关闭</span></span>
<span class="line"><span>            tryTerminate(false, false);     // help terminate</span></span>
<span class="line"><span>            throw new RejectedExecutionException();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        //初始化workQueues</span></span>
<span class="line"><span>        else if ((rs &amp; STARTED) == 0 ||     // initialize</span></span>
<span class="line"><span>                ((ws = workQueues) == null || (m = ws.length - 1) &lt; 0)) {</span></span>
<span class="line"><span>            int ns = 0;</span></span>
<span class="line"><span>            rs = lockRunState();//锁定runState</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                //初始化</span></span>
<span class="line"><span>                if ((rs &amp; STARTED) == 0) {</span></span>
<span class="line"><span>                    //初始化stealCounter</span></span>
<span class="line"><span>                    U.compareAndSwapObject(this, STEALCOUNTER, null,</span></span>
<span class="line"><span>                            new AtomicLong());</span></span>
<span class="line"><span>                    //创建workQueues，容量为2的幂次方</span></span>
<span class="line"><span>                    // create workQueues array with size a power of two</span></span>
<span class="line"><span>                    int p = config &amp; SMASK; // ensure at least 2 slots</span></span>
<span class="line"><span>                    int n = (p &gt; 1) ? p - 1 : 1;</span></span>
<span class="line"><span>                    n |= n &gt;&gt;&gt; 1;</span></span>
<span class="line"><span>                    n |= n &gt;&gt;&gt; 2;</span></span>
<span class="line"><span>                    n |= n &gt;&gt;&gt; 4;</span></span>
<span class="line"><span>                    n |= n &gt;&gt;&gt; 8;</span></span>
<span class="line"><span>                    n |= n &gt;&gt;&gt; 16;</span></span>
<span class="line"><span>                    n = (n + 1) &lt;&lt; 1;</span></span>
<span class="line"><span>                    workQueues = new WorkQueue[n];</span></span>
<span class="line"><span>                    ns = STARTED;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            } finally {</span></span>
<span class="line"><span>                unlockRunState(rs, (rs &amp; ~RSLOCK) | ns);//解锁并更新runState</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } else if ((q = ws[k = r &amp; m &amp; SQMASK]) != null) {//获取随机偶数槽位的workQueue</span></span>
<span class="line"><span>            if (q.qlock == 0 &amp;&amp; U.compareAndSwapInt(q, QLOCK, 0, 1)) {//锁定 workQueue</span></span>
<span class="line"><span>                ForkJoinTask&lt;?&gt;[] a = q.array;//当前workQueue的全部任务</span></span>
<span class="line"><span>                int s = q.top;</span></span>
<span class="line"><span>                boolean submitted = false; // initial submission or resizing</span></span>
<span class="line"><span>                try {                      // locked version of push</span></span>
<span class="line"><span>                    if ((a != null &amp;&amp; a.length &gt; s + 1 - q.base) ||</span></span>
<span class="line"><span>                            (a = q.growArray()) != null) {//扩容</span></span>
<span class="line"><span>                        int j = (((a.length - 1) &amp; s) &lt;&lt; ASHIFT) + ABASE;</span></span>
<span class="line"><span>                        U.putOrderedObject(a, j, task);//放入给定任务</span></span>
<span class="line"><span>                        U.putOrderedInt(q, QTOP, s + 1);//修改push slot</span></span>
<span class="line"><span>                        submitted = true;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                } finally {</span></span>
<span class="line"><span>                    U.compareAndSwapInt(q, QLOCK, 1, 0);//解除锁定</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                if (submitted) {//任务提交成功，创建或激活工作线程</span></span>
<span class="line"><span>                    signalWork(ws, q);//创建或激活一个工作线程来运行任务</span></span>
<span class="line"><span>                    return;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            move = true;                   // move on failure 操作失败，重新获取探针值</span></span>
<span class="line"><span>        } else if (((rs = runState) &amp; RSLOCK) == 0) { // create new queue</span></span>
<span class="line"><span>            q = new WorkQueue(this, null);</span></span>
<span class="line"><span>            q.hint = r;</span></span>
<span class="line"><span>            q.config = k | SHARED_QUEUE;</span></span>
<span class="line"><span>            q.scanState = INACTIVE;</span></span>
<span class="line"><span>            rs = lockRunState();           // publish index</span></span>
<span class="line"><span>            if (rs &gt; 0 &amp;&amp; (ws = workQueues) != null &amp;&amp;</span></span>
<span class="line"><span>                    k &lt; ws.length &amp;&amp; ws[k] == null)</span></span>
<span class="line"><span>                ws[k] = q;                 // 更新索引k位值的workQueue</span></span>
<span class="line"><span>            //else terminated</span></span>
<span class="line"><span>            unlockRunState(rs, rs &amp; ~RSLOCK);</span></span>
<span class="line"><span>        } else</span></span>
<span class="line"><span>            move = true;                   // move if busy</span></span>
<span class="line"><span>        if (move)</span></span>
<span class="line"><span>            r = ThreadLocalRandom.advanceProbe(r);//重新获取线程探针值</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: externalSubmit是externalPush的完整版本，主要用于第一次提交任务时初始化workQueues及相关属性，并且提交给定任务到队列中。具体执行步骤如下:</p><ul><li>如果池为终止状态(runState&lt;0)，调用tryTerminate来终止线程池，并抛出任务拒绝异常；</li><li>如果尚未初始化，就为 FJP 执行初始化操作: 初始化stealCounter、创建workerQueues，然后继续自旋；</li><li>初始化完成后，执行在externalPush中相同的操作: 获取 workQueue，放入指定任务。任务提交成功后调用signalWork方法创建或激活线程；</li><li>如果在步骤3中获取到的 workQueue 为null，会在这一步中创建一个 workQueue，创建成功继续自旋执行第三步操作；</li><li>如果非上述情况，或者有线程争用资源导致获取锁失败，就重新获取线程探针值继续自旋。</li></ul><h4 id="signalwork-workqueue-ws-workqueue-q" tabindex="-1">signalWork(WorkQueue[] ws, WorkQueue q) <a class="header-anchor" href="#signalwork-workqueue-ws-workqueue-q" aria-label="Permalink to &quot;signalWork(WorkQueue\\[\\] ws, WorkQueue q)&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final void signalWork(WorkQueue[] ws, WorkQueue q) {</span></span>
<span class="line"><span>    long c;</span></span>
<span class="line"><span>    int sp, i;</span></span>
<span class="line"><span>    WorkQueue v;</span></span>
<span class="line"><span>    Thread p;</span></span>
<span class="line"><span>    while ((c = ctl) &lt; 0L) {                       // too few active</span></span>
<span class="line"><span>        if ((sp = (int) c) == 0) {                  // no idle workers</span></span>
<span class="line"><span>            if ((c &amp; ADD_WORKER) != 0L)            // too few workers</span></span>
<span class="line"><span>                tryAddWorker(c);//工作线程太少，添加新的工作线程</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (ws == null)                            // unstarted/terminated</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        if (ws.length &lt;= (i = sp &amp; SMASK))         // terminated</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        if ((v = ws[i]) == null)                   // terminating</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        //计算ctl，加上版本戳SS_SEQ避免ABA问题</span></span>
<span class="line"><span>        int vs = (sp + SS_SEQ) &amp; ~INACTIVE;        // next scanState</span></span>
<span class="line"><span>        int d = sp - v.scanState;                  // screen CAS</span></span>
<span class="line"><span>        //计算活跃线程数(高32位)并更新为下一个栈顶的scanState(低32位)</span></span>
<span class="line"><span>        long nc = (UC_MASK &amp; (c + AC_UNIT)) | (SP_MASK &amp; v.stackPred);</span></span>
<span class="line"><span>        if (d == 0 &amp;&amp; U.compareAndSwapLong(this, CTL, c, nc)) {</span></span>
<span class="line"><span>            v.scanState = vs;                      // activate v</span></span>
<span class="line"><span>            if ((p = v.parker) != null)</span></span>
<span class="line"><span>                U.unpark(p);//唤醒阻塞线程</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (q != null &amp;&amp; q.base == q.top)          // no more work</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 新建或唤醒一个工作线程，在externalPush、externalSubmit、workQueue.push、scan中调用。如果还有空闲线程，则尝试唤醒索引到的 WorkQueue 的parker线程；如果工作线程过少((ctl &amp; ADD_WORKER) != 0L)，则调用tryAddWorker添加一个新的工作线程。</p><h4 id="tryaddworker-long-c" tabindex="-1">tryAddWorker(long c) <a class="header-anchor" href="#tryaddworker-long-c" aria-label="Permalink to &quot;tryAddWorker(long c)&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void tryAddWorker(long c) {</span></span>
<span class="line"><span>    boolean add = false;</span></span>
<span class="line"><span>    do {</span></span>
<span class="line"><span>        long nc = ((AC_MASK &amp; (c + AC_UNIT)) |</span></span>
<span class="line"><span>                   (TC_MASK &amp; (c + TC_UNIT)));</span></span>
<span class="line"><span>        if (ctl == c) {</span></span>
<span class="line"><span>            int rs, stop;                 // check if terminating</span></span>
<span class="line"><span>            if ((stop = (rs = lockRunState()) &amp; STOP) == 0)</span></span>
<span class="line"><span>                add = U.compareAndSwapLong(this, CTL, c, nc);</span></span>
<span class="line"><span>            unlockRunState(rs, rs &amp; ~RSLOCK);//释放锁</span></span>
<span class="line"><span>            if (stop != 0)</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            if (add) {</span></span>
<span class="line"><span>                createWorker();//创建工作线程</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } while (((c = ctl) &amp; ADD_WORKER) != 0L &amp;&amp; (int)c == 0);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 尝试添加一个新的工作线程，首先更新ctl中的工作线程数，然后调用createWorker()创建工作线程。</p><h4 id="createworker" tabindex="-1">createWorker() <a class="header-anchor" href="#createworker" aria-label="Permalink to &quot;createWorker()&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private boolean createWorker() {</span></span>
<span class="line"><span>    ForkJoinWorkerThreadFactory fac = factory;</span></span>
<span class="line"><span>    Throwable ex = null;</span></span>
<span class="line"><span>    ForkJoinWorkerThread wt = null;</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        if (fac != null &amp;&amp; (wt = fac.newThread(this)) != null) {</span></span>
<span class="line"><span>            wt.start();</span></span>
<span class="line"><span>            return true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } catch (Throwable rex) {</span></span>
<span class="line"><span>        ex = rex;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    deregisterWorker(wt, ex);//线程创建失败处理</span></span>
<span class="line"><span>    return false;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: createWorker首先通过线程工厂创一个新的ForkJoinWorkerThread，然后启动这个工作线程(wt.start())。如果期间发生异常，调用deregisterWorker处理线程创建失败的逻辑(deregisterWorker在后面再详细说明)。</p><p>ForkJoinWorkerThread 的构造函数如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected ForkJoinWorkerThread(ForkJoinPool pool) {</span></span>
<span class="line"><span>    // Use a placeholder until a useful name can be set in registerWorker</span></span>
<span class="line"><span>    super(&quot;aForkJoinWorkerThread&quot;);</span></span>
<span class="line"><span>    this.pool = pool;</span></span>
<span class="line"><span>    this.workQueue = pool.registerWorker(this);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>可以看到 ForkJoinWorkerThread 在构造时首先调用父类 Thread 的方法，然后为工作线程注册pool和workQueue，而workQueue的注册任务由ForkJoinPool.registerWorker来完成。</p><h4 id="registerworker" tabindex="-1">registerWorker() <a class="header-anchor" href="#registerworker" aria-label="Permalink to &quot;registerWorker()&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final WorkQueue registerWorker(ForkJoinWorkerThread wt) {</span></span>
<span class="line"><span>    UncaughtExceptionHandler handler;</span></span>
<span class="line"><span>    //设置为守护线程</span></span>
<span class="line"><span>    wt.setDaemon(true);                           // configure thread</span></span>
<span class="line"><span>    if ((handler = ueh) != null)</span></span>
<span class="line"><span>        wt.setUncaughtExceptionHandler(handler);</span></span>
<span class="line"><span>    WorkQueue w = new WorkQueue(this, wt);//构造新的WorkQueue</span></span>
<span class="line"><span>    int i = 0;                                    // assign a pool index</span></span>
<span class="line"><span>    int mode = config &amp; MODE_MASK;</span></span>
<span class="line"><span>    int rs = lockRunState();</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        WorkQueue[] ws;</span></span>
<span class="line"><span>        int n;                    // skip if no array</span></span>
<span class="line"><span>        if ((ws = workQueues) != null &amp;&amp; (n = ws.length) &gt; 0) {</span></span>
<span class="line"><span>            //生成新建WorkQueue的索引</span></span>
<span class="line"><span>            int s = indexSeed += SEED_INCREMENT;  // unlikely to collide</span></span>
<span class="line"><span>            int m = n - 1;</span></span>
<span class="line"><span>            i = ((s &lt;&lt; 1) | 1) &amp; m;               // Worker任务放在奇数索引位 odd-numbered indices</span></span>
<span class="line"><span>            if (ws[i] != null) {                  // collision 已存在，重新计算索引位</span></span>
<span class="line"><span>                int probes = 0;                   // step by approx half n</span></span>
<span class="line"><span>                int step = (n &lt;= 4) ? 2 : ((n &gt;&gt;&gt; 1) &amp; EVENMASK) + 2;</span></span>
<span class="line"><span>                //查找可用的索引位</span></span>
<span class="line"><span>                while (ws[i = (i + step) &amp; m] != null) {</span></span>
<span class="line"><span>                    if (++probes &gt;= n) {//所有索引位都被占用，对workQueues进行扩容</span></span>
<span class="line"><span>                        workQueues = ws = Arrays.copyOf(ws, n &lt;&lt;= 1);//workQueues 扩容</span></span>
<span class="line"><span>                        m = n - 1;</span></span>
<span class="line"><span>                        probes = 0;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            w.hint = s;                           // use as random seed</span></span>
<span class="line"><span>            w.config = i | mode;</span></span>
<span class="line"><span>            w.scanState = i;                      // publication fence</span></span>
<span class="line"><span>            ws[i] = w;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        unlockRunState(rs, rs &amp; ~RSLOCK);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    wt.setName(workerNamePrefix.concat(Integer.toString(i &gt;&gt;&gt; 1)));</span></span>
<span class="line"><span>    return w;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: registerWorker是 ForkJoinWorkerThread 构造器的回调函数，用于创建和记录工作线程的 WorkQueue。比较简单，就不多赘述了。注意在此为工作线程创建的 WorkQueue 是放在奇数索引的(代码行: i = ((s &lt;&lt; 1) | 1) &amp; m;)</p><h4 id="小结" tabindex="-1">小结 <a class="header-anchor" href="#小结" aria-label="Permalink to &quot;小结&quot;">​</a></h4><p>OK，外部任务的提交流程就先讲到这里。在createWorker()中启动工作线程后(wt.start())，当为线程分配到CPU执行时间片之后会运行 ForkJoinWorkerThread 的run方法开启线程来执行任务。工作线程执行任务的流程我们在讲完内部任务提交之后会统一讲解。</p><h3 id="执行流程-子任务-worker-task-提交" tabindex="-1">执行流程: 子任务(Worker task)提交 <a class="header-anchor" href="#执行流程-子任务-worker-task-提交" aria-label="Permalink to &quot;执行流程: 子任务(Worker task)提交&quot;">​</a></h3><p>子任务的提交相对比较简单，由任务的fork()方法完成。通过上面的流程图可以看到任务被分割(fork)之后调用了ForkJoinPool.WorkQueue.push()方法直接把任务放到队列中等待被执行。</p><h4 id="forkjointask-fork" tabindex="-1">ForkJoinTask.fork() <a class="header-anchor" href="#forkjointask-fork" aria-label="Permalink to &quot;ForkJoinTask.fork()&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final ForkJoinTask&lt;V&gt; fork() {</span></span>
<span class="line"><span>    Thread t;</span></span>
<span class="line"><span>    if ((t = Thread.currentThread()) instanceof ForkJoinWorkerThread)</span></span>
<span class="line"><span>        ((ForkJoinWorkerThread)t).workQueue.push(this);</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>        ForkJoinPool.common.externalPush(this);</span></span>
<span class="line"><span>    return this;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 如果当前线程是 Worker 线程，说明当前任务是fork分割的子任务，通过ForkJoinPool.workQueue.push()方法直接把任务放到自己的等待队列中；否则调用ForkJoinPool.externalPush()提交到一个随机的等待队列中(外部任务)。</p><h4 id="forkjoinpool-workqueue-push" tabindex="-1">ForkJoinPool.WorkQueue.push() <a class="header-anchor" href="#forkjoinpool-workqueue-push" aria-label="Permalink to &quot;ForkJoinPool.WorkQueue.push()&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final void push(ForkJoinTask&lt;?&gt; task) {</span></span>
<span class="line"><span>    ForkJoinTask&lt;?&gt;[] a;</span></span>
<span class="line"><span>    ForkJoinPool p;</span></span>
<span class="line"><span>    int b = base, s = top, n;</span></span>
<span class="line"><span>    if ((a = array) != null) {    // ignore if queue removed</span></span>
<span class="line"><span>        int m = a.length - 1;     // fenced write for task visibility</span></span>
<span class="line"><span>        U.putOrderedObject(a, ((m &amp; s) &lt;&lt; ASHIFT) + ABASE, task);</span></span>
<span class="line"><span>        U.putOrderedInt(this, QTOP, s + 1);</span></span>
<span class="line"><span>        if ((n = s - b) &lt;= 1) {//首次提交，创建或唤醒一个工作线程</span></span>
<span class="line"><span>            if ((p = pool) != null)</span></span>
<span class="line"><span>                p.signalWork(p.workQueues, this);</span></span>
<span class="line"><span>        } else if (n &gt;= m)</span></span>
<span class="line"><span>            growArray();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 首先把任务放入等待队列并更新top位；如果当前 WorkQueue 为新建的等待队列(top-base&lt;=1)，则调用signalWork方法为当前 WorkQueue 新建或唤醒一个工作线程；如果 WorkQueue 中的任务数组容量过小，则调用growArray()方法对其进行两倍扩容，growArray()方法源码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final ForkJoinTask&lt;?&gt;[] growArray() {</span></span>
<span class="line"><span>    ForkJoinTask&lt;?&gt;[] oldA = array;//获取内部任务列表</span></span>
<span class="line"><span>    int size = oldA != null ? oldA.length &lt;&lt; 1 : INITIAL_QUEUE_CAPACITY;</span></span>
<span class="line"><span>    if (size &gt; MAXIMUM_QUEUE_CAPACITY)</span></span>
<span class="line"><span>        throw new RejectedExecutionException(&quot;Queue capacity exceeded&quot;);</span></span>
<span class="line"><span>    int oldMask, t, b;</span></span>
<span class="line"><span>    //新建一个两倍容量的任务数组</span></span>
<span class="line"><span>    ForkJoinTask&lt;?&gt;[] a = array = new ForkJoinTask&lt;?&gt;[size];</span></span>
<span class="line"><span>    if (oldA != null &amp;&amp; (oldMask = oldA.length - 1) &gt;= 0 &amp;&amp;</span></span>
<span class="line"><span>            (t = top) - (b = base) &gt; 0) {</span></span>
<span class="line"><span>        int mask = size - 1;</span></span>
<span class="line"><span>        //从老数组中拿出数据，放到新的数组中</span></span>
<span class="line"><span>        do { // emulate poll from old array, push to new array</span></span>
<span class="line"><span>            ForkJoinTask&lt;?&gt; x;</span></span>
<span class="line"><span>            int oldj = ((b &amp; oldMask) &lt;&lt; ASHIFT) + ABASE;</span></span>
<span class="line"><span>            int j = ((b &amp; mask) &lt;&lt; ASHIFT) + ABASE;</span></span>
<span class="line"><span>            x = (ForkJoinTask&lt;?&gt;) U.getObjectVolatile(oldA, oldj);</span></span>
<span class="line"><span>            if (x != null &amp;&amp;</span></span>
<span class="line"><span>                    U.compareAndSwapObject(oldA, oldj, x, null))</span></span>
<span class="line"><span>                U.putObjectVolatile(a, j, x);</span></span>
<span class="line"><span>        } while (++b != t);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return a;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="小结-1" tabindex="-1">小结 <a class="header-anchor" href="#小结-1" aria-label="Permalink to &quot;小结&quot;">​</a></h4><p>到此，两种任务的提交流程都已经解析完毕，下一节我们来一起看看任务提交之后是如何被运行的。</p><h3 id="执行流程-任务执行" tabindex="-1">执行流程: 任务执行 <a class="header-anchor" href="#执行流程-任务执行" aria-label="Permalink to &quot;执行流程: 任务执行&quot;">​</a></h3><p>回到我们开始时的流程图，在ForkJoinPool .createWorker()方法中创建工作线程后，会启动工作线程，系统为工作线程分配到CPU执行时间片之后会执行 ForkJoinWorkerThread 的run()方法正式开始执行任务。</p><h4 id="forkjoinworkerthread-run" tabindex="-1">ForkJoinWorkerThread.run() <a class="header-anchor" href="#forkjoinworkerthread-run" aria-label="Permalink to &quot;ForkJoinWorkerThread.run()&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void run() {</span></span>
<span class="line"><span>    if (workQueue.array == null) { // only run once</span></span>
<span class="line"><span>        Throwable exception = null;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            onStart();//钩子方法，可自定义扩展</span></span>
<span class="line"><span>            pool.runWorker(workQueue);</span></span>
<span class="line"><span>        } catch (Throwable ex) {</span></span>
<span class="line"><span>            exception = ex;</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                onTermination(exception);//钩子方法，可自定义扩展</span></span>
<span class="line"><span>            } catch (Throwable ex) {</span></span>
<span class="line"><span>                if (exception == null)</span></span>
<span class="line"><span>                    exception = ex;</span></span>
<span class="line"><span>            } finally {</span></span>
<span class="line"><span>                pool.deregisterWorker(this, exception);//处理异常</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 方法很简单，在工作线程运行前后会调用自定义钩子函数(onStart和onTermination)，任务的运行则是调用了ForkJoinPool.runWorker()。如果全部任务执行完毕或者期间遭遇异常，则通过ForkJoinPool.deregisterWorker关闭工作线程并处理异常信息(deregisterWorker方法我们后面会详细讲解)。</p><h4 id="forkjoinpool-runworker-workqueue-w" tabindex="-1">ForkJoinPool.runWorker(WorkQueue w) <a class="header-anchor" href="#forkjoinpool-runworker-workqueue-w" aria-label="Permalink to &quot;ForkJoinPool.runWorker(WorkQueue w)&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final void runWorker(WorkQueue w) {</span></span>
<span class="line"><span>    w.growArray();                   // allocate queue</span></span>
<span class="line"><span>    int seed = w.hint;               // initially holds randomization hint</span></span>
<span class="line"><span>    int r = (seed == 0) ? 1 : seed;  // avoid 0 for xorShift</span></span>
<span class="line"><span>    for (ForkJoinTask&lt;?&gt; t; ; ) {</span></span>
<span class="line"><span>        if ((t = scan(w, r)) != null)//扫描任务执行</span></span>
<span class="line"><span>            w.runTask(t);</span></span>
<span class="line"><span>        else if (!awaitWork(w, r))</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        r ^= r &lt;&lt; 13;</span></span>
<span class="line"><span>        r ^= r &gt;&gt;&gt; 17;</span></span>
<span class="line"><span>        r ^= r &lt;&lt; 5; // xorshift</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: runWorker是 ForkJoinWorkerThread 的主运行方法，用来依次执行当前工作线程中的任务。函数流程很简单: 调用scan方法依次获取任务，然后调用WorkQueue .runTask运行任务；如果未扫描到任务，则调用awaitWork等待，直到工作线程/线程池终止或等待超时。</p><h4 id="forkjoinpool-scan-workqueue-w-int-r" tabindex="-1">ForkJoinPool.scan(WorkQueue w, int r) <a class="header-anchor" href="#forkjoinpool-scan-workqueue-w-int-r" aria-label="Permalink to &quot;ForkJoinPool.scan(WorkQueue w, int r)&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private ForkJoinTask&lt;?&gt; scan(WorkQueue w, int r) {</span></span>
<span class="line"><span>    WorkQueue[] ws;</span></span>
<span class="line"><span>    int m;</span></span>
<span class="line"><span>    if ((ws = workQueues) != null &amp;&amp; (m = ws.length - 1) &gt; 0 &amp;&amp; w != null) {</span></span>
<span class="line"><span>        int ss = w.scanState;                     // initially non-negative</span></span>
<span class="line"><span>        //初始扫描起点，自旋扫描</span></span>
<span class="line"><span>        for (int origin = r &amp; m, k = origin, oldSum = 0, checkSum = 0; ; ) {</span></span>
<span class="line"><span>            WorkQueue q;</span></span>
<span class="line"><span>            ForkJoinTask&lt;?&gt;[] a;</span></span>
<span class="line"><span>            ForkJoinTask&lt;?&gt; t;</span></span>
<span class="line"><span>            int b, n;</span></span>
<span class="line"><span>            long c;</span></span>
<span class="line"><span>            if ((q = ws[k]) != null) {//获取workQueue</span></span>
<span class="line"><span>                if ((n = (b = q.base) - q.top) &lt; 0 &amp;&amp;</span></span>
<span class="line"><span>                        (a = q.array) != null) {      // non-empty</span></span>
<span class="line"><span>                    //计算偏移量</span></span>
<span class="line"><span>                    long i = (((a.length - 1) &amp; b) &lt;&lt; ASHIFT) + ABASE;</span></span>
<span class="line"><span>                    if ((t = ((ForkJoinTask&lt;?&gt;)</span></span>
<span class="line"><span>                            U.getObjectVolatile(a, i))) != null &amp;&amp; //取base位置任务</span></span>
<span class="line"><span>                            q.base == b) {//stable</span></span>
<span class="line"><span>                        if (ss &gt;= 0) {  //scanning</span></span>
<span class="line"><span>                            if (U.compareAndSwapObject(a, i, t, null)) {//</span></span>
<span class="line"><span>                                q.base = b + 1;//更新base位</span></span>
<span class="line"><span>                                if (n &lt; -1)       // signal others</span></span>
<span class="line"><span>                                    signalWork(ws, q);//创建或唤醒工作线程来运行任务</span></span>
<span class="line"><span>                                return t;</span></span>
<span class="line"><span>                            }</span></span>
<span class="line"><span>                        } else if (oldSum == 0 &amp;&amp;   // try to activate 尝试激活工作线程</span></span>
<span class="line"><span>                                w.scanState &lt; 0)</span></span>
<span class="line"><span>                            tryRelease(c = ctl, ws[m &amp; (int) c], AC_UNIT);//唤醒栈顶工作线程</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    //base位置任务为空或base位置偏移，随机移位重新扫描</span></span>
<span class="line"><span>                    if (ss &lt; 0)                   // refresh</span></span>
<span class="line"><span>                        ss = w.scanState;</span></span>
<span class="line"><span>                    r ^= r &lt;&lt; 1;</span></span>
<span class="line"><span>                    r ^= r &gt;&gt;&gt; 3;</span></span>
<span class="line"><span>                    r ^= r &lt;&lt; 10;</span></span>
<span class="line"><span>                    origin = k = r &amp; m;           // move and rescan</span></span>
<span class="line"><span>                    oldSum = checkSum = 0;</span></span>
<span class="line"><span>                    continue;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                checkSum += b;//队列任务为空，记录base位</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            //更新索引k 继续向后查找</span></span>
<span class="line"><span>            if ((k = (k + 1) &amp; m) == origin) {    // continue until stable</span></span>
<span class="line"><span>                //运行到这里说明已经扫描了全部的 workQueues，但并未扫描到任务</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                if ((ss &gt;= 0 || (ss == (ss = w.scanState))) &amp;&amp;</span></span>
<span class="line"><span>                        oldSum == (oldSum = checkSum)) {</span></span>
<span class="line"><span>                    if (ss &lt; 0 || w.qlock &lt; 0)    // already inactive</span></span>
<span class="line"><span>                        break;// 已经被灭活或终止,跳出循环</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                    //对当前WorkQueue进行灭活操作</span></span>
<span class="line"><span>                    int ns = ss | INACTIVE;       // try to inactivate</span></span>
<span class="line"><span>                    long nc = ((SP_MASK &amp; ns) |</span></span>
<span class="line"><span>                            (UC_MASK &amp; ((c = ctl) - AC_UNIT)));//计算ctl为INACTIVE状态并减少活跃线程数</span></span>
<span class="line"><span>                    w.stackPred = (int) c;         // hold prev stack top</span></span>
<span class="line"><span>                    U.putInt(w, QSCANSTATE, ns);//修改scanState为inactive状态</span></span>
<span class="line"><span>                    if (U.compareAndSwapLong(this, CTL, c, nc))//更新scanState为灭活状态</span></span>
<span class="line"><span>                        ss = ns;</span></span>
<span class="line"><span>                    else</span></span>
<span class="line"><span>                        w.scanState = ss;         // back out</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                checkSum = 0;//重置checkSum，继续循环</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 扫描并尝试偷取一个任务。使用w.hint进行随机索引 WorkQueue，也就是说并不一定会执行当前 WorkQueue 中的任务，而是偷取别的Worker的任务来执行。</p><p>函数的大概执行流程如下:</p><ul><li><p>取随机位置的一个 WorkQueue；</p></li><li><p>获取base位的 ForkJoinTask，成功取到后更新base位并返回任务；如果取到的 WorkQueue 中任务数大于1，则调用signalWork创建或唤醒其他工作线程；</p></li><li><p>如果当前工作线程处于不活跃状态(INACTIVE)，则调用tryRelease尝试唤醒栈顶工作线程来执行。</p><p>tryRelease源码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private boolean tryRelease(long c, WorkQueue v, long inc) {</span></span>
<span class="line"><span>    int sp = (int) c, vs = (sp + SS_SEQ) &amp; ~INACTIVE;</span></span>
<span class="line"><span>    Thread p;</span></span>
<span class="line"><span>    //ctl低32位等于scanState，说明可以唤醒parker线程</span></span>
<span class="line"><span>    if (v != null &amp;&amp; v.scanState == sp) {          // v is at top of stack</span></span>
<span class="line"><span>        //计算活跃线程数(高32位)并更新为下一个栈顶的scanState(低32位)</span></span>
<span class="line"><span>        long nc = (UC_MASK &amp; (c + inc)) | (SP_MASK &amp; v.stackPred);</span></span>
<span class="line"><span>        if (U.compareAndSwapLong(this, CTL, c, nc)) {</span></span>
<span class="line"><span>            v.scanState = vs;</span></span>
<span class="line"><span>            if ((p = v.parker) != null)</span></span>
<span class="line"><span>                U.unpark(p);//唤醒线程</span></span>
<span class="line"><span>            return true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return false;</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>如果base位任务为空或发生偏移，则对索引位进行随机移位，然后重新扫描；</p></li><li><p>如果扫描整个workQueues之后没有获取到任务，则设置当前工作线程为INACTIVE状态；然后重置checkSum，再次扫描一圈之后如果还没有任务则跳出循环返回null。</p></li></ul><h4 id="forkjoinpool-awaitwork-workqueue-w-int-r" tabindex="-1">ForkJoinPool.awaitWork(WorkQueue w, int r) <a class="header-anchor" href="#forkjoinpool-awaitwork-workqueue-w-int-r" aria-label="Permalink to &quot;ForkJoinPool.awaitWork(WorkQueue w, int r)&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private boolean awaitWork(WorkQueue w, int r) {</span></span>
<span class="line"><span>    if (w == null || w.qlock &lt; 0)                 // w is terminating</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>    for (int pred = w.stackPred, spins = SPINS, ss; ; ) {</span></span>
<span class="line"><span>        if ((ss = w.scanState) &gt;= 0)//正在扫描，跳出循环</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        else if (spins &gt; 0) {</span></span>
<span class="line"><span>            r ^= r &lt;&lt; 6;</span></span>
<span class="line"><span>            r ^= r &gt;&gt;&gt; 21;</span></span>
<span class="line"><span>            r ^= r &lt;&lt; 7;</span></span>
<span class="line"><span>            if (r &gt;= 0 &amp;&amp; --spins == 0) {         // randomize spins</span></span>
<span class="line"><span>                WorkQueue v;</span></span>
<span class="line"><span>                WorkQueue[] ws;</span></span>
<span class="line"><span>                int s, j;</span></span>
<span class="line"><span>                AtomicLong sc;</span></span>
<span class="line"><span>                if (pred != 0 &amp;&amp; (ws = workQueues) != null &amp;&amp;</span></span>
<span class="line"><span>                        (j = pred &amp; SMASK) &lt; ws.length &amp;&amp;</span></span>
<span class="line"><span>                        (v = ws[j]) != null &amp;&amp;        // see if pred parking</span></span>
<span class="line"><span>                        (v.parker == null || v.scanState &gt;= 0))</span></span>
<span class="line"><span>                    spins = SPINS;                // continue spinning</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } else if (w.qlock &lt; 0)                     // 当前workQueue已经终止，返回false recheck after spins</span></span>
<span class="line"><span>            return false;</span></span>
<span class="line"><span>        else if (!Thread.interrupted()) {//判断线程是否被中断，并清除中断状态</span></span>
<span class="line"><span>            long c, prevctl, parkTime, deadline;</span></span>
<span class="line"><span>            int ac = (int) ((c = ctl) &gt;&gt; AC_SHIFT) + (config &amp; SMASK);//活跃线程数</span></span>
<span class="line"><span>            if ((ac &lt;= 0 &amp;&amp; tryTerminate(false, false)) || //无active线程，尝试终止</span></span>
<span class="line"><span>                    (runState &amp; STOP) != 0)           // pool terminating</span></span>
<span class="line"><span>                return false;</span></span>
<span class="line"><span>            if (ac &lt;= 0 &amp;&amp; ss == (int) c) {        // is last waiter</span></span>
<span class="line"><span>                //计算活跃线程数(高32位)并更新为下一个栈顶的scanState(低32位)</span></span>
<span class="line"><span>                prevctl = (UC_MASK &amp; (c + AC_UNIT)) | (SP_MASK &amp; pred);</span></span>
<span class="line"><span>                int t = (short) (c &gt;&gt;&gt; TC_SHIFT);  // shrink excess spares</span></span>
<span class="line"><span>                if (t &gt; 2 &amp;&amp; U.compareAndSwapLong(this, CTL, c, prevctl))//总线程过量</span></span>
<span class="line"><span>                    return false;                 // else use timed wait</span></span>
<span class="line"><span>                //计算空闲超时时间</span></span>
<span class="line"><span>                parkTime = IDLE_TIMEOUT * ((t &gt;= 0) ? 1 : 1 - t);</span></span>
<span class="line"><span>                deadline = System.nanoTime() + parkTime - TIMEOUT_SLOP;</span></span>
<span class="line"><span>            } else</span></span>
<span class="line"><span>                prevctl = parkTime = deadline = 0L;</span></span>
<span class="line"><span>            Thread wt = Thread.currentThread();</span></span>
<span class="line"><span>            U.putObject(wt, PARKBLOCKER, this);   // emulate LockSupport</span></span>
<span class="line"><span>            w.parker = wt;//设置parker，准备阻塞</span></span>
<span class="line"><span>            if (w.scanState &lt; 0 &amp;&amp; ctl == c)      // recheck before park</span></span>
<span class="line"><span>                U.park(false, parkTime);//阻塞指定的时间</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            U.putOrderedObject(w, QPARKER, null);</span></span>
<span class="line"><span>            U.putObject(wt, PARKBLOCKER, null);</span></span>
<span class="line"><span>            if (w.scanState &gt;= 0)//正在扫描，说明等到任务，跳出循环</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            if (parkTime != 0L &amp;&amp; ctl == c &amp;&amp;</span></span>
<span class="line"><span>                    deadline - System.nanoTime() &lt;= 0L &amp;&amp;</span></span>
<span class="line"><span>                    U.compareAndSwapLong(this, CTL, c, prevctl))//未等到任务，更新ctl，返回false</span></span>
<span class="line"><span>                return false;                     // shrink pool</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return true;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 回到runWorker方法，如果scan方法未扫描到任务，会调用awaitWork等待获取任务。函数的具体执行流程大家看源码，这里简单说一下:</p><ul><li>在等待获取任务期间，如果工作线程或线程池已经终止则直接返回false。如果当前无 active 线程，尝试终止线程池并返回false，如果终止失败并且当前是最后一个等待的 Worker，就阻塞指定的时间(IDLE_TIMEOUT)；等到届期或被唤醒后如果发现自己是scanning(scanState &gt;= 0)状态，说明已经等到任务，跳出等待返回true继续 scan，否则的更新ctl并返回false。</li></ul><h4 id="workqueue-runtask" tabindex="-1">WorkQueue.runTask() <a class="header-anchor" href="#workqueue-runtask" aria-label="Permalink to &quot;WorkQueue.runTask()&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final void runTask(ForkJoinTask&lt;?&gt; task) {</span></span>
<span class="line"><span>    if (task != null) {</span></span>
<span class="line"><span>        scanState &amp;= ~SCANNING; // mark as busy</span></span>
<span class="line"><span>        (currentSteal = task).doExec();//更新currentSteal并执行任务</span></span>
<span class="line"><span>        U.putOrderedObject(this, QCURRENTSTEAL, null); // release for GC</span></span>
<span class="line"><span>        execLocalTasks();//依次执行本地任务</span></span>
<span class="line"><span>        ForkJoinWorkerThread thread = owner;</span></span>
<span class="line"><span>        if (++nsteals &lt; 0)      // collect on overflow</span></span>
<span class="line"><span>            transferStealCount(pool);//增加偷取任务数</span></span>
<span class="line"><span>        scanState |= SCANNING;</span></span>
<span class="line"><span>        if (thread != null)</span></span>
<span class="line"><span>            thread.afterTopLevelExec();//执行钩子函数</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 在scan方法扫描到任务之后，调用WorkQueue.runTask()来执行获取到的任务，大概流程如下:</p><ul><li><p>标记scanState为正在执行状态；</p></li><li><p>更新currentSteal为当前获取到的任务并执行它，任务的执行调用了ForkJoinTask.doExec()方法，源码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//ForkJoinTask.doExec()</span></span>
<span class="line"><span>final int doExec() {</span></span>
<span class="line"><span>    int s; boolean completed;</span></span>
<span class="line"><span>    if ((s = status) &gt;= 0) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            completed = exec();//执行我们定义的任务</span></span>
<span class="line"><span>        } catch (Throwable rex) {</span></span>
<span class="line"><span>            return setExceptionalCompletion(rex);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (completed)</span></span>
<span class="line"><span>            s = setCompletion(NORMAL);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return s;</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>调用execLocalTasks依次执行当前WorkerQueue中的任务，源码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//执行并移除所有本地任务</span></span>
<span class="line"><span>final void execLocalTasks() {</span></span>
<span class="line"><span>    int b = base, m, s;</span></span>
<span class="line"><span>    ForkJoinTask&lt;?&gt;[] a = array;</span></span>
<span class="line"><span>    if (b - (s = top - 1) &lt;= 0 &amp;&amp; a != null &amp;&amp;</span></span>
<span class="line"><span>            (m = a.length - 1) &gt;= 0) {</span></span>
<span class="line"><span>        if ((config &amp; FIFO_QUEUE) == 0) {//FIFO模式</span></span>
<span class="line"><span>            for (ForkJoinTask&lt;?&gt; t; ; ) {</span></span>
<span class="line"><span>                if ((t = (ForkJoinTask&lt;?&gt;) U.getAndSetObject</span></span>
<span class="line"><span>                        (a, ((m &amp; s) &lt;&lt; ASHIFT) + ABASE, null)) == null)//FIFO执行，取top任务</span></span>
<span class="line"><span>                    break;</span></span>
<span class="line"><span>                U.putOrderedInt(this, QTOP, s);</span></span>
<span class="line"><span>                t.doExec();//执行</span></span>
<span class="line"><span>                if (base - (s = top - 1) &gt; 0)</span></span>
<span class="line"><span>                    break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } else</span></span>
<span class="line"><span>            pollAndExecAll();//LIFO模式执行，取base任务</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>更新偷取任务数；</p></li><li><p>还原scanState并执行钩子函数。</p></li></ul><h4 id="forkjoinpool-deregisterworker-forkjoinworkerthread-wt-throwable-ex" tabindex="-1">ForkJoinPool.deregisterWorker(ForkJoinWorkerThread wt, Throwable ex) <a class="header-anchor" href="#forkjoinpool-deregisterworker-forkjoinworkerthread-wt-throwable-ex" aria-label="Permalink to &quot;ForkJoinPool.deregisterWorker(ForkJoinWorkerThread wt, Throwable ex)&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final void deregisterWorker(ForkJoinWorkerThread wt, Throwable ex) {</span></span>
<span class="line"><span>    WorkQueue w = null;</span></span>
<span class="line"><span>    //1.移除workQueue</span></span>
<span class="line"><span>    if (wt != null &amp;&amp; (w = wt.workQueue) != null) {//获取ForkJoinWorkerThread的等待队列</span></span>
<span class="line"><span>        WorkQueue[] ws;                           // remove index from array</span></span>
<span class="line"><span>        int idx = w.config &amp; SMASK;//计算workQueue索引</span></span>
<span class="line"><span>        int rs = lockRunState();//获取runState锁和当前池运行状态</span></span>
<span class="line"><span>        if ((ws = workQueues) != null &amp;&amp; ws.length &gt; idx &amp;&amp; ws[idx] == w)</span></span>
<span class="line"><span>            ws[idx] = null;//移除workQueue</span></span>
<span class="line"><span>        unlockRunState(rs, rs &amp; ~RSLOCK);//解除runState锁</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //2.减少CTL数</span></span>
<span class="line"><span>    long c;                                       // decrement counts</span></span>
<span class="line"><span>    do {} while (!U.compareAndSwapLong</span></span>
<span class="line"><span>                 (this, CTL, c = ctl, ((AC_MASK &amp; (c - AC_UNIT)) |</span></span>
<span class="line"><span>                                       (TC_MASK &amp; (c - TC_UNIT)) |</span></span>
<span class="line"><span>                                       (SP_MASK &amp; c))));</span></span>
<span class="line"><span>    //3.处理被移除workQueue内部相关参数</span></span>
<span class="line"><span>    if (w != null) {</span></span>
<span class="line"><span>        w.qlock = -1;                             // ensure set</span></span>
<span class="line"><span>        w.transferStealCount(this);</span></span>
<span class="line"><span>        w.cancelAll();                            // cancel remaining tasks</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //4.如果线程未终止，替换被移除的workQueue并唤醒内部线程</span></span>
<span class="line"><span>    for (;;) {                                    // possibly replace</span></span>
<span class="line"><span>        WorkQueue[] ws; int m, sp;</span></span>
<span class="line"><span>        //尝试终止线程池</span></span>
<span class="line"><span>        if (tryTerminate(false, false) || w == null || w.array == null ||</span></span>
<span class="line"><span>            (runState &amp; STOP) != 0 || (ws = workQueues) == null ||</span></span>
<span class="line"><span>            (m = ws.length - 1) &lt; 0)              // already terminating</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        //唤醒被替换的线程，依赖于下一步</span></span>
<span class="line"><span>        if ((sp = (int)(c = ctl)) != 0) {         // wake up replacement</span></span>
<span class="line"><span>            if (tryRelease(c, ws[sp &amp; m], AC_UNIT))</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        //创建工作线程替换</span></span>
<span class="line"><span>        else if (ex != null &amp;&amp; (c &amp; ADD_WORKER) != 0L) {</span></span>
<span class="line"><span>            tryAddWorker(c);                      // create replacement</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else                                      // don&#39;t need replacement</span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //5.处理异常</span></span>
<span class="line"><span>    if (ex == null)                               // help clean on way out</span></span>
<span class="line"><span>        ForkJoinTask.helpExpungeStaleExceptions();</span></span>
<span class="line"><span>    else                                          // rethrow</span></span>
<span class="line"><span>        ForkJoinTask.rethrow(ex);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: deregisterWorker方法用于工作线程运行完毕之后终止线程或处理工作线程异常，主要就是清除已关闭的工作线程或回滚创建线程之前的操作，并把传入的异常抛给 ForkJoinTask 来处理。具体步骤见源码注释。</p><h4 id="小结-2" tabindex="-1">小结 <a class="header-anchor" href="#小结-2" aria-label="Permalink to &quot;小结&quot;">​</a></h4><p>本节我们对任务的执行流程进行了说明，后面我们将继续介绍任务的结果获取(join/invoke)。</p><h3 id="获取任务结果-forkjointask-join-forkjointask-invoke" tabindex="-1">获取任务结果 - ForkJoinTask.join() / ForkJoinTask.invoke() <a class="header-anchor" href="#获取任务结果-forkjointask-join-forkjointask-invoke" aria-label="Permalink to &quot;获取任务结果 - ForkJoinTask.join() / ForkJoinTask.invoke()&quot;">​</a></h3><ul><li>join() :</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//合并任务结果</span></span>
<span class="line"><span>public final V join() {</span></span>
<span class="line"><span>    int s;</span></span>
<span class="line"><span>    if ((s = doJoin() &amp; DONE_MASK) != NORMAL)</span></span>
<span class="line"><span>        reportException(s);</span></span>
<span class="line"><span>    return getRawResult();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//join, get, quietlyJoin的主实现方法</span></span>
<span class="line"><span>private int doJoin() {</span></span>
<span class="line"><span>    int s; Thread t; ForkJoinWorkerThread wt; ForkJoinPool.WorkQueue w;</span></span>
<span class="line"><span>    return (s = status) &lt; 0 ? s :</span></span>
<span class="line"><span>        ((t = Thread.currentThread()) instanceof ForkJoinWorkerThread) ?</span></span>
<span class="line"><span>        (w = (wt = (ForkJoinWorkerThread)t).workQueue).</span></span>
<span class="line"><span>        tryUnpush(this) &amp;&amp; (s = doExec()) &lt; 0 ? s :</span></span>
<span class="line"><span>        wt.pool.awaitJoin(w, this, 0L) :</span></span>
<span class="line"><span>        externalAwaitDone();</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>invoke() :</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//执行任务，并等待任务完成并返回结果</span></span>
<span class="line"><span>public final V invoke() {</span></span>
<span class="line"><span>    int s;</span></span>
<span class="line"><span>    if ((s = doInvoke() &amp; DONE_MASK) != NORMAL)</span></span>
<span class="line"><span>        reportException(s);</span></span>
<span class="line"><span>    return getRawResult();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//invoke, quietlyInvoke的主实现方法</span></span>
<span class="line"><span>private int doInvoke() {</span></span>
<span class="line"><span>    int s; Thread t; ForkJoinWorkerThread wt;</span></span>
<span class="line"><span>    return (s = doExec()) &lt; 0 ? s :</span></span>
<span class="line"><span>        ((t = Thread.currentThread()) instanceof ForkJoinWorkerThread) ?</span></span>
<span class="line"><span>        (wt = (ForkJoinWorkerThread)t).pool.</span></span>
<span class="line"><span>        awaitJoin(wt.workQueue, this, 0L) :</span></span>
<span class="line"><span>        externalAwaitDone();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: join()方法一把是在任务fork()之后调用，用来获取(或者叫“合并”)任务的执行结果。</p><p>ForkJoinTask的join()和invoke()方法都可以用来获取任务的执行结果(另外还有get方法也是调用了doJoin来获取任务结果，但是会响应运行时异常)，它们对外部提交任务的执行方式一致，都是通过externalAwaitDone方法等待执行结果。不同的是invoke()方法会直接执行当前任务；而join()方法则是在当前任务在队列 top 位时(通过tryUnpush方法判断)才能执行，如果当前任务不在 top 位或者任务执行失败调用ForkJoinPool.awaitJoin方法帮助执行或阻塞当前 join 任务。(所以在官方文档中建议了我们对ForkJoinTask任务的调用顺序，一对 fork-join操作一般按照如下顺序调用: a.fork(); b.fork(); b.join(); a.join();。因为任务 b 是后面进入队列，也就是说它是在栈顶的(top 位)，在它fork()之后直接调用join()就可以直接执行而不会调用ForkJoinPool.awaitJoin方法去等待。)</p><p>在这些方法中，join()相对比较全面，所以之后的讲解我们将从join()开始逐步向下分析，首先看一下join()的执行流程:</p><p><img src="`+c+`" alt="error.图片加载失败"></p><p>后面的源码分析中，我们首先讲解比较简单的外部 join 任务(externalAwaitDone)，然后再讲解内部 join 任务(从ForkJoinPool.awaitJoin()开始)。</p><h4 id="forkjointask-externalawaitdone" tabindex="-1">ForkJoinTask.externalAwaitDone() <a class="header-anchor" href="#forkjointask-externalawaitdone" aria-label="Permalink to &quot;ForkJoinTask.externalAwaitDone()&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private int externalAwaitDone() {</span></span>
<span class="line"><span>    //执行任务</span></span>
<span class="line"><span>    int s = ((this instanceof CountedCompleter) ? // try helping</span></span>
<span class="line"><span>             ForkJoinPool.common.externalHelpComplete(  // CountedCompleter任务</span></span>
<span class="line"><span>                 (CountedCompleter&lt;?&gt;)this, 0) :</span></span>
<span class="line"><span>             ForkJoinPool.common.tryExternalUnpush(this) ? doExec() : 0);  // ForkJoinTask任务</span></span>
<span class="line"><span>    if (s &gt;= 0 &amp;&amp; (s = status) &gt;= 0) {//执行失败，进入等待</span></span>
<span class="line"><span>        boolean interrupted = false;</span></span>
<span class="line"><span>        do {</span></span>
<span class="line"><span>            if (U.compareAndSwapInt(this, STATUS, s, s | SIGNAL)) {  //更新state</span></span>
<span class="line"><span>                synchronized (this) {</span></span>
<span class="line"><span>                    if (status &gt;= 0) {//SIGNAL 等待信号</span></span>
<span class="line"><span>                        try {</span></span>
<span class="line"><span>                            wait(0L);</span></span>
<span class="line"><span>                        } catch (InterruptedException ie) {</span></span>
<span class="line"><span>                            interrupted = true;</span></span>
<span class="line"><span>                        }</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    else</span></span>
<span class="line"><span>                        notifyAll();</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } while ((s = status) &gt;= 0);</span></span>
<span class="line"><span>        if (interrupted)</span></span>
<span class="line"><span>            Thread.currentThread().interrupt();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return s;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 如果当前join为外部调用，则调用此方法执行任务，如果任务执行失败就进入等待。方法本身是很简单的，需要注意的是对不同的任务类型分两种情况:</p><ul><li><p>如果我们的任务为 CountedCompleter 类型的任务，则调用externalHelpComplete方法来执行任务。</p></li><li><p>其他类型的 ForkJoinTask 任务调用tryExternalUnpush来执行，源码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//为外部提交者提供 tryUnpush 功能(给定任务在top位时弹出任务)</span></span>
<span class="line"><span>final boolean tryExternalUnpush(ForkJoinTask&lt;?&gt; task) {</span></span>
<span class="line"><span>    WorkQueue[] ws;</span></span>
<span class="line"><span>    WorkQueue w;</span></span>
<span class="line"><span>    ForkJoinTask&lt;?&gt;[] a;</span></span>
<span class="line"><span>    int m, s;</span></span>
<span class="line"><span>    int r = ThreadLocalRandom.getProbe();</span></span>
<span class="line"><span>    if ((ws = workQueues) != null &amp;&amp; (m = ws.length - 1) &gt;= 0 &amp;&amp;</span></span>
<span class="line"><span>            (w = ws[m &amp; r &amp; SQMASK]) != null &amp;&amp;</span></span>
<span class="line"><span>            (a = w.array) != null &amp;&amp; (s = w.top) != w.base) {</span></span>
<span class="line"><span>        long j = (((a.length - 1) &amp; (s - 1)) &lt;&lt; ASHIFT) + ABASE;  //取top位任务</span></span>
<span class="line"><span>        if (U.compareAndSwapInt(w, QLOCK, 0, 1)) {  //加锁</span></span>
<span class="line"><span>            if (w.top == s &amp;&amp; w.array == a &amp;&amp;</span></span>
<span class="line"><span>                    U.getObject(a, j) == task &amp;&amp;</span></span>
<span class="line"><span>                    U.compareAndSwapObject(a, j, task, null)) {  //符合条件，弹出</span></span>
<span class="line"><span>                U.putOrderedInt(w, QTOP, s - 1);  //更新top</span></span>
<span class="line"><span>                U.putOrderedInt(w, QLOCK, 0); //解锁，返回true</span></span>
<span class="line"><span>                return true;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            U.compareAndSwapInt(w, QLOCK, 1, 0);  //当前任务不在top位，解锁返回false</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return false;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>tryExternalUnpush的作用就是判断当前任务是否在top位，如果是则弹出任务，然后在externalAwaitDone中调用doExec()执行任务。</p></li></ul><h4 id="forkjoinpool-awaitjoin" tabindex="-1">ForkJoinPool.awaitJoin() <a class="header-anchor" href="#forkjoinpool-awaitjoin" aria-label="Permalink to &quot;ForkJoinPool.awaitJoin()&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final int awaitJoin(WorkQueue w, ForkJoinTask&lt;?&gt; task, long deadline) {</span></span>
<span class="line"><span>    int s = 0;</span></span>
<span class="line"><span>    if (task != null &amp;&amp; w != null) {</span></span>
<span class="line"><span>        ForkJoinTask&lt;?&gt; prevJoin = w.currentJoin;  //获取给定Worker的join任务</span></span>
<span class="line"><span>        U.putOrderedObject(w, QCURRENTJOIN, task);  //把currentJoin替换为给定任务</span></span>
<span class="line"><span>        //判断是否为CountedCompleter类型的任务</span></span>
<span class="line"><span>        CountedCompleter&lt;?&gt; cc = (task instanceof CountedCompleter) ?</span></span>
<span class="line"><span>                (CountedCompleter&lt;?&gt;) task : null;</span></span>
<span class="line"><span>        for (; ; ) {</span></span>
<span class="line"><span>            if ((s = task.status) &lt; 0)  //已经完成|取消|异常 跳出循环</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if (cc != null)//CountedCompleter任务由helpComplete来完成join</span></span>
<span class="line"><span>                helpComplete(w, cc, 0);</span></span>
<span class="line"><span>            else if (w.base == w.top || w.tryRemoveAndExec(task))  //尝试执行</span></span>
<span class="line"><span>                helpStealer(w, task);  //队列为空或执行失败，任务可能被偷，帮助偷取者执行该任务</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if ((s = task.status) &lt; 0) //已经完成|取消|异常，跳出循环</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            //计算任务等待时间</span></span>
<span class="line"><span>            long ms, ns;</span></span>
<span class="line"><span>            if (deadline == 0L)</span></span>
<span class="line"><span>                ms = 0L;</span></span>
<span class="line"><span>            else if ((ns = deadline - System.nanoTime()) &lt;= 0L)</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            else if ((ms = TimeUnit.NANOSECONDS.toMillis(ns)) &lt;= 0L)</span></span>
<span class="line"><span>                ms = 1L;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if (tryCompensate(w)) {//执行补偿操作</span></span>
<span class="line"><span>                task.internalWait(ms);//补偿执行成功，任务等待指定时间</span></span>
<span class="line"><span>                U.getAndAddLong(this, CTL, AC_UNIT);//更新活跃线程数</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        U.putOrderedObject(w, QCURRENTJOIN, prevJoin);//循环结束，替换为原来的join任务</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return s;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 如果当前 join 任务不在Worker等待队列的top位，或者任务执行失败，调用此方法来帮助执行或阻塞当前 join 的任务。函数执行流程如下:</p><ul><li><p>由于每次调用awaitJoin都会优先执行当前join的任务，所以首先会更新currentJoin为当前join任务；</p></li><li><p>进入自旋:</p><ul><li>首先检查任务是否已经完成(通过task.status &lt; 0判断)，如果给定任务执行完毕|取消|异常 则跳出循环返回执行状态s；</li><li>如果是 CountedCompleter 任务类型，调用helpComplete方法来完成join操作(后面笔者会开新篇来专门讲解CountedCompleter，本篇暂时不做详细解析)；</li><li>非 CountedCompleter 任务类型调用WorkQueue.tryRemoveAndExec尝试执行任务；</li><li>如果给定 WorkQueue 的等待队列为空或任务执行失败，说明任务可能被偷，调用helpStealer帮助偷取者执行任务(也就是说，偷取者帮我执行任务，我去帮偷取者执行它的任务)；</li><li>再次判断任务是否执行完毕(task.status &lt; 0)，如果任务执行失败，计算一个等待时间准备进行补偿操作；</li><li>调用tryCompensate方法为给定 WorkQueue 尝试执行补偿操作。在执行补偿期间，如果发现 资源争用|池处于unstable状态|当前Worker已终止，则调用ForkJoinTask.internalWait()方法等待指定的时间，任务唤醒之后继续自旋，ForkJoinTask.internalWait()源码如下:</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final void internalWait(long timeout) {</span></span>
<span class="line"><span>    int s;</span></span>
<span class="line"><span>    if ((s = status) &gt;= 0 &amp;&amp; // force completer to issue notify</span></span>
<span class="line"><span>        U.compareAndSwapInt(this, STATUS, s, s | SIGNAL)) {//更新任务状态为SIGNAL(等待唤醒)</span></span>
<span class="line"><span>        synchronized (this) {</span></span>
<span class="line"><span>            if (status &gt;= 0)</span></span>
<span class="line"><span>                try { wait(timeout); } catch (InterruptedException ie) { }</span></span>
<span class="line"><span>            else</span></span>
<span class="line"><span>                notifyAll();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ul><p>在awaitJoin中，我们总共调用了三个比较复杂的方法: tryRemoveAndExec、helpStealer和tryCompensate，下面我们依次讲解。</p><h4 id="workqueue-tryremoveandexec-forkjointask-task" tabindex="-1">WorkQueue.tryRemoveAndExec(ForkJoinTask&lt;?&gt; task) <a class="header-anchor" href="#workqueue-tryremoveandexec-forkjointask-task" aria-label="Permalink to &quot;WorkQueue.tryRemoveAndExec(ForkJoinTask&lt;?&gt; task)&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final boolean tryRemoveAndExec(ForkJoinTask&lt;?&gt; task) {</span></span>
<span class="line"><span>    ForkJoinTask&lt;?&gt;[] a;</span></span>
<span class="line"><span>    int m, s, b, n;</span></span>
<span class="line"><span>    if ((a = array) != null &amp;&amp; (m = a.length - 1) &gt;= 0 &amp;&amp;</span></span>
<span class="line"><span>            task != null) {</span></span>
<span class="line"><span>        while ((n = (s = top) - (b = base)) &gt; 0) {</span></span>
<span class="line"><span>            //从top往下自旋查找</span></span>
<span class="line"><span>            for (ForkJoinTask&lt;?&gt; t; ; ) {      // traverse from s to b</span></span>
<span class="line"><span>                long j = ((--s &amp; m) &lt;&lt; ASHIFT) + ABASE;//计算任务索引</span></span>
<span class="line"><span>                if ((t = (ForkJoinTask&lt;?&gt;) U.getObject(a, j)) == null) //获取索引到的任务</span></span>
<span class="line"><span>                    return s + 1 == top;     // shorter than expected</span></span>
<span class="line"><span>                else if (t == task) { //给定任务为索引任务</span></span>
<span class="line"><span>                    boolean removed = false;</span></span>
<span class="line"><span>                    if (s + 1 == top) {      // pop</span></span>
<span class="line"><span>                        if (U.compareAndSwapObject(a, j, task, null)) { //弹出任务</span></span>
<span class="line"><span>                            U.putOrderedInt(this, QTOP, s); //更新top</span></span>
<span class="line"><span>                            removed = true;</span></span>
<span class="line"><span>                        }</span></span>
<span class="line"><span>                    } else if (base == b)      // replace with proxy</span></span>
<span class="line"><span>                        removed = U.compareAndSwapObject(</span></span>
<span class="line"><span>                                a, j, task, new EmptyTask()); //join任务已经被移除，替换为一个占位任务</span></span>
<span class="line"><span>                    if (removed)</span></span>
<span class="line"><span>                        task.doExec(); //执行</span></span>
<span class="line"><span>                    break;</span></span>
<span class="line"><span>                } else if (t.status &lt; 0 &amp;&amp; s + 1 == top) { //给定任务不是top任务</span></span>
<span class="line"><span>                    if (U.compareAndSwapObject(a, j, t, null)) //弹出任务</span></span>
<span class="line"><span>                        U.putOrderedInt(this, QTOP, s);//更新top</span></span>
<span class="line"><span>                    break;                  // was cancelled</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                if (--n == 0) //遍历结束</span></span>
<span class="line"><span>                    return false;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (task.status &lt; 0) //任务执行完毕</span></span>
<span class="line"><span>                return false;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return true;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 从top位开始自旋向下找到给定任务，如果找到把它从当前 Worker 的任务队列中移除并执行它。注意返回的参数: 如果任务队列为空或者任务未执行完毕返回true；任务执行完毕返回false。</p><h4 id="forkjoinpool-helpstealer-workqueue-w-forkjointask-task" tabindex="-1">ForkJoinPool.helpStealer(WorkQueue w, ForkJoinTask&lt;?&gt; task) <a class="header-anchor" href="#forkjoinpool-helpstealer-workqueue-w-forkjointask-task" aria-label="Permalink to &quot;ForkJoinPool.helpStealer(WorkQueue w, ForkJoinTask&lt;?&gt; task)&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void helpStealer(WorkQueue w, ForkJoinTask&lt;?&gt; task) {</span></span>
<span class="line"><span>    WorkQueue[] ws = workQueues;</span></span>
<span class="line"><span>    int oldSum = 0, checkSum, m;</span></span>
<span class="line"><span>    if (ws != null &amp;&amp; (m = ws.length - 1) &gt;= 0 &amp;&amp; w != null &amp;&amp;</span></span>
<span class="line"><span>            task != null) {</span></span>
<span class="line"><span>        do {                                       // restart point</span></span>
<span class="line"><span>            checkSum = 0;                          // for stability check</span></span>
<span class="line"><span>            ForkJoinTask&lt;?&gt; subtask;</span></span>
<span class="line"><span>            WorkQueue j = w, v;                    // v is subtask stealer</span></span>
<span class="line"><span>            descent:</span></span>
<span class="line"><span>            for (subtask = task; subtask.status &gt;= 0; ) {</span></span>
<span class="line"><span>                //1. 找到给定WorkQueue的偷取者v</span></span>
<span class="line"><span>                for (int h = j.hint | 1, k = 0, i; ; k += 2) {//跳两个索引，因为Worker在奇数索引位</span></span>
<span class="line"><span>                    if (k &gt; m)                     // can&#39;t find stealer</span></span>
<span class="line"><span>                        break descent;</span></span>
<span class="line"><span>                    if ((v = ws[i = (h + k) &amp; m]) != null) {</span></span>
<span class="line"><span>                        if (v.currentSteal == subtask) {//定位到偷取者</span></span>
<span class="line"><span>                            j.hint = i;//更新stealer索引</span></span>
<span class="line"><span>                            break;</span></span>
<span class="line"><span>                        }</span></span>
<span class="line"><span>                        checkSum += v.base;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                //2. 帮助偷取者v执行任务</span></span>
<span class="line"><span>                for (; ; ) {                         // help v or descend</span></span>
<span class="line"><span>                    ForkJoinTask&lt;?&gt;[] a;            //偷取者内部的任务</span></span>
<span class="line"><span>                    int b;</span></span>
<span class="line"><span>                    checkSum += (b = v.base);</span></span>
<span class="line"><span>                    ForkJoinTask&lt;?&gt; next = v.currentJoin;//获取偷取者的join任务</span></span>
<span class="line"><span>                    if (subtask.status &lt; 0 || j.currentJoin != subtask ||</span></span>
<span class="line"><span>                            v.currentSteal != subtask) // stale</span></span>
<span class="line"><span>                        break descent; // stale，跳出descent循环重来</span></span>
<span class="line"><span>                    if (b - v.top &gt;= 0 || (a = v.array) == null) {</span></span>
<span class="line"><span>                        if ((subtask = next) == null)   //偷取者的join任务为null，跳出descent循环</span></span>
<span class="line"><span>                            break descent;</span></span>
<span class="line"><span>                        j = v;</span></span>
<span class="line"><span>                        break; //偷取者内部任务为空，可能任务也被偷走了；跳出本次循环，查找偷取者的偷取者</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                    int i = (((a.length - 1) &amp; b) &lt;&lt; ASHIFT) + ABASE;//获取base偏移地址</span></span>
<span class="line"><span>                    ForkJoinTask&lt;?&gt; t = ((ForkJoinTask&lt;?&gt;)</span></span>
<span class="line"><span>                            U.getObjectVolatile(a, i));//获取偷取者的base任务</span></span>
<span class="line"><span>                    if (v.base == b) {</span></span>
<span class="line"><span>                        if (t == null)             // stale</span></span>
<span class="line"><span>                            break descent; // stale，跳出descent循环重来</span></span>
<span class="line"><span>                        if (U.compareAndSwapObject(a, i, t, null)) {//弹出任务</span></span>
<span class="line"><span>                            v.base = b + 1;         //更新偷取者的base位</span></span>
<span class="line"><span>                            ForkJoinTask&lt;?&gt; ps = w.currentSteal;//获取调用者偷来的任务</span></span>
<span class="line"><span>                            int top = w.top;</span></span>
<span class="line"><span>                            //首先更新给定workQueue的currentSteal为偷取者的base任务，然后执行该任务</span></span>
<span class="line"><span>                            //然后通过检查top来判断给定workQueue是否有自己的任务，如果有，</span></span>
<span class="line"><span>                            // 则依次弹出任务(LIFO)-&gt;更新currentSteal-&gt;执行该任务(注意这里是自己偷自己的任务执行)</span></span>
<span class="line"><span>                            do {</span></span>
<span class="line"><span>                                U.putOrderedObject(w, QCURRENTSTEAL, t);</span></span>
<span class="line"><span>                                t.doExec();        // clear local tasks too</span></span>
<span class="line"><span>                            } while (task.status &gt;= 0 &amp;&amp;</span></span>
<span class="line"><span>                                    w.top != top &amp;&amp; //内部有自己的任务，依次弹出执行</span></span>
<span class="line"><span>                                    (t = w.pop()) != null);</span></span>
<span class="line"><span>                            U.putOrderedObject(w, QCURRENTSTEAL, ps);//还原给定workQueue的currentSteal</span></span>
<span class="line"><span>                            if (w.base != w.top)//给定workQueue有自己的任务了，帮助结束，返回</span></span>
<span class="line"><span>                                return;            // can&#39;t further help</span></span>
<span class="line"><span>                        }</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } while (task.status &gt;= 0 &amp;&amp; oldSum != (oldSum = checkSum));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 如果队列为空或任务执行失败，说明任务可能被偷，调用此方法来帮助偷取者执行任务。基本思想是: 偷取者帮助我执行任务，我去帮助偷取者执行它的任务。 函数执行流程如下:</p><p>循环定位偷取者，由于Worker是在奇数索引位，所以每次会跳两个索引位。定位到偷取者之后，更新调用者 WorkQueue 的hint为偷取者的索引，方便下次定位； 定位到偷取者后，开始帮助偷取者执行任务。从偷取者的base索引开始，每次偷取一个任务执行。在帮助偷取者执行任务后，如果调用者发现本身已经有任务(w.top != top)，则依次弹出自己的任务(LIFO顺序)并执行(也就是说自己偷自己的任务执行)。</p><h4 id="forkjoinpool-trycompensate-workqueue-w" tabindex="-1">ForkJoinPool.tryCompensate(WorkQueue w) <a class="header-anchor" href="#forkjoinpool-trycompensate-workqueue-w" aria-label="Permalink to &quot;ForkJoinPool.tryCompensate(WorkQueue w)&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//执行补偿操作: 尝试缩减活动线程量，可能释放或创建一个补偿线程来准备阻塞</span></span>
<span class="line"><span>private boolean tryCompensate(WorkQueue w) {</span></span>
<span class="line"><span>    boolean canBlock;</span></span>
<span class="line"><span>    WorkQueue[] ws;</span></span>
<span class="line"><span>    long c;</span></span>
<span class="line"><span>    int m, pc, sp;</span></span>
<span class="line"><span>    if (w == null || w.qlock &lt; 0 ||           // caller terminating</span></span>
<span class="line"><span>            (ws = workQueues) == null || (m = ws.length - 1) &lt;= 0 ||</span></span>
<span class="line"><span>            (pc = config &amp; SMASK) == 0)           // parallelism disabled</span></span>
<span class="line"><span>        canBlock = false; //调用者已终止</span></span>
<span class="line"><span>    else if ((sp = (int) (c = ctl)) != 0)      // release idle worker</span></span>
<span class="line"><span>        canBlock = tryRelease(c, ws[sp &amp; m], 0L);//唤醒等待的工作线程</span></span>
<span class="line"><span>    else {//没有空闲线程</span></span>
<span class="line"><span>        int ac = (int) (c &gt;&gt; AC_SHIFT) + pc; //活跃线程数</span></span>
<span class="line"><span>        int tc = (short) (c &gt;&gt; TC_SHIFT) + pc;//总线程数</span></span>
<span class="line"><span>        int nbusy = 0;                        // validate saturation</span></span>
<span class="line"><span>        for (int i = 0; i &lt;= m; ++i) {        // two passes of odd indices</span></span>
<span class="line"><span>            WorkQueue v;</span></span>
<span class="line"><span>            if ((v = ws[((i &lt;&lt; 1) | 1) &amp; m]) != null) {//取奇数索引位</span></span>
<span class="line"><span>                if ((v.scanState &amp; SCANNING) != 0)//没有正在运行任务，跳出</span></span>
<span class="line"><span>                    break;</span></span>
<span class="line"><span>                ++nbusy;//正在运行任务，添加标记</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (nbusy != (tc &lt;&lt; 1) || ctl != c)</span></span>
<span class="line"><span>            canBlock = false;                 // unstable or stale</span></span>
<span class="line"><span>        else if (tc &gt;= pc &amp;&amp; ac &gt; 1 &amp;&amp; w.isEmpty()) {//总线程数大于并行度 &amp;&amp; 活动线程数大于1 &amp;&amp; 调用者任务队列为空，不需要补偿</span></span>
<span class="line"><span>            long nc = ((AC_MASK &amp; (c - AC_UNIT)) |</span></span>
<span class="line"><span>                    (~AC_MASK &amp; c));       // uncompensated</span></span>
<span class="line"><span>            canBlock = U.compareAndSwapLong(this, CTL, c, nc);//更新活跃线程数</span></span>
<span class="line"><span>        } else if (tc &gt;= MAX_CAP ||</span></span>
<span class="line"><span>                (this == common &amp;&amp; tc &gt;= pc + commonMaxSpares))//超出最大线程数</span></span>
<span class="line"><span>            throw new RejectedExecutionException(</span></span>
<span class="line"><span>                    &quot;Thread limit exceeded replacing blocked worker&quot;);</span></span>
<span class="line"><span>        else {                                // similar to tryAddWorker</span></span>
<span class="line"><span>            boolean add = false;</span></span>
<span class="line"><span>            int rs;      // CAS within lock</span></span>
<span class="line"><span>            long nc = ((AC_MASK &amp; c) |</span></span>
<span class="line"><span>                    (TC_MASK &amp; (c + TC_UNIT)));//计算总线程数</span></span>
<span class="line"><span>            if (((rs = lockRunState()) &amp; STOP) == 0)</span></span>
<span class="line"><span>                add = U.compareAndSwapLong(this, CTL, c, nc);//更新总线程数</span></span>
<span class="line"><span>            unlockRunState(rs, rs &amp; ~RSLOCK);</span></span>
<span class="line"><span>            //运行到这里说明活跃工作线程数不足，需要创建一个新的工作线程来补偿</span></span>
<span class="line"><span>            canBlock = add &amp;&amp; createWorker(); // throws on exception</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return canBlock;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 具体的执行看源码及注释，这里我们简单总结一下需要和不需要补偿的几种情况:</p><p><strong>需要补偿</strong> :</p><ul><li>调用者队列不为空，并且有空闲工作线程，这种情况会唤醒空闲线程(调用tryRelease方法)</li><li>池尚未停止，活跃线程数不足，这时会新建一个工作线程(调用createWorker方法)</li></ul><p><strong>不需要补偿</strong> :</p><ul><li>调用者已终止或池处于不稳定状态</li><li>总线程数大于并行度 &amp;&amp; 活动线程数大于1 &amp;&amp; 调用者任务队列为空</li></ul><h2 id="fork-join的陷阱与注意事项" tabindex="-1">Fork/Join的陷阱与注意事项 <a class="header-anchor" href="#fork-join的陷阱与注意事项" aria-label="Permalink to &quot;Fork/Join的陷阱与注意事项&quot;">​</a></h2><p>使用Fork/Join框架时，需要注意一些陷阱, 在下面 <code>斐波那契数列</code>例子中你将看到示例:</p><h3 id="避免不必要的fork" tabindex="-1">避免不必要的fork() <a class="header-anchor" href="#避免不必要的fork" aria-label="Permalink to &quot;避免不必要的fork()&quot;">​</a></h3><p>划分成两个子任务后，不要同时调用两个子任务的fork()方法。</p><p>表面上看上去两个子任务都fork()，然后join()两次似乎更自然。但事实证明，直接调用compute()效率更高。因为直接调用子任务的compute()方法实际上就是在当前的工作线程进行了计算(线程重用)，这比“将子任务提交到工作队列，线程又从工作队列中拿任务”快得多。</p><blockquote><p>当一个大任务被划分成两个以上的子任务时，尽可能使用前面说到的三个衍生的invokeAll方法，因为使用它们能避免不必要的fork()。</p></blockquote><h3 id="注意fork-、compute-、join-的顺序" tabindex="-1">注意fork()、compute()、join()的顺序 <a class="header-anchor" href="#注意fork-、compute-、join-的顺序" aria-label="Permalink to &quot;注意fork()、compute()、join()的顺序&quot;">​</a></h3><p>为了两个任务并行，三个方法的调用顺序需要万分注意。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>right.fork(); // 计算右边的任务</span></span>
<span class="line"><span>long leftAns = left.compute(); // 计算左边的任务(同时右边任务也在计算)</span></span>
<span class="line"><span>long rightAns = right.join(); // 等待右边的结果</span></span>
<span class="line"><span>return leftAns + rightAns;</span></span></code></pre></div><p>如果我们写成:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>left.fork(); // 计算完左边的任务</span></span>
<span class="line"><span>long leftAns = left.join(); // 等待左边的计算结果</span></span>
<span class="line"><span>long rightAns = right.compute(); // 再计算右边的任务</span></span>
<span class="line"><span>return leftAns + rightAns;</span></span></code></pre></div><p>或者</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>long rightAns = right.compute(); // 计算完右边的任务</span></span>
<span class="line"><span>left.fork(); // 再计算左边的任务</span></span>
<span class="line"><span>long leftAns = left.join(); // 等待左边的计算结果</span></span>
<span class="line"><span>return leftAns + rightAns;</span></span></code></pre></div><p>这两种实际上都没有并行。</p><h3 id="选择合适的子任务粒度" tabindex="-1">选择合适的子任务粒度 <a class="header-anchor" href="#选择合适的子任务粒度" aria-label="Permalink to &quot;选择合适的子任务粒度&quot;">​</a></h3><p>选择划分子任务的粒度(顺序执行的阈值)很重要，因为使用Fork/Join框架并不一定比顺序执行任务的效率高: 如果任务太大，则无法提高并行的吞吐量；如果任务太小，子任务的调度开销可能会大于并行计算的性能提升，我们还要考虑创建子任务、fork()子任务、线程调度以及合并子任务处理结果的耗时以及相应的内存消耗。</p><p>官方文档给出的粗略经验是: 任务应该执行<code>100~10000</code>个基本的计算步骤。决定子任务的粒度的最好办法是实践，通过实际测试结果来确定这个阈值才是“上上策”。</p><blockquote><p>和其他Java代码一样，Fork/Join框架测试时需要“预热”或者说执行几遍才会被JIT(Just-in-time)编译器优化，所以测试性能之前跑几遍程序很重要。</p></blockquote><h3 id="避免重量级任务划分与结果合并" tabindex="-1">避免重量级任务划分与结果合并 <a class="header-anchor" href="#避免重量级任务划分与结果合并" aria-label="Permalink to &quot;避免重量级任务划分与结果合并&quot;">​</a></h3><p>Fork/Join的很多使用场景都用到数组或者List等数据结构，子任务在某个分区中运行，最典型的例子如并行排序和并行查找。拆分子任务以及合并处理结果的时候，应该尽量避免System.arraycopy这样耗时耗空间的操作，从而最小化任务的处理开销。</p><h2 id="再深入理解" tabindex="-1">再深入理解 <a class="header-anchor" href="#再深入理解" aria-label="Permalink to &quot;再深入理解&quot;">​</a></h2><h3 id="有哪些jdk源码中使用了fork-join思想" tabindex="-1">有哪些JDK源码中使用了Fork/Join思想? <a class="header-anchor" href="#有哪些jdk源码中使用了fork-join思想" aria-label="Permalink to &quot;有哪些JDK源码中使用了Fork/Join思想?&quot;">​</a></h3><p>我们常用的数组工具类 Arrays 在JDK 8之后新增的并行排序方法(parallelSort)就运用了 ForkJoinPool 的特性，还有 ConcurrentHashMap 在JDK 8之后添加的函数式方法(如forEach等)也有运用。</p><h3 id="使用executors工具类创建forkjoinpool" tabindex="-1">使用Executors工具类创建ForkJoinPool <a class="header-anchor" href="#使用executors工具类创建forkjoinpool" aria-label="Permalink to &quot;使用Executors工具类创建ForkJoinPool&quot;">​</a></h3><p>Java8在Executors工具类中新增了两个工厂方法:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// parallelism定义并行级别</span></span>
<span class="line"><span>public static ExecutorService newWorkStealingPool(int parallelism);</span></span>
<span class="line"><span>// 默认并行级别为JVM可用的处理器个数</span></span>
<span class="line"><span>// Runtime.getRuntime().availableProcessors()</span></span>
<span class="line"><span>public static ExecutorService newWorkStealingPool();</span></span></code></pre></div><h3 id="关于fork-join异常处理" tabindex="-1">关于Fork/Join异常处理 <a class="header-anchor" href="#关于fork-join异常处理" aria-label="Permalink to &quot;关于Fork/Join异常处理&quot;">​</a></h3><p>Java的受检异常机制一直饱受诟病，所以在ForkJoinTask的invoke()、join()方法及其衍生方法中都没有像get()方法那样抛出个ExecutionException的受检异常。</p><p>所以你可以在ForkJoinTask中看到内部把受检异常转换成了运行时异常。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static void rethrow(Throwable ex) {</span></span>
<span class="line"><span>    if (ex != null)</span></span>
<span class="line"><span>        ForkJoinTask.&lt;RuntimeException&gt;uncheckedThrow(ex);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@SuppressWarnings(&quot;unchecked&quot;)</span></span>
<span class="line"><span>static &lt;T extends Throwable&gt; void uncheckedThrow(Throwable t) throws T {</span></span>
<span class="line"><span>    throw (T)t; // rely on vacuous cast</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>关于Java你不知道的10件事中已经指出，JVM实际并不关心这个异常是受检异常还是运行时异常，受检异常这东西完全是给Java编译器用的: 用于警告程序员这里有个异常没有处理。</p><p>但不可否认的是invoke、join()仍可能会抛出运行时异常，所以ForkJoinTask还提供了两个不提取结果和异常的方法quietlyInvoke()、quietlyJoin()，这两个方法允许你在所有任务完成后对结果和异常进行处理。</p><p>使用quitelyInvoke()和quietlyJoin()时可以配合isCompletedAbnormally()和isCompletedNormally()方法使用。</p><h2 id="一些fork-join例子" tabindex="-1">一些Fork/Join例子 <a class="header-anchor" href="#一些fork-join例子" aria-label="Permalink to &quot;一些Fork/Join例子&quot;">​</a></h2><h3 id="采用fork-join来异步计算1-2-3-10000的结果" tabindex="-1">采用Fork/Join来异步计算1+2+3+…+10000的结果 <a class="header-anchor" href="#采用fork-join来异步计算1-2-3-10000的结果" aria-label="Permalink to &quot;采用Fork/Join来异步计算1+2+3+…+10000的结果&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Test {</span></span>
<span class="line"><span>	static final class SumTask extends RecursiveTask&lt;Integer&gt; {</span></span>
<span class="line"><span>		private static final long serialVersionUID = 1L;</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>		final int start; //开始计算的数</span></span>
<span class="line"><span>		final int end; //最后计算的数</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>		SumTask(int start, int end) {</span></span>
<span class="line"><span>			this.start = start;</span></span>
<span class="line"><span>			this.end = end;</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>		@Override</span></span>
<span class="line"><span>		protected Integer compute() {</span></span>
<span class="line"><span>			//如果计算量小于1000，那么分配一个线程执行if中的代码块，并返回执行结果</span></span>
<span class="line"><span>			if(end - start &lt; 1000) {</span></span>
<span class="line"><span>				System.out.println(Thread.currentThread().getName() + &quot; 开始执行: &quot; + start + &quot;-&quot; + end);</span></span>
<span class="line"><span>				int sum = 0;</span></span>
<span class="line"><span>				for(int i = start; i &lt;= end; i++)</span></span>
<span class="line"><span>					sum += i;</span></span>
<span class="line"><span>				return sum;</span></span>
<span class="line"><span>			}</span></span>
<span class="line"><span>			//如果计算量大于1000，那么拆分为两个任务</span></span>
<span class="line"><span>			SumTask task1 = new SumTask(start, (start + end) / 2);</span></span>
<span class="line"><span>			SumTask task2 = new SumTask((start + end) / 2 + 1, end);</span></span>
<span class="line"><span>			//执行任务</span></span>
<span class="line"><span>			task1.fork();</span></span>
<span class="line"><span>			task2.fork();</span></span>
<span class="line"><span>			//获取任务执行的结果</span></span>
<span class="line"><span>			return task1.join() + task2.join();</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>	public static void main(String[] args) throws InterruptedException, ExecutionException {</span></span>
<span class="line"><span>		ForkJoinPool pool = new ForkJoinPool();</span></span>
<span class="line"><span>		ForkJoinTask&lt;Integer&gt; task = new SumTask(1, 10000);</span></span>
<span class="line"><span>		pool.submit(task);</span></span>
<span class="line"><span>		System.out.println(task.get());</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>执行结果</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ForkJoinPool-1-worker-1 开始执行: 1-625</span></span>
<span class="line"><span>ForkJoinPool-1-worker-7 开始执行: 6251-6875</span></span>
<span class="line"><span>ForkJoinPool-1-worker-6 开始执行: 5626-6250</span></span>
<span class="line"><span>ForkJoinPool-1-worker-10 开始执行: 3751-4375</span></span>
<span class="line"><span>ForkJoinPool-1-worker-13 开始执行: 2501-3125</span></span>
<span class="line"><span>ForkJoinPool-1-worker-8 开始执行: 626-1250</span></span>
<span class="line"><span>ForkJoinPool-1-worker-11 开始执行: 5001-5625</span></span>
<span class="line"><span>ForkJoinPool-1-worker-3 开始执行: 7501-8125</span></span>
<span class="line"><span>ForkJoinPool-1-worker-14 开始执行: 1251-1875</span></span>
<span class="line"><span>ForkJoinPool-1-worker-4 开始执行: 9376-10000</span></span>
<span class="line"><span>ForkJoinPool-1-worker-8 开始执行: 8126-8750</span></span>
<span class="line"><span>ForkJoinPool-1-worker-0 开始执行: 1876-2500</span></span>
<span class="line"><span>ForkJoinPool-1-worker-12 开始执行: 4376-5000</span></span>
<span class="line"><span>ForkJoinPool-1-worker-5 开始执行: 8751-9375</span></span>
<span class="line"><span>ForkJoinPool-1-worker-7 开始执行: 6876-7500</span></span>
<span class="line"><span>ForkJoinPool-1-worker-1 开始执行: 3126-3750</span></span>
<span class="line"><span>50005000</span></span></code></pre></div><h3 id="实现斐波那契数列" tabindex="-1">实现斐波那契数列 <a class="header-anchor" href="#实现斐波那契数列" aria-label="Permalink to &quot;实现斐波那契数列&quot;">​</a></h3><blockquote><p>斐波那契数列: 1、1、2、3、5、8、13、21、34、…… 公式 : F(1)=1，F(2)=1, F(n)=F(n-1)+F(n-2)(n&gt;=3，n∈N*)</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) {</span></span>
<span class="line"><span>    ForkJoinPool forkJoinPool = new ForkJoinPool(4); // 最大并发数4</span></span>
<span class="line"><span>    Fibonacci fibonacci = new Fibonacci(20);</span></span>
<span class="line"><span>    long startTime = System.currentTimeMillis();</span></span>
<span class="line"><span>    Integer result = forkJoinPool.invoke(fibonacci);</span></span>
<span class="line"><span>    long endTime = System.currentTimeMillis();</span></span>
<span class="line"><span>    System.out.println(&quot;Fork/join sum: &quot; + result + &quot; in &quot; + (endTime - startTime) + &quot; ms.&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//以下为官方API文档示例</span></span>
<span class="line"><span>static  class Fibonacci extends RecursiveTask&lt;Integer&gt; {</span></span>
<span class="line"><span>    final int n;</span></span>
<span class="line"><span>    Fibonacci(int n) {</span></span>
<span class="line"><span>        this.n = n;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    protected Integer compute() {</span></span>
<span class="line"><span>        if (n &lt;= 1) {</span></span>
<span class="line"><span>            return n;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        Fibonacci f1 = new Fibonacci(n - 1);</span></span>
<span class="line"><span>        f1.fork(); </span></span>
<span class="line"><span>        Fibonacci f2 = new Fibonacci(n - 2);</span></span>
<span class="line"><span>        return f2.compute() + f1.join(); </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当然你也可以两个任务都fork，要注意的是两个任务都fork的情况，必须按照f1.fork()，f2.fork()， f2.join()，f1.join()这样的顺序，不然有性能问题，详见上面注意事项中的说明。</p><p>官方API文档是这样写到的，所以平日用invokeAll就好了。invokeAll会把传入的任务的第一个交给当前线程来执行，其他的任务都fork加入工作队列，这样等于利用当前线程也执行任务了。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>    // ...</span></span>
<span class="line"><span>    Fibonacci f1 = new Fibonacci(n - 1);</span></span>
<span class="line"><span>    Fibonacci f2 = new Fibonacci(n - 2);</span></span>
<span class="line"><span>    invokeAll(f1,f2);</span></span>
<span class="line"><span>    return f2.join() + f1.join();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public static void invokeAll(ForkJoinTask&lt;?&gt;... tasks) {</span></span>
<span class="line"><span>    Throwable ex = null;</span></span>
<span class="line"><span>    int last = tasks.length - 1;</span></span>
<span class="line"><span>    for (int i = last; i &gt;= 0; --i) {</span></span>
<span class="line"><span>        ForkJoinTask&lt;?&gt; t = tasks[i];</span></span>
<span class="line"><span>        if (t == null) {</span></span>
<span class="line"><span>            if (ex == null)</span></span>
<span class="line"><span>                ex = new NullPointerException();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else if (i != 0)   //除了第一个都fork</span></span>
<span class="line"><span>            t.fork();</span></span>
<span class="line"><span>        else if (t.doInvoke() &lt; NORMAL &amp;&amp; ex == null)  //留一个自己执行</span></span>
<span class="line"><span>            ex = t.getException();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (int i = 1; i &lt;= last; ++i) {</span></span>
<span class="line"><span>        ForkJoinTask&lt;?&gt; t = tasks[i];</span></span>
<span class="line"><span>        if (t != null) {</span></span>
<span class="line"><span>            if (ex != null)</span></span>
<span class="line"><span>                t.cancel(false);</span></span>
<span class="line"><span>            else if (t.doJoin() &lt; NORMAL)</span></span>
<span class="line"><span>                ex = t.getException();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (ex != null)</span></span>
<span class="line"><span>        rethrow(ex);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li>首先推荐阅读ForkJoinPool的作者Doug Lea的一篇文章《A Java Fork/Join Framework》<a href="http://gee.cs.oswego.edu/dl/papers/fj.pdf" target="_blank" rel="noreferrer">英文原文地址在新窗口打开</a></li><li>本文主要参考自泰迪的bagwell的<a href="https://www.jianshu.com/p/32a15ef2f1bf%E5%92%8Chttps://www.jianshu.com/p/6a14d0b54b8d%EF%BC%8C%E5%9C%A8%E6%AD%A4%E5%9F%BA%E7%A1%80%E4%B8%8A%E5%8F%82%E8%80%83%E4%BA%86%E5%A6%82%E4%B8%8B%E6%96%87%E7%AB%A0" target="_blank" rel="noreferrer">https://www.jianshu.com/p/32a15ef2f1bf和https://www.jianshu.com/p/6a14d0b54b8d，在此基础上参考了如下文章</a></li><li><a href="https://blog.csdn.net/u010841296/article/details/83963637" target="_blank" rel="noreferrer">https://blog.csdn.net/u010841296/article/details/83963637</a></li><li><a href="https://blog.csdn.net/Holmofy/article/details/82714665" target="_blank" rel="noreferrer">https://blog.csdn.net/Holmofy/article/details/82714665</a></li><li><a href="https://blog.csdn.net/abc123lzf/article/details/82873181" target="_blank" rel="noreferrer">https://blog.csdn.net/abc123lzf/article/details/82873181</a></li><li><a href="https://blog.csdn.net/yinwenjie/article/details/71524140" target="_blank" rel="noreferrer">https://blog.csdn.net/yinwenjie/article/details/71524140</a></li><li><a href="https://blog.csdn.net/cowbin2012/article/details/89791757" target="_blank" rel="noreferrer">https://blog.csdn.net/cowbin2012/article/details/89791757</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,213)]))}const F=l(u,[["render",k]]);export{v as __pageData,F as default};
