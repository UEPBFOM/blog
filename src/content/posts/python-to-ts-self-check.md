---
title: Python 转 TS 自检
published: "2026-10-28T20:00:00+08:00"
description: 从 Python 走到 TypeScript，我卡住过的地方整理成一份自检清单：先自己答，再点开看答案
tags: [TypeScript, Python, 学习笔记]
category: 学习
status: partial
draft: false
lang: ''
---
最近跟着 Claude 用一份"Python 视角的 TS 速成对照"入门 TypeScript，顺带做配套的 10 道小练习。做着做着发现，真正卡住我的往往不是 TS，而是 Python 里那些"好像会、其实没学过"的东西：哈希、联合类型、`Callable`、解包……

所以这篇不是教程，而是一份**自检清单**。每一题先自己在脑子里答一遍，再点开看答案。答不上来的，就是该回去补的地方。

目前练习做到第 4 题，后面的会边做边补。

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

## 三、我踩过的坑

- **大小写**：写成了 `record<string, number>`。TS 区分大小写，是 `Record`；`Object.entries` 的 `Object` 也要大写，小写 `object` 是另一个类型。
- **数组不能直接相减**：排序写了 `b - a`，方向对了，但 a、b 是一对，要写 `b[1] - a[1]`。
- **可选字段多加了东西**：`name?null` 不合法，`?` 就够了。
- **以为类型会在运行时拦住错误数据**：不会，外部数据要靠 zod。

## 写在最后

回头看，这份清单里差不多一半是 Python 的题。TS 的类型系统本身不难，难的是它默认你已经熟悉"类型注解""联合""函数是值"这些概念，而我在 Python 里一直绕着它们走。

所以如果你也是从 Python 转过来的，可以先过一遍第一部分。那里答不上来的，到了 TS 里只会更看不懂。
