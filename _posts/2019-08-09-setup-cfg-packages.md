---
layout: post
title: パッケージ名とソースディレクトリ名が違う時の setup.[cfg|py]
---

Python で、パッケージ名を`setup.cfg`(もしくは`setup.py`)で以下のように定義していて、

```ini
[metadata]
name = PACKAGE_NAME
```

ソースディレクトリの構造が以下のようになっているとする。

```ini
PROJECT_DIR/
├── SOURCE_DIR/
│     ├── SUBMODULE_1/
│     │     ├── __init__.py
│     │     ├── ...
│     ├── SUBMODULE_2/
│     │     ├── __init__.py
│     │     ├── ...
│     ├── __init__.py
│     ├── ...
├── ...
```

つまり、`PACKAGE_NAME` と`SOURCE_DIR`の名前が異なっていて、かつ、ソースディレクトリがサブモジュールを含む階層構造を取っているとする。

このとき、サブモジュールを正しく読み込むには、`setup.cfg`で以下のように記述する必要がある。

```ini
[options]
package_dir =
  PACKAGE_NAME = SOURCE_DIR
packages =
  PACKAGE_NAME
  PACKAGE_NAME.SUBMODULE_1
  PACKAGE_NAME.SUBMODULE_2
```

つまり、全てのサブモジュールを、`PAcKAGE_NAME`をその先頭に付けて明記する必要がある。こうしないと、`import`するときに`SUBMODULE_*`は存在しないだとか、`PACKAGE_NAME.SUBMODULE_*`は存在しないだとかエラーが出てしまう。
