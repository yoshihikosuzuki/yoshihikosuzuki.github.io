---
layout: knowledge
title: 各種コンフィグ設定
order: 750
---

@ macOS Catalina + zsh, [Alacritty](https://github.com/jwilm/alacritty) + [tmux](https://github.com/tmux/tmux) + [Emacs](https://www.gnu.org/software/emacs/)

## Emacs

@ `$HOME/.emacs.d/init.el`

まずは外見などを設定する。

```emacs-lisp
;; appearance
(custom-set-faces
 '(default ((t (:background "black" :foreground "#70FF70"))))
 '(cursor ((((class color) (background dark))
            (:background "#00AA00"))
           (((class color) (background light))
            (:background "#999999"))
           (t nil))))
(menu-bar-mode -1)
(setq inhibit-startup-message t)
(setq make-backup-files nil)
(setq auto-save-default nil)
(setq cursor-in-non-selected-windows nil)
(column-number-mode t)
(line-number-mode t)
(show-paren-mode t)
(setq show-paren-delay 0)
(setq show-paren-style 'mixed)
(setq scroll-step 1)
(setq-default tab-width 4 indent-tabs-mode nil)
(prefer-coding-system 'utf-8)
```

### [MELPA](https://melpa.org/#/)

次にパッケージマネージャーの MELPA を[公式ページ](https://melpa.org/#/getting-started)に従いインストールする。具体的には、以下を`init.el`に追記し(た後開き直し？)てから`M-x package-refresh-contents`を実行する。

環境によっては`https://melpa.org/packages/`だと通信できないことがあるので`http`にしてある。

```emacs-lisp
;; MELPA
(require 'package)
(add-to-list 'package-archives '("melpa" . "http://melpa.org/packages/") t)
(package-initialize)
```

パッケージは以下の方法のどちらかでインストールする (GNU が提供するものは後者でないとインストールできない？)。

- `M-x package-install RET パッケージ名`、もしくは
- `M-x list-packages RET` -> インストールしたいパッケージの行にカーソルを移動 -> `I` -> `X`

### [company](https://github.com/company-mode/company-mode)

- テキスト補完
- `M-x package-install RET company`でインストール
- `init.el`に以下を追記

```emacs-lisp
;; company
(global-company-mode)
(setq company-idle-delay 0)
(setq company-minimum-prefix-length 2)
(setq company-selection-wrap-around t)
```

### [company-jedi](https://github.com/syohex/emacs-company-jedi)

- Python 用コード補完
- `M-x package-install RET company-jedi`でインストール
- `init.el`に以下を追記

```emacs-lisp
;; company-jedi
(defun my/python-mode-hook ()
  (add-to-list 'company-backends 'company-jedi))
(add-hook 'python-mode-hook 'my/python-mode-hook)
```

### flymake

- 構文チェッカー
- `M-x list-packages RET` -> `C-s flymake` -> `I` -> `X`でインストール
- flymake を C, C++ で使う場合は`init.el`に以下を追記

```emacs-lisp
;; flyamake
(require 'flymake)
(defun flymake-cc-init ()
  (let* ((temp-file   (flymake-init-create-temp-buffer-copy
                       'flymake-create-temp-inplace))
         (local-file  (file-relative-name
                       temp-file
                       (file-name-directory buffer-file-name))))
    (list "g++" (list "-std=c++11" "-Wall" "-Wextra" "-fsyntax-only" local-file))))
(push '("\\.cpp$" flymake-cc-init) flymake-allowed-file-name-masks)
(push '("\\.cc$" flymake-cc-init) flymake-allowed-file-name-masks)
(push '("\\.h$" flymake-cc-init) flymake-allowed-file-name-masks)
(push '("\\.hpp$" flymake-cc-init) flymake-allowed-file-name-masks)
(add-hook 'c++-mode-hook
          '(lambda ()
             (flymake-mode t)))
(defun flymake-c-init ()
  (let* ((temp-file   (flymake-init-create-temp-buffer-copy
                       'flymake-create-temp-inplace))
          (local-file (file-relative-name
                       temp-file
                       (file-name-directory buffer-file-name))))
    (list "gcc" (list "-std=c99" "-Wall" "-Wextra" "-Wno-trigraphs" "-fsyntax-only" local-file))))
(push '("\\.c$" flymake-c-init) flymake-allowed-file-name-masks)
(add-hook 'c-mode-hook
          '(lambda ()
             (flymake-mode t)))

;; change indent size
(add-hook 'c-mode-common-hook
          '(lambda ()
             (c-set-style "k&r")
             (setq c-basic-offset 4)
             (setq indent-tabs-mode 4)
             (setq tab-width 4)))
```

### flymake-python-pyflakes

- `pyflakes`をシンタックスチェッカーとして flymake を Python で使う
- あらかじめ`$ pip install pyflakes`しておく
- `M-x package-install RET flymake-python-pyflakes`でインストール
- `init.el`に以下を追記

```ini
(add-hook 'python-mode-hook 'flymake-python-pyflakes-load)
```

### [flymake-cursor](https://github.com/akash-akya/emacs-flymake-cursor)

- flymake のシンタックスエラーを Emacs の minibuffer に表示するために必要 (Emacs >= 26 だと通常の flymake-cursor ではダメ)
- Git レポジトリからインストール

```bash
cd $HOME/.emacs.d/elpa
git clone https://github.com/akash-akya/emacs-flymake-cursor
cd emacs-flymake-cursor
```

- `flymake-cursor.el`中の`(format "compile error, problem on line %s" msg)`だと minibuffer の表示が無駄に長いので、 `(format msg)`に編集しておく
- 以下を`init.el`に記述

```ini
;; Need for Emacs >= 26 to show messages in minibuffer
(add-to-list 'load-path "~/.emacs.d/elpa/emacs-flymake-cursor")
(require 'flymake-cursor)
(custom-set-variables
 '(flymake-cursor-error-display-delay 0)
 '(flymake-cursor-number-of-errors-to-display 5)
 '(help-at-pt-display-when-idle '(flymake-overlay)))
```

## tmux

* `$HOME/.tmux.conf`
* 設定が反映されない場合は一度`tmux kill-server`する

```ini
# Enable mouse
set -g mouse on

# Copy with mouse to clipboard in Mac
bind-key -T copy-mode MouseDragEnd1Pane send-keys -X copy-pipe-and-cancel "pbcopy"

# Do not show a prompt before killing a pane
bind-key x kill-pane
```

- 色を使うためにシェルの設定に以下を追加

```shell
export TERM='xterm-256color'
```

## [Alacritty](https://github.com/jwilm/alacritty)

* `$HOME/.alacritty.yml`
* Mac の option を alt キーにする

```yaml
  - { key: A,         mods: Alt,       chars: "\x1ba"                       }
  - { key: B,         mods: Alt,       chars: "\x1bb"                       }
  - { key: C,         mods: Alt,       chars: "\x1bc"                       }
  - { key: D,         mods: Alt,       chars: "\x1bd"                       }
  - { key: E,         mods: Alt,       chars: "\x1be"                       }
  - { key: F,         mods: Alt,       chars: "\x1bf"                       }
  - { key: G,         mods: Alt,       chars: "\x1bg"                       }
  - { key: H,         mods: Alt,       chars: "\x1bh"                       }
  - { key: I,         mods: Alt,       chars: "\x1bi"                       }
  - { key: J,         mods: Alt,       chars: "\x1bj"                       }
  - { key: K,         mods: Alt,       chars: "\x1bk"                       }
  - { key: L,         mods: Alt,       chars: "\x1bl"                       }
  - { key: M,         mods: Alt,       chars: "\x1bm"                       }
  - { key: N,         mods: Alt,       chars: "\x1bn"                       }
  - { key: O,         mods: Alt,       chars: "\x1bo"                       }
  - { key: P,         mods: Alt,       chars: "\x1bp"                       }
  - { key: Q,         mods: Alt,       chars: "\x1bq"                       }
  - { key: R,         mods: Alt,       chars: "\x1br"                       }
  - { key: S,         mods: Alt,       chars: "\x1bs"                       }
  - { key: T,         mods: Alt,       chars: "\x1bt"                       }
  - { key: U,         mods: Alt,       chars: "\x1bu"                       }
  - { key: V,         mods: Alt,       chars: "\x1bv"                       }
  - { key: W,         mods: Alt,       chars: "\x1bw"                       }
  - { key: X,         mods: Alt,       chars: "\x1bx"                       }
  - { key: Y,         mods: Alt,       chars: "\x1by"                       }
  - { key: Z,         mods: Alt,       chars: "\x1bz"                       }
  - { key: A,         mods: Alt|Shift, chars: "\x1bA"                       }
  - { key: B,         mods: Alt|Shift, chars: "\x1bB"                       }
  - { key: C,         mods: Alt|Shift, chars: "\x1bC"                       }
  - { key: D,         mods: Alt|Shift, chars: "\x1bD"                       }
  - { key: E,         mods: Alt|Shift, chars: "\x1bE"                       }
  - { key: F,         mods: Alt|Shift, chars: "\x1bF"                       }
  - { key: G,         mods: Alt|Shift, chars: "\x1bG"                       }
  - { key: H,         mods: Alt|Shift, chars: "\x1bH"                       }
  - { key: I,         mods: Alt|Shift, chars: "\x1bI"                       }
  - { key: J,         mods: Alt|Shift, chars: "\x1bJ"                       }
  - { key: K,         mods: Alt|Shift, chars: "\x1bK"                       }
  - { key: L,         mods: Alt|Shift, chars: "\x1bL"                       }
  - { key: M,         mods: Alt|Shift, chars: "\x1bM"                       }
  - { key: N,         mods: Alt|Shift, chars: "\x1bN"                       }
  - { key: O,         mods: Alt|Shift, chars: "\x1bO"                       }
  - { key: P,         mods: Alt|Shift, chars: "\x1bP"                       }
  - { key: Q,         mods: Alt|Shift, chars: "\x1bQ"                       }
  - { key: R,         mods: Alt|Shift, chars: "\x1bR"                       }
  - { key: S,         mods: Alt|Shift, chars: "\x1bS"                       }
  - { key: T,         mods: Alt|Shift, chars: "\x1bT"                       }
  - { key: U,         mods: Alt|Shift, chars: "\x1bU"                       }
  - { key: V,         mods: Alt|Shift, chars: "\x1bV"                       }
  - { key: W,         mods: Alt|Shift, chars: "\x1bW"                       }
  - { key: X,         mods: Alt|Shift, chars: "\x1bX"                       }
  - { key: Y,         mods: Alt|Shift, chars: "\x1bY"                       }
  - { key: Z,         mods: Alt|Shift, chars: "\x1bZ"                       }
  - { key: Key1,      mods: Alt,       chars: "\x1b1"                       }
  - { key: Key2,      mods: Alt,       chars: "\x1b2"                       }
  - { key: Key3,      mods: Alt,       chars: "\x1b3"                       }
  - { key: Key4,      mods: Alt,       chars: "\x1b4"                       }
  - { key: Key5,      mods: Alt,       chars: "\x1b5"                       }
  - { key: Key6,      mods: Alt,       chars: "\x1b6"                       }
  - { key: Key7,      mods: Alt,       chars: "\x1b7"                       }
  - { key: Key8,      mods: Alt,       chars: "\x1b8"                       }
  - { key: Key9,      mods: Alt,       chars: "\x1b9"                       }
  - { key: Key0,      mods: Alt,       chars: "\x1b0"                       }
  - { key: Space,     mods: Control,   chars: "\x00"                        } # Ctrl + Space
  - { key: Grave,     mods: Alt,       chars: "\x1b`"                       } # Alt + `
  - { key: Grave,     mods: Alt|Shift, chars: "\x1b~"                       } # Alt + ~
  - { key: Period,    mods: Alt,       chars: "\x1b."                       } # Alt + .
  - { key: Key8,      mods: Alt|Shift, chars: "\x1b*"                       } # Alt + *
  - { key: Key3,      mods: Alt|Shift, chars: "\x1b#"                       } # Alt + #
  - { key: Period,    mods: Alt|Shift, chars: "\x1b>"                       } # Alt + >
  - { key: Comma,     mods: Alt|Shift, chars: "\x1b<"                       } # Alt + <
  - { key: Minus,     mods: Alt|Shift, chars: "\x1b_"                       } # Alt + _
  - { key: Key5,      mods: Alt|Shift, chars: "\x1b%"                       } # Alt + %
  - { key: Key6,      mods: Alt|Shift, chars: "\x1b^"                       } # Alt + ^
  - { key: Backslash, mods: Alt,       chars: "\x1b\\"                      } # Alt + \
  - { key: Backslash, mods: Alt|Shift, chars: "\x1b|"                       } # Alt + |
```

* tmux 用のキーバインド

```yml
  - { key: D,     mods: Command,       chars: "\x02\x64" }   # detach a session
  - { key: T,     mods: Command,       chars: "\x02\x63" }   # create a window
  - { key: P,     mods: Command,       chars: "\x02\x25" }   # create a horizontal pane
  - { key: P,     mods: Command|Shift, chars: "\x02\x22" }   # create a vertical pane
  - { key: W,     mods: Command,       chars: "\x02\x78" }   # close a pane (close a window with a single pane)
  - { key: Up,       mods: Command, chars: "\x02\x1b\x5b\x41" }   # move to another pane
  - { key: Down,     mods: Command, chars: "\x02\x1b\x5b\x42" }
  - { key: Right,    mods: Command, chars: "\x02\x1b\x5b\x43" }
  - { key: Left,     mods: Command, chars: "\x02\x1b\x5b\x44" }
```

- 日本語に対応するためにシェルの設定に以下を追加

```shell
export LANG='ja_JP.UTF-8'
```

## Git & GitHub & GitLab

- `$HOME/.gitconfig`

```ini
[user]
    name = yoshihikosuzuki
    email = ys.neoteny@gmail.com
[color]
    ui = auto
[url "git@github.com:"]
    insteadof = https://github.com/
[url "git@gitlab.com:"]
    insteadof = https://gitlab.com/
```

- `$ git log`をデフォルトでツリー表示するためにシェルの設定に以下を追加

```shell
git() {
    if [[ $@ == "log" ]]; then
        git log --oneline --graph --decorate
    else
        command git "$@"
    fi
}
```

- SSH 接続の設定は`$HOME/.ssh/config`に記述

```ini
Host github.com
    User ユーザ名
    HostName ssh.github.com
    IdentityFile ~/.ssh/秘密鍵ファイル名
    ServerAliveInterval 60
```
