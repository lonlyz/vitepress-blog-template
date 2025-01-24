import{_ as s}from"./chunks/java-thread-x-locksupport-1.-C3t1Ifl.js";import{_ as n,c as p,ai as e,o as l}from"./chunks/framework.BrYByd3F.js";const b=JSON.parse('{"title":"JUC锁: LockSupport详解","description":"","frontmatter":{},"headers":[],"relativePath":"java/thread/java-thread-x-lock-LockSupport.md","filePath":"java/thread/java-thread-x-lock-LockSupport.md","lastUpdated":1737706346000}'),t={name:"java/thread/java-thread-x-lock-LockSupport.md"};function i(c,a,r,o,d,u){return l(),p("div",null,a[0]||(a[0]=[e(`<h1 id="juc锁-locksupport详解" tabindex="-1">JUC锁: LockSupport详解 <a class="header-anchor" href="#juc锁-locksupport详解" aria-label="Permalink to &quot;JUC锁: LockSupport详解&quot;">​</a></h1><blockquote><p>LockSupport是锁中的基础，是一个提供锁机制的工具类，所以先对其进行分析。@pdai</p></blockquote><h2 id="带着bat大厂的面试问题去理解" tabindex="-1">带着BAT大厂的面试问题去理解 <a class="header-anchor" href="#带着bat大厂的面试问题去理解" aria-label="Permalink to &quot;带着BAT大厂的面试问题去理解&quot;">​</a></h2><p>提示</p><p>请带着这些问题继续后文，会很大程度上帮助你更好的理解相关知识点。@pdai</p><ul><li>为什么LockSupport也是核心基础类? AQS框架借助于两个类：Unsafe(提供CAS操作)和LockSupport(提供park/unpark操作)</li><li>写出分别通过wait/notify和LockSupport的park/unpark实现同步?</li><li>LockSupport.park()会释放锁资源吗? 那么Condition.await()呢?</li><li>Thread.sleep()、Object.wait()、Condition.await()、LockSupport.park()的区别? 重点</li><li>如果在wait()之前执行了notify()会怎样?</li><li>如果在park()之前执行了unpark()会怎样?</li></ul><h2 id="locksupport简介" tabindex="-1">LockSupport简介 <a class="header-anchor" href="#locksupport简介" aria-label="Permalink to &quot;LockSupport简介&quot;">​</a></h2><p>LockSupport用来创建锁和其他同步类的基本线程阻塞原语。简而言之，当调用LockSupport.park时，表示当前线程将会等待，直至获得许可，当调用LockSupport.unpark时，必须把等待获得许可的线程作为参数进行传递，好让此线程继续运行。</p><h2 id="locksupport源码分析" tabindex="-1">LockSupport源码分析 <a class="header-anchor" href="#locksupport源码分析" aria-label="Permalink to &quot;LockSupport源码分析&quot;">​</a></h2><h3 id="类的属性" tabindex="-1">类的属性 <a class="header-anchor" href="#类的属性" aria-label="Permalink to &quot;类的属性&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class LockSupport {</span></span>
<span class="line"><span>    // Hotspot implementation via intrinsics API</span></span>
<span class="line"><span>    private static final sun.misc.Unsafe UNSAFE;</span></span>
<span class="line"><span>    // 表示内存偏移地址</span></span>
<span class="line"><span>    private static final long parkBlockerOffset;</span></span>
<span class="line"><span>    // 表示内存偏移地址</span></span>
<span class="line"><span>    private static final long SEED;</span></span>
<span class="line"><span>    // 表示内存偏移地址</span></span>
<span class="line"><span>    private static final long PROBE;</span></span>
<span class="line"><span>    // 表示内存偏移地址</span></span>
<span class="line"><span>    private static final long SECONDARY;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    static {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            // 获取Unsafe实例</span></span>
<span class="line"><span>            UNSAFE = sun.misc.Unsafe.getUnsafe();</span></span>
<span class="line"><span>            // 线程类类型</span></span>
<span class="line"><span>            Class&lt;?&gt; tk = Thread.class;</span></span>
<span class="line"><span>            // 获取Thread的parkBlocker字段的内存偏移地址</span></span>
<span class="line"><span>            parkBlockerOffset = UNSAFE.objectFieldOffset</span></span>
<span class="line"><span>                (tk.getDeclaredField(&quot;parkBlocker&quot;));</span></span>
<span class="line"><span>            // 获取Thread的threadLocalRandomSeed字段的内存偏移地址</span></span>
<span class="line"><span>            SEED = UNSAFE.objectFieldOffset</span></span>
<span class="line"><span>                (tk.getDeclaredField(&quot;threadLocalRandomSeed&quot;));</span></span>
<span class="line"><span>            // 获取Thread的threadLocalRandomProbe字段的内存偏移地址</span></span>
<span class="line"><span>            PROBE = UNSAFE.objectFieldOffset</span></span>
<span class="line"><span>                (tk.getDeclaredField(&quot;threadLocalRandomProbe&quot;));</span></span>
<span class="line"><span>            // 获取Thread的threadLocalRandomSecondarySeed字段的内存偏移地址</span></span>
<span class="line"><span>            SECONDARY = UNSAFE.objectFieldOffset</span></span>
<span class="line"><span>                (tk.getDeclaredField(&quot;threadLocalRandomSecondarySeed&quot;));</span></span>
<span class="line"><span>        } catch (Exception ex) { throw new Error(ex); }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: UNSAFE字段表示sun.misc.Unsafe类，查看其源码，点击在这里，一般程序中不允许直接调用，而long型的表示实例对象相应字段在内存中的偏移地址，可以通过该偏移地址获取或者设置该字段的值。</p><h3 id="类的构造函数" tabindex="-1">类的构造函数 <a class="header-anchor" href="#类的构造函数" aria-label="Permalink to &quot;类的构造函数&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 私有构造函数，无法被实例化</span></span>
<span class="line"><span>private LockSupport() {}</span></span></code></pre></div><p>说明: LockSupport只有一个私有构造函数，无法被实例化。</p><h3 id="核心函数分析" tabindex="-1">核心函数分析 <a class="header-anchor" href="#核心函数分析" aria-label="Permalink to &quot;核心函数分析&quot;">​</a></h3><p>在分析LockSupport函数之前，先引入sun.misc.Unsafe类中的park和unpark函数，因为LockSupport的核心函数都是基于Unsafe类中定义的park和unpark函数，下面给出两个函数的定义:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public native void park(boolean isAbsolute, long time);</span></span>
<span class="line"><span>public native void unpark(Thread thread);</span></span></code></pre></div><p>说明: 对两个函数的说明如下:</p><ul><li><p>park函数，阻塞线程，并且该线程在下列情况发生之前都会被阻塞: ① 调用unpark函数，释放该线程的许可。② 该线程被中断。③ 设置的时间到了。并且，当time为绝对时间时，isAbsolute为true，否则，isAbsolute为false。当time为0时，表示无限等待，直到unpark发生。</p></li><li><p>unpark函数，释放线程的许可，即激活调用park后阻塞的线程。这个函数不是安全的，调用这个函数时要确保线程依旧存活。</p></li></ul><h4 id="park函数" tabindex="-1">park函数 <a class="header-anchor" href="#park函数" aria-label="Permalink to &quot;park函数&quot;">​</a></h4><p>park函数有两个重载版本，方法摘要如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void park()；</span></span>
<span class="line"><span>public static void park(Object blocker)；</span></span></code></pre></div><p>说明: 两个函数的区别在于park()函数没有没有blocker，即没有设置线程的parkBlocker字段。park(Object)型函数如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void park(Object blocker) {</span></span>
<span class="line"><span>    // 获取当前线程</span></span>
<span class="line"><span>    Thread t = Thread.currentThread();</span></span>
<span class="line"><span>    // 设置Blocker</span></span>
<span class="line"><span>    setBlocker(t, blocker);</span></span>
<span class="line"><span>    // 获取许可</span></span>
<span class="line"><span>    UNSAFE.park(false, 0L);</span></span>
<span class="line"><span>    // 重新可运行后再此设置Blocker</span></span>
<span class="line"><span>    setBlocker(t, null);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 调用park函数时，首先获取当前线程，然后设置当前线程的parkBlocker字段，即调用setBlocker函数，之后调用Unsafe类的park函数，之后再调用setBlocker函数。那么问题来了，为什么要在此park函数中要调用两次setBlocker函数呢? 原因其实很简单，调用park函数时，当前线程首先设置好parkBlocker字段，然后再调用Unsafe的park函数，此后，当前线程就已经阻塞了，等待该线程的unpark函数被调用，所以后面的一个setBlocker函数无法运行，unpark函数被调用，该线程获得许可后，就可以继续运行了，也就运行第二个setBlocker，把该线程的parkBlocker字段设置为null，这样就完成了整个park函数的逻辑。如果没有第二个setBlocker，那么之后没有调用park(Object blocker)，而直接调用getBlocker函数，得到的还是前一个park(Object blocker)设置的blocker，显然是不符合逻辑的。总之，必须要保证在park(Object blocker)整个函数执行完后，该线程的parkBlocker字段又恢复为null。所以，park(Object)型函数里必须要调用setBlocker函数两次。setBlocker方法如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private static void setBlocker(Thread t, Object arg) {</span></span>
<span class="line"><span>    // 设置线程t的parkBlocker字段的值为arg</span></span>
<span class="line"><span>    UNSAFE.putObject(t, parkBlockerOffset, arg);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 此方法用于设置线程t的parkBlocker字段的值为arg。</p><p>另外一个无参重载版本，park()函数如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void park() {</span></span>
<span class="line"><span>    // 获取许可，设置时间为无限长，直到可以获取许可</span></span>
<span class="line"><span>    UNSAFE.park(false, 0L);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 调用了park函数后，会禁用当前线程，除非许可可用。在以下三种情况之一发生之前，当前线程都将处于休眠状态，即下列情况发生时，当前线程会获取许可，可以继续运行。</p><ul><li>其他某个线程将当前线程作为目标调用 unpark。</li><li>其他某个线程中断当前线程。</li><li>该调用不合逻辑地(即毫无理由地)返回。</li></ul><h4 id="parknanos函数" tabindex="-1">parkNanos函数 <a class="header-anchor" href="#parknanos函数" aria-label="Permalink to &quot;parkNanos函数&quot;">​</a></h4><p>此函数表示在许可可用前禁用当前线程，并最多等待指定的等待时间。具体函数如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void parkNanos(Object blocker, long nanos) {</span></span>
<span class="line"><span>    if (nanos &gt; 0) { // 时间大于0</span></span>
<span class="line"><span>        // 获取当前线程</span></span>
<span class="line"><span>        Thread t = Thread.currentThread();</span></span>
<span class="line"><span>        // 设置Blocker</span></span>
<span class="line"><span>        setBlocker(t, blocker);</span></span>
<span class="line"><span>        // 获取许可，并设置了时间</span></span>
<span class="line"><span>        UNSAFE.park(false, nanos);</span></span>
<span class="line"><span>        // 设置许可</span></span>
<span class="line"><span>        setBlocker(t, null);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 该函数也是调用了两次setBlocker函数，nanos参数表示相对时间，表示等待多长时间。</p><h4 id="parkuntil函数" tabindex="-1">parkUntil函数 <a class="header-anchor" href="#parkuntil函数" aria-label="Permalink to &quot;parkUntil函数&quot;">​</a></h4><p>此函数表示在指定的时限前禁用当前线程，除非许可可用, 具体函数如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void parkUntil(Object blocker, long deadline) {</span></span>
<span class="line"><span>    // 获取当前线程</span></span>
<span class="line"><span>    Thread t = Thread.currentThread();</span></span>
<span class="line"><span>    // 设置Blocker</span></span>
<span class="line"><span>    setBlocker(t, blocker);</span></span>
<span class="line"><span>    UNSAFE.park(true, deadline);</span></span>
<span class="line"><span>    // 设置Blocker为null</span></span>
<span class="line"><span>    setBlocker(t, null);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 该函数也调用了两次setBlocker函数，deadline参数表示绝对时间，表示指定的时间。</p><h4 id="unpark函数" tabindex="-1">unpark函数 <a class="header-anchor" href="#unpark函数" aria-label="Permalink to &quot;unpark函数&quot;">​</a></h4><p>此函数表示如果给定线程的许可尚不可用，则使其可用。如果线程在 park 上受阻塞，则它将解除其阻塞状态。否则，保证下一次调用 park 不会受阻塞。如果给定线程尚未启动，则无法保证此操作有任何效果。具体函数如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void unpark(Thread thread) {</span></span>
<span class="line"><span>    if (thread != null) // 线程为不空</span></span>
<span class="line"><span>        UNSAFE.unpark(thread); // 释放该线程许可</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>说明: 释放许可，指定线程可以继续运行。</p><h2 id="locksupport示例说明" tabindex="-1">LockSupport示例说明 <a class="header-anchor" href="#locksupport示例说明" aria-label="Permalink to &quot;LockSupport示例说明&quot;">​</a></h2><h3 id="使用wait-notify实现线程同步" tabindex="-1">使用wait/notify实现线程同步 <a class="header-anchor" href="#使用wait-notify实现线程同步" aria-label="Permalink to &quot;使用wait/notify实现线程同步&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class MyThread extends Thread {</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public void run() {</span></span>
<span class="line"><span>        synchronized (this) {</span></span>
<span class="line"><span>            System.out.println(&quot;before notify&quot;);            </span></span>
<span class="line"><span>            notify();</span></span>
<span class="line"><span>            System.out.println(&quot;after notify&quot;);    </span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class WaitAndNotifyDemo {</span></span>
<span class="line"><span>    public static void main(String[] args) throws InterruptedException {</span></span>
<span class="line"><span>        MyThread myThread = new MyThread();            </span></span>
<span class="line"><span>        synchronized (myThread) {</span></span>
<span class="line"><span>            try {        </span></span>
<span class="line"><span>                myThread.start();</span></span>
<span class="line"><span>                // 主线程睡眠3s</span></span>
<span class="line"><span>                Thread.sleep(3000);</span></span>
<span class="line"><span>                System.out.println(&quot;before wait&quot;);</span></span>
<span class="line"><span>                // 阻塞主线程</span></span>
<span class="line"><span>                myThread.wait();</span></span>
<span class="line"><span>                System.out.println(&quot;after wait&quot;);</span></span>
<span class="line"><span>            } catch (InterruptedException e) {</span></span>
<span class="line"><span>                e.printStackTrace();</span></span>
<span class="line"><span>            }            </span></span>
<span class="line"><span>        }        </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行结果</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>before wait</span></span>
<span class="line"><span>before notify</span></span>
<span class="line"><span>after notify</span></span>
<span class="line"><span>after wait</span></span></code></pre></div><p>说明: 具体的流程图如下</p><p><img src="`+s+`" alt="error.图片加载失败"></p><p>使用wait/notify实现同步时，必须先调用wait，后调用notify，如果先调用notify，再调用wait，将起不了作用。具体代码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class MyThread extends Thread {</span></span>
<span class="line"><span>    public void run() {</span></span>
<span class="line"><span>        synchronized (this) {</span></span>
<span class="line"><span>            System.out.println(&quot;before notify&quot;);            </span></span>
<span class="line"><span>            notify();</span></span>
<span class="line"><span>            System.out.println(&quot;after notify&quot;);    </span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class WaitAndNotifyDemo {</span></span>
<span class="line"><span>    public static void main(String[] args) throws InterruptedException {</span></span>
<span class="line"><span>        MyThread myThread = new MyThread();        </span></span>
<span class="line"><span>        myThread.start();</span></span>
<span class="line"><span>        // 主线程睡眠3s</span></span>
<span class="line"><span>        Thread.sleep(3000);</span></span>
<span class="line"><span>        synchronized (myThread) {</span></span>
<span class="line"><span>            try {        </span></span>
<span class="line"><span>                System.out.println(&quot;before wait&quot;);</span></span>
<span class="line"><span>                // 阻塞主线程</span></span>
<span class="line"><span>                myThread.wait();</span></span>
<span class="line"><span>                System.out.println(&quot;after wait&quot;);</span></span>
<span class="line"><span>            } catch (InterruptedException e) {</span></span>
<span class="line"><span>                e.printStackTrace();</span></span>
<span class="line"><span>            }            </span></span>
<span class="line"><span>        }        </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行结果:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>before notify</span></span>
<span class="line"><span>after notify</span></span>
<span class="line"><span>before wait</span></span></code></pre></div><p>说明: 由于先调用了notify，再调用的wait，此时主线程还是会一直阻塞。</p><h3 id="使用park-unpark实现线程同步" tabindex="-1">使用park/unpark实现线程同步 <a class="header-anchor" href="#使用park-unpark实现线程同步" aria-label="Permalink to &quot;使用park/unpark实现线程同步&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.concurrent.locks.LockSupport;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class MyThread extends Thread {</span></span>
<span class="line"><span>    private Object object;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public MyThread(Object object) {</span></span>
<span class="line"><span>        this.object = object;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void run() {</span></span>
<span class="line"><span>        System.out.println(&quot;before unpark&quot;);</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            Thread.sleep(1000);</span></span>
<span class="line"><span>        } catch (InterruptedException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 获取blocker</span></span>
<span class="line"><span>        System.out.println(&quot;Blocker info &quot; + LockSupport.getBlocker((Thread) object));</span></span>
<span class="line"><span>        // 释放许可</span></span>
<span class="line"><span>        LockSupport.unpark((Thread) object);</span></span>
<span class="line"><span>        // 休眠500ms，保证先执行park中的setBlocker(t, null);</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            Thread.sleep(500);</span></span>
<span class="line"><span>        } catch (InterruptedException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 再次获取blocker</span></span>
<span class="line"><span>        System.out.println(&quot;Blocker info &quot; + LockSupport.getBlocker((Thread) object));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        System.out.println(&quot;after unpark&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class test {</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        MyThread myThread = new MyThread(Thread.currentThread());</span></span>
<span class="line"><span>        myThread.start();</span></span>
<span class="line"><span>        System.out.println(&quot;before park&quot;);</span></span>
<span class="line"><span>        // 获取许可</span></span>
<span class="line"><span>        LockSupport.park(&quot;ParkAndUnparkDemo&quot;);</span></span>
<span class="line"><span>        System.out.println(&quot;after park&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行结果:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>before park</span></span>
<span class="line"><span>before unpark</span></span>
<span class="line"><span>Blocker info ParkAndUnparkDemo</span></span>
<span class="line"><span>after park</span></span>
<span class="line"><span>Blocker info null</span></span>
<span class="line"><span>after unpark</span></span></code></pre></div><p>说明: 本程序先执行park，然后在执行unpark，进行同步，并且在unpark的前后都调用了getBlocker，可以看到两次的结果不一样，并且第二次调用的结果为null，这是因为在调用unpark之后，执行了Lock.park(Object blocker)函数中的setBlocker(t, null)函数，所以第二次调用getBlocker时为null。</p><p>上例是先调用park，然后调用unpark，现在修改程序，先调用unpark，然后调用park，看能不能正确同步。具体代码如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.concurrent.locks.LockSupport;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class MyThread extends Thread {</span></span>
<span class="line"><span>    private Object object;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public MyThread(Object object) {</span></span>
<span class="line"><span>        this.object = object;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void run() {</span></span>
<span class="line"><span>        System.out.println(&quot;before unpark&quot;);        </span></span>
<span class="line"><span>        // 释放许可</span></span>
<span class="line"><span>        LockSupport.unpark((Thread) object);</span></span>
<span class="line"><span>        System.out.println(&quot;after unpark&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class ParkAndUnparkDemo {</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        MyThread myThread = new MyThread(Thread.currentThread());</span></span>
<span class="line"><span>        myThread.start();</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            // 主线程睡眠3s</span></span>
<span class="line"><span>            Thread.sleep(3000);</span></span>
<span class="line"><span>        } catch (InterruptedException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        System.out.println(&quot;before park&quot;);</span></span>
<span class="line"><span>        // 获取许可</span></span>
<span class="line"><span>        LockSupport.park(&quot;ParkAndUnparkDemo&quot;);</span></span>
<span class="line"><span>        System.out.println(&quot;after park&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行结果:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>before unpark</span></span>
<span class="line"><span>after unpark</span></span>
<span class="line"><span>before park</span></span>
<span class="line"><span>after park</span></span></code></pre></div><p>说明: 可以看到，在先调用unpark，再调用park时，仍能够正确实现同步，不会造成由wait/notify调用顺序不当所引起的阻塞。因此park/unpark相比wait/notify更加的灵活。</p><h3 id="中断响应" tabindex="-1">中断响应 <a class="header-anchor" href="#中断响应" aria-label="Permalink to &quot;中断响应&quot;">​</a></h3><p>看下面示例</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.concurrent.locks.LockSupport;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class MyThread extends Thread {</span></span>
<span class="line"><span>    private Object object;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public MyThread(Object object) {</span></span>
<span class="line"><span>        this.object = object;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void run() {</span></span>
<span class="line"><span>        System.out.println(&quot;before interrupt&quot;);        </span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            // 休眠3s</span></span>
<span class="line"><span>            Thread.sleep(3000);</span></span>
<span class="line"><span>        } catch (InterruptedException e) {</span></span>
<span class="line"><span>            e.printStackTrace();</span></span>
<span class="line"><span>        }    </span></span>
<span class="line"><span>        Thread thread = (Thread) object;</span></span>
<span class="line"><span>        // 中断线程</span></span>
<span class="line"><span>        thread.interrupt();</span></span>
<span class="line"><span>        System.out.println(&quot;after interrupt&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class InterruptDemo {</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        MyThread myThread = new MyThread(Thread.currentThread());</span></span>
<span class="line"><span>        myThread.start();</span></span>
<span class="line"><span>        System.out.println(&quot;before park&quot;);</span></span>
<span class="line"><span>        // 获取许可</span></span>
<span class="line"><span>        LockSupport.park(&quot;ParkAndUnparkDemo&quot;);</span></span>
<span class="line"><span>        System.out.println(&quot;after park&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>运行结果:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>before park</span></span>
<span class="line"><span>before interrupt</span></span>
<span class="line"><span>after interrupt</span></span>
<span class="line"><span>after park</span></span></code></pre></div><p>说明: 可以看到，在主线程调用park阻塞后，在myThread线程中发出了中断信号，此时主线程会继续运行，也就是说明此时interrupt起到的作用与unpark一样。</p><h2 id="更深入的理解" tabindex="-1">更深入的理解 <a class="header-anchor" href="#更深入的理解" aria-label="Permalink to &quot;更深入的理解&quot;">​</a></h2><h3 id="thread-sleep-和object-wait-的区别" tabindex="-1">Thread.sleep()和Object.wait()的区别 <a class="header-anchor" href="#thread-sleep-和object-wait-的区别" aria-label="Permalink to &quot;Thread.sleep()和Object.wait()的区别&quot;">​</a></h3><p>首先，我们先来看看Thread.sleep()和Object.wait()的区别，这是一个烂大街的题目了，大家应该都能说上来两点。</p><ul><li>Thread.sleep()不会释放占有的锁，Object.wait()会释放占有的锁；</li><li>Thread.sleep()必须传入时间，Object.wait()可传可不传，不传表示一直阻塞下去；</li><li>Thread.sleep()到时间了会自动唤醒，然后继续执行；</li><li>Object.wait()不带时间的，需要另一个线程使用Object.notify()唤醒；</li><li>Object.wait()带时间的，假如没有被notify，到时间了会自动唤醒，这时又分好两种情况，一是立即获取到了锁，线程自然会继续执行；二是没有立即获取锁，线程进入同步队列等待获取锁；</li></ul><p>其实，他们俩最大的区别就是Thread.sleep()不会释放锁资源，Object.wait()会释放锁资源。</p><h3 id="object-wait-和condition-await-的区别" tabindex="-1">Object.wait()和Condition.await()的区别 <a class="header-anchor" href="#object-wait-和condition-await-的区别" aria-label="Permalink to &quot;Object.wait()和Condition.await()的区别&quot;">​</a></h3><p>Object.wait()和Condition.await()的原理是基本一致的，不同的是Condition.await()底层是调用LockSupport.park()来实现阻塞当前线程的。</p><p>实际上，它在阻塞当前线程之前还干了两件事，一是把当前线程添加到条件队列中，二是“完全”释放锁，也就是让state状态变量变为0，然后才是调用LockSupport.park()阻塞当前线程。</p><h3 id="thread-sleep-和locksupport-park-的区别" tabindex="-1">Thread.sleep()和LockSupport.park()的区别 <a class="header-anchor" href="#thread-sleep-和locksupport-park-的区别" aria-label="Permalink to &quot;Thread.sleep()和LockSupport.park()的区别&quot;">​</a></h3><p>LockSupport.park()还有几个兄弟方法——parkNanos()、parkUtil()等，我们这里说的park()方法统称这一类方法。</p><ul><li>从功能上来说，Thread.sleep()和LockSupport.park()方法类似，都是阻塞当前线程的执行，且都不会释放当前线程占有的锁资源；</li><li>Thread.sleep()没法从外部唤醒，只能自己醒过来；</li><li>LockSupport.park()方法可以被另一个线程调用LockSupport.unpark()方法唤醒；</li><li>Thread.sleep()方法声明上抛出了InterruptedException中断异常，所以调用者需要捕获这个异常或者再抛出；</li><li>LockSupport.park()方法不需要捕获中断异常；</li><li>Thread.sleep()本身就是一个native方法；</li><li>LockSupport.park()底层是调用的Unsafe的native方法；</li></ul><h3 id="object-wait-和locksupport-park-的区别" tabindex="-1">Object.wait()和LockSupport.park()的区别 <a class="header-anchor" href="#object-wait-和locksupport-park-的区别" aria-label="Permalink to &quot;Object.wait()和LockSupport.park()的区别&quot;">​</a></h3><p>二者都会阻塞当前线程的运行，他们有什么区别呢? 经过上面的分析相信你一定很清楚了，真的吗? 往下看！</p><ul><li>Object.wait()方法需要在synchronized块中执行；</li><li>LockSupport.park()可以在任意地方执行；</li><li>Object.wait()方法声明抛出了中断异常，调用者需要捕获或者再抛出；</li><li>LockSupport.park()不需要捕获中断异常；</li><li>Object.wait()不带超时的，需要另一个线程执行notify()来唤醒，但不一定继续执行后续内容；</li><li>LockSupport.park()不带超时的，需要另一个线程执行unpark()来唤醒，一定会继续执行后续内容；</li></ul><p>park()/unpark()底层的原理是“二元信号量”，你可以把它相像成只有一个许可证的Semaphore，只不过这个信号量在重复执行unpark()的时候也不会再增加许可证，最多只有一个许可证。</p><h4 id="如果在wait-之前执行了notify-会怎样" tabindex="-1">如果在wait()之前执行了notify()会怎样? <a class="header-anchor" href="#如果在wait-之前执行了notify-会怎样" aria-label="Permalink to &quot;如果在wait()之前执行了notify()会怎样?&quot;">​</a></h4><p>如果当前的线程不是此对象锁的所有者，却调用该对象的notify()或wait()方法时抛出IllegalMonitorStateException异常；</p><p>如果当前线程是此对象锁的所有者，wait()将一直阻塞，因为后续将没有其它notify()唤醒它。</p><h4 id="如果在park-之前执行了unpark-会怎样" tabindex="-1">如果在park()之前执行了unpark()会怎样? <a class="header-anchor" href="#如果在park-之前执行了unpark-会怎样" aria-label="Permalink to &quot;如果在park()之前执行了unpark()会怎样?&quot;">​</a></h4><p>线程不会被阻塞，直接跳过park()，继续执行后续内容</p><h3 id="locksupport-park-会释放锁资源吗" tabindex="-1">LockSupport.park()会释放锁资源吗? <a class="header-anchor" href="#locksupport-park-会释放锁资源吗" aria-label="Permalink to &quot;LockSupport.park()会释放锁资源吗?&quot;">​</a></h3><p>不会，它只负责阻塞当前线程，释放锁资源实际上是在Condition的await()方法中实现的。</p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li>文章主要参考自leesf的<a href="https://www.cnblogs.com/leesf456/p/5347293.html%EF%BC%8C%E5%9C%A8%E6%AD%A4%E5%9F%BA%E7%A1%80%E4%B8%8A%E5%81%9A%E4%BA%86%E5%A2%9E%E6%94%B9%E3%80%82" target="_blank" rel="noreferrer">https://www.cnblogs.com/leesf456/p/5347293.html，在此基础上做了增改。</a></li><li><a href="https://blog.csdn.net/tangtong1/article/details/102829724" target="_blank" rel="noreferrer">https://blog.csdn.net/tangtong1/article/details/102829724</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,97)]))}const g=n(t,[["render",i]]);export{b as __pageData,g as default};
