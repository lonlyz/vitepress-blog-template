import{_ as a,c as n,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/develop/ut/dev-ut-idea-1.png",t="/vitepress-blog-template/images/develop/ut/dev-ut-idea-2.png",i="/vitepress-blog-template/images/develop/ut/dev-ut-idea-3.png",r="/vitepress-blog-template/images/develop/ut/dev-ut-idea-4.png",o="/vitepress-blog-template/images/develop/ut/dev-ut-idea-5.png",c="/vitepress-blog-template/images/develop/ut/dev-ut-idea-6.png",d="/vitepress-blog-template/images/develop/ut/dev-ut-idea-7.png",u="/vitepress-blog-template/images/develop/ut/dev-ut-idea-8.png",m="/vitepress-blog-template/images/develop/ut/dev-ut-idea-9.png",g="/vitepress-blog-template/images/develop/ut/dev-ut-idea-10.png",v="/vitepress-blog-template/images/develop/ut/dev-ut-idea-11.png",h="/vitepress-blog-template/images/develop/ut/dev-ut-idea-12.png",b="/vitepress-blog-template/images/develop/ut/dev-ut-idea-13.png",_="/vitepress-blog-template/images/develop/ut/dev-ut-idea-14.png",f="/vitepress-blog-template/images/develop/ut/dev-ut-idea-15.png",q="/vitepress-blog-template/images/develop/ut/dev-ut-idea-16.png",y=JSON.parse('{"title":"单元测试 - IDEA下单元测试详解","description":"","frontmatter":{},"headers":[],"relativePath":"develop/ut/dev-ut-x-junit-idea.md","filePath":"develop/ut/dev-ut-x-junit-idea.md","lastUpdated":1737706346000}'),k={name:"develop/ut/dev-ut-x-junit-idea.md"};function x(P,s,T,A,C,E){return e(),n("div",null,s[0]||(s[0]=[p(`<h1 id="单元测试-idea下单元测试详解" tabindex="-1">单元测试 - IDEA下单元测试详解 <a class="header-anchor" href="#单元测试-idea下单元测试详解" aria-label="Permalink to &quot;单元测试 - IDEA下单元测试详解&quot;">​</a></h1><blockquote><p>工欲善其事必先利其器，我们在写单元测试一定要使用工具，这将能大幅度提升编码的效率。本文以IDEA为例，看看如何利用插件提升效率。@pdai</p></blockquote><h2 id="场景准备" tabindex="-1">场景准备 <a class="header-anchor" href="#场景准备" aria-label="Permalink to &quot;场景准备&quot;">​</a></h2><p>准备一个待测试的类, 其中还包含着错误。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.junit4.module;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Calculator {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int result = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * add.</span></span>
<span class="line"><span>     *</span></span>
<span class="line"><span>     * @param operand1 first param</span></span>
<span class="line"><span>     * @param operand2 second param</span></span>
<span class="line"><span>     * @return sum</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    public int add(int operand1, int operand2) {</span></span>
<span class="line"><span>        result = operand1 + operand2;</span></span>
<span class="line"><span>        return result;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int subtract(int operand1, int operand2) {</span></span>
<span class="line"><span>        result = operand1 - operand2;</span></span>
<span class="line"><span>        return result;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int multiple(int operand1, int operand2) {</span></span>
<span class="line"><span>        result = operand1 * operand2;</span></span>
<span class="line"><span>        for (; ; ) {                    //死循环</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int divide(int operand1, int operand2) {</span></span>
<span class="line"><span>        result = operand1 / 0;</span></span>
<span class="line"><span>        return result;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int getResult() {</span></span>
<span class="line"><span>        return this.result;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="插件使用" tabindex="-1">插件使用 <a class="header-anchor" href="#插件使用" aria-label="Permalink to &quot;插件使用&quot;">​</a></h2><h3 id="自动生成单元测试" tabindex="-1">自动生成单元测试 <a class="header-anchor" href="#自动生成单元测试" aria-label="Permalink to &quot;自动生成单元测试&quot;">​</a></h3><p>第一个插件，首推的是JunitGeneratorV2.0</p><p><img src="`+l+'" alt="error.图片加载失败"></p><p>设置默认采用Junit4</p><p><img src="'+t+'" alt="error.图片加载失败"></p><p>如有必要可以设置生成的模板</p><p><img src="'+i+'" alt="error.图片加载失败"></p><p>测试下</p><p><img src="'+r+'" alt="error.图片加载失败"></p><p><img src="'+o+'" alt="error.图片加载失败"></p><p>生成单元测试</p><p><img src="'+c+`" alt="error.图片加载失败"></p><p>补充完整代码</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.junit4.module;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import org.junit.After;</span></span>
<span class="line"><span>import org.junit.Before;</span></span>
<span class="line"><span>import org.junit.Ignore;</span></span>
<span class="line"><span>import org.junit.Test;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import static org.junit.Assert.*;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class CalculatorTest {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static Calculator cal=new Calculator();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Before</span></span>
<span class="line"><span>    public void setUp() throws Exception {</span></span>
<span class="line"><span>        System.out.println(&quot;before&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @After</span></span>
<span class="line"><span>    public void tearDown() throws Exception {</span></span>
<span class="line"><span>        System.out.println(&quot;after&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void add() {</span></span>
<span class="line"><span>        cal.add(2,2);</span></span>
<span class="line"><span>        assertEquals(4,cal.getResult());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test</span></span>
<span class="line"><span>    public void subtract() {</span></span>
<span class="line"><span>        cal.subtract(4,2);</span></span>
<span class="line"><span>        assertEquals(2,cal.getResult());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Ignore</span></span>
<span class="line"><span>    public void multiply() {</span></span>
<span class="line"><span>        fail(&quot;Not yet implemented&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test(timeout = 2000)</span></span>
<span class="line"><span>    public void divide() {</span></span>
<span class="line"><span>        for(;;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Test(expected = ArithmeticException.class)</span></span>
<span class="line"><span>    public void testDivideByZero(){</span></span>
<span class="line"><span>        cal.divide(4,0);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>执行结果</p><p><img src="`+d+'" alt="error.图片加载失败"></p><h3 id="并行测试" tabindex="-1">并行测试 <a class="header-anchor" href="#并行测试" aria-label="Permalink to &quot;并行测试&quot;">​</a></h3><p>在大量的单元测试时，如何提升测试的效率呢？肯定是并行，所以你可以用如下的插件</p><p><img src="'+u+'" alt="error.图片加载失败"></p><p>看下相关测试触发按钮和输出：</p><p><img src="'+m+'" alt="error.图片加载失败"></p><h3 id="代码覆盖率" tabindex="-1">代码覆盖率 <a class="header-anchor" href="#代码覆盖率" aria-label="Permalink to &quot;代码覆盖率&quot;">​</a></h3><p>如何快速看本地代码测试覆盖率呢？</p><p><img src="'+g+'" alt="error.图片加载失败"></p><p>代码覆盖率</p><p><img src="'+v+'" alt="error.图片加载失败"></p><p><img src="'+h+'" alt="error.图片加载失败"></p><h3 id="profile" tabindex="-1">Profile <a class="header-anchor" href="#profile" aria-label="Permalink to &quot;Profile&quot;">​</a></h3><ul><li><strong>CPU Profile</strong></li></ul><p>Flame Graph</p><p><img src="'+b+'" alt="error.图片加载失败"></p><p>Call Tree</p><p><img src="'+_+'" alt="error.图片加载失败"></p><p>Method List</p><p><img src="'+f+'" alt="error.图片加载失败"></p><ul><li><strong>Allocation Profile</strong></li></ul><p><img src="'+q+'" alt="error.图片加载失败"></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',44)]))}const I=a(k,[["render",x]]);export{y as __pageData,I as default};
