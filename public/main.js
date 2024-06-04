
document.addEventListener('DOMContentLoaded', function () {
    console.log('main.js is loaded');
  
    const RBtn = document.getElementById('Rbtn');
    const GBtn = document.getElementById('Gbtn');
    const YBtn = document.getElementById('Ybtn');
    const select = document.getElementById('select');
  
    RBtn.addEventListener('click', async () => {
      
      try {
        const response = await fetch("http://localhost:3000/api/mqtt", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: select.value + "R",
          }),
        });
      } catch (error) {
        console.error('Error:', error);
      }
    });
  
    GBtn.addEventListener('click', async () => {
      
      try {
        const response = await fetch("http://localhost:3000/api/mqtt", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: select.value + "G", // Corrected the message value
          }),
        });
      } catch (error) {
        console.error('Error:', error);
      }
    });
  
    YBtn.addEventListener('click', async () => {
      
      try {
        const response = await fetch("http://localhost:3000/api/mqtt", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: select.value + "Y", // Corrected the message value
          }),
        });
      } catch (error) {
        console.error('Error:', error);
      }
    });


  });
  
  const ws = new WebSocket('ws://localhost:3000');

  ws.onopen = () => {
      console.log('WebSocket connection opened');
  };

  ws.onmessage = (event) => {

      const D9Info = document.getElementById('D9-info');
      const C7Info = document.getElementById('C7-info');
      const D3Info = document.getElementById('D3-info');

      if (event.data.includes('D9')) {
          if(event.data.includes('100')){
            D9Info.innerHTML = "Đang tắc";
            D9Info.style.color = "red";
          }
          if(event.data.includes('010')){
            D9Info.innerHTML = "Không tắc";
            D9Info.style.color = "green";
          }
          if(event.data.includes('001')){
            D9Info.innerHTML = "Có thể tắc";
            D9Info.style.color = "#ddb71e";
          }
      } else if (event.data.includes('C7')) {
        if(event.data.includes('100')){
          C7Info.innerHTML = "Đang tắc";
          C7Info.style.color = "red";
        }
        if(event.data.includes('010')){
          C7Info.innerHTML = "Không tắc";
          C7Info.style.color = "green";
        }
        if(event.data.includes('001')){
          C7Info.innerHTML = "Có thể tắc";
          C7Info.style.color = "#ddb71e";
        }
      } else if (event.data.includes('D3')) {
        if(event.data.includes('100')){
          D3Info.innerHTML = "Đang tắc";
          D3Info.style.color = "red";
        }
        if(event.data.includes('010')){
          D3Info.innerHTML = "Không tắc";
          D3Info.style.color = "green";
        }
        if(event.data.includes('001')){
          D3Info.innerHTML = "Có thể tắc";
          D3Info.style.color = "#ddb71e";
        }
      }
    };

  ws.onclose = () => {
      console.log('WebSocket connection closed');
  };