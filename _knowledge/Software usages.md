---
layout: knowledge
title: ソフトウエアの使い方覚書
order: 550
---

## 配列アラインメント

### [Bowtie2](http://bowtie-bio.sourceforge.net/bowtie2/index.shtml)

- インデックス作成
  - `.bt2`ファイルが 6 つ生成される(`TARGET_FASTA`が大きい場合は`.bt2l`になる)

```bash
$ bowtie2-build -f TARGET_FASTA INDEX_NAME
```

- マッピング(single-end read)

```bash
$ bowtie2 -p THREAD_NUM -x INDEX_NAME -U QUERY_FASTQ -S OUT_SAM_FILE
```

- マッピング(paired-end read)

```bash
$ bowtie2 -p THREAD_NUM -x INDEX_NAME -1 QUERY_FASTQ_1 -2 QUERY_FASTQ_2 -S OUT_SAM_FILE
```

- その他オプション
  - `-N`: アラインメントのミスマッチ許容数(`0`または`1`を指定、デフォルトは`0`)
  - `-L`: seed 長(デフォルトは`20`)
  - `-i`: seed window 長
  - `--no-unal`: アラインメントされなかったものを sam ファイルに出力しない
- ユニークマッピングだけに限定したい場合は、出力 sam ファイル中の`XS`を含む行を`grep`等で除けばよい
  - これは例えば 1 つの高 MAPQ アラインメントとその他の低 MAPQ アラインメントが存在する時に不自然なので、MAPQ によるフィルターの方が自然

### [BWA](http://bio-bwa.sourceforge.net/)

- インデックス作成
  - `TARGET_FASTA`が大きい時は`-a bwtsw`にする

```bash
$ bwa index -a is TARGET_FASTA
```

- マッピング(single-end read)

```bash
$ bwa aln -t THREAD_NUM TARGET_FASTA QUERY_FASTQ > OUT_SAI_FILE
$ bwa samse TARGET_FASTA OUT_SAI_FILE QUERY_FASTQ > OUT_SAM_FILE
```

- マッピング(paired-end read)

```bash
$ bwa aln -t THREAD_NUM TARGET_FASTA QUERY_FASTQ_1 > OUT_SAI_FILE_1
$ bwa aln -t THREAD_NUM TARGET_FASTA QUERY_FASTQ_2 > OUT_SAI_FILE_2
$ bwa sampe TARGET_FASTA OUT_SAI_FILE_1 OUT_SAI_FILE_2 QUERY_FASTQ_1 QUERY_FASTQ_2 > OUT_SAM_FILE
```

### [Samtools](https://github.com/samtools/samtools)

- sam -> bam

```bash
$ samtools view -@ THREAD_NUM -bS OUT_SAM_FILE > OUT_BAM_FILE
$ samtools sort -@ THREAD_NUM OUT_BAM_FILE -o OUT_SORTED_BAM_FILE
```

## ゲノムブラウザ

### [SMRT View](http://files.pacb.com/software/smrtanalysis/2.3.0/doc/smrtview/help/Webhelp/whnjs.htm)

- [ここ](https://github.com/PacificBiosciences/DevNet/wiki/SMRT-View)からダウンロード -> `bin/`に移動して`$ ./linux_configure` (`SEYMOUR_PATH`とかは気にしなくてよい) でインストール
- 起動
  - `-X`で ssh 接続し、`$ ./smrtanalysis start`で SMRT View のサーバを起動
    - readme の`smrtanalysis/smrtanalysis`は、Tomcat Manager Application の username/password のことだが特に必要はない
    - サーバを停止させたいときは`$ ./smrtanalysis stop`
  - `$ ./smrtview -s`で stand alone mode で SMRT View を起動
    - `metadata.rdf`を直接`-m`オプションで渡して起動してもよいと思われる
- 解析の流れ
  - `metadata.rdf`を指定 -> reference の指定が正しければ`OK`
  - `Genome`タブの`sort contigs by length`を ON にする
  - `Base Mods`を ON にする
  - `Add Tracks`から`modifications.gff`を追加
  - `Options`で`Base Modifications -> Base Annotations Type`を`Raw IPD`に指定
  - `Add Tracks`から`motifs.gff`を追加
  - もしあれば`Add Tracks`から`variants.gff`を追加
    - Pilon した contig を reference とするなら通常は存在しない
  - `Details`の track name を右クリックして`Zoom to Base`を指定すれば 1 塩基単位で観察できる
    - `<-`、`->`で領域移動可能
    - ズームアウトすると表示されなくなるのでそのときはもう一度`Zoom to Base`する
  - Region、Detail panel を独立に表示させたいときは、`Windows -> Link Genome and Region Panels / Link Region and Details Panels`を変更
  - 見たい領域が分かっている場合には、`Tools -> Go To Location`もしくはツールバーの`Go To`で領域を指定できる
    - Region および Details はそれらが独立に表示できるときだけ指定できる
  - `+`キーでズームイン、`-`キーでズームアウトできる
  - `<-`と`->`キーで領域をスクロールできる
- GFF3、GTF、VCF ファイルを annotation として外部から追加できる
  - reference contig の名前と同じ名前が使われていなければならない
    - GFF3 だと最初の列で指定される
- `File -> Export Graphics`で、pdf または png 形式のグラフィックファイルを出力できる
- `File -> Export Data`で GFF3 形式のデータファイルを出力できる

## ゲノムアセンブリ

### [Quiver](https://github.com/PacificBiosciences/GenomicConsensus)

- リードは CRF でモデル化されており、さらに追加で QV profile の情報を与えることによって、より高精度のコンセンサスを可能にしている
- 十分な coverage が得られなかった領域の出力形式は、`--noEvidenceConsensusCall`オプションで指定できる
  - `nocall`: NNNN
  - `reference`: ACGT
  - `lowercasereference`[default]: acgt

## リピート検出

### [TRF](https://tandem.bu.edu/trf/trfdesc.html)

#### Command usage

```ini
Please use: trf File Match Mismatch Delta PM PI Minscore MaxPeriod [options]

Where: (all weights, penalties, and scores are positive)
  File = sequences input file
  Match  = matching weight
  Mismatch  = mismatching penalty
  Delta = indel penalty
  PM = match probability (whole number)
  PI = indel probability (whole number)
  Minscore = minimum alignment score to report
  MaxPeriod = maximum period size to report
  [options] = one or more of the following:
        -m        masked sequence file
        -f        flanking sequence
        -d        data file
        -h        suppress html output
        -r        no redundancy elimination
        -l <n>    maximum TR length expected (in millions) (eg, -l 3 or -l=3 for 3 million)
                  Human genome HG38 would need -l 6
        -ngs      more compact .dat output on multisequence files, returns 0 on success.
                  Output is printed to the screen, not a file. You may pipe input in with
                  this option using - for file name. Short 50 flanks are appended to .dat
                  output.
```

- For PacBio raw reads:
  - PM and PI should be 80 and 10, respectively
  - MaxPeriod is 1 - 2000
  - Minscore is total score of an alignment among the entire tandem repeat region
- In the falcon cluster and the local machine, `trf` alias to run TRF is available.

#### On centromeric repeat detection

> TRF 4.09 and higher are able to handle centromere regions.
>
> For Human Genome release 38 (HG38), a value of 6 (meaning 6 million) is required.

This value should be for search on the reference genome. How about PacBio raw reads? (Melters used TRF with them)

#### Command example

```bash
$ trf <fasta> <match_score> <mismatch_penalty> <indel_penalty> 80 10 <min_score> 2000
```

- (Match, Mismatch, Delta) = (1, 1, 1) would be diff-like scoring system? (In that case, MinScore would be around 500?)
  - because match rate in PacBio is ~0.75 and the length of a region detected by datander is $$\geq$$ 1 Kb, thus the total score would be $$\geq$$ 500
- `-d -h` option outputs space-delimited file instead of htmls

#### Output format of the data file

```ini
<start_pos> <end_pos> <period_size> <copy_num> <consensus_size> <percent_match> <percent_indel> <score> <percent_A> <percent_C> <percent_G> <percent_T> <entropy> <unit_seq> <interval_seq>
```

- Although Melter _et al_ adopted a criterion that selects shortest <consensus_size>, I would rather select the shortest motif **among those having the highest \<score\>**. Also, in order to extract multiple (non-overlapping) intervals, I adopted the following procedure:
  1. Filter out results whose <percent_match> is less than 65
  2. Cluster each pair of results when more than 50% of the shorter interval is overlapping with the longer interval
  3. In each cluster, select a unit sequence that has the highest <score> and the shortest <consensus_size> in the cluster

#### Columns of the table in the html

<img src="https://drive.google.com/uc?id=1KLtlpDwkKw2DHCly5xDf2hc9XPJEpuMl" width="800px">

```ini
1. Indices of the repeat relative to the start of the sequence.
2. Period size of the repeat.
3. Number of copies aligned with the consensus pattern.
4. Size of consensus pattern (may differ slightly from the period size).
5. Percent of matches between adjacent copies overall.
6. Percent of indels between adjacent copies overall.
7. Alignment score.
8. Percent composition for each of the four nucleotides.
9. Entropy measure based on percent composition.
```

#### Format of the alignment cartoon in the html

<img src="https://drive.google.com/uc?id=1RudEXy4m3suXPUo7D-u9Kypw3caYN8Qi" width="800px">

```ini
1. In each pair of lines, the actual sequence is on the top and a consensus sequence for all the copies is on the bottom. Each pair of lines is one period except for very small patterns. The 10 sequence characters before and after a repeat are shown.
2. Symbol * indicates a mismatch.
3. Symbol - indicates an insertion or deletion.
4. Statistics refers to the matches, mismatches and indels overall between adjacent copies in the sequence, not between the sequence and the consensus pattern.
5. Distances between matching characters at corresponding positions are listed as distance, number at that distance, percentage of all matches.
6. ACGTcount is percentage of each nucleotide in the repeat sequence.
7. Consensus sequence is shown by itself.
```
