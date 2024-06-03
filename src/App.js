import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import menu from './images/menu.png';
import machine from './images/gears-set.png';
import idle from './images/hourglass.png';
import on from './images/check.png';
import off from './images/power-settings.png';
import arrow from './images/down.png';
import logo from './images/logo.jpg';
import status from './images/status.png';
import analytics from './images/analytics.png';
import efficiency from './images/efficiency.png';
import calendar from './images/calendar.png';
import uparrow from './images/arrow.png';
export default function FetchCSVData(props) {
  const [csvData, setCsvData] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [chartData, setChartData] = useState([]);
  const [machineOffCount, setMachineOffCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetchCSVData();
  }, []);

  const handleMachineClick = (machine) => {
    setSelectedMachine(machine);
    setSelectedState('');
    setMachineOffCount(0);
    setIsDropdownOpen(false);
  };

  const handleStateClick = (state) => {
    setSelectedState(state);
    const filteredData = csvData.filter(row => row.State === state);
    setChartData(filteredData);

    if (selectedMachine && state === 'Machine OFF') {
      const offCount = filteredData.filter(row => row[selectedMachine] === 'OFF').length;
      setMachineOffCount(offCount);
    } else {
      setMachineOffCount(0);
    }
  };

  const preprocessData = (data) => {
    return data.map(row => {
      let color;
      switch (row.State) {
        case 'Machine ON (Under Load)':
          color = '#00FF00'; // Green
          break;
        case 'Machine OFF':
          color = '#FF0000'; // Red
          break;
        case 'Idle State (Machine ON)':
          color = '#ffff00'; // Yellow
          break;
        default:
          color = '#000000'; // Default color
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
      const { Time, Current, color } = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <div className="box">
            <span className="color-box" style={{ backgroundColor: color }} />
            <span>{`${selectedMachine}`}</span>
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
        <h2 className='menubar' onClick={() => setIsDropdownOpen(!isDropdownOpen)}><img src={menu} alt="Menu Icon" /> Current Signature </h2>
        {isDropdownOpen && (
          <ul>
            <li className="dropdown">
              <span className="dropbtn"><img src={machine} />Machines</span>
              <div className="dropdown-content">
                <a href="#" onClick={() => handleMachineClick('Machine 1')}>Machine 1</a>
                <a href="#" onClick={() => handleMachineClick('Machine 2')}>Machine 2</a>
                <a href="#" onClick={() => handleMachineClick('Machine 3')}>Machine 3</a>
                <a href="#" onClick={() => handleMachineClick('Machine 4')}>Machine 4</a>
                <a href="#" onClick={() => handleMachineClick('Machine 5')}>Machine 5</a>
              </div>
            </li>
          </ul>
        )}
        {selectedMachine && (
          <ul>
            <li className='idle' onClick={() => handleStateClick('Idle State (Machine ON)')}><img src={idle} />Idle State</li>
            <li className='idle' onClick={() => handleStateClick('Machine ON (Under Load)')}><img src={on} />Load State</li>
            <li className='idle' onClick={() => handleStateClick('Machine OFF')}><img src={off} />Machine OFF</li>
            <li className='idle'><img src={status} />Equipment Status</li>
            <li className='idle' onClick={() => handleStateClick('Downtime Analysis')}><img src={analytics} />Downtime Analysis</li>
            <li className='idle'><img src={efficiency} />Production Efficiency</li>
            <li className='idle'><img src={calendar} />Maintenance Schedule</li>
            <li className='idle' onClick={() => handleStateClick('Machine Status')}><img src={status} /> Machine Status</li>



          </ul>
        )}
      </div>
      <div className='graph'>
        {(selectedMachine === '' || selectedState === '') &&(
            <div className='page'>
                <div className='mainPage'>
                    <img src={logo}/>
                    <h1>CURRENT SIGNATURE ANALYSIS</h1>
                    
                </div>
                <p className='p'>To enable businesses to leverage the power of technology to drive innovation, efficiency, and growth.</p>
            </div>
        )}
        
        {selectedMachine && selectedState === 'Machine OFF' && (
                <div className='offcard'>
                <div className='card'>
                    <img src={arrow}/>{`${selectedMachine} was OFF for ${machineOffCount*5} seconds`}
                    
                </div>
                <div className="chart">
                <PieChart width={500} height={260}>
                  <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={[
                      { name: 'Machine On', value: chartData.filter(item => item[selectedMachine] === 'ON').length },
                      { name: 'Machine Off', value: chartData.filter(item => item[selectedMachine] === 'OFF').length },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    <Cell key={`cell-on`} fill="#7c76bb" />
                    <Cell key={`cell-off`} fill="#91dabd" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </div>
            
            )}
        {(selectedMachine === 'Machine 1') && (selectedState === 'Idle State (Machine ON)' || selectedState === 'Machine ON (Under Load)') && (
          
            <div className="chart">
              <LineChart width={500} height={300} data={chartData}>
                <XAxis dataKey="Time"/>
                <YAxis/>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="Current" stroke="#ffa500" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </LineChart>
              <BarChart width={500} height={300} data={chartData}>
                <XAxis dataKey="Time" />
                <YAxis />
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <Bar dataKey="Current" fill="#ffa500" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </BarChart>
            </div>
            
        )}
        {selectedState === 'Downtime Analysis' && (
            <div>
                <LineChart width={1100} height={300} data={csvData}>
                <XAxis dataKey="Time" />
                <YAxis />
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="Current" stroke="#ffa500" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </LineChart>
            </div>
        )}
        {selectedState === 'Machine Status' && (selectedMachine === 'Machine 1') && (
            <div>
                 <div className='card'>
                    <img src={uparrow}/>ON
                    
                </div>
            </div>
        )}
        {selectedState === 'Machine Status' && (selectedMachine === 'Machine 2' || selectedMachine === 'Machine 3' || selectedMachine === 'Machine 4'
            || selectedMachine === 'Machine 5'
        ) && (
            <div>
                 <div className='card'>
                    <img src={arrow}/>OFF
                    
                </div>
            </div>
        )}
         {
            (selectedState === 'Idle State (Machine ON)' || selectedState === 'Machine ON (Under Load)') && (selectedMachine === 'Machine 2' || selectedMachine === 'Machine 3' || selectedMachine === 'Machine 4'
            || selectedMachine === 'Machine 5') && (
                <div>
                    <div className='card'>
                    <img src={arrow}/>No data
                    
                </div>
                </div>
            )
        }

        </div>
        
    </div>
  );
}