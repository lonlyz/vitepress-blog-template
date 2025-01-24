import{_ as s}from"./chunks/java-thread-x-juc-aqs-1.Ple5V3jo.js";import{_ as a,c as p,ai as e,o as l}from"./chunks/framework.BrYByd3F.js";const i="/vitepress-blog-template/images/thread/java-thread-x-juc-aqs-2.png",t="/vitepress-blog-template/images/thread/java-thread-x-juc-aqs-3.png",c="/vitepress-blog-template/images/thread/java-thread-x-juc-aqs-4.png",r="/vitepress-blog-template/images/thread/java-thread-x-juc-aqs-5.png",o="/vitepress-blog-template/images/thread/java-thread-x-juc-aqs-6.png",d="/vitepress-blog-template/images/thread/java-thread-x-juc-aqs-7.png",u="/vitepress-blog-template/images/thread/java-thread-x-juc-aqs-8.png",h="/vitepress-blog-template/images/thread/java-thread-x-juc-aqs-9.png",g="/vitepress-blog-template/images/thread/java-thread-x-juc-aqs-10.png",m="/vitepress-blog-template/images/thread/java-thread-x-juc-aqs-11.png",f="/vitepress-blog-template/images/thread/java-thread-x-juc-aqs-12.png",b="/vitepress-blog-template/images/thread/java-thread-x-juc-aqs-13.png",k="/vitepress-blog-template/images/thread/java-thread-x-juc-aqs-14.png",v="/vitepress-blog-template/images/thread/java-thread-x-juc-aqs-15.png",w="/vitepress-blog-template/images/thread/java-thread-x-juc-aqs-17-1.png",S="/vitepress-blog-template/images/thread/java-thread-x-juc-aqs-16.png",y="/vitepress-blog-template/images/thread/java-thread-x-juc-aqs-17.png",q="/vitepress-blog-template/images/thread/java-thread-x-juc-aqs-18.png",x="/vitepress-blog-template/images/thread/java-thread-x-juc-aqs-19.png",A="/vitepress-blog-template/images/thread/java-thread-x-juc-aqs-20.png",C="/vitepress-blog-template/images/thread/java-thread-x-juc-aqs-21.png",N="/vitepress-blog-template/images/thread/java-thread-x-juc-aqs-22.png",j=JSON.parse('{"title":"JUC锁: 锁核心类AQS详解","description":"","frontmatter":{},"headers":[],"relativePath":"java/thread/java-thread-x-lock-AbstractQueuedSynchronizer.md","filePath":"java/thread/java-thread-x-lock-AbstractQueuedSynchronizer.md","lastUpdated":1737706346000}'),I={name:"java/thread/java-thread-x-lock-AbstractQueuedSynchronizer.md"};function T(E,n,W,O,Q,L){return l(),p("div",null,n[0]||(n[0]=[e(`<h1 id="juc锁-锁核心类aqs详解" tabindex="-1">JUC锁: 锁核心类AQS详解 <a class="header-anchor" href="#juc锁-锁核心类aqs详解" aria-label="Permalink to &quot;JUC锁: 锁核心类AQS详解&quot;">​</a></h1><blockquote><p>AbstractQueuedSynchronizer抽象类是核心，需要重点掌握。它提供了一个基于FIFO队列，可以用于构建锁或者其他相关同步装置的基础框架。@pdai</p></blockquote><h2 id="带着bat大厂的面试问题去理解" tabindex="-1">带着BAT大厂的面试问题去理解 <a class="header-anchor" href="#带着bat大厂的面试问题去理解" aria-label="Permalink to &quot;带着BAT大厂的面试问题去理解&quot;">​</a></h2><p>提示</p><p>请带着这些问题继续后文，会很大程度上帮助你更好的理解相关知识点。@pdai</p><ul><li>什么是AQS? 为什么它是核心?</li><li>AQS的核心思想是什么? 它是怎么实现的? 底层数据结构等</li><li>AQS有哪些核心的方法?</li><li>AQS定义什么样的资源获取方式? AQS定义了两种资源获取方式：<code>独占</code>(只有一个线程能访问执行，又根据是否按队列的顺序分为<code>公平锁</code>和<code>非公平锁</code>，如<code>ReentrantLock</code>) 和<code>共享</code>(多个线程可同时访问执行，如<code>Semaphore</code>、<code>CountDownLatch</code>、 <code>CyclicBarrier</code> )。<code>ReentrantReadWriteLock</code>可以看成是组合式，允许多个线程同时对某一资源进行读。</li><li>AQS底层使用了什么样的设计模式? 模板</li><li>AQS的应用示例?</li></ul><h2 id="abstractqueuedsynchronizer简介" tabindex="-1">AbstractQueuedSynchronizer简介 <a class="header-anchor" href="#abstractqueuedsynchronizer简介" aria-label="Permalink to &quot;AbstractQueuedSynchronizer简介&quot;">​</a></h2><p>AQS是一个用来构建锁和同步器的框架，使用AQS能简单且高效地构造出应用广泛的大量的同步器，比如我们提到的ReentrantLock，Semaphore，其他的诸如ReentrantReadWriteLock，SynchronousQueue，FutureTask等等皆是基于AQS的。当然，我们自己也能利用AQS非常轻松容易地构造出符合我们自己需求的同步器。</p><h3 id="aqs-核心思想" tabindex="-1">AQS 核心思想 <a class="header-anchor" href="#aqs-核心思想" aria-label="Permalink to &quot;AQS 核心思想&quot;">​</a></h3><p>AQS核心思想是，如果被请求的共享资源空闲，则将当前请求资源的线程设置为有效的工作线程，并且将共享资源设置为锁定状态。如果被请求的共享资源被占用，那么就需要一套线程阻塞等待以及被唤醒时锁分配的机制，这个机制AQS是用CLH队列锁实现的，即将暂时获取不到锁的线程加入到队列中。</p><blockquote><p>CLH(Craig,Landin,and Hagersten)队列是一个虚拟的双向队列(虚拟的双向队列即不存在队列实例，仅存在结点之间的关联关系)。AQS是将每条请求共享资源的线程封装成一个CLH锁队列的一个结点(Node)来实现锁的分配。</p></blockquote><p>AQS使用一个int成员变量来表示同步状态，通过内置的FIFO队列来完成获取资源线程的排队工作。AQS使用CAS对该同步状态进行原子操作实现对其值的修改。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private volatile int state;//共享变量，使用volatile修饰保证线程可见性</span></span></code></pre></div><p>状态信息通过procted类型的getState，setState，compareAndSetState进行操作</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//返回同步状态的当前值</span></span>
<span class="line"><span>protected final int getState() {  </span></span>
<span class="line"><span>        return state;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span> // 设置同步状态的值</span></span>
<span class="line"><span>protected final void setState(int newState) { </span></span>
<span class="line"><span>        state = newState;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//原子地(CAS操作)将同步状态值设置为给定值update如果当前同步状态的值等于expect(期望值)</span></span>
<span class="line"><span>protected final boolean compareAndSetState(int expect, int update) {</span></span>
<span class="line"><span>        return unsafe.compareAndSwapInt(this, stateOffset, expect, update);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="aqs-对资源的共享方式" tabindex="-1">AQS 对资源的共享方式 <a class="header-anchor" href="#aqs-对资源的共享方式" aria-label="Permalink to &quot;AQS 对资源的共享方式&quot;">​</a></h3><p>AQS定义两种资源共享方式</p><ul><li>Exclusive(独占)：只有一个线程能执行，如ReentrantLock。又可分为公平锁和非公平锁： <ul><li>公平锁：按照线程在队列中的排队顺序，先到者先拿到锁</li><li>非公平锁：当线程要获取锁时，无视队列顺序直接去抢锁，谁抢到就是谁的</li></ul></li><li>Share(共享)：多个线程可同时执行，如Semaphore/CountDownLatch。Semaphore、CountDownLatCh、 CyclicBarrier、ReadWriteLock 我们都会在后面讲到。</li></ul><p>ReentrantReadWriteLock 可以看成是组合式，因为ReentrantReadWriteLock也就是读写锁允许多个线程同时对某一资源进行读。</p><p>不同的自定义同步器争用共享资源的方式也不同。自定义同步器在实现时只需要实现共享资源 state 的获取与释放方式即可，至于具体线程等待队列的维护(如获取资源失败入队/唤醒出队等)，AQS已经在上层已经帮我们实现好了。</p><h3 id="aqs底层使用了模板方法模式" tabindex="-1">AQS底层使用了模板方法模式 <a class="header-anchor" href="#aqs底层使用了模板方法模式" aria-label="Permalink to &quot;AQS底层使用了模板方法模式&quot;">​</a></h3><blockquote><p>同步器的设计是基于模板方法模式的，如果需要自定义同步器一般的方式是这样(模板方法模式很经典的一个应用)：</p></blockquote><p>使用者继承AbstractQueuedSynchronizer并重写指定的方法。(这些重写方法很简单，无非是对于共享资源state的获取和释放) 将AQS组合在自定义同步组件的实现中，并调用其模板方法，而这些模板方法会调用使用者重写的方法。</p><p>这和我们以往通过实现接口的方式有很大区别，模板方法模式请参看：<a href="https://pdai.tech/md/dev-spec/pattern/17_template.html" target="_blank" rel="noreferrer">设计模式行为型 - 模板方法(Template Method)详解</a></p><p>AQS使用了模板方法模式，自定义同步器时需要重写下面几个AQS提供的模板方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>isHeldExclusively()//该线程是否正在独占资源。只有用到condition才需要去实现它。</span></span>
<span class="line"><span>tryAcquire(int)//独占方式。尝试获取资源，成功则返回true，失败则返回false。</span></span>
<span class="line"><span>tryRelease(int)//独占方式。尝试释放资源，成功则返回true，失败则返回false。</span></span>
<span class="line"><span>tryAcquireShared(int)//共享方式。尝试获取资源。负数表示失败；0表示成功，但没有剩余可用资源；正数表示成功，且有剩余资源。</span></span>
<span class="line"><span>tryReleaseShared(int)//共享方式。尝试释放资源，成功则返回true，失败则返回false。</span></span></code></pre></div><p>默认情况下，每个方法都抛出 UnsupportedOperationException。 这些方法的实现必须是内部线程安全的，并且通常应该简短而不是阻塞。AQS类中的其他方法都是final ，所以无法被其他类使用，只有这几个方法可以被其他类使用。</p><p>以ReentrantLock为例，state初始化为0，表示未锁定状态。A线程lock()时，会调用tryAcquire()独占该锁并将state+1。此后，其他线程再tryAcquire()时就会失败，直到A线程unlock()到state=0(即释放锁)为止，其它线程才有机会获取该锁。当然，释放锁之前，A线程自己是可以重复获取此锁的(state会累加)，这就是可重入的概念。但要注意，获取多少次就要释放多么次，这样才能保证state是能回到零态的。</p><h2 id="abstractqueuedsynchronizer数据结构" tabindex="-1">AbstractQueuedSynchronizer数据结构 <a class="header-anchor" href="#abstractqueuedsynchronizer数据结构" aria-label="Permalink to &quot;AbstractQueuedSynchronizer数据结构&quot;">​</a></h2><p>AbstractQueuedSynchronizer类底层的数据结构是使用<code>CLH(Craig,Landin,and Hagersten)队列</code>是一个虚拟的双向队列(虚拟的双向队列即不存在队列实例，仅存在结点之间的关联关系)。AQS是将每条请求共享资源的线程封装成一个CLH锁队列的一个结点(Node)来实现锁的分配。其中Sync queue，即同步队列，是双向链表，包括head结点和tail结点，head结点主要用作后续的调度。而Condition queue不是必须的，其是一个单向链表，只有当使用Condition时，才会存在此单向链表。并且可能会有多个Condition queue。</p><p><img src="`+s+`" alt="image"></p><h2 id="abstractqueuedsynchronizer源码分析" tabindex="-1">AbstractQueuedSynchronizer源码分析 <a class="header-anchor" href="#abstractqueuedsynchronizer源码分析" aria-label="Permalink to &quot;AbstractQueuedSynchronizer源码分析&quot;">​</a></h2><h3 id="类的继承关系" tabindex="-1">类的继承关系 <a class="header-anchor" href="#类的继承关系" aria-label="Permalink to &quot;类的继承关系&quot;">​</a></h3><p>AbstractQueuedSynchronizer继承自AbstractOwnableSynchronizer抽象类，并且实现了Serializable接口，可以进行序列化。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public abstract class AbstractQueuedSynchronizer extends AbstractOwnableSynchronizer implements java.io.Serializable</span></span></code></pre></div><p>其中AbstractOwnableSynchronizer抽象类的源码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public abstract class AbstractOwnableSynchronizer implements java.io.Serializable {</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 版本序列号</span></span>
<span class="line"><span>    private static final long serialVersionUID = 3737899427754241961L;</span></span>
<span class="line"><span>    // 构造方法</span></span>
<span class="line"><span>    protected AbstractOwnableSynchronizer() { }</span></span>
<span class="line"><span>    // 独占模式下的线程</span></span>
<span class="line"><span>    private transient Thread exclusiveOwnerThread;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 设置独占线程 </span></span>
<span class="line"><span>    protected final void setExclusiveOwnerThread(Thread thread) {</span></span>
<span class="line"><span>        exclusiveOwnerThread = thread;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 获取独占线程 </span></span>
<span class="line"><span>    protected final Thread getExclusiveOwnerThread() {</span></span>
<span class="line"><span>        return exclusiveOwnerThread;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>AbstractOwnableSynchronizer抽象类中，可以设置独占资源线程和获取独占资源线程。分别为setExclusiveOwnerThread与getExclusiveOwnerThread方法，这两个方法会被子类调用。</p><blockquote><p>AbstractQueuedSynchronizer类有两个内部类，分别为Node类与ConditionObject类。下面分别做介绍。</p></blockquote><h3 id="类的内部类-node类" tabindex="-1">类的内部类 - Node类 <a class="header-anchor" href="#类的内部类-node类" aria-label="Permalink to &quot;类的内部类 - Node类&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static final class Node {</span></span>
<span class="line"><span>    // 模式，分为共享与独占</span></span>
<span class="line"><span>    // 共享模式</span></span>
<span class="line"><span>    static final Node SHARED = new Node();</span></span>
<span class="line"><span>    // 独占模式</span></span>
<span class="line"><span>    static final Node EXCLUSIVE = null;        </span></span>
<span class="line"><span>    // 结点状态</span></span>
<span class="line"><span>    // CANCELLED，值为1，表示当前的线程被取消</span></span>
<span class="line"><span>    // SIGNAL，值为-1，表示当前节点的后继节点包含的线程需要运行，也就是unpark</span></span>
<span class="line"><span>    // CONDITION，值为-2，表示当前节点在等待condition，也就是在condition队列中</span></span>
<span class="line"><span>    // PROPAGATE，值为-3，表示当前场景下后续的acquireShared能够得以执行</span></span>
<span class="line"><span>    // 值为0，表示当前节点在sync队列中，等待着获取锁</span></span>
<span class="line"><span>    static final int CANCELLED =  1;</span></span>
<span class="line"><span>    static final int SIGNAL    = -1;</span></span>
<span class="line"><span>    static final int CONDITION = -2;</span></span>
<span class="line"><span>    static final int PROPAGATE = -3;        </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 结点状态</span></span>
<span class="line"><span>    volatile int waitStatus;        </span></span>
<span class="line"><span>    // 前驱结点</span></span>
<span class="line"><span>    volatile Node prev;    </span></span>
<span class="line"><span>    // 后继结点</span></span>
<span class="line"><span>    volatile Node next;        </span></span>
<span class="line"><span>    // 结点所对应的线程</span></span>
<span class="line"><span>    volatile Thread thread;        </span></span>
<span class="line"><span>    // 下一个等待者</span></span>
<span class="line"><span>    Node nextWaiter;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 结点是否在共享模式下等待</span></span>
<span class="line"><span>    final boolean isShared() {</span></span>
<span class="line"><span>        return nextWaiter == SHARED;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 获取前驱结点，若前驱结点为空，抛出异常</span></span>
<span class="line"><span>    final Node predecessor() throws NullPointerException {</span></span>
<span class="line"><span>        // 保存前驱结点</span></span>
<span class="line"><span>        Node p = prev; </span></span>
<span class="line"><span>        if (p == null) // 前驱结点为空，抛出异常</span></span>
<span class="line"><span>            throw new NullPointerException();</span></span>
<span class="line"><span>        else // 前驱结点不为空，返回</span></span>
<span class="line"><span>            return p;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 无参构造方法</span></span>
<span class="line"><span>    Node() {    // Used to establish initial head or SHARED marker</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 构造方法</span></span>
<span class="line"><span>        Node(Thread thread, Node mode) {    // Used by addWaiter</span></span>
<span class="line"><span>        this.nextWaiter = mode;</span></span>
<span class="line"><span>        this.thread = thread;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 构造方法</span></span>
<span class="line"><span>    Node(Thread thread, int waitStatus) { // Used by Condition</span></span>
<span class="line"><span>        this.waitStatus = waitStatus;</span></span>
<span class="line"><span>        this.thread = thread;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>每个线程被阻塞的线程都会被封装成一个Node结点，放入队列。每个节点包含了一个Thread类型的引用，并且每个节点都存在一个状态，具体状态如下。</p><ul><li><p><code>CANCELLED</code>，值为1，表示当前的线程被取消。</p></li><li><p><code>SIGNAL</code>，值为-1，表示当前节点的后继节点包含的线程需要运行，需要进行unpark操作。</p></li><li><p><code>CONDITION</code>，值为-2，表示当前节点在等待condition，也就是在condition queue中。</p></li><li><p><code>PROPAGATE</code>，值为-3，表示当前场景下后续的acquireShared能够得以执行。</p></li><li><p>值为0，表示当前节点在sync queue中，等待着获取锁。</p></li></ul><h3 id="类的内部类-conditionobject类" tabindex="-1">类的内部类 - ConditionObject类 <a class="header-anchor" href="#类的内部类-conditionobject类" aria-label="Permalink to &quot;类的内部类 - ConditionObject类&quot;">​</a></h3><p>这个类有点长，耐心看下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 内部类</span></span>
<span class="line"><span>public class ConditionObject implements Condition, java.io.Serializable {</span></span>
<span class="line"><span>    // 版本号</span></span>
<span class="line"><span>    private static final long serialVersionUID = 1173984872572414699L;</span></span>
<span class="line"><span>    /** First node of condition queue. */</span></span>
<span class="line"><span>    // condition队列的头节点</span></span>
<span class="line"><span>    private transient Node firstWaiter;</span></span>
<span class="line"><span>    /** Last node of condition queue. */</span></span>
<span class="line"><span>    // condition队列的尾结点</span></span>
<span class="line"><span>    private transient Node lastWaiter;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>        * Creates a new {@code ConditionObject} instance.</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    // 构造方法</span></span>
<span class="line"><span>    public ConditionObject() { }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Internal methods</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>        * Adds a new waiter to wait queue.</span></span>
<span class="line"><span>        * @return its new wait node</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    // 添加新的waiter到wait队列</span></span>
<span class="line"><span>    private Node addConditionWaiter() {</span></span>
<span class="line"><span>        // 保存尾结点</span></span>
<span class="line"><span>        Node t = lastWaiter;</span></span>
<span class="line"><span>        // If lastWaiter is cancelled, clean out.</span></span>
<span class="line"><span>        if (t != null &amp;&amp; t.waitStatus != Node.CONDITION) { // 尾结点不为空，并且尾结点的状态不为CONDITION</span></span>
<span class="line"><span>            // 清除状态为CONDITION的结点</span></span>
<span class="line"><span>            unlinkCancelledWaiters(); </span></span>
<span class="line"><span>            // 将最后一个结点重新赋值给t</span></span>
<span class="line"><span>            t = lastWaiter;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 新建一个结点</span></span>
<span class="line"><span>        Node node = new Node(Thread.currentThread(), Node.CONDITION);</span></span>
<span class="line"><span>        if (t == null) // 尾结点为空</span></span>
<span class="line"><span>            // 设置condition队列的头节点</span></span>
<span class="line"><span>            firstWaiter = node;</span></span>
<span class="line"><span>        else // 尾结点不为空</span></span>
<span class="line"><span>            // 设置为节点的nextWaiter域为node结点</span></span>
<span class="line"><span>            t.nextWaiter = node;</span></span>
<span class="line"><span>        // 更新condition队列的尾结点</span></span>
<span class="line"><span>        lastWaiter = node;</span></span>
<span class="line"><span>        return node;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>        * Removes and transfers nodes until hit non-cancelled one or</span></span>
<span class="line"><span>        * null. Split out from signal in part to encourage compilers</span></span>
<span class="line"><span>        * to inline the case of no waiters.</span></span>
<span class="line"><span>        * @param first (non-null) the first node on condition queue</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    private void doSignal(Node first) {</span></span>
<span class="line"><span>        // 循环</span></span>
<span class="line"><span>        do {</span></span>
<span class="line"><span>            if ( (firstWaiter = first.nextWaiter) == null) // 该节点的nextWaiter为空</span></span>
<span class="line"><span>                // 设置尾结点为空</span></span>
<span class="line"><span>                lastWaiter = null;</span></span>
<span class="line"><span>            // 设置first结点的nextWaiter域</span></span>
<span class="line"><span>            first.nextWaiter = null;</span></span>
<span class="line"><span>        } while (!transferForSignal(first) &amp;&amp;</span></span>
<span class="line"><span>                    (first = firstWaiter) != null); // 将结点从condition队列转移到sync队列失败并且condition队列中的头节点不为空，一直循环</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>        * Removes and transfers all nodes.</span></span>
<span class="line"><span>        * @param first (non-null) the first node on condition queue</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    private void doSignalAll(Node first) {</span></span>
<span class="line"><span>        // condition队列的头节点尾结点都设置为空</span></span>
<span class="line"><span>        lastWaiter = firstWaiter = null;</span></span>
<span class="line"><span>        // 循环</span></span>
<span class="line"><span>        do {</span></span>
<span class="line"><span>            // 获取first结点的nextWaiter域结点</span></span>
<span class="line"><span>            Node next = first.nextWaiter;</span></span>
<span class="line"><span>            // 设置first结点的nextWaiter域为空</span></span>
<span class="line"><span>            first.nextWaiter = null;</span></span>
<span class="line"><span>            // 将first结点从condition队列转移到sync队列</span></span>
<span class="line"><span>            transferForSignal(first);</span></span>
<span class="line"><span>            // 重新设置first</span></span>
<span class="line"><span>            first = next;</span></span>
<span class="line"><span>        } while (first != null);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>        * Unlinks cancelled waiter nodes from condition queue.</span></span>
<span class="line"><span>        * Called only while holding lock. This is called when</span></span>
<span class="line"><span>        * cancellation occurred during condition wait, and upon</span></span>
<span class="line"><span>        * insertion of a new waiter when lastWaiter is seen to have</span></span>
<span class="line"><span>        * been cancelled. This method is needed to avoid garbage</span></span>
<span class="line"><span>        * retention in the absence of signals. So even though it may</span></span>
<span class="line"><span>        * require a full traversal, it comes into play only when</span></span>
<span class="line"><span>        * timeouts or cancellations occur in the absence of</span></span>
<span class="line"><span>        * signals. It traverses all nodes rather than stopping at a</span></span>
<span class="line"><span>        * particular target to unlink all pointers to garbage nodes</span></span>
<span class="line"><span>        * without requiring many re-traversals during cancellation</span></span>
<span class="line"><span>        * storms.</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    // 从condition队列中清除状态为CANCEL的结点</span></span>
<span class="line"><span>    private void unlinkCancelledWaiters() {</span></span>
<span class="line"><span>        // 保存condition队列头节点</span></span>
<span class="line"><span>        Node t = firstWaiter;</span></span>
<span class="line"><span>        Node trail = null;</span></span>
<span class="line"><span>        while (t != null) { // t不为空</span></span>
<span class="line"><span>            // 下一个结点</span></span>
<span class="line"><span>            Node next = t.nextWaiter;</span></span>
<span class="line"><span>            if (t.waitStatus != Node.CONDITION) { // t结点的状态不为CONDTION状态</span></span>
<span class="line"><span>                // 设置t节点的nextWaiter域为空</span></span>
<span class="line"><span>                t.nextWaiter = null;</span></span>
<span class="line"><span>                if (trail == null) // trail为空</span></span>
<span class="line"><span>                    // 重新设置condition队列的头节点</span></span>
<span class="line"><span>                    firstWaiter = next;</span></span>
<span class="line"><span>                else // trail不为空</span></span>
<span class="line"><span>                    // 设置trail结点的nextWaiter域为next结点</span></span>
<span class="line"><span>                    trail.nextWaiter = next;</span></span>
<span class="line"><span>                if (next == null) // next结点为空</span></span>
<span class="line"><span>                    // 设置condition队列的尾结点</span></span>
<span class="line"><span>                    lastWaiter = trail;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            else // t结点的状态为CONDTION状态</span></span>
<span class="line"><span>                // 设置trail结点</span></span>
<span class="line"><span>                trail = t;</span></span>
<span class="line"><span>            // 设置t结点</span></span>
<span class="line"><span>            t = next;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // public methods</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>        * Moves the longest-waiting thread, if one exists, from the</span></span>
<span class="line"><span>        * wait queue for this condition to the wait queue for the</span></span>
<span class="line"><span>        * owning lock.</span></span>
<span class="line"><span>        *</span></span>
<span class="line"><span>        * @throws IllegalMonitorStateException if {@link #isHeldExclusively}</span></span>
<span class="line"><span>        *         returns {@code false}</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    // 唤醒一个等待线程。如果所有的线程都在等待此条件，则选择其中的一个唤醒。在从 await 返回之前，该线程必须重新获取锁。</span></span>
<span class="line"><span>    public final void signal() {</span></span>
<span class="line"><span>        if (!isHeldExclusively()) // 不被当前线程独占，抛出异常</span></span>
<span class="line"><span>            throw new IllegalMonitorStateException();</span></span>
<span class="line"><span>        // 保存condition队列头节点</span></span>
<span class="line"><span>        Node first = firstWaiter;</span></span>
<span class="line"><span>        if (first != null) // 头节点不为空</span></span>
<span class="line"><span>            // 唤醒一个等待线程</span></span>
<span class="line"><span>            doSignal(first);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>        * Moves all threads from the wait queue for this condition to</span></span>
<span class="line"><span>        * the wait queue for the owning lock.</span></span>
<span class="line"><span>        *</span></span>
<span class="line"><span>        * @throws IllegalMonitorStateException if {@link #isHeldExclusively}</span></span>
<span class="line"><span>        *         returns {@code false}</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    // 唤醒所有等待线程。如果所有的线程都在等待此条件，则唤醒所有线程。在从 await 返回之前，每个线程都必须重新获取锁。</span></span>
<span class="line"><span>    public final void signalAll() {</span></span>
<span class="line"><span>        if (!isHeldExclusively()) // 不被当前线程独占，抛出异常</span></span>
<span class="line"><span>            throw new IllegalMonitorStateException();</span></span>
<span class="line"><span>        // 保存condition队列头节点</span></span>
<span class="line"><span>        Node first = firstWaiter;</span></span>
<span class="line"><span>        if (first != null) // 头节点不为空</span></span>
<span class="line"><span>            // 唤醒所有等待线程</span></span>
<span class="line"><span>            doSignalAll(first);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>        * Implements uninterruptible condition wait.</span></span>
<span class="line"><span>        * &lt;ol&gt;</span></span>
<span class="line"><span>        * &lt;li&gt; Save lock state returned by {@link #getState}.</span></span>
<span class="line"><span>        * &lt;li&gt; Invoke {@link #release} with saved state as argument,</span></span>
<span class="line"><span>        *      throwing IllegalMonitorStateException if it fails.</span></span>
<span class="line"><span>        * &lt;li&gt; Block until signalled.</span></span>
<span class="line"><span>        * &lt;li&gt; Reacquire by invoking specialized version of</span></span>
<span class="line"><span>        *      {@link #acquire} with saved state as argument.</span></span>
<span class="line"><span>        * &lt;/ol&gt;</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    // 等待，当前线程在接到信号之前一直处于等待状态，不响应中断</span></span>
<span class="line"><span>    public final void awaitUninterruptibly() {</span></span>
<span class="line"><span>        // 添加一个结点到等待队列</span></span>
<span class="line"><span>        Node node = addConditionWaiter();</span></span>
<span class="line"><span>        // 获取释放的状态</span></span>
<span class="line"><span>        int savedState = fullyRelease(node);</span></span>
<span class="line"><span>        boolean interrupted = false;</span></span>
<span class="line"><span>        while (!isOnSyncQueue(node)) { // </span></span>
<span class="line"><span>            // 阻塞当前线程</span></span>
<span class="line"><span>            LockSupport.park(this);</span></span>
<span class="line"><span>            if (Thread.interrupted()) // 当前线程被中断</span></span>
<span class="line"><span>                // 设置interrupted状态</span></span>
<span class="line"><span>                interrupted = true; </span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (acquireQueued(node, savedState) || interrupted) // </span></span>
<span class="line"><span>            selfInterrupt();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>        * For interruptible waits, we need to track whether to throw</span></span>
<span class="line"><span>        * InterruptedException, if interrupted while blocked on</span></span>
<span class="line"><span>        * condition, versus reinterrupt current thread, if</span></span>
<span class="line"><span>        * interrupted while blocked waiting to re-acquire.</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /** Mode meaning to reinterrupt on exit from wait */</span></span>
<span class="line"><span>    private static final int REINTERRUPT =  1;</span></span>
<span class="line"><span>    /** Mode meaning to throw InterruptedException on exit from wait */</span></span>
<span class="line"><span>    private static final int THROW_IE    = -1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>        * Checks for interrupt, returning THROW_IE if interrupted</span></span>
<span class="line"><span>        * before signalled, REINTERRUPT if after signalled, or</span></span>
<span class="line"><span>        * 0 if not interrupted.</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    private int checkInterruptWhileWaiting(Node node) {</span></span>
<span class="line"><span>        return Thread.interrupted() ?</span></span>
<span class="line"><span>            (transferAfterCancelledWait(node) ? THROW_IE : REINTERRUPT) :</span></span>
<span class="line"><span>            0; </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>        * Throws InterruptedException, reinterrupts current thread, or</span></span>
<span class="line"><span>        * does nothing, depending on mode.</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    private void reportInterruptAfterWait(int interruptMode)</span></span>
<span class="line"><span>        throws InterruptedException {</span></span>
<span class="line"><span>        if (interruptMode == THROW_IE)</span></span>
<span class="line"><span>            throw new InterruptedException();</span></span>
<span class="line"><span>        else if (interruptMode == REINTERRUPT)</span></span>
<span class="line"><span>            selfInterrupt();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>        * Implements interruptible condition wait.</span></span>
<span class="line"><span>        * &lt;ol&gt;</span></span>
<span class="line"><span>        * &lt;li&gt; If current thread is interrupted, throw InterruptedException.</span></span>
<span class="line"><span>        * &lt;li&gt; Save lock state returned by {@link #getState}.</span></span>
<span class="line"><span>        * &lt;li&gt; Invoke {@link #release} with saved state as argument,</span></span>
<span class="line"><span>        *      throwing IllegalMonitorStateException if it fails.</span></span>
<span class="line"><span>        * &lt;li&gt; Block until signalled or interrupted.</span></span>
<span class="line"><span>        * &lt;li&gt; Reacquire by invoking specialized version of</span></span>
<span class="line"><span>        *      {@link #acquire} with saved state as argument.</span></span>
<span class="line"><span>        * &lt;li&gt; If interrupted while blocked in step 4, throw InterruptedException.</span></span>
<span class="line"><span>        * &lt;/ol&gt;</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    // // 等待，当前线程在接到信号或被中断之前一直处于等待状态</span></span>
<span class="line"><span>    public final void await() throws InterruptedException {</span></span>
<span class="line"><span>        if (Thread.interrupted()) // 当前线程被中断，抛出异常</span></span>
<span class="line"><span>            throw new InterruptedException();</span></span>
<span class="line"><span>        // 在wait队列上添加一个结点</span></span>
<span class="line"><span>        Node node = addConditionWaiter();</span></span>
<span class="line"><span>        // </span></span>
<span class="line"><span>        int savedState = fullyRelease(node);</span></span>
<span class="line"><span>        int interruptMode = 0;</span></span>
<span class="line"><span>        while (!isOnSyncQueue(node)) {</span></span>
<span class="line"><span>            // 阻塞当前线程</span></span>
<span class="line"><span>            LockSupport.park(this);</span></span>
<span class="line"><span>            if ((interruptMode = checkInterruptWhileWaiting(node)) != 0) // 检查结点等待时的中断类型</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (acquireQueued(node, savedState) &amp;&amp; interruptMode != THROW_IE)</span></span>
<span class="line"><span>            interruptMode = REINTERRUPT;</span></span>
<span class="line"><span>        if (node.nextWaiter != null) // clean up if cancelled</span></span>
<span class="line"><span>            unlinkCancelledWaiters();</span></span>
<span class="line"><span>        if (interruptMode != 0)</span></span>
<span class="line"><span>            reportInterruptAfterWait(interruptMode);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>        * Implements timed condition wait.</span></span>
<span class="line"><span>        * &lt;ol&gt;</span></span>
<span class="line"><span>        * &lt;li&gt; If current thread is interrupted, throw InterruptedException.</span></span>
<span class="line"><span>        * &lt;li&gt; Save lock state returned by {@link #getState}.</span></span>
<span class="line"><span>        * &lt;li&gt; Invoke {@link #release} with saved state as argument,</span></span>
<span class="line"><span>        *      throwing IllegalMonitorStateException if it fails.</span></span>
<span class="line"><span>        * &lt;li&gt; Block until signalled, interrupted, or timed out.</span></span>
<span class="line"><span>        * &lt;li&gt; Reacquire by invoking specialized version of</span></span>
<span class="line"><span>        *      {@link #acquire} with saved state as argument.</span></span>
<span class="line"><span>        * &lt;li&gt; If interrupted while blocked in step 4, throw InterruptedException.</span></span>
<span class="line"><span>        * &lt;/ol&gt;</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    // 等待，当前线程在接到信号、被中断或到达指定等待时间之前一直处于等待状态 </span></span>
<span class="line"><span>    public final long awaitNanos(long nanosTimeout)</span></span>
<span class="line"><span>            throws InterruptedException {</span></span>
<span class="line"><span>        if (Thread.interrupted())</span></span>
<span class="line"><span>            throw new InterruptedException();</span></span>
<span class="line"><span>        Node node = addConditionWaiter();</span></span>
<span class="line"><span>        int savedState = fullyRelease(node);</span></span>
<span class="line"><span>        final long deadline = System.nanoTime() + nanosTimeout;</span></span>
<span class="line"><span>        int interruptMode = 0;</span></span>
<span class="line"><span>        while (!isOnSyncQueue(node)) {</span></span>
<span class="line"><span>            if (nanosTimeout &lt;= 0L) {</span></span>
<span class="line"><span>                transferAfterCancelledWait(node);</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (nanosTimeout &gt;= spinForTimeoutThreshold)</span></span>
<span class="line"><span>                LockSupport.parkNanos(this, nanosTimeout);</span></span>
<span class="line"><span>            if ((interruptMode = checkInterruptWhileWaiting(node)) != 0)</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            nanosTimeout = deadline - System.nanoTime();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (acquireQueued(node, savedState) &amp;&amp; interruptMode != THROW_IE)</span></span>
<span class="line"><span>            interruptMode = REINTERRUPT;</span></span>
<span class="line"><span>        if (node.nextWaiter != null)</span></span>
<span class="line"><span>            unlinkCancelledWaiters();</span></span>
<span class="line"><span>        if (interruptMode != 0)</span></span>
<span class="line"><span>            reportInterruptAfterWait(interruptMode);</span></span>
<span class="line"><span>        return deadline - System.nanoTime();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>        * Implements absolute timed condition wait.</span></span>
<span class="line"><span>        * &lt;ol&gt;</span></span>
<span class="line"><span>        * &lt;li&gt; If current thread is interrupted, throw InterruptedException.</span></span>
<span class="line"><span>        * &lt;li&gt; Save lock state returned by {@link #getState}.</span></span>
<span class="line"><span>        * &lt;li&gt; Invoke {@link #release} with saved state as argument,</span></span>
<span class="line"><span>        *      throwing IllegalMonitorStateException if it fails.</span></span>
<span class="line"><span>        * &lt;li&gt; Block until signalled, interrupted, or timed out.</span></span>
<span class="line"><span>        * &lt;li&gt; Reacquire by invoking specialized version of</span></span>
<span class="line"><span>        *      {@link #acquire} with saved state as argument.</span></span>
<span class="line"><span>        * &lt;li&gt; If interrupted while blocked in step 4, throw InterruptedException.</span></span>
<span class="line"><span>        * &lt;li&gt; If timed out while blocked in step 4, return false, else true.</span></span>
<span class="line"><span>        * &lt;/ol&gt;</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    // 等待，当前线程在接到信号、被中断或到达指定最后期限之前一直处于等待状态</span></span>
<span class="line"><span>    public final boolean awaitUntil(Date deadline)</span></span>
<span class="line"><span>            throws InterruptedException {</span></span>
<span class="line"><span>        long abstime = deadline.getTime();</span></span>
<span class="line"><span>        if (Thread.interrupted())</span></span>
<span class="line"><span>            throw new InterruptedException();</span></span>
<span class="line"><span>        Node node = addConditionWaiter();</span></span>
<span class="line"><span>        int savedState = fullyRelease(node);</span></span>
<span class="line"><span>        boolean timedout = false;</span></span>
<span class="line"><span>        int interruptMode = 0;</span></span>
<span class="line"><span>        while (!isOnSyncQueue(node)) {</span></span>
<span class="line"><span>            if (System.currentTimeMillis() &gt; abstime) {</span></span>
<span class="line"><span>                timedout = transferAfterCancelledWait(node);</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            LockSupport.parkUntil(this, abstime);</span></span>
<span class="line"><span>            if ((interruptMode = checkInterruptWhileWaiting(node)) != 0)</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (acquireQueued(node, savedState) &amp;&amp; interruptMode != THROW_IE)</span></span>
<span class="line"><span>            interruptMode = REINTERRUPT;</span></span>
<span class="line"><span>        if (node.nextWaiter != null)</span></span>
<span class="line"><span>            unlinkCancelledWaiters();</span></span>
<span class="line"><span>        if (interruptMode != 0)</span></span>
<span class="line"><span>            reportInterruptAfterWait(interruptMode);</span></span>
<span class="line"><span>        return !timedout;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>        * Implements timed condition wait.</span></span>
<span class="line"><span>        * &lt;ol&gt;</span></span>
<span class="line"><span>        * &lt;li&gt; If current thread is interrupted, throw InterruptedException.</span></span>
<span class="line"><span>        * &lt;li&gt; Save lock state returned by {@link #getState}.</span></span>
<span class="line"><span>        * &lt;li&gt; Invoke {@link #release} with saved state as argument,</span></span>
<span class="line"><span>        *      throwing IllegalMonitorStateException if it fails.</span></span>
<span class="line"><span>        * &lt;li&gt; Block until signalled, interrupted, or timed out.</span></span>
<span class="line"><span>        * &lt;li&gt; Reacquire by invoking specialized version of</span></span>
<span class="line"><span>        *      {@link #acquire} with saved state as argument.</span></span>
<span class="line"><span>        * &lt;li&gt; If interrupted while blocked in step 4, throw InterruptedException.</span></span>
<span class="line"><span>        * &lt;li&gt; If timed out while blocked in step 4, return false, else true.</span></span>
<span class="line"><span>        * &lt;/ol&gt;</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    // 等待，当前线程在接到信号、被中断或到达指定等待时间之前一直处于等待状态。此方法在行为上等效于: awaitNanos(unit.toNanos(time)) &gt; 0</span></span>
<span class="line"><span>    public final boolean await(long time, TimeUnit unit)</span></span>
<span class="line"><span>            throws InterruptedException {</span></span>
<span class="line"><span>        long nanosTimeout = unit.toNanos(time);</span></span>
<span class="line"><span>        if (Thread.interrupted())</span></span>
<span class="line"><span>            throw new InterruptedException();</span></span>
<span class="line"><span>        Node node = addConditionWaiter();</span></span>
<span class="line"><span>        int savedState = fullyRelease(node);</span></span>
<span class="line"><span>        final long deadline = System.nanoTime() + nanosTimeout;</span></span>
<span class="line"><span>        boolean timedout = false;</span></span>
<span class="line"><span>        int interruptMode = 0;</span></span>
<span class="line"><span>        while (!isOnSyncQueue(node)) {</span></span>
<span class="line"><span>            if (nanosTimeout &lt;= 0L) {</span></span>
<span class="line"><span>                timedout = transferAfterCancelledWait(node);</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (nanosTimeout &gt;= spinForTimeoutThreshold)</span></span>
<span class="line"><span>                LockSupport.parkNanos(this, nanosTimeout);</span></span>
<span class="line"><span>            if ((interruptMode = checkInterruptWhileWaiting(node)) != 0)</span></span>
<span class="line"><span>                break;</span></span>
<span class="line"><span>            nanosTimeout = deadline - System.nanoTime();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (acquireQueued(node, savedState) &amp;&amp; interruptMode != THROW_IE)</span></span>
<span class="line"><span>            interruptMode = REINTERRUPT;</span></span>
<span class="line"><span>        if (node.nextWaiter != null)</span></span>
<span class="line"><span>            unlinkCancelledWaiters();</span></span>
<span class="line"><span>        if (interruptMode != 0)</span></span>
<span class="line"><span>            reportInterruptAfterWait(interruptMode);</span></span>
<span class="line"><span>        return !timedout;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //  support for instrumentation</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>        * Returns true if this condition was created by the given</span></span>
<span class="line"><span>        * synchronization object.</span></span>
<span class="line"><span>        *</span></span>
<span class="line"><span>        * @return {@code true} if owned</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    final boolean isOwnedBy(AbstractQueuedSynchronizer sync) {</span></span>
<span class="line"><span>        return sync == AbstractQueuedSynchronizer.this;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>        * Queries whether any threads are waiting on this condition.</span></span>
<span class="line"><span>        * Implements {@link AbstractQueuedSynchronizer#hasWaiters(ConditionObject)}.</span></span>
<span class="line"><span>        *</span></span>
<span class="line"><span>        * @return {@code true} if there are any waiting threads</span></span>
<span class="line"><span>        * @throws IllegalMonitorStateException if {@link #isHeldExclusively}</span></span>
<span class="line"><span>        *         returns {@code false}</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    //  查询是否有正在等待此条件的任何线程</span></span>
<span class="line"><span>    protected final boolean hasWaiters() {</span></span>
<span class="line"><span>        if (!isHeldExclusively())</span></span>
<span class="line"><span>            throw new IllegalMonitorStateException();</span></span>
<span class="line"><span>        for (Node w = firstWaiter; w != null; w = w.nextWaiter) {</span></span>
<span class="line"><span>            if (w.waitStatus == Node.CONDITION)</span></span>
<span class="line"><span>                return true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>        * Returns an estimate of the number of threads waiting on</span></span>
<span class="line"><span>        * this condition.</span></span>
<span class="line"><span>        * Implements {@link AbstractQueuedSynchronizer#getWaitQueueLength(ConditionObject)}.</span></span>
<span class="line"><span>        *</span></span>
<span class="line"><span>        * @return the estimated number of waiting threads</span></span>
<span class="line"><span>        * @throws IllegalMonitorStateException if {@link #isHeldExclusively}</span></span>
<span class="line"><span>        *         returns {@code false}</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    // 返回正在等待此条件的线程数估计值</span></span>
<span class="line"><span>    protected final int getWaitQueueLength() {</span></span>
<span class="line"><span>        if (!isHeldExclusively())</span></span>
<span class="line"><span>            throw new IllegalMonitorStateException();</span></span>
<span class="line"><span>        int n = 0;</span></span>
<span class="line"><span>        for (Node w = firstWaiter; w != null; w = w.nextWaiter) {</span></span>
<span class="line"><span>            if (w.waitStatus == Node.CONDITION)</span></span>
<span class="line"><span>                ++n;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return n;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>        * Returns a collection containing those threads that may be</span></span>
<span class="line"><span>        * waiting on this Condition.</span></span>
<span class="line"><span>        * Implements {@link AbstractQueuedSynchronizer#getWaitingThreads(ConditionObject)}.</span></span>
<span class="line"><span>        *</span></span>
<span class="line"><span>        * @return the collection of threads</span></span>
<span class="line"><span>        * @throws IllegalMonitorStateException if {@link #isHeldExclusively}</span></span>
<span class="line"><span>        *         returns {@code false}</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    // 返回包含那些可能正在等待此条件的线程集合</span></span>
<span class="line"><span>    protected final Collection&lt;Thread&gt; getWaitingThreads() {</span></span>
<span class="line"><span>        if (!isHeldExclusively())</span></span>
<span class="line"><span>            throw new IllegalMonitorStateException();</span></span>
<span class="line"><span>        ArrayList&lt;Thread&gt; list = new ArrayList&lt;Thread&gt;();</span></span>
<span class="line"><span>        for (Node w = firstWaiter; w != null; w = w.nextWaiter) {</span></span>
<span class="line"><span>            if (w.waitStatus == Node.CONDITION) {</span></span>
<span class="line"><span>                Thread t = w.thread;</span></span>
<span class="line"><span>                if (t != null)</span></span>
<span class="line"><span>                    list.add(t);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return list;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>此类实现了Condition接口，Condition接口定义了条件操作规范，具体如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Condition {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 等待，当前线程在接到信号或被中断之前一直处于等待状态</span></span>
<span class="line"><span>    void await() throws InterruptedException;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 等待，当前线程在接到信号之前一直处于等待状态，不响应中断</span></span>
<span class="line"><span>    void awaitUninterruptibly();</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    //等待，当前线程在接到信号、被中断或到达指定等待时间之前一直处于等待状态 </span></span>
<span class="line"><span>    long awaitNanos(long nanosTimeout) throws InterruptedException;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 等待，当前线程在接到信号、被中断或到达指定等待时间之前一直处于等待状态。此方法在行为上等效于: awaitNanos(unit.toNanos(time)) &gt; 0</span></span>
<span class="line"><span>    boolean await(long time, TimeUnit unit) throws InterruptedException;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 等待，当前线程在接到信号、被中断或到达指定最后期限之前一直处于等待状态</span></span>
<span class="line"><span>    boolean awaitUntil(Date deadline) throws InterruptedException;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 唤醒一个等待线程。如果所有的线程都在等待此条件，则选择其中的一个唤醒。在从 await 返回之前，该线程必须重新获取锁。</span></span>
<span class="line"><span>    void signal();</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 唤醒所有等待线程。如果所有的线程都在等待此条件，则唤醒所有线程。在从 await 返回之前，每个线程都必须重新获取锁。</span></span>
<span class="line"><span>    void signalAll();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Condition接口中定义了await、signal方法，用来等待条件、释放条件。之后会详细分析CondtionObject的源码。</p><h3 id="类的属性" tabindex="-1">类的属性 <a class="header-anchor" href="#类的属性" aria-label="Permalink to &quot;类的属性&quot;">​</a></h3><p>属性中包含了头节点head，尾结点tail，状态state、自旋时间spinForTimeoutThreshold，还有AbstractQueuedSynchronizer抽象的属性在内存中的偏移地址，通过该偏移地址，可以获取和设置该属性的值，同时还包括一个静态初始化块，用于加载内存偏移地址。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public abstract class AbstractQueuedSynchronizer extends AbstractOwnableSynchronizer</span></span>
<span class="line"><span>    implements java.io.Serializable {    </span></span>
<span class="line"><span>    // 版本号</span></span>
<span class="line"><span>    private static final long serialVersionUID = 7373984972572414691L;    </span></span>
<span class="line"><span>    // 头节点</span></span>
<span class="line"><span>    private transient volatile Node head;    </span></span>
<span class="line"><span>    // 尾结点</span></span>
<span class="line"><span>    private transient volatile Node tail;    </span></span>
<span class="line"><span>    // 状态</span></span>
<span class="line"><span>    private volatile int state;    </span></span>
<span class="line"><span>    // 自旋时间</span></span>
<span class="line"><span>    static final long spinForTimeoutThreshold = 1000L;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // Unsafe类实例</span></span>
<span class="line"><span>    private static final Unsafe unsafe = Unsafe.getUnsafe();</span></span>
<span class="line"><span>    // state内存偏移地址</span></span>
<span class="line"><span>    private static final long stateOffset;</span></span>
<span class="line"><span>    // head内存偏移地址</span></span>
<span class="line"><span>    private static final long headOffset;</span></span>
<span class="line"><span>    // state内存偏移地址</span></span>
<span class="line"><span>    private static final long tailOffset;</span></span>
<span class="line"><span>    // tail内存偏移地址</span></span>
<span class="line"><span>    private static final long waitStatusOffset;</span></span>
<span class="line"><span>    // next内存偏移地址</span></span>
<span class="line"><span>    private static final long nextOffset;</span></span>
<span class="line"><span>    // 静态初始化块</span></span>
<span class="line"><span>    static {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            stateOffset = unsafe.objectFieldOffset</span></span>
<span class="line"><span>                (AbstractQueuedSynchronizer.class.getDeclaredField(&quot;state&quot;));</span></span>
<span class="line"><span>            headOffset = unsafe.objectFieldOffset</span></span>
<span class="line"><span>                (AbstractQueuedSynchronizer.class.getDeclaredField(&quot;head&quot;));</span></span>
<span class="line"><span>            tailOffset = unsafe.objectFieldOffset</span></span>
<span class="line"><span>                (AbstractQueuedSynchronizer.class.getDeclaredField(&quot;tail&quot;));</span></span>
<span class="line"><span>            waitStatusOffset = unsafe.objectFieldOffset</span></span>
<span class="line"><span>                (Node.class.getDeclaredField(&quot;waitStatus&quot;));</span></span>
<span class="line"><span>            nextOffset = unsafe.objectFieldOffset</span></span>
<span class="line"><span>                (Node.class.getDeclaredField(&quot;next&quot;));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        } catch (Exception ex) { throw new Error(ex); }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="类的构造方法" tabindex="-1">类的构造方法 <a class="header-anchor" href="#类的构造方法" aria-label="Permalink to &quot;类的构造方法&quot;">​</a></h3><p>此类构造方法为从抽象构造方法，供子类调用。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>protected AbstractQueuedSynchronizer() { }</span></span></code></pre></div><h3 id="类的核心方法-acquire方法" tabindex="-1">类的核心方法 - acquire方法 <a class="header-anchor" href="#类的核心方法-acquire方法" aria-label="Permalink to &quot;类的核心方法 - acquire方法&quot;">​</a></h3><p>该方法以独占模式获取(资源)，忽略中断，即线程在aquire过程中，中断此线程是无效的。源码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final void acquire(int arg) {</span></span>
<span class="line"><span>    if (!tryAcquire(arg) &amp;&amp; acquireQueued(addWaiter(Node.EXCLUSIVE), arg))</span></span>
<span class="line"><span>        selfInterrupt();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>由上述源码可以知道，当一个线程调用acquire时，调用方法流程如下</p><p><img src="`+i+`" alt="image"></p><ul><li><p>首先调用tryAcquire方法，调用此方法的线程会试图在独占模式下获取对象状态。此方法应该查询是否允许它在独占模式下获取对象状态，如果允许，则获取它。在AbstractQueuedSynchronizer源码中默认会抛出一个异常，即需要子类去重写此方法完成自己的逻辑。之后会进行分析。</p></li><li><p>若tryAcquire失败，则调用addWaiter方法，addWaiter方法完成的功能是将调用此方法的线程封装成为一个结点并放入Sync queue。</p></li><li><p>调用acquireQueued方法，此方法完成的功能是Sync queue中的结点不断尝试获取资源，若成功，则返回true，否则，返回false。</p></li><li><p>由于tryAcquire默认实现是抛出异常，所以此时，不进行分析，之后会结合一个例子进行分析。</p></li></ul><p>首先分析addWaiter方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 添加等待者</span></span>
<span class="line"><span>private Node addWaiter(Node mode) {</span></span>
<span class="line"><span>    // 新生成一个结点，默认为独占模式</span></span>
<span class="line"><span>    Node node = new Node(Thread.currentThread(), mode);</span></span>
<span class="line"><span>    // Try the fast path of enq; backup to full enq on failure</span></span>
<span class="line"><span>    // 保存尾结点</span></span>
<span class="line"><span>    Node pred = tail;</span></span>
<span class="line"><span>    if (pred != null) { // 尾结点不为空，即已经被初始化</span></span>
<span class="line"><span>        // 将node结点的prev域连接到尾结点</span></span>
<span class="line"><span>        node.prev = pred; </span></span>
<span class="line"><span>        if (compareAndSetTail(pred, node)) { // 比较pred是否为尾结点，是则将尾结点设置为node </span></span>
<span class="line"><span>            // 设置尾结点的next域为node</span></span>
<span class="line"><span>            pred.next = node;</span></span>
<span class="line"><span>            return node; // 返回新生成的结点</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    enq(node); // 尾结点为空(即还没有被初始化过)，或者是compareAndSetTail操作失败，则入队列</span></span>
<span class="line"><span>    return node;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>addWaiter方法使用快速添加的方式往sync queue尾部添加结点，如果sync queue队列还没有初始化，则会使用enq插入队列中，enq方法源码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private Node enq(final Node node) {</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><p>enq方法会使用无限循环来确保节点的成功插入。</p><p>现在，分析acquireQueue方法。其源码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// sync队列中的结点在独占且忽略中断的模式下获取(资源)</span></span>
<span class="line"><span>final boolean acquireQueued(final Node node, int arg) {</span></span>
<span class="line"><span>    // 标志</span></span>
<span class="line"><span>    boolean failed = true;</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        // 中断标志</span></span>
<span class="line"><span>        boolean interrupted = false;</span></span>
<span class="line"><span>        for (;;) { // 无限循环</span></span>
<span class="line"><span>            // 获取node节点的前驱结点</span></span>
<span class="line"><span>            final Node p = node.predecessor(); </span></span>
<span class="line"><span>            if (p == head &amp;&amp; tryAcquire(arg)) { // 前驱为头节点并且成功获得锁</span></span>
<span class="line"><span>                setHead(node); // 设置头节点</span></span>
<span class="line"><span>                p.next = null; // help GC</span></span>
<span class="line"><span>                failed = false; // 设置标志</span></span>
<span class="line"><span>                return interrupted; </span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            if (shouldParkAfterFailedAcquire(p, node) &amp;&amp;</span></span>
<span class="line"><span>                parkAndCheckInterrupt())</span></span>
<span class="line"><span>                interrupted = true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        if (failed)</span></span>
<span class="line"><span>            cancelAcquire(node);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>首先获取当前节点的前驱节点，如果前驱节点是头节点并且能够获取(资源)，代表该当前节点能够占有锁，设置头节点为当前节点，返回。否则，调用shouldParkAfterFailedAcquire和parkAndCheckInterrupt方法，首先，我们看shouldParkAfterFailedAcquire方法，代码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 当获取(资源)失败后，检查并且更新结点状态</span></span>
<span class="line"><span>private static boolean shouldParkAfterFailedAcquire(Node pred, Node node) {</span></span>
<span class="line"><span>    // 获取前驱结点的状态</span></span>
<span class="line"><span>    int ws = pred.waitStatus;</span></span>
<span class="line"><span>    if (ws == Node.SIGNAL) // 状态为SIGNAL，为-1</span></span>
<span class="line"><span>        /*</span></span>
<span class="line"><span>            * This node has already set status asking a release</span></span>
<span class="line"><span>            * to signal it, so it can safely park.</span></span>
<span class="line"><span>            */</span></span>
<span class="line"><span>        // 可以进行park操作</span></span>
<span class="line"><span>        return true; </span></span>
<span class="line"><span>    if (ws &gt; 0) { // 表示状态为CANCELLED，为1</span></span>
<span class="line"><span>        /*</span></span>
<span class="line"><span>            * Predecessor was cancelled. Skip over predecessors and</span></span>
<span class="line"><span>            * indicate retry.</span></span>
<span class="line"><span>            */</span></span>
<span class="line"><span>        do {</span></span>
<span class="line"><span>            node.prev = pred = pred.prev;</span></span>
<span class="line"><span>        } while (pred.waitStatus &gt; 0); // 找到pred结点前面最近的一个状态不为CANCELLED的结点</span></span>
<span class="line"><span>        // 赋值pred结点的next域</span></span>
<span class="line"><span>        pred.next = node; </span></span>
<span class="line"><span>    } else { // 为PROPAGATE -3 或者是0 表示无状态,(为CONDITION -2时，表示此节点在condition queue中) </span></span>
<span class="line"><span>        /*</span></span>
<span class="line"><span>            * waitStatus must be 0 or PROPAGATE.  Indicate that we</span></span>
<span class="line"><span>            * need a signal, but don&#39;t park yet.  Caller will need to</span></span>
<span class="line"><span>            * retry to make sure it cannot acquire before parking.</span></span>
<span class="line"><span>            */</span></span>
<span class="line"><span>        // 比较并设置前驱结点的状态为SIGNAL</span></span>
<span class="line"><span>        compareAndSetWaitStatus(pred, ws, Node.SIGNAL); </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 不能进行park操作</span></span>
<span class="line"><span>    return false;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>只有当该节点的前驱结点的状态为SIGNAL时，才可以对该结点所封装的线程进行park操作。否则，将不能进行park操作。再看parkAndCheckInterrupt方法，源码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 进行park操作并且返回该线程是否被中断</span></span>
<span class="line"><span>private final boolean parkAndCheckInterrupt() {</span></span>
<span class="line"><span>    // 在许可可用之前禁用当前线程，并且设置了blocker</span></span>
<span class="line"><span>    LockSupport.park(this);</span></span>
<span class="line"><span>    return Thread.interrupted(); // 当前线程是否已被中断，并清除中断标记位</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>parkAndCheckInterrupt方法里的逻辑是首先执行park操作，即禁用当前线程，然后返回该线程是否已经被中断。再看final块中的cancelAcquire方法，其源码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 取消继续获取(资源)</span></span>
<span class="line"><span>private void cancelAcquire(Node node) {</span></span>
<span class="line"><span>    // Ignore if node doesn&#39;t exist</span></span>
<span class="line"><span>    // node为空，返回</span></span>
<span class="line"><span>    if (node == null)</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    // 设置node结点的thread为空</span></span>
<span class="line"><span>    node.thread = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Skip cancelled predecessors</span></span>
<span class="line"><span>    // 保存node的前驱结点</span></span>
<span class="line"><span>    Node pred = node.prev;</span></span>
<span class="line"><span>    while (pred.waitStatus &gt; 0) // 找到node前驱结点中第一个状态小于0的结点，即不为CANCELLED状态的结点</span></span>
<span class="line"><span>        node.prev = pred = pred.prev;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // predNext is the apparent node to unsplice. CASes below will</span></span>
<span class="line"><span>    // fail if not, in which case, we lost race vs another cancel</span></span>
<span class="line"><span>    // or signal, so no further action is necessary.</span></span>
<span class="line"><span>    // 获取pred结点的下一个结点</span></span>
<span class="line"><span>    Node predNext = pred.next;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Can use unconditional write instead of CAS here.</span></span>
<span class="line"><span>    // After this atomic step, other Nodes can skip past us.</span></span>
<span class="line"><span>    // Before, we are free of interference from other threads.</span></span>
<span class="line"><span>    // 设置node结点的状态为CANCELLED</span></span>
<span class="line"><span>    node.waitStatus = Node.CANCELLED;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // If we are the tail, remove ourselves.</span></span>
<span class="line"><span>    if (node == tail &amp;&amp; compareAndSetTail(node, pred)) { // node结点为尾结点，则设置尾结点为pred结点</span></span>
<span class="line"><span>        // 比较并设置pred结点的next节点为null</span></span>
<span class="line"><span>        compareAndSetNext(pred, predNext, null); </span></span>
<span class="line"><span>    } else { // node结点不为尾结点，或者比较设置不成功</span></span>
<span class="line"><span>        // If successor needs signal, try to set pred&#39;s next-link</span></span>
<span class="line"><span>        // so it will get one. Otherwise wake it up to propagate.</span></span>
<span class="line"><span>        int ws;</span></span>
<span class="line"><span>        if (pred != head &amp;&amp;</span></span>
<span class="line"><span>            ((ws = pred.waitStatus) == Node.SIGNAL ||</span></span>
<span class="line"><span>                (ws &lt;= 0 &amp;&amp; compareAndSetWaitStatus(pred, ws, Node.SIGNAL))) &amp;&amp;</span></span>
<span class="line"><span>            pred.thread != null) { // (pred结点不为头节点，并且pred结点的状态为SIGNAL)或者 </span></span>
<span class="line"><span>                                // pred结点状态小于等于0，并且比较并设置等待状态为SIGNAL成功，并且pred结点所封装的线程不为空</span></span>
<span class="line"><span>            // 保存结点的后继</span></span>
<span class="line"><span>            Node next = node.next;</span></span>
<span class="line"><span>            if (next != null &amp;&amp; next.waitStatus &lt;= 0) // 后继不为空并且后继的状态小于等于0</span></span>
<span class="line"><span>                compareAndSetNext(pred, predNext, next); // 比较并设置pred.next = next;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            unparkSuccessor(node); // 释放node的前一个结点</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        node.next = node; // help GC</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>该方法完成的功能就是取消当前线程对资源的获取，即设置该结点的状态为CANCELLED，接着我们再看unparkSuccessor方法，源码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 释放后继结点</span></span>
<span class="line"><span>private void unparkSuccessor(Node node) {</span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>        * If status is negative (i.e., possibly needing signal) try</span></span>
<span class="line"><span>        * to clear in anticipation of signalling.  It is OK if this</span></span>
<span class="line"><span>        * fails or if status is changed by waiting thread.</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    // 获取node结点的等待状态</span></span>
<span class="line"><span>    int ws = node.waitStatus;</span></span>
<span class="line"><span>    if (ws &lt; 0) // 状态值小于0，为SIGNAL -1 或 CONDITION -2 或 PROPAGATE -3</span></span>
<span class="line"><span>        // 比较并且设置结点等待状态，设置为0</span></span>
<span class="line"><span>        compareAndSetWaitStatus(node, ws, 0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /*</span></span>
<span class="line"><span>        * Thread to unpark is held in successor, which is normally</span></span>
<span class="line"><span>        * just the next node.  But if cancelled or apparently null,</span></span>
<span class="line"><span>        * traverse backwards from tail to find the actual</span></span>
<span class="line"><span>        * non-cancelled successor.</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    // 获取node节点的下一个结点</span></span>
<span class="line"><span>    Node s = node.next;</span></span>
<span class="line"><span>    if (s == null || s.waitStatus &gt; 0) { // 下一个结点为空或者下一个节点的等待状态大于0，即为CANCELLED</span></span>
<span class="line"><span>        // s赋值为空</span></span>
<span class="line"><span>        s = null; </span></span>
<span class="line"><span>        // 从尾结点开始从后往前开始遍历</span></span>
<span class="line"><span>        for (Node t = tail; t != null &amp;&amp; t != node; t = t.prev)</span></span>
<span class="line"><span>            if (t.waitStatus &lt;= 0) // 找到等待状态小于等于0的结点，找到最前的状态小于等于0的结点</span></span>
<span class="line"><span>                // 保存结点</span></span>
<span class="line"><span>                s = t;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (s != null) // 该结点不为为空，释放许可</span></span>
<span class="line"><span>        LockSupport.unpark(s.thread);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>该方法的作用就是为了释放node节点的后继结点。</p><p>对于cancelAcquire与unparkSuccessor方法，如下示意图可以清晰的表示:</p><p><img src="`+t+`" alt="image"></p><p>其中node为参数，在执行完cancelAcquire方法后的效果就是unpark了s结点所包含的t4线程。</p><p>现在，再来看acquireQueued方法的整个的逻辑。逻辑如下:</p><ul><li>判断结点的前驱是否为head并且是否成功获取(资源)。</li><li>若步骤1均满足，则设置结点为head，之后会判断是否finally模块，然后返回。</li><li>若步骤2不满足，则判断是否需要park当前线程，是否需要park当前线程的逻辑是判断结点的前驱结点的状态是否为SIGNAL，若是，则park当前结点，否则，不进行park操作。</li><li>若park了当前线程，之后某个线程对本线程unpark后，并且本线程也获得机会运行。那么，将会继续进行步骤①的判断。</li></ul><h3 id="类的核心方法-release方法" tabindex="-1">类的核心方法 - release方法 <a class="header-anchor" href="#类的核心方法-release方法" aria-label="Permalink to &quot;类的核心方法 - release方法&quot;">​</a></h3><p>以独占模式释放对象，其源码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final boolean release(int arg) {</span></span>
<span class="line"><span>    if (tryRelease(arg)) { // 释放成功</span></span>
<span class="line"><span>        // 保存头节点</span></span>
<span class="line"><span>        Node h = head; </span></span>
<span class="line"><span>        if (h != null &amp;&amp; h.waitStatus != 0) // 头节点不为空并且头节点状态不为0</span></span>
<span class="line"><span>            unparkSuccessor(h); //释放头节点的后继结点</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return false;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其中，tryRelease的默认实现是抛出异常，需要具体的子类实现，如果tryRelease成功，那么如果头节点不为空并且头节点的状态不为0，则释放头节点的后继结点，unparkSuccessor方法已经分析过，不再累赘。</p><p>对于其他方法我们也可以分析，与前面分析的方法大同小异，所以，不再累赘。</p><h2 id="abstractqueuedsynchronizer示例详解一" tabindex="-1">AbstractQueuedSynchronizer示例详解一 <a class="header-anchor" href="#abstractqueuedsynchronizer示例详解一" aria-label="Permalink to &quot;AbstractQueuedSynchronizer示例详解一&quot;">​</a></h2><p>借助下面示例来分析AbstractQueuedSyncrhonizer内部的工作机制。示例源码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.concurrent.locks.Lock;</span></span>
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
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            lock.unlock();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public class AbstractQueuedSynchronizerDemo {</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        Lock lock = new ReentrantLock();</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        MyThread t1 = new MyThread(&quot;t1&quot;, lock);</span></span>
<span class="line"><span>        MyThread t2 = new MyThread(&quot;t2&quot;, lock);</span></span>
<span class="line"><span>        t1.start();</span></span>
<span class="line"><span>        t2.start();    </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行结果(可能的一种):</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Thread[t1,5,main] running</span></span>
<span class="line"><span>Thread[t2,5,main] running</span></span></code></pre></div><p>结果分析: 从示例可知，线程t1与t2共用了一把锁，即同一个lock。可能会存在如下一种时序。</p><p><img src="`+c+'" alt="image"></p><p>说明: 首先线程t1先执行lock.lock操作，然后t2执行lock.lock操作，然后t1执行lock.unlock操作，最后t2执行lock.unlock操作。基于这样的时序，分析AbstractQueuedSynchronizer内部的工作机制。</p><ul><li>t1线程调用lock.lock方法，其方法调用顺序如下，只给出了主要的方法调用。</li></ul><p><img src="'+r+'" alt="image"></p><p>说明: 其中，前面的部分表示哪个类，后面是具体的类中的哪个方法，AQS表示AbstractQueuedSynchronizer类，AOS表示AbstractOwnableSynchronizer类。</p><ul><li>t2线程调用lock.lock方法，其方法调用顺序如下，只给出了主要的方法调用。</li></ul><p><img src="'+o+'" alt="image"></p><p>说明: 经过一系列的方法调用，最后达到的状态是禁用t2线程，因为调用了LockSupport.park。</p><ul><li>t1线程调用lock.unlock，其方法调用顺序如下，只给出了主要的方法调用。</li></ul><p><img src="'+d+'" alt="image"></p><p>说明: t1线程中调用lock.unlock后，经过一系列的调用，最终的状态是释放了许可，因为调用了LockSupport.unpark。这时，t2线程就可以继续运行了。此时，会继续恢复t2线程运行环境，继续执行LockSupport.park后面的语句，即进一步调用如下。</p><p><img src="'+u+'" alt="image"></p><p>说明: 在上一步调用了LockSupport.unpark后，t2线程恢复运行，则运行parkAndCheckInterrupt，之后，继续运行acquireQueued方法，最后达到的状态是头节点head与尾结点tail均指向了t2线程所在的结点，并且之前的头节点已经从sync队列中断开了。</p><ul><li>t2线程调用lock.unlock，其方法调用顺序如下，只给出了主要的方法调用。</li></ul><p><img src="'+h+`" alt="image"></p><p>说明: t2线程执行lock.unlock后，最终达到的状态还是与之前的状态一样。</p><h2 id="abstractqueuedsynchronizer示例详解二" tabindex="-1">AbstractQueuedSynchronizer示例详解二 <a class="header-anchor" href="#abstractqueuedsynchronizer示例详解二" aria-label="Permalink to &quot;AbstractQueuedSynchronizer示例详解二&quot;">​</a></h2><p>下面我们结合Condition实现生产者与消费者，来进一步分析AbstractQueuedSynchronizer的内部工作机制。</p><ul><li>Depot(仓库)类</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.concurrent.locks.Condition;</span></span>
<span class="line"><span>import java.util.concurrent.locks.Lock;</span></span>
<span class="line"><span>import java.util.concurrent.locks.ReentrantLock;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Depot {</span></span>
<span class="line"><span>    private int size;</span></span>
<span class="line"><span>    private int capacity;</span></span>
<span class="line"><span>    private Lock lock;</span></span>
<span class="line"><span>    private Condition fullCondition;</span></span>
<span class="line"><span>    private Condition emptyCondition;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public Depot(int capacity) {</span></span>
<span class="line"><span>        this.capacity = capacity;    </span></span>
<span class="line"><span>        lock = new ReentrantLock();</span></span>
<span class="line"><span>        fullCondition = lock.newCondition();</span></span>
<span class="line"><span>        emptyCondition = lock.newCondition();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public void produce(int no) {</span></span>
<span class="line"><span>        lock.lock();</span></span>
<span class="line"><span>        int left = no;</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            while (left &gt; 0) {</span></span>
<span class="line"><span>                while (size &gt;= capacity)  {</span></span>
<span class="line"><span>                    System.out.println(Thread.currentThread() + &quot; before await&quot;);</span></span>
<span class="line"><span>                    fullCondition.await();</span></span>
<span class="line"><span>                    System.out.println(Thread.currentThread() + &quot; after await&quot;);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                int inc = (left + size) &gt; capacity ? (capacity - size) : left;</span></span>
<span class="line"><span>                left -= inc;</span></span>
<span class="line"><span>                size += inc;</span></span>
<span class="line"><span>                System.out.println(&quot;produce = &quot; + inc + &quot;, size = &quot; + size);</span></span>
<span class="line"><span>                emptyCondition.signal();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } catch (InterruptedException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            lock.unlock();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public void consume(int no) {</span></span>
<span class="line"><span>        lock.lock();</span></span>
<span class="line"><span>        int left = no;</span></span>
<span class="line"><span>        try {            </span></span>
<span class="line"><span>            while (left &gt; 0) {</span></span>
<span class="line"><span>                while (size &lt;= 0) {</span></span>
<span class="line"><span>                    System.out.println(Thread.currentThread() + &quot; before await&quot;);</span></span>
<span class="line"><span>                    emptyCondition.await();</span></span>
<span class="line"><span>                    System.out.println(Thread.currentThread() + &quot; after await&quot;);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                int dec = (size - left) &gt; 0 ? left : size;</span></span>
<span class="line"><span>                left -= dec;</span></span>
<span class="line"><span>                size -= dec;</span></span>
<span class="line"><span>                System.out.println(&quot;consume = &quot; + dec + &quot;, size = &quot; + size);</span></span>
<span class="line"><span>                fullCondition.signal();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        } catch (InterruptedException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        } finally {</span></span>
<span class="line"><span>            lock.unlock();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>测试类</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Consumer {</span></span>
<span class="line"><span>    private Depot depot;</span></span>
<span class="line"><span>    public Consumer(Depot depot) {</span></span>
<span class="line"><span>        this.depot = depot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public void consume(int no) {</span></span>
<span class="line"><span>        new Thread(new Runnable() {</span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public void run() {</span></span>
<span class="line"><span>                depot.consume(no);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }, no + &quot; consume thread&quot;).start();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Producer {</span></span>
<span class="line"><span>    private Depot depot;</span></span>
<span class="line"><span>    public Producer(Depot depot) {</span></span>
<span class="line"><span>        this.depot = depot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public void produce(int no) {</span></span>
<span class="line"><span>        new Thread(new Runnable() {</span></span>
<span class="line"><span>            </span></span>
<span class="line"><span>            @Override</span></span>
<span class="line"><span>            public void run() {</span></span>
<span class="line"><span>                depot.produce(no);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }, no + &quot; produce thread&quot;).start();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class ReentrantLockDemo {</span></span>
<span class="line"><span>    public static void main(String[] args) throws InterruptedException {</span></span>
<span class="line"><span>        Depot depot = new Depot(500);</span></span>
<span class="line"><span>        new Producer(depot).produce(500);</span></span>
<span class="line"><span>        new Producer(depot).produce(200);</span></span>
<span class="line"><span>        new Consumer(depot).consume(500);</span></span>
<span class="line"><span>        new Consumer(depot).consume(200);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>运行结果(可能的一种):</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>produce = 500, size = 500</span></span>
<span class="line"><span>Thread[200 produce thread,5,main] before await</span></span>
<span class="line"><span>consume = 500, size = 0</span></span>
<span class="line"><span>Thread[200 consume thread,5,main] before await</span></span>
<span class="line"><span>Thread[200 produce thread,5,main] after await</span></span>
<span class="line"><span>produce = 200, size = 200</span></span>
<span class="line"><span>Thread[200 consume thread,5,main] after await</span></span>
<span class="line"><span>consume = 200, size = 0</span></span></code></pre></div><p>说明: 根据结果，我们猜测一种可能的时序如下</p><p><img src="`+g+'" alt="image"></p><p>说明: p1代表produce 500的那个线程，p2代表produce 200的那个线程，c1代表consume 500的那个线程，c2代表consume 200的那个线程。</p><ul><li>p1线程调用lock.lock，获得锁，继续运行，方法调用顺序在前面已经给出。</li><li>p2线程调用lock.lock，由前面的分析可得到如下的最终状态。</li></ul><p><img src="'+m+'" alt="image"></p><p>说明: p2线程调用lock.lock后，会禁止p2线程的继续运行，因为执行了LockSupport.park操作。</p><ul><li>c1线程调用lock.lock，由前面的分析得到如下的最终状态。</li></ul><p><img src="'+f+'" alt="image"></p><p>说明: 最终c1线程会在sync queue队列的尾部，并且其结点的前驱结点(包含p2的结点)的waitStatus变为了SIGNAL。</p><ul><li>c2线程调用lock.lock，由前面的分析得到如下的最终状态。</li></ul><p><img src="'+b+'" alt="image"></p><p>说明: 最终c1线程会在sync queue队列的尾部，并且其结点的前驱结点(包含c1的结点)的waitStatus变为了SIGNAL。</p><ul><li>p1线程执行emptyCondition.signal，其方法调用顺序如下，只给出了主要的方法调用。</li></ul><p><img src="'+k+'" alt="image"></p><p>说明: AQS.CO表示AbstractQueuedSynchronizer.ConditionObject类。此时调用signal方法不会产生任何其他效果。</p><ul><li>p1线程执行lock.unlock，根据前面的分析可知，最终的状态如下。</li></ul><p><img src="'+v+'" alt="image"></p><p>说明: 此时，p2线程所在的结点为头节点，并且其他两个线程(c1、c2)依旧被禁止，所以，此时p2线程继续运行，执行用户逻辑。</p><ul><li>p2线程执行fullCondition.await，其方法调用顺序如下，只给出了主要的方法调用。</li></ul><p><img src="'+w+'" alt="image"></p><p>说明: 最终到达的状态是新生成了一个结点，包含了p2线程，此结点在condition queue中；并且sync queue中p2线程被禁止了，因为在执行了LockSupport.park操作。从方法一些调用可知，在await操作中线程会释放锁资源，供其他线程获取。同时，head结点后继结点的包含的线程的许可被释放了，故其可以继续运行。由于此时，只有c1线程可以运行，故运行c1。</p><ul><li>继续运行c1线程，c1线程由于之前被park了，所以此时恢复，继续之前的步骤，即还是执行前面提到的acquireQueued方法，之后，c1判断自己的前驱结点为head，并且可以获取锁资源，最终到达的状态如下。</li></ul><p><img src="'+S+'" alt="image"></p><p>说明: 其中，head设置为包含c1线程的结点，c1继续运行。</p><ul><li>c1线程执行fullCondtion.signal，其方法调用顺序如下，只给出了主要的方法调用。</li></ul><p><img src="'+y+'" alt="image"></p><p>说明: signal方法达到的最终结果是将包含p2线程的结点从condition queue中转移到sync queue中，之后condition queue为null，之前的尾结点的状态变为SIGNAL。</p><ul><li>c1线程执行lock.unlock操作，根据之前的分析，经历的状态变化如下。</li></ul><p><img src="'+q+'" alt="image"></p><p>说明: 最终c2线程会获取锁资源，继续运行用户逻辑。</p><ul><li>c2线程执行emptyCondition.await，由前面的第七步分析，可知最终的状态如下。</li></ul><p><img src="'+x+'" alt="image"></p><p>说明: await操作将会生成一个结点放入condition queue中与之前的一个condition queue是不相同的，并且unpark头节点后面的结点，即包含线程p2的结点。</p><ul><li>p2线程被unpark，故可以继续运行，经过CPU调度后，p2继续运行，之后p2线程在AQS:await方法中被park，继续AQS.CO:await方法的运行，其方法调用顺序如下，只给出了主要的方法调用。</li></ul><p><img src="'+A+'" alt="image"></p><ul><li>p2继续运行，执行emptyCondition.signal，根据第九步分析可知，最终到达的状态如下。</li></ul><p><img src="'+C+'" alt="image"></p><p>说明: 最终，将condition queue中的结点转移到sync queue中，并添加至尾部，condition queue会为空，并且将head的状态设置为SIGNAL。</p><ul><li>p2线程执行lock.unlock操作，根据前面的分析可知，最后的到达的状态如下。</li></ul><p><img src="'+N+'" alt="image"></p><p>说明: unlock操作会释放c2线程的许可，并且将头节点设置为c2线程所在的结点。</p><ul><li><p>c2线程继续运行，执行fullCondition. signal，由于此时fullCondition的condition queue已经不存在任何结点了，故其不会产生作用。</p></li><li><p>c2执行lock.unlock，由于c2是sync队列中最后一个结点，故其不会再调用unparkSuccessor了，直接返回true。即整个流程就完成了。</p></li></ul><h2 id="abstractqueuedsynchronizer总结" tabindex="-1">AbstractQueuedSynchronizer总结 <a class="header-anchor" href="#abstractqueuedsynchronizer总结" aria-label="Permalink to &quot;AbstractQueuedSynchronizer总结&quot;">​</a></h2><p>对于AbstractQueuedSynchronizer的分析，最核心的就是sync queue的分析。</p><ul><li>每一个结点都是由前一个结点唤醒</li><li>当结点发现前驱结点是head并且尝试获取成功，则会轮到该线程运行。</li><li>condition queue中的结点向sync queue中转移是通过signal操作完成的。</li><li>当结点的状态为SIGNAL时，表示后面的结点需要运行。</li></ul><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li>文章主要参考自leesf的<a href="https://www.cnblogs.com/leesf456/p/5350186.html%EF%BC%8C%E5%9C%A8%E6%AD%A4%E5%9F%BA%E7%A1%80%E4%B8%8A%E5%81%9A%E4%BA%86%E5%A2%9E%E6%94%B9%E3%80%82" target="_blank" rel="noreferrer">https://www.cnblogs.com/leesf456/p/5350186.html，在此基础上做了增改。</a></li><li><a href="http://ifeve.com/introduce-abstractqueuedsynchronizer/" target="_blank" rel="noreferrer">http://ifeve.com/introduce-abstractqueuedsynchronizer/</a></li><li><a href="http://blog.csdn.net/chen77716/article/details/6641477" target="_blank" rel="noreferrer">http://blog.csdn.net/chen77716/article/details/6641477</a></li><li><a href="https://blog.csdn.net/mulinsen77/article/details/84583716" target="_blank" rel="noreferrer">https://blog.csdn.net/mulinsen77/article/details/84583716</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',165)]))}const R=a(I,[["render",T]]);export{j as __pageData,R as default};
