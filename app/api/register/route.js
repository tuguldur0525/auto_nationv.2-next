// app/api/register/route.js
export async function POST(req) {
    const body = await req.json();
    // Энд өгөгдлийг шалгах логик нэмэж болно
    return Response.json({ success: true, message: "Бүртгэл амжилттай" });
  }