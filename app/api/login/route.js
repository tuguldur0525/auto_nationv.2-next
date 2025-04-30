export async function POST(req) {
    const body = await req.json();
    if (body.email === "admin@example.com" && body.password === "123456") {
      return Response.json({ success: true, token: "fake-jwt-token" });
    } else {
      return Response.json({ success: false, message: "Нэвтрэх мэдээлэл буруу байна" }, { status: 401 });
    }
  }