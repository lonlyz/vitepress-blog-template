import{_ as s,c as n,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const t="/vitepress-blog-template/images/spring/springboot/springboot-file-updownload-2.png",l="/vitepress-blog-template/images/spring/springboot/springboot-file-updownload-1.png",i="/vitepress-blog-template/images/spring/springboot/springboot-file-updownload-3.png",o="/vitepress-blog-template/images/spring/springboot/springboot-file-updownload-4.png",f=JSON.parse('{"title":"▶SpringBoot集成文件 - 基础的文件上传和下载","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-file-upload-download.md","filePath":"spring/springboot/springboot-x-file-upload-download.md","lastUpdated":1737706346000}'),r={name:"spring/springboot/springboot-x-file-upload-download.md"};function c(d,a,u,h,g,b){return e(),n("div",null,a[0]||(a[0]=[p(`<h1 id="▶springboot集成文件-基础的文件上传和下载" tabindex="-1">▶SpringBoot集成文件 - 基础的文件上传和下载 <a class="header-anchor" href="#▶springboot集成文件-基础的文件上传和下载" aria-label="Permalink to &quot;▶SpringBoot集成文件 - 基础的文件上传和下载&quot;">​</a></h1><blockquote><p>项目中常见的功能是需要将数据文件（比如Excel,csv)上传到服务器端进行处理，亦或是将服务器端的数据以某种文件形式（比如excel,pdf,csv,word)下载到客户端。本文主要介绍基于SpringBoot的对常规文件的上传和下载，以及常见的问题等。@pdai</p></blockquote><h2 id="知识准备" tabindex="-1">知识准备 <a class="header-anchor" href="#知识准备" aria-label="Permalink to &quot;知识准备&quot;">​</a></h2><blockquote><p>需要理解文件上传和下载的常见场景和技术手段。@pdai</p></blockquote><h3 id="哪些场景需要文件上传和下载" tabindex="-1">哪些场景需要文件上传和下载 <a class="header-anchor" href="#哪些场景需要文件上传和下载" aria-label="Permalink to &quot;哪些场景需要文件上传和下载&quot;">​</a></h3><p>项目中常见的功能是需要将数据文件（比如Excel,csv)上传到服务器端进行处理，亦或是将服务器端的数据以某种文件形式（比如excel,pdf,csv,word)下载到客户端。</p><h2 id="实现案例" tabindex="-1">实现案例 <a class="header-anchor" href="#实现案例" aria-label="Permalink to &quot;实现案例&quot;">​</a></h2><blockquote><p>本例子主要展示文件的上传和文件的下载。</p></blockquote><h3 id="pom依赖" tabindex="-1">Pom依赖 <a class="header-anchor" href="#pom依赖" aria-label="Permalink to &quot;Pom依赖&quot;">​</a></h3><p>引入spring-boot-starter-web即可</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;spring-boot-starter-web&lt;/artifactId&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><h3 id="文件上传" tabindex="-1">文件上传 <a class="header-anchor" href="#文件上传" aria-label="Permalink to &quot;文件上传&quot;">​</a></h3><p>上传一个文件，并保存到本地文件夹中</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@PostMapping(&quot;/upload&quot;)</span></span>
<span class="line"><span>public ResponseResult&lt;String&gt; upload(@RequestParam(value = &quot;file&quot;, required = true) MultipartFile file) {</span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>        // 本地文件保存位置</span></span>
<span class="line"><span>        String uploadPath = &quot;/Users/pdai/uploadFile&quot;; // 改这里</span></span>
<span class="line"><span>        File uploadDir = new File(uploadPath);</span></span>
<span class="line"><span>        if (!uploadDir.exists()) {</span></span>
<span class="line"><span>            uploadDir.mkdir();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        log.info(uploadDir.getAbsolutePath());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // 本地文件</span></span>
<span class="line"><span>        File localFile = new File(uploadPath + File.separator + file.getOriginalFilename());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // transfer to local</span></span>
<span class="line"><span>        file.transferTo(localFile);</span></span>
<span class="line"><span>    } catch (Exception e) {</span></span>
<span class="line"><span>        e.printStackTrace();</span></span>
<span class="line"><span>        return ResponseResult.fail(e.getMessage());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return ResponseResult.success();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过postman，模拟上传的请求</p><p><img src="`+t+'" alt="error.图片加载失败"></p><p>上传文件结果：</p><p><img src="'+l+`" alt="error.图片加载失败"></p><h3 id="文件下载" tabindex="-1">文件下载 <a class="header-anchor" href="#文件下载" aria-label="Permalink to &quot;文件下载&quot;">​</a></h3><p>从本地文件夹中读取文件，并通过http下载</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@GetMapping(&quot;/download&quot;)</span></span>
<span class="line"><span>public void download(HttpServletResponse response) {</span></span>
<span class="line"><span>    response.reset();</span></span>
<span class="line"><span>    response.setContentType(&quot;application/octet-stream&quot;);</span></span>
<span class="line"><span>    response.setHeader(&quot;Content-disposition&quot;,</span></span>
<span class="line"><span>            &quot;attachment;filename=file_&quot; + System.currentTimeMillis() + &quot;.hprof&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 从文件读到servlet response输出流中</span></span>
<span class="line"><span>    File file = new File(&quot;/Users/pdai/pdai_heap_dump_test.hprof&quot;); // 改这里</span></span>
<span class="line"><span>    try (FileInputStream inputStream = new FileInputStream(file);) { // try-with-resources</span></span>
<span class="line"><span>        byte[] b = new byte[1024];</span></span>
<span class="line"><span>        int len;</span></span>
<span class="line"><span>        while ((len = inputStream.read(b)) &gt; 0) {</span></span>
<span class="line"><span>            response.getOutputStream().write(b, 0, len);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } catch (IOException e) {</span></span>
<span class="line"><span>        e.printStackTrace();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>下载文件</p><p><img src="`+i+'" alt="error.图片加载失败"></p><p>注：</p><p>如果使用postman下载文件，默认的response大小是50MB，下载大于50MB的文件需要在这里自行设置。</p><p><img src="'+o+`" alt="error.图片加载失败"></p><h2 id="进一步理解" tabindex="-1">进一步理解 <a class="header-anchor" href="#进一步理解" aria-label="Permalink to &quot;进一步理解&quot;">​</a></h2><blockquote><p>通过如下几个问题进一步理解。</p></blockquote><h3 id="springboot文件上传大小参数" tabindex="-1">SpringBoot文件上传大小参数？ <a class="header-anchor" href="#springboot文件上传大小参数" aria-label="Permalink to &quot;SpringBoot文件上传大小参数？&quot;">​</a></h3><p>SpringBoot对上传的文件大小有限制，默认的最大每个文件配置最大为1MB，默认多个文件上传（上传目标文件夹）总大小是10MB。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>spring:</span></span>
<span class="line"><span>  servlet:</span></span>
<span class="line"><span>    multipart:</span></span>
<span class="line"><span>      max-file-size: 1024MB # 单个文件大小</span></span>
<span class="line"><span>      max-request-size: 10240MB # 总文件大小（允许存储文件的文件夹大小）</span></span></code></pre></div><p>更多其它的参数可以参看MultipartProperties类</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@ConfigurationProperties(prefix = &quot;spring.servlet.multipart&quot;, ignoreUnknownFields = false)</span></span>
<span class="line"><span>public class MultipartProperties {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * Whether to enable support of multipart uploads.</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	private boolean enabled = true;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * Intermediate location of uploaded files.</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	private String location;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * Max file size.</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	private DataSize maxFileSize = DataSize.ofMegabytes(1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * Max request size.</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	private DataSize maxRequestSize = DataSize.ofMegabytes(10);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * Threshold after which files are written to disk.</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	private DataSize fileSizeThreshold = DataSize.ofBytes(0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>	/**</span></span>
<span class="line"><span>	 * Whether to resolve the multipart request lazily at the time of file or parameter</span></span>
<span class="line"><span>	 * access.</span></span>
<span class="line"><span>	 */</span></span>
<span class="line"><span>	private boolean resolveLazily = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="多个文件上传" tabindex="-1">多个文件上传？ <a class="header-anchor" href="#多个文件上传" aria-label="Permalink to &quot;多个文件上传？&quot;">​</a></h3><p>Spring支持接收多个文件的，只需要用MultipartFile接收即可</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@PostMapping(&quot;/upload&quot;)</span></span>
<span class="line"><span>public ResponseResult&lt;String&gt; upload(MultipartFile[] files) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><p><a href="https://www.jianshu.com/p/95469ecfbb62" target="_blank" rel="noreferrer">https://www.jianshu.com/p/95469ecfbb62</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,41)]))}const q=s(r,[["render",c]]);export{f as __pageData,q as default};
