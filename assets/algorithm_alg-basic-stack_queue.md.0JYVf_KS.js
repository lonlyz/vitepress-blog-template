import{_ as s,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/alg/alg-stack-1.png",t="/vitepress-blog-template/images/alg/alg-queue-1.png",g=JSON.parse('{"title":"线性表 - 栈和队列","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/alg-basic-stack_queue.md","filePath":"algorithm/alg-basic-stack_queue.md","lastUpdated":1737706346000}'),i={name:"algorithm/alg-basic-stack_queue.md"};function c(r,n,o,u,d,h){return e(),a("div",null,n[0]||(n[0]=[p('<h1 id="线性表-栈和队列" tabindex="-1">线性表 - 栈和队列 <a class="header-anchor" href="#线性表-栈和队列" aria-label="Permalink to &quot;线性表 - 栈和队列&quot;">​</a></h1><blockquote><p>数组和链表都是线性存储结构的基础，栈和队列都是线性存储结构的应用。@pdai</p></blockquote><h2 id="知识点" tabindex="-1">知识点 <a class="header-anchor" href="#知识点" aria-label="Permalink to &quot;知识点&quot;">​</a></h2><h3 id="栈-lifo" tabindex="-1">栈 - LIFO <a class="header-anchor" href="#栈-lifo" aria-label="Permalink to &quot;栈 - LIFO&quot;">​</a></h3><p>示意图</p><p><img src="'+l+'" alt="error.图片加载失败"></p><p>实现</p><ul><li>使用数组实现的叫<code>静态栈</code></li><li>使用链表实现的叫<code>动态栈</code></li></ul><h3 id="队列-fifo" tabindex="-1">队列 - FIFO <a class="header-anchor" href="#队列-fifo" aria-label="Permalink to &quot;队列 - FIFO&quot;">​</a></h3><p>示意图</p><p><img src="'+t+`" alt="error.图片加载失败"></p><p>实现</p><ul><li>使用数组实现的叫<code>静态队列</code></li><li>使用链表实现的叫<code>动态队列</code></li></ul><h3 id="jdk中实现" tabindex="-1">JDK中实现 <a class="header-anchor" href="#jdk中实现" aria-label="Permalink to &quot;JDK中实现&quot;">​</a></h3><p><a href="https://pdai.tech/md/java/collection/java-collection-Queue&amp;Stack.html" target="_blank" rel="noreferrer">《Java - Stack &amp; Queue 源码解析》</a></p><h2 id="栈和队列相关题目" tabindex="-1">栈和队列相关题目 <a class="header-anchor" href="#栈和队列相关题目" aria-label="Permalink to &quot;栈和队列相关题目&quot;">​</a></h2><p><strong>用栈实现队列</strong></p><p><a href="https://leetcode.com/problems/implement-queue-using-stacks/description/" target="_blank" rel="noreferrer">232. Implement Queue using Stacks (Easy)在新窗口打开</a></p><p>栈的顺序为后进先出，而队列的顺序为先进先出。使用两个栈实现队列，一个元素需要经过两个栈才能出队列，在经过第一个栈时元素顺序被反转，经过第二个栈时再次被反转，此时就是先进先出顺序。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class MyQueue {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private Stack&lt;Integer&gt; in = new Stack&lt;&gt;();</span></span>
<span class="line"><span>    private Stack&lt;Integer&gt; out = new Stack&lt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void push(int x) {</span></span>
<span class="line"><span>        in.push(x);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int pop() {</span></span>
<span class="line"><span>        in2out();</span></span>
<span class="line"><span>        return out.pop();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int peek() {</span></span>
<span class="line"><span>        in2out();</span></span>
<span class="line"><span>        return out.peek();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private void in2out() {</span></span>
<span class="line"><span>        if (out.isEmpty()) {</span></span>
<span class="line"><span>            while (!in.isEmpty()) {</span></span>
<span class="line"><span>                out.push(in.pop());</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public boolean empty() {</span></span>
<span class="line"><span>        return in.isEmpty() &amp;&amp; out.isEmpty();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>用队列实现栈</strong></p><p><a href="https://leetcode.com/problems/implement-stack-using-queues/description/" target="_blank" rel="noreferrer">225. Implement Stack using Queues (Easy)在新窗口打开</a></p><p>在将一个元素 x 插入队列时，为了维护原来的后进先出顺序，需要让 x 插入队列首部。而队列的默认插入顺序是队列尾部，因此在将 x 插入队列尾部之后，需要让除了 x 之外的所有元素出队列，再入队列。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class MyStack {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private Queue&lt;Integer&gt; queue;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public MyStack() {</span></span>
<span class="line"><span>        queue = new LinkedList&lt;&gt;();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void push(int x) {</span></span>
<span class="line"><span>        queue.add(x);</span></span>
<span class="line"><span>        int cnt = queue.size();</span></span>
<span class="line"><span>        while (cnt-- &gt; 1) {</span></span>
<span class="line"><span>            queue.add(queue.poll());</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int pop() {</span></span>
<span class="line"><span>        return queue.remove();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int top() {</span></span>
<span class="line"><span>        return queue.peek();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public boolean empty() {</span></span>
<span class="line"><span>        return queue.isEmpty();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>最小值栈</strong></p><p><a href="https://leetcode.com/problems/min-stack/description/" target="_blank" rel="noreferrer">155. Min Stack (Easy)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class MinStack {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    private Stack&lt;Integer&gt; dataStack;</span></span>
<span class="line"><span>    private Stack&lt;Integer&gt; minStack;</span></span>
<span class="line"><span>    private int min;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public MinStack() {</span></span>
<span class="line"><span>        dataStack = new Stack&lt;&gt;();</span></span>
<span class="line"><span>        minStack = new Stack&lt;&gt;();</span></span>
<span class="line"><span>        min = Integer.MAX_VALUE;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void push(int x) {</span></span>
<span class="line"><span>        dataStack.add(x);</span></span>
<span class="line"><span>        min = Math.min(min, x);</span></span>
<span class="line"><span>        minStack.add(min);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public void pop() {</span></span>
<span class="line"><span>        dataStack.pop();</span></span>
<span class="line"><span>        minStack.pop();</span></span>
<span class="line"><span>        min = minStack.isEmpty() ? Integer.MAX_VALUE : minStack.peek();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int top() {</span></span>
<span class="line"><span>        return dataStack.peek();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public int getMin() {</span></span>
<span class="line"><span>        return minStack.peek();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对于实现最小值队列问题，可以先将队列使用栈来实现，然后就将问题转换为最小值栈，这个问题出现在 编程之美: 3.7。</p><p><strong>用栈实现括号匹配</strong></p><p><a href="https://leetcode.com/problems/valid-parentheses/description/" target="_blank" rel="noreferrer">20. Valid Parentheses (Easy)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&quot;()[]{}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Output : true</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean isValid(String s) {</span></span>
<span class="line"><span>    Stack&lt;Character&gt; stack = new Stack&lt;&gt;();</span></span>
<span class="line"><span>    for (char c : s.toCharArray()) {</span></span>
<span class="line"><span>        if (c == &#39;(&#39; || c == &#39;{&#39; || c == &#39;[&#39;) {</span></span>
<span class="line"><span>            stack.push(c);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            if (stack.isEmpty()) {</span></span>
<span class="line"><span>                return false;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            char cStack = stack.pop();</span></span>
<span class="line"><span>            boolean b1 = c == &#39;)&#39; &amp;&amp; cStack != &#39;(&#39;;</span></span>
<span class="line"><span>            boolean b2 = c == &#39;]&#39; &amp;&amp; cStack != &#39;[&#39;;</span></span>
<span class="line"><span>            boolean b3 = c == &#39;}&#39; &amp;&amp; cStack != &#39;{&#39;;</span></span>
<span class="line"><span>            if (b1 || b2 || b3) {</span></span>
<span class="line"><span>                return false;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return stack.isEmpty();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>数组中元素与下一个比它大的元素之间的距离</strong></p><p><a href="https://leetcode.com/problems/daily-temperatures/description/" target="_blank" rel="noreferrer">739. Daily Temperatures (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: [73, 74, 75, 71, 69, 72, 76, 73]</span></span>
<span class="line"><span>Output: [1, 1, 4, 2, 1, 1, 0, 0]</span></span></code></pre></div><p>在遍历数组时用栈把数组中的数存起来，如果当前遍历的数比栈顶元素来的大，说明栈顶元素的下一个比它大的数就是当前元素。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int[] dailyTemperatures(int[] temperatures) {</span></span>
<span class="line"><span>    int n = temperatures.length;</span></span>
<span class="line"><span>    int[] dist = new int[n];</span></span>
<span class="line"><span>    Stack&lt;Integer&gt; indexs = new Stack&lt;&gt;();</span></span>
<span class="line"><span>    for (int curIndex = 0; curIndex &lt; n; curIndex++) {</span></span>
<span class="line"><span>        while (!indexs.isEmpty() &amp;&amp; temperatures[curIndex] &gt; temperatures[indexs.peek()]) {</span></span>
<span class="line"><span>            int preIndex = indexs.pop();</span></span>
<span class="line"><span>            dist[preIndex] = curIndex - preIndex;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        indexs.add(curIndex);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return dist;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>循环数组中比当前元素大的下一个元素</strong></p><p><a href="https://leetcode.com/problems/next-greater-element-ii/description/" target="_blank" rel="noreferrer">503. Next Greater Element II (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: [1,2,1]</span></span>
<span class="line"><span>Output: [2,-1,2]</span></span>
<span class="line"><span>Explanation: The first 1&#39;s next greater number is 2;</span></span>
<span class="line"><span>The number 2 can&#39;t find next greater number;</span></span>
<span class="line"><span>The second 1&#39;s next greater number needs to search circularly, which is also 2.</span></span></code></pre></div><p>与 739. Daily Temperatures (Medium) 不同的是，数组是循环数组，并且最后要求的不是距离而是下一个元素。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public int[] nextGreaterElements(int[] nums) {</span></span>
<span class="line"><span>    int n = nums.length;</span></span>
<span class="line"><span>    int[] next = new int[n];</span></span>
<span class="line"><span>    Arrays.fill(next, -1);</span></span>
<span class="line"><span>    Stack&lt;Integer&gt; pre = new Stack&lt;&gt;();</span></span>
<span class="line"><span>    for (int i = 0; i &lt; n * 2; i++) {</span></span>
<span class="line"><span>        int num = nums[i % n];</span></span>
<span class="line"><span>        while (!pre.isEmpty() &amp;&amp; nums[pre.peek()] &lt; num) {</span></span>
<span class="line"><span>            next[pre.pop()] = num;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (i &lt; n){</span></span>
<span class="line"><span>            pre.push(i);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return next;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="参考文章" tabindex="-1">参考文章 <a class="header-anchor" href="#参考文章" aria-label="Permalink to &quot;参考文章&quot;">​</a></h2><ul><li><p><a href="https://www.cnblogs.com/QG-whz/p/5170418.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/QG-whz/p/5170418.html</a></p></li><li><p><a href="https://www.cnblogs.com/QG-whz/p/5171123.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/QG-whz/p/5171123.html</a></p></li></ul><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,45)]))}const b=s(i,[["render",c]]);export{g as __pageData,b as default};
