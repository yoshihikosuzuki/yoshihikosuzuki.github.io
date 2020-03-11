---
layout: post
title: 二次元平面の少し複雑な探索
redirect_to: https://yoshihiko-suzuki.netlify.com/posts/search-2d-space
---

二次元平面上の探索で、上下左右以外の移動を使う問題を探していたのだが、ちょうど良さそうな[問題](https://hoj.hamako-ths.ed.jp/onlinejudge/contest/93/problems/1)を見つけたので解く。ただし、公式解答は無い。



## 要約

* $H\times W$の二次元平面
* 各点は`S`(スタート; 1つ)、`#`(通れない)、`.`(通れる)、`1`から`N`(それぞれ1つ)からなる
* 移動はコスト1で以下の`S` -> `*`

```ini
. * * * .
* . . . *
* . S . *
* . . . *
. * * * .
```

* `1`から`N`の順に辿った時の総コストの最小値を求める
* どこかで到達不可能なら`"YOU MUST SYU-CHING!"`を出力



## コード

### 単純な BFS

次の目的地までの最小コストを BFS で計算、を繰り返すだけ。

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
#define DEBUG true
#define $(x) {if (DEBUG) {cout << #x << " = " << (x) << endl;}}

struct Point {
    LL i, j, d;
};

int main() {
    // define the moves
    vector<Point> moves;
    FOR(i, -2, 3) {
        FOR(j, -2, 3) {
            if ((i == -2 || i == 2 || j == -2 || j == 2) && (abs(i) != abs(j))) {
                moves.PB(Point{i, j, 0});
            }
        }
    }

    // load cin
    LL H, W, N;
    cin >> H >> W;
    cin >> N;
    VV(char) map(H, vector<char>(W));
    vector<Point> dests(N);   // point 1, 2, ..., N
    Point curr;   // point S
    REP(i, H) {
        REP(j, W) {
            cin >> map[i][j];
            if (map[i][j] == 'S') {
                curr = Point{i, j, 0};
            } else if (map[i][j] != '.' && map[i][j] != '#') {
                dests[map[i][j] - '0' - 1] = Point{i, j, 0};
            }
        }
    }

    LL total_d = 0;
    EACH(dest, dests) {
        // search a way from <curr> to <dest> by BFS
        queue<Point> q;
        q.push(curr);
        VV(bool) visited(H, VB(W));
        LL max_d = 0;
        bool reached = false;
        while (!q.empty()) {
            auto p = q.front(); q.pop();
            if (0 <= p.i && p.i < H && 0 <= p.j && p.j < W && map[p.i][p.j] != '#' && !visited[p.i][p.j]) {
                visited[p.i][p.j] = true;
                max_d = p.d;
                if (p.i == dest.i && p.j == dest.j) {   // reached
                    total_d += max_d;
                    reached = true;
                    break;
                }
                EACH(move, moves) {
                    q.push(Point{p.i + move.i, p.j + move.j, p.d + 1});
                }
            }
        }
        if (!reached) {   // no path to <dest>
            cout << "YOU MUST SYU-CHING!" << endl;
            return 0;
        }
        curr = dest;   // update destination
    }
    cout << total_d << endl;
    
    return 0;
}
```



### A*アルゴリズム

[A\*アルゴリズム](https://www.redblobgames.com/pathfinding/a-star/introduction.html)を使ってより効率的に解く。A\*アルゴリズムは

* **開始位置からの距離** $g$ に基づいた優先度付き Dijkstra 法 (最適保証あり) と
* **目的地までの推定距離** $h$ に基づいた優先度付き貪欲 BFS (最適保証なし; 推定距離なので) 

を組み合わせた手法で、優先度 $f=g+h$ に基づいた探索を行う。このとき、目的地までの真の距離 $\hat{h}$ に対して常に $0\leq h\leq\hat{h}$ が成り立つなら、最適解が保証される。



上下移動だけであれば $h$ を Manhattan 距離(= L1ノルム)にすれば良いのだが、一般の移動に対しては移動コストの上限をちゃんと考えないといけない。



今回の場合は、2点 $x,y$ 間の推定距離を $\lceil\frac{\parallel x-y\parallel_\infty}{2}\rceil$ (=最大値ノルムを2で割ったものを切り上げ)とすると大丈夫(なはず)。つまり最大値ノルム2ごとに距離が1ずつ増えていく。図で書くと、点`X`に対して`.`全てが距離1の点となる(`X`自身は距離0)。

```ini
. . . . .
. . . . .
. . X . .
. . . . .
. . . . .
```



マクロ等は上と同じなので省略してある。

```c++
struct Point {
    LL i, j, d;
};

using PP = pair<double, Point>;   // first is priority = [cost so far] + [est_dist to the destination]

bool operator<(const PP& x, const PP& y) {
    return x.first < y.first;
}

inline double est_dist(Point x, Point y) {   // estimated distance from point x to y
    return ceil((double)max(abs(x.i - y.i), abs(x.j - y.j)) / 2);
}

int main() {
    /* (中略; 上と同じ) */

    LL total_d = 0;
    EACH(dest, dests) {
        // search a way from <curr> to <dest> by A* algorithm
        priority_queue<PP, vector<PP>, greater<PP>> q;
        q.push(MP(0., curr));
        VVI cost(H, VI(W, LLONG_MAX));   // using unordered_map is better if search space is sparse
        cost[curr.i][curr.j] = 0;
        LL max_d = 0;
        bool reached = false;
        while (!q.empty()) {
            auto p = q.top().second; q.pop();
            max_d = p.d;
            if (p.i == dest.i && p.j == dest.j) {   // reached
                total_d += max_d;
                reached = true;
                break;
            }
            EACH(move, moves) {
                auto next_i = p.i + move.i, next_j = p.j + move.j;
                if (0 <= next_i && next_i < H && 0 <= next_j && next_j < W && map[next_i][next_j] != '#') {
                    auto new_cost = cost[p.i][p.j] + 1;
                    if (cost[next_i][next_j] > new_cost) {
                        cost[next_i][next_j] = new_cost;
                        Point next{next_i, next_j, p.d + 1};
                        q.push(MP(new_cost + est_dist(next, dest), next));
                    }
                }
            }
        }
        if (!reached) {   // no path to <dest>
            cout << "YOU MUST SYU-CHING!" << endl;
            return 0;
        }
        curr = dest;   // update destination
    }
    cout << total_d << endl;
    
    return 0;
}
```

