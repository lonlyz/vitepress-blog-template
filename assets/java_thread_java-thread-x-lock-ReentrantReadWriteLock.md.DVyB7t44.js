import{_ as a}from"./chunks/java-thread-x-readwritelock-1.DL7PR3Lf.js";import{_ as s,c as p,ai as e,o as l}from"./chunks/framework.BrYByd3F.js";const t="/vitepress-blog-template/images/thread/java-thread-x-readwritelock-2.png",i="/vitepress-blog-template/images/thread/java-thread-x-readwritelock-3.png",c="/vitepress-blog-template/images/thread/java-thread-x-readwritelock-4.png",r="/vitepress-blog-template/images/thread/java-thread-x-readwritelock-5.png",o="/vitepress-blog-template/images/thread/java-thread-x-readwritelock-6.png",d="/vitepress-blog-template/images/thread/java-thread-x-readwritelock-7.png",u="/vitepress-blog-template/images/thread/java-thread-x-readwritelock-8.png",h="/vitepress-blog-template/images/thread/java-thread-x-readwritelock-9.png",k="/vitepress-blog-template/images/thread/java-thread-x-readwritelock-10.png",g="/vitepress-blog-template/images/thread/java-thread-x-readwritelock-11.png",b="/vitepress-blog-template/images/thread/java-thread-x-readwritelock-12.png",f="/vitepress-blog-template/images/thread/java-thread-x-readwritelock-13.png",x=JSON.parse('{"title":"JUC锁: ReentrantReadWriteLock详解","description":"","frontmatter":{},"headers":[],"relativePath":"java/thread/java-thread-x-lock-ReentrantReadWriteLock.md","filePath":"java/thread/java-thread-x-lock-ReentrantReadWriteLock.md","lastUpdated":1737706346000}'),v={name:"java/thread/java-thread-x-lock-ReentrantReadWriteLock.md"};function m(R,n,y,L,w,S){return l(),p("div",null,n[0]||(n[0]=[e('<h1 id="juc锁-reentrantreadwritelock详解" tabindex="-1">JUC锁: ReentrantReadWriteLock详解 <a class="header-anchor" href="#juc锁-reentrantreadwritelock详解" aria-label="Permalink to &quot;JUC锁: ReentrantReadWriteLock详解&quot;">​</a></h1><blockquote><p>ReentrantReadWriteLock表示可重入读写锁，ReentrantReadWriteLock中包含了两种锁，读锁ReadLock和写锁WriteLock，可以通过这两种锁实现线程间的同步。@pdai</p></blockquote><h2 id="带着bat大厂的面试问题去理解" tabindex="-1">带着BAT大厂的面试问题去理解 <a class="header-anchor" href="#带着bat大厂的面试问题去理解" aria-label="Permalink to &quot;带着BAT大厂的面试问题去理解&quot;">​</a></h2><p>提示</p><p>请带着这些问题继续后文，会很大程度上帮助你更好的理解相关知识点。@pdai</p><ul><li>为了有了ReentrantLock还需要ReentrantReadWriteLock?</li><li>ReentrantReadWriteLock底层实现原理?</li><li>ReentrantReadWriteLock底层读写状态如何设计的? 高16位为读锁，低16位为写锁</li><li>读锁和写锁的最大数量是多少?</li><li>本地线程计数器ThreadLocalHoldCounter是用来做什么的?</li><li>缓存计数器HoldCounter是用来做什么的?</li><li>写锁的获取与释放是怎么实现的?</li><li>读锁的获取与释放是怎么实现的?</li><li>RentrantReadWriteLock为什么不支持锁升级?</li><li>什么是锁的升降级? RentrantReadWriteLock为什么不支持锁升级?</li></ul><h2 id="reentrantreadwritelock数据结构" tabindex="-1">ReentrantReadWriteLock数据结构 <a class="header-anchor" href="#reentrantreadwritelock数据结构" aria-label="Permalink to &quot;ReentrantReadWriteLock数据结构&quot;">​</a></h2><p>ReentrantReadWriteLock底层是基于ReentrantLock和AbstractQueuedSynchronizer来实现的，所以，ReentrantReadWriteLock的数据结构也依托于AQS的数据结构。</p><h2 id="reentrantreadwritelock源码分析" tabindex="-1">ReentrantReadWriteLock源码分析 <a class="header-anchor" href="#reentrantreadwritelock源码分析" aria-label="Permalink to &quot;ReentrantReadWriteLock源码分析&quot;">​</a></h2><h3 id="类的继承关系" tabindex="-1">类的继承关系 <a class="header-anchor" href="#类的继承关系" aria-label="Permalink to &quot;类的继承关系&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ReentrantReadWriteLock implements ReadWriteLock, java.io.Serializable {}</span></span></code></pre></div><p>说明: 可以看到，ReentrantReadWriteLock实现了ReadWriteLock接口，ReadWriteLock接口定义了获取读锁和写锁的规范，具体需要实现类去实现；同时其还实现了Serializable接口，表示可以进行序列化，在源代码中可以看到ReentrantReadWriteLock实现了自己的序列化逻辑。</p><h3 id="类的内部类" tabindex="-1">类的内部类 <a class="header-anchor" href="#类的内部类" aria-label="Permalink to &quot;类的内部类&quot;">​</a></h3><p>ReentrantReadWriteLock有五个内部类，五个内部类之间也是相互关联的。内部类的关系如下图所示。</p><p><img src="'+a+`" alt="error.图片加载失败"></p><p>说明: 如上图所示，Sync继承自AQS、NonfairSync继承自Sync类、FairSync继承自Sync类；ReadLock实现了Lock接口、WriteLock也实现了Lock接口。</p><h3 id="内部类-sync类" tabindex="-1">内部类 - Sync类 <a class="header-anchor" href="#内部类-sync类" aria-label="Permalink to &quot;内部类 - Sync类&quot;">​</a></h3><ul><li>类的继承关系</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>abstract static class Sync extends AbstractQueuedSynchronizer {}</span></span></code></pre></div><p>说明: Sync抽象类继承自AQS抽象类，Sync类提供了对ReentrantReadWriteLock的支持。</p><ul><li>类的内部类</li></ul><p>Sync类内部存在两个内部类，分别为HoldCounter和ThreadLocalHoldCounter，其中HoldCounter主要与读锁配套使用，其中，HoldCounter源码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 计数器</span></span>
<span class="line"><span>static final class HoldCounter {</span></span>
<span class="line"><span>    // 计数</span></span>
<span class="line"><span>    int count = 0;</span></span>
<span class="line"><span>    // Use id, not reference, to avoid garbage retention</span></span>
<span class="line"><span>    // 获取当前线程的TID属性的值</span></span>
<span class="line"><span>    final long tid = getThreadId(Thread.currentThread());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: HoldCounter主要有两个属性，count和tid，其中count表示某个读线程重入的次数，tid表示该线程的tid字段的值，该字段可以用来唯一标识一个线程。ThreadLocalHoldCounter的源码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 本地线程计数器</span></span>
<span class="line"><span>static final class ThreadLocalHoldCounter</span></span>
<span class="line"><span>    extends ThreadLocal&lt;HoldCounter&gt; {</span></span>
<span class="line"><span>    // 重写初始化方法，在没有进行set的情况下，获取的都是该HoldCounter值</span></span>
<span class="line"><span>    public HoldCounter initialValue() {</span></span>
<span class="line"><span>        return new HoldCounter();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: ThreadLocalHoldCounter重写了ThreadLocal的initialValue方法，ThreadLocal类可以将线程与对象相关联。在没有进行set的情况下，get到的均是initialValue方法里面生成的那个HolderCounter对象。</p><ul><li>类的属性</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>abstract static class Sync extends AbstractQueuedSynchronizer {</span></span>
<span class="line"><span>    // 版本序列号</span></span>
<span class="line"><span>    private static final long serialVersionUID = 6317671515068378041L;        </span></span>
<span class="line"><span>    // 高16位为读锁，低16位为写锁</span></span>
<span class="line"><span>    static final int SHARED_SHIFT   = 16;</span></span>
<span class="line"><span>    // 读锁单位</span></span>
<span class="line"><span>    static final int SHARED_UNIT    = (1 &lt;&lt; SHARED_SHIFT);</span></span>
<span class="line"><span>    // 读锁最大数量</span></span>
<span class="line"><span>    static final int MAX_COUNT      = (1 &lt;&lt; SHARED_SHIFT) - 1;</span></span>
<span class="line"><span>    // 写锁最大数量</span></span>
<span class="line"><span>    static final int EXCLUSIVE_MASK = (1 &lt;&lt; SHARED_SHIFT) - 1;</span></span>
<span class="line"><span>    // 本地线程计数器</span></span>
<span class="line"><span>    private transient ThreadLocalHoldCounter readHolds;</span></span>
<span class="line"><span>    // 缓存的计数器</span></span>
<span class="line"><span>    private transient HoldCounter cachedHoldCounter;</span></span>
<span class="line"><span>    // 第一个读线程</span></span>
<span class="line"><span>    private transient Thread firstReader = null;</span></span>
<span class="line"><span>    // 第一个读线程的计数</span></span>
<span class="line"><span>    private transient int firstReaderHoldCount;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 该属性中包括了读锁、写锁线程的最大量。本地线程计数器等。</p><ul><li>类的构造函数</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 构造函数</span></span>
<span class="line"><span>Sync() {</span></span>
<span class="line"><span>    // 本地线程计数器</span></span>
<span class="line"><span>    readHolds = new ThreadLocalHoldCounter();</span></span>
<span class="line"><span>    // 设置AQS的状态</span></span>
<span class="line"><span>    setState(getState()); // ensures visibility of readHolds</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 在Sync的构造函数中设置了本地线程计数器和AQS的状态state。</p><h3 id="内部类-sync核心函数分析" tabindex="-1">内部类 - Sync核心函数分析 <a class="header-anchor" href="#内部类-sync核心函数分析" aria-label="Permalink to &quot;内部类 - Sync核心函数分析&quot;">​</a></h3><p>对ReentrantReadWriteLock对象的操作绝大多数都转发至Sync对象进行处理。下面对Sync类中的重点函数进行分析</p><ul><li>sharedCount函数</li></ul><p>表示占有读锁的线程数量，源码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int sharedCount(int c)    { return c &gt;&gt;&gt; SHARED_SHIFT; }</span></span></code></pre></div><p>说明: 直接将state右移16位，就可以得到读锁的线程数量，因为state的高16位表示读锁，对应的低十六位表示写锁数量。</p><ul><li>exclusiveCount函数</li></ul><p>表示占有写锁的线程数量，源码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static int exclusiveCount(int c) { return c &amp; EXCLUSIVE_MASK; }</span></span></code></pre></div><p>说明: 直接将状态state和(2^16 - 1)做与运算，其等效于将state模上2^16。写锁数量由state的低十六位表示。</p><ul><li>tryRelease函数</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span>* Note that tryRelease and tryAcquire can be called by</span></span>
<span class="line"><span>* Conditions. So it is possible that their arguments contain</span></span>
<span class="line"><span>* both read and write holds that are all released during a</span></span>
<span class="line"><span>* condition wait and re-established in tryAcquire.</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span></span></span>
<span class="line"><span>protected final boolean tryRelease(int releases) {</span></span>
<span class="line"><span>    // 判断是否伪独占线程</span></span>
<span class="line"><span>    if (!isHeldExclusively())</span></span>
<span class="line"><span>        throw new IllegalMonitorStateException();</span></span>
<span class="line"><span>    // 计算释放资源后的写锁的数量</span></span>
<span class="line"><span>    int nextc = getState() - releases;</span></span>
<span class="line"><span>    boolean free = exclusiveCount(nextc) == 0; // 是否释放成功</span></span>
<span class="line"><span>    if (free)</span></span>
<span class="line"><span>        setExclusiveOwnerThread(null); // 设置独占线程为空</span></span>
<span class="line"><span>    setState(nextc); // 设置状态</span></span>
<span class="line"><span>    return free;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 此函数用于释放写锁资源，首先会判断该线程是否为独占线程，若不为独占线程，则抛出异常，否则，计算释放资源后的写锁的数量，若为0，表示成功释放，资源不将被占用，否则，表示资源还被占用。其函数流程图如下。</p><p><img src="`+t+`" alt="error.图片加载失败"></p><ul><li>tryAcquire函数</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected final boolean tryAcquire(int acquires) {</span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>        * Walkthrough:</span></span>
<span class="line"><span>        * 1. If read count nonzero or write count nonzero</span></span>
<span class="line"><span>        *    and owner is a different thread, fail.</span></span>
<span class="line"><span>        * 2. If count would saturate, fail. (This can only</span></span>
<span class="line"><span>        *    happen if count is already nonzero.)</span></span>
<span class="line"><span>        * 3. Otherwise, this thread is eligible for lock if</span></span>
<span class="line"><span>        *    it is either a reentrant acquire or</span></span>
<span class="line"><span>        *    queue policy allows it. If so, update state</span></span>
<span class="line"><span>        *    and set owner.</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    // 获取当前线程</span></span>
<span class="line"><span>    Thread current = Thread.currentThread();</span></span>
<span class="line"><span>    // 获取状态</span></span>
<span class="line"><span>    int c = getState();</span></span>
<span class="line"><span>    // 写线程数量</span></span>
<span class="line"><span>    int w = exclusiveCount(c);</span></span>
<span class="line"><span>    if (c != 0) { // 状态不为0</span></span>
<span class="line"><span>        // (Note: if c != 0 and w == 0 then shared count != 0)</span></span>
<span class="line"><span>        if (w == 0 || current != getExclusiveOwnerThread()) // 写线程数量为0或者当前线程没有占有独占资源</span></span>
<span class="line"><span>            return false;</span></span>
<span class="line"><span>        if (w + exclusiveCount(acquires) &gt; MAX_COUNT) // 判断是否超过最高写线程数量</span></span>
<span class="line"><span>            throw new Error(&quot;Maximum lock count exceeded&quot;);</span></span>
<span class="line"><span>        // Reentrant acquire</span></span>
<span class="line"><span>        // 设置AQS状态</span></span>
<span class="line"><span>        setState(c + acquires);</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (writerShouldBlock() ||</span></span>
<span class="line"><span>        !compareAndSetState(c, c + acquires)) // 写线程是否应该被阻塞</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>    // 设置独占线程</span></span>
<span class="line"><span>    setExclusiveOwnerThread(current);</span></span>
<span class="line"><span>    return true;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 此函数用于获取写锁，首先会获取state，判断是否为0，若为0，表示此时没有读锁线程，再判断写线程是否应该被阻塞，而在非公平策略下总是不会被阻塞，在公平策略下会进行判断(判断同步队列中是否有等待时间更长的线程，若存在，则需要被阻塞，否则，无需阻塞)，之后在设置状态state，然后返回true。若state不为0，则表示此时存在读锁或写锁线程，若写锁线程数量为0或者当前线程为独占锁线程，则返回false，表示不成功，否则，判断写锁线程的重入次数是否大于了最大值，若是，则抛出异常，否则，设置状态state，返回true，表示成功。其函数流程图如下</p><p><img src="`+i+`" alt="error.图片加载失败"></p><ul><li>tryReleaseShared函数</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected final boolean tryReleaseShared(int unused) {</span></span>
<span class="line"><span>    // 获取当前线程</span></span>
<span class="line"><span>    Thread current = Thread.currentThread();</span></span>
<span class="line"><span>    if (firstReader == current) { // 当前线程为第一个读线程</span></span>
<span class="line"><span>        // assert firstReaderHoldCount &gt; 0;</span></span>
<span class="line"><span>        if (firstReaderHoldCount == 1) // 读线程占用的资源数为1</span></span>
<span class="line"><span>            firstReader = null;</span></span>
<span class="line"><span>        else // 减少占用的资源</span></span>
<span class="line"><span>            firstReaderHoldCount--;</span></span>
<span class="line"><span>    } else { // 当前线程不为第一个读线程</span></span>
<span class="line"><span>        // 获取缓存的计数器</span></span>
<span class="line"><span>        HoldCounter rh = cachedHoldCounter;</span></span>
<span class="line"><span>        if (rh == null || rh.tid != getThreadId(current)) // 计数器为空或者计数器的tid不为当前正在运行的线程的tid</span></span>
<span class="line"><span>            // 获取当前线程对应的计数器</span></span>
<span class="line"><span>            rh = readHolds.get();</span></span>
<span class="line"><span>        // 获取计数</span></span>
<span class="line"><span>        int count = rh.count;</span></span>
<span class="line"><span>        if (count &lt;= 1) { // 计数小于等于1</span></span>
<span class="line"><span>            // 移除</span></span>
<span class="line"><span>            readHolds.remove();</span></span>
<span class="line"><span>            if (count &lt;= 0) // 计数小于等于0，抛出异常</span></span>
<span class="line"><span>                throw unmatchedUnlockException();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 减少计数</span></span>
<span class="line"><span>        --rh.count;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (;;) { // 无限循环</span></span>
<span class="line"><span>        // 获取状态</span></span>
<span class="line"><span>        int c = getState();</span></span>
<span class="line"><span>        // 获取状态</span></span>
<span class="line"><span>        int nextc = c - SHARED_UNIT;</span></span>
<span class="line"><span>        if (compareAndSetState(c, nextc)) // 比较并进行设置</span></span>
<span class="line"><span>            // Releasing the read lock has no effect on readers,</span></span>
<span class="line"><span>            // but it may allow waiting writers to proceed if</span></span>
<span class="line"><span>            // both read and write locks are now free.</span></span>
<span class="line"><span>            return nextc == 0;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 此函数表示读锁线程释放锁。首先判断当前线程是否为第一个读线程firstReader，若是，则判断第一个读线程占有的资源数firstReaderHoldCount是否为1，若是，则设置第一个读线程firstReader为空，否则，将第一个读线程占有的资源数firstReaderHoldCount减1；若当前线程不是第一个读线程，那么首先会获取缓存计数器(上一个读锁线程对应的计数器 )，若计数器为空或者tid不等于当前线程的tid值，则获取当前线程的计数器，如果计数器的计数count小于等于1，则移除当前线程对应的计数器，如果计数器的计数count小于等于0，则抛出异常，之后再减少计数即可。无论何种情况，都会进入无限循环，该循环可以确保成功设置状态state。其流程图如下</p><p><img src="`+c+`" alt="error.图片加载失败"></p><ul><li>tryAcquireShared函数</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private IllegalMonitorStateException unmatchedUnlockException() {</span></span>
<span class="line"><span>    return new IllegalMonitorStateException(</span></span>
<span class="line"><span>        &quot;attempt to unlock read lock, not locked by current thread&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 共享模式下获取资源</span></span>
<span class="line"><span>protected final int tryAcquireShared(int unused) {</span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>        * Walkthrough:</span></span>
<span class="line"><span>        * 1. If write lock held by another thread, fail.</span></span>
<span class="line"><span>        * 2. Otherwise, this thread is eligible for</span></span>
<span class="line"><span>        *    lock wrt state, so ask if it should block</span></span>
<span class="line"><span>        *    because of queue policy. If not, try</span></span>
<span class="line"><span>        *    to grant by CASing state and updating count.</span></span>
<span class="line"><span>        *    Note that step does not check for reentrant</span></span>
<span class="line"><span>        *    acquires, which is postponed to full version</span></span>
<span class="line"><span>        *    to avoid having to check hold count in</span></span>
<span class="line"><span>        *    the more typical non-reentrant case.</span></span>
<span class="line"><span>        * 3. If step 2 fails either because thread</span></span>
<span class="line"><span>        *    apparently not eligible or CAS fails or count</span></span>
<span class="line"><span>        *    saturated, chain to version with full retry loop.</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    // 获取当前线程</span></span>
<span class="line"><span>    Thread current = Thread.currentThread();</span></span>
<span class="line"><span>    // 获取状态</span></span>
<span class="line"><span>    int c = getState();</span></span>
<span class="line"><span>    if (exclusiveCount(c) != 0 &amp;&amp;</span></span>
<span class="line"><span>        getExclusiveOwnerThread() != current) // 写线程数不为0并且占有资源的不是当前线程</span></span>
<span class="line"><span>        return -1;</span></span>
<span class="line"><span>    // 读锁数量</span></span>
<span class="line"><span>    int r = sharedCount(c);</span></span>
<span class="line"><span>    if (!readerShouldBlock() &amp;&amp;</span></span>
<span class="line"><span>        r &lt; MAX_COUNT &amp;&amp;</span></span>
<span class="line"><span>        compareAndSetState(c, c + SHARED_UNIT)) { // 读线程是否应该被阻塞、并且小于最大值、并且比较设置成功</span></span>
<span class="line"><span>        if (r == 0) { // 读锁数量为0</span></span>
<span class="line"><span>            // 设置第一个读线程</span></span>
<span class="line"><span>            firstReader = current;</span></span>
<span class="line"><span>            // 读线程占用的资源数为1</span></span>
<span class="line"><span>            firstReaderHoldCount = 1;</span></span>
<span class="line"><span>        } else if (firstReader == current) { // 当前线程为第一个读线程</span></span>
<span class="line"><span>            // 占用资源数加1</span></span>
<span class="line"><span>            firstReaderHoldCount++;</span></span>
<span class="line"><span>        } else { // 读锁数量不为0并且不为当前线程</span></span>
<span class="line"><span>            // 获取计数器</span></span>
<span class="line"><span>            HoldCounter rh = cachedHoldCounter;</span></span>
<span class="line"><span>            if (rh == null || rh.tid != getThreadId(current)) // 计数器为空或者计数器的tid不为当前正在运行的线程的tid</span></span>
<span class="line"><span>                // 获取当前线程对应的计数器</span></span>
<span class="line"><span>                cachedHoldCounter = rh = readHolds.get();</span></span>
<span class="line"><span>            else if (rh.count == 0) // 计数为0</span></span>
<span class="line"><span>                // 设置</span></span>
<span class="line"><span>                readHolds.set(rh);</span></span>
<span class="line"><span>            rh.count++;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return 1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return fullTryAcquireShared(current);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 此函数表示读锁线程获取读锁。首先判断写锁是否为0并且当前线程不占有独占锁，直接返回；否则，判断读线程是否需要被阻塞并且读锁数量是否小于最大值并且比较设置状态成功，若当前没有读锁，则设置第一个读线程firstReader和firstReaderHoldCount；若当前线程线程为第一个读线程，则增加firstReaderHoldCount；否则，将设置当前线程对应的HoldCounter对象的值。流程图如下。</p><p><img src="`+r+`" alt="error.图片加载失败"></p><ul><li>fullTryAcquireShared函数</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>final int fullTryAcquireShared(Thread current) {</span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>        * This code is in part redundant with that in</span></span>
<span class="line"><span>        * tryAcquireShared but is simpler overall by not</span></span>
<span class="line"><span>        * complicating tryAcquireShared with interactions between</span></span>
<span class="line"><span>        * retries and lazily reading hold counts.</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    HoldCounter rh = null;</span></span>
<span class="line"><span>    for (;;) { // 无限循环</span></span>
<span class="line"><span>        // 获取状态</span></span>
<span class="line"><span>        int c = getState();</span></span>
<span class="line"><span>        if (exclusiveCount(c) != 0) { // 写线程数量不为0</span></span>
<span class="line"><span>            if (getExclusiveOwnerThread() != current) // 不为当前线程</span></span>
<span class="line"><span>                return -1;</span></span>
<span class="line"><span>            // else we hold the exclusive lock; blocking here</span></span>
<span class="line"><span>            // would cause deadlock.</span></span>
<span class="line"><span>        } else if (readerShouldBlock()) { // 写线程数量为0并且读线程被阻塞</span></span>
<span class="line"><span>            // Make sure we&#39;re not acquiring read lock reentrantly</span></span>
<span class="line"><span>            if (firstReader == current) { // 当前线程为第一个读线程</span></span>
<span class="line"><span>                // assert firstReaderHoldCount &gt; 0;</span></span>
<span class="line"><span>            } else { // 当前线程不为第一个读线程</span></span>
<span class="line"><span>                if (rh == null) { // 计数器不为空</span></span>
<span class="line"><span>                    // </span></span>
<span class="line"><span>                    rh = cachedHoldCounter;</span></span>
<span class="line"><span>                    if (rh == null || rh.tid != getThreadId(current)) { // 计数器为空或者计数器的tid不为当前正在运行的线程的tid</span></span>
<span class="line"><span>                        rh = readHolds.get();</span></span>
<span class="line"><span>                        if (rh.count == 0)</span></span>
<span class="line"><span>                            readHolds.remove();</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                if (rh.count == 0)</span></span>
<span class="line"><span>                    return -1;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (sharedCount(c) == MAX_COUNT) // 读锁数量为最大值，抛出异常</span></span>
<span class="line"><span>            throw new Error(&quot;Maximum lock count exceeded&quot;);</span></span>
<span class="line"><span>        if (compareAndSetState(c, c + SHARED_UNIT)) { // 比较并且设置成功</span></span>
<span class="line"><span>            if (sharedCount(c) == 0) { // 读线程数量为0</span></span>
<span class="line"><span>                // 设置第一个读线程</span></span>
<span class="line"><span>                firstReader = current;</span></span>
<span class="line"><span>                // </span></span>
<span class="line"><span>                firstReaderHoldCount = 1;</span></span>
<span class="line"><span>            } else if (firstReader == current) {</span></span>
<span class="line"><span>                firstReaderHoldCount++;</span></span>
<span class="line"><span>            } else {</span></span>
<span class="line"><span>                if (rh == null)</span></span>
<span class="line"><span>                    rh = cachedHoldCounter;</span></span>
<span class="line"><span>                if (rh == null || rh.tid != getThreadId(current))</span></span>
<span class="line"><span>                    rh = readHolds.get();</span></span>
<span class="line"><span>                else if (rh.count == 0)</span></span>
<span class="line"><span>                    readHolds.set(rh);</span></span>
<span class="line"><span>                rh.count++;</span></span>
<span class="line"><span>                cachedHoldCounter = rh; // cache for release</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            return 1;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 在tryAcquireShared函数中，如果下列三个条件不满足(读线程是否应该被阻塞、小于最大值、比较设置成功)则会进行fullTryAcquireShared函数中，它用来保证相关操作可以成功。其逻辑与tryAcquireShared逻辑类似，不再累赘。</p><p>而其他内部类的操作基本上都是转化到了对Sync对象的操作，在此不再累赘。</p><h3 id="类的属性" tabindex="-1">类的属性 <a class="header-anchor" href="#类的属性" aria-label="Permalink to &quot;类的属性&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ReentrantReadWriteLock</span></span>
<span class="line"><span>        implements ReadWriteLock, java.io.Serializable {</span></span>
<span class="line"><span>    // 版本序列号    </span></span>
<span class="line"><span>    private static final long serialVersionUID = -6992448646407690164L;    </span></span>
<span class="line"><span>    // 读锁</span></span>
<span class="line"><span>    private final ReentrantReadWriteLock.ReadLock readerLock;</span></span>
<span class="line"><span>    // 写锁</span></span>
<span class="line"><span>    private final ReentrantReadWriteLock.WriteLock writerLock;</span></span>
<span class="line"><span>    // 同步队列</span></span>
<span class="line"><span>    final Sync sync;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    private static final sun.misc.Unsafe UNSAFE;</span></span>
<span class="line"><span>    // 线程ID的偏移地址</span></span>
<span class="line"><span>    private static final long TID_OFFSET;</span></span>
<span class="line"><span>    static {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            UNSAFE = sun.misc.Unsafe.getUnsafe();</span></span>
<span class="line"><span>            Class&lt;?&gt; tk = Thread.class;</span></span>
<span class="line"><span>            // 获取线程的tid字段的内存地址</span></span>
<span class="line"><span>            TID_OFFSET = UNSAFE.objectFieldOffset</span></span>
<span class="line"><span>                (tk.getDeclaredField(&quot;tid&quot;));</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            throw new Error(e);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 可以看到ReentrantReadWriteLock属性包括了一个ReentrantReadWriteLock.ReadLock对象，表示读锁；一个ReentrantReadWriteLock.WriteLock对象，表示写锁；一个Sync对象，表示同步队列。</p><h3 id="类的构造函数" tabindex="-1">类的构造函数 <a class="header-anchor" href="#类的构造函数" aria-label="Permalink to &quot;类的构造函数&quot;">​</a></h3><ul><li>ReentrantReadWriteLock()型构造函数</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ReentrantReadWriteLock() {</span></span>
<span class="line"><span>    this(false);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 此构造函数会调用另外一个有参构造函数。</p><ul><li>ReentrantReadWriteLock(boolean)型构造函数</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ReentrantReadWriteLock(boolean fair) {</span></span>
<span class="line"><span>    // 公平策略或者是非公平策略</span></span>
<span class="line"><span>    sync = fair ? new FairSync() : new NonfairSync();</span></span>
<span class="line"><span>    // 读锁</span></span>
<span class="line"><span>    readerLock = new ReadLock(this);</span></span>
<span class="line"><span>    // 写锁</span></span>
<span class="line"><span>    writerLock = new WriteLock(this);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 可以指定设置公平策略或者非公平策略，并且该构造函数中生成了读锁与写锁两个对象。</p><h3 id="核心函数分析" tabindex="-1">核心函数分析 <a class="header-anchor" href="#核心函数分析" aria-label="Permalink to &quot;核心函数分析&quot;">​</a></h3><p>对ReentrantReadWriteLock的操作基本上都转化为了对Sync对象的操作，而Sync的函数已经分析过，不再累赘。</p><h2 id="reentrantreadwritelock示例" tabindex="-1">ReentrantReadWriteLock示例 <a class="header-anchor" href="#reentrantreadwritelock示例" aria-label="Permalink to &quot;ReentrantReadWriteLock示例&quot;">​</a></h2><p>下面给出了一个使用ReentrantReadWriteLock的示例，源代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.concurrent.locks.ReentrantReadWriteLock;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class ReadThread extends Thread {</span></span>
<span class="line"><span>    private ReentrantReadWriteLock rrwLock;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public ReadThread(String name, ReentrantReadWriteLock rrwLock) {</span></span>
<span class="line"><span>        super(name);</span></span>
<span class="line"><span>        this.rrwLock = rrwLock;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public void run() {</span></span>
<span class="line"><span>        System.out.println(Thread.currentThread().getName() + &quot; trying to lock&quot;);</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            rrwLock.readLock().lock();</span></span>
<span class="line"><span>            System.out.println(Thread.currentThread().getName() + &quot; lock successfully&quot;);</span></span>
<span class="line"><span>            Thread.sleep(5000);        </span></span>
<span class="line"><span>        } catch (InterruptedException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            rrwLock.readLock().unlock();</span></span>
<span class="line"><span>            System.out.println(Thread.currentThread().getName() + &quot; unlock successfully&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class WriteThread extends Thread {</span></span>
<span class="line"><span>    private ReentrantReadWriteLock rrwLock;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public WriteThread(String name, ReentrantReadWriteLock rrwLock) {</span></span>
<span class="line"><span>        super(name);</span></span>
<span class="line"><span>        this.rrwLock = rrwLock;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public void run() {</span></span>
<span class="line"><span>        System.out.println(Thread.currentThread().getName() + &quot; trying to lock&quot;);</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            rrwLock.writeLock().lock();</span></span>
<span class="line"><span>            System.out.println(Thread.currentThread().getName() + &quot; lock successfully&quot;);    </span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            rrwLock.writeLock().unlock();</span></span>
<span class="line"><span>            System.out.println(Thread.currentThread().getName() + &quot; unlock successfully&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class ReentrantReadWriteLockDemo {</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        ReentrantReadWriteLock rrwLock = new ReentrantReadWriteLock();</span></span>
<span class="line"><span>        ReadThread rt1 = new ReadThread(&quot;rt1&quot;, rrwLock);</span></span>
<span class="line"><span>        ReadThread rt2 = new ReadThread(&quot;rt2&quot;, rrwLock);</span></span>
<span class="line"><span>        WriteThread wt1 = new WriteThread(&quot;wt1&quot;, rrwLock);</span></span>
<span class="line"><span>        rt1.start();</span></span>
<span class="line"><span>        rt2.start();</span></span>
<span class="line"><span>        wt1.start();</span></span>
<span class="line"><span>    } </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行结果(某一次):</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>rt1 trying to lock</span></span>
<span class="line"><span>rt2 trying to lock</span></span>
<span class="line"><span>wt1 trying to lock</span></span>
<span class="line"><span>rt1 lock successfully</span></span>
<span class="line"><span>rt2 lock successfully</span></span>
<span class="line"><span>rt1 unlock successfully</span></span>
<span class="line"><span>rt2 unlock successfully</span></span>
<span class="line"><span>wt1 lock successfully</span></span>
<span class="line"><span>wt1 unlock successfully</span></span></code></pre></div><p>说明: 程序中生成了一个ReentrantReadWriteLock对象，并且设置了两个读线程，一个写线程。根据结果，可能存在如下的时序图。</p><p><img src="`+o+'" alt="error.图片加载失败"></p><ul><li>rt1线程执行rrwLock.readLock().lock操作，主要的函数调用如下。</li></ul><p><img src="'+d+'" alt="error.图片加载失败"></p><p>说明: 此时，AQS的状态state为2^16 次方，即表示此时读线程数量为1。</p><ul><li>rt2线程执行rrwLock.readLock().lock操作，主要的函数调用如下。</li></ul><p><img src="'+u+'" alt="error.图片加载失败"></p><p>说明: 此时，AQS的状态state为2 * 2^16次方，即表示此时读线程数量为2。</p><ul><li>wt1线程执行rrwLock.writeLock().lock操作，主要的函数调用如下。</li></ul><p><img src="'+h+'" alt="error.图片加载失败"></p><p>说明: 此时，在同步队列Sync queue中存在两个结点，并且wt1线程会被禁止运行。</p><ul><li>rt1线程执行rrwLock.readLock().unlock操作，主要的函数调用如下。</li></ul><p><img src="'+k+'" alt="error.图片加载失败"></p><p>说明: 此时，AQS的state为2^16次方，表示还有一个读线程。</p><ul><li>rt2线程执行rrwLock.readLock().unlock操作，主要的函数调用如下。</li></ul><p><img src="'+g+'" alt="error.图片加载失败"></p><p>说明: 当rt2线程执行unlock操作后，AQS的state为0，并且wt1线程将会被unpark，其获得CPU资源就可以运行。</p><ul><li>wt1线程获得CPU资源，继续运行，需要恢复。由于之前acquireQueued函数中的parkAndCheckInterrupt函数中被禁止的，所以，恢复到parkAndCheckInterrupt函数中，主要的函数调用如下</li></ul><p><img src="'+b+'" alt="error.图片加载失败"></p><p>说明: 最后，sync queue队列中只有一个结点，并且头节点尾节点均指向它，AQS的state值为1，表示此时有一个写线程。</p><ul><li>wt1执行rrwLock.writeLock().unlock操作，主要的函数调用如下。</li></ul><p><img src="'+f+`" alt="error.图片加载失败"></p><p>说明: 此时，AQS的state为0，表示没有任何读线程或者写线程了。并且Sync queue结构与上一个状态的结构相同，没有变化。</p><h2 id="更深入理解" tabindex="-1">更深入理解 <a class="header-anchor" href="#更深入理解" aria-label="Permalink to &quot;更深入理解&quot;">​</a></h2><h3 id="什么是锁升降级" tabindex="-1">什么是锁升降级? <a class="header-anchor" href="#什么是锁升降级" aria-label="Permalink to &quot;什么是锁升降级?&quot;">​</a></h3><p>锁降级指的是写锁降级成为读锁。如果当前线程拥有写锁，然后将其释放，最后再获取读锁，这种分段完成的过程不能称之为锁降级。锁降级是指把持住(当前拥有的)写锁，再获取到读锁，随后释放(先前拥有的)写锁的过程。</p><p>接下来看一个锁降级的示例。因为数据不常变化，所以多个线程可以并发地进行数据处理，当数据变更后，如果当前线程感知到数据变化，则进行数据的准备工作，同时其他处理线程被阻塞，直到当前线程完成数据的准备工作，如代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void processData() {</span></span>
<span class="line"><span>    readLock.lock();</span></span>
<span class="line"><span>    if (!update) {</span></span>
<span class="line"><span>        // 必须先释放读锁</span></span>
<span class="line"><span>        readLock.unlock();</span></span>
<span class="line"><span>        // 锁降级从写锁获取到开始</span></span>
<span class="line"><span>        writeLock.lock();</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            if (!update) {</span></span>
<span class="line"><span>                // 准备数据的流程(略)</span></span>
<span class="line"><span>                update = true;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            readLock.lock();</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            writeLock.unlock();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 锁降级完成，写锁降级为读锁</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        // 使用数据的流程(略)</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        readLock.unlock();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述示例中，当数据发生变更后，update变量(布尔类型且volatile修饰)被设置为false，此时所有访问processData()方法的线程都能够感知到变化，但只有一个线程能够获取到写锁，其他线程会被阻塞在读锁和写锁的lock()方法上。当前线程获取写锁完成数据准备之后，再获取读锁，随后释放写锁，完成锁降级。</p><p>锁降级中读锁的获取是否必要呢? 答案是必要的。主要是为了保证数据的可见性，如果当前线程不获取读锁而是直接释放写锁，假设此刻另一个线程(记作线程T)获取了写锁并修改了数据，那么当前线程无法感知线程T的数据更新。如果当前线程获取读锁，即遵循锁降级的步骤，则线程T将会被阻塞，直到当前线程使用数据并释放读锁之后，线程T才能获取写锁进行数据更新。</p><p>RentrantReadWriteLock不支持锁升级(把持读锁、获取写锁，最后释放读锁的过程)。目的也是保证数据可见性，如果读锁已被多个线程获取，其中任意线程成功获取了写锁并更新了数据，则其更新对其他获取到读锁的线程是不可见的。</p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li>文章主要参考自leesf的<a href="https://www.cnblogs.com/leesf456/p/5419132.html%EF%BC%8C%E5%9C%A8%E6%AD%A4%E5%9F%BA%E7%A1%80%E4%B8%8A%E5%81%9A%E4%BA%86%E5%A2%9E%E6%94%B9%E3%80%82" target="_blank" rel="noreferrer">https://www.cnblogs.com/leesf456/p/5419132.html，在此基础上做了增改。</a></li><li><a href="https://blog.csdn.net/jiankunking/article/details/83954263" target="_blank" rel="noreferrer">https://blog.csdn.net/jiankunking/article/details/83954263</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,113)]))}const q=s(v,[["render",m]]);export{x as __pageData,q as default};
