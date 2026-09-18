// 『イフ・オア・ダイ 〜運命の条件分岐デスゲーム〜』問題データベース
// 出題範囲：プログラミングきっそ（順次構造・分岐構造）＆ 実践①・実践②

const QUESTIONS_DATA = [
  {
    id: 1,
    category: "順次構造",
    difficulties: ["beginner", "survival"],
    title: "消費税額の計算",
    question: "商品の税抜き価格が変数 kakaku に、消費税率が変数 zeiritu に代入されています。消費税額を求めて表示するプログラムの空欄 【 ア 】 に入る式として最も適当なものを選べ。",
    code: `kakaku = 800\nzeiritu = 0.1\n表示する("消費税額", 【 ア 】, "円")`,
    options: [
      "kakaku + zeiritu",
      "kakaku - zeiritu",
      "kakaku * zeiritu",
      "kakaku / zeiritu"
    ],
    answer: 2,
    hint: "消費税額は「価格 × 税率」で計算します。掛け算の演算子は何だったかな？",
    explanation: "消費税額は「価格 × 税率」で求められます。プログラムでは掛け算にアスタリスク記号「*」を使用するため、正解は kakaku * zeiritu です。"
  },
  {
    id: 2,
    category: "順次構造",
    difficulties: ["beginner", "intermediate", "survival"],
    title: "ポイント加算と代入",
    question: "現在たまっているポイント数が変数 point に代入されています。買い物で新たに50ポイント加算された後の合計ポイントで point を更新する空欄 【 ア 】 に入る式を選べ。",
    code: `point = 200\npoint = 【 ア 】\n表示する(point)`,
    options: [
      "200",
      "point + 50",
      "point * 50",
      "+ 50"
    ],
    answer: 1,
    hint: "現在の point に 50 を足した結果を、元の変数 point に上書き（代入）します。",
    explanation: "「変数 = 変数 + 加算値」と書くことで、元の値に新しい値を加えた結果を同じ変数に上書き代入できます。"
  },
  {
    id: 3,
    category: "順次構造",
    difficulties: ["beginner", "intermediate", "survival"],
    title: "商と余り（クッキーの分配）",
    question: "40個のクッキーを7人で公平に分けたい。一人あたりがもらえる個数（商）と余る個数を求める空欄 【 ア 】 と 【 イ 】 の演算子の組み合わせを選べ。",
    code: `cookie = 40\nninzuu = 7\n表示する("一人あたり", cookie 【 ア 】 ninzuu, "個")\n表示する("余り", cookie 【 イ 】 ninzuu, "個")`,
    options: [
      "ア: % (余り) ,  イ: ÷ (整数の商)",
      "ア: ÷ (整数の商) ,  イ: % (余り)",
      "ア: / (割り算) ,  イ: * (掛け算)",
      "ア: ÷ (整数の商) ,  イ: / (割り算)"
    ],
    answer: 1,
    hint: "合言葉を思い出せ！「あまりは◯◯◯◯◯」！",
    explanation: "一人あたりの個数は整数の商なので「÷」（Pythonでは // ）、余りを求める演算子は「%」です。合言葉通り「あまりはパーセント」！"
  },
  {
    id: 4,
    category: "順次構造",
    difficulties: ["beginner", "advanced", "survival"],
    title: "べき乗と円柱の体積",
    question: "半径 hankei の円の面積（π × r²）と、高さ takasa の円柱の体積を求めるプログラムの空欄 【 ア 】 と 【 イ 】 に入る演算子の組み合わせを選べ。（円周率は ensyuuritu とする）",
    code: `ensyuuritu = 3.14\nhankei = 10\ntakasa = 5\n底面積 = ensyuuritu * hankei 【 ア 】 2\n体積 = 底面積 【 イ 】 takasa`,
    options: [
      "ア: *  ,  イ: +",
      "ア: ** ,  イ: *",
      "ア: ^  ,  イ: *",
      "ア: ** ,  イ: **"
    ],
    answer: 1,
    hint: "2乗（べき乗）を表す演算子は掛け算記号が2つ並んだものです！",
    explanation: "「半径の2乗」はべき乗なので「**」を使います。体積は底面積 × 高さなので掛け算「*」を使います。"
  },
  {
    id: 5,
    category: "順次構造",
    difficulties: ["intermediate", "advanced", "survival"],
    title: "文字列の連結と型変換",
    question: "個数 count = 3、代金 total = 300 があります。「代金は300円です」と文字列同士を「+」で連結して表示したいとき、空欄 【 ア 】 に入る記述として正しいものを選べ。",
    code: `total = 300\nprint("代金は" + 【 ア 】 + "円です")`,
    options: [
      "total",
      "int(total)",
      "str(total)",
      "float(total)"
    ],
    answer: 2,
    hint: "数値型（int）のまま文字列と「+」で結合するとエラーになります。文字列型に変換する関数は？",
    explanation: "数値型のまま文字列と連結しようとすると TypeError になります。数値を文字列型に変換する関数「str(total)」を使用します。"
  },
  {
    id: 6,
    category: "順次構造",
    difficulties: ["beginner", "survival"],
    title: "変数の更新",
    question: "次のプログラムを実行したとき、最終的に画面に表示される値として正しいものを選べ。",
    code: `x = 10\nx = x + 5\nx = x * 2\nprint(x)`,
    options: [
      "10",
      "25",
      "30",
      "15"
    ],
    answer: 2,
    hint: "上から順番に計算していこう。10 + 5 = 15、次に 15 * 2 = ？",
    explanation: "1行目で x = 10、2行目で x = 10 + 5 = 15、3行目で x = 15 * 2 = 30 と順次処理で上書き更新されます。"
  },
  {
    id: 7,
    category: "分岐構造",
    difficulties: ["beginner", "intermediate", "survival"],
    title: "等しい・等しくない判定",
    question: "点数 score が 100点「でない」ときに「Bad!」と表示したい。空欄 【 ア 】 に入る比較演算子として正しいものを選べ。",
    code: `if score 【 ア 】 100:\n  print("Bad!")`,
    options: [
      "==",
      "!=",
      "<>",
      "="
    ],
    answer: 1,
    hint: "「等しい」は ==、「等しくない（ノットイコール）」は？",
    explanation: "「等しくない」を判定する比較演算子は「!=」です。「=」は代入、「==」は等しい判定です。"
  },
  {
    id: 8,
    category: "分岐構造",
    difficulties: ["beginner", "intermediate", "survival"],
    title: "インデントの強制",
    question: "Pythonにおいて、条件分岐 if の中身として処理を実行させるために行頭に必要なものはどれか？",
    code: `x = 5\nif x == 10:\n【ここ】print("Yes!")`,
    options: [
      "セミコロン（ ; ）",
      "Tabキーや空白4文字によるインデント（字下げ）",
      "波括弧（ { } ）で囲む",
      "何も空けてはいけない"
    ],
    answer: 1,
    hint: "実践②でインデントを忘れたときにロボットが突撃してきたエラーを思い出そう！",
    explanation: "Pythonでは波括弧ではなく、Tabや半角スペースによるインデント（字下げ）によって「if のブロック」を表現します。インデントがないと IndentationError になります。"
  },
  {
    id: 9,
    category: "分岐構造",
    difficulties: ["beginner", "survival"],
    title: "真偽値（True / False）",
    question: "変数 x の値が 10 のとき、次のプログラムを実行した際の出力結果として正しいものを選べ。",
    code: `x = 10\nprint(x == 10)\nprint(x == 5)`,
    options: [
      "True\nFalse",
      "False\nTrue",
      "10\n5",
      "Yes\nNo"
    ],
    answer: 0,
    hint: "x == 10 は成り立っている（正しい）ので…？",
    explanation: "条件式が正しいときは真を表す「True」、正しくないときは偽を表す「False」が出力されます。"
  },
  {
    id: 10,
    category: "分岐構造",
    difficulties: ["intermediate", "survival"],
    title: "5,000円以上の1割引判定",
    question: "購入金額 kingaku が 5,000円「以上」の場合は1割引（0.9倍）になる。空欄 【 ア 】 と 【 イ 】 に入る組み合わせを選べ。",
    code: `if kingaku 【 ア 】 5000:\n  kingaku = kingaku * 【 イ 】\nprint("お支払い金額", kingaku, "円")`,
    options: [
      "ア: >  ,  イ: 0.1",
      "ア: >= ,  イ: 0.1",
      "ア: >= ,  イ: 0.9",
      "ア: <  ,  イ: 0.9"
    ],
    answer: 2,
    hint: "「5,000円以上」は5,000円を含みます。また1割引の支払い額は元の金額の何割かな？",
    explanation: "5,000円ちょうどを含む「以上」は「>=」です。1割引の支払い金額は元の90%（0.9倍）なので「0.9」を掛けます。"
  },
  {
    id: 11,
    category: "分岐構造",
    difficulties: ["intermediate", "survival"],
    title: "5で割り切れる西暦年",
    question: "入力された西暦年 year が「5で割り切れる年」かどうかを判定するプログラムの空欄 【 ア 】 に入る条件式を選べ。",
    code: `if 【 ア 】:\n  print("5で割り切れる年です")\nelse:\n  print("5で割り切れる年ではありません")`,
    options: [
      "year / 5 == 0",
      "year % 5 == 0",
      "year * 5 == 0",
      "year % 5 != 0"
    ],
    answer: 1,
    hint: "割り切れるということは、割り算をしたときの「余り」がいくつになること？",
    explanation: "特定の数で「割り切れる」とは、「余りが0」になることです。余りを求める演算子は「%」なので「year % 5 == 0」が正解です。"
  },
  {
    id: 12,
    category: "分岐構造",
    difficulties: ["intermediate", "survival"],
    title: "偶数・奇数の判定",
    question: "入力された整数 x が「偶数」であることを調べる条件式として最も適当なものを選べ。",
    code: `if 【 条件式 】:\n  print("偶数です。")\nelse:\n  print("奇数です。")`,
    options: [
      "x / 2 == 0",
      "x % 2 == 1",
      "x % 2 == 0",
      "x == 2"
    ],
    answer: 2,
    hint: "偶数は2で割ると余りが0、奇数は2で割ると余りが1になります。",
    explanation: "2で割った余りが0（x % 2 == 0）ならば偶数、そうでなければ（else）奇数となります。"
  },
  {
    id: 13,
    category: "分岐構造",
    difficulties: ["intermediate", "advanced", "survival"],
    title: "荷物の送料（elif多分岐）",
    question: "荷物の重さ weight に応じて送料を決める次のプログラムで、重さとして「8」が入力されたときに表示される送料はいくらか？",
    code: `weight = 8\nif weight < 2:\n  print("送料は500円です")\nelif weight < 10:\n  print("送料は800円です")\nelse:\n  print("送料は1200円です")`,
    options: [
      "送料は500円です",
      "送料は800円です",
      "送料は1200円です",
      "エラーになる"
    ],
    answer: 1,
    hint: "上から順番に判定しよう。8 < 2 は不成立。次の 8 < 10 は…？",
    explanation: "最初に「8 < 2」が判定されFalse。次に「8 < 10」が判定されTrueとなるため、「送料は800円です」が表示され、以降のelseは実行されません。"
  },
  {
    id: 14,
    category: "分岐構造",
    difficulties: ["intermediate", "advanced", "survival"],
    title: "演習点数の多分岐",
    question: "演習点数 score について、「60点未満なら追試」「100点なら満点」「それ以外（60点以上100点未満）なら合格」と表示する空欄 【 ア 】 に入る比較演算子を選べ。",
    code: `if score 【 ア 】 60:\n  print("追試です")\nelif score == 100:\n  print("満点です")\nelse:\n  print("合格です")`,
    options: [
      ">",
      "<",
      "<=",
      ">="
    ],
    answer: 1,
    hint: "「60点未満」は60点を含まない（60より小さい）です。",
    explanation: "「未満」は基準値を含まないため「<」を使います（「以下」なら「<=」）。"
  },
  {
    id: 15,
    category: "分岐構造",
    difficulties: ["advanced", "survival"],
    title: "論理演算子 and（就業時間判定）",
    question: "時刻 time が「9より大きい」かつ「17より小さい」場合に「就業時間です」と表示したい。空欄 【 ア 】 に入る論理演算子を選べ。",
    code: `if (time > 9) 【 ア 】 (time < 17):\n  print("就業時間です。")`,
    options: [
      "or",
      "and",
      "not",
      "&"
    ],
    answer: 1,
    hint: "両方の条件が同時に成り立つ（AかつB）を表す演算子は？",
    explanation: "両方の条件が同時に真である必要がある（AかつB）場合は「and」を使用します。「どちらか一方（または）」なら「or」です。"
  },
  {
    id: 16,
    category: "分岐構造",
    difficulties: ["advanced", "survival"],
    title: "論理演算子 or（おやつ時間）",
    question: "時刻 time が「10」または「15」のときにおやつにしたい。空欄 【 ア 】 に入る論理演算子を選べ。",
    code: `if (time == 10) 【 ア 】 (time == 15):\n  print("おやつの時間です。")`,
    options: [
      "and",
      "or",
      "not",
      "=="
    ],
    answer: 1,
    hint: "timeが同時に10であり15であることはあり得ません。「または」を表すのは？",
    explanation: "どちらか一方の条件が成り立てばよい（AまたはB）場合は「or」を使用します。"
  },
  {
    id: 17,
    category: "分岐構造",
    difficulties: ["advanced", "survival"],
    title: "論理演算子 not（否定判定）",
    question: "時刻 time が「18以上でない」ならば「退勤時間ではありません」と表示したい。空欄 【 ア 】 に入る演算子を選べ。",
    code: `if 【 ア 】 (time >= 18):\n  print("退勤時間ではありません。")`,
    options: [
      "not",
      "and",
      "or",
      "!"
    ],
    answer: 0,
    hint: "条件の真偽を反転させる（〜でない）演算子は？",
    explanation: "条件式の真偽を逆にする（否定）論理演算子は「not」です。time >= 18 が False のとき、全体が True になります。"
  },
  {
    id: 18,
    category: "分岐構造",
    difficulties: ["advanced", "survival"],
    title: "残金計算の3分岐",
    question: "所持金 money = 1000、代金 total_price があります。持ち金と代金が「ちょうど等しい」ときの空欄 【 ア 】 に入る条件式を選べ。",
    code: `if money > total_price:\n  print("残金があります")\nelif 【 ア 】:\n  print("残金はありません")\nelse:\n  print("お金が足りません")`,
    options: [
      "money = total_price",
      "money == total_price",
      "money != total_price",
      "money >= total_price"
    ],
    answer: 1,
    hint: "条件式で「等しい」を比較するときの演算子を思い出そう！",
    explanation: "比較演算で等しいかを調べるには「==」を使います。「=」は代入演算子なので構文エラーになります。"
  }
];

// 難易度別の称号マスターデータ
const TITLES_DATA = {
  S: ["条件分岐の神", "真偽値の支配者", "アボカド粉砕王", "完全無欠のプログラマー"],
  A: ["インデントの守護神", "百分率マスター", "エリート分岐術士", "デスゲーム生還者"],
  B: ["一人前コーダー", "柴犬裁判長のお墨付き", "条件式の見習い剣士", "ギリギリ生還ペンギン"],
  C: ["エルスに落ちた野菜", "インデント迷子", "タライ直撃ファイター", "追試確定ペンギン"]
};
