async function loadConfig() {
    const response = await fetch('/web.config', { cache: 'no-cache' });
    const text = await response.text();
  
    // ใช้ DOMParser เพื่ออ่าน XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    
    // อ่านค่าจาก <appSettings>
    function getSetting(key) {
      const setting = xmlDoc.querySelector(`add[key="${key}"]`);
      return setting ? setting.getAttribute("value") : null;
    }
  
    // ตั้งค่าตัวแปร environment
    window.env = {
      API_BASE_URL: getSetting("API_BASE_URL"),
      OTP_TIMEOUT: parseInt(getSetting("OTP_TIMEOUT"), 10),
      APP_NAME: getSetting("APP_NAME"),
    };
  
    console.log("Loaded config:", window.env);
  }
  
  // โหลด config เมื่อหน้าเว็บเริ่มทำงาน
  loadConfig();

  
  