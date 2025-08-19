import { Server } from "socket.io";
import geoip from "geoip-lite";
import UAParser from "ua-parser-js";

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

      // IP
      let ip =
        socket.handshake.headers["x-forwarded-for"] ||
        socket.handshake.address;
      if (ip === "::1") ip = "127.0.0.1";

      // GeoIP
      const geo = geoip.lookup(ip);
      const country = geo?.country || "Unknown";
      const city = geo?.city || "Unknown";
      const lat = geo?.ll ? geo.ll[0] : "Unknown";
      const lon = geo?.ll ? geo.ll[1] : "Unknown";

      // Tarih ve saat
      const now = new Date();
      const tarih = now.toLocaleDateString("tr-TR");
      const saat = now.toLocaleTimeString("tr-TR");

      // Tarayıcı ve OS
      const parser = new UAParser(socket.handshake.headers["user-agent"]);
      const browser = parser.getBrowser().name + " " + parser.getBrowser().version;
      const os = parser.getOS().name + " " + parser.getOS().version;

      // Konsola log
      console.log(
        `✅ Yeni kullanıcı bağlandı | SocketID: ${socket.id} | IP: ${ip} | Tarih: ${tarih} | Saat: ${saat} | Ülke: ${country} | Şehir: ${city} | Koordinat: ${lat},${lon} | OS: ${os} | Tarayıcı: ${browser} | Aktif kullanıcı sayısı: ${activeUsers}`
      );

      // Aktif kullanıcı sayısını tüm clientlara gönder
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
