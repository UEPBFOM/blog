// 示例交互：展开或收起文章正文。
const toggleButton = document.querySelector("#toggle-article");
const articleContent = document.querySelector("#article-content");

toggleButton.addEventListener("click", () => {
  const expanded = toggleButton.getAttribute("aria-expanded") === "true";

  toggleButton.setAttribute("aria-expanded", String(!expanded));
  articleContent.hidden = expanded;
  toggleButton.textContent = expanded ? "阅读全文 →" : "收起文章 ↑";
});
