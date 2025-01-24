import{_ as s,a as n}from"./chunks/dev-package-lombok-3.uMezgXQY.js";import{_ as p,c as e,ai as l,o as i}from"./chunks/framework.BrYByd3F.js";const o="/vitepress-blog-template/images/develop/package/dev-package-lombok-5.png",t="/vitepress-blog-template/images/develop/package/dev-package-lombok-4.png",c="/vitepress-blog-template/images/develop/package/dev-package-lombok-1.png",L=JSON.parse('{"title":"常用开发库 - Lombok工具库详解","description":"","frontmatter":{},"headers":[],"relativePath":"develop/package/dev-package-x-lombok.md","filePath":"develop/package/dev-package-x-lombok.md","lastUpdated":1737706346000}'),r={name:"develop/package/dev-package-x-lombok.md"};function d(u,a,g,h,b,m){return i(),e("div",null,a[0]||(a[0]=[l('<h1 id="常用开发库-lombok工具库详解" tabindex="-1">常用开发库 - Lombok工具库详解 <a class="header-anchor" href="#常用开发库-lombok工具库详解" aria-label="Permalink to &quot;常用开发库 - Lombok工具库详解&quot;">​</a></h1><blockquote><p>Lombok是一款非常实用Java工具，可用来帮助开发人员消除Java的冗长代码，尤其是对于简单的Java对象（POJO）。实际上我并不推荐使用Lombok（不主动使用它）, 但是因为它有着很大的使用量，我们仍然有必要掌握它，不仅知道如何使用和它解决的问题，还要知道它的坑。@pdai</p></blockquote><h2 id="lombok的引入" tabindex="-1">Lombok的引入 <a class="header-anchor" href="#lombok的引入" aria-label="Permalink to &quot;Lombok的引入&quot;">​</a></h2><p>我们通常需要编写大量代码才能使类变得有用。如以下内容：</p><ul><li><code>toString()</code>方法</li><li><code>hashCode()</code> and <code>equals()</code>方法</li><li><code>Getter</code> and <code>Setter</code> 方法</li><li>构造函数</li></ul><p>对于这种简单的类，这些方法通常是无聊的、重复的，而且是可以很容易地机械地生成的那种东西(ide通常提供这种功能)。</p><h3 id="在引入lombok之前我们是怎么做的" tabindex="-1">在引入Lombok之前我们是怎么做的 <a class="header-anchor" href="#在引入lombok之前我们是怎么做的" aria-label="Permalink to &quot;在引入Lombok之前我们是怎么做的&quot;">​</a></h3><p>IDE中添加<code>getter/setter</code>, <code>toString</code>等代码</p><p><img src="'+o+'" alt="error.图片加载失败"></p><h2 id="lombok的安装和使用" tabindex="-1">Lombok的安装和使用 <a class="header-anchor" href="#lombok的安装和使用" aria-label="Permalink to &quot;Lombok的安装和使用&quot;">​</a></h2><blockquote><p>下面总结下如何使用。</p></blockquote><h3 id="lombok官网" tabindex="-1">Lombok官网 <a class="header-anchor" href="#lombok官网" aria-label="Permalink to &quot;Lombok官网&quot;">​</a></h3><ul><li><a href="https://projectlombok.org/" target="_blank" rel="noreferrer">Lombok官网在新窗口打开</a></li></ul><h3 id="lombok安装" tabindex="-1">Lombok安装 <a class="header-anchor" href="#lombok安装" aria-label="Permalink to &quot;Lombok安装&quot;">​</a></h3><p>IDEA搜索Lombok插件</p><p><img src="'+t+`" alt="error.图片加载失败"></p><p>另外需要注意的是，在使用lombok注解的时候记得要导入lombok.jar包到工程，如果使用的是Maven的工程项目的话，要在其pom.xml中添加依赖如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;!-- https://mvnrepository.com/artifact/org.projectlombok/lombok --&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.projectlombok&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;lombok&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;1.18.12&lt;/version&gt;</span></span>
<span class="line"><span>    &lt;scope&gt;provided&lt;/scope&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><h3 id="lombok注解说明" tabindex="-1">Lombok注解说明 <a class="header-anchor" href="#lombok注解说明" aria-label="Permalink to &quot;Lombok注解说明&quot;">​</a></h3><p>看<a href="https://projectlombok.org/features/all" target="_blank" rel="noreferrer">官网这里在新窗口打开</a></p><ul><li><code>val</code>：用在局部变量前面，相当于将变量声明为final</li><li><code>@NonNull</code>：给方法参数增加这个注解会自动在方法内对该参数进行是否为空的校验，如果为空，则抛出<code>NPE</code>（NullPointerException）</li><li><code>@Cleanup</code>：自动管理资源，用在局部变量之前，在当前变量范围内即将执行完毕退出之前会自动清理资源，自动生成<code>try-finally</code>这样的代码来关闭流</li><li><code>@Getter/@Setter</code>：用在属性上，再也不用自己手写<code>setter</code>和<code>getter</code>方法了，还可以指定访问范围</li><li><code>@ToString</code>：用在类上，可以自动覆写<code>toString</code>方法，当然还可以加其他参数，例如<code>@ToString(exclude=”id”)</code>排除id属性，或者<code>@ToString(callSuper=true, includeFieldNames=true)</code>调用父类的<code>toString</code>方法，包含所有属性</li><li><code>@EqualsAndHashCode</code>：用在类上，自动生成<code>equals</code>方法和<code>hashCode</code>方法</li><li><code>@NoArgsConstructor</code>, <code>@RequiredArgsConstructor</code> and <code>@AllArgsConstructor</code>：用在类上，自动生成无参构造和使用所有参数的构造函数以及把所有+ <code>@NonNull属性作为参数的构造函数，如果指定</code>staticName = “of”\`参数，同时还会生成一个返回类对象的静态工厂方法，比使用构造函数方便很多</li><li><code>@Data</code>：注解在类上，相当于同时使用了<code>@ToString</code>、<code>@EqualsAndHashCode</code>、<code>@Getter</code>、<code>@Setter</code>和<code>@RequiredArgsConstrutor</code>这些注解，对于POJO类十分有用</li><li><code>@Value</code>：用在类上，是<code>@Data</code>的不可变形式，相当于为属性添加final声明，只提供getter方法，而不提供setter方法</li><li><code>@Builder</code>：用在类、构造器、方法上，为你提供复杂的builder APIs，让你可以像如下方式一样调用<code>Person.builder().name(&quot;Adam Savage&quot;).city(&quot;San Francisco&quot;).job(&quot;Mythbusters&quot;).job(&quot;Unchained Reaction&quot;).build()</code>;更多说明参考Builder</li><li><code>@SneakyThrows</code>：自动抛受检异常，而无需显式在方法上使用throws语句</li><li><code>@Synchronized</code>：用在方法上，将方法声明为同步的，并自动加锁，而锁对象是一个私有的属性<code>$lock</code>或<code>$LOCK</code>，而java中的synchronized关键字锁对象是this，锁在this或者自己的类对象上存在副作用，就是你不能阻止非受控代码去锁this或者类对象，这可能会导致竞争条件或者其它线程错误</li><li><code>@Getter(lazy=true)</code>：可以替代经典的Double Check Lock样板代码</li><li><code>@Log</code>：根据不同的注解生成不同类型的log对象，但是实例名称都是log，有六种可选实现类</li><li><code>@CommonsLog</code> Creates log = org.apache.commons.logging.LogFactory.getLog(LogExample.class);</li><li><code>@Log</code> Creates log = java.util.logging.Logger.getLogger(LogExample.class.getName());</li><li><code>@Log4j</code> Creates log = org.apache.log4j.Logger.getLogger(LogExample.class);</li><li><code>@Log4j2</code> Creates log = org.apache.logging.log4j.LogManager.getLogger(LogExample.class);</li><li><code>@Slf4j</code> Creates log = org.slf4j.LoggerFactory.getLogger(LogExample.class);</li><li><code>@XSlf4j</code> Creates log = org.slf4j.ext.XLoggerFactory.getXLogger(LogExample.class);</li></ul><h3 id="lombok代码示例" tabindex="-1">Lombok代码示例 <a class="header-anchor" href="#lombok代码示例" aria-label="Permalink to &quot;Lombok代码示例&quot;">​</a></h3><ul><li>val示例</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) {</span></span>
<span class="line"><span>    val sets = new HashSet&lt;String&gt;();</span></span>
<span class="line"><span>    val lists = new ArrayList&lt;String&gt;();</span></span>
<span class="line"><span>    val maps = new HashMap&lt;String, String&gt;();</span></span>
<span class="line"><span>    //=&gt;相当于如下</span></span>
<span class="line"><span>    final Set&lt;String&gt; sets2 = new HashSet&lt;&gt;();</span></span>
<span class="line"><span>    final List&lt;String&gt; lists2 = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    final Map&lt;String, String&gt; maps2 = new HashMap&lt;&gt;();</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><code>@NonNull</code>示例</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void notNullExample(@NonNull String string) {</span></span>
<span class="line"><span>    string.length();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//=&gt;相当于</span></span>
<span class="line"><span>public void notNullExample(String string) {</span></span>
<span class="line"><span>    if (string != null) {</span></span>
<span class="line"><span>        string.length();</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        throw new NullPointerException(&quot;null&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><code>@Cleanup</code>示例</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static void main(String[] args) {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        @Cleanup InputStream inputStream = new FileInputStream(args[0]);</span></span>
<span class="line"><span>    } catch (FileNotFoundException e) {</span></span>
<span class="line"><span>        e.printStackTrace();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //=&gt;相当于</span></span>
<span class="line"><span>    InputStream inputStream = null;</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        inputStream = new FileInputStream(args[0]);</span></span>
<span class="line"><span>    } catch (FileNotFoundException e) {</span></span>
<span class="line"><span>        e.printStackTrace();</span></span>
<span class="line"><span>    } finally {</span></span>
<span class="line"><span>        if (inputStream != null) {</span></span>
<span class="line"><span>            try {</span></span>
<span class="line"><span>                inputStream.close();</span></span>
<span class="line"><span>            } catch (IOException e) {</span></span>
<span class="line"><span>                e.printStackTrace();</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><code>@Getter/@Setter</code>示例</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Setter(AccessLevel.PUBLIC)</span></span>
<span class="line"><span>@Getter(AccessLevel.PROTECTED)</span></span>
<span class="line"><span>private int id;</span></span>
<span class="line"><span>private String shape;</span></span></code></pre></div><ul><li><code>@ToString</code>示例</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@ToString(exclude = &quot;id&quot;, callSuper = true, includeFieldNames = true)</span></span>
<span class="line"><span>public class LombokDemo {</span></span>
<span class="line"><span>    private int id;</span></span>
<span class="line"><span>    private String name;</span></span>
<span class="line"><span>    private int age;</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        //输出LombokDemo(super=LombokDemo@48524010, name=null, age=0)</span></span>
<span class="line"><span>        System.out.println(new LombokDemo());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><code>@EqualsAndHashCode</code>示例</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@EqualsAndHashCode(exclude = {&quot;id&quot;, &quot;shape&quot;}, callSuper = false)</span></span>
<span class="line"><span>public class LombokDemo {</span></span>
<span class="line"><span>    private int id;</span></span>
<span class="line"><span>    private String shape;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><code>@NoArgsConstructor</code>, <code>@RequiredArgsConstructor</code> and <code>@AllArgsConstructor</code>示例</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@NoArgsConstructor</span></span>
<span class="line"><span>@RequiredArgsConstructor(staticName = &quot;of&quot;)</span></span>
<span class="line"><span>@AllArgsConstructor</span></span>
<span class="line"><span>public class LombokDemo {</span></span>
<span class="line"><span>    @NonNull</span></span>
<span class="line"><span>    private int id;</span></span>
<span class="line"><span>    @NonNull</span></span>
<span class="line"><span>    private String shape;</span></span>
<span class="line"><span>    private int age;</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        new LombokDemo(1, &quot;circle&quot;);</span></span>
<span class="line"><span>        //使用静态工厂方法</span></span>
<span class="line"><span>        LombokDemo.of(2, &quot;circle&quot;);</span></span>
<span class="line"><span>        //无参构造</span></span>
<span class="line"><span>        new LombokDemo();</span></span>
<span class="line"><span>        //包含所有参数</span></span>
<span class="line"><span>        new LombokDemo(1, &quot;circle&quot;, 2);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><code>@Data</code>示例</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import lombok.Data;</span></span>
<span class="line"><span>@Data</span></span>
<span class="line"><span>public class Menu {</span></span>
<span class="line"><span>    private String shopId;</span></span>
<span class="line"><span>    private String skuMenuId;</span></span>
<span class="line"><span>    private String skuName;</span></span>
<span class="line"><span>    private String normalizeSkuName;</span></span>
<span class="line"><span>    private String dishMenuId;</span></span>
<span class="line"><span>    private String dishName;</span></span>
<span class="line"><span>    private String dishNum;</span></span>
<span class="line"><span>    //默认阈值</span></span>
<span class="line"><span>    private float thresHold = 0;</span></span>
<span class="line"><span>    //新阈值</span></span>
<span class="line"><span>    private float newThresHold = 0;</span></span>
<span class="line"><span>    //总得分</span></span>
<span class="line"><span>    private float totalScore = 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><code>@Value</code>示例</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Value</span></span>
<span class="line"><span>public class LombokDemo {</span></span>
<span class="line"><span>    @NonNull</span></span>
<span class="line"><span>    private int id;</span></span>
<span class="line"><span>    @NonNull</span></span>
<span class="line"><span>    private String shap;</span></span>
<span class="line"><span>    private int age;</span></span>
<span class="line"><span>    //相当于</span></span>
<span class="line"><span>    private final int id;</span></span>
<span class="line"><span>    public int getId() {</span></span>
<span class="line"><span>        return this.id;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><code>@Builder</code>示例</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Builder</span></span>
<span class="line"><span>public class BuilderExample {</span></span>
<span class="line"><span>    private String name;</span></span>
<span class="line"><span>    private int age;</span></span>
<span class="line"><span>    @Singular</span></span>
<span class="line"><span>    private Set&lt;String&gt; occupations;</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        LombokDemo3 test = LombokDemo3.builder().age(11).name(&quot;test&quot;)</span></span>
<span class="line"><span>                .occupation(&quot;1&quot;)</span></span>
<span class="line"><span>                .occupation(&quot;2&quot;)</span></span>
<span class="line"><span>                .build();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>@Singular可以为集合类型的参数或字段生成一种特殊的方法, 它采用修改列表中一个元素而不是整个列表的方式，可以是增加一个元素，也可以是删除一个元素。</p><p>在使用@Singular注释注释一个集合字段（使用@Builder注释类），lombok会将该构建器节点视为一个集合，并生成两个adder方法而不是setter方法。</p><p>生成代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public LombokDemo3.LombokDemo3Builder occupation(String occupation) {</span></span>
<span class="line"><span>    if (this.occupations == null) {</span></span>
<span class="line"><span>        this.occupations = new ArrayList();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    this.occupations.add(occupation);</span></span>
<span class="line"><span>    return this;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public LombokDemo3.LombokDemo3Builder occupations(Collection&lt;? extends String&gt; occupations) {</span></span>
<span class="line"><span>    if (occupations == null) {</span></span>
<span class="line"><span>        throw new NullPointerException(&quot;occupations cannot be null&quot;);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        if (this.occupations == null) {</span></span>
<span class="line"><span>            this.occupations = new ArrayList();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        this.occupations.addAll(occupations);</span></span>
<span class="line"><span>        return this;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public LombokDemo3.LombokDemo3Builder clearOccupations() {</span></span>
<span class="line"><span>    if (this.occupations != null) {</span></span>
<span class="line"><span>        this.occupations.clear();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return this;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>Builder.Default</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Builder</span></span>
<span class="line"><span>@ToString</span></span>
<span class="line"><span>public class BuilderDefaultExample {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Builder.Default</span></span>
<span class="line"><span>    private final String id = UUID.randomUUID().toString();</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    private String username;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Builder.Default</span></span>
<span class="line"><span>    private long insertTime = System.currentTimeMillis();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><code>@SneakyThrows</code>示例</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import lombok.SneakyThrows;</span></span>
<span class="line"><span>import java.io.FileInputStream;</span></span>
<span class="line"><span>import java.io.FileNotFoundException;</span></span>
<span class="line"><span>import java.io.InputStream;</span></span>
<span class="line"><span>import java.io.UnsupportedEncodingException;</span></span>
<span class="line"><span>public class Test {</span></span>
<span class="line"><span>    @SneakyThrows()</span></span>
<span class="line"><span>    public void read() {</span></span>
<span class="line"><span>        InputStream inputStream = new FileInputStream(&quot;&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    @SneakyThrows</span></span>
<span class="line"><span>    public void write() {</span></span>
<span class="line"><span>        throw new UnsupportedEncodingException();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //相当于</span></span>
<span class="line"><span>    public void read() throws FileNotFoundException {</span></span>
<span class="line"><span>        InputStream inputStream = new FileInputStream(&quot;&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public void write() throws UnsupportedEncodingException {</span></span>
<span class="line"><span>        throw new UnsupportedEncodingException();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><code>@Synchronized</code>示例</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class SynchronizedDemo {</span></span>
<span class="line"><span>    @Synchronized</span></span>
<span class="line"><span>    public static void hello() {</span></span>
<span class="line"><span>        System.out.println(&quot;world&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    //相当于</span></span>
<span class="line"><span>    private static final Object $LOCK = new Object[0];</span></span>
<span class="line"><span>    public static void hello() {</span></span>
<span class="line"><span>        synchronized ($LOCK) {</span></span>
<span class="line"><span>            System.out.println(&quot;world&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><code>@Getter(lazy = true)</code>示例</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class GetterLazyExample {</span></span>
<span class="line"><span>    @Getter(lazy = true)</span></span>
<span class="line"><span>    private final double[] cached = expensive();</span></span>
<span class="line"><span>    private double[] expensive() {</span></span>
<span class="line"><span>        double[] result = new double[1000000];</span></span>
<span class="line"><span>        for (int i = 0; i &lt; result.length; i++) {</span></span>
<span class="line"><span>            result[i] = Math.asin(i);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return result;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 相当于如下所示: </span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.concurrent.atomic.AtomicReference;</span></span>
<span class="line"><span>public class GetterLazyExample {</span></span>
<span class="line"><span>    private final AtomicReference&lt;java.lang.Object&gt; cached = new AtomicReference&lt;&gt;();</span></span>
<span class="line"><span>    public double[] getCached() {</span></span>
<span class="line"><span>        java.lang.Object value = this.cached.get();</span></span>
<span class="line"><span>        if (value == null) {</span></span>
<span class="line"><span>            synchronized (this.cached) {</span></span>
<span class="line"><span>                value = this.cached.get();</span></span>
<span class="line"><span>                if (value == null) {</span></span>
<span class="line"><span>                    final double[] actualValue = expensive();</span></span>
<span class="line"><span>                    value = actualValue == null ? this.cached : actualValue;</span></span>
<span class="line"><span>                    this.cached.set(value);</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return (double[]) (value == this.cached ? null : value);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    private double[] expensive() {</span></span>
<span class="line"><span>        double[] result = new double[1000000];</span></span>
<span class="line"><span>        for (int i = 0; i &lt; result.length; i++) {</span></span>
<span class="line"><span>            result[i] = Math.asin(i);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return result;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="lombok深入理解" tabindex="-1">Lombok深入理解 <a class="header-anchor" href="#lombok深入理解" aria-label="Permalink to &quot;Lombok深入理解&quot;">​</a></h2><blockquote><p>接下来我们深入理解下Lombok：</p></blockquote><h3 id="lombok解决了什么问题" tabindex="-1">Lombok解决了什么问题 <a class="header-anchor" href="#lombok解决了什么问题" aria-label="Permalink to &quot;Lombok解决了什么问题&quot;">​</a></h3><p>这个简单，就是简化代码。</p><h3 id="lombok的原理" tabindex="-1">Lombok的原理 <a class="header-anchor" href="#lombok的原理" aria-label="Permalink to &quot;Lombok的原理&quot;">​</a></h3><blockquote><p>会发现在Lombok使用的过程中，只需要添加相应的注解，无需再为此写任何代码。自动生成的代码到底是如何产生的呢？</p></blockquote><p>核心之处就是对于注解的解析上。JDK5引入了注解的同时，也提供了两种解析方式。</p><ul><li><strong>运行时解析</strong></li></ul><p>运行时能够解析的注解，必须将@Retention设置为RUNTIME, 比如<code>@Retention(RetentionPolicy.RUNTIME)</code>，这样就可以通过反射拿到该注解。java.lang,reflect反射包中提供了一个接口AnnotatedElement，该接口定义了获取注解信息的几个方法，Class、Constructor、Field、Method、Package等都实现了该接口，对反射熟悉的朋友应该都会很熟悉这种解析方式。</p><ul><li><strong>编译时解析</strong></li></ul><p>编译时解析有两种机制，分别简单描述下：</p><p>1）Annotation Processing Tool</p><p>apt自JDK5产生，JDK7已标记为过期，不推荐使用，JDK8中已彻底删除，自JDK6开始，可以使用Pluggable Annotation Processing API来替换它，apt被替换主要有2点原因：</p><ul><li>api都在com.sun.mirror非标准包下</li><li>没有集成到javac中，需要额外运行</li></ul><p>2）Pluggable Annotation Processing API</p><p><a href="https://www.jcp.org/en/jsr/proposalDetails?id=269" target="_blank" rel="noreferrer">JSR 269: Pluggable Annotation Processing API在新窗口打开</a>自JDK6加入，作为apt的替代方案，它解决了apt的两个问题，javac在执行的时候会调用实现了该API的程序，这样我们就可以对编译器做一些增强，这时javac执行的过程如下：</p><p><img src="`+s+'" alt="error.图片加载失败"></p><p>Lombok本质上就是一个实现了“JSR 269 API”的程序。在使用javac的过程中，它产生作用的具体流程如下：</p><ul><li>javac对源代码进行分析，生成了一棵抽象语法树（AST）</li><li>运行过程中调用实现了“JSR 269 API”的Lombok程序</li><li>此时Lombok就对第一步骤得到的AST进行处理，找到@Data注解所在类对应的语法树（AST），然后修改该语法树（AST），增加getter和setter方法定义的相应树节点</li><li>javac使用修改后的抽象语法树（AST）生成字节码文件，即给class增加新的节点（代码块）</li></ul><p><img src="'+n+'" alt="error.图片加载失败"></p><p>从上面的Lombok执行的流程图中可以看出，在Javac 解析成AST抽象语法树之后, Lombok 根据自己编写的注解处理器，动态地修改 AST，增加新的节点（即Lombok自定义注解所需要生成的代码），最终通过分析生成JVM可执行的字节码Class文件。使用Annotation Processing自定义注解是在编译阶段进行修改，而JDK的反射技术是在运行时动态修改，两者相比，反射虽然更加灵活一些但是带来的性能损耗更加大。</p><h3 id="lombok类似原理工具有什么" tabindex="-1">Lombok类似原理工具有什么 <a class="header-anchor" href="#lombok类似原理工具有什么" aria-label="Permalink to &quot;Lombok类似原理工具有什么&quot;">​</a></h3><blockquote><p>换言之，我们可以通过Lombok同样的思路解决什么问题？ @pdai</p></blockquote><ul><li>第一个问题，我可以通过上述原理，自己实现一个类似Lombok 吗？</li></ul><p>可以的，给你找了<a href="https://www.jianshu.com/p/fc06578e805a" target="_blank" rel="noreferrer">一篇文章在新窗口打开</a></p><ul><li>还有一些其它类库使用这种方式实现，比如: <ul><li><a href="https://github.com/google/auto" target="_blank" rel="noreferrer">Google Auto在新窗口打开</a></li><li>Dagger</li><li>...</li></ul></li></ul><h3 id="lombok没有未来-java14-record了解下" tabindex="-1">Lombok没有未来 - Java14 Record了解下 <a class="header-anchor" href="#lombok没有未来-java14-record了解下" aria-label="Permalink to &quot;Lombok没有未来 - Java14 Record了解下&quot;">​</a></h3><blockquote><p>Lombok是没有未来的，因为Java完全可以对于这种纯数据载体通过另外一种方式表示, 所以有了<a href="https://openjdk.java.net/jeps/359" target="_blank" rel="noreferrer">JEP 359: Records在新窗口打开</a>, 简单而言就是通过一个语法糖来解决。</p></blockquote><p><img src="'+c+`" alt="error.图片加载失败"></p><ul><li>从前</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Range {</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    private final int min;</span></span>
<span class="line"><span>    private final int max;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    public Range(int min, int max) {</span></span>
<span class="line"><span>        this.min = min;</span></span>
<span class="line"><span>        this.max = max;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    public int getMin() {</span></span>
<span class="line"><span>        return min;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    public int getMax() {</span></span>
<span class="line"><span>        return max;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean equals(Object o) {</span></span>
<span class="line"><span>        if (this == o) return true;</span></span>
<span class="line"><span>        if (o == null || getClass() != o.getClass()) return false;</span></span>
<span class="line"><span>        Range range = (Range) o;</span></span>
<span class="line"><span>        return min == range.min &amp;&amp; max == range.max;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public int hashCode() {</span></span>
<span class="line"><span>        return Objects.hash(min, max);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public String toString() {</span></span>
<span class="line"><span>        return &quot;Range{&quot; +</span></span>
<span class="line"><span>          &quot;min=&quot; + min +</span></span>
<span class="line"><span>          &quot;, max=&quot; + max +</span></span>
<span class="line"><span>          &#39;}&#39;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>Java14 record</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public record Range(int min, int max) {}</span></span></code></pre></div><p>没错就是这个简单！这个语法糖是不是有 “卧槽” 的感觉？我们声明这种类使用record 标识（目前不知道 record 会不会上升到关键字的高度）。当你用record 声明一个类时，该类将自动拥有以下功能：</p><ul><li>获取成员变量的简单方法，以上面代码为例 min() 和 max() 。注意区别于我们平常getter的写法。</li><li>一个 equals 方法的实现，执行比较时会比较该类的所有成员属性</li><li>重写 equals 当然要重写 hashCode</li><li>一个可以打印该类所有成员属性的 toString 方法。</li><li>请注意只会有一个构造方法。</li></ul><p>因为这个特性是 preview feature，默认情况下是无法编译和执行的。同样以上面为例我们需要执行：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> $ javac -d classes --enable-preview --release 14 Range.java</span></span>
<span class="line"><span> $ java -classpath classes --enable-preview Range</span></span></code></pre></div><p>在 Jshell 中运行</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>jshell&gt; Range r = new Range(10, 20);</span></span>
<span class="line"><span>r ==&gt; Range[min=10, max=20]</span></span>
<span class="line"><span>jshell&gt; r.min()</span></span>
<span class="line"><span>$5 ==&gt; 10</span></span>
<span class="line"><span>jshell&gt; r.toString()</span></span>
<span class="line"><span>$6 ==&gt; &quot;Range[min=10, max=20]&quot;</span></span>
<span class="line"><span>jshell&gt; r</span></span>
<span class="line"><span>r ==&gt; Range[min=10, max=20]</span></span></code></pre></div><p>虽然 record 声明的类没有 final 关键字，实际上它是一个不可变类。除了一些限制外，它依旧是一个普通的Java 类。因此，我们可以像添加普通类一样添加逻辑。我们可以在构造实例时强制执行前提条件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public record Range(int min, int max) {</span></span>
<span class="line"><span>    public Range {</span></span>
<span class="line"><span>        if (min &gt;= max)</span></span>
<span class="line"><span>            throw new IllegalArgumentException(&quot;min should be less than max&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>另外我们也可以给 Records 类增加普通方法、静态属性、静态方法，这里不再举例；</p><p><strong>为了简化语法糖的推理，不能在类内声明成员属性</strong>。以下是错误的示范：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public record Range(int min, int max) {</span></span>
<span class="line"><span>    // 错误的示范</span></span>
<span class="line"><span>    private String name;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="lombok有什么坑" tabindex="-1">Lombok有什么坑 <a class="header-anchor" href="#lombok有什么坑" aria-label="Permalink to &quot;Lombok有什么坑&quot;">​</a></h2><blockquote><p>谈谈Lombok容易被忽视的坑, 看似代码简洁背后的代价。@pdai</p></blockquote><h3 id="data的坑" tabindex="-1"><code>@Data</code>的坑 <a class="header-anchor" href="#data的坑" aria-label="Permalink to &quot;\`@Data\`的坑&quot;">​</a></h3><p>在使用Lombok过程中，如果对于各种注解的底层原理不理解的话，很容易产生意想不到的结果。</p><p>举一个简单的例子，我们知道，当我们使用<code>@Data</code>定义一个类的时候，会自动帮我们生成<code>equals()</code>方法 。</p><p>但是如果只使用了<code>@Data</code>，而不使用<code>@EqualsAndHashCode(callSuper=true)</code>的话，会默认是<code>@EqualsAndHashCode(callSuper=false)</code>,这时候生成的<code>equals()</code>方法只会比较子类的属性，不会考虑从父类继承的属性，无论父类属性访问权限是否开放。</p><p>这就可能得到意想不到的结果。</p><h3 id="代码可读性-可调试性低" tabindex="-1">代码可读性，可调试性低 <a class="header-anchor" href="#代码可读性-可调试性低" aria-label="Permalink to &quot;代码可读性，可调试性低&quot;">​</a></h3><p>在代码中使用了Lombok，确实可以帮忙减少很多代码，因为Lombok会帮忙自动生成很多代码。但是<strong>这些代码是要在编译阶段才会生成的</strong>，所以在开发的过程中，其实很多代码其实是缺失的。</p><p>在代码中大量使用Lombok，就导致代码的可读性会低很多，而且也会给代码调试带来一定的问题。 比如，我们想要知道某个类中的某个属性的getter方法都被哪些类引用的话，就没那么简单了。</p><h3 id="lombok有很强的侵入性" tabindex="-1">Lombok有很强的侵入性 <a class="header-anchor" href="#lombok有很强的侵入性" aria-label="Permalink to &quot;Lombok有很强的侵入性&quot;">​</a></h3><ul><li><strong>强J队友</strong></li></ul><p>因为Lombok的使用要求开发者一定要在IDE中安装对应的插件。如果未安装插件的话，使用IDE打开一个基于Lombok的项目的话会提示找不到方法等错误。导致项目编译失败。也就是说，如果项目组中有一个人使用了Lombok，那么其他人就必须也要安装IDE插件。否则就没办法协同开发。</p><p>更重要的是，如果我们定义的一个jar包中使用了Lombok，那么就要求所有依赖这个jar包的所有应用都必须安装插件，这种侵入性是很高的。</p><ul><li><strong>影响升级</strong></li></ul><p>因为Lombok对于代码有很强的侵入性，就可能带来一个比较大的问题，那就是会影响我们对JDK的升级。按照如今JDK的升级频率，每半年都会推出一个新的版本，但是Lombok作为一个第三方工具，并且是由开源团队维护的，那么他的迭代速度是无法保证的。</p><p>所以，如果我们需要升级到某个新版本的JDK的时候，若其中的特性在Lombok中不支持的话就会受到影响。</p><p>还有一个可能带来的问题，就是Lombok自身的升级也会受到限制。因为一个应用可能依赖了多个jar包，而每个jar包可能又要依赖不同版本的Lombok，这就导致在应用中需要做版本仲裁，而我们知道，jar包版本仲裁是没那么容易的，而且发生问题的概率也很高。</p><h3 id="lombok破坏了封装性" tabindex="-1">Lombok破坏了封装性 <a class="header-anchor" href="#lombok破坏了封装性" aria-label="Permalink to &quot;Lombok破坏了封装性&quot;">​</a></h3><p>以上几个问题，我认为都是有办法可以避免的。但是有些人排斥使用Lombok还有一个重要的原因，那就是他会破坏封装性。</p><p>众所周知，Java的三大特性包括<code>封装性</code>、<code>继承性</code>和<code>多态性</code>。</p><p>如果我们在代码中直接使用Lombok，那么他会自动帮我们生成getter、setter 等方法，这就意味着，一个类中的所有参数都自动提供了设置和读取方法。</p><p>举个简单的例子，我们定义一个购物车类：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Data</span></span>
<span class="line"><span>public class ShoppingCart { </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //商品数目</span></span>
<span class="line"><span>    private int itemsCount; </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //总价格</span></span>
<span class="line"><span>    private double totalPrice; </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    //商品明细</span></span>
<span class="line"><span>    private List items = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//例子来源于《极客时间-设计模式之美》</span></span></code></pre></div><p>我们知道，购物车中商品数目、商品明细以及总价格三者之前其实是有关联关系的，如果需要修改的话是要一起修改的。</p><p>但是，我们使用了Lombok的<code>@Data</code>注解，对于itemsCount 和 totalPrice这两个属性。虽然我们将它们定义成 <code>private</code> 类型，但是提供了 <code>public</code> 的 <code>getter</code>、<code>setter</code> 方法。</p><p>外部可以通过 <code>setter</code> 方法随意地修改这两个属性的值。我们可以随意调用 <code>setter</code> 方法，来重新设置 itemsCount、totalPrice 属性的值，这也会导致其跟 items 属性的值不一致。</p><p>而面向对象封装的定义是：通过访问权限控制，隐藏内部数据，外部仅能通过类提供的有限的接口访问、修改内部数据。所以，暴露不应该暴露的 setter 方法，明显违反了面向对象的封装特性。</p><p>好的做法应该是不提供<code>getter/setter</code>，而是只提供一个public的addItem方法，同时去修改itemsCount、totalPrice以及items三个属性。</p><blockquote><p>以上问题其实也是可以解决的，但这提醒了我们需要理解Lombok，而不是一股脑的用<code>@Data</code>注解。 @pdai</p></blockquote><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><ul><li><p>优缺点</p><ul><li>优点：大大减少了代码量，使代码非常简洁</li><li>缺点：可能存在对队友不友好、对代码不友好、对调试不友好、对升级不友好等问题。Lombok还会导致破坏封装性的问题。<code>@Data</code>中覆盖<code>equals</code>和<code>hashCode</code>的坑等。</li></ul></li><li><p>什么样的情况使用Lombok</p><ul><li>团队整体的共识，IDE规范，相关代码规范等</li><li>对Lombok足够了解，比如知道其中的坑等</li></ul></li><li><p>不推荐使用Lombok的理由</p><ul><li>其实我们不缺时间写Getter和Setter的，这些代码通常是由IDE生成的。简化也是有代价的。</li><li>对Lombok认知不够，导致带来的坑。</li><li>Java14中Record了解下。</li></ul></li></ul><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li><a href="https://projectlombok.org/" target="_blank" rel="noreferrer">https://projectlombok.org/</a></li><li><a href="http://blog.itpub.net/69908877/viewspace-2676272/" target="_blank" rel="noreferrer">http://blog.itpub.net/69908877/viewspace-2676272/</a></li><li><a href="https://www.jianshu.com/p/63038c7c515a" target="_blank" rel="noreferrer">https://www.jianshu.com/p/63038c7c515a</a></li><li><a href="https://www.cnblogs.com/heyonggang/p/8638374.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/heyonggang/p/8638374.html</a></li><li><a href="http://blog.didispace.com/java-lombok-how-to-use/" target="_blank" rel="noreferrer">http://blog.didispace.com/java-lombok-how-to-use/</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,133)]))}const q=p(r,[["render",d]]);export{L as __pageData,q as default};
