import { NextResponse } from 'next/server';

export async function GET(request) {
  const token = request.cookies.get('admin_token');
  
  if (!token) {
    return NextResponse.json({
      success: false,
      authenticated: false
    });
  }
  
  return NextResponse.json({
    success: true,
    authenticated: true
  });
}
