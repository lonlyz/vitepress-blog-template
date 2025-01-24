import{_ as n,c as s,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/develop/refactor/dev-refactor-notnull-1.png",g=JSON.parse('{"title":"常见重构技巧 - 去除不必要的!=","description":"","frontmatter":{},"headers":[],"relativePath":"develop/refactor/dev-refactor-not-null.md","filePath":"develop/refactor/dev-refactor-not-null.md","lastUpdated":1737706346000}'),t={name:"develop/refactor/dev-refactor-not-null.md"};function i(o,a,c,r,d,u){return e(),s("div",null,a[0]||(a[0]=[p(`<h1 id="常见重构技巧-去除不必要的" tabindex="-1">常见重构技巧 - 去除不必要的!= <a class="header-anchor" href="#常见重构技巧-去除不必要的" aria-label="Permalink to &quot;常见重构技巧 - 去除不必要的!=&quot;">​</a></h1><blockquote><p>项目中会存在大量判空代码，多么丑陋繁冗！如何避免这种情况？我们是否滥用了判空呢？@pdai</p></blockquote><h2 id="场景一-null无意义之常规判断空" tabindex="-1">场景一：null无意义之常规判断空 <a class="header-anchor" href="#场景一-null无意义之常规判断空" aria-label="Permalink to &quot;场景一：null无意义之常规判断空&quot;">​</a></h2><ul><li>通常是这样的</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void xxxMethod(String key){</span></span>
<span class="line"><span>    if(key!=null&amp;&amp;!&quot;&quot;.equals(key)){</span></span>
<span class="line"><span>        // do something</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>初步的，使用Apache Commons，Guvava, Hutool等StringUtils</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void xxxMethod(String key){</span></span>
<span class="line"><span>    if(StringUtils.isNotEmpty(key)){</span></span>
<span class="line"><span>        // do something</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="场景二-null无意义之使用断言assert" tabindex="-1">场景二：null无意义之使用断言Assert <a class="header-anchor" href="#场景二-null无意义之使用断言assert" aria-label="Permalink to &quot;场景二：null无意义之使用断言Assert&quot;">​</a></h2><ul><li>考虑用Assert断言</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void xxxMethod(String key){</span></span>
<span class="line"><span>    Assert.notNull(key);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // do something</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="场景三-写util类是否都需要逐级判断空" tabindex="-1">场景三：写util类是否都需要逐级判断空 <a class="header-anchor" href="#场景三-写util类是否都需要逐级判断空" aria-label="Permalink to &quot;场景三：写util类是否都需要逐级判断空&quot;">​</a></h2><blockquote><p>逐级判断空，还是抛出自定义异常，还是不处理？It Depends...</p></blockquote><p>随手翻了下，<a href="https://gitee.com/loolly/hutool/blob/v5-dev/hutool-core/src/main/java/cn/hutool/core/util/IdcardUtil.java" target="_blank" rel="noreferrer">hutool IdcardUtil在新窗口打开</a> 显然是交给调用者判断的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>    * 是否有效身份证号</span></span>
<span class="line"><span>    *</span></span>
<span class="line"><span>    * @param idCard 身份证号，支持18位、15位和港澳台的10位</span></span>
<span class="line"><span>    * @return 是否有效</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span>public static boolean isValidCard(String idCard) {</span></span>
<span class="line"><span>    idCard = idCard.trim();// 这里idCard没判断空</span></span>
<span class="line"><span>    int length = idCard.length();</span></span>
<span class="line"><span>    switch (length) {</span></span>
<span class="line"><span>        case 18:// 18位身份证</span></span>
<span class="line"><span>            return isValidCard18(idCard);</span></span>
<span class="line"><span>        case 15:// 15位身份证</span></span>
<span class="line"><span>            return isValidCard15(idCard);</span></span>
<span class="line"><span>        case 10: {// 10位身份证，港澳台地区</span></span>
<span class="line"><span>            String[] cardVal = isValidCard10(idCard);</span></span>
<span class="line"><span>            return null != cardVal &amp;&amp; &quot;true&quot;.equals(cardVal[2]);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        default:</span></span>
<span class="line"><span>            return false;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>再比如 Apache Common IO中, 并没判断空</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>    * Copy bytes from a &lt;code&gt;byte[]&lt;/code&gt; to an &lt;code&gt;OutputStream&lt;/code&gt;.</span></span>
<span class="line"><span>    * @param input the byte array to read from</span></span>
<span class="line"><span>    * @param output the &lt;code&gt;OutputStream&lt;/code&gt; to write to</span></span>
<span class="line"><span>    * @throws IOException In case of an I/O problem</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span>public static void copy(final byte[] input, final OutputStream output)</span></span>
<span class="line"><span>        throws IOException {</span></span>
<span class="line"><span>    output.write(input);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="场景四-让null变的有意义" tabindex="-1">场景四：让null变的有意义 <a class="header-anchor" href="#场景四-让null变的有意义" aria-label="Permalink to &quot;场景四：让null变的有意义&quot;">​</a></h2><blockquote><p>返回一个空对象（而非null对象），比如NO_ACTION是特殊的Action，那么我们就定义一个ACTION。下面举个“栗子”，假设有如下代码</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Action {</span></span>
<span class="line"><span>  void doSomething();}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public interface Parser {</span></span>
<span class="line"><span>  Action findAction(String userInput);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其中，Parse有一个接口FindAction，这个接口会依据用户的输入，找到并执行对应的动作。假如用户输入不对，可能就找不到对应的动作（Action），因此findAction就会返回null，接下来action调用doSomething方法时，就会出现空指针。</p><p>解决这个问题的一个方式，就是使用Null Object pattern（空对象模式）</p><blockquote><p>NullObject模式首次发表在“ 程序设计模式语言 ”系列丛书中。一般的，在面向对象语言中，对对象的调用前需要使用判空检查，来判断这些对象是否为空，因为在空引用上无法调用所需方法。</p></blockquote><p><img src="`+l+`" alt=""></p><p>我们来改造一下</p><p>类定义如下，这样定义findAction方法后，确保无论用户输入什么，都不会返回null对象：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class MyParser implements Parser {</span></span>
<span class="line"><span>  private static Action NO_ACTION = new Action() {</span></span>
<span class="line"><span>    public void doSomething() { /* do nothing */ }</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  public Action findAction(String userInput) {</span></span>
<span class="line"><span>    // ...</span></span>
<span class="line"><span>    if ( /* we can&#39;t find any actions */ ) {</span></span>
<span class="line"><span>      return NO_ACTION;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对比下面两份调用实例</p><p>1.冗余: 每获取一个对象，就判一次空</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Parser parser = ParserFactory.getParser();</span></span>
<span class="line"><span>if (parser == null) {</span></span>
<span class="line"><span>  // now what?</span></span>
<span class="line"><span>  // this would be an example of where null isn&#39;t (or shouldn&#39;t be) a valid response</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>Action action = parser.findAction(someInput);</span></span>
<span class="line"><span>if (action == null) {</span></span>
<span class="line"><span>  // do nothing} </span></span>
<span class="line"><span>else {</span></span>
<span class="line"><span>  action.doSomething();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>2.精简</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ParserFactory.getParser().findAction(someInput).doSomething();</span></span></code></pre></div><p>因为无论什么情况，都不会返回空对象，因此通过findAction拿到action后，可以放心地调用action的方法。</p><p>顺便再提下一个插件：</p><blockquote><p>.NR Null Object插件 NR Null Object是一款适用于Android Studio、IntelliJ IDEA、PhpStorm、WebStorm、PyCharm、RubyMine、AppCode、CLion、GoLand、DataGrip等IDEA的Intellij插件。其可以根据现有对象，便捷快速生成其空对象模式需要的组成成分，其包含功能如下：</p></blockquote><ul><li>分析所选类可声明为接口的方法；</li><li>抽象出公有接口；</li><li>创建空对象，自动实现公有接口；</li><li>对部分函数进行可为空声明；</li><li>可追加函数进行再次生成；</li><li>自动的函数命名规范</li></ul><h2 id="场景五-java8中使用optional" tabindex="-1">场景五：Java8中使用Optional <a class="header-anchor" href="#场景五-java8中使用optional" aria-label="Permalink to &quot;场景五：Java8中使用Optional&quot;">​</a></h2><p>假设我们有一个像这样的类层次结构:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class Outer {</span></span>
<span class="line"><span>    Nested nested;</span></span>
<span class="line"><span>    Nested getNested() {</span></span>
<span class="line"><span>        return nested;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>class Nested {</span></span>
<span class="line"><span>    Inner inner;</span></span>
<span class="line"><span>    Inner getInner() {</span></span>
<span class="line"><span>        return inner;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>class Inner {</span></span>
<span class="line"><span>    String foo;</span></span>
<span class="line"><span>    String getFoo() {</span></span>
<span class="line"><span>        return foo;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>解决这种结构的深层嵌套路径是有点麻烦的。我们必须编写一堆 null 检查来确保不会导致一个 NullPointerException:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Outer outer = new Outer();</span></span>
<span class="line"><span>if (outer != null &amp;&amp; outer.nested != null &amp;&amp; outer.nested.inner != null) {</span></span>
<span class="line"><span>    System.out.println(outer.nested.inner.foo);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们可以通过利用 Java 8 的 Optional 类型来摆脱所有这些 null 检查。map 方法接收一个 Function 类型的 lambda 表达式，并自动将每个 function 的结果包装成一个 Optional 对象。这使我们能够在一行中进行多个 map 操作。Null 检查是在底层自动处理的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Optional.of(new Outer())</span></span>
<span class="line"><span>    .map(Outer::getNested)</span></span>
<span class="line"><span>    .map(Nested::getInner)</span></span>
<span class="line"><span>    .map(Inner::getFoo)</span></span>
<span class="line"><span>    .ifPresent(System.out::println);</span></span></code></pre></div><p>还有一种实现相同作用的方式就是通过利用一个 supplier 函数来解决嵌套路径的问题:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Outer obj = new Outer();</span></span>
<span class="line"><span>resolve(() -&gt; obj.getNested().getInner().getFoo())</span></span>
<span class="line"><span>    .ifPresent(System.out::println);</span></span></code></pre></div><p>调用 obj.getNested().getInner().getFoo()) 可能会抛出一个 NullPointerException 异常。在这种情况下，该异常将会被捕获，而该方法会返回 Optional.empty()。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static &lt;T&gt; Optional&lt;T&gt; resolve(Supplier&lt;T&gt; resolver) {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        T result = resolver.get();</span></span>
<span class="line"><span>        return Optional.ofNullable(result);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    catch (NullPointerException e) {</span></span>
<span class="line"><span>        return Optional.empty();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>请记住，这两个解决方案可能没有传统 null 检查那么高的性能。不过在大多数情况下不会有太大问题。</p><ul><li>更多Optional，可以看这篇： <a href="https://pdai.tech/md/java/java8/java8-optional.html" target="_blank" rel="noreferrer">Java 8 - Optional类</a><ul><li>Optional类的意义</li><li>Optional类有哪些常用的方法</li><li>Optional举例贯穿所有知识点</li><li>多重类嵌套Null值判断</li></ul></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,49)]))}const b=n(t,[["render",i]]);export{g as __pageData,b as default};
