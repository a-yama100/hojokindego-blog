#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
ai-workhack.com 記事完全自動配信スクリプト
Python 3.13.7 / Windows PowerShell用

■ 機能:
  1. 記事フォルダ作成
  2. 画像コピー
  3. post.md作成
  4. (オプション) publish_post.js実行
  5. (オプション) git add/commit/push
  6. (オプション) ブラウザで確認

■ 使用方法:
  cd "D:\サイト管理\ai-workhack\ai-workhack-blog"
  python publish_complete.py              # 対話モード
  python publish_complete.py --auto       # 全自動実行
  python publish_complete.py --prepare    # 準備のみ（publish/git実行しない）
"""

import os
import sys
import shutil
import subprocess
import webbrowser
import time
from pathlib import Path
from datetime import datetime, timedelta

# ============================================================
# 記事設定 - ここを編集してください
# ============================================================

CONFIG = {
    # 基本情報
    "date": "2026-02-03",
    "slug": "pawnshop-appraisal-ai-side-income",
    "title": "質屋歴35年の目利き力×AIで月3〜5万円｜鑑定経験をオンラインで収益化する方法",
    "excerpt": "質屋・古物商として35年培った「真贋を見抜く目」は、AI時代に消えるどころか価値が高まります。58歳・IT初心者の元質屋番頭が、鑑定経験とAIを組み合わせて月3〜5万円を稼ぐ具体的な方法を解説。",
    "category": "AI活用ガイド",
    "access_level": "partial",
    "is_published": True,
    "cover_image": "b-00.jpg",
    "download_id": "",  # ダウンロードコンテンツがない場合は空文字
    
    # パス設定
    "base_dir": r"D:\サイト管理\ai-workhack\ai-workhack-blog",
    "image_source": r"F:\ai-workhack\Images",
    
    # コピーする画像ファイル名のリスト
    "images": ["b-00.jpg", "b-01.jpg", "b-02.jpg", "b-03.jpg"],
}

# ============================================================
# 記事本文（Markdown）
# ============================================================

ARTICLE_BODY = '''
## 今回の課題・話題

「58歳、質屋の番頭として35年。ブランド品や貴金属の真贋判定には自信があるけれど、パソコンにはほとんど触ったことがない」

![質屋番頭35年の経験を持つ村田さんのイメージ](b-01.jpg) *58歳・IT初心者の元質屋番頭が、AIを活用して副収入を得る方法を模索*

今回ご紹介するのは、こんな経歴を持つ架空の人物・**村田誠一さん**です。

村田さんが抱える悩みは、多くのおとな世代に共通するものでした。

**長年の経験で培った「本物を見抜く目」がある**——でも、その技術を**どうやって副収入に変えればいいかわからない**。ネットやAIは「若い人のもの」という先入観がある。自分の強みが「時代遅れ」になるのではという不安。

村田さんのような「目利き」の経験は、**AI時代にむしろ価値が高まります**。

AIは、過去の大量データから「よくある形」を覚えるのは得意です。しかし、「**この傷の入り方は本物特有だ**」「**この縫製の微妙な違和感は偽物のサイン**」といった、**現場で数万点を見てきた人間だけが持つ「違和感センサー」**は持っていません。

---

## 一般的な解決法

質屋や古物商の経験を活かした副業として、一般的には以下のような方法が紹介されています。

**1. フリマアプリでの転売**
メルカリやヤフオクで中古品を仕入れて販売する方法。しかし、仕入れ資金が必要で、在庫リスクもあります。

**2. 鑑定士資格を活かした出張買取**
買取業者と契約して出張鑑定を行う方法。体力的な負担が大きく、移動時間も取られます。

**3. YouTubeでの鑑定動画配信**
再生回数を稼ぐまでに時間がかかり、顔出しや編集技術も求められます。

これらの方法にもメリットはありますが、**「体力を使わず、知恵で稼ぐ」**という観点では課題が残ります。

---

## おとなが人生経験を生かして解決する方法

村田さんのような「目利き」経験者が、**体力を使わずに知恵で稼ぐ**ための方法。それは、**AIを「優秀だけど経験のない新人」として使い、自分は「監督者」として判断を下す**というスタイルです。

![AIを優秀な新人として活用するイメージ](b-02.jpg) *AIは「優秀だけど現場を知らない新人」——35年の経験を持つあなたが監督者として判断を下す*

### 具体的な収益化の方向性

**① オンライン真贋アドバイスサービス**

ココナラやストアカなどのスキルシェアサービス（自分の得意なことを売れるサイト）で、「**購入前に写真でプロの視点からアドバイスします**」というサービスを提供します。

※トラブル防止のため、「鑑定」ではなく**「アドバイス」「セカンドオピニオン」**として出品するのがポイントです。

価格帯は1件500〜2,000円、作業時間は1件15〜30分。月に20〜30件で3〜5万円の収益が見込めます。

ここまでで、「目利き経験×AI」の可能性は見えてきたと思います。では、実際にどうやってサービスを立ち上げ、最初の1件を獲得するのか？

<!-- paywall -->

ここから先は、有料会員限定のコンテンツです。以下の内容を具体的に解説します。

**この記事で解説する内容：**
AIを使った真贋チェックの「5ステップ手順書」、村田さんが実際に使っている「真贋チェックリスト」テンプレート（そのままコピーして使えます）、最初の依頼を獲得するための「プロフィール文の書き方」、「判断に迷ったとき」の対応マニュアル、トラブルを防ぐ「免責事項」入り返信テンプレート。

---

**② 「目利きの視点」を言語化したコンテンツ販売**

35年間、頭の中にだけあった「**見極めのポイント**」を、AIの力を借りて文章化します。

例えば「素人でもわかるブランドバッグの真贋ポイント10選」（※ブランド名は一例です）、「質屋が教える、金・プラチナの見分け方入門」など。

**AIの役割**：村田さんが口頭で説明した内容を、わかりやすい文章に整えてもらう

**村田さんの役割**：内容が正しいかチェックし、「ここはもっと強調すべき」と指示を出す

この「**AIは下書き係、人間は編集長**」という分担が、おとな世代に最も適したAI活用法です。

---

**③ フリマアプリ出品者向けの「商品説明文作成代行」**

メルカリなどで高額商品を売りたい人は、「**本物であることの説明**」に苦労しています。

村田さんは、写真を見て本物と判断したら、**AIに「この商品の魅力と真正性を伝える説明文を作って」と指示**。出てきた文章を、プロの目でチェック・修正して納品します。

価格帯は1件1,000〜3,000円、作業時間は1件20〜40分です。

---

### なぜ「目利き経験」はAIに代替されないのか

AIは「データにあるパターン」を学習しますが、**偽物業者もAIを使って「パターン通りの偽物」を作る時代**です。

**「パターンに当てはまるかどうか」だけでは判断できない**局面が増えています。

そんな時に価値を持つのが、「**35年間、何万点もの本物と偽物を見てきた人間の「違和感センサー」**」なのです。

---

## 収益シミュレーション（1ヶ月の想定）

村田さんが取り組んだ場合の1ヶ月間をシミュレーションしてみます。

![収益シミュレーションのイメージ](b-03.jpg) *1日1〜1.5時間の作業で月約4万円——「判断を下す時間」で稼ぐスタイル*

| 収益源 | 件数 | 単価 | 小計 |
|--------|------|------|------|
| オンライン真贋アドバイス | 15件 | 1,500円 | 22,500円 |
| 商品説明文作成代行 | 8件 | 2,000円 | 16,000円 |
| **合計** | | | **38,500円** |

**作業時間の内訳**：1日あたり約1〜1.5時間、月合計約30〜45時間。

**ポイントは、「体を動かす時間」ではなく「判断を下す時間」で稼いでいる**ということです。

村田さん自身の感想（架空）：

> 「最初は『AIなんて』と思っていたけど、使ってみたら**優秀だけど現場を知らない新人と同じ**だった。私が『ここを見ろ』と教えてやれば、ちゃんと仕事をしてくれる。**35年の経験が、こんな形で役に立つとは思わなかった**」

---

## よくある質問と回答

**Q1. パソコンが苦手でも大丈夫ですか？**

**スマートフォンだけでも始められます**。ココナラのアプリで相談を受け、LINEやメールで写真を受け取り、AIアプリに話しかけて文章を作ってもらう。この流れなら、キーボードをほとんど使いません。

**Q2. 判断を間違えてしまったらどうなりますか？**

サービス説明に「**個人の経験に基づくアドバイスであり、メーカー公式の真贋判定を保証するものではありません。最終判断はご自身でお願いします**」と明記しておくことが重要です。また、「写真では判断しきれない場合は正直にお伝えする」というスタンスが、かえって信頼につながります。

**Q3. すでに引退しているのですが、それでも始められますか？**

**むしろ引退後の方が向いています**。現役時代は会社のルールに縛られていた知識を、自分の名前で自由に発信できるからです。

**Q4. 質屋以外の経験でも応用できますか？**

**「本物を見抜く」経験があれば応用可能**です。例えば、骨董品店の経験なら陶器・絵画のアドバイス、宝石店の経験ならジュエリーの品質についての相談、古着屋の経験ならヴィンテージ衣類の年代についてのアドバイスができます。

---

## まとめ

**35年間で培った「目利き力」は、AI時代に消えるどころか、むしろ価値が高まります。**

AIは「一般的なパターン」を学ぶのは得意ですが、**現場で数万点を見てきた人間だけが持つ「違和感センサー」**は持っていません。

村田さんが実際にやってみて、特に大事だったのは次の3点です。

**AIは「優秀な新人」として使う**——下書き・整理・文章化を任せる。**自分は「監督者」として判断を下す**——最終チェックと「ここを見ろ」という指示。**「体を動かす時間」ではなく「判断を下す時間」で稼ぐ**。

村田さんの例では、**1日1〜1.5時間、月に約4万円**という、無理のないペースでの収益化が可能でした。

**「パソコンが苦手」は、もはや言い訳にならない時代**です。AIに話しかけるだけで文章が作れるようになりました。

「何をAIにやらせるか」を判断できる経験——それは、すでにあなたの中にあります。

---

※補足：AIの進化が進むと、「写真を見て判断する」レベルの簡易チェックはAI単独でも可能になるかもしれません。しかし、「触った感触」「経年変化の微妙な違い」「贋作師の"癖"を見抜く」といった、**五感と経験に基づく判断**は、人間に残り続ける領域です。AIが進化しても、**最後に「責任を持って判断する人間」の価値は上がり続けます**。
'''

# ============================================================
# ユーティリティ関数
# ============================================================

def print_header(text):
    """セクションヘッダーを表示"""
    print()
    print("=" * 60)
    print(f"  {text}")
    print("=" * 60)


def print_step(num, total, text):
    """ステップを表示"""
    print(f"\n[{num}/{total}] {text}")


def confirm(prompt):
    """ユーザーに確認を求める"""
    while True:
        response = input(f"{prompt} (y/n): ").strip().lower()
        if response in ['y', 'yes']:
            return True
        if response in ['n', 'no']:
            return False
        print("'y' または 'n' で回答してください。")


def run_command(cmd, description, cwd=None):
    """コマンドを実行"""
    print(f"     実行: {cmd}")
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            cwd=cwd,
            capture_output=True,
            text=True,
            encoding='utf-8'
        )
        if result.returncode == 0:
            print(f"     ✓ 成功")
            if result.stdout.strip():
                for line in result.stdout.strip().split('\n')[:10]:
                    print(f"       {line}")
            return True
        else:
            print(f"     ✗ 失敗 (code: {result.returncode})")
            if result.stderr.strip():
                print(f"       {result.stderr.strip()[:200]}")
            return False
    except Exception as e:
        print(f"     ✗ エラー: {e}")
        return False


def generate_frontmatter():
    """Frontmatterを生成"""
    # published_atは前日を使用（UTCとの時差対策）
    pub_date = datetime.strptime(CONFIG["date"], "%Y-%m-%d") - timedelta(days=1)
    published_at = pub_date.strftime("%Y-%m-%dT00:00:00")
    
    return f'''---
title: "{CONFIG["title"]}"
slug: {CONFIG["slug"]}
excerpt: {CONFIG["excerpt"]}
category: {CONFIG["category"]}
access_level: {CONFIG["access_level"]}
is_published: {"true" if CONFIG["is_published"] else "false"}
published_at: {published_at}
cover_image: {CONFIG["cover_image"]}
download_id: {CONFIG["download_id"]}
---
'''


# ============================================================
# メイン処理
# ============================================================

def main():
    # コマンドライン引数を解析
    auto_mode = "--auto" in sys.argv
    prepare_only = "--prepare" in sys.argv
    
    print_header("ai-workhack.com 記事配信スクリプト")
    
    # 設定表示
    folder_name = f"{CONFIG['date']}-{CONFIG['slug']}"
    base_dir = Path(CONFIG["base_dir"])
    post_dir = base_dir / "_posts" / folder_name
    image_source = Path(CONFIG["image_source"])
    
    print(f"""
【記事情報】
  タイトル: {CONFIG['title']}
  スラッグ: {CONFIG['slug']}
  日付: {CONFIG['date']}
  カテゴリ: {CONFIG['category']}
  アクセスレベル: {CONFIG['access_level']}

【パス】
  作業ディレクトリ: {base_dir}
  記事フォルダ: {post_dir}
  画像ソース: {image_source}

【モード】
  自動実行: {'はい' if auto_mode else 'いいえ'}
  準備のみ: {'はい' if prepare_only else 'いいえ'}
""")

    if not auto_mode and not confirm("この設定で続行しますか？"):
        print("キャンセルしました。")
        return

    # ステップ数を計算
    total_steps = 4 if prepare_only else 7
    step = 0

    # Step 1: 作業ディレクトリに移動
    step += 1
    print_step(step, total_steps, "作業ディレクトリに移動")
    os.chdir(base_dir)
    print(f"     → {os.getcwd()}")

    # Step 2: 記事フォルダを作成
    step += 1
    print_step(step, total_steps, "記事フォルダを作成")
    post_dir.mkdir(parents=True, exist_ok=True)
    print(f"     → {post_dir}")

    # Step 3: 画像ファイルをコピー
    step += 1
    print_step(step, total_steps, "画像ファイルをコピー")
    copied = 0
    for img in CONFIG["images"]:
        src = image_source / img
        dst = post_dir / img
        if src.exists():
            shutil.copy2(src, dst)
            print(f"     ✓ {img}")
            copied += 1
        else:
            print(f"     ✗ {img} が見つかりません")
    
    if copied == 0:
        print("     警告: 画像がコピーされませんでした")

    # Step 4: post.mdを作成
    step += 1
    print_step(step, total_steps, "post.mdを作成")
    post_content = generate_frontmatter() + ARTICLE_BODY
    post_path = post_dir / "post.md"
    with open(post_path, 'w', encoding='utf-8') as f:
        f.write(post_content)
    print(f"     → {post_path}")

    if prepare_only:
        print_header("準備完了")
        print(f"""
以下のコマンドを手動で実行してください：

# 記事を公開
node publish_post.js "{folder_name}"

# Gitでデプロイ
git add -A
git commit -m "Add: {CONFIG['title']}"
git push

# 確認
Start-Process "https://ai-workhack.com/blog/{CONFIG['slug']}"
""")
        return

    # Step 5: publish_post.js を実行
    step += 1
    print_step(step, total_steps, "publish_post.js を実行（R2アップロード + Supabase保存）")
    
    if auto_mode or confirm("publish_post.js を実行しますか？"):
        success = run_command(
            f'node publish_post.js "{folder_name}"',
            "記事公開",
            cwd=base_dir
        )
        if not success:
            print("     エラーが発生しました。手動で確認してください。")
            if not auto_mode and not confirm("続行しますか？"):
                return

    # Step 6: Git操作
    step += 1
    print_step(step, total_steps, "Git操作（add, commit, push）")
    
    if auto_mode or confirm("Gitにプッシュしますか？"):
        run_command("git add -A", "git add", cwd=base_dir)
        run_command(
            f'git commit -m "Add: {CONFIG["title"]}"',
            "git commit",
            cwd=base_dir
        )
        run_command("git push", "git push", cwd=base_dir)

    # Step 7: ブラウザで確認
    step += 1
    print_step(step, total_steps, "動作確認")
    url = f"https://ai-workhack.com/blog/{CONFIG['slug']}"
    
    print(f"     Vercelデプロイ完了まで1-2分お待ちください...")
    
    if auto_mode:
        print(f"     5秒後にブラウザを開きます...")
        time.sleep(5)
        webbrowser.open(url)
    elif confirm("ブラウザで確認しますか？"):
        webbrowser.open(url)
    
    print(f"     URL: {url}")

    # 完了
    print_header("配信完了")
    print(f"""
【確認ポイント】
  □ 記事が表示される
  □ アイキャッチ画像が表示される
  □ 本文中の画像が正しく表示される
  □ Paywallが正しい位置で機能する

【問題がある場合】
  Vercelダッシュボード: https://vercel.com/yama100s-projects/ai-workhack
  Supabase確認コマンド:
    $env:SUPABASE_URL = (Get-Content ".env.local" | Select-String "NEXT_PUBLIC_SUPABASE_URL=").ToString().Split("=",2)[1]
    $env:SUPABASE_KEY = (Get-Content ".env.local" | Select-String "SUPABASE_SERVICE_ROLE_KEY=").ToString().Split("=",2)[1]
    Invoke-RestMethod -Uri "$env:SUPABASE_URL/rest/v1/blog_posts?slug=eq.{CONFIG['slug']}" -Headers @{{ "apikey" = $env:SUPABASE_KEY; "Authorization" = "Bearer $env:SUPABASE_KEY" }} | ConvertTo-Json -Depth 5
""")


if __name__ == "__main__":
    main()
