import{_ as s,c as n,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/pics/SoWkIImgAStDuU8goIp9ILLmJyrBBKh.png",i="/vitepress-blog-template/images/pics/SoWkIImgAStDuU8goIp9ILK8IatCoQn.png",t="/vitepress-blog-template/images/pics/SoWkIImgAStDuU8goIp9ILLmJ4ylIar.png",c="/vitepress-blog-template/images/pics/SoWkIImgAStDuU8goIp9ILLmpiyjo2_.png",o="/vitepress-blog-template/images/pics/SoWkIImgAStDuU8goIp9ILLmB2xEJyv.png",r="/vitepress-blog-template/images/pics/LOun2W9134NxVugmbJPp15d4LalxC4O.png",y=JSON.parse('{"title":"Java 基础 - 面向对象","description":"","frontmatter":{},"headers":[],"relativePath":"java/basic/java-basic-oop.md","filePath":"java/basic/java-basic-oop.md","lastUpdated":1737706346000}'),u={name:"java/basic/java-basic-oop.md"};function d(h,a,m,g,b,v){return e(),n("div",null,a[0]||(a[0]=[p(`<h1 id="java-基础-面向对象" tabindex="-1">Java 基础 - 面向对象 <a class="header-anchor" href="#java-基础-面向对象" aria-label="Permalink to &quot;Java 基础 - 面向对象&quot;">​</a></h1><blockquote><p>本文主要介绍Java OOP 面向对象基础和相关类图。@pdai</p></blockquote><h2 id="三大特性" tabindex="-1">三大特性 <a class="header-anchor" href="#三大特性" aria-label="Permalink to &quot;三大特性&quot;">​</a></h2><h3 id="封装" tabindex="-1">封装 <a class="header-anchor" href="#封装" aria-label="Permalink to &quot;封装&quot;">​</a></h3><p>利用抽象数据类型将数据和基于数据的操作封装在一起，使其构成一个不可分割的独立实体。数据被保护在抽象数据类型的内部，尽可能地隐藏内部的细节，只保留一些对外接口使之与外部发生联系。用户无需知道对象内部的细节，但可以通过对象对外提供的接口来访问该对象。</p><p>优点:</p><ul><li>减少耦合: 可以独立地开发、测试、优化、使用、理解和修改</li><li>减轻维护的负担: 可以更容易被程序员理解，并且在调试的时候可以不影响其他模块</li><li>有效地调节性能: 可以通过剖析确定哪些模块影响了系统的性能</li><li>提高软件的可重用性</li><li>降低了构建大型系统的风险: 即使整个系统不可用，但是这些独立的模块却有可能是可用的</li></ul><p>以下 Person 类封装 name、gender、age 等属性，外界只能通过 get() 方法获取一个 Person 对象的 name 属性和 gender 属性，而无法获取 age 属性，但是 age 属性可以供 work() 方法使用。</p><p>注意到 gender 属性使用 int 数据类型进行存储，封装使得用户注意不到这种实现细节。并且在需要修改 gender 属性使用的数据类型时，也可以在不影响客户端代码的情况下进行。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Person {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private String name;</span></span>
<span class="line"><span>    private int gender;</span></span>
<span class="line"><span>    private int age;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String getName() {</span></span>
<span class="line"><span>        return name;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public String getGender() {</span></span>
<span class="line"><span>        return gender == 0 ? &quot;man&quot; : &quot;woman&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void work() {</span></span>
<span class="line"><span>        if (18 &lt;= age &amp;&amp; age &lt;= 50) {</span></span>
<span class="line"><span>            System.out.println(name + &quot; is working very hard!&quot;);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            System.out.println(name + &quot; can&#39;t work any more!&quot;);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="继承" tabindex="-1">继承 <a class="header-anchor" href="#继承" aria-label="Permalink to &quot;继承&quot;">​</a></h3><p>继承实现了 <strong>IS-A</strong> 关系，例如 Cat 和 Animal 就是一种 IS-A 关系，因此 Cat 可以继承自 Animal，从而获得 Animal 非 private 的属性和方法。</p><p>继承应该遵循里氏替换原则，子类对象必须能够替换掉所有父类对象。</p><p>Cat 可以当做 Animal 来使用，也就是说可以使用 Animal 引用 Cat 对象。父类引用指向子类对象称为 <strong>向上转型</strong> 。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Animal animal = new Cat();</span></span></code></pre></div><h3 id="多态" tabindex="-1">多态 <a class="header-anchor" href="#多态" aria-label="Permalink to &quot;多态&quot;">​</a></h3><p>多态分为编译时多态和运行时多态:</p><ul><li>编译时多态主要指方法的重载</li><li>运行时多态指程序中定义的对象引用所指向的具体类型在运行期间才确定</li></ul><p>运行时多态有三个条件:</p><ul><li>继承</li><li>覆盖(重写)</li><li>向上转型</li></ul><p>下面的代码中，乐器类(Instrument)有两个子类: Wind 和 Percussion，它们都覆盖了父类的 play() 方法，并且在 main() 方法中使用父类 Instrument 来引用 Wind 和 Percussion 对象。在 Instrument 引用调用 play() 方法时，会执行实际引用对象所在类的 play() 方法，而不是 Instrument 类的方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Instrument {</span></span>
<span class="line"><span>    public void play() {</span></span>
<span class="line"><span>        System.out.println(&quot;Instrument is playing...&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Wind extends Instrument {</span></span>
<span class="line"><span>    public void play() {</span></span>
<span class="line"><span>        System.out.println(&quot;Wind is playing...&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Percussion extends Instrument {</span></span>
<span class="line"><span>    public void play() {</span></span>
<span class="line"><span>        System.out.println(&quot;Percussion is playing...&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>public class Music {</span></span>
<span class="line"><span>    public static void main(String[] args) {</span></span>
<span class="line"><span>        List&lt;Instrument&gt; instruments = new ArrayList&lt;&gt;();</span></span>
<span class="line"><span>        instruments.add(new Wind());</span></span>
<span class="line"><span>        instruments.add(new Percussion());</span></span>
<span class="line"><span>        for(Instrument instrument : instruments) {</span></span>
<span class="line"><span>            instrument.play();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="类图" tabindex="-1">类图 <a class="header-anchor" href="#类图" aria-label="Permalink to &quot;类图&quot;">​</a></h2><p>以下类图使用 <a href="https://www.planttext.com/" target="_blank" rel="noreferrer">PlantUML在新窗口打开</a> 绘制，更多语法及使用请参考: <a href="http://plantuml.com/" target="_blank" rel="noreferrer">http://plantuml.com/</a> 。</p><h3 id="泛化关系-generalization" tabindex="-1">泛化关系 (Generalization) <a class="header-anchor" href="#泛化关系-generalization" aria-label="Permalink to &quot;泛化关系 (Generalization)&quot;">​</a></h3><p>用来描述继承关系，在 Java 中使用 extends 关键字。</p><p><img src="`+l+`" alt="error.图片加载失败"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@startuml</span></span>
<span class="line"><span></span></span>
<span class="line"><span>title Generalization</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Vehical</span></span>
<span class="line"><span>class Car</span></span>
<span class="line"><span>class Truck</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Vehical &lt;|-- Car</span></span>
<span class="line"><span>Vehical &lt;|-- Truck</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@enduml</span></span></code></pre></div><h3 id="实现关系-realization" tabindex="-1">实现关系 (Realization) <a class="header-anchor" href="#实现关系-realization" aria-label="Permalink to &quot;实现关系 (Realization)&quot;">​</a></h3><p>用来实现一个接口，在 Java 中使用 implements 关键字。</p><p><img src="`+i+`" alt="error.图片加载失败"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@startuml</span></span>
<span class="line"><span></span></span>
<span class="line"><span>title Realization</span></span>
<span class="line"><span></span></span>
<span class="line"><span>interface MoveBehavior</span></span>
<span class="line"><span>class Fly</span></span>
<span class="line"><span>class Run</span></span>
<span class="line"><span></span></span>
<span class="line"><span>MoveBehavior &lt;|.. Fly</span></span>
<span class="line"><span>MoveBehavior &lt;|.. Run</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@enduml</span></span></code></pre></div><h3 id="聚合关系-aggregation" tabindex="-1">聚合关系 (Aggregation) <a class="header-anchor" href="#聚合关系-aggregation" aria-label="Permalink to &quot;聚合关系 (Aggregation)&quot;">​</a></h3><p>表示整体由部分组成，但是整体和部分不是强依赖的，整体不存在了部分还是会存在。</p><p><img src="`+t+`" alt="error.图片加载失败"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@startuml</span></span>
<span class="line"><span></span></span>
<span class="line"><span>title Aggregation</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Computer</span></span>
<span class="line"><span>class Keyboard</span></span>
<span class="line"><span>class Mouse</span></span>
<span class="line"><span>class Screen</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Computer o-- Keyboard</span></span>
<span class="line"><span>Computer o-- Mouse</span></span>
<span class="line"><span>Computer o-- Screen</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@enduml</span></span></code></pre></div><h3 id="组合关系-composition" tabindex="-1">组合关系 (Composition) <a class="header-anchor" href="#组合关系-composition" aria-label="Permalink to &quot;组合关系 (Composition)&quot;">​</a></h3><p>和聚合不同，组合中整体和部分是强依赖的，整体不存在了部分也不存在了。比如公司和部门，公司没了部门就不存在了。但是公司和员工就属于聚合关系了，因为公司没了员工还在。</p><p><img src="`+c+`" alt="error.图片加载失败"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@startuml</span></span>
<span class="line"><span></span></span>
<span class="line"><span>title Composition</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Company</span></span>
<span class="line"><span>class DepartmentA</span></span>
<span class="line"><span>class DepartmentB</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Company *-- DepartmentA</span></span>
<span class="line"><span>Company *-- DepartmentB</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@enduml</span></span></code></pre></div><h3 id="关联关系-association" tabindex="-1">关联关系 (Association) <a class="header-anchor" href="#关联关系-association" aria-label="Permalink to &quot;关联关系 (Association)&quot;">​</a></h3><p>表示不同类对象之间有关联，这是一种静态关系，与运行过程的状态无关，在最开始就可以确定。因此也可以用 1 对 1、多对 1、多对多这种关联关系来表示。比如学生和学校就是一种关联关系，一个学校可以有很多学生，但是一个学生只属于一个学校，因此这是一种多对一的关系，在运行开始之前就可以确定。</p><p><img src="`+o+`" alt="error.图片加载失败"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@startuml</span></span>
<span class="line"><span></span></span>
<span class="line"><span>title Association</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class School</span></span>
<span class="line"><span>class Student</span></span>
<span class="line"><span></span></span>
<span class="line"><span>School &quot;1&quot; - &quot;n&quot; Student</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@enduml</span></span></code></pre></div><h3 id="依赖关系-dependency" tabindex="-1">依赖关系 (Dependency) <a class="header-anchor" href="#依赖关系-dependency" aria-label="Permalink to &quot;依赖关系 (Dependency)&quot;">​</a></h3><p>和关联关系不同的是，依赖关系是在运行过程中起作用的。A 类和 B 类是依赖关系主要有三种形式:</p><ul><li>A 类是 B 类中的(某中方法的)局部变量；</li><li>A 类是 B 类方法当中的一个参数；</li><li>A 类向 B 类发送消息，从而影响 B 类发生变化；</li></ul><p><img src="`+r+`" alt="error.图片加载失败"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@startuml</span></span>
<span class="line"><span></span></span>
<span class="line"><span>title Dependency</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Vehicle {</span></span>
<span class="line"><span>    move(MoveBehavior)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>interface MoveBehavior {</span></span>
<span class="line"><span>    move()</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>note &quot;MoveBehavior.move()&quot; as N</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Vehicle ..&gt; MoveBehavior</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Vehicle .. N</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@enduml</span></span></code></pre></div><h2 id="参考资料" tabindex="-1">参考资料 <a class="header-anchor" href="#参考资料" aria-label="Permalink to &quot;参考资料&quot;">​</a></h2><ul><li><p>Java 编程思想</p></li><li><p>敏捷软件开发: 原则、模式与实践</p></li><li><p><a href="http://www.cnblogs.com/shanyou/archive/2009/09/21/1570716.html" target="_blank" rel="noreferrer">面向对象设计的 SOLID 原则在新窗口打开</a></p></li><li><p><a href="http://design-patterns.readthedocs.io/zh_CN/latest/read_uml.html#generalization" target="_blank" rel="noreferrer">看懂 UML 类图和时序图在新窗口打开</a></p></li><li><p><a href="http://www.cnblogs.com/wolf-sun/p/UML-Sequence-diagram.html" target="_blank" rel="noreferrer">UML 系列——时序图(顺序图)sequence diagram在新窗口打开</a></p></li><li><p><a href="http://blog.csdn.net/jianyuerensheng/article/details/51602015" target="_blank" rel="noreferrer">面向对象编程三大特性 ------ 封装、继承、多态在新窗口打开</a></p></li><li><p>javaoop基础知识总结 <a href="https://blog.csdn.net/weixin%5C_38173324/article/details/70037927" target="_blank" rel="noreferrer">https://blog.csdn.net/weixin\\_38173324/article/details/70037927</a></p></li><li><p>Java实现OOP(面向对象编程) <a href="https://www.cnblogs.com/AlanLee/p/6475334.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/AlanLee/p/6475334.html</a></p></li><li><p>Java 抽象类与oop三大特征 <a href="http://www.cnblogs.com/wujing-hubei/p/6012105.html" target="_blank" rel="noreferrer">http://www.cnblogs.com/wujing-hubei/p/6012105.html</a></p></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,52)]))}const q=s(u,[["render",d]]);export{y as __pageData,q as default};
