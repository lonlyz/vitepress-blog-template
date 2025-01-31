import{_ as e}from"./chunks/java-thread-x-stpe-1.DfpVTKwY.js";import{_ as n,c as s,ai as l,o as p}from"./chunks/framework.BrYByd3F.js";const x=JSON.parse('{"title":"JUC线程池: ScheduledThreadPoolExecutor详解","description":"","frontmatter":{},"headers":[],"relativePath":"java/thread/java-thread-x-juc-executor-ScheduledThreadPoolExecutor.md","filePath":"java/thread/java-thread-x-juc-executor-ScheduledThreadPoolExecutor.md","lastUpdated":1737706346000}'),t={name:"java/thread/java-thread-x-juc-executor-ScheduledThreadPoolExecutor.md"};function i(c,a,d,o,u,r){return p(),s("div",null,a[0]||(a[0]=[l('<h1 id="juc线程池-scheduledthreadpoolexecutor详解" tabindex="-1">JUC线程池: ScheduledThreadPoolExecutor详解 <a class="header-anchor" href="#juc线程池-scheduledthreadpoolexecutor详解" aria-label="Permalink to &quot;JUC线程池: ScheduledThreadPoolExecutor详解&quot;">​</a></h1><blockquote><p>在很多业务场景中，我们可能需要周期性的运行某项任务来获取结果，比如周期数据统计，定时发送数据等。在并发包出现之前，Java 早在1.3就提供了 Timer 类(只需要了解，目前已渐渐被 ScheduledThreadPoolExecutor 代替)来适应这些业务场景。随着业务量的不断增大，我们可能需要多个工作线程运行任务来尽可能的增加产品性能，或者是需要更高的灵活性来控制和监控这些周期业务。这些都是 ScheduledThreadPoolExecutor 诞生的必然性。@pdai</p></blockquote><h2 id="带着bat大厂的面试问题去理解scheduledthreadpoolexecutor" tabindex="-1">带着BAT大厂的面试问题去理解ScheduledThreadPoolExecutor <a class="header-anchor" href="#带着bat大厂的面试问题去理解scheduledthreadpoolexecutor" aria-label="Permalink to &quot;带着BAT大厂的面试问题去理解ScheduledThreadPoolExecutor&quot;">​</a></h2><p>提示</p><p>请带着这些问题继续后文，会很大程度上帮助你更好的理解ScheduledThreadPoolExecutor。@pdai</p><ul><li>ScheduledThreadPoolExecutor要解决什么样的问题?</li><li>ScheduledThreadPoolExecutor相比ThreadPoolExecutor有哪些特性?</li><li>ScheduledThreadPoolExecutor有什么样的数据结构，核心内部类和抽象类?</li><li>ScheduledThreadPoolExecutor有哪两个关闭策略? 区别是什么?</li><li>ScheduledThreadPoolExecutor中scheduleAtFixedRate 和 scheduleWithFixedDelay区别是什么?</li><li>为什么ThreadPoolExecutor 的调整策略却不适用于 ScheduledThreadPoolExecutor?</li><li>Executors 提供了几种方法来构造 ScheduledThreadPoolExecutor?</li></ul><h2 id="scheduledthreadpoolexecutor简介" tabindex="-1">ScheduledThreadPoolExecutor简介 <a class="header-anchor" href="#scheduledthreadpoolexecutor简介" aria-label="Permalink to &quot;ScheduledThreadPoolExecutor简介&quot;">​</a></h2><p>ScheduledThreadPoolExecutor继承自 ThreadPoolExecutor，为任务提供延迟或周期执行，属于线程池的一种。和 ThreadPoolExecutor 相比，它还具有以下几种特性:</p><ul><li>使用专门的任务类型—ScheduledFutureTask 来执行周期任务，也可以接收不需要时间调度的任务(这些任务通过 ExecutorService 来执行)。</li><li>使用专门的存储队列—DelayedWorkQueue 来存储任务，DelayedWorkQueue 是无界延迟队列DelayQueue 的一种。相比ThreadPoolExecutor也简化了执行机制(delayedExecute方法，后面单独分析)。</li><li>支持可选的run-after-shutdown参数，在池被关闭(shutdown)之后支持可选的逻辑来决定是否继续运行周期或延迟任务。并且当任务(重新)提交操作与 shutdown 操作重叠时，复查逻辑也不相同。</li></ul><h2 id="scheduledthreadpoolexecutor数据结构" tabindex="-1">ScheduledThreadPoolExecutor数据结构 <a class="header-anchor" href="#scheduledthreadpoolexecutor数据结构" aria-label="Permalink to &quot;ScheduledThreadPoolExecutor数据结构&quot;">​</a></h2><p><img src="'+e+`" alt="error.图片加载失败"></p><p>ScheduledThreadPoolExecutor继承自 <code>ThreadPoolExecutor</code>:</p><ul><li>详情请参考: <a href="https://pdai.tech/md/java/thread/java-thread-x-juc-executor-ThreadPoolExecutor.html" target="_blank" rel="noreferrer">JUC线程池: ThreadPoolExecutor详解</a></li></ul><p>ScheduledThreadPoolExecutor 内部构造了两个内部类 <code>ScheduledFutureTask</code> 和 <code>DelayedWorkQueue</code>:</p><ul><li><p><code>ScheduledFutureTask</code>: 继承了FutureTask，说明是一个异步运算任务；最上层分别实现了Runnable、Future、Delayed接口，说明它是一个可以延迟执行的异步运算任务。</p></li><li><p><code>DelayedWorkQueue</code>: 这是 ScheduledThreadPoolExecutor 为存储周期或延迟任务专门定义的一个延迟队列，继承了 AbstractQueue，为了契合 ThreadPoolExecutor 也实现了 BlockingQueue 接口。它内部只允许存储 RunnableScheduledFuture 类型的任务。与 DelayQueue 的不同之处就是它只允许存放 RunnableScheduledFuture 对象，并且自己实现了二叉堆(DelayQueue 是利用了 PriorityQueue 的二叉堆结构)。</p></li></ul><h2 id="scheduledthreadpoolexecutor源码解析" tabindex="-1">ScheduledThreadPoolExecutor源码解析 <a class="header-anchor" href="#scheduledthreadpoolexecutor源码解析" aria-label="Permalink to &quot;ScheduledThreadPoolExecutor源码解析&quot;">​</a></h2><blockquote><p>以下源码的解析是基于你已经理解了FutureTask。</p></blockquote><h3 id="内部类scheduledfuturetask" tabindex="-1">内部类ScheduledFutureTask <a class="header-anchor" href="#内部类scheduledfuturetask" aria-label="Permalink to &quot;内部类ScheduledFutureTask&quot;">​</a></h3><h4 id="属性" tabindex="-1">属性 <a class="header-anchor" href="#属性" aria-label="Permalink to &quot;属性&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//为相同延时任务提供的顺序编号</span></span>
<span class="line"><span>private final long sequenceNumber;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//任务可以执行的时间，纳秒级</span></span>
<span class="line"><span>private long time;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//重复任务的执行周期时间，纳秒级。</span></span>
<span class="line"><span>private final long period;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//重新入队的任务</span></span>
<span class="line"><span>RunnableScheduledFuture&lt;V&gt; outerTask = this;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//延迟队列的索引，以支持更快的取消操作</span></span>
<span class="line"><span>int heapIndex;</span></span></code></pre></div><ul><li><code>sequenceNumber</code>: 当两个任务有相同的延迟时间时，按照 FIFO 的顺序入队。sequenceNumber 就是为相同延时任务提供的顺序编号。</li><li><code>time</code>: 任务可以执行时的时间，纳秒级，通过triggerTime方法计算得出。</li><li><code>period</code>: 任务的执行周期时间，纳秒级。正数表示固定速率执行(为scheduleAtFixedRate提供服务)，负数表示固定延迟执行(为scheduleWithFixedDelay提供服务)，0表示不重复任务。</li><li><code>outerTask</code>: 重新入队的任务，通过reExecutePeriodic方法入队重新排序。</li></ul><h4 id="核心方法run" tabindex="-1">核心方法run() <a class="header-anchor" href="#核心方法run" aria-label="Permalink to &quot;核心方法run()&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void run() {</span></span>
<span class="line"><span>    boolean periodic = isPeriodic();//是否为周期任务</span></span>
<span class="line"><span>    if (!canRunInCurrentRunState(periodic))//当前状态是否可以执行</span></span>
<span class="line"><span>        cancel(false);</span></span>
<span class="line"><span>    else if (!periodic)</span></span>
<span class="line"><span>        //不是周期任务，直接执行</span></span>
<span class="line"><span>        ScheduledFutureTask.super.run();</span></span>
<span class="line"><span>    else if (ScheduledFutureTask.super.runAndReset()) {</span></span>
<span class="line"><span>        setNextRunTime();//设置下一次运行时间</span></span>
<span class="line"><span>        reExecutePeriodic(outerTask);//重排序一个周期任务</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: ScheduledFutureTask 的run方法重写了 FutureTask 的版本，以便执行周期任务时重置/重排序任务。任务的执行通过父类 FutureTask 的run实现。内部有两个针对周期任务的方法:</p><ul><li>setNextRunTime(): 用来设置下一次运行的时间，源码如下:</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//设置下一次执行任务的时间</span></span>
<span class="line"><span>private void setNextRunTime() {</span></span>
<span class="line"><span>    long p = period;</span></span>
<span class="line"><span>    if (p &gt; 0)  //固定速率执行，scheduleAtFixedRate</span></span>
<span class="line"><span>        time += p;</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>        time = triggerTime(-p);  //固定延迟执行，scheduleWithFixedDelay</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//计算固定延迟任务的执行时间</span></span>
<span class="line"><span>long triggerTime(long delay) {</span></span>
<span class="line"><span>    return now() +</span></span>
<span class="line"><span>        ((delay &lt; (Long.MAX_VALUE &gt;&gt; 1)) ? delay : overflowFree(delay));</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>reExecutePeriodic(): 周期任务重新入队等待下一次执行，源码如下:</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//重排序一个周期任务</span></span>
<span class="line"><span>void reExecutePeriodic(RunnableScheduledFuture&lt;?&gt; task) {</span></span>
<span class="line"><span>    if (canRunInCurrentRunState(true)) {//池关闭后可继续执行</span></span>
<span class="line"><span>        super.getQueue().add(task);//任务入列</span></span>
<span class="line"><span>        //重新检查run-after-shutdown参数，如果不能继续运行就移除队列任务，并取消任务的执行</span></span>
<span class="line"><span>        if (!canRunInCurrentRunState(true) &amp;&amp; remove(task))</span></span>
<span class="line"><span>            task.cancel(false);</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            ensurePrestart();//启动一个新的线程等待任务</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>reExecutePeriodic与delayedExecute的执行策略一致，只不过reExecutePeriodic不会执行拒绝策略而是直接丢掉任务。</p><h4 id="cancel方法" tabindex="-1">cancel方法 <a class="header-anchor" href="#cancel方法" aria-label="Permalink to &quot;cancel方法&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean cancel(boolean mayInterruptIfRunning) {</span></span>
<span class="line"><span>    boolean cancelled = super.cancel(mayInterruptIfRunning);</span></span>
<span class="line"><span>    if (cancelled &amp;&amp; removeOnCancel &amp;&amp; heapIndex &gt;= 0)</span></span>
<span class="line"><span>        remove(this);</span></span>
<span class="line"><span>    return cancelled;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>ScheduledFutureTask.cancel本质上由其父类 FutureTask.cancel 实现。取消任务成功后会根据removeOnCancel参数决定是否从队列中移除此任务。</p><h3 id="核心属性" tabindex="-1">核心属性 <a class="header-anchor" href="#核心属性" aria-label="Permalink to &quot;核心属性&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//关闭后继续执行已经存在的周期任务 </span></span>
<span class="line"><span>private volatile boolean continueExistingPeriodicTasksAfterShutdown;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//关闭后继续执行已经存在的延时任务 </span></span>
<span class="line"><span>private volatile boolean executeExistingDelayedTasksAfterShutdown = true;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//取消任务后移除 </span></span>
<span class="line"><span>private volatile boolean removeOnCancel = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//为相同延时的任务提供的顺序编号，保证任务之间的FIFO顺序</span></span>
<span class="line"><span>private static final AtomicLong sequencer = new AtomicLong();</span></span></code></pre></div><ul><li><p><code>continueExistingPeriodicTasksAfterShutdown</code>和<code>executeExistingDelayedTasksAfterShutdown</code>是 ScheduledThreadPoolExecutor 定义的 <code>run-after-shutdown</code> 参数，用来控制池关闭之后的任务执行逻辑。</p></li><li><p><code>removeOnCancel</code>用来控制任务取消后是否从队列中移除。当一个已经提交的周期或延迟任务在运行之前被取消，那么它之后将不会运行。默认配置下，这种已经取消的任务在届期之前不会被移除。 通过这种机制，可以方便检查和监控线程池状态，但也可能导致已经取消的任务无限滞留。为了避免这种情况的发生，我们可以通过<code>setRemoveOnCancelPolicy</code>方法设置移除策略，把参数<code>removeOnCancel</code>设为true可以在任务取消后立即从队列中移除。</p></li><li><p><code>sequencer</code>是为相同延时的任务提供的顺序编号，保证任务之间的 FIFO 顺序。与 ScheduledFutureTask 内部的sequenceNumber参数作用一致。</p></li></ul><h3 id="构造函数" tabindex="-1">构造函数 <a class="header-anchor" href="#构造函数" aria-label="Permalink to &quot;构造函数&quot;">​</a></h3><p>首先看下构造函数，ScheduledThreadPoolExecutor 内部有四个构造函数，这里我们只看这个最大构造灵活度的:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ScheduledThreadPoolExecutor(int corePoolSize,</span></span>
<span class="line"><span>                                   ThreadFactory threadFactory,</span></span>
<span class="line"><span>                                   RejectedExecutionHandler handler) {</span></span>
<span class="line"><span>    super(corePoolSize, Integer.MAX_VALUE, 0, NANOSECONDS,</span></span>
<span class="line"><span>          new DelayedWorkQueue(), threadFactory, handler);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>构造函数都是通过super调用了ThreadPoolExecutor的构造，并且使用特定等待队列DelayedWorkQueue。</p><h3 id="核心方法-schedule" tabindex="-1">核心方法:Schedule <a class="header-anchor" href="#核心方法-schedule" aria-label="Permalink to &quot;核心方法:Schedule&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public &lt;V&gt; ScheduledFuture&lt;V&gt; schedule(Callable&lt;V&gt; callable,</span></span>
<span class="line"><span>                                       long delay,</span></span>
<span class="line"><span>                                       TimeUnit unit) {</span></span>
<span class="line"><span>    if (callable == null || unit == null)</span></span>
<span class="line"><span>        throw new NullPointerException();</span></span>
<span class="line"><span>    RunnableScheduledFuture&lt;V&gt; t = decorateTask(callable,</span></span>
<span class="line"><span>        new ScheduledFutureTask&lt;V&gt;(callable, triggerTime(delay, unit)));//构造ScheduledFutureTask任务</span></span>
<span class="line"><span>    delayedExecute(t);//任务执行主方法</span></span>
<span class="line"><span>    return t;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: schedule主要用于执行一次性(延迟)任务。函数执行逻辑分两步:</p><ul><li><code>封装 Callable/Runnable</code>: 首先通过triggerTime计算任务的延迟执行时间，然后通过 ScheduledFutureTask 的构造函数把 Runnable/Callable 任务构造为ScheduledThreadPoolExecutor可以执行的任务类型，最后调用decorateTask方法执行用户自定义的逻辑；decorateTask是一个用户可自定义扩展的方法，默认实现下直接返回封装的RunnableScheduledFuture任务，源码如下:</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected &lt;V&gt; RunnableScheduledFuture&lt;V&gt; decorateTask(</span></span>
<span class="line"><span>    Runnable runnable, RunnableScheduledFuture&lt;V&gt; task) {</span></span>
<span class="line"><span>    return task;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><code>执行任务</code>: 通过delayedExecute实现。下面我们来详细分析。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void delayedExecute(RunnableScheduledFuture&lt;?&gt; task) {</span></span>
<span class="line"><span>    if (isShutdown())</span></span>
<span class="line"><span>        reject(task);//池已关闭，执行拒绝策略</span></span>
<span class="line"><span>    else {</span></span>
<span class="line"><span>        super.getQueue().add(task);//任务入队</span></span>
<span class="line"><span>        if (isShutdown() &amp;&amp;</span></span>
<span class="line"><span>            !canRunInCurrentRunState(task.isPeriodic()) &amp;&amp;//判断run-after-shutdown参数</span></span>
<span class="line"><span>            remove(task))//移除任务</span></span>
<span class="line"><span>            task.cancel(false);</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            ensurePrestart();//启动一个新的线程等待任务</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: delayedExecute是执行任务的主方法，方法执行逻辑如下:</p><ul><li>如果池已关闭(ctl &gt;= SHUTDOWN)，执行任务拒绝策略；</li><li>池正在运行，首先把任务入队排序；然后重新检查池的关闭状态，执行如下逻辑:</li></ul><p><code>A</code>: 如果池正在运行，或者 run-after-shutdown 参数值为true，则调用父类方法ensurePrestart启动一个新的线程等待执行任务。ensurePrestart源码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void ensurePrestart() {</span></span>
<span class="line"><span>    int wc = workerCountOf(ctl.get());</span></span>
<span class="line"><span>    if (wc &lt; corePoolSize)</span></span>
<span class="line"><span>        addWorker(null, true);</span></span>
<span class="line"><span>    else if (wc == 0)</span></span>
<span class="line"><span>        addWorker(null, false);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>ensurePrestart是父类 ThreadPoolExecutor 的方法，用于启动一个新的工作线程等待执行任务，即使corePoolSize为0也会安排一个新线程。</p><p><code>B</code>: 如果池已经关闭，并且 run-after-shutdown 参数值为false，则执行父类(ThreadPoolExecutor)方法remove移除队列中的指定任务，成功移除后调用ScheduledFutureTask.cancel取消任务</p><h3 id="核心方法-scheduleatfixedrate-和-schedulewithfixeddelay" tabindex="-1">核心方法:scheduleAtFixedRate 和 scheduleWithFixedDelay <a class="header-anchor" href="#核心方法-scheduleatfixedrate-和-schedulewithfixeddelay" aria-label="Permalink to &quot;核心方法:scheduleAtFixedRate 和 scheduleWithFixedDelay&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * 创建一个周期执行的任务，第一次执行延期时间为initialDelay，</span></span>
<span class="line"><span> * 之后每隔period执行一次，不等待第一次执行完成就开始计时</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public ScheduledFuture&lt;?&gt; scheduleAtFixedRate(Runnable command,</span></span>
<span class="line"><span>                                              long initialDelay,</span></span>
<span class="line"><span>                                              long period,</span></span>
<span class="line"><span>                                              TimeUnit unit) {</span></span>
<span class="line"><span>    if (command == null || unit == null)</span></span>
<span class="line"><span>        throw new NullPointerException();</span></span>
<span class="line"><span>    if (period &lt;= 0)</span></span>
<span class="line"><span>        throw new IllegalArgumentException();</span></span>
<span class="line"><span>    //构建RunnableScheduledFuture任务类型</span></span>
<span class="line"><span>    ScheduledFutureTask&lt;Void&gt; sft =</span></span>
<span class="line"><span>        new ScheduledFutureTask&lt;Void&gt;(command,</span></span>
<span class="line"><span>                                      null,</span></span>
<span class="line"><span>                                      triggerTime(initialDelay, unit),//计算任务的延迟时间</span></span>
<span class="line"><span>                                      unit.toNanos(period));//计算任务的执行周期</span></span>
<span class="line"><span>    RunnableScheduledFuture&lt;Void&gt; t = decorateTask(command, sft);//执行用户自定义逻辑</span></span>
<span class="line"><span>    sft.outerTask = t;//赋值给outerTask，准备重新入队等待下一次执行</span></span>
<span class="line"><span>    delayedExecute(t);//执行任务</span></span>
<span class="line"><span>    return t;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * 创建一个周期执行的任务，第一次执行延期时间为initialDelay，</span></span>
<span class="line"><span> * 在第一次执行完之后延迟delay后开始下一次执行</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public ScheduledFuture&lt;?&gt; scheduleWithFixedDelay(Runnable command,</span></span>
<span class="line"><span>                                                 long initialDelay,</span></span>
<span class="line"><span>                                                 long delay,</span></span>
<span class="line"><span>                                                 TimeUnit unit) {</span></span>
<span class="line"><span>    if (command == null || unit == null)</span></span>
<span class="line"><span>        throw new NullPointerException();</span></span>
<span class="line"><span>    if (delay &lt;= 0)</span></span>
<span class="line"><span>        throw new IllegalArgumentException();</span></span>
<span class="line"><span>    //构建RunnableScheduledFuture任务类型</span></span>
<span class="line"><span>    ScheduledFutureTask&lt;Void&gt; sft =</span></span>
<span class="line"><span>        new ScheduledFutureTask&lt;Void&gt;(command,</span></span>
<span class="line"><span>                                      null,</span></span>
<span class="line"><span>                                      triggerTime(initialDelay, unit),//计算任务的延迟时间</span></span>
<span class="line"><span>                                      unit.toNanos(-delay));//计算任务的执行周期</span></span>
<span class="line"><span>    RunnableScheduledFuture&lt;Void&gt; t = decorateTask(command, sft);//执行用户自定义逻辑</span></span>
<span class="line"><span>    sft.outerTask = t;//赋值给outerTask，准备重新入队等待下一次执行</span></span>
<span class="line"><span>    delayedExecute(t);//执行任务</span></span>
<span class="line"><span>    return t;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: scheduleAtFixedRate和scheduleWithFixedDelay方法的逻辑与schedule类似。</p><p><strong>注意scheduleAtFixedRate和scheduleWithFixedDelay的区别</strong>: 乍一看两个方法一模一样，其实，在unit.toNanos这一行代码中还是有区别的。没错，scheduleAtFixedRate传的是正值，而scheduleWithFixedDelay传的则是负值，这个值就是 ScheduledFutureTask 的period属性。</p><h3 id="核心方法-shutdown" tabindex="-1">核心方法:shutdown() <a class="header-anchor" href="#核心方法-shutdown" aria-label="Permalink to &quot;核心方法:shutdown()&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void shutdown() {</span></span>
<span class="line"><span>    super.shutdown();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//取消并清除由于关闭策略不应该运行的所有任务</span></span>
<span class="line"><span>@Override void onShutdown() {</span></span>
<span class="line"><span>    BlockingQueue&lt;Runnable&gt; q = super.getQueue();</span></span>
<span class="line"><span>    //获取run-after-shutdown参数</span></span>
<span class="line"><span>    boolean keepDelayed =</span></span>
<span class="line"><span>        getExecuteExistingDelayedTasksAfterShutdownPolicy();</span></span>
<span class="line"><span>    boolean keepPeriodic =</span></span>
<span class="line"><span>        getContinueExistingPeriodicTasksAfterShutdownPolicy();</span></span>
<span class="line"><span>    if (!keepDelayed &amp;&amp; !keepPeriodic) {//池关闭后不保留任务</span></span>
<span class="line"><span>        //依次取消任务</span></span>
<span class="line"><span>        for (Object e : q.toArray())</span></span>
<span class="line"><span>            if (e instanceof RunnableScheduledFuture&lt;?&gt;)</span></span>
<span class="line"><span>                ((RunnableScheduledFuture&lt;?&gt;) e).cancel(false);</span></span>
<span class="line"><span>        q.clear();//清除等待队列</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else {//池关闭后保留任务</span></span>
<span class="line"><span>        // Traverse snapshot to avoid iterator exceptions</span></span>
<span class="line"><span>        //遍历快照以避免迭代器异常</span></span>
<span class="line"><span>        for (Object e : q.toArray()) {</span></span>
<span class="line"><span>            if (e instanceof RunnableScheduledFuture) {</span></span>
<span class="line"><span>                RunnableScheduledFuture&lt;?&gt; t =</span></span>
<span class="line"><span>                    (RunnableScheduledFuture&lt;?&gt;)e;</span></span>
<span class="line"><span>                if ((t.isPeriodic() ? !keepPeriodic : !keepDelayed) ||</span></span>
<span class="line"><span>                    t.isCancelled()) { // also remove if already cancelled</span></span>
<span class="line"><span>                    //如果任务已经取消，移除队列中的任务</span></span>
<span class="line"><span>                    if (q.remove(t))</span></span>
<span class="line"><span>                        t.cancel(false);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    tryTerminate(); //终止线程池</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 池关闭方法调用了父类ThreadPoolExecutor的shutdown，具体分析见 ThreadPoolExecutor 篇。这里主要介绍以下在shutdown方法中调用的关闭钩子onShutdown方法，它的主要作用是在关闭线程池后取消并清除由于关闭策略不应该运行的所有任务，这里主要是根据 run-after-shutdown 参数(continueExistingPeriodicTasksAfterShutdown和executeExistingDelayedTasksAfterShutdown)来决定线程池关闭后是否关闭已经存在的任务。</p><h2 id="再深入理解" tabindex="-1">再深入理解 <a class="header-anchor" href="#再深入理解" aria-label="Permalink to &quot;再深入理解&quot;">​</a></h2><ul><li><strong>为什么ThreadPoolExecutor 的调整策略却不适用于 ScheduledThreadPoolExecutor？</strong></li></ul><p>例如: 由于 ScheduledThreadPoolExecutor 是一个固定核心线程数大小的线程池，并且使用了一个无界队列，所以调整maximumPoolSize对其没有任何影响(所以 ScheduledThreadPoolExecutor 没有提供可以调整最大线程数的构造函数，默认最大线程数固定为Integer.MAX_VALUE)。此外，设置corePoolSize为0或者设置核心线程空闲后清除(allowCoreThreadTimeOut)同样也不是一个好的策略，因为一旦周期任务到达某一次运行周期时，可能导致线程池内没有线程去处理这些任务。</p><ul><li><strong>Executors 提供了哪几种方法来构造 ScheduledThreadPoolExecutor？</strong><ul><li>newScheduledThreadPool: 可指定核心线程数的线程池。</li><li>newSingleThreadScheduledExecutor: 只有一个工作线程的线程池。如果内部工作线程由于执行周期任务异常而被终止，则会新建一个线程替代它的位置。</li></ul></li></ul><p>注意: newScheduledThreadPool(1, threadFactory) 不等价于newSingleThreadScheduledExecutor。newSingleThreadScheduledExecutor创建的线程池保证内部只有一个线程执行任务，并且线程数不可扩展；而通过newScheduledThreadPool(1, threadFactory)创建的线程池可以通过setCorePoolSize方法来修改核心线程数。</p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li>文章主要参考自泰迪的bagwell的<a href="https://www.jianshu.com/p/8c97953f2751%EF%BC%8C%E5%9C%A8%E6%AD%A4%E5%9F%BA%E7%A1%80%E4%B8%8A%E5%81%9A%E4%BA%86%E5%A2%9E%E6%94%B9%E3%80%82" target="_blank" rel="noreferrer">https://www.jianshu.com/p/8c97953f2751，在此基础上做了增改。</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,67)]))}const b=n(t,[["render",i]]);export{x as __pageData,b as default};
