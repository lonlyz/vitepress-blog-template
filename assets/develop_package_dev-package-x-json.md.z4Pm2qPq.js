import{_ as s,c as n,ai as e,o as t}from"./chunks/framework.BrYByd3F.js";const p="/vitepress-blog-template/images/develop/package/dev-package-json-3.png",l="/vitepress-blog-template/images/develop/package/dev-package-json-1.png",i="/vitepress-blog-template/images/develop/package/dev-package-json-2.png",m=JSON.parse('{"title":"常用开发库 - JSON库详解","description":"","frontmatter":{},"headers":[],"relativePath":"develop/package/dev-package-x-json.md","filePath":"develop/package/dev-package-x-json.md","lastUpdated":1737706346000}'),o={name:"develop/package/dev-package-x-json.md"};function r(c,a,u,d,h,g){return t(),n("div",null,a[0]||(a[0]=[e(`<h1 id="常用开发库-json库详解" tabindex="-1">常用开发库 - JSON库详解 <a class="header-anchor" href="#常用开发库-json库详解" aria-label="Permalink to &quot;常用开发库 - JSON库详解&quot;">​</a></h1><blockquote><p>JSON应用非常广泛，对于Java常用的JSON库要完全掌握; 其中考虑到FastJson代码质量，漏洞，坑等等，应该尽量避免使用。@pdai</p></blockquote><h2 id="json简介" tabindex="-1">JSON简介 <a class="header-anchor" href="#json简介" aria-label="Permalink to &quot;JSON简介&quot;">​</a></h2><h3 id="json是什么" tabindex="-1">JSON是什么 <a class="header-anchor" href="#json是什么" aria-label="Permalink to &quot;JSON是什么&quot;">​</a></h3><ul><li>JSON 指的是 JavaScript 对象表示法（JavaScript Object Notation）</li><li>JSON 是轻量级的文本数据交换格式</li><li>JSON 独立于语言：JSON 使用 Javascript语法来描述数据对象，但是 JSON 仍然独立于语言和平台。JSON 解析器和 JSON 库支持许多不同的编程语言。 目前非常多的动态（PHP，JSP，.NET）编程语言都支持JSON。</li><li>JSON 具有自我描述性，更易理解</li></ul><h3 id="结构与类型" tabindex="-1">结构与类型 <a class="header-anchor" href="#结构与类型" aria-label="Permalink to &quot;结构与类型&quot;">​</a></h3><ul><li>只有两种结构：对象内的键值对集合结构和数组，对象用{}表示、内部是”key”:”value”，数组用[]表示，不同值用逗号分开</li><li>基本数值有7个： false / null / true / object / array / number / string</li><li>再加上结构可以嵌套，进而可以用来表达复杂的数据</li></ul><p>一个简单实例</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>   &quot;Image&quot;: {</span></span>
<span class="line"><span>       &quot;Width&quot;:  800,</span></span>
<span class="line"><span>       &quot;Height&quot;: 600,</span></span>
<span class="line"><span>       &quot;Title&quot;:  &quot;View from 15th Floor&quot;,</span></span>
<span class="line"><span>       &quot;Thumbnail&quot;: {</span></span>
<span class="line"><span>           &quot;Url&quot;:    &quot;http://www.example.com/image/481989943&quot;,</span></span>
<span class="line"><span>           &quot;Height&quot;: 125,</span></span>
<span class="line"><span>           &quot;Width&quot;:  &quot;100&quot;</span></span>
<span class="line"><span>       },</span></span>
<span class="line"><span>       &quot;IDs&quot;: [116, 943, 234, 38793]</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="json优秀资源" tabindex="-1">JSON优秀资源 <a class="header-anchor" href="#json优秀资源" aria-label="Permalink to &quot;JSON优秀资源&quot;">​</a></h3><ul><li><a href="https://github.com/burningtree/awesome-json" target="_blank" rel="noreferrer">awesome-json在新窗口打开</a></li></ul><h3 id="json在线解析工具" tabindex="-1">JSON在线解析工具 <a class="header-anchor" href="#json在线解析工具" aria-label="Permalink to &quot;JSON在线解析工具&quot;">​</a></h3><ul><li><a href="http://c.runoob.com/front-end/53" target="_blank" rel="noreferrer">JSON 在线解析在新窗口打开</a></li></ul><p><img src="`+p+'" alt="error.图片加载失败"></p><h2 id="json类库" tabindex="-1">JSON类库 <a class="header-anchor" href="#json类库" aria-label="Permalink to &quot;JSON类库&quot;">​</a></h2><p>Java中并没有内置JSON的解析，因此使用JSON需要借助第三方类库。</p><p>下面是几个常用的 JSON 解析类库：</p><ul><li>FastJson: 阿里巴巴开发的 JSON 库，性能优秀。</li><li>Jackson: 社区十分活跃且更新速度很快。</li><li>Gson: 谷歌开发的 JSON 库，功能十分全面。</li></ul><h3 id="性能测试对比" tabindex="-1">性能测试对比 <a class="header-anchor" href="#性能测试对比" aria-label="Permalink to &quot;性能测试对比&quot;">​</a></h3><p>从下面的测试结果可以看出，序列化次数比较小的时候，Gson性能最好，当不断增加的时候到了100000，Gson明细弱于Jackson和FastJson， 这时候FastJson性能是真的牛，另外还可以看到不管数量少还是多，Jackson一直表现优异。而那个Json-lib可以直接忽略。</p><ul><li>JSON序列化性能</li></ul><p><img src="'+l+'" alt="error.图片加载失败"></p><ul><li>JSON反序列化性能</li></ul><p><img src="'+i+`" alt="error.图片加载失败"></p><p>更多请参考： <a href="https://www.xncoding.com/2018/01/09/java/jsons.html" target="_blank" rel="noreferrer">Java几种常用JSON库性能比较在新窗口打开</a></p><h2 id="fastjson" tabindex="-1">FastJson <a class="header-anchor" href="#fastjson" aria-label="Permalink to &quot;FastJson&quot;">​</a></h2><p>先泼一盆冷水，个人非常不推荐使用FastJson, 为什么？</p><ul><li>FastJson 源码质量较低</li><li>FastJson Bug、漏洞较多</li><li>FastJson 牺牲多数场景下的稳定性而提高的效率</li></ul><h3 id="fastjson-简介" tabindex="-1">Fastjson 简介 <a class="header-anchor" href="#fastjson-简介" aria-label="Permalink to &quot;Fastjson 简介&quot;">​</a></h3><p>Fastjson 是一个 Java 库，可以将 Java 对象转换为 JSON 格式，当然它也可以将 JSON 字符串转换为 Java 对象。</p><p>Fastjson 可以操作任何 Java 对象，即使是一些预先存在的没有源码的对象。</p><ul><li><a href="https://github.com/alibaba/fastjson" target="_blank" rel="noreferrer">Fastjson Github在新窗口打开</a> 看这里</li><li><a href="https://github.com/alibaba/fastjson/wiki/Quick-Start-CN" target="_blank" rel="noreferrer">Fastjson 中文 Wiki在新窗口打开</a></li></ul><h3 id="fastjson-特性" tabindex="-1">Fastjson 特性 <a class="header-anchor" href="#fastjson-特性" aria-label="Permalink to &quot;Fastjson 特性&quot;">​</a></h3><ul><li>提供服务器端、安卓客户端两种解析工具，性能表现较好。</li><li>提供了 toJSONString() 和 parseObject() 方法来将 Java 对象与 JSON 相互转换。调用toJSONString方 法即可将对象转换成 JSON 字符串，parseObject 方法则反过来将 JSON 字符串转换成对象。</li><li>允许转换预先存在的无法修改的对象（只有class、无源代码）。</li><li>Java泛型的广泛支持。</li><li>允许对象的自定义表示、允许自定义序列化类。</li><li>支持任意复杂对象（具有深厚的继承层次和广泛使用的泛型类型）。</li></ul><h3 id="下载和使用" tabindex="-1">下载和使用 <a class="header-anchor" href="#下载和使用" aria-label="Permalink to &quot;下载和使用&quot;">​</a></h3><p>你可以在 maven 中央仓库中直接下载：<a href="http://repo1.maven.org/maven2/com/alibaba/fastjson/" target="_blank" rel="noreferrer">http://repo1.maven.org/maven2/com/alibaba/fastjson/在新窗口打开</a></p><p>配置 maven 依赖:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;com.alibaba&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;fastjson&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;x.x.x&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><p>其中 x.x.x 是版本号，根据需要使用特定版本，建议使用最新版本。</p><h3 id="序列化一个对象成json字符串" tabindex="-1">序列化一个对象成JSON字符串 <a class="header-anchor" href="#序列化一个对象成json字符串" aria-label="Permalink to &quot;序列化一个对象成JSON字符串&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>User user = new User();</span></span>
<span class="line"><span>user.setName(&quot;校长&quot;);</span></span>
<span class="line"><span>user.setAge(3);</span></span>
<span class="line"><span>user.setSalary(new BigDecimal(&quot;123456789.0123&quot;));</span></span>
<span class="line"><span>String jsonString = JSON.toJSONString(user);</span></span>
<span class="line"><span>System.out.println(jsonString);</span></span>
<span class="line"><span>// 输出 {&quot;age&quot;:3,&quot;name&quot;:&quot;校长&quot;,&quot;old&quot;:false,&quot;salary&quot;:123456789.0123}</span></span></code></pre></div><h3 id="反序列化一个json字符串成java对象" tabindex="-1">反序列化一个JSON字符串成Java对象 <a class="header-anchor" href="#反序列化一个json字符串成java对象" aria-label="Permalink to &quot;反序列化一个JSON字符串成Java对象&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>String jsonString = &quot;{\\&quot;age\\&quot;:3,\\&quot;birthdate\\&quot;:1496738822842,\\&quot;name\\&quot;:\\&quot;校长\\&quot;,\\&quot;old\\&quot;:true,\\&quot;salary\\&quot;:123456789.0123}&quot;;</span></span>
<span class="line"><span> User u = JSON.parseObject(jsonString ,User.class);</span></span>
<span class="line"><span> System.out.println(u.getName());</span></span>
<span class="line"><span> // 输出 校长</span></span>
<span class="line"><span></span></span>
<span class="line"><span>String jsonStringArray = &quot;[{\\&quot;age\\&quot;:3,\\&quot;birthdate\\&quot;:1496738822842,\\&quot;name\\&quot;:\\&quot;校长\\&quot;,\\&quot;old\\&quot;:true,\\&quot;salary\\&quot;:123456789.0123}]&quot;;</span></span>
<span class="line"><span>List&lt;User&gt; userList = JSON.parseArray(jsonStringArray, User.class);</span></span>
<span class="line"><span>System.out.println(userList.size());</span></span>
<span class="line"><span>// 输出 1</span></span></code></pre></div><h3 id="对于日期的处理" tabindex="-1">对于日期的处理 <a class="header-anchor" href="#对于日期的处理" aria-label="Permalink to &quot;对于日期的处理&quot;">​</a></h3><p>默认序列化Date输出使用”yyyy-MM-dd HH:mm:ss”格式，可以用UseISO8601DateFormat特性换成”yyyy-MM-dd’T’HH:mm:ss”格式。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>JSON.defaultTimeZone = TimeZone.getTimeZone(&quot;Asia/Shanghai&quot;);</span></span>
<span class="line"><span>JSON.defaultLocale = Locale.US;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>public static class Model {</span></span>
<span class="line"><span>    @JSONField(format = &quot;MMM dd, yyyy h:mm:ss aa&quot;)</span></span>
<span class="line"><span>    private java.util.Date date;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public java.util.Date getDate() {</span></span>
<span class="line"><span>        return date;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void setDate(java.util.Date date) {</span></span>
<span class="line"><span>        this.date = date;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @JSONField(format = &quot;MMM-dd-yyyy h:mm:ss aa&quot;)</span></span>
<span class="line"><span>    public java.sql.Date date2;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="bean和数组转换" tabindex="-1">Bean和数组转换 <a class="header-anchor" href="#bean和数组转换" aria-label="Permalink to &quot;Bean和数组转换&quot;">​</a></h3><ul><li><a href="https://github.com/alibaba/fastjson/wiki/BeanToArray_cn" target="_blank" rel="noreferrer">官方例子 - BeanToArray_cn在新窗口打开</a></li></ul><h3 id="设置字段名" tabindex="-1">设置字段名 <a class="header-anchor" href="#设置字段名" aria-label="Permalink to &quot;设置字段名&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class A {</span></span>
<span class="line"><span>    @JSONField(name=&quot;ID&quot;)</span></span>
<span class="line"><span>    private int id;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int getId() {return id;}</span></span>
<span class="line"><span>    public void setId(int value) {this.id = id;}</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="设置是否不序列化某字段" tabindex="-1">设置是否不序列化某字段 <a class="header-anchor" href="#设置是否不序列化某字段" aria-label="Permalink to &quot;设置是否不序列化某字段&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class A {</span></span>
<span class="line"><span>    @JSONField(serialize=false)</span></span>
<span class="line"><span>    public Date date;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class A {</span></span>
<span class="line"><span>    @JSONField(deserialize=false)</span></span>
<span class="line"><span>    public Date date;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="设置字段顺序" tabindex="-1">设置字段顺序 <a class="header-anchor" href="#设置字段顺序" aria-label="Permalink to &quot;设置字段顺序&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public static class VO {</span></span>
<span class="line"><span>    @JSONField(ordinal = 3)</span></span>
<span class="line"><span>    private int f0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @JSONField(ordinal = 2)</span></span>
<span class="line"><span>    private int f1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @JSONField(ordinal = 1)</span></span>
<span class="line"><span>    private int f2;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="自定义序列化和反序列化" tabindex="-1">自定义序列化和反序列化 <a class="header-anchor" href="#自定义序列化和反序列化" aria-label="Permalink to &quot;自定义序列化和反序列化&quot;">​</a></h3><ul><li><a href="https://blog.csdn.net/u010246789/article/details/52539576" target="_blank" rel="noreferrer">fastjson SerializerFeature详解在新窗口打开</a></li><li><a href="https://github.com/alibaba/fastjson/wiki/ObjectDeserializer_cn" target="_blank" rel="noreferrer">ObjectDeserializer_cn在新窗口打开</a></li></ul><h3 id="fastjson漏洞问题" tabindex="-1">FastJson漏洞问题 <a class="header-anchor" href="#fastjson漏洞问题" aria-label="Permalink to &quot;FastJson漏洞问题&quot;">​</a></h3><blockquote><p>尽量使用最新版本。</p></blockquote><ul><li><a href="http://blog.nsfocus.net/analysis-protection-fastjson-remote-code-execution-vulnerability/" target="_blank" rel="noreferrer">fastjson远程代码执行漏洞技术分析与防护方案在新窗口打开</a></li></ul><p>好了，我要开喷了。</p><p>警告</p><p>远离FastJson这个库，老程序员都知道这里有多少坑:</p><ul><li><a href="https://github.com/alibaba/fastjson/issues" target="_blank" rel="noreferrer">alibaba/fastjson在新窗口打开</a></li><li><a href="https://www.zhihu.com/question/44199956/answer/112224034" target="_blank" rel="noreferrer">fastjson这么快老外为啥还是热衷 jackson?在新窗口打开</a></li></ul><h2 id="jackson" tabindex="-1">JackSon <a class="header-anchor" href="#jackson" aria-label="Permalink to &quot;JackSon&quot;">​</a></h2><h3 id="jackson简介" tabindex="-1">JackSon简介 <a class="header-anchor" href="#jackson简介" aria-label="Permalink to &quot;JackSon简介&quot;">​</a></h3><ul><li><a href="https://github.com/FasterXML/jackson" target="_blank" rel="noreferrer">Jackson Github在新窗口打开</a> 看这里</li><li><a href="http://wiki.fasterxml.com/JacksonHome" target="_blank" rel="noreferrer">Jackson Wiki在新窗口打开</a></li><li><a href="https://github.com/FasterXML/jackson-docs" target="_blank" rel="noreferrer">Jackson 文档在新窗口打开</a></li></ul><h3 id="jackson组件" tabindex="-1">Jackson组件 <a class="header-anchor" href="#jackson组件" aria-label="Permalink to &quot;Jackson组件&quot;">​</a></h3><h4 id="_3个核心模块" tabindex="-1">3个核心模块： <a class="header-anchor" href="#_3个核心模块" aria-label="Permalink to &quot;3个核心模块：&quot;">​</a></h4><ul><li><strong>Streaming</strong>: jackson-core jar，定义了底层的streaming API和实现了Json特性。</li><li><strong>Annotations</strong>: jackson-annotations jar，包含了标准的Jackson注解。本文暂不介绍。</li><li><strong>Databind</strong>: jackson-databind jar，实现了数据绑定和对象序列化，它依赖于streaming和annotations的包。</li></ul><h4 id="第三方数据类型模块" tabindex="-1">第三方数据类型模块 <a class="header-anchor" href="#第三方数据类型模块" aria-label="Permalink to &quot;第三方数据类型模块&quot;">​</a></h4><p>这些扩展是插件式的Jackson模块，用ObjectMapper.registerModule()注册，并且通过添加serializers和deserializers以便Databind包（ObjectMapper / ObjectReader / ObjectWriter）可以读写这些类型，来增加对各种常用的Java库的数据类型的支持。</p><h4 id="数据格式模块" tabindex="-1">数据格式模块 <a class="header-anchor" href="#数据格式模块" aria-label="Permalink to &quot;数据格式模块&quot;">​</a></h4><p>Jackson也有处理程序对JAX-RS标准实现者例如Jersey, RESTeasy, CXF等提供了数据格式支持。处理程序实现了MessageBodyReader和MessageBodyWriter，目前支持的数据格式包括JSON, Smile, XML, YAML和CBOR。</p><p>数据格式提供了除了Json之外的数据格式支持，它们绝大部分仅仅实现了streaming API abstractions，以便数据绑定组件可以按照原来的方式使用。另一些（几乎不需要）提供了databind标准功能来处理例如schemas。</p><h3 id="jackson的使用" tabindex="-1">Jackson的使用 <a class="header-anchor" href="#jackson的使用" aria-label="Permalink to &quot;Jackson的使用&quot;">​</a></h3><p>引用maven jar包：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;!-- https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-core --&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;com.fasterxml.jackson.core&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;jackson-core&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;2.10.1&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;!-- https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-databind --&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;com.fasterxml.jackson.core&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;jackson-databind&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;2.10.1&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span>
<span class="line"><span>&lt;!-- https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-annotations --&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;com.fasterxml.jackson.core&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;jackson-annotations&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;2.10.1&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><h3 id="序列化一个对象成json字符串-1" tabindex="-1">序列化一个对象成JSON字符串 <a class="header-anchor" href="#序列化一个对象成json字符串-1" aria-label="Permalink to &quot;序列化一个对象成JSON字符串&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void toJson() throws JsonProcessingException {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ObjectMapper mapper = new ObjectMapper();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    City case1 = new City();</span></span>
<span class="line"><span>    case1.setCity(&quot;SZ&quot;);</span></span>
<span class="line"><span>    case1.setAge(123);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    String jsonStr = mapper.writeValueAsString(case1);</span></span>
<span class="line"><span>    System.out.println(&quot;JSON:&quot; + jsonStr);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 输出：JSON:{&quot;city&quot;:&quot;SZ&quot;,&quot;age&quot;:123}</span></span></code></pre></div><h3 id="反序列化一个json字符串成java对象-1" tabindex="-1">反序列化一个JSON字符串成Java对象 <a class="header-anchor" href="#反序列化一个json字符串成java对象-1" aria-label="Permalink to &quot;反序列化一个JSON字符串成Java对象&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public void toObj() throws JsonParseException, JsonMappingException, IOException {</span></span>
<span class="line"><span>    ObjectMapper mapper = new ObjectMapper();</span></span>
<span class="line"><span>    String inputjsonstr = &quot;{\\&quot;city\\&quot;:\\&quot;SZ\\&quot;,\\&quot;age\\&quot;:123}&quot;;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    City readcase = mapper.readValue(inputjsonstr, City.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    System.out.println(&quot;city info:&quot; + readcase);</span></span>
<span class="line"><span>}</span></span></code></pre></div><blockquote><p>如果里面有未知属性，比如json中有<code>desc</code>字段，但是City中没有相应字段，会报错, 需要设置如下：</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);</span></span></code></pre></div><h3 id="常用注解" tabindex="-1">常用注解 <a class="header-anchor" href="#常用注解" aria-label="Permalink to &quot;常用注解&quot;">​</a></h3><ul><li><code>@JsonProperty(&quot;xxx&quot;)</code>: 将当前的属性名在json字符串中重新命名为当前设置的这个值，比如在示例中，将age--&gt;mAge</li><li><code>@JsonIgnore</code>: 将被标注的属性在生成json字符串的时候，直接忽略</li><li><code>@JsonInclude</code>: 是一个类级别的设置，JsonInclude.Include.NON_EMPTY标识只有非NULL的值才会被纳入json string之中，其余的都被忽略，比如这里的location属性，并没有出现在最终的结果字符串中。</li><li><code>@JsonSerialize</code>: 使用自定义的类来实现自定义的字段转换。写入操作。</li><li><code>@JsonDeserialize</code>: 解析的时候，自定义的转换器；读取操作。</li><li><code>@JsonAutoDetect</code>: 设置类的访问策略，是否所有的属性都可以，还是按照一定的方式来提取。</li><li><code>@JsonRawValue</code>: 无转换的将属性值写入到json 字符串中。 写入操作</li><li><code>@JsonValue</code>: 标注方法，用以替代缺省的方法，由该方法来完成json的字符输出。</li></ul><h2 id="gson" tabindex="-1">GSON <a class="header-anchor" href="#gson" aria-label="Permalink to &quot;GSON&quot;">​</a></h2><h3 id="gson简介" tabindex="-1">Gson简介 <a class="header-anchor" href="#gson简介" aria-label="Permalink to &quot;Gson简介&quot;">​</a></h3><p>Gson是这样一个Java类库，它可以将Java对象转换为相应的JSON形式，也可以将JSON字符串转换为对应的Java对象。 Gson可以使用任意Java对象，包括哪些预先存在的、不在你的源代码中的对象（因此，你并不知道对象的属性）。</p><ul><li><a href="https://www.jianshu.com/p/1e20b28c39d1" target="_blank" rel="noreferrer">Gson用户指南（中文翻译）在新窗口打开</a>看这里</li></ul><h3 id="gson的目标" tabindex="-1">Gson的目标 <a class="header-anchor" href="#gson的目标" aria-label="Permalink to &quot;Gson的目标&quot;">​</a></h3><ul><li>提供一种机制，使得将Java对象转换为JSON或相反如使用toString()以及构造器（工厂方法）一样简单。</li><li>允许预先存在的不可变的对象转换为JSON或与之相反。</li><li>允许自定义对象的表现形式</li><li>支持任意复杂的对象</li><li>输出轻量易读的JSON</li></ul><h3 id="gson的使用" tabindex="-1">Gson的使用 <a class="header-anchor" href="#gson的使用" aria-label="Permalink to &quot;Gson的使用&quot;">​</a></h3><p>使用Gson的首要类是Gson类，你可以仅仅通过new Gson()的方式创建它。你也可以通过GsonBuilder类去创建Gson实例，这个类允许你进行一系列配置，例如版本控制等等。</p><p>Gson实例不会保存任何进行Json操作时的状态。因此，你可以自由的服用相同的Gson对象进行诸多的Json序列化和反序列化操作。</p><p>引用maven jar包：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;!-- https://mvnrepository.com/artifact/com.google.guava/guava --&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;com.google.guava&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;guava&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;28.2-jre&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><h3 id="序列化" tabindex="-1">序列化 <a class="header-anchor" href="#序列化" aria-label="Permalink to &quot;序列化&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 基础类型</span></span>
<span class="line"><span>Gson gson = new Gson();</span></span>
<span class="line"><span>gson.toJson(1);            ==&gt; prints 1</span></span>
<span class="line"><span>gson.toJson(&quot;abcd&quot;);       ==&gt; prints &quot;abcd&quot;</span></span>
<span class="line"><span>gson.toJson(new Long(10)); ==&gt; prints 10</span></span>
<span class="line"><span>int[] values = { 1 };</span></span>
<span class="line"><span>gson.toJson(values);       ==&gt; prints [1]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 对象</span></span>
<span class="line"><span>BagOfPrimitives obj = new BagOfPrimitives();</span></span>
<span class="line"><span>Gson gson = new Gson();</span></span>
<span class="line"><span>String json = gson.toJson(obj);  </span></span>
<span class="line"><span>==&gt; json is {&quot;value1&quot;:1,&quot;value2&quot;:&quot;abc&quot;}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 数组</span></span>
<span class="line"><span>Gson gson = new Gson();</span></span>
<span class="line"><span>int[] ints = {1, 2, 3, 4, 5};</span></span>
<span class="line"><span>String[] strings = {&quot;abc&quot;, &quot;def&quot;, &quot;ghi&quot;};</span></span>
<span class="line"><span>gson.toJson(ints);     ==&gt; prints [1,2,3,4,5]</span></span>
<span class="line"><span>gson.toJson(strings);  ==&gt; prints [&quot;abc&quot;, &quot;def&quot;, &quot;ghi&quot;]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 集合</span></span>
<span class="line"><span>Gson gson = new Gson();</span></span>
<span class="line"><span>Collection&lt;Integer&gt; ints = Lists.immutableList(1,2,3,4,5);</span></span>
<span class="line"><span>String json = gson.toJson(ints); ==&gt; json is [1,2,3,4,5]</span></span></code></pre></div><p>其中的对象代码：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class BagOfPrimitives {</span></span>
<span class="line"><span>  private int value1 = 1;</span></span>
<span class="line"><span>  private String value2 = &quot;abc&quot;;</span></span>
<span class="line"><span>  private transient int value3 = 3;</span></span>
<span class="line"><span>  BagOfPrimitives() {</span></span>
<span class="line"><span>    // no-args constructor</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="反序列化" tabindex="-1">反序列化 <a class="header-anchor" href="#反序列化" aria-label="Permalink to &quot;反序列化&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 基础类型</span></span>
<span class="line"><span>Gson gson = new Gson();</span></span>
<span class="line"><span>int one = gson.fromJson(&quot;1&quot;, int.class);</span></span>
<span class="line"><span>Integer one = gson.fromJson(&quot;1&quot;, Integer.class);</span></span>
<span class="line"><span>Long one = gson.fromJson(&quot;1&quot;, Long.class);</span></span>
<span class="line"><span>Boolean false = gson.fromJson(&quot;false&quot;, Boolean.class);</span></span>
<span class="line"><span>String str = gson.fromJson(&quot;\\&quot;abc\\&quot;&quot;, String.class);</span></span>
<span class="line"><span>String anotherStr = gson.fromJson(&quot;[\\&quot;abc\\&quot;]&quot;, String.class);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 对象</span></span>
<span class="line"><span>BagOfPrimitives obj2 = gson.fromJson(json, BagOfPrimitives.class);   </span></span>
<span class="line"><span>==&gt; obj2 is just like obj</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 数组</span></span>
<span class="line"><span>Gson gson = new Gson();</span></span>
<span class="line"><span>int[] ints2 = gson.fromJson(&quot;[1,2,3,4,5]&quot;, int[].class); </span></span>
<span class="line"><span>==&gt; ints2 will be same as ints</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 集合</span></span>
<span class="line"><span>Gson gson = new Gson();</span></span>
<span class="line"><span>Type collectionType = new TypeToken&lt;Collection&lt;Integer&gt;&gt;(){}.getType();</span></span>
<span class="line"><span>Collection&lt;Integer&gt; ints2 = gson.fromJson(json, collectionType);</span></span>
<span class="line"><span>ints2 is same as ints</span></span></code></pre></div><h3 id="自定义序列化和反序列化机制" tabindex="-1">自定义序列化和反序列化机制 <a class="header-anchor" href="#自定义序列化和反序列化机制" aria-label="Permalink to &quot;自定义序列化和反序列化机制&quot;">​</a></h3><p>有时候，默认的实现并不是你想要的。这在处理类库时常常发生（例如DateTime）。Gson允许你注册自己自定义的序列化器和反序列化器。该过程分为两部分：</p><ul><li><p>Json序列化器：需要为一个对象自定义序列化机制。</p></li><li><p>Json反序列化器：需要为一个类型自定义反序列化机制。</p></li></ul><p>实例构造者：并不需要，如果无参构造器是可用的或者注册了一个反序列化器。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>GsonBuilder gson = new GsonBuilder();</span></span>
<span class="line"><span>gson.registerTypeAdapter(MyType2.class, new MyTypeAdapter());</span></span>
<span class="line"><span>gson.registerTypeAdapter(MyType.class, new MySerializer());</span></span>
<span class="line"><span>gson.registerTypeAdapter(MyType.class, new MyDeserializer());</span></span>
<span class="line"><span>gson.registerTypeAdapter(MyType.class, new MyInstanceCreator());</span></span></code></pre></div><p>registerTypeAdapter会检查类型适配器是否实现了上面三个接口中的一个以上并且它们都注册了类型适配器。</p><p>更多请参考：<a href="https://www.jianshu.com/p/1e20b28c39d1" target="_blank" rel="noreferrer">Gson用户指南（中文翻译）在新窗口打开</a></p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li><a href="https://github.com/FasterXML/jackson" target="_blank" rel="noreferrer">https://github.com/FasterXML/jackson</a></li><li><a href="https://www.runoob.com/w3cnote/fastjson-intro.html" target="_blank" rel="noreferrer">https://www.runoob.com/w3cnote/fastjson-intro.html</a></li><li><a href="https://blog.csdn.net/m0%5C_37076574/article/details/81317403" target="_blank" rel="noreferrer">https://blog.csdn.net/m0\\_37076574/article/details/81317403</a></li><li><a href="https://blog.csdn.net/blueheart20/article/details/52212221" target="_blank" rel="noreferrer">https://blog.csdn.net/blueheart20/article/details/52212221</a></li><li><a href="https://blog.csdn.net/gjb724332682/article/details/51586701" target="_blank" rel="noreferrer">https://blog.csdn.net/gjb724332682/article/details/51586701</a></li><li><a href="https://www.jianshu.com/p/1e20b28c39d1" target="_blank" rel="noreferrer">https://www.jianshu.com/p/1e20b28c39d1</a></li><li><a href="https://www.jianshu.com/p/923a9fe78108" target="_blank" rel="noreferrer">https://www.jianshu.com/p/923a9fe78108</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,112)]))}const q=s(o,[["render",r]]);export{m as __pageData,q as default};
