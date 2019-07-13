---
layout: knowledge
title: 管理者権限が無い場所での環境構築
order: 500
---

Linux (CentOS) を想定しているが、たぶん UNIX 系ならほとんど変わらないはず(管理者権限の無い Mac というのも珍しいだろうが)。

インストール先 (`/usr/local`に対応するもの) はここでは`$HOME/.local`としている。

`make -j`で`Resource temporarily unavailable`エラーが出たら`make -j8`のように並列数を明示する。



## 0. Autotools

* [Libtool](https://www.gnu.org/software/libtool/)
* [automake](https://www.gnu.org/software/automake/)
* [autoconf](https://www.gnu.org/software/autoconf/)

```bash
wget https://ftp.gnu.org/gnu/autoconf/autoconf-latest.tar.gz
tar xzvf autoconf-latest.tar.gz
cd autoconf-2.69
./configure --prefix=$HOME/.local
make -j && make check && make install -j
cd ..
```

```bash
wget https://ftp.gnu.org/gnu/automake/automake-1.16.tar.gz
tar xzvf automake-1.16.tar.gz
cd automake-1.16
./configure --prefix=$HOME/.local
make -j && make check && make install -j
cd ..
```

```bash
wget http://ftpmirror.gnu.org/libtool/libtool-2.4.6.tar.gz
tar xzvf libtool-2.4.6.tar.gz
cd libtool-2.4.6
 ./configure --prefix=$HOME/.local
make -j && make check && make install -j
cd ..
```



## 1. GCC

何はともあれ GCC (？)。こいつを最初に入れておくとライブラリパスとかをさっさと移動できて便利。

まずは最初から与えられているライブラリパス等の呪縛から逃れる。これをしないと各種コンパイル中に様々なエラーが出る可能性が高い。

```bash
unset LIBRARY_PATH CPATH C_INCLUDE_PATH PKG_CONFIG_PATH CPLUS_INCLUDE_PATH INCLUDE LD_LIBRARY_PATH LDFLAGS CFLAGS CPPFLAGS
```

次に[ミラーサイト](https://gcc.gnu.org/mirrors.html)から GCC @`/software/gcc/releases`および GCC のコンパイルに必要な GMP, MPFR, MPC @`/software/gcc/infrastructure`と、同じく必要な [ELF](http://www.mr511.de/software/) をダウンロードしてくる。

```bash
wget http://ftp.tsukuba.wide.ad.jp/software/gcc/releases/gcc-7.4.0/gcc-7.4.0.tar.gz
wget http://ftp.tsukuba.wide.ad.jp/software/gcc/infrastructure/gmp-6.1.0.tar.bz2
wget http://ftp.tsukuba.wide.ad.jp/software/gcc/infrastructure/mpfr-3.1.4.tar.bz2
wget http://ftp.tsukuba.wide.ad.jp/software/gcc/infrastructure/mpc-1.0.3.tar.gz
wget http://www.mr511.de/software/libelf-0.8.13.tar.gz
```

そしてこれらを依存関係順にインストールしていく(cf. [StackOverflow](https://stackoverflow.com/questions/9450394/how-to-install-gcc-piece-by-piece-with-gmp-mpfr-mpc-elf-without-shared-libra))。

```bash
bunzip2 gmp-6.1.0.tar.bz2
tar xvf gmp-6.1.0.tar
cd gmp-6.1.0
./configure --prefix=$HOME/.local --disable-shared --enable-static
make -j && make check -j && make install -j
cd ..
```

```bash
bunzip2 mpfr-3.1.4.tar.bz2
tar xvf mpfr-3.1.4.tar
cd mpfr-3.1.4
./configure --prefix=$HOME/.local --disable-shared --enable-static --with-gmp=$HOME/.local
make -j && make check -j && make install -j
cd ..
```

```bash
tar xzvf mpc-1.0.3.tar.gz
cd mpc-1.0.3
./configure --prefix=$HOME/.local --disable-shared --enable-static --with-gmp=$HOME/.local --with-mpfr=$HOME/.local
make -j && make check -j && make install -j
cd ..
```

```bash
tar xzvf libelf-0.8.13.tar.gz
cd libelf-0.8.13
./configure --prefix=$HOME/.local --disable-shared --enable-static
make -j && make check -j && make install -j
cd ..
```

```bash
tar xzvf gcc-7.4.0.tar.gz
cd gcc-7.4.0
mkdir build
cd build
../configure --prefix=$HOME/.local --enable-languages=c,c++ --disable-bootstrap --disable-multilib --with-gmp=$HOME/.local --with-mpfr=$HOME/.local --with-mpc=$HOME/.local --with-libelf=$HOME/.local
make -j && make check -k -j && make install -j
```

GCC の`make check`で出てくる`autogen: Command not found`というエラーは無視しても大丈夫(そのために`-k`オプションがついている)。これを解決しようとすると Autogen のための Guile のための libunistring と bdw-gc と、、、となり非常に厄介。

インストールが終わったら`$HOME/.bash_profile`の末尾に以下を記述して新しいパスを通す。`$PATH`だけは元のパスも残しておかないといけない。他に使いたいライブラリやヘッダがあればそれらも追加する。

```bash
# Write in $HOME/.bash_profile

export PATH="$HOME/.local/bin:$PATH"
export LD_LIBRARY_PATH="$HOME/.local/lib/:$HOME/.local/lib64"
export LD_RUN_PATH="$HOME/.local/lib/:/$HOME/.local/lib64"
export C_INCLUDE_PATH="$HOME/.local/include"
export CPLUS_INCLUDE_PATH="$HOME/.local/include"
```

```bash
source $HOME/.bash_profile
```



## 2. Python3

[OpenSSL](https://www.openssl.org/source/) と [sqlite](https://www.sqlite.org/download.html) と [libffi](https://sourceware.org/libffi/) をインストールしておく必要がある。

```bash
wget https://www.openssl.org/source/openssl-1.1.0j.tar.gz
tar xzvf openssl-1.1.0j.tar.gz
cd openssl-1.1.0j
./config --prefix=$HOME/.local
make -j8 && make install -j
cd ..
```

```bash
wget https://www.sqlite.org/2019/sqlite-autoconf-3270100.tar.gz
tar xzvf sqlite-autoconf-3270100.tar.gz
cd sqlite-autoconf-3270100
./configure --prefix=$HOME/.local
make -j && make install -j
cd ..
```

```bash
wget ftp://sourceware.org/pub/libffi/libffi-3.2.1.tar.gz
tar xzvf libffi-3.2.1.tar.gz
cd libffi-3.2.1
./configure --prefix=$HOME/.local
make -j && make check -j && make install -j
cd ..
```

Python は一般的なダウンロードリンクではなく [cpython](https://github.com/python/cpython) を使う。OpenSSL をデフォルトパス以外にインストールした場合は特に環境変数の指定に気をつけなければならない(cf. [StackOverflow](https://superuser.com/questions/1346141/how-to-link-python-to-the-manually-compiled-openssl-rather-than-the-systems-one))。

```bash
git clone -b 3.7 https://github.com/python/cpython
cd cpython
export LDFLAGS="-L$HOME/.local/lib/ -L/$HOME/.local/lib64/"
export LD_LIBRARY_PATH="$HOME/.local/lib/:$HOME/.local/lib64/"
export CPPFLAGS="-I$HOME/.local/include -I$HOME/.local/include/openssl"
./configure --prefix=$HOME/.local
make -j && make install -j
```

元からある`python`バイナリを変えずにインストールしたい場合は`make altinstall`を使う。

終わったら`python`, `pip`コマンドを Python3 に変えておく。`alias`で済ませるよりもちゃんとシンボリックリンクを作る方が良い。

```bash
cd $HOME/.local/bin
ln -sf python3 python
```



## 3. Emacs

[ImageMagick](https://imagemagick.org/script/install-source.php) が必要。liblcms2 とかも求められたら適宜入れる。

```bash
wget https://imagemagick.org/download/ImageMagick.tar.gz
tar xvzf ImageMagick.tar.gz
cd ImageMagick-7.0.8-28
./configure --prefix=$HOME/.local
make -j && make check -j && make install -j
cd ..
```

```bash
git clone -b emacs -26 https://github.com/emacs-mirror/emacs
cd emacs
./autogen.sh
./configure --prefix=$HOME/.local --with-gif=no --with-gnutls=no
make -j8 && make check -j && make install -j
```

終わったら Emacs 起動時にウィンドウを開かないようにコマンドを変えておく。

```bash
# Write in $HOME/.bash_profile

alias emacs='emacs -nw'
```

