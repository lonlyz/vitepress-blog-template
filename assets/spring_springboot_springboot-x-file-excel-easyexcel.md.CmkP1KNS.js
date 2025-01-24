import{_ as a,c as n,ai as e,o as p}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/spring/springboot/springboot-file-excel-easyexcel-1.png",t="/vitepress-blog-template/images/spring/springboot/springboot-file-excel-easyexcel-2.png",i="/vitepress-blog-template/images/spring/springboot/springboot-file-excel-easyexcel-4.png",o="/vitepress-blog-template/images/spring/springboot/springboot-file-excel-easyexcel-3.png",m=JSON.parse('{"title":"SpringBoot集成文件 - 集成EasyExcel之Excel导入导出","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-file-excel-easyexcel.md","filePath":"spring/springboot/springboot-x-file-excel-easyexcel.md","lastUpdated":1737706346000}'),c={name:"spring/springboot/springboot-x-file-excel-easyexcel.md"};function r(u,s,d,h,g,x){return p(),n("div",null,s[0]||(s[0]=[e(`<h1 id="springboot集成文件-集成easyexcel之excel导入导出" tabindex="-1">SpringBoot集成文件 - 集成EasyExcel之Excel导入导出 <a class="header-anchor" href="#springboot集成文件-集成easyexcel之excel导入导出" aria-label="Permalink to &quot;SpringBoot集成文件 - 集成EasyExcel之Excel导入导出&quot;">​</a></h1><blockquote><p>EasyExcel是一个基于Java的、快速、简洁、解决大文件内存溢出的Excel处理工具。它能让你在不用考虑性能、内存的等因素的情况下，快速完成Excel的读、写等功能。它是基于POI来封装实现的，主要解决其易用性，封装性和性能问题。本文主要介绍通过SpringBoot集成Excel实现Excel的导入，导出和填充模板等功能。@pdai</p></blockquote><h2 id="知识准备" tabindex="-1">知识准备 <a class="header-anchor" href="#知识准备" aria-label="Permalink to &quot;知识准备&quot;">​</a></h2><blockquote><p>需要了解EasyExcel，以及这个工具设计的初衷（为什么有了POI，还会需要EasyExcel?)。</p></blockquote><h3 id="什么是easyexcel" tabindex="-1">什么是EasyExcel <a class="header-anchor" href="#什么是easyexcel" aria-label="Permalink to &quot;什么是EasyExcel&quot;">​</a></h3><blockquote><p>EasyExcel是阿里开源的基于POI封装的Excel处理工具，更多请参考<a href="https://poi.apache.org/index.html" target="_blank" rel="noreferrer">官方文档在新窗口打开</a>。</p></blockquote><p>EasyExcel是一个基于Java的、快速、简洁、解决大文件内存溢出的Excel处理工具。它能让你在不用考虑性能、内存的等因素的情况下，快速完成Excel的读、写等功能。</p><h3 id="easyexcel要解决poi什么问题" tabindex="-1">EasyExcel要解决POI什么问题？ <a class="header-anchor" href="#easyexcel要解决poi什么问题" aria-label="Permalink to &quot;EasyExcel要解决POI什么问题？&quot;">​</a></h3><blockquote><p>因为EasyExcel是基于POI封装的，主要考虑的是易用性，封装性和性能问题。</p></blockquote><p>Java解析、生成Excel比较有名的框架有Apache poi、jxl。但他们都存在一个严重的问题就是非常的耗内存，poi有一套SAX模式的API可以一定程度的解决一些内存溢出的问题，但POI还是有一些缺陷，比如07版Excel解压缩以及解压后存储都是在内存中完成的，内存消耗依然很大。easyexcel重写了poi对07版Excel的解析，一个3M的excel用POI sax解析依然需要100M左右内存，改用easyexcel可以降低到几M，并且再大的excel也不会出现内存溢出；03版依赖POI的sax模式，在上层做了模型转换的封装，让使用者更加简单方便。</p><h2 id="实现案例" tabindex="-1">实现案例 <a class="header-anchor" href="#实现案例" aria-label="Permalink to &quot;实现案例&quot;">​</a></h2><blockquote><p>这里展示SpringBoot集成EasyExcel导出用户列表的和导入用户列表的例子。</p></blockquote><h3 id="pom依赖" tabindex="-1">Pom依赖 <a class="header-anchor" href="#pom依赖" aria-label="Permalink to &quot;Pom依赖&quot;">​</a></h3><p>引入poi的依赖包</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;com.alibaba&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;easyexcel&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;3.1.1&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><h3 id="导出excel" tabindex="-1">导出Excel <a class="header-anchor" href="#导出excel" aria-label="Permalink to &quot;导出Excel&quot;">​</a></h3><p>User类</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.file.excel.easyexcel.entity;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import com.alibaba.excel.annotation.ExcelProperty;</span></span>
<span class="line"><span>import lombok.AllArgsConstructor;</span></span>
<span class="line"><span>import lombok.Builder;</span></span>
<span class="line"><span>import lombok.Data;</span></span>
<span class="line"><span>import lombok.NoArgsConstructor;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Builder</span></span>
<span class="line"><span>@Data</span></span>
<span class="line"><span>@AllArgsConstructor</span></span>
<span class="line"><span>@NoArgsConstructor</span></span>
<span class="line"><span>public class User implements BaseEntity {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * user id.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @ExcelProperty(&quot;ID&quot;)</span></span>
<span class="line"><span>    private Long id;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * username.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @ExcelProperty(&quot;Name&quot;)</span></span>
<span class="line"><span>    private String userName;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * email.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @ExcelProperty(&quot;Email&quot;)</span></span>
<span class="line"><span>    private String email;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * phoneNumber.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @ExcelProperty(&quot;Phone&quot;)</span></span>
<span class="line"><span>    private long phoneNumber;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * description.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @ExcelProperty(&quot;Description&quot;)</span></span>
<span class="line"><span>    private String description;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>UserController中导出的方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@ApiOperation(&quot;Download Excel&quot;)</span></span>
<span class="line"><span>@GetMapping(&quot;/excel/download&quot;)</span></span>
<span class="line"><span>public void download(HttpServletResponse response) {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        response.reset();</span></span>
<span class="line"><span>        response.setContentType(&quot;application/vnd.ms-excel&quot;);</span></span>
<span class="line"><span>        response.setHeader(&quot;Content-disposition&quot;,</span></span>
<span class="line"><span>                &quot;attachment;filename=user_excel_&quot; + System.currentTimeMillis() + &quot;.xlsx&quot;);</span></span>
<span class="line"><span>        userService.downloadExcel(response.getOutputStream());</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>        e.printStackTrace();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>UserServiceImple中导出Excel的主方法(是不是很简洁)</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public void downloadExcel(ServletOutputStream outputStream) {</span></span>
<span class="line"><span>    EasyExcelFactory.write(outputStream, User.class).sheet(&quot;User&quot;).doWrite(this::getUserList);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>private List&lt;User&gt; getUserList() {</span></span>
<span class="line"><span>    return Collections.singletonList(User.builder()</span></span>
<span class="line"><span>            .id(1L).userName(&quot;pdai&quot;).email(&quot;pdai@pdai.tech&quot;).phoneNumber(121231231231L)</span></span>
<span class="line"><span>            .description(&quot;hello world&quot;)</span></span>
<span class="line"><span>            .build());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>导出后的excel如下</p><p><img src="`+l+`" alt="error.图片加载失败"></p><h3 id="导入excel" tabindex="-1">导入Excel <a class="header-anchor" href="#导入excel" aria-label="Permalink to &quot;导入Excel&quot;">​</a></h3><blockquote><p>我们将上面导出的excel文件导入。</p></blockquote><p>UserController中导入的方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@ApiOperation(&quot;Upload Excel&quot;)</span></span>
<span class="line"><span>@PostMapping(&quot;/excel/upload&quot;)</span></span>
<span class="line"><span>public ResponseResult&lt;String&gt; upload(@RequestParam(value = &quot;file&quot;, required = true) MultipartFile file) {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        userService.upload(file.getInputStream());</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>        e.printStackTrace();</span></span>
<span class="line"><span>        return ResponseResult.fail(e.getMessage());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return ResponseResult.success();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>UserServiceImple中导入Excel的主方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public void upload(InputStream inputStream) throws IOException {</span></span>
<span class="line"><span>    // ReadListener不是必须的，它主要的设计是读取excel数据的后置处理(并考虑一次性读取到内存潜在的内存泄漏问题)</span></span>
<span class="line"><span>    EasyExcelFactory.read(inputStream, User.class, new ReadListener&lt;User&gt;() {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        @Override</span></span>
<span class="line"><span>        public void invoke(User user, AnalysisContext analysisContext) {</span></span>
<span class="line"><span>            cachedDataList.add(user);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        @Override</span></span>
<span class="line"><span>        public void doAfterAllAnalysed(AnalysisContext analysisContext) {</span></span>
<span class="line"><span>            cachedDataList.forEach(user -&gt; log.info(user.toString()));</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }).sheet().doRead();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过PostMan进行接口测试</p><p><img src="`+t+'" alt="error.图片加载失败"></p><p>这里注意下，需要有字体的支持，比如如果没有字体支撑将会报如下告警：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Warning: the font &quot;Times&quot; is not available, so &quot;Lucida Bright&quot; has been substituted, but may have unexpected appearance or behavor. Re-enable the &quot;Times&quot; font to remove this warning.</span></span></code></pre></div><h3 id="填充excel模板" tabindex="-1">填充Excel模板 <a class="header-anchor" href="#填充excel模板" aria-label="Permalink to &quot;填充Excel模板&quot;">​</a></h3><p>我们先来准备一个excel模板，考虑了横向表和纵向列表，以及单一信息等，基本上能满足多数的应用场景。</p><p><img src="'+i+`" alt="error.图片加载失败"></p><p>UserController中下载填充后的Excel方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@ApiOperation(&quot;Fill Excel Template&quot;)</span></span>
<span class="line"><span>@GetMapping(&quot;/excel/fill&quot;)</span></span>
<span class="line"><span>public void fillTemplate(HttpServletResponse response) {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        response.reset();</span></span>
<span class="line"><span>        response.setContentType(&quot;application/vnd.ms-excel&quot;);</span></span>
<span class="line"><span>        response.setHeader(&quot;Content-disposition&quot;,</span></span>
<span class="line"><span>                &quot;attachment;filename=user_excel_template_&quot; + System.currentTimeMillis() + &quot;.xlsx&quot;);</span></span>
<span class="line"><span>        userService.fillExcelTemplate(response.getOutputStream());</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>        e.printStackTrace();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>UserServiceImpl中填充excel模板的方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 模板注意 用{} 来表示你要用的变量 如果本来就有&quot;{&quot;,&quot;}&quot; 特殊字符 用&quot;\\{&quot;,&quot;\\}&quot;代替</span></span>
<span class="line"><span>// {} 代表普通变量 {.} 代表是list的变量 {前缀.} 前缀可以区分不同的list</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>public void fillExcelTemplate(ServletOutputStream outputStream) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 确保文件可访问，这个例子的excel模板，放在根目录下面</span></span>
<span class="line"><span>    String templateFileName = &quot;/Users/pdai/Downloads/user_excel_template.xlsx&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 方案1</span></span>
<span class="line"><span>    try (ExcelWriter excelWriter = EasyExcelFactory.write(outputStream).withTemplate(templateFileName).build()) {</span></span>
<span class="line"><span>        WriteSheet writeSheet = EasyExcelFactory.writerSheet().build();</span></span>
<span class="line"><span>        FillConfig fillConfig = FillConfig.builder().direction(WriteDirectionEnum.HORIZONTAL).build();</span></span>
<span class="line"><span>        // 如果有多个list 模板上必须有{前缀.} 这里的前缀就是 userList，然后多个list必须用 FillWrapper包裹</span></span>
<span class="line"><span>        excelWriter.fill(new FillWrapper(&quot;userList&quot;, getUserList()), fillConfig, writeSheet);</span></span>
<span class="line"><span>        excelWriter.fill(new FillWrapper(&quot;userList&quot;, getUserList()), fillConfig, writeSheet);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        excelWriter.fill(new FillWrapper(&quot;userList2&quot;, getUserList()), writeSheet);</span></span>
<span class="line"><span>        excelWriter.fill(new FillWrapper(&quot;userList2&quot;, getUserList()), writeSheet);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Map&lt;String, Object&gt; map = new HashMap&lt;&gt;();</span></span>
<span class="line"><span>        map.put(&quot;user&quot;, &quot;pdai&quot;);</span></span>
<span class="line"><span>        map.put(&quot;date&quot;, new Date());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        excelWriter.fill(map, writeSheet);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>访问<a href="http://localhost:8080/user/excel/fill" target="_blank" rel="noreferrer">http://localhost:8080/user/excel/fill</a> 下载</p><p><img src="`+o+'" alt="error.图片加载失败"></p><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><p><a href="https://easyexcel.opensource.alibaba.com/docs/current/" target="_blank" rel="noreferrer">https://easyexcel.opensource.alibaba.com/docs/current/</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',48)]))}const q=a(c,[["render",r]]);export{m as __pageData,q as default};
