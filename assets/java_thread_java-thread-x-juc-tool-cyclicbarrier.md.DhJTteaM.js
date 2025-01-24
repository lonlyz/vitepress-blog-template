import{_ as n,c as s,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const i="/vitepress-blog-template/images/thread/java-thread-x-cyclicbarrier-1.png",l="/vitepress-blog-template/images/thread/java-thread-x-cyclicbarrier-2.png",t="/vitepress-blog-template/images/thread/java-thread-x-cyclicbarrier-3.png",r="/vitepress-blog-template/images/thread/java-thread-x-cyclicbarrier-4.png",c="/vitepress-blog-template/images/thread/java-thread-x-cyclicbarrier-5.png",o="/vitepress-blog-template/images/thread/java-thread-x-cyclicbarrier-6.png",d="/vitepress-blog-template/images/thread/java-thread-x-cyclicbarrier-7.png",u="/vitepress-blog-template/images/thread/java-thread-x-cyclicbarrier-8.png",f=JSON.parse('{"title":"JUC工具类: CyclicBarrier详解","description":"","frontmatter":{},"headers":[],"relativePath":"java/thread/java-thread-x-juc-tool-cyclicbarrier.md","filePath":"java/thread/java-thread-x-juc-tool-cyclicbarrier.md","lastUpdated":1737706346000}'),h={name:"java/thread/java-thread-x-juc-tool-cyclicbarrier.md"};function b(g,a,m,v,y,k){return e(),s("div",null,a[0]||(a[0]=[p(`<h1 id="juc工具类-cyclicbarrier详解" tabindex="-1">JUC工具类: CyclicBarrier详解 <a class="header-anchor" href="#juc工具类-cyclicbarrier详解" aria-label="Permalink to &quot;JUC工具类: CyclicBarrier详解&quot;">​</a></h1><blockquote><p>CyclicBarrier底层是基于ReentrantLock和AbstractQueuedSynchronizer来实现的, 在理解的时候最好和CountDownLatch放在一起理解(相见本文分析)。@pdai</p></blockquote><h2 id="带着bat大厂的面试问题去理解" tabindex="-1">带着BAT大厂的面试问题去理解 <a class="header-anchor" href="#带着bat大厂的面试问题去理解" aria-label="Permalink to &quot;带着BAT大厂的面试问题去理解&quot;">​</a></h2><p>提示</p><p>请带着这些问题继续后文，会很大程度上帮助你更好的理解相关知识点。@pdai</p><ul><li>什么是CyclicBarrier?</li><li>CyclicBarrier底层实现原理?</li><li>CountDownLatch和CyclicBarrier对比?</li><li>CyclicBarrier的核心函数有哪些?</li><li>CyclicBarrier适用于什么场景?</li></ul><h2 id="cyclicbarrier简介" tabindex="-1">CyclicBarrier简介 <a class="header-anchor" href="#cyclicbarrier简介" aria-label="Permalink to &quot;CyclicBarrier简介&quot;">​</a></h2><ul><li><p>对于CountDownLatch，其他线程为游戏玩家，比如英雄联盟，主线程为控制游戏开始的线程。在所有的玩家都准备好之前，主线程是处于等待状态的，也就是游戏不能开始。当所有的玩家准备好之后，下一步的动作实施者为主线程，即开始游戏。</p></li><li><p>对于CyclicBarrier，假设有一家公司要全体员工进行团建活动，活动内容为翻越三个障碍物，每一个人翻越障碍物所用的时间是不一样的。但是公司要求所有人在翻越当前障碍物之后再开始翻越下一个障碍物，也就是所有人翻越第一个障碍物之后，才开始翻越第二个，以此类推。类比地，每一个员工都是一个“其他线程”。当所有人都翻越的所有的障碍物之后，程序才结束。而主线程可能早就结束了，这里我们不用管主线程。</p></li></ul><h2 id="cyclicbarrier源码分析" tabindex="-1">CyclicBarrier源码分析 <a class="header-anchor" href="#cyclicbarrier源码分析" aria-label="Permalink to &quot;CyclicBarrier源码分析&quot;">​</a></h2><h3 id="类的继承关系" tabindex="-1">类的继承关系 <a class="header-anchor" href="#类的继承关系" aria-label="Permalink to &quot;类的继承关系&quot;">​</a></h3><p>CyclicBarrier没有显示继承哪个父类或者实现哪个父接口, 所有AQS和重入锁不是通过继承实现的，而是通过组合实现的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class CyclicBarrier {}</span></span>
<span class="line"><span>\`\`\`　　</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### 类的内部类</span></span>
<span class="line"><span></span></span>
<span class="line"><span>CyclicBarrier类存在一个内部类Generation，每一次使用的CycBarrier可以当成Generation的实例，其源代码如下</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`\`\`java</span></span>
<span class="line"><span>private static class Generation {</span></span>
<span class="line"><span>    boolean broken = false;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: Generation类有一个属性broken，用来表示当前屏障是否被损坏。</p><h3 id="类的属性" tabindex="-1">类的属性 <a class="header-anchor" href="#类的属性" aria-label="Permalink to &quot;类的属性&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class CyclicBarrier {</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /** The lock for guarding barrier entry */</span></span>
<span class="line"><span>    // 可重入锁</span></span>
<span class="line"><span>    private final ReentrantLock lock = new ReentrantLock();</span></span>
<span class="line"><span>    /** Condition to wait on until tripped */</span></span>
<span class="line"><span>    // 条件队列</span></span>
<span class="line"><span>    private final Condition trip = lock.newCondition();</span></span>
<span class="line"><span>    /** The number of parties */</span></span>
<span class="line"><span>    // 参与的线程数量</span></span>
<span class="line"><span>    private final int parties;</span></span>
<span class="line"><span>    /* The command to run when tripped */</span></span>
<span class="line"><span>    // 由最后一个进入 barrier 的线程执行的操作</span></span>
<span class="line"><span>    private final Runnable barrierCommand;</span></span>
<span class="line"><span>    /** The current generation */</span></span>
<span class="line"><span>    // 当前代</span></span>
<span class="line"><span>    private Generation generation = new Generation();</span></span>
<span class="line"><span>    // 正在等待进入屏障的线程数量</span></span>
<span class="line"><span>    private int count;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 该属性有一个为ReentrantLock对象，有一个为Condition对象，而Condition对象又是基于AQS的，所以，归根到底，底层还是由AQS提供支持。</p><h3 id="类的构造函数" tabindex="-1">类的构造函数 <a class="header-anchor" href="#类的构造函数" aria-label="Permalink to &quot;类的构造函数&quot;">​</a></h3><ul><li>CyclicBarrier(int, Runnable)型构造函数</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public CyclicBarrier(int parties, Runnable barrierAction) {</span></span>
<span class="line"><span>    // 参与的线程数量小于等于0，抛出异常</span></span>
<span class="line"><span>    if (parties &lt;= 0) throw new IllegalArgumentException();</span></span>
<span class="line"><span>    // 设置parties</span></span>
<span class="line"><span>    this.parties = parties;</span></span>
<span class="line"><span>    // 设置count</span></span>
<span class="line"><span>    this.count = parties;</span></span>
<span class="line"><span>    // 设置barrierCommand</span></span>
<span class="line"><span>    this.barrierCommand = barrierAction;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 该构造函数可以指定关联该CyclicBarrier的线程数量，并且可以指定在所有线程都进入屏障后的执行动作，该执行动作由最后一个进行屏障的线程执行。</p><ul><li>CyclicBarrier(int)型构造函数</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public CyclicBarrier(int parties) {</span></span>
<span class="line"><span>    // 调用含有两个参数的构造函数</span></span>
<span class="line"><span>    this(parties, null);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 该构造函数仅仅执行了关联该CyclicBarrier的线程数量，没有设置执行动作。</p><h3 id="核心函数-dowait函数" tabindex="-1">核心函数 - dowait函数 <a class="header-anchor" href="#核心函数-dowait函数" aria-label="Permalink to &quot;核心函数 - dowait函数&quot;">​</a></h3><p>此函数为CyclicBarrier类的核心函数，CyclicBarrier类对外提供的await函数在底层都是调用该了doawait函数，其源代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private int dowait(boolean timed, long nanos)</span></span>
<span class="line"><span>    throws InterruptedException, BrokenBarrierException,</span></span>
<span class="line"><span>            TimeoutException {</span></span>
<span class="line"><span>    // 保存当前锁</span></span>
<span class="line"><span>    final ReentrantLock lock = this.lock;</span></span>
<span class="line"><span>    // 锁定</span></span>
<span class="line"><span>    lock.lock();</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        // 保存当前代</span></span>
<span class="line"><span>        final Generation g = generation;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        if (g.broken) // 屏障被破坏，抛出异常</span></span>
<span class="line"><span>            throw new BrokenBarrierException();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (Thread.interrupted()) { // 线程被中断</span></span>
<span class="line"><span>            // 损坏当前屏障，并且唤醒所有的线程，只有拥有锁的时候才会调用</span></span>
<span class="line"><span>            breakBarrier();</span></span>
<span class="line"><span>            // 抛出异常</span></span>
<span class="line"><span>            throw new InterruptedException();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        // 减少正在等待进入屏障的线程数量</span></span>
<span class="line"><span>        int index = --count;</span></span>
<span class="line"><span>        if (index == 0) {  // 正在等待进入屏障的线程数量为0，所有线程都已经进入</span></span>
<span class="line"><span>            // 运行的动作标识</span></span>
<span class="line"><span>            boolean ranAction = false;</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                // 保存运行动作</span></span>
<span class="line"><span>                final Runnable command = barrierCommand;</span></span>
<span class="line"><span>                if (command != null) // 动作不为空</span></span>
<span class="line"><span>                    // 运行</span></span>
<span class="line"><span>                    command.run();</span></span>
<span class="line"><span>                // 设置ranAction状态</span></span>
<span class="line"><span>                ranAction = true;</span></span>
<span class="line"><span>                // 进入下一代</span></span>
<span class="line"><span>                nextGeneration();</span></span>
<span class="line"><span>                return 0;</span></span>
<span class="line"><span>            } finally {</span></span>
<span class="line"><span>                if (!ranAction) // 没有运行的动作</span></span>
<span class="line"><span>                    // 损坏当前屏障</span></span>
<span class="line"><span>                    breakBarrier();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // loop until tripped, broken, interrupted, or timed out</span></span>
<span class="line"><span>        // 无限循环</span></span>
<span class="line"><span>        for (;;) {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                if (!timed) // 没有设置等待时间</span></span>
<span class="line"><span>                    // 等待</span></span>
<span class="line"><span>                    trip.await(); </span></span>
<span class="line"><span>                else if (nanos &gt; 0L) // 设置了等待时间，并且等待时间大于0</span></span>
<span class="line"><span>                    // 等待指定时长</span></span>
<span class="line"><span>                    nanos = trip.awaitNanos(nanos);</span></span>
<span class="line"><span>            } catch (InterruptedException ie) { </span></span>
<span class="line"><span>                if (g == generation &amp;&amp; ! g.broken) { // 等于当前代并且屏障没有被损坏</span></span>
<span class="line"><span>                    // 损坏当前屏障</span></span>
<span class="line"><span>                    breakBarrier();</span></span>
<span class="line"><span>                    // 抛出异常</span></span>
<span class="line"><span>                    throw ie;</span></span>
<span class="line"><span>                } else { // 不等于当前带后者是屏障被损坏</span></span>
<span class="line"><span>                    // We&#39;re about to finish waiting even if we had not</span></span>
<span class="line"><span>                    // been interrupted, so this interrupt is deemed to</span></span>
<span class="line"><span>                    // &quot;belong&quot; to subsequent execution.</span></span>
<span class="line"><span>                    // 中断当前线程</span></span>
<span class="line"><span>                    Thread.currentThread().interrupt();</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if (g.broken) // 屏障被损坏，抛出异常</span></span>
<span class="line"><span>                throw new BrokenBarrierException();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if (g != generation) // 不等于当前代</span></span>
<span class="line"><span>                // 返回索引</span></span>
<span class="line"><span>                return index;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if (timed &amp;&amp; nanos &lt;= 0L) { // 设置了等待时间，并且等待时间小于0</span></span>
<span class="line"><span>                // 损坏屏障</span></span>
<span class="line"><span>                breakBarrier();</span></span>
<span class="line"><span>                // 抛出异常</span></span>
<span class="line"><span>                throw new TimeoutException();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        // 释放锁</span></span>
<span class="line"><span>        lock.unlock();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: dowait方法的逻辑会进行一系列的判断，大致流程如下:</p><p><img src="`+i+`" alt="error.图片加载失败"></p><h3 id="核心函数-nextgeneration函数" tabindex="-1">核心函数 - nextGeneration函数 <a class="header-anchor" href="#核心函数-nextgeneration函数" aria-label="Permalink to &quot;核心函数 - nextGeneration函数&quot;">​</a></h3><p>此函数在所有线程进入屏障后会被调用，即生成下一个版本，所有线程又可以重新进入到屏障中，其源代码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void nextGeneration() {</span></span>
<span class="line"><span>    // signal completion of last generation</span></span>
<span class="line"><span>    // 唤醒所有线程</span></span>
<span class="line"><span>    trip.signalAll();</span></span>
<span class="line"><span>    // set up next generation</span></span>
<span class="line"><span>    // 恢复正在等待进入屏障的线程数量</span></span>
<span class="line"><span>    count = parties;</span></span>
<span class="line"><span>    // 新生一代</span></span>
<span class="line"><span>    generation = new Generation();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在此函数中会调用AQS的signalAll方法，即唤醒所有等待线程。如果所有的线程都在等待此条件，则唤醒所有线程。其源代码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final void signalAll() {</span></span>
<span class="line"><span>    if (!isHeldExclusively()) // 不被当前线程独占，抛出异常</span></span>
<span class="line"><span>        throw new IllegalMonitorStateException();</span></span>
<span class="line"><span>    // 保存condition队列头节点</span></span>
<span class="line"><span>    Node first = firstWaiter;</span></span>
<span class="line"><span>    if (first != null) // 头节点不为空</span></span>
<span class="line"><span>        // 唤醒所有等待线程</span></span>
<span class="line"><span>        doSignalAll(first);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 此函数判断头节点是否为空，即条件队列是否为空，然后会调用doSignalAll函数，doSignalAll函数源码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void doSignalAll(Node first) {</span></span>
<span class="line"><span>    // condition队列的头节点尾结点都设置为空</span></span>
<span class="line"><span>    lastWaiter = firstWaiter = null;</span></span>
<span class="line"><span>    // 循环</span></span>
<span class="line"><span>    do {</span></span>
<span class="line"><span>        // 获取first结点的nextWaiter域结点</span></span>
<span class="line"><span>        Node next = first.nextWaiter;</span></span>
<span class="line"><span>        // 设置first结点的nextWaiter域为空</span></span>
<span class="line"><span>        first.nextWaiter = null;</span></span>
<span class="line"><span>        // 将first结点从condition队列转移到sync队列</span></span>
<span class="line"><span>        transferForSignal(first);</span></span>
<span class="line"><span>        // 重新设置first</span></span>
<span class="line"><span>        first = next;</span></span>
<span class="line"><span>    } while (first != null);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 此函数会依次将条件队列中的节点转移到同步队列中，会调用到transferForSignal函数，其源码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final boolean transferForSignal(Node node) {</span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>        * If cannot change waitStatus, the node has been cancelled.</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    if (!compareAndSetWaitStatus(node, Node.CONDITION, 0))</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>        * Splice onto queue and try to set waitStatus of predecessor to</span></span>
<span class="line"><span>        * indicate that thread is (probably) waiting. If cancelled or</span></span>
<span class="line"><span>        * attempt to set waitStatus fails, wake up to resync (in which</span></span>
<span class="line"><span>        * case the waitStatus can be transiently and harmlessly wrong).</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    Node p = enq(node);</span></span>
<span class="line"><span>    int ws = p.waitStatus;</span></span>
<span class="line"><span>    if (ws &gt; 0 || !compareAndSetWaitStatus(p, ws, Node.SIGNAL))</span></span>
<span class="line"><span>        LockSupport.unpark(node.thread);</span></span>
<span class="line"><span>    return true;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 此函数的作用就是将处于条件队列中的节点转移到同步队列中，并设置结点的状态信息，其中会调用到enq函数，其源代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private Node enq(final Node node) {</span></span>
<span class="line"><span>    for (;;) { // 无限循环，确保结点能够成功入队列</span></span>
<span class="line"><span>        // 保存尾结点</span></span>
<span class="line"><span>        Node t = tail;</span></span>
<span class="line"><span>        if (t == null) { // 尾结点为空，即还没被初始化</span></span>
<span class="line"><span>            if (compareAndSetHead(new Node())) // 头节点为空，并设置头节点为新生成的结点</span></span>
<span class="line"><span>                tail = head; // 头节点与尾结点都指向同一个新生结点</span></span>
<span class="line"><span>        } else { // 尾结点不为空，即已经被初始化过</span></span>
<span class="line"><span>            // 将node结点的prev域连接到尾结点</span></span>
<span class="line"><span>            node.prev = t; </span></span>
<span class="line"><span>            if (compareAndSetTail(t, node)) { // 比较结点t是否为尾结点，若是则将尾结点设置为node</span></span>
<span class="line"><span>                // 设置尾结点的next域为node</span></span>
<span class="line"><span>                t.next = node; </span></span>
<span class="line"><span>                return t; // 返回尾结点</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 此函数完成了结点插入同步队列的过程，也很好理解。</p><p>综合上面的分析可知，newGeneration函数的主要方法的调用如下，之后会通过一个例子详细讲解:</p><p><img src="`+l+`" alt="error.图片加载失败"></p><h3 id="breakbarrier函数" tabindex="-1">breakBarrier函数 <a class="header-anchor" href="#breakbarrier函数" aria-label="Permalink to &quot;breakBarrier函数&quot;">​</a></h3><p>此函数的作用是损坏当前屏障，会唤醒所有在屏障中的线程。源代码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void breakBarrier() {</span></span>
<span class="line"><span>    // 设置状态</span></span>
<span class="line"><span>    generation.broken = true;</span></span>
<span class="line"><span>    // 恢复正在等待进入屏障的线程数量</span></span>
<span class="line"><span>    count = parties;</span></span>
<span class="line"><span>    // 唤醒所有线程</span></span>
<span class="line"><span>    trip.signalAll();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 可以看到，此函数也调用了AQS的signalAll函数，由signal函数提供支持。</p><h2 id="cyclicbarrier示例" tabindex="-1">CyclicBarrier示例 <a class="header-anchor" href="#cyclicbarrier示例" aria-label="Permalink to &quot;CyclicBarrier示例&quot;">​</a></h2><p>下面通过一个例子来详解CyclicBarrier的使用和内部工作机制，源代码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.concurrent.BrokenBarrierException;</span></span>
<span class="line"><span>import java.util.concurrent.CyclicBarrier;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class MyThread extends Thread {</span></span>
<span class="line"><span>    private CyclicBarrier cb;</span></span>
<span class="line"><span>    public MyThread(String name, CyclicBarrier cb) {</span></span>
<span class="line"><span>        super(name);</span></span>
<span class="line"><span>        this.cb = cb;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public void run() {</span></span>
<span class="line"><span>        System.out.println(Thread.currentThread().getName() + &quot; going to await&quot;);</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            cb.await();</span></span>
<span class="line"><span>            System.out.println(Thread.currentThread().getName() + &quot; continue&quot;);</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class CyclicBarrierDemo {</span></span>
<span class="line"><span>    public static void main(String[] args) throws InterruptedException, BrokenBarrierException {</span></span>
<span class="line"><span>        CyclicBarrier cb = new CyclicBarrier(3, new Thread(&quot;barrierAction&quot;) {</span></span>
<span class="line"><span>            public void run() {</span></span>
<span class="line"><span>                System.out.println(Thread.currentThread().getName() + &quot; barrier action&quot;);</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>        MyThread t1 = new MyThread(&quot;t1&quot;, cb);</span></span>
<span class="line"><span>        MyThread t2 = new MyThread(&quot;t2&quot;, cb);</span></span>
<span class="line"><span>        t1.start();</span></span>
<span class="line"><span>        t2.start();</span></span>
<span class="line"><span>        System.out.println(Thread.currentThread().getName() + &quot; going to await&quot;);</span></span>
<span class="line"><span>        cb.await();</span></span>
<span class="line"><span>        System.out.println(Thread.currentThread().getName() + &quot; continue&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行结果(某一次):</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>t1 going to await</span></span>
<span class="line"><span>main going to await</span></span>
<span class="line"><span>t2 going to await</span></span>
<span class="line"><span>t2 barrier action</span></span>
<span class="line"><span>t2 continue</span></span>
<span class="line"><span>t1 continue</span></span>
<span class="line"><span>main continue</span></span></code></pre></div><p>说明: 根据结果可知，可能会存在如下的调用时序。</p><p><img src="`+t+'" alt="error.图片加载失败"></p><p>说明: 由上图可知，假设t1线程的cb.await是在main线程的cb.barrierAction动作是由最后一个进入屏障的线程执行的。根据时序图，进一步分析出其内部工作流程。</p><ul><li>main(主)线程执行cb.await操作，主要调用的函数如下。</li></ul><p><img src="'+r+'" alt="error.图片加载失败"></p><p>说明: 由于ReentrantLock的默认采用非公平策略，所以在dowait函数中调用的是ReentrantLock.NonfairSync的lock函数，由于此时AQS的状态是0，表示还没有被任何线程占用，故main线程可以占用，之后在dowait中会调用trip.await函数，最终的结果是条件队列中存放了一个包含main线程的结点，并且被禁止运行了，同时，main线程所拥有的资源也被释放了，可以供其他线程获取。</p><ul><li>t1线程执行cb.await操作，其中假设t1线程的lock.lock操作在main线程释放了资源之后，则其主要调用的函数如下。</li></ul><p><img src="'+c+'" alt="error.图片加载失败"></p><p>说明: 可以看到，之后condition queue(条件队列)里面有两个节点，包含t1线程的结点插入在队列的尾部，并且t1线程也被禁止了，因为执行了park操作，此时两个线程都被禁止了。</p><ul><li>t2线程执行cb.await操作，其中假设t2线程的lock.lock操作在t1线程释放了资源之后，则其主要调用的函数如下。</li></ul><p><img src="'+o+'" alt="error.图片加载失败"></p><p>说明: 由上图可知，在t2线程执行await操作后，会直接执行command.run方法，不是重新开启一个线程，而是最后进入屏障的线程执行。同时，会将Condition queue中的所有节点都转移到Sync queue中，并且最后main线程会被unpark，可以继续运行。main线程获取cpu资源，继续运行。</p><ul><li>main线程获取cpu资源，继续运行，下图给出了主要的方法调用:</li></ul><p><img src="'+d+'" alt="error.图片加载失败"></p><p>说明: 其中，由于main线程是在AQS.CO的wait中被park的，所以恢复时，会继续在该方法中运行。运行过后，t1线程被unpark，它获得cpu资源可以继续运行。</p><ul><li>t1线程获取cpu资源，继续运行，下图给出了主要的方法调用。</li></ul><p><img src="'+u+'" alt="error.图片加载失败"></p><p>说明: 其中，由于t1线程是在AQS.CO的wait方法中被park，所以恢复时，会继续在该方法中运行。运行过后，Sync queue中保持着一个空节点。头节点与尾节点均指向它。</p><p>注意: 在线程await过程中中断线程会抛出异常，所有进入屏障的线程都将被释放。至于CyclicBarrier的其他用法，读者可以自行查阅API，不再累赘。</p><h2 id="和countdonwlatch再对比" tabindex="-1">和CountDonwLatch再对比 <a class="header-anchor" href="#和countdonwlatch再对比" aria-label="Permalink to &quot;和CountDonwLatch再对比&quot;">​</a></h2><ul><li>CountDownLatch减计数，CyclicBarrier加计数。</li><li>CountDownLatch是一次性的，CyclicBarrier可以重用。</li><li>CountDownLatch和CyclicBarrier都有让多个线程等待同步然后再开始下一步动作的意思，但是CountDownLatch的下一步的动作实施者是主线程，具有不可重复性；而CyclicBarrier的下一步动作实施者还是“其他线程”本身，具有往复多次实施动作的特点。</li></ul><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li>文章主要参考自leesf的<a href="https://www.cnblogs.com/leesf456/p/5392816.html%EF%BC%8C%E5%9C%A8%E6%AD%A4%E5%9F%BA%E7%A1%80%E4%B8%8A%E5%81%9A%E4%BA%86%E5%A2%9E%E6%94%B9%E3%80%82" target="_blank" rel="noreferrer">https://www.cnblogs.com/leesf456/p/5392816.html，在此基础上做了增改。</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',75)]))}const w=n(h,[["render",b]]);export{f as __pageData,w as default};
