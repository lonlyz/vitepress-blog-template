import{_ as s,c as n,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/pics/ae1b27b8-bc13-42e7-ac12-a2242e125499.png",i="/vitepress-blog-template/images/pics/1fc969e4-0e7c-441b-b53c-01950d2f2be5.png",g=JSON.parse('{"title":"常见重构技巧 - 去除多余的if else","description":"","frontmatter":{},"headers":[],"relativePath":"develop/refactor/dev-refactor-if-else.md","filePath":"develop/refactor/dev-refactor-if-else.md","lastUpdated":1737706346000}'),t={name:"develop/refactor/dev-refactor-if-else.md"};function c(o,a,r,u,d,h){return e(),n("div",null,a[0]||(a[0]=[p(`<h1 id="常见重构技巧-去除多余的if-else" tabindex="-1">常见重构技巧 - 去除多余的if else <a class="header-anchor" href="#常见重构技巧-去除多余的if-else" aria-label="Permalink to &quot;常见重构技巧 - 去除多余的if else&quot;">​</a></h1><blockquote><p>最为常见的是代码中使用很多的if/else，或者switch/case；如何重构呢？方法特别多，本文带你学习其中的技巧。</p></blockquote><h2 id="出现if-else和switch-case的场景" tabindex="-1">出现if/else和switch/case的场景 <a class="header-anchor" href="#出现if-else和switch-case的场景" aria-label="Permalink to &quot;出现if/else和switch/case的场景&quot;">​</a></h2><p>通常业务代码会包含这样的逻辑：每种条件下会有不同的处理逻辑。比如两个数a和b之间可以通过不同的操作符（+，-，*，/）进行计算，初学者通常会这么写：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int calculate(int a, int b, String operator) {</span></span>
<span class="line"><span>    int result = Integer.MIN_VALUE;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    if (&quot;add&quot;.equals(operator)) {</span></span>
<span class="line"><span>        result = a + b;</span></span>
<span class="line"><span>    } else if (&quot;multiply&quot;.equals(operator)) {</span></span>
<span class="line"><span>        result = a * b;</span></span>
<span class="line"><span>    } else if (&quot;divide&quot;.equals(operator)) {</span></span>
<span class="line"><span>        result = a / b;</span></span>
<span class="line"><span>    } else if (&quot;subtract&quot;.equals(operator)) {</span></span>
<span class="line"><span>        result = a - b;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return result;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>或者用switch/case：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int calculateUsingSwitch(int a, int b, String operator) {</span></span>
<span class="line"><span>    switch (operator) {</span></span>
<span class="line"><span>    case &quot;add&quot;:</span></span>
<span class="line"><span>        result = a + b;</span></span>
<span class="line"><span>        break;</span></span>
<span class="line"><span>    // other cases    </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return result;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>这种最基础的代码如何重构呢？</p><h2 id="重构思路" tabindex="-1">重构思路 <a class="header-anchor" href="#重构思路" aria-label="Permalink to &quot;重构思路&quot;">​</a></h2><blockquote><p>有非常多的重构方法来解决这个问题, 这里会列举很多方法，在实际应用中可能会根据场景进行一些调整；另外不要纠结这些例子中显而易见的缺陷（比如没用常量，没考虑多线程等等），而是把重心放在学习其中的思路上。@pdai</p></blockquote><h3 id="方式一-工厂类" tabindex="-1">方式一 - 工厂类 <a class="header-anchor" href="#方式一-工厂类" aria-label="Permalink to &quot;方式一 - 工厂类&quot;">​</a></h3><ul><li>定义一个操作接口</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Operation {</span></span>
<span class="line"><span>    int apply(int a, int b);</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>实现操作， 这里只以add为例</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Addition implements Operation {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public int apply(int a, int b) {</span></span>
<span class="line"><span>        return a + b;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>实现操作工厂</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class OperatorFactory {</span></span>
<span class="line"><span>    static Map&lt;String, Operation&gt; operationMap = new HashMap&lt;&gt;();</span></span>
<span class="line"><span>    static {</span></span>
<span class="line"><span>        operationMap.put(&quot;add&quot;, new Addition());</span></span>
<span class="line"><span>        operationMap.put(&quot;divide&quot;, new Division());</span></span>
<span class="line"><span>        // more operators</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    public static Optional&lt;Operation&gt; getOperation(String operator) {</span></span>
<span class="line"><span>        return Optional.ofNullable(operationMap.get(operator));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>在Calculator中调用</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int calculateUsingFactory(int a, int b, String operator) {</span></span>
<span class="line"><span>    Operation targetOperation = OperatorFactory</span></span>
<span class="line"><span>      .getOperation(operator)</span></span>
<span class="line"><span>      .orElseThrow(() -&gt; new IllegalArgumentException(&quot;Invalid Operator&quot;));</span></span>
<span class="line"><span>    return targetOperation.apply(a, b);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对于上面为什么方法名是<code>apply</code>,<code>Optional</code>怎么用? 请参考这篇：</p><ul><li><a href="https://pdai.tech/md/java/java8/java8-stream.html" target="_blank" rel="noreferrer">Java 8 - 函数编程(lambda表达式)</a><ul><li>Lambda 表达式的特点?</li><li>Lambda 表达式使用和Stream下的接口?</li><li>函数接口定义和使用，四大内置函数接口Consumer，Function，Supplier, Predicate.</li><li>Comparator排序为例贯穿所有知识点。</li></ul></li><li><a href="https://pdai.tech/md/java/java8/java8-optional.html" target="_blank" rel="noreferrer">Java 8 - Optional类深度解析</a><ul><li>Optional类的意义?</li><li>Optional类有哪些常用的方法?</li><li>Optional举例贯穿所有知识点</li><li>如何解决多重类嵌套Null值判断?</li></ul></li></ul><h3 id="方式二-枚举" tabindex="-1">方式二 - 枚举 <a class="header-anchor" href="#方式二-枚举" aria-label="Permalink to &quot;方式二 - 枚举&quot;">​</a></h3><blockquote><p>枚举适合类型固定，可枚举的情况，比如这的操作符; 同时枚举中是可以提供方法实现的，这就是我们可以通过枚举进行重构的原因。</p></blockquote><ul><li>定义操作符枚举</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public enum Operator {</span></span>
<span class="line"><span>    ADD {</span></span>
<span class="line"><span>        @Override</span></span>
<span class="line"><span>        public int apply(int a, int b) {</span></span>
<span class="line"><span>            return a + b;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    // other operators</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    public abstract int apply(int a, int b);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>在Calculator中调用</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int calculate(int a, int b, Operator operator) {</span></span>
<span class="line"><span>    return operator.apply(a, b);</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>写个测试用例测试下：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void whenCalculateUsingEnumOperator_thenReturnCorrectResult() {</span></span>
<span class="line"><span>    Calculator calculator = new Calculator();</span></span>
<span class="line"><span>    int result = calculator.calculate(3, 4, Operator.valueOf(&quot;ADD&quot;));</span></span>
<span class="line"><span>    assertEquals(7, result);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>看是否很简单?</p><h3 id="方法三-命令模式" tabindex="-1">方法三 - 命令模式 <a class="header-anchor" href="#方法三-命令模式" aria-label="Permalink to &quot;方法三 - 命令模式&quot;">​</a></h3><blockquote><p>命令模式也是非常常用的重构方式， 把每个操作符当作一个Command。</p></blockquote><ul><li><p>首先让我们回顾下什么是命令模式</p><ul><li><p>看这篇文章：<a href="https://pdai.tech/md/dev-spec/pattern/18_command.html" target="_blank" rel="noreferrer">行为型 - 命令模式(Command)</a></p><ul><li>命令模式(Command pattern): 将&quot;请求&quot;封闭成对象, 以便使用不同的请求,队列或者日志来参数化其他对象. 命令模式也支持可撤销的操作。 <ul><li>Command: 命令</li><li>Receiver: 命令接收者，也就是命令真正的执行者</li><li>Invoker: 通过它来调用命令</li><li>Client: 可以设置命令与命令的接收者</li></ul></li></ul><p><img src="`+l+`" alt=""></p></li></ul></li><li><p>Command接口</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Command {</span></span>
<span class="line"><span>    Integer execute();</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>实现Command</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class AddCommand implements Command {</span></span>
<span class="line"><span>    // Instance variables</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    public AddCommand(int a, int b) {</span></span>
<span class="line"><span>        this.a = a;</span></span>
<span class="line"><span>        this.b = b;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public Integer execute() {</span></span>
<span class="line"><span>        return a + b;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>在Calculator中调用</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int calculate(Command command) {</span></span>
<span class="line"><span>    return command.execute();</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>测试用例</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void whenCalculateUsingCommand_thenReturnCorrectResult() {</span></span>
<span class="line"><span>    Calculator calculator = new Calculator();</span></span>
<span class="line"><span>    int result = calculator.calculate(new AddCommand(3, 7));</span></span>
<span class="line"><span>    assertEquals(10, result);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>注意，这里<code>new AddCommand(3, 7)</code>仍然没有解决动态获取操作符问题，所以通常来说可以结合简单工厂模式来调用：</p><ul><li><a href="https://pdai.tech/md/dev-spec/pattern/3_simple_factory.html" target="_blank" rel="noreferrer">创建型 - 简单工厂(Simple Factory)</a><ul><li>简单工厂(Simple Factory)，它把实例化的操作单独放到一个类中，这个类就成为简单工厂类，让简单工厂类来决定应该用哪个具体子类来实例化，这样做能把客户类和具体子类的实现解耦，客户类不再需要知道有哪些子类以及应当实例化哪个子类</li></ul></li></ul><h3 id="方法四-规则引擎" tabindex="-1">方法四 - 规则引擎 <a class="header-anchor" href="#方法四-规则引擎" aria-label="Permalink to &quot;方法四 - 规则引擎&quot;">​</a></h3><blockquote><p>规则引擎适合规则很多且可能动态变化的情况，在先要搞清楚一点Java OOP，即类的抽象：</p></blockquote><ul><li><p>这里可以抽象出哪些类？// 头脑中需要有这种自动转化</p><ul><li>规则Rule <ul><li>规则接口</li><li>具体规则的泛化实现</li></ul></li><li>表达式Expression <ul><li>操作符</li><li>操作数</li></ul></li><li>规则引擎</li></ul></li><li><p>定义规则</p></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Rule {</span></span>
<span class="line"><span>    boolean evaluate(Expression expression);</span></span>
<span class="line"><span>    Result getResult();</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>Add 规则</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class AddRule implements Rule {</span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public boolean evaluate(Expression expression) {</span></span>
<span class="line"><span>        boolean evalResult = false;</span></span>
<span class="line"><span>        if (expression.getOperator() == Operator.ADD) {</span></span>
<span class="line"><span>            this.result = expression.getX() + expression.getY();</span></span>
<span class="line"><span>            evalResult = true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        return evalResult;</span></span>
<span class="line"><span>    }    </span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>表达式</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Expression {</span></span>
<span class="line"><span>    private Integer x;</span></span>
<span class="line"><span>    private Integer y;</span></span>
<span class="line"><span>    private Operator operator;        </span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>规则引擎</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class RuleEngine {</span></span>
<span class="line"><span>    private static List&lt;Rule&gt; rules = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    static {</span></span>
<span class="line"><span>        rules.add(new AddRule());</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    public Result process(Expression expression) {</span></span>
<span class="line"><span>        Rule rule = rules</span></span>
<span class="line"><span>          .stream()</span></span>
<span class="line"><span>          .filter(r -&gt; r.evaluate(expression))</span></span>
<span class="line"><span>          .findFirst()</span></span>
<span class="line"><span>          .orElseThrow(() -&gt; new IllegalArgumentException(&quot;Expression does not matches any Rule&quot;));</span></span>
<span class="line"><span>        return rule.getResult();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>测试用例</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Test</span></span>
<span class="line"><span>public void whenNumbersGivenToRuleEngine_thenReturnCorrectResult() {</span></span>
<span class="line"><span>    Expression expression = new Expression(5, 5, Operator.ADD);</span></span>
<span class="line"><span>    RuleEngine engine = new RuleEngine();</span></span>
<span class="line"><span>    Result result = engine.process(expression);</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    assertNotNull(result);</span></span>
<span class="line"><span>    assertEquals(10, result.getValue());</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="方法五-策略模式" tabindex="-1">方法五 - 策略模式 <a class="header-anchor" href="#方法五-策略模式" aria-label="Permalink to &quot;方法五 - 策略模式&quot;">​</a></h3><blockquote><p>策略模式比命令模式更为常用，而且在实际业务逻辑开发中需要注入一定的（比如通过Spring的<code>@Autowired</code>来注入bean），这时通过策略模式可以巧妙的重构</p></blockquote><ul><li><p>什么是策略模式？</p><ul><li>我们再复习下：<a href="https://pdai.tech/md/dev-spec/pattern/16_strategy.html" target="_blank" rel="noreferrer">行为型 - 策略(Strategy)</a></li><li>策略模式(strategy pattern): 定义了算法族, 分别封闭起来, 让它们之间可以互相替换, 此模式让算法的变化独立于使用算法的客户 <ul><li>Strategy 接口定义了一个算法族，它们都具有 behavior() 方法。</li><li>Context 是使用到该算法族的类，其中的 doSomething() 方法会调用 behavior()，setStrategy(in Strategy) 方法可以动态地改变 strategy 对象，也就是说能动态地改变 Context 所使用的算法。</li></ul></li></ul><p><img src="`+i+`" alt=""></p></li><li><p><strong>Spring中需要注入资源重构？</strong></p></li></ul><blockquote><p>如果是在实现业务逻辑需要注入框架中资源呢？比如通过Spring的<code>@Autowired</code>来注入bean。可以这样实现：</p></blockquote><ul><li>操作 // 很巧妙</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public interface Opt {</span></span>
<span class="line"><span>    int apply(int a, int b);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Component(value = &quot;addOpt&quot;)</span></span>
<span class="line"><span>public class AddOpt implements Opt {</span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    xxxAddResource resource; // 这里通过Spring框架注入了资源</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public int apply(int a, int b) {</span></span>
<span class="line"><span>       return resource.process(a, b);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@Component(value = &quot;devideOpt&quot;)</span></span>
<span class="line"><span>public class devideOpt implements Opt {</span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    xxxDivResource resource; // 这里通过Spring框架注入了资源</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    @Override</span></span>
<span class="line"><span>    public int apply(int a, int b) {</span></span>
<span class="line"><span>       return resource.process(a, b);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ul><li>策略</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@Component</span></span>
<span class="line"><span>public class OptStrategyContext{</span></span>
<span class="line"><span> </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private Map&lt;String, Opt&gt; strategyMap = new ConcurrentHashMap&lt;&gt;();</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    @Autowired</span></span>
<span class="line"><span>    public OptStrategyContext(Map&lt;String, TalkService&gt; strategyMap) {</span></span>
<span class="line"><span>        this.strategyMap.clear();</span></span>
<span class="line"><span>        this.strategyMap.putAll(strategyMap);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    public int apply(Sting opt, int a, int b) {</span></span>
<span class="line"><span>        return strategyMap.get(opt).apply(a, b);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>上述代码在实现中非常常见。</p><h2 id="一些反思" tabindex="-1">一些反思 <a class="header-anchor" href="#一些反思" aria-label="Permalink to &quot;一些反思&quot;">​</a></h2><blockquote><p>最怕的是刚学会成语，就什么地方都想用成语。</p></blockquote><ul><li><p>真的要这么重构吗？</p><ul><li>在实际开发中，切记<code>最怕的是刚学会成语，就什么地方都想用成语</code>; 很多时候不是考虑是否是最佳实现，而是折中（通常是业务和代价的折中，开发和维护的折中...），在适当的时候做适当的重构。</li><li>很多时候，让团队可持续性的维护代码便是最佳；</li><li>重构后会生成很多类，一个简单业务搞这么复杂？所以你需要权衡</li></ul></li></ul><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li><a href="https://www.baeldung.com/java-replace-if-statements" target="_blank" rel="noreferrer">https://www.baeldung.com/java-replace-if-statements</a></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,69)]))}const v=s(t,[["render",c]]);export{g as __pageData,v as default};
