import{_ as s}from"./chunks/java-thread-x-semaphore-1.tAE2lBrD.js";import{_ as n,c as e,ai as p,o as l}from"./chunks/framework.BrYByd3F.js";const i="/vitepress-blog-template/images/thread/java-thread-x-semaphore-2.png",r="/vitepress-blog-template/images/thread/java-thread-x-semaphore-3.png",t="/vitepress-blog-template/images/thread/java-thread-x-semaphore-4.png",c="/vitepress-blog-template/images/thread/java-thread-x-semaphore-5.png",o="/vitepress-blog-template/images/thread/java-thread-x-semaphore-6.png",h="/vitepress-blog-template/images/thread/java-thread-x-semaphore-7.png",u="/vitepress-blog-template/images/thread/java-thread-x-semaphore-8.png",d="/vitepress-blog-template/images/thread/java-thread-x-semaphore-9.png",m="/vitepress-blog-template/images/thread/java-thread-x-semaphore-10.png",S="/vitepress-blog-template/images/thread/java-thread-x-semaphore-11.png",g="/vitepress-blog-template/images/thread/java-thread-x-semaphore-12.png",C=JSON.parse('{"title":"JUC工具类: Semaphore详解","description":"","frontmatter":{},"headers":[],"relativePath":"java/thread/java-thread-x-juc-tool-semaphore.md","filePath":"java/thread/java-thread-x-juc-tool-semaphore.md","lastUpdated":1737706346000}'),b={name:"java/thread/java-thread-x-juc-tool-semaphore.md"};function q(y,a,v,f,k,x){return l(),e("div",null,a[0]||(a[0]=[p('<h1 id="juc工具类-semaphore详解" tabindex="-1">JUC工具类: Semaphore详解 <a class="header-anchor" href="#juc工具类-semaphore详解" aria-label="Permalink to &quot;JUC工具类: Semaphore详解&quot;">​</a></h1><blockquote><p>Semaphore底层是基于AbstractQueuedSynchronizer来实现的。Semaphore称为计数信号量，它允许n个任务同时访问某个资源，可以将信号量看做是在向外分发使用资源的许可证，只有成功获取许可证，才能使用资源。@pdai</p></blockquote><h2 id="带着bat大厂的面试问题去理解" tabindex="-1">带着BAT大厂的面试问题去理解 <a class="header-anchor" href="#带着bat大厂的面试问题去理解" aria-label="Permalink to &quot;带着BAT大厂的面试问题去理解&quot;">​</a></h2><p>提示</p><p>请带着这些问题继续后文，会很大程度上帮助你更好的理解相关知识点。@pdai</p><ul><li>什么是Semaphore?</li><li>Semaphore内部原理?</li><li>Semaphore常用方法有哪些? 如何实现线程同步和互斥的?</li><li>Semaphore适合用在什么场景?</li><li>单独使用Semaphore是不会使用到AQS的条件队列?</li><li>Semaphore中申请令牌(acquire)、释放令牌(release)的实现?</li><li>Semaphore初始化有10个令牌，11个线程同时各调用1次acquire方法，会发生什么?</li><li>Semaphore初始化有10个令牌，一个线程重复调用11次acquire方法，会发生什么?</li><li>Semaphore初始化有1个令牌，1个线程调用一次acquire方法，然后调用两次release方法，之后另外一个线程调用acquire(2)方法，此线程能够获取到足够的令牌并继续运行吗?</li><li>Semaphore初始化有2个令牌，一个线程调用1次release方法，然后一次性获取3个令牌，会获取到吗?</li></ul><h2 id="semaphore源码分析" tabindex="-1">Semaphore源码分析 <a class="header-anchor" href="#semaphore源码分析" aria-label="Permalink to &quot;Semaphore源码分析&quot;">​</a></h2><h3 id="类的继承关系" tabindex="-1">类的继承关系 <a class="header-anchor" href="#类的继承关系" aria-label="Permalink to &quot;类的继承关系&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Semaphore implements java.io.Serializable {}</span></span></code></pre></div><p>说明: Semaphore实现了Serializable接口，即可以进行序列化。</p><h3 id="类的内部类" tabindex="-1">类的内部类 <a class="header-anchor" href="#类的内部类" aria-label="Permalink to &quot;类的内部类&quot;">​</a></h3><p>Semaphore总共有三个内部类，并且三个内部类是紧密相关的，下面先看三个类的关系。</p><p><img src="'+s+`" alt="error.图片加载失败"></p><p>说明: Semaphore与ReentrantLock的内部类的结构相同，类内部总共存在Sync、NonfairSync、FairSync三个类，NonfairSync与FairSync类继承自Sync类，Sync类继承自AbstractQueuedSynchronizer抽象类。下面逐个进行分析。</p><h3 id="类的内部类-sync类" tabindex="-1">类的内部类 - Sync类 <a class="header-anchor" href="#类的内部类-sync类" aria-label="Permalink to &quot;类的内部类 - Sync类&quot;">​</a></h3><p>Sync类的源码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 内部类，继承自AQS</span></span>
<span class="line"><span>abstract static class Sync extends AbstractQueuedSynchronizer {</span></span>
<span class="line"><span>    // 版本号</span></span>
<span class="line"><span>    private static final long serialVersionUID = 1192457210091910933L;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 构造函数</span></span>
<span class="line"><span>    Sync(int permits) {</span></span>
<span class="line"><span>        // 设置状态数</span></span>
<span class="line"><span>        setState(permits);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 获取许可</span></span>
<span class="line"><span>    final int getPermits() {</span></span>
<span class="line"><span>        return getState();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 共享模式下非公平策略获取</span></span>
<span class="line"><span>    final int nonfairTryAcquireShared(int acquires) {</span></span>
<span class="line"><span>        for (;;) { // 无限循环</span></span>
<span class="line"><span>            // 获取许可数</span></span>
<span class="line"><span>            int available = getState();</span></span>
<span class="line"><span>            // 剩余的许可</span></span>
<span class="line"><span>            int remaining = available - acquires;</span></span>
<span class="line"><span>            if (remaining &lt; 0 ||</span></span>
<span class="line"><span>                compareAndSetState(available, remaining)) // 许可小于0或者比较并且设置状态成功</span></span>
<span class="line"><span>                return remaining;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 共享模式下进行释放</span></span>
<span class="line"><span>    protected final boolean tryReleaseShared(int releases) {</span></span>
<span class="line"><span>        for (;;) { // 无限循环</span></span>
<span class="line"><span>            // 获取许可</span></span>
<span class="line"><span>            int current = getState();</span></span>
<span class="line"><span>            // 可用的许可</span></span>
<span class="line"><span>            int next = current + releases;</span></span>
<span class="line"><span>            if (next &lt; current) // overflow</span></span>
<span class="line"><span>                throw new Error(&quot;Maximum permit count exceeded&quot;);</span></span>
<span class="line"><span>            if (compareAndSetState(current, next)) // 比较并进行设置成功</span></span>
<span class="line"><span>                return true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 根据指定的缩减量减小可用许可的数目</span></span>
<span class="line"><span>    final void reducePermits(int reductions) {</span></span>
<span class="line"><span>        for (;;) { // 无限循环</span></span>
<span class="line"><span>            // 获取许可</span></span>
<span class="line"><span>            int current = getState();</span></span>
<span class="line"><span>            // 可用的许可</span></span>
<span class="line"><span>            int next = current - reductions;</span></span>
<span class="line"><span>            if (next &gt; current) // underflow</span></span>
<span class="line"><span>                throw new Error(&quot;Permit count underflow&quot;);</span></span>
<span class="line"><span>            if (compareAndSetState(current, next)) // 比较并进行设置成功</span></span>
<span class="line"><span>                return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 获取并返回立即可用的所有许可</span></span>
<span class="line"><span>    final int drainPermits() {</span></span>
<span class="line"><span>        for (;;) { // 无限循环</span></span>
<span class="line"><span>            // 获取许可</span></span>
<span class="line"><span>            int current = getState();</span></span>
<span class="line"><span>            if (current == 0 || compareAndSetState(current, 0)) // 许可为0或者比较并设置成功</span></span>
<span class="line"><span>                return current;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: Sync类的属性相对简单，只有一个版本号，Sync类存在如下方法和作用如下。</p><p><img src="`+i+`" alt="error.图片加载失败"></p><h3 id="类的内部类-nonfairsync类" tabindex="-1">类的内部类 - NonfairSync类 <a class="header-anchor" href="#类的内部类-nonfairsync类" aria-label="Permalink to &quot;类的内部类 - NonfairSync类&quot;">​</a></h3><p>NonfairSync类继承了Sync类，表示采用非公平策略获取资源，其只有一个tryAcquireShared方法，重写了AQS的该方法，其源码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static final class NonfairSync extends Sync {</span></span>
<span class="line"><span>    // 版本号</span></span>
<span class="line"><span>    private static final long serialVersionUID = -2694183684443567898L;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 构造函数</span></span>
<span class="line"><span>    NonfairSync(int permits) {</span></span>
<span class="line"><span>        super(permits);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 共享模式下获取</span></span>
<span class="line"><span>    protected int tryAcquireShared(int acquires) {</span></span>
<span class="line"><span>        return nonfairTryAcquireShared(acquires);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 从tryAcquireShared方法的源码可知，其会调用父类Sync的nonfairTryAcquireShared方法，表示按照非公平策略进行资源的获取。</p><h3 id="类的内部类-fairsync类" tabindex="-1">类的内部类 - FairSync类 <a class="header-anchor" href="#类的内部类-fairsync类" aria-label="Permalink to &quot;类的内部类 - FairSync类&quot;">​</a></h3><p>FairSync类继承了Sync类，表示采用公平策略获取资源，其只有一个tryAcquireShared方法，重写了AQS的该方法，其源码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected int tryAcquireShared(int acquires) {</span></span>
<span class="line"><span>    for (;;) { // 无限循环</span></span>
<span class="line"><span>        if (hasQueuedPredecessors()) // 同步队列中存在其他节点</span></span>
<span class="line"><span>            return -1;</span></span>
<span class="line"><span>        // 获取许可</span></span>
<span class="line"><span>        int available = getState();</span></span>
<span class="line"><span>        // 剩余的许可</span></span>
<span class="line"><span>        int remaining = available - acquires;</span></span>
<span class="line"><span>        if (remaining &lt; 0 ||</span></span>
<span class="line"><span>            compareAndSetState(available, remaining)) // 剩余的许可小于0或者比较设置成功</span></span>
<span class="line"><span>            return remaining;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 从tryAcquireShared方法的源码可知，它使用公平策略来获取资源，它会判断同步队列中是否存在其他的等待节点。</p><h3 id="类的属性" tabindex="-1">类的属性 <a class="header-anchor" href="#类的属性" aria-label="Permalink to &quot;类的属性&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Semaphore implements java.io.Serializable {</span></span>
<span class="line"><span>    // 版本号</span></span>
<span class="line"><span>    private static final long serialVersionUID = -3222578661600680210L;</span></span>
<span class="line"><span>    // 属性</span></span>
<span class="line"><span>    private final Sync sync;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: Semaphore自身只有两个属性，最重要的是sync属性，基于Semaphore对象的操作绝大多数都转移到了对sync的操作。</p><h3 id="类的构造函数" tabindex="-1">类的构造函数 <a class="header-anchor" href="#类的构造函数" aria-label="Permalink to &quot;类的构造函数&quot;">​</a></h3><ul><li>Semaphore(int)型构造函数</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public Semaphore(int permits) {</span></span>
<span class="line"><span>    sync = new NonfairSync(permits);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 该构造函数会创建具有给定的许可数和非公平的公平设置的Semaphore。</p><ul><li>Semaphore(int, boolean)型构造函数</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public Semaphore(int permits, boolean fair) {</span></span>
<span class="line"><span>    sync = fair ? new FairSync(permits) : new NonfairSync(permits);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 该构造函数会创建具有给定的许可数和给定的公平设置的Semaphore。</p><h3 id="核心函数分析-acquire函数" tabindex="-1">核心函数分析 - acquire函数 <a class="header-anchor" href="#核心函数分析-acquire函数" aria-label="Permalink to &quot;核心函数分析 - acquire函数&quot;">​</a></h3><p>此方法从信号量获取一个(多个)许可，在提供一个许可前一直将线程阻塞，或者线程被中断，其源码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void acquire() throws InterruptedException {</span></span>
<span class="line"><span>    sync.acquireSharedInterruptibly(1);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 该方法中将会调用Sync对象的acquireSharedInterruptibly(从AQS继承而来的方法)方法，而acquireSharedInterruptibly方法在上一篇CountDownLatch中已经进行了分析，在此不再累赘。</p><p>最终可以获取大致的方法调用序列(假设使用非公平策略)。如下图所示。</p><p><img src="`+r+`" alt="error.图片加载失败"></p><p>说明: 上图只是给出了大体会调用到的方法，和具体的示例可能会有些差别，之后会根据具体的示例进行分析。</p><h3 id="核心函数分析-release函数" tabindex="-1">核心函数分析 - release函数 <a class="header-anchor" href="#核心函数分析-release函数" aria-label="Permalink to &quot;核心函数分析 - release函数&quot;">​</a></h3><p>此方法释放一个(多个)许可，将其返回给信号量，源码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void release() {</span></span>
<span class="line"><span>    sync.releaseShared(1);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 该方法中将会调用Sync对象的releaseShared(从AQS继承而来的方法)方法，而releaseShared方法在上一篇CountDownLatch中已经进行了分析，在此不再累赘。</p><p>最终可以获取大致的方法调用序列(假设使用非公平策略)。如下图所示:</p><p><img src="`+t+`" alt="error.图片加载失败"></p><p>说明: 上图只是给出了大体会调用到的方法，和具体的示例可能会有些差别，之后会根据具体的示例进行分析。</p><h2 id="semaphore示例" tabindex="-1">Semaphore示例 <a class="header-anchor" href="#semaphore示例" aria-label="Permalink to &quot;Semaphore示例&quot;">​</a></h2><p>下面给出了一个使用Semaphore的示例。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.concurrent.Semaphore;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class MyThread extends Thread {</span></span>
<span class="line"><span>    private Semaphore semaphore;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public MyThread(String name, Semaphore semaphore) {</span></span>
<span class="line"><span>        super(name);</span></span>
<span class="line"><span>        this.semaphore = semaphore;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public void run() {        </span></span>
<span class="line"><span>        int count = 3;</span></span>
<span class="line"><span>        System.out.println(Thread.currentThread().getName() + &quot; trying to acquire&quot;);</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            semaphore.acquire(count);</span></span>
<span class="line"><span>            System.out.println(Thread.currentThread().getName() + &quot; acquire successfully&quot;);</span></span>
<span class="line"><span>            Thread.sleep(1000);</span></span>
<span class="line"><span>        } catch (InterruptedException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            semaphore.release(count);</span></span>
<span class="line"><span>            System.out.println(Thread.currentThread().getName() + &quot; release successfully&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class SemaphoreDemo {</span></span>
<span class="line"><span>    public final static int SEM_SIZE = 10;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        Semaphore semaphore = new Semaphore(SEM_SIZE);</span></span>
<span class="line"><span>        MyThread t1 = new MyThread(&quot;t1&quot;, semaphore);</span></span>
<span class="line"><span>        MyThread t2 = new MyThread(&quot;t2&quot;, semaphore);</span></span>
<span class="line"><span>        t1.start();</span></span>
<span class="line"><span>        t2.start();</span></span>
<span class="line"><span>        int permits = 5;</span></span>
<span class="line"><span>        System.out.println(Thread.currentThread().getName() + &quot; trying to acquire&quot;);</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            semaphore.acquire(permits);</span></span>
<span class="line"><span>            System.out.println(Thread.currentThread().getName() + &quot; acquire successfully&quot;);</span></span>
<span class="line"><span>            Thread.sleep(1000);</span></span>
<span class="line"><span>        } catch (InterruptedException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            semaphore.release();</span></span>
<span class="line"><span>            System.out.println(Thread.currentThread().getName() + &quot; release successfully&quot;);</span></span>
<span class="line"><span>        }      </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行结果(某一次):</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>main trying to acquire</span></span>
<span class="line"><span>main acquire successfully</span></span>
<span class="line"><span>t1 trying to acquire</span></span>
<span class="line"><span>t1 acquire successfully</span></span>
<span class="line"><span>t2 trying to acquire</span></span>
<span class="line"><span>t1 release successfully</span></span>
<span class="line"><span>main release successfully</span></span>
<span class="line"><span>t2 acquire successfully</span></span>
<span class="line"><span>t2 release successfully</span></span></code></pre></div><p>说明: 首先，生成一个信号量，信号量有10个许可，然后，main，t1，t2三个线程获取许可运行，根据结果，可能存在如下的一种时序。</p><p><img src="`+c+'" alt="error.图片加载失败"></p><p>说明: 如上图所示，首先，main线程执行acquire操作，并且成功获得许可，之后t1线程执行acquire操作，成功获得许可，之后t2执行acquire操作，由于此时许可数量不够，t2线程将会阻塞，直到许可可用。之后t1线程释放许可，main线程释放许可，此时的许可数量可以满足t2线程的要求，所以，此时t2线程会成功获得许可运行，t2运行完成后释放许可。下面进行详细分析。</p><ul><li>main线程执行semaphore.acquire操作。主要的函数调用如下图所示。</li></ul><p><img src="'+o+'" alt="error.图片加载失败"></p><p>说明: 此时，可以看到只是AQS的state变为了5，main线程并没有被阻塞，可以继续运行。</p><ul><li>t1线程执行semaphore.acquire操作。主要的函数调用如下图所示。</li></ul><p><img src="'+h+'" alt="error.图片加载失败"></p><p>说明: 此时，可以看到只是AQS的state变为了2，t1线程并没有被阻塞，可以继续运行。</p><ul><li>t2线程执行semaphore.acquire操作。主要的函数调用如下图所示。</li></ul><p><img src="'+u+'" alt="error.图片加载失败"></p><p>说明: 此时，t2线程获取许可不会成功，之后会导致其被禁止运行，值得注意的是，AQS的state还是为2。</p><ul><li>t1执行semaphore.release操作。主要的函数调用如下图所示。</li></ul><p><img src="'+d+'" alt="error.图片加载失败"></p><p>说明: 此时，t2线程将会被unpark，并且AQS的state为5，t2获取cpu资源后可以继续运行。</p><ul><li>main线程执行semaphore.release操作。主要的函数调用如下图所示。</li></ul><p><img src="'+m+'" alt="error.图片加载失败"></p><p>说明: 此时，t2线程还会被unpark，但是不会产生影响，此时，只要t2线程获得CPU资源就可以运行了。此时，AQS的state为10。</p><ul><li>t2获取CPU资源，继续运行，此时t2需要恢复现场，回到parkAndCheckInterrupt函数中，也是在should继续运行。主要的函数调用如下图所示。</li></ul><p><img src="'+S+'" alt="error.图片加载失败"></p><p>说明: 此时，可以看到，Sync queue中只有一个结点，头节点与尾节点都指向该结点，在setHeadAndPropagate的函数中会设置头节点并且会unpark队列中的其他结点。</p><ul><li>t2线程执行semaphore.release操作。主要的函数调用如下图所示。</li></ul><p><img src="'+g+`" alt="error.图片加载失败"></p><p>说明: t2线程经过release后，此时信号量的许可又变为10个了，此时Sync queue中的结点还是没有变化。</p><h2 id="更深入理解" tabindex="-1">更深入理解 <a class="header-anchor" href="#更深入理解" aria-label="Permalink to &quot;更深入理解&quot;">​</a></h2><h3 id="单独使用semaphore是不会使用到aqs的条件队列的" tabindex="-1">单独使用Semaphore是不会使用到AQS的条件队列的 <a class="header-anchor" href="#单独使用semaphore是不会使用到aqs的条件队列的" aria-label="Permalink to &quot;单独使用Semaphore是不会使用到AQS的条件队列的&quot;">​</a></h3><p>不同于CyclicBarrier和ReentrantLock，单独使用Semaphore是不会使用到AQS的条件队列的，其实，只有进行await操作才会进入条件队列，其他的都是在同步队列中，只是当前线程会被park。</p><h3 id="场景问题" tabindex="-1">场景问题 <a class="header-anchor" href="#场景问题" aria-label="Permalink to &quot;场景问题&quot;">​</a></h3><h4 id="semaphore初始化有10个令牌-11个线程同时各调用1次acquire方法-会发生什么" tabindex="-1">semaphore初始化有10个令牌，11个线程同时各调用1次acquire方法，会发生什么? <a class="header-anchor" href="#semaphore初始化有10个令牌-11个线程同时各调用1次acquire方法-会发生什么" aria-label="Permalink to &quot;semaphore初始化有10个令牌，11个线程同时各调用1次acquire方法，会发生什么?&quot;">​</a></h4><p>答案：拿不到令牌的线程阻塞，不会继续往下运行。</p><h4 id="semaphore初始化有10个令牌-一个线程重复调用11次acquire方法-会发生什么" tabindex="-1">semaphore初始化有10个令牌，一个线程重复调用11次acquire方法，会发生什么? <a class="header-anchor" href="#semaphore初始化有10个令牌-一个线程重复调用11次acquire方法-会发生什么" aria-label="Permalink to &quot;semaphore初始化有10个令牌，一个线程重复调用11次acquire方法，会发生什么?&quot;">​</a></h4><p>答案：线程阻塞，不会继续往下运行。可能你会考虑类似于锁的重入的问题，很好，但是，令牌没有重入的概念。你只要调用一次acquire方法，就需要有一个令牌才能继续运行。</p><h4 id="semaphore初始化有1个令牌-1个线程调用一次acquire方法-然后调用两次release方法-之后另外一个线程调用acquire-2-方法-此线程能够获取到足够的令牌并继续运行吗" tabindex="-1">semaphore初始化有1个令牌，1个线程调用一次acquire方法，然后调用两次release方法，之后另外一个线程调用acquire(2)方法，此线程能够获取到足够的令牌并继续运行吗? <a class="header-anchor" href="#semaphore初始化有1个令牌-1个线程调用一次acquire方法-然后调用两次release方法-之后另外一个线程调用acquire-2-方法-此线程能够获取到足够的令牌并继续运行吗" aria-label="Permalink to &quot;semaphore初始化有1个令牌，1个线程调用一次acquire方法，然后调用两次release方法，之后另外一个线程调用acquire(2)方法，此线程能够获取到足够的令牌并继续运行吗?&quot;">​</a></h4><p>答案：能，原因是release方法会添加令牌，并不会以初始化的大小为准。</p><h4 id="semaphore初始化有2个令牌-一个线程调用1次release方法-然后一次性获取3个令牌-会获取到吗" tabindex="-1">semaphore初始化有2个令牌，一个线程调用1次release方法，然后一次性获取3个令牌，会获取到吗? <a class="header-anchor" href="#semaphore初始化有2个令牌-一个线程调用1次release方法-然后一次性获取3个令牌-会获取到吗" aria-label="Permalink to &quot;semaphore初始化有2个令牌，一个线程调用1次release方法，然后一次性获取3个令牌，会获取到吗?&quot;">​</a></h4><p>答案：能，原因是release会添加令牌，并不会以初始化的大小为准。Semaphore中release方法的调用并没有限制要在acquire后调用。</p><p>具体示例如下，如果不相信的话，可以运行一下下面的demo，在做实验之前，笔者也认为应该是不允许的。。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class TestSemaphore2 {</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        int permitsNum = 2;</span></span>
<span class="line"><span>        final Semaphore semaphore = new Semaphore(permitsNum);</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            System.out.println(&quot;availablePermits:&quot;+semaphore.availablePermits()+&quot;,semaphore.tryAcquire(3,1, TimeUnit.SECONDS):&quot;+semaphore.tryAcquire(3,1, TimeUnit.SECONDS));</span></span>
<span class="line"><span>            semaphore.release();</span></span>
<span class="line"><span>            System.out.println(&quot;availablePermits:&quot;+semaphore.availablePermits()+&quot;,semaphore.tryAcquire(3,1, TimeUnit.SECONDS):&quot;+semaphore.tryAcquire(3,1, TimeUnit.SECONDS));</span></span>
<span class="line"><span>        }catch (Exception e) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li>文章主要参考自leesf的<a href="https://www.cnblogs.com/leesf456/p/5414778.html%EF%BC%8C%E5%9C%A8%E6%AD%A4%E5%9F%BA%E7%A1%80%E4%B8%8A%E5%81%9A%E4%BA%86%E5%A2%9E%E6%94%B9%E3%80%82" target="_blank" rel="noreferrer">https://www.cnblogs.com/leesf456/p/5414778.html，在此基础上做了增改。</a></li><li><a href="https://blog.csdn.net/u010412719/article/details/94986327" target="_blank" rel="noreferrer">https://blog.csdn.net/u010412719/article/details/94986327</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,97)]))}const T=n(b,[["render",q]]);export{C as __pageData,T as default};
