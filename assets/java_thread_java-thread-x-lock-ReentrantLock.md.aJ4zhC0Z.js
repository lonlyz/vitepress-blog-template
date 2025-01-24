import{_ as a}from"./chunks/java-thread-x-juc-reentrantlock-1.r03-697j.js";import{_ as s,c as p,ai as e,o as l}from"./chunks/framework.BrYByd3F.js";const t="/vitepress-blog-template/images/thread/java-thread-x-juc-reentrantlock-2.png",i="/vitepress-blog-template/images/thread/java-thread-x-juc-reentrantlock-3.png",c="/vitepress-blog-template/images/thread/java-thread-x-juc-reentrantlock-4.png",r="/vitepress-blog-template/images/thread/java-thread-x-juc-reentrantlock-5.png",o="/vitepress-blog-template/images/thread/java-thread-x-juc-reentrantlock-6.png",u="/vitepress-blog-template/images/thread/java-thread-x-juc-reentrantlock-7.png",d="/vitepress-blog-template/images/thread/java-thread-x-juc-reentrantlock-8.png",h="/vitepress-blog-template/images/thread/java-thread-x-juc-reentrantlock-9.png",k="/vitepress-blog-template/images/thread/java-thread-x-juc-reentrantlock-10.png",g="/vitepress-blog-template/images/thread/java-thread-x-juc-reentrantlock-11.png",m="/vitepress-blog-template/images/thread/java-thread-x-juc-reentrantlock-12.png",_=JSON.parse('{"title":"JUC锁: ReentrantLock详解","description":"","frontmatter":{},"headers":[],"relativePath":"java/thread/java-thread-x-lock-ReentrantLock.md","filePath":"java/thread/java-thread-x-lock-ReentrantLock.md","lastUpdated":1737706346000}'),b={name:"java/thread/java-thread-x-lock-ReentrantLock.md"};function v(y,n,f,S,x,q){return l(),p("div",null,n[0]||(n[0]=[e('<h1 id="juc锁-reentrantlock详解" tabindex="-1">JUC锁: ReentrantLock详解 <a class="header-anchor" href="#juc锁-reentrantlock详解" aria-label="Permalink to &quot;JUC锁: ReentrantLock详解&quot;">​</a></h1><blockquote><p>可重入锁ReentrantLock的底层是通过AbstractQueuedSynchronizer实现，所以先要学习上一章节AbstractQueuedSynchronizer详解。@pdai</p></blockquote><h2 id="带着bat大厂的面试问题去理解" tabindex="-1">带着BAT大厂的面试问题去理解 <a class="header-anchor" href="#带着bat大厂的面试问题去理解" aria-label="Permalink to &quot;带着BAT大厂的面试问题去理解&quot;">​</a></h2><p>提示</p><p>请带着这些问题继续后文，会很大程度上帮助你更好的理解相关知识点。@pdai</p><ul><li>什么是可重入，什么是可重入锁? 它用来解决什么问题?</li><li>ReentrantLock的核心是AQS，那么它怎么来实现的，继承吗? 说说其类内部结构关系。</li><li>ReentrantLock是如何实现公平锁的?</li><li>ReentrantLock是如何实现非公平锁的?</li><li>ReentrantLock默认实现的是公平还是非公平锁?</li><li>使用ReentrantLock实现公平和非公平锁的示例?</li><li>ReentrantLock和Synchronized的对比?</li></ul><h2 id="reentrantlock源码分析" tabindex="-1">ReentrantLock源码分析 <a class="header-anchor" href="#reentrantlock源码分析" aria-label="Permalink to &quot;ReentrantLock源码分析&quot;">​</a></h2><h3 id="类的继承关系" tabindex="-1">类的继承关系 <a class="header-anchor" href="#类的继承关系" aria-label="Permalink to &quot;类的继承关系&quot;">​</a></h3><p>ReentrantLock实现了Lock接口，Lock接口中定义了lock与unlock相关操作，并且还存在newCondition方法，表示生成一个条件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ReentrantLock implements Lock, java.io.Serializable</span></span></code></pre></div><h3 id="类的内部类" tabindex="-1">类的内部类 <a class="header-anchor" href="#类的内部类" aria-label="Permalink to &quot;类的内部类&quot;">​</a></h3><p>ReentrantLock总共有三个内部类，并且三个内部类是紧密相关的，下面先看三个类的关系。</p><p><img src="'+a+`" alt="image"></p><p>说明: ReentrantLock类内部总共存在Sync、NonfairSync、FairSync三个类，NonfairSync与FairSync类继承自Sync类，Sync类继承自AbstractQueuedSynchronizer抽象类。下面逐个进行分析。</p><ul><li>Sync类</li></ul><p>Sync类的源码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>abstract static class Sync extends AbstractQueuedSynchronizer {</span></span>
<span class="line"><span>    // 序列号</span></span>
<span class="line"><span>    private static final long serialVersionUID = -5179523762034025860L;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 获取锁</span></span>
<span class="line"><span>    abstract void lock();</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 非公平方式获取</span></span>
<span class="line"><span>    final boolean nonfairTryAcquire(int acquires) {</span></span>
<span class="line"><span>        // 当前线程</span></span>
<span class="line"><span>        final Thread current = Thread.currentThread();</span></span>
<span class="line"><span>        // 获取状态</span></span>
<span class="line"><span>        int c = getState();</span></span>
<span class="line"><span>        if (c == 0) { // 表示没有线程正在竞争该锁</span></span>
<span class="line"><span>            if (compareAndSetState(0, acquires)) { // 比较并设置状态成功，状态0表示锁没有被占用</span></span>
<span class="line"><span>                // 设置当前线程独占</span></span>
<span class="line"><span>                setExclusiveOwnerThread(current); </span></span>
<span class="line"><span>                return true; // 成功</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else if (current == getExclusiveOwnerThread()) { // 当前线程拥有该锁</span></span>
<span class="line"><span>            int nextc = c + acquires; // 增加重入次数</span></span>
<span class="line"><span>            if (nextc &lt; 0) // overflow</span></span>
<span class="line"><span>                throw new Error(&quot;Maximum lock count exceeded&quot;);</span></span>
<span class="line"><span>            // 设置状态</span></span>
<span class="line"><span>            setState(nextc); </span></span>
<span class="line"><span>            // 成功</span></span>
<span class="line"><span>            return true; </span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 失败</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 试图在共享模式下获取对象状态，此方法应该查询是否允许它在共享模式下获取对象状态，如果允许，则获取它</span></span>
<span class="line"><span>    protected final boolean tryRelease(int releases) {</span></span>
<span class="line"><span>        int c = getState() - releases;</span></span>
<span class="line"><span>        if (Thread.currentThread() != getExclusiveOwnerThread()) // 当前线程不为独占线程</span></span>
<span class="line"><span>            throw new IllegalMonitorStateException(); // 抛出异常</span></span>
<span class="line"><span>        // 释放标识</span></span>
<span class="line"><span>        boolean free = false; </span></span>
<span class="line"><span>        if (c == 0) {</span></span>
<span class="line"><span>            free = true;</span></span>
<span class="line"><span>            // 已经释放，清空独占</span></span>
<span class="line"><span>            setExclusiveOwnerThread(null); </span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 设置标识</span></span>
<span class="line"><span>        setState(c); </span></span>
<span class="line"><span>        return free; </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 判断资源是否被当前线程占有</span></span>
<span class="line"><span>    protected final boolean isHeldExclusively() {</span></span>
<span class="line"><span>        // While we must in general read state before owner,</span></span>
<span class="line"><span>        // we don&#39;t need to do so to check if current thread is owner</span></span>
<span class="line"><span>        return getExclusiveOwnerThread() == Thread.currentThread();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 新生一个条件</span></span>
<span class="line"><span>    final ConditionObject newCondition() {</span></span>
<span class="line"><span>        return new ConditionObject();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Methods relayed from outer class</span></span>
<span class="line"><span>    // 返回资源的占用线程</span></span>
<span class="line"><span>    final Thread getOwner() {        </span></span>
<span class="line"><span>        return getState() == 0 ? null : getExclusiveOwnerThread();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 返回状态</span></span>
<span class="line"><span>    final int getHoldCount() {            </span></span>
<span class="line"><span>        return isHeldExclusively() ? getState() : 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 资源是否被占用</span></span>
<span class="line"><span>    final boolean isLocked() {        </span></span>
<span class="line"><span>        return getState() != 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>        * Reconstitutes the instance from a stream (that is, deserializes it).</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    // 自定义反序列化逻辑</span></span>
<span class="line"><span>    private void readObject(java.io.ObjectInputStream s)</span></span>
<span class="line"><span>        throws java.io.IOException, ClassNotFoundException {</span></span>
<span class="line"><span>        s.defaultReadObject();</span></span>
<span class="line"><span>        setState(0); // reset to unlocked state</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Sync类存在如下方法和作用如下。</p><p><img src="`+t+`" alt="image"></p><ul><li>NonfairSync类</li></ul><p>NonfairSync类继承了Sync类，表示采用非公平策略获取锁，其实现了Sync类中抽象的lock方法，源码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 非公平锁</span></span>
<span class="line"><span>static final class NonfairSync extends Sync {</span></span>
<span class="line"><span>    // 版本号</span></span>
<span class="line"><span>    private static final long serialVersionUID = 7316153563782823691L;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 获得锁</span></span>
<span class="line"><span>    final void lock() {</span></span>
<span class="line"><span>        if (compareAndSetState(0, 1)) // 比较并设置状态成功，状态0表示锁没有被占用</span></span>
<span class="line"><span>            // 把当前线程设置独占了锁</span></span>
<span class="line"><span>            setExclusiveOwnerThread(Thread.currentThread());</span></span>
<span class="line"><span>        else // 锁已经被占用，或者set失败</span></span>
<span class="line"><span>            // 以独占模式获取对象，忽略中断</span></span>
<span class="line"><span>            acquire(1); </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    protected final boolean tryAcquire(int acquires) {</span></span>
<span class="line"><span>        return nonfairTryAcquire(acquires);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 从lock方法的源码可知，每一次都尝试获取锁，而并不会按照公平等待的原则进行等待，让等待时间最久的线程获得锁。</p><ul><li>FairSyn类</li></ul><p>FairSync类也继承了Sync类，表示采用公平策略获取锁，其实现了Sync类中的抽象lock方法，源码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 公平锁</span></span>
<span class="line"><span>static final class FairSync extends Sync {</span></span>
<span class="line"><span>    // 版本序列化</span></span>
<span class="line"><span>    private static final long serialVersionUID = -3000897897090466540L;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    final void lock() {</span></span>
<span class="line"><span>        // 以独占模式获取对象，忽略中断</span></span>
<span class="line"><span>        acquire(1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>        * Fair version of tryAcquire.  Don&#39;t grant access unless</span></span>
<span class="line"><span>        * recursive call or no waiters or is first.</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    // 尝试公平获取锁</span></span>
<span class="line"><span>    protected final boolean tryAcquire(int acquires) {</span></span>
<span class="line"><span>        // 获取当前线程</span></span>
<span class="line"><span>        final Thread current = Thread.currentThread();</span></span>
<span class="line"><span>        // 获取状态</span></span>
<span class="line"><span>        int c = getState();</span></span>
<span class="line"><span>        if (c == 0) { // 状态为0</span></span>
<span class="line"><span>            if (!hasQueuedPredecessors() &amp;&amp;</span></span>
<span class="line"><span>                compareAndSetState(0, acquires)) { // 不存在已经等待更久的线程并且比较并且设置状态成功</span></span>
<span class="line"><span>                // 设置当前线程独占</span></span>
<span class="line"><span>                setExclusiveOwnerThread(current);</span></span>
<span class="line"><span>                return true;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else if (current == getExclusiveOwnerThread()) { // 状态不为0，即资源已经被线程占据</span></span>
<span class="line"><span>            // 下一个状态</span></span>
<span class="line"><span>            int nextc = c + acquires;</span></span>
<span class="line"><span>            if (nextc &lt; 0) // 超过了int的表示范围</span></span>
<span class="line"><span>                throw new Error(&quot;Maximum lock count exceeded&quot;);</span></span>
<span class="line"><span>            // 设置状态</span></span>
<span class="line"><span>            setState(nextc);</span></span>
<span class="line"><span>            return true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 跟踪lock方法的源码可知，当资源空闲时，它总是会先判断sync队列(AbstractQueuedSynchronizer中的数据结构)是否有等待时间更长的线程，如果存在，则将该线程加入到等待队列的尾部，实现了公平获取原则。其中，FairSync类的lock的方法调用如下，只给出了主要的方法。</p><p><img src="`+i+`" alt="image"></p><p>说明: 可以看出只要资源被其他线程占用，该线程就会添加到sync queue中的尾部，而不会先尝试获取资源。这也是和Nonfair最大的区别，Nonfair每一次都会尝试去获取资源，如果此时该资源恰好被释放，则会被当前线程获取，这就造成了不公平的现象，当获取不成功，再加入队列尾部。</p><h3 id="类的属性" tabindex="-1">类的属性 <a class="header-anchor" href="#类的属性" aria-label="Permalink to &quot;类的属性&quot;">​</a></h3><p>ReentrantLock类的sync非常重要，对ReentrantLock类的操作大部分都直接转化为对Sync和AbstractQueuedSynchronizer类的操作。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ReentrantLock implements Lock, java.io.Serializable {</span></span>
<span class="line"><span>    // 序列号</span></span>
<span class="line"><span>    private static final long serialVersionUID = 7373984872572414699L;    </span></span>
<span class="line"><span>    // 同步队列</span></span>
<span class="line"><span>    private final Sync sync;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="类的构造函数" tabindex="-1">类的构造函数 <a class="header-anchor" href="#类的构造函数" aria-label="Permalink to &quot;类的构造函数&quot;">​</a></h3><ul><li>ReentrantLock()型构造函数</li></ul><p>默认是采用的非公平策略获取锁</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ReentrantLock() {</span></span>
<span class="line"><span>    // 默认非公平策略</span></span>
<span class="line"><span>    sync = new NonfairSync();</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>ReentrantLock(boolean)型构造函数</li></ul><p>可以传递参数确定采用公平策略或者是非公平策略，参数为true表示公平策略，否则，采用非公平策略:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ReentrantLock(boolean fair) {</span></span>
<span class="line"><span>    sync = fair ? new FairSync() : new NonfairSync();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="核心函数分析" tabindex="-1">核心函数分析 <a class="header-anchor" href="#核心函数分析" aria-label="Permalink to &quot;核心函数分析&quot;">​</a></h3><p>通过分析ReentrantLock的源码，可知对其操作都转化为对Sync对象的操作，由于Sync继承了AQS，所以基本上都可以转化为对AQS的操作。如将ReentrantLock的lock函数转化为对Sync的lock函数的调用，而具体会根据采用的策略(如公平策略或者非公平策略)的不同而调用到Sync的不同子类。</p><p>所以可知，在ReentrantLock的背后，是AQS对其服务提供了支持，由于之前我们分析AQS的核心源码，遂不再累赘。下面还是通过例子来更进一步分析源码。</p><h2 id="示例分析" tabindex="-1">示例分析 <a class="header-anchor" href="#示例分析" aria-label="Permalink to &quot;示例分析&quot;">​</a></h2><h3 id="公平锁" tabindex="-1">公平锁 <a class="header-anchor" href="#公平锁" aria-label="Permalink to &quot;公平锁&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.concurrent.locks.Lock;</span></span>
<span class="line"><span>import java.util.concurrent.locks.ReentrantLock;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class MyThread extends Thread {</span></span>
<span class="line"><span>    private Lock lock;</span></span>
<span class="line"><span>    public MyThread(String name, Lock lock) {</span></span>
<span class="line"><span>        super(name);</span></span>
<span class="line"><span>        this.lock = lock;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public void run () {</span></span>
<span class="line"><span>        lock.lock();</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            System.out.println(Thread.currentThread() + &quot; running&quot;);</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                Thread.sleep(500);</span></span>
<span class="line"><span>            } catch (InterruptedException e) {</span></span>
<span class="line"><span>                e.printStackTrace();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            lock.unlock();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class AbstractQueuedSynchronizerDemo {</span></span>
<span class="line"><span>    public static void main(String[] args) throws InterruptedException {</span></span>
<span class="line"><span>        Lock lock = new ReentrantLock(true);</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        MyThread t1 = new MyThread(&quot;t1&quot;, lock);        </span></span>
<span class="line"><span>        MyThread t2 = new MyThread(&quot;t2&quot;, lock);</span></span>
<span class="line"><span>        MyThread t3 = new MyThread(&quot;t3&quot;, lock);</span></span>
<span class="line"><span>        t1.start();</span></span>
<span class="line"><span>        t2.start();    </span></span>
<span class="line"><span>        t3.start();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行结果(某一次):</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Thread[t1,5,main] running</span></span>
<span class="line"><span>Thread[t2,5,main] running</span></span>
<span class="line"><span>Thread[t3,5,main] running</span></span></code></pre></div><p>说明: 该示例使用的是公平策略，由结果可知，可能会存在如下一种时序。</p><p><img src="`+c+'" alt="image"></p><p>说明: 首先，t1线程的lock操作 -&gt; t2线程的lock操作 -&gt; t3线程的lock操作 -&gt; t1线程的unlock操作 -&gt; t2线程的unlock操作 -&gt; t3线程的unlock操作。根据这个时序图来进一步分析源码的工作流程。</p><ul><li>t1线程执行lock.lock，下图给出了方法调用中的主要方法。</li></ul><p><img src="'+r+'" alt="image"></p><p>说明: 由调用流程可知，t1线程成功获取了资源，可以继续执行。</p><ul><li>t2线程执行lock.lock，下图给出了方法调用中的主要方法。</li></ul><p><img src="'+o+'" alt="image"></p><p>说明: 由上图可知，最后的结果是t2线程会被禁止，因为调用了LockSupport.park。</p><ul><li>t3线程执行lock.lock，下图给出了方法调用中的主要方法。</li></ul><p><img src="'+u+'" alt="image"></p><p>说明: 由上图可知，最后的结果是t3线程会被禁止，因为调用了LockSupport.park。</p><ul><li>t1线程调用了lock.unlock，下图给出了方法调用中的主要方法。</li></ul><p><img src="'+d+'" alt="image"></p><p>说明: 如上图所示，最后，head的状态会变为0，t2线程会被unpark，即t2线程可以继续运行。此时t3线程还是被禁止。</p><ul><li>t2获得cpu资源，继续运行，由于t2之前被park了，现在需要恢复之前的状态，下图给出了方法调用中的主要方法。</li></ul><p><img src="'+h+'" alt="image"></p><p>说明: 在setHead函数中会将head设置为之前head的下一个结点，并且将pre域与thread域都设置为null，在acquireQueued返回之前，sync queue就只有两个结点了。</p><ul><li>t2执行lock.unlock，下图给出了方法调用中的主要方法。</li></ul><p><img src="'+k+'" alt="image"></p><p>说明: 由上图可知，最终unpark t3线程，让t3线程可以继续运行。</p><ul><li>t3线程获取cpu资源，恢复之前的状态，继续运行。</li></ul><p><img src="'+g+'" alt="image"></p><p>说明: 最终达到的状态是sync queue中只剩下了一个结点，并且该节点除了状态为0外，其余均为null。</p><ul><li>t3执行lock.unlock，下图给出了方法调用中的主要方法。</li></ul><p><img src="'+m+'" alt="image"></p><p>说明: 最后的状态和之前的状态是一样的，队列中有一个空节点，头节点为尾节点均指向它。</p><p>使用公平策略和Condition的情况可以参考上一篇关于AQS的源码示例分析部分，不再累赘。</p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li>文章主要参考自leesf的<a href="https://www.cnblogs.com/leesf456/p/5383609.html%EF%BC%8C%E5%9C%A8%E6%AD%A4%E5%9F%BA%E7%A1%80%E4%B8%8A%E5%81%9A%E4%BA%86%E5%A2%9E%E6%94%B9%E3%80%82" target="_blank" rel="noreferrer">https://www.cnblogs.com/leesf456/p/5383609.html，在此基础上做了增改。</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',78)]))}const j=s(b,[["render",v]]);export{_ as __pageData,j as default};
