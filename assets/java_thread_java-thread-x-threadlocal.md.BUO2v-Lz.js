import{_ as n,c as s,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const u=JSON.parse('{"title":"Java 并发 - ThreadLocal详解","description":"","frontmatter":{},"headers":[],"relativePath":"java/thread/java-thread-x-threadlocal.md","filePath":"java/thread/java-thread-x-threadlocal.md","lastUpdated":1737706346000}'),l={name:"java/thread/java-thread-x-threadlocal.md"};function t(i,a,c,o,r,d){return e(),s("div",null,a[0]||(a[0]=[p(`<h1 id="java-并发-threadlocal详解" tabindex="-1">Java 并发 - ThreadLocal详解 <a class="header-anchor" href="#java-并发-threadlocal详解" aria-label="Permalink to &quot;Java 并发 - ThreadLocal详解&quot;">​</a></h1><blockquote><p>ThreadLocal是通过线程隔离的方式防止任务在共享资源上产生冲突, 线程本地存储是一种自动化机制，可以为使用相同变量的每个不同线程都创建不同的存储。 @pdai</p></blockquote><h2 id="带着bat大厂的面试问题去理解" tabindex="-1">带着BAT大厂的面试问题去理解 <a class="header-anchor" href="#带着bat大厂的面试问题去理解" aria-label="Permalink to &quot;带着BAT大厂的面试问题去理解&quot;">​</a></h2><p>提示</p><p>请带着这些问题继续后文，会很大程度上帮助你更好的理解相关知识点。@pdai</p><ul><li>什么是ThreadLocal? 用来解决什么问题的?</li><li>说说你对ThreadLocal的理解</li><li>ThreadLocal是如何实现线程隔离的?</li><li>为什么ThreadLocal会造成内存泄露? 如何解决</li><li>还有哪些使用ThreadLocal的应用场景?</li></ul><h2 id="threadlocal简介" tabindex="-1">ThreadLocal简介 <a class="header-anchor" href="#threadlocal简介" aria-label="Permalink to &quot;ThreadLocal简介&quot;">​</a></h2><p>我们在<a href="https://pdai.tech/md/java/thread/java-thread-x-theorty.html#%E7%BA%BF%E7%A8%8B%E5%AE%89%E5%85%A8%E7%9A%84%E5%AE%9E%E7%8E%B0%E6%96%B9%E6%B3%95" target="_blank" rel="noreferrer">Java 并发 - 并发理论基础</a>总结过线程安全(是指广义上的共享资源访问安全性，因为线程隔离是通过副本保证本线程访问资源安全性，它不保证线程之间还存在共享关系的狭义上的安全性)的解决思路：</p><ul><li>互斥同步: synchronized 和 ReentrantLock</li><li>非阻塞同步: CAS, AtomicXXXX</li><li>无同步方案: 栈封闭，本地存储(Thread Local)，可重入代码</li></ul><p>这个章节将详细的讲讲 本地存储(Thread Local)。官网的解释是这样的：</p><blockquote><p>This class provides thread-local variables. These variables differ from their normal counterparts in that each thread that accesses one (via its {@code get} or {@code set} method) has its own, independently initialized copy of the variable. {@code ThreadLocal} instances are typically private static fields in classes that wish to associate state with a thread (e.g., a user ID or Transaction ID) 该类提供了线程局部 (thread-local) 变量。这些变量不同于它们的普通对应物，因为访问某个变量(通过其 get 或 set 方法)的每个线程都有自己的局部变量，它独立于变量的初始化副本。ThreadLocal 实例通常是类中的 private static 字段，它们希望将状态与某一个线程(例如，用户 ID 或事务 ID)相关联。</p></blockquote><p>总结而言：ThreadLocal是一个将在多线程中为每一个线程创建单独的变量副本的类; 当使用ThreadLocal来维护变量时, ThreadLocal会为每个线程创建单独的变量副本, 避免因多线程操作共享变量而导致的数据不一致的情况。</p><h2 id="threadlocal理解" tabindex="-1">ThreadLocal理解 <a class="header-anchor" href="#threadlocal理解" aria-label="Permalink to &quot;ThreadLocal理解&quot;">​</a></h2><blockquote><p>提到ThreadLocal被提到应用最多的是session管理和数据库链接管理，这里以数据访问为例帮助你理解ThreadLocal：</p></blockquote><ul><li>如下数据库管理类在单线程使用是没有任何问题的</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class ConnectionManager {</span></span>
<span class="line"><span>    private static Connection connect = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static Connection openConnection() {</span></span>
<span class="line"><span>        if (connect == null) {</span></span>
<span class="line"><span>            connect = DriverManager.getConnection();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return connect;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void closeConnection() {</span></span>
<span class="line"><span>        if (connect != null)</span></span>
<span class="line"><span>            connect.close();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>很显然，在多线程中使用会存在线程安全问题：第一，这里面的2个方法都没有进行同步，很可能在openConnection方法中会多次创建connect；第二，由于connect是共享变量，那么必然在调用connect的地方需要使用到同步来保障线程安全，因为很可能一个线程在使用connect进行数据库操作，而另外一个线程调用closeConnection关闭链接。</p><ul><li>为了解决上述线程安全的问题，第一考虑：互斥同步</li></ul><p>你可能会说，将这段代码的两个方法进行同步处理，并且在调用connect的地方需要进行同步处理，比如用Synchronized或者ReentrantLock互斥锁。</p><ul><li>这里再抛出一个问题：这地方到底需不需要将connect变量进行共享?</li></ul><p>事实上，是不需要的。假如每个线程中都有一个connect变量，各个线程之间对connect变量的访问实际上是没有依赖关系的，即一个线程不需要关心其他线程是否对这个connect进行了修改的。即改后的代码可以这样：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class ConnectionManager {</span></span>
<span class="line"><span>    private Connection connect = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Connection openConnection() {</span></span>
<span class="line"><span>        if (connect == null) {</span></span>
<span class="line"><span>            connect = DriverManager.getConnection();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return connect;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void closeConnection() {</span></span>
<span class="line"><span>        if (connect != null)</span></span>
<span class="line"><span>            connect.close();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Dao {</span></span>
<span class="line"><span>    public void insert() {</span></span>
<span class="line"><span>        ConnectionManager connectionManager = new ConnectionManager();</span></span>
<span class="line"><span>        Connection connection = connectionManager.openConnection();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 使用connection进行操作</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        connectionManager.closeConnection();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这样处理确实也没有任何问题，由于每次都是在方法内部创建的连接，那么线程之间自然不存在线程安全问题。但是这样会有一个致命的影响：导致服务器压力非常大，并且严重影响程序执行性能。由于在方法中需要频繁地开启和关闭数据库连接，这样不仅严重影响程序执行效率，还可能导致服务器压力巨大。</p><ul><li>这时候ThreadLocal登场了</li></ul><p>那么这种情况下使用ThreadLocal是再适合不过的了，因为ThreadLocal在每个线程中对该变量会创建一个副本，即每个线程内部都会有一个该变量，且在线程内部任何地方都可以使用，线程之间互不影响，这样一来就不存在线程安全问题，也不会严重影响程序执行性能。下面就是网上出现最多的例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.sql.Connection;</span></span>
<span class="line"><span>import java.sql.DriverManager;</span></span>
<span class="line"><span>import java.sql.SQLException;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class ConnectionManager {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static final ThreadLocal&lt;Connection&gt; dbConnectionLocal = new ThreadLocal&lt;Connection&gt;() {</span></span>
<span class="line"><span>        @Override</span></span>
<span class="line"><span>        protected Connection initialValue() {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                return DriverManager.getConnection(&quot;&quot;, &quot;&quot;, &quot;&quot;);</span></span>
<span class="line"><span>            } catch (SQLException e) {</span></span>
<span class="line"><span>                e.printStackTrace();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            return null;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Connection getConnection() {</span></span>
<span class="line"><span>        return dbConnectionLocal.get();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>再注意下ThreadLocal的修饰符</li></ul><p>ThreaLocal的JDK文档中说明：ThreadLocal instances are typically private static fields in classes that wish to associate state with a thread。如果我们希望通过某个类将状态(例如用户ID、事务ID)与线程关联起来，那么通常在这个类中定义private static类型的ThreadLocal 实例。</p><blockquote><p>但是要注意，虽然ThreadLocal能够解决上面说的问题，但是由于在每个线程中都创建了副本，所以要考虑它对资源的消耗，比如内存的占用会比不使用ThreadLocal要大。</p></blockquote><h2 id="threadlocal原理" tabindex="-1">ThreadLocal原理 <a class="header-anchor" href="#threadlocal原理" aria-label="Permalink to &quot;ThreadLocal原理&quot;">​</a></h2><h3 id="如何实现线程隔离" tabindex="-1">如何实现线程隔离 <a class="header-anchor" href="#如何实现线程隔离" aria-label="Permalink to &quot;如何实现线程隔离&quot;">​</a></h3><p>主要是用到了Thread对象中的一个ThreadLocalMap类型的变量threadLocals, 负责存储当前线程的关于Connection的对象, dbConnectionLocal(以上述例子中为例) 这个变量为Key, 以新建的Connection对象为Value; 这样的话, 线程第一次读取的时候如果不存在就会调用ThreadLocal的initialValue方法创建一个Connection对象并且返回;</p><p>具体关于为线程分配变量副本的代码如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public T get() {</span></span>
<span class="line"><span>    Thread t = Thread.currentThread();</span></span>
<span class="line"><span>    ThreadLocalMap threadLocals = getMap(t);</span></span>
<span class="line"><span>    if (threadLocals != null) {</span></span>
<span class="line"><span>        ThreadLocalMap.Entry e = threadLocals.getEntry(this);</span></span>
<span class="line"><span>        if (e != null) {</span></span>
<span class="line"><span>            @SuppressWarnings(&quot;unchecked&quot;)</span></span>
<span class="line"><span>            T result = (T)e.value;</span></span>
<span class="line"><span>            return result;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return setInitialValue();</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>首先获取当前线程对象t, 然后从线程t中获取到ThreadLocalMap的成员属性threadLocals</li><li>如果当前线程的threadLocals已经初始化(即不为null) 并且存在以当前ThreadLocal对象为Key的值, 则直接返回当前线程要获取的对象(本例中为Connection);</li><li>如果当前线程的threadLocals已经初始化(即不为null)但是不存在以当前ThreadLocal对象为Key的的对象, 那么重新创建一个Connection对象, 并且添加到当前线程的threadLocals Map中,并返回</li><li>如果当前线程的threadLocals属性还没有被初始化, 则重新创建一个ThreadLocalMap对象, 并且创建一个Connection对象并添加到ThreadLocalMap对象中并返回。</li></ul><p>如果存在则直接返回很好理解, 那么对于如何初始化的代码又是怎样的呢?</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private T setInitialValue() {</span></span>
<span class="line"><span>    T value = initialValue();</span></span>
<span class="line"><span>    Thread t = Thread.currentThread();</span></span>
<span class="line"><span>    ThreadLocalMap map = getMap(t);</span></span>
<span class="line"><span>    if (map != null)</span></span>
<span class="line"><span>        map.set(this, value);</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>        createMap(t, value);</span></span>
<span class="line"><span>    return value;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><p>首先调用我们上面写的重载过后的initialValue方法, 产生一个Connection对象</p></li><li><p>继续查看当前线程的threadLocals是不是空的, 如果ThreadLocalMap已被初始化, 那么直接将产生的对象添加到ThreadLocalMap中, 如果没有初始化, 则创建并添加对象到其中;</p></li></ul><p>同时, ThreadLocal还提供了直接操作Thread对象中的threadLocals的方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void set(T value) {</span></span>
<span class="line"><span>    Thread t = Thread.currentThread();</span></span>
<span class="line"><span>    ThreadLocalMap map = getMap(t);</span></span>
<span class="line"><span>    if (map != null)</span></span>
<span class="line"><span>        map.set(this, value);</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>        createMap(t, value);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这样我们也可以不实现initialValue, 将初始化工作放到DBConnectionFactory的getConnection方法中:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public Connection getConnection() {</span></span>
<span class="line"><span>    Connection connection = dbConnectionLocal.get();</span></span>
<span class="line"><span>    if (connection == null) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            connection = DriverManager.getConnection(&quot;&quot;, &quot;&quot;, &quot;&quot;);</span></span>
<span class="line"><span>            dbConnectionLocal.set(connection);</span></span>
<span class="line"><span>        } catch (SQLException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return connection;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>那么我们看过代码之后就很清晰的知道了为什么ThreadLocal能够实现变量的多线程隔离了; 其实就是用了Map的数据结构给当前线程缓存了, 要使用的时候就从本线程的threadLocals对象中获取就可以了, key就是当前线程;</p><p>当然了在当前线程下获取当前线程里面的Map里面的对象并操作肯定没有线程并发问题了, 当然能做到变量的线程间隔离了;</p><p>现在我们知道了ThreadLocal到底是什么了, 又知道了如何使用ThreadLocal以及其基本实现原理了是不是就可以结束了呢? 其实还有一个问题就是ThreadLocalMap是个什么对象, 为什么要用这个对象呢?</p><h3 id="threadlocalmap对象是什么" tabindex="-1">ThreadLocalMap对象是什么 <a class="header-anchor" href="#threadlocalmap对象是什么" aria-label="Permalink to &quot;ThreadLocalMap对象是什么&quot;">​</a></h3><p>本质上来讲, 它就是一个Map, 但是这个ThreadLocalMap与我们平时见到的Map有点不一样</p><ul><li>它没有实现Map接口;</li><li>它没有public的方法, 最多有一个default的构造方法, 因为这个ThreadLocalMap的方法仅仅在ThreadLocal类中调用, 属于静态内部类</li><li>ThreadLocalMap的Entry实现继承了WeakReference&lt;ThreadLocal&lt;?&gt;&gt;</li><li>该方法仅仅用了一个Entry数组来存储Key, Value; Entry并不是链表形式, 而是每个bucket里面仅仅放一个Entry;</li></ul><p>要了解ThreadLocalMap的实现, 我们先从入口开始, 就是往该Map中添加一个值:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void set(ThreadLocal&lt;?&gt; key, Object value) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // We don&#39;t use a fast path as with get() because it is at</span></span>
<span class="line"><span>    // least as common to use set() to create new entries as</span></span>
<span class="line"><span>    // it is to replace existing ones, in which case, a fast</span></span>
<span class="line"><span>    // path would fail more often than not.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Entry[] tab = table;</span></span>
<span class="line"><span>    int len = tab.length;</span></span>
<span class="line"><span>    int i = key.threadLocalHashCode &amp; (len-1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (Entry e = tab[i];</span></span>
<span class="line"><span>         e != null;</span></span>
<span class="line"><span>         e = tab[i = nextIndex(i, len)]) {</span></span>
<span class="line"><span>        ThreadLocal&lt;?&gt; k = e.get();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (k == key) {</span></span>
<span class="line"><span>            e.value = value;</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (k == null) {</span></span>
<span class="line"><span>            replaceStaleEntry(key, value, i);</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    tab[i] = new Entry(key, value);</span></span>
<span class="line"><span>    int sz = ++size;</span></span>
<span class="line"><span>    if (!cleanSomeSlots(i, sz) &amp;&amp; sz &gt;= threshold)</span></span>
<span class="line"><span>        rehash();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>先进行简单的分析, 对该代码表层意思进行解读:</p><ul><li>看下当前threadLocal的在数组中的索引位置 比如: <code>i = 2</code>, 看 <code>i = 2</code> 位置上面的元素(Entry)的<code>Key</code>是否等于threadLocal 这个 Key, 如果等于就很好说了, 直接将该位置上面的Entry的Value替换成最新的就可以了;</li><li>如果当前位置上面的 Entry 的 Key为空, 说明ThreadLocal对象已经被回收了, 那么就调用replaceStaleEntry</li><li>如果清理完无用条目(ThreadLocal被回收的条目)、并且数组中的数据大小 &gt; 阈值的时候对当前的Table进行重新哈希 所以, 该HashMap是处理冲突检测的机制是向后移位, 清除过期条目 最终找到合适的位置;</li></ul><p>了解完Set方法, 后面就是Get方法了:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private Entry getEntry(ThreadLocal&lt;?&gt; key) {</span></span>
<span class="line"><span>    int i = key.threadLocalHashCode &amp; (table.length - 1);</span></span>
<span class="line"><span>    Entry e = table[i];</span></span>
<span class="line"><span>    if (e != null &amp;&amp; e.get() == key)</span></span>
<span class="line"><span>        return e;</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>        return getEntryAfterMiss(key, i, e);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>先找到ThreadLocal的索引位置, 如果索引位置处的entry不为空并且键与threadLocal是同一个对象, 则直接返回; 否则去后面的索引位置继续查找。</p><h2 id="threadlocal造成内存泄露的问题" tabindex="-1">ThreadLocal造成内存泄露的问题 <a class="header-anchor" href="#threadlocal造成内存泄露的问题" aria-label="Permalink to &quot;ThreadLocal造成内存泄露的问题&quot;">​</a></h2><p>网上有这样一个例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.concurrent.LinkedBlockingQueue;</span></span>
<span class="line"><span>import java.util.concurrent.ThreadPoolExecutor;</span></span>
<span class="line"><span>import java.util.concurrent.TimeUnit;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class ThreadLocalDemo {</span></span>
<span class="line"><span>    static class LocalVariable {</span></span>
<span class="line"><span>        private Long[] a = new Long[1024 * 1024];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // (1)</span></span>
<span class="line"><span>    final static ThreadPoolExecutor poolExecutor = new ThreadPoolExecutor(5, 5, 1, TimeUnit.MINUTES,</span></span>
<span class="line"><span>            new LinkedBlockingQueue&lt;&gt;());</span></span>
<span class="line"><span>    // (2)</span></span>
<span class="line"><span>    final static ThreadLocal&lt;LocalVariable&gt; localVariable = new ThreadLocal&lt;LocalVariable&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) throws InterruptedException {</span></span>
<span class="line"><span>        // (3)</span></span>
<span class="line"><span>        Thread.sleep(5000 * 4);</span></span>
<span class="line"><span>        for (int i = 0; i &lt; 50; ++i) {</span></span>
<span class="line"><span>            poolExecutor.execute(new Runnable() {</span></span>
<span class="line"><span>                public void run() {</span></span>
<span class="line"><span>                    // (4)</span></span>
<span class="line"><span>                    localVariable.set(new LocalVariable());</span></span>
<span class="line"><span>                    // (5)</span></span>
<span class="line"><span>                    System.out.println(&quot;use local varaible&quot; + localVariable.get());</span></span>
<span class="line"><span>                    localVariable.remove();</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            });</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // (6)</span></span>
<span class="line"><span>        System.out.println(&quot;pool execute over&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果用线程池来操作ThreadLocal 对象确实会造成内存泄露, 因为对于线程池里面不会销毁的线程, 里面总会存在着<code>&lt;ThreadLocal, LocalVariable&gt;</code>的强引用, 因为final static 修饰的 ThreadLocal 并不会释放, 而ThreadLocalMap 对于 Key 虽然是弱引用, 但是强引用不会释放, 弱引用当然也会一直有值, 同时创建的LocalVariable对象也不会释放, 就造成了内存泄露; 如果LocalVariable对象不是一个大对象的话, 其实泄露的并不严重, <code>泄露的内存 = 核心线程数 * LocalVariable</code>对象的大小;</p><p>所以, 为了避免出现内存泄露的情况, ThreadLocal提供了一个清除线程中对象的方法, 即 remove, 其实内部实现就是调用 ThreadLocalMap 的remove方法:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void remove(ThreadLocal&lt;?&gt; key) {</span></span>
<span class="line"><span>    Entry[] tab = table;</span></span>
<span class="line"><span>    int len = tab.length;</span></span>
<span class="line"><span>    int i = key.threadLocalHashCode &amp; (len-1);</span></span>
<span class="line"><span>    for (Entry e = tab[i];</span></span>
<span class="line"><span>         e != null;</span></span>
<span class="line"><span>         e = tab[i = nextIndex(i, len)]) {</span></span>
<span class="line"><span>        if (e.get() == key) {</span></span>
<span class="line"><span>            e.clear();</span></span>
<span class="line"><span>            expungeStaleEntry(i);</span></span>
<span class="line"><span>            return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>找到Key对应的Entry, 并且清除Entry的Key(ThreadLocal)置空, 随后清除过期的Entry即可避免内存泄露。</p><h2 id="再看threadlocal应用场景" tabindex="-1">再看ThreadLocal应用场景 <a class="header-anchor" href="#再看threadlocal应用场景" aria-label="Permalink to &quot;再看ThreadLocal应用场景&quot;">​</a></h2><p>除了上述的数据库管理类的例子，我们再看看其它一些应用：</p><h3 id="每个线程维护了一个-序列号" tabindex="-1">每个线程维护了一个“序列号” <a class="header-anchor" href="#每个线程维护了一个-序列号" aria-label="Permalink to &quot;每个线程维护了一个“序列号”&quot;">​</a></h3><blockquote><p>再回想上文说的，如果我们希望通过某个类将状态(例如用户ID、事务ID)与线程关联起来，那么通常在这个类中定义private static类型的ThreadLocal 实例。</p></blockquote><p>每个线程维护了一个“序列号”</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class SerialNum {</span></span>
<span class="line"><span>    // The next serial number to be assigned</span></span>
<span class="line"><span>    private static int nextSerialNum = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static ThreadLocal serialNum = new ThreadLocal() {</span></span>
<span class="line"><span>        protected synchronized Object initialValue() {</span></span>
<span class="line"><span>            return new Integer(nextSerialNum++);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static int get() {</span></span>
<span class="line"><span>        return ((Integer) (serialNum.get())).intValue();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="session的管理" tabindex="-1">Session的管理 <a class="header-anchor" href="#session的管理" aria-label="Permalink to &quot;Session的管理&quot;">​</a></h3><p>经典的另外一个例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static final ThreadLocal threadSession = new ThreadLocal();  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>public static Session getSession() throws InfrastructureException {  </span></span>
<span class="line"><span>    Session s = (Session) threadSession.get();  </span></span>
<span class="line"><span>    try {  </span></span>
<span class="line"><span>        if (s == null) {  </span></span>
<span class="line"><span>            s = getSessionFactory().openSession();  </span></span>
<span class="line"><span>            threadSession.set(s);  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>    } catch (HibernateException ex) {  </span></span>
<span class="line"><span>        throw new InfrastructureException(ex);  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    return s;  </span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="在线程内部创建threadlocal" tabindex="-1">在线程内部创建ThreadLocal <a class="header-anchor" href="#在线程内部创建threadlocal" aria-label="Permalink to &quot;在线程内部创建ThreadLocal&quot;">​</a></h3><p>还有一种用法是在线程类内部创建ThreadLocal，基本步骤如下：</p><ul><li>在多线程的类(如ThreadDemo类)中，创建一个ThreadLocal对象threadXxx，用来保存线程间需要隔离处理的对象xxx。</li><li>在ThreadDemo类中，创建一个获取要隔离访问的数据的方法getXxx()，在方法中判断，若ThreadLocal对象为null时候，应该new()一个隔离访问类型的对象，并强制转换为要应用的类型。</li><li>在ThreadDemo类的run()方法中，通过调用getXxx()方法获取要操作的数据，这样可以保证每个线程对应一个数据对象，在任何时刻都操作的是这个对象。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ThreadLocalTest implements Runnable{</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    ThreadLocal&lt;Student&gt; StudentThreadLocal = new ThreadLocal&lt;Student&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void run() {</span></span>
<span class="line"><span>        String currentThreadName = Thread.currentThread().getName();</span></span>
<span class="line"><span>        System.out.println(currentThreadName + &quot; is running...&quot;);</span></span>
<span class="line"><span>        Random random = new Random();</span></span>
<span class="line"><span>        int age = random.nextInt(100);</span></span>
<span class="line"><span>        System.out.println(currentThreadName + &quot; is set age: &quot;  + age);</span></span>
<span class="line"><span>        Student Student = getStudentt(); //通过这个方法，为每个线程都独立的new一个Studentt对象，每个线程的的Studentt对象都可以设置不同的值</span></span>
<span class="line"><span>        Student.setAge(age);</span></span>
<span class="line"><span>        System.out.println(currentThreadName + &quot; is first get age: &quot; + Student.getAge());</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            Thread.sleep(500);</span></span>
<span class="line"><span>        } catch (InterruptedException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        System.out.println( currentThreadName + &quot; is second get age: &quot; + Student.getAge());</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    private Student getStudentt() {</span></span>
<span class="line"><span>        Student Student = StudentThreadLocal.get();</span></span>
<span class="line"><span>        if (null == Student) {</span></span>
<span class="line"><span>            Student = new Student();</span></span>
<span class="line"><span>            StudentThreadLocal.set(Student);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return Student;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        ThreadLocalTest t = new ThreadLocalTest();</span></span>
<span class="line"><span>        Thread t1 = new Thread(t,&quot;Thread A&quot;);</span></span>
<span class="line"><span>        Thread t2 = new Thread(t,&quot;Thread B&quot;);</span></span>
<span class="line"><span>        t1.start();</span></span>
<span class="line"><span>        t2.start();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Student{</span></span>
<span class="line"><span>    int age;</span></span>
<span class="line"><span>    public int getAge() {</span></span>
<span class="line"><span>        return age;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public void setAge(int age) {</span></span>
<span class="line"><span>        this.age = age;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="java-开发手册中推荐的-threadlocal" tabindex="-1">java 开发手册中推荐的 ThreadLocal <a class="header-anchor" href="#java-开发手册中推荐的-threadlocal" aria-label="Permalink to &quot;java 开发手册中推荐的 ThreadLocal&quot;">​</a></h3><p>看看阿里巴巴 java 开发手册中推荐的 ThreadLocal 的用法:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.text.DateFormat;</span></span>
<span class="line"><span>import java.text.SimpleDateFormat;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>public class DateUtils {</span></span>
<span class="line"><span>    public static final ThreadLocal&lt;DateFormat&gt; df = new ThreadLocal&lt;DateFormat&gt;(){</span></span>
<span class="line"><span>        @Override</span></span>
<span class="line"><span>        protected DateFormat initialValue() {</span></span>
<span class="line"><span>            return new SimpleDateFormat(&quot;yyyy-MM-dd&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>然后我们再要用到 DateFormat 对象的地方，这样调用：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DateUtils.df.get().format(new Date());</span></span></code></pre></div><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li><a href="https://blog.csdn.net/vking%5C_wang/article/details/14225379" target="_blank" rel="noreferrer">https://blog.csdn.net/vking\\_wang/article/details/14225379</a></li><li><a href="https://mp.weixin.qq.com/s/mo3-y-45%5C_ao54b5T7ez7iA" target="_blank" rel="noreferrer">https://mp.weixin.qq.com/s/mo3-y-45\\_ao54b5T7ez7iA</a></li><li><a href="https://www.xttblog.com/?p=3087" target="_blank" rel="noreferrer">https://www.xttblog.com/?p=3087</a></li><li><a href="https://blog.csdn.net/whut2010hj/article/details/81413887" target="_blank" rel="noreferrer">https://blog.csdn.net/whut2010hj/article/details/81413887</a></li><li><a href="https://segmentfault.com/a/1190000018399795" target="_blank" rel="noreferrer">https://segmentfault.com/a/1190000018399795</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,83)]))}const g=n(l,[["render",t]]);export{u as __pageData,g as default};
