---
layout: knowledge
title: C++ 競技プログラミングテンプレート
---

#### 型・マクロ

```c++
#include <bits/stdc++.h>
using namespace std;
using LL = long long; using PII = pair<LL, LL>; using VI = vector<LL>; using VVI = vector<VI>;
using VB = vector<bool>; using VS = vector<string>; using VP = vector<PII>;
#define VV(T)        vector<vector<T>>
#define PB           push_back
#define MP           make_pair
#define SZ(a)        LL((a).size())
#define EACH(x, c)   for (auto x : (c))
#define ALL(c)       (c).begin(), (c).end()
#define REVERSE(c)   reverse(ALL(c))
#define SORT(c)      stable_sort(ALL(c))
#define RSORT(c)     stable_sort((c).rbegin(), (c).rend())
#define FOR(i, a, b) for (LL i = (a); i < (b); ++i)
#define REP(i, n)    FOR(i, 0, n)
#define $(x)         {cout << #x << " = " << (x) << endl;}
```

#### 数値

|        操作        |                 記法                  |                         備考                         |
| :----------------: | :-----------------------------------: | :--------------------------------------------------: |
|   最大値・最小値   |     [INT\|LLONG\|DBL]_[MAX\|MIN]      |                                                      |
| double を N 桁表示 | cout << setprecision(N) << X << endl; | 小数点以下 N 桁なら cout << fixed << setprecision(N) |

* X以上の最小のNの倍数

```c++
inline LL minMult(LL x, LL n) { return n * (x / n + (x % n == 0 ? 0 : 1)); }   // 何倍か知りたいだけの場合は最初の n * を消す
```

#### 文字列`string`

|      操作      |                      記法                      |                             備考                             |
| :------------: | :--------------------------------------------: | :----------------------------------------------------------: |
|     初期化     |        string X(S);<br>string X(N, C);         | 例) `string X("abc");`<br>例) `stirng X(5, 'a');`   // "aaaaa" |
|   参照・代入   |                   X[i] = C;                    |        先頭・末尾参照は X.front() ／ X.back() でも可         |
| 置換(範囲代入) |              X.replace(i, N, S);               |    例) `string("abcde").replace(2, 2, "ff");` は "abffe"     |
|   iteration    |   REP(i, SZ(X)) { X[i] }<br>EACH(c, X) { c }   |                                                              |
|   部分文字列   |                 X.substr(i, N)                 | X[i] から N 文字を切り出す<br>例) `string("abcde").substr(2, 2)` は "cd" |
|    存在判定    | if (X.find(S) != string::npos) { /* EXIST */ } |                                                              |
| 先頭・末尾検索 |        (LL)X.find(S) ／ (LL)X.rfind(S)         |               返り値は先頭[末尾]のマッチの位置               |
|  数値から変換  |                  to_string(N)                  |                    double の桁埋めは不可                     |
|   数値に変換   |         stoll(X) ／ stoi(X) ／ stod(X)         |       X をバイナリ扱いする場合は stoll(X, nullptr, 2)        |

* 全マッチ列挙

```c++
inline void findAll(string& S, VI& P, string pattern) {
    LL pos = (LL)S.find(pattern);
    while (pos != string::npos) {
        P.PB(pos);
        pos = (LL)S.find(pattern, pos + 1);
    }
    return;
}

string S("abcdeacac");
string pattern("a");   // findAll の仮引数に直に書いてもいい
VI P;   // S における pattern の出現位置のリスト
findAll(S, P, pattern);   // P = {0, 5, 7}
```

#### 動的配列`vector`

|      操作      |                           記法                            |             計算量              |                備考                |
| :------------: | :-------------------------------------------------------: | :-----------------------------: | :--------------------------------: |
|      宣言      |                    vector\<T> X(N, E);                    |                                 |  N はサイズ、E は初期値 (省略可)   |
|   二次元配列   |                LL は VVI X(N1, VI(N2, E));                |                                 |                                    |
|  動的領域確保  |                       X.resize(N);                        |                                 |                                    |
|   参照・代入   |                         X[i] = x;                         |              O(1)               | 先頭と末尾は X.front() と X.back() |
|   末尾に追加   |                         X.PB(x);                          |              O(1)               |                                    |
|   iteration    |        REP(i, SZ(X)) { X[i] }<br>EACH(x, X) { x }         |                                 |                                    |
|  最大・最小値  |      \*max_element(ALL(X)) ／ \*min_element(ALL(X))       |                                 |                                    |
| 存在判定(線形) |      if (find(ALL(X), E) != X.end()) { /* EXIST */ }      |            O(\|X\|)             |                                    |
| 存在判定(二分) | SORT(X);<br>if (binary_search(ALL(X), E)) { /* EXIST */ } | O(\|X\|log\|X\|)<br>O(log\|X\|) |                                    |

* `vector<pair>`のソート

```c++
#define FSORT(c)     stable_sort(ALL(c), [] (auto& x, auto& y) {return x.first < y.first;});
#define FRSORT(c)    stable_sort(ALL(c), [] (auto& x, auto& y) {return x.first > y.first;});
#define SSORT(c)     stable_sort(ALL(c), [] (auto& x, auto& y) {return x.second < y.second;});
#define SRSORT(c)    stable_sort(ALL(c), [] (auto& x, auto& y) {return x.second > y.second;});

vector<pair<T1, T2>> X;
[F|S][R]SORT(X);   // second significant を先に
[F|S][R]SORT(X);   // most significant を後に
```

* ソート前のインデックス

```c++
struct Tuple {
    LL index;   // ソート前のインデックス
    LL a, b;   // ソートしたい中身
};

vector<Tuple> X(N);   // ソート対象が1種類なら pair でもよい
REP(i, N) {
    X[i] = Tuple{i + 1, A[i], B[i]};   // 1-indexed; pair なら MP(A[i], i + 1)
}
sort(ALL(X), [] (auto& x, auto& y) {return x.b > y.b;});   // least significant なものからソートしていく、pair なら F[R]SORT(X);
stable_sort(ALL(X), [] (auto& x, auto& y) {return x.a < y.a;});

REP(i, N) {
    cout << X[i].index << endl;
}
```

* 二分探索(直近の値)

```c++
SORT(X);

LL index = lower_bound(ALL(X), E) - X.begin();   // E以上の最小値とその先頭の位置
LL index = upper_bound(ALL(X), E) - X.begin();   // Eより大きい最小値とその先頭の位置
if (index == SZ(X)) {
    /* Aにそのような要素は存在しない */
} else {
	LL searched_val = X[index];
}

LL index = upper_bound(ALL(X), E) - X.begin() - 1;   // E以下の最大値とその末尾の位置
LL index = lower_bound(ALL(X), E) - X.begin() - 1;   // E未満の最大値とその末尾の位置
if (index == -1) {
    /* Aにそのような要素は存在しない */
} else {
    LL searched_val = X[index];
}
```

#### 双方向動的配列`deque`

|      操作      |                記法                 |              備考               |
| :------------: | :---------------------------------: | :-----------------------------: |
|      宣言      |         deque\<T> X(N, E);          | N はサイズ、E は初期値 (省略可) |
|   参照・代入   |              X[i] = x;              |                                 |
| 先頭・末尾参照 |        X.front() ／ X.back()        |                                 |
| 先頭・末尾追加 | X.push_front(x); ／ X.push_back(x); |                                 |
| 先頭・末尾削除 |   X.pop_front(); ／ X.pop_back();   |                                 |

#### 集合・連想配列

|                            |                 集合                 |               連想配列               |
| :------------------------: | :----------------------------------: | :----------------------------------: |
|      宣言(二分探索木)      |              set\<T> X;              |         map<T_key, T_val> X;         |
|         宣言(hash)         |         unordered_set\<T> X;         |    unordered_map<T_key, T_val> X;    |
|            参照            |                                      |                 X[k]                 |
|            追加            |             X.insert(x);             |              X[k] = v;               |
|            削除            |             X.erase(x);              |             X.erase(k);              |
| 最小値・最大値(二分探索木) |        *X.begin() ／ *X.end()        |                                      |
|          存在判定          | if (X.count(x) != 0) { /* EXIST */ } | if (X.count(k) != 0) { /* EXIST */ } |
|         iteration          |           EACH(x, X) { x }           |   EACH(x, X) { x.first, x.second }   |

* `set<PII>`はOKだが`unordered_set<PII>`はNG

#### スタック・キュー・ヒープ

|           |                     スタック                      |                       キュー                        |                            ヒープ                            |
| :-------: | :-----------------------------------------------: | :-------------------------------------------------: | :----------------------------------------------------------: |
|   宣言    |                   stack\<T> X;                    |                    queue\<T> X;                     | 最大値) priority_queue\<T> X; <br>最小値) priority_queue<T, vector\<T>, greater\<T>> X; |
|   追加    |                    X.push(x);                     |                     X.push(x);                      |                          X.push(x);                          |
| 先頭削除  |                     X.pop();                      |                      X.pop();                       |                           X.pop();                           |
| 先頭参照  |                      X.top()                      |                      X.front()                      |                           X.top()                            |
| iteration | while (!X.empty()) { auto x = X.top(); X.pop(); } | while (!X.empty()) { auto x = X.front(); X.pop(); } |      while (!X.empty()) { auto x = X.top(); X.pop(); }       |

### Code examples

#### 約数・素数

- 最大公約数 GCD・最小公倍数 LCM

```c++
inline LL lcm(LL a, LL b) {
	return a * b / __gcd(a, b);
}
```

- 素数判定

```c++
bool isPrime(LL n){
    if (n < 2) return false;
    FOR(i, 2, (LL)(sqrt(n) + 1)) {
        if (n % i == 0) return false;
    }
    return true;
}
```

- ある数以下の全素数を列挙

```c++
inline void eratosthenes(VB& primes) {
    REP(i, SZ(primes)) primes[i] = true;
    primes[0] = primes[1] = false;
    REP(i, SZ(primes) / 2 + 1) {
        if (primes[i]) {
            for (LL j = i + i; j < SZ(primes); j += i) {
                primes[j] = false;
            }
        }
    }
}

LL N = /*最大値*/;
VB primes(N + 1);
eratosthenes(primes);
REP(i, N + 1) {
    if (primes[i]) {
        /* i は素数 */
    }
}
```

- 約数列挙

```c++
set<LL> listDivisors(LL n) {   // set版
    set<LL> divs;
    FOR(i, 1, (LL)(sqrt(n) + 1)) {   // {1, n} を除く場合は2番目の引数を 2 にする
        if (n % i == 0) {
            divs.insert(i);
            divs.insert(n / i);
        }
    }
    return divs;
}

VI listDivisors(LL n) {   // vector版
    VI divs;
    FOR(i, 1, (LL)(sqrt(n) + 1)) {   // {1, n} を除く場合は2番目の引数を 2 にする
        if (n % i == 0) {
            divs.PB(i);
            divs.PB(n / i);
        }
    }
    SORT(divs);
    return divs;
}

auto divs = listDivisors(N);
EACH(div, divs) { /* div は約数 */ }
```

- 素因数分解(これらの素因数の、階乗数を制約条件とした組み合わせによって全ての約数が決まる)

```c++
map<LL, LL> factorize(LL n) {
    map<LL, LL> prime_factors;
    LL m = n;
    FOR(i, 2, (LL)(sqrt(n) + 1)) {
        if (m < i) break;   // 全て割り切った
        while (m % i == 0) {
            prime_factors[i]++;
            m /= i;
        }
    }
    if (m != 1) {   // 残りの素因数(必ず1つの素数となる)
        prime_factors[m]++;
    }
    return prime_factors;
}

map<LL, LL> pfs = factorize(N);
for (auto pf : pfs) { /* pf.first が素因数、pf.second が階乗数 */ }
```

#### 組み合わせ、モジュロ演算

- モジュロ演算 (& 二分累乗法)

```c++
const LL MOD = 1e9 + 7;
inline LL mod_add(LL a, LL b) { return (a + b) % MOD; }
inline LL mod_sub(LL a, LL b) { return (a + MOD - b) % MOD; }
inline LL mod_mul(LL a, LL b) { return ((a % MOD) * (b % MOD)) % MOD; }
LL mod_bipow(LL x, LL y) {   // x^y by bisection method
    if (y == 0) return 1;
    else if (y == 1) return x % MOD;
    else if (y % 2 == 0) {
        LL val = mod_bipow(x, (LL)(y / 2));
        return mod_mul(val, val);
    } else {
        LL val = mod_bipow(x, (LL)(y / 2));
        return mod_mul(mod_mul(val, val), x);
    }
}
LL mod_inv(LL x) { return mod_bipow(x, MOD - 2); }   // x^{-1} = x^{MOD-2} (MOD: prime number)
LL mod_div(LL a, LL b) { return mod_mul(a, mod_inv(b)); }   // a/b = a*b^{-1}
```

- $_nC_r=\frac{n!}{r!(n-r)!}=n!\times (r!)^{-1}\times ((n-r)!)^{-1}$ は、$k!$ および $(k!)^{-1}\ (k=0,\cdots,n)$ を計算しておく(N ~ $10^5$くらいまで)

```c++
class Combination {
    VI facts, inv_facts;
public:
    Combination(LL N) : facts(N + 1), inv_facts(N + 1) {
        REP(i, N + 1) facts[i] = i == 0 ? 1 : mod_mul(facts[i - 1], i);
        for (LL i = N; i >= 0; i--) inv_facts[i] = i == N ? mod_inv(facts[N]) : mod_mul(inv_facts[i + 1], i + 1);   // (i!)^{-1}=((i+1)!)^{-1}*(i+1)
    }
    LL nCr(LL n, LL r) {
        return mod_mul(facts[n], mod_mul(inv_facts[r], inv_facts[n - r]));
    }
};

Combination c(N);   // N は n の最大値
LL ncr = c.nCr(n, r);
```

#### 順列、組み合わせ列挙

* 順列列挙

```c++
VI X{1, 2, ..., N};   // これらを並び替える
do {   // この中で X は並び替えられており、普通の配列のように使うことができる
} while (next_permutation(ALL(X)));
// 抜けたら X は元の並びに直っている
```

- 重複順列列挙(N個の要素から重複を無制限に許して長さMの順列を全て生成; $O(N^M)$)

```c++
char elements[] = {'1', '2', '3'};   // これらから抽出
int N = 3;
int size = M;

void dfs(int i, string S) {
    if (i == size) {
        // Sが求める順列の1つ(を表す文字列)となる、ここで順列が満たすべき制約でフィルター
        //cout << S << endl;
    } else {
        for (int j = 0; j < N; j++) {
            dfs(i + 1, S + elements[j]);
        }
    }
}

dfs(0, "");
```

- 組み合わせ列挙(N個の要素からの全抽出方法)

```c++
REP(i, 1 << N) {   // i moves from 0...0 to 1...1 as binary (|i|=N), which indicates choice/no-choice of each element
    REP(k, N) {   // for each element index
		if (i & ((LL)1 << k)) {
    	    // element k is selected in this choice
    	}
    }
}
```

* 重複組み合わせ列挙 $_nH_r=_{n+r-1}C_{r}$

```c++
char elements[] = {'1', '2', '3'};   // これらから抽出
int N = 3;
int size = M;   // 何個選ぶか

void dfs(int i, int n, string S) {
    if (i == size) {
        // Sが求める組み合わせの1つ(を表す文字列)となる、ここで順列が満たすべき制約でフィルター
        //cout << S << endl;
    } else {
        for (int j = n; j < N; j++) {
            dfs(i + 1, n, S + elements[j]);   // ここが順列と違う
        }
    }
}

dfs(0, 0, "");
```

* 組み合わせで $r$ 回全部選ばなくても良い場合は、選ばないという選択肢を増やした $N+1$ 個の要素からの $r$ 個の組み合わせを計算する

#### アルゴリズム、データ構造

- メモ化再帰

```c++
LL memo_rec(LL i, T& C, VI& dp) {
    if (dp[i] != 初期値) return dp[i];
    LL val = ;
    EACH(x, C[i]) {
        val = max(val, memo_rec(x, C, dp)) などで再帰をばらまく;
    }
    return dp[i] = val;
}

REP(i, N) memo_rec(i, C, dp);
```

* ナップサック
  * 「$N$個のうち$A_i$個をそれぞれ$B_i$個にできる」場合は`weight`=$A_i$、`value`=$B_i-A_i$として`N += knapsack(I, N, weight, value)`で最大個数にできる

```c++
LL knapsack(LL N, LL W, VI& weight, VI& value) {   // weight と value は 1-indexed
    VVI dp(N + 1, VI(W + 1));   // dp[i][j] = i番目の要素までを使い、合計容量j以下での価値の和の最大値
    FOR(i, 1, N + 1) {
        REP(j, W + 1) {
            dp[i][j] = max(dp[i][j], dp[i - 1][j]);   // 要素iを入れない
            if (j - weight[i] >= 0) dp[i][j] = max(dp[i][j], dp[i - 1][j - weight[i]] + value[i]);   // 要素iを入れる、0-1ナップサック
            //if (j - weight[i] >= 0) dp[i][j] = max(dp[i][j], dp[i][j - weight[i]] + value[i]);   // 要素iを入れる、個数制限無しナップサック
        }
    }
    return dp[N][W];
}
```

* しゃくとり法(条件を満たす連続部分列の列挙)

```c++
VI X(N);
LL right = 0;
//LL sum = 0;   // 部分列の和を扱う場合
REP(left, N) {
    while (right < N && /* 求めたい連続部分列が条件を満たしていない */) {
        /* right を1つ進める */
        //sum += X[right];   // 部分列の和を扱う場合
        ++right;
    }
    if (/* この時点での連続部分列が条件を満たしていない */) break;   // right == N で条件を満たせないなら今後満たせることはない場合

    /* X[left:right) は条件を満たす(leftを固定した時に最短の)連続部分列なので、ここで何かする */

    /* left を1つ進める準備 */
    if (right == left) ++right;
    //else sum -= a[left];   // 部分列の和を扱う場合
}
```

* 連続部分列の要素の総和 $S[l,r]=S[1,r]-S[1,l-1]$ 

```c++
VI X;
// Xが0-indexedなら
VI S(SZ(X) + 1);
REP(i, SZ(X)) S[i + 1] = S[i] + X[i];
auto sum_of_l_to_r = S[r + 1] - S[l];
// Xが1-indexedなら
VI S(SZ(X));
FOR(i, 1, SZ(X)) S[i] = S[i - 1] + X[i];
auto sum_of_l_to_r = S[r] - S[l - 1];
```

* 二次元累積和

```c++

```

* Union-Find (同値関係の追加と検索; 無向グラフの連結成分)

```c++
class UnionFind {
public:
    VI parent;
    UnionFind(LL N) : parent(N) {
        iota(ALL(parent), 0);   // 初期化(親==自分)
    }
    LL getRoot(LL x) {   // 根に到達するまで親を辿る
        if (parent[x] == x) return x;   // 根は親==自分
        return parent[x] = getRoot(parent[x]);   // 経路圧縮(辿った要素を全て根に直結させる)
    }
    bool inSameSet(LL x, LL y) {   // 根が同じなら同じ集合に属する
        return getRoot(x) == getRoot(y);
    }
    void unite(LL x, LL y) {   // 同値関係 x~y を追加(xが属する集合とyが属する集合をマージ)
        x = getRoot(x);
        y = getRoot(y);
        if (x == y) return;   // すでに同じ集合
        parent[x] = y;
    }
};

UnionFind uf(N);   // N は要素数、1-indexの場合は N + 1 にする
EACH(p : pairs) {
    uf.unite(p.first, p.second);   // マージ
}
REP(i, N) {   // 1-indexの場合は FOR(i, 1, N + 1) にする
    /* uf.getRoot(i) が i の属する集合の根 */
}
```

#### 探索(平面、グラフ)

* 二次元平面の探索(BFS)

```c++
struct Point { LL x, y, d; }   // d はマンハッタン距離
vector<Point> moves{Point(-1, 0, 0), Point(1, 0, 0), Point(0, -1, 0), Point(0, 1, 0)};   // 第3引数はダミー

VVI X(H, VI(W));   // or VS X(H); 平面(H, W)の状態; visited と役割が被るなら無くても良い
vector<VB> visited(H, VB(W));
queue<Node> q;
q.push(Point{x, y, 0});   // 探索開始点の距離を0とする
//LL max_d = 0;   // 探索開始点からの最大マンハッタン距離を求める場合
while (!q.empty()) {
    Point p = q.front(); q.pop();
    if (0 <= p.x && p.x < H && 0 <= p.y && p.y < W && !visited[p.x][p.y]) {
        visited[p.x][p.y] = true;
        //max_d = q.d;
        EACH(move, moves) {
            q.push(Point{p.x + move.x, p.y + move.y, q.d + 1});
        }
    }
}
```

- グラフ(全て1-indexed)

```c++
/* エッジに注目しない場合は隣接リスト */
LL N;   // ノード数
VVI G(N + 1);
G[x].PB(y);   // エッジ x -> y を追加
G[y].PB(x);   // 無向グラフの場合はこれも
VB visited(N + 1);   // ノードの属性、ソートするならペアや構造体もあり

/* 隣接リストでエッジに属性を乗せたい場合 [ダイクストラなど] */
struct Edge { LL to, weight; };
vector<vector<Edge>> G(N + 1);
G[x].PB(Edge{y, w});   // エッジ x -> y を追加
G[y].PB(Edge{x, w});   // 無向グラフの場合はこれも

/* エッジの属性だけに注目したい場合は隣接行列 [ワーシャルフロイドなど] */
VVI G(N + 1, VI(N + 1));
G[x][y] = G[y][x] = w;   // 無向グラフ

/* エッジをソートしたりする場合 [クラスカルなど] */
struct Edge { LL from, to, weight; };   // 検索したい場合は map<PII, LL> とか？ (unordered_map はダメ)
vector<Edge> edges;
edges.PB(Edge{x, y, w});
edges.PB(Edge{y, x, w}); // 有向グラフなら消す、無向グラフでもエッジを同値関係として扱う場合も消す
sort(ALL(edges), [] (auto& x, auto& y) {return x.weight < y.weight;});
```

* グラフのDFS

```c++
void dfs(LL v, VVI& G, VB& visited) {   // 返り値などは適宜変える
    if (visited[v]) return;   // すでに訪問済み
    visited[v] = true;
    /* 行きがけの処理はここ */
    EACH(w, G[v]) {
        dfs(w, G, visited);
    }
    /* 帰りがけの処理はここ [トポロジカルソートなど] */
}

FOR(v, 1, N + 1) {
    dfs(v, G, visited);
}
```

- トポロジカルソート(DFS)

```c++
void dfs(LL v, VVI& G, VB& visited, VI& sorted) {   // 返り値などは適宜変える
    if (visited[v]) return;   // すでに訪問済み
    visited[v] = true;
    /* 行きがけの処理はここ */
    EACH(w, G[v]) {
        dfs(w, G, visited, sorted);
    }
    /* 帰りがけの処理はここ [トポロジカルソートなど] */
    sorted.PB(v);
}

VI sorted;   // トポロジカルソートされたノードの列
FOR(v, 1, N + 1) {
    dfs(v, G, visited, sorted);
}
REVERSE(sorted);
```

- 二部グラフの最大マッチング(DFS) [要確認]

```c++
bool dfs(LL v, VVI& G, VB& visited, VI& matched) {
    if (visited[v]) return false;
    visited[v] = true;
    EACH(w, G[v]) {   // 子ノード全てに対して
        if (matched[w] == -1 || dfs(matched[w], G, visited, matched)) {   // 増大路を探す
            matched[w] = v;
            return true;
        }
    }
    return false;
}

LL N;   // ノード数
VII G(N);   // 0-indexed
VB visited(N);
VI matched(N, -1);   // マッチ相手
LL count = 0;   // マッチングの数
REP(i, N) {
    if (dfs(i, G, visited, matched)) count++;
}
```

* グラフのBFS

```c++
void bfs(LL s, VVI& G) {   // 返り値などは適宜変える
    VB visited(SZ(G));
    queue<LL> q;
    q.push(s);   // 開始点が複数ある場合は全て追加
    while (!q.empty()) {
        LL v = q.front(); q.pop();
        if (!visited[v]) {
            visited[v] = true;
            /* ノードに対する処理はここ */
            EACH(w, G[v]) {
                q.push(w);
            }
        }
    }
}

FOR(v, 1, N + 1) {
    bfs(v, G);
}
```

- ダイクストラ法(1頂点から各頂点への最小コスト; BFS)

```c++
void dijkstra(LL s, vector<vector<Edge>>& G, VI& cost) {
    priority_queue<PII, VP, greater<PII>> q;   // PII = (cost, w)
    q.push(MP(0, s));
    cost[s] = 0;
    while (!q.empty()) {
        LL v = q.top().second; q.pop();
        EACH(x, G[v]) {
            LL w = x.first, c = x.second;
            if (cost[w] > cost[v] + c) {
                cost[w] = cost[v] + c;
                q.push(MP(cost[w], w));
            }
        }
    }
}

/* 隣接リストでエッジに属性を乗せたい場合 [ダイクストラなど] */
struct Edge { LL to, weight; };
vector<vector<Edge>> G(N + 1);
G[x].PB(Edge{y, w});   // エッジ x -> y を追加
G[y].PB(Edge{x, w});   // 無向グラフの場合はこれも

VI cost(N + 1, LLONG_MAX);   // LLONG_MAX はできれば別の最大値にしたい(全コストの和とか)
dijkstra(v, G, cost);
LL min_cost_v_to_w = cost[w];
```

* A*アルゴリズム(優先度付き BFS、常に heuristic distance $\leq$ true distance なら最適解が求まる) https://www.redblobgames.com/pathfinding/a-star/introduction.html

```c++

```

* ワーシャルフロイド法(各頂点から各頂点への最小コスト、更新内容をメモすれば最短経路も求まる)

```c++
VVI c(N, VI(N));   // c[i][j] = エッジ i->j のコスト
REP(k, N) REP(i, N) REP(j, N) if (c[i][j] > c[i][k] + c[k][j]) c[i][j] = c[i][k] + c[k][j];
```

- クラスカル法(最小全域木; 無効グラフ)

```c++
LL kruskal(LL N, vector<Edge>& edges) {   // N はノードの数(1-indexed なら N + 1 でよい)
    UnionFind uf(N);
    sort(ALL(edges), [] (auto& x, auto& y) {return x.weight < y.weight;});
    LL weight_sum = 0;
    EACH(e, edges) {
        if (!uf.inSameSet(e.source, e.target)) {
            uf.unite(e.source, e.target);
            weight_sum += e.weight;
        }
    }
    return weight_sum;
}

struct Edge { LL from, to, weight; };
vector<Edge> edges;
edges.PB(Edge{x, y, w});
LL min_weight_sum = kruskal(N + 1, edges);
```

* 区間の集合と(多数の)座標が与えられた時の区間所属判定

```c++
vector<pair<LL, pair<bool, LL>>> events;   // 座標、区間開始(true)・終了(false)フラグ、値(区間のラベルなど)
REP(i, N) {
  LL s, t, x;
  cin >> s >> t >> x;   // 区間 [s, t) と任意の値 x、ここでは t が exclusive であることに注意
  events.PB(MP(s, MP(true, x)));
  events.PB(MP(t, MP(false, x)));   // t が inclusive の場合は t + 1 とする
}
FSORT(events);   // 区間の座標だけで

VI D;   // 所属を判定したい座標たち
LL q_index = 0;
set<LL> curr_val;   // 同じvalをもつ複数の区間は重ならないとする(重なる場合はmultiset？)
EACH(x, events) {
  auto coord = x.first;
  auto start = x.second.first;
  auto val = x.second.second;
  while (q_index < SZ(D) && D[q_index] < coord) {
    q_index++;
    if (SZ(curr_val) == 0) {
      /* 座標 D[q_index] はどの区間にも属していない */
    } else {
      /* *curr_val.begin() */
    }
  }
  if (start) curr_val.insert(val);
  else curr_val.erase(val);
}
while (q_index < SZ(D)) {
  q_index++;
  /* どの区間にも属していない */
}
```


