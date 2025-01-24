import{_ as a,c as n,ai as i,o as p}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/spring/springboot/springboot-interface-param-1.png",e="/vitepress-blog-template/images/spring/springboot/springboot-interface-param-2.png",E=JSON.parse('{"title":"SpringBoot接口 - 如何对参数进行校验","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-interface-param.md","filePath":"spring/springboot/springboot-x-interface-param.md","lastUpdated":1737706346000}'),t={name:"spring/springboot/springboot-x-interface-param.md"};function h(r,s,k,d,o,c){return p(),n("div",null,s[0]||(s[0]=[i(`<h1 id="springboot接口-如何对参数进行校验" tabindex="-1">SpringBoot接口 - 如何对参数进行校验 <a class="header-anchor" href="#springboot接口-如何对参数进行校验" aria-label="Permalink to &quot;SpringBoot接口 - 如何对参数进行校验&quot;">​</a></h1><blockquote><p>在以SpringBoot开发Restful接口时, 对于接口的查询参数后台也是要进行校验的，同时还需要给出校验的返回信息放到上文我们统一封装的结构中。那么如何优雅的进行参数的统一校验呢？ @pdai</p></blockquote><h2 id="什么是不优雅的参数校验" tabindex="-1">什么是不优雅的参数校验 <a class="header-anchor" href="#什么是不优雅的参数校验" aria-label="Permalink to &quot;什么是不优雅的参数校验&quot;">​</a></h2><p>后端对前端传过来的参数也是需要进行校验的，如果在controller中直接校验需要用大量的if else做判断</p><p>以添加用户的接口为例，需要对前端传过来的参数进行校验， 如下的校验就是不优雅的：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@RestController</span></span>
<span class="line"><span>@RequestMapping(&quot;/user&quot;)</span></span>
<span class="line"><span>public class UserController {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @PostMapping(&quot;add&quot;)</span></span>
<span class="line"><span>    public ResponseEntity&lt;String&gt; add(User user) {</span></span>
<span class="line"><span>        if(user.getName()==null) {</span></span>
<span class="line"><span>            return ResponseResult.fail(&quot;user name should not be empty&quot;);</span></span>
<span class="line"><span>        } else if(user.getName().length()&lt;5 || user.getName().length()&gt;50){</span></span>
<span class="line"><span>            return ResponseResult.fail(&quot;user name length should between 5-50&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if(user.getAge()&lt; 1 || user.getAge()&gt; 150) {</span></span>
<span class="line"><span>            return ResponseResult.fail(&quot;invalid age&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // ...</span></span>
<span class="line"><span>        return ResponseEntity.ok(&quot;success&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>针对这个普遍的问题，Java开发者在Java API规范 (JSR303) 定义了Bean校验的标准<strong>validation-api</strong>，但没有提供实现。</p><p><strong>hibernate validation是对这个规范的实现</strong>，并增加了校验注解如@Email、@Length等。</p><p><strong>Spring Validation是对hibernate validation的二次封装</strong>，用于支持spring mvc参数自动校验。</p><p>接下来，我们以springboot项目为例，介绍Spring Validation的使用。</p><h2 id="实现案例" tabindex="-1">实现案例 <a class="header-anchor" href="#实现案例" aria-label="Permalink to &quot;实现案例&quot;">​</a></h2><blockquote><p>本例子采用 spring validation 对参数绑定进行校验，主要给你提供参数校验的思路。针对接口统一的错误信息（比如绑定参数检查的错误）封装请看<a href="https://pdai.tech/md/spring/springboot/springboot-x-interface-exception.html" target="_blank" rel="noreferrer">SpringBoot接口 - 如何统一异常处理</a>。</p></blockquote><h3 id="pom" tabindex="-1">POM <a class="header-anchor" href="#pom" aria-label="Permalink to &quot;POM&quot;">​</a></h3><p>添加pom依赖</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&lt;!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-validation --&gt;</span></span>
<span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;spring-boot-starter-validation&lt;/artifactId&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre></div><h3 id="请求参数封装" tabindex="-1">请求参数封装 <a class="header-anchor" href="#请求参数封装" aria-label="Permalink to &quot;请求参数封装&quot;">​</a></h3><p>单一职责，所以将查询用户的参数封装到UserParam中， 而不是User（数据库实体）本身。</p><p>对每个参数字段添加validation注解约束和message。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * user.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @author pdai</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@Data</span></span>
<span class="line"><span>@Builder</span></span>
<span class="line"><span>@ApiModel(value = &quot;User&quot;, subTypes = {AddressParam.class})</span></span>
<span class="line"><span>public class UserParam implements Serializable {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static final long serialVersionUID = 1L;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @NotEmpty(message = &quot;could not be empty&quot;)</span></span>
<span class="line"><span>    private String userId;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @NotEmpty(message = &quot;could not be empty&quot;)</span></span>
<span class="line"><span>    @Email(message = &quot;invalid email&quot;)</span></span>
<span class="line"><span>    private String email;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @NotEmpty(message = &quot;could not be empty&quot;)</span></span>
<span class="line"><span>    @Pattern(regexp = &quot;^(\\\\d{6})(\\\\d{4})(\\\\d{2})(\\\\d{2})(\\\\d{3})([0-9]|X)$&quot;, message = &quot;invalid ID&quot;)</span></span>
<span class="line"><span>    private String cardNo;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @NotEmpty(message = &quot;could not be empty&quot;)</span></span>
<span class="line"><span>    @Length(min = 1, max = 10, message = &quot;nick name should be 1-10&quot;)</span></span>
<span class="line"><span>    private String nickName;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @NotEmpty(message = &quot;could not be empty&quot;)</span></span>
<span class="line"><span>    @Range(min = 0, max = 1, message = &quot;sex should be 0-1&quot;)</span></span>
<span class="line"><span>    private int sex;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Max(value = 100, message = &quot;Please input valid age&quot;)</span></span>
<span class="line"><span>    private int age;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Valid</span></span>
<span class="line"><span>    private AddressParam address;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="controller中获取参数绑定结果" tabindex="-1">Controller中获取参数绑定结果 <a class="header-anchor" href="#controller中获取参数绑定结果" aria-label="Permalink to &quot;Controller中获取参数绑定结果&quot;">​</a></h3><p>使用@Valid或者@Validated注解，参数校验的值放在BindingResult中</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">@author</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> pdai</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> */</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Slf4j</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Api</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">value</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;User Interfaces&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">tags</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;User Interfaces&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">RestController</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">RequestMapping</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;/user&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> UserController</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     * http://localhost:8080/user/add .</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     *</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     * </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">@param</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> userParam</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> user param</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     * </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">@return</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> user</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     */</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ApiOperation</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Add User&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ApiImplicitParam</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">name</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;userParam&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">type</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;body&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">dataTypeClass</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> UserParam.class, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">required</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">PostMapping</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;add&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ResponseEntity&lt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">String</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">add</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Valid</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">RequestBody</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> UserParam </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">userParam</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, BindingResult </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">bindingResult</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (bindingResult.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">hasErrors</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            List&lt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ObjectError</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; errors </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> bindingResult.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getAllErrors</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            errors.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">forEach</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(p </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                FieldError fieldError </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (FieldError) p;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                log.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">error</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Invalid Parameter : object - {},field - {},errorMessage - {}&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, fieldError.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getObjectName</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(), fieldError.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getField</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(), fieldError.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getDefaultMessage</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">());</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            });</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">            return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ResponseEntity.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">badRequest</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">().</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">body</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;invalid parameter&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ResponseEntity.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ok</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;success&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h3 id="校验结果" tabindex="-1">校验结果 <a class="header-anchor" href="#校验结果" aria-label="Permalink to &quot;校验结果&quot;">​</a></h3><p>POST访问添加User的请求</p><p><img src="`+l+`" alt="error.图片加载失败"></p><p>后台输出参数绑定错误信息：（包含哪个对象，哪个字段，什么样的错误描述）</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>2021-09-16 10:37:05.173 ERROR 21216 --- [nio-8080-exec-8] t.p.s.v.controller.UserController        : Invalid Parameter : object - userParam,field - nickName,errorMessage - could not be empty</span></span>
<span class="line"><span>2021-09-16 10:37:05.176 ERROR 21216 --- [nio-8080-exec-8] t.p.s.v.controller.UserController        : Invalid Parameter : object - userParam,field - email,errorMessage - could not be empty</span></span>
<span class="line"><span>2021-09-16 10:37:05.176 ERROR 21216 --- [nio-8080-exec-8] t.p.s.v.controller.UserController        : Invalid Parameter : object - userParam,field - cardNo,errorMessage - could not be empty</span></span></code></pre></div><p>（本例只是springboot-validation的简单用例，针对接口统一的错误信息封装请看<a href="https://pdai.tech/md/spring/springboot/springboot-x-interface-exception.html" target="_blank" rel="noreferrer">SpringBoot接口 - 如何统一异常处理</a></p><h2 id="进一步理解" tabindex="-1">进一步理解 <a class="header-anchor" href="#进一步理解" aria-label="Permalink to &quot;进一步理解&quot;">​</a></h2><blockquote><p>我们再通过一些问题来帮助你更深入理解validation校验。@pdai</p></blockquote><h3 id="validation分组校验" tabindex="-1">Validation分组校验？ <a class="header-anchor" href="#validation分组校验" aria-label="Permalink to &quot;Validation分组校验？&quot;">​</a></h3><blockquote><p>上面的例子中，其实存在一个问题，UserParam既可以作为addUser的参数（id为空），又可以作为updateUser的参数（id不能为空），这时候怎么办呢？分组校验登场。</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Data</span></span>
<span class="line"><span>@Builder</span></span>
<span class="line"><span>@ApiModel(value = &quot;User&quot;, subTypes = {AddressParam.class})</span></span>
<span class="line"><span>public class UserParam implements Serializable {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static final long serialVersionUID = 1L;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @NotEmpty(message = &quot;could not be empty&quot;) // 这里定为空，对于addUser时是不合适的</span></span>
<span class="line"><span>    private String userId;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这时候可以使用Validation分组</p><ul><li><strong>先定义分组</strong>（无需实现接口）</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface AddValidationGroup {</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>public interface EditValidationGroup {</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>在UserParam的userId字段添加分组</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Data</span></span>
<span class="line"><span>@Builder</span></span>
<span class="line"><span>@ApiModel(value = &quot;User&quot;, subTypes = {AddressParam.class})</span></span>
<span class="line"><span>public class UserParam implements Serializable {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static final long serialVersionUID = 1L;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @NotEmpty(message = &quot;{user.msg.userId.notEmpty}&quot;, groups = {EditValidationGroup.class}) // 这里</span></span>
<span class="line"><span>    private String userId;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>controller中的接口使用校验时使用分组</strong></li></ul><p>PS: 需要使用@Validated注解</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Slf4j</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Api</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">value</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;User Interfaces&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">tags</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;User Interfaces&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">RestController</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">RequestMapping</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;/user&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> UserController</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     * http://localhost:8080/user/add .</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     *</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     * </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">@param</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> userParam</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> user param</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     * </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">@return</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> user</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     */</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ApiOperation</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Add User&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ApiImplicitParam</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">name</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;userParam&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">type</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;body&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">dataTypeClass</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> UserParam.class, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">required</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">PostMapping</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;add&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ResponseEntity&lt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">UserParam</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">add</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Validated</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(AddValidationGroup.class) @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">RequestBody</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> UserParam </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">userParam</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ResponseEntity.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ok</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(userParam);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     * http://localhost:8080/user/add .</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     *</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     * </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">@param</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> userParam</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> user param</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     * </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">@return</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> user</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     */</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ApiOperation</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Edit User&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ApiImplicitParam</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">name</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;userParam&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">type</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;body&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">dataTypeClass</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> UserParam.class, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">required</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">PostMapping</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;edit&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ResponseEntity&lt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">UserParam</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">edit</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Validated</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(EditValidationGroup.class) @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">RequestBody</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> UserParam </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">userParam</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ResponseEntity.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ok</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(userParam);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><ul><li><strong>测试</strong></li></ul><p><img src="`+e+`" alt="error.图片加载失败"></p><h3 id="validated和-valid什么区别" tabindex="-1">@Validated和@Valid什么区别？ <a class="header-anchor" href="#validated和-valid什么区别" aria-label="Permalink to &quot;@Validated和@Valid什么区别？&quot;">​</a></h3><blockquote><p>细心的你会发现，上个例子中用的是@Validated, 而不是@Valid，那它们之间的区别是什么呢？</p></blockquote><p>在检验Controller的入参是否符合规范时，使用@Validated或者@Valid在基本验证功能上没有太多区别。但是在分组、注解地方、嵌套验证等功能上两个有所不同：</p><ul><li><strong>分组</strong></li></ul><p>@Validated：提供了一个分组功能，可以在入参验证时，根据不同的分组采用不同的验证机制，这个网上也有资料，不详述。@Valid：作为标准JSR-303规范，还没有吸收分组的功能。</p><ul><li><strong>注解地方</strong></li></ul><p>@Validated：可以用在类型、方法和方法参数上。但是不能用在成员属性（字段）上</p><p>@Valid：可以用在方法、构造函数、方法参数和成员属性（字段）上</p><ul><li><strong>嵌套类型</strong></li></ul><p>比如本文例子中的address是user的一个嵌套属性, 只能用@Valid</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Data</span></span>
<span class="line"><span>@Builder</span></span>
<span class="line"><span>@ApiModel(value = &quot;User&quot;, subTypes = {AddressParam.class})</span></span>
<span class="line"><span>public class UserParam implements Serializable {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static final long serialVersionUID = 1L;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Valid // 这里只能用@Valid</span></span>
<span class="line"><span>    private AddressParam address;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="有哪些常用的校验" tabindex="-1">有哪些常用的校验？ <a class="header-anchor" href="#有哪些常用的校验" aria-label="Permalink to &quot;有哪些常用的校验？&quot;">​</a></h3><blockquote><p>从以下三类理解。</p></blockquote><ul><li><strong>JSR303/JSR-349</strong>: JSR303是一项标准,只提供规范不提供实现，规定一些校验规范即校验注解，如@Null，@NotNull，@Pattern，位于javax.validation.constraints包下。<strong>JSR-349是其的升级版本，添加了一些新特性</strong>。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@AssertFalse            被注释的元素只能为false</span></span>
<span class="line"><span>@AssertTrue             被注释的元素只能为true</span></span>
<span class="line"><span>@DecimalMax             被注释的元素必须小于或等于{value}</span></span>
<span class="line"><span>@DecimalMin             被注释的元素必须大于或等于{value}</span></span>
<span class="line"><span>@Digits                 被注释的元素数字的值超出了允许范围(只允许在{integer}位整数和{fraction}位小数范围内)</span></span>
<span class="line"><span>@Email                  被注释的元素不是一个合法的电子邮件地址</span></span>
<span class="line"><span>@Future                 被注释的元素需要是一个将来的时间</span></span>
<span class="line"><span>@FutureOrPresent        被注释的元素需要是一个将来或现在的时间</span></span>
<span class="line"><span>@Max                    被注释的元素最大不能超过{value}</span></span>
<span class="line"><span>@Min                    被注释的元素最小不能小于{value}</span></span>
<span class="line"><span>@Negative               被注释的元素必须是负数</span></span>
<span class="line"><span>@NegativeOrZero         被注释的元素必须是负数或零</span></span>
<span class="line"><span>@NotBlank               被注释的元素不能为空</span></span>
<span class="line"><span>@NotEmpty               被注释的元素不能为空</span></span>
<span class="line"><span>@NotNull                被注释的元素不能为null</span></span>
<span class="line"><span>@Null                   被注释的元素必须为null</span></span>
<span class="line"><span>@Past                   被注释的元素需要是一个过去的时间</span></span>
<span class="line"><span>@PastOrPresent          被注释的元素需要是一个过去或现在的时间</span></span>
<span class="line"><span>@Pattern                被注释的元素需要匹配正则表达式&quot;{regexp}&quot;</span></span>
<span class="line"><span>@Positive               被注释的元素必须是正数</span></span>
<span class="line"><span>@PositiveOrZero         被注释的元素必须是正数或零</span></span>
<span class="line"><span>@Size                   被注释的元素个数必须在{min}和{max}之间</span></span></code></pre></div><ul><li><strong>hibernate validation</strong>：hibernate validation是对这个规范的实现，并增加了一些其他校验注解，如@Email，@Length，@Range等等</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@CreditCardNumber       被注释的元素不合法的信用卡号码</span></span>
<span class="line"><span>@Currency               被注释的元素不合法的货币 (必须是{value}其中之一)</span></span>
<span class="line"><span>@EAN                    被注释的元素不合法的{type}条形码</span></span>
<span class="line"><span>@Email                  被注释的元素不是一个合法的电子邮件地址  (已过期)</span></span>
<span class="line"><span>@Length                 被注释的元素长度需要在{min}和{max}之间</span></span>
<span class="line"><span>@CodePointLength        被注释的元素长度需要在{min}和{max}之间</span></span>
<span class="line"><span>@LuhnCheck              被注释的元素\${validatedValue}的校验码不合法, Luhn模10校验和不匹配</span></span>
<span class="line"><span>@Mod10Check             被注释的元素\${validatedValue}的校验码不合法, 模10校验和不匹配</span></span>
<span class="line"><span>@Mod11Check             被注释的元素\${validatedValue}的校验码不合法, 模11校验和不匹配</span></span>
<span class="line"><span>@ModCheck               被注释的元素\${validatedValue}的校验码不合法, \${modType}校验和不匹配  (已过期)</span></span>
<span class="line"><span>@NotBlank               被注释的元素不能为空  (已过期)</span></span>
<span class="line"><span>@NotEmpty               被注释的元素不能为空  (已过期)</span></span>
<span class="line"><span>@ParametersScriptAssert 被注释的元素执行脚本表达式&quot;{script}&quot;没有返回期望结果</span></span>
<span class="line"><span>@Range                  被注释的元素需要在{min}和{max}之间</span></span>
<span class="line"><span>@SafeHtml               被注释的元素可能有不安全的HTML内容</span></span>
<span class="line"><span>@ScriptAssert           被注释的元素执行脚本表达式&quot;{script}&quot;没有返回期望结果</span></span>
<span class="line"><span>@URL                    被注释的元素需要是一个合法的URL</span></span>
<span class="line"><span>@DurationMax            被注释的元素必须小于\${inclusive == true ? &#39;或等于&#39; : &#39;&#39;}\${days == 0 ? &#39;&#39; : days += &#39;天&#39;}\${hours == 0 ? &#39;&#39; : hours += &#39;小时&#39;}\${minutes == 0 ? &#39;&#39; : minutes += &#39;分钟&#39;}\${seconds == 0 ? &#39;&#39; : seconds += &#39;秒&#39;}\${millis == 0 ? &#39;&#39; : millis += &#39;毫秒&#39;}\${nanos == 0 ? &#39;&#39; : nanos += &#39;纳秒&#39;}</span></span>
<span class="line"><span>@DurationMin            被注释的元素必须大于\${inclusive == true ? &#39;或等于&#39; : &#39;&#39;}\${days == 0 ? &#39;&#39; : days += &#39;天&#39;}\${hours == 0 ? &#39;&#39; : hours += &#39;小时&#39;}\${minutes == 0 ? &#39;&#39; : minutes += &#39;分钟&#39;}\${seconds == 0 ? &#39;&#39; : seconds += &#39;秒&#39;}\${millis == 0 ? &#39;&#39; : millis += &#39;毫秒&#39;}\${nanos == 0 ? &#39;&#39; : nanos += &#39;纳秒&#39;}</span></span></code></pre></div><ul><li><strong>spring validation</strong>：spring validation对hibernate validation进行了二次封装，在springmvc模块中添加了自动校验，并将校验信息封装进了特定的类中</li></ul><h3 id="自定义validation" tabindex="-1">自定义validation？ <a class="header-anchor" href="#自定义validation" aria-label="Permalink to &quot;自定义validation？&quot;">​</a></h3><blockquote><p>如果上面的注解不能满足我们检验参数的要求，我们能不能自定义校验规则呢？ 可以。</p></blockquote><ul><li><strong>定义注解</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>package tech.pdai.springboot.validation.group.validation.custom;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import javax.validation.Constraint;</span></span>
<span class="line"><span>import javax.validation.Payload;</span></span>
<span class="line"><span>import java.lang.annotation.Documented;</span></span>
<span class="line"><span>import java.lang.annotation.Retention;</span></span>
<span class="line"><span>import java.lang.annotation.Target;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import static java.lang.annotation.ElementType.*;</span></span>
<span class="line"><span>import static java.lang.annotation.RetentionPolicy.RUNTIME;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Target({ METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE })</span></span>
<span class="line"><span>@Retention(RUNTIME)</span></span>
<span class="line"><span>@Documented</span></span>
<span class="line"><span>@Constraint(validatedBy = {TelephoneNumberValidator.class}) // 指定校验器</span></span>
<span class="line"><span>public @interface TelephoneNumber {</span></span>
<span class="line"><span>    String message() default &quot;Invalid telephone number&quot;;</span></span>
<span class="line"><span>    Class&lt;?&gt;[] groups() default { };</span></span>
<span class="line"><span>    Class&lt;? extends Payload&gt;[] payload() default { };</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>定义校验器</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class TelephoneNumberValidator implements ConstraintValidator&lt;TelephoneNumber, String&gt; {</span></span>
<span class="line"><span>    private static final String REGEX_TEL = &quot;0\\\\d{2,3}[-]?\\\\d{7,8}|0\\\\d{2,3}\\\\s?\\\\d{7,8}|13[0-9]\\\\d{8}|15[1089]\\\\d{8}&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean isValid(String s, ConstraintValidatorContext constraintValidatorContext) {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            return Pattern.matches(REGEX_TEL, s);</span></span>
<span class="line"><span>        } catch (Exception e) {</span></span>
<span class="line"><span>            return false;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>使用</strong></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Data</span></span>
<span class="line"><span>@Builder</span></span>
<span class="line"><span>@ApiModel(value = &quot;User&quot;, subTypes = {AddressParam.class})</span></span>
<span class="line"><span>public class UserParam implements Serializable {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private static final long serialVersionUID = 1L;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @NotEmpty(message = &quot;{user.msg.userId.notEmpty}&quot;, groups = {EditValidationGroup.class})</span></span>
<span class="line"><span>    private String userId;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @TelephoneNumber(message = &quot;invalid telephone number&quot;) // 这里</span></span>
<span class="line"><span>    private String telephone;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,72)]))}const u=a(t,[["render",h]]);export{E as __pageData,u as default};
