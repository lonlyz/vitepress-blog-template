import{_ as a,c as n,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/spring/springboot/springboot-file-excel-easypoi-1.png",t="/vitepress-blog-template/images/spring/springboot/springboot-file-excel-easypoi-2.png",i="/vitepress-blog-template/images/spring/springboot/springboot-file-excel-easypoi-3.png",o="/vitepress-blog-template/images/spring/springboot/springboot-file-excel-easypoi-4.png",x=JSON.parse('{"title":"SpringBoot集成文件 - 集成EasyPOI之Excel导入导出","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-file-excel-easypoi.md","filePath":"spring/springboot/springboot-x-file-excel-easypoi.md","lastUpdated":1737706346000}'),r={name:"spring/springboot/springboot-x-file-excel-easypoi.md"};function c(u,s,d,h,m,g){return e(),n("div",null,s[0]||(s[0]=[p(`<h1 id="springboot集成文件-集成easypoi之excel导入导出" tabindex="-1">SpringBoot集成文件 - 集成EasyPOI之Excel导入导出 <a class="header-anchor" href="#springboot集成文件-集成easypoi之excel导入导出" aria-label="Permalink to &quot;SpringBoot集成文件 - 集成EasyPOI之Excel导入导出&quot;">​</a></h1><blockquote><p>除了POI和EasyExcel，国内还有一个EasyPOI框架较为常见，适用于没有使用过POI并希望快速操作Excel的入门项目，在中大型项目中并不推荐使用(为了保证知识体系的完整性，把EasyPOI也加了进来)。本文主要介绍SpringBoot集成EasyPOI实现Excel的导入，导出和填充模板等功能。@pdai</p></blockquote><h2 id="知识准备" tabindex="-1">知识准备 <a class="header-anchor" href="#知识准备" aria-label="Permalink to &quot;知识准备&quot;">​</a></h2><blockquote><p>需要对EasyPOI特色功能和潜在缺陷。@pdai</p></blockquote><h3 id="什么是easypoi" tabindex="-1">什么是EasyPOI <a class="header-anchor" href="#什么是easypoi" aria-label="Permalink to &quot;什么是EasyPOI&quot;">​</a></h3><blockquote><p>如下是<a href="http://doc.wupaas.com/docs/easypoi/easypoi-1c0u4mo8p4ro8" target="_blank" rel="noreferrer">EasyPOI官方在新窗口打开</a>介绍的功能。</p></blockquote><p>独特的功能：</p><ul><li>基于注解的导入导出,修改注解就可以修改Excel</li><li>支持常用的样式自定义</li><li>基于map可以灵活定义的表头字段</li><li>支持一堆多的导出,导入</li><li>支持模板的导出,一些常见的标签,自定义标签</li><li>支持HTML/Excel转换,如果模板还不能满足用户的变态需求,请用这个功能</li><li>支持word的导出,支持图片,Excel</li></ul><h3 id="如何看待easypoi" tabindex="-1">如何看待EasyPOI <a class="header-anchor" href="#如何看待easypoi" aria-label="Permalink to &quot;如何看待EasyPOI&quot;">​</a></h3><blockquote><p><strong>不建议在稍复杂的项目中使用EasyPOI</strong>。@pdai</p></blockquote><ul><li>简单的功能通过对POI的封装成本也不高，复杂的一点的适配性差；有点像为了做某件事方便，引入了一个工具，最后发现大量的时间都在迎合/修理这个工具</li><li>个人色彩，缺少稳定维护团队，潜在风险远大于节约的这点时间；同时个人开源又期望寻求盈利点，对开发者选择而言是要很慎重的。</li><li>封装的思路可以借鉴下，在自行根据业务封装时可以参考下</li></ul><h2 id="实现案例" tabindex="-1">实现案例 <a class="header-anchor" href="#实现案例" aria-label="Permalink to &quot;实现案例&quot;">​</a></h2><blockquote><p>这里展示SpringBoot集成EasyPOI导出用户列表的和导入用户列表的例子。</p></blockquote><h3 id="pom依赖" tabindex="-1">Pom依赖 <a class="header-anchor" href="#pom依赖" aria-label="Permalink to &quot;Pom依赖&quot;">​</a></h3><p>引入poi的依赖包</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;cn.afterturn&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;easypoi-spring-boot-starter&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;4.4.0&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><h3 id="导出excel" tabindex="-1">导出Excel <a class="header-anchor" href="#导出excel" aria-label="Permalink to &quot;导出Excel&quot;">​</a></h3><p>User 类</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.file.excel.easypoi.entity;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import cn.afterturn.easypoi.excel.annotation.Excel;</span></span>
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
<span class="line"><span>    @Excel(name = &quot;ID&quot;)</span></span>
<span class="line"><span>    private Long id;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * username.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Excel(name = &quot;Name&quot;)</span></span>
<span class="line"><span>    private String userName;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * email.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Excel(name = &quot;Email&quot;)</span></span>
<span class="line"><span>    private String email;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * phoneNumber.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Excel(name = &quot;Phone&quot;)</span></span>
<span class="line"><span>    private long phoneNumber;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    /**</span></span>
<span class="line"><span>     * description.</span></span>
<span class="line"><span>     */</span></span>
<span class="line"><span>    @Excel(name = &quot;Description&quot;)</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><p>UserServiceImple中导出Excel的主方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public void downloadExcel(ServletOutputStream outputStream) throws IOException {</span></span>
<span class="line"><span>    ExportParams exportParams = new ExportParams();</span></span>
<span class="line"><span>    exportParams.setTitle(&quot;User Table&quot;);</span></span>
<span class="line"><span>    exportParams.setSheetName(&quot;User Sheet&quot;);</span></span>
<span class="line"><span>    Workbook workbook = ExcelExportUtil.exportExcel(exportParams, User.class, getUserList());</span></span>
<span class="line"><span>    workbook.write(outputStream);</span></span>
<span class="line"><span>    workbook.close();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>导出后的excel如下</p><p><img src="`+l+`" alt="error.图片加载失败"></p><blockquote><p>PS：再吐槽下：</p></blockquote><p>当getUserList用 Collections.singletonList时是直接报错，看了下源码~</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private List&lt;User&gt; getUserList() {</span></span>
<span class="line"><span>    return Collections.singletonList(User.builder()</span></span>
<span class="line"><span>            .id(1L).userName(&quot;pdai&quot;).email(&quot;pdai@pdai.tech&quot;).phoneNumber(121231231231L)</span></span>
<span class="line"><span>            .description(&quot;hello world&quot;)</span></span>
<span class="line"><span>            .build());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>默默改成ArrayList, 因为源代码是通过remove来迭代的，且只对Unmodified Collection做了处理，而没有对singletonList... 只能说不建议在稍复杂的项目中使用EasyPOI...</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private List&lt;User&gt; getUserList() {</span></span>
<span class="line"><span>    List&lt;User&gt; userList = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    userList.add(User.builder()</span></span>
<span class="line"><span>            .id(1L).userName(&quot;pdai&quot;).email(&quot;pdai@pdai.tech&quot;).phoneNumber(121231231231L)</span></span>
<span class="line"><span>            .description(&quot;hello world&quot;)</span></span>
<span class="line"><span>            .build());</span></span>
<span class="line"><span>    return userList;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="导入excel" tabindex="-1">导入Excel <a class="header-anchor" href="#导入excel" aria-label="Permalink to &quot;导入Excel&quot;">​</a></h3><p>UserController中导入的方法，（导入的文件在项目根目录）</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@ApiOperation(&quot;Upload Excel&quot;)</span></span>
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
<span class="line"><span>public void upload(InputStream inputStream) throws Exception {</span></span>
<span class="line"><span>    ImportParams importParams = new ImportParams();</span></span>
<span class="line"><span>    List&lt;User&gt; userList = ExcelImportUtil.importExcel(inputStream, User.class, importParams);</span></span>
<span class="line"><span>    userList.stream().forEach(user -&gt; log.info(user.toString()));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过PostMan进行接口测试</p><p><img src="`+t+'" alt="error.图片加载失败"></p><p>日志如下</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>2022-06-15 22:20:48.145  INFO 52348 --- [nio-8080-exec-2] t.p.s.f.e.e.s.impl.UserServiceImpl       : User(id=1, userName=pdai, email=pdai@pdai.tech, phoneNumber=121231231231, description=hello world)</span></span></code></pre></div><h3 id="填充excel模板" tabindex="-1">填充Excel模板 <a class="header-anchor" href="#填充excel模板" aria-label="Permalink to &quot;填充Excel模板&quot;">​</a></h3><p>准备如下Excel模板</p><p><img src="'+i+`" alt="error.图片加载失败"></p><p>UserController中下载填充后的Excel方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@ApiOperation(&quot;Fill Excel Template&quot;)</span></span>
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
<span class="line"><span>}</span></span></code></pre></div><p>UserServiceImpl中填充excel模板的方法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public void fillExcelTemplate(ServletOutputStream outputStream) throws IOException {</span></span>
<span class="line"><span>    // 确保文件可访问，这个例子的excel模板，放在根目录下面</span></span>
<span class="line"><span>    String templateFileName = &quot;/Users/pdai/Downloads/user_excel_template_easypoi.xlsx&quot;;</span></span>
<span class="line"><span>    TemplateExportParams params = new TemplateExportParams(templateFileName);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Map&lt;String, Object&gt; map = new HashMap&lt;&gt;();</span></span>
<span class="line"><span>    map.put(&quot;user&quot;, &quot;pdai&quot;);</span></span>
<span class="line"><span>    map.put(&quot;date&quot;, new Date());</span></span>
<span class="line"><span>    map.put(&quot;userList&quot;, getUserList());</span></span>
<span class="line"><span>    Workbook workbook = ExcelExportUtil.exportExcel(params, map);</span></span>
<span class="line"><span>    workbook.write(outputStream);</span></span>
<span class="line"><span>    workbook.close();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private List&lt;User&gt; getUserList() {</span></span>
<span class="line"><span>    List&lt;User&gt; userList = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>    userList.add(User.builder()</span></span>
<span class="line"><span>            .id(1L).userName(&quot;pdai&quot;).email(&quot;pdai@pdai.tech&quot;).phoneNumber(121231231231L)</span></span>
<span class="line"><span>            .description(&quot;hello world&quot;)</span></span>
<span class="line"><span>            .build());</span></span>
<span class="line"><span>    userList.add(User.builder()</span></span>
<span class="line"><span>            .id(2L).userName(&quot;pdai2&quot;).email(&quot;pdai2@pdai.tech&quot;).phoneNumber(1212312312312L)</span></span>
<span class="line"><span>            .description(&quot;hello world2&quot;)</span></span>
<span class="line"><span>            .build());</span></span>
<span class="line"><span>    return userList;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>访问<a href="http://localhost:8080/user/excel/fill" target="_blank" rel="noreferrer">http://localhost:8080/user/excel/fill</a> 下载</p><p><img src="`+o+'" alt="error.图片加载失败"></p><p>(PS: 说实在的，稍复杂一些的，不如自己封装...)</p><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><p><a href="http://doc.wupaas.com/docs/easypoi/easypoi-1c0u4mo8p4ro8" target="_blank" rel="noreferrer">http://doc.wupaas.com/docs/easypoi/easypoi-1c0u4mo8p4ro8</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>',54)]))}const q=a(r,[["render",c]]);export{x as __pageData,q as default};
