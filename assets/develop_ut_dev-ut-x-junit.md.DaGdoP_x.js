import{_ as n,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const t="/vitepress-blog-template/images/develop/ut/dev-ut4-1.png",l="/vitepress-blog-template/images/develop/ut/dev-ut4-3.png",i="/vitepress-blog-template/images/develop/ut/dev-ut4-2.png",c="/vitepress-blog-template/images/develop/ut/dev-ut4-4.png",r="/vitepress-blog-template/images/develop/ut/dev-ut4-5.png",o="/vitepress-blog-template/images/develop/ut/dev-ut4-6.png",u="/vitepress-blog-template/images/develop/ut/dev-ut4-7.png",d="/vitepress-blog-template/images/develop/ut/dev-ut4-8.png",g="/vitepress-blog-template/images/develop/ut/dev-ut4-9.png",h="/vitepress-blog-template/images/develop/ut/dev-ut4-10.png",C=JSON.parse('{"title":"单元测试 - JUnit4 详解","description":"","frontmatter":{},"headers":[],"relativePath":"develop/ut/dev-ut-x-junit.md","filePath":"develop/ut/dev-ut-x-junit.md","lastUpdated":1737706346000}'),m={name:"develop/ut/dev-ut-x-junit.md"};function b(v,s,j,q,T,k){return e(),a("div",null,s[0]||(s[0]=[p(`<h1 id="单元测试-junit4-详解" tabindex="-1">单元测试 - JUnit4 详解 <a class="header-anchor" href="#单元测试-junit4-详解" aria-label="Permalink to &quot;单元测试 - JUnit4 详解&quot;">​</a></h1><blockquote><p>JUint是Java编程语言的单元测试框架，用于编写和运行可重复的自动化测试。本文主要针对Junit4要点进行梳理总结。@pdai</p></blockquote><h2 id="什么是junit" tabindex="-1">什么是JUnit？ <a class="header-anchor" href="#什么是junit" aria-label="Permalink to &quot;什么是JUnit？&quot;">​</a></h2><p>JUint是Java编程语言的单元测试框架，用于编写和运行可重复的自动化测试。</p><h2 id="junit特点" tabindex="-1">JUnit特点？ <a class="header-anchor" href="#junit特点" aria-label="Permalink to &quot;JUnit特点？&quot;">​</a></h2><p>JUnit 是一个开放的资源框架，用于编写和运行测试。</p><ul><li>提供注解来识别测试方法。</li><li>提供断言来测试预期结果。</li><li>JUnit 测试允许你编写代码更快，并能提高质量。</li><li>JUnit 优雅简洁。没那么复杂，花费时间较少。</li><li>JUnit测试可以自动运行并且检查自身结果并提供即时反馈。所以也没有必要人工梳理测试结果的报告。</li><li>JUnit测试可以被组织为测试套件，包含测试用例，甚至其他的测试套件。</li><li>JUnit在一个条中显示进度。如果运行良好则是绿色；如果运行失败，则变成红色。</li></ul><h2 id="官方资料" tabindex="-1">官方资料 <a class="header-anchor" href="#官方资料" aria-label="Permalink to &quot;官方资料&quot;">​</a></h2><blockquote><p>最好的资料依然在Junit官方网站，以下我帮你总结下Junit相关的官方网址。@pdai</p></blockquote><ul><li>官网地址</li></ul><p><a href="https://junit.org/junit4/" target="_blank" rel="noreferrer">https://junit.org/junit4/</a></p><ul><li>官方入门文档</li></ul><p><a href="https://github.com/junit-team/junit4/wiki/Assertions" target="_blank" rel="noreferrer">https://github.com/junit-team/junit4/wiki/Assertions</a></p><ul><li>官方github</li></ul><p><a href="https://github.com/junit-team" target="_blank" rel="noreferrer">https://github.com/junit-team</a></p><h2 id="常用注解" tabindex="-1">常用注解 <a class="header-anchor" href="#常用注解" aria-label="Permalink to &quot;常用注解&quot;">​</a></h2><ul><li><strong>@Test</strong></li></ul><p>在junit3中，是通过对测试类和测试方法的命名来确定是否是测试，且所有的测试类必须继承junit的测试基类。在junit4中，定义一个测试方法变得简单很多，只需要在方法前加上@Test就行了。</p><p>注意：测试方法必须是public void，即公共、无返回数据。可以抛出异常。</p><ul><li><strong>@Ignore</strong></li></ul><p>有时候我们想暂时不运行某些测试方法\\测试类，可以在方法前加上这个注解。在运行结果中，junit会统计忽略的用例数，来提醒你。但是不建议经常这么做，因为这样的坏处时，容易忘记去更新这些测试方法，导致代码不够干净，用例遗漏。使用此标注的时候不能与其它标注一起使用，如：和@Test 标注一起使用，那就没用了</p><ul><li><strong>@BeforeClass</strong></li></ul><p>当我们运行几个有关联的用例时，可能会在数据准备或其它前期准备中执行一些相同的命令，这个时候为了让代码更清晰，更少冗余，可以将公用的部分提取出来，放在一个方法里，并为这个方法注解@BeforeClass。意思是在测试类里所有用例运行之前，运行一次这个方法。例如创建数据库连接、读取文件等。</p><p>注意：方法名可以任意，但必须是public static void，即公开、静态、无返回。这个方法只会运行一次。</p><ul><li><strong>@AfterClass</strong></li></ul><p>跟@BeforeClass对应，在测试类里所有用例运行之后，运行一次。用于处理一些测试后续工作，例如清理数据，恢复现场。</p><p>注意：同样必须是public static void，即公开、静态、无返回。这个方法只会运行一次。</p><ul><li><strong>@Before</strong></li></ul><p>与@BeforeClass的区别在于，@Before不止运行一次，它会在每个用例运行之前都运行一次。主要用于一些独立于用例之间的准备工作。</p><p>比如两个用例都需要读取数据库里的用户A信息，但第一个用例会删除这个用户A，而第二个用例需要修改用户A。那么可以用@BeforeClass创建数据库连接。用@Before来插入一条用户A信息。</p><p>注意：必须是public void，不能为static。不止运行一次，根据用例数而定。</p><ul><li><p><strong>@After</strong>：与@Before对应。</p></li><li><p><strong>@Runwith</strong></p><ul><li>首先要分清几个概念：测试方法、测试类、测试集、测试运行器。</li><li>其中测试方法就是用@Test注解的一些函数。</li><li>测试类是包含一个或多个测试方法的一个Test.java文件。</li><li>测试集是一个suite，可能包含多个测试类。</li><li>测试运行器则决定了用什么方式偏好去运行这些测试集/类/方法。</li><li>而@Runwith就是放在测试类名之前，用来确定这个类怎么运行的。也可以不标注，会使用默认运行器。常见的运行器有： <ul><li>@RunWith(Parameterized.class) 参数化运行器，配合@Parameters使用junit的参数化功能</li><li>@RunWith(Suite.class) @SuiteClasses({ATest.class,BTest.class,CTest.class})测试集运行器配合使用测试集功能</li><li>@RunWith(JUnit4.class) junit4的默认运行器</li><li>@RunWith(JUnit38ClassRunner.class) 用于兼容junit3.8的运行器</li><li>一些其它运行器具备更多功能。例如@RunWith(SpringJUnit4ClassRunner.class)集成了spring的一些功能</li></ul></li></ul></li><li><p><strong>@Parameters</strong>： 用于使用参数化功能。</p></li></ul><h2 id="编写单元测试" tabindex="-1">编写单元测试 <a class="header-anchor" href="#编写单元测试" aria-label="Permalink to &quot;编写单元测试&quot;">​</a></h2><blockquote><p>接下来，我们开始学习JUnit4单元测试实例:</p></blockquote><h3 id="maven包引入" tabindex="-1">Maven包引入 <a class="header-anchor" href="#maven包引入" aria-label="Permalink to &quot;Maven包引入&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;</span></span>
<span class="line"><span>&lt;project xmlns=&quot;http://maven.apache.org/POM/4.0.0&quot;</span></span>
<span class="line"><span>         xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;</span></span>
<span class="line"><span>         xsi:schemaLocation=&quot;http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd&quot;&gt;</span></span>
<span class="line"><span>    &lt;modelVersion&gt;4.0.0&lt;/modelVersion&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;groupId&gt;org.example&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;java-junit4&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;1.0-SNAPSHOT&lt;/version&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;build&gt;</span></span>
<span class="line"><span>        &lt;plugins&gt;</span></span>
<span class="line"><span>            &lt;plugin&gt;</span></span>
<span class="line"><span>                &lt;groupId&gt;org.apache.maven.plugins&lt;/groupId&gt;</span></span>
<span class="line"><span>                &lt;artifactId&gt;maven-compiler-plugin&lt;/artifactId&gt;</span></span>
<span class="line"><span>                &lt;configuration&gt;</span></span>
<span class="line"><span>                    &lt;source&gt;8&lt;/source&gt;</span></span>
<span class="line"><span>                    &lt;target&gt;8&lt;/target&gt;</span></span>
<span class="line"><span>                &lt;/configuration&gt;</span></span>
<span class="line"><span>            &lt;/plugin&gt;</span></span>
<span class="line"><span>        &lt;/plugins&gt;</span></span>
<span class="line"><span>    &lt;/build&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    &lt;dependencies&gt;</span></span>
<span class="line"><span>        &lt;dependency&gt;</span></span>
<span class="line"><span>            &lt;groupId&gt;junit&lt;/groupId&gt;</span></span>
<span class="line"><span>            &lt;artifactId&gt;junit&lt;/artifactId&gt;</span></span>
<span class="line"><span>            &lt;version&gt;4.12&lt;/version&gt;</span></span>
<span class="line"><span>            &lt;scope&gt;test&lt;/scope&gt;</span></span>
<span class="line"><span>        &lt;/dependency&gt;</span></span>
<span class="line"><span>    &lt;/dependencies&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&lt;/project&gt;</span></span></code></pre></div><h3 id="测试-hello-world" tabindex="-1">测试:Hello World <a class="header-anchor" href="#测试-hello-world" aria-label="Permalink to &quot;测试:Hello World&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.junit4;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.junit.Test;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import static org.junit.Assert.assertEquals;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * Hello world test.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class HelloWorldTest {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void firstTest() {</span></span>
<span class="line"><span>        assertEquals(2, 1 + 1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行结果</p><p><img src="`+t+`" alt="error.图片加载失败"></p><p>@Test注解在方法上标记方法为测试方法，以便构建工具和 IDE 能够识别并执行它们。JUnit 4 需要测试方法为public，这和Junit 5 有差别。</p><h3 id="测试-生命周期" tabindex="-1">测试:生命周期 <a class="header-anchor" href="#测试-生命周期" aria-label="Permalink to &quot;测试:生命周期&quot;">​</a></h3><ul><li><p><strong>@BeforeClass</strong>注解修饰的方法(该方法要用static修饰)会在所有方法运行前被执行，且只执行一次，通常用来为后面测试方法的准备工作，如加载配置、进行数据库的连接等。父类的@BeforeClass注解方法会在子类的@BeforeClass注解方法执行前执行。</p></li><li><p><strong>@Before</strong>注解修饰的方法会在每个测试方法执行前执行一次,父类@Before修饰的方法会在子类@Before修饰的方法执行前 执行</p></li><li><p><strong>@After</strong>注解修饰的方法会在每个测试方法执行后执行一次,父类@After修饰的方法会在子类@After修饰的方法执行后执行。</p></li><li><p><strong>@AfterClass</strong>注解修饰的方法(该方法要用static修饰)会在所有方法执行结束后执行一次，且也只执行一次，通常用来对资源进行释放，比如数据库连接的关闭等，无论测试用例里的其他方法有没有抛出异常，该方法最终都会被执行。而且父类中的被@AfterClass注解方法修饰的方法会在子类的@AfterClass注解修饰的方法执行之后才会被执行。</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.junit4;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.junit.*;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * Standard Test.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class StandardTest {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @BeforeClass</span></span>
<span class="line"><span>    public static void beforeClass() {</span></span>
<span class="line"><span>        System.out.println(&quot;in before class&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @AfterClass</span></span>
<span class="line"><span>    public static void afterClass() {</span></span>
<span class="line"><span>        System.out.println(&quot;in after class&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Before</span></span>
<span class="line"><span>    public void before() {</span></span>
<span class="line"><span>        System.out.println(&quot;in before&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @After</span></span>
<span class="line"><span>    public void after() {</span></span>
<span class="line"><span>        System.out.println(&quot;in after&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void testCase1() {</span></span>
<span class="line"><span>        System.out.println(&quot;in test case 1&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void testCase2() {</span></span>
<span class="line"><span>        System.out.println(&quot;in test case 2&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行结果</p><p><img src="`+l+`" alt="error.图片加载失败"></p><h3 id="测试-禁用测试" tabindex="-1">测试:禁用测试 <a class="header-anchor" href="#测试-禁用测试" aria-label="Permalink to &quot;测试:禁用测试&quot;">​</a></h3><p><strong>@Ignore</strong>：暂不执行该方法；</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.junit4;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.junit.Ignore;</span></span>
<span class="line"><span>import org.junit.Test;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * Ignore Test.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class IgnoreTest {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * ignore.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Ignore</span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void ignoreTest(){</span></span>
<span class="line"><span>        System.out.println(&quot;ignore test&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行结果</p><p><img src="`+i+`" alt="error.图片加载失败"></p><h3 id="测试-断言测试" tabindex="-1">测试:断言测试 <a class="header-anchor" href="#测试-断言测试" aria-label="Permalink to &quot;测试:断言测试&quot;">​</a></h3><ul><li><strong>断言测试注解有哪些</strong></li></ul><table tabindex="0"><thead><tr><th>断言</th><th>描述</th></tr></thead><tbody><tr><td>void assertEquals([String message],expected value,actual value)</td><td>断言两个值相等。值类型可能是int，short，long，byte，char，Object，第一个参数是一个可选字符串消息</td></tr><tr><td>void assertTrue([String message],boolean condition)</td><td>断言一个条件为真</td></tr><tr><td>void assertFalse([String message],boolean condition)</td><td>断言一个条件为假</td></tr><tr><td>void assertNotNull([String message],java.lang.Object object)</td><td>断言一个对象不为空（null）</td></tr><tr><td>void assertNull([String message],java.lang.Object object)</td><td>断言一个对象为空（null）</td></tr><tr><td>void assertSame([String message],java.lang.Object expected,java.lang.Object actual)</td><td>断言两个对象引用相同的对象</td></tr><tr><td>void assertNotSame([String message],java.lang.Object unexpected,java.lang.Object actual)</td><td>断言两个对象不是引用同一个对象</td></tr><tr><td>void assertArrayEquals([String message],expectedArray,resultArray)</td><td>断言预期数组和结果数组相等，数组类型可能是int，short，long，byte，char，Object</td></tr></tbody></table><ul><li><strong>简单测试</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.junit4;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.junit.Assert;</span></span>
<span class="line"><span>import org.junit.Test;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * Assertion Test.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class AssertionTest {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void test() {</span></span>
<span class="line"><span>        String obj1 = &quot;junit&quot;;</span></span>
<span class="line"><span>        String obj2 = &quot;junit&quot;;</span></span>
<span class="line"><span>        String obj3 = &quot;test&quot;;</span></span>
<span class="line"><span>        String obj4 = &quot;test&quot;;</span></span>
<span class="line"><span>        String obj5 = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        int var1 = 1;</span></span>
<span class="line"><span>        int var2 = 2;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        int[] array1 = {1, 2, 3};</span></span>
<span class="line"><span>        int[] array2 = {1, 2, 3};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Assert.assertEquals(obj1, obj2);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Assert.assertSame(obj3, obj4);</span></span>
<span class="line"><span>        Assert.assertNotSame(obj2, obj4);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Assert.assertNotNull(obj1);</span></span>
<span class="line"><span>        Assert.assertNull(obj5);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Assert.assertTrue(var1 &lt; var2);</span></span>
<span class="line"><span>        Assert.assertFalse(var1 &gt; var2);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Assert.assertArrayEquals(array1, array2);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在以上类中我们可以看到，这些断言方法是可以工作的。</p><ul><li><p>assertEquals() 如果比较的两个对象是相等的，此方法将正常返回；否则失败显示在JUnit的窗口测试将中止。</p></li><li><p>assertSame() 和 assertNotSame() 方法测试两个对象引用指向完全相同的对象。</p></li><li><p>assertNull() 和 assertNotNull() 方法测试一个变量是否为空或不为空(null)。</p></li><li><p>assertTrue() 和 assertFalse() 方法测试if条件或变量是true还是false。</p></li><li><p>assertArrayEquals() 将比较两个数组，如果它们相等，则该方法将继续进行不会发出错误。否则失败将显示在JUnit窗口和中止测试。</p></li><li><p><strong>更多测试，来自官网</strong><a href="https://github.com/junit-team/junit4/wiki/Assertions" target="_blank" rel="noreferrer">https://github.com/junit-team/junit4/wiki/Assertions</a></p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.junit4;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.hamcrest.core.CombinableMatcher;</span></span>
<span class="line"><span>import org.junit.Test;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.Arrays;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import static org.hamcrest.CoreMatchers.*;</span></span>
<span class="line"><span>import static org.junit.Assert.*;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * More Assertion Test from Junit-Team.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class Assertion2Test {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void testAssertArrayEquals() {</span></span>
<span class="line"><span>        byte[] expected = &quot;trial&quot;.getBytes();</span></span>
<span class="line"><span>        byte[] actual = &quot;trial&quot;.getBytes();</span></span>
<span class="line"><span>        assertArrayEquals(&quot;failure - byte arrays not same&quot;, expected, actual);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void testAssertEquals() {</span></span>
<span class="line"><span>        assertEquals(&quot;failure - strings are not equal&quot;, &quot;text&quot;, &quot;text&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void testAssertFalse() {</span></span>
<span class="line"><span>        assertFalse(&quot;failure - should be false&quot;, false);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void testAssertNotNull() {</span></span>
<span class="line"><span>        assertNotNull(&quot;should not be null&quot;, new Object());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void testAssertNotSame() {</span></span>
<span class="line"><span>        assertNotSame(&quot;should not be same Object&quot;, new Object(), new Object());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void testAssertNull() {</span></span>
<span class="line"><span>        assertNull(&quot;should be null&quot;, null);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void testAssertSame() {</span></span>
<span class="line"><span>        Integer aNumber = Integer.valueOf(768);</span></span>
<span class="line"><span>        assertSame(&quot;should be same&quot;, aNumber, aNumber);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // JUnit Matchers assertThat</span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void testAssertThatBothContainsString() {</span></span>
<span class="line"><span>        assertThat(&quot;albumen&quot;, both(containsString(&quot;a&quot;)).and(containsString(&quot;b&quot;)));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void testAssertThatHasItems() {</span></span>
<span class="line"><span>        assertThat(Arrays.asList(&quot;one&quot;, &quot;two&quot;, &quot;three&quot;), hasItems(&quot;one&quot;, &quot;three&quot;));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void testAssertThatEveryItemContainsString() {</span></span>
<span class="line"><span>        assertThat(Arrays.asList(new String[]{&quot;fun&quot;, &quot;ban&quot;, &quot;net&quot;}), everyItem(containsString(&quot;n&quot;)));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Core Hamcrest Matchers with assertThat</span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void testAssertThatHamcrestCoreMatchers() {</span></span>
<span class="line"><span>        assertThat(&quot;good&quot;, allOf(equalTo(&quot;good&quot;), startsWith(&quot;good&quot;)));</span></span>
<span class="line"><span>        assertThat(&quot;good&quot;, not(allOf(equalTo(&quot;bad&quot;), equalTo(&quot;good&quot;))));</span></span>
<span class="line"><span>        assertThat(&quot;good&quot;, anyOf(equalTo(&quot;bad&quot;), equalTo(&quot;good&quot;)));</span></span>
<span class="line"><span>        assertThat(7, not(CombinableMatcher.&lt;Integer&gt;either(equalTo(3)).or(equalTo(4))));</span></span>
<span class="line"><span>        assertThat(new Object(), not(sameInstance(new Object())));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void testAssertTrue() {</span></span>
<span class="line"><span>        assertTrue(&quot;failure - should be true&quot;, true);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行结果</p><p><img src="`+c+`" alt="error.图片加载失败"></p><h3 id="测试-异常测试" tabindex="-1">测试:异常测试 <a class="header-anchor" href="#测试-异常测试" aria-label="Permalink to &quot;测试:异常测试&quot;">​</a></h3><p>Junit 用代码处理提供了一个追踪异常的选项。你可以测试代码是否它抛出了想要得到的异常。expected 参数和 @Test 注释一起使用。现在让我们看看 @Test(expected):</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.junit4;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.junit.Test;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * Exception Test.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class ExceptionTest {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test(expected = ArithmeticException.class)</span></span>
<span class="line"><span>    public void exceptionTest() {</span></span>
<span class="line"><span>        System.out.println(&quot;in exception success test&quot;);</span></span>
<span class="line"><span>        int a = 0;</span></span>
<span class="line"><span>        int b = 1 / a;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test(expected = NullPointerException.class)</span></span>
<span class="line"><span>    public void exceptionFailTest() {</span></span>
<span class="line"><span>        System.out.println(&quot;in exception fail test&quot;);</span></span>
<span class="line"><span>        int a = 0;</span></span>
<span class="line"><span>        int b = 1 / a;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行结果</p><p><img src="`+r+`" alt="error.图片加载失败"></p><p>观察错误的信息：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>in exception success test</span></span>
<span class="line"><span>in exception fail test</span></span>
<span class="line"><span></span></span>
<span class="line"><span>java.lang.Exception: Unexpected exception, expected&lt;java.lang.NullPointerException&gt; but was&lt;java.lang.ArithmeticException&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	at org.junit.internal.runners.statements.ExpectException.evaluate(ExpectException.java:28)</span></span>
<span class="line"><span>	at org.junit.runners.ParentRunner.runLeaf(ParentRunner.java:325)</span></span>
<span class="line"><span>	at org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:78)</span></span>
<span class="line"><span>	at org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:57)</span></span>
<span class="line"><span>	at org.junit.runners.ParentRunner$3.run(ParentRunner.java:290)</span></span>
<span class="line"><span>	at org.junit.runners.ParentRunner$1.schedule(ParentRunner.java:71)</span></span>
<span class="line"><span>	at org.junit.runners.ParentRunner.runChildren(ParentRunner.java:288)</span></span>
<span class="line"><span>	at org.junit.runners.ParentRunner.access$000(ParentRunner.java:58)</span></span>
<span class="line"><span>	at org.junit.runners.ParentRunner$2.evaluate(ParentRunner.java:268)</span></span>
<span class="line"><span>	at org.junit.runners.ParentRunner.run(ParentRunner.java:363)</span></span>
<span class="line"><span>	at org.junit.runner.JUnitCore.run(JUnitCore.java:137)</span></span>
<span class="line"><span>	at com.intellij.junit4.JUnit4IdeaTestRunner.startRunnerWithArgs(JUnit4IdeaTestRunner.java:68)</span></span>
<span class="line"><span>	at com.intellij.rt.junit.IdeaTestRunner$Repeater.startRunnerWithArgs(IdeaTestRunner.java:33)</span></span>
<span class="line"><span>	at com.intellij.rt.junit.JUnitStarter.prepareStreamsAndStart(JUnitStarter.java:230)</span></span>
<span class="line"><span>	at com.intellij.rt.junit.JUnitStarter.main(JUnitStarter.java:58)</span></span>
<span class="line"><span>Caused by: java.lang.ArithmeticException: / by zero</span></span>
<span class="line"><span>	at tech.pdai.junit4.ExceptionTest.exceptionFailTest(ExceptionTest.java:21)</span></span>
<span class="line"><span>	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)</span></span>
<span class="line"><span>	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)</span></span>
<span class="line"><span>	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)</span></span>
<span class="line"><span>	at java.lang.reflect.Method.invoke(Method.java:498)</span></span>
<span class="line"><span>	at org.junit.runners.model.FrameworkMethod$1.runReflectiveCall(FrameworkMethod.java:50)</span></span>
<span class="line"><span>	at org.junit.internal.runners.model.ReflectiveCallable.run(ReflectiveCallable.java:12)</span></span>
<span class="line"><span>	at org.junit.runners.model.FrameworkMethod.invokeExplosively(FrameworkMethod.java:47)</span></span>
<span class="line"><span>	at org.junit.internal.runners.statements.InvokeMethod.evaluate(InvokeMethod.java:17)</span></span>
<span class="line"><span>	at org.junit.internal.runners.statements.ExpectException.evaluate(ExpectException.java:19)</span></span>
<span class="line"><span>	... 14 more</span></span></code></pre></div><h3 id="测试-时间测试" tabindex="-1">测试:时间测试 <a class="header-anchor" href="#测试-时间测试" aria-label="Permalink to &quot;测试:时间测试&quot;">​</a></h3><p>JUnit提供了一个暂停的方便选项，如果一个测试用例比起指定的毫秒数花费了更多的时间，那么JUnit将自动将它标记为失败，timeout参数和@Test注解一起使用，例如@Test(timeout=1000)。</p><ul><li><strong>简单例子</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.junit4;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.junit.Test;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.concurrent.TimeUnit;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * Timeout Test.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class TimeoutTest {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test(timeout = 1000)</span></span>
<span class="line"><span>    public void testCase1() throws InterruptedException {</span></span>
<span class="line"><span>        TimeUnit.SECONDS.sleep(5000);</span></span>
<span class="line"><span>        System.out.println(&quot;in timeout exception&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行结果</p><p><img src="`+o+`" alt="error.图片加载失败"></p><p>观察错误的信息：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>org.junit.runners.model.TestTimedOutException: test timed out after 1000 milliseconds</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	at java.lang.Thread.sleep(Native Method)</span></span>
<span class="line"><span>	at java.lang.Thread.sleep(Thread.java:340)</span></span>
<span class="line"><span>	at java.util.concurrent.TimeUnit.sleep(TimeUnit.java:386)</span></span>
<span class="line"><span>	at tech.pdai.junit4.TimeoutTest.testCase1(TimeoutTest.java:14)</span></span>
<span class="line"><span>	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)</span></span>
<span class="line"><span>	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)</span></span>
<span class="line"><span>	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)</span></span>
<span class="line"><span>	at java.lang.reflect.Method.invoke(Method.java:498)</span></span>
<span class="line"><span>	at org.junit.runners.model.FrameworkMethod$1.runReflectiveCall(FrameworkMethod.java:50)</span></span>
<span class="line"><span>	at org.junit.internal.runners.model.ReflectiveCallable.run(ReflectiveCallable.java:12)</span></span>
<span class="line"><span>	at org.junit.runners.model.FrameworkMethod.invokeExplosively(FrameworkMethod.java:47)</span></span>
<span class="line"><span>	at org.junit.internal.runners.statements.InvokeMethod.evaluate(InvokeMethod.java:17)</span></span>
<span class="line"><span>	at org.junit.internal.runners.statements.FailOnTimeout$CallableStatement.call(FailOnTimeout.java:298)</span></span>
<span class="line"><span>	at org.junit.internal.runners.statements.FailOnTimeout$CallableStatement.call(FailOnTimeout.java:292)</span></span>
<span class="line"><span>	at java.util.concurrent.FutureTask.run(FutureTask.java:266)</span></span>
<span class="line"><span>	at java.lang.Thread.run(Thread.java:748)</span></span></code></pre></div><ul><li><strong>超时规则</strong></li></ul><p>应用到测试类的所有测试用例</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.junit4;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.junit.Rule;</span></span>
<span class="line"><span>import org.junit.Test;</span></span>
<span class="line"><span>import org.junit.rules.Timeout;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.concurrent.CountDownLatch;</span></span>
<span class="line"><span>import java.util.concurrent.TimeUnit;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * Timeout Rule.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class HasGlobalTimeoutTest {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static String log;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private final CountDownLatch latch = new CountDownLatch(1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Rule</span></span>
<span class="line"><span>    public Timeout globalTimeout = Timeout.seconds(10); // 10 seconds max per method tested</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void testSleepForTooLong() throws Exception {</span></span>
<span class="line"><span>        log += &quot;ran1&quot;;</span></span>
<span class="line"><span>        TimeUnit.SECONDS.sleep(100); // sleep for 100 seconds</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void testBlockForever() throws Exception {</span></span>
<span class="line"><span>        log += &quot;ran2&quot;;</span></span>
<span class="line"><span>        latch.await(); // will block</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行结果</p><p><img src="`+u+`" alt="error.图片加载失败"></p><h3 id="测试-参数化测试" tabindex="-1">测试:参数化测试 <a class="header-anchor" href="#测试-参数化测试" aria-label="Permalink to &quot;测试:参数化测试&quot;">​</a></h3><p>Junit 4 引入了一个新的功能参数化测试。参数化测试允许开发人员使用不同的值反复运行同 一个测试。你将遵循 5 个步骤来创建参数化测试：</p><ul><li>为准备使用参数化测试的测试类指定特殊的运行器 org.junit.runners.Parameterized。</li><li>为测试类声明几个变量，分别用于存放期望值和测试所用数据。</li><li>为测试类声明一个带有参数的公共构造函数，并在其中为第二个环节中声明的几个变量赋值。</li><li>为测试类声明一个使用注解 org.junit.runners.Parameterized.Parameters 修饰的，返回值为 java.util.Collection 的公共静态方法，并在此方法中初始化所有需要测试的参数对。</li><li>编写测试方法，使用定义的变量作为参数进行测试。</li></ul><p><strong>什么是@RunWith</strong>?</p><p>首先要分清几个概念：测试方法、测试类、测试集、测试运行器。</p><ul><li>其中测试方法就是用@Test注解的一些函数。</li><li>测试类是包含一个或多个测试方法的一个**Test.java文件，</li><li>测试集是一个suite，可能包含多个测试类。</li><li>测试运行器则决定了用什么方式偏好去运行这些测试集/类/方法。</li></ul><p>而@Runwith就是放在测试类名之前，用来确定这个类怎么运行的。也可以不标注，会使用默认运行器。<strong>常见的运行器</strong>有：</p><ul><li><p>@RunWith(Parameterized.class) 参数化运行器，配合@Parameters使用JUnit的参数化功能</p></li><li><p>@RunWith(Suite.class) @SuiteClasses({ATest.class,BTest.class,CTest.class}) 测试集运行器配合使用测试集功能</p></li><li><p>@RunWith(JUnit4.class)， junit4的默认运行器</p></li><li><p>@RunWith(JUnit38ClassRunner.class)，用于兼容junit3.8的运行器 一些其它运行器具备更多功能。例如@RunWith(SpringJUnit4ClassRunner.class)集成了spring的一些功能</p></li><li><p><strong>测试例子</strong></p></li></ul><p>待测试类</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.junit4;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * PrimeNumberChecker.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>public class PrimeNumberChecker {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Boolean validate(final Integer parimeNumber) {</span></span>
<span class="line"><span>        for (int i = 2; i &lt; (parimeNumber / 2); i++) {</span></span>
<span class="line"><span>            if (parimeNumber % i == 0) {</span></span>
<span class="line"><span>                return false;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>测试类</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.junit4;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.junit.Assert;</span></span>
<span class="line"><span>import org.junit.Before;</span></span>
<span class="line"><span>import org.junit.Test;</span></span>
<span class="line"><span>import org.junit.runner.RunWith;</span></span>
<span class="line"><span>import org.junit.runners.Parameterized;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import java.util.Arrays;</span></span>
<span class="line"><span>import java.util.Collection;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * Parameterized Test.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@RunWith(Parameterized.class) // 步骤一: 指定定参数运行器</span></span>
<span class="line"><span>public class PrimeNumberCheckerTest {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 步骤二：声明变量</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    private Integer inputNumber;</span></span>
<span class="line"><span>    private Boolean expectedResult;</span></span>
<span class="line"><span>    private PrimeNumberChecker primeNumberChecker;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 步骤三：为测试类声明一个带有参数的公共构造函数，为变量赋值</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public PrimeNumberCheckerTest(Integer inputNumber,</span></span>
<span class="line"><span>                                  Boolean expectedResult) {</span></span>
<span class="line"><span>        this.inputNumber = inputNumber;</span></span>
<span class="line"><span>        this.expectedResult = expectedResult;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 步骤四：为测试类声明一个使用注解 org.junit.runners.Parameterized.Parameters 修饰的，返回值为</span></span>
<span class="line"><span>     * java.util.Collection 的公共静态方法，并在此方法中初始化所有需要测试的参数对</span></span>
<span class="line"><span>     *   1）该方法必须由Parameters注解修饰</span></span>
<span class="line"><span>     2）该方法必须为public static的</span></span>
<span class="line"><span>     3）该方法必须返回Collection类型</span></span>
<span class="line"><span>     4）该方法的名字不做要求</span></span>
<span class="line"><span>     5）该方法没有参数</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Parameterized.Parameters</span></span>
<span class="line"><span>    public static Collection primeNumbers() {</span></span>
<span class="line"><span>        return Arrays.asList(new Object[][]{</span></span>
<span class="line"><span>                {2, true},</span></span>
<span class="line"><span>                {6, false},</span></span>
<span class="line"><span>                {19, true},</span></span>
<span class="line"><span>                {22, false},</span></span>
<span class="line"><span>                {23, true}</span></span>
<span class="line"><span>        });</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Before</span></span>
<span class="line"><span>    public void initialize() {</span></span>
<span class="line"><span>        primeNumberChecker = new PrimeNumberChecker();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * 步骤五：编写测试方法，使用自定义变量进行测试</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void testPrimeNumberChecker() {</span></span>
<span class="line"><span>        System.out.println(&quot;Parameterized Number is : &quot; + inputNumber);</span></span>
<span class="line"><span>        Assert.assertEquals(expectedResult,</span></span>
<span class="line"><span>                primeNumberChecker.validate(inputNumber));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行结果</p><p><img src="`+d+`" alt="error.图片加载失败"></p><h3 id="测试-套件测试" tabindex="-1">测试:套件测试 <a class="header-anchor" href="#测试-套件测试" aria-label="Permalink to &quot;测试:套件测试&quot;">​</a></h3><p>“套件测试”是指捆绑了几个单元测试用例并运行起来。在JUnit中，@RunWith 和 @Suite 这两个注解是用来运行套件测试。先来创建几个测试类</p><p>测试类1</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.junit4.testsuite;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.junit.Test;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class JunitTest1 {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void printMessage(){</span></span>
<span class="line"><span>        System.out.println(&quot;in JunitTest1&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>测试类2</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.junit4.testsuite;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.junit.Test;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class JunitTest2 {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void printMessage(){</span></span>
<span class="line"><span>        System.out.println(&quot;in JunitTest2&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>测试套件</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.junit4.testsuite;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.junit.runner.RunWith;</span></span>
<span class="line"><span>import org.junit.runners.Suite;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * Test suite.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@RunWith(Suite.class)</span></span>
<span class="line"><span>@Suite.SuiteClasses({</span></span>
<span class="line"><span>        /**</span></span>
<span class="line"><span>         * 此处类的配置顺序会影响执行顺序</span></span>
<span class="line"><span>         */</span></span>
<span class="line"><span>        JunitTest1.class,</span></span>
<span class="line"><span>        JunitTest2.class</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span>public class JunitSuiteTest {</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行结果</p><p><img src="`+g+`" alt="error.图片加载失败"></p><h3 id="测试-测试顺序" tabindex="-1">测试:测试顺序 <a class="header-anchor" href="#测试-测试顺序" aria-label="Permalink to &quot;测试:测试顺序&quot;">​</a></h3><p>自定义测试方法的顺序，比如按照方法的名字顺序：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.junit4;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.junit.FixMethodOrder;</span></span>
<span class="line"><span>import org.junit.Test;</span></span>
<span class="line"><span>import org.junit.runners.MethodSorters;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * Order.</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@FixMethodOrder(MethodSorters.NAME_ASCENDING)</span></span>
<span class="line"><span>public class TestMethodOrder {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void testA() {</span></span>
<span class="line"><span>        System.out.println(&quot;first&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void testC() {</span></span>
<span class="line"><span>        System.out.println(&quot;third&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void testB() {</span></span>
<span class="line"><span>        System.out.println(&quot;second&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行结果</p><p><img src="`+h+'" alt="error.图片加载失败"></p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li><a href="https://github.com/junit-team/junit4/wiki" target="_blank" rel="noreferrer">https://github.com/junit-team/junit4/wiki</a></li><li><a href="https://blog.csdn.net/qq%5C_34264849/article/details/88243278" target="_blank" rel="noreferrer">https://blog.csdn.net/qq\\_34264849/article/details/88243278</a></li><li><a href="https://www.cnblogs.com/jingjiren/p/10339039.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/jingjiren/p/10339039.html</a></li><li><a href="https://blog.csdn.net/weixin%5C_44425934/" target="_blank" rel="noreferrer">https://blog.csdn.net/weixin\\_44425934/</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',113)]))}const x=n(m,[["render",b]]);export{C as __pageData,x as default};
