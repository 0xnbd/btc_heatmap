async function fetchBTCData() {
  const response = await fetch('https://api.coindesk.com/v1/bpi/historical/close.json?start=2012-01-01&end=2023-12-31');
  const data = await response.json();
  return data.bpi;
}

function calculateMonthlyGains(data) {
  const monthlyGains = {};

  for (const date in data) {
    const [year, month] = date.split('-');
    if (!monthlyGains[year]) {
      monthlyGains[year] = {
        '01': null, '02': null, '03': null, '04': null,
        '05': null, '06': null, '07': null, '08': null,
        '09': null, '10': null, '11': null, '12': null
      };
    }

    if (monthlyGains[year][month]) {
      const prevPrice = monthlyGains[year][month].lastPrice;
      const currPrice = data[date];
      const gain = ((currPrice - prevPrice) / prevPrice) * 100;
      monthlyGains[year][month].gain = gain;
    } else {
      monthlyGains[year][month] = { lastPrice: data[date], gain: null };
    }
  }

  return monthlyGains;
}

function populateTable(monthlyGains) {
  const tbody = document.getElementById('heatmap').getElementsByTagName('tbody')[0];

  for (const year in monthlyGains) {
    const row = document.createElement('tr');
    
    const cellYear = document.createElement('td');
    cellYear.textContent = year;
    row.appendChild(cellYear);

    for (const month in monthlyGains[year]) {
      const cellGain = document.createElement('td');
      const gain = monthlyGains[year][month]?.gain;
      
      if (gain !== null) {
          cellGain.textContent = Number.parseFloat(gain).toFixed(2) + '%';
        cellGain.className = gain > 0 ? 'gain-positive' : 'gain-negative';
      } else {
        cellGain.textContent = '-';
      }
      
      row.appendChild(cellGain);
    }

    tbody.appendChild(row);
  }
}

async function createHeatmap() {
  const btcData = await fetchBTCData();
  const monthlyGains = calculateMonthlyGains(btcData);
  populateTable(monthlyGains);
}

document.addEventListener('DOMContentLoaded', createHeatmap);
