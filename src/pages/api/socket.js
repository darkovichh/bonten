import { Server } from "socket.io";

let io;
let activeUsers = 0;

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("🔌 Socket.IO başlatılıyor...");

    io = new Server(res.socket.server, {
      path: "/api/socket_io",
      cors: {
        origin: "*",
      },
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      activeUsers++;

      // IP bilgisi
      let ip = socket.handshake.headers["x-forwarded-for"] || socket.handshake.address;
      if (ip === "::1") ip = "127.0.0.1";

      // Tarih ve saat
      const now = new Date();
      const tarih = now.toLocaleDateString("tr-TR");
      const saat = now.toLocaleTimeString("tr-TR");

      // Tarayıcı ve OS
      const userAgent = socket.handshake.headers["user-agent"];
      let os = "Unknown", browser = "Unknown";
      if (userAgent) {
        const parts = userAgent.split(" ");
        browser = parts[0];
        os = parts[parts.length - 1];
      }

      console.log(
        `✅ Yeni kullanıcı bağlandı | SocketID: ${socket.id} | IP: ${ip} | Tarih: ${tarih} | Saat: ${saat} | OS: ${os} | Tarayıcı: ${browser} | Aktif kullanıcı sayısı: ${activeUsers}`
      );

      io.emit("activeUsers", activeUsers);

      socket.on("disconnect", () => {
        activeUsers--;
        io.emit("activeUsers", activeUsers);
        console.log(
          `❌ Kullanıcı ayrıldı | SocketID: ${socket.id} | Aktif kullanıcı sayısı: ${activeUsers}`
        );
      });
    });
  }

  res.end();
}
