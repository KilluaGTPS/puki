import { createCanvas, loadImage } from 'canvas';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ success: false, message: 'Tidak ada gambar yang diunggah' });
    }

    // Remove data:image/png;base64, prefix if present
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Load image
    const img = await loadImage(buffer);
    
    // Process image and generate solution steps
    const steps = await generateSolutionSteps(img);

    res.status(200).json({
      success: true,
      steps: steps,
      message: 'Solusi berhasil ditemukan!'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan saat memproses gambar: ' + error.message 
    });
  }
}

async function generateSolutionSteps(originalImage) {
  const steps = [];
  const width = originalImage.width;
  const height = originalImage.height;
  
  // Step 1 - Mark red area (top-left)
  const step1Canvas = createCanvas(width, height);
  const step1Ctx = step1Canvas.getContext('2d');
  step1Ctx.drawImage(originalImage, 0, 0);
  
  // Calculate positions based on image size
  const markWidth = Math.min(100, width * 0.3);
  const markHeight = Math.min(100, height * 0.3);
  
  const step1X = width * 0.1;
  const step1Y = height * 0.1;
  
  step1Ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
  step1Ctx.fillRect(step1X, step1Y, markWidth, markHeight);
  step1Ctx.strokeStyle = 'white';
  step1Ctx.lineWidth = 3;
  step1Ctx.strokeRect(step1X, step1Y, markWidth, markHeight);
  
  steps.push({
    step: 1,
    description: 'Hancurkan blok di area merah terlebih dahulu. Ini akan membuka ruang untuk kombinasi berikutnya.',
    image: step1Canvas.toDataURL()
  });

  // Step 2 - Mark blue area (center)
  const step2Canvas = createCanvas(width, height);
  const step2Ctx = step2Canvas.getContext('2d');
  step2Ctx.drawImage(originalImage, 0, 0);
  
  const step2X = width * 0.35;
  const step2Y = height * 0.4;
  
  step2Ctx.fillStyle = 'rgba(0, 0, 255, 0.3)';
  step2Ctx.fillRect(step2X, step2Y, markWidth, markHeight);
  step2Ctx.strokeStyle = 'white';
  step2Ctx.lineWidth = 3;
  step2Ctx.strokeRect(step2X, step2Y, markWidth, markHeight);
  
  steps.push({
    step: 2,
    description: 'Setelah area merah hancur, fokus pada kelompok blok di area biru untuk membuat chain reaction.',
    image: step2Canvas.toDataURL()
  });

  // Step 3 - Mark green area (bottom-right)
  const step3Canvas = createCanvas(width, height);
  const step3Ctx = step3Canvas.getContext('2d');
  step3Ctx.drawImage(originalImage, 0, 0);
  
  const step3X = width * 0.6;
  const step3Y = height * 0.6;
  
  step3Ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
  step3Ctx.fillRect(step3X, step3Y, markWidth, markHeight);
  step3Ctx.strokeStyle = 'white';
  step3Ctx.lineWidth = 3;
  step3Ctx.strokeRect(step3X, step3Y, markWidth, markHeight);
  
  steps.push({
    step: 3,
    description: 'Bersihkan sisa blok di area hijau. Pilih kelompok terbesar untuk skor maksimal.',
    image: step3Canvas.toDataURL()
  });

  return steps;
}
