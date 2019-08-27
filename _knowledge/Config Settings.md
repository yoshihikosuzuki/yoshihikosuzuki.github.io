---
layout: knowledge
title: 各種コンフィグ設定
order: 550
---

## Emacs

### init.el

まずは外見に関するパラメタを変更する。

```ini
(custom-set-faces
 '(default ((t (:background "black" :foreground "#55FF55"))))
 '(cursor ((((class color) (background dark)) (:background "#00AA00")) (((class color) (background light)) (:background "#999999")) (t nil))))

(setq inhibit-startup-message t)
(setq make-backup-files nil)
(setq auto-save-default nil)
(setq auto-save-list-file-name nil)
(setq auto-save-list-file-prefix nil)
(show-paren-mode 1)
(setq show-paren-style 'mixed)
(set-face-background 'show-paren-match "grey")
(set-face-foreground 'show-paren-match "black")
(setq cursor-in-non-selected-windows nil)
(global-font-lock-mode t)
(column-number-mode t)
(line-number-mode t)
(setq fill-column 80)
(setq-default auto-fill-mode t)
(setq default-tab-width 4)
(setq scroll-step 1)
(setq backup-inhibited t)
(setq-default tab-width 4 indent-tabs-mode nil)
(define-coding-system-alias 'UTF-8 'utf-8)
(global-set-key "\M-n" (lambda () (interactive) (scroll-up 1)))
(global-set-key "\M-p" (lambda () (interactive) (scroll-down 1)))
```

次に MELPA を基本的に[公式ページ](https://melpa.org/#/getting-started)に従いインストールする。具体的には、以下を`init.el`に追記し(た後開き直し？)てから`M-x package-refresh-contents`を実行する。

環境によっては`https://melpa.org/packages/`だと通信できないことがあるので`http`にしてある。

```ini
;; MELPA
(require 'package)
(add-to-list 'package-archives
             '("melpa" . "http://melpa.org/packages/") t)
(package-initialize)
```

あとは好きなパッケージを`M-x package-install RET <package_name>`もしくは`M-x list-packages RET` -> `I` -> `X`でインストールしていく。(GNU が提供するものは後者でないとインストールできない？)

### [company](https://github.com/company-mode/company-mode)

- `M-x package-install RET company`でインストール
- `init.el`に以下を追記

```ini
;; company
(global-company-mode)
(setq company-idle-delay 0)
(setq company-minimum-prefix-length 2)
(setq company-selection-wrap-around t)
```

### [company-jedi](https://github.com/syohex/emacs-company-jedi)

- `M-x package-install RET company-jedi`でインストール
- `init.el`に以下を追記

```ini
;; company-jedi
(defun my/python-mode-hook ()
  (add-to-list 'company-backends 'company-jedi))
(add-hook 'python-mode-hook 'my/python-mode-hook)
```

### flymake

- `M-x list-packages RET` -> `C-s flymake` -> `I` -> `X`でインストール
- flymake を C, C++ で使う場合は`init.el`に以下を追記

```ini
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

```ini
# Necessary for using original color scheme in e.g. emacs
set-option -g default-terminal screen-256color

# Enable mouse
set-option -g mouse on

# Do not show a prompt before killing a pane
bind-key x kill-pane

# Use 1-index for windows and panes
set -g base-index 1
setw -g pane-base-index 1

# Switch panes with arrow keys in combination with alacritty
bind -n M-Left select-pane -L
bind -n M-Right select-pane -R
bind -n M-Up select-pane -U
bind -n M-Down select-pane -D
```

## Alacritty

* `$HOME/.config/alacritty/alacritty.yml`

```yml
  - { key: D,     mods: Command,       chars: "\x02\x64" }   # detach a session
  - { key: T,     mods: Command,       chars: "\x02\x63" }   # create a window
  - { key: P,     mods: Command,       chars: "\x02\x25" }   # create a horizontal pane
  - { key: P,     mods: Command|Shift, chars: "\x02\x22" }   # create a vertical pane
  - { key: W,     mods: Command,       chars: "\x02\x78" }   # close a pane (close a window with a single pane)
  - { key: Key1,  mods: Command,       chars: "\x02\x31" }   # jump to the window 1
  - { key: Key2,  mods: Command,       chars: "\x02\x32" }
  - { key: Key3,  mods: Command,       chars: "\x02\x33" }
  - { key: Key4,  mods: Command,       chars: "\x02\x34" }
  - { key: Key5,  mods: Command,       chars: "\x02\x35" }
  - { key: Key6,  mods: Command,       chars: "\x02\x36" }
  - { key: Key7,  mods: Command,       chars: "\x02\x37" }
  - { key: Key8,  mods: Command,       chars: "\x02\x38" }
  - { key: Key9,  mods: Command,       chars: "\x02\x39" }
  - { key: Up,       mods: Command, chars: "\x02\x1b\x5b\x41"            }   # move to another pane
  - { key: Down,     mods: Command, chars: "\x02\x1b\x5b\x42"            }
  - { key: Right,    mods: Command, chars: "\x02\x1b\x5b\x43"            }
  - { key: Left,     mods: Command, chars: "\x02\x1b\x5b\x44"            }
```
