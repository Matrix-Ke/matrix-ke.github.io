# Matrix-Ke 的个人知识库

这是 [https://matrix-ke.github.io/](https://matrix-ke.github.io/) 的源代码仓库，使用 MkDocs Material 构建，并通过 GitHub Actions 发布到 GitHub Pages。

## 本地预览

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
mkdocs serve
```

## 发布

向 `main` 分支推送后，GitHub Actions 会自动构建并发布网站。

