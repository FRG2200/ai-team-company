export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl font-bold mb-8">利用規約</h1>
          <p className="text-gray-600 mb-8">
            この利用規約（以下「本規約」）は、Bronxville AI Workforce（以下「当サービス」）の利用条件を定めるものです。
            ユーザーは、本規約に同意の上、当サービスをご利用ください。
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">第1条（適用範囲）</h2>
            <p className="text-gray-600">
              本規約は、ユーザーと当サービス運営者（以下「運営者」）との間の当サービスの利用に関わる一切の関係に適用されます。
              運営者は、当サービスに関し、本規約のほか、個別規定を定める場合があります。個別規定は本規約の一部を構成します。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">第2条（アカウント登録）</h2>
            <p className="text-gray-600">
              ユーザーは、当サービスの利用にあたり、運営者の定める方法によりアカウントを登録するものとします。
              ユーザーは、登録事項に変更があった場合、速やかに運営者に通知するものとします。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">第3条（禁止事項）</h2>
            <p className="text-gray-600 mb-4">ユーザーは、当サービスの利用にあたり、以下の行為を禁止します：</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>運営者、他のユーザー、または第三者の知的財産権を侵害する行為</li>
              <li>当サービスのサーバーまたはネットワークの機能を破壊、妨害する行為</li>
              <li>AIエージェントを悪用した違法・有害なコンテンツの生成</li>
              <li>他のユーザーになりすます行為</li>
              <li>営業、宣伝、広告、勧誘等を目的とする行為（運営者が認めたものを除く）</li>
              <li>反社会的勢力に対する利益供与その他の協力行為</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">第4条（サービスの提供の停止等）</h2>
            <p className="text-gray-600">
              運営者は、以下の場合には、ユーザーの承諾なしに、当サービスの全部または一部の提供を停止または中断することができます：
            </p>
            <ul className="list-disc list-inside text-gray-600 mt-2 space-y-2">
              <li>当サービスに係るシステムの保守点検または更新を行う場合</li>
              <li>不可抗力により当サービスの提供が困難となった場合</li>
              <li>コンピューター、通信回線等が事故により停止した場合</li>
              <li>その他、運営者が当サービスの提供が困難と判断した場合</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">第5条（利用制限および登録抹消）</h2>
            <p className="text-gray-600">
              運営者は、ユーザーが本規約に違反した場合、事前の通知なく、当サービスの利用を制限し、
              またはアカウント登録を抹消することができます。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">第6条（免責事項）</h2>
            <p className="text-gray-600">
              運営者は、当サービスに事実上または法律上の瑕疵がないことを保証しません。
              AIエージェントが生成するコンテンツの正確性、完全性についても保証しません。
              運営者は、これらによってユーザーに生じた損害について、一切の責任を負いません。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">第7条（サービス内容の変更等）</h2>
            <p className="text-gray-600">
              運営者は、ユーザーに通知することなく、当サービスの内容を変更し、
              または提供を中止することができます。これによってユーザーに生じた損害について、一切の責任を負いません。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">第8条（利用規約の変更）</h2>
            <p className="text-gray-600">
              運営者は、必要と判断した場合には、ユーザーに通知することなく、本規約を変更することができます。
              変更後の利用規約は、当サービス上に表示された時点で効力を生じます。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">第9条（準拠法・裁判管轄）</h2>
            <p className="text-gray-600">
              本規約の解釈にあたっては、日本法を準拠法とします。
              当サービスに関して紛争が生じた場合、運営者の所在地を管轄する裁判所を専属的合意管轄とします。
            </p>
          </section>

          <p className="text-gray-500 text-sm mt-12">
            制定日：2026年2月14日<br />
            Bronxville AI Workforce 運営事務局
          </p>
        </div>
      </div>
    </main>
  )
}
