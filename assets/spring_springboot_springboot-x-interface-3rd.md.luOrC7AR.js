import{_ as n,c as a,ai as e,o as t}from"./chunks/framework.BrYByd3F.js";const g=JSON.parse('{"title":"SpringBoot接口 - 如何访问外部接口","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-interface-3rd.md","filePath":"spring/springboot/springboot-x-interface-3rd.md","lastUpdated":1737706346000}'),p={name:"spring/springboot/springboot-x-interface-3rd.md"};function i(l,s,o,r,c,u){return t(),a("div",null,s[0]||(s[0]=[e(`<h1 id="springboot接口-如何访问外部接口" tabindex="-1">SpringBoot接口 - 如何访问外部接口 <a class="header-anchor" href="#springboot接口-如何访问外部接口" aria-label="Permalink to &quot;SpringBoot接口 - 如何访问外部接口&quot;">​</a></h1><blockquote><p>在SpringBoot接口开发中，存在着本模块的代码需要访问外面模块接口或外部url链接的需求, 比如调用外部的地图API或者天气API。那么有哪些方式可以调用外部接口呢？@pdai</p></blockquote><h2 id="什么样的场景需要访问外部接口" tabindex="-1">什么样的场景需要访问外部接口 <a class="header-anchor" href="#什么样的场景需要访问外部接口" aria-label="Permalink to &quot;什么样的场景需要访问外部接口&quot;">​</a></h2><p>调用其它模块的API，或者其它三方服务，比如调用外部的地图API或者天气API等。</p><h2 id="访问外部接口的常见方案" tabindex="-1">访问外部接口的常见方案 <a class="header-anchor" href="#访问外部接口的常见方案" aria-label="Permalink to &quot;访问外部接口的常见方案&quot;">​</a></h2><blockquote><p>主要有如下几种方案，其中RestTemplate需要重点掌握。</p></blockquote><h3 id="方案一-采用原生的http请求" tabindex="-1">方案一: 采用原生的Http请求 <a class="header-anchor" href="#方案一-采用原生的http请求" aria-label="Permalink to &quot;方案一: 采用原生的Http请求&quot;">​</a></h3><p>在代码中采用原生的http请求，代码参考如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@RequestMapping(&quot;/doPostGetJson&quot;)</span></span>
<span class="line"><span>public String doPostGetJson() throws ParseException {</span></span>
<span class="line"><span>   //此处将要发送的数据转换为json格式字符串</span></span>
<span class="line"><span>   String jsonText = &quot;{id: 1}&quot;;</span></span>
<span class="line"><span>   JSONObject json = (JSONObject) JSONObject.parse(jsonText);</span></span>
<span class="line"><span>   JSONObject sr = this.doPost(json);</span></span>
<span class="line"><span>   System.out.println(&quot;返回参数: &quot; + sr);</span></span>
<span class="line"><span>   return sr.toString();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public static JSONObject doPost(JSONObject date) {</span></span>
<span class="line"><span>   HttpClient client = HttpClients.createDefault();</span></span>
<span class="line"><span>   // 要调用的接口方法</span></span>
<span class="line"><span>   String url = &quot;http://192.168.1.101:8080/getJson&quot;;</span></span>
<span class="line"><span>   HttpPost post = new HttpPost(url);</span></span>
<span class="line"><span>   JSONObject jsonObject = null;</span></span>
<span class="line"><span>   try {</span></span>
<span class="line"><span>      StringEntity s = new StringEntity(date.toString());</span></span>
<span class="line"><span>      s.setContentEncoding(&quot;UTF-8&quot;);</span></span>
<span class="line"><span>      s.setContentType(&quot;application/json&quot;);</span></span>
<span class="line"><span>      post.setEntity(s);</span></span>
<span class="line"><span>      post.addHeader(&quot;content-type&quot;, &quot;text/xml&quot;);</span></span>
<span class="line"><span>      HttpResponse res = client.execute(post);</span></span>
<span class="line"><span>      String response1 = EntityUtils.toString(res.getEntity());</span></span>
<span class="line"><span>      System.out.println(response1);</span></span>
<span class="line"><span>      if (res.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {</span></span>
<span class="line"><span>         String result = EntityUtils.toString(res.getEntity());// 返回json格式: </span></span>
<span class="line"><span>         jsonObject = JSONObject.parseObject(result);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>   } catch (Exception e) {</span></span>
<span class="line"><span>      throw new RuntimeException(e);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   return jsonObject;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="方案二-采用feign进行消费" tabindex="-1">方案二: 采用Feign进行消费 <a class="header-anchor" href="#方案二-采用feign进行消费" aria-label="Permalink to &quot;方案二: 采用Feign进行消费&quot;">​</a></h3><p>1、在maven项目中添加依赖</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.springframework.cloud&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;spring-cloud-starter-feign&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;1.2.2.RELEASE&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><p>2、编写接口，放置在service层</p><p>这里的decisionEngine.url 是配置在properties中的 是ip地址和端口号 decisionEngine.url=<a href="http://10.2.1.148:3333/decision/person" target="_blank" rel="noreferrer">http://10.2.1.148:3333/decision/person</a> 是接口名字</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@FeignClient(url = &quot;\${decisionEngine.url}&quot;,name=&quot;engine&quot;)</span></span>
<span class="line"><span>public interface DecisionEngineService {</span></span>
<span class="line"><span>　　@RequestMapping(value=&quot;/decision/person&quot;,method= RequestMethod.POST)</span></span>
<span class="line"><span>　　public JSONObject getEngineMesasge(@RequestParam(&quot;uid&quot;) String uid,@RequestParam(&quot;productCode&quot;) String productCode);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>3、在Java的启动类上加上@EnableFeignClients</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@EnableFeignClients //参见此处</span></span>
<span class="line"><span>@EnableDiscoveryClient</span></span>
<span class="line"><span>@SpringBootApplication</span></span>
<span class="line"><span>@EnableResourceServer</span></span>
<span class="line"><span>public class Application   implements CommandLineRunner {</span></span>
<span class="line"><span>    private static final Logger LOGGER = LoggerFactory.getLogger(Application.class);</span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    private AppMetricsExporter appMetricsExporter;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    private AddMonitorUnitService addMonitorUnitService;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        new SpringApplicationBuilder(Application.class).web(true).run(args);</span></span>
<span class="line"><span>    }    </span></span>
<span class="line"><span>}</span></span></code></pre></div><p>4、在代码中调用接口即可</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Autowired</span></span>
<span class="line"><span>private DecisionEngineService decisionEngineService ;</span></span>
<span class="line"><span>// ...</span></span>
<span class="line"><span>decisionEngineService.getEngineMesasge(&quot;uid&quot; ,  &quot;productCode&quot;);</span></span></code></pre></div><h3 id="方案三-采用resttemplate方法" tabindex="-1">方案三: 采用RestTemplate方法 <a class="header-anchor" href="#方案三-采用resttemplate方法" aria-label="Permalink to &quot;方案三: 采用RestTemplate方法&quot;">​</a></h3><blockquote><p>在Spring-Boot开发中，RestTemplate同样提供了对外访问的接口API，这里主要介绍Get和Post方法的使用。Get请求提供了两种方式的接口getForObject 和 getForEntity，getForEntity提供如下三种方法的实现。</p></blockquote><h4 id="get请求之——getforentity-stringurl-class-responsetype-object-urlvariables" tabindex="-1">Get请求之——getForEntity(Stringurl,Class responseType,Object…urlVariables) <a class="header-anchor" href="#get请求之——getforentity-stringurl-class-responsetype-object-urlvariables" aria-label="Permalink to &quot;Get请求之——getForEntity(Stringurl,Class responseType,Object…urlVariables)&quot;">​</a></h4><p>该方法提供了三个参数，其中url为请求的地址，responseType为请求响应body的包装类型，urlVariables为url中的参数绑定，该方法的参考调用如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// http://USER-SERVICE/user?name={name)</span></span>
<span class="line"><span>RestTemplate restTemplate=new RestTemplate();</span></span>
<span class="line"><span>Map&lt;String,String&gt; params=new HashMap&lt;&gt;();</span></span>
<span class="line"><span>params.put(&quot;name&quot;,&quot;dada&quot;);  //</span></span>
<span class="line"><span>ResponseEntity&lt;String&gt; responseEntity=restTemplate.getForEntity(&quot;http://USERSERVICE/user?name={name}&quot;,String.class,params);</span></span></code></pre></div><h3 id="get请求之——getforentity-uri-url-class-responsetype" tabindex="-1">Get请求之——getForEntity(URI url,Class responseType) <a class="header-anchor" href="#get请求之——getforentity-uri-url-class-responsetype" aria-label="Permalink to &quot;Get请求之——getForEntity(URI url,Class responseType)&quot;">​</a></h3><p>该方法使用URI对象来替代之前的url和urlVariables参数来指定访问地址和参数绑定。URI是JDK java.net包下的一个类，表示一个统一资源标识符(Uniform Resource Identifier)引用。参考如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>RestTemplate restTemplate=new RestTemplate();</span></span>
<span class="line"><span>UriComponents uriComponents=UriComponentsBuilder.fromUriString(&quot;http://USER-SERVICE/user?name={name}&quot;)</span></span>
<span class="line"><span>    .build()</span></span>
<span class="line"><span>    .expand(&quot;dodo&quot;)</span></span>
<span class="line"><span>    .encode();</span></span>
<span class="line"><span>URI uri=uriComponents.toUri();</span></span>
<span class="line"><span>ResponseEntity&lt;String&gt; responseEntity=restTemplate.getForEntity(uri,String.class).getBody();</span></span></code></pre></div><h4 id="get请求之——getforobject" tabindex="-1">Get请求之——getForObject <a class="header-anchor" href="#get请求之——getforobject" aria-label="Permalink to &quot;Get请求之——getForObject&quot;">​</a></h4><p>getForObject方法可以理解为对getForEntity的进一步封装，它通过HttpMessageConverterExtractor对HTTP的请求响应体body内容进行对象转换，实现请求直接返回包装好的对象内容。getForObject方法有如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>getForObject(String url,Class responseType,Object...urlVariables)</span></span>
<span class="line"><span>getForObject(String url,Class responseType,Map urlVariables)</span></span>
<span class="line"><span>getForObject(URI url,Class responseType)</span></span></code></pre></div><h4 id="post-请求" tabindex="-1">Post 请求 <a class="header-anchor" href="#post-请求" aria-label="Permalink to &quot;Post 请求&quot;">​</a></h4><p>Post请求提供有三种方法，postForEntity、postForObject和postForLocation。其中每种方法都存在三种方法，postForEntity方法使用如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>RestTemplate restTemplate=new RestTemplate();</span></span>
<span class="line"><span>User user=newUser(&quot;didi&quot;,30);</span></span>
<span class="line"><span>ResponseEntity&lt;String&gt; responseEntity=restTemplate.postForEntity(&quot;http://USER-SERVICE/user&quot;,user,String.class); //提交的body内容为user对象，请求的返回的body类型为String</span></span>
<span class="line"><span>String body=responseEntity.getBody();</span></span></code></pre></div><p>postForEntity存在如下三种方法的重载</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>postForEntity(String url,Object request,Class responseType,Object... uriVariables)</span></span>
<span class="line"><span>postForEntity(String url,Object request,Class responseType,Map uriVariables)</span></span>
<span class="line"><span>postForEntity(URI url,Object request，Class responseType)</span></span></code></pre></div><p>postForEntity中的其它参数和getForEntity的参数大体相同在此不做介绍。</p><h2 id="进一步理解" tabindex="-1">进一步理解 <a class="header-anchor" href="#进一步理解" aria-label="Permalink to &quot;进一步理解&quot;">​</a></h2><blockquote><p>通过如下问题帮助你更深入理解接口调用的注意点。</p></blockquote><h3 id="在接口调用中需要注意什么" tabindex="-1">在接口调用中需要注意什么? <a class="header-anchor" href="#在接口调用中需要注意什么" aria-label="Permalink to &quot;在接口调用中需要注意什么?&quot;">​</a></h3><p>需要注意两点：</p><ol><li>需要设置超时时间</li><li>需要自行处理异常</li></ol><p>具体原因可以参考<a href="https://pdai.tech/md/spring/springboot/springboot-x-task-spring-task-timer.html#%E4%BD%BF%E7%94%A8spring-schedule%E8%A6%81%E6%B3%A8%E6%84%8F%E4%BB%80%E4%B9%88" target="_blank" rel="noreferrer">使用Spring Schedule要注意什么</a></p><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li>参考 <a href="https://blog.csdn.net/polo2044/article/details/85002282" target="_blank" rel="noreferrer">https://blog.csdn.net/polo2044/article/details/85002282</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,45)]))}const h=n(p,[["render",i]]);export{g as __pageData,h as default};
