import{_ as n}from"./chunks/java-16.iPeR1Nq1.js";import{_ as s}from"./chunks/java-avx-1.DudTPcd7.js";import{_ as e}from"./chunks/java-fma-1.BwfeY09m.js";import{_ as p,c as l,ai as i,o as t}from"./chunks/framework.BrYByd3F.js";const k=JSON.parse('{"title":"Java 16 新特性概述","description":"","frontmatter":{},"headers":[],"relativePath":"java/java8up/java16.md","filePath":"java/java8up/java16.md","lastUpdated":1737706346000}'),c={name:"java/java8up/java16.md"};function o(r,a,d,h,u,g){return t(),l("div",null,a[0]||(a[0]=[i('<h1 id="java-16-新特性概述" tabindex="-1">Java 16 新特性概述 <a class="header-anchor" href="#java-16-新特性概述" aria-label="Permalink to &quot;Java 16 新特性概述&quot;">​</a></h1><blockquote><p>JDK 16 在 2021 年 3 月 16 号发布！根据发布的规划，这次发布的 JDK 17 是一个长期维护的版本（LTS)。Java 16 提供了数千个<strong>性能</strong>、<strong>稳定性</strong>和<strong>安全性</strong>更新，以及 <strong>17 个 JEP</strong>（JDK 增强提案），进一步改进了 Java 语言和平台，以帮助开发人员提高工作效率。@pdai</p></blockquote><h2 id="知识体系" tabindex="-1">知识体系 <a class="header-anchor" href="#知识体系" aria-label="Permalink to &quot;知识体系&quot;">​</a></h2><p><img src="'+n+`" alt="error.图片加载失败"></p><h2 id="语言特性增强" tabindex="-1">语言特性增强 <a class="header-anchor" href="#语言特性增强" aria-label="Permalink to &quot;语言特性增强&quot;">​</a></h2><h3 id="jep-394-instanceof-模式匹配-正式版" tabindex="-1">JEP 394: instanceof 模式匹配（正式版） <a class="header-anchor" href="#jep-394-instanceof-模式匹配-正式版" aria-label="Permalink to &quot;JEP 394: instanceof 模式匹配（正式版）&quot;">​</a></h3><blockquote><p>模式匹配（Pattern Matching）最早在 Java 14 中作为预览特性引入，在 Java 15 中还是预览特性，在Java 16中成为正式版。模式匹配通过对 instacneof 运算符进行模式匹配来增强 Java 编程语言。</p></blockquote><p><strong>如下内容来自Java14</strong></p><p>对 instanceof 的改进，主要目的是为了让创建对象更简单、简洁和高效，并且可读性更强、提高安全性。</p><p>在以往实际使用中，instanceof 主要用来检查对象的类型，然后根据类型对目标对象进行类型转换，之后进行不同的处理、实现不同的逻辑，具体可以参考如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (person instanceof Student) {</span></span>
<span class="line"><span>    Student student = (Student) person;</span></span>
<span class="line"><span>    student.say();</span></span>
<span class="line"><span>   // other student operations</span></span>
<span class="line"><span>} else if (person instanceof Teacher) {</span></span>
<span class="line"><span>    Teacher teacher = (Teacher) person;</span></span>
<span class="line"><span>    teacher.say();</span></span>
<span class="line"><span>    // other teacher operations</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码中，我们首先需要对 person 对象进行类型判断，判断 person 具体是 Student 还是 Teacher，因为这两种角色对应不同操作，亦即对应到的实际逻辑实现，判断完 person 类型之后，然后强制对 person 进行类型转换为局部变量，以方便后续执行属于该角色的特定操作。</p><p>上面这种写法，有下面两个问题：</p><ul><li>每次在检查类型之后，都需要强制进行类型转换。</li><li>类型转换后，需要提前创建一个局部变量来接收转换后的结果，代码显得多余且繁琐。</li></ul><p>对 instanceof 进行模式匹配改进之后，上面示例代码可以改写成：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (person instanceof Student student) {</span></span>
<span class="line"><span>    student.say();</span></span>
<span class="line"><span>   // other student operations</span></span>
<span class="line"><span>} else if (person instanceof Teacher teacher) {</span></span>
<span class="line"><span>    teacher.say();</span></span>
<span class="line"><span>    // other teacher operations</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>首先在 if 代码块中，对 person 对象进行类型匹配，校验 person 对象是否为 Student 类型，如果类型匹配成功，则会转换为 Student 类型，并赋值给模式局部变量 student，并且只有当模式匹配表达式匹配成功是才会生效和复制，同时这里的 student 变量只能在 if 块中使用，而不能在 else if/else 中使用，否则会报编译错误。</p><p>注意，如果 if 条件中有 &amp;&amp; 运算符时，当 instanceof 类型匹配成功，模式局部变量的作用范围也可以相应延长，如下面代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (obj instanceof String s &amp;&amp; s.length() &gt; 5) {.. s.contains(..) ..}</span></span></code></pre></div><p>另外，需要注意，这种作用范围延长，并不适用于或 || 运算符，因为即便 || 运算符左边的 instanceof 类型匹配没有成功也不会造成短路，依旧会执行到||运算符右边的表达式，但是此时，因为 instanceof 类型匹配没有成功，局部变量并未定义赋值，此时使用会产生问题。</p><p>与传统写法对比，可以发现模式匹配不但提高了程序的安全性、健壮性，另一方面，不需要显式的去进行二次类型转换，减少了大量不必要的强制类型转换。模式匹配变量在模式匹配成功之后，可以直接使用，同时它还被限制了作用范围，大大提高了程序的简洁性、可读性和安全性。instanceof 的模式匹配，为 Java 带来的有一次便捷的提升，能够剔除一些冗余的代码，写出更加简洁安全的代码，提高码代码效率。</p><h3 id="jep-395-records-正式版" tabindex="-1">JEP 395: Records (正式版) <a class="header-anchor" href="#jep-395-records-正式版" aria-label="Permalink to &quot;JEP 395: Records (正式版)&quot;">​</a></h3><blockquote><p>Records 最早在 Java 14 中作为预览特性引入，在 Java 15 中还是预览特性，在Java 16中成为正式版。</p></blockquote><p><strong>如下内容来自Java14</strong></p><p>Record 类型允许在代码中使用紧凑的语法形式来声明类，而这些类能够作为不可变数据类型的封装持有者。Record 这一特性主要用在特定领域的类上；与枚举类型一样，Record 类型是一种受限形式的类型，主要用于存储、保存数据，并且没有其它额外自定义行为的场景下。</p><p>在以往开发过程中，被当作数据载体的类对象，在正确声明定义过程中，通常需要编写大量的无实际业务、重复性质的代码，其中包括：构造函数、属性调用、访问以及 equals() 、hashCode()、toString() 等方法，因此在 Java 14 中引入了 Record 类型，其效果有些类似 Lombok 的 @Data 注解、Kotlin 中的 data class，但是又不尽完全相同，它们的共同点都是类的部分或者全部可以直接在类头中定义、描述，并且这个类只用于存储数据而已。对于 Record 类型，具体可以用下面代码来说明：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public record Person(String name, int age) {</span></span>
<span class="line"><span>    public static String address;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String getName() {</span></span>
<span class="line"><span>        return name;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对上述代码进行编译，然后反编译之后可以看到如下结果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final class Person extends java.lang.Record {</span></span>
<span class="line"><span>    private final java.lang.String name;</span></span>
<span class="line"><span>    private final java.lang.String age;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Person(java.lang.String name, java.lang.String age) { /* compiled code */ }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public java.lang.String getName() { /* compiled code */ }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public java.lang.String toString() { /* compiled code */ }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public final int hashCode() { /* compiled code */ }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public final boolean equals(java.lang.Object o) { /* compiled code */ }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public java.lang.String name() { /* compiled code */ }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public java.lang.String age() { /* compiled code */ }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>根据反编译结果，可以得出，当用 Record 来声明一个类时，该类将自动拥有下面特征：</p><ul><li>拥有一个构造方法</li><li>获取成员属性值的方法：name()、age()</li><li>hashCode() 方法和 euqals() 方法</li><li>toString() 方法</li><li>类对象和属性被 final 关键字修饰，不能被继承，类的示例属性也都被 final 修饰，不能再被赋值使用。</li><li>还可以在 Record 声明的类中定义静态属性、方法和示例方法。注意，不能在 Record 声明的类中定义示例字段，类也不能声明为抽象类等。</li></ul><p>可以看到，该预览特性提供了一种更为紧凑的语法来声明类，并且可以大幅减少定义类似数据类型时所需的重复性代码。</p><p>另外 Java 14 中为了引入 Record 这种新的类型，在 java.lang.Class 中引入了下面两个新方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>RecordComponent[] getRecordComponents()</span></span>
<span class="line"><span>boolean isRecord()</span></span></code></pre></div><p>其中 getRecordComponents() 方法返回一组 java.lang.reflect.RecordComponent 对象组成的数组，java.lang.reflect.RecordComponent也是一个新引入类，该数组的元素与 Record 类中的组件相对应，其顺序与在记录声明中出现的顺序相同，可以从该数组中的每个 RecordComponent 中提取到组件信息，包括其名称、类型、泛型类型、注释及其访问方法。</p><p>而 isRecord() 方法，则返回所在类是否是 Record 类型，如果是，则返回 true。</p><h2 id="新工具和库" tabindex="-1">新工具和库 <a class="header-anchor" href="#新工具和库" aria-label="Permalink to &quot;新工具和库&quot;">​</a></h2><h3 id="jep-380-unix-domain-套接字通道" tabindex="-1">JEP 380：Unix-Domain 套接字通道 <a class="header-anchor" href="#jep-380-unix-domain-套接字通道" aria-label="Permalink to &quot;JEP 380：Unix-Domain 套接字通道&quot;">​</a></h3><p>Unix-domain 套接字一直是大多数 Unix 平台的一个特性，现在在 Windows 10 和 Windows Server 2019 也提供了支持。此特性为 java.nio.channels 包的套接字通道和服务器套接字通道 API 添加了 Unix-domain（AF_UNIX）套接字支持。它扩展了继承的通道机制以支持 Unix-domain 套接字通道和服务器套接字通道。Unix-domain 套接字用于同一主机上的进程间通信（IPC）。它们在很大程度上类似于 TCP/IP，区别在于套接字是通过文件系统路径名而不是 Internet 协议（IP）地址和端口号寻址的。对于本地进程间通信，Unix-domain 套接字比 TCP/IP 环回连接更安全、更有效。</p><h3 id="jep-390-对基于值的类发出警告" tabindex="-1">JEP 390: 对基于值的类发出警告 <a class="header-anchor" href="#jep-390-对基于值的类发出警告" aria-label="Permalink to &quot;JEP 390: 对基于值的类发出警告&quot;">​</a></h3><blockquote><p>JDK9注解@Deprecated得到了增强，增加了 since 和 forRemoval 两个属性，可以分别指定一个程序元素被废弃的版本，以及是否会在今后的版本中被删除。JDK16中对<code>@jdk.internal.ValueBased</code>注解加入了基于值的类的告警，所以继续在 Synchronized 同步块中使用值类型，将会在编译期和运行期产生警告，甚至是异常。</p></blockquote><ul><li><strong>JDK9中@Deprecated增强了增加了 since 和 forRemoval 两 个属性</strong></li></ul><p>JDK9注解@Deprecated得到了增强，增加了 since 和 forRemoval 两个属性，可以分别指定一个程序元素被废弃的版本，以及是否会在今后的版本中被删除。</p><p>在如下的代码中，表示<code>PdaiDeprecatedTest</code>这个类在JDK9版本中被弃用并且在将来的某个版本中一定会被删除。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Deprecated(since=&quot;9&quot;, forRemoval = true)</span></span>
<span class="line"><span>public class PdaiDeprecatedTest {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>JDK16中对基于值的类（@jdk.internal.ValueBased）给出告警</strong></li></ul><p>在JDK9中我们可以看到Integer.java类构造函数中加入了<code>@Deprecated(since=&quot;9&quot;)</code>，表示在JDK9版本中被弃用并且在将来的某个版本中一定会被删除</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public final class Integer extends Number implements Comparable&lt;Integer&gt; {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// ... </span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * Constructs a newly allocated {@code Integer} object that</span></span>
<span class="line"><span>     * represents the specified {@code int} value.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param   value   the value to be represented by the</span></span>
<span class="line"><span>     *                  {@code Integer} object.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @deprecated</span></span>
<span class="line"><span>     * It is rarely appropriate to use this constructor. The static factory</span></span>
<span class="line"><span>     * {@link #valueOf(int)} is generally a better choice, as it is</span></span>
<span class="line"><span>     * likely to yield significantly better space and time performance.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Deprecated(since=&quot;9&quot;)</span></span>
<span class="line"><span>    public Integer(int value) {</span></span>
<span class="line"><span>        this.value = value;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>// ... </span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如下是JDK16中Integer.java的代码</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*</span></span>
<span class="line"><span>* &lt;p&gt;This is a &lt;a href=&quot;{@docRoot}/java.base/java/lang/doc-files/ValueBased.html&quot;&gt;value-based&lt;/a&gt;</span></span>
<span class="line"><span> * class; programmers should treat instances that are</span></span>
<span class="line"><span> * {@linkplain #equals(Object) equal} as interchangeable and should not</span></span>
<span class="line"><span> * use instances for synchronization, or unpredictable behavior may</span></span>
<span class="line"><span> * occur. For example, in a future release, synchronization may fail.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * &lt;p&gt;Implementation note: The implementations of the &quot;bit twiddling&quot;</span></span>
<span class="line"><span> * methods (such as {@link #highestOneBit(int) highestOneBit} and</span></span>
<span class="line"><span> * {@link #numberOfTrailingZeros(int) numberOfTrailingZeros}) are</span></span>
<span class="line"><span> * based on material from Henry S. Warren, Jr.&#39;s &lt;i&gt;Hacker&#39;s</span></span>
<span class="line"><span> * Delight&lt;/i&gt;, (Addison Wesley, 2002).</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @author  Lee Boynton</span></span>
<span class="line"><span> * @author  Arthur van Hoff</span></span>
<span class="line"><span> * @author  Josh Bloch</span></span>
<span class="line"><span> * @author  Joseph D. Darcy</span></span>
<span class="line"><span> * @since 1.0</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@jdk.internal.ValueBased</span></span>
<span class="line"><span>public final class Integer extends Number</span></span>
<span class="line"><span>        implements Comparable&lt;Integer&gt;, Constable, ConstantDesc {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// ... </span></span>
<span class="line"><span>  /**</span></span>
<span class="line"><span>    * Constructs a newly allocated {@code Integer} object that</span></span>
<span class="line"><span>    * represents the specified {@code int} value.</span></span>
<span class="line"><span>    *</span></span>
<span class="line"><span>    * @param   value   the value to be represented by the</span></span>
<span class="line"><span>    *                  {@code Integer} object.</span></span>
<span class="line"><span>    *</span></span>
<span class="line"><span>    * @deprecated</span></span>
<span class="line"><span>    * It is rarely appropriate to use this constructor. The static factory</span></span>
<span class="line"><span>    * {@link #valueOf(int)} is generally a better choice, as it is</span></span>
<span class="line"><span>    * likely to yield significantly better space and time performance.</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span>  @Deprecated(since=&quot;9&quot;, forRemoval = true)</span></span>
<span class="line"><span>  public Integer(int value) {</span></span>
<span class="line"><span>      this.value = value;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>// ...</span></span></code></pre></div><p>添加<code>@jdk.internal.ValueBased</code>和<code>@Deprecated(since=&quot;9&quot;, forRemoval = true)</code>的作用是什么呢？</p><ol><li><strong>JDK设计者建议使用Integer a = 10或者Integer.valueOf()函数，而不是new Integer()，让其抛出告警？</strong></li></ol><p>在构造函数上都已经标记有@Deprecated(since=&quot;9&quot;, forRemoval = true)注解，这就意味着其构造函数在将来会被删除，不应该在程序中继续使用诸如new Integer(); 如果继续使用，编译期将会产生&#39;Integer(int)&#39; is deprecated and marked for removal 告警。</p><ol start="2"><li><strong>在并发环境下，Integer 对象根本无法通过 Synchronized 来保证线程安全，让其抛出告警？</strong></li></ol><p>由于JDK中对<code>@jdk.internal.ValueBased</code>注解加入了基于值的类的告警，所以继续在 Synchronized 同步块中使用值类型，将会在编译期和运行期产生警告，甚至是异常。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void inc(Integer count) {</span></span>
<span class="line"><span>    for (int i = 0; i &lt; 10; i++) {</span></span>
<span class="line"><span>        new Thread(() -&gt; {</span></span>
<span class="line"><span>            synchronized (count) { // 这里会产生编译告警</span></span>
<span class="line"><span>                count++;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }).start();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="jep-392-打包工具-正式版" tabindex="-1">JEP 392：打包工具（正式版） <a class="header-anchor" href="#jep-392-打包工具-正式版" aria-label="Permalink to &quot;JEP 392：打包工具（正式版）&quot;">​</a></h3><p>此特性最初是作为 Java 14 中的一个孵化器模块引入的，该工具允许打包自包含的 Java 应用程序。它支持原生打包格式，为最终用户提供自然的安装体验，这些格式包括 Windows 上的 msi 和 exe、macOS 上的 pkg 和 dmg，还有 Linux 上的 deb 和 rpm。它还允许在打包时指定启动时参数，并且可以从命令行直接调用，也可以通过 ToolProvider API 以编程方式调用。注意 jpackage 模块名称从 jdk.incubator.jpackage 更改为 jdk.jpackage。这将改善最终用户在安装应用程序时的体验，并简化了“应用商店”模型的部署。</p><h3 id="jep-396-默认强封装-jdk-内部元素" tabindex="-1">JEP 396：默认强封装 JDK 内部元素 <a class="header-anchor" href="#jep-396-默认强封装-jdk-内部元素" aria-label="Permalink to &quot;JEP 396：默认强封装 JDK 内部元素&quot;">​</a></h3><p>此特性会默认强封装 JDK 的所有内部元素，但关键内部 API（例如 sun.misc.Unsafe）除外。默认情况下，使用早期版本成功编译的访问 JDK 内部 API 的代码可能不再起作用。鼓励开发人员从使用内部元素迁移到使用标准 API 的方法上，以便他们及其用户都可以无缝升级到将来的 Java 版本。强封装由 JDK 9 的启动器选项–illegal-access 控制，到 JDK 15 默认改为 warning，从 JDK 16 开始默认为 deny。（目前）仍然可以使用单个命令行选项放宽对所有软件包的封装，将来只有使用–add-opens 打开特定的软件包才行。</p><h2 id="jvm-优化" tabindex="-1">JVM 优化 <a class="header-anchor" href="#jvm-优化" aria-label="Permalink to &quot;JVM 优化&quot;">​</a></h2><h3 id="jep-376-zgc-并发线程处理" tabindex="-1">JEP 376：ZGC 并发线程处理 <a class="header-anchor" href="#jep-376-zgc-并发线程处理" aria-label="Permalink to &quot;JEP 376：ZGC 并发线程处理&quot;">​</a></h3><p>JEP 376 将 ZGC 线程栈处理从安全点转移到一个并发阶段，甚至在大堆上也允许在毫秒内暂停 GC 安全点。消除 ZGC 垃圾收集器中最后一个延迟源可以极大地提高应用程序的性能和效率。</p><h3 id="jep-387-弹性元空间" tabindex="-1">JEP 387：弹性元空间 <a class="header-anchor" href="#jep-387-弹性元空间" aria-label="Permalink to &quot;JEP 387：弹性元空间&quot;">​</a></h3><p>此特性可将未使用的 HotSpot 类元数据（即元空间，metaspace）内存更快速地返回到操作系统，从而减少元空间的占用空间。具有大量类加载和卸载活动的应用程序可能会占用大量未使用的空间。新方案将元空间内存按较小的块分配，它将未使用的元空间内存返回给操作系统来提高弹性，从而提高应用程序性能并降低内存占用。</p><h2 id="新功能的预览和孵化" tabindex="-1">新功能的预览和孵化 <a class="header-anchor" href="#新功能的预览和孵化" aria-label="Permalink to &quot;新功能的预览和孵化&quot;">​</a></h2><h3 id="jep-338-向量-api-孵化器" tabindex="-1">JEP 338：向量 API（孵化器） <a class="header-anchor" href="#jep-338-向量-api-孵化器" aria-label="Permalink to &quot;JEP 338：向量 API（孵化器）&quot;">​</a></h3><blockquote><p>如下内容来源于<a href="https://xie.infoq.cn/article/8304c894c4e38318d38ceb116%EF%BC%8C%E4%BD%9C%E8%80%85%E6%98%AF%E4%B9%9D%E5%8F%94" target="_blank" rel="noreferrer">https://xie.infoq.cn/article/8304c894c4e38318d38ceb116，作者是九叔</a></p></blockquote><p>AVX（Advanced Vector Extensions，高级向量扩展）实际上是 x86-64 处理器上的一套 SIMD（Single Instruction Multiple Data，单指令多数据流）指令集，相对于 SISD（Single instruction, Single dat，单指令流但数据流）而言，SIMD 非常适用于 CPU 密集型场景，因为向量计算允许在同一个 CPU 时钟周期内对多组数据批量进行数据运算，执行性能非常高效，甚至从某种程度上来看，向量运算似乎更像是一种并行任务，而非像标量计算那样，在同一个 CPU 时钟周期内仅允许执行一组数据运算，存在严重的执行效率低下问题。</p><p><img src="`+s+`" alt="error.图片加载失败"></p><p>随着 Java16 的正式来临，开发人员可以在程序中使用 Vector API 来实现各种复杂的向量计算，由 JIT 编译器 Server Compiler(C2)在运行期将其编译为对应的底层 AVX 指令执行。当然，在讲解如何使用 Vector API 之前，我们首先来看一个简单的标量计算程序。示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void scalarComputation() {</span></span>
<span class="line"><span>    var a = new float[10000000];</span></span>
<span class="line"><span>    var b = new float[10000000];</span></span>
<span class="line"><span>    // 省略数组a和b的赋值操作</span></span>
<span class="line"><span>    var c = new float[10000000];</span></span>
<span class="line"><span>    for (int i = 0; i &lt; a.length; i++) {</span></span>
<span class="line"><span>        c[i] = (a[i] * a[i] + b[i] * b[i]) * -1.0f;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在上述程序示例中，循环体内每次只能执行一组浮点运算，总共需要执行约 1000 万次才能够获得最终的运算结果，可想而知，这样的执行效率必然低效。值得庆幸的是，从 Java6 的时代开始，Java 的设计者们就在 HotSpot 虚拟机中引入了一种被称之为 SuperWord 的自动向量优化算法，该算法缺省会将循环体内的标量计算自动优化为向量计算，以此来提升数据运算时的执行效率。当然，我们可以通过虚拟机参数-XX:-UseSuperWord来显式关闭这项优化（从实际测试结果来看，如果不开启自动向量优化，存在约 20%~22%之间的性能下降）。</p><p>在此大家需要注意，尽管 HotSpot 缺省支持自动向量优化，但局限性仍然非常明显，首先，JIT 编译器 Server Compiler(C2)仅仅只会对循环体内的代码块做向量优化，并且这样的优化也是极不可靠的；其次，对于一些复杂的向量运算，SuperWord 则显得无能为力。因此，在一些特定场景下（比如：机器学习，线性代数，密码学等），建议大家还是尽可能使用 Java16 为大家提供的 Vector API 来实现复杂的向量计算。示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 定义256bit的向量浮点运算</span></span>
<span class="line"><span>static final VectorSpecies&lt;Float&gt; SPECIES = FloatVector.SPECIES_256;</span></span>
<span class="line"><span>void vectorComputation(float[] a, float[] b, float[] c) {</span></span>
<span class="line"><span>    var i = 0;</span></span>
<span class="line"><span>    var upperBound = SPECIES.loopBound(a.length);</span></span>
<span class="line"><span>    for (; i &lt; upperBound; i += SPECIES.length()) {</span></span>
<span class="line"><span>        var va = FloatVector.fromArray(SPECIES, a, i);</span></span>
<span class="line"><span>        var vb = FloatVector.fromArray(SPECIES, b, i);</span></span>
<span class="line"><span>        var vc = va.mul(va).</span></span>
<span class="line"><span>                add(vb.mul(vb)).</span></span>
<span class="line"><span>                neg();</span></span>
<span class="line"><span>        vc.intoArray(c, i);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (; i &lt; a.length; i++) {</span></span>
<span class="line"><span>        c[i] = (a[i] * a[i] + b[i] * b[i]) * -1.0f;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>值得注意的是，Vector API 包含在 jdk.incubator.vector 模块中，程序中如果需要使用 Vector API 则需要在 module-info.java 文件中引入该模块。：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>module java16.test{</span></span>
<span class="line"><span>    requires jdk.incubator.vector;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="jep-389-外部链接器-api-孵化器" tabindex="-1">JEP 389：外部链接器 API（孵化器） <a class="header-anchor" href="#jep-389-外部链接器-api-孵化器" aria-label="Permalink to &quot;JEP 389：外部链接器 API（孵化器）&quot;">​</a></h3><p>该孵化器 API 提供了静态类型、纯 Java 访问原生代码的特性，该 API 将大大简化绑定原生库的原本复杂且容易出错的过程。Java 1.1 就已通过 Java 原生接口（JNI）支持了原生方法调用，但并不好用。Java 开发人员应该能够为特定任务绑定特定的原生库。它还提供了外来函数支持，而无需任何中间的 JNI 粘合代码。</p><h3 id="jep-393-外部存储器访问-api-第三次孵化" tabindex="-1">JEP 393：外部存储器访问 API（第三次孵化） <a class="header-anchor" href="#jep-393-外部存储器访问-api-第三次孵化" aria-label="Permalink to &quot;JEP 393：外部存储器访问 API（第三次孵化）&quot;">​</a></h3><blockquote><p>在 Java 14 和 Java 15 中作为孵化器 API 引入的这个 API 使 Java 程序能够安全有效地对各种外部存储器（例如本机存储器、持久性存储器、托管堆存储器等）进行操作。它提供了外部链接器 API 的基础。</p></blockquote><p>如下内容来源于<a href="https://xie.infoq.cn/article/8304c894c4e38318d38ceb116%EF%BC%8C%E4%BD%9C%E8%80%85%E6%98%AF%E4%B9%9D%E5%8F%94" target="_blank" rel="noreferrer">https://xie.infoq.cn/article/8304c894c4e38318d38ceb116，作者是九叔</a></p><p>在实际的开发过程中，绝大多数的开发人员基本都不会直接与堆外内存打交道，但这并不代表你从未接触过堆外内存，像大家经常使用的诸如：RocketMQ、MapDB 等中间件产品底层实现都是基于堆外存储的，换句话说，我们几乎每天都在间接与堆外内存打交道。那么究竟为什么需要使用到堆外内存呢？简单来说，主要是出于以下 3 个方面的考虑：</p><ul><li>减少 GC 次数和降低 Stop-the-world 时间；</li><li>可以扩展和使用更大的内存空间；</li><li>可以省去物理内存和堆内存之间的数据复制步骤。</li></ul><p>在 Java14 之前，如果开发人员想要操作堆外内存，通常的做法就是使用 ByteBuffer 或者 Unsafe，甚至是 JNI 等方式，但无论使用哪一种方式，均<strong>无法同时有效解决安全性和高效性等 2 个问题</strong>，并且，堆外内存的释放也是一个令人头痛的问题。以 DirectByteBuffer 为例，该对象仅仅只是一个引用，其背后还关联着一大段堆外内存，由于 DirectByteBuffer 对象实例仍然是存储在堆空间内，只有当 DirectByteBuffer 对象被 GC 回收时，其背后的堆外内存才会被进一步释放。</p><p><img src="`+e+`" alt="error.图片加载失败"></p><p>在此大家需要注意，程序中通过 ByteBuffer.allocateDirect()方法来申请物理内存资源所耗费的成本远远高于直接在 on-heap 中的操作，而且实际开发过程中还需要考虑数据结构如何设计、序列化/反序列化如何支撑等诸多难题，所以与其使用语法层面的 API 倒不如直接使用 MapDB 等开源产品来得更实惠。</p><p>如今，在堆外内存领域，我们似乎又多了一个选择，<strong>从 Java14 开始，Java 的设计者们在语法层面为大家带来了崭新的 Memory Access API，极大程度上简化了开发难度，并得以有效的解决了安全性和高效性等 2 个核心问题</strong>。示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 获取内存访问var句柄</span></span>
<span class="line"><span>var handle = MemoryHandles.varHandle(char.class,</span></span>
<span class="line"><span>        ByteOrder.nativeOrder());</span></span>
<span class="line"><span>// 申请200字节的堆外内存</span></span>
<span class="line"><span>try (MemorySegment segment = MemorySegment.allocateNative(200)) {</span></span>
<span class="line"><span>    for (int i = 0; i &lt; 25; i++) {</span></span>
<span class="line"><span>        handle.set(segment, i &lt;&lt; 2, (char) (i + 1 + 64));</span></span>
<span class="line"><span>        System.out.println(handle.get(segment, i &lt;&lt; 2));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>关于堆外内存段的释放，Memory Access API 提供有显式和隐式 2 种方式，开发人员除了可以在程序中通过 MemorySegment 的 close()方法来显式释放所申请的内存资源外，还可以注册 Cleaner 清理器来实现资源的隐式释放，后者会在 GC 确定目标内存段不再可访问时，释放与之关联的堆外内存资源。</p><h3 id="jep-397-密封类-第二预览" tabindex="-1">JEP 397：密封类（第二预览） <a class="header-anchor" href="#jep-397-密封类-第二预览" aria-label="Permalink to &quot;JEP 397：密封类（第二预览）&quot;">​</a></h3><blockquote><p><strong>封闭类</strong>可以是封闭类和或者封闭接口，用来增强 Java 编程语言，<strong>防止其他类或接口扩展或实现它们</strong>。这个特性由Java 15的预览版本晋升为正式版本。</p></blockquote><ul><li><strong>密封的类和接口解释和应用</strong></li></ul><p>因为我们引入了<code>sealed</code> <code>class</code>或<code>interfaces</code>，这些class或者interfaces只允许被指定的类或者interface进行扩展和实现。</p><p>使用修饰符<code>sealed</code>，您可以将一个类声明为密封类。密封的类使用reserved关键字permits列出可以直接扩展它的类。子类可以是最终的，非密封的或密封的。</p><p>之前我们的代码是这样的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Person { } //人</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>class Teacher extends Person { }//教师</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>class Worker extends Person { }  //工人</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>class Student extends Person{ } //学生</span></span></code></pre></div><p>但是我们现在要限制 Person类 只能被这三个类继承，不能被其他类继承，需要这么做。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 添加sealed修饰符，permits后面跟上只能被继承的子类名称</span></span>
<span class="line"><span>public sealed class Person permits Teacher, Worker, Student{ } //人</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>// 子类可以被修饰为 final</span></span>
<span class="line"><span>final class Teacher extends Person { }//教师</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>// 子类可以被修饰为 non-sealed，此时 Worker类就成了普通类，谁都可以继承它</span></span>
<span class="line"><span>non-sealed class Worker extends Person { }  //工人</span></span>
<span class="line"><span>// 任何类都可以继承Worker</span></span>
<span class="line"><span>class AnyClass extends Worker{}</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>//子类可以被修饰为 sealed,同上</span></span>
<span class="line"><span>sealed class Student extends Person permits MiddleSchoolStudent,GraduateStudent{ } //学生</span></span>
<span class="line"><span> </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>final class MiddleSchoolStudent extends Student { }  //中学生</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>final class GraduateStudent extends Student { }  //研究生</span></span></code></pre></div><p>很强很实用的一个特性，可以限制类的层次结构。</p><h2 id="提升-openjdk-开发人员的生产力" tabindex="-1">提升 OpenJDK 开发人员的生产力 <a class="header-anchor" href="#提升-openjdk-开发人员的生产力" aria-label="Permalink to &quot;提升 OpenJDK 开发人员的生产力&quot;">​</a></h2><blockquote><p>其余更改对 Java 开发人员（使用 Java 编写代码和运行应用程序的人员）不会直接可见，而只对 Java 开发人员（参与 OpenJDK 开发的人员）可见。</p></blockquote><h3 id="jep-347-启用-c-14-语言特性-在-jdk-源代码中" tabindex="-1">JEP 347：启用 C++14 语言特性（在 JDK 源代码中） <a class="header-anchor" href="#jep-347-启用-c-14-语言特性-在-jdk-源代码中" aria-label="Permalink to &quot;JEP 347：启用 C++14 语言特性（在 JDK 源代码中）&quot;">​</a></h3><p>它允许在 JDK C++ 源代码中使用 C++14 语言特性，并提供在 HotSpot 代码中可以使用哪些特性的具体指导。在 JDK 15 中，JDK 中 C++ 代码使用的语言特性仅限于 C++98/03 语言标准。它要求更新各种平台编译器的最低可接受版本</p><h3 id="jep-357-从-mercurial-迁移到-git-jep-369-迁移到-github" tabindex="-1">JEP 357：从 Mercurial 迁移到 Git &amp; JEP 369，迁移到 GitHub <a class="header-anchor" href="#jep-357-从-mercurial-迁移到-git-jep-369-迁移到-github" aria-label="Permalink to &quot;JEP 357：从 Mercurial 迁移到 Git &amp; JEP 369，迁移到 GitHub&quot;">​</a></h3><p>这些 JEP 将 OpenJDK 社区的源代码存储库从 Mercurial（hg）迁移到 Git，并将它们托管在 GitHub 上以供 JDK 11 及更高版本使用，其中包括将 jcheck、webrev 和 defpath 工具等工具更新到 Git。Git 减小了元数据的大小（约 1/4），可节省本地磁盘空间并减少克隆时间。与 Mercurial 相比，现代工具链可以更好地与 Git 集成。</p><p>Open JDK Git 存储库现在位于 <a href="https://github.com/openjdk%E3%80%82" target="_blank" rel="noreferrer">https://github.com/openjdk。</a></p><h3 id="jep-386-alpinelinux-移植-jep-388-windows-aarch64-移植" tabindex="-1">JEP 386：AlpineLinux 移植 &amp; JEP 388：Windows/AArch64 移植 <a class="header-anchor" href="#jep-386-alpinelinux-移植-jep-388-windows-aarch64-移植" aria-label="Permalink to &quot;JEP 386：AlpineLinux 移植 &amp; JEP 388：Windows/AArch64 移植&quot;">​</a></h3><p>这些 JEP 的重点不是移植工作本身，而是将它们集成到 JDK 主线存储库中；JEP 386 将 JDK 移植到 Alpine Linux 和其他使用 musl 作为 x64 上主要 C 库的发行版上。此外，JEP 388 将 JDK 移植到 Windows AArch64（ARM64）。</p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li><p><a href="https://docs.oracle.com/en/java/javase/16/" target="_blank" rel="noreferrer">https://docs.oracle.com/en/java/javase/16/</a></p></li><li><p><a href="https://xie.infoq.cn/article/8304c894c4e38318d38ceb116" target="_blank" rel="noreferrer">https://xie.infoq.cn/article/8304c894c4e38318d38ceb116</a></p></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,112)]))}const J=p(c,[["render",o]]);export{k as __pageData,J as default};
