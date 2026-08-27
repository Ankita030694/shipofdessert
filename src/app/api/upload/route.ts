import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No image file provided.' },
        { status: 400 }
      );
    }

    // Validate file type
    const validMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'image/gif',
      'image/svg+xml',
    ];
    if (!validMimeTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid file format. Please upload JPEG, PNG, WEBP, AVIF, or SVG.',
        },
        { status: 400 }
      );
    }

    // Limit size to 10MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'File is too large. Max size allowed is 10MB.' },
        { status: 400 }
      );
    }

    // Ensure public/uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Determine extension
    let extension = 'jpg';
    if (file.name.includes('.')) {
      extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    } else if (file.type === 'image/png') {
      extension = 'png';
    } else if (file.type === 'image/webp') {
      extension = 'webp';
    }

    // Generate unique sanitized filename
    const safeName = file.name
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 30);
    const uniqueFilename = `${safeName || 'garment'}_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 6)}.${extension}`;

    const filePath = path.join(uploadsDir, uniqueFilename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully.',
      url: publicUrl,
    });
  } catch (error: unknown) {
    console.error('API /api/upload error:', error);
    const message = error instanceof Error ? error.message : 'Failed to upload image';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
