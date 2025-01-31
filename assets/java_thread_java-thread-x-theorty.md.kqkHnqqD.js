import{_ as s}from"./chunks/java-jmm-3.pQLEJ6-a.js";import{_ as n,c as e,ai as p,o as l}from"./chunks/framework.BrYByd3F.js";const t="/vitepress-blog-template/images/pics/single-thread-rule.png",i="/vitepress-blog-template/images/pics/monitor-lock-rule.png",c="/vitepress-blog-template/images/pics/volatile-variable-rule.png",r="/vitepress-blog-template/images/pics/thread-start-rule.png",o="/vitepress-blog-template/images/pics/thread-join-rule.png",d="/vitepress-blog-template/images/pics/3646544a-cb57-451d-9e03-d3c4f5e4434a.png",C=JSON.parse('{"title":"Java 并发 - 理论基础","description":"","frontmatter":{},"headers":[],"relativePath":"java/thread/java-thread-x-theorty.md","filePath":"java/thread/java-thread-x-theorty.md","lastUpdated":1737706346000}'),h={name:"java/thread/java-thread-x-theorty.md"};function u(v,a,g,b,m,k){return l(),e("div",null,a[0]||(a[0]=[p(`<h1 id="java-并发-理论基础" tabindex="-1">Java 并发 - 理论基础 <a class="header-anchor" href="#java-并发-理论基础" aria-label="Permalink to &quot;Java 并发 - 理论基础&quot;">​</a></h1><blockquote><p>本文从理论的角度引入并发安全问题以及JMM应对并发问题的原理。@pdai</p></blockquote><h2 id="带着bat大厂的面试问题去理解" tabindex="-1">带着BAT大厂的面试问题去理解 <a class="header-anchor" href="#带着bat大厂的面试问题去理解" aria-label="Permalink to &quot;带着BAT大厂的面试问题去理解&quot;">​</a></h2><p>提示</p><p>请带着这些问题继续后文，会很大程度上帮助你更好的理解并发理论基础。@pdai</p><ul><li>多线程的出现是要解决什么问题的?</li><li>线程不安全是指什么? 举例说明</li><li>并发出现线程不安全的本质什么? 可见性，原子性和有序性。</li><li>Java是怎么解决并发问题的? 3个关键字，JMM和8个Happens-Before</li><li>线程安全是不是非真即假? 不是</li><li>线程安全有哪些实现思路?</li><li>如何理解并发和并行的区别?</li></ul><h2 id="为什么需要多线程" tabindex="-1">为什么需要多线程 <a class="header-anchor" href="#为什么需要多线程" aria-label="Permalink to &quot;为什么需要多线程&quot;">​</a></h2><p>众所周知，CPU、内存、I/O 设备的速度是有极大差异的，为了合理利用 CPU 的高性能，平衡这三者的速度差异，计算机体系结构、操作系统、编译程序都做出了贡献，主要体现为:</p><ul><li>CPU 增加了缓存，以均衡与内存的速度差异；// 导致 <code>可见性</code>问题</li><li>操作系统增加了进程、线程，以分时复用 CPU，进而均衡 CPU 与 I/O 设备的速度差异；// 导致 <code>原子性</code>问题</li><li>编译程序优化指令执行次序，使得缓存能够得到更加合理地利用。// 导致 <code>有序性</code>问题</li></ul><h2 id="线程不安全示例" tabindex="-1">线程不安全示例 <a class="header-anchor" href="#线程不安全示例" aria-label="Permalink to &quot;线程不安全示例&quot;">​</a></h2><p>如果多个线程对同一个共享数据进行访问而不采取同步操作的话，那么操作的结果是不一致的。</p><p>以下代码演示了 1000 个线程同时对 cnt 执行自增操作，操作结束之后它的值有可能小于 1000。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ThreadUnsafeExample {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private int cnt = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void add() {</span></span>
<span class="line"><span>        cnt++;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int get() {</span></span>
<span class="line"><span>        return cnt;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) throws InterruptedException {</span></span>
<span class="line"><span>    final int threadSize = 1000;</span></span>
<span class="line"><span>    ThreadUnsafeExample example = new ThreadUnsafeExample();</span></span>
<span class="line"><span>    final CountDownLatch countDownLatch = new CountDownLatch(threadSize);</span></span>
<span class="line"><span>    ExecutorService executorService = Executors.newCachedThreadPool();</span></span>
<span class="line"><span>    for (int i = 0; i &lt; threadSize; i++) {</span></span>
<span class="line"><span>        executorService.execute(() -&gt; {</span></span>
<span class="line"><span>            example.add();</span></span>
<span class="line"><span>            countDownLatch.countDown();</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    countDownLatch.await();</span></span>
<span class="line"><span>    executorService.shutdown();</span></span>
<span class="line"><span>    System.out.println(example.get());</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>997 // 结果总是小于1000</span></span></code></pre></div><h2 id="并发出现问题的根源-并发三要素" tabindex="-1">并发出现问题的根源: 并发三要素 <a class="header-anchor" href="#并发出现问题的根源-并发三要素" aria-label="Permalink to &quot;并发出现问题的根源: 并发三要素&quot;">​</a></h2><p>上述代码输出为什么不是1000? 并发出现问题的根源是什么?</p><h3 id="可见性-cpu缓存引起" tabindex="-1">可见性: CPU缓存引起 <a class="header-anchor" href="#可见性-cpu缓存引起" aria-label="Permalink to &quot;可见性: CPU缓存引起&quot;">​</a></h3><p>可见性：一个线程对共享变量的修改，另外一个线程能够立刻看到。</p><p>举个简单的例子，看下面这段代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//线程1执行的代码</span></span>
<span class="line"><span>int i = 0;</span></span>
<span class="line"><span>i = 10;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>//线程2执行的代码</span></span>
<span class="line"><span>j = i;</span></span></code></pre></div><p>假若执行线程1的是CPU1，执行线程2的是CPU2。由上面的分析可知，当线程1执行 i =10这句时，会先把i的初始值加载到CPU1的高速缓存中，然后赋值为10，那么在CPU1的高速缓存当中i的值变为10了，却没有立即写入到主存当中。</p><p>此时线程2执行 j = i，它会先去主存读取i的值并加载到CPU2的缓存当中，注意此时内存当中i的值还是0，那么就会使得j的值为0，而不是10.</p><p>这就是可见性问题，线程1对变量i修改了之后，线程2没有立即看到线程1修改的值。</p><h3 id="原子性-分时复用引起" tabindex="-1">原子性: 分时复用引起 <a class="header-anchor" href="#原子性-分时复用引起" aria-label="Permalink to &quot;原子性: 分时复用引起&quot;">​</a></h3><p>原子性：即一个操作或者多个操作 要么全部执行并且执行的过程不会被任何因素打断，要么就都不执行。</p><p>举个简单的例子，看下面这段代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int i = 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 线程1执行</span></span>
<span class="line"><span>i += 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 线程2执行</span></span>
<span class="line"><span>i += 1;</span></span></code></pre></div><p>这里需要注意的是：<code>i += 1</code>需要三条 CPU 指令</p><ol><li>将变量 i 从内存读取到 CPU寄存器；</li><li>在CPU寄存器中执行 i + 1 操作；</li><li>将最后的结果i写入内存（缓存机制导致可能写入的是 CPU 缓存而不是内存）。</li></ol><p>由于CPU分时复用（线程切换）的存在，线程1执行了第一条指令后，就切换到线程2执行，假如线程2执行了这三条指令后，再切换会线程1执行后续两条指令，将造成最后写到内存中的i值是2而不是3。</p><h3 id="有序性-重排序引起" tabindex="-1">有序性: 重排序引起 <a class="header-anchor" href="#有序性-重排序引起" aria-label="Permalink to &quot;有序性: 重排序引起&quot;">​</a></h3><p>有序性：即程序执行的顺序按照代码的先后顺序执行。举个简单的例子，看下面这段代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int i = 0;              </span></span>
<span class="line"><span>boolean flag = false;</span></span>
<span class="line"><span>i = 1;                //语句1  </span></span>
<span class="line"><span>flag = true;          //语句2</span></span></code></pre></div><p>上面代码定义了一个int型变量，定义了一个boolean类型变量，然后分别对两个变量进行赋值操作。从代码顺序上看，语句1是在语句2前面的，那么JVM在真正执行这段代码的时候会保证语句1一定会在语句2前面执行吗? 不一定，为什么呢? 这里可能会发生指令重排序（Instruction Reorder）。</p><p>在执行程序时为了提高性能，编译器和处理器常常会对指令做重排序。重排序分三种类型：</p><ul><li>编译器优化的重排序。编译器在不改变单线程程序语义的前提下，可以重新安排语句的执行顺序。</li><li>指令级并行的重排序。现代处理器采用了指令级并行技术（Instruction-Level Parallelism， ILP）来将多条指令重叠执行。如果不存在数据依赖性，处理器可以改变语句对应机器指令的执行顺序。</li><li>内存系统的重排序。由于处理器使用缓存和读 / 写缓冲区，这使得加载和存储操作看上去可能是在乱序执行。</li></ul><p>从 java 源代码到最终实际执行的指令序列，会分别经历下面三种重排序：</p><p><img src="`+s+`" alt="error.图片加载失败"></p><p>上述的 1 属于编译器重排序，2 和 3 属于处理器重排序。这些重排序都可能会导致多线程程序出现内存可见性问题。对于编译器，JMM 的编译器重排序规则会禁止特定类型的编译器重排序（不是所有的编译器重排序都要禁止）。对于处理器重排序，JMM 的处理器重排序规则会要求 java 编译器在生成指令序列时，插入特定类型的内存屏障（memory barriers，intel 称之为 memory fence）指令，通过内存屏障指令来禁止特定类型的处理器重排序（不是所有的处理器重排序都要禁止）。</p><p>具体可以参看：<a href="https://pdai.tech/md/java/jvm/java-jvm-jmm.html" target="_blank" rel="noreferrer">Java 内存模型详解</a>的重排序章节。</p><h2 id="java是怎么解决并发问题的-jmm-java内存模型" tabindex="-1">JAVA是怎么解决并发问题的: JMM(Java内存模型) <a class="header-anchor" href="#java是怎么解决并发问题的-jmm-java内存模型" aria-label="Permalink to &quot;JAVA是怎么解决并发问题的: JMM(Java内存模型)&quot;">​</a></h2><p>Java 内存模型是个很复杂的规范，强烈推荐你看后续（应该是网上能找到最好的材料之一了）：<a href="https://pdai.tech/md/java/jvm/java-jvm-jmm.html" target="_blank" rel="noreferrer">Java 内存模型详解</a>。</p><p><strong>理解的第一个维度：核心知识点</strong></p><p>JMM本质上可以理解为，Java 内存模型规范了 JVM 如何提供按需禁用缓存和编译优化的方法。具体来说，这些方法包括：</p><ul><li>volatile、synchronized 和 final 三个关键字</li><li>Happens-Before 规则</li></ul><p><strong>理解的第二个维度：可见性，有序性，原子性</strong></p><ul><li>原子性</li></ul><p>在Java中，对基本数据类型的变量的读取和赋值操作是原子性操作，即这些操作是不可被中断的，要么执行，要么不执行。 请分析以下哪些操作是原子性操作：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>x = 10;        //语句1: 直接将数值10赋值给x，也就是说线程执行这个语句的会直接将数值10写入到工作内存中</span></span>
<span class="line"><span>y = x;         //语句2: 包含2个操作，它先要去读取x的值，再将x的值写入工作内存，虽然读取x的值以及 将x的值写入工作内存 这2个操作都是原子性操作，但是合起来就不是原子性操作了。</span></span>
<span class="line"><span>x++;           //语句3： x++包括3个操作：读取x的值，进行加1操作，写入新的值。</span></span>
<span class="line"><span>x = x + 1;     //语句4： 同语句3</span></span></code></pre></div><p>上面4个语句只有语句1的操作具备原子性。</p><p>也就是说，只有简单的读取、赋值（而且必须是将数字赋值给某个变量，变量之间的相互赋值不是原子操作）才是原子操作。</p><blockquote><p>从上面可以看出，Java内存模型只保证了基本读取和赋值是原子性操作，如果要实现更大范围操作的原子性，可以通过synchronized和Lock来实现。由于synchronized和Lock能够保证任一时刻只有一个线程执行该代码块，那么自然就不存在原子性问题了，从而保证了原子性。</p></blockquote><ul><li>可见性</li></ul><p>Java提供了volatile关键字来保证可见性。</p><p>当一个共享变量被volatile修饰时，它会保证修改的值会立即被更新到主存，当有其他线程需要读取时，它会去内存中读取新值。</p><p>而普通的共享变量不能保证可见性，因为普通共享变量被修改之后，什么时候被写入主存是不确定的，当其他线程去读取时，此时内存中可能还是原来的旧值，因此无法保证可见性。</p><blockquote><p>另外，通过synchronized和Lock也能够保证可见性，synchronized和Lock能保证同一时刻只有一个线程获取锁然后执行同步代码，并且在释放锁之前会将对变量的修改刷新到主存当中。因此可以保证可见性。</p></blockquote><ul><li>有序性</li></ul><p>在Java里面，可以通过volatile关键字来保证一定的“有序性”（具体原理在下一节讲述）。另外可以通过synchronized和Lock来保证有序性，很显然，synchronized和Lock保证每个时刻是有一个线程执行同步代码，相当于是让线程顺序执行同步代码，自然就保证了有序性。当然JMM是通过Happens-Before 规则来保证有序性的。</p><h3 id="关键字-volatile、synchronized-和-final" tabindex="-1">关键字: volatile、synchronized 和 final <a class="header-anchor" href="#关键字-volatile、synchronized-和-final" aria-label="Permalink to &quot;关键字: volatile、synchronized 和 final&quot;">​</a></h3><p>以下三篇文章详细分析了这三个关键字：</p><ul><li><a href="https://pdai.tech/md/java/thread/java-thread-x-key-synchronized.html" target="_blank" rel="noreferrer">关键字: synchronized详解</a></li><li><a href="https://pdai.tech/md/java/thread/java-thread-x-key-volatile.html" target="_blank" rel="noreferrer">关键字: volatile详解</a></li><li><a href="https://pdai.tech/md/java/thread/java-thread-x-key-final.html" target="_blank" rel="noreferrer">关键字: final详解</a></li></ul><h3 id="happens-before-规则" tabindex="-1">Happens-Before 规则 <a class="header-anchor" href="#happens-before-规则" aria-label="Permalink to &quot;Happens-Before 规则&quot;">​</a></h3><p>上面提到了可以用 volatile 和 synchronized 来保证有序性。除此之外，JVM 还规定了先行发生原则，让一个操作无需控制就能先于另一个操作完成。</p><h4 id="_1-单一线程原则" tabindex="-1">1. 单一线程原则 <a class="header-anchor" href="#_1-单一线程原则" aria-label="Permalink to &quot;1\\. 单一线程原则&quot;">​</a></h4><blockquote><p>Single Thread rule</p></blockquote><p>在一个线程内，在程序前面的操作先行发生于后面的操作。</p><p><img src="`+t+'" alt="image"></p><h4 id="_2-管程锁定规则" tabindex="-1">2. 管程锁定规则 <a class="header-anchor" href="#_2-管程锁定规则" aria-label="Permalink to &quot;2\\. 管程锁定规则&quot;">​</a></h4><blockquote><p>Monitor Lock Rule</p></blockquote><p>一个 unlock 操作先行发生于后面对同一个锁的 lock 操作。</p><p><img src="'+i+'" alt="image"></p><h4 id="_3-volatile-变量规则" tabindex="-1">3. volatile 变量规则 <a class="header-anchor" href="#_3-volatile-变量规则" aria-label="Permalink to &quot;3\\. volatile 变量规则&quot;">​</a></h4><blockquote><p>Volatile Variable Rule</p></blockquote><p>对一个 volatile 变量的写操作先行发生于后面对这个变量的读操作。</p><p><img src="'+c+'" alt="image"></p><h4 id="_4-线程启动规则" tabindex="-1">4. 线程启动规则 <a class="header-anchor" href="#_4-线程启动规则" aria-label="Permalink to &quot;4\\. 线程启动规则&quot;">​</a></h4><blockquote><p>Thread Start Rule</p></blockquote><p>Thread 对象的 start() 方法调用先行发生于此线程的每一个动作。</p><p><img src="'+r+'" alt="image"></p><h4 id="_5-线程加入规则" tabindex="-1">5. 线程加入规则 <a class="header-anchor" href="#_5-线程加入规则" aria-label="Permalink to &quot;5\\. 线程加入规则&quot;">​</a></h4><blockquote><p>Thread Join Rule</p></blockquote><p>Thread 对象的结束先行发生于 join() 方法返回。</p><p><img src="'+o+`" alt="image"></p><h4 id="_6-线程中断规则" tabindex="-1">6. 线程中断规则 <a class="header-anchor" href="#_6-线程中断规则" aria-label="Permalink to &quot;6\\. 线程中断规则&quot;">​</a></h4><blockquote><p>Thread Interruption Rule</p></blockquote><p>对线程 interrupt() 方法的调用先行发生于被中断线程的代码检测到中断事件的发生，可以通过 interrupted() 方法检测到是否有中断发生。</p><h4 id="_7-对象终结规则" tabindex="-1">7. 对象终结规则 <a class="header-anchor" href="#_7-对象终结规则" aria-label="Permalink to &quot;7\\. 对象终结规则&quot;">​</a></h4><blockquote><p>Finalizer Rule</p></blockquote><p>一个对象的初始化完成(构造函数执行结束)先行发生于它的 finalize() 方法的开始。</p><h4 id="_8-传递性" tabindex="-1">8. 传递性 <a class="header-anchor" href="#_8-传递性" aria-label="Permalink to &quot;8\\. 传递性&quot;">​</a></h4><blockquote><p>Transitivity</p></blockquote><p>如果操作 A 先行发生于操作 B，操作 B 先行发生于操作 C，那么操作 A 先行发生于操作 C。</p><h2 id="线程安全-不是一个非真即假的命题" tabindex="-1">线程安全: 不是一个非真即假的命题 <a class="header-anchor" href="#线程安全-不是一个非真即假的命题" aria-label="Permalink to &quot;线程安全: 不是一个非真即假的命题&quot;">​</a></h2><p>一个类在可以被多个线程安全调用时就是线程安全的。</p><p>线程安全不是一个非真即假的命题，可以将共享数据按照安全程度的强弱顺序分成以下五类: 不可变、绝对线程安全、相对线程安全、线程兼容和线程对立。</p><h3 id="_1-不可变" tabindex="-1">1. 不可变 <a class="header-anchor" href="#_1-不可变" aria-label="Permalink to &quot;1\\. 不可变&quot;">​</a></h3><p>不可变(Immutable)的对象一定是线程安全的，不需要再采取任何的线程安全保障措施。只要一个不可变的对象被正确地构建出来，永远也不会看到它在多个线程之中处于不一致的状态。</p><p>多线程环境下，应当尽量使对象成为不可变，来满足线程安全。</p><p>不可变的类型:</p><ul><li>final 关键字修饰的基本数据类型</li><li>String</li><li>枚举类型</li><li>Number 部分子类，如 Long 和 Double 等数值包装类型，BigInteger 和 BigDecimal 等大数据类型。但同为 Number 的原子类 AtomicInteger 和 AtomicLong 则是可变的。</li></ul><p>对于集合类型，可以使用 Collections.unmodifiableXXX() 方法来获取一个不可变的集合。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ImmutableExample {</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        Map&lt;String, Integer&gt; map = new HashMap&lt;&gt;();</span></span>
<span class="line"><span>        Map&lt;String, Integer&gt; unmodifiableMap = Collections.unmodifiableMap(map);</span></span>
<span class="line"><span>        unmodifiableMap.put(&quot;a&quot;, 1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Exception in thread &quot;main&quot; java.lang.UnsupportedOperationException</span></span>
<span class="line"><span>    at java.util.Collections$UnmodifiableMap.put(Collections.java:1457)</span></span>
<span class="line"><span>    at ImmutableExample.main(ImmutableExample.java:9)</span></span></code></pre></div><p>Collections.unmodifiableXXX() 先对原始的集合进行拷贝，需要对集合进行修改的方法都直接抛出异常。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public V put(K key, V value) {</span></span>
<span class="line"><span>    throw new UnsupportedOperationException();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="_2-绝对线程安全" tabindex="-1">2. 绝对线程安全 <a class="header-anchor" href="#_2-绝对线程安全" aria-label="Permalink to &quot;2\\. 绝对线程安全&quot;">​</a></h3><p>不管运行时环境如何，调用者都不需要任何额外的同步措施。</p><h3 id="_3-相对线程安全" tabindex="-1">3. 相对线程安全 <a class="header-anchor" href="#_3-相对线程安全" aria-label="Permalink to &quot;3\\. 相对线程安全&quot;">​</a></h3><p>相对线程安全需要保证对这个对象单独的操作是线程安全的，在调用的时候不需要做额外的保障措施。但是对于一些特定顺序的连续调用，就可能需要在调用端使用额外的同步手段来保证调用的正确性。</p><p>在 Java 语言中，大部分的线程安全类都属于这种类型，例如 Vector、HashTable、Collections 的 synchronizedCollection() 方法包装的集合等。</p><p>对于下面的代码，如果删除元素的线程删除了 Vector 的一个元素，而获取元素的线程试图访问一个已经被删除的元素，那么就会抛出 ArrayIndexOutOfBoundsException。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class VectorUnsafeExample {</span></span>
<span class="line"><span>    private static Vector&lt;Integer&gt; vector = new Vector&lt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        while (true) {</span></span>
<span class="line"><span>            for (int i = 0; i &lt; 100; i++) {</span></span>
<span class="line"><span>                vector.add(i);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            ExecutorService executorService = Executors.newCachedThreadPool();</span></span>
<span class="line"><span>            executorService.execute(() -&gt; {</span></span>
<span class="line"><span>                for (int i = 0; i &lt; vector.size(); i++) {</span></span>
<span class="line"><span>                    vector.remove(i);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            });</span></span>
<span class="line"><span>            executorService.execute(() -&gt; {</span></span>
<span class="line"><span>                for (int i = 0; i &lt; vector.size(); i++) {</span></span>
<span class="line"><span>                    vector.get(i);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            });</span></span>
<span class="line"><span>            executorService.shutdown();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Exception in thread &quot;Thread-159738&quot; java.lang.ArrayIndexOutOfBoundsException: Array index out of range: 3</span></span>
<span class="line"><span>    at java.util.Vector.remove(Vector.java:831)</span></span>
<span class="line"><span>    at VectorUnsafeExample.lambda$main$0(VectorUnsafeExample.java:14)</span></span>
<span class="line"><span>    at VectorUnsafeExample$$Lambda$1/713338599.run(Unknown Source)</span></span>
<span class="line"><span>    at java.lang.Thread.run(Thread.java:745)</span></span></code></pre></div><p>如果要保证上面的代码能正确执行下去，就需要对删除元素和获取元素的代码进行同步。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>executorService.execute(() -&gt; {</span></span>
<span class="line"><span>    synchronized (vector) {</span></span>
<span class="line"><span>        for (int i = 0; i &lt; vector.size(); i++) {</span></span>
<span class="line"><span>            vector.remove(i);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span>executorService.execute(() -&gt; {</span></span>
<span class="line"><span>    synchronized (vector) {</span></span>
<span class="line"><span>        for (int i = 0; i &lt; vector.size(); i++) {</span></span>
<span class="line"><span>            vector.get(i);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>});</span></span></code></pre></div><h3 id="_4-线程兼容" tabindex="-1">4. 线程兼容 <a class="header-anchor" href="#_4-线程兼容" aria-label="Permalink to &quot;4\\. 线程兼容&quot;">​</a></h3><p>线程兼容是指对象本身并不是线程安全的，但是可以通过在调用端正确地使用同步手段来保证对象在并发环境中可以安全地使用，我们平常说一个类不是线程安全的，绝大多数时候指的是这一种情况。Java API 中大部分的类都是属于线程兼容的，如与前面的 Vector 和 HashTable 相对应的集合类 ArrayList 和 HashMap 等。</p><h3 id="_5-线程对立" tabindex="-1">5. 线程对立 <a class="header-anchor" href="#_5-线程对立" aria-label="Permalink to &quot;5\\. 线程对立&quot;">​</a></h3><p>线程对立是指无论调用端是否采取了同步措施，都无法在多线程环境中并发使用的代码。由于 Java 语言天生就具备多线程特性，线程对立这种排斥多线程的代码是很少出现的，而且通常都是有害的，应当尽量避免。</p><h2 id="线程安全的实现方法" tabindex="-1">线程安全的实现方法 <a class="header-anchor" href="#线程安全的实现方法" aria-label="Permalink to &quot;线程安全的实现方法&quot;">​</a></h2><h3 id="_1-互斥同步" tabindex="-1">1. 互斥同步 <a class="header-anchor" href="#_1-互斥同步" aria-label="Permalink to &quot;1\\. 互斥同步&quot;">​</a></h3><p>synchronized 和 ReentrantLock。</p><p>初步了解你可以看：</p><ul><li><a href="https://pdai.tech/md/java/thread/java-thread-x-thread-basic.html#%e7%ba%bf%e7%a8%8b%e4%ba%92%e6%96%a5%e5%90%8c%e6%ad%a5" target="_blank" rel="noreferrer">Java 并发 - 线程基础：线程互斥同步</a></li></ul><p>详细分析请看：</p><ul><li><a href="https://pdai.tech/md/java/thread/java-thread-x-key-synchronized.html" target="_blank" rel="noreferrer">关键字: Synchronized详解</a></li><li><a href="https://pdai.tech/md/java/thread/java-thread-x-lock-ReentrantLock.html" target="_blank" rel="noreferrer">JUC锁: ReentrantLock详解</a></li></ul><h3 id="_2-非阻塞同步" tabindex="-1">2. 非阻塞同步 <a class="header-anchor" href="#_2-非阻塞同步" aria-label="Permalink to &quot;2\\. 非阻塞同步&quot;">​</a></h3><p>互斥同步最主要的问题就是线程阻塞和唤醒所带来的性能问题，因此这种同步也称为阻塞同步。</p><p>互斥同步属于一种悲观的并发策略，总是认为只要不去做正确的同步措施，那就肯定会出现问题。无论共享数据是否真的会出现竞争，它都要进行加锁(这里讨论的是概念模型，实际上虚拟机会优化掉很大一部分不必要的加锁)、用户态核心态转换、维护锁计数器和检查是否有被阻塞的线程需要唤醒等操作。</p><p><strong>(一)CAS</strong></p><p>随着硬件指令集的发展，我们可以使用基于冲突检测的乐观并发策略: 先进行操作，如果没有其它线程争用共享数据，那操作就成功了，否则采取补偿措施(不断地重试，直到成功为止)。这种乐观的并发策略的许多实现都不需要将线程阻塞，因此这种同步操作称为非阻塞同步。</p><p>乐观锁需要操作和冲突检测这两个步骤具备原子性，这里就不能再使用互斥同步来保证了，只能靠硬件来完成。硬件支持的原子性操作最典型的是: 比较并交换(Compare-and-Swap，CAS)。CAS 指令需要有 3 个操作数，分别是内存地址 V、旧的预期值 A 和新值 B。当执行操作时，只有当 V 的值等于 A，才将 V 的值更新为 B。</p><p><strong>(二)AtomicInteger</strong></p><p>J.U.C 包里面的整数原子类 AtomicInteger，其中的 compareAndSet() 和 getAndIncrement() 等方法都使用了 Unsafe 类的 CAS 操作。</p><p>以下代码使用了 AtomicInteger 执行了自增的操作。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private AtomicInteger cnt = new AtomicInteger();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public void add() {</span></span>
<span class="line"><span>    cnt.incrementAndGet();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>以下代码是 incrementAndGet() 的源码，它调用了 unsafe 的 getAndAddInt() 。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final int incrementAndGet() {</span></span>
<span class="line"><span>    return unsafe.getAndAddInt(this, valueOffset, 1) + 1;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>以下代码是 getAndAddInt() 源码，var1 指示对象内存地址，var2 指示该字段相对对象内存地址的偏移，var4 指示操作需要加的数值，这里为 1。通过 getIntVolatile(var1, var2) 得到旧的预期值，通过调用 compareAndSwapInt() 来进行 CAS 比较，如果该字段内存地址中的值等于 var5，那么就更新内存地址为 var1+var2 的变量为 var5+var4。</p><p>可以看到 getAndAddInt() 在一个循环中进行，发生冲突的做法是不断的进行重试。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final int getAndAddInt(Object var1, long var2, int var4) {</span></span>
<span class="line"><span>    int var5;</span></span>
<span class="line"><span>    do {</span></span>
<span class="line"><span>        var5 = this.getIntVolatile(var1, var2);</span></span>
<span class="line"><span>    } while(!this.compareAndSwapInt(var1, var2, var5, var5 + var4));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return var5;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>(三)ABA</strong></p><p>如果一个变量初次读取的时候是 A 值，它的值被改成了 B，后来又被改回为 A，那 CAS 操作就会误认为它从来没有被改变过。</p><p>J.U.C 包提供了一个带有标记的原子引用类 AtomicStampedReference 来解决这个问题，它可以通过控制变量值的版本来保证 CAS 的正确性。大部分情况下 ABA 问题不会影响程序并发的正确性，如果需要解决 ABA 问题，改用传统的互斥同步可能会比原子类更高效。</p><p>CAS, Unsafe和原子类详细分析请看：</p><ul><li><a href="https://pdai.tech/md/java/thread/java-thread-x-juc-AtomicInteger.html" target="_blank" rel="noreferrer">JUC原子类: CAS, Unsafe和原子类详解</a></li></ul><h3 id="_3-无同步方案" tabindex="-1">3. 无同步方案 <a class="header-anchor" href="#_3-无同步方案" aria-label="Permalink to &quot;3\\. 无同步方案&quot;">​</a></h3><p>要保证线程安全，并不是一定就要进行同步。如果一个方法本来就不涉及共享数据，那它自然就无须任何同步措施去保证正确性。</p><p><strong>(一)栈封闭</strong></p><p>多个线程访问同一个方法的局部变量时，不会出现线程安全问题，因为局部变量存储在虚拟机栈中，属于线程私有的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.util.concurrent.ExecutorService;</span></span>
<span class="line"><span>import java.util.concurrent.Executors;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class StackClosedExample {</span></span>
<span class="line"><span>    public void add100() {</span></span>
<span class="line"><span>        int cnt = 0;</span></span>
<span class="line"><span>        for (int i = 0; i &lt; 100; i++) {</span></span>
<span class="line"><span>            cnt++;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        System.out.println(cnt);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) {</span></span>
<span class="line"><span>    StackClosedExample example = new StackClosedExample();</span></span>
<span class="line"><span>    ExecutorService executorService = Executors.newCachedThreadPool();</span></span>
<span class="line"><span>    executorService.execute(() -&gt; example.add100());</span></span>
<span class="line"><span>    executorService.execute(() -&gt; example.add100());</span></span>
<span class="line"><span>    executorService.shutdown();</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>100</span></span>
<span class="line"><span>100</span></span></code></pre></div><p>更详细的分析请看J.U.C中线程池相关内容详解：</p><ul><li><a href="https://pdai.tech/md/java/thread/java-thread-x-juc-executor-FutureTask.html" target="_blank" rel="noreferrer">JUC线程池: FutureTask详解</a></li><li><a href="https://pdai.tech/md/java/thread/java-thread-x-juc-executor-ThreadPoolExecutor.html" target="_blank" rel="noreferrer">JUC线程池: ThreadPoolExecutor详解</a></li><li><a href="https://pdai.tech/md/java/thread/java-thread-x-juc-executor-ScheduledThreadPoolExecutor.html" target="_blank" rel="noreferrer">JUC线程池: ScheduledThreadPool详解</a></li><li><a href="https://pdai.tech/md/java/thread/java-thread-x-juc-executor-ForkJoinPool.html" target="_blank" rel="noreferrer">JUC线程池: Fork/Join框架详解</a></li></ul><p><strong>(二)线程本地存储(Thread Local Storage)</strong></p><p>如果一段代码中所需要的数据必须与其他代码共享，那就看看这些共享数据的代码是否能保证在同一个线程中执行。如果能保证，我们就可以把共享数据的可见范围限制在同一个线程之内，这样，无须同步也能保证线程之间不出现数据争用的问题。</p><p>符合这种特点的应用并不少见，大部分使用消费队列的架构模式(如“生产者-消费者”模式)都会将产品的消费过程尽量在一个线程中消费完。其中最重要的一个应用实例就是经典 Web 交互模型中的“一个请求对应一个服务器线程”(Thread-per-Request)的处理方式，这种处理方式的广泛应用使得很多 Web 服务端应用都可以使用线程本地存储来解决线程安全问题。</p><p>可以使用 java.lang.ThreadLocal 类来实现线程本地存储功能。</p><p>对于以下代码，thread1 中设置 threadLocal 为 1，而 thread2 设置 threadLocal 为 2。过了一段时间之后，thread1 读取 threadLocal 依然是 1，不受 thread2 的影响。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ThreadLocalExample {</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        ThreadLocal threadLocal = new ThreadLocal();</span></span>
<span class="line"><span>        Thread thread1 = new Thread(() -&gt; {</span></span>
<span class="line"><span>            threadLocal.set(1);</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                Thread.sleep(1000);</span></span>
<span class="line"><span>            } catch (InterruptedException e) {</span></span>
<span class="line"><span>                e.printStackTrace();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            System.out.println(threadLocal.get());</span></span>
<span class="line"><span>            threadLocal.remove();</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>        Thread thread2 = new Thread(() -&gt; {</span></span>
<span class="line"><span>            threadLocal.set(2);</span></span>
<span class="line"><span>            threadLocal.remove();</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>        thread1.start();</span></span>
<span class="line"><span>        thread2.start();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>输出结果</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>1</span></span></code></pre></div><p>为了理解 ThreadLocal，先看以下代码:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class ThreadLocalExample1 {</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        ThreadLocal threadLocal1 = new ThreadLocal();</span></span>
<span class="line"><span>        ThreadLocal threadLocal2 = new ThreadLocal();</span></span>
<span class="line"><span>        Thread thread1 = new Thread(() -&gt; {</span></span>
<span class="line"><span>            threadLocal1.set(1);</span></span>
<span class="line"><span>            threadLocal2.set(1);</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>        Thread thread2 = new Thread(() -&gt; {</span></span>
<span class="line"><span>            threadLocal1.set(2);</span></span>
<span class="line"><span>            threadLocal2.set(2);</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>        thread1.start();</span></span>
<span class="line"><span>        thread2.start();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>它所对应的底层结构图为:</p><p><img src="`+d+`" alt="image"></p><p>每个 Thread 都有一个 ThreadLocal.ThreadLocalMap 对象，Thread 类中就定义了 ThreadLocal.ThreadLocalMap 成员。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* ThreadLocal values pertaining to this thread. This map is maintained</span></span>
<span class="line"><span> * by the ThreadLocal class. */</span></span>
<span class="line"><span>ThreadLocal.ThreadLocalMap threadLocals = null;</span></span></code></pre></div><p>当调用一个 ThreadLocal 的 set(T value) 方法时，先得到当前线程的 ThreadLocalMap 对象，然后将 ThreadLocal-&gt;value 键值对插入到该 Map 中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void set(T value) {</span></span>
<span class="line"><span>    Thread t = Thread.currentThread();</span></span>
<span class="line"><span>    ThreadLocalMap map = getMap(t);</span></span>
<span class="line"><span>    if (map != null)</span></span>
<span class="line"><span>        map.set(this, value);</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>        createMap(t, value);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>get() 方法类似。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public T get() {</span></span>
<span class="line"><span>    Thread t = Thread.currentThread();</span></span>
<span class="line"><span>    ThreadLocalMap map = getMap(t);</span></span>
<span class="line"><span>    if (map != null) {</span></span>
<span class="line"><span>        ThreadLocalMap.Entry e = map.getEntry(this);</span></span>
<span class="line"><span>        if (e != null) {</span></span>
<span class="line"><span>            @SuppressWarnings(&quot;unchecked&quot;)</span></span>
<span class="line"><span>            T result = (T)e.value;</span></span>
<span class="line"><span>            return result;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return setInitialValue();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>ThreadLocal 从理论上讲并不是用来解决多线程并发问题的，因为根本不存在多线程竞争。</p><p>在一些场景 (尤其是使用线程池) 下，由于 ThreadLocal.ThreadLocalMap 的底层数据结构导致 ThreadLocal 有内存泄漏的情况，应该尽可能在每次使用 ThreadLocal 后手动调用 remove()，以避免出现 ThreadLocal 经典的内存泄漏甚至是造成自身业务混乱的风险。</p><p>更详细的分析看：<a href="https://pdai.tech/md/java/thread/java-thread-x-threadlocal.html" target="_blank" rel="noreferrer">Java 并发 - ThreadLocal详解</a></p><p><strong>(三)可重入代码(Reentrant Code)</strong></p><p>这种代码也叫做纯代码(Pure Code)，可以在代码执行的任何时刻中断它，转而去执行另外一段代码(包括递归调用它本身)，而在控制权返回后，原来的程序不会出现任何错误。</p><p>可重入代码有一些共同的特征，例如不依赖存储在堆上的数据和公用的系统资源、用到的状态量都由参数中传入、不调用非可重入的方法等。</p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,182)]))}const y=n(h,[["render",u]]);export{C as __pageData,y as default};
