import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import menu from './images/menu.png';
import machine from './images/gears-set.png';
import idle from './images/hourglass.png';
import on from './images/check.png';
import off from './images/power-settings.png';

export default function FetchCSVData(props) {
  const [csvData, setCsvData] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState('');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchCSVData();
  }, []);

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    if (menu) {
        console.log(menu);
        
      const filteredData = csvData.filter(row => row.State === menu);
      setChartData(filteredData);
      console.log(chartData);
    }
  };

  const preprocessData = (data) => {
    return data.map(row => {
      let color;
      switch (row.STATUS) {
        case 'Machine ON (Under Load)':
          color = '#00FF00'; // Green
          break;
        case 'Machine OFF':
          color = '#FF0000'; // Red
          break;
        case 'Idle State (Machine ON)':
          color = '#FFFF00'; // Yellow
          break;
        default:
          color = '#8884d8'; // Default color
      }
      return { ...row, color };
    });
  }

  const fetchCSVData = () => {
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRMNz4UWSqqVJWkYJTTds7Qos5xS2dAfZpkqUFB-KOlkNMNoZBNXK__pYEvb4egPG5eNWXQOUxB0Wtj/pub?output=csv';
    
    axios.get(csvUrl)
      .then((response) => {
        const parsedCsvData = preprocessData(parseCSV(response.data));
        setCsvData(parsedCsvData);
        console.log(csvData);
      })
      .catch((error) => {
        console.error('Error fetching CSV data:', error);
      });
  }

  function parseCSV(csvText) {
    const rows = csvText.split(/\r?\n/);
    const headers = rows[0].split(',');
    const data = [];
    for (let i = 1; i < rows.length; i++) {
      const rowData = rows[i].split(',');
      const rowObject = {};
      for (let j = 0; j < headers.length; j++) {
        rowObject[headers[j]] = rowData[j];
      }
      data.push(rowObject);
    }
    return data;
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { Time, Current, State, color } = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <div className="box">
            <span className="color-box" style={{ backgroundColor: color }} />
            <span>{`${State}`}</span>
          </div>
          <p className="label">{`Time: ${Time}`}</p>
          <p className="label">{`Current: ${Current}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className='main'>
      <div className="sidebar">
        <h2 className='menubar'><img src={menu} alt="Menu Icon" /> Menu</h2>
        <ul>
          <li className="dropdown">
            <span className="dropbtn"><img src={machine} />Machines</span>
            <div className="dropdown-content">
              <a href="#">Machine 1</a>
              <a href="#">Machine 2</a>
              <a href="#">Machine 3</a>
              <a href="#">Machine 4</a>
              <a href="#">Machine 5</a>
            </div>
          </li>
          <li className='idle' onClick={() => handleMenuClick('Idle State (Machine ON)')}><img src={idle} />Idle State</li>
          <li className='idle' onClick={() => handleMenuClick('Machine ON (Under Load)')}><img src={on} />Load State</li>
          <li className='idle' onClick={() => handleMenuClick('Machine OFF')}><img src={off} />Machine OFF</li>
        </ul>
      </div>
      <div className='graph'>
        {selectedMenu && (
          <div className="chart">
            <LineChart width={500} height={300} data={chartData}>
              <XAxis dataKey="Time" />
              <YAxis />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="Current" stroke="#8884d8" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </LineChart>
            <BarChart width={500} height={300} data={chartData}>
              <XAxis dataKey="Time" />
              <YAxis />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Bar dataKey="Current" fill="#8884d8" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </BarChart>
          </div>
        )}
      </div>
    </div>
  );
}
