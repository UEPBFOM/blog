---
title: Python 转 TS 自检
published: "2026-10-28T20:00:00+08:00"
updated: 2026-11-04
description: 从 Python 走到 TypeScript，我卡住过的地方整理成一份自检清单：先自己答，再点开看答案
tags: [TypeScript, Python, 学习笔记]
category: 学习
status: done
type: note
draft: false
lang: ''
---
最近跟着 Claude 用一份"Python 视角的 TS 速成对照"入门 TypeScript，顺带做配套的 10 道小练习。做着做着发现，真正卡住我的往往不是 TS，而是 Python 里那些"好像会、其实没学过"的东西：哈希、联合类型、`Callable`、解包……

所以这篇不是教程，而是一份**自检清单**。每一题先自己在脑子里答一遍，再点开看答案。答不上来的，就是该回去补的地方。

现在基础部分已经学完，10 道练习的要点按泛型、async、模块补在了后面三节。

## 零、环境：先能跑起来

<details>
<summary><b>Q1.</b> <code>npx tsx main.ts</code> 和 <code>npx tsc --noEmit</code> 分别干什么？为什么要分开跑？</summary>

- `tsx`：直接运行 `.ts` 文件，**不检查类型**，类型写错照样能跑。
- `tsc --noEmit`：只检查类型，不生成任何文件，没有输出就是全对。

相当于 Python 里 `python main.py` 和 `mypy .` 分开跑。`tsx` 为了快跳过了检查，所以写完一定要再过一遍 `tsc`。

| Python | TS |
|---|---|
| `python main.py` | `npx tsx main.ts` |
| `mypy .` | `npx tsc --noEmit` |
| `pip` + `requirements.txt` | `npm` + `package.json` |
| `venv` | `node_modules/`（天然装在项目里） |
</details>

<details>
<summary><b>Q2.</b> 我的 Node 是 22.16，能直接 <code>node main.ts</code> 吗？</summary>

不能直接跑，要加参数：`node --experimental-strip-types main.ts`。22.18 及以上才默认开启"类型剥离"。

即使能直接跑，Node 也只是把类型标注删掉，**同样不检查类型**，而且不支持 `enum`、`constructor(public name: string)` 这类需要生成代码的写法。所以做练习还是用 `tsx` 最省心。
</details>

## 一、Python 补课：我以为会、其实没学过的

<details>
<summary><b>Q3.</b> 哈希是什么？dict 为什么快？</summary>

哈希就是一个"把任意数据变成一个整数"的规则，**同样的输入永远得到同样的数**。

dict 存东西时先算 `hash(key)`，直接定位到格子；查的时候再算一次，直接去那个格子拿，不用挨个比较。所以不管存多少，查找平均都是 O(1)。

两个不同的键落进同一个格子叫"冲突"，dict 会另找空位，查找时再用 `==` 确认。**哈希负责快速定位，最终认人还是靠比较。**
</details>

<details>
<summary><b>Q4.</b> 为什么 list、dict 不能当 dict 的键，tuple 却可以？</summary>

因为哈希值是按**内容**算的，而 list、dict 的内容能改：

```python
key = [1, 2]
d = {key: "坐标"}   # 假设允许：按 [1, 2] 算出位置 A
key.append(3)       # 内容变了
d[key]              # 按 [1, 2, 3] 去位置 B 找 → 找不到
```

数据还在字典里，却再也取不出来。按内存地址算也不行，因为 Python 要求"相等的对象哈希必须相同"，两个分别创建的 `[1, 2]` 相等但地址不同。

tuple 创建后不能改，哈希永远不变，所以可以。要拿列表当键，就先转成 `tuple(my_list)`。

- 可以当键：`int`、`float`、`str`、`bool`、`None`、`tuple`、`frozenset`
- 不能当键：`list`、`dict`、`set`
- 注意 `(1, [2])` 也不行：元组里每个元素都得可哈希
- 只有**键**有这个限制，值随便放
</details>

<details>
<summary><b>Q5.</b> f-string 里能写什么？</summary>

```python
name, age = "Ada", 30
f"我叫{name}，今年{age}岁"   # 嵌变量
f"{age + 1}"                  # 表达式
f"{3.14159:.2f}"              # 格式：保留两位小数 → "3.14"
f"{name.upper()}"             # 调方法
```

TS 对应的是反引号模板字符串：`` `我叫${name}` ``。
</details>

<details>
<summary><b>Q6.</b> <code>int | str</code>、<code>str | None</code> 是什么意思？拿到这种值之后要做什么？</summary>

`|` 读作"或"，叫**联合类型**：这个值可能是其中任意一种。`str | None` 是最常见的用法，表示"可能为空"。

拿到之后要先判断它到底是哪种，再分别处理：

```python
def describe(x: int | str) -> str:
    if isinstance(x, int):
        return f"数字，翻倍是 {x * 2}"
    return f"字符串，长度是 {len(x)}"
```

这个"从不确定缩小到确定"的过程叫**收窄**。老代码里的 `Union[int, str]`、`Optional[str]` 是同一个意思，`|` 写法要 Python 3.10+。
</details>

<details>
<summary><b>Q7.</b> <code>Literal</code>、<code>Callable</code>、<code>-&gt; None</code>、<code>Any</code>、<code>object</code> 各是什么？</summary>

都来自 `typing`，只给 mypy 和编辑器看，运行时不检查。

| Python | 含义 | TS |
|---|---|---|
| `Literal["user", "assistant"]` | 只能是这几个具体值 | `"user" \| "assistant"` |
| `Callable[[int], str]` | 吃一个 int、吐 str 的函数 | `(x: number) => string` |
| `-> None` | 不返回值 | `: void` |
| `Any` | 什么都行，不检查 | `any`（能不用就不用） |
| `object` | 什么都可能，但用之前必须先判断 | `unknown` |

`Any` 和 `object` 是反着的：`Any` 什么操作都放行，`object` 什么操作都不让，非得先 `isinstance` 确认。处理 `JSON.parse` 或 LLM 输出这类来源不明的数据，用 `unknown` 更安全。
</details>

<details>
<summary><b>Q8.</b> 为什么函数也需要"类型"？<code>Callable[[int], int]</code> 怎么读？</summary>

因为在 Python 里**函数本身也是值**，可以装进变量、当参数传：

```python
f = double        # 没有括号：装的是函数本身，不是调用结果
sorted(words, key=len)   # 把 len 当参数传给 sorted
```

既然是值，就得有类型。格式是 `Callable[[参数类型, ...], 返回类型]`：

- `Callable[[int], str]`：接收 int，返回 str
- `Callable[[int, int], int]`：接收两个 int，返回 int
- `Callable[[], None]`：不收参数、不返回值
</details>

<details>
<summary><b>Q9.</b> 解包和展开有什么区别？</summary>

都是"把容器里的东西拿出来"，区别在于拿出来放哪。

**解包**：拆开，分给几个变量。

```python
a, b = (1, 2)
a, b = b, a                  # 交换
first, *rest = [1, 2, 3, 4]  # rest = [2, 3, 4]
for k, v in d.items(): ...   # 其实也是解包
```

**展开**：倒出来，放进另一个地方。

```python
[*x, *y]          # 合并列表
{**d1, **d2}      # 合并字典，后面的覆盖前面的
print(*x)         # 等于 print(1, 2)
```

TS 里解包叫**解构** `const [a, b] = pair`，展开统一用三个点：`[...x, ...y]`、`{ ...d1, ...d2 }`。
</details>

<details>
<summary><b>Q10.</b> <code>", ".join(words)</code> 和 TS 的写法有什么不同？</summary>

顺序是反的：

- Python：`分隔符.join(列表)`，且列表里必须全是字符串
- TS：`列表.join(分隔符)`，数字会自动转成字符串

反向操作 `split` 两边写法一样：`"a,b,c".split(",")`。
</details>

## 二、TS 对照：换个写法就不认识了

<details>
<summary><b>Q11.</b> Python 的 dict 在 TS 里写成什么？</summary>

看用途：

- **`Record<string, number>` 普通对象**：最常用，JSON、配置、API 返回值都是它。
- **`Map<string, number>`**：行为更像 dict，键可以是任意类型，有 `.size`，频繁增删时更合适。
- **固定几个字段**的结构（像 `{"role": ..., "content": ...}`）：用 `interface`，不用 `Record`。

| Python | `Record` 对象 |
|---|---|
| `d["k"] = 1` | `d["k"] = 1` |
| `"k" in d` | `"k" in d` |
| `len(d)` | `Object.keys(d).length` |
| `d.items()` | `Object.entries(d)` |
| `d.get("k", 0)` | `d.k ?? 0` |
| `del d["k"]` | `delete d.k` |

小坑：`JSON.stringify(map)` 得到的是 `{}`，要先 `Object.fromEntries(map)`。
</details>

<details>
<summary><b>Q12.</b> 读懂这一行：<code>const double = (x: number): number =&gt; x * 2;</code></summary>

箭头函数，对应 `double = lambda x: x * 2`。

- `(x: number)`：参数和它的类型
- 第二个 `: number`：返回值类型
- `=> x * 2`：箭头后面是返回值

和 lambda 不同，加上花括号就能写多行（这时要自己写 `return`）。
</details>

<details>
<summary><b>Q13.</b> TS 里怎么做 <code>isinstance</code>？判断 <code>null</code> 为什么不能用 <code>typeof</code>？</summary>

`typeof x === "number"` 对应 `isinstance(x, (int, float))`；比较一律用三个等号 `===`。

判断空值要写 `x === null`，因为 `typeof null` 的结果是 `"object"`，这是 JS 的历史遗留 bug。

```ts
function formatValue(v: string | number | boolean | null): string {
  if (v === null) return "-";
  if (typeof v === "boolean") return v ? "yes" : "no";
  if (typeof v === "number") return v.toFixed(2);
  return v; // 前面排除了三种，TS 已经知道这里只剩 string
}
```

最后一行能直接 `return v` 不报错，就是收窄在起作用。删掉 `number` 那一行，这里就会报错。
</details>

<details>
<summary><b>Q14.</b> TS 有类型检查吗？为什么 <code>as</code> 断言之后运行时还会崩？</summary>

**写代码时有，运行时没有。** TS 运行前被转成 JS，所有类型都被擦掉。

```ts
const data = JSON.parse('{"age": "30"}') as { age: number };
data.age.toFixed(1); // tsc 不报错，运行时崩：age 其实是字符串
```

`as` 是"告诉 TS 相信我"，不是验证。外部数据（API、文件、LLM 输出）要在运行时校验，用 zod：

```ts
const User = z.object({ age: z.number() });
const user = User.parse(JSON.parse(text)); // 不对就在这里抛错
```

Python 是同一个模式：类型注解运行时不生效，mypy 管写代码时，Pydantic 管运行时。对应到 TS 就是 tsc 和 zod。
</details>

<details>
<summary><b>Q15.</b> Pydantic 在什么时候检查、检查什么？</summary>

在**创建对象的那一刻**检查，主要四件事：

1. 必填字段在不在
2. 类型对不对：默认宽松，`"30"` 会自动转成 `30`，转不了才报错
3. 附加条件：`Field(ge=0)`、`max_length=50`
4. 嵌套结构：一层层往里查

同样的字段写成 `@dataclass` 就不会报错，错误要等用到时才暴露。FastAPI 里参数写成 Pydantic 模型，请求体不合格直接返回 422，函数根本不会执行。

zod 有个小区别：`z.number()` 不会自动把 `"30"` 转成数字，要转得写 `z.coerce.number()`。
</details>

<details>
<summary><b>Q16.</b> <code>interface</code> 里的 <code>?</code> 和 <code>readonly</code> 怎么写？</summary>

```ts
interface Message {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  name?: string;        // 可选
  readonly id: string;  // 只读
}
```

`?` 本身就表示"可以不写"，不写时是 `undefined`。我第一次写成了 `name?null: string`，这不是合法语法。真想允许显式传 `null`，要写 `name?: string | null`。
</details>

<details>
<summary><b>Q17.</b> 怎么读 <code>(msgs: Message[]): Record&lt;Message["role"], number&gt;</code>？</summary>

看冒号：名字后面的冒号是"这个名字的类型"，右括号后面的冒号是"返回值的类型"。

- `msgs: Message[]`：参数，Message 组成的数组，对应 `list[Message]`
- `Message["role"]`：取出 Message 里 role 字段的类型，就是那四种角色
- `Record<键, 值>`：键是四种角色、值是数字的对象，对应 `dict[Role, int]`

用 `Message["role"]` 而不手写四个角色，好处是以后加新角色，这里自动跟着变。
</details>

<details>
<summary><b>Q18.</b> TS 的 <code>sort</code> 没有 <code>key</code>，怎么按分数从大到小排？</summary>

传比较函数 `(a, b) => 数字`：返回负数 a 在前，正数 b 在前。所以 `a - b` 从小到大，`b - a` 从大到小。

但如果 a、b 是 `["b", 3]` 这样的一对，不能直接相减，要先取出分数：

```ts
function summarize(scores: Record<string, number>, topN = 3): [string, number][] {
  return Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, topN);
}
```

`sort` 会原地修改数组，但这里改的是 `Object.entries` 新生成的数组，原对象不受影响。`.slice(0, topN)` 对应 `[:top_n]`。
</details>

<details>
<summary><b>Q19.</b> 什么是可辨识联合？<code>default</code> 里那行 <code>never</code> 有什么用？</summary>

几种形状用 `|` 连起来，靠一个共同字段（通常叫 `type`）区分，agent 代码里最常见：

```ts
type AgentEvent =
  | { type: "text"; text: string }
  | { type: "tool_call"; name: string; args: Record<string, unknown> }
  | { type: "error"; message: string };

function render(e: AgentEvent): string {
  switch (e.type) {
    case "text": return e.text;
    case "tool_call": return `调用工具 ${e.name}`;
    case "error": return `出错：${e.message}`;
    default: {
      const check: never = e;
      return check;
    }
  }
}
```

`switch` 对应 Python 3.10 的 `match`。三种都处理完后，`default` 里的 `e` 是"不可能存在的值"，类型就是 `never`。这一行是**警报器**：以后加了新事件却忘了写 `case`，新事件掉进 `default`，赋值给 `never` 失败，tsc 直接报错。
</details>

## 三、泛型：把类型也当参数

<details>
<summary><b>Q20.</b> <code>function first&lt;T&gt;(xs: T[]): T | undefined</code> 里的 <code>&lt;T&gt;</code> 是什么？</summary>

`<T>` 是**类型参数**：先占个位，调用时再决定是什么类型。对应 Python 3.12 的 `def first[T](xs: list[T]) -> T`，老写法是 `TypeVar`。

```ts
function first<T>(xs: T[]): T | undefined {
  return xs[0];
}
first([1, 2, 3]);   // T 自动推断为 number
first(["a", "b"]);  // T 自动推断为 string
```

不用泛型的话，要么每种类型各写一遍，要么写 `any`，而 `any` 会把"传进去是数字、拿出来也是数字"这层关系丢掉。返回 `T | undefined` 是因为空数组取 `[0]` 得到的是 `undefined`。

想限制 T 的范围用 `extends`：`<T extends { id: string }>` 表示 T 至少要有 `id` 字段，对应 `TypeVar` 的 `bound`。
</details>

<details>
<summary><b>Q21.</b> 练习 5：<code>groupBy</code> 的签名怎么设计？</summary>

```ts
function groupBy<T, K extends PropertyKey>(
  items: T[],
  keyFn: (item: T) => K,
): Partial<Record<K, T[]>> {
  const groups: Partial<Record<K, T[]>> = {};
  for (const item of items) {
    const key = keyFn(item);
    (groups[key] ??= []).push(item);
  }
  return groups;
}

const g = groupBy(messages, (m) => m.role);
// g 的键是四种角色，值是 Message[]
```

- 两个类型参数：`T` 是元素，`K` 是分组用的键。
- `K extends PropertyKey`：键只能是 `string | number | symbol`，也就是能当对象键的类型，相当于 Python 里"键必须可哈希"。
- `Partial`：不是每种角色都一定出现，所以每个键都是可选的。
- `??=`：左边为空才赋值。`(groups[key] ??= []).push(item)` 等于 Python 的 `groups.setdefault(key, []).append(item)`，也就是 `defaultdict(list)` 的效果。
</details>

<details>
<summary><b>Q22.</b> 练习 6：<code>pluck(messages, "foo")</code> 为什么写代码时就能报错？</summary>

```ts
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}

pluck(messages, "role");  // 类型是 ("system" | "user" | "assistant" | "tool")[]
pluck(messages, "foo");   // ❌ "foo" 不是 Message 的键
```

- `keyof T`：T 所有键名组成的联合，`keyof Message` 就是 `"role" | "content" | "name" | "id"`。
- `K extends keyof T`：K 只能是其中之一，所以 `"foo"` 过不了。
- `T[K]`：取这个键对应的值的类型，和 Q17 的 `Message["role"]` 是同一个写法，只是键换成了变量。

把 T 想成一张 map 最好懂：`keyof T` 是它已有的那些 key，`T[K]` 是 key 对应的值的类型，`T[K][]` 就是"这些值组成的数组"。

Python 的类型注解很难表达这层关系：`[getattr(m, key) for m in items]` 里 `key` 写错，要到运行时才知道。
</details>

<details>
<summary><b>Q23.</b> 练习 7：用 <code>Map</code> 写 LRU 缓存，靠的是哪两个技巧？</summary>

```ts
class LRUCache<K, V> {
  private map = new Map<K, V>();
  constructor(private capacity: number) {}

  get(key: K): V | undefined {
    const value = this.map.get(key);
    if (value !== undefined) {
      this.map.delete(key); // 删掉再插回去，它就成了"最新"的
      this.map.set(key, value);
    }
    return value;
  }

  set(key: K, value: V): void {
    this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) {
      const oldest = this.map.keys().next(); // 第一个键就是最久没用的
      if (!oldest.done) this.map.delete(oldest.value);
    }
  }
}
```

1. `Map` 记得插入顺序，"访问一次"就是删掉再插回去，对应 `OrderedDict.move_to_end`。
2. 最旧的键是 `map.keys().next()`，对应 `popitem(last=False)`。

容量 2，依次 set a、b，get a，再 set c，被淘汰的是 b。思路和操作系统页面置换里的 LRU（最近最少使用）完全一样。

判断键在不在，别写 `if (this.map.get(key))`：值是 `0` 或 `""` 时会被当成"不存在"。要么用 `this.map.has(key)`，要么像上面这样明确比较 `!== undefined`。

顺带两个语法点：`class LRUCache<K, V>` 是泛型类，对应 `class LRUCache(Generic[K, V])`；`constructor(private capacity: number)` 是参数属性，会自动生成同名字段，也正是 Q2 里说的 Node 直接跑不了的写法。
</details>

<details>
<summary><b>Q24.</b> <code>Partial</code>、<code>Pick</code>、<code>Omit</code> 这些工具类型是干什么的？</summary>

从已有类型派生新类型，不用把字段重抄一遍：

| 工具类型 | 作用 |
|---|---|
| `Partial<T>` | 所有字段变可选 |
| `Required<T>` | 所有字段变必填 |
| `Pick<T, "a" \| "b">` | 只留下这几个字段 |
| `Omit<T, "id">` | 去掉这几个字段 |
| `ReturnType<typeof fn>` | 取函数的返回类型 |
| `Awaited<P>` | 取 Promise 里面的类型 |

```ts
type NewMessage = Omit<Message, "id">;  // 创建消息时还没有 id
type MessagePatch = Partial<Message>;   // 更新时改哪个传哪个
```

好处和 Q17 一样：`Message` 加了字段，这些派生类型自动跟着变。
</details>

## 四、async/await：等待的写法

<details>
<summary><b>Q25.</b> <code>Promise</code>、<code>async</code>、<code>await</code> 各是什么？和 Python 的协程最大的区别在哪？</summary>

拿烧水打比方：同步是站在壶边等水开再去切菜，异步是水烧着先去切菜，水开了再回来。

- **Promise**：一张取货单，代表一个"将来才拿到"的结果。
- **async**：写在函数前，这个函数就会返回 Promise。`async function f(): Promise<number>` 对应 `async def f() -> int`。
- **await**：等结果到手再往下走，等的时候程序可以先做别的。

最大的区别：**Promise 一创建就开始执行**，`await` 只是去取货；Python 的协程不 `await` 就根本不会跑。

| | Python | TS |
|---|---|---|
| 调用了但没 await | 什么都没发生，还会警告 never awaited | 已经在执行，只是没人取结果 |
| 忘了写 await | 有警告 | 不一定报错，用到这个值时类型检查通常能抓到 |
| 启动入口 | `asyncio.run(main())` | ESM 文件里直接顶层 `await` |
</details>

<details>
<summary><b>Q26.</b> 下面两种写法各要多久？</summary>

```ts
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function callTool(name: string, ms: number): Promise<string> {
  await sleep(ms);
  return `${name} done`;
}

// 写法一
const a = await callTool("search", 300);
const b = await callTool("calc", 200);

// 写法二
const [c, d] = await Promise.all([callTool("search", 300), callTool("calc", 200)]);
```

写法一约 500ms，一个做完再做下一个；写法二约 300ms，两个同时进行，总耗时取最慢的那个。`Promise.all` 对应 `asyncio.gather`，agent 同时调多个工具用的就是它。

第一行的 `sleep` 也值得读懂：`new Promise` 接收一个函数，在里面安排好"什么时候算完成"，这里是 `ms` 毫秒后调用 `resolve`。
</details>

<details>
<summary><b>Q27.</b> 练习 8：并发调三个工具，其中一个失败，怎么不影响另外两个？</summary>

`Promise.all` 只要有一个失败就整体失败。想让每个调用各自报告结果，用 `Promise.allSettled`，对应 `gather(..., return_exceptions=True)`：

```ts
async function fakeTool(name: string, ms: number, fail = false): Promise<string> {
  await sleep(ms);
  if (fail) throw new Error(`${name} 失败`);
  return `${name} 完成`;
}

async function runAll(calls: Promise<string>[]): Promise<{ ok: string[]; failed: string[] }> {
  const results = await Promise.allSettled(calls);
  const ok: string[] = [];
  const failed: string[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") ok.push(r.value);
    else failed.push(r.reason instanceof Error ? r.reason.message : String(r.reason));
  }
  return { ok, failed };
}

console.time("runAll");
await runAll([fakeTool("search", 300), fakeTool("calc", 500, true), fakeTool("time", 200)]);
console.timeEnd("runAll"); // 约 500ms：三个同时跑，取最慢的
```

- `r.status` 又是一个可辨识联合（Q19）：`"fulfilled"` 时有 `value`，`"rejected"` 时有 `reason`。
- `reason` 的类型是 `any`，因为 `throw` 可以扔出任何东西，所以先用 `instanceof Error` 收窄再取 `message`。
</details>

<details>
<summary><b>Q28.</b> 练习 9：<code>withRetry</code> 为什么收一个 <code>() =&gt; Promise&lt;T&gt;</code>，而不是直接收 <code>Promise&lt;T&gt;</code>？</summary>

因为 Promise 一创建就开始执行，而且只执行一次。传进来一个 Promise，失败了也没法"再来一次"；传一个函数，每次重试都调用它，才会重新发起请求。

```ts
async function withRetry<T>(fn: () => Promise<T>, retries: number, delayMs: number): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= retries) throw err;
      const wait = delayMs * 2 ** attempt; // 指数退避：100、200、400……
      console.log(`第 ${attempt + 1} 次失败，${wait}ms 后重试`);
      await sleep(wait);
    }
  }
}
```

`return await fn()` 里的 `await` 不能省：省掉的话，函数直接把 Promise 交出去，失败发生在 `try` 外面，`catch` 接不住。

超时用 `Promise.race`，谁先完成算谁的：

```ts
function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("timeout")), ms);
  });
  return Promise.race([p, timeout]).finally(() => clearTimeout(timer));
}
```

- `Promise<never>`：这个 Promise 永远不会正常给出值，只会失败。
- `finally` 里清掉定时器，不然请求早就成功了，进程还要挂着等定时器走完。
</details>

## 五、模块：文件之间怎么互相用

<details>
<summary><b>Q29.</b> TS 的 <code>import</code> / <code>export</code> 和 Python 的 import 有什么不同？</summary>

- **只有 `export` 的才能导入**：Python 顶层的名字默认都能 import，TS 要显式写 `export`。
- **相对路径写 `.js` 后缀**：`import { add } from "./math.js"`，哪怕源文件是 `math.ts`。这是 Node ESM 的规则，TS 会自己找到对应的 `.ts` 文件。
- **只导入类型用 `import type`**：编译后整行消失，对应 `if TYPE_CHECKING:` 下的导入。
- **没有 `if __name__ == "__main__":`**：入口文件的顶层代码直接执行。
- **具名导出和默认导出**：`export function add` 导入时加花括号；`export default` 每个文件最多一个，导入时不加花括号。自己的代码优先用具名导出。

| Python | TS |
|---|---|
| `from utils import add` | `import { add } from "./utils.js"` |
| `from utils import add as plus` | `import { add as plus } from "./utils.js"` |
| `import utils as u` | `import * as u from "./utils.js"` |
| `__init__.py` 里再导出 | `index.ts` 里 `export * from "./a.js"` |
</details>

<details>
<summary><b>Q30.</b> 练习 10：模型输出一段 JSON 让你调工具，怎么保证什么输入都不崩？</summary>

四个文件分工：`types.ts` 放类型，`tools.ts` 放工具，`agent.ts` 负责解析和调用，`main.ts` 是入口。核心在 `agent.ts`，思路就是 Q14 那句话：**外部数据先当 `unknown`，收窄之后再用。**

```ts
// types.ts
export type ToolResult =
  | { ok: true; data: string }
  | { ok: false; error: string };
```

```ts
// agent.ts
import { tools } from "./tools.js";
import type { ToolResult } from "./types.js";

// 类型守卫：返回 true 时，TS 就把 x 当成普通对象
function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

export async function runStep(raw: string): Promise<ToolResult> {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return { ok: false, error: "解析失败" };
  }

  if (!isRecord(data) || typeof data.tool !== "string") {
    return { ok: false, error: "格式不对" };
  }
  const tool = tools[data.tool];
  if (!tool) return { ok: false, error: `未知工具：${data.tool}` };

  try {
    const args = isRecord(data.args) ? data.args : {};
    return { ok: true, data: await tool.run(args) };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
```

`tools.ts` 里的 `add` 也一样，参数从模型来，先检查再用：

```ts
run: async ({ a, b }) => {
  if (typeof a !== "number" || typeof b !== "number") throw new Error("参数类型不对");
  return String(a + b);
},
```

每种坏输入都在某一步被拦下，变成一个 `{ ok: false }` 结果，而不是让程序崩掉：

| 输入 | 在哪一步拦下 | 结果 |
|---|---|---|
| `not json` | `JSON.parse` 外面的 `try/catch` | 解析失败 |
| `{"tool":"nope","args":{}}` | 查 `tools` 表 | 未知工具：nope |
| `{"tool":"add","args":{"a":"1","b":2}}` | `add` 检查参数后抛错，被外层 `catch` 接住 | 参数类型不对 |
| `{"tool":"add","args":{"a":1,"b":2}}` | 全部通过 | `3` |

`x is Record<string, unknown>` 叫**类型守卫**：自己写一个判断函数，告诉 TS"返回 true 时 x 就是这个类型"，相当于一个可以复用的 `isinstance`。练习里原本写的是一长串 `typeof parsed !== "object" || !("tool" in parsed) || ...`，`"tool" in parsed` 本身也能收窄，类型守卫只是把这串检查收成了一个函数。`ToolResult` 也是可辨识联合，这次靠 `ok` 字段区分。
</details>

## 六、我踩过的坑

**类型和基础写法（练习 1–4）**

- **大小写**：写成了 `record<string, number>`。TS 区分大小写，是 `Record`；`Object.entries` 的 `Object` 也要大写，小写 `object` 是另一个类型。后来 `clearTimeout` 也写成过 `cleartimeout`。
- **数组不能直接相减**：排序写了 `b - a`，方向对了，但 a、b 是一对，要写 `b[1] - a[1]`。
- **可选字段多加了东西**：`name?null` 不合法，`?` 就够了。
- **字段名和字段的值分不清**（练习 4）：`case "tool_call":` 里的 `"tool_call"` 是 `type` 字段的**值**，进了分支要取的是这种事件的**字段** `e.name`、`e.message`，我却又填了一遍 `tool_call`、`error`。
- **`never` 填成了 `default`**：`default` 是 switch 的关键字，`never` 才是类型。
- **以为类型会在运行时拦住错误数据**：不会，外部数据要靠 zod。

**泛型（练习 5–7）**

- **`keyFn` 的返回类型写成了 `T`**：它收一个元素 `T`，吐出的是分组的键 `K`。想通 `K extends PropertyKey` 的办法是翻译成 Python：K is hashable。
- **`T[K]` 绕了很久**：一直把"查出来的值"和"值的类型"搅在一起。最后用 C++ 的 map 想通了：T 像一张 map，`keyof T` 保证 key 是它已有的 key，`T[K]` 就是这个 key 对应的值的类型。
- **变量名加了引号**：`item[key]` 写成了 `item["k"]`。加了引号就是字面量字符串 `"k"`，不是参数 `key`。
- **用 `get` 判断存不存在**：`if (this.map.get(key))` 在值是 `0`、`""` 时会判错，要用 `has`。

**async 和模块（练习 8–10）**

- **改了名的导入还用原名**：`import { setTimeout as sleep }` 之后，这个文件里只能叫 `sleep`，和 Python 的 `import numpy as np` 一样。
- **Python 的写法带进了 TS**：抛错是 `throw`，不是 `raise`；`allSettled` 的成功状态是字符串 `"fulfilled"`，不是 `true`。
- **调用时又写了一遍类型**：签名里写 `fn: () => Promise<T>`，函数体里调用只写 `fn()`。
- **`new Promise` 的两个参数**：`(resolve, reject)`，超时要调的是 `reject`。
- **`export` 和 `import` 方向反了**：定义东西的文件写 `export`（对外开放），用它的文件写 `import`（拿进来）。
- **Python 参考代码里的 `*` 和 `**`**：`fake_tool(**c)` 把字典拆成关键字参数，`gather(*coros)` 把列表拆成多个参数，和 Q9 的展开是同一个东西，只是用在了函数调用里。

## 写在最后

回头看，前 4 题卡住我的多半是 Python 的东西。TS 的类型系统本身不难，难的是它默认你已经熟悉"类型注解""联合""函数是值"这些概念，而我在 Python 里一直绕着它们走。

后 6 题才是 TS 自己的内容：泛型、Promise、模块。卡得最久的是练习 6 的 `T[K]`，换了好几种解释都没通，最后是用 C++ 的 map 自己想通的。最该记住的一句则是"Promise 一创建就开始执行"，练习 8 的并发、练习 9 为什么要传函数，都是从这一点推出来的。

所以如果你也是从 Python 转过来的，可以先过一遍第一部分。那里答不上来的，到了 TS 里只会更看不懂。
