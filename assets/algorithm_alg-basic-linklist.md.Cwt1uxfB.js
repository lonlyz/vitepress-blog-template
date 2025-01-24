import{_ as n,c as a,ai as p,o as e}from"./chunks/framework.BrYByd3F.js";const l="/vitepress-blog-template/images/alg/alg-linkedlist-1.png",g=JSON.parse('{"title":"线性表 - 链表","description":"","frontmatter":{},"headers":[],"relativePath":"algorithm/alg-basic-linklist.md","filePath":"algorithm/alg-basic-linklist.md","lastUpdated":1737706346000}'),t={name:"algorithm/alg-basic-linklist.md"};function i(c,s,d,o,r,h){return e(),a("div",null,s[0]||(s[0]=[p('<h1 id="线性表-链表" tabindex="-1">线性表 - 链表 <a class="header-anchor" href="#线性表-链表" aria-label="Permalink to &quot;线性表 - 链表&quot;">​</a></h1><blockquote><p>n个节点离散分配，彼此通过指针相连，每个节点只有一个前驱节点，每个节点只有一个后续节点，首节点没有前驱节点，尾节点没有后续节点。确定一个链表我们只需要头指针，通过头指针就可以把整个链表都能推出来。@pdai</p></blockquote><h2 id="知识点" tabindex="-1">知识点 <a class="header-anchor" href="#知识点" aria-label="Permalink to &quot;知识点&quot;">​</a></h2><h3 id="优缺点" tabindex="-1">优缺点 <a class="header-anchor" href="#优缺点" aria-label="Permalink to &quot;优缺点&quot;">​</a></h3><p>链表优点</p><ul><li>空间没有限制</li><li>插入删除元素很快</li></ul><p>链表缺点 存取速度很慢</p><h3 id="分类" tabindex="-1">分类 <a class="header-anchor" href="#分类" aria-label="Permalink to &quot;分类&quot;">​</a></h3><ul><li><p>单向链表 一个节点指向下一个节点。</p></li><li><p>双向链表 一个节点有两个指针域。</p></li><li><p>循环链表 能通过任何一个节点找到其他所有的节点，将两种(双向/单向)链表的最后一个结点指向第一个结点从而实现循环。</p></li></ul><h3 id="实现" tabindex="-1">实现 <a class="header-anchor" href="#实现" aria-label="Permalink to &quot;实现&quot;">​</a></h3><p><img src="'+l+`" alt="error.图片加载失败"></p><p>节点</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public class Node {</span></span>
<span class="line"><span>    //数据域</span></span>
<span class="line"><span>    public int data;</span></span>
<span class="line"><span>    //指针域，指向下一个节点</span></span>
<span class="line"><span>    public Node next;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    public Node() {</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public Node(int data) {</span></span>
<span class="line"><span>        this.data = data;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    public Node(int data, Node next) {</span></span>
<span class="line"><span>        this.data = data;</span></span>
<span class="line"><span>        this.next = next;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如上，一个链表节点对象就创建完成了，但理解链表本身并不难，但做相关的操作却并非易事，其算法包括且不限于:</p><ul><li>插入节点</li><li>遍历</li><li>查找</li><li>清空</li><li>销毁</li><li>求长度</li><li>排序</li><li>删除节点</li><li>去重</li></ul><p>JDK中关于链表的实现，请参考:</p><p><a href="https://pdai.tech/md/java/collection/java-collection-LinkedList.html" target="_blank" rel="noreferrer">《Java - LinkedList 源码解析》</a></p><h2 id="链表相关题目" tabindex="-1">链表相关题目 <a class="header-anchor" href="#链表相关题目" aria-label="Permalink to &quot;链表相关题目&quot;">​</a></h2><p>链表是空节点，或者有一个值和一个指向下一个链表的指针，因此很多链表问题可以用递归来处理。</p><p><strong>找出两个链表的交点</strong></p><p><a href="https://leetcode.com/problems/intersection-of-two-linked-lists/description/" target="_blank" rel="noreferrer">160. Intersection of Two Linked Lists (Easy)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>A:          a1 → a2</span></span>
<span class="line"><span>                    ↘</span></span>
<span class="line"><span>                      c1 → c2 → c3</span></span>
<span class="line"><span>                    ↗</span></span>
<span class="line"><span>B:    b1 → b2 → b3</span></span></code></pre></div><p>要求: 时间复杂度为 O(N)，空间复杂度为 O(1)</p><p>设 A 的长度为 a + c，B 的长度为 b + c，其中 c 为尾部公共部分长度，可知 a + c + b = b + c + a。</p><p>当访问 A 链表的指针访问到链表尾部时，令它从链表 B 的头部开始访问链表 B；同样地，当访问 B 链表的指针访问到链表尾部时，令它从链表 A 的头部开始访问链表 A。这样就能控制访问 A 和 B 两个链表的指针能同时访问到交点。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ListNode getIntersectionNode(ListNode headA, ListNode headB) {</span></span>
<span class="line"><span>    ListNode l1 = headA, l2 = headB;</span></span>
<span class="line"><span>    while (l1 != l2) {</span></span>
<span class="line"><span>        l1 = (l1 == null) ? headB : l1.next;</span></span>
<span class="line"><span>        l2 = (l2 == null) ? headA : l2.next;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return l1;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如果只是判断是否存在交点，那么就是另一个问题，即 <a href="https://pdai.tech/md/algorithm/alg-basic-tree.html" target="_blank" rel="noreferrer">编程之美 3.6</a> 的问题。有两种解法:</p><ul><li>把第一个链表的结尾连接到第二个链表的开头，看第二个链表是否存在环；</li><li>或者直接比较两个链表的最后一个节点是否相同。</li></ul><p><strong>链表反转</strong></p><p><a href="https://leetcode.com/problems/reverse-linked-list/description/" target="_blank" rel="noreferrer">206. Reverse Linked List (Easy)在新窗口打开</a></p><p>递归</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ListNode reverseList(ListNode head) {</span></span>
<span class="line"><span>    if (head == null || head.next == null) {</span></span>
<span class="line"><span>        return head;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ListNode next = head.next;</span></span>
<span class="line"><span>    ListNode newHead = reverseList(next);</span></span>
<span class="line"><span>    next.next = head;</span></span>
<span class="line"><span>    head.next = null;</span></span>
<span class="line"><span>    return newHead;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>头插法</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ListNode reverseList(ListNode head) {</span></span>
<span class="line"><span>    ListNode newHead = new ListNode(-1);</span></span>
<span class="line"><span>    while (head != null) {</span></span>
<span class="line"><span>        ListNode next = head.next;</span></span>
<span class="line"><span>        head.next = newHead.next;</span></span>
<span class="line"><span>        newHead.next = head;</span></span>
<span class="line"><span>        head = next;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return newHead.next;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>归并两个有序的链表</strong></p><p><a href="https://leetcode.com/problems/merge-two-sorted-lists/description/" target="_blank" rel="noreferrer">21. Merge Two Sorted Lists (Easy)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ListNode mergeTwoLists(ListNode l1, ListNode l2) {</span></span>
<span class="line"><span>    if (l1 == null) return l2;</span></span>
<span class="line"><span>    if (l2 == null) return l1;</span></span>
<span class="line"><span>    if (l1.val &lt; l2.val) {</span></span>
<span class="line"><span>        l1.next = mergeTwoLists(l1.next, l2);</span></span>
<span class="line"><span>        return l1;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        l2.next = mergeTwoLists(l1, l2.next);</span></span>
<span class="line"><span>        return l2;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>从有序链表中删除重复节点</strong></p><p><a href="https://leetcode.com/problems/remove-duplicates-from-sorted-list/description/" target="_blank" rel="noreferrer">83. Remove Duplicates from Sorted List (Easy)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Given 1-&gt;1-&gt;2, return 1-&gt;2.</span></span>
<span class="line"><span>Given 1-&gt;1-&gt;2-&gt;3-&gt;3, return 1-&gt;2-&gt;3.</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ListNode deleteDuplicates(ListNode head) {</span></span>
<span class="line"><span>    if (head == null || head.next == null) return head;</span></span>
<span class="line"><span>    head.next = deleteDuplicates(head.next);</span></span>
<span class="line"><span>    return head.val == head.next.val ? head.next : head;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>删除链表的倒数第 n 个节点</strong></p><p><a href="https://leetcode.com/problems/remove-nth-node-from-end-of-list/description/" target="_blank" rel="noreferrer">19. Remove Nth Node From End of List (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Given linked list: 1-&gt;2-&gt;3-&gt;4-&gt;5, and n = 2.</span></span>
<span class="line"><span>After removing the second node from the end, the linked list becomes 1-&gt;2-&gt;3-&gt;5.</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ListNode removeNthFromEnd(ListNode head, int n) {</span></span>
<span class="line"><span>    ListNode fast = head;</span></span>
<span class="line"><span>    while (n-- &gt; 0) {</span></span>
<span class="line"><span>        fast = fast.next;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (fast == null) return head.next;</span></span>
<span class="line"><span>    ListNode slow = head;</span></span>
<span class="line"><span>    while (fast.next != null) {</span></span>
<span class="line"><span>        fast = fast.next;</span></span>
<span class="line"><span>        slow = slow.next;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    slow.next = slow.next.next;</span></span>
<span class="line"><span>    return head;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>交换链表中的相邻结点</strong></p><p><a href="https://leetcode.com/problems/swap-nodes-in-pairs/description/" target="_blank" rel="noreferrer">24. Swap Nodes in Pairs (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Given 1-&gt;2-&gt;3-&gt;4, you should return the list as 2-&gt;1-&gt;4-&gt;3.</span></span></code></pre></div><p>题目要求: 不能修改结点的 val 值，O(1) 空间复杂度。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ListNode swapPairs(ListNode head) {</span></span>
<span class="line"><span>    ListNode node = new ListNode(-1);</span></span>
<span class="line"><span>    node.next = head;</span></span>
<span class="line"><span>    ListNode pre = node;</span></span>
<span class="line"><span>    while (pre.next != null &amp;&amp; pre.next.next != null) {</span></span>
<span class="line"><span>        ListNode l1 = pre.next, l2 = pre.next.next;</span></span>
<span class="line"><span>        ListNode next = l2.next;</span></span>
<span class="line"><span>        l1.next = next;</span></span>
<span class="line"><span>        l2.next = l1;</span></span>
<span class="line"><span>        pre.next = l2;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        pre = l1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return node.next;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>链表求和</strong></p><p><a href="https://leetcode.com/problems/add-two-numbers-ii/description/" target="_blank" rel="noreferrer">445. Add Two Numbers II (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input: (7 -&gt; 2 -&gt; 4 -&gt; 3) + (5 -&gt; 6 -&gt; 4)</span></span>
<span class="line"><span>Output: 7 -&gt; 8 -&gt; 0 -&gt; 7</span></span></code></pre></div><p>题目要求: 不能修改原始链表。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ListNode addTwoNumbers(ListNode l1, ListNode l2) {</span></span>
<span class="line"><span>    Stack&lt;Integer&gt; l1Stack = buildStack(l1);</span></span>
<span class="line"><span>    Stack&lt;Integer&gt; l2Stack = buildStack(l2);</span></span>
<span class="line"><span>    ListNode head = new ListNode(-1);</span></span>
<span class="line"><span>    int carry = 0;</span></span>
<span class="line"><span>    while (!l1Stack.isEmpty() || !l2Stack.isEmpty() || carry != 0) {</span></span>
<span class="line"><span>        int x = l1Stack.isEmpty() ? 0 : l1Stack.pop();</span></span>
<span class="line"><span>        int y = l2Stack.isEmpty() ? 0 : l2Stack.pop();</span></span>
<span class="line"><span>        int sum = x + y + carry;</span></span>
<span class="line"><span>        ListNode node = new ListNode(sum % 10);</span></span>
<span class="line"><span>        node.next = head.next;</span></span>
<span class="line"><span>        head.next = node;</span></span>
<span class="line"><span>        carry = sum / 10;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return head.next;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private Stack&lt;Integer&gt; buildStack(ListNode l) {</span></span>
<span class="line"><span>    Stack&lt;Integer&gt; stack = new Stack&lt;&gt;();</span></span>
<span class="line"><span>    while (l != null) {</span></span>
<span class="line"><span>        stack.push(l.val);</span></span>
<span class="line"><span>        l = l.next;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return stack;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>回文链表</strong></p><p><a href="https://leetcode.com/problems/palindrome-linked-list/description/" target="_blank" rel="noreferrer">234. Palindrome Linked List (Easy)在新窗口打开</a></p><p>题目要求: 以 O(1) 的空间复杂度来求解。</p><p>切成两半，把后半段反转，然后比较两半是否相等。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public boolean isPalindrome(ListNode head) {</span></span>
<span class="line"><span>    if (head == null || head.next == null) return true;</span></span>
<span class="line"><span>    ListNode slow = head, fast = head.next;</span></span>
<span class="line"><span>    while (fast != null &amp;&amp; fast.next != null) {</span></span>
<span class="line"><span>        slow = slow.next;</span></span>
<span class="line"><span>        fast = fast.next.next;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (fast != null) slow = slow.next;  // 偶数节点，让 slow 指向下一个节点</span></span>
<span class="line"><span>    cut(head, slow);                     // 切成两个链表</span></span>
<span class="line"><span>    return isEqual(head, reverse(slow));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private void cut(ListNode head, ListNode cutNode) {</span></span>
<span class="line"><span>    while (head.next != cutNode) {</span></span>
<span class="line"><span>        head = head.next;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    head.next = null;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private ListNode reverse(ListNode head) {</span></span>
<span class="line"><span>    ListNode newHead = null;</span></span>
<span class="line"><span>    while (head != null) {</span></span>
<span class="line"><span>        ListNode nextNode = head.next;</span></span>
<span class="line"><span>        head.next = newHead;</span></span>
<span class="line"><span>        newHead = head;</span></span>
<span class="line"><span>        head = nextNode;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return newHead;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private boolean isEqual(ListNode l1, ListNode l2) {</span></span>
<span class="line"><span>    while (l1 != null &amp;&amp; l2 != null) {</span></span>
<span class="line"><span>        if (l1.val != l2.val) return false;</span></span>
<span class="line"><span>        l1 = l1.next;</span></span>
<span class="line"><span>        l2 = l2.next;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return true;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>分隔链表</strong></p><p><a href="https://leetcode.com/problems/split-linked-list-in-parts/description/" target="_blank" rel="noreferrer">725. Split Linked List in Parts(Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input:</span></span>
<span class="line"><span>root = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], k = 3</span></span>
<span class="line"><span>Output: [[1, 2, 3, 4], [5, 6, 7], [8, 9, 10]]</span></span>
<span class="line"><span>Explanation:</span></span>
<span class="line"><span>The input has been split into consecutive parts with size difference at most 1, and earlier parts are a larger size than the later parts.</span></span></code></pre></div><p>题目描述: 把链表分隔成 k 部分，每部分的长度都应该尽可能相同，排在前面的长度应该大于等于后面的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ListNode[] splitListToParts(ListNode root, int k) {</span></span>
<span class="line"><span>    int N = 0;</span></span>
<span class="line"><span>    ListNode cur = root;</span></span>
<span class="line"><span>    while (cur != null) {</span></span>
<span class="line"><span>        N++;</span></span>
<span class="line"><span>        cur = cur.next;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    int mod = N % k;</span></span>
<span class="line"><span>    int size = N / k;</span></span>
<span class="line"><span>    ListNode[] ret = new ListNode[k];</span></span>
<span class="line"><span>    cur = root;</span></span>
<span class="line"><span>    for (int i = 0; cur != null &amp;&amp; i &lt; k; i++) {</span></span>
<span class="line"><span>        ret[i] = cur;</span></span>
<span class="line"><span>        int curSize = size + (mod-- &gt; 0 ? 1 : 0);</span></span>
<span class="line"><span>        for (int j = 0; j &lt; curSize - 1; j++) {</span></span>
<span class="line"><span>            cur = cur.next;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        ListNode next = cur.next;</span></span>
<span class="line"><span>        cur.next = null;</span></span>
<span class="line"><span>        cur = next;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return ret;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>链表元素按奇偶聚集</strong></p><p><a href="https://leetcode.com/problems/odd-even-linked-list/description/" target="_blank" rel="noreferrer">328. Odd Even Linked List (Medium)在新窗口打开</a></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Example:</span></span>
<span class="line"><span>Given 1-&gt;2-&gt;3-&gt;4-&gt;5-&gt;NULL,</span></span>
<span class="line"><span>return 1-&gt;3-&gt;5-&gt;2-&gt;4-&gt;NULL.</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>public ListNode oddEvenList(ListNode head) {</span></span>
<span class="line"><span>    if (head == null) {</span></span>
<span class="line"><span>        return head;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ListNode odd = head, even = head.next, evenHead = even;</span></span>
<span class="line"><span>    while (even != null &amp;&amp; even.next != null) {</span></span>
<span class="line"><span>        odd.next = odd.next.next;</span></span>
<span class="line"><span>        odd = odd.next;</span></span>
<span class="line"><span>        even.next = even.next.next;</span></span>
<span class="line"><span>        even = even.next;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    odd.next = evenHead;</span></span>
<span class="line"><span>    return head;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>本文转自 <a href="https://pdai.tech" target="_blank" rel="noreferrer">https://pdai.tech</a>，如有侵权，请联系删除。</p>`,70)]))}const b=n(t,[["render",i]]);export{g as __pageData,b as default};
