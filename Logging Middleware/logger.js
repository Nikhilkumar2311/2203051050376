const axios = require("axios");

const LOG_SERVER_URL = "http://20.244.56.144/evaluation-service/logs";


const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMjAzMDUxMDUwMzc2QHBhcnVsdW5pdmVyc2l0eS5hYy5pbiIsImV4cCI6MTc1MDY2NTQ5MywiaWF0IjoxNzUwNjY0NTkzLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiODMxOTY4NTgtZTAwMy00ZTFmLWFjYzctZDQwMjkzNGEzODlhIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoibmlraGlsIGt1bWFyIiwic3ViIjoiYjAyMGY1NzItZTU1NC00ZjJmLThkZDctZWY4YTFiZDJmNWY3In0sImVtYWlsIjoiMjIwMzA1MTA1MDM3NkBwYXJ1bHVuaXZlcnNpdHkuYWMuaW4iLCJuYW1lIjoibmlraGlsIGt1bWFyIiwicm9sbE5vIjoiMjIwMzA1MTA1MDM3NiIsImFjY2Vzc0NvZGUiOiJUUnpnV00iLCJjbGllbnRJRCI6ImIwMjBmNTcyLWU1NTQtNGYyZi04ZGQ3LWVmOGExYmQyZjVmNyIsImNsaWVudFNlY3JldCI6InJYSEVXTkdjeER5bVVuVlAifQ.nJXJtt30-Te3p0TkI7qysVfnMYJIGA9J8XcZ6VN0zzY";


const Log = async (stack, level, pkg, message) => {
  try {
    const logPayload = {
      stack: stack.toLowerCase(),
      level: level.toLowerCase(),
      package: pkg.toLowerCase(),
      message: message
    };

    await axios.post(LOG_SERVER_URL, logPayload, {
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`
      }
    });

    console.log("Log sent successfully");

  } catch (error) {
    console.error("Failed to send log to log server:", error.response?.status, error.response?.data);
  }
};

module.exports = Log;