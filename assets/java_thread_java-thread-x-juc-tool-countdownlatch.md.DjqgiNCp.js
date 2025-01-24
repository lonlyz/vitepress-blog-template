import{_ as a,c as s,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/thread/java-thread-x-countdownlatch-1.png",t="/vitepress-blog-template/images/thread/java-thread-x-countdownlatch-2.png",i="/vitepress-blog-template/images/thread/java-thread-x-countdownlatch-3.png",c="/vitepress-blog-template/images/thread/java-thread-x-countdownlatch-4.png",o="/vitepress-blog-template/images/thread/java-thread-x-countdownlatch-5.png",r="/vitepress-blog-template/images/thread/java-thread-x-countdownlatch-6.png",d="/vitepress-blog-template/images/thread/java-thread-x-countdownlatch-7.png",y=JSON.parse('{"title":"JUC工具类: CountDownLatch详解","description":"","frontmatter":{},"headers":[],"relativePath":"java/thread/java-thread-x-juc-tool-countdownlatch.md","filePath":"java/thread/java-thread-x-juc-tool-countdownlatch.md","lastUpdated":1737706346000}'),u={name:"java/thread/java-thread-x-juc-tool-countdownlatch.md"};function h(g,n,w,b,m,v){return e(),s("div",null,n[0]||(n[0]=[p(`<h1 id="juc工具类-countdownlatch详解" tabindex="-1">JUC工具类: CountDownLatch详解 <a class="header-anchor" href="#juc工具类-countdownlatch详解" aria-label="Permalink to &quot;JUC工具类: CountDownLatch详解&quot;">​</a></h1><blockquote><p>CountDownLatch底层也是由AQS，用来同步一个或多个任务的常用并发工具类，强制它们等待由其他任务执行的一组操作完成。@pdai</p></blockquote><h2 id="带着bat大厂的面试问题去理解" tabindex="-1">带着BAT大厂的面试问题去理解 <a class="header-anchor" href="#带着bat大厂的面试问题去理解" aria-label="Permalink to &quot;带着BAT大厂的面试问题去理解&quot;">​</a></h2><p>提示</p><p>请带着这些问题继续后文，会很大程度上帮助你更好的理解相关知识点。@pdai</p><ul><li>什么是CountDownLatch?</li><li>CountDownLatch底层实现原理?</li><li>CountDownLatch一次可以唤醒几个任务? 多个</li><li>CountDownLatch有哪些主要方法? await(),countDown()</li><li>CountDownLatch适用于什么场景?</li><li>写道题：实现一个容器，提供两个方法，add，size 写两个线程，线程1添加10个元素到容器中，线程2实现监控元素的个数，当个数到5个时，线程2给出提示并结束? 使用CountDownLatch 代替wait notify 好处。</li></ul><h2 id="countdownlatch介绍" tabindex="-1">CountDownLatch介绍 <a class="header-anchor" href="#countdownlatch介绍" aria-label="Permalink to &quot;CountDownLatch介绍&quot;">​</a></h2><p>从源码可知，其底层是由AQS提供支持，所以其数据结构可以参考AQS的数据结构，而AQS的数据结构核心就是两个虚拟队列: 同步队列sync queue 和条件队列condition queue，不同的条件会有不同的条件队列。CountDownLatch典型的用法是将一个程序分为n个互相独立的可解决任务，并创建值为n的CountDownLatch。当每一个任务完成时，都会在这个锁存器上调用countDown，等待问题被解决的任务调用这个锁存器的await，将他们自己拦住，直至锁存器计数结束。</p><h2 id="countdownlatch源码分析" tabindex="-1">CountDownLatch源码分析 <a class="header-anchor" href="#countdownlatch源码分析" aria-label="Permalink to &quot;CountDownLatch源码分析&quot;">​</a></h2><h3 id="类的继承关系" tabindex="-1">类的继承关系 <a class="header-anchor" href="#类的继承关系" aria-label="Permalink to &quot;类的继承关系&quot;">​</a></h3><p>CountDownLatch没有显示继承哪个父类或者实现哪个父接口, 它底层是AQS是通过内部类Sync来实现的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class CountDownLatch {}</span></span></code></pre></div><h3 id="类的内部类" tabindex="-1">类的内部类 <a class="header-anchor" href="#类的内部类" aria-label="Permalink to &quot;类的内部类&quot;">​</a></h3><p>CountDownLatch类存在一个内部类Sync，继承自AbstractQueuedSynchronizer，其源代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static final class Sync extends AbstractQueuedSynchronizer {</span></span>
<span class="line"><span>    // 版本号</span></span>
<span class="line"><span>    private static final long serialVersionUID = 4982264981922014374L;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 构造器</span></span>
<span class="line"><span>    Sync(int count) {</span></span>
<span class="line"><span>        setState(count);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 返回当前计数</span></span>
<span class="line"><span>    int getCount() {</span></span>
<span class="line"><span>        return getState();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 试图在共享模式下获取对象状态</span></span>
<span class="line"><span>    protected int tryAcquireShared(int acquires) {</span></span>
<span class="line"><span>        return (getState() == 0) ? 1 : -1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 试图设置状态来反映共享模式下的一个释放</span></span>
<span class="line"><span>    protected boolean tryReleaseShared(int releases) {</span></span>
<span class="line"><span>        // Decrement count; signal when transition to zero</span></span>
<span class="line"><span>        // 无限循环</span></span>
<span class="line"><span>        for (;;) {</span></span>
<span class="line"><span>            // 获取状态</span></span>
<span class="line"><span>            int c = getState();</span></span>
<span class="line"><span>            if (c == 0) // 没有被线程占有</span></span>
<span class="line"><span>                return false;</span></span>
<span class="line"><span>            // 下一个状态</span></span>
<span class="line"><span>            int nextc = c-1;</span></span>
<span class="line"><span>            if (compareAndSetState(c, nextc)) // 比较并且设置成功</span></span>
<span class="line"><span>                return nextc == 0;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 对CountDownLatch方法的调用会转发到对Sync或AQS的方法的调用，所以，AQS对CountDownLatch提供支持。</p><h3 id="类的属性" tabindex="-1">类的属性 <a class="header-anchor" href="#类的属性" aria-label="Permalink to &quot;类的属性&quot;">​</a></h3><p>可以看到CountDownLatch类的内部只有一个Sync类型的属性:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class CountDownLatch {</span></span>
<span class="line"><span>    // 同步队列</span></span>
<span class="line"><span>    private final Sync sync;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="类的构造函数" tabindex="-1">类的构造函数 <a class="header-anchor" href="#类的构造函数" aria-label="Permalink to &quot;类的构造函数&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public CountDownLatch(int count) {</span></span>
<span class="line"><span>    if (count &lt; 0) throw new IllegalArgumentException(&quot;count &lt; 0&quot;);</span></span>
<span class="line"><span>    // 初始化状态数</span></span>
<span class="line"><span>    this.sync = new Sync(count);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 该构造函数可以构造一个用给定计数初始化的CountDownLatch，并且构造函数内完成了sync的初始化，并设置了状态数。</p><h3 id="核心函数-await函数" tabindex="-1">核心函数 - await函数 <a class="header-anchor" href="#核心函数-await函数" aria-label="Permalink to &quot;核心函数 - await函数&quot;">​</a></h3><p>此函数将会使当前线程在锁存器倒计数至零之前一直等待，除非线程被中断。其源码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void await() throws InterruptedException {</span></span>
<span class="line"><span>    // 转发到sync对象上</span></span>
<span class="line"><span>    sync.acquireSharedInterruptibly(1);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 由源码可知，对CountDownLatch对象的await的调用会转发为对Sync的acquireSharedInterruptibly(从AQS继承的方法)方法的调用。</p><ul><li>acquireSharedInterruptibly源码如下:</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final void acquireSharedInterruptibly(int arg)</span></span>
<span class="line"><span>        throws InterruptedException {</span></span>
<span class="line"><span>    if (Thread.interrupted())</span></span>
<span class="line"><span>        throw new InterruptedException();</span></span>
<span class="line"><span>    if (tryAcquireShared(arg) &lt; 0)</span></span>
<span class="line"><span>        doAcquireSharedInterruptibly(arg);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 从源码中可知，acquireSharedInterruptibly又调用了CountDownLatch的内部类Sync的tryAcquireShared和AQS的doAcquireSharedInterruptibly函数。</p><ul><li>tryAcquireShared函数的源码如下:</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected int tryAcquireShared(int acquires) {</span></span>
<span class="line"><span>    return (getState() == 0) ? 1 : -1;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 该函数只是简单的判断AQS的state是否为0，为0则返回1，不为0则返回-1。</p><ul><li>doAcquireSharedInterruptibly函数的源码如下:</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void doAcquireSharedInterruptibly(int arg) throws InterruptedException {</span></span>
<span class="line"><span>    // 添加节点至等待队列</span></span>
<span class="line"><span>    final Node node = addWaiter(Node.SHARED);</span></span>
<span class="line"><span>    boolean failed = true;</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        for (;;) { // 无限循环</span></span>
<span class="line"><span>            // 获取node的前驱节点</span></span>
<span class="line"><span>            final Node p = node.predecessor();</span></span>
<span class="line"><span>            if (p == head) { // 前驱节点为头节点</span></span>
<span class="line"><span>                // 试图在共享模式下获取对象状态</span></span>
<span class="line"><span>                int r = tryAcquireShared(arg);</span></span>
<span class="line"><span>                if (r &gt;= 0) { // 获取成功</span></span>
<span class="line"><span>                    // 设置头节点并进行繁殖</span></span>
<span class="line"><span>                    setHeadAndPropagate(node, r);</span></span>
<span class="line"><span>                    // 设置节点next域</span></span>
<span class="line"><span>                    p.next = null; // help GC</span></span>
<span class="line"><span>                    failed = false;</span></span>
<span class="line"><span>                    return;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (shouldParkAfterFailedAcquire(p, node) &amp;&amp;</span></span>
<span class="line"><span>                parkAndCheckInterrupt()) // 在获取失败后是否需要禁止线程并且进行中断检查</span></span>
<span class="line"><span>                // 抛出异常</span></span>
<span class="line"><span>                throw new InterruptedException();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        if (failed)</span></span>
<span class="line"><span>            cancelAcquire(node);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 在AQS的doAcquireSharedInterruptibly中可能会再次调用CountDownLatch的内部类Sync的tryAcquireShared方法和AQS的setHeadAndPropagate方法。</p><ul><li>setHeadAndPropagate方法源码如下。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void setHeadAndPropagate(Node node, int propagate) {</span></span>
<span class="line"><span>    // 获取头节点</span></span>
<span class="line"><span>    Node h = head; // Record old head for check below</span></span>
<span class="line"><span>    // 设置头节点</span></span>
<span class="line"><span>    setHead(node);</span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>        * Try to signal next queued node if:</span></span>
<span class="line"><span>        *   Propagation was indicated by caller,</span></span>
<span class="line"><span>        *     or was recorded (as h.waitStatus either before</span></span>
<span class="line"><span>        *     or after setHead) by a previous operation</span></span>
<span class="line"><span>        *     (note: this uses sign-check of waitStatus because</span></span>
<span class="line"><span>        *      PROPAGATE status may transition to SIGNAL.)</span></span>
<span class="line"><span>        * and</span></span>
<span class="line"><span>        *   The next node is waiting in shared mode,</span></span>
<span class="line"><span>        *     or we don&#39;t know, because it appears null</span></span>
<span class="line"><span>        *</span></span>
<span class="line"><span>        * The conservatism in both of these checks may cause</span></span>
<span class="line"><span>        * unnecessary wake-ups, but only when there are multiple</span></span>
<span class="line"><span>        * racing acquires/releases, so most need signals now or soon</span></span>
<span class="line"><span>        * anyway.</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    // 进行判断</span></span>
<span class="line"><span>    if (propagate &gt; 0 || h == null || h.waitStatus &lt; 0 ||</span></span>
<span class="line"><span>        (h = head) == null || h.waitStatus &lt; 0) {</span></span>
<span class="line"><span>        // 获取节点的后继</span></span>
<span class="line"><span>        Node s = node.next;</span></span>
<span class="line"><span>        if (s == null || s.isShared()) // 后继为空或者为共享模式</span></span>
<span class="line"><span>            // 以共享模式进行释放</span></span>
<span class="line"><span>            doReleaseShared();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 该方法设置头节点并且释放头节点后面的满足条件的结点，该方法中可能会调用到AQS的doReleaseShared方法，其源码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void doReleaseShared() {</span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>        * Ensure that a release propagates, even if there are other</span></span>
<span class="line"><span>        * in-progress acquires/releases.  This proceeds in the usual</span></span>
<span class="line"><span>        * way of trying to unparkSuccessor of head if it needs</span></span>
<span class="line"><span>        * signal. But if it does not, status is set to PROPAGATE to</span></span>
<span class="line"><span>        * ensure that upon release, propagation continues.</span></span>
<span class="line"><span>        * Additionally, we must loop in case a new node is added</span></span>
<span class="line"><span>        * while we are doing this. Also, unlike other uses of</span></span>
<span class="line"><span>        * unparkSuccessor, we need to know if CAS to reset status</span></span>
<span class="line"><span>        * fails, if so rechecking.</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    // 无限循环</span></span>
<span class="line"><span>    for (;;) {</span></span>
<span class="line"><span>        // 保存头节点</span></span>
<span class="line"><span>        Node h = head;</span></span>
<span class="line"><span>        if (h != null &amp;&amp; h != tail) { // 头节点不为空并且头节点不为尾结点</span></span>
<span class="line"><span>            // 获取头节点的等待状态</span></span>
<span class="line"><span>            int ws = h.waitStatus; </span></span>
<span class="line"><span>            if (ws == Node.SIGNAL) { // 状态为SIGNAL</span></span>
<span class="line"><span>                if (!compareAndSetWaitStatus(h, Node.SIGNAL, 0)) // 不成功就继续</span></span>
<span class="line"><span>                    continue;            // loop to recheck cases</span></span>
<span class="line"><span>                // 释放后继结点</span></span>
<span class="line"><span>                unparkSuccessor(h);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if (ws == 0 &amp;&amp;</span></span>
<span class="line"><span>                        !compareAndSetWaitStatus(h, 0, Node.PROPAGATE)) // 状态为0并且不成功，继续</span></span>
<span class="line"><span>                continue;                // loop on failed CAS</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (h == head) // 若头节点改变，继续循环  </span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 该方法在共享模式下释放，具体的流程再之后会通过一个示例给出。</p><p>所以，对CountDownLatch的await调用大致会有如下的调用链。</p><p><img src="`+l+`" alt="error.图片加载失败"></p><p>说明: 上图给出了可能会调用到的主要方法，并非一定会调用到，之后，会通过一个示例给出详细的分析。</p><h3 id="核心函数-countdown函数" tabindex="-1">核心函数 - countDown函数 <a class="header-anchor" href="#核心函数-countdown函数" aria-label="Permalink to &quot;核心函数 - countDown函数&quot;">​</a></h3><p>此函数将递减锁存器的计数，如果计数到达零，则释放所有等待的线程</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void countDown() {</span></span>
<span class="line"><span>    sync.releaseShared(1);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 对countDown的调用转换为对Sync对象的releaseShared(从AQS继承而来)方法的调用。</p><ul><li>releaseShared源码如下</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final boolean releaseShared(int arg) {</span></span>
<span class="line"><span>    if (tryReleaseShared(arg)) {</span></span>
<span class="line"><span>        doReleaseShared();</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return false;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 此函数会以共享模式释放对象，并且在函数中会调用到CountDownLatch的tryReleaseShared函数，并且可能会调用AQS的doReleaseShared函数。</p><ul><li>tryReleaseShared源码如下</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected boolean tryReleaseShared(int releases) {</span></span>
<span class="line"><span>    // Decrement count; signal when transition to zero</span></span>
<span class="line"><span>    // 无限循环</span></span>
<span class="line"><span>    for (;;) {</span></span>
<span class="line"><span>        // 获取状态</span></span>
<span class="line"><span>        int c = getState();</span></span>
<span class="line"><span>        if (c == 0) // 没有被线程占有</span></span>
<span class="line"><span>            return false;</span></span>
<span class="line"><span>        // 下一个状态</span></span>
<span class="line"><span>        int nextc = c-1;</span></span>
<span class="line"><span>        if (compareAndSetState(c, nextc)) // 比较并且设置成功</span></span>
<span class="line"><span>            return nextc == 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 此函数会试图设置状态来反映共享模式下的一个释放。具体的流程在下面的示例中会进行分析。</p><ul><li>AQS的doReleaseShared的源码如下</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void doReleaseShared() {</span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>        * Ensure that a release propagates, even if there are other</span></span>
<span class="line"><span>        * in-progress acquires/releases.  This proceeds in the usual</span></span>
<span class="line"><span>        * way of trying to unparkSuccessor of head if it needs</span></span>
<span class="line"><span>        * signal. But if it does not, status is set to PROPAGATE to</span></span>
<span class="line"><span>        * ensure that upon release, propagation continues.</span></span>
<span class="line"><span>        * Additionally, we must loop in case a new node is added</span></span>
<span class="line"><span>        * while we are doing this. Also, unlike other uses of</span></span>
<span class="line"><span>        * unparkSuccessor, we need to know if CAS to reset status</span></span>
<span class="line"><span>        * fails, if so rechecking.</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    // 无限循环</span></span>
<span class="line"><span>    for (;;) {</span></span>
<span class="line"><span>        // 保存头节点</span></span>
<span class="line"><span>        Node h = head;</span></span>
<span class="line"><span>        if (h != null &amp;&amp; h != tail) { // 头节点不为空并且头节点不为尾结点</span></span>
<span class="line"><span>            // 获取头节点的等待状态</span></span>
<span class="line"><span>            int ws = h.waitStatus; </span></span>
<span class="line"><span>            if (ws == Node.SIGNAL) { // 状态为SIGNAL</span></span>
<span class="line"><span>                if (!compareAndSetWaitStatus(h, Node.SIGNAL, 0)) // 不成功就继续</span></span>
<span class="line"><span>                    continue;            // loop to recheck cases</span></span>
<span class="line"><span>                // 释放后继结点</span></span>
<span class="line"><span>                unparkSuccessor(h);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else if (ws == 0 &amp;&amp;</span></span>
<span class="line"><span>                        !compareAndSetWaitStatus(h, 0, Node.PROPAGATE)) // 状态为0并且不成功，继续</span></span>
<span class="line"><span>                continue;                // loop on failed CAS</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (h == head) // 若头节点改变，继续循环  </span></span>
<span class="line"><span>            break;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 此函数在共享模式下释放资源。</p><p>所以，对CountDownLatch的countDown调用大致会有如下的调用链。</p><p><img src="`+t+`" alt="error.图片加载失败"></p><p>说明: 上图给出了可能会调用到的主要方法，并非一定会调用到，之后，会通过一个示例给出详细的分析。</p><h2 id="countdownlatch示例" tabindex="-1">CountDownLatch示例 <a class="header-anchor" href="#countdownlatch示例" aria-label="Permalink to &quot;CountDownLatch示例&quot;">​</a></h2><p>下面给出了一个使用CountDownLatch的示例。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.concurrent.CountDownLatch;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class MyThread extends Thread {</span></span>
<span class="line"><span>    private CountDownLatch countDownLatch;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public MyThread(String name, CountDownLatch countDownLatch) {</span></span>
<span class="line"><span>        super(name);</span></span>
<span class="line"><span>        this.countDownLatch = countDownLatch;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public void run() {</span></span>
<span class="line"><span>        System.out.println(Thread.currentThread().getName() + &quot; doing something&quot;);</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            Thread.sleep(1000);</span></span>
<span class="line"><span>        } catch (InterruptedException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        System.out.println(Thread.currentThread().getName() + &quot; finish&quot;);</span></span>
<span class="line"><span>        countDownLatch.countDown();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class CountDownLatchDemo {</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        CountDownLatch countDownLatch = new CountDownLatch(2);</span></span>
<span class="line"><span>        MyThread t1 = new MyThread(&quot;t1&quot;, countDownLatch);</span></span>
<span class="line"><span>        MyThread t2 = new MyThread(&quot;t2&quot;, countDownLatch);</span></span>
<span class="line"><span>        t1.start();</span></span>
<span class="line"><span>        t2.start();</span></span>
<span class="line"><span>        System.out.println(&quot;Waiting for t1 thread and t2 thread to finish&quot;);</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            countDownLatch.await();</span></span>
<span class="line"><span>        } catch (InterruptedException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }            </span></span>
<span class="line"><span>        System.out.println(Thread.currentThread().getName() + &quot; continue&quot;);        </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行结果(某一次):</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Waiting for t1 thread and t2 thread to finish</span></span>
<span class="line"><span>t1 doing something</span></span>
<span class="line"><span>t2 doing something</span></span>
<span class="line"><span>t1 finish</span></span>
<span class="line"><span>t2 finish</span></span>
<span class="line"><span>main continue</span></span></code></pre></div><p>说明: 本程序首先计数器初始化为2。根据结果，可能会存在如下的一种时序图。</p><p><img src="`+i+'" alt="error.图片加载失败"></p><p>说明: 首先main线程会调用await操作，此时main线程会被阻塞，等待被唤醒，之后t1线程执行了countDown操作，最后，t2线程执行了countDown操作，此时main线程就被唤醒了，可以继续运行。下面，进行详细分析。</p><ul><li>main线程执行countDownLatch.await操作，主要调用的函数如下。</li></ul><p><img src="'+c+'" alt="error.图片加载失败"></p><p>说明: 在最后，main线程就被park了，即禁止运行了。此时Sync queue(同步队列)中有两个节点，AQS的state为2，包含main线程的结点的nextWaiter指向SHARED结点。</p><ul><li>t1线程执行countDownLatch.countDown操作，主要调用的函数如下。</li></ul><p><img src="'+o+'" alt="error.图片加载失败"></p><p>说明: 此时，Sync queue队列里的结点个数未发生变化，但是此时，AQS的state已经变为1了。</p><ul><li>t2线程执行countDownLatch.countDown操作，主要调用的函数如下。</li></ul><p><img src="'+r+'" alt="error.图片加载失败"></p><p>说明: 经过调用后，AQS的state为0，并且此时，main线程会被unpark，可以继续运行。当main线程获取cpu资源后，继续运行。</p><ul><li>main线程获取cpu资源，继续运行，由于main线程是在parkAndCheckInterrupt函数中被禁止的，所以此时，继续在parkAndCheckInterrupt函数运行。</li></ul><p><img src="'+d+`" alt="error.图片加载失败"></p><p>说明: main线程恢复，继续在parkAndCheckInterrupt函数中运行，之后又会回到最终达到的状态为AQS的state为0，并且head与tail指向同一个结点，该节点的额nextWaiter域还是指向SHARED结点。</p><h2 id="更深入理解" tabindex="-1">更深入理解 <a class="header-anchor" href="#更深入理解" aria-label="Permalink to &quot;更深入理解&quot;">​</a></h2><h3 id="写道面试题" tabindex="-1">写道面试题 <a class="header-anchor" href="#写道面试题" aria-label="Permalink to &quot;写道面试题&quot;">​</a></h3><blockquote><p>实现一个容器，提供两个方法，add，size 写两个线程，线程1添加10个元素到容器中，线程2实现监控元素的个数，当个数到5个时，线程2给出提示并结束.</p></blockquote><h3 id="使用wait和notify实现" tabindex="-1">使用wait和notify实现 <a class="header-anchor" href="#使用wait和notify实现" aria-label="Permalink to &quot;使用wait和notify实现&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.ArrayList;</span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> *  必须先让t2先进行启动 使用wait 和 notify 进行相互通讯，wait会释放锁，notify不会释放锁</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class T2 {</span></span>
<span class="line"><span></span></span>
<span class="line"><span> volatile   List list = new ArrayList();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void add (int i){</span></span>
<span class="line"><span>        list.add(i);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int getSize(){</span></span>
<span class="line"><span>        return list.size();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        T2 t2 = new T2();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Object lock = new Object();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        new Thread(() -&gt; {</span></span>
<span class="line"><span>            synchronized(lock){</span></span>
<span class="line"><span>                System.out.println(&quot;t2 启动&quot;);</span></span>
<span class="line"><span>                if(t2.getSize() != 5){</span></span>
<span class="line"><span>                    try {</span></span>
<span class="line"><span>                        /**会释放锁*/</span></span>
<span class="line"><span>                        lock.wait();</span></span>
<span class="line"><span>                        System.out.println(&quot;t2 结束&quot;);</span></span>
<span class="line"><span>                    } catch (InterruptedException e) {</span></span>
<span class="line"><span>                        e.printStackTrace();</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                lock.notify();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        },&quot;t2&quot;).start();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        new Thread(() -&gt; {</span></span>
<span class="line"><span>           synchronized (lock){</span></span>
<span class="line"><span>               System.out.println(&quot;t1 启动&quot;);</span></span>
<span class="line"><span>               for (int i=0;i&lt;9;i++){</span></span>
<span class="line"><span>                   t2.add(i);</span></span>
<span class="line"><span>                   System.out.println(&quot;add&quot;+i);</span></span>
<span class="line"><span>                   if(t2.getSize() == 5){</span></span>
<span class="line"><span>                       /**不会释放锁*/</span></span>
<span class="line"><span>                       lock.notify();</span></span>
<span class="line"><span>                       try {</span></span>
<span class="line"><span>                           lock.wait();</span></span>
<span class="line"><span>                       } catch (InterruptedException e) {</span></span>
<span class="line"><span>                           e.printStackTrace();</span></span>
<span class="line"><span>                       }</span></span>
<span class="line"><span>                   }</span></span>
<span class="line"><span>               }</span></span>
<span class="line"><span>           }</span></span>
<span class="line"><span>        }).start();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>输出：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>t2 启动</span></span>
<span class="line"><span>t1 启动</span></span>
<span class="line"><span>add0</span></span>
<span class="line"><span>add1</span></span>
<span class="line"><span>add2</span></span>
<span class="line"><span>add3</span></span>
<span class="line"><span>add4</span></span>
<span class="line"><span>t2 结束</span></span>
<span class="line"><span>add5</span></span>
<span class="line"><span>add6</span></span>
<span class="line"><span>add7</span></span>
<span class="line"><span>add8</span></span></code></pre></div><h3 id="countdownlatch实现" tabindex="-1">CountDownLatch实现 <a class="header-anchor" href="#countdownlatch实现" aria-label="Permalink to &quot;CountDownLatch实现&quot;">​</a></h3><p>说出使用CountDownLatch 代替wait notify 好处?</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.ArrayList;</span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span>import java.util.concurrent.CountDownLatch;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * 使用CountDownLatch 代替wait notify 好处是通讯方式简单，不涉及锁定  Count 值为0时当前线程继续执行，</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class T3 {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   volatile List list = new ArrayList();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void add(int i){</span></span>
<span class="line"><span>        list.add(i);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int getSize(){</span></span>
<span class="line"><span>        return list.size();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        T3 t = new T3();</span></span>
<span class="line"><span>        CountDownLatch countDownLatch = new CountDownLatch(1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        new Thread(() -&gt; {</span></span>
<span class="line"><span>            System.out.println(&quot;t2 start&quot;);</span></span>
<span class="line"><span>           if(t.getSize() != 5){</span></span>
<span class="line"><span>               try {</span></span>
<span class="line"><span>                   countDownLatch.await();</span></span>
<span class="line"><span>                   System.out.println(&quot;t2 end&quot;);</span></span>
<span class="line"><span>               } catch (InterruptedException e) {</span></span>
<span class="line"><span>                   e.printStackTrace();</span></span>
<span class="line"><span>               }</span></span>
<span class="line"><span>           }</span></span>
<span class="line"><span>        },&quot;t2&quot;).start();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        new Thread(()-&gt;{</span></span>
<span class="line"><span>            System.out.println(&quot;t1 start&quot;);</span></span>
<span class="line"><span>           for (int i = 0;i&lt;9;i++){</span></span>
<span class="line"><span>               t.add(i);</span></span>
<span class="line"><span>               System.out.println(&quot;add&quot;+ i);</span></span>
<span class="line"><span>               if(t.getSize() == 5){</span></span>
<span class="line"><span>                   System.out.println(&quot;countdown is open&quot;);</span></span>
<span class="line"><span>                   countDownLatch.countDown();</span></span>
<span class="line"><span>               }</span></span>
<span class="line"><span>           }</span></span>
<span class="line"><span>            System.out.println(&quot;t1 end&quot;);</span></span>
<span class="line"><span>        },&quot;t1&quot;).start();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li>文章主要参考自leesf的<a href="https://www.cnblogs.com/leesf456/p/5406191.html%EF%BC%8C%E5%9C%A8%E6%AD%A4%E5%9F%BA%E7%A1%80%E4%B8%8A%E5%81%9A%E4%BA%86%E5%A2%9E%E6%94%B9%E3%80%82" target="_blank" rel="noreferrer">https://www.cnblogs.com/leesf456/p/5406191.html，在此基础上做了增改。</a></li><li><a href="https://www.jianshu.com/p/40336ef1f5fe" target="_blank" rel="noreferrer">https://www.jianshu.com/p/40336ef1f5fe</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,92)]))}const f=a(u,[["render",h]]);export{y as __pageData,f as default};
