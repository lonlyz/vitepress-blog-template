import{_ as a,c as n,ai as i,o as p}from"./chunks/framework.BrYByd3F.js";const e="/vitepress-blog-template/images/spring/springboot/springboot-exception-1.png",l="/vitepress-blog-template/images/spring/springboot/springboot-exception-10.png",t="/vitepress-blog-template/images/spring/springboot/springboot-exception-11.png",y=JSON.parse('{"title":"SpringBoot接口 - 如何统一异常处理","description":"","frontmatter":{},"headers":[],"relativePath":"spring/springboot/springboot-x-interface-exception.md","filePath":"spring/springboot/springboot-x-interface-exception.md","lastUpdated":1737706346000}'),h={name:"spring/springboot/springboot-x-interface-exception.md"};function r(k,s,d,o,c,E){return p(),n("div",null,s[0]||(s[0]=[i(`<h1 id="springboot接口-如何统一异常处理" tabindex="-1">SpringBoot接口 - 如何统一异常处理 <a class="header-anchor" href="#springboot接口-如何统一异常处理" aria-label="Permalink to &quot;SpringBoot接口 - 如何统一异常处理&quot;">​</a></h1><blockquote><p>SpringBoot接口如何对异常进行统一封装，并统一返回呢？以上文的参数校验为例，如何优雅的将参数校验的错误信息统一处理并封装返回呢？@pdai</p></blockquote><h2 id="为什么要优雅的处理异常" tabindex="-1">为什么要优雅的处理异常 <a class="header-anchor" href="#为什么要优雅的处理异常" aria-label="Permalink to &quot;为什么要优雅的处理异常&quot;">​</a></h2><p>如果我们不统一的处理异常，经常会在controller层有大量的异常处理的代码， 比如：</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Slf4j</span></span>
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
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ResponseEntity&lt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">String</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">add</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Valid</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">RequestBody</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> UserParam </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">userParam</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        // 每个接口充斥着大量的异常处理</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        try</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">            // do something</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">catch</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(Exception </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">e</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">            return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ResponseEntity.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">fail</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;error&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ResponseEntity.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ok</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;success&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>那怎么实现统一的异常处理，特别是结合参数校验等封装？</p><h2 id="实现案例" tabindex="-1">实现案例 <a class="header-anchor" href="#实现案例" aria-label="Permalink to &quot;实现案例&quot;">​</a></h2><blockquote><p>简单展示通过@ControllerAdvice进行统一异常处理。</p></blockquote><h3 id="controlleradvice异常统一处理" tabindex="-1">@ControllerAdvice异常统一处理 <a class="header-anchor" href="#controlleradvice异常统一处理" aria-label="Permalink to &quot;@ControllerAdvice异常统一处理&quot;">​</a></h3><p>对于400参数错误异常</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * Global exception handler.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">@author</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> pdai</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> */</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Slf4j</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">RestControllerAdvice</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> GlobalExceptionHandler</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     * exception handler for bad request.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     *</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     * </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">@param</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> e</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     *            exception</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     * </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">@return</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> ResponseResult</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     */</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ResponseBody</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ResponseStatus</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">code</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> HttpStatus.BAD_REQUEST)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ExceptionHandler</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">value</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { BindException.class, ValidationException.class, MethodArgumentNotValidException.class })</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ResponseResult&lt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ExceptionData</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">handleParameterVerificationException</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">NonNull</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Exception </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">e</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        ExceptionData.ExceptionDataBuilder exceptionDataBuilder </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ExceptionData.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">builder</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        log.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">warn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Exception: {}&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, e.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getMessage</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">());</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (e </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">instanceof</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> BindException) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            BindingResult bindingResult </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ((MethodArgumentNotValidException) e).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getBindingResult</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            bindingResult.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getAllErrors</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">().</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">stream</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">().</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">map</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(DefaultMessageSourceResolvable</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">getDefaultMessage)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                    .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">forEach</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(exceptionDataBuilder</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">::</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">error);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">else</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (e </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">instanceof</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ConstraintViolationException) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">            if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (e.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getMessage</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">!=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> null</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                exceptionDataBuilder.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">error</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(e.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getMessage</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">());</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">else</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            exceptionDataBuilder.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">error</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;invalid parameter&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ResponseResultEntity.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">fail</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(exceptionDataBuilder.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">build</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(), </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;invalid parameter&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>对于自定义异常</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * handle business exception.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @param businessException</span></span>
<span class="line"><span> *            business exception</span></span>
<span class="line"><span> * @return ResponseResult</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@ResponseBody</span></span>
<span class="line"><span>@ExceptionHandler(BusinessException.class)</span></span>
<span class="line"><span>public ResponseResult&lt;BusinessException&gt; processBusinessException(BusinessException businessException) {</span></span>
<span class="line"><span>    log.error(businessException.getLocalizedMessage(), businessException);</span></span>
<span class="line"><span>    // 这里可以屏蔽掉后台的异常栈信息，直接返回&quot;business error&quot;</span></span>
<span class="line"><span>    return ResponseResultEntity.fail(businessException, businessException.getLocalizedMessage());</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对于其它异常</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span> * handle other exception.</span></span>
<span class="line"><span> *</span></span>
<span class="line"><span> * @param exception</span></span>
<span class="line"><span> *            exception</span></span>
<span class="line"><span> * @return ResponseResult</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>@ResponseBody</span></span>
<span class="line"><span>@ExceptionHandler(Exception.class)</span></span>
<span class="line"><span>public ResponseResult&lt;Exception&gt; processException(Exception exception) {</span></span>
<span class="line"><span>    log.error(exception.getLocalizedMessage(), exception);</span></span>
<span class="line"><span>    // 这里可以屏蔽掉后台的异常栈信息，直接返回&quot;server error&quot;</span></span>
<span class="line"><span>    return ResponseResultEntity.fail(exception, exception.getLocalizedMessage());</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="controller接口" tabindex="-1">Controller接口 <a class="header-anchor" href="#controller接口" aria-label="Permalink to &quot;Controller接口&quot;">​</a></h3><p>（接口中无需处理异常）</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Slf4j</span></span>
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
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ResponseEntity&lt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">UserParam</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">add</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Valid</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">RequestBody</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> UserParam </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">userParam</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ResponseEntity.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ok</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(userParam);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h3 id="运行测试" tabindex="-1">运行测试 <a class="header-anchor" href="#运行测试" aria-label="Permalink to &quot;运行测试&quot;">​</a></h3><p>这里用postman测试下</p><p><img src="`+e+`" alt="error.图片加载失败"></p><h2 id="进一步理解" tabindex="-1">进一步理解 <a class="header-anchor" href="#进一步理解" aria-label="Permalink to &quot;进一步理解&quot;">​</a></h2><blockquote><p>我们再通过一些问题来帮助你更深入理解@ControllerAdvice。@pdai</p></blockquote><h3 id="controlleradvice还可以怎么用" tabindex="-1">@ControllerAdvice还可以怎么用？ <a class="header-anchor" href="#controlleradvice还可以怎么用" aria-label="Permalink to &quot;@ControllerAdvice还可以怎么用？&quot;">​</a></h3><p>除了通过@ExceptionHandler注解用于全局异常的处理之外，@ControllerAdvice还有两个用法：</p><ul><li><strong>@InitBinder注解</strong></li></ul><p>用于请求中注册自定义参数的解析，从而达到自定义请求参数格式的目的；</p><p>比如，在@ControllerAdvice注解的类中添加如下方法，来统一处理日期格式的格式化</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@InitBinder</span></span>
<span class="line"><span>public void handleInitBinder(WebDataBinder dataBinder){</span></span>
<span class="line"><span>    dataBinder.registerCustomEditor(Date.class,</span></span>
<span class="line"><span>            new CustomDateEditor(new SimpleDateFormat(&quot;yyyy-MM-dd&quot;), false));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Controller中传入参数（string类型）自动转化为Date类型</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@GetMapping(&quot;testDate&quot;)</span></span>
<span class="line"><span>public Date processApi(Date date) {</span></span>
<span class="line"><span>    return date;</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>@ModelAttribute注解</strong></li></ul><p>用来预设全局参数，比如最典型的使用Spring Security时将添加当前登录的用户信息（UserDetails)作为参数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@ModelAttribute(&quot;currentUser&quot;)</span></span>
<span class="line"><span>public UserDetails modelAttribute() {</span></span>
<span class="line"><span>    return (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>所有controller类中requestMapping方法都可以直接获取并使用currentUser</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@PostMapping(&quot;saveSomething&quot;)</span></span>
<span class="line"><span>public ResponseEntity&lt;String&gt; saveSomeObj(@ModelAttribute(&quot;currentUser&quot;) UserDetails operator) {</span></span>
<span class="line"><span>    // 保存操作，并设置当前操作人员的ID（从UserDetails中获得）</span></span>
<span class="line"><span>    return ResponseEntity.success(&quot;ok&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="controlleradvice是如何起作用的-原理" tabindex="-1">@ControllerAdvice是如何起作用的（原理）？ <a class="header-anchor" href="#controlleradvice是如何起作用的-原理" aria-label="Permalink to &quot;@ControllerAdvice是如何起作用的（原理）？&quot;">​</a></h3><p>我们在<a href="https://pdai.tech/md/spring/spring-x-framework-springmvc.html" target="_blank" rel="noreferrer">Spring基础 - SpringMVC案例和机制</a>的基础上来看@ControllerAdvice的源码实现。</p><p>DispatcherServlet中onRefresh方法是初始化ApplicationContext后的回调方法，它会调用initStrategies方法，主要更新一些servlet需要使用的对象，包括国际化处理，requestMapping，视图解析等等。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>    * This implementation calls {@link #initStrategies}.</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span>@Override</span></span>
<span class="line"><span>protected void onRefresh(ApplicationContext context) {</span></span>
<span class="line"><span>    initStrategies(context);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/**</span></span>
<span class="line"><span>    * Initialize the strategy objects that this servlet uses.</span></span>
<span class="line"><span>    * &lt;p&gt;May be overridden in subclasses in order to initialize further strategy objects.</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span>protected void initStrategies(ApplicationContext context) {</span></span>
<span class="line"><span>    initMultipartResolver(context); // 文件上传</span></span>
<span class="line"><span>    initLocaleResolver(context); // i18n国际化</span></span>
<span class="line"><span>    initThemeResolver(context); // 主题</span></span>
<span class="line"><span>    initHandlerMappings(context); // requestMapping</span></span>
<span class="line"><span>    initHandlerAdapters(context); // adapters</span></span>
<span class="line"><span>    initHandlerExceptionResolvers(context); // 异常处理</span></span>
<span class="line"><span>    initRequestToViewNameTranslator(context);</span></span>
<span class="line"><span>    initViewResolvers(context);</span></span>
<span class="line"><span>    initFlashMapManager(context);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>从上述代码看，如果要提供@ControllerAdvice提供的三种注解功能，从设计和实现的角度肯定是实现的代码需要放在initStrategies方法中。</p><ul><li><strong>@ModelAttribute和@InitBinder处理</strong></li></ul><p>具体来看，如果你是设计者，很显然容易想到：对于@ModelAttribute提供的参数预置和@InitBinder注解提供的预处理方法应该是放在一个方法中的，因为它们都是在进入requestMapping方法前做的操作。</p><p>如下方法是获取所有的HandlerAdapter，无非就是从BeanFactory中获取（BeanFactory相关知识请参考 <a href="https://pdai.tech/md/spring/spring-x-framework-ioc-source-1.html" target="_blank" rel="noreferrer">Spring进阶- Spring IOC实现原理详解之IOC体系结构设计</a>)</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>private void initHandlerAdapters(ApplicationContext context) {</span></span>
<span class="line"><span>    this.handlerAdapters = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (this.detectAllHandlerAdapters) {</span></span>
<span class="line"><span>        // Find all HandlerAdapters in the ApplicationContext, including ancestor contexts.</span></span>
<span class="line"><span>        Map&lt;String, HandlerAdapter&gt; matchingBeans =</span></span>
<span class="line"><span>                BeanFactoryUtils.beansOfTypeIncludingAncestors(context, HandlerAdapter.class, true, false);</span></span>
<span class="line"><span>        if (!matchingBeans.isEmpty()) {</span></span>
<span class="line"><span>            this.handlerAdapters = new ArrayList&lt;&gt;(matchingBeans.values());</span></span>
<span class="line"><span>            // We keep HandlerAdapters in sorted order.</span></span>
<span class="line"><span>            AnnotationAwareOrderComparator.sort(this.handlerAdapters);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            HandlerAdapter ha = context.getBean(HANDLER_ADAPTER_BEAN_NAME, HandlerAdapter.class);</span></span>
<span class="line"><span>            this.handlerAdapters = Collections.singletonList(ha);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        catch (NoSuchBeanDefinitionException ex) {</span></span>
<span class="line"><span>            // Ignore, we&#39;ll add a default HandlerAdapter later.</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Ensure we have at least some HandlerAdapters, by registering</span></span>
<span class="line"><span>    // default HandlerAdapters if no other adapters are found.</span></span>
<span class="line"><span>    if (this.handlerAdapters == null) {</span></span>
<span class="line"><span>        this.handlerAdapters = getDefaultStrategies(context, HandlerAdapter.class);</span></span>
<span class="line"><span>        if (logger.isTraceEnabled()) {</span></span>
<span class="line"><span>            logger.trace(&quot;No HandlerAdapters declared for servlet &#39;&quot; + getServletName() +</span></span>
<span class="line"><span>                    &quot;&#39;: using default strategies from DispatcherServlet.properties&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们要处理的是requestMapping的handlerResolver，作为设计者，就很容易出如下的结构</p><p><img src="`+l+`" alt="error.图片加载失败"></p><p>在RequestMappingHandlerAdapter中的afterPropertiesSet去处理advice</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public void afterPropertiesSet() {</span></span>
<span class="line"><span>    // Do this first, it may add ResponseBody advice beans</span></span>
<span class="line"><span>    initControllerAdviceCache();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (this.argumentResolvers == null) {</span></span>
<span class="line"><span>        List&lt;HandlerMethodArgumentResolver&gt; resolvers = getDefaultArgumentResolvers();</span></span>
<span class="line"><span>        this.argumentResolvers = new HandlerMethodArgumentResolverComposite().addResolvers(resolvers);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (this.initBinderArgumentResolvers == null) {</span></span>
<span class="line"><span>        List&lt;HandlerMethodArgumentResolver&gt; resolvers = getDefaultInitBinderArgumentResolvers();</span></span>
<span class="line"><span>        this.initBinderArgumentResolvers = new HandlerMethodArgumentResolverComposite().addResolvers(resolvers);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (this.returnValueHandlers == null) {</span></span>
<span class="line"><span>        List&lt;HandlerMethodReturnValueHandler&gt; handlers = getDefaultReturnValueHandlers();</span></span>
<span class="line"><span>        this.returnValueHandlers = new HandlerMethodReturnValueHandlerComposite().addHandlers(handlers);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void initControllerAdviceCache() {</span></span>
<span class="line"><span>    if (getApplicationContext() == null) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    List&lt;ControllerAdviceBean&gt; adviceBeans = ControllerAdviceBean.findAnnotatedBeans(getApplicationContext());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    List&lt;Object&gt; requestResponseBodyAdviceBeans = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (ControllerAdviceBean adviceBean : adviceBeans) {</span></span>
<span class="line"><span>        Class&lt;?&gt; beanType = adviceBean.getBeanType();</span></span>
<span class="line"><span>        if (beanType == null) {</span></span>
<span class="line"><span>            throw new IllegalStateException(&quot;Unresolvable type for ControllerAdviceBean: &quot; + adviceBean);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 缓存所有modelAttribute注解方法</span></span>
<span class="line"><span>        Set&lt;Method&gt; attrMethods = MethodIntrospector.selectMethods(beanType, MODEL_ATTRIBUTE_METHODS);</span></span>
<span class="line"><span>        if (!attrMethods.isEmpty()) {</span></span>
<span class="line"><span>            this.modelAttributeAdviceCache.put(adviceBean, attrMethods);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 缓存所有initBinder注解方法</span></span>
<span class="line"><span>        Set&lt;Method&gt; binderMethods = MethodIntrospector.selectMethods(beanType, INIT_BINDER_METHODS);</span></span>
<span class="line"><span>        if (!binderMethods.isEmpty()) {</span></span>
<span class="line"><span>            this.initBinderAdviceCache.put(adviceBean, binderMethods);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (RequestBodyAdvice.class.isAssignableFrom(beanType) || ResponseBodyAdvice.class.isAssignableFrom(beanType)) {</span></span>
<span class="line"><span>            requestResponseBodyAdviceBeans.add(adviceBean);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (!requestResponseBodyAdviceBeans.isEmpty()) {</span></span>
<span class="line"><span>        this.requestResponseBodyAdvice.addAll(0, requestResponseBodyAdviceBeans);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li><strong>@ExceptionHandler处理</strong></li></ul><p>@ExceptionHandler显然是在上述initHandlerExceptionResolvers(context)方法中。</p><p>同样的，从BeanFactory中获取HandlerExceptionResolver</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/**</span></span>
<span class="line"><span>    * Initialize the HandlerExceptionResolver used by this class.</span></span>
<span class="line"><span>    * &lt;p&gt;If no bean is defined with the given name in the BeanFactory for this namespace,</span></span>
<span class="line"><span>    * we default to no exception resolver.</span></span>
<span class="line"><span>    */</span></span>
<span class="line"><span>private void initHandlerExceptionResolvers(ApplicationContext context) {</span></span>
<span class="line"><span>    this.handlerExceptionResolvers = null;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (this.detectAllHandlerExceptionResolvers) {</span></span>
<span class="line"><span>        // Find all HandlerExceptionResolvers in the ApplicationContext, including ancestor contexts.</span></span>
<span class="line"><span>        Map&lt;String, HandlerExceptionResolver&gt; matchingBeans = BeanFactoryUtils</span></span>
<span class="line"><span>                .beansOfTypeIncludingAncestors(context, HandlerExceptionResolver.class, true, false);</span></span>
<span class="line"><span>        if (!matchingBeans.isEmpty()) {</span></span>
<span class="line"><span>            this.handlerExceptionResolvers = new ArrayList&lt;&gt;(matchingBeans.values());</span></span>
<span class="line"><span>            // We keep HandlerExceptionResolvers in sorted order.</span></span>
<span class="line"><span>            AnnotationAwareOrderComparator.sort(this.handlerExceptionResolvers);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    else {</span></span>
<span class="line"><span>        try {</span></span>
<span class="line"><span>            HandlerExceptionResolver her =</span></span>
<span class="line"><span>                    context.getBean(HANDLER_EXCEPTION_RESOLVER_BEAN_NAME, HandlerExceptionResolver.class);</span></span>
<span class="line"><span>            this.handlerExceptionResolvers = Collections.singletonList(her);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        catch (NoSuchBeanDefinitionException ex) {</span></span>
<span class="line"><span>            // Ignore, no HandlerExceptionResolver is fine too.</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Ensure we have at least some HandlerExceptionResolvers, by registering</span></span>
<span class="line"><span>    // default HandlerExceptionResolvers if no other resolvers are found.</span></span>
<span class="line"><span>    if (this.handlerExceptionResolvers == null) {</span></span>
<span class="line"><span>        this.handlerExceptionResolvers = getDefaultStrategies(context, HandlerExceptionResolver.class);</span></span>
<span class="line"><span>        if (logger.isTraceEnabled()) {</span></span>
<span class="line"><span>            logger.trace(&quot;No HandlerExceptionResolvers declared in servlet &#39;&quot; + getServletName() +</span></span>
<span class="line"><span>                    &quot;&#39;: using default strategies from DispatcherServlet.properties&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>我们很容易找到ExceptionHandlerExceptionResolver</p><p><img src="`+t+`" alt="error.图片加载失败"></p><p>同样的在afterPropertiesSet去处理advice</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Override</span></span>
<span class="line"><span>public void afterPropertiesSet() {</span></span>
<span class="line"><span>    // Do this first, it may add ResponseBodyAdvice beans</span></span>
<span class="line"><span>    initExceptionHandlerAdviceCache();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (this.argumentResolvers == null) {</span></span>
<span class="line"><span>        List&lt;HandlerMethodArgumentResolver&gt; resolvers = getDefaultArgumentResolvers();</span></span>
<span class="line"><span>        this.argumentResolvers = new HandlerMethodArgumentResolverComposite().addResolvers(resolvers);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (this.returnValueHandlers == null) {</span></span>
<span class="line"><span>        List&lt;HandlerMethodReturnValueHandler&gt; handlers = getDefaultReturnValueHandlers();</span></span>
<span class="line"><span>        this.returnValueHandlers = new HandlerMethodReturnValueHandlerComposite().addHandlers(handlers);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void initExceptionHandlerAdviceCache() {</span></span>
<span class="line"><span>    if (getApplicationContext() == null) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    List&lt;ControllerAdviceBean&gt; adviceBeans = ControllerAdviceBean.findAnnotatedBeans(getApplicationContext());</span></span>
<span class="line"><span>    for (ControllerAdviceBean adviceBean : adviceBeans) {</span></span>
<span class="line"><span>        Class&lt;?&gt; beanType = adviceBean.getBeanType();</span></span>
<span class="line"><span>        if (beanType == null) {</span></span>
<span class="line"><span>            throw new IllegalStateException(&quot;Unresolvable type for ControllerAdviceBean: &quot; + adviceBean);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        ExceptionHandlerMethodResolver resolver = new ExceptionHandlerMethodResolver(beanType);</span></span>
<span class="line"><span>        if (resolver.hasExceptionMappings()) {</span></span>
<span class="line"><span>            this.exceptionHandlerAdviceCache.put(adviceBean, resolver);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (ResponseBodyAdvice.class.isAssignableFrom(beanType)) {</span></span>
<span class="line"><span>            this.responseBodyAdvice.add(adviceBean);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="示例源码" tabindex="-1">示例源码 <a class="header-anchor" href="#示例源码" aria-label="Permalink to &quot;示例源码&quot;">​</a></h2><p><a href="https://github.com/realpdai/tech-pdai-spring-demos" target="_blank" rel="noreferrer">https://github.com/realpdai/tech-pdai-spring-demos</a></p><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,60)]))}const u=a(h,[["render",r]]);export{y as __pageData,u as default};
