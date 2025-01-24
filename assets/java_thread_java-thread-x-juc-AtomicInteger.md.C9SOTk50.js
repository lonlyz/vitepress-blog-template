import{_ as n}from"./chunks/java-thread-x-atomicinteger-unsafe.mGXEIB6P.js";import{_ as s,c as p,ai as e,o as l}from"./chunks/framework.BrYByd3F.js";const g=JSON.parse('{"title":"JUC原子类: CAS, Unsafe和原子类详解","description":"","frontmatter":{},"headers":[],"relativePath":"java/thread/java-thread-x-juc-AtomicInteger.md","filePath":"java/thread/java-thread-x-juc-AtomicInteger.md","lastUpdated":1737706346000}'),t={name:"java/thread/java-thread-x-juc-AtomicInteger.md"};function i(c,a,r,o,d,u){return l(),p("div",null,a[0]||(a[0]=[e(`<h1 id="juc原子类-cas-unsafe和原子类详解" tabindex="-1">JUC原子类: CAS, Unsafe和原子类详解 <a class="header-anchor" href="#juc原子类-cas-unsafe和原子类详解" aria-label="Permalink to &quot;JUC原子类: CAS, Unsafe和原子类详解&quot;">​</a></h1><blockquote><p>JUC中多数类是通过volatile和CAS来实现的，CAS本质上提供的是一种无锁方案，而Synchronized和Lock是互斥锁方案; java原子类本质上使用的是CAS，而CAS底层是通过Unsafe类实现的。所以本章将对CAS, Unsafe和原子类详解。 @pdai</p></blockquote><h2 id="带着bat大厂的面试问题去理解" tabindex="-1">带着BAT大厂的面试问题去理解 <a class="header-anchor" href="#带着bat大厂的面试问题去理解" aria-label="Permalink to &quot;带着BAT大厂的面试问题去理解&quot;">​</a></h2><p>提示</p><p>请带着这些问题继续后文，会很大程度上帮助你更好的理解相关知识点。@pdai</p><ul><li>线程安全的实现方法有哪些?</li><li>什么是CAS?</li><li>CAS使用示例，结合AtomicInteger给出示例?</li><li>CAS会有哪些问题?</li><li>针对这这些问题，Java提供了哪几个解决的?</li><li>AtomicInteger底层实现? CAS+volatile</li><li>请阐述你对Unsafe类的理解?</li><li>说说你对Java原子类的理解? 包含13个，4组分类，说说作用和使用场景。</li><li>AtomicStampedReference是什么?</li><li>AtomicStampedReference是怎么解决ABA的? 内部使用Pair来存储元素值及其版本号</li><li>java中还有哪些类可以解决ABA的问题? AtomicMarkableReference</li></ul><h2 id="cas" tabindex="-1">CAS <a class="header-anchor" href="#cas" aria-label="Permalink to &quot;CAS&quot;">​</a></h2><p>前面我们说到，线程安全的实现方法包含:</p><ul><li>互斥同步: synchronized 和 ReentrantLock</li><li>非阻塞同步: CAS, AtomicXXXX</li><li>无同步方案: 栈封闭，Thread Local，可重入代码</li></ul><p>具体可以参看：<a href="https://pdai.tech/md/java/thread/java-thread-x-theorty.html#%E7%BA%BF%E7%A8%8B%E5%AE%89%E5%85%A8%E7%9A%84%E5%AE%9E%E7%8E%B0%E6%96%B9%E6%B3%95" target="_blank" rel="noreferrer">线程安全的实现方法</a>，这里我们将对CAS重点阐释。</p><h3 id="什么是cas" tabindex="-1">什么是CAS <a class="header-anchor" href="#什么是cas" aria-label="Permalink to &quot;什么是CAS&quot;">​</a></h3><p>CAS的全称为Compare-And-Swap，直译就是对比交换。是一条CPU的原子指令，其作用是让CPU先进行比较两个值是否相等，然后原子地更新某个位置的值，经过调查发现，其实现方式是基于硬件平台的汇编指令，就是说CAS是靠硬件实现的，JVM只是封装了汇编调用，那些AtomicInteger类便是使用了这些封装后的接口。   简单解释：CAS操作需要输入两个数值，一个旧值(期望操作前的值)和一个新值，在操作期间先比较下在旧值有没有发生变化，如果没有发生变化，才交换成新值，发生了变化则不交换。</p><p>CAS操作是原子性的，所以多线程并发使用CAS更新数据时，可以不使用锁。JDK中大量使用了CAS来更新数据而防止加锁(synchronized 重量级锁)来保持原子更新。</p><p>相信sql大家都熟悉，类似sql中的条件更新一样：update set id=3 from table where id=2。因为单条sql执行具有原子性，如果有多个线程同时执行此sql语句，只有一条能更新成功。</p><h3 id="cas使用示例" tabindex="-1">CAS使用示例 <a class="header-anchor" href="#cas使用示例" aria-label="Permalink to &quot;CAS使用示例&quot;">​</a></h3><p>如果不使用CAS，在高并发下，多线程同时修改一个变量的值我们需要synchronized加锁(可能有人说可以用Lock加锁，Lock底层的AQS也是基于CAS进行获取锁的)。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Test {</span></span>
<span class="line"><span>    private int i=0;</span></span>
<span class="line"><span>    public synchronized int add(){</span></span>
<span class="line"><span>        return i++;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>java中为我们提供了AtomicInteger 原子类(底层基于CAS进行更新数据的)，不需要加锁就在多线程并发场景下实现数据的一致性。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Test {</span></span>
<span class="line"><span>    private  AtomicInteger i = new AtomicInteger(0);</span></span>
<span class="line"><span>    public int add(){</span></span>
<span class="line"><span>        return i.addAndGet(1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="cas-问题" tabindex="-1">CAS 问题 <a class="header-anchor" href="#cas-问题" aria-label="Permalink to &quot;CAS 问题&quot;">​</a></h3><p>CAS 方式为乐观锁，synchronized 为悲观锁。因此使用 CAS 解决并发问题通常情况下性能更优。</p><p>但使用 CAS 方式也会有几个问题：</p><h4 id="aba问题" tabindex="-1">ABA问题 <a class="header-anchor" href="#aba问题" aria-label="Permalink to &quot;ABA问题&quot;">​</a></h4><p>因为CAS需要在操作值的时候，检查值有没有发生变化，比如没有发生变化则更新，但是如果一个值原来是A，变成了B，又变成了A，那么使用CAS进行检查时则会发现它的值没有发生变化，但是实际上却变化了。</p><p>ABA问题的解决思路就是使用版本号。在变量前面追加上版本号，每次变量更新的时候把版本号加1，那么A-&gt;B-&gt;A就会变成1A-&gt;2B-&gt;3A。</p><p>从Java 1.5开始，JDK的Atomic包里提供了一个类AtomicStampedReference来解决ABA问题。这个类的compareAndSet方法的作用是首先检查当前引用是否等于预期引用，并且检查当前标志是否等于预期标志，如果全部相等，则以原子方式将该引用和该标志的值设置为给定的更新值。</p><h4 id="循环时间长开销大" tabindex="-1">循环时间长开销大 <a class="header-anchor" href="#循环时间长开销大" aria-label="Permalink to &quot;循环时间长开销大&quot;">​</a></h4><p>自旋CAS如果长时间不成功，会给CPU带来非常大的执行开销。如果JVM能支持处理器提供的pause指令，那么效率会有一定的提升。pause指令有两个作用：第一，它可以延迟流水线执行命令(de-pipeline)，使CPU不会消耗过多的执行资源，延迟的时间取决于具体实现的版本，在一些处理器上延迟时间是零；第二，它可以避免在退出循环的时候因内存顺序冲突(Memory Order Violation)而引起CPU流水线被清空(CPU Pipeline Flush)，从而提高CPU的执行效率。</p><h4 id="只能保证一个共享变量的原子操作" tabindex="-1">只能保证一个共享变量的原子操作 <a class="header-anchor" href="#只能保证一个共享变量的原子操作" aria-label="Permalink to &quot;只能保证一个共享变量的原子操作&quot;">​</a></h4><p>当对一个共享变量执行操作时，我们可以使用循环CAS的方式来保证原子操作，但是对多个共享变量操作时，循环CAS就无法保证操作的原子性，这个时候就可以用锁。</p><p>还有一个取巧的办法，就是把多个共享变量合并成一个共享变量来操作。比如，有两个共享变量i = 2，j = a，合并一下ij = 2a，然后用CAS来操作ij。</p><p>从Java 1.5开始，JDK提供了AtomicReference类来保证引用对象之间的原子性，就可以把多个变量放在一个对象里来进行CAS操作。</p><h2 id="unsafe类详解" tabindex="-1">UnSafe类详解 <a class="header-anchor" href="#unsafe类详解" aria-label="Permalink to &quot;UnSafe类详解&quot;">​</a></h2><blockquote><p>上文我们了解到Java原子类是通过UnSafe类实现的，这节主要分析下UnSafe类。UnSafe类在J.U.C中CAS操作有很广泛的应用。</p></blockquote><p>Unsafe是位于sun.misc包下的一个类，主要提供一些用于执行低级别、不安全操作的方法，如直接访问系统内存资源、自主管理内存资源等，这些方法在提升Java运行效率、增强Java语言底层资源操作能力方面起到了很大的作用。但由于Unsafe类使Java语言拥有了类似C语言指针一样操作内存空间的能力，这无疑也增加了程序发生相关指针问题的风险。在程序中过度、不正确使用Unsafe类会使得程序出错的概率变大，使得Java这种安全的语言变得不再“安全”，因此对Unsafe的使用一定要慎重。</p><p>这个类尽管里面的方法都是 public 的，但是并没有办法使用它们，JDK API 文档也没有提供任何关于这个类的方法的解释。总而言之，对于 Unsafe 类的使用都是受限制的，只有授信的代码才能获得该类的实例，当然 JDK 库里面的类是可以随意使用的。</p><p>先来看下这张图，对UnSafe类总体功能：</p><p><img src="`+n+`" alt="error.图片加载失败"></p><p>如上图所示，Unsafe提供的API大致可分为内存操作、CAS、Class相关、对象操作、线程调度、系统信息获取、内存屏障、数组操作等几类，下面将对其相关方法和应用场景进行详细介绍。</p><h3 id="unsafe与cas" tabindex="-1">Unsafe与CAS <a class="header-anchor" href="#unsafe与cas" aria-label="Permalink to &quot;Unsafe与CAS&quot;">​</a></h3><p>反编译出来的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final int getAndAddInt(Object paramObject, long paramLong, int paramInt)</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    int i;</span></span>
<span class="line"><span>    do</span></span>
<span class="line"><span>      i = getIntVolatile(paramObject, paramLong);</span></span>
<span class="line"><span>    while (!compareAndSwapInt(paramObject, paramLong, i, i + paramInt));</span></span>
<span class="line"><span>    return i;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public final long getAndAddLong(Object paramObject, long paramLong1, long paramLong2)</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    long l;</span></span>
<span class="line"><span>    do</span></span>
<span class="line"><span>      l = getLongVolatile(paramObject, paramLong1);</span></span>
<span class="line"><span>    while (!compareAndSwapLong(paramObject, paramLong1, l, l + paramLong2));</span></span>
<span class="line"><span>    return l;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public final int getAndSetInt(Object paramObject, long paramLong, int paramInt)</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    int i;</span></span>
<span class="line"><span>    do</span></span>
<span class="line"><span>      i = getIntVolatile(paramObject, paramLong);</span></span>
<span class="line"><span>    while (!compareAndSwapInt(paramObject, paramLong, i, paramInt));</span></span>
<span class="line"><span>    return i;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public final long getAndSetLong(Object paramObject, long paramLong1, long paramLong2)</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    long l;</span></span>
<span class="line"><span>    do</span></span>
<span class="line"><span>      l = getLongVolatile(paramObject, paramLong1);</span></span>
<span class="line"><span>    while (!compareAndSwapLong(paramObject, paramLong1, l, paramLong2));</span></span>
<span class="line"><span>    return l;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public final Object getAndSetObject(Object paramObject1, long paramLong, Object paramObject2)</span></span>
<span class="line"><span>  {</span></span>
<span class="line"><span>    Object localObject;</span></span>
<span class="line"><span>    do</span></span>
<span class="line"><span>      localObject = getObjectVolatile(paramObject1, paramLong);</span></span>
<span class="line"><span>    while (!compareAndSwapObject(paramObject1, paramLong, localObject, paramObject2));</span></span>
<span class="line"><span>    return localObject;</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>从源码中发现，内部使用自旋的方式进行CAS更新(while循环进行CAS更新，如果更新失败，则循环再次重试)。</p><p>又从Unsafe类中发现，原子操作其实只支持下面三个方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final native boolean compareAndSwapObject(Object paramObject1, long paramLong, Object paramObject2, Object paramObject3);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public final native boolean compareAndSwapInt(Object paramObject, long paramLong, int paramInt1, int paramInt2);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public final native boolean compareAndSwapLong(Object paramObject, long paramLong1, long paramLong2, long paramLong3);</span></span></code></pre></div><p>我们发现Unsafe只提供了3种CAS方法：compareAndSwapObject、compareAndSwapInt和compareAndSwapLong。都是native方法。</p><h3 id="unsafe底层" tabindex="-1">Unsafe底层 <a class="header-anchor" href="#unsafe底层" aria-label="Permalink to &quot;Unsafe底层&quot;">​</a></h3><p>不妨再看看Unsafe的compareAndSwap*方法来实现CAS操作，它是一个本地方法，实现位于unsafe.cpp中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>UNSAFE_ENTRY(jboolean, Unsafe_CompareAndSwapInt(JNIEnv *env, jobject unsafe, jobject obj, jlong offset, jint e, jint x))</span></span>
<span class="line"><span>  UnsafeWrapper(&quot;Unsafe_CompareAndSwapInt&quot;);</span></span>
<span class="line"><span>  oop p = JNIHandles::resolve(obj);</span></span>
<span class="line"><span>  jint* addr = (jint *) index_oop_from_field_offset_long(p, offset);</span></span>
<span class="line"><span>  return (jint)(Atomic::cmpxchg(x, addr, e)) == e;</span></span>
<span class="line"><span>UNSAFE_END</span></span></code></pre></div><p>可以看到它通过 <code>Atomic::cmpxchg</code> 来实现比较和替换操作。其中参数x是即将更新的值，参数e是原内存的值。</p><p>如果是Linux的x86，<code>Atomic::cmpxchg</code>方法的实现如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>inline jint Atomic::cmpxchg (jint exchange_value, volatile jint* dest, jint compare_value) {</span></span>
<span class="line"><span>  int mp = os::is_MP();</span></span>
<span class="line"><span>  __asm__ volatile (LOCK_IF_MP(%4) &quot;cmpxchgl %1,(%3)&quot;</span></span>
<span class="line"><span>                    : &quot;=a&quot; (exchange_value)</span></span>
<span class="line"><span>                    : &quot;r&quot; (exchange_value), &quot;a&quot; (compare_value), &quot;r&quot; (dest), &quot;r&quot; (mp)</span></span>
<span class="line"><span>                    : &quot;cc&quot;, &quot;memory&quot;);</span></span>
<span class="line"><span>  return exchange_value;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>而windows的x86的实现如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>inline jint Atomic::cmpxchg (jint exchange_value, volatile jint* dest, jint compare_value) {</span></span>
<span class="line"><span>    int mp = os::isMP(); //判断是否是多处理器</span></span>
<span class="line"><span>    _asm {</span></span>
<span class="line"><span>        mov edx, dest</span></span>
<span class="line"><span>        mov ecx, exchange_value</span></span>
<span class="line"><span>        mov eax, compare_value</span></span>
<span class="line"><span>        LOCK_IF_MP(mp)</span></span>
<span class="line"><span>        cmpxchg dword ptr [edx], ecx</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Adding a lock prefix to an instruction on MP machine</span></span>
<span class="line"><span>// VC++ doesn&#39;t like the lock prefix to be on a single line</span></span>
<span class="line"><span>// so we can&#39;t insert a label after the lock prefix.</span></span>
<span class="line"><span>// By emitting a lock prefix, we can define a label after it.</span></span>
<span class="line"><span>#define LOCK_IF_MP(mp) __asm cmp mp, 0  \\</span></span>
<span class="line"><span>                       __asm je L0      \\</span></span>
<span class="line"><span>                       __asm _emit 0xF0 \\</span></span>
<span class="line"><span>                       __asm L0:</span></span></code></pre></div><p>如果是多处理器，为cmpxchg指令添加lock前缀。反之，就省略lock前缀(单处理器会不需要lock前缀提供的内存屏障效果)。这里的lock前缀就是使用了处理器的总线锁(最新的处理器都使用缓存锁代替总线锁来提高性能)。</p><blockquote><p>cmpxchg(void* ptr, int old, int new)，如果ptr和old的值一样，则把new写到ptr内存，否则返回ptr的值，整个操作是原子的。在Intel平台下，会用lock cmpxchg来实现，使用lock触发缓存锁，这样另一个线程想访问ptr的内存，就会被block住。</p></blockquote><h3 id="unsafe其它功能" tabindex="-1">Unsafe其它功能 <a class="header-anchor" href="#unsafe其它功能" aria-label="Permalink to &quot;Unsafe其它功能&quot;">​</a></h3><p>Unsafe 提供了硬件级别的操作，比如说获取某个属性在内存中的位置，比如说修改对象的字段值，即使它是私有的。不过 Java 本身就是为了屏蔽底层的差异，对于一般的开发而言也很少会有这样的需求。</p><p>举两个例子，比方说：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public native long staticFieldOffset(Field paramField);</span></span></code></pre></div><p>这个方法可以用来获取给定的 paramField 的内存地址偏移量，这个值对于给定的 field 是唯一的且是固定不变的。</p><p>再比如说：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public native int arrayBaseOffset(Class paramClass);</span></span>
<span class="line"><span>public native int arrayIndexScale(Class paramClass);</span></span></code></pre></div><p>前一个方法是用来获取数组第一个元素的偏移地址，后一个方法是用来获取数组的转换因子即数组中元素的增量地址的。</p><p>最后看三个方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public native long allocateMemory(long paramLong);</span></span>
<span class="line"><span>public native long reallocateMemory(long paramLong1, long paramLong2);</span></span>
<span class="line"><span>public native void freeMemory(long paramLong);</span></span></code></pre></div><p>分别用来分配内存，扩充内存和释放内存的。</p><blockquote><p>更多相关功能，推荐你看下这篇文章：来自美团技术团队：<a href="https://tech.meituan.com/2019/02/14/talk-about-java-magic-class-unsafe.html" target="_blank" rel="noreferrer">Java魔法类：Unsafe应用解析在新窗口打开</a></p></blockquote><h2 id="atomicinteger" tabindex="-1">AtomicInteger <a class="header-anchor" href="#atomicinteger" aria-label="Permalink to &quot;AtomicInteger&quot;">​</a></h2><h3 id="使用举例" tabindex="-1">使用举例 <a class="header-anchor" href="#使用举例" aria-label="Permalink to &quot;使用举例&quot;">​</a></h3><p>以 AtomicInteger 为例，常用 API：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final int get()：获取当前的值</span></span>
<span class="line"><span>public final int getAndSet(int newValue)：获取当前的值，并设置新的值</span></span>
<span class="line"><span>public final int getAndIncrement()：获取当前的值，并自增</span></span>
<span class="line"><span>public final int getAndDecrement()：获取当前的值，并自减</span></span>
<span class="line"><span>public final int getAndAdd(int delta)：获取当前的值，并加上预期的值</span></span>
<span class="line"><span>void lazySet(int newValue): 最终会设置成newValue,使用lazySet设置值后，可能导致其他线程在之后的一小段时间内还是可以读到旧的值。</span></span></code></pre></div><p>相比 Integer 的优势，多线程中让变量自增：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private volatile int count = 0;</span></span>
<span class="line"><span>// 若要线程安全执行执行 count++，需要加锁</span></span>
<span class="line"><span>public synchronized void increment() {</span></span>
<span class="line"><span>    count++;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public int getCount() {</span></span>
<span class="line"><span>    return count;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>使用 AtomicInteger 后：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private AtomicInteger count = new AtomicInteger();</span></span>
<span class="line"><span>public void increment() {</span></span>
<span class="line"><span>    count.incrementAndGet();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 使用 AtomicInteger 后，不需要加锁，也可以实现线程安全</span></span>
<span class="line"><span>public int getCount() {</span></span>
<span class="line"><span>    return count.get();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="源码解析" tabindex="-1">源码解析 <a class="header-anchor" href="#源码解析" aria-label="Permalink to &quot;源码解析&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class AtomicInteger extends Number implements java.io.Serializable {</span></span>
<span class="line"><span>    private static final Unsafe unsafe = Unsafe.getUnsafe();</span></span>
<span class="line"><span>    private static final long valueOffset;</span></span>
<span class="line"><span>    static {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            //用于获取value字段相对当前对象的“起始地址”的偏移量</span></span>
<span class="line"><span>            valueOffset = unsafe.objectFieldOffset(AtomicInteger.class.getDeclaredField(&quot;value&quot;));</span></span>
<span class="line"><span>        } catch (Exception ex) { throw new Error(ex); }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private volatile int value;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //返回当前值</span></span>
<span class="line"><span>    public final int get() {</span></span>
<span class="line"><span>        return value;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //递增加detla</span></span>
<span class="line"><span>    public final int getAndAdd(int delta) {</span></span>
<span class="line"><span>        //三个参数，1、当前的实例 2、value实例变量的偏移量 3、当前value要加上的数(value+delta)。</span></span>
<span class="line"><span>        return unsafe.getAndAddInt(this, valueOffset, delta);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //递增加1</span></span>
<span class="line"><span>    public final int incrementAndGet() {</span></span>
<span class="line"><span>        return unsafe.getAndAddInt(this, valueOffset, 1) + 1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们可以看到 AtomicInteger 底层用的是volatile的变量和CAS来进行更改数据的。</p><ul><li>volatile保证线程的可见性，多线程并发时，一个线程修改数据，可以保证其它线程立马看到修改后的值</li><li>CAS 保证数据更新的原子性。</li></ul><h2 id="延伸到所有原子类-共12个" tabindex="-1">延伸到所有原子类：共12个 <a class="header-anchor" href="#延伸到所有原子类-共12个" aria-label="Permalink to &quot;延伸到所有原子类：共12个&quot;">​</a></h2><blockquote><p>JDK中提供了12个原子操作类。</p></blockquote><h3 id="原子更新基本类型" tabindex="-1">原子更新基本类型 <a class="header-anchor" href="#原子更新基本类型" aria-label="Permalink to &quot;原子更新基本类型&quot;">​</a></h3><p>使用原子的方式更新基本类型，Atomic包提供了以下3个类。</p><ul><li>AtomicBoolean: 原子更新布尔类型。</li><li>AtomicInteger: 原子更新整型。</li><li>AtomicLong: 原子更新长整型。</li></ul><p>以上3个类提供的方法几乎一模一样，可以参考上面AtomicInteger中的相关方法。</p><h3 id="原子更新数组" tabindex="-1">原子更新数组 <a class="header-anchor" href="#原子更新数组" aria-label="Permalink to &quot;原子更新数组&quot;">​</a></h3><p>通过原子的方式更新数组里的某个元素，Atomic包提供了以下的3个类：</p><ul><li>AtomicIntegerArray: 原子更新整型数组里的元素。</li><li>AtomicLongArray: 原子更新长整型数组里的元素。</li><li>AtomicReferenceArray: 原子更新引用类型数组里的元素。</li></ul><p>这三个类的最常用的方法是如下两个方法：</p><ul><li>get(int index)：获取索引为index的元素值。</li><li>compareAndSet(int i,E expect,E update): 如果当前值等于预期值，则以原子方式将数组位置i的元素设置为update值。</li></ul><p>举个AtomicIntegerArray例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.concurrent.atomic.AtomicIntegerArray;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Demo5 {</span></span>
<span class="line"><span>    public static void main(String[] args) throws InterruptedException {</span></span>
<span class="line"><span>        AtomicIntegerArray array = new AtomicIntegerArray(new int[] { 0, 0 });</span></span>
<span class="line"><span>        System.out.println(array);</span></span>
<span class="line"><span>        System.out.println(array.getAndAdd(1, 2));</span></span>
<span class="line"><span>        System.out.println(array);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>输出结果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[0, 0]</span></span>
<span class="line"><span>0</span></span>
<span class="line"><span>[0, 2]</span></span></code></pre></div><h3 id="原子更新引用类型" tabindex="-1">原子更新引用类型 <a class="header-anchor" href="#原子更新引用类型" aria-label="Permalink to &quot;原子更新引用类型&quot;">​</a></h3><p>Atomic包提供了以下三个类：</p><ul><li>AtomicReference: 原子更新引用类型。</li><li>AtomicStampedReference: 原子更新引用类型, 内部使用Pair来存储元素值及其版本号。</li><li>AtomicMarkableReferce: 原子更新带有标记位的引用类型。</li></ul><p>这三个类提供的方法都差不多，首先构造一个引用对象，然后把引用对象set进Atomic类，然后调用compareAndSet等一些方法去进行原子操作，原理都是基于Unsafe实现，但AtomicReferenceFieldUpdater略有不同，更新的字段必须用volatile修饰。</p><p>举个AtomicReference例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.concurrent.atomic.AtomicReference;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class AtomicReferenceTest {</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public static void main(String[] args){</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 创建两个Person对象，它们的id分别是101和102。</span></span>
<span class="line"><span>        Person p1 = new Person(101);</span></span>
<span class="line"><span>        Person p2 = new Person(102);</span></span>
<span class="line"><span>        // 新建AtomicReference对象，初始化它的值为p1对象</span></span>
<span class="line"><span>        AtomicReference ar = new AtomicReference(p1);</span></span>
<span class="line"><span>        // 通过CAS设置ar。如果ar的值为p1的话，则将其设置为p2。</span></span>
<span class="line"><span>        ar.compareAndSet(p1, p2);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Person p3 = (Person)ar.get();</span></span>
<span class="line"><span>        System.out.println(&quot;p3 is &quot;+p3);</span></span>
<span class="line"><span>        System.out.println(&quot;p3.equals(p1)=&quot;+p3.equals(p1));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Person {</span></span>
<span class="line"><span>    volatile long id;</span></span>
<span class="line"><span>    public Person(long id) {</span></span>
<span class="line"><span>        this.id = id;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public String toString() {</span></span>
<span class="line"><span>        return &quot;id:&quot;+id;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>结果输出：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>p3 is id:102</span></span>
<span class="line"><span>p3.equals(p1)=false</span></span></code></pre></div><p>结果说明：</p><ul><li>新建AtomicReference对象ar时，将它初始化为p1。</li><li>紧接着，通过CAS函数对它进行设置。如果ar的值为p1的话，则将其设置为p2。</li><li>最后，获取ar对应的对象，并打印结果。p3.equals(p1)的结果为false，这是因为Person并没有覆盖equals()方法，而是采用继承自Object.java的equals()方法；而Object.java中的equals()实际上是调用&quot;==&quot;去比较两个对象，即比较两个对象的地址是否相等。</li></ul><h3 id="原子更新字段类" tabindex="-1">原子更新字段类 <a class="header-anchor" href="#原子更新字段类" aria-label="Permalink to &quot;原子更新字段类&quot;">​</a></h3><p>Atomic包提供了四个类进行原子字段更新：</p><ul><li>AtomicIntegerFieldUpdater: 原子更新整型的字段的更新器。</li><li>AtomicLongFieldUpdater: 原子更新长整型字段的更新器。</li><li>AtomicReferenceFieldUpdater: 上面已经说过此处不在赘述。</li></ul><p>这四个类的使用方式都差不多，是基于反射的原子更新字段的值。要想原子地更新字段类需要两步:</p><ul><li>第一步，因为原子更新字段类都是抽象类，每次使用的时候必须使用静态方法newUpdater()创建一个更新器，并且需要设置想要更新的类和属性。</li><li>第二步，更新类的字段必须使用public volatile修饰。</li></ul><p>举个例子：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class TestAtomicIntegerFieldUpdater {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args){</span></span>
<span class="line"><span>        TestAtomicIntegerFieldUpdater tIA = new TestAtomicIntegerFieldUpdater();</span></span>
<span class="line"><span>        tIA.doIt();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public AtomicIntegerFieldUpdater&lt;DataDemo&gt; updater(String name){</span></span>
<span class="line"><span>        return AtomicIntegerFieldUpdater.newUpdater(DataDemo.class,name);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void doIt(){</span></span>
<span class="line"><span>        DataDemo data = new DataDemo();</span></span>
<span class="line"><span>        System.out.println(&quot;publicVar = &quot;+updater(&quot;publicVar&quot;).getAndAdd(data, 2));</span></span>
<span class="line"><span>        /*</span></span>
<span class="line"><span>            * 由于在DataDemo类中属性value2/value3,在TestAtomicIntegerFieldUpdater中不能访问</span></span>
<span class="line"><span>            * */</span></span>
<span class="line"><span>        //System.out.println(&quot;protectedVar = &quot;+updater(&quot;protectedVar&quot;).getAndAdd(data,2));</span></span>
<span class="line"><span>        //System.out.println(&quot;privateVar = &quot;+updater(&quot;privateVar&quot;).getAndAdd(data,2));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        //System.out.println(&quot;staticVar = &quot;+updater(&quot;staticVar&quot;).getAndIncrement(data));//报java.lang.IllegalArgumentException</span></span>
<span class="line"><span>        /*</span></span>
<span class="line"><span>            * 下面报异常：must be integer</span></span>
<span class="line"><span>            * */</span></span>
<span class="line"><span>        //System.out.println(&quot;integerVar = &quot;+updater(&quot;integerVar&quot;).getAndIncrement(data));</span></span>
<span class="line"><span>        //System.out.println(&quot;longVar = &quot;+updater(&quot;longVar&quot;).getAndIncrement(data));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class DataDemo{</span></span>
<span class="line"><span>    public volatile int publicVar=3;</span></span>
<span class="line"><span>    protected volatile int protectedVar=4;</span></span>
<span class="line"><span>    private volatile  int privateVar=5;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public volatile static int staticVar = 10;</span></span>
<span class="line"><span>    //public  final int finalVar = 11;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public volatile Integer integerVar = 19;</span></span>
<span class="line"><span>    public volatile Long longVar = 18L;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>再说下对于AtomicIntegerFieldUpdater 的使用稍微有一些限制和约束，约束如下：</p><ul><li><p>字段必须是volatile类型的，在线程之间共享变量时保证立即可见.eg:volatile int value = 3</p></li><li><p>字段的描述类型(修饰符public/protected/default/private)是与调用者与操作对象字段的关系一致。也就是说调用者能够直接操作对象字段，那么就可以反射进行原子操作。但是对于父类的字段，子类是不能直接操作的，尽管子类可以访问父类的字段。</p></li><li><p>只能是实例变量，不能是类变量，也就是说不能加static关键字。</p></li><li><p>只能是可修改变量，不能使final变量，因为final的语义就是不可修改。实际上final的语义和volatile是有冲突的，这两个关键字不能同时存在。</p></li><li><p>对于AtomicIntegerFieldUpdater和AtomicLongFieldUpdater只能修改int/long类型的字段，不能修改其包装类型(Integer/Long)。如果要修改包装类型就需要使用AtomicReferenceFieldUpdater。</p></li></ul><h2 id="再讲讲atomicstampedreference解决cas的aba问题" tabindex="-1">再讲讲AtomicStampedReference解决CAS的ABA问题 <a class="header-anchor" href="#再讲讲atomicstampedreference解决cas的aba问题" aria-label="Permalink to &quot;再讲讲AtomicStampedReference解决CAS的ABA问题&quot;">​</a></h2><h3 id="atomicstampedreference解决aba问题" tabindex="-1">AtomicStampedReference解决ABA问题 <a class="header-anchor" href="#atomicstampedreference解决aba问题" aria-label="Permalink to &quot;AtomicStampedReference解决ABA问题&quot;">​</a></h3><p>AtomicStampedReference主要维护包含一个对象引用以及一个可以自动更新的整数&quot;stamp&quot;的pair对象来解决ABA问题。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class AtomicStampedReference&lt;V&gt; {</span></span>
<span class="line"><span>    private static class Pair&lt;T&gt; {</span></span>
<span class="line"><span>        final T reference;  //维护对象引用</span></span>
<span class="line"><span>        final int stamp;  //用于标志版本</span></span>
<span class="line"><span>        private Pair(T reference, int stamp) {</span></span>
<span class="line"><span>            this.reference = reference;</span></span>
<span class="line"><span>            this.stamp = stamp;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        static &lt;T&gt; Pair&lt;T&gt; of(T reference, int stamp) {</span></span>
<span class="line"><span>            return new Pair&lt;T&gt;(reference, stamp);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    private volatile Pair&lt;V&gt; pair;</span></span>
<span class="line"><span>    ....</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>      * expectedReference ：更新之前的原始值</span></span>
<span class="line"><span>      * newReference : 将要更新的新值</span></span>
<span class="line"><span>      * expectedStamp : 期待更新的标志版本</span></span>
<span class="line"><span>      * newStamp : 将要更新的标志版本</span></span>
<span class="line"><span>      */</span></span>
<span class="line"><span>    public boolean compareAndSet(V   expectedReference,</span></span>
<span class="line"><span>                             V   newReference,</span></span>
<span class="line"><span>                             int expectedStamp,</span></span>
<span class="line"><span>                             int newStamp) {</span></span>
<span class="line"><span>        // 获取当前的(元素值，版本号)对</span></span>
<span class="line"><span>        Pair&lt;V&gt; current = pair;</span></span>
<span class="line"><span>        return</span></span>
<span class="line"><span>            // 引用没变</span></span>
<span class="line"><span>            expectedReference == current.reference &amp;&amp;</span></span>
<span class="line"><span>            // 版本号没变</span></span>
<span class="line"><span>            expectedStamp == current.stamp &amp;&amp;</span></span>
<span class="line"><span>            // 新引用等于旧引用</span></span>
<span class="line"><span>            ((newReference == current.reference &amp;&amp;</span></span>
<span class="line"><span>            // 新版本号等于旧版本号</span></span>
<span class="line"><span>            newStamp == current.stamp) ||</span></span>
<span class="line"><span>            // 构造新的Pair对象并CAS更新</span></span>
<span class="line"><span>            casPair(current, Pair.of(newReference, newStamp)));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private boolean casPair(Pair&lt;V&gt; cmp, Pair&lt;V&gt; val) {</span></span>
<span class="line"><span>        // 调用Unsafe的compareAndSwapObject()方法CAS更新pair的引用为新引用</span></span>
<span class="line"><span>        return UNSAFE.compareAndSwapObject(this, pairOffset, cmp, val);</span></span>
<span class="line"><span>    }</span></span></code></pre></div><ul><li><p>如果元素值和版本号都没有变化，并且和新的也相同，返回true；</p></li><li><p>如果元素值和版本号都没有变化，并且和新的不完全相同，就构造一个新的Pair对象并执行CAS更新pair。</p></li></ul><p>可以看到，java中的实现跟我们上面讲的ABA的解决方法是一致的。</p><ul><li><p>首先，使用版本号控制；</p></li><li><p>其次，不重复使用节点(Pair)的引用，每次都新建一个新的Pair来作为CAS比较的对象，而不是复用旧的；</p></li><li><p>最后，外部传入元素值及版本号，而不是节点(Pair)的引用。</p></li></ul><h3 id="使用举例-1" tabindex="-1">使用举例 <a class="header-anchor" href="#使用举例-1" aria-label="Permalink to &quot;使用举例&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class AtomicTester {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static AtomicStampedReference&lt;Integer&gt; atomicStampedRef =</span></span>
<span class="line"><span>            new AtomicStampedReference&lt;&gt;(1, 0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args){</span></span>
<span class="line"><span>        first().start();</span></span>
<span class="line"><span>        second().start();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static Thread first() {</span></span>
<span class="line"><span>        return new Thread(() -&gt; {</span></span>
<span class="line"><span>            System.out.println(&quot;操作线程&quot; + Thread.currentThread() +&quot;,初始值 a = &quot; + atomicStampedRef.getReference());</span></span>
<span class="line"><span>            int stamp = atomicStampedRef.getStamp(); //获取当前标识别</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                Thread.sleep(1000); //等待1秒 ，以便让干扰线程执行</span></span>
<span class="line"><span>            } catch (InterruptedException e) {</span></span>
<span class="line"><span>                e.printStackTrace();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            boolean isCASSuccess = atomicStampedRef.compareAndSet(1,2,stamp,stamp +1);  //此时expectedReference未发生改变，但是stamp已经被修改了,所以CAS失败</span></span>
<span class="line"><span>            System.out.println(&quot;操作线程&quot; + Thread.currentThread() +&quot;,CAS操作结果: &quot; + isCASSuccess);</span></span>
<span class="line"><span>        },&quot;主操作线程&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static Thread second() {</span></span>
<span class="line"><span>        return new Thread(() -&gt; {</span></span>
<span class="line"><span>            Thread.yield(); // 确保thread-first 优先执行</span></span>
<span class="line"><span>            atomicStampedRef.compareAndSet(1,2,atomicStampedRef.getStamp(),atomicStampedRef.getStamp() +1);</span></span>
<span class="line"><span>            System.out.println(&quot;操作线程&quot; + Thread.currentThread() +&quot;,【increment】 ,值 = &quot;+ atomicStampedRef.getReference());</span></span>
<span class="line"><span>            atomicStampedRef.compareAndSet(2,1,atomicStampedRef.getStamp(),atomicStampedRef.getStamp() +1);</span></span>
<span class="line"><span>            System.out.println(&quot;操作线程&quot; + Thread.currentThread() +&quot;,【decrement】 ,值 = &quot;+ atomicStampedRef.getReference());</span></span>
<span class="line"><span>        },&quot;干扰线程&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>输出结果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>操作线程Thread[主操作线程,5,main],初始值 a = 1</span></span>
<span class="line"><span>操作线程Thread[干扰线程,5,main],【increment】 ,值 = 2</span></span>
<span class="line"><span>操作线程Thread[干扰线程,5,main],【decrement】 ,值 = 1</span></span>
<span class="line"><span>操作线程Thread[主操作线程,5,main],CAS操作结果: false</span></span></code></pre></div><h3 id="java中还有哪些类可以解决aba的问题" tabindex="-1">java中还有哪些类可以解决ABA的问题? <a class="header-anchor" href="#java中还有哪些类可以解决aba的问题" aria-label="Permalink to &quot;java中还有哪些类可以解决ABA的问题?&quot;">​</a></h3><p>AtomicMarkableReference，它不是维护一个版本号，而是维护一个boolean类型的标记，标记值有修改，了解一下。</p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li><a href="https://benjaminwhx.com/2018/05/03/%E3%80%90%E7%BB%86%E8%B0%88Java%E5%B9%B6%E5%8F%91%E3%80%91%E8%B0%88%E8%B0%88CAS/" target="_blank" rel="noreferrer">https://benjaminwhx.com/2018/05/03/【细谈Java并发】谈谈CAS/</a></li><li><a href="https://www.jianshu.com/p/9a1e6940987a" target="_blank" rel="noreferrer">https://www.jianshu.com/p/9a1e6940987a</a></li><li><a href="https://www.jianshu.com/p/a533cbb740c6" target="_blank" rel="noreferrer">https://www.jianshu.com/p/a533cbb740c6</a></li><li><a href="https://blog.csdn.net/qq%5C_36236890/article/details/81914871" target="_blank" rel="noreferrer">https://blog.csdn.net/qq\\_36236890/article/details/81914871</a></li><li><a href="https://www.cnblogs.com/lodor/p/7492805.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/lodor/p/7492805.html</a></li><li><a href="https://blog.csdn.net/u010412719/article/details/52068888" target="_blank" rel="noreferrer">https://blog.csdn.net/u010412719/article/details/52068888</a></li><li><a href="https://www.jianshu.com/p/18dfc5fa0171" target="_blank" rel="noreferrer">https://www.jianshu.com/p/18dfc5fa0171</a></li><li><a href="https://www.jianshu.com/p/8b227a8adbc1" target="_blank" rel="noreferrer">https://www.jianshu.com/p/8b227a8adbc1</a></li><li><a href="https://www.jianshu.com/p/77f75b398be9" target="_blank" rel="noreferrer">https://www.jianshu.com/p/77f75b398be9</a></li><li><a href="https://tech.meituan.com/2019/02/14/talk-about-java-magic-class-unsafe.html" target="_blank" rel="noreferrer">https://tech.meituan.com/2019/02/14/talk-about-java-magic-class-unsafe.html</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,130)]))}const b=s(t,[["render",i]]);export{g as __pageData,b as default};
