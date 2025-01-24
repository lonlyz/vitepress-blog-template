import{_ as s,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const h=JSON.parse('{"title":"Java 基础 - 注解机制详解","description":"","frontmatter":{},"headers":[],"relativePath":"java/basic/java-basic-x-annotation.md","filePath":"java/basic/java-basic-x-annotation.md","lastUpdated":1737706346000}'),t={name:"java/basic/java-basic-x-annotation.md"};function l(i,n,o,c,r,d){return e(),a("div",null,n[0]||(n[0]=[p(`<h1 id="java-基础-注解机制详解" tabindex="-1">Java 基础 - 注解机制详解 <a class="header-anchor" href="#java-基础-注解机制详解" aria-label="Permalink to &quot;Java 基础 - 注解机制详解&quot;">​</a></h1><blockquote><p>注解是JDK1.5版本开始引入的一个特性，用于对代码进行说明，可以对包、类、接口、字段、方法参数、局部变量等进行注解。它是框架学习和设计者必须掌握的基础。@pdai</p></blockquote><h2 id="注解基础" tabindex="-1">注解基础 <a class="header-anchor" href="#注解基础" aria-label="Permalink to &quot;注解基础&quot;">​</a></h2><p>注解是JDK1.5版本开始引入的一个特性，用于对代码进行说明，可以对包、类、接口、字段、方法参数、局部变量等进行注解。它主要的作用有以下四方面：</p><ul><li>生成文档，通过代码里标识的元数据生成javadoc文档。</li><li>编译检查，通过代码里标识的元数据让编译器在编译期间进行检查验证。</li><li>编译时动态处理，编译时通过代码里标识的元数据动态处理，例如动态生成代码。</li><li>运行时动态处理，运行时通过代码里标识的元数据动态处理，例如使用反射注入实例。</li></ul><p>这么来说是比较抽象的，我们具体看下注解的常见分类：</p><ul><li><strong>Java自带的标准注解</strong>，包括<code>@Override</code>、<code>@Deprecated</code>和<code>@SuppressWarnings</code>，分别用于标明重写某个方法、标明某个类或方法过时、标明要忽略的警告，用这些注解标明后编译器就会进行检查。</li><li><strong>元注解</strong>，元注解是用于定义注解的注解，包括<code>@Retention</code>、<code>@Target</code>、<code>@Inherited</code>、<code>@Documented</code>，<code>@Retention</code>用于标明注解被保留的阶段，<code>@Target</code>用于标明注解使用的范围，<code>@Inherited</code>用于标明注解可继承，<code>@Documented</code>用于标明是否生成javadoc文档。</li><li><strong>自定义注解</strong>，可以根据自己的需求定义注解，并可用元注解对自定义注解进行注解。</li></ul><p>接下来我们通过这个分类角度来理解注解。</p><h3 id="java内置注解" tabindex="-1">Java内置注解 <a class="header-anchor" href="#java内置注解" aria-label="Permalink to &quot;Java内置注解&quot;">​</a></h3><p>我们从最为常见的Java内置的注解开始说起，先看下下面的代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class A{</span></span>
<span class="line"><span>    public void test() {</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class B extends A{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>        * 重载父类的test方法</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public void test() {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>        * 被弃用的方法</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    @Deprecated</span></span>
<span class="line"><span>    public void oldMethod() {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>        * 忽略告警</span></span>
<span class="line"><span>        * </span></span>
<span class="line"><span>        * @return</span></span>
<span class="line"><span>        */</span></span>
<span class="line"><span>    @SuppressWarnings(&quot;rawtypes&quot;)</span></span>
<span class="line"><span>    public List processList() {</span></span>
<span class="line"><span>        List list = new ArrayList();</span></span>
<span class="line"><span>        return list;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Java 1.5开始自带的标准注解，包括<code>@Override</code>、<code>@Deprecated</code>和<code>@SuppressWarnings</code>：</p><ul><li><code>@Override</code>：表示当前的方法定义将覆盖父类中的方法</li><li><code>@Deprecated</code>：表示代码被弃用，如果使用了被@Deprecated注解的代码则编译器将发出警告</li><li><code>@SuppressWarnings</code>：表示关闭编译器警告信息</li></ul><p>我们再具体看下这几个内置注解，同时通过这几个内置注解中的元注解的定义来引出元注解。</p><h4 id="内置注解-override" tabindex="-1">内置注解 - @Override <a class="header-anchor" href="#内置注解-override" aria-label="Permalink to &quot;内置注解 - @Override&quot;">​</a></h4><p>我们先来看一下这个注解类型的定义：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Target(ElementType.METHOD)</span></span>
<span class="line"><span>@Retention(RetentionPolicy.SOURCE)</span></span>
<span class="line"><span>public @interface Override {</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从它的定义我们可以看到，这个注解可以被用来修饰方法，并且它只在编译时有效，在编译后的class文件中便不再存在。这个注解的作用我们大家都不陌生，那就是告诉编译器被修饰的方法是重写的父类的中的相同签名的方法，编译器会对此做出检查，若发现父类中不存在这个方法或是存在的方法签名不同，则会报错。</p><h4 id="内置注解-deprecated" tabindex="-1">内置注解 - @Deprecated <a class="header-anchor" href="#内置注解-deprecated" aria-label="Permalink to &quot;内置注解 - @Deprecated&quot;">​</a></h4><p>这个注解的定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Documented</span></span>
<span class="line"><span>@Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>@Target(value={CONSTRUCTOR, FIELD, LOCAL_VARIABLE, METHOD, PACKAGE, PARAMETER, TYPE})</span></span>
<span class="line"><span>public @interface Deprecated {</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从它的定义我们可以知道，它会被文档化，能够保留到运行时，能够修饰构造方法、属性、局部变量、方法、包、参数、类型。这个注解的作用是告诉编译器被修饰的程序元素已被“废弃”，不再建议用户使用。</p><h4 id="内置注解-suppresswarnings" tabindex="-1">内置注解 - @SuppressWarnings <a class="header-anchor" href="#内置注解-suppresswarnings" aria-label="Permalink to &quot;内置注解 - @SuppressWarnings&quot;">​</a></h4><p>这个注解我们也比较常用到，先来看下它的定义：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Target({TYPE, FIELD, METHOD, PARAMETER, CONSTRUCTOR, LOCAL_VARIABLE})</span></span>
<span class="line"><span>@Retention(RetentionPolicy.SOURCE)</span></span>
<span class="line"><span>public @interface SuppressWarnings {</span></span>
<span class="line"><span>    String[] value();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>它能够修饰的程序元素包括类型、属性、方法、参数、构造器、局部变量，只能存活在源码时，取值为String[]。它的作用是告诉编译器忽略指定的警告信息，它可以取的值如下所示：</p><table tabindex="0"><thead><tr><th>参数</th><th>作用</th><th>原描述</th></tr></thead><tbody><tr><td>all</td><td>抑制所有警告</td><td>to suppress all warnings</td></tr><tr><td>boxing</td><td>抑制装箱、拆箱操作时候的警告</td><td>to suppress warnings relative to boxing/unboxing operations</td></tr><tr><td>cast</td><td>抑制映射相关的警告</td><td>to suppress warnings relative to cast operations</td></tr><tr><td>dep-ann</td><td>抑制启用注释的警告</td><td>to suppress warnings relative to deprecated annotation</td></tr><tr><td>deprecation</td><td>抑制过期方法警告</td><td>to suppress warnings relative to deprecation</td></tr><tr><td>fallthrough</td><td>抑制确在switch中缺失breaks的警告</td><td>to suppress warnings relative to missing breaks in switch statements</td></tr><tr><td>finally</td><td>抑制finally模块没有返回的警告</td><td>to suppress warnings relative to finally block that don’t return</td></tr><tr><td>hiding</td><td>抑制与隐藏变数的区域变数相关的警告</td><td>to suppress warnings relative to locals that hide variable（）</td></tr><tr><td>incomplete-switch</td><td>忽略没有完整的switch语句</td><td>to suppress warnings relative to missing entries in a switch statement (enum case)</td></tr><tr><td>nls</td><td>忽略非nls格式的字符</td><td>to suppress warnings relative to non-nls string literals</td></tr><tr><td>null</td><td>忽略对null的操作</td><td>to suppress warnings relative to null analysis</td></tr><tr><td>rawtype</td><td>使用generics时忽略没有指定相应的类型</td><td>to suppress warnings relative to un-specific types when using</td></tr><tr><td>restriction</td><td>抑制与使用不建议或禁止参照相关的警告</td><td>to suppress warnings relative to usage of discouraged or</td></tr><tr><td>serial</td><td>忽略在serializable类中没有声明serialVersionUID变量</td><td>to suppress warnings relative to missing serialVersionUID field for a serializable class</td></tr><tr><td>static-access</td><td>抑制不正确的静态访问方式警告</td><td>to suppress warnings relative to incorrect static access</td></tr><tr><td>synthetic-access</td><td>抑制子类没有按最优方法访问内部类的警告</td><td>to suppress warnings relative to unoptimized access from inner classes</td></tr><tr><td>unchecked</td><td>抑制没有进行类型检查操作的警告</td><td>to suppress warnings relative to unchecked operations</td></tr><tr><td>unqualified-field-access</td><td>抑制没有权限访问的域的警告</td><td>to suppress warnings relative to field access unqualified</td></tr><tr><td>unused</td><td>抑制没被使用过的代码的警告</td><td>to suppress warnings relative to unused code</td></tr></tbody></table><h3 id="元注解" tabindex="-1">元注解 <a class="header-anchor" href="#元注解" aria-label="Permalink to &quot;元注解&quot;">​</a></h3><p>上述内置注解的定义中使用了一些元注解（注解类型进行注解的注解类），在JDK 1.5中提供了4个标准的元注解：<code>@Target</code>，<code>@Retention</code>，<code>@Documented</code>，<code>@Inherited</code>, 在JDK 1.8中提供了两个元注解 <code>@Repeatable</code>和<code>@Native</code>。</p><h4 id="元注解-target" tabindex="-1">元注解 - @Target <a class="header-anchor" href="#元注解-target" aria-label="Permalink to &quot;元注解 - @Target&quot;">​</a></h4><blockquote><p>Target注解的作用是：描述注解的使用范围（即：被修饰的注解可以用在什么地方） 。</p></blockquote><p>Target注解用来说明那些被它所注解的注解类可修饰的对象范围：注解可以用于修饰 packages、types（类、接口、枚举、注解类）、类成员（方法、构造方法、成员变量、枚举值）、方法参数和本地变量（如循环变量、catch参数），在定义注解类时使用了@Target 能够更加清晰的知道它能够被用来修饰哪些对象，它的取值范围定义在ElementType 枚举中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public enum ElementType {</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    TYPE, // 类、接口、枚举类</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    FIELD, // 成员变量（包括：枚举常量）</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    METHOD, // 成员方法</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    PARAMETER, // 方法参数</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    CONSTRUCTOR, // 构造方法</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    LOCAL_VARIABLE, // 局部变量</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    ANNOTATION_TYPE, // 注解类</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    PACKAGE, // 可用于修饰：包</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    TYPE_PARAMETER, // 类型参数，JDK 1.8 新增</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    TYPE_USE // 使用类型的任何地方，JDK 1.8 新增</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="元注解-retention-retentiontarget" tabindex="-1">元注解 - @Retention &amp; @RetentionTarget <a class="header-anchor" href="#元注解-retention-retentiontarget" aria-label="Permalink to &quot;元注解 - @Retention &amp; @RetentionTarget&quot;">​</a></h4><blockquote><p>Reteniton注解的作用是：描述注解保留的时间范围（即：被描述的注解在它所修饰的类中可以被保留到何时） 。</p></blockquote><p>Reteniton注解用来限定那些被它所注解的注解类在注解到其他类上以后，可被保留到何时，一共有三种策略，定义在RetentionPolicy枚举中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public enum RetentionPolicy {</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    SOURCE,    // 源文件保留</span></span>
<span class="line"><span>    CLASS,       // 编译期保留，默认值</span></span>
<span class="line"><span>    RUNTIME   // 运行期保留，可通过反射去获取注解信息</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>为了验证应用了这三种策略的注解类有何区别，分别使用三种策略各定义一个注解类做测试。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Retention(RetentionPolicy.SOURCE)</span></span>
<span class="line"><span>public @interface SourcePolicy {</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>@Retention(RetentionPolicy.CLASS)</span></span>
<span class="line"><span>public @interface ClassPolicy {</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>@Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>public @interface RuntimePolicy {</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>用定义好的三个注解类分别去注解一个方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class RetentionTest {</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>	@SourcePolicy</span></span>
<span class="line"><span>	public void sourcePolicy() {</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>	@ClassPolicy</span></span>
<span class="line"><span>	public void classPolicy() {</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>	@RuntimePolicy</span></span>
<span class="line"><span>	public void runtimePolicy() {</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过执行 <code>javap -verbose RetentionTest</code>命令获取到的RetentionTest 的 class 字节码内容如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  public retention.RetentionTest();</span></span>
<span class="line"><span>    flags: ACC_PUBLIC</span></span>
<span class="line"><span>    Code:</span></span>
<span class="line"><span>      stack=1, locals=1, args_size=1</span></span>
<span class="line"><span>         0: aload_0</span></span>
<span class="line"><span>         1: invokespecial #1                  // Method java/lang/Object.&quot;&lt;init&gt;&quot;:()V</span></span>
<span class="line"><span>         4: return</span></span>
<span class="line"><span>      LineNumberTable:</span></span>
<span class="line"><span>        line 3: 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void sourcePolicy();</span></span>
<span class="line"><span>    flags: ACC_PUBLIC</span></span>
<span class="line"><span>    Code:</span></span>
<span class="line"><span>      stack=0, locals=1, args_size=1</span></span>
<span class="line"><span>         0: return</span></span>
<span class="line"><span>      LineNumberTable:</span></span>
<span class="line"><span>        line 7: 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void classPolicy();</span></span>
<span class="line"><span>    flags: ACC_PUBLIC</span></span>
<span class="line"><span>    Code:</span></span>
<span class="line"><span>      stack=0, locals=1, args_size=1</span></span>
<span class="line"><span>         0: return</span></span>
<span class="line"><span>      LineNumberTable:</span></span>
<span class="line"><span>        line 11: 0</span></span>
<span class="line"><span>    RuntimeInvisibleAnnotations:</span></span>
<span class="line"><span>      0: #11()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public void runtimePolicy();</span></span>
<span class="line"><span>    flags: ACC_PUBLIC</span></span>
<span class="line"><span>    Code:</span></span>
<span class="line"><span>      stack=0, locals=1, args_size=1</span></span>
<span class="line"><span>         0: return</span></span>
<span class="line"><span>      LineNumberTable:</span></span>
<span class="line"><span>        line 15: 0</span></span>
<span class="line"><span>    RuntimeVisibleAnnotations:</span></span>
<span class="line"><span>      0: #14()</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从 RetentionTest 的字节码内容我们可以得出以下两点结论：</p><ul><li>编译器并没有记录下 sourcePolicy() 方法的注解信息；</li><li>编译器分别使用了 <code>RuntimeInvisibleAnnotations</code> 和 <code>RuntimeVisibleAnnotations</code> 属性去记录了<code>classPolicy()</code>方法 和 <code>runtimePolicy()</code>方法 的注解信息；</li></ul><h4 id="元注解-documented" tabindex="-1">元注解 - @Documented <a class="header-anchor" href="#元注解-documented" aria-label="Permalink to &quot;元注解 - @Documented&quot;">​</a></h4><blockquote><p>Documented注解的作用是：描述在使用 javadoc 工具为类生成帮助文档时是否要保留其注解信息。</p></blockquote><p>以下代码在使用Javadoc工具可以生成<code>@TestDocAnnotation</code>注解信息。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import java.lang.annotation.Documented;</span></span>
<span class="line"><span>import java.lang.annotation.ElementType;</span></span>
<span class="line"><span>import java.lang.annotation.Target;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>@Documented</span></span>
<span class="line"><span>@Target({ElementType.TYPE,ElementType.METHOD})</span></span>
<span class="line"><span>public @interface TestDocAnnotation {</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>	public String value() default &quot;default&quot;;</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@TestDocAnnotation(&quot;myMethodDoc&quot;)</span></span>
<span class="line"><span>public void testDoc() {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h4 id="元注解-inherited" tabindex="-1">元注解 - @Inherited <a class="header-anchor" href="#元注解-inherited" aria-label="Permalink to &quot;元注解 - @Inherited&quot;">​</a></h4><blockquote><p>Inherited注解的作用：被它修饰的Annotation将具有继承性。如果某个类使用了被@Inherited修饰的Annotation，则其子类将自动具有该注解。</p></blockquote><p>我们来测试下这个注解：</p><ul><li>定义<code>@Inherited</code>注解：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Inherited</span></span>
<span class="line"><span>@Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>@Target({ElementType.TYPE,ElementType.METHOD})</span></span>
<span class="line"><span>public @interface TestInheritedAnnotation {</span></span>
<span class="line"><span>    String [] values();</span></span>
<span class="line"><span>    int number();</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>使用这个注解</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@TestInheritedAnnotation(values = {&quot;value&quot;}, number = 10)</span></span>
<span class="line"><span>public class Person {</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Student extends Person{</span></span>
<span class="line"><span>	@Test</span></span>
<span class="line"><span>    public void test(){</span></span>
<span class="line"><span>        Class clazz = Student.class;</span></span>
<span class="line"><span>        Annotation[] annotations = clazz.getAnnotations();</span></span>
<span class="line"><span>        for (Annotation annotation : annotations) {</span></span>
<span class="line"><span>            System.out.println(annotation.toString());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>输出</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>xxxxxxx.TestInheritedAnnotation(values=[value], number=10)</span></span></code></pre></div><p>即使Student类没有显示地被注解<code>@TestInheritedAnnotation</code>，但是它的父类Person被注解，而且<code>@TestInheritedAnnotation</code>被<code>@Inherited</code>注解，因此Student类自动有了该注解。</p><h4 id="元注解-repeatable-java8" tabindex="-1">元注解 - @Repeatable (Java8) <a class="header-anchor" href="#元注解-repeatable-java8" aria-label="Permalink to &quot;元注解 - @Repeatable (Java8)&quot;">​</a></h4><p><code>@Repeatable</code>请参考<a href="https://pdai.tech/md/java/java8/java8-anno-repeat.html" target="_blank" rel="noreferrer">Java 8 - 重复注解</a></p><h4 id="元注解-native-java8" tabindex="-1">元注解 - @Native (Java8) <a class="header-anchor" href="#元注解-native-java8" aria-label="Permalink to &quot;元注解 - @Native (Java8)&quot;">​</a></h4><p>使用 @Native 注解修饰成员变量，则表示这个变量可以被本地代码引用，常常被代码生成工具使用。对于 @Native 注解不常使用，了解即可</p><h3 id="注解与反射接口" tabindex="-1">注解与反射接口 <a class="header-anchor" href="#注解与反射接口" aria-label="Permalink to &quot;注解与反射接口&quot;">​</a></h3><blockquote><p>定义注解后，如何获取注解中的内容呢？反射包java.lang.reflect下的AnnotatedElement接口提供这些方法。这里注意：只有注解被定义为RUNTIME后，该注解才能是运行时可见，当class文件被装载时被保存在class文件中的Annotation才会被虚拟机读取。</p></blockquote><p>AnnotatedElement 接口是所有程序元素（Class、Method和Constructor）的父接口，所以程序通过反射获取了某个类的AnnotatedElement对象之后，程序就可以调用该对象的方法来访问Annotation信息。我们看下具体的先关接口</p><ul><li><code>boolean isAnnotationPresent(Class&lt;?extends Annotation&gt; annotationClass)</code></li></ul><p>判断该程序元素上是否包含指定类型的注解，存在则返回true，否则返回false。注意：此方法会忽略注解对应的注解容器。</p><ul><li><code>&lt;T extends Annotation&gt; T getAnnotation(Class&lt;T&gt; annotationClass)</code></li></ul><p>返回该程序元素上存在的、指定类型的注解，如果该类型注解不存在，则返回null。</p><ul><li><code>Annotation[] getAnnotations()</code></li></ul><p>返回该程序元素上存在的所有注解，若没有注解，返回长度为0的数组。</p><ul><li><code>&lt;T extends Annotation&gt; T[] getAnnotationsByType(Class&lt;T&gt; annotationClass)</code></li></ul><p>返回该程序元素上存在的、指定类型的注解数组。没有注解对应类型的注解时，返回长度为0的数组。该方法的调用者可以随意修改返回的数组，而不会对其他调用者返回的数组产生任何影响。<code>getAnnotationsByType</code>方法与 <code>getAnnotation</code>的区别在于，<code>getAnnotationsByType</code>会检测注解对应的重复注解容器。若程序元素为类，当前类上找不到注解，且该注解为可继承的，则会去父类上检测对应的注解。</p><ul><li><code>&lt;T extends Annotation&gt; T getDeclaredAnnotation(Class&lt;T&gt; annotationClass)</code></li></ul><p>返回直接存在于此元素上的所有注解。与此接口中的其他方法不同，该方法将忽略继承的注释。如果没有注释直接存在于此元素上，则返回null</p><ul><li><code>&lt;T extends Annotation&gt; T[] getDeclaredAnnotationsByType(Class&lt;T&gt; annotationClass)</code></li></ul><p>返回直接存在于此元素上的所有注解。与此接口中的其他方法不同，该方法将忽略继承的注释</p><ul><li><code>Annotation[] getDeclaredAnnotations()</code></li></ul><p>返回直接存在于此元素上的所有注解及注解对应的重复注解容器。与此接口中的其他方法不同，该方法将忽略继承的注解。如果没有注释直接存在于此元素上，则返回长度为零的一个数组。该方法的调用者可以随意修改返回的数组，而不会对其他调用者返回的数组产生任何影响。</p><h3 id="自定义注解" tabindex="-1">自定义注解 <a class="header-anchor" href="#自定义注解" aria-label="Permalink to &quot;自定义注解&quot;">​</a></h3><blockquote><p>当我们理解了内置注解, 元注解和获取注解的反射接口后，我们便可以开始自定义注解了。这个例子我把上述的知识点全部融入进来, 代码很简单：</p></blockquote><ul><li>定义自己的注解</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package com.pdai.java.annotation;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.lang.annotation.ElementType;</span></span>
<span class="line"><span>import java.lang.annotation.Retention;</span></span>
<span class="line"><span>import java.lang.annotation.RetentionPolicy;</span></span>
<span class="line"><span>import java.lang.annotation.Target;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Target(ElementType.METHOD)</span></span>
<span class="line"><span>@Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>public @interface MyMethodAnnotation {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String title() default &quot;&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String description() default &quot;&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>使用注解</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package com.pdai.java.annotation;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.io.FileNotFoundException;</span></span>
<span class="line"><span>import java.lang.annotation.Annotation;</span></span>
<span class="line"><span>import java.lang.reflect.Method;</span></span>
<span class="line"><span>import java.util.ArrayList;</span></span>
<span class="line"><span>import java.util.List;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class TestMethodAnnotation {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    @MyMethodAnnotation(title = &quot;toStringMethod&quot;, description = &quot;override toString method&quot;)</span></span>
<span class="line"><span>    public String toString() {</span></span>
<span class="line"><span>        return &quot;Override toString method&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Deprecated</span></span>
<span class="line"><span>    @MyMethodAnnotation(title = &quot;old static method&quot;, description = &quot;deprecated old static method&quot;)</span></span>
<span class="line"><span>    public static void oldMethod() {</span></span>
<span class="line"><span>        System.out.println(&quot;old method, don&#39;t use it.&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @SuppressWarnings({&quot;unchecked&quot;, &quot;deprecation&quot;})</span></span>
<span class="line"><span>    @MyMethodAnnotation(title = &quot;test method&quot;, description = &quot;suppress warning static method&quot;)</span></span>
<span class="line"><span>    public static void genericsTest() throws FileNotFoundException {</span></span>
<span class="line"><span>        List l = new ArrayList();</span></span>
<span class="line"><span>        l.add(&quot;abc&quot;);</span></span>
<span class="line"><span>        oldMethod();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>用反射接口获取注解信息</li></ul><p>在TestMethodAnnotation中添加Main方法进行测试：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        // 获取所有methods</span></span>
<span class="line"><span>        Method[] methods = TestMethodAnnotation.class.getClassLoader()</span></span>
<span class="line"><span>                .loadClass((&quot;com.pdai.java.annotation.TestMethodAnnotation&quot;))</span></span>
<span class="line"><span>                .getMethods();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 遍历</span></span>
<span class="line"><span>        for (Method method : methods) {</span></span>
<span class="line"><span>            // 方法上是否有MyMethodAnnotation注解</span></span>
<span class="line"><span>            if (method.isAnnotationPresent(MyMethodAnnotation.class)) {</span></span>
<span class="line"><span>                try {</span></span>
<span class="line"><span>                    // 获取并遍历方法上的所有注解</span></span>
<span class="line"><span>                    for (Annotation anno : method.getDeclaredAnnotations()) {</span></span>
<span class="line"><span>                        System.out.println(&quot;Annotation in Method &#39;&quot;</span></span>
<span class="line"><span>                                + method + &quot;&#39; : &quot; + anno);</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                    // 获取MyMethodAnnotation对象信息</span></span>
<span class="line"><span>                    MyMethodAnnotation methodAnno = method</span></span>
<span class="line"><span>                            .getAnnotation(MyMethodAnnotation.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                    System.out.println(methodAnno.title());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                } catch (Throwable ex) {</span></span>
<span class="line"><span>                    ex.printStackTrace();</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } catch (SecurityException | ClassNotFoundException e) {</span></span>
<span class="line"><span>        e.printStackTrace();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>测试的输出</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Annotation in Method &#39;public static void com.pdai.java.annotation.TestMethodAnnotation.oldMethod()&#39; : @java.lang.Deprecated()</span></span>
<span class="line"><span>Annotation in Method &#39;public static void com.pdai.java.annotation.TestMethodAnnotation.oldMethod()&#39; : @com.pdai.java.annotation.MyMethodAnnotation(title=old static method, description=deprecated old static method)</span></span>
<span class="line"><span>old static method</span></span>
<span class="line"><span>Annotation in Method &#39;public static void com.pdai.java.annotation.TestMethodAnnotation.genericsTest() throws java.io.FileNotFoundException&#39; : @com.pdai.java.annotation.MyMethodAnnotation(title=test method, description=suppress warning static method)</span></span>
<span class="line"><span>test method</span></span>
<span class="line"><span>Annotation in Method &#39;public java.lang.String com.pdai.java.annotation.TestMethodAnnotation.toString()&#39; : @com.pdai.java.annotation.MyMethodAnnotation(title=toStringMethod, description=override toString method)</span></span>
<span class="line"><span>toStringMethod</span></span></code></pre></div><h2 id="深入理解注解" tabindex="-1">深入理解注解 <a class="header-anchor" href="#深入理解注解" aria-label="Permalink to &quot;深入理解注解&quot;">​</a></h2><p>提示</p><p>接下来，我们从其它角度深入理解注解</p><h3 id="java8提供了哪些新的注解" tabindex="-1">Java8提供了哪些新的注解？ <a class="header-anchor" href="#java8提供了哪些新的注解" aria-label="Permalink to &quot;Java8提供了哪些新的注解？&quot;">​</a></h3><ul><li><code>@Repeatable</code></li></ul><p>请参考<a href="https://pdai.tech/md/java/java8/java8-anno-repeat.html" target="_blank" rel="noreferrer">Java 8 - 重复注解</a></p><ul><li><code>ElementType.TYPE_USE</code></li></ul><p>请参考<a href="https://pdai.tech/md/java/java8/java8-type-anno.html" target="_blank" rel="noreferrer">Java 8 - 类型注解</a></p><ul><li><code>ElementType.TYPE_PARAMETER</code></li></ul><p><code>ElementType.TYPE_USE</code>(此类型包括类型声明和类型参数声明，是为了方便设计者进行类型检查)包含了<code>ElementType.TYPE</code>(类、接口（包括注解类型）和枚举的声明)和<code>ElementType.TYPE_PARAMETER</code>(类型参数声明), 不妨再看个例子</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 自定义ElementType.TYPE_PARAMETER注解</span></span>
<span class="line"><span>@Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>@Target(ElementType.TYPE_PARAMETER)</span></span>
<span class="line"><span>public @interface MyNotEmpty {</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 自定义ElementType.TYPE_USE注解</span></span>
<span class="line"><span>@Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>@Target(ElementType.TYPE_USE)</span></span>
<span class="line"><span>public @interface MyNotNull {</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 测试类</span></span>
<span class="line"><span>public class TypeParameterAndTypeUseAnnotation&lt;@MyNotEmpty T&gt;{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //使用TYPE_PARAMETER类型，会编译不通过</span></span>
<span class="line"><span>//		public @MyNotEmpty T test(@MyNotEmpty T a){</span></span>
<span class="line"><span>//			new ArrayList&lt;@MyNotEmpty String&gt;();</span></span>
<span class="line"><span>//				return a;</span></span>
<span class="line"><span>//		}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  //使用TYPE_USE类型，编译通过</span></span>
<span class="line"><span>  public @MyNotNull T test2(@MyNotNull T a){</span></span>
<span class="line"><span>    new ArrayList&lt;@MyNotNull String&gt;();</span></span>
<span class="line"><span>    return a;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="注解支持继承吗" tabindex="-1">注解支持继承吗？ <a class="header-anchor" href="#注解支持继承吗" aria-label="Permalink to &quot;注解支持继承吗？&quot;">​</a></h3><blockquote><p>注解是不支持继承的</p></blockquote><p>不能使用关键字extends来继承某个@interface，但注解在编译后，编译器会自动继承java.lang.annotation.Annotation接口.</p><p>虽然反编译后发现注解继承了Annotation接口，请记住，即使Java的接口可以实现多继承，但定义注解时依然无法使用extends关键字继承@interface。</p><p>区别于注解的继承，被注解的子类继承父类注解可以用@Inherited： 如果某个类使用了被@Inherited修饰的Annotation，则其子类将自动具有该注解。</p><h3 id="注解实现的原理" tabindex="-1">注解实现的原理？ <a class="header-anchor" href="#注解实现的原理" aria-label="Permalink to &quot;注解实现的原理？&quot;">​</a></h3><blockquote><p>网上很多标注解的原理文章根本没有说到点子上。</p></blockquote><p>这里推荐你两篇文章：</p><ul><li><a href="https://blog.csdn.net/qq%5C_20009015/article/details/106038023" target="_blank" rel="noreferrer">https://blog.csdn.net/qq\\_20009015/article/details/106038023</a></li><li><a href="https://www.race604.com/annotation-processing/" target="_blank" rel="noreferrer">https://www.race604.com/annotation-processing/</a></li></ul><h2 id="注解的应用场景" tabindex="-1">注解的应用场景 <a class="header-anchor" href="#注解的应用场景" aria-label="Permalink to &quot;注解的应用场景&quot;">​</a></h2><p>提示</p><p>最后我们再看看实际开发中注解的一些应用场景。@pdai</p><h3 id="配置化到注解化-框架的演进" tabindex="-1">配置化到注解化 - 框架的演进 <a class="header-anchor" href="#配置化到注解化-框架的演进" aria-label="Permalink to &quot;配置化到注解化 - 框架的演进&quot;">​</a></h3><p>Spring 框架 配置化到注解化的转变。</p><h3 id="继承实现到注解实现-junit3到junit4" tabindex="-1">继承实现到注解实现 - Junit3到Junit4 <a class="header-anchor" href="#继承实现到注解实现-junit3到junit4" aria-label="Permalink to &quot;继承实现到注解实现 - Junit3到Junit4&quot;">​</a></h3><blockquote><p>一个模块的封装大多数人都是通过继承和组合等模式来实现的，但是如果结合注解将可以极大程度提高实现的优雅度（降低耦合度）。而Junit3 到Junit4的演化就是最好的一个例子。</p></blockquote><ul><li>被测试类</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class HelloWorld {</span></span>
<span class="line"><span> 	</span></span>
<span class="line"><span> 	public void sayHello(){</span></span>
<span class="line"><span> 		System.out.println(&quot;hello....&quot;);</span></span>
<span class="line"><span> 		throw new NumberFormatException();</span></span>
<span class="line"><span> 	}</span></span>
<span class="line"><span> 	</span></span>
<span class="line"><span> 	public void sayWorld(){</span></span>
<span class="line"><span> 		System.out.println(&quot;world....&quot;);</span></span>
<span class="line"><span> 	}</span></span>
<span class="line"><span> 	</span></span>
<span class="line"><span> 	public String say(){</span></span>
<span class="line"><span> 		return &quot;hello world!&quot;;</span></span>
<span class="line"><span> 	}</span></span>
<span class="line"><span> 	</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>Junit 3 实现UT</li></ul><p>通过继承 TestCase来实现，初始化是通过Override父类方法来进行，测试方式通过test的前缀方法获取。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class HelloWorldTest extends TestCase{</span></span>
<span class="line"><span> 	private HelloWorld hw;</span></span>
<span class="line"><span> 	</span></span>
<span class="line"><span> 	@Override</span></span>
<span class="line"><span> 	protected void setUp() throws Exception {</span></span>
<span class="line"><span> 		super.setUp();</span></span>
<span class="line"><span> 		hw=new HelloWorld();</span></span>
<span class="line"><span> 	}</span></span>
<span class="line"><span> 	</span></span>
<span class="line"><span> 	//1.测试没有返回值</span></span>
<span class="line"><span> 	public void testHello(){</span></span>
<span class="line"><span> 		try {</span></span>
<span class="line"><span> 			hw.sayHello();</span></span>
<span class="line"><span> 		} catch (Exception e) {</span></span>
<span class="line"><span> 			System.out.println(&quot;发生异常.....&quot;);</span></span>
<span class="line"><span> 		}</span></span>
<span class="line"><span> 		</span></span>
<span class="line"><span> 	}</span></span>
<span class="line"><span> 	public void testWorld(){</span></span>
<span class="line"><span> 		hw.sayWorld();</span></span>
<span class="line"><span> 	}</span></span>
<span class="line"><span> 	//2.测试有返回值的方法</span></span>
<span class="line"><span> 	// 返回字符串</span></span>
<span class="line"><span> 	public void testSay(){</span></span>
<span class="line"><span> 		assertEquals(&quot;测试失败&quot;, hw.say(), &quot;hello world!&quot;);</span></span>
<span class="line"><span> 	}</span></span>
<span class="line"><span> 	//返回对象</span></span>
<span class="line"><span> 	public void testObj(){</span></span>
<span class="line"><span> 		assertNull(&quot;测试对象不为空&quot;, null);</span></span>
<span class="line"><span> 		assertNotNull(&quot;测试对象为空&quot;,new String());</span></span>
<span class="line"><span> 	}</span></span>
<span class="line"><span> 	@Override</span></span>
<span class="line"><span> 	protected void tearDown() throws Exception {</span></span>
<span class="line"><span> 		super.tearDown();</span></span>
<span class="line"><span> 		hw=null;</span></span>
<span class="line"><span> 	}	</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>Junit 4 实现UT</li></ul><p>通过定义@Before，@Test，@After等等注解来实现。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class HelloWorldTest {</span></span>
<span class="line"><span> 	private HelloWorld hw;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span> 	@Before</span></span>
<span class="line"><span> 	public void setUp() {</span></span>
<span class="line"><span> 		hw = new HelloWorld();</span></span>
<span class="line"><span> 	}</span></span>
<span class="line"><span> </span></span>
<span class="line"><span> 	@Test(expected=NumberFormatException.class)</span></span>
<span class="line"><span> 	// 1.测试没有返回值,有别于junit3的使用，更加方便</span></span>
<span class="line"><span> 	public void testHello() {</span></span>
<span class="line"><span> 		hw.sayHello();</span></span>
<span class="line"><span> 	}</span></span>
<span class="line"><span> 	@Test</span></span>
<span class="line"><span> 	public void testWorld() {</span></span>
<span class="line"><span> 		hw.sayWorld();</span></span>
<span class="line"><span> 	}</span></span>
<span class="line"><span> 	</span></span>
<span class="line"><span> 	@Test</span></span>
<span class="line"><span> 	// 2.测试有返回值的方法</span></span>
<span class="line"><span> 	// 返回字符串</span></span>
<span class="line"><span> 	public void testSay() {</span></span>
<span class="line"><span> 		assertEquals(&quot;测试失败&quot;, hw.say(), &quot;hello world!&quot;);</span></span>
<span class="line"><span> 	}</span></span>
<span class="line"><span> 	</span></span>
<span class="line"><span> 	@Test</span></span>
<span class="line"><span> 	// 返回对象</span></span>
<span class="line"><span> 	public void testObj() {</span></span>
<span class="line"><span> 		assertNull(&quot;测试对象不为空&quot;, null);</span></span>
<span class="line"><span> 		assertNotNull(&quot;测试对象为空&quot;, new String());</span></span>
<span class="line"><span> 	}</span></span>
<span class="line"><span> </span></span>
<span class="line"><span> 	@After</span></span>
<span class="line"><span> 	public void tearDown() throws Exception {</span></span>
<span class="line"><span> 		hw = null;</span></span>
<span class="line"><span> 	}</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这里我们发现通过注解的方式，我们实现单元测试时将更为优雅。如果你还期望了解Junit4是如何实现运行的呢？可以看这篇文章：<a href="https://blog.csdn.net/weixin_34043301/article/details/91799261" target="_blank" rel="noreferrer">JUnit4源码分析运行原理在新窗口打开</a>。</p><h3 id="自定义注解和aop-通过切面实现解耦" tabindex="-1">自定义注解和AOP - 通过切面实现解耦 <a class="header-anchor" href="#自定义注解和aop-通过切面实现解耦" aria-label="Permalink to &quot;自定义注解和AOP - 通过切面实现解耦&quot;">​</a></h3><blockquote><p>最为常见的就是使用Spring AOP切面实现<strong>统一的操作日志管理</strong>，我这里找了一个开源项目中的例子（只展示主要代码），给你展示下如何通过注解实现解耦的。</p></blockquote><ul><li>自定义Log注解</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Target({ ElementType.PARAMETER, ElementType.METHOD })</span></span>
<span class="line"><span>@Retention(RetentionPolicy.RUNTIME)</span></span>
<span class="line"><span>@Documented</span></span>
<span class="line"><span>public @interface Log {</span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 模块 </span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public String title() default &quot;&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 功能</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public BusinessType businessType() default BusinessType.OTHER;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 操作人类别</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public OperatorType operatorType() default OperatorType.MANAGE;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 是否保存请求的参数</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public boolean isSaveRequestData() default true;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>实现日志的切面, 对自定义注解Log作切点进行拦截</li></ul><p>即对注解了@Log的方法进行切点拦截，</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Aspect</span></span>
<span class="line"><span>@Component</span></span>
<span class="line"><span>public class LogAspect {</span></span>
<span class="line"><span>    private static final Logger log = LoggerFactory.getLogger(LogAspect.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 配置织入点 - 自定义注解的包路径</span></span>
<span class="line"><span>     * </span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Pointcut(&quot;@annotation(com.xxx.aspectj.lang.annotation.Log)&quot;)</span></span>
<span class="line"><span>    public void logPointCut() {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 处理完请求后执行</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param joinPoint 切点</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @AfterReturning(pointcut = &quot;logPointCut()&quot;, returning = &quot;jsonResult&quot;)</span></span>
<span class="line"><span>    public void doAfterReturning(JoinPoint joinPoint, Object jsonResult) {</span></span>
<span class="line"><span>        handleLog(joinPoint, null, jsonResult);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 拦截异常操作</span></span>
<span class="line"><span>     * </span></span>
<span class="line"><span>     * @param joinPoint 切点</span></span>
<span class="line"><span>     * @param e 异常</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @AfterThrowing(value = &quot;logPointCut()&quot;, throwing = &quot;e&quot;)</span></span>
<span class="line"><span>    public void doAfterThrowing(JoinPoint joinPoint, Exception e) {</span></span>
<span class="line"><span>        handleLog(joinPoint, e, null);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    protected void handleLog(final JoinPoint joinPoint, final Exception e, Object jsonResult) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            // 获得注解</span></span>
<span class="line"><span>            Log controllerLog = getAnnotationLog(joinPoint);</span></span>
<span class="line"><span>            if (controllerLog == null) {</span></span>
<span class="line"><span>                return;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // 获取当前的用户</span></span>
<span class="line"><span>            User currentUser = ShiroUtils.getSysUser();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            // *========数据库日志=========*//</span></span>
<span class="line"><span>            OperLog operLog = new OperLog();</span></span>
<span class="line"><span>            operLog.setStatus(BusinessStatus.SUCCESS.ordinal());</span></span>
<span class="line"><span>            // 请求的地址</span></span>
<span class="line"><span>            String ip = ShiroUtils.getIp();</span></span>
<span class="line"><span>            operLog.setOperIp(ip);</span></span>
<span class="line"><span>            // 返回参数</span></span>
<span class="line"><span>            operLog.setJsonResult(JSONObject.toJSONString(jsonResult));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            operLog.setOperUrl(ServletUtils.getRequest().getRequestURI());</span></span>
<span class="line"><span>            if (currentUser != null) {</span></span>
<span class="line"><span>                operLog.setOperName(currentUser.getLoginName());</span></span>
<span class="line"><span>                if (StringUtils.isNotNull(currentUser.getDept())</span></span>
<span class="line"><span>                        &amp;&amp; StringUtils.isNotEmpty(currentUser.getDept().getDeptName())) {</span></span>
<span class="line"><span>                    operLog.setDeptName(currentUser.getDept().getDeptName());</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            if (e != null) {</span></span>
<span class="line"><span>                operLog.setStatus(BusinessStatus.FAIL.ordinal());</span></span>
<span class="line"><span>                operLog.setErrorMsg(StringUtils.substring(e.getMessage(), 0, 2000));</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            // 设置方法名称</span></span>
<span class="line"><span>            String className = joinPoint.getTarget().getClass().getName();</span></span>
<span class="line"><span>            String methodName = joinPoint.getSignature().getName();</span></span>
<span class="line"><span>            operLog.setMethod(className + &quot;.&quot; + methodName + &quot;()&quot;);</span></span>
<span class="line"><span>            // 设置请求方式</span></span>
<span class="line"><span>            operLog.setRequestMethod(ServletUtils.getRequest().getMethod());</span></span>
<span class="line"><span>            // 处理设置注解上的参数</span></span>
<span class="line"><span>            getControllerMethodDescription(controllerLog, operLog);</span></span>
<span class="line"><span>            // 保存数据库</span></span>
<span class="line"><span>            AsyncManager.me().execute(AsyncFactory.recordOper(operLog));</span></span>
<span class="line"><span>        } catch (Exception exp) {</span></span>
<span class="line"><span>            // 记录本地异常日志</span></span>
<span class="line"><span>            log.error(&quot;==前置通知异常==&quot;);</span></span>
<span class="line"><span>            log.error(&quot;异常信息:{}&quot;, exp.getMessage());</span></span>
<span class="line"><span>            exp.printStackTrace();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 获取注解中对方法的描述信息 用于Controller层注解</span></span>
<span class="line"><span>     * </span></span>
<span class="line"><span>     * @param log 日志</span></span>
<span class="line"><span>     * @param operLog 操作日志</span></span>
<span class="line"><span>     * @throws Exception</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public void getControllerMethodDescription(Log log, OperLog operLog) throws Exception {</span></span>
<span class="line"><span>        // 设置action动作</span></span>
<span class="line"><span>        operLog.setBusinessType(log.businessType().ordinal());</span></span>
<span class="line"><span>        // 设置标题</span></span>
<span class="line"><span>        operLog.setTitle(log.title());</span></span>
<span class="line"><span>        // 设置操作人类别</span></span>
<span class="line"><span>        operLog.setOperatorType(log.operatorType().ordinal());</span></span>
<span class="line"><span>        // 是否需要保存request，参数和值</span></span>
<span class="line"><span>        if (log.isSaveRequestData()) {</span></span>
<span class="line"><span>            // 获取参数的信息，传入到数据库中。</span></span>
<span class="line"><span>            setRequestValue(operLog);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 获取请求的参数，放到log中</span></span>
<span class="line"><span>     * </span></span>
<span class="line"><span>     * @param operLog</span></span>
<span class="line"><span>     * @param request</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private void setRequestValue(OperLog operLog) {</span></span>
<span class="line"><span>        Map&lt;String, String[]&gt; map = ServletUtils.getRequest().getParameterMap();</span></span>
<span class="line"><span>        String params = JSONObject.toJSONString(map);</span></span>
<span class="line"><span>        operLog.setOperParam(StringUtils.substring(params, 0, 2000));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 是否存在注解，如果存在就获取</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private Log getAnnotationLog(JoinPoint joinPoint) throws Exception {</span></span>
<span class="line"><span>        Signature signature = joinPoint.getSignature();</span></span>
<span class="line"><span>        MethodSignature methodSignature = (MethodSignature) signature;</span></span>
<span class="line"><span>        Method method = methodSignature.getMethod();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (method != null)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            return method.getAnnotation(Log.class);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>使用@Log注解</li></ul><p>以一个简单的CRUD操作为例, 这里展示部分代码：每对“部门”进行操作就会产生一条操作日志存入数据库。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Controller</span></span>
<span class="line"><span>@RequestMapping(&quot;/system/dept&quot;)</span></span>
<span class="line"><span>public class DeptController extends BaseController {</span></span>
<span class="line"><span>    private String prefix = &quot;system/dept&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    private IDeptService deptService;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 新增保存部门</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Log(title = &quot;部门管理&quot;, businessType = BusinessType.INSERT)</span></span>
<span class="line"><span>    @RequiresPermissions(&quot;system:dept:add&quot;)</span></span>
<span class="line"><span>    @PostMapping(&quot;/add&quot;)</span></span>
<span class="line"><span>    @ResponseBody</span></span>
<span class="line"><span>    public AjaxResult addSave(@Validated Dept dept) {</span></span>
<span class="line"><span>        if (UserConstants.DEPT_NAME_NOT_UNIQUE.equals(deptService.checkDeptNameUnique(dept))) {</span></span>
<span class="line"><span>            return error(&quot;新增部门&#39;&quot; + dept.getDeptName() + &quot;&#39;失败，部门名称已存在&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return toAjax(deptService.insertDept(dept));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 保存</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Log(title = &quot;部门管理&quot;, businessType = BusinessType.UPDATE)</span></span>
<span class="line"><span>    @RequiresPermissions(&quot;system:dept:edit&quot;)</span></span>
<span class="line"><span>    @PostMapping(&quot;/edit&quot;)</span></span>
<span class="line"><span>    @ResponseBody</span></span>
<span class="line"><span>    public AjaxResult editSave(@Validated Dept dept) {</span></span>
<span class="line"><span>        if (UserConstants.DEPT_NAME_NOT_UNIQUE.equals(deptService.checkDeptNameUnique(dept))) {</span></span>
<span class="line"><span>            return error(&quot;修改部门&#39;&quot; + dept.getDeptName() + &quot;&#39;失败，部门名称已存在&quot;);</span></span>
<span class="line"><span>        } else if(dept.getParentId().equals(dept.getDeptId())) {</span></span>
<span class="line"><span>            return error(&quot;修改部门&#39;&quot; + dept.getDeptName() + &quot;&#39;失败，上级部门不能是自己&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return toAjax(deptService.updateDept(dept));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 删除</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Log(title = &quot;部门管理&quot;, businessType = BusinessType.DELETE)</span></span>
<span class="line"><span>    @RequiresPermissions(&quot;system:dept:remove&quot;)</span></span>
<span class="line"><span>    @GetMapping(&quot;/remove/{deptId}&quot;)</span></span>
<span class="line"><span>    @ResponseBody</span></span>
<span class="line"><span>    public AjaxResult remove(@PathVariable(&quot;deptId&quot;) Long deptId) {</span></span>
<span class="line"><span>        if (deptService.selectDeptCount(deptId) &gt; 0) {</span></span>
<span class="line"><span>            return AjaxResult.warn(&quot;存在下级部门,不允许删除&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (deptService.checkDeptExistUser(deptId)) {</span></span>
<span class="line"><span>            return AjaxResult.warn(&quot;部门存在用户,不允许删除&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return toAjax(deptService.deleteDeptById(deptId));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><blockquote><p>同样的，你也可以看到权限管理也是通过类似的注解（<code>@RequiresPermissions</code>）机制来实现的。所以我们可以看到，通过注解+AOP最终的目标是为了实现模块的解耦。</p></blockquote><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li><a href="https://blog.csdn.net/javazejian/article/details/71860633" target="_blank" rel="noreferrer">https://blog.csdn.net/javazejian/article/details/71860633</a></li><li><a href="https://blog.csdn.net/qq%5C_20009015/article/details/106038023" target="_blank" rel="noreferrer">https://blog.csdn.net/qq\\_20009015/article/details/106038023</a></li><li><a href="https://www.zhihu.com/question/47449512" target="_blank" rel="noreferrer">https://www.zhihu.com/question/47449512</a></li><li><a href="https://www.race604.com/annotation-processing/" target="_blank" rel="noreferrer">https://www.race604.com/annotation-processing/</a></li><li><a href="https://www.runoob.com/w3cnote/java-annotation.html" target="_blank" rel="noreferrer">https://www.runoob.com/w3cnote/java-annotation.html</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,142)]))}const g=s(t,[["render",l]]);export{h as __pageData,g as default};
