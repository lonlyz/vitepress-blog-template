import{_ as n,c as s,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const t="/vitepress-blog-template/images/jvm/java-jvm-debug-1.png",g=JSON.parse('{"title":"调试排错 - Java 线程分析之线程Dump分析","description":"","frontmatter":{},"headers":[],"relativePath":"java/jvm/java-jvm-thread-dump.md","filePath":"java/jvm/java-jvm-thread-dump.md","lastUpdated":1737706346000}'),l={name:"java/jvm/java-jvm-thread-dump.md"};function i(c,a,o,r,d,h){return e(),s("div",null,a[0]||(a[0]=[p(`<h1 id="调试排错-java-线程分析之线程dump分析" tabindex="-1">调试排错 - Java 线程分析之线程Dump分析 <a class="header-anchor" href="#调试排错-java-线程分析之线程dump分析" aria-label="Permalink to &quot;调试排错 - Java 线程分析之线程Dump分析&quot;">​</a></h1><blockquote><p>Thread Dump是非常有用的诊断Java应用问题的工具。@pdai</p></blockquote><h2 id="thread-dump介绍" tabindex="-1">Thread Dump介绍 <a class="header-anchor" href="#thread-dump介绍" aria-label="Permalink to &quot;Thread Dump介绍&quot;">​</a></h2><h3 id="什么是thread-dump" tabindex="-1">什么是Thread Dump <a class="header-anchor" href="#什么是thread-dump" aria-label="Permalink to &quot;什么是Thread Dump&quot;">​</a></h3><p>Thread Dump是非常有用的诊断Java应用问题的工具。每一个Java虚拟机都有及时生成所有线程在某一点状态的thread-dump的能力，虽然各个 Java虚拟机打印的thread dump略有不同，但是 大多都提供了当前活动线程的快照，及JVM中所有Java线程的堆栈跟踪信息，堆栈信息一般包含完整的类名及所执行的方法，如果可能的话还有源代码的行数。</p><h3 id="thread-dump特点" tabindex="-1">Thread Dump特点 <a class="header-anchor" href="#thread-dump特点" aria-label="Permalink to &quot;Thread Dump特点&quot;">​</a></h3><ul><li>能在各种操作系统下使用；</li><li>能在各种Java应用服务器下使用；</li><li>能在生产环境下使用而不影响系统的性能；</li><li>能将问题直接定位到应用程序的代码行上；</li></ul><h3 id="thread-dump抓取" tabindex="-1">Thread Dump抓取 <a class="header-anchor" href="#thread-dump抓取" aria-label="Permalink to &quot;Thread Dump抓取&quot;">​</a></h3><p>一般当服务器挂起，崩溃或者性能低下时，就需要抓取服务器的线程堆栈（Thread Dump）用于后续的分析。在实际运行中，往往一次 dump的信息，还不足以确认问题。为了反映线程状态的动态变化，需要接连多次做thread dump，每次间隔10-20s，建议至少产生三次 dump信息，如果每次 dump都指向同一个问题，我们才确定问题的典型性。</p><ul><li>操作系统命令获取ThreadDump</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ps –ef | grep java</span></span>
<span class="line"><span>kill -3 &lt;pid&gt;</span></span></code></pre></div><p>注意：</p><blockquote><p>一定要谨慎, 一步不慎就可能让服务器进程被杀死。kill -9 命令会杀死进程。</p></blockquote><ul><li>JVM 自带的工具获取线程堆栈</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>jps 或 ps –ef | grep java （获取PID）</span></span>
<span class="line"><span>jstack [-l ] &lt;pid&gt; | tee -a jstack.log（获取ThreadDump）</span></span></code></pre></div><h2 id="thread-dump分析" tabindex="-1">Thread Dump分析 <a class="header-anchor" href="#thread-dump分析" aria-label="Permalink to &quot;Thread Dump分析&quot;">​</a></h2><h3 id="thread-dump信息" tabindex="-1">Thread Dump信息 <a class="header-anchor" href="#thread-dump信息" aria-label="Permalink to &quot;Thread Dump信息&quot;">​</a></h3><ul><li>头部信息：时间，JVM信息</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>2011-11-02 19:05:06  </span></span>
<span class="line"><span>Full thread dump Java HotSpot(TM) Server VM (16.3-b01 mixed mode):</span></span></code></pre></div><ul><li>线程INFO信息块：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>1. &quot;Timer-0&quot; daemon prio=10 tid=0xac190c00 nid=0xaef in Object.wait() [0xae77d000] </span></span>
<span class="line"><span># 线程名称：Timer-0；线程类型：daemon；优先级: 10，默认是5；</span></span>
<span class="line"><span># JVM线程id：tid=0xac190c00，JVM内部线程的唯一标识（通过java.lang.Thread.getId()获取，通常用自增方式实现）。</span></span>
<span class="line"><span># 对应系统线程id（NativeThread ID）：nid=0xaef，和top命令查看的线程pid对应，不过一个是10进制，一个是16进制。（通过命令：top -H -p pid，可以查看该进程的所有线程信息）</span></span>
<span class="line"><span># 线程状态：in Object.wait()；</span></span>
<span class="line"><span># 起始栈地址：[0xae77d000]，对象的内存地址，通过JVM内存查看工具，能够看出线程是在哪儿个对象上等待；</span></span>
<span class="line"><span>2.  java.lang.Thread.State: TIMED_WAITING (on object monitor)</span></span>
<span class="line"><span>3.  at java.lang.Object.wait(Native Method)</span></span>
<span class="line"><span>4.  -waiting on &lt;0xb3885f60&gt; (a java.util.TaskQueue)     # 继续wait </span></span>
<span class="line"><span>5.  at java.util.TimerThread.mainLoop(Timer.java:509)</span></span>
<span class="line"><span>6.  -locked &lt;0xb3885f60&gt; (a java.util.TaskQueue)         # 已经locked</span></span>
<span class="line"><span>7.  at java.util.TimerThread.run(Timer.java:462)</span></span>
<span class="line"><span>Java thread statck trace：是上面2-7行的信息。到目前为止这是最重要的数据，Java stack trace提供了大部分信息来精确定位问题根源。</span></span></code></pre></div><ul><li>Java thread statck trace详解：</li></ul><p><strong>堆栈信息应该逆向解读</strong>：程序先执行的是第7行，然后是第6行，依次类推。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>- locked &lt;0xb3885f60&gt; (a java.util.ArrayList)</span></span>
<span class="line"><span>- waiting on &lt;0xb3885f60&gt; (a java.util.ArrayList)</span></span></code></pre></div><p><strong>也就是说对象先上锁，锁住对象0xb3885f60，然后释放该对象锁，进入waiting状态</strong>。为啥会出现这样的情况呢？看看下面的java代码示例，就会明白：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>synchronized(obj) {  </span></span>
<span class="line"><span>   .........  </span></span>
<span class="line"><span>   obj.wait();  </span></span>
<span class="line"><span>   .........  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如上，线程的执行过程，先用 <code>synchronized</code> 获得了这个对象的 Monitor（对应于 <code>locked &lt;0xb3885f60&gt;</code> ）。当执行到 <code>obj.wait()</code>，线程即放弃了 Monitor的所有权，进入 “wait set”队列（对应于 <code>waiting on &lt;0xb3885f60&gt;</code> ）。</p><p><strong>在堆栈的第一行信息中，进一步标明了线程在代码级的状态</strong>，例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>java.lang.Thread.State: TIMED_WAITING (parking)</span></span></code></pre></div><p>解释如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>|blocked|</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&gt; This thread tried to enter asynchronized block, but the lock was taken by another thread. This thread isblocked until the lock gets released.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>|blocked (on thin lock)|</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&gt; This is the same state asblocked, but the lock in question is a thin lock.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>|waiting|</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&gt; This thread calledObject.wait() on an object. The thread will remain there until some otherthread sends a notification to that object.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>|sleeping|</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&gt; This thread calledjava.lang.Thread.sleep().</span></span>
<span class="line"><span></span></span>
<span class="line"><span>|parked|</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&gt; This thread calledjava.util.concurrent.locks.LockSupport.park().</span></span>
<span class="line"><span></span></span>
<span class="line"><span>|suspended|</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&gt; The thread&#39;s execution wassuspended by java.lang.Thread.suspend() or a JVMTI agent call.</span></span></code></pre></div><h3 id="thread状态分析" tabindex="-1">Thread状态分析 <a class="header-anchor" href="#thread状态分析" aria-label="Permalink to &quot;Thread状态分析&quot;">​</a></h3><p>线程的状态是一个很重要的东西，因此thread dump中会显示这些状态，通过对这些状态的分析，能够得出线程的运行状况，进而发现可能存在的问题。<strong>线程的状态在Thread.State这个枚举类型中定义</strong>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public enum State   </span></span>
<span class="line"><span>{  </span></span>
<span class="line"><span>       /** </span></span>
<span class="line"><span>        * Thread state for a thread which has not yet started. </span></span>
<span class="line"><span>        */  </span></span>
<span class="line"><span>       NEW,  </span></span>
<span class="line"><span>         </span></span>
<span class="line"><span>       /** </span></span>
<span class="line"><span>        * Thread state for a runnable thread.  A thread in the runnable </span></span>
<span class="line"><span>        * state is executing in the Java virtual machine but it may </span></span>
<span class="line"><span>        * be waiting for other resources from the operating system </span></span>
<span class="line"><span>        * such as processor. </span></span>
<span class="line"><span>        */  </span></span>
<span class="line"><span>       RUNNABLE,  </span></span>
<span class="line"><span>         </span></span>
<span class="line"><span>       /** </span></span>
<span class="line"><span>        * Thread state for a thread blocked waiting for a monitor lock. </span></span>
<span class="line"><span>        * A thread in the blocked state is waiting for a monitor lock </span></span>
<span class="line"><span>        * to enter a synchronized block/method or  </span></span>
<span class="line"><span>        * reenter a synchronized block/method after calling </span></span>
<span class="line"><span>        * {@link Object#wait() Object.wait}. </span></span>
<span class="line"><span>        */  </span></span>
<span class="line"><span>       BLOCKED,  </span></span>
<span class="line"><span>     </span></span>
<span class="line"><span>       /** </span></span>
<span class="line"><span>        * Thread state for a waiting thread. </span></span>
<span class="line"><span>        * A thread is in the waiting state due to calling one of the  </span></span>
<span class="line"><span>        * following methods: </span></span>
<span class="line"><span>        * &lt;ul&gt; </span></span>
<span class="line"><span>        *   &lt;li&gt;{@link Object#wait() Object.wait} with no timeout&lt;/li&gt; </span></span>
<span class="line"><span>        *   &lt;li&gt;{@link #join() Thread.join} with no timeout&lt;/li&gt; </span></span>
<span class="line"><span>        *   &lt;li&gt;{@link LockSupport#park() LockSupport.park}&lt;/li&gt; </span></span>
<span class="line"><span>        * &lt;/ul&gt; </span></span>
<span class="line"><span>        *  </span></span>
<span class="line"><span>        * &lt;p&gt;A thread in the waiting state is waiting for another thread to </span></span>
<span class="line"><span>        * perform a particular action.   </span></span>
<span class="line"><span>        * </span></span>
<span class="line"><span>        * For example, a thread that has called &lt;tt&gt;Object.wait()&lt;/tt&gt; </span></span>
<span class="line"><span>        * on an object is waiting for another thread to call  </span></span>
<span class="line"><span>        * &lt;tt&gt;Object.notify()&lt;/tt&gt; or &lt;tt&gt;Object.notifyAll()&lt;/tt&gt; on  </span></span>
<span class="line"><span>        * that object. A thread that has called &lt;tt&gt;Thread.join()&lt;/tt&gt;  </span></span>
<span class="line"><span>        * is waiting for a specified thread to terminate. </span></span>
<span class="line"><span>        */  </span></span>
<span class="line"><span>       WAITING,  </span></span>
<span class="line"><span>         </span></span>
<span class="line"><span>       /** </span></span>
<span class="line"><span>        * Thread state for a waiting thread with a specified waiting time. </span></span>
<span class="line"><span>        * A thread is in the timed waiting state due to calling one of  </span></span>
<span class="line"><span>        * the following methods with a specified positive waiting time: </span></span>
<span class="line"><span>        * &lt;ul&gt; </span></span>
<span class="line"><span>        *   &lt;li&gt;{@link #sleep Thread.sleep}&lt;/li&gt; </span></span>
<span class="line"><span>        *   &lt;li&gt;{@link Object#wait(long) Object.wait} with timeout&lt;/li&gt; </span></span>
<span class="line"><span>        *   &lt;li&gt;{@link #join(long) Thread.join} with timeout&lt;/li&gt; </span></span>
<span class="line"><span>        *   &lt;li&gt;{@link LockSupport#parkNanos LockSupport.parkNanos}&lt;/li&gt;  </span></span>
<span class="line"><span>        *   &lt;li&gt;{@link LockSupport#parkUntil LockSupport.parkUntil}&lt;/li&gt; </span></span>
<span class="line"><span>        * &lt;/ul&gt; </span></span>
<span class="line"><span>        */  </span></span>
<span class="line"><span>       TIMED_WAITING,  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>       /** </span></span>
<span class="line"><span>        * Thread state for a terminated thread. </span></span>
<span class="line"><span>        * The thread has completed execution. </span></span>
<span class="line"><span>        */  </span></span>
<span class="line"><span>       TERMINATED;  </span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>NEW：</li></ul><p>每一个线程，在堆内存中都有一个对应的Thread对象。Thread t = new Thread();当刚刚在堆内存中创建Thread对象，还没有调用t.start()方法之前，线程就处在NEW状态。在这个状态上，线程与普通的java对象没有什么区别，就仅仅是一个堆内存中的对象。</p><ul><li>RUNNABLE：</li></ul><p>该状态表示线程具备所有运行条件，在运行队列中准备操作系统的调度，或者正在运行。 这个状态的线程比较正常，但如果线程长时间停留在在这个状态就不正常了，这说明线程运行的时间很长（存在性能问题），或者是线程一直得不得执行的机会（存在线程饥饿的问题）。</p><ul><li>BLOCKED：</li></ul><p>线程正在等待获取java对象的监视器(也叫内置锁)，即线程正在等待进入由synchronized保护的方法或者代码块。synchronized用来保证原子性，任意时刻最多只能由一个线程进入该临界区域，其他线程只能排队等待。</p><ul><li>WAITING：</li></ul><p>处在该线程的状态，正在等待某个事件的发生，只有特定的条件满足，才能获得执行机会。而产生这个特定的事件，通常都是另一个线程。也就是说，如果不发生特定的事件，那么处在该状态的线程一直等待，不能获取执行的机会。比如：</p><p>A线程调用了obj对象的obj.wait()方法，如果没有线程调用obj.notify或obj.notifyAll，那么A线程就没有办法恢复运行； 如果A线程调用了LockSupport.park()，没有别的线程调用LockSupport.unpark(A)，那么A没有办法恢复运行。 TIMED_WAITING：</p><p>J.U.C中很多与线程相关类，都提供了限时版本和不限时版本的API。TIMED_WAITING意味着线程调用了限时版本的API，正在等待时间流逝。当等待时间过去后，线程一样可以恢复运行。如果线程进入了WAITING状态，一定要特定的事件发生才能恢复运行；而处在TIMED_WAITING的线程，如果特定的事件发生或者是时间流逝完毕，都会恢复运行。</p><ul><li>TERMINATED：</li></ul><p>线程执行完毕，执行完run方法正常返回，或者抛出了运行时异常而结束，线程都会停留在这个状态。这个时候线程只剩下Thread对象了，没有什么用了。</p><h3 id="关键状态分析" tabindex="-1">关键状态分析 <a class="header-anchor" href="#关键状态分析" aria-label="Permalink to &quot;关键状态分析&quot;">​</a></h3><ul><li><strong>Wait on condition</strong>：The thread is either sleeping or waiting to be notified by another thread.</li></ul><p>该状态说明它在等待另一个条件的发生，来把自己唤醒，或者干脆它是调用了 sleep(n)。</p><p>此时线程状态大致为以下几种：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>java.lang.Thread.State: WAITING (parking)：一直等那个条件发生；</span></span>
<span class="line"><span>java.lang.Thread.State: TIMED_WAITING (parking或sleeping)：定时的，那个条件不到来，也将定时唤醒自己。</span></span></code></pre></div><ul><li><strong>Waiting for Monitor Entry 和 in Object.wait()</strong>：The thread is waiting to get the lock for an object (some other thread may be holding the lock). This happens if two or more threads try to execute synchronized code. Note that the lock is always for an object and not for individual methods.</li></ul><p>在多线程的JAVA程序中，实现线程之间的同步，就要说说 Monitor。<strong>Monitor是Java中用以实现线程之间的互斥与协作的主要手段，它可以看成是对象或者Class的锁。每一个对象都有，也仅有一个 Monitor</strong> 。下面这个图，描述了线程和 Monitor之间关系，以及线程的状态转换图：</p><p><img src="`+t+`" alt="image"></p><p>如上图，每个Monitor在某个时刻，只能被一个线程拥有，<strong>该线程就是 “ActiveThread”，而其它线程都是 “Waiting Thread”，分别在两个队列“Entry Set”和“Wait Set”里等候</strong>。在“Entry Set”中等待的线程状态是“Waiting for monitor entry”，而在“Wait Set”中等待的线程状态是“in Object.wait()”。</p><p>先看“Entry Set”里面的线程。我们称被 synchronized保护起来的代码段为临界区。<strong>当一个线程申请进入临界区时，它就进入了“Entry Set”队列</strong>。对应的 code就像：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>synchronized(obj) {</span></span>
<span class="line"><span>   .........</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这时有两种可能性：</p><ul><li>该 monitor不被其它线程拥有， Entry Set里面也没有其它等待线程。本线程即成为相应类或者对象的 Monitor的 Owner，执行临界区的代码。</li><li>该 monitor被其它线程拥有，本线程在 Entry Set队列中等待。</li></ul><p>在第一种情况下，线程将处于 “Runnable”的状态，而第二种情况下，线程 DUMP会显示处于 “waiting for monitor entry”。如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&quot;Thread-0&quot; prio=10 tid=0x08222eb0 nid=0x9 waiting for monitor entry [0xf927b000..0xf927bdb8] </span></span>
<span class="line"><span>at testthread.WaitThread.run(WaitThread.java:39) </span></span>
<span class="line"><span>- waiting to lock &lt;0xef63bf08&gt; (a java.lang.Object) </span></span>
<span class="line"><span>- locked &lt;0xef63beb8&gt; (a java.util.ArrayList) </span></span>
<span class="line"><span>at java.lang.Thread.run(Thread.java:595)</span></span></code></pre></div><p><strong>临界区的设置，是为了保证其内部的代码执行的原子性和完整性</strong>。但是因为临界区在任何时间只允许线程串行通过，这和我们多线程的程序的初衷是相反的。<strong>如果在多线程的程序中，大量使用 synchronized，或者不适当的使用了它，会造成大量线程在临界区的入口等待，造成系统的性能大幅下降</strong>。如果在线程 DUMP中发现了这个情况，应该审查源码，改进程序。</p><p>再看“Wait Set”里面的线程。<strong>当线程获得了 Monitor，进入了临界区之后，如果发现线程继续运行的条件没有满足，它则调用对象（一般就是被 synchronized 的对象）的 wait() 方法，放弃 Monitor，进入 “Wait Set”队列。只有当别的线程在该对象上调用了 notify() 或者 notifyAll()，“Wait Set”队列中线程才得到机会去竞争</strong>，但是只有一个线程获得对象的Monitor，恢复到运行态。在 “Wait Set”中的线程， DUMP中表现为： in Object.wait()。如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&quot;Thread-1&quot; prio=10 tid=0x08223250 nid=0xa in Object.wait() [0xef47a000..0xef47aa38] </span></span>
<span class="line"><span> at java.lang.Object.wait(Native Method) </span></span>
<span class="line"><span> - waiting on &lt;0xef63beb8&gt; (a java.util.ArrayList) </span></span>
<span class="line"><span> at java.lang.Object.wait(Object.java:474) </span></span>
<span class="line"><span> at testthread.MyWaitThread.run(MyWaitThread.java:40) </span></span>
<span class="line"><span> - locked &lt;0xef63beb8&gt; (a java.util.ArrayList) </span></span>
<span class="line"><span> at java.lang.Thread.run(Thread.java:595) </span></span>
<span class="line"><span>综上，一般CPU很忙时，则关注runnable的线程，CPU很闲时，则关注waiting for monitor entry的线程。</span></span></code></pre></div><ul><li><strong>JDK 5.0 的 Lock</strong></li></ul><p>上面提到如果 synchronized和 monitor机制运用不当，可能会造成多线程程序的性能问题。在 JDK 5.0中，引入了 Lock机制，从而使开发者能更灵活的开发高性能的并发多线程程序，可以替代以往 JDK中的 synchronized和 Monitor的 机制。但是，<strong>要注意的是，因为 Lock类只是一个普通类，JVM无从得知 Lock对象的占用情况，所以在线程 DUMP中，也不会包含关于 Lock的信息</strong>， 关于死锁等问题，就不如用 synchronized的编程方式容易识别。</p><h3 id="关键状态示例" tabindex="-1">关键状态示例 <a class="header-anchor" href="#关键状态示例" aria-label="Permalink to &quot;关键状态示例&quot;">​</a></h3><ul><li><strong>显示BLOCKED状态</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package jstack;  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class BlockedState  </span></span>
<span class="line"><span>{  </span></span>
<span class="line"><span>    private static Object object = new Object();  </span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public static void main(String[] args)  </span></span>
<span class="line"><span>    {  </span></span>
<span class="line"><span>        Runnable task = new Runnable() {  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override  </span></span>
<span class="line"><span>            public void run()  </span></span>
<span class="line"><span>            {  </span></span>
<span class="line"><span>                synchronized (object)  </span></span>
<span class="line"><span>                {  </span></span>
<span class="line"><span>                    long begin = System.currentTimeMillis();  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>                    long end = System.currentTimeMillis();  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>                    // 让线程运行5分钟,会一直持有object的监视器  </span></span>
<span class="line"><span>                    while ((end - begin) &lt;= 5 * 60 * 1000)  </span></span>
<span class="line"><span>                    {  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>                    }  </span></span>
<span class="line"><span>                }  </span></span>
<span class="line"><span>            }  </span></span>
<span class="line"><span>        };  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>        new Thread(task, &quot;t1&quot;).start();  </span></span>
<span class="line"><span>        new Thread(task, &quot;t2&quot;).start();  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>先获取object的线程会执行5分钟，<strong>这5分钟内会一直持有object的监视器，另一个线程无法执行处在BLOCKED状态</strong>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Full thread dump Java HotSpot(TM) Server VM (20.12-b01 mixed mode):  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>&quot;DestroyJavaVM&quot; prio=6 tid=0x00856c00 nid=0x1314 waiting on condition [0x00000000]  </span></span>
<span class="line"><span>java.lang.Thread.State: RUNNABLE  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;t2&quot; prio=6 tid=0x27d7a800 nid=0x1350 waiting for monitor entry [0x2833f000]  </span></span>
<span class="line"><span>java.lang.Thread.State: BLOCKED (on object monitor)  </span></span>
<span class="line"><span>     at jstack.BlockedState$1.run(BlockedState.java:17)  </span></span>
<span class="line"><span>     - waiting to lock &lt;0x1cfcdc00&gt; (a java.lang.Object)  </span></span>
<span class="line"><span>     at java.lang.Thread.run(Thread.java:662)  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;t1&quot; prio=6 tid=0x27d79400 nid=0x1338 runnable [0x282ef000]  </span></span>
<span class="line"><span> java.lang.Thread.State: RUNNABLE  </span></span>
<span class="line"><span>     at jstack.BlockedState$1.run(BlockedState.java:22)  </span></span>
<span class="line"><span>     - locked &lt;0x1cfcdc00&gt; (a java.lang.Object)  </span></span>
<span class="line"><span>     at java.lang.Thread.run(Thread.java:662)</span></span></code></pre></div><p>通过thread dump可以看到：<strong>t2线程确实处在BLOCKED (on object monitor)。waiting for monitor entry 等待进入synchronized保护的区域</strong>。</p><ul><li><strong>显示WAITING状态</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package jstack;  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>public class WaitingState  </span></span>
<span class="line"><span>{  </span></span>
<span class="line"><span>    private static Object object = new Object();  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args)  </span></span>
<span class="line"><span>    {  </span></span>
<span class="line"><span>        Runnable task = new Runnable() {  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override  </span></span>
<span class="line"><span>            public void run()  </span></span>
<span class="line"><span>            {  </span></span>
<span class="line"><span>                synchronized (object)  </span></span>
<span class="line"><span>                {  </span></span>
<span class="line"><span>                    long begin = System.currentTimeMillis();  </span></span>
<span class="line"><span>                    long end = System.currentTimeMillis();  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>                    // 让线程运行5分钟,会一直持有object的监视器  </span></span>
<span class="line"><span>                    while ((end - begin) &lt;= 5 * 60 * 1000)  </span></span>
<span class="line"><span>                    {  </span></span>
<span class="line"><span>                        try  </span></span>
<span class="line"><span>                        {  </span></span>
<span class="line"><span>                            // 进入等待的同时,会进入释放监视器  </span></span>
<span class="line"><span>                            object.wait();  </span></span>
<span class="line"><span>                        } catch (InterruptedException e)  </span></span>
<span class="line"><span>                        {  </span></span>
<span class="line"><span>                            e.printStackTrace();  </span></span>
<span class="line"><span>                        }  </span></span>
<span class="line"><span>                    }  </span></span>
<span class="line"><span>                }  </span></span>
<span class="line"><span>            }  </span></span>
<span class="line"><span>        };  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>        new Thread(task, &quot;t1&quot;).start();  </span></span>
<span class="line"><span>        new Thread(task, &quot;t2&quot;).start();  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Full thread dump Java HotSpot(TM) Server VM (20.12-b01 mixed mode):  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;DestroyJavaVM&quot; prio=6 tid=0x00856c00 nid=0x1734 waiting on condition [0x00000000]  </span></span>
<span class="line"><span>java.lang.Thread.State: RUNNABLE  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;t2&quot; prio=6 tid=0x27d7e000 nid=0x17f4 in Object.wait() [0x2833f000]  </span></span>
<span class="line"><span>java.lang.Thread.State: WAITING (on object monitor)  </span></span>
<span class="line"><span>     at java.lang.Object.wait(Native Method)  </span></span>
<span class="line"><span>     - waiting on &lt;0x1cfcdc00&gt; (a java.lang.Object)  </span></span>
<span class="line"><span>     at java.lang.Object.wait(Object.java:485)  </span></span>
<span class="line"><span>     at jstack.WaitingState$1.run(WaitingState.java:26)  </span></span>
<span class="line"><span>     - locked &lt;0x1cfcdc00&gt; (a java.lang.Object)  </span></span>
<span class="line"><span>     at java.lang.Thread.run(Thread.java:662)  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;t1&quot; prio=6 tid=0x27d7d400 nid=0x17f0 in Object.wait() [0x282ef000]  </span></span>
<span class="line"><span>java.lang.Thread.State: WAITING (on object monitor)  </span></span>
<span class="line"><span>     at java.lang.Object.wait(Native Method)  </span></span>
<span class="line"><span>     - waiting on &lt;0x1cfcdc00&gt; (a java.lang.Object)  </span></span>
<span class="line"><span>     at java.lang.Object.wait(Object.java:485)  </span></span>
<span class="line"><span>     at jstack.WaitingState$1.run(WaitingState.java:26)  </span></span>
<span class="line"><span>     - locked &lt;0x1cfcdc00&gt; (a java.lang.Object)  </span></span>
<span class="line"><span>     at java.lang.Thread.run(Thread.java:662)</span></span></code></pre></div><p>可以发现t1和t2都处在WAITING (on object monitor)，进入等待状态的原因是调用了in Object.wait()。通过J.U.C包下的锁和条件队列，也是这个效果，大家可以自己实践下。</p><ul><li><strong>显示TIMED_WAITING状态</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package jstack;  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.concurrent.TimeUnit;  </span></span>
<span class="line"><span>import java.util.concurrent.locks.Condition;  </span></span>
<span class="line"><span>import java.util.concurrent.locks.Lock;  </span></span>
<span class="line"><span>import java.util.concurrent.locks.ReentrantLock;  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>public class TimedWaitingState  </span></span>
<span class="line"><span>{  </span></span>
<span class="line"><span>    // java的显示锁,类似java对象内置的监视器  </span></span>
<span class="line"><span>    private static Lock lock = new ReentrantLock();  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>    // 锁关联的条件队列(类似于object.wait)  </span></span>
<span class="line"><span>    private static Condition condition = lock.newCondition();  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args)  </span></span>
<span class="line"><span>    {  </span></span>
<span class="line"><span>        Runnable task = new Runnable() {  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>            @Override  </span></span>
<span class="line"><span>            public void run()  </span></span>
<span class="line"><span>            {  </span></span>
<span class="line"><span>                // 加锁,进入临界区  </span></span>
<span class="line"><span>                lock.lock();  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>                try  </span></span>
<span class="line"><span>                {  </span></span>
<span class="line"><span>                    condition.await(5, TimeUnit.MINUTES);  </span></span>
<span class="line"><span>                } catch (InterruptedException e)  </span></span>
<span class="line"><span>                {  </span></span>
<span class="line"><span>                    e.printStackTrace();  </span></span>
<span class="line"><span>                }  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>                // 解锁,退出临界区  </span></span>
<span class="line"><span>                lock.unlock();  </span></span>
<span class="line"><span>            }  </span></span>
<span class="line"><span>        };  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>        new Thread(task, &quot;t1&quot;).start();  </span></span>
<span class="line"><span>        new Thread(task, &quot;t2&quot;).start();  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Full thread dump Java HotSpot(TM) Server VM (20.12-b01 mixed mode):  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;DestroyJavaVM&quot; prio=6 tid=0x00856c00 nid=0x169c waiting on condition [0x00000000]  </span></span>
<span class="line"><span>java.lang.Thread.State: RUNNABLE  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;t2&quot; prio=6 tid=0x27d7d800 nid=0xc30 waiting on condition [0x2833f000]  </span></span>
<span class="line"><span>java.lang.Thread.State: TIMED_WAITING (parking)  </span></span>
<span class="line"><span>     at sun.misc.Unsafe.park(Native Method)  </span></span>
<span class="line"><span>     - parking to wait for  &lt;0x1cfce5b8&gt; (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)  </span></span>
<span class="line"><span>     at java.util.concurrent.locks.LockSupport.parkNanos(LockSupport.java:196)  </span></span>
<span class="line"><span>     at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.await(AbstractQueuedSynchronizer.java:2116)  </span></span>
<span class="line"><span>     at jstack.TimedWaitingState$1.run(TimedWaitingState.java:28)  </span></span>
<span class="line"><span>     at java.lang.Thread.run(Thread.java:662)  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;t1&quot; prio=6 tid=0x280d0c00 nid=0x16e0 waiting on condition [0x282ef000]  </span></span>
<span class="line"><span>java.lang.Thread.State: TIMED_WAITING (parking)  </span></span>
<span class="line"><span>     at sun.misc.Unsafe.park(Native Method)  </span></span>
<span class="line"><span>     - parking to wait for  &lt;0x1cfce5b8&gt; (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)  </span></span>
<span class="line"><span>     at java.util.concurrent.locks.LockSupport.parkNanos(LockSupport.java:196)  </span></span>
<span class="line"><span>     at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.await(AbstractQueuedSynchronizer.java:2116)  </span></span>
<span class="line"><span>     at jstack.TimedWaitingState$1.run(TimedWaitingState.java:28)  </span></span>
<span class="line"><span>     at java.lang.Thread.run(Thread.java:662)</span></span></code></pre></div><p>可以看到t1和t2线程都处在java.lang.Thread.State: TIMED_WAITING (parking)，这个parking代表是调用的JUC下的工具类，而不是java默认的监视器。</p><h2 id="案例分析" tabindex="-1">案例分析 <a class="header-anchor" href="#案例分析" aria-label="Permalink to &quot;案例分析&quot;">​</a></h2><h3 id="问题场景" tabindex="-1">问题场景 <a class="header-anchor" href="#问题场景" aria-label="Permalink to &quot;问题场景&quot;">​</a></h3><ul><li><p><strong>CPU飙高，load高，响应很慢</strong></p><ol><li>一个请求过程中多次dump；</li><li>对比多次dump文件的runnable线程，如果执行的方法有比较大变化，说明比较正常。如果在执行同一个方法，就有一些问题了；</li></ol></li><li><p><strong>查找占用CPU最多的线程</strong></p><ol><li>使用命令：top -H -p pid（pid为被测系统的进程号），找到导致CPU高的线程ID，对应thread dump信息中线程的nid，只不过一个是十进制，一个是十六进制；</li><li>在thread dump中，根据top命令查找的线程id，查找对应的线程堆栈信息；</li></ol></li><li><p><strong>CPU使用率不高但是响应很慢</strong></p></li></ul><p>进行dump，查看是否有很多thread struck在了i/o、数据库等地方，定位瓶颈原因；</p><ul><li><strong>请求无法响应</strong></li></ul><p>多次dump，对比是否所有的runnable线程都一直在执行相同的方法，如果是的，恭喜你，锁住了！</p><h3 id="死锁" tabindex="-1">死锁 <a class="header-anchor" href="#死锁" aria-label="Permalink to &quot;死锁&quot;">​</a></h3><p>死锁经常表现为程序的停顿，或者不再响应用户的请求。从操作系统上观察，对应进程的CPU占用率为零，很快会从top或prstat的输出中消失。</p><p>比如在下面这个示例中，是个较为典型的死锁情况：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&quot;Thread-1&quot; prio=5 tid=0x00acc490 nid=0xe50 waiting for monitor entry [0x02d3f000 </span></span>
<span class="line"><span>..0x02d3fd68] </span></span>
<span class="line"><span>at deadlockthreads.TestThread.run(TestThread.java:31) </span></span>
<span class="line"><span>- waiting to lock &lt;0x22c19f18&gt; (a java.lang.Object) </span></span>
<span class="line"><span>- locked &lt;0x22c19f20&gt; (a java.lang.Object) </span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;Thread-0&quot; prio=5 tid=0x00accdb0 nid=0xdec waiting for monitor entry [0x02cff000 </span></span>
<span class="line"><span>..0x02cff9e8] </span></span>
<span class="line"><span>at deadlockthreads.TestThread.run(TestThread.java:31) </span></span>
<span class="line"><span>- waiting to lock &lt;0x22c19f20&gt; (a java.lang.Object) </span></span>
<span class="line"><span>- locked &lt;0x22c19f18&gt; (a java.lang.Object)</span></span></code></pre></div><p>在 JAVA 5中加强了对死锁的检测。<strong>线程 Dump中可以直接报告出 Java级别的死锁</strong>，如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Found one Java-level deadlock: </span></span>
<span class="line"><span>============================= </span></span>
<span class="line"><span>&quot;Thread-1&quot;: </span></span>
<span class="line"><span>waiting to lock monitor 0x0003f334 (object 0x22c19f18, a java.lang.Object), </span></span>
<span class="line"><span>which is held by &quot;Thread-0&quot; </span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;Thread-0&quot;: </span></span>
<span class="line"><span>waiting to lock monitor 0x0003f314 (object 0x22c19f20, a java.lang.Object), </span></span>
<span class="line"><span>which is held by &quot;Thread-1&quot;</span></span></code></pre></div><h3 id="热锁" tabindex="-1">热锁 <a class="header-anchor" href="#热锁" aria-label="Permalink to &quot;热锁&quot;">​</a></h3><p>热锁，也往往是导致系统性能瓶颈的主要因素。其表现特征为：<strong>由于多个线程对临界区，或者锁的竞争</strong>，可能出现：</p><ul><li><strong>频繁的线程的上下文切换</strong>：从操作系统对线程的调度来看，当线程在等待资源而阻塞的时候，操作系统会将之切换出来，放到等待的队列，当线程获得资源之后，调度算法会将这个线程切换进去，放到执行队列中。</li><li><strong>大量的系统调用</strong>：因为线程的上下文切换，以及热锁的竞争，或者临界区的频繁的进出，都可能导致大量的系统调用。</li><li><strong>大部分CPU开销用在“系统态”</strong>：线程上下文切换，和系统调用，都会导致 CPU在 “系统态 ”运行，换而言之，虽然系统很忙碌，但是CPU用在 “用户态 ”的比例较小，应用程序得不到充分的 CPU资源。</li><li><strong>随着CPU数目的增多，系统的性能反而下降</strong>。因为CPU数目多，同时运行的线程就越多，可能就会造成更频繁的线程上下文切换和系统态的CPU开销，从而导致更糟糕的性能。</li></ul><p>上面的描述，都是一个 scalability（可扩展性）很差的系统的表现。从整体的性能指标看，由于线程热锁的存在，程序的响应时间会变长，吞吐量会降低。</p><p><strong>那么，怎么去了解 “热锁 ”出现在什么地方呢</strong>？</p><p>一个重要的方法是 结合操作系统的各种工具观察系统资源使用状况，以及收集Java线程的DUMP信息，看线程都阻塞在什么方法上，了解原因，才能找到对应的解决方法。</p><h2 id="jvm重要线程" tabindex="-1">JVM重要线程 <a class="header-anchor" href="#jvm重要线程" aria-label="Permalink to &quot;JVM重要线程&quot;">​</a></h2><p>JVM运行过程中产生的一些比较重要的线程罗列如下：</p><table tabindex="0"><thead><tr><th>线程名称</th><th>解释说明</th></tr></thead><tbody><tr><td>Attach Listener</td><td>Attach Listener 线程是负责接收到外部的命令，而对该命令进行执行的并把结果返回给发送者。通常我们会用一些命令去要求JVM给我们一些反馈信息，如：java -version、jmap、jstack等等。 如果该线程在JVM启动的时候没有初始化，那么，则会在用户第一次执行JVM命令时，得到启动。</td></tr><tr><td>Signal Dispatcher</td><td>前面提到Attach Listener线程的职责是接收外部JVM命令，当命令接收成功后，会交给signal dispather线程去进行分发到各个不同的模块处理命令，并且返回处理结果。signal dispather线程也是在第一次接收外部JVM命令时，进行初始化工作。</td></tr><tr><td>CompilerThread0</td><td>用来调用JITing，实时编译装卸class 。 通常，JVM会启动多个线程来处理这部分工作，线程名称后面的数字也会累加，例如：CompilerThread1。</td></tr><tr><td>Concurrent Mark-Sweep GC Thread</td><td>并发标记清除垃圾回收器（就是通常所说的CMS GC）线程， 该线程主要针对于老年代垃圾回收。ps：启用该垃圾回收器，需要在JVM启动参数中加上：-XX:+UseConcMarkSweepGC。</td></tr><tr><td>DestroyJavaVM</td><td>执行main()的线程，在main执行完后调用JNI中的 jni_DestroyJavaVM() 方法唤起DestroyJavaVM 线程，处于等待状态，等待其它线程（Java线程和Native线程）退出时通知它卸载JVM。每个线程退出时，都会判断自己当前是否是整个JVM中最后一个非deamon线程，如果是，则通知DestroyJavaVM 线程卸载JVM。</td></tr><tr><td>Finalizer Thread</td><td>这个线程也是在main线程之后创建的，其优先级为10，主要用于在垃圾收集前，调用对象的finalize()方法；关于Finalizer线程的几点：1) 只有当开始一轮垃圾收集时，才会开始调用finalize()方法；因此并不是所有对象的finalize()方法都会被执行；2) 该线程也是daemon线程，因此如果虚拟机中没有其他非daemon线程，不管该线程有没有执行完finalize()方法，JVM也会退出；3) JVM在垃圾收集时会将失去引用的对象包装成Finalizer对象（Reference的实现），并放入ReferenceQueue，由Finalizer线程来处理；最后将该Finalizer对象的引用置为null，由垃圾收集器来回收；4) JVM为什么要单独用一个线程来执行finalize()方法呢？如果JVM的垃圾收集线程自己来做，很有可能由于在finalize()方法中误操作导致GC线程停止或不可控，这对GC线程来说是一种灾难；</td></tr><tr><td>Low Memory Detector</td><td>这个线程是负责对可使用内存进行检测，如果发现可用内存低，分配新的内存空间。</td></tr><tr><td>Reference Handler</td><td>JVM在创建main线程后就创建Reference Handler线程，其优先级最高，为10，它主要用于处理引用对象本身（软引用、弱引用、虚引用）的垃圾回收问题 。</td></tr><tr><td>VM Thread</td><td>这个线程就比较牛b了，是JVM里面的线程母体，根据hotspot源码（vmThread.hpp）里面的注释，它是一个单个的对象（最原始的线程）会产生或触发所有其他的线程，这个单个的VM线程是会被其他线程所使用来做一些VM操作（如：清扫垃圾等）。</td></tr></tbody></table><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li>作者：猿码架构</li><li>链接：<a href="https://www.jianshu.com/p/f1db856022de" target="_blank" rel="noreferrer">https://www.jianshu.com/p/f1db856022de</a></li><li>来源：简书</li><li>著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。</li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,104)]))}const b=n(l,[["render",i]]);export{g as __pageData,b as default};
