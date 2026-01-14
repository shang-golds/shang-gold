export default function DashboardPage() {
  return (
    <html>
      <head>
        <title>Investor Dashboard</title>
        <style>{`
          body {
            font-family: Arial, sans-serif;
            background: #f5f5f5;
            padding: 20px;
          }
          .card {
            background: white;
            padding: 20px;
            max-width: 500px;
            margin: auto;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          h1 {
            text-align: center;
          }
          .row {
            margin: 10px 0;
            font-size: 18px;
          }
          .label {
            font-weight: bold;
          }
          .error {
            color: red;
            text-align: center;
          }
        `}</style>
      </head>

      <body>
        <div className="card">
          <h1>Dashboard</h1>
          <div id="content">Loading...</div>
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
            fetch('/api/dashboard')
              .then(res => {
                if (!res.ok) throw new Error('Unauthorized');
                return res.json();
              })
              .then(data => {
                const investor = data.investor;
                const balance = data.balance;

                document.getElementById('content').innerHTML = \`
                  <div class="row"><span class="label">Name:</span> \${investor.full_name}</div>
                  <div class="row"><span class="label">Investor Number:</span> \${investor.investor_number}</div>
                  <hr />
                  <div class="row"><span class="label">Investment (grams):</span> \${balance.investment_grams}</div>
                  <div class="row"><span class="label">Profit (grams):</span> \${balance.profit_grams}</div>
                  <div class="row"><span class="label">Total Balance (grams):</span> \${balance.total_grams}</div>
                \`;
              })
              .catch(() => {
                document.getElementById('content').innerHTML =
                  '<div class="error">Please login first</div>';
              });
          `,
          }}
        />
      </body>
    </html>
  );
}
