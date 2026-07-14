timelesz Schedule Ver.1

公開用ファイル：
- index.html
- styles.css
- script.js
- data/events.js

NetlifyではZIPを解凍し、このフォルダ全体を「Add new project」→「Deploy manually」へアップロードします。
予定の追加・修正は data/events.js を編集します。


デザイン更新内容
- カレンダーマス：少し縦長（縦横比 1:1.18）
- メンバー絵文字：最大3段
- timelesz全体：🕰️
- 予定件数：非表示
- 予定日のライン装飾：なし


Googleスプレッドシート接続版
CSV URL:
https://docs.google.com/spreadsheets/d/e/2PACX-1vT8yHpEmpNIWvi6FIo1ntB-tG_xjze0EE297G94Hp37vIsCH3QntRiUOo39_B5Ocg/pub?gid=1610754135&single=true&output=csv

更新方法:
1. Googleスプレッドシートの「予定データ」を編集
2. サイトを再読み込み
3. 最新のCSVデータが反映

NEW表示を使う場合:
added_at 列を追加し、2026-07-13 のように追加日を入力
追加日から7日間NEWを表示


Ver.1.2
- フッターにアップデート情報を追加
- admin.html を追加
- admin.html は一般公開ページからリンクしていない運営チェック用
- データ件数、公開数、重複候補、入力確認を表示


Ver.1.4
- Samsung Internetなどの自動ダーク表示を抑えるためライト配色を固定
- 背景とパネルをベージュ系へ統一
- 今日ボタンを小さく変更
- 今日ボタンを押すと現在月へ移動し、カレンダーへスクロール
- 今日のマスを短く強調表示
