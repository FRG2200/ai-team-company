export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl font-bold mb-8">プライバシーポリシー</h1>
          <p className="text-gray-600 mb-8">
            Bronxville AI Workforce（以下「当サービス」）は、ユーザーの個人情報の取り扱いについて、
            以下のプライバシーポリシー（以下「本ポリシー」）を定めます。
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">第1条（個人情報の定義）</h2>
            <p className="text-gray-600">
              「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、
              生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、
              連絡先その他の記述等により特定の個人を識別できる情報を指します。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">第2条（個人情報の収集方法）</h2>
            <p className="text-gray-600">
              当サービスは、ユーザーがアカウント登録をする際に、氏名、メールアドレス等の個人情報を収集することがあります。
              また、ユーザーが当サービスを利用する過程で、利用履歴、入力データ等の情報を収集します。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">第3条（個人情報を収集・利用する目的）</h2>
            <p className="text-gray-600 mb-4">当サービスが個人情報を収集・利用する目的は、以下のとおりです：</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>当サービスの提供・運営のため</li>
              <li>ユーザーからのお問い合わせに対応するため</li>
              <li>当サービスの機能向上や新サービス開発のため</li>
              <li>メンテナンス、重要なお知らせ等の連絡のため</li>
              <li>利用規約に違反する行為への対応のため</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">第4条（AI・機械学習によるデータ利用）</h2>
            <p className="text-gray-600">
              当サービスは、提供するAIエージェント機能の向上のため、ユーザーの入力データや利用パターンを
              機械学習・AIモデルの学習に利用することがあります。この際、個人を特定できる形での外部提供は行いません。
              ユーザーのプロンプトや生成結果は、サービス品質向上の目的で分析・保存される場合があります。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">第5条（個人情報の第三者提供）</h2>
            <p className="text-gray-600">
              当サービスは、以下の場合を除き、ユーザーの同意なく第三者に個人情報を提供しません：
            </p>
            <ul className="list-disc list-inside text-gray-600 mt-2 space-y-2">
              <li>法令に基づく場合</li>
              <li>人の生命、身体または財産の保護のために必要がある場合</li>
              <li>公衆衛生の向上または児童の健全な育成の推進のために必要がある場合</li>
              <li>国の機関等からの要請に応じる必要がある場合</li>
              <li>業務委託先に対し、必要な範囲で提供する場合（当該委託先には機密保持義務を課します）</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">第6条（個人情報の開示・訂正・削除）</h2>
            <p className="text-gray-600">
              ユーザーは、当サービスに対し、自身の個人情報の開示、訂正、削除、利用停止を請求することができます。
              請求を希望される場合は、下記のお問い合わせ窓口までご連絡ください。
              ただし、当サービスの提供に必要な情報の削除は、アカウントの停止につながる場合があります。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">第7条（セキュリティ対策）</h2>
            <p className="text-gray-600">
              当サービスは、個人情報の正確性及び安全性確保のため、セキュリティ対策を講じます。
              SSLによる通信暗号化、不正アクセス防止策、定期的なセキュリティ監査等を実施しています。
              ただし、インターネット通信の性質上、完全なセキュリティを保証するものではありません。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">第8条（Cookie等の利用）</h2>
            <p className="text-gray-600">
              当サービスは、ユーザーの利便性向上や利用状況分析のため、Cookie及び類似の技術を利用します。
              ユーザーはブラウザの設定によりCookieを無効化することができますが、
              その場合、当サービスの一部機能が利用できなくなることがあります。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">第9条（プライバシーポリシーの変更）</h2>
            <p className="text-gray-600">
              当サービスは、法令の変更やサービスの変更に伴い、本ポリシーを変更することがあります。
              変更後のポリシーは、当サービス上に表示した時点で効力を生じます。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">第10条（お問い合わせ窓口）</h2>
            <p className="text-gray-600">
              本ポリシーに関するお問い合わせは、下記までお願いいたします：<br /><br />
              Bronxville AI Workforce 運営事務局<br />
              メールアドレス: privacy@bronxville-ai.com
            </p>
          </section>

          <p className="text-gray-500 text-sm mt-12">
            制定日：2026年2月14日<br />
            最終更新日：2026年2月14日
          </p>
        </div>
      </div>
    </main>
  )
}
